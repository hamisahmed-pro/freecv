"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RisoPage, RisoSectionLabel } from "@/components/riso/RisoChrome";
import { JdSearchForm, JdInput } from "@/components/recruiter/JdSearchForm";
import { MatchCard } from "@/components/recruiter/MatchCard";
import {
  MatchResult, MatchTier, CreditPack, SavedSearch, ShortlistItem, UnlockRecord,
  runJdMatch, getCredits, checkoutCredits, getSearches, setSearchSaved,
  getShortlist, removeFromShortlist, getUnlocks,
} from "@/lib/recruiter-api";
import { cn } from "@/lib/utils";
import {
  Search, Bookmark, History, Unlock, Coins, Loader2, X,
  FileText, MapPin, CalendarDays, Play, ArrowRight, Users, Check,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = "search" | "saved" | "history" | "shortlist" | "unlocks";

const TIER_ORDER: MatchTier[] = ["excellent", "strong", "moderate"];
const TIER_LABEL: Record<MatchTier, string> = { excellent: "Excellent", strong: "Strong", moderate: "Moderate" };

function fmtN(n: number) {
  return new Intl.NumberFormat("en-NG").format(n);
}
const CUR_SYM: Record<string, string> = { USD: "$", NGN: "₦", GHS: "₵", KES: "KSh ", ZAR: "R" };
function fmtPrice(minor: number, currency: string) {
  const sym = CUR_SYM[currency] ?? `${currency} `;
  return `${sym}${fmtN(Math.round(minor / 100))}`;
}

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(undefined); // undefined = auth not yet resolved
  const [loading, setLoading] = useState(true);

  // credits
  const [balance, setBalance] = useState<number | null>(null);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [creditsReady, setCreditsReady] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  // search state
  const [tab, setTab] = useState<Tab>("search");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [input, setInput] = useState<JdInput | null>(null);
  const [bootSearching, setBootSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  // lists
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [shortlist, setShortlist] = useState<ShortlistItem[]>([]);
  const [unlocks, setUnlocks] = useState<UnlockRecord[]>([]);
  const [listsLoading, setListsLoading] = useState(false);

  /* ------------------------------ auth ------------------------------ */
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setUser(data.session?.user || null);
    });
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!cancelled) setUser(s?.user || null);
    });
    return () => { cancelled = true; l.subscription.unsubscribe(); };
  }, []);

  // Logged-out users go to sign-in — but only AFTER the session check has
  // resolved. Redirecting while `user` is still undefined (unknown) is what
  // caused the dashboard <-> login ping-pong loop.
  useEffect(() => {
    if (user === null) {
      router.replace("/recruiter/login?next=/recruiter/dashboard");
    }
  }, [user, router]);

  const loadCredits = useCallback(async () => {
    try {
      const c = await getCredits();
      setBalance(c.balance);
      setPacks(c.packs || []);
    } catch {
      setBalance(null); // endpoint not live yet — UI says so honestly
    } finally {
      setCreditsReady(true);
    }
  }, []);

  const loadLists = useCallback(async () => {
    setListsLoading(true);
    try {
      const [s, sl, u] = await Promise.allSettled([getSearches(), getShortlist(), getUnlocks()]);
      if (s.status === "fulfilled") setSearches(s.value.searches);
      if (sl.status === "fulfilled") setShortlist(sl.value.shortlist);
      if (u.status === "fulfilled") setUnlocks(u.value.unlocks);
    } finally {
      setListsLoading(false);
    }
  }, []);

  // boot: auth → credits; landing handoff (result or pending JD); payment callback
  useEffect(() => {
    if (user === undefined) return; // session check hasn't resolved — stay on the loading shell
    if (!user) { setLoading(false); return; }
    (async () => {
      await loadCredits();

      const params = new URLSearchParams(window.location.search);
      const payment = params.get("payment");
      if (payment === "success") { toast.success("Payment confirmed — credits added."); await loadCredits(); }
      else if (payment === "failed") toast.error("We couldn't confirm your payment yet — it may still be processing.");
      if (payment) router.replace("/recruiter/dashboard");

      // 1) finished search handed off from the landing page
      let handed: { result: MatchResult; input: JdInput } | null = null;
      try {
        const raw = sessionStorage.getItem("cvyon_jd_result");
        if (raw) { handed = JSON.parse(raw); sessionStorage.removeItem("cvyon_jd_result"); }
      } catch {}
      if (handed?.result) {
        setResult(handed.result);
        setInput(handed.input);
        setTab("search");
      } else {
        // 2) JD pasted on the landing before sign-in — run it now
        let pending: JdInput | null = null;
        try {
          const raw = sessionStorage.getItem("cvyon_pending_jd");
          if (raw) { pending = JSON.parse(raw); sessionStorage.removeItem("cvyon_pending_jd"); }
        } catch {}
        if (pending?.jobDescription) {
          setBootSearching(true);
          try {
            const r = await runJdMatch({
              jobDescription: pending.jobDescription,
              jobTitle: pending.jobTitle || undefined,
              location: pending.location || undefined,
              page: 1, pageSize: 30,
            });
            setResult(r); setInput(pending); setTab("search");
          } catch (e: any) {
            toast.error(e?.message || "Couldn't run your saved search.");
          } finally {
            setBootSearching(false);
          }
        }
      }
      await loadLists();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  /* ----------------------------- actions ---------------------------- */

  const handleResult = (r: MatchResult, inp: JdInput) => {
    setResult(r);
    setInput(inp);
    setSavedTick((t) => t + 1);
    document.getElementById("jd-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLoadMore = async () => {
    if (!result || !input || loadingMore) return;
    const nextPage = result.page + 1;
    setLoadingMore(true);
    try {
      const r = await runJdMatch({
        jobDescription: input.jobDescription,
        jobTitle: input.jobTitle || undefined,
        location: input.location || undefined,
        page: nextPage, pageSize: result.pageSize,
      });
      setResult({ ...r, matches: [...result.matches, ...r.matches] });
    } catch (e: any) {
      toast.error(e?.message || "Couldn't load more matches.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!result?.searchId) return;
    try {
      await setSearchSaved(result.searchId, true);
      toast.success("Search saved.");
      await loadLists();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't save this search.");
    }
  };

  const handleToggleSaved = async (s: SavedSearch) => {
    try {
      await setSearchSaved(s.id, !s.saved);
      setSearches((prev) => prev.map((x) => (x.id === s.id ? { ...x, saved: !s.saved } : x)));
      toast.success(s.saved ? "Removed from saved." : "Search saved.");
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update saved searches.");
    }
  };

  const handleRerun = async (s: SavedSearch) => {
    const jd = s.jobDescription || "";
    if (jd.length < 30) { toast.error("This saved search has no job description to re-run."); return; }
    setTab("search");
    try {
      const r = await runJdMatch({ jobDescription: jd, jobTitle: s.jobTitle, location: s.location, page: 1, pageSize: 30 });
      setResult(r);
      setInput({ jobDescription: jd, jobTitle: s.jobTitle || "", location: s.location || "" });
      document.getElementById("jd-results")?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      toast.error(e?.message || "Couldn't re-run this search.");
    }
  };

  const handleRemoveShortlist = async (profileId: string) => {
    try {
      await removeFromShortlist(profileId);
      setShortlist((prev) => prev.filter((x) => x.profileId !== profileId));
      toast.success("Removed from shortlist.");
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update shortlist.");
    }
  };

  const handleCheckout = async (packId: string) => {
    setCheckingOut(packId);
    try {
      const { authorization_url } = await checkoutCredits(packId);
      if (authorization_url) window.location.href = authorization_url;
      else toast.error("Checkout failed — no payment link returned.");
    } catch (e: any) {
      toast.error(e?.message || "Checkout failed.");
    } finally {
      setCheckingOut(null);
    }
  };

  const grouped = useMemo(() => {
    if (!result) return [];
    return TIER_ORDER.map((tier) => ({
      tier,
      items: result.matches.filter((m) => m.tier === tier),
    })).filter((g) => g.items.length > 0);
  }, [result]);

  const savedSearches = searches.filter((s) => s.saved);
  const historySearches = searches.filter((s) => !s.saved);

  /* ------------------------------ shells ----------------------------- */

  const shell = (children: React.ReactNode) => (
    <RisoPage pageName="recruiter_dashboard" ticker={false}>{children}</RisoPage>
  );

  if (loading) {
    return shell(
      <div className="flex flex-col items-center gap-3 py-32 text-[#141312]/60">
        <Loader2 size={30} className="animate-spin text-[#2233FF]" />
        <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">loading…</span>
      </div>
    );
  }

  if (!user) {
    // The redirect is handled by the effect above; this shell only covers the
    // brief moment between the session resolving to null and the navigation.
    return shell(
      <div className="flex flex-col items-center gap-3 py-32 text-[#141312]/60">
        <Loader2 size={30} className="animate-spin text-[#2233FF]" />
        <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">redirecting…</span>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "search", label: "New search", icon: Search },
    { id: "saved", label: "Saved", icon: Bookmark, count: savedSearches.length },
    { id: "history", label: "History", icon: History, count: historySearches.length },
    { id: "shortlist", label: "Shortlist", icon: Check, count: shortlist.length },
    { id: "unlocks", label: "Unlocks", icon: Unlock, count: unlocks.length },
  ];

  return shell(
    <>
      {/* ─── header: title + credit balance ─── */}
      <div className="flex flex-col justify-between gap-5 py-6 sm:flex-row sm:items-end">
        <div>
          <RisoSectionLabel color="#2233FF">recruiter dashboard</RisoSectionLabel>
          <h1 className="fd text-4xl tracking-tight sm:text-5xl">Find your next hire.</h1>
          <p className="mt-2 text-[#141312]/60">Signed in as <span className="font-bold text-[#141312]">{user.email}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="border-[3px] border-[#141312] bg-white hs px-5 py-3 text-center">
            <div className="fd flex items-center justify-center gap-1.5 text-2xl">
              <Coins size={20} className="text-[#FF4326]" />
              {creditsReady ? (balance ?? "—") : <Loader2 size={20} className="animate-spin text-[#141312]/40" />}
            </div>
            <div className="fm text-[9px] font-bold uppercase tracking-widest text-[#141312]/70">credits</div>
          </div>
          <button
            onClick={() => setBuyOpen(true)}
            className="border-[3px] border-[#141312] bg-[#FFE14D] px-6 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            Buy credits
          </button>
        </div>
      </div>

      {/* ─── tabs ─── */}
      <div className="mt-4 flex gap-2 overflow-x-auto border-b-[3px] border-[#141312] pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 border-[3px] border-b-0 px-4 py-3 fh text-xs font-extrabold uppercase tracking-wider transition-colors",
              tab === t.id
                ? "-mb-[3px] border-[#141312] bg-[#141312] text-[#E8E7E1]"
                : "border-transparent text-[#141312]/55 hover:text-[#141312]",
            )}
          >
            <t.icon size={15} />
            {t.label}
            {t.count != null && t.count > 0 && (
              <span className={cn("px-1.5 py-0.5 fm text-[10px] font-bold", tab === t.id ? "bg-[#FFE14D] text-[#141312]" : "bg-[#141312]/10 text-[#141312]/70")}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ═══════════ TAB: NEW SEARCH ═══════════ */}
      {tab === "search" && (
        <div className="py-8">
          <JdSearchForm variant="panel" onResult={handleResult} />

          {bootSearching && (
            <div className="mt-8 flex items-center justify-center gap-3 py-16 text-[#141312]/60">
              <Loader2 size={24} className="animate-spin text-[#2233FF]" />
              <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">matching candidates…</span>
            </div>
          )}

          {result && !bootSearching && (
            <div id="jd-results" className="mt-10 scroll-mt-24">
              {/* extracted JD summary */}
              <div className="border-[3px] border-[#141312] bg-[#141312] p-5 text-[#E8E7E1] sm:p-6">
                <div className="fm mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFE14D]">
                  <span>§ what we read in your JD</span>
                  <button onClick={handleSaveSearch} className="flex items-center gap-1.5 border-2 border-[#FFE14D] px-2.5 py-1 text-[#FFE14D] transition-colors hover:bg-[#FFE14D] hover:text-[#141312]">
                    <Bookmark size={12} /> Save search
                  </button>
                </div>
                <div className="fh text-xl font-extrabold tracking-tight">{result.extracted.title || input?.jobTitle || "Your role"}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 fm text-[11px] uppercase tracking-wider text-[#E8E7E1]/70">
                  {result.extracted.location && <span className="flex items-center gap-1"><MapPin size={12} /> {result.extracted.location}</span>}
                  {result.extracted.minYears != null && <span>{result.extracted.minYears}{result.extracted.maxYears ? `–${result.extracted.maxYears}` : "+"} yrs</span>}
                </div>
                {result.extracted.mustHaveSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.extracted.mustHaveSkills.map((s) => (
                      <span key={s} className="border-2 border-[#FFE14D] px-2 py-1 fm text-[9px] font-bold uppercase tracking-[0.16em] text-[#FFE14D]">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* honest counts */}
              <div className="mt-6 border-[3px] border-[#141312] bg-white hs p-6">
                <div className="fd text-3xl tracking-tight sm:text-4xl">
                  {fmtN(result.counts.total)} candidate{result.counts.total === 1 ? "" : "s"}
                  <span className="text-[#141312]/50"> — {fmtN(result.counts.excellent)} excellent, {fmtN(result.counts.strong)} strong, {fmtN(result.counts.moderate)} moderate</span>
                </div>
                <p className="mt-2 text-sm text-[#141312]/60">
                  {result.counts.total === 0
                    ? "No candidates match this JD yet. Try broadening the description — the pool grows daily as job seekers join."
                    : "Counts from this exact search — the pool grows daily as job seekers join."}
                </p>
              </div>

              {/* tiered groups */}
              {grouped.length === 0 ? (
                <div className="mt-8 border-[3px] border-[#141312] bg-white hs py-20 text-center">
                  <Users size={40} className="mx-auto mb-3 text-[#141312]/30" />
                  <p className="fh text-lg font-extrabold">No matching candidates yet.</p>
                  <p className="mt-1 text-sm text-[#141312]/60">Try a broader description or a different location.</p>
                </div>
              ) : (
                grouped.map((g) => (
                  <div key={g.tier} className="mt-10">
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="fd text-2xl tracking-tight sm:text-3xl">{TIER_LABEL[g.tier]}</h2>
                      <span className="border-2 border-[#141312] bg-white px-2.5 py-1 fm text-[11px] font-bold">{g.items.length}</span>
                      <span className="h-[3px] flex-1 bg-[#141312]/15" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {g.items.map((m) => (
                        <MatchCard
                          key={`${m.profileId}-${savedTick}`}
                          match={m}
                          defaultShortlisted={shortlist.some((s) => s.profileId === m.profileId)}
                          onCreditsChanged={setBalance}
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* pagination */}
              {result.matches.length < result.counts.total && (
                <div className="mt-10 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 border-[3px] border-[#141312] bg-white px-8 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60"
                  >
                    {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                    Show more ({fmtN(result.counts.total - result.matches.length)} remaining)
                  </button>
                </div>
              )}
            </div>
          )}

          {!result && !bootSearching && (
            <div className="mt-8 border-[3px] border-dashed border-[#141312]/35 bg-white/50 p-10 text-center">
              <Search size={36} className="mx-auto mb-3 text-[#141312]/25" />
              <p className="fh text-lg font-extrabold">Paste a job description to begin.</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-[#141312]/60">
                Searching is free. You&apos;ll see real tiered counts before spending a single credit.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: SAVED / HISTORY ═══════════ */}
      {(tab === "saved" || tab === "history") && (
        <div className="py-8">
          {listsLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-[#141312]/60">
              <Loader2 size={24} className="animate-spin text-[#2233FF]" /> Loading…
            </div>
          ) : (tab === "saved" ? savedSearches : historySearches).length === 0 ? (
            <div className="border-[3px] border-[#141312] bg-white hs py-20 text-center">
              {tab === "saved" ? <Bookmark size={40} className="mx-auto mb-3 text-[#141312]/30" /> : <History size={40} className="mx-auto mb-3 text-[#141312]/30" />}
              <p className="fh text-lg font-extrabold">{tab === "saved" ? "No saved searches yet." : "No search history yet."}</p>
              <p className="mt-1 text-sm text-[#141312]/60">
                {tab === "saved" ? "Run a JD search, then hit “Save search” to pin it here." : "Your past JD searches will appear here."}
              </p>
              <button onClick={() => setTab("search")} className="mt-6 inline-flex items-center gap-2 border-[3px] border-[#141312] bg-[#141312] px-6 py-3 fh text-xs font-extrabold uppercase tracking-wider text-[#E8E7E1] hover:bg-[#FF4326] hover:border-[#FF4326]">
                New search <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              {(tab === "saved" ? savedSearches : historySearches).map((s) => (
                <div key={s.id} className="border-[3px] border-[#141312] bg-white hs p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="shrink-0 text-[#2233FF]" />
                        <h3 className="fh truncate text-lg font-extrabold tracking-tight">{s.jobTitle || "Untitled search"}</h3>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 fm text-[11px] uppercase tracking-wider text-[#141312]/60">
                        {s.location && <span className="flex items-center gap-1"><MapPin size={11} /> {s.location}</span>}
                        {s.createdAt && <span className="flex items-center gap-1"><CalendarDays size={11} /> {new Date(s.createdAt).toLocaleDateString()}</span>}
                        {s.counts?.total != null && <span>{fmtN(s.counts.total)} matches</span>}
                      </div>
                      {s.jobDescription && <p className="mt-3 line-clamp-2 text-sm text-[#141312]/65">{s.jobDescription}</p>}
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => handleRerun(s)}
                        className="flex items-center gap-2 border-[3px] border-[#141312] bg-[#141312] px-4 py-2.5 fh text-[11px] font-extrabold uppercase tracking-wider text-[#E8E7E1] transition-all hover:bg-[#FF4326] hover:border-[#FF4326]"
                      >
                        <Play size={13} /> Run
                      </button>
                      <button
                        onClick={() => handleToggleSaved(s)}
                        className={cn(
                          "flex items-center gap-2 border-[3px] px-4 py-2.5 fh text-[11px] font-extrabold uppercase tracking-wider transition-all",
                          s.saved
                            ? "border-[#141312] bg-[#FFE14D] text-[#141312]"
                            : "border-[#141312]/30 bg-white text-[#141312]/60 hover:border-[#141312] hover:text-[#141312]",
                        )}
                      >
                        <Bookmark size={13} fill={s.saved ? "currentColor" : "none"} /> {s.saved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: SHORTLIST ═══════════ */}
      {tab === "shortlist" && (
        <div className="py-8">
          {listsLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-[#141312]/60">
              <Loader2 size={24} className="animate-spin text-[#2233FF]" /> Loading…
            </div>
          ) : shortlist.length === 0 ? (
            <div className="border-[3px] border-[#141312] bg-white hs py-20 text-center">
              <Bookmark size={40} className="mx-auto mb-3 text-[#141312]/30" />
              <p className="fh text-lg font-extrabold">Your shortlist is empty.</p>
              <p className="mt-1 text-sm text-[#141312]/60">Tap the bookmark on any candidate card to pin them here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {shortlist.map((item) => {
                const p = item.profile || {};
                return (
                  <div key={item.profileId} className="flex flex-col border-[3px] border-[#141312] bg-white hs p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="fh text-lg font-extrabold tracking-tight">{p.headline || "Shortlisted candidate"}</h3>
                        {p.currentTitle && <div className="mt-1 text-sm font-semibold text-[#141312]/75">{p.currentTitle}</div>}
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 fm text-[11px] uppercase tracking-wider text-[#141312]/60">
                          {p.country && <span className="flex items-center gap-1"><MapPin size={11} /> {p.country}</span>}
                          {p.yearsExperience != null && <span>{p.yearsExperience} yrs exp</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveShortlist(item.profileId)}
                        aria-label="Remove from shortlist"
                        className="grid h-9 w-9 shrink-0 place-items-center border-[3px] border-[#141312] bg-[#FFE14D] transition-all hover:bg-[#FF4326] hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    </div>
                    {Array.isArray(p.topSkills) && p.topSkills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {p.topSkills.slice(0, 6).map((s: string) => (
                          <span key={s} className="border-2 border-[#141312] bg-[#E8E7E1] px-2 py-1 fm text-[9px] font-bold uppercase tracking-[0.16em]">{s}</span>
                        ))}
                      </div>
                    )}
                    <p className="mt-4 fm text-[10px] uppercase tracking-[0.14em] text-[#141312]/45">
                      anonymized · unlock from a search to reveal contact
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: UNLOCKS ═══════════ */}
      {tab === "unlocks" && (
        <div className="py-8">
          {listsLoading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-[#141312]/60">
              <Loader2 size={24} className="animate-spin text-[#2233FF]" /> Loading…
            </div>
          ) : unlocks.length === 0 ? (
            <div className="border-[3px] border-[#141312] bg-white hs py-20 text-center">
              <Unlock size={40} className="mx-auto mb-3 text-[#141312]/30" />
              <p className="fh text-lg font-extrabold">No unlocks yet.</p>
              <p className="mt-1 text-sm text-[#141312]/60">Unlocked contacts appear here with receipts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border-[3px] border-[#141312] bg-white hs">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b-[3px] border-[#141312] bg-[#E8E7E1] fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#141312]/60">
                    <th className="px-5 py-3">Candidate</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Unlocked</th>
                    <th className="px-5 py-3 text-right">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {unlocks.map((u, i) => (
                    <tr key={`${u.profileId}-${i}`} className="border-b-2 border-[#141312]/10 last:border-0">
                      <td className="px-5 py-4 font-bold">{u.contact?.fullName || "Candidate"}</td>
                      <td className="px-5 py-4 text-[#141312]/70">
                        {u.contact?.email && <div>{u.contact.email}</div>}
                        {u.contact?.phone && <div className="text-[#141312]/55">{u.contact.phone}</div>}
                        {!u.contact?.email && !u.contact?.phone && <span className="text-[#141312]/40">—</span>}
                      </td>
                      <td className="px-5 py-4 text-[#141312]/60">{u.unlockedAt ? new Date(u.unlockedAt).toLocaleString() : "—"}</td>
                      <td className="px-5 py-4 text-right font-bold">{u.creditsSpent ?? 1} credit{(u.creditsSpent ?? 1) === 1 ? "" : "s"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── BUY CREDITS MODAL ─── */}
      {buyOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm print:hidden" onClick={() => setBuyOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl border-[3px] border-[#141312] bg-[#E8E7E1] hs">
            <div className="flex items-center justify-between border-b-[3px] border-[#141312] bg-[#141312] px-6 py-4 text-[#E8E7E1]">
              <div>
                <div className="fm text-[10px] font-bold uppercase tracking-[0.25em] text-[#FFE14D]">top up</div>
                <h2 className="fd mt-1 text-2xl tracking-tight">Buy credits</h2>
              </div>
              <button aria-label="Close" onClick={() => setBuyOpen(false)} className="grid h-10 w-10 place-items-center border-[3px] border-[#E8E7E1] transition-colors hover:border-[#FF4326] hover:bg-[#FF4326]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              {!creditsReady ? (
                <div className="flex items-center justify-center gap-3 py-10 text-[#141312]/60">
                  <Loader2 size={22} className="animate-spin text-[#2233FF]" /> Loading packs…
                </div>
              ) : packs.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="fh text-lg font-extrabold">Credit packs aren&apos;t available yet.</p>
                  <p className="mt-1 text-sm text-[#141312]/60">Our billing is still being wired up — check back shortly.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {packs.map((pack) => (
                    <div key={pack.id} className="flex flex-col border-[3px] border-[#141312] bg-white p-5">
                      <div className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/55">{pack.name}</div>
                      <div className="fd mt-2 text-3xl tracking-tight">{pack.credits} <span className="text-lg text-[#141312]/50">credits</span></div>
                      <div className="fh mt-1 text-xl font-extrabold">{fmtPrice(pack.priceKobo, pack.currency)}</div>
                      <div className="fm mt-1 text-[10px] uppercase tracking-[0.14em] text-[#0E8A4B]">{fmtPrice(Math.round(pack.priceKobo / pack.credits), pack.currency)} / unlock</div>
                      <button
                        onClick={() => handleCheckout(pack.id)}
                        disabled={checkingOut !== null}
                        className="mt-4 flex items-center justify-center gap-2 border-[3px] border-[#141312] bg-[#141312] px-4 py-3 fh text-[11px] font-extrabold uppercase tracking-wider text-[#E8E7E1] transition-all hover:bg-[#FF4326] hover:border-[#FF4326] disabled:opacity-60"
                      >
                        {checkingOut === pack.id ? <Loader2 size={14} className="animate-spin" /> : null}
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-5 text-center fm text-[10px] uppercase tracking-[0.16em] text-[#141312]/50">
                1 credit = 1 contact unlock · credits never expire · billed via Paystack
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
