import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';
import { anonymizeProfile, MATCH_ELIGIBILITY } from '@/lib/recruiter-match';

export const dynamic = 'force-dynamic';

function profileIdFrom(req: Request, body: any): string {
  const fromBody = String(body?.profileId || '').trim();
  if (fromBody) return fromBody;
  try {
    return String(new URL(req.url).searchParams.get('profileId') || '').trim();
  } catch {
    return '';
  }
}

/** Only shortlist profiles the recruiter is allowed to see (consented, not deleted). */
async function eligibleProfile(profileId: string) {
  const { data } = await supabaseAdmin
    .from('candidate_profiles')
    .select('id, current_title, summary, city, country, experience_years, skills, completeness_score')
    .eq('id', profileId)
    .eq('consent_recruiter_share', MATCH_ELIGIBILITY.consent_recruiter_share)
    .is('deleted_at', MATCH_ELIGIBILITY.deleted_at)
    .single();
  return data;
}

const PIPELINE_STAGES = ['new', 'contacted', 'interviewing', 'hired', 'rejected'] as const;
type PipelineStage = (typeof PIPELINE_STAGES)[number];

/** GET /api/recruiter/shortlist — the recruiter's shortlisted candidates (anonymized). */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  try {
    const { data, error } = await supabaseAdmin
      .from('shortlists')
      .select('candidate_profile_id, created_at, stage, note, updated_at, candidate_profiles(id, current_title, summary, city, country, experience_years, skills, completeness_score, consent_recruiter_share)')
      .eq('recruiter_id', recruiter.id)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;

    const items = (data || [])
      .map((row: any) => {
        const p = row.candidate_profiles;
        // Consent may have been revoked after shortlisting — drop silently.
        if (!p || p.consent_recruiter_share !== true) return null;
        return {
          profileId: row.candidate_profile_id,
          shortlistedAt: row.created_at,
          stage: row.stage ?? 'new',
          note: row.note ?? null,
          updatedAt: row.updated_at,
          profile: anonymizeProfile(p, []),
        };
      })
      .filter(Boolean);
    return NextResponse.json({ shortlist: items });
  } catch (e: any) {
    logger.error('shortlist', 'recruiter/shortlist GET error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** POST /api/recruiter/shortlist { profileId } — add to shortlist. */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  const body = await req.json().catch(() => ({}));
  const profileId = profileIdFrom(req, body);
  if (!profileId) {
    return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
  }

  try {
    const profile = await eligibleProfile(profileId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    const { error } = await supabaseAdmin
      .from('shortlists')
      .upsert(
        { recruiter_id: recruiter.id, candidate_profile_id: profileId },
        { onConflict: 'recruiter_id,candidate_profile_id', ignoreDuplicates: true }
      );
    if (error) throw error;
    return NextResponse.json({
      ok: true,
      profileId,
      profile: anonymizeProfile(profile, []),
    });
  } catch (e: any) {
    logger.error('shortlist', 'recruiter/shortlist POST error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** PATCH /api/recruiter/shortlist { profileId, stage?, note? } — move a shortlist
 * item through the pipeline and/or set a recruiter note. */
export async function PATCH(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
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
  const profileId = String(body?.profileId || '').trim();
  if (!profileId) {
    return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
  }

  const update: Record<string, any> = {};
  if (body?.stage !== undefined) {
    const stage = String(body.stage).trim();
    if (!(PIPELINE_STAGES as readonly string[]).includes(stage)) {
      return NextResponse.json(
        { error: `stage must be one of: ${PIPELINE_STAGES.join(', ')}` },
        { status: 400 }
      );
    }
    update.stage = stage as PipelineStage;
  }
  if (body?.note !== undefined) {
    if (body.note !== null && typeof body.note !== 'string') {
      return NextResponse.json({ error: 'note must be a string' }, { status: 400 });
    }
    const note = typeof body.note === 'string' ? body.note : '';
    if (note.length > 2000) {
      return NextResponse.json({ error: 'note must be 2000 characters or fewer' }, { status: 400 });
    }
    update.note = note.trim().length > 0 ? note : null;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update — provide stage and/or note' }, { status: 400 });
  }
  update.updated_at = new Date().toISOString();

  try {
    const { data, error } = await supabaseAdmin
      .from('shortlists')
      .update(update)
      .eq('recruiter_id', recruiter.id)
      .eq('candidate_profile_id', profileId)
      .select('candidate_profile_id, stage, note, updated_at')
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Shortlist item not found' }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      profileId: data.candidate_profile_id,
      stage: data.stage,
      note: data.note,
      updatedAt: data.updated_at,
    });
  } catch (e: any) {
    logger.error('shortlist', 'recruiter/shortlist PATCH error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** DELETE /api/recruiter/shortlist { profileId } — remove from shortlist. */
export async function DELETE(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  const body = await req.json().catch(() => ({}));
  const profileId = profileIdFrom(req, body);
  if (!profileId) {
    return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('shortlists')
      .delete()
      .eq('recruiter_id', recruiter.id)
      .eq('candidate_profile_id', profileId);
    if (error) throw error;
    return NextResponse.json({ ok: true, profileId });
  } catch (e: any) {
    logger.error('shortlist', 'recruiter/shortlist DELETE error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
