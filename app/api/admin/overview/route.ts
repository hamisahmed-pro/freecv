import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
const monthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

export async function GET() {
  try { await requireAdmin(); } catch { return adminFail(); }
  const ms = monthStart();

  const [cand, pool, recs, tickets, ai, exp, pipe, subs, clicks] = await Promise.all([
    supabaseAdmin.from('candidates').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabaseAdmin.from('candidate_profiles').select('consent_recruiter_share').is('deleted_at', null),
    supabaseAdmin.from('recruiters').select('status, subscriptions(status)'),
    supabaseAdmin.from('support_tickets').select('status'),
    supabaseAdmin.from('ai_usage_logs').select('cost_estimate').gte('created_at', ms),
    supabaseAdmin.from('expenditures').select('amount_minor, fx_to_usd').gte('spent_on', new Date().toISOString().slice(0, 10).replace(/-\d\d$/, '-01')),
    supabaseAdmin.from('sales_pipeline').select('stage'),
    supabaseAdmin.from('subscriptions').select('amount_minor, fx_to_usd, status'),
    supabaseAdmin.from('job_clicks').select('cpc_value').gte('created_at', ms),
  ]);

  const consented = (pool.data || []).filter((c: any) => c.consent_recruiter_share).length;
  const activeRecs = (recs.data || []).filter((r: any) => (r.subscriptions || []).some((s: any) => s.status === 'active')).length;
  const openTickets = (tickets.data || []).filter((t: any) => t.status !== 'closed').length;
  const aiCost = (ai.data || []).reduce((s: number, l: any) => s + (Number(l.cost_estimate) || 0), 0);
  const expThisMonth = (exp.data || []).reduce((s: number, e: any) => s + (Number(e.amount_minor) || 0) * (Number(e.fx_to_usd) || 1) / 100, 0);
  const affThisMonth = (clicks.data || []).reduce((s: number, c: any) => s + (Number(c.cpc_value) || 0), 0);
  // Job-referral telemetry: click counts are real, CPC dollar values are estimates —
  // never presented as revenue. No run-rate projection (removed 2026-10-01).

  const stages: Record<string, number> = {};
  (pipe.data || []).forEach((p: any) => { stages[p.stage] = (stages[p.stage] || 0) + 1; });

  return NextResponse.json({
    candidates: cand.count || 0,
    consented,
    recruitersTotal: recs.data?.length || 0,
    recruitersActive: activeRecs,
    openTickets,
    aiCostThisMonth: +aiCost.toFixed(2),
    expensesThisMonth: +expThisMonth.toFixed(2),
    referralClicksMonth: (clicks.data || []).length,
    referralCpcEstMonth: +affThisMonth.toFixed(2),
    pipelineStages: stages,
    pipelineOpen: (pipe.data || []).filter((p: any) => p.stage !== 'customer' && p.stage !== 'lost').length,
  });
}