import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * POST /api/recruiter/ensure
 * Idempotently creates the recruiter row for the signed-in user and guarantees
 * a REAL company name lands on it — never a placeholder. Company is resolved
 * from (1) the x-company-name header (OAuth signup stash), then (2) the auth
 * user's metadata (email signup), then '' (unknown → the client shows the
 * company gate before the recruiter can search or unlock anything).
 *
 * If a row already exists but carries an empty/'Recruiter' company and a real
 * name is now supplied, it is backfilled.
 *
 * Response: { ok: true, created: boolean, backfilled: boolean, company_name: string }
 */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '').trim();
    const { data: ud, error: ue } = await supabase.auth.getUser(token);
    if (ue || !ud?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const PLACEHOLDER = 'Recruiter';
    const supplied = (req.headers.get('x-company-name') || '').trim().slice(0, 120);
    const fromMetadata = String(ud.user.user_metadata?.company_name || '').trim().slice(0, 120);
    const company = supplied || fromMetadata || '';

    const { data: existing } = await supabaseAdmin
      .from('recruiters')
      .select('id, company_name')
      .eq('user_id', ud.user.id)
      .single();

    if (existing) {
      const current = String(existing.company_name || '').trim();
      const needsBackfill = (!current || current === PLACEHOLDER) && !!company;
      if (needsBackfill) {
        const { error } = await supabaseAdmin
          .from('recruiters')
          .update({ company_name: company })
          .eq('id', existing.id);
        if (error) throw error;
      }
      return NextResponse.json({
        ok: true,
        created: false,
        backfilled: needsBackfill,
        company_name: needsBackfill ? company : current,
      });
    }

    const { error } = await supabaseAdmin.from('recruiters').upsert(
      { user_id: ud.user.id, company_name: company },
      { onConflict: 'user_id', ignoreDuplicates: true }
    );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // A concurrent request may have won the upsert race; read back the truth.
    const { data: row } = await supabaseAdmin
      .from('recruiters')
      .select('company_name')
      .eq('user_id', ud.user.id)
      .single();

    return NextResponse.json({
      ok: true,
      created: true,
      backfilled: false,
      company_name: String(row?.company_name || '').trim(),
    });
  } catch (e: any) {
    logger.error('ensure', 'recruiter/ensure error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
