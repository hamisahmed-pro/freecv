"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Users, DollarSign, TrendingUp, Briefcase, Headphones, FileText, Settings as Cog,
  BarChart3, Plus, Search, Mail, Globe, Building2, ArrowRight, ArrowLeft,
  Inbox, Wallet, Target, Activity, MousePointerClick, Layers, Cpu, CheckCircle, AlertCircle, RefreshCw,
  Trash, Settings, Laptop, Smartphone, Tablet, ExternalLink, Download, Eye, Check, X, ShieldCheck, MapPin, Filter
} from "lucide-react";
import toast from "react-hot-toast";
import { useAdminTheme } from "./admin/theme";
import { cn, CountUp, Reveal } from "./admin/motion";
import { Card, Kpi, Pill, Btn, Field, Input, TextArea, Select, Switch, Modal, Drawer, Table, Row, Cell, SectionLabel, EmptyState, Spinner } from "./admin/ui";
import { LineChart, RadialGauge, Donut, Heatmap, Bars, Sparkline } from "./admin/charts";
import { analyzeSessionQuality, computeFunnel } from "@/lib/analytics-quality";

const api = (u: string, o?: RequestInit) =>
  fetch(u, { ...o, headers: { "Content-Type": "application/json", ...(o?.headers || {}) } })
    .then((r) => r.json().then((j) => ({ ok: r.ok, status: r.status, ...j })));
