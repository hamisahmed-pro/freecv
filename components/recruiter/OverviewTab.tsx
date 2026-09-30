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
    { icon: Coins, label: "Credits", value: creditsReady ? String(balance ?? "—") : null, loading: !creditsReady, accent: "text-[#ff604b]" },
    { icon: Search, label: "Searches run", value: String(searches.length), loading: false, accent: "text-[#5548f5]" },
    { icon: Unlock, label: "Contacts unlocked", value: String(unlocks.length), loading: false, accent: "text-[#0E8A4B]" },
    { icon: Bookmark, label: "Shortlisted", value: String(shortlistCount), loading: false, accent: "text-[#151a46]" },
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
        <div className="mb-8 border-[3px] border-[#151a46] bg-[#151a46] hs p-8 text-center text-[#f6f5ef] sm:p-12">
          <Sparkles size={40} className="mx-auto mb-4 text-[#ffd85a]" />
          <h2 className="fd text-3xl tracking-tight sm:text-4xl">Your hiring cockpit.</h2>
          <p className="mx-auto mt-3 max-w-md text-[#f6f5ef]/70">
            Run your first JD search to light up this dashboard.
          </p>
          <button
            onClick={() => onAction("search")}
            className="mt-6 inline-flex items-center gap-2 border-[3px] border-[#f6f5ef] bg-[#ff604b] px-8 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <Search size={16} /> New search
          </button>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="border-[3px] border-[#151a46] bg-white hs p-5">
            <s.icon size={20} className={s.accent} />
            <div className="fd mt-3 text-3xl tracking-tight sm:text-4xl">
              {s.loading ? <Loader2 size={24} className="animate-spin text-[#151a46]/40" /> : s.value}
            </div>
            <div className="fm mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* recent activity */}
        <div className="border-[3px] border-[#151a46] bg-white hs lg:col-span-3">
          <div className="border-b-[3px] border-[#151a46] bg-[#f6f5ef] px-5 py-3 fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/70">
            § recent activity
          </div>
          {feed.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-[#151a46]/55">
              Nothing yet — searches and unlocks will show up here.
            </p>
          ) : (
            <ul className="divide-y-2 divide-[#151a46]/10">
              {feed.map((f) => (
                <li key={f.key} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border-2 border-[#151a46] bg-[#f6f5ef]">
                    <f.icon size={16} className="text-[#151a46]/70" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-[#151a46]">{f.title}</div>
                    <div className="fm text-[10px] uppercase tracking-[0.14em] text-[#151a46]/55">{f.sub}</div>
                  </div>
                  <span className="shrink-0 fm text-[10px] uppercase tracking-[0.14em] text-[#151a46]/50">{fmtDate(f.date)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* quick actions */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <button
            onClick={() => onAction("search")}
            className="group flex flex-1 items-center gap-4 border-[3px] border-[#151a46] bg-[#ff604b] hs p-5 text-left transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-[#151a46] bg-white">
              <Search size={20} />
            </span>
            <span>
              <span className="fh block text-base font-extrabold uppercase tracking-wide">New search</span>
              <span className="text-sm text-[#151a46]/70">Paste a JD, meet your matches</span>
            </span>
          </button>
          <button
            onClick={() => onAction("credits")}
            className="group flex flex-1 items-center gap-4 border-[3px] border-[#151a46] bg-[#ffd85a] hs p-5 text-left transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-[#151a46] bg-white">
              <Coins size={20} />
            </span>
            <span>
              <span className="fh block text-base font-extrabold uppercase tracking-wide">Buy credits</span>
              <span className="text-sm text-[#151a46]/70">1 credit = 1 contact unlock</span>
            </span>
          </button>
          <button
            onClick={() => onAction("pipeline")}
            className={cn(
              "group flex flex-1 items-center gap-4 border-[3px] border-[#151a46] bg-white hs p-5 text-left transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
            )}
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center border-[3px] border-[#151a46] bg-[#f6f5ef]">
              <Bookmark size={20} />
            </span>
            <span>
              <span className="fh block text-base font-extrabold uppercase tracking-wide">Open pipeline</span>
              <span className="text-sm text-[#151a46]/70">{shortlistCount} candidate{shortlistCount === 1 ? "" : "s"} in play</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
