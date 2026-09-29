import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MATCH_ELIGIBILITY,
  MATCH_MIN_SCORE,
  anonymizeProfile,
  buildFtsQuery,
  computeMissingSkills,
  extractJDKeywords,
  filterPoolByMinYears,
  mergeMustHaveSkills,
  normalizeMatchFilters,
  runMatchPipeline,
  scoreCandidate,
  tierFor,
  type ExtractedJD,
  type MatchFilters,
  type MatchPoolRow,
} from '../lib/recruiter-match';

const jd = (): ExtractedJD => ({
  title: 'Senior Backend Engineer',
  mustHaveSkills: ['Node.js', 'PostgreSQL', 'TypeScript'],
  niceToHaveSkills: ['Docker', 'AWS'],
  minYears: 3,
  maxYears: 6,
  location: 'Lagos',
  ai: false,
});

const profile = (over: Partial<MatchPoolRow> = {}): MatchPoolRow => ({
  id: 'p1',
  current_title: 'Senior Backend Engineer',
  summary: 'Backend engineer with 5 years building APIs.',
  city: 'Lagos',
  country: 'Nigeria',
  experience_years: 5,
  skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis'],
  completeness_score: 80,
  ...over,
});

// --- Consent guarantee: the match pool is opt-in only. This test pins the
// eligibility contract used by the /match route AND the match_candidate_ranks
// RPC. If consent_recruiter_share is ever flipped off (the one-tap opt-out in
// /api/user/consent), the profile immediately leaves the pool — no code path
// queries candidates without this filter.
test('match eligibility requires opt-in consent and no soft-delete', () => {
  assert.equal(MATCH_ELIGIBILITY.consent_recruiter_share, true);
  assert.equal(MATCH_ELIGIBILITY.deleted_at, null);
});

test('keyword fallback extracts skills, years range and location', () => {
  const jdText = `Senior Backend Engineer — Lagos
We need 3-5 years of experience with Node.js, PostgreSQL and Docker.
Nice to have: AWS. Location: Lagos (on-site).`;
  const out = extractJDKeywords(jdText, 'Senior Backend Engineer');
  assert.equal(out.ai, false);
  assert.equal(out.title, 'Senior Backend Engineer');
  assert.ok(out.mustHaveSkills.includes('Node.js'));
  assert.ok(out.mustHaveSkills.includes('PostgreSQL'));
  assert.equal(out.minYears, 3);
  assert.equal(out.maxYears, 5);
  assert.equal(out.location, 'Lagos');
});

test('keyword fallback handles "5+ years" and Remote', () => {
  const out = extractJDKeywords('Looking for a designer with 5+ years experience. Fully remote role.', 'Designer');
  assert.equal(out.minYears, 5);
  assert.equal(out.location, 'Remote');
});

test('keyword fallback never throws on garbage input', () => {
  const out = extractJDKeywords('', '');
  assert.equal(out.ai, false);
  assert.ok(Array.isArray(out.mustHaveSkills));
});

test('strong candidate scores excellent with skill/experience/location reasons', () => {
  const { score, reasons } = scoreCandidate(profile(), jd(), 0.9);
  const tier = tierFor(score);
  assert.equal(tier, 'excellent');
  assert.ok(reasons.some((r) => r === '3/3 required skills'), JSON.stringify(reasons));
  assert.ok(reasons.some((r) => r.includes('5 yrs experience (required 3–6)')), JSON.stringify(reasons));
  assert.ok(reasons.some((r) => r.includes('location match')), JSON.stringify(reasons));
});

test('weak candidate is excluded below the minimum score', () => {
  const weak = profile({
    current_title: 'Barista',
    skills: ['Espresso', 'Latte Art'],
    experience_years: 1,
    city: 'Kano',
  });
  const { score } = scoreCandidate(weak, jd(), 0.1);
  assert.ok(score < MATCH_MIN_SCORE, `expected < ${MATCH_MIN_SCORE}, got ${score}`);
  assert.equal(tierFor(score), null);
});

test('partial candidate lands in moderate/strong, never invents reasons', () => {
  const partial = profile({ skills: ['Node.js'], experience_years: 2, city: 'Abuja' });
  const { score, reasons } = scoreCandidate(partial, jd(), 0.4);
  const tier = tierFor(score);
  assert.ok(tier === 'moderate' || tier === 'strong', `score ${score}`);
  assert.ok(reasons.some((r) => r === '1/3 required skills'));
});

test('missing must-have skills in JD still yields a sane score (no division by zero)', () => {
  const noSkills = jd();
  noSkills.mustHaveSkills = [];
  noSkills.niceToHaveSkills = [];
  const { score } = scoreCandidate(profile(), noSkills, null);
  assert.ok(score > 0 && score <= 100);
});