const usd = (n: number) => `$${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* shared analytics helpers */
function dailySeries(events: any[], days = 14) {
  const m: Record<string, number> = {};
  for (let i = days - 1; i >= 0; i--) m[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
  events.forEach((e) => { const d = (e.created_at || "").slice(0, 10); if (d in m) m[d]++; });
  return Object.entries(m);
}
function groupBy(events: any[], key: string) {
  return events.reduce((acc: Record<string, number>, x) => { const v = x[key] || "Unknown"; acc[v] = (acc[v] || 0) + 1; return acc; }, {});
}
const topN = (o: Record<string, number>, n = 7) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);

/* ============================ OVERVIEW ============================ */
export function OverviewTab({ candidates, analytics, aiLogs }: { candidates: any[]; analytics: any[]; aiLogs: any[] }) {
  const { t } = useAdminTheme();
  const [o, setO] = useState<any>(null);
  useEffect(() => { api("/api/admin/overview").then(setO).catch(() => {}); }, []);

  // Bot filtering (2026-10-01): scripted sessions firing hundreds of back-to-back
  // events polluted every aggregate. All overview math below runs on human events;
  // raw events are untouched in storage and still visible in the Event Log tab.
  const quality = useMemo(() => analyzeSessionQuality(analytics), [analytics]);
  const human = quality.humanEvents;

  const days = useMemo(() => dailySeries(human, 14), [human]);
  const visits = days.map(([, v]) => v);
  const visitLabels = days.map(([d]) => d.slice(5));
  // Session-based funnel (2026-10-01 fix): each stage counts UNIQUE SESSIONS, not
  // raw events — one session can contribute at most 1 per stage. Download stage
  // accepts both milestone_downloaded (builder docx/pdf) and resume_downloaded.
  const funnel = useMemo(() => computeFunnel(human), [human]);
  const optIns = candidates.length;
  const optConv = funnel.sessions ? Math.round((optIns / funnel.sessions) * 100) : 0;
  const dlConv = Math.round(funnel.downloadRate * 100);
  const startConv = Math.round(funnel.startRate * 100);

  const optSpark = useMemo(() => {
    const m: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) m[new Date(Date.now() - i * 864e5).toISOString().slice(0, 10)] = 0;
    candidates.forEach((c) => { const d = (c.opted_in_at || c.created_at || "").slice(0, 10); if (d in m) m[d]++; });
    return Object.values(m);
  }, [candidates]);

  const device = useMemo(() => groupBy(human, "device_type"), [human]);

  return (
    <div className="space-y-7">
      {/* 4 core metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal><Kpi label="Talent pool" value={<CountUp to={candidates.length} />} sub={`${candidates.filter(c => c.consent_recruiter_share).length} recruiter-ready`} accent={t.cob} icon={<Users size={16} />} spark={optSpark} /></Reveal>
        <Reveal delay={60}><Kpi label="MRR (seats)" value={<CountUp to={o?.mrr || 0} prefix="$" decimals={0} />} sub="subscriptions" accent={t.green} icon={<DollarSign size={16} />} delta={o?.mrr ? 12 : 0} /></Reveal>
        <Reveal delay={120}><Kpi label="Job CPC run-rate" value={<CountUp to={o?.affiliateRun || 0} prefix="$" decimals={0} />} sub={`${usd(o?.affiliateMonth || 0)} MTD`} accent={t.gold} icon={<MousePointerClick size={16} />} /></Reveal>
        <Reveal delay={180}><Kpi label="Total visits (30d)" value={<CountUp to={funnel.sessions} />} sub={`${human.length.toLocaleString()} events · ${quality.botSessionCount} bot-like sessions excluded`} accent={t.verm} icon={<Activity size={16} />} /></Reveal>
      </div>

      {/* Traffic line + Funnel side-by-side */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2">
          <Card className="p-5">
            <SectionLabel color={t.cob}>traffic · last 14 days</SectionLabel>
            <LineChart data={visits} labels={visitLabels} color={t.cob} height={200} />
          </Card>
        </Reveal>
        <Reveal delay={100}>
          <Card className="p-5">
            <SectionLabel color={t.green}>conversion funnel</SectionLabel>
            <div className="space-y-3 pt-1">
              {[
                { label: "Sessions", count: funnel.sessions, pct: 100, color: t.muted },
                { label: "Started CV", count: funnel.started, pct: startConv, color: t.cob },
                { label: "Downloaded CV", count: funnel.downloaded, pct: dlConv, color: t.green },
                { label: "Talent Pool Opt-in", count: optIns, pct: optConv, color: t.gold },
              ].map((step) => (
                <div key={step.label} className="space-y-1">
                  <div className="flex justify-between fm text-[11px]">
                    <span style={{ color: t.muted }}>{step.label}</span>
                    <span className="font-bold" style={{ color: step.color }}>{step.count.toLocaleString()} ({step.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden" style={{ background: t.inset }}>
                    <div className="h-full transition-all duration-700" style={{ width: `${Math.min(100, step.pct)}%`, background: step.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="pt-3 text-[10px]" style={{ color: t.faint }}>Unique sessions per stage · {quality.botSessionCount} bot-like sessions excluded</p>
          </Card>
        </Reveal>
      </div>

      {/* Talent snapshot / Devices / Pipeline */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal><Card className="p-5"><SectionLabel color={t.verm}>talent pool</SectionLabel>
          <div className="space-y-3">
            <div className="flex justify-between fm text-[11px]"><span style={{ color: t.muted }}>Total candidates</span><b style={{ color: t.text }}>{Math.max(candidates.length, o?.candidates || 0).toLocaleString()}</b></div>
            <Bars data={[{ label: "recruiter-consented", value: o?.consented ?? candidates.filter(c => c.consent_recruiter_share).length }, { label: "total", value: Math.max(candidates.length, o?.candidates || 0) }]} color={t.verm} />
          </div></Card></Reveal>
        <Reveal delay={80}><Card className="p-5"><SectionLabel color={t.cob}>devices</SectionLabel>
          {Object.keys(device).length ? <Donut segments={topN(device, 4).map(([k, v]) => ({ label: k, value: v, color: k === "mobile" ? t.cob : k === "desktop" ? t.green : t.gold }))} size={132} thickness={22} /> : <p className="fb text-sm" style={{ color: t.faint }}>No data.</p>}</Card></Reveal>
        <Reveal delay={120}><Card className="p-5"><SectionLabel color={t.gold}>pipeline by stage</SectionLabel>
          {o?.pipelineStages && Object.keys(o.pipelineStages).length ? <Bars data={Object.entries(o.pipelineStages).map(([k, v]) => ({ label: k, value: v as number }))} color={t.gold} /> : <p className="fb text-sm" style={{ color: t.faint }}>No deals yet.</p>}</Card></Reveal>
      </div>
    </div>
  );
}

/* ============================ ANALYTICS ============================ */
export function AnalyticsTab({ analytics }: { analytics: any[] }) {
  const { t } = useAdminTheme();
  // Same bot filter as Overview — breakdowns must describe humans, not scripts.
  const quality = useMemo(() => analyzeSessionQuality(analytics), [analytics]);
  const human = quality.humanEvents;
  const days = useMemo(() => dailySeries(human, 30), [human]);
  const visits = days.map(([, v]) => v);
  const labels = days.map(([d]) => d.slice(5));
  const countries = useMemo(() => topN(groupBy(human, "country"), 8), [human]);
  const templates = useMemo(() => topN(groupBy(human, "template_id"), 7), [human]);
  const browsers = useMemo(() => topN(groupBy(human, "browser"), 6), [human]);

  const heat = useMemo(() => {
    const g = Array.from({ length: 7 }, () => [0, 0, 0, 0]);
    human.forEach((e) => {
      const d = new Date(e.created_at); if (isNaN(d.getTime())) return;
      const wd = (d.getDay() + 6) % 7; const dp = Math.min(3, Math.floor(d.getHours() / 6));
      g[wd][dp]++;
    });
    const flat = g.flat(); const max = Math.max(1, ...flat);
    return { grid: flat.map((v) => v / max), cols: 4 };
  }, [human]);
  const rowLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-7">
      <Reveal><SectionLabel>traffic · 30 days</SectionLabel>
        <p className="fm pb-2 text-[11px]" style={{ color: t.faint }}>{quality.botSessionCount} bot-like sessions ({quality.botEventCount.toLocaleString()} events) excluded</p>
        <Card className="p-5"><LineChart data={visits} labels={labels} color={t.cob} height={260} /></Card></Reveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2"><Card className="p-5"><SectionLabel color={t.green}>activity heatmap · weekday × time</SectionLabel>
          <Heatmap grid={heat.grid} cols={heat.cols} rowLabels={rowLabels} color={t.green} /></Card></Reveal>
        <Reveal delay={80}><Card className="p-5"><SectionLabel color={t.verm}>top countries</SectionLabel>
          <Bars data={countries.map(([k, v]) => ({ label: k, value: v }))} color={t.verm} /></Card></Reveal>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Reveal><Card className="p-5"><SectionLabel color={t.gold}>templates used</SectionLabel>
          <Bars data={templates.map(([k, v]) => ({ label: k, value: v }))} color={t.gold} /></Card></Reveal>
        <Reveal delay={80}><Card className="p-5"><SectionLabel color={t.cob}>browsers</SectionLabel>
          <Bars data={browsers.map(([k, v]) => ({ label: k, value: v }))} color={t.cob} /></Card></Reveal>
      </div>
    </div>
  );
}

/* ============================ EVENT LOG ============================ */
export function EventLogTab({ events = [] }: { events?: any[] }) {
  const { t } = useAdminTheme();
  const [page, setPage] = useState(1);
  const pageSize = 50;
  // Bot-like sessions stay visible here (this is the raw log) but get flagged.
  const quality = useMemo(() => analyzeSessionQuality(events), [events]);
  const isBot = (e: any) => quality.botSessions.has(e?.session_id || 'unknown');
  const totalPages = Math.max(1, Math.ceil(events.length / pageSize));
  const rows = useMemo(() => events.slice((page - 1) * pageSize, page * pageSize), [events, page]);
  useEffect(() => { setPage(1); }, [events.length]);
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal><SectionLabel color={t.cob}>event log · raw analytics events</SectionLabel>
          <p className="fm text-[11px] uppercase tracking-widest" style={{ color: t.muted }}>{events.length.toLocaleString()} events captured · {quality.botSessionCount} bot-like sessions flagged</p></Reveal>
      </div>
      {rows.length === 0 ? <Card><EmptyState icon={<Activity size={32} />} title="No events logged yet." hint="Events are captured from site traffic automatically." /></Card> :
        <>
          <Table head={["Time", "Event", "Template", "Location", "Device", "Browser", "Session"]}>
            {rows.map((e, i) => (
              <Row key={e.id || i}>
                <Cell className="fm text-[11px]" style={{ color: t.faint }}>{(e.created_at || "").slice(0, 19).replace("T", " ")}</Cell>
                <Cell><Pill color={t.cob}>{e.event_type || "—"}</Pill>{isBot(e) && <span className="ml-1"><Pill color={t.gold}>bot</Pill></span>}</Cell>
                <Cell className="fm text-[11px]">{e.template_id || "—"}</Cell>
                <Cell className="fm text-[11px]">{[e.city, e.country].filter(Boolean).join(", ") || "—"}</Cell>
                <Cell className="fm text-[11px] capitalize">{e.device_type || "—"}</Cell>
                <Cell className="fm text-[11px]">{e.browser || "—"}</Cell>
                <Cell className="fm text-[10px]" style={{ color: t.faint }}>{(e.session_id || "").slice(0, 12)}</Cell>
              </Row>
            ))}
          </Table>
          <div className="flex items-center justify-between pt-2">
            <div className="fm text-xs" style={{ color: t.muted }}>
              Showing {Math.min((page - 1) * pageSize + 1, events.length)}–{Math.min(page * pageSize, events.length)} of {events.length.toLocaleString()} events
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-xs py-1 px-2.5"><ArrowLeft size={13} /> Prev</Btn>
              <span className="fm text-xs font-bold px-1" style={{ color: t.text }}>{page} / {totalPages}</span>
              <Btn variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-xs py-1 px-2.5">Next <ArrowRight size={13} /></Btn>
            </div>
          </div>
        </>}
    </div>
  );
}

/* ============================ AI USAGE ============================ */
export function AiUsageTab({ logs = [] }: { logs?: any[] }) {
  const { t } = useAdminTheme();
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const rows = useMemo(() => logs.slice((page - 1) * pageSize, page * pageSize), [logs, page]);
  useEffect(() => { setPage(1); }, [logs.length]);
  const totalCost = logs.reduce((s, l) => s + (Number(l.cost_estimate) || 0), 0);
  const features = new Set(logs.map((l) => l.feature).filter(Boolean)).size;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal><Kpi label="AI calls" value={<CountUp to={logs.length} />} accent={t.cob} icon={<Cpu size={16} />} /></Reveal>
        <Reveal delay={60}><Kpi label="Est. cost" value={<CountUp to={totalCost} prefix="$" decimals={2} />} accent={t.verm} icon={<DollarSign size={16} />} /></Reveal>
        <Reveal delay={120}><Kpi label="Cache hits" value={<CountUp to={logs.filter((l) => l.cache_hit).length} />} accent={t.green} icon={<CheckCircle size={16} />} /></Reveal>
        <Reveal delay={180}><Kpi label="Features used" value={<CountUp to={features} />} accent={t.gold} icon={<Layers size={16} />} /></Reveal>
      </div>
      <Reveal><SectionLabel color={t.verm}>ai usage log</SectionLabel>
        <p className="fm text-[11px] uppercase tracking-widest" style={{ color: t.muted }}>{logs.length.toLocaleString()} calls recorded</p></Reveal>
      {rows.length === 0 ? <Card><EmptyState icon={<Cpu size={32} />} title="No AI usage recorded." hint="AI calls are logged automatically with cost estimates." /></Card> :
        <>
          <Table head={["Time", "Feature", "Endpoint", "Tokens in/out", "Est. cost", "Cache"]}>
            {rows.map((l, i) => (
              <Row key={l.id || i}>
                <Cell className="fm text-[11px]" style={{ color: t.faint }}>{(l.created_at || "").slice(0, 19).replace("T", " ")}</Cell>
                <Cell><Pill color={t.verm}>{l.feature || "—"}</Pill></Cell>
                <Cell className="fm text-[11px]">{l.endpoint || "—"}</Cell>
                <Cell className="fm text-[11px]">{(l.input_tokens ?? l.prompt_tokens ?? 0).toLocaleString()} / {(l.output_tokens ?? l.completion_tokens ?? 0).toLocaleString()}</Cell>
                <Cell style={{ color: t.verm }}>${(Number(l.cost_estimate) || 0).toFixed(4)}</Cell>
                <Cell>{l.cache_hit ? <Pill color={t.green}>hit</Pill> : <span style={{ color: t.faint }}>miss</span>}</Cell>
              </Row>
            ))}
          </Table>
          <div className="flex items-center justify-between pt-2">
            <div className="fm text-xs" style={{ color: t.muted }}>
              Showing {Math.min((page - 1) * pageSize + 1, logs.length)}–{Math.min(page * pageSize, logs.length)} of {logs.length.toLocaleString()} calls
            </div>
            <div className="flex items-center gap-2">
              <Btn variant="ghost" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="text-xs py-1 px-2.5"><ArrowLeft size={13} /> Prev</Btn>
              <span className="fm text-xs font-bold px-1" style={{ color: t.text }}>{page} / {totalPages}</span>
              <Btn variant="ghost" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="text-xs py-1 px-2.5">Next <ArrowRight size={13} /></Btn>
            </div>
          </div>
        </>}
    </div>
  );
}

/* ============================ TALENT POOL ============================ */
export function TalentTab({ candidates: initialCandidates = [] }: { candidates?: any[] }) {
  const { t } = useAdminTheme();
  const [candidatesList, setCandidatesList] = useState<any[]>(initialCandidates);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [consentFilter, setConsentFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [detail, setDetail] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Sync from prop changes if any
  useEffect(() => {
    if (initialCandidates && initialCandidates.length > 0) {
      setCandidatesList(initialCandidates);
    }
  }, [initialCandidates]);

  // Live fetch freshest candidates on mount and on-demand
  const fetchLiveTalent = () => {
    setLoading(true);
    api("/api/admin/talent")
      .then((res) => {
        if (res?.candidates && Array.isArray(res.candidates)) {
          setCandidatesList(res.candidates);
        } else if (res?.error) {
          toast.error(`Talent load failed: ${res.error}`);
        }
      })
      .catch((err) => {
        console.error("Talent fetch error:", err);
        toast.error("Talent load failed — check your connection and retry.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLiveTalent();
  }, []);

  const countries = useMemo(() => Array.from(new Set(candidatesList.map((c) => c.country).filter(Boolean))).sort() as string[], [candidatesList]);
  
  const filtered = useMemo(() => {
    return candidatesList.filter((c) => {
      const matchCountry = !country || c.country === country;
      const matchConsent = consentFilter === "all" ? true :
        consentFilter === "consented" ? !!c.consent_recruiter_share : !c.consent_recruiter_share;
      const matchDevice = deviceFilter === "all" ? true :
        (c.device_type || "desktop").toLowerCase() === deviceFilter.toLowerCase();
      const skillsStr = Array.isArray(c.skills) ? c.skills.map((s: any) => typeof s === 'string' ? s : s?.name || '').join(' ') : '';
      const term = `${c.full_name || ''} ${c.current_title || ''} ${c.email || ''} ${c.city || ''} ${skillsStr}`.toLowerCase();
      const matchQuery = !q || q.toLowerCase().split(/\s+/).every(w => term.includes(w));
      return matchCountry && matchConsent && matchDevice && matchQuery;
    });
  }, [candidatesList, q, country, consentFilter, deviceFilter]);

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [q, country, consentFilter, deviceFilter, pageSize]);

  const consented = candidatesList.filter((c) => c.consent_recruiter_share).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const exportCSV = () => {
    const rows = [
      ["Email", "Full Name", "Title", "Category", "Country", "City", "Device", "Exp (yrs)", "Completeness", "Recruiter Consent", "Email Jobs Consent", "Opted In Date"],
      ...filtered.map((c) => [
        c.email,
        c.full_name,
        c.current_title,
        c.title_category || "",
        c.country,
        c.city || c.location || "",
        c.device_type || "desktop",
        c.experience_years,
        c.completeness_score,
        c.consent_recruiter_share ? "yes" : "no",
        c.consent_email_jobs ? "yes" : "no",
        (c.opted_in_at || c.created_at || "").slice(0, 19).replace("T", " ")
      ])
    ];
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows.map((r: any[]) => r.map((v: any) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n")], { type: "text/csv" }));
    a.download = `cvyon_talent_pool_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const getDeviceIcon = (dev?: string) => {
    const d = (dev || "desktop").toLowerCase();
    if (d === "mobile") return <Smartphone size={13} className="text-blue-500" />;
    if (d === "tablet") return <Tablet size={13} className="text-purple-500" />;
    return <Laptop size={13} className="text-emerald-500" />;
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal><Kpi label="Talent pool size" value={<CountUp to={candidatesList.length} />} accent={t.cob} icon={<Users size={16} />} /></Reveal>
        <Reveal delay={60}><Kpi label="Recruiter-consented" value={<CountUp to={consented} />} accent={t.green} gauge={{ value: candidatesList.length ? (consented / candidatesList.length) * 100 : 0 }} /></Reveal>
        <Reveal delay={120}><Kpi label="Avg completeness" value={<CountUp to={candidatesList.length ? Math.round(candidatesList.reduce((s, c) => s + (c.completeness_score || 0), 0) / candidatesList.length) : 0} suffix="%" />} accent={t.gold} /></Reveal>
        <Reveal delay={180}><Kpi label="Countries represented" value={<CountUp to={countries.length} />} accent={t.verm} icon={<Globe size={16} />} /></Reveal>
      </div>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal>
          <SectionLabel color={t.verm}>talent pool CRM & candidate telemetry</SectionLabel>
          <p className="fm text-[11px] uppercase tracking-widest" style={{ color: t.muted }}>{filtered.length} of {candidatesList.length} candidates visible</p>
        </Reveal>
        <div className="flex items-center gap-2">
          <Btn variant="ghost" onClick={fetchLiveTalent} className="text-xs">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
          </Btn>
          <Btn variant="ghost" onClick={exportCSV} className="text-xs">
            <Download size={14} /> Export CSV
          </Btn>
        </div>
      </div>

      {/* Filter toolbar */}
      <Card className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.faint }} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search candidate, title, skills..." className="!pl-9 text-xs" />
        </div>
        <Select value={country} onChange={(e) => setCountry(e.target.value)} className="text-xs">
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select value={consentFilter} onChange={(e) => setConsentFilter(e.target.value)} className="text-xs">
          <option value="all">All Consents</option>
          <option value="consented">Recruiter Consented (Yes)</option>
          <option value="opted_out">Opted Out (No)</option>
        </Select>
        <Select value={deviceFilter} onChange={(e) => setDeviceFilter(e.target.value)} className="text-xs">
          <option value="all">All Devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </Select>
      </Card>

      {loading && candidatesList.length === 0 ? (
        <Card className="p-8 text-center"><Spinner /></Card>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<Users size={32} />} title="No candidates match your filters." hint="Candidates who create or download a CV appear here automatically." /></Card>
      ) : (
        <>
          <Table head={["Candidate", "Title / Category", "Location", "Device", "Exp", "Score", "Consent", "Opted In", ""]}>
            {paginatedList.map((c) => (
              <Row key={c.id || c.email} onClick={() => setDetail(c)}>
                <Cell>
                  <div className="font-semibold" style={{ color: t.text }}>{c.full_name || "Anonymous Candidate"}</div>
                  <div className="fm text-[11px]" style={{ color: t.faint }}>{c.email || "No email"}</div>
                </Cell>
                <Cell>
                  <div>{c.current_title || "—"}</div>
                  {c.title_category && <div className="fm text-[10px]" style={{ color: t.muted }}>{c.title_category}</div>}
                </Cell>
                <Cell>
                  <div className="flex items-center gap-1">
                    <span>{c.country || "—"}</span>
                    {c.city && <span className="fm text-[10px]" style={{ color: t.faint }}>({c.city})</span>}
                  </div>
                </Cell>
                <Cell>
                  <div className="flex items-center gap-1.5 fm text-xs">
                    {getDeviceIcon(c.device_type)}
                    <span className="capitalize">{c.device_type || "desktop"}</span>
                  </div>
                </Cell>
                <Cell className="fm text-[12px]">{c.experience_years ? `${c.experience_years}y` : "—"}</Cell>
                <Cell><span className="fm text-[11px] font-bold" style={{ color: (c.completeness_score || 0) >= 80 ? t.green : t.gold }}>{c.completeness_score ?? 0}%</span></Cell>
                <Cell>{c.consent_recruiter_share ? <Pill color={t.green}>yes</Pill> : <Pill color={t.verm}>no</Pill>}</Cell>
                <Cell><span className="fm text-[11px]" style={{ color: t.faint }}>{(c.opted_in_at || c.created_at || "").slice(0, 10) || "—"}</span></Cell>
                <Cell>
                  <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); setDetail(c); }} className="text-xs py-1 px-2.5">
                    <Eye size={13} /> View
                  </Btn>
                </Cell>
              </Row>
            ))}
          </Table>

          {/* Pagination Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="fm text-xs" style={{ color: t.muted }}>
              Showing {Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)} of {filtered.length} candidates
            </div>
            <div className="flex items-center gap-2">
              <Select value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} className="w-24 text-xs py-1">
                <option value="25">25 / page</option>
                <option value="50">50 / page</option>
                <option value="100">100 / page</option>
              </Select>
              <Btn variant="ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="text-xs py-1 px-2.5">
                <ArrowLeft size={13} /> Prev
              </Btn>
              <span className="fm text-xs font-bold px-1" style={{ color: t.text }}>
                {page} / {totalPages}
              </span>
              <Btn variant="ghost" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="text-xs py-1 px-2.5">
                Next <ArrowRight size={13} />
              </Btn>
            </div>
          </div>
        </>
      )}

      {/* Candidate Details Modal - Centered on all screens with multiple close options */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.full_name || detail?.email || "Candidate Details"} wide>
        {detail && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill color={detail.consent_recruiter_share ? t.green : t.verm}>
                {detail.consent_recruiter_share ? "Recruiter Consent: Agreed" : "Recruiter Consent: Opted Out"}
              </Pill>
              {detail.consent_email_jobs !== undefined && (
                <Pill color={detail.consent_email_jobs ? t.green : t.muted}>
                  {detail.consent_email_jobs ? "Job Alerts: Subscribed" : "Job Alerts: Opted Out"}
                </Pill>
              )}
              {detail.country && <Pill><Globe size={11} /> {detail.country}</Pill>}
              {detail.device_type && (
                <Pill color={t.cob}>
                  {getDeviceIcon(detail.device_type)} <span className="capitalize">{detail.device_type}</span>
                </Pill>
              )}
              {detail.completeness_score && <Pill color={t.gold}>{detail.completeness_score}% Complete</Pill>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 fb text-sm p-4 border-[2px] rounded-lg" style={{ borderColor: t.border, background: t.surface2 }}>
              {[
                ["Full Name", detail.full_name],
                ["Email", detail.email],
                ["Job Title", detail.current_title],
                ["Location / City", detail.city || detail.location || "—"],
                ["Country", detail.country || "—"],
                ["Device Type", detail.device_type || "desktop"],
                ["Experience", detail.experience_years ? `${detail.experience_years} years` : "—"],
                ["Industry / Category", detail.title_category || "—"],
                ["Opt-in Date", (detail.opted_in_at || detail.created_at || "").slice(0, 19).replace("T", " ")],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <div className="fm text-[10px] uppercase tracking-widest" style={{ color: t.muted }}>{k}</div>
                  <div className="mt-0.5 break-words font-medium" style={{ color: t.text }}>{(v as string) || "—"}</div>
                </div>
              ))}
            </div>

            {Array.isArray(detail.skills) && detail.skills.length > 0 && (
              <div>
                <div className="fm text-[10px] uppercase tracking-widest mb-2" style={{ color: t.muted }}>Skills & Tech Stack</div>
                <div className="flex flex-wrap gap-1.5">
                  {detail.skills.map((sk: any, i: number) => {
                    const name = typeof sk === "string" ? sk : sk?.name;
                    return name ? <Pill key={i} color={t.cob}>{name}</Pill> : null;
                  })}
                </div>
              </div>
            )}

            {detail.resume_data && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="fm text-[10px] uppercase tracking-widest" style={{ color: t.muted }}>Structured Resume Data</div>
                  <Btn variant="ghost" className="text-[10px] py-0.5 px-2" onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(detail.resume_data, null, 2));
                    toast.success("Resume JSON copied to clipboard");
                  }}>
                    Copy JSON
                  </Btn>
                </div>
                <pre className="p-3 border-2 rounded fm text-[11px] leading-relaxed overflow-x-auto max-h-52" style={{ borderColor: t.border, background: t.inset, color: t.text }}>
                  {JSON.stringify(detail.resume_data, null, 2)}
                </pre>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t-2" style={{ borderColor: t.border }}>
              <Btn variant="primary" onClick={() => setDetail(null)} className="px-6 py-2 text-xs">
                Close
              </Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ============================ RECRUITERS ============================ */
