/**
 * Recruiter marketplace matching engine.
 *
 * Matching approach: PostgreSQL full-text search (tsvector `search_vector` on
 * candidate_profiles) + structured scoring in JS. pgvector is NOT installed in
 * this Supabase DB (only uuid-ossp, pgcrypto, pg_trgm), so there are no
 * embeddings — FTS + structured signals (skills overlap, title similarity,
 * experience-range fit, location) is the honest floor, and it is fully
 * deterministic and auditable.
 *
 * All functions in this file are pure and unit-tested (see
 * __tests__/recruiter-match.test.ts). DB access happens in the route handlers.
 */
import { generateContentWithRetry } from '@/lib/ai-retry';

export interface ExtractedJD {
  title: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  minYears: number | null;
  maxYears: number | null;
  location: string | null;
  /** false when Gemini was unavailable and the keyword fallback was used */
  ai: boolean;
}

export interface MatchPoolRow {
  id: string;
  current_title: string | null;
  summary: string | null;
  city: string | null;
  country: string | null;
  experience_years: number | null;
  skills: string[] | null;
  completeness_score: number | null;
}

export interface AnonymizedProfile {
  headline: string;
  currentTitle: string | null;
  yearsExperience: number | null;
  topSkills: string[];
  location: string | null;
  country: string | null;
  completenessScore: number;
}

export interface ScoredMatch {
  profileId: string;
  tier: MatchTier;
  score: number;
  reasons: string[];
  profile: AnonymizedProfile;
  matchedSkills: string[];
  missingSkills: string[];
}

/** Result tiers, exported as a named type for filters. */
export type MatchTier = 'excellent' | 'strong' | 'moderate';

/**
 * Eligibility guard for the match pool. The consent filter is a first-class
 * export so tests can pin it: a candidate MUST have opted in
 * (consent_recruiter_share=true) and not be soft-deleted to appear.
 * The SQL RPC match_candidate_ranks() enforces the same filter server-side.
 */
export const MATCH_ELIGIBILITY = {
  consent_recruiter_share: true,
  deleted_at: null,
} as const;

/** Minimum score (0-100) to be returned at all. */
export const MATCH_MIN_SCORE = 35;

export function tierFor(score: number): MatchTier | null {
  if (score >= 75) return 'excellent';
  if (score >= 55) return 'strong';
  if (score >= MATCH_MIN_SCORE) return 'moderate';
  return null;
}

// ---------------------------------------------------------------------------
// JD extraction
// ---------------------------------------------------------------------------

const JD_SYSTEM =
  'You are a recruiting analyst. Extract structured requirements from a job description. ' +
  'Return ONLY valid JSON with this exact shape: ' +
  '{"title": string, "mustHaveSkills": string[], "niceToHaveSkills": string[], ' +
  '"minYears": number|null, "maxYears": number|null, "location": string|null}. ' +
  'Skills are short canonical names (e.g. "React", "PostgreSQL"). ' +
  'location is the city/country or "Remote". Use null when unknown.';

function normalizeExtracted(raw: any, ai: boolean): ExtractedJD {
  const strArr = (v: any): string[] =>
    Array.isArray(v)
      ? [...new Set(v.map((s: any) => String(s ?? '').trim()).filter(Boolean))].slice(0, 40)
      : [];
  const numOrNull = (v: any): number | null => {
    const n = typeof v === 'number' ? v : parseInt(String(v ?? ''), 10);
    return Number.isFinite(n) && n >= 0 && n <= 60 ? n : null;
  };
  return {
    title: String(raw?.title ?? '').trim().slice(0, 120) || 'Role',
    mustHaveSkills: strArr(raw?.mustHaveSkills),
    niceToHaveSkills: strArr(raw?.niceToHaveSkills),
    minYears: numOrNull(raw?.minYears),
    maxYears: numOrNull(raw?.maxYears),
    location: String(raw?.location ?? '').trim().slice(0, 120) || null,
    ai,
  };
}

