import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';
import {
  buildFtsQuery,
  extractJD,
  mergeMustHaveSkills,
  normalizeMatchFilters,
  runMatchPipeline,
  MATCH_ELIGIBILITY,
  type ExtractedJD,
  type MatchFilters,
  type MatchPoolRow,
} from '@/lib/recruiter-match';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60;

const POOL_LIMIT = 300;

interface RankRow {
  profile_id: string;
  rank: number;
}

/** Consent + soft-delete filter. Never query candidates without it. */
function eligiblePool() {
  return supabaseAdmin
    .from('candidate_profiles')
    .select('id, current_title, summary, city, country, experience_years, skills, completeness_score')
    .eq('consent_recruiter_share', MATCH_ELIGIBILITY.consent_recruiter_share)
    .is('deleted_at', MATCH_ELIGIBILITY.deleted_at);
}

export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const jobDescription = String(body?.jobDescription || '').trim();
  if (jobDescription.length < 20) {
    return NextResponse.json({ error: 'jobDescription must be at least 20 characters' }, { status: 400 });
  }
  const jobTitle = String(body?.jobTitle || '').trim().slice(0, 120) || undefined;
  const locationOverride = String(body?.location || '').trim().slice(0, 120) || null;
  const page = Math.max(1, parseInt(String(body?.page ?? '1'), 10) || 1);
  const pageSize = Math.min(50, Math.max(1, parseInt(String(body?.pageSize ?? '20'), 10) || 20));
  // Optional advanced search filters (backwards compatible: omitted = defaults).
  const filters: MatchFilters = normalizeMatchFilters(body?.filters);

  try {
    // (a) Extract structured requirements — Gemini first, keyword fallback.
    // Recruiter-supplied must-have skills are merged into the extracted JD
    // BEFORE FTS + scoring, so they influence ranking, scores, and reasons.
    const extracted: ExtractedJD = await extractJD(jobDescription, jobTitle);
    if (locationOverride) extracted.location = locationOverride;
    const merged = mergeMustHaveSkills(extracted, filters);

    // (b) FTS rank map over the consented pool only (RPC enforces consent).
    const ftsText = buildFtsQuery(merged);
    let rankMap = new Map<string, number>();
    let maxRank = 0;
    if (ftsText.trim()) {
      const { data: ranks, error: rankErr } = await supabaseAdmin.rpc('match_candidate_ranks', {
        p_query: ftsText,
      });
      if (!rankErr && Array.isArray(ranks)) {
        for (const r of ranks as RankRow[]) {
          rankMap.set(r.profile_id, Number(r.rank) || 0);
          if (Number(r.rank) > maxRank) maxRank = Number(r.rank);
        }
      } else {
        logger.warn('match', 'match_candidate_ranks RPC failed, falling back to plain FTS', rankErr?.message);
      }
    }

    // (c) Pull the candidate pool: ranked ids when we have ranks, otherwise a
    //     plain FTS-filtered pool. Always consent-filtered, never fabricated.
    let pool: MatchPoolRow[] = [];
    if (rankMap.size > 0) {
      const ids = [...rankMap.keys()].slice(0, POOL_LIMIT);
      const { data, error } = await eligiblePool().in('id', ids);
      if (error) throw error;
      pool = (data || []) as MatchPoolRow[];
    } else if (ftsText.trim()) {
      const terms = ftsText.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 20);
      let q = eligiblePool();
      if (terms.length > 0) q = q.textSearch('search_vector', terms.join(' & '), { config: 'english' });
      const { data, error } = await q.order('completeness_score', { ascending: false, nullsFirst: false }).limit(POOL_LIMIT);
      if (error) throw error;
      pool = (data || []) as MatchPoolRow[];
    }

    // (d) Score, tier, filter, and sort. Counts reflect the FILTERED set.
    const ftsRatioFor = (profileId: string): number | null =>
      rankMap.has(profileId) && maxRank > 0 ? (rankMap.get(profileId) as number) / maxRank : null;
    const { matches: filtered, counts } = runMatchPipeline(pool, merged, filters, ftsRatioFor);

    const offset = (page - 1) * pageSize;
    const matches = filtered.slice(offset, offset + pageSize);

    // (e) Persist the search row.
    let searchId: string | null = null;
    try {
      const { data: saved } = await supabaseAdmin
        .from('jd_searches')
        .insert({
          recruiter_id: recruiter.id,
          job_title: merged.title,
          job_description: jobDescription.slice(0, 20000),
          extracted_json: { ...merged },
          counts_json: counts,
          saved: false,
        })
        .select('id')
        .single();
      searchId = saved?.id || null;
    } catch (e: any) {
      logger.warn('match', 'jd_searches insert failed (non-fatal)', e?.message);
    }

    // (f) Candidate transparency: log impressions (unlocked=false), best-effort.
    if (matches.length > 0) {
      try {
        await supabaseAdmin.from('profile_views').insert(
          matches.map((m) => ({
            candidate_profile_id: m.profileId,
            recruiter_id: recruiter.id,
            unlocked: false,
          }))
        );
      } catch (e: any) {
        logger.warn('match', 'profile_views impression logging failed (non-fatal)', e?.message);
      }
    }

    // Searching is FREE: no credit deduction, no subscription check.
    return NextResponse.json({
      searchId,
      extracted: merged,
      counts,
      matches,
      page,
      pageSize,
    });
  } catch (e: any) {
    logger.error('match', 'recruiter/match error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
