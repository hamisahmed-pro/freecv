"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RecruiterShell, RecruiterSimpleShell, RecruiterTab } from "@/components/recruiter/RecruiterShell";
import { JdSearchForm, JdInput } from "@/components/recruiter/JdSearchForm";
import { MatchCard } from "@/components/recruiter/MatchCard";
import { OverviewTab } from "@/components/recruiter/OverviewTab";
import { CompareTab } from "@/components/recruiter/CompareTab";
import { PipelineTab } from "@/components/recruiter/PipelineTab";
import { ProfileTab } from "@/components/recruiter/ProfileTab";
import { ResultListSkeleton, TableSkeleton } from "@/components/recruiter/Skeletons";
import {
  MatchResult, MatchTier, JdMatch, CreditPack, SavedSearch, UnlockRecord,
  runJdMatch, getCredits, checkoutCredits, getSearches, setSearchSaved,
  getUnlocks, ensureRecruiter, updateRecruiterProfile,
} from "@/lib/recruiter-api";
import {
  PortalShortlistItem, getPipelineShortlist,
  renameSearch, deleteSearch, duplicateSearch,
} from "@/lib/recruiter-portal";
import { cn } from "@/lib/utils";
import {
  Search, Bookmark, History, Unlock, Loader2, X,
  FileText, MapPin, CalendarDays, Play, ArrowRight, Users,
  Pencil, Copy, Trash2, Check,
} from "lucide-react";
import toast from "react-hot-toast";

type Tab = RecruiterTab;

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

/* ------------------------- saved/history row ------------------------- */

