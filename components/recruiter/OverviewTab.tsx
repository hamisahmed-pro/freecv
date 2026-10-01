"use client";
import React, { useMemo } from "react";
import { Coins, Search, Unlock, Bookmark, FileText, Sparkles, Loader2 } from "lucide-react";
import { SavedSearch, UnlockRecord } from "@/lib/recruiter-api";
import { cn } from "@/lib/utils";

export type OverviewAction = "search" | "credits" | "pipeline";

interface FeedItem {
  key: string;
  icon: any;
  title: string;
  sub: string;
  date: string; // ISO-ish, for sorting
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

/**
 * Dashboard home: stat cards, recent activity, quick actions.
 */
export function OverviewTab({
  balance,
  creditsReady,
  searches,
  unlocks,
  shortlistCount,
  onAction,
}: {
  balance: number | null;
  creditsReady: boolean;
  searches: SavedSearch[];
  unlocks: UnlockRecord[];
  shortlistCount: number;
  onAction: (a: OverviewAction) => void;
}) {
  const stats = [
    { icon: Coins, label: "Credits", value: creditsReady ? String(balance ?? "—") : null, loading: !creditsReady, accent: "text-coral" },
    { icon: Search, label: "Searches run", value: String(searches.length), loading: false, accent: "text-brand" },
    { icon: Unlock, label: "Contacts unlocked", value: String(unlocks.length), loading: false, accent: "text-[#0E8A4B]" },
    { icon: Bookmark, label: "Shortlisted", value: String(shortlistCount), loading: false, accent: "text-navy" },
  ];

  const feed: FeedItem[] = useMemo(() => {
    const sItems: FeedItem[] = [...searches]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
      .slice(0, 5)
      .map((s) => ({
        key: `s-${s.id}`,
        icon: FileText,
        title: s.jobTitle || "Untitled search",
        sub: s.counts?.total != null ? `${s.counts.total} matches` : "JD search",
        date: s.createdAt || "",
      }));
    const uItems: FeedItem[] = [...unlocks]
      .sort((a, b) => String(b.unlockedAt || "").localeCompare(String(a.unlockedAt || "")))
      .slice(0, 5)
      .map((u, i) => ({
        key: `u-${u.profileId}-${i}`,
        icon: Unlock,
        title: u.contact?.fullName || "Candidate",
        sub: `Contact unlocked · ${u.creditsSpent ?? 1} credit${(u.creditsSpent ?? 1) === 1 ? "" : "s"}`,
        date: u.unlockedAt || "",
      }));
    return [...sItems, ...uItems]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [searches, unlocks]);

  const allZero = searches.length === 0 && unlocks.length === 0 && shortlistCount === 0;

  return (
    <div className="py-8">
      {allZero && (
        <div className="mb-8 rounded-[18px] bg-navy p-8 text-center text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] sm:p-12">
          <Sparkles size={40} className="mx-auto mb-4 text-gold" />
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Your hiring dashboard.</h2>
          <p className="mx-auto mt-3 max-w-md text-white/70">
            Run your first JD search to light up this dashboard.
          </p>
          <button
            onClick={() => onAction("search")}
            className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-coral px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px"
          >
            <Search size={16} /> New search
          </button>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <s.icon size={20} className={s.accent} />
            <div className="mt-3 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              {s.loading ? <Loader2 size={24} className="animate-spin text-navy/40" /> : s.value}
            </div>
            <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* recent activity */}
        <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] lg:col-span-3">
          <div className="border-b border-line bg-cream px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-navy/70">
            Recent activity
          </div>
          {feed.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-navy/55">
              Nothing yet — searches and unlocks will show up here.
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {feed.map((f) => (
                <li key={f.key} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-cream">
                    <f.icon size={16} className="text-navy/70" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-navy">{f.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-navy/55">{f.sub}</div>
                  </div>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-navy/50">{fmtDate(f.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* quick actions */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <button
            onClick={() => onAction("search")}
            className="group flex flex-1 items-center gap-4 rounded-2xl bg-coral p-5 text-left text-white shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">
              <Search size={20} />
            </span>
            <span>
              <span className="block text-base font-extrabold uppercase tracking-wide">New search</span>
              <span className="text-sm text-white/80">Paste a JD, meet your matches</span>
            </span>
          </button>
          <button
            onClick={() => onAction("credits")}
            className="group flex flex-1 items-center gap-4 rounded-2xl bg-gold p-5 text-left text-navy shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/50">
              <Coins size={20} />
            </span>
            <span>
              <span className="block text-base font-extrabold uppercase tracking-wide">Buy credits</span>
              <span className="text-sm text-navy/70">1 credit = 1 contact unlock</span>
            </span>
          </button>
          <button
            onClick={() => onAction("pipeline")}
            className={cn(
              "group flex flex-1 items-center gap-4 rounded-2xl border border-line bg-paper p-5 text-left shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px",
            )}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-cream">
              <Bookmark size={20} className="text-navy" />
            </span>
            <span>
              <span className="block text-base font-extrabold uppercase tracking-wide text-navy">Open pipeline</span>
              <span className="text-sm text-navy/60">{shortlistCount} candidate{shortlistCount === 1 ? "" : "s"} in play</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
