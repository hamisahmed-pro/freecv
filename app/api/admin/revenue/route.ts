import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
// Approx FX to USD — reconcile against your bank/Paystack rates.
const FX: Record<string, number> = { USD: 1, NGN: 1 / 1550, GBP: 1.27, EUR: 1.08, KES: 0.0077, ZAR: 0.055, GHS: 0.065, INR: 0.012, CAD: 0.73, AUD: 0.66 };
const toUSD = (minor: number, cur: string, fx?: number) => (minor / 100) * (fx || FX[(cur || 'USD').toUpperCase()] || 1);
const monthStart = () => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

export async function GET() {
  try { await requireAdmin(); } catch { return adminFail(); }
  const ms = monthStart();
  const [subs, clicks, allClicks, ledger, exp] = await Promise.all([
    supabaseAdmin.from('subscriptions').select('*, recruiters(company_name, contact_email)'),
    supabaseAdmin.from('job_clicks').select('*').gte('created_at', ms),
    supabaseAdmin.from('job_clicks').select('*').order('created_at', { ascending: false }).limit(2000),
    supabaseAdmin.from('revenue_ledger').select('*').order('created_at', { ascending: false }).limit(40),
    supabaseAdmin.from('expenditures').select('amount_minor, fx_to_usd').gte('spent_on', new Date().toISOString().slice(0, 10).replace(/-\d\d$/, '-01')),
  ]);

  const active = (subs.data || []).filter((s: any) => s.status === 'active');
  const mrr = active.reduce((s: number, x: any) => s + toUSD(x.amount_minor || 0, x.currency, x.fx_to_usd), 0);
  const arr = mrr * 12;

  const clicksMonth = clicks.data || [];
  const totalClicksAllTime = (allClicks.data || []).length;
  // Job-referral telemetry (2026-10-01 correction): click counts are real; CPC dollar
  // values are estimates and are NEVER revenue. No run-rate projection is computed —
  // speculative (month-to-date / day-of-month × 30) annualization was removed.
  
  const byCountry: Record<string, { clicks: number; usd: number }> = {};
  (allClicks.data || []).forEach((c: any) => {
    const k = c.country || 'UNKNOWN';
    (byCountry[k] ||= { clicks: 0, usd: 0 }).clicks++;
    byCountry[k].usd += Number(c.cpc_value) || 0;
  });

  const expMonth = (exp.data || []).reduce((s: number, e: any) => s + (Number(e.amount_minor) || 0) * (Number(e.fx_to_usd) || 1) / 100, 0);
  const ledgerCash = (ledger.data || []).filter((l: any) => l.status === 'settled').reduce((s: number, l: any) => s + toUSD(l.amount_minor, l.currency, l.fx_to_usd), 0);
  const ledgerSettledMonth = (ledger.data || [])
    .filter((l: any) => l.status === 'settled' && (l.created_at || '') >= ms)
    .reduce((s: number, l: any) => s + toUSD(l.amount_minor, l.currency, l.fx_to_usd), 0);
  const cpcEstMonth = clicksMonth.reduce((s: number, c: any) => s + (Number(c.cpc_value) || 0), 0);
  const cpcEstAllTime = (allClicks.data || []).reduce((s: number, c: any) => s + (Number(c.cpc_value) || 0), 0);

  return NextResponse.json({
    mrr: +mrr.toFixed(2),
    arr: +arr.toFixed(2),
    activeSubs: active.length,
    // Referral telemetry — counts are real; CPC dollar values are estimates, NOT revenue.
    referralClicksMonth: clicksMonth.length,
    referralClicksAllTime: totalClicksAllTime,
    referralCpcEstMonth: +cpcEstMonth.toFixed(2),
    referralCpcEstAllTime: +cpcEstAllTime.toFixed(2),
    expensesMonth: +expMonth.toFixed(2),
    // Realized net only: subscriptions minus spend. Estimates never included.
    netMonth: +(mrr - expMonth).toFixed(2),
    ledgerCashAllTime: +ledgerCash.toFixed(2),
    ledgerSettledMonth: +ledgerSettledMonth.toFixed(2),
    subBreakdown: active.map((s: any) => ({
      company: s.recruiters?.company_name || '—',
      tier: s.tier,
      usd: +toUSD(s.amount_minor || 0, s.currency, s.fx_to_usd).toFixed(2),
      currency: s.currency
    })),
    referralsByCountry: Object.entries(byCountry).map(([country, v]) => ({
      country,
      clicks: v.clicks,
      cpcEst: +v.usd.toFixed(2)
    })).sort((a, b) => b.cpcEst - a.cpcEst),
    recentClicks: (allClicks.data || []).slice(0, 50),
    ledger: ledger.data || [],
    fxNote: 'FX rates are approximations; reconcile MRR/cash against Paystack + bank statements. Job-click CPC values are estimates for telemetry — affiliate income is recognized only when settled in the ledger.',
  });
}