/** Keyword fallback when Gemini is unavailable. Never throws. */
export function extractJDKeywords(jobDescription: string, jobTitle?: string): ExtractedJD {
  const jd = jobDescription || '';
  const firstLine = (jd.split('\n').map((l) => l.trim()).find(Boolean) || '').slice(0, 120);

  // Skills: scan against a dictionary of common professional/tech skills.
  const found = new Set<string>();
  for (const skill of SKILL_DICTIONARY) {
    const re = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(jd)) found.add(skill);
  }

  // Experience range.
  let minYears: number | null = null;
  let maxYears: number | null = null;
  let m = jd.match(/(\d{1,2})\s*[-–]\s*(\d{1,2})\s*(?:years?|yrs?)/i);
  if (m) {
    minYears = parseInt(m[1], 10);
    maxYears = parseInt(m[2], 10);
  } else {
    m = jd.match(/(\d{1,2})\+\s*(?:years?|yrs?)/i);
    if (m) minYears = parseInt(m[1], 10);
    m = jd.match(/(?:minimum|min|at least)\s*(\d{1,2})\s*(?:years?|yrs?)/i);
    if (m) minYears = parseInt(m[1], 10);
    m = jd.match(/(?:up to|max(?:imum)?)\s*(\d{1,2})\s*(?:years?|yrs?)/i);
    if (m) maxYears = parseInt(m[1], 10);
  }

  // Location: explicit markers, known cities, or remote.
  let location: string | null = null;
  m = jd.match(/(?:location|based in|office in)\s*[:\-]?\s*([A-Za-z][A-Za-z\s.'-]{1,40})/i);
  if (m) location = m[1].trim();
  if (!location) {
    for (const city of KNOWN_CITIES) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(jd)) {
        location = city;
        break;
      }
    }
  }
  if (!location && /\bremote\b/i.test(jd)) location = 'Remote';

  const skills = [...found].slice(0, 40);
  return {
    title: (jobTitle || '').trim() || firstLine || 'Role',
    mustHaveSkills: skills.slice(0, 15),
    niceToHaveSkills: skills.slice(15),
    minYears,
    maxYears,
    location,
    ai: false,
  };
}

/**
 * Extract requirements from a JD: Gemini first, keyword fallback on failure.
 * The returned `ai` flag tells the caller which path was used.
 */
export async function extractJD(jobDescription: string, jobTitle?: string): Promise<ExtractedJD> {
  const prompt =
    `JOB TITLE (if provided): ${jobTitle || '(not provided)'}\n\n` +
    `JOB DESCRIPTION:\n${jobDescription.slice(0, 8000)}`;
  try {
    const raw = await generateContentWithRetry<unknown>(prompt, JD_SYSTEM, 1200, true, [], 'recruiter_match');
    if (raw && typeof raw === 'object') {
      const out = normalizeExtracted(raw, true);
      if (out.title !== 'Role' || out.mustHaveSkills.length > 0) return out;
    }
  } catch {
    // fall through to keyword fallback
  }
  return extractJDKeywords(jobDescription, jobTitle);
}

