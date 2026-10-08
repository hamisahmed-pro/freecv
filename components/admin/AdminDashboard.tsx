"use client";
import React, { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BarChart3, Users, Building2, DollarSign, Target, Wallet,
  Headphones, FileText, Settings as Cog, LogOut, Menu, X, List, Cpu, Tag,
  ChevronRight,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, ThemeToggle } from "./admin/theme";
import { AdminStyle } from "./admin/ui";
import {
  OverviewTab, AnalyticsTab, TalentTab, RecruitersTab, RevenueTab,
  ExpensesTab, PipelineTab, SupportTab, BlogTab, SettingsTab,
  EventLogTab, AiUsageTab, PricingTab,
} from "./tabs";

/* Grouped navigation — overview first, then functional groups */
type NavItem = { id: string; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }>; hint: string };
type NavGroup = { title: string; items: NavItem[] };
const NAV_GROUPS: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { id: "overview", label: "Dashboard", icon: LayoutDashboard, hint: "business overview" },
    ],
  },
  {
    title: "Growth",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3, hint: "traffic & behavior" },
      { id: "events", label: "Event log", icon: List, hint: "raw analytics events" },
      { id: "ai", label: "AI usage", icon: Cpu, hint: "AI spend & calls" },
      { id: "talent", label: "Talent Pool", icon: Users, hint: "opt-in candidates" },
      { id: "recruiters", label: "Recruiters", icon: Building2, hint: "accounts & onboarding" },
    ],
  },
  {
    title: "Business",
    items: [
      { id: "revenue", label: "Revenue", icon: DollarSign, hint: "MRR · ARR · subscriptions" },
      { id: "pipeline", label: "Pipeline", icon: Target, hint: "sales CRM" },
      { id: "expenses", label: "Expenses", icon: Wallet, hint: "spend ledger" },
      { id: "pricing", label: "Pricing", icon: Tag, hint: "unlock prices" },
    ],
  },
  {
    title: "Content & Support",
    items: [
      { id: "support", label: "Support", icon: Headphones, hint: "help desk" },
      { id: "blog", label: "Blog", icon: FileText, hint: "SEO / CMS" },
    ],
  },
  {
    title: "System",
    items: [
      { id: "settings", label: "Settings", icon: Cog, hint: "config & flags" },
    ],
  },
] ;

const ALL_TABS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
type TabId = string;

type Props = {
  candidates: any[]; analytics: any[]; aiLogs: any[];
  siteSettings?: any; featureFlags?: any[]; blogPosts?: any[];
  appSettings?: Record<string, any>;
};

