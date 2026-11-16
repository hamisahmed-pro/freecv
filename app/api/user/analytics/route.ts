import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase';

/** Never disclose site-wide analytics to a signed-in candidate. */
export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: candidate, error: candidateError } = await supabaseAdmin
    .from('candidates').select('id').eq('email', user.email.toLowerCase()).maybeSingle();
  if (candidateError) return NextResponse.json({ error: 'Profile unavailable' }, { status: 503 });
  let rows: { viewed_at: string }[] = [];
  if (candidate?.id) {
    const { data, error } = await supabaseAdmin
      .from('profile_views').select('viewed_at')
      .eq('candidate_profile_id', candidate.id)
      .order('viewed_at', { ascending: false }).limit(1000);
    if (error) return NextResponse.json({ error: 'Profile view data unavailable' }, { status: 503 });
    rows = data || [];
  }
  return NextResponse.json({
    views: rows.length, downloads: null, topLocations: [],
    topReferrers: [], topUtmSources: [], topUtmCampaigns: [],
    recentEvents: rows.slice(0, 10).map(v => ({
      event_type: 'recruiter_profile_viewed', created_at: v.viewed_at,
      country: null, device_type: null, referrer: null, utm_source: null,
    })),
    measurementScope: 'candidate_recruiter_profile',
    capped: rows.length === 1000,
  }, { headers: { 'Cache-Control': 'private, no-store' } });
}