/** Plain-text FTS input for the match_candidate_ranks RPC (websearch_to_tsquery parses it). */
export function buildFtsQuery(jd: ExtractedJD): string {
  return [jd.title, ...jd.mustHaveSkills, ...jd.niceToHaveSkills].filter(Boolean).join(' ').slice(0, 2000);
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

const STOPWORDS = new Set([
  'senior', 'sr', 'junior', 'jr', 'lead', 'principal', 'staff', 'associate',
  'the', 'a', 'an', 'and', 'of', 'for', 'to', 'in', 'with', 'engineer',
  'developer', 'specialist', 'manager', 'executive', 'officer', 'analyst',
]);

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .split(/[^a-z0-9+#.]+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function titleSimilarity(jdTitle: string, currentTitle: string | null): number {
  if (!jdTitle || !currentTitle) return 0;
  const a = new Set(tokens(jdTitle));
  const b = new Set(tokens(currentTitle));
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  return inter / Math.max(a.size, b.size);
}

function skillOverlap(required: string[], profileSkills: string[]): { matched: string[]; ratio: number } {
  const norm = profileSkills.map((s) => s.toLowerCase().trim());
  const matched = required.filter((r) => norm.some((p) => p === r.toLowerCase().trim() || p.includes(r.toLowerCase().trim()) || r.toLowerCase().trim().includes(p)));
  return { matched, ratio: required.length > 0 ? matched.length / required.length : 0 };
}

function experienceScore(expYears: number | null, jd: ExtractedJD): number | null {
  if (expYears == null || (jd.minYears == null && jd.maxYears == null)) return null;
  const { minYears, maxYears } = jd;
  if (minYears != null && maxYears != null) {
    if (expYears >= minYears && expYears <= maxYears) return 1;
    if (expYears < minYears) return minYears - expYears <= 2 ? 0.5 : 0.2;
    return expYears - maxYears <= 3 ? 0.6 : 0.3;
  }
  if (minYears != null) {
    if (expYears >= minYears) return 1;
    return minYears - expYears <= 2 ? 0.5 : 0.2;
  }
  // maxYears only
  if (expYears <= (maxYears as number)) return 1;
  return expYears - (maxYears as number) <= 3 ? 0.6 : 0.3;
}

function locationScore(p: MatchPoolRow, jd: ExtractedJD): number | null {
  if (!jd.location) return null;
  const loc = jd.location.toLowerCase();
  if (/\b(remote|anywhere|worldwide|global)\b/.test(loc)) return 1;
  const hay = `${p.city || ''} ${p.country || ''}`.toLowerCase();
  if (!hay.trim()) return null;
  return hay.includes(loc) || loc.split(/[\s,]+/).some((w) => w.length > 2 && hay.includes(w)) ? 1 : 0;
}

/** Weights sum to 100; skipped signals (null) are excluded from the denominator. */
const WEIGHTS = { must: 45, nice: 10, fts: 15, title: 10, exp: 10, location: 10 } as const;

export function scoreCandidate(
  p: MatchPoolRow,
  jd: ExtractedJD,
  ftsRatio: number | null
): { score: number; reasons: string[]; matchedSkills: string[] } {
  const reasons: string[] = [];
  const profileSkills = p.skills || [];
  let achieved = 0;
  let possible = 0;
  const allMatched: string[] = [];

  // Must-have skills (2x weight vs nice-to-have).
  if (jd.mustHaveSkills.length > 0) {
    const { matched, ratio } = skillOverlap(jd.mustHaveSkills, profileSkills);
    achieved += ratio * WEIGHTS.must;
    possible += WEIGHTS.must;
    allMatched.push(...matched);
    if (matched.length > 0) reasons.push(`${matched.length}/${jd.mustHaveSkills.length} required skills`);
  }
  if (jd.niceToHaveSkills.length > 0) {
    const { matched, ratio } = skillOverlap(jd.niceToHaveSkills, profileSkills);
    achieved += ratio * WEIGHTS.nice;
    possible += WEIGHTS.nice;
    allMatched.push(...matched.filter((s) => !allMatched.includes(s)));
    if (matched.length > 0) reasons.push(`${matched.length}/${jd.niceToHaveSkills.length} nice-to-have skills`);
  }

  // FTS rank.
  if (ftsRatio != null) {
    achieved += ftsRatio * WEIGHTS.fts;
    possible += WEIGHTS.fts;
    if (ftsRatio >= 0.6) reasons.push('Strong keyword match');
    else if (ftsRatio > 0) reasons.push('Keyword match');
  }

  // Title similarity.
  const tsim = titleSimilarity(jd.title, p.current_title);
  if (jd.title && p.current_title) {
    achieved += tsim * WEIGHTS.title;
    possible += WEIGHTS.title;
    if (tsim >= 0.5) reasons.push(`Title match: ${p.current_title}`);
  }

  // Experience-range fit.
  const exp = experienceScore(p.experience_years, jd);
  if (exp != null) {
    achieved += exp * WEIGHTS.exp;
    possible += WEIGHTS.exp;
    const range =
      jd.minYears != null && jd.maxYears != null
        ? `${jd.minYears}–${jd.maxYears}`
        : jd.minYears != null
          ? `${jd.minYears}+`
          : `up to ${jd.maxYears}`;
    reasons.push(`${p.experience_years} yrs experience (required ${range})`);
  }

  // Location bonus.
  const loc = locationScore(p, jd);
  if (loc != null) {
    achieved += loc * WEIGHTS.location;
    possible += WEIGHTS.location;
    if (loc === 1) reasons.push(`${p.city || p.country || jd.location} location match`);
  }

  const score = possible > 0 ? Math.round((achieved / possible) * 100) : 0;
  return { score, reasons, matchedSkills: [...new Set(allMatched)] };
}

// ---------------------------------------------------------------------------
// Anonymization — NEVER name, email, phone, or photo.
// ---------------------------------------------------------------------------

export function anonymizeProfile(p: MatchPoolRow, matchedSkills: string[]): AnonymizedProfile {
  const profileSkills = p.skills || [];
  const topSkills = [
    ...matchedSkills,
    ...profileSkills.filter((s) => !matchedSkills.some((m) => m.toLowerCase() === s.toLowerCase())),
  ].slice(0, 8);
  const headline =
    (p.summary || '').trim().length > 0
      ? (p.summary as string).trim().slice(0, 140)
      : (p.current_title || 'Candidate');
  return {
    headline,
    currentTitle: p.current_title,
    yearsExperience: p.experience_years,
    topSkills,
    location: p.city,
    country: p.country,
    completenessScore: p.completeness_score ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Advanced search filters — pure, unit-tested. The route merges filters into
// the extracted JD (so they influence FTS + scoring + reasons), then runs
// runMatchPipeline over the consented pool. Consent/soft-delete eligibility
// (MATCH_ELIGIBILITY) is enforced by the route and is never weakened here.
// ---------------------------------------------------------------------------

/** Sanitized server-side search filters (see MatchFilters on the client). */
export interface MatchFilters {
  /** Hard minimum experience filter; null = no filter. */
  minYears: number | null;
  /** Recruiter-supplied must-have skills, merged into the JD before FTS/scoring. */
  mustHaveSkills: string[];
  /** Tier allow-list; empty = all tiers. */
  tiers: MatchTier[];
  sort: 'score' | 'experience';
}

const MAX_FILTER_SKILLS = 40;

/** Sanitize raw client filter input. Never throws. */
export function normalizeMatchFilters(raw: any): MatchFilters {
  const b = raw && typeof raw === 'object' ? raw : {};

  // minYears: finite number >= 0, otherwise no filter.
  let minYears: number | null = null;
  const n = typeof b.minYears === 'number' ? b.minYears : Number(b.minYears);
  if (Number.isFinite(n) && n >= 0) minYears = n;

  // mustHaveSkills: trim, dedupe case-insensitively, cap at 40.
  const seen = new Set<string>();
  const mustHaveSkills: string[] = [];
  if (Array.isArray(b.mustHaveSkills)) {
    for (const s of b.mustHaveSkills) {
      const t = String(s ?? '').trim();
      if (!t) continue;
      const k = t.toLowerCase();
      if (seen.has(k)) continue;
      seen.add(k);
      mustHaveSkills.push(t);
      if (mustHaveSkills.length >= MAX_FILTER_SKILLS) break;
    }
  }

  // tiers: allow-list of valid tiers, deduped.
  const tiers: MatchTier[] = [];
  if (Array.isArray(b.tiers)) {
    for (const t of b.tiers) {
      if ((t === 'excellent' || t === 'strong' || t === 'moderate') && !tiers.includes(t)) {
        tiers.push(t);
      }
    }
  }

  const sort: 'score' | 'experience' = b.sort === 'experience' ? 'experience' : 'score';
  return { minYears, mustHaveSkills, tiers, sort };
}

/**
 * Merge recruiter-supplied must-have skills into the extracted JD so they
 * influence FTS (buildFtsQuery), scoring, and reasons. Dedupes
 * case-insensitively against the extracted skills and caps at 40.
 * Returns the input JD unchanged when the filters add nothing.
 */
export function mergeMustHaveSkills(jd: ExtractedJD, filters: MatchFilters): ExtractedJD {
  if (filters.mustHaveSkills.length === 0) return jd;
  const seen = new Set(jd.mustHaveSkills.map((s) => s.toLowerCase()));
  const merged = [...jd.mustHaveSkills];
  for (const s of filters.mustHaveSkills) {
    if (!seen.has(s.toLowerCase())) {
      seen.add(s.toLowerCase());
      merged.push(s);
    }
  }
  return { ...jd, mustHaveSkills: merged.slice(0, MAX_FILTER_SKILLS) };
}

/**
 * Hard experience filter: exclude pool rows with known experience below
 * minYears. Candidates with unknown experience (null) stay in the pool.
 */
export function filterPoolByMinYears(pool: MatchPoolRow[], minYears: number | null): MatchPoolRow[] {
  if (minYears == null) return pool;
  return pool.filter((p) => p.experience_years == null || p.experience_years >= minYears);
}

/** Merged must-have skills not present in matchedSkills (case-insensitive). */
export function computeMissingSkills(mustHaveSkills: string[], matchedSkills: string[]): string[] {
  const lower = matchedSkills.map((m) => m.toLowerCase().trim());
  return mustHaveSkills.filter((s) => !lower.includes(s.toLowerCase().trim()));
}

export interface MatchPipelineResult {
  matches: ScoredMatch[];
  counts: { total: number; excellent: number; strong: number; moderate: number };
}

/**
 * Full match pipeline: min-years pool filter → score → MATCH_MIN_SCORE
 * exclusion → tier allow-list → sort → counts. Counts reflect the FILTERED
 * set; pagination is the caller's job (slice after this returns).
 *
 * `jd` must already have filters merged in (mergeMustHaveSkills).
 * `ftsRatioFor` maps a profile id to its normalized FTS rank (or null).
 */
export function runMatchPipeline(
  pool: MatchPoolRow[],
  jd: ExtractedJD,
  filters: MatchFilters,
  ftsRatioFor: (profileId: string) => number | null
): MatchPipelineResult {
  const scored: ScoredMatch[] = [];
  for (const p of filterPoolByMinYears(pool, filters.minYears)) {
    const { score, reasons, matchedSkills } = scoreCandidate(p, jd, ftsRatioFor(p.id));
    const tier = tierFor(score);
    if (!tier) continue; // below MATCH_MIN_SCORE — excluded
    scored.push({
      profileId: p.id,
      tier,
      score,
      reasons,
      profile: anonymizeProfile(p, matchedSkills),
      matchedSkills,
      missingSkills: computeMissingSkills(jd.mustHaveSkills, matchedSkills),
    });
  }

  const tiered =
    filters.tiers.length > 0 ? scored.filter((m) => filters.tiers.includes(m.tier)) : scored;

  if (filters.sort === 'experience') {
    tiered.sort((a, b) => {
      const ea = a.profile.yearsExperience;
      const eb = b.profile.yearsExperience;
      if (ea == null && eb == null) return b.score - a.score;
      if (ea == null) return 1; // nulls last
      if (eb == null) return -1;
      if (eb !== ea) return eb - ea; // years desc
      return b.score - a.score; // tie-break: score desc
    });
  } else {
    tiered.sort((a, b) => b.score - a.score);
  }

  const counts = {
    total: tiered.length,
    excellent: tiered.filter((m) => m.tier === 'excellent').length,
    strong: tiered.filter((m) => m.tier === 'strong').length,
    moderate: tiered.filter((m) => m.tier === 'moderate').length,
  };
  return { matches: tiered, counts };
}

// ---------------------------------------------------------------------------
// Dictionaries for the keyword fallback (no AI call).
// ---------------------------------------------------------------------------

const SKILL_DICTIONARY: string[] = [
  // Engineering / tech
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin',
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI',
  'Spring', 'Laravel', '.NET', 'GraphQL', 'REST', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase',
  'Firebase', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Git', 'Linux',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision', 'LLM',
  'Data Analysis', 'SQL', 'Excel', 'Power BI', 'Tableau', 'Pandas', 'NumPy', 'ETL', 'Airflow',
  'Cybersecurity', 'Penetration Testing', 'Network Security', 'DevOps', 'SRE', 'Microservices',
  'Figma', 'UI/UX', 'Product Design', 'Flutter', 'React Native', 'iOS', 'Android', 'SwiftUI',
  // Business / professional
  'Project Management', 'Agile', 'Scrum', 'Product Management', 'Business Analysis', 'Stakeholder Management',
  'Digital Marketing', 'SEO', 'Content Marketing', 'Social Media', 'Email Marketing', 'Google Ads',
  'Sales', 'Lead Generation', 'CRM', 'Negotiation', 'Customer Success', 'Account Management',
  'Financial Modeling', 'Accounting', 'Bookkeeping', 'Auditing', 'Excel Modeling', 'Budgeting',
  'HR', 'Recruiting', 'Talent Acquisition', 'Payroll', 'Training', 'Copywriting', 'Technical Writing',
  'Video Editing', 'Photography', 'Graphic Design', 'Illustration', 'Motion Design',
  'Customer Support', 'Operations', 'Supply Chain', 'Logistics', 'Procurement', 'Quality Assurance',
  'Teaching', 'Research', 'Legal Research', 'Paralegal',
];

const KNOWN_CITIES: string[] = [
  'Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan', 'Benin City', 'Enugu', 'Kaduna',
  'Accra', 'Nairobi', 'Johannesburg', 'Cape Town', 'London', 'New York', 'San Francisco',
  'Toronto', 'Dubai', 'Singapore', 'Berlin', 'Amsterdam', 'Remote',
];