const emptyRec = { email: "", company_name: "", contact_name: "", contact_email: "", phone: "", website: "", location: "", country: "", company_size: "", industry: "", notes: "", grant: false, days: 30, tier: "pro" };
/* Whitelist of editable recruiters-table columns for PATCH. The GET returns a nested
   `subscriptions` array (and id/user_id/api key/meta keys) — sending any of those to
   PostgREST makes it reject the whole update with a 500. */
const RECRUITER_EDIT_COLS = ["company_name", "contact_name", "contact_email", "phone", "website", "location", "country", "company_size", "industry", "notes", "status"];
/* Comp/trial grants are written with a `manual_<hex>` paystack_subscription_code
   (see POST /api/admin/recruiters) — badge them so they aren't mistaken for paid seats. */
const isCompTrial = (s: any) => typeof s?.paystack_subscription_code === "string" && s.paystack_subscription_code.startsWith("manual_");
export function RecruitersTab() {
  const { t } = useAdminTheme();
  const [recs, setRecs] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(""); const [onboard, setOnboard] = useState(false); const [form, setForm] = useState<any>(emptyRec);
  const [detail, setDetail] = useState<any>(null); const [edit, setEdit] = useState<any>(null); const [creds, setCreds] = useState<any>(null);
  const load = () => { setLoading(true); api("/api/admin/recruiters").then((j) => { setRecs(j.recruiters || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const submit = async () => {
    const r = await api("/api/admin/recruiters", { method: "POST", body: JSON.stringify({ ...form, grant_subscription: form.grant ? { tier: form.tier, days: Number(form.days), amount_minor: form.tier === "pro" ? 9900 : 4900, currency: "USD" } : undefined }) });
    if (!r.ok) return toast.error(r.error || "Onboard failed");
    toast.success("Recruiter onboarded"); setCreds({ email: form.email, pw: r.temp_password }); setForm(emptyRec); setOnboard(false); load();
  };
  const saveEdit = async () => {
    const payload: Record<string, any> = {};
    for (const k of RECRUITER_EDIT_COLS) if (k in edit) payload[k] = edit[k];
    const r = await api(`/api/admin/recruiters/${edit.id}`, { method: "PATCH", body: JSON.stringify(payload) });
    if (r.ok) { toast.success("Saved"); setDetail({ ...detail, ...edit }); setEdit(null); load(); } else toast.error(r.error || "Save failed");
  };
  const filtered = recs.filter((r) => `${r.company_name} ${r.contact_email} ${r.contact_name}`.toLowerCase().includes(q.toLowerCase()));
  const statusMix = useMemo(() => {
    let active = 0, pending = 0, churned = 0;
    recs.forEach((r) => {
      if (r.status === "churned") churned++;
      else if ((r.subscriptions || []).some((s: any) => s.status === "active")) active++;
      else pending++;
    });
    return { active, pending, churned };
  }, [recs]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2"><div className="grid grid-cols-3 gap-4">
          <Kpi label="Total" value={<CountUp to={recs.length} />} accent={t.cob} icon={<Building2 size={16} />} />
          <Kpi label="Active" value={<CountUp to={statusMix.active} />} accent={t.green} />
          <Kpi label="Churned" value={<CountUp to={statusMix.churned} />} accent={t.verm} />
        </div></Reveal>
        <Reveal delay={80}><Card className="flex h-full flex-col justify-center p-5"><SectionLabel color={t.gold}>status mix</SectionLabel>
          <Donut segments={[{ label: "active", value: statusMix.active, color: t.green }, { label: "pending", value: statusMix.pending, color: t.gold }, { label: "churned", value: statusMix.churned, color: t.verm }]} size={120} thickness={20} /></Card></Reveal>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal><SectionLabel color={t.green}>recruiters</SectionLabel></Reveal>
        <Btn onClick={() => setOnboard(true)}><Plus size={14} /> Onboard recruiter</Btn>
      </div>
      <Card className="p-4"><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.faint }} /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or contact" className="!pl-9" /></div></Card>
      {loading ? <Spinner /> : filtered.length === 0 ? <Card><EmptyState icon={<Building2 size={32} />} title="No recruiters yet." hint="Onboard your first design partner above." /></Card> :
        <Table head={["Company", "Contact", "Status", "Plan", "API", "Joined", ""]}>{filtered.map((r) => {
          const subs = r.subscriptions || [];
          const activeSub = subs.find((s: any) => s.status === "active");
          const active = !!activeSub;
          return <Row key={r.id} onClick={() => setDetail(r)}>
            <Cell className="font-semibold">{r.company_name}</Cell>
            <Cell><div>{r.contact_name || "—"}</div><div className="fm text-[11px]" style={{ color: t.faint }}>{r.contact_email || r.email || "—"}</div></Cell>
            <Cell><Pill color={r.status === "churned" ? t.verm : active ? t.green : t.gold}>{r.status === "churned" ? "churned" : active ? "active" : "pending"}</Pill></Cell>
            <Cell>{active ? <span className="inline-flex items-center gap-1.5"><Pill color={t.cob}>{activeSub?.tier || "—"}</Pill>{isCompTrial(activeSub) && <Pill color={t.gold}>COMP</Pill>}</span> : <span style={{ color: t.faint }}>—</span>}</Cell>
            <Cell className="fm text-[11px]">{r.api_calls_count || 0}</Cell>
            <Cell className="fm text-[11px]" style={{ color: t.faint }}>{(r.created_at || "").slice(0, 10)}</Cell>
            <Cell><button onClick={(e) => { e.stopPropagation(); setEdit({ ...r }); }} className="p-1" style={{ color: t.muted }}><Settings size={14} /></button></Cell>
          </Row>; })}</Table>}

      <Modal open={onboard} onClose={() => { setOnboard(false); setCreds(null); }} title="Onboard recruiter" wide>
        {creds ? (
          <div className="space-y-4">
            <div className="border-[3px] p-4" style={{ borderColor: t.green }}><Mail style={{ color: t.green }} className="mb-2" size={20} /><p className="fd text-lg" style={{ color: t.text }}>Account created</p>
              <p className="mt-1 fb text-sm" style={{ color: t.muted }}>Send these credentials to <b>{creds.email}</b> — shown only once.</p></div>
            <Field label="Temporary password"><div className="flex gap-2"><Input readOnly value={creds.pw} /><Btn variant="ghost" onClick={() => { navigator.clipboard.writeText(creds.pw); toast.success("Copied"); }}>Copy</Btn></div></Field>
            <Btn onClick={() => setCreds(null)}>Done</Btn>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Login email *"><Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="hire@company.com" /></Field>
            <Field label="Company name *"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
            <Field label="Contact name"><Input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></Field>
            <Field label="Contact email"><Input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></Field>
            <Field label="Phone"><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Website"><Input value={form.website} onChange={(e) => set("website", e.target.value)} /></Field>
            <Field label="Location"><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></Field>
            <Field label="Country"><Input value={form.country} onChange={(e) => set("country", e.target.value)} /></Field>
            <Field label="Company size"><Select value={form.company_size} onChange={(e) => set("company_size", e.target.value)}><option value="">—</option>{["1-10", "11-50", "51-200", "201-1000", "1000+"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Industry"><Input value={form.industry} onChange={(e) => set("industry", e.target.value)} /></Field>
            <div className="sm:col-span-2 flex items-center justify-between border-2 p-3" style={{ borderColor: t.border }}><span className="fb text-sm" style={{ color: t.text }}>Grant a trial / comp subscription</span><Switch on={form.grant} onChange={(v) => set("grant", v)} /></div>
            {form.grant && <><Field label="Tier"><Select value={form.tier} onChange={(e) => set("tier", e.target.value)}><option value="pro">pro</option><option value="basic">basic</option></Select></Field><Field label="Days"><Input type="number" value={form.days} onChange={(e) => set("days", e.target.value)} /></Field></>}
            <div className="sm:col-span-2"><Field label="Notes"><TextArea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
            <div className="sm:col-span-2 flex justify-end gap-2"><Btn variant="ghost" onClick={() => setOnboard(false)}>Cancel</Btn><Btn onClick={submit}>Create account</Btn></div>
          </div>
        )}
      </Modal>

      <Modal open={!!detail} onClose={() => { setDetail(null); setEdit(null); }} title={detail?.company_name || "Recruiter Details"}>
        {detail && !edit && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill color={detail.status === "churned" ? t.verm : t.green}>{detail.status}</Pill>
              {(detail.subscriptions || []).some((s: any) => s.status === "active") && <Pill color={t.cob}>subscribed</Pill>}
              {detail.country && <Pill><Globe size={11} /> {detail.country}</Pill>}
            </div>
            <div className="grid grid-cols-2 gap-4 fb text-sm">
              {[["Contact", detail.contact_name], ["Email", detail.contact_email || detail.email], ["Phone", detail.phone], ["Website", detail.website], ["Location", detail.location], ["Size", detail.company_size], ["Industry", detail.industry], ["Onboarded by", detail.onboarded_by]].map(([k, v]) => (
                <div key={k as string}>
                  <div className="fm text-[10px] uppercase tracking-widest" style={{ color: t.muted }}>{k}</div>
                  <div className="mt-0.5 break-words" style={{ color: t.text }}>{(v as string) || "—"}</div>
                </div>
              ))}
            </div>
            {detail.notes && (
              <div>
                <div className="fm text-[10px] uppercase tracking-widest" style={{ color: t.muted }}>Notes</div>
                <p className="mt-1 whitespace-pre-wrap fb text-sm" style={{ color: t.text }}>{detail.notes}</p>
              </div>
            )}
            <div>
              <div className="fm text-[10px] uppercase tracking-widest mb-2" style={{ color: t.muted }}>Subscriptions</div>
              {(detail.subscriptions || []).length === 0 ? (
                <p className="fb text-sm" style={{ color: t.faint }}>None active.</p>
              ) : (
                (detail.subscriptions || []).map((s: any) => (
                  <div key={s.id} className="mb-2 flex items-center justify-between border-2 p-3 fb text-sm" style={{ borderColor: t.border }}>
                    <span style={{ color: t.text }}>{s.tier} · {s.currency} {s.amount_minor ? (s.amount_minor / 100) : "—"}</span>
                    <span className="inline-flex items-center gap-1.5">
                      {isCompTrial(s) && <Pill color={t.gold}>COMP</Pill>}
                      <Pill color={s.status === "active" ? t.green : t.muted}>{s.status}</Pill>
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between pt-4 border-t-2" style={{ borderColor: t.border }}>
              <Btn variant="ghost" onClick={() => setEdit({ ...detail })}>
                <Settings size={14} /> Edit details
              </Btn>
              <Btn variant="primary" onClick={() => { setDetail(null); setEdit(null); }}>
                Close
              </Btn>
            </div>
          </div>
        )}
        {edit && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Status"><Select value={edit.status || "active"} onChange={(e) => setEdit({ ...edit, status: e.target.value })}><option value="active">active</option><option value="pending">pending</option><option value="churned">churned</option></Select></Field>
            <Field label="Contact name"><Input value={edit.contact_name || ""} onChange={(e) => setEdit({ ...edit, contact_name: e.target.value })} /></Field>
            <Field label="Contact email"><Input value={edit.contact_email || ""} onChange={(e) => setEdit({ ...edit, contact_email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={edit.phone || ""} onChange={(e) => setEdit({ ...edit, phone: e.target.value })} /></Field>
            <Field label="Website"><Input value={edit.website || ""} onChange={(e) => setEdit({ ...edit, website: e.target.value })} /></Field>
            <Field label="Location"><Input value={edit.location || ""} onChange={(e) => setEdit({ ...edit, location: e.target.value })} /></Field>
            <Field label="Company size"><Input value={edit.company_size || ""} onChange={(e) => setEdit({ ...edit, company_size: e.target.value })} /></Field>
            <Field label="Industry"><Input value={edit.industry || ""} onChange={(e) => setEdit({ ...edit, industry: e.target.value })} /></Field>
            <div className="sm:col-span-2"><Field label="Notes"><TextArea rows={3} value={edit.notes || ""} onChange={(e) => setEdit({ ...edit, notes: e.target.value })} /></Field></div>
            <div className="sm:col-span-2 flex justify-end gap-2"><Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn><Btn onClick={saveEdit}>Save</Btn></div>
          </div>
        )}
      </Modal>
    </div>
  );
}



/* ============================ REVENUE ============================ */
export function RevenueTab() {
  const { t } = useAdminTheme();
  const [r, setR] = useState<any>(null);
  useEffect(() => { api("/api/admin/revenue").then(setR).catch(() => {}); }, []);
  if (!r) return <Spinner />;

  const mix = [
    { label: "Subscriptions (MRR)", value: Math.round(r.mrr), color: t.green },
    { label: "CareerJet CPC (run-rate)", value: Math.round(r.affiliateRun), color: t.gold }
  ];

  return (
    <div className="space-y-7">
      <Reveal><SectionLabel color={t.green}>revenue · reconciled financial performance</SectionLabel></Reveal>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Reveal><Kpi label="MRR" value={<CountUp to={r.mrr} prefix="$" decimals={0} />} sub="recurring seats" accent={t.green} icon={<DollarSign size={16} />} /></Reveal>
        <Reveal delay={60}><Kpi label="ARR" value={<CountUp to={r.arr} prefix="$" decimals={0} />} sub="MRR × 12" accent={t.cob} icon={<TrendingUp size={16} />} /></Reveal>
        <Reveal delay={120}><Kpi label="CareerJet CPC Run-rate" value={<CountUp to={r.affiliateRun} prefix="$" decimals={0} />} sub={`${usd(r.affiliateMonth)} MTD`} accent={t.gold} icon={<MousePointerClick size={16} />} /></Reveal>
        <Reveal delay={180}><Kpi label="Net MTD" value={<CountUp to={r.netMonth} prefix="$" decimals={0} />} sub={`blended ${usd(r.blendedMonthly)}`} accent={r.netMonth >= 0 ? t.green : t.verm} icon={<Wallet size={16} />} delta={r.netMonth >= 0 ? 8 : -8} /></Reveal>
      </div>

      <Reveal>
        <Card className="border-[3px] p-4" style={{ borderColor: t.gold }}>
          <p className="fb text-sm" style={{ color: t.muted }}>
            <b style={{ color: t.gold }}>Reconciliation Policy:</b> {r.fxNote || "Affiliate income is a CPC run-rate from CareerJet job clicks — shown alongside subscription MRR, never folded into it."}
          </p>
        </Card>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Reveal>
          <Card className="p-5">
            <SectionLabel color={t.gold}>revenue mix (monthly)</SectionLabel>
            <Donut segments={mix} size={150} thickness={24} />
          </Card>
        </Reveal>
        <Reveal delay={80}>
          <Card className="p-5">
            <SectionLabel color={t.green}>active recruiter subscriptions</SectionLabel>
            {(!r.subBreakdown || r.subBreakdown.length === 0) ? (
              <p className="fb text-sm" style={{ color: t.faint }}>No active seats.</p>
            ) : (
              <div className="space-y-2">
                {r.subBreakdown.map((s: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b-2 py-2 fb text-sm" style={{ borderColor: t.border }}>
                    <span style={{ color: t.text }}>{s.company} <Pill>{s.tier}</Pill></span>
                    <b style={{ color: t.green }}>{usd(s.usd)}</b>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Reveal>
      </div>

      {/* CareerJet CPC Monetization Card */}
      <Reveal delay={100}>
        <Card className="p-5">
          <div className="flex justify-between items-center mb-3">
            <SectionLabel color={t.gold}>careerjet job clicks cpc by country (mtd)</SectionLabel>
            <Pill color={t.gold}>{r.affiliateClicksMonth ?? 0} clicks MTD</Pill>
          </div>
          {(!r.affByCountry || r.affByCountry.length === 0) ? (
            <p className="fb text-sm" style={{ color: t.faint }}>No job clicks recorded yet this month.</p>
          ) : (
            <div className="space-y-3">
              <Bars data={r.affByCountry.slice(0, 8).map((c: any) => ({ label: `${c.country} · ${c.clicks} clicks`, value: Math.round(c.usd * 100) }))} color={t.gold} />
            </div>
          )}
        </Card>
      </Reveal>

      <Reveal delay={140}>
        <Card className="p-5">
          <SectionLabel>revenue ledger</SectionLabel>
          {(!r.ledger || r.ledger.length === 0) ? (
            <p className="fb text-sm" style={{ color: t.faint }}>No ledger entries.</p>
          ) : (
            <Table head={["Source", "Ref", "Amount", "Status", "When"]}>
              {r.ledger.map((l: any) => (
                <Row key={l.id}>
                  <Cell><Pill>{l.source}</Pill></Cell>
                  <Cell className="fm text-[11px]">{(l.ref || "—").slice(0, 18)}</Cell>
                  <Cell style={{ color: t.green }}>{l.currency} {l.amount_minor / 100}</Cell>
                  <Cell><Pill color={l.status === "settled" ? t.green : t.gold}>{l.status}</Pill></Cell>
                  <Cell className="fm text-[11px]" style={{ color: t.faint }}>{(l.created_at || "").slice(0, 10)}</Cell>
                </Row>
              ))}
            </Table>
          )}
        </Card>
      </Reveal>
    </div>
  );
}

/* ============================ EXPENSES ============================ */
const CATS = ["servers", "ai_credits", "email", "ads", "hires", "services", "tooling", "other"];
const CAT_COLOR: Record<string, string> = {};
const emptyExp = { category: "servers", vendor: "", description: "", amount_minor: 0, currency: "USD", spent_on: new Date().toISOString().slice(0, 10), recurring: false, period: "one_off" };
export function ExpensesTab() {
  const { t } = useAdminTheme();
  const palette = [t.verm, t.cob, t.gold, t.green, t.hi, t.cob, t.verm, t.muted];
  CATS.forEach((c, i) => { CAT_COLOR[c] = palette[i % palette.length]; });
  const [rows, setRows] = useState<any[]>([]); const [add, setAdd] = useState(false); const [form, setForm] = useState<any>(emptyExp);
  const load = () => api("/api/admin/expenses").then((j) => setRows(j.expenses || []));
  useEffect(() => { load(); }, []);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const submit = async () => { const r = await api("/api/admin/expenses", { method: "POST", body: JSON.stringify({ ...form, amount_minor: Math.round(Number(form.amount_minor) * 100) }) }); if (r.ok) { toast.success("Logged"); setAdd(false); setForm(emptyExp); load(); } else toast.error(r.error); };
  const del = async (id: string) => {
    if (!window.confirm("Delete this expense? This cannot be undone.")) return;
    const r = await api(`/api/admin/expenses/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deleted"); load(); } else toast.error(r.error || "Delete failed");
  };
  const total = rows.reduce((s, r) => s + (Number(r.amount_minor) || 0) * (Number(r.fx_to_usd) || 1) / 100, 0);
  const byCat = CATS.map((c) => ({ c, v: Math.round(rows.filter((r) => r.category === c).reduce((s, r) => s + (Number(r.amount_minor) || 0) * (Number(r.fx_to_usd) || 1) / 100, 0)) })).filter((x) => x.v > 0);
  const donutSeg = byCat.map((x) => ({ label: x.c, value: x.v, color: CAT_COLOR[x.c] }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal className="lg:col-span-2"><Kpi label="All-time spend" value={<CountUp to={total} prefix="$" decimals={0} />} sub={`${rows.length} entries · recurring tracked`} accent={t.verm} icon={<Wallet size={16} />} /></Reveal>
        <Reveal delay={80}><Card className="flex h-full flex-col justify-center p-5"><SectionLabel color={t.gold}>by category</SectionLabel>{donutSeg.length ? <Donut segments={donutSeg} size={120} thickness={20} /> : <p className="fb text-sm" style={{ color: t.faint }}>Nothing logged.</p>}</Card></Reveal>
      </div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal><SectionLabel color={t.verm}>expenditure</SectionLabel></Reveal>
        <Btn onClick={() => setAdd(true)}><Plus size={14} /> Log expense</Btn>
      </div>
      {rows.length === 0 ? <Card><EmptyState icon={<Wallet size={32} />} title="No expenses logged." hint="Track servers, AI credits, email, ads, hires, services." /></Card> :
        <Table head={["Date", "Category", "Vendor / Description", "Recurring", "Amount", ""]}>{rows.map((r) => <Row key={r.id}>
          <Cell className="fm text-[11px]" style={{ color: t.faint }}>{r.spent_on}</Cell><Cell><Pill color={CAT_COLOR[r.category]}>{r.category}</Pill></Cell>
          <Cell><div className="font-semibold">{r.vendor || "—"}</div><div className="fb text-xs" style={{ color: t.muted }}>{r.description}</div></Cell>
          <Cell>{r.recurring ? <Pill color={t.gold}>{r.period}</Pill> : <span style={{ color: t.faint }}>one-off</span>}</Cell>
          <Cell style={{ color: t.verm }}>{r.currency} {(Number(r.amount_minor) / 100).toLocaleString()}</Cell>
          <Cell><button onClick={() => del(r.id)} className="p-1" style={{ color: t.verm }}><Trash size={14} /></button></Cell></Row>)}</Table>}
      <Modal open={add} onClose={() => setAdd(false)} title="Log expense">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category *"><Select value={form.category} onChange={(e) => set("category", e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Amount *"><Input type="number" step="0.01" value={form.amount_minor} onChange={(e) => set("amount_minor", e.target.value)} /></Field>
          <Field label="Vendor"><Input value={form.vendor} onChange={(e) => set("vendor", e.target.value)} placeholder="Vercel, OpenAI, Brevo…" /></Field>
          <Field label="Currency"><Select value={form.currency} onChange={(e) => set("currency", e.target.value)}>{["USD", "NGN", "GBP", "EUR"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <Field label="Date"><Input type="date" value={form.spent_on} onChange={(e) => set("spent_on", e.target.value)} /></Field>
          <Field label="Period"><Select value={form.period} onChange={(e) => set("period", e.target.value)}>{["one_off", "monthly", "quarterly", "yearly"].map((c) => <option key={c}>{c}</option>)}</Select></Field>
          <div className="sm:col-span-2 flex items-center justify-between border-2 p-3" style={{ borderColor: t.border }}><span className="fb text-sm" style={{ color: t.text }}>Recurring</span><Switch on={form.recurring} onChange={(v) => set("recurring", v)} /></div>
          <div className="sm:col-span-2"><Field label="Description"><TextArea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><Btn variant="ghost" onClick={() => setAdd(false)}>Cancel</Btn><Btn onClick={submit}>Log</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

/* ============================ PIPELINE ============================ */
const STAGES = [["lead", "Lead"], ["contacted", "Contacted"], ["qualified", "Potential client"], ["proposal", "Proposal"], ["customer", "Customer"], ["lost", "Lost"]] as const;
const emptyDeal = { company_name: "", contact_name: "", contact_email: "", source: "outbound", value_minor: 0, currency: "USD", owner: "", notes: "" };
export function PipelineTab({ onConvert }: { onConvert?: (company: string, email: string) => void }) {
  const { t } = useAdminTheme(); const [rows, setRows] = useState<any[]>([]); const [add, setAdd] = useState(false); const [form, setForm] = useState<any>(emptyDeal); const [drag, setDrag] = useState<string | null>(null);
  const load = () => api("/api/admin/pipeline").then((j) => setRows(j.pipeline || []));
  useEffect(() => { load(); }, []);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const submit = async () => { const r = await api("/api/admin/pipeline", { method: "POST", body: JSON.stringify({ ...form, value_minor: Math.round(Number(form.value_minor) || 0) }) }); if (r.ok) { toast.success("Added"); setAdd(false); setForm(emptyDeal); load(); } else toast.error(r.error); };
  const move = async (id: string, stage: string) => {
    const r = await api(`/api/admin/pipeline/${id}`, { method: "PATCH", body: JSON.stringify({ stage, last_contact_at: new Date().toISOString() }) });
    if (!r.ok) toast.error(r.error || "Failed to move deal");
    load();
  };
  const delDeal = async (id: string) => {
    if (!window.confirm("Delete this deal? This cannot be undone.")) return;
    const r = await api(`/api/admin/pipeline/${id}`, { method: "DELETE" });
    if (r.ok) { toast.success("Deal deleted"); load(); } else toast.error(r.error || "Delete failed");
  };
  const colColor = (s: string) => s === "customer" ? t.green : s === "lost" ? t.verm : s === "proposal" ? t.gold : s === "qualified" ? t.cob : s === "contacted" ? t.hi : t.muted;
  const stageCounts = STAGES.map(([k]) => ({ label: k, value: rows.filter((r) => r.stage === k).length }));
  return (
    <div className="space-y-5">
      <Reveal><Card className="p-5"><SectionLabel color={t.cob}>funnel shape</SectionLabel><Bars data={stageCounts} color={t.cob} horizontal={false} height={120} /></Card></Reveal>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <Reveal><SectionLabel color={t.gold}>sales pipeline</SectionLabel><p className="fm text-[11px] uppercase tracking-widest" style={{ color: t.muted }}>{rows.filter((r) => r.stage !== "lost" && r.stage !== "customer").length} open deals</p></Reveal>
        <Btn onClick={() => setAdd(true)}><Plus size={14} /> Add deal</Btn>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 adm-scroll">
        {STAGES.map(([key, label]) => { const items = rows.filter((r) => r.stage === key);
          return (
            <div key={key} className="w-72 shrink-0 border-[3px] p-3" style={{ borderColor: t.border, background: t.surface, boxShadow: `5px 5px 0 ${t.shadow}` }}
              onDragOver={(e) => e.preventDefault()} onDrop={() => drag && move(drag, key)}>
              <div className="mb-3 flex items-center justify-between border-b-2 pb-2" style={{ borderColor: t.border }}><span className="fm text-[11px] font-bold uppercase tracking-widest" style={{ color: colColor(key) }}>{label}</span><Pill color={colColor(key)}>{items.length}</Pill></div>
              <div className="space-y-2">
                {items.map((d) => (
                  <div key={d.id} draggable onDragStart={() => setDrag(d.id)} className="adm-hover cursor-grab border-2 p-3 active:cursor-grabbing" style={{ borderColor: t.border, background: t.bg, boxShadow: `3px 3px 0 ${t.shadow}` }}>
                    <div className="flex items-start justify-between gap-2"><span className="fd text-sm" style={{ color: t.text }}>{d.company_name}</span>{d.value_minor > 0 && <span className="fm text-[10px]" style={{ color: t.gold }}>{d.currency} {d.value_minor / 100}</span>}</div>
                    {d.contact_email && <div className="mt-0.5 truncate fm text-[10px]" style={{ color: t.faint }}>{d.contact_email}</div>}
                    <div className="mt-2 flex items-center gap-1">
                      <button onClick={() => { const i = STAGES.findIndex((s) => s[0] === d.stage); if (i > 0) move(d.id, STAGES[i - 1][0]); }} className="p-1" style={{ color: t.muted }}><ArrowLeft size={12} /></button>
                      <button onClick={() => { const i = STAGES.findIndex((s) => s[0] === d.stage); if (i < STAGES.length - 1) move(d.id, STAGES[i + 1][0]); }} className="p-1" style={{ color: t.muted }}><ArrowRight size={12} /></button>
                      <button onClick={() => delDeal(d.id)} className="p-1" style={{ color: t.verm }} title="Delete deal"><Trash size={12} /></button>
                      {key === "qualified" && onConvert && <button onClick={() => onConvert(d.company_name, d.contact_email)} className="ml-auto border-2 px-2 py-0.5 fm text-[9px] font-bold uppercase tracking-widest" style={{ color: t.green, borderColor: t.green }}>Convert</button>}
                    </div>
                  </div>))}
                {items.length === 0 && <div className="border-2 border-dashed py-6 text-center fm text-[10px] uppercase tracking-widest" style={{ borderColor: t.border, color: t.faint }}>drop here</div>}
              </div>
            </div>); })}
      </div>
      <Modal open={add} onClose={() => setAdd(false)} title="Add deal">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company *"><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} /></Field>
          <Field label="Source"><Select value={form.source} onChange={(e) => set("source", e.target.value)}>{["outbound", "inbound", "referral", "event"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <Field label="Contact name"><Input value={form.contact_name} onChange={(e) => set("contact_name", e.target.value)} /></Field>
          <Field label="Contact email"><Input value={form.contact_email} onChange={(e) => set("contact_email", e.target.value)} /></Field>
          <Field label="Deal value"><Input type="number" value={form.value_minor} onChange={(e) => set("value_minor", e.target.value)} /></Field>
          <Field label="Owner"><Input value={form.owner} onChange={(e) => set("owner", e.target.value)} /></Field>
          <div className="sm:col-span-2"><Field label="Notes"><TextArea rows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} /></Field></div>
          <div className="sm:col-span-2 flex justify-end gap-2"><Btn variant="ghost" onClick={() => setAdd(false)}>Cancel</Btn><Btn onClick={submit}>Add</Btn></div>
        </div>
      </Modal>
    </div>
  );
}

/* ============================ SUPPORT ============================ */
const PRIO: Record<string, string> = {};
export function SupportTab() {
  const { t } = useAdminTheme();
  PRIO.urgent = t.verm; PRIO.high = t.gold; PRIO.normal = t.green; PRIO.low = t.muted;
  const [rows, setRows] = useState<any[]>([]); const [sel, setSel] = useState<any>(null); const [reply, setReply] = useState(""); const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); api("/api/admin/support").then((j) => { setRows(j.tickets || []); setLoading(false); }); };
  useEffect(() => { load(); }, []);
  const open = rows.find((r) => r.id === sel?.id) || sel;
  const patch = async (p: any) => { const r = await api(`/api/admin/support/${open.id}`, { method: "PATCH", body: JSON.stringify(p) }); if (r.ok) { setSel({ ...open, ...p }); if (p.admin_reply !== undefined) setReply(""); load(); } else toast.error(r.error); };
  const statusColor = (s: string) => s === "closed" ? t.muted : s === "pending" ? t.gold : t.verm;
  const byStatus = useMemo(() => topN(groupBy(rows, "status"), 4), [rows]);
  const byPrio = useMemo(() => topN(groupBy(rows, "priority"), 4), [rows]);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal><Kpi label="Open tickets" value={<CountUp to={rows.filter((r) => r.status !== "closed").length} />} accent={t.verm} icon={<Inbox size={16} />} /></Reveal>
        <Reveal delay={60}><Card className="p-5"><SectionLabel color={t.gold}>by status</SectionLabel><Bars data={byStatus.map(([k, v]) => ({ label: k, value: v }))} color={t.gold} /></Card></Reveal>
        <Reveal delay={120}><Card className="p-5"><SectionLabel color={t.verm}>by priority</SectionLabel><Bars data={byPrio.map(([k, v]) => ({ label: k, value: v }))} color={t.verm} /></Card></Reveal>
      </div>
      <Reveal><SectionLabel color={t.verm}>help desk</SectionLabel></Reveal>
      {loading ? <Spinner /> : rows.length === 0 ? <Card><EmptyState icon={<Inbox size={32} />} title="Inbox zero." hint="Tickets submitted from /support land here." /></Card> :
        <Card className="grid grid-cols-1 overflow-hidden lg:grid-cols-[340px_1fr]" style={{ minHeight: 520 }}>
          <div className="adm-scroll max-h-[70vh] overflow-y-auto border-b-[3px] lg:border-b-0 lg:border-r-[3px]" style={{ borderColor: t.border }}>
            {rows.map((r) => (
              <button key={r.id} onClick={() => { setSel(r); setReply(r.admin_reply || ""); }} className="flex w-full items-start gap-3 border-b-2 px-4 py-3 text-left transition-colors" style={{ borderColor: t.border, background: open?.id === r.id ? t.surface2 : "transparent" }}>
                <span className="mt-1 h-2.5 w-2.5 shrink-0" style={{ background: PRIO[r.priority || "normal"] }} />
                <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate fb text-sm font-semibold" style={{ color: t.text }}>{r.subject || "(no subject)"}</span><Pill color={statusColor(r.status)}>{r.status}</Pill></div>
                  <div className="truncate fm text-[11px]" style={{ color: t.faint }}>{r.user_email}</div></div>
              </button>))}
          </div>
          <div className="flex flex-col">
            {open ? (
              <>
                <div className="adm-scroll flex-1 space-y-4 overflow-y-auto p-5">
                  <div className="flex flex-wrap items-center gap-2"><Pill color={statusColor(open.status)}>{open.status}</Pill><Pill color={PRIO[open.priority || "normal"]}>{open.priority}</Pill>{open.category && <Pill>{open.category}</Pill>}<span className="fm text-[11px]" style={{ color: t.faint }}>{open.user_email} · {(open.created_at || "").slice(0, 10)}</span></div>
                  <div className="border-2 p-4" style={{ borderColor: t.border, background: t.inset }}><div className="mb-1 fm text-[10px] uppercase tracking-widest" style={{ color: t.muted }}>customer</div><p className="whitespace-pre-wrap fb text-sm" style={{ color: t.text }}>{open.message}</p></div>
                  {open.admin_reply && <div className="border-2 p-4" style={{ borderColor: t.green, background: t.surface }}><div className="mb-1 fm text-[10px] uppercase tracking-widest" style={{ color: t.green }}>admin reply</div><p className="whitespace-pre-wrap fb text-sm" style={{ color: t.text }}>{open.admin_reply}</p></div>}
                </div>
                <div className="space-y-3 border-t-[3px] p-4" style={{ borderColor: t.border }}>
                  <div className="flex flex-wrap gap-2">
                    <Select value={open.status} onChange={(e) => patch({ status: e.target.value })} className="w-auto">{["open", "pending", "closed"].map((s) => <option key={s}>{s}</option>)}</Select>
                    <Select value={open.priority || "normal"} onChange={(e) => patch({ priority: e.target.value })} className="w-auto">{["low", "normal", "high", "urgent"].map((s) => <option key={s}>{s}</option>)}</Select>
                    <Input value={open.assignee || ""} onChange={(e) => patch({ assignee: e.target.value })} placeholder="Assignee" className="w-auto" />
                  </div>
                  <TextArea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" />
                  <div className="flex justify-end gap-2"><Btn variant="ghost" onClick={() => patch({ status: "closed" })}>Close ticket</Btn><Btn disabled={!reply.trim()} onClick={() => patch({ admin_reply: reply, status: open.status === "open" ? "pending" : open.status })}>Send reply</Btn></div>
                </div>
              </>
            ) : <EmptyState icon={<Mail size={32} />} title="Select a ticket" />}
          </div>
        </Card>}
    </div>
  );
}

/* ============================ BLOG ============================ */
import BlogManager from "./BlogManager";

export function BlogTab({ posts }: { posts: any[] }) {
  const { mode } = useAdminTheme();
  return (
    <div className="space-y-5">
      <Reveal><SectionLabel>blog / SEO</SectionLabel></Reveal>
      <BlogManager blogPosts={posts} isDarkMode={mode === "dark"} />
    </div>
  );
}

/* ============================ SETTINGS ============================ */
export function SettingsTab({ siteSettings, featureFlags, appSettings, overview }: { siteSettings: any; featureFlags: any[]; appSettings?: Record<string, any>; overview: any }) {
  const { t } = useAdminTheme();
  const [flags, setFlags] = useState<any[]>(featureFlags || []);
  const [site, setSite] = useState({
    site_name: siteSettings?.site_name || "Cvyon",
    meta_title: siteSettings?.meta_title || "",
    meta_description: siteSettings?.meta_description || "",
    maintenance_mode: !!siteSettings?.maintenance_mode
  });
  
  const parseSetting = (val: any, defaultVal: any) => {
    if (!val) return defaultVal;
    if (typeof val === 'string') {
      try { return JSON.parse(val) || defaultVal; } catch { return defaultVal; }
    }
    return val;
  };

  const initialBilling = parseSetting(appSettings?.billing, { amount: 9900, currency: "NGN" });
  const [billing, setBilling] = useState({
    amount: typeof initialBilling?.amount === "number" ? initialBilling.amount / 100 : 99,
    currency: initialBilling?.currency || "NGN"
  });
  const initialAiLimit = parseSetting(appSettings?.ai_budget_limit, 50);
  const [aiLimit, setAiLimit] = useState(Number(initialAiLimit) || 50);
  const [diag, setDiag] = useState<any>(null);
  const [diagLoading, setDiagLoading] = useState(false);

  const runDiagnostics = async () => {
    setDiagLoading(true);
    try {
      const res = await fetch("/api/admin/diagnostics");
      const data = await res.json();
      setDiag(data);
      if (data.overall === "ALL_HEALTHY") {
        toast.success("All systems healthy!");
      } else {
        toast.error("System issues detected — check diagnostic details.");
      }
    } catch {
      toast.error("Failed to run diagnostics.");
    } finally {
      setDiagLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.ok ? r.json() : null)
      .then((j) => {
        if (j?.billing) {
          const parsedBilling = parseSetting(j.billing, { amount: 9900, currency: "NGN" });
          setBilling({ amount: (Number(parsedBilling.amount) || 9900) / 100, currency: parsedBilling.currency || "NGN" });
        }
        if (j?.ai_budget_limit) {
          const parsedAi = parseSetting(j.ai_budget_limit, 50);
          setAiLimit(Number(parsedAi) || 50);
        }
      })
      .catch(() => {});
  }, []);

  const saveSite = async () => {
    const r = await api("/api/admin/config", {
      method: "PATCH",
      body: JSON.stringify({ target: "site_settings", value: site })
    });
    if (r.ok) toast.success("Site settings saved");
    else toast.error(r.error || "Failed to save site settings");
  };

  const saveBilling = async () => {
    const r = await api("/api/admin/config", {
      method: "PATCH",
      body: JSON.stringify({
        target: "app_settings",
        key: "billing",
        value: { amount: Math.round(Number(billing.amount) * 100), currency: billing.currency }
      })
    });
    if (r.ok) toast.success("Recruiter plan pricing saved");
    else toast.error(r.error || "Failed to save billing settings");
  };

  const saveAi = async () => {
    const r = await api("/api/admin/config", {
      method: "PATCH",
      body: JSON.stringify({
        target: "app_settings",
        key: "ai_budget_limit",
        value: Number(aiLimit)
      })
    });
    if (r.ok) toast.success("AI budget limit saved");
    else toast.error(r.error || "Failed to save AI limit");
  };

  const toggleFlag = async (key: string, v: boolean) => {
    const r = await api("/api/admin/config", {
      method: "PATCH",
      body: JSON.stringify({ target: "feature_flags", key, value: v })
    });
    if (r.ok) {
      setFlags((fs) => fs.map((f) => (f.key === key ? { ...f, is_enabled: v } : f)));
      toast.success(`Feature '${key}' ${v ? "enabled" : "disabled"}`);
    }
    else toast.error(r.error || "Failed to update feature flag");
  };

  const spend = overview?.expensesThisMonth ?? 0;
  const ai = overview?.aiCostThisMonth ?? 0;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Live System Diagnostics & DB Health */}
      <Reveal className="lg:col-span-2">
        <Card className="p-5" accent={diag?.overall === "ALL_HEALTHY" ? t.green : t.cob}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <SectionLabel color={diag?.overall === "ALL_HEALTHY" ? t.green : t.cob}>system diagnostics & live health</SectionLabel>
              <p className="fb text-xs" style={{ color: t.muted }}>
                Verify live database connectivity, candidate table writes, and external API services.
              </p>
            </div>
            <Btn onClick={runDiagnostics} disabled={diagLoading} className="text-xs">
              <RefreshCw size={13} className={diagLoading ? "animate-spin" : ""} /> {diagLoading ? "Testing..." : "Run Health Test"}
            </Btn>
          </div>

          {diag ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="border-2 p-3 rounded" style={{ borderColor: t.border, background: t.inset }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {diag.checks?.supabase?.status === "OK" ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-red-500" />}
                  <span className="fm text-xs font-bold" style={{ color: t.text }}>Supabase DB</span>
                </div>
                <div className="fm text-[11px]" style={{ color: t.muted }}>
                  Status: <b style={{ color: diag.checks?.supabase?.status === "OK" ? t.green : t.verm }}>{diag.checks?.supabase?.status || "UNKNOWN"}</b>
                </div>
                <div className="fm text-[10px]" style={{ color: t.faint }}>
                  Client: {diag.checks?.supabase_client?.is_real ? "Live DB" : "Mock (Memory)"}
                </div>
              </div>

              <div className="border-2 p-3 rounded" style={{ borderColor: t.border, background: t.inset }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {diag.checks?.write_test?.status === "OK" ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                  <span className="fm text-xs font-bold" style={{ color: t.text }}>Live Write Test</span>
                </div>
                <div className="fm text-[11px]" style={{ color: t.muted }}>
                  {diag.checks?.write_test?.status === "OK" ? "Write Verified" : diag.checks?.write_test?.status || "Pending"}
                </div>
                <div className="fm text-[10px]" style={{ color: t.faint }}>
                  {diag.checks?.write_test?.error || "Candidates table writable"}
                </div>
              </div>

              <div className="border-2 p-3 rounded" style={{ borderColor: t.border, background: t.inset }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Activity size={14} className="text-blue-500" />
                  <span className="fm text-xs font-bold" style={{ color: t.text }}>Pool Records</span>
                </div>
                <div className="fm text-[11px]" style={{ color: t.muted }}>
                  Candidates: <b style={{ color: t.text }}>{diag.checks?.candidates_table?.candidates_count ?? 0}</b>
                </div>
                <div className="fm text-[10px]" style={{ color: t.faint }}>
                  Profiles: {diag.checks?.supabase?.candidate_profiles_count ?? 0}
                </div>
              </div>

              <div className="border-2 p-3 rounded" style={{ borderColor: t.border, background: t.inset }}>
                <div className="flex items-center gap-1.5 mb-1">
                  {diag.checks?.careerjet_proxy?.status === "OK" ? <CheckCircle size={14} className="text-green-500" /> : <AlertCircle size={14} className="text-amber-500" />}
                  <span className="fm text-xs font-bold" style={{ color: t.text }}>Job Proxy</span>
                </div>
                <div className="fm text-[11px]" style={{ color: t.muted }}>
                  Status: {diag.checks?.careerjet_proxy?.status || "N/A"}
                </div>
                <div className="fm text-[10px]" style={{ color: t.faint }}>
                  Jobs Feed: {diag.checks?.careerjet_proxy?.jobs_count ? `${diag.checks.careerjet_proxy.jobs_count} live` : "0"}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border border-dashed rounded text-center fm text-xs" style={{ borderColor: t.border, color: t.muted }}>
              Click &quot;Run Health Test&quot; to test production database read/write and external service health.
            </div>
          )}
        </Card>
      </Reveal>

      {/* Recruiter Plan / Billing Configuration */}
      <Reveal>
        <Card className="p-5" accent={t.green}>
          <SectionLabel color={t.green}>billing (recruiter subscription plan)</SectionLabel>
          <p className="mb-4 fb text-sm" style={{ color: t.muted }}>
            Configures the price charged for recruiter subscriptions and displayed on the recruiter portal.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Plan Amount (major units)">
              <Input
                type="number"
                value={billing.amount}
                onChange={(e) => setBilling({ ...billing, amount: Number(e.target.value) })}
              />
            </Field>
            <Field label="Currency">
              <Select
                value={billing.currency}
                onChange={(e) => setBilling({ ...billing, currency: e.target.value })}
              >
                {["NGN", "USD", "GBP", "EUR", "KES", "ZAR", "GHS"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4 flex justify-end">
            <Btn onClick={saveBilling}>Save Billing</Btn>
          </div>
        </Card>
      </Reveal>

      {/* Site & Branding Settings */}
      <Reveal delay={60}>
        <Card className="p-5">
          <SectionLabel>site / branding</SectionLabel>
          <div className="space-y-4">
            <Field label="Site Name">
              <Input value={site.site_name} onChange={(e) => setSite({ ...site, site_name: e.target.value })} />
            </Field>
            <Field label="Meta Title">
              <Input value={site.meta_title} onChange={(e) => setSite({ ...site, meta_title: e.target.value })} />
            </Field>
            <Field label="Meta Description">
              <TextArea rows={2} value={site.meta_description} onChange={(e) => setSite({ ...site, meta_description: e.target.value })} />
            </Field>
            <div className="flex items-center justify-between border-2 p-3" style={{ borderColor: t.border }}>
              <span className="fb text-sm" style={{ color: t.text }}>Maintenance mode</span>
              <Switch on={site.maintenance_mode} onChange={(v) => setSite({ ...site, maintenance_mode: v })} />
            </div>
            <div className="flex justify-end">
              <Btn onClick={saveSite}>Save Site Settings</Btn>
            </div>
          </div>
        </Card>
      </Reveal>

      {/* AI Budget Guard Limit */}
      <Reveal delay={120}>
        <Card className="p-5" accent={t.verm}>
          <SectionLabel color={t.verm}>AI budget guard limit</SectionLabel>
          <div className="mb-4 flex items-center gap-4">
            <RadialGauge value={ai} max={Math.max(aiLimit, ai, 1)} color={t.verm} label="spend" size={92} suffix="$" />
            <div className="fb text-sm" style={{ color: t.muted }}>
              Spend this month <b style={{ color: t.verm }}>{usd(ai)}</b> of a <b style={{ color: t.text }}>${aiLimit}</b> monthly ceiling.
            </div>
          </div>
          <Field label="Monthly limit (USD)">
            <Input type="number" value={aiLimit} onChange={(e) => setAiLimit(Number(e.target.value))} />
          </Field>
          <div className="mt-4 flex justify-end">
            <Btn onClick={saveAi}>Save AI Limit</Btn>
          </div>
        </Card>
      </Reveal>

      {/* Feature Flags */}
      <Reveal delay={180}>
        <Card className="p-5" accent={t.cob}>
          <SectionLabel color={t.cob}>feature flags & modules</SectionLabel>
          <div className="space-y-3">
            {(flags || []).map((f: any) => (
              <div key={f.key} className="flex items-center justify-between border-2 p-3" style={{ borderColor: t.border }}>
                <div>
                  <div className="fb text-sm font-semibold" style={{ color: t.text }}>{f.key}</div>
                  <div className="fb text-xs" style={{ color: t.muted }}>{f.description || "Toggle feature visibility and access"}</div>
                </div>
                <Switch on={!!f.is_enabled} onChange={(v) => toggleFlag(f.key, v)} />
              </div>
            ))}
            {(!flags || flags.length === 0) && <p className="fb text-sm" style={{ color: t.faint }}>No feature flags configured.</p>}
          </div>
        </Card>
      </Reveal>

      {/* Email / SMTP Info */}
      <Reveal delay={120} className="lg:col-span-2">
        <Card className="p-5" accent={t.gold}>
          <SectionLabel color={t.gold}>email / transactional SMTP</SectionLabel>
          <p className="fb text-sm" style={{ color: t.muted }}>
            Auth & transactional notifications are sent via Brevo SMTP relay: host <code>smtp-relay.brevo.com</code> · port <code>587</code> · sender <code>auth@cvyon.com</code>.
          </p>
        </Card>
      </Reveal>

      {/* Spend Snapshot */}
      <Reveal delay={120} className="lg:col-span-2">
        <Card className="p-5">
          <SectionLabel>spend snapshot MTD</SectionLabel>
          <Bars
            data={[
              { label: "AI credits", value: Math.round(ai) },
              { label: "Other spend MTD", value: Math.max(0, Math.round(spend - ai)) }
            ]}
            color={t.verm}
          />
        </Card>
      </Reveal>
    </div>
  );
}
/* ============================ PRICING ============================ */
const CURRENCIES = ["USD", "NGN", "GHS", "KES", "ZAR"];
const CUR_SYM: Record<string, string> = { USD: "$", NGN: "₦", GHS: "₵", KES: "KSh ", ZAR: "R" };

export function PricingTab() {
  const { t } = useAdminTheme();
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api("/api/admin/pricing").then((j) => {
      const list = j.packs || [];
      setPacks(list);
      const d: Record<string, any> = {};
      list.forEach((p: any) => {
        d[p.id] = { name: p.name, credits: p.credits, price_major: (p.price_kobo / 100).toFixed(2), currency: p.currency || "USD", active: p.active };
      });
      setDrafts(d);
      setLoading(false);
    });
  };
  useEffect(() => { load(); }, []);

  const set = (id: string, k: string, v: any) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [k]: v } }));

  const save = async (id: string) => {
    const d = drafts[id];
    if (!d) return;
    setSaving(id);
    const r = await api("/api/admin/pricing", {
      method: "PUT",
      body: JSON.stringify({ id, name: d.name, credits: Number(d.credits), price_major: Number(d.price_major), currency: d.currency, active: d.active }),
    });
    setSaving(null);
    if (!r.ok) return toast.error(r.error || "Save failed");
    toast.success("Price updated");
    load();
  };

  const sym = (c: string) => CUR_SYM[c] || (c + " ");

  return (
    <div className="space-y-5">
      <Reveal><Card className="p-5">
        <SectionLabel color={t.gold}>unlock pricing</SectionLabel>
        <p className="fb mt-1 text-sm" style={{ color: t.muted }}>
          What recruiters pay per contact unlock. Prices go live immediately — the checkout reads them straight from the database.
          Non-USD currencies are charged through Paystack in that currency; USD payouts need international approval on your Paystack dashboard.
        </p>
      </Card></Reveal>

      <Reveal delay={60}><Card className="p-5">
        {loading ? <Spinner /> : packs.length === 0 ? <EmptyState title="No credit packs" /> : (
          <Table head={["Pack", "Credits", "Price", "Currency", "Per unlock", "Active", ""]}>
            {packs.map((p) => {
              const d = drafts[p.id] || {};
              const per = d.credits > 0 ? (Number(d.price_major) / Number(d.credits)) : 0;
              return (
                <Row key={p.id}>
                  <Cell><Input value={d.name || ""} onChange={(e: any) => set(p.id, "name", e.target.value)} className="w-36" /></Cell>
                  <Cell><Input type="number" min={1} value={d.credits ?? ""} onChange={(e: any) => set(p.id, "credits", e.target.value)} className="w-20" /></Cell>
                  <Cell><Input type="number" min={0} step="0.01" value={d.price_major ?? ""} onChange={(e: any) => set(p.id, "price_major", e.target.value)} className="w-28" /></Cell>
                  <Cell>
                    <Select value={d.currency || "USD"} onChange={(e: any) => set(p.id, "currency", e.target.value)} className="w-28">
                      {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </Cell>
                  <Cell><span className="fh text-sm font-bold">{sym(d.currency)}{per.toFixed(2)}</span></Cell>
                  <Cell><Switch on={!!d.active} onChange={(v: boolean) => set(p.id, "active", v)} /></Cell>
                  <Cell>
                    <Btn disabled={saving === p.id} onClick={() => save(p.id)}>
                      {saving === p.id ? "Saving…" : "Save"}
                    </Btn>
                  </Cell>
                </Row>
              );
            })}
          </Table>
        )}
      </Card></Reveal>
    </div>
  );
}
