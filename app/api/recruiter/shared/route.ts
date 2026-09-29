import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';
import { anonymizeProfile } from '@/lib/recruiter-match';

export const dynamic = 'force-dynamic';

function sharedUrl(token: string) {
  return `/recruiter/shared/${token}`;
}

/** POST /api/recruiter/shared — snapshot the recruiter's current shortlist into a
 *  shareable link. Snapshots hold ONLY anonymized profile fields (headline,
 *  currentTitle, yearsExperience, skills, location, country, completeness) plus
 *  stage/note — never names, emails, or phones. */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  try {
    const { data, error } = await supabaseAdmin
      .from('shortlists')
      .select('candidate_profile_id, stage, note, candidate_profiles(id, current_title, summary, city, country, experience_years, skills, completeness_score, consent_recruiter_share)')
      .eq('recruiter_id', recruiter.id)
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;

    const snapshot = (data || [])
      .map((row: any) => {
        const p = row.candidate_profiles;
        // Same consent check as shortlist GET — drop silently if consent revoked.
        if (!p || p.consent_recruiter_share !== true) return null;
        return {
          profileId: row.candidate_profile_id,
          stage: row.stage ?? 'new',
          note: row.note ?? null,
          profile: anonymizeProfile(p, []),
        };
      })
      .filter(Boolean);

    const token = crypto.randomUUID().replace(/-/g, '');
    const { error: insertError } = await supabaseAdmin
      .from('recruiter_shared_shortlists')
      .insert({ token, recruiter_id: recruiter.id, snapshot });
    if (insertError) throw insertError;

    return NextResponse.json({ token, url: sharedUrl(token) }, { status: 201 });
  } catch (e: any) {
    logger.error('shared', 'recruiter/shared POST error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** GET /api/recruiter/shared — list the recruiter's own share links (newest first). */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  try {
    const { data, error } = await supabaseAdmin
      .from('recruiter_shared_shortlists')
      .select('token, snapshot, created_at')
      .eq('recruiter_id', recruiter.id)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;

    const links = (data || []).map((row: any) => ({
      token: row.token,
      url: sharedUrl(row.token),
      itemCount: Array.isArray(row.snapshot) ? row.snapshot.length : 0,
      createdAt: row.created_at,
    }));
    return NextResponse.json({ links });
  } catch (e: any) {
    logger.error('shared', 'recruiter/shared GET error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** DELETE /api/recruiter/shared { token } — revoke the recruiter's own link. */
export async function DELETE(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  const body = await req.json().catch(() => ({}));
  let token = String(body?.token || '').trim();
  if (!token) {
    try {
      token = String(new URL(req.url).searchParams.get('token') || '').trim();
    } catch {
      token = '';
    }
  }
  if (!token) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('recruiter_shared_shortlists')
      .delete()
      .eq('token', token)
      .eq('recruiter_id', recruiter.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, token });
  } catch (e: any) {
    logger.error('shared', 'recruiter/shared DELETE error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