function RailContent({ tab, setTab, onNavigate }: { tab: TabId; setTab: (t: TabId) => void; onNavigate?: () => void }) {
  const { t } = useAdminTheme();
  return (
    <div className="flex h-full flex-col">
      {/* brand — cream badge mark on the navy rail */}
      <div className="flex items-center border-b px-5 py-4" style={{ borderColor: t.railBorder }}>
        <span className="inline-flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full" style={{ background: "#f6f5ef" }}>
            <LogoMark size={24} />
          </span>
          <span style={{ fontFamily: "var(--font-brand)", fontWeight: 950, fontSize: 20, letterSpacing: "-0.07em", color: "#ffffff", lineHeight: 1 }}>
            cvyon
            <small style={{ display: "block", fontSize: 9, letterSpacing: ".14em", color: t.onRailFaint, fontWeight: 800 }}>ADMIN</small>
          </span>
        </span>
      </div>
      {/* grouped nav */}
      <nav className="adm-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-4 last:mb-0">
            <div className="px-3 pb-1.5 text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: t.onRailFaint }}>
              {group.title}
            </div>
            {group.items.map((tb) => {
              const active = tab === tb.id;
              return (
                <button key={tb.id} onClick={() => { setTab(tb.id); onNavigate?.(); }}
                  className="group mb-0.5 flex w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left transition-all"
                  style={active
                    ? { background: t.verm, borderColor: t.verm, color: t.onVerm, boxShadow: `0 2px 8px ${t.shadow}` }
                    : { background: "transparent", borderColor: "transparent", color: t.onRailMuted }}>
                  <tb.icon size={16} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-bold uppercase tracking-wider">{tb.label}</span>
                    <span className="block truncate text-[10px]" style={{ color: active ? t.onVerm : t.onRailFaint }}>{tb.hint}</span>
                  </span>
                  {active && <ChevronRight size={14} style={{ color: t.onVerm }} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      {/* footer */}
      <div className="border-t px-3 py-4" style={{ borderColor: t.railBorder }}>
        <div className="mb-3 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: t.onRailMuted }}>
          <span className="adm-blink inline-block h-2 w-2 rounded-full" style={{ background: t.green }} /> All systems operational
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => { supabase.auth.signOut().catch(() => {}); window.location.href = "/admin/login"; }}
            aria-label="Sign out" title="Sign out"
            className="grid h-9 w-9 place-items-center rounded-[10px] border transition-colors"
            style={{ borderColor: t.railBorder, background: t.railInset, color: t.onRail }}><LogOut size={15} /></button>
        </div>
      </div>
    </div>
  );
}

function Shell(props: Props) {
  const { t } = useAdminTheme();
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("overview");
  const [email, setEmail] = useState("");
  const [overview, setOverview] = useState<any>(null);
  const [drawer, setDrawer] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then((u) => setEmail(u.data.user?.email || "")).catch(() => {});
    fetch("/api/admin/overview").then((r) => r.json()).then(setOverview).catch(() => {});
  }, []);

  const active = ALL_TABS.find((x) => x.id === tab)!;
  const activeGroup = NAV_GROUPS.find((g) => g.items.some((i) => i.id === tab))!;
  const render = () => {
    switch (tab) {
      case "overview": return <OverviewTab candidates={props.candidates} analytics={props.analytics} aiLogs={props.aiLogs} />;
      case "analytics": return <AnalyticsTab analytics={props.analytics} />;
      case "events": return <EventLogTab events={props.analytics} />;
      case "ai": return <AiUsageTab logs={props.aiLogs} />;
      case "talent": return <TalentTab candidates={props.candidates} />;
      case "recruiters": return <RecruitersTab />;
      case "revenue": return <RevenueTab />;
      case "pipeline": return <PipelineTab onConvert={() => setTab("recruiters")} />;
      case "expenses": return <ExpensesTab />;
      case "pricing": return <PricingTab />;
      case "support": return <SupportTab />;
      case "blog": return <BlogTab posts={props.blogPosts || []} />;
      case "settings": return <SettingsTab siteSettings={props.siteSettings || {}} featureFlags={props.featureFlags || []} appSettings={props.appSettings || {}} overview={overview} />;
    }
  };

  return (
    <div className="relative min-h-screen transition-colors duration-300" style={{ background: t.bg, color: t.text, ["--sb" as any]: t.border }}>
      <AdminStyle />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${t.verm}, ${t.gold}, transparent)` }} />

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b backdrop-blur lg:ml-[268px]" style={{ borderColor: t.border, background: `${t.bg}dd` }}>
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.faint }}>
              <span>{activeGroup.title}</span>
              <ChevronRight size={11} />
              <span style={{ color: t.muted }}>{active.hint}</span>
            </div>
            <h1 className="truncate text-xl tracking-tight font-bold sm:text-2xl" style={{ color: t.text }}>{active.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            {email && (
              <span className="hidden truncate text-[11px] font-semibold sm:block" style={{ color: t.muted }} title={email}>
                {email}
              </span>
            )}
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-[10px] border lg:hidden" style={{ borderColor: t.border, background: t.inset, color: t.text }}><Menu size={16} /></button>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="relative z-10 mx-auto max-w-[1320px] px-5 py-7 lg:ml-[268px] lg:px-8">
        <div key={tab}>{render()}</div>
      </main>

      {/* persistent LEFT sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[268px] flex-col border-r lg:flex" style={{ background: t.rail, borderColor: t.railBorder }}>
        <RailContent tab={tab} setTab={setTab} />
      </aside>

      {/* mobile left drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="adm-drawer absolute left-0 top-0 flex h-screen w-[268px] flex-col border-r" style={{ background: t.rail, borderColor: t.railBorder }}>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-[10px] border" style={{ borderColor: t.border, background: t.inset, color: t.text }}><X size={16} /></button>
            <RailContent tab={tab} setTab={setTab} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard(props: Props) {
  return <AdminThemeProvider><Shell {...props} /></AdminThemeProvider>;
}
