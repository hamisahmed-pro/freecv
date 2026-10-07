import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    // P0 fix (2026-09-23): this endpoint previously served the entire
    // analytics_events table with zero auth. Require a signed-in session.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // We'll just fetch all analytics events and group them (simulating "my links")
    const { data: events, error } = await supabaseAdmin
      .from('analytics_events')
      .select('event_type, country, city, created_at, device_type, referrer, utm_source, utm_medium, utm_campaign')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const views = events.filter((e: any) => e.event_type.includes('view') || e.event_type === 'milestone_previewed').length;
    const downloads = events.filter((e: any) => e.event_type === 'resume_downloaded' || e.event_type === 'milestone_downloaded').length;

    // Group by country
    const geoLocations = events.reduce((acc: any, event: any) => {
      const loc = event.country || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});

    const topLocations = Object.entries(geoLocations)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    // ---- Traffic Sources ----
    // Top referrers (hostname), excluding self/direct
    const referrerCounts = events.reduce((acc: any, event: any) => {
      const ref = event.referrer || 'direct';
      acc[ref] = (acc[ref] || 0) + 1;
      return acc;
    }, {});
    const topReferrers = Object.entries(referrerCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    // Top UTM sources (only events that carried UTM params)
    const utmSourceCounts = events.reduce((acc: any, event: any) => {
      if (!event.utm_source) return acc;
      acc[event.utm_source] = (acc[event.utm_source] || 0) + 1;
      return acc;
    }, {});
    const topUtmSources = Object.entries(utmSourceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    // Top UTM campaigns
    const utmCampaignCounts = events.reduce((acc: any, event: any) => {
      if (!event.utm_campaign) return acc;
      const label = event.utm_source
        ? `${event.utm_source} / ${event.utm_campaign}`
        : event.utm_campaign;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});
    const topUtmCampaigns = Object.entries(utmCampaignCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      views,
      downloads,
      topLocations,
      topReferrers,
      topUtmSources,
      topUtmCampaigns,
      recentEvents: events.slice(0, 10)
    });
  } catch (error: any) {
    logger.error('analytics', 'Analytics fetch error:', error);
    return NextResponse.json({ error: 'Could not load analytics.' }, { status: 500 });
  }
}
