import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

/**
 * Verify the caller's Supabase session token and return their email.
 * Same session-email pattern as app/api/user/consent/route.ts: the token is
 * MANDATORY — view records are personal data and must never be served on the
 * basis of an unauthenticated email parameter.
 */
async function getSessionEmail(req: Request): Promise<string | null> {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';
  if (!url || !anonKey) return null;
  try {
    const sb = createClient(url, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await sb.auth.getUser(token);
    if (error || !data?.user?.email) return null;
    return data.user.email;
  } catch {
    return null;
  }
}

/**
 * GET /api/user/profile-views — candidate transparency feed.
 * Returns { views: [{ at, recruiterLabel, unlocked }] } where recruiterLabel is
 * the recruiter's company name or "A recruiter".
 */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const email = await getSessionEmail(req);
  if (!email) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { data: cand } = await supabaseAdmin
      .from('candidates')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();
    if (!cand?.id) {
      return NextResponse.json({ views: [], measurementScope: 'recruiter_search_impressions' });
    }

    const { data, error } = await supabaseAdmin
      .from('profile_views')
      .select('viewed_at, unlocked, recruiters(company_name)')
      .eq('candidate_profile_id', cand.id)
      .order('viewed_at', { ascending: false })
      .limit(100);
    if (error) throw error;

    const views = (data || []).map((v: any) => ({
      at: v.viewed_at,
      recruiterLabel: v.recruiters?.company_name?.trim() || 'A recruiter',
      unlocked: Boolean(v.unlocked),
      type: 'search_appearance',
    }));
    return NextResponse.json({ views, measurementScope: 'recruiter_search_impressions' });
  } catch (e: any) {
    logger.error('profile-views', 'user/profile-views error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