function SearchRow({
  s, onRerun, onListsChanged,
}: {
  s: SavedSearch;
  onRerun: (s: SavedSearch) => void;
  onListsChanged: () => void;
}) {
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(s.jobTitle || "");
  const [busy, setBusy] = useState<string | null>(null);

  const handleToggleSaved = async () => {
    try {
      await setSearchSaved(s.id, !s.saved);
      toast.success(s.saved ? "Removed from saved." : "Search saved.");
      onListsChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update saved searches.");
    }
  };

  const handleRename = async () => {
    const title = titleDraft.trim();
    if (!title) { toast.error("Give the search a title."); return; }
    setBusy("rename");
    try {
      await renameSearch(s.id, title);
      setRenaming(false);
      toast.success("Search renamed.");
      onListsChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't rename this search.");
    } finally {
      setBusy(null);
    }
  };

  const handleDuplicate = async () => {
    setBusy("duplicate");
    try {
      await duplicateSearch(s.id);
      toast.success("Search duplicated.");
      onListsChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't duplicate this search.");
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this search? This can't be undone.")) return;
    setBusy("delete");
    try {
      await deleteSearch(s.id);
      toast.success("Search deleted.");
      onListsChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't delete this search.");
    } finally {
      setBusy(null);
    }
  };

  const iconBtn = "grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper transition-all disabled:opacity-50";

  return (
    <div className="rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <FileText size={16} className="shrink-0 text-brand" />
            {renaming ? (
              <div className="flex flex-1 items-center gap-2">
                <input
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
                  autoFocus
                  className="min-w-0 flex-1 rounded-[10px] border border-line bg-paper px-3 py-1.5 text-base font-extrabold tracking-tight text-navy outline-none focus:border-coral"
                />
                <button onClick={handleRename} disabled={busy !== null} aria-label="Save title"
                  className={cn(iconBtn, "bg-teal text-white hover:bg-navy")}>
                  {busy === "rename" ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                </button>
                <button onClick={() => setRenaming(false)} aria-label="Cancel rename"
                  className={cn(iconBtn, "text-navy/60 hover:text-navy")}>
                  <X size={15} />
                </button>
              </div>
            ) : (
              <h3 className="truncate text-lg font-extrabold tracking-tight text-navy">{s.jobTitle || "Untitled search"}</h3>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold uppercase tracking-wider text-navy/60">
            {s.location && <span className="flex items-center gap-1"><MapPin size={11} /> {s.location}</span>}
            {s.createdAt && <span className="flex items-center gap-1"><CalendarDays size={11} /> {new Date(s.createdAt).toLocaleDateString()}</span>}
            {s.counts?.total != null && <span>{fmtN(s.counts.total)} matches</span>}
          </div>
          {s.jobDescription && <p className="mt-3 line-clamp-2 text-sm text-navy/65">{s.jobDescription}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            onClick={() => onRerun(s)}
            className="flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:bg-coral"
          >
            <Play size={13} /> Run
          </button>
          <button
            onClick={handleToggleSaved}
            className={cn(
              "flex items-center gap-2 rounded-[10px] border px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider transition-all",
              s.saved
                ? "border-navy bg-gold text-navy"
                : "border-line bg-paper text-navy/60 hover:border-navy hover:text-navy",
            )}
          >
            <Bookmark size={13} fill={s.saved ? "currentColor" : "none"} /> {s.saved ? "Saved" : "Save"}
          </button>
          <button onClick={() => { setTitleDraft(s.jobTitle || ""); setRenaming(true); }} aria-label="Rename search" title="Rename"
            className={cn(iconBtn, "text-navy/60 hover:text-navy")}>
            <Pencil size={15} />
          </button>
          <button onClick={handleDuplicate} disabled={busy !== null} aria-label="Duplicate search" title="Duplicate"
            className={cn(iconBtn, "text-navy/60 hover:text-navy")}>
            {busy === "duplicate" ? <Loader2 size={15} className="animate-spin" /> : <Copy size={15} />}
          </button>
          <button onClick={handleDelete} disabled={busy !== null} aria-label="Delete search" title="Delete"
            className={cn(iconBtn, "text-navy/60 hover:border-coral hover:bg-coral hover:text-white")}>
            {busy === "delete" ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

export default function RecruiterDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(undefined); // undefined = auth not yet resolved
  const [loading, setLoading] = useState(true);

  // company gate — nobody uses the dashboard without a real company on file
  const [needsCompany, setNeedsCompany] = useState(false);
  const [gateCompany, setGateCompany] = useState("");
  const [gateSaving, setGateSaving] = useState(false);

  // credits
  const [balance, setBalance] = useState<number | null>(null);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [creditsReady, setCreditsReady] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);

  // search state
  const [tab, setTab] = useState<Tab>("overview");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [input, setInput] = useState<JdInput | null>(null);
  const [bootSearching, setBootSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [savedTick, setSavedTick] = useState(0);

  // compare selection
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // lists
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [pipeline, setPipeline] = useState<PortalShortlistItem[]>([]);
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
      const [s, pl, u] = await Promise.allSettled([getSearches(), getPipelineShortlist(), getUnlocks()]);
      if (s.status === "fulfilled") setSearches(s.value.searches);
      if (pl.status === "fulfilled") setPipeline(pl.value.shortlist);
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
      // 0) guarantee the recruiter row exists and carries the real company.
      //    OAuth signups stash the company in sessionStorage on the signup page.
      let stashed: string | null = null;
      try {
        stashed = sessionStorage.getItem("cvyon-recruiter-company");
        sessionStorage.removeItem("cvyon-recruiter-company");
      } catch {}
      const ensured = await ensureRecruiter(stashed || undefined);
      if (!ensured.company_name) setNeedsCompany(true);

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
        setCompareIds([]);
        setSavedTick((t) => t + 1);
        setTab("search");
      } else {
        // 2) JD pasted on the landing before sign-in — run it now (no filters)
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
            setResult(r); setInput(pending); setCompareIds([]); setSavedTick((t) => t + 1); setTab("search");
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
    setCompareIds([]); // new search → clear compare selection
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
        filters: input.filters,
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

  const handleRerun = async (s: SavedSearch) => {
    const jd = s.jobDescription || "";
    if (jd.length < 30) { toast.error("This saved search has no job description to re-run."); return; }
    setTab("search");
    try {
      // SavedSearch carries no filters — re-run without them.
      const r = await runJdMatch({ jobDescription: jd, jobTitle: s.jobTitle, location: s.location, page: 1, pageSize: 30 });
      setResult(r);
      setInput({ jobDescription: jd, jobTitle: s.jobTitle || "", location: s.location || "" });
      setCompareIds([]);
      setSavedTick((t) => t + 1);
      document.getElementById("jd-results")?.scrollIntoView({ behavior: "smooth" });
    } catch (e: any) {
      toast.error(e?.message || "Couldn't re-run this search.");
    }
  };

  const toggleCompare = (m: JdMatch) => {
    if (compareIds.includes(m.profileId)) {
      setCompareIds(compareIds.filter((id) => id !== m.profileId));
    } else if (compareIds.length >= 3) {
      toast.error("You can compare up to 3 candidates at a time.");
    } else {
      setCompareIds([...compareIds, m.profileId]);
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

  const compareCandidates = useMemo(() => {
    if (!result) return [];
    const byId = new Map(result.matches.map((m) => [m.profileId, m]));
    return compareIds.map((id) => byId.get(id)).filter(Boolean) as JdMatch[];
  }, [result, compareIds]);

  const savedSearches = searches.filter((s) => s.saved);
  const historySearches = searches.filter((s) => !s.saved);

  /* ------------------------------ shells ----------------------------- */

  const handleSignOut = async () => {
    try { await supabase.auth.signOut(); } finally { router.replace("/recruiter/login"); }
  };

  // Company gate: the recruiter must name their company before touching the pool.
  const handleGateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = gateCompany.trim();
    if (!name) { toast.error("Enter your company name to continue."); return; }
    setGateSaving(true);
    try {
      await updateRecruiterProfile({ company_name: name });
      setNeedsCompany(false);
      toast.success("Company saved — welcome aboard.");
    } catch (err: any) {
      toast.error(err?.message || "Couldn't save your company. Try again.");
    } finally {
      setGateSaving(false);
    }
  };

  const shellProps = {
    active: tab,
    onNavigate: setTab,
    userEmail: user?.email || "",
    balance,
    creditsReady,
    onBuyCredits: () => setBuyOpen(true),
    onSignOut: handleSignOut,
    counts: {
      compare: compareIds.length,
      pipeline: pipeline.length,
      saved: savedSearches.length,
      history: historySearches.length,
      unlocks: unlocks.length,
    },
  };

  if (loading) {
    return (
      <RecruiterSimpleShell>
        <div className="flex flex-col items-center gap-3 text-navy/60">
          <Loader2 size={30} className="animate-spin text-brand" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">loading…</span>
        </div>
      </RecruiterSimpleShell>
    );
  }

  if (!user) {
    // The redirect is handled by the effect above; this shell only covers the
    // brief moment between the session resolving to null and the navigation.
    return (
      <RecruiterSimpleShell>
        <div className="flex flex-col items-center gap-3 text-navy/60">
          <Loader2 size={30} className="animate-spin text-brand" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em]">redirecting…</span>
        </div>
      </RecruiterSimpleShell>
    );
  }

  if (needsCompany) {
    // Blocking gate: no company on file → no access to the pool.
    return (
      <RecruiterSimpleShell>
        <div className="w-full max-w-[440px] rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-brand">
            One more thing
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy">
            Which company are you hiring for?
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            We keep a record of every company buying candidate data on Cvyon.
            Your profile stays private to us — candidates never see it.
          </p>
          <form onSubmit={handleGateSubmit} className="mt-5 grid gap-3">
            <input
              autoFocus
              value={gateCompany}
              onChange={(e) => setGateCompany(e.target.value)}
              placeholder="Acme Talent"
              autoComplete="organization"
              className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
            />
            <button
              type="submit"
              disabled={gateSaving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-[18px] py-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition-transform hover:-translate-y-px disabled:opacity-60"
            >
              {gateSaving ? <Loader2 size={16} className="animate-spin" /> : "Save and continue"}
            </button>
          </form>
        </div>
      </RecruiterSimpleShell>
    );
  }

  return (
    <RecruiterShell {...shellProps}>
      {/* ═══════════ TAB: OVERVIEW ═══════════ */}
      {tab === "overview" && (
        listsLoading ? (
          <div className="py-8"><ResultListSkeleton /></div>
        ) : (
          <OverviewTab
            balance={balance}
            creditsReady={creditsReady}
            searches={searches}
            unlocks={unlocks}
            shortlistCount={pipeline.length}
            onAction={(a) => {
              if (a === "search") setTab("search");
              else if (a === "credits") setBuyOpen(true);
              else if (a === "pipeline") setTab("pipeline");
            }}
          />
        )
      )}

      {/* ═══════════ TAB: NEW SEARCH ═══════════ */}
      {tab === "search" && (
        <div className="py-8">
          <JdSearchForm variant="panel" onResult={handleResult} />

          {bootSearching && (
            <div className="mt-8"><ResultListSkeleton /></div>
          )}

          {result && !bootSearching && (
            <div id="jd-results" className="mt-10 scroll-mt-24">
              {/* extracted JD summary */}
              <div className="rounded-2xl bg-navy p-5 text-white shadow-[0_16px_38px_rgba(23,27,75,0.25)] sm:p-6">
                <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                  <span>§ what we read in your JD</span>
                  <button onClick={handleSaveSearch} className="flex items-center gap-1.5 rounded-full border border-gold/60 px-2.5 py-1 text-gold transition-colors hover:bg-gold hover:text-navy">
                    <Bookmark size={12} /> Save search
                  </button>
                </div>
                <div className="text-xl font-extrabold tracking-tight">{result.extracted.title || input?.jobTitle || "Your role"}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                  {result.extracted.location && <span className="flex items-center gap-1"><MapPin size={12} /> {result.extracted.location}</span>}
                  {result.extracted.minYears != null && <span>{result.extracted.minYears}{result.extracted.maxYears ? `–${result.extracted.maxYears}` : "+"} yrs</span>}
                </div>
                {result.extracted.mustHaveSkills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.extracted.mustHaveSkills.map((s) => (
                      <span key={s} className="rounded-full border border-gold/60 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">{s}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* honest counts */}
              <div className="mt-6 rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
                <div className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
                  {fmtN(result.counts.total)} candidate{result.counts.total === 1 ? "" : "s"}
                  <span className="text-navy/50"> — {fmtN(result.counts.excellent)} excellent, {fmtN(result.counts.strong)} strong, {fmtN(result.counts.moderate)} moderate</span>
                </div>
                <p className="mt-2 text-sm text-navy/60">
                  {result.counts.total === 0
                    ? "No candidates match this JD yet. Try broadening the description — the pool grows daily as job seekers join."
                    : "Counts from this exact search — the pool grows daily as job seekers join."}
                </p>
              </div>

              {/* tiered groups */}
              {grouped.length === 0 ? (
                <div className="mt-8 rounded-2xl border border-line bg-paper py-20 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
                  <Users size={40} className="mx-auto mb-3 text-navy/30" />
                  <p className="text-lg font-extrabold tracking-tight text-navy">No matching candidates yet.</p>
                  <p className="mt-1 text-sm text-navy/60">Try a broader description or a different location.</p>
                </div>
              ) : (
                grouped.map((g) => (
                  <div key={g.tier} className="mt-10">
                    <div className="mb-4 flex items-center gap-3">
                      <h2 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">{TIER_LABEL[g.tier]}</h2>
                      <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-bold text-navy">{g.items.length}</span>
                      <span className="h-px flex-1 bg-navy/15" />
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                      {g.items.map((m) => (
                        <MatchCard
                          key={`${m.profileId}-${savedTick}`}
                          match={m}
                          defaultShortlisted={pipeline.some((s) => s.profileId === m.profileId)}
                          onCreditsChanged={setBalance}
                          compareSelected={compareIds.includes(m.profileId)}
                          onToggleCompare={toggleCompare}
                          compareDisabled={compareIds.length >= 3 && !compareIds.includes(m.profileId)}
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
                    className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-paper px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-navy shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-all hover:-translate-y-px disabled:opacity-60"
                  >
                    {loadingMore ? <Loader2 size={16} className="animate-spin" /> : null}
                    Show more ({fmtN(result.counts.total - result.matches.length)} remaining)
                  </button>
                </div>
              )}
            </div>
          )}

          {!result && !bootSearching && (
            <div className="mt-8 rounded-2xl border border-dashed border-navy/35 bg-paper/50 p-10 text-center">
              <Search size={36} className="mx-auto mb-3 text-navy/25" />
              <p className="text-lg font-extrabold tracking-tight text-navy">Paste a job description to begin.</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-navy/60">
                Searching is free. You&apos;ll see real tiered counts before spending a single credit.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: COMPARE ═══════════ */}
      {tab === "compare" && (
        <CompareTab
          candidates={compareCandidates}
          onRemove={(id) => setCompareIds((prev) => prev.filter((x) => x !== id))}
          onBack={() => setTab("search")}
        />
      )}

      {/* ═══════════ TAB: PIPELINE ═══════════ */}
      {tab === "pipeline" && (
        listsLoading ? (
          <div className="py-8"><ResultListSkeleton /></div>
        ) : (
          <PipelineTab
            items={pipeline}
            onChanged={loadLists}
            onNewSearch={() => setTab("search")}
          />
        )
      )}

      {/* ═══════════ TAB: SAVED / HISTORY ═══════════ */}
      {(tab === "saved" || tab === "history") && (
        <div className="py-8">
          {listsLoading ? (
            <ResultListSkeleton />
          ) : (tab === "saved" ? savedSearches : historySearches).length === 0 ? (
            <div className="rounded-2xl border border-line bg-paper py-20 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              {tab === "saved" ? <Bookmark size={40} className="mx-auto mb-3 text-navy/30" /> : <History size={40} className="mx-auto mb-3 text-navy/30" />}
              <p className="text-lg font-extrabold tracking-tight text-navy">{tab === "saved" ? "No saved searches yet." : "No search history yet."}</p>
              <p className="mt-1 text-sm text-navy/60">
                {tab === "saved" ? "Run a JD search, then hit “Save search” to pin it here." : "Your past JD searches will appear here."}
              </p>
              <button onClick={() => setTab("search")} className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral">
                New search <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="grid gap-5">
              {(tab === "saved" ? savedSearches : historySearches).map((s) => (
                <SearchRow key={s.id} s={s} onRerun={handleRerun} onListsChanged={loadLists} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: UNLOCKS ═══════════ */}
      {tab === "unlocks" && (
        <div className="py-8">
          {listsLoading ? (
            <TableSkeleton />
          ) : unlocks.length === 0 ? (
            <div className="rounded-2xl border border-line bg-paper py-20 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <Unlock size={40} className="mx-auto mb-3 text-navy/30" />
              <p className="text-lg font-extrabold tracking-tight text-navy">No unlocks yet.</p>
              <p className="mt-1 text-sm text-navy/60">Unlocked contacts appear here with receipts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-cream text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">
                    <th className="px-5 py-3">Candidate</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Unlocked</th>
                    <th className="px-5 py-3 text-right">Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {unlocks.map((u, i) => (
                    <tr key={`${u.profileId}-${i}`} className="border-b border-line/60 last:border-0">
                      <td className="px-5 py-4 font-bold text-navy">{u.contact?.fullName || "Candidate"}</td>
                      <td className="px-5 py-4 text-navy/70">
                        {u.contact?.email && <div>{u.contact.email}</div>}
                        {u.contact?.phone && <div className="text-navy/55">{u.contact.phone}</div>}
                        {!u.contact?.email && !u.contact?.phone && <span className="text-navy/40">—</span>}
                      </td>
                      <td className="px-5 py-4 text-navy/60">{u.unlockedAt ? new Date(u.unlockedAt).toLocaleString() : "—"}</td>
                      <td className="px-5 py-4 text-right font-bold text-navy">{u.creditsSpent ?? 1} credit{(u.creditsSpent ?? 1) === 1 ? "" : "s"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ═══════════ TAB: PROFILE & SECURITY ═══════════ */}
      {tab === "profile" && (
        <div className="py-8">
          <ProfileTab signInEmail={user?.email || ""} />
        </div>
      )}

      {/* ─── BUY CREDITS MODAL ─── */}
      {buyOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm print:hidden" onClick={() => setBuyOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl overflow-hidden rounded-3xl bg-cream shadow-[0_24px_60px_rgba(23,27,75,0.25)]">
            <div className="flex items-center justify-between bg-navy px-6 py-4 text-white">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">top up</div>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Buy credits</h2>
              </div>
              <button aria-label="Close" onClick={() => setBuyOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-colors hover:border-coral hover:bg-coral">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              {!creditsReady ? (
                <div className="flex items-center justify-center gap-3 py-10 text-navy/60">
                  <Loader2 size={22} className="animate-spin text-brand" /> Loading packs…
                </div>
              ) : packs.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-lg font-extrabold tracking-tight text-navy">Credit packs aren&apos;t available yet.</p>
                  <p className="mt-1 text-sm text-navy/60">Our billing is still being wired up — check back shortly.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-3">
                  {packs.map((pack) => (
                    <div key={pack.id} className="flex flex-col rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/55">{pack.name}</div>
                      <div className="mt-2 text-3xl font-black tracking-tight text-navy">{pack.credits} <span className="text-lg text-navy/50">credits</span></div>
                      <div className="mt-1 text-xl font-extrabold text-navy">{fmtPrice(pack.priceKobo, pack.currency)}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal">{fmtPrice(Math.round(pack.priceKobo / pack.credits), pack.currency)} / unlock</div>
                      <button
                        onClick={() => handleCheckout(pack.id)}
                        disabled={checkingOut !== null}
                        className="mt-4 flex items-center justify-center gap-2 rounded-[10px] bg-navy px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral disabled:opacity-60"
                      >
                        {checkingOut === pack.id ? <Loader2 size={14} className="animate-spin" /> : null}
                        Buy
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-navy/50">
                1 credit = 1 contact unlock · credits never expire · billed via Paystack
              </p>
            </div>
          </div>
        </div>
      )}
    </RecruiterShell>
  );
}
