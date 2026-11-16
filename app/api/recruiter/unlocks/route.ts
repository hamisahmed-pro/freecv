import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/recruiter/unlocks — unlock history with receipt refs.
 * Shows the candidate headline only (no contact re-exposure here; the contact
 * was delivered at unlock time via /unlock).
 */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  try {
    const { data, error } = await supabaseAdmin
      .from('contact_unlocks')
      .select(
        'id, receipt_ref, credits_spent, unlocked_at, candidate_profile_id, ' +
          'candidate_profiles(id, current_title, city, country, completeness_score, consent_recruiter_share, consent_version)'
      )
      .eq('recruiter_id', recruiter.id)
      .order('unlocked_at', { ascending: false })
      .limit(200);
    if (error) throw error;

    const items = (data || [])
      .map((row: any) => {
        const p = row.candidate_profiles;
        if (!p || p.consent_recruiter_share !== true || p.consent_version !== 'v2.0') return null; // consent revoked later — drop
        return {
          id: row.id,
          receiptRef: row.receipt_ref,
          creditsSpent: row.credits_spent,
          unlockedAt: row.unlocked_at,
          profileId: row.candidate_profile_id,
          headline: p.current_title || 'Candidate',
          country: p.country,
          city: p.city,
          completenessScore: p.completeness_score ?? 0,
        };
      })
      .filter(Boolean);
    return NextResponse.json({ unlocks: items });
  } catch (e: any) {
    logger.error('unlocks', 'recruiter/unlocks error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
