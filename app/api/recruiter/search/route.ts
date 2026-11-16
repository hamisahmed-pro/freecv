import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(req);
    if (rateLimitResponse) return rateLimitResponse;

    const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
    const { data: ud, error: ue } = await supabase.auth.getUser(token);
    if (ue || !ud?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: rec } = await supabaseAdmin.from('recruiters').select('*, subscriptions(*)').eq('user_id', ud.user.id).single();
    if (!rec) return NextResponse.json({ error: 'Recruiter account not found' }, { status: 403 });
    if (!(rec.subscriptions || []).some((s: any) => s.status === 'active')) return NextResponse.json({ error: 'No active subscription' }, { status: 402 });

    const url = new URL(req.url);
    const q = (url.searchParams.get('q') || '').trim();
    const country = url.searchParams.get('country') || '';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get('pageSize') || '50', 10)));
    const offset = (page - 1) * pageSize;

    let rq = supabaseAdmin.from('candidate_profiles').select('*, candidates(*)', { count: 'exact' }).eq('consent_recruiter_share', true).eq('consent_version', 'v2.0').is('deleted_at', null);
    
    if (q) {
      // Use PostgreSQL Full-Text Search on search_vector if formatted query is valid
      const terms = q.replace(/[^\w\s]/g, '').trim().split(/\s+/).filter(Boolean);
      if (terms.length > 0) {
        const ftsQuery = terms.join(' & ');
        rq = rq.textSearch('search_vector', ftsQuery, { config: 'english' });
      } else {
        rq = rq.ilike('current_title', `%${q}%`);
      }
    }
    
    if (country) rq = rq.eq('country', country);
    rq = rq.order('completeness_score', { ascending: false, nullsFirst: false }).range(offset, offset + pageSize - 1);

    const { data, count, error } = await rq;
    if (error) {
      // Graceful fallback if search_vector index is still warming or has a syntax issue
      const fallback = await supabaseAdmin.from('candidate_profiles')
        .select('*, candidates(*)', { count: 'exact' })
        .eq('consent_recruiter_share', true)
        .eq('consent_version', 'v2.0')
        .is('deleted_at', null)
        .ilike('current_title', `%${q}%`)
        .order('completeness_score', { ascending: false, nullsFirst: false })
        .range(offset, offset + pageSize - 1);
      return NextResponse.json({
        candidates: fallback.data || [],
        total: fallback.count || 0,
        page,
        pageSize
      });
    }

    return NextResponse.json({
      candidates: data || [],
      total: count || 0,
      page,
      pageSize
    });

  } catch (e: any) {
    logger.error('search', 'recruiter/search error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}