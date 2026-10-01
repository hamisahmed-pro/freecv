"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, BarChart3, Users, Building2, DollarSign, Target, Wallet,
  Headphones, FileText, Settings as Cog, LogOut, Menu, X, List, Cpu, Tag,
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, ThemeToggle } from "./admin/theme";
import { AdminStyle } from "./admin/ui";
import {
  OverviewTab, AnalyticsTab, TalentTab, RecruitersTab, RevenueTab,
  ExpensesTab, PipelineTab, SupportTab, BlogTab, SettingsTab,
  EventLogTab, AiUsageTab, PricingTab,
} from "./tabs";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, hint: "mission control" },
  { id: "analytics", label: "Analytics", icon: BarChart3, hint: "traffic & behaviour" },
  { id: "events", label: "Event log", icon: List, hint: "raw analytics events" },
  { id: "ai", label: "AI usage", icon: Cpu, hint: "AI spend & calls" },
  { id: "talent", label: "Talent Pool", icon: Users, hint: "opt-in candidates" },
  { id: "recruiters", label: "Recruiters", icon: Building2, hint: "accounts & onboarding" },

  { id: "pricing", label: "Pricing", icon: Tag, hint: "unlock prices" },
  { id: "revenue", label: "Revenue", icon: DollarSign, hint: "MRR · ARR · subscriptions" },
  { id: "pipeline", label: "Pipeline", icon: Target, hint: "sales CRM" },
  { id: "expenses", label: "Expenses", icon: Wallet, hint: "spend ledger" },
  { id: "support", label: "Support", icon: Headphones, hint: "help desk" },
  { id: "blog", label: "Blog", icon: FileText, hint: "SEO / CMS" },
  { id: "settings", label: "Settings", icon: Cog, hint: "config & flags" },
] as const;
type TabId = (typeof TABS)[number]["id"];

type Props = {
  candidates: any[]; analytics: any[]; aiLogs: any[];
  siteSettings?: any; featureFlags?: any[]; blogPosts?: any[];
  appSettings?: Record<string, any>;
};

function RailContent({ tab, setTab, onNavigate }: { tab: TabId; setTab: (t: TabId) => void; onNavigate?: () => void }) {
  const { mode, t } = useAdminTheme();
  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: t.border }}>
        <Image
          src={mode === "dark" ? "/logo-dark-no-background.png" : "/logo-light-no-background.png"}
          alt="Cvyon"
          width={200}
          height={60}
          priority
          className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-all"
        />
        <span
          className="rounded-full text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 border"
          style={{ borderColor: t.border, color: t.muted, background: t.inset }}
        >
          ADMIN
        </span>
      </div>
      {/* nav */}
      <nav className="adm-scroll flex-1 overflow-y-auto px-3 py-4">
        {TABS.map((tb) => {
          const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => { setTab(tb.id); onNavigate?.(); }}
              className="group mb-1 flex w-full items-center gap-3 rounded-[10px] border px-3 py-2.5 text-left transition-colors"
              style={active
                ? { background: t.verm, borderColor: t.verm, color: t.onVerm, boxShadow: `0 2px 8px ${t.shadow}` }
                : { background: "transparent", borderColor: "transparent", color: t.muted }}>
              <tb.icon size={16} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-bold uppercase tracking-wider">{tb.label}</span>
                <span className="block truncate text-[10px]" style={{ color: active ? t.onVerm : t.faint }}>{tb.hint}</span>
              </span>
              {active && <span className="h-2 w-2 rounded-full" style={{ background: t.onVerm }} />}
            </button>
          );
        })}
      </nav>
      {/* footer */}
      <div className="border-t px-3 py-4" style={{ borderColor: t.border }}>
        <div className="mb-3 flex items-center gap-2 px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
          <span className="adm-blink inline-block h-2 w-2 rounded-full" style={{ background: t.green }} /> system online
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => { supabase.auth.signOut().catch(() => {}); window.location.href = "/admin/login"; }}
            aria-label="Log out" className="grid h-9 w-9 place-items-center rounded-[10px] border transition-colors"
            style={{ borderColor: t.border, background: t.inset, color: t.text }}><LogOut size={15} /></button>
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

  const active = TABS.find((x) => x.id === tab)!;
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

      {/* slim top bar in the content column */}
      <header className="sticky top-0 z-30 border-b backdrop-blur lg:mr-[268px]" style={{ borderColor: t.border, background: `${t.bg}dd` }}>
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-5 py-3 lg:px-8">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: t.muted }}>{active.hint}</div>
            <h1 className="truncate text-xl tracking-tight font-bold sm:text-2xl" style={{ color: t.text }}>{active.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="grid h-9 w-9 place-items-center rounded-[10px] border lg:hidden" style={{ borderColor: t.border, background: t.inset, color: t.text }}><Menu size={16} /></button>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="relative z-10 mx-auto max-w-[1320px] px-5 py-7 lg:mr-[268px] lg:px-8">
        <div key={tab}>{render()}</div>
      </main>

      {/* persistent RIGHT sidebar */}
      <aside className="fixed right-0 top-0 z-40 hidden h-screen w-[268px] flex-col border-l lg:flex" style={{ background: t.rail, borderColor: t.border }}>
        <RailContent tab={tab} setTab={setTab} />
      </aside>

      {/* mobile right drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="adm-drawer absolute right-0 top-0 flex h-screen w-[268px] flex-col border-l" style={{ background: t.rail, borderColor: t.border }}>
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