test('tier boundaries', () => {
  assert.equal(tierFor(75), 'excellent');
  assert.equal(tierFor(74), 'strong');
  assert.equal(tierFor(55), 'strong');
  assert.equal(tierFor(54), 'moderate');
  assert.equal(tierFor(35), 'moderate');
  assert.equal(tierFor(34), null);
});

test('anonymized profile exposes no PII', () => {
  const anon = anonymizeProfile(profile(), ['Node.js']);
  const keys = Object.keys(anon);
  for (const banned of ['name', 'fullName', 'email', 'phone', 'photo']) {
    assert.ok(!keys.some((k) => k.toLowerCase().includes(banned.toLowerCase())), `PII key leaked: ${banned}`);
  }
  const dumped = JSON.stringify(anon);
  assert.ok(!dumped.includes('Adaeze') && !dumped.includes('@'));
  assert.equal(anon.currentTitle, 'Senior Backend Engineer');
  assert.ok(anon.topSkills[0] === 'Node.js'); // matched skills first
  assert.ok(anon.topSkills.length <= 8);
});

test('buildFtsQuery combines title and skills', () => {
  const q = buildFtsQuery(jd());
  assert.ok(q.includes('Senior Backend Engineer'));
  assert.ok(q.includes('PostgreSQL'));
});

// --- Advanced search filters -------------------------------------------

const noFilters = (): MatchFilters =>
  normalizeMatchFilters(undefined);

const nullFts = (_id: string): number | null => null;

// --- normalizeMatchFilters ---

test('normalizeMatchFilters defaults on garbage input', () => {
  const f = normalizeMatchFilters(undefined);
  assert.equal(f.minYears, null);
  assert.deepEqual(f.mustHaveSkills, []);
  assert.deepEqual(f.tiers, []);
  assert.equal(f.sort, 'score');
});

test('normalizeMatchFilters trims, dedupes case-insensitively, caps at 40', () => {
  const skills = [' React ', 'react', 'REACT', 'Node.js', '', '   '];
  for (let i = 0; i < 50; i++) skills.push(`Skill${i}`);
  const f = normalizeMatchFilters({ mustHaveSkills: skills });
  assert.equal(f.mustHaveSkills.length, 40);
  assert.ok(f.mustHaveSkills.includes('React'));
  assert.ok(f.mustHaveSkills.includes('Node.js'));
  assert.equal(
    new Set(f.mustHaveSkills.map((s) => s.toLowerCase())).size,
    f.mustHaveSkills.length
  );
});

test('normalizeMatchFilters rejects invalid minYears, keeps finite >= 0', () => {
  assert.equal(normalizeMatchFilters({ minYears: -1 }).minYears, null);
  assert.equal(normalizeMatchFilters({ minYears: NaN }).minYears, null);
  assert.equal(normalizeMatchFilters({ minYears: Infinity }).minYears, null);
  assert.equal(normalizeMatchFilters({ minYears: 'abc' }).minYears, null);
  assert.equal(normalizeMatchFilters({ minYears: 0 }).minYears, 0);
  assert.equal(normalizeMatchFilters({ minYears: 5 }).minYears, 5);
});

test('normalizeMatchFilters keeps valid tiers, drops invalid, defaults sort', () => {
  const f = normalizeMatchFilters({ tiers: ['excellent', 'bogus', 'strong', 'excellent'], sort: 'newest' });
  assert.deepEqual(f.tiers, ['excellent', 'strong']);
  assert.equal(f.sort, 'score');
  assert.equal(normalizeMatchFilters({ sort: 'experience' }).sort, 'experience');
});

// --- mergeMustHaveSkills ---

test('mergeMustHaveSkills merges into the JD, deduping case-insensitively', () => {
  const j = jd();
  const merged = mergeMustHaveSkills(j, normalizeMatchFilters({ mustHaveSkills: ['docker', 'Kubernetes'] }));
  assert.ok(merged.mustHaveSkills.includes('Docker') || merged.mustHaveSkills.includes('docker'));
  assert.ok(merged.mustHaveSkills.includes('Kubernetes'));
  // 'docker' dedupes against nothing in extracted.mustHaveSkills ('Docker' is in niceToHave)
  assert.ok(merged.mustHaveSkills.includes('Node.js'));
  assert.ok(merged.mustHaveSkills.length <= 40);
  // input not mutated
  assert.equal(j.mustHaveSkills.length, 3);
});

test('mergeMustHaveSkills dedupes against extracted must-haves', () => {
  const merged = mergeMustHaveSkills(jd(), normalizeMatchFilters({ mustHaveSkills: ['node.js', 'Go'] }));
  assert.equal(
    merged.mustHaveSkills.filter((s) => s.toLowerCase() === 'node.js').length,
    1
  );
  assert.ok(merged.mustHaveSkills.includes('Go'));
});

test('mergeMustHaveSkills returns the input JD unchanged when filters add nothing', () => {
  const j = jd();
  assert.equal(mergeMustHaveSkills(j, normalizeMatchFilters({})), j);
});

// --- filterPoolByMinYears ---

