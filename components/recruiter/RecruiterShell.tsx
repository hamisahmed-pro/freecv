"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Search, GitCompare, KanbanSquare, Unlock,
  Bookmark, History, Coins, Plus, LogOut, Menu, X, ChevronRight,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

export type RecruiterTab = "overview" | "search" | "compare" | "pipeline" | "saved" | "history" | "unlocks";

export const RECRUITER_TAB_META: Record<RecruiterTab, { label: string; group: string; blurb: string }> = {
  overview: { label: "Dashboard", group: "Workspace", blurb: "Your hiring activity at a glance." },
  search: { label: "New search", group: "Workspace", blurb: "Paste a job description, meet the shortlist." },
  compare: { label: "Compare", group: "Candidates", blurb: "Side-by-side candidate comparison." },
  pipeline: { label: "Pipeline", group: "Candidates", blurb: "Candidates you've shortlisted." },
  unlocks: { label: "Unlocks", group: "Candidates", blurb: "Contacts you've unlocked, with receipts." },
  saved: { label: "Saved searches", group: "Library", blurb: "Pinned searches you run often." },
  history: { label: "Search history", group: "Library", blurb: "Every JD search you've run." },
};

const NAV_GROUPS: { name: string; items: { id: RecruiterTab; icon: any }[] }[] = [
  {
    name: "Workspace",
    items: [
      { id: "overview", icon: LayoutDashboard },
      { id: "search", icon: Search },
    ],
  },
  {
    name: "Candidates",
    items: [
      { id: "compare", icon: GitCompare },
      { id: "pipeline", icon: KanbanSquare },
      { id: "unlocks", icon: Unlock },
    ],
  },
  {
    name: "Library",
    items: [
      { id: "saved", icon: Bookmark },
      { id: "history", icon: History },
    ],
  },
];

interface ShellProps {
  active: RecruiterTab;
  onNavigate: (t: RecruiterTab) => void;
  userEmail: string;
  balance: number | null;
  creditsReady: boolean;
  onBuyCredits: () => void;
  onSignOut: () => void;
  counts: Record<"compare" | "pipeline" | "saved" | "history" | "unlocks", number>;
  children: React.ReactNode;
}