test('filterPoolByMinYears excludes below-minimum, keeps unknown experience', () => {
  const pool = [
    profile({ id: 'a', experience_years: 2 }),
    profile({ id: 'b', experience_years: 5 }),
    profile({ id: 'c', experience_years: null }),
  ];
  const out = filterPoolByMinYears(pool, 3);
  assert.deepEqual(out.map((p) => p.id), ['b', 'c']);
  assert.equal(filterPoolByMinYears(pool, null), pool);
});

// --- computeMissingSkills ---

test('computeMissingSkills is case-insensitive', () => {
  assert.deepEqual(
    computeMissingSkills(['React', 'Go', 'Kubernetes'], ['react', 'GO']),
    ['Kubernetes']
  );
});

// --- runMatchPipeline ---

test('pipeline default (no filters) scores, tiers, excludes below minimum, sorts score desc', () => {
  const pool = [
    profile({ id: 'strong' }),
    profile({ id: 'weak', current_title: 'Barista', skills: ['Espresso'], experience_years: 1, city: 'Kano' }),
  ];
  const { matches, counts } = runMatchPipeline(pool, jd(), noFilters(), nullFts);
  assert.ok(matches.every((m) => m.score >= MATCH_MIN_SCORE));
  assert.equal(counts.total, matches.length);
  assert.equal(counts.total, counts.excellent + counts.strong + counts.moderate);
  for (let i = 1; i < matches.length; i++) {
    assert.ok(matches[i - 1].score >= matches[i].score, 'score desc');
  }
});

test('pipeline applies minYears hard filter before scoring', () => {
  const pool = [
    profile({ id: 'junior', experience_years: 1, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
    profile({ id: 'senior', experience_years: 6, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
  ];
  const f = normalizeMatchFilters({ minYears: 3 });
  const { matches } = runMatchPipeline(pool, jd(), f, nullFts);
  assert.ok(!matches.some((m) => m.profileId === 'junior'), JSON.stringify(matches.map((m) => m.profileId)));
});

test('pipeline tier filter keeps only selected tiers', () => {
  const f = normalizeMatchFilters({ tiers: ['excellent'] });
  const { matches, counts } = runMatchPipeline([profile({ id: 'a' })], jd(), f, nullFts);
  assert.ok(matches.every((m) => m.tier === 'excellent'));
  assert.equal(counts.total, counts.excellent);
  assert.equal(counts.strong, 0);
  assert.equal(counts.moderate, 0);
});

test('pipeline sort=experience orders years desc, nulls last, tie-break score desc', () => {
  const pool = [
    profile({ id: 'none', experience_years: null, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
    profile({ id: 'mid', experience_years: 3, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
    profile({ id: 'vet', experience_years: 9, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
  ];
  const f = normalizeMatchFilters({ sort: 'experience' });
  const { matches } = runMatchPipeline(pool, jd(), f, nullFts);
  const ids = matches.map((m) => m.profileId);
  // unknown-experience candidate sorts last
  assert.equal(ids[ids.length - 1], 'none');
  // known experience sorts desc
  const years = matches.filter((m) => m.profile.yearsExperience != null).map((m) => m.profile.yearsExperience);
  for (let i = 1; i < years.length; i++) assert.ok((years[i - 1] as number) >= (years[i] as number));
});

test('pipeline merged filter skills influence reasons and missingSkills', () => {
  const j = mergeMustHaveSkills(jd(), normalizeMatchFilters({ mustHaveSkills: ['Kubernetes', 'GraphQL'] }));
  const { matches } = runMatchPipeline([profile({ id: 'a' })], j, noFilters(), nullFts);
  assert.equal(matches.length, 1);
  const m = matches[0];
  assert.ok(m.reasons.some((r) => r === '3/5 required skills'), JSON.stringify(m.reasons));
  assert.ok(m.missingSkills.includes('Kubernetes'));
  assert.ok(m.missingSkills.includes('GraphQL'));
  // matchedSkills ∩ missingSkills must be empty
  assert.ok(!m.missingSkills.some((s) => m.matchedSkills.some((mm) => mm.toLowerCase() === s.toLowerCase())));
  assert.ok(m.matchedSkills.includes('Node.js'));
});

test('pipeline counts reflect the filtered set, not the raw scored set', () => {
  const pool = [
    profile({ id: 'a', experience_years: 5 }),
    profile({ id: 'b', experience_years: 1, skills: ['Node.js', 'TypeScript', 'PostgreSQL'] }),
  ];
  const unfiltered = runMatchPipeline(pool, jd(), noFilters(), nullFts);
  const filtered = runMatchPipeline(pool, jd(), normalizeMatchFilters({ minYears: 4 }), nullFts);
  assert.ok(unfiltered.counts.total >= filtered.counts.total);
  assert.equal(filtered.counts.total, filtered.matches.length);
  assert.ok(filtered.counts.total < unfiltered.counts.total || unfiltered.counts.total === 0);
});