function NavButton({
  id, icon: Icon, active, count, collapsed, onClick,
}: {
  id: RecruiterTab; icon: any; active: boolean; count?: number; collapsed: boolean; onClick: () => void;
}) {
  const meta = RECRUITER_TAB_META[id];
  return (
    <button
      onClick={onClick}
      title={collapsed ? meta.label : undefined}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all",
        collapsed && "justify-center px-0",
        active
          ? "bg-navy text-white shadow-[0_6px_16px_rgba(23,27,75,0.25)]"
          : "text-navy/60 hover:bg-navy/[0.06] hover:text-navy",
      )}
    >
      <Icon size={17} className={cn("shrink-0", active ? "text-gold" : "text-navy/45 group-hover:text-navy/70")} />
      {!collapsed && <span className="flex-1 text-left">{meta.label}</span>}
      {!collapsed && count != null && count > 0 && (
        <span className={cn(
          "rounded-full px-2 py-0.5 text-[10px] font-extrabold",
          active ? "bg-gold text-navy" : "bg-navy/10 text-navy/70",
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

function SidebarBody(props: ShellProps & { collapsed: boolean; onNavigateDone?: () => void }) {
  const { active, onNavigate, userEmail, balance, creditsReady, onBuyCredits, onSignOut, counts, collapsed } = props;
  const go = (t: RecruiterTab) => { onNavigate(t); props.onNavigateDone?.(); };
  return (
    <div className="flex h-full flex-col">
      {/* brand */}
      <div className={cn("flex items-center gap-2.5 px-4 pb-5 pt-5", collapsed && "justify-center px-0")}>
        <Link href="/" className="flex items-center gap-2.5" aria-label="Cvyon home">
          <Logo className="h-9 w-9 shrink-0" />
          {!collapsed && (
            <span className="leading-none">
              <span className="block text-lg font-black tracking-tight text-navy">Cvyon</span>
              <span className="mt-0.5 block text-[9px] font-extrabold uppercase tracking-[0.22em] text-coral">Recruiter</span>
            </span>
          )}
        </Link>
      </div>

      {/* new search CTA */}
      <div className={cn("px-4 pb-4", collapsed && "px-2")}>
        <button
          onClick={() => go("search")}
          title={collapsed ? "New search" : undefined}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl bg-coral px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white",
            "shadow-[0_8px_18px_rgba(255,96,75,0.35)] transition-all hover:-translate-y-px hover:bg-navy",
            collapsed && "px-0",
          )}
        >
          <Plus size={16} strokeWidth={2.75} />
          {!collapsed && "New search"}
        </button>
      </div>

      {/* nav */}
      <nav className={cn("flex-1 space-y-5 overflow-y-auto px-3", collapsed && "px-2")}>
        {NAV_GROUPS.map((g) => (
          <div key={g.name}>
            {!collapsed && (
              <div className="mb-1.5 px-3 text-[10px] font-extrabold uppercase tracking-[0.22em] text-navy/40">
                {g.name}
              </div>
            )}
            <div className="space-y-1">
              {g.items.map((item) => (
                <NavButton
                  key={item.id}
                  id={item.id}
                  icon={item.icon}
                  active={active === item.id}
                  count={counts[item.id as keyof typeof counts] ?? undefined}
                  collapsed={collapsed}
                  onClick={() => go(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* footer: credits + account */}
      <div className={cn("border-t border-line/70 p-3", collapsed && "px-2")}>
        {!collapsed ? (
          <button
            onClick={onBuyCredits}
            className="mb-2 flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-3 py-2.5 text-left transition-colors hover:border-gold"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gold/25">
              <Coins size={17} className="text-[#b07d18]" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block text-base font-black text-navy">
                {creditsReady ? (balance ?? "—") : "…"}
              </span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-navy/50">
                credits · top up
              </span>
            </span>
            <ChevronRight size={15} className="shrink-0 text-navy/35" />
          </button>
        ) : (
          <button
            onClick={onBuyCredits}
            title={`Credits: ${creditsReady ? (balance ?? "—") : "…"}`}
            className="mb-2 grid h-10 w-full place-items-center rounded-xl border border-line bg-paper text-[#b07d18] transition-colors hover:border-gold"
          >
            <Coins size={17} />
          </button>
        )}
        <div className={cn("flex items-center gap-2.5 rounded-xl px-2 py-1.5", collapsed && "flex-col gap-1 px-0")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-black text-white">
            {(userEmail || "?").charAt(0).toUpperCase()}
          </span>
          {!collapsed && (
            <span className="min-w-0 flex-1 truncate text-xs font-bold text-navy/70" title={userEmail}>
              {userEmail}
            </span>
          )}
          <button
            onClick={onSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-navy/45 transition-colors hover:bg-coral/10 hover:text-coral"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function RecruiterShell(props: ShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const meta = RECRUITER_TAB_META[props.active];

  return (
    <div className="flex min-h-screen bg-white text-navy">
      {/* desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-line/70 bg-[#fafbfe] transition-[width] duration-200 lg:block",
          collapsed ? "w-[76px]" : "w-[264px]",
        )}
      >
        <SidebarBody {...props} collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-20 grid h-6 w-6 place-items-center rounded-full border border-line bg-white text-navy/50 shadow-sm transition-colors hover:text-navy"
        >
          <ChevronRight size={13} className={cn("transition-transform", collapsed ? "" : "rotate-180")} />
        </button>
      </aside>

      {/* mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-[#fafbfe] shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-lg text-navy/50 hover:bg-navy/5 hover:text-navy"
            >
              <X size={18} />
            </button>
            <SidebarBody {...props} collapsed={false} onNavigateDone={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-[90] border-b border-line/70 bg-white/90 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-navy/70 lg:hidden"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-navy/40">
                <Briefcase size={11} />
                <span>{meta.group}</span>
                <ChevronRight size={11} />
                <span className="text-coral">{meta.label}</span>
              </div>
              <h1 className="mt-0.5 truncate text-xl font-black tracking-tight text-navy sm:text-2xl">
                {meta.label}
              </h1>
            </div>
            <button
              onClick={props.onBuyCredits}
              className="hidden items-center gap-2 rounded-xl border border-line bg-paper px-4 py-2.5 text-sm font-black text-navy transition-colors hover:border-gold sm:flex"
              title="Top up credits"
            >
              <Coins size={16} className="text-[#b07d18]" />
              {props.creditsReady ? (props.balance ?? "—") : "…"}
            </button>
            <button
              onClick={props.onBuyCredits}
              className="rounded-xl bg-gold px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy shadow-[0_6px_14px_rgba(255,216,90,0.4)] transition-all hover:-translate-y-px sm:px-5"
            >
              Buy credits
            </button>
          </div>
        </header>

        {/* page */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">
            <p className="mb-5 text-sm text-navy/55">{meta.blurb}</p>
            {props.children}
          </div>
        </main>
      </div>
    </div>
  );
}

/** Minimal centered shell for loading / redirect states (no sidebar). */
export function RecruiterSimpleShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex items-center gap-2.5 border-b border-line/70 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Cvyon home">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-black tracking-tight text-navy">Cvyon</span>
          <span className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-coral">Recruiter</span>
        </Link>
      </div>
      <div className="grid flex-1 place-items-center px-4">{children}</div>
    </div>
  );
}
