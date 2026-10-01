"use client";
import React, { useState } from "react";
import { Search, Loader2, Sparkles, SlidersHorizontal, ChevronDown } from "lucide-react";
import { runJdMatch, MatchResult, MatchFilters, MatchTier, ApiError } from "@/lib/recruiter-api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export interface JdInput {
  jobDescription: string;
  jobTitle: string;
  location: string;
  filters?: MatchFilters;
}

const TIER_OPTS: { id: MatchTier; label: string }[] = [
  { id: "excellent", label: "Excellent" },
  { id: "strong", label: "Strong" },
  { id: "moderate", label: "Moderate" },
];

/**
 * "Paste a job description → Find candidates" — the marketplace hero action.
 * Runs POST /api/recruiter/match and hands the exact API result to onResult.
 * The panel variant carries a collapsible "Advanced filters" section
 * (min years, must-have skills, tier multi-select, sort).
 */
export function JdSearchForm({
  variant = "hero",
  defaultValues,
  onResult,
}: {
  variant?: "hero" | "panel";
  defaultValues?: Partial<JdInput>;
  onResult: (result: MatchResult, input: JdInput) => void;
}) {
  const [jobDescription, setJobDescription] = useState(defaultValues?.jobDescription || "");
  const [jobTitle, setJobTitle] = useState(defaultValues?.jobTitle || "");
  const [location, setLocation] = useState(defaultValues?.location || "");
  const [searching, setSearching] = useState(false);

  // advanced filters (panel variant only)
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [minYears, setMinYears] = useState("");
  const [mustHaveSkills, setMustHaveSkills] = useState("");
  const [tiers, setTiers] = useState<MatchTier[]>(["excellent", "strong", "moderate"]);
  const [sort, setSort] = useState<"score" | "experience">("score");

  const toggleTier = (t: MatchTier) => {
    setTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const buildFilters = (): MatchFilters | undefined => {
    const filters: MatchFilters = {};
    const years = parseInt(minYears, 10);
    if (!Number.isNaN(years) && years > 0) filters.minYears = years;
    const skills = mustHaveSkills.split(",").map((s) => s.trim()).filter(Boolean);
    if (skills.length > 0) filters.mustHaveSkills = skills;
    if (tiers.length > 0 && tiers.length < TIER_OPTS.length) filters.tiers = tiers;
    if (sort !== "score") filters.sort = sort;
    return Object.keys(filters).length > 0 ? filters : undefined;
  };

  const submit = async () => {
    const jd = jobDescription.trim();
    if (jd.length < 30) {
      toast.error("Paste the full job description — a few sentences at least.");
      return;
    }
    const hero = variant === "hero";
    const filters = hero ? undefined : buildFilters();
    setSearching(true);
    try {
      const result = await runJdMatch({
        jobDescription: jd,
        jobTitle: jobTitle.trim() || undefined,
        location: location.trim() || undefined,
        page: 1,
        pageSize: 30,
        filters,
      });
      onResult(result, { jobDescription: jd, jobTitle: jobTitle.trim(), location: location.trim(), filters });
    } catch (e: any) {
      const msg = e instanceof ApiError && e.code === "auth"
        ? "Sign in as a recruiter to search."
        : e?.message || "Search failed — try again.";
      toast.error(msg);
    } finally {
      setSearching(false);
    }
  };

  const hero = variant === "hero";

  return (
    <div className={cn(hero ? "" : "rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-7")}>
      {!hero && (
        <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-navy/50">
          § new JD search
        </div>
      )}
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-navy/70">
        Paste a job description
      </label>
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={hero ? 7 : 6}
          placeholder={"e.g.\nSenior Backend Engineer — Lagos (hybrid).\nMust have: Node.js, PostgreSQL, 4+ years…\nNice to have: AWS, GraphQL…"}
          className="w-full resize-y rounded-[10px] border border-line bg-white p-4 text-sm leading-relaxed text-navy placeholder:text-navy/35 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)] min-h-[140px]"
        />
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-navy/30">
          <Sparkles size={12} /> AI-matched
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title (optional)"
          className="rounded-[10px] border border-line bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="rounded-[10px] border border-line bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 outline-none transition-all focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
        />
      </div>

      {!hero && (
        <div className="mt-4 overflow-hidden rounded-[10px] border border-line">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center justify-between bg-cream px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-navy transition-colors hover:bg-lavender"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} /> Advanced filters
              {buildFilters() && (
                <span className="rounded-full bg-coral px-1.5 py-0.5 text-[9px] font-bold text-white">on</span>
              )}
            </span>
            <ChevronDown size={15} className={cn("transition-transform", filtersOpen && "rotate-180")} />
          </button>
          {filtersOpen && (
            <div className="grid gap-4 border-t border-line bg-paper p-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">
                  Min years of experience
                </label>
                <input
                  type="number"
                  min={0}
                  value={minYears}
                  onChange={(e) => setMinYears(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy/35 outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">
                  Sort results
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "score" | "experience")}
                  className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm font-semibold text-navy outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                >
                  <option value="score">Best match</option>
                  <option value="experience">Most experienced</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">
                  Must-have skills (comma separated)
                </label>
                <input
                  value={mustHaveSkills}
                  onChange={(e) => setMustHaveSkills(e.target.value)}
                  placeholder="e.g. Node.js, PostgreSQL, AWS"
                  className="w-full rounded-[10px] border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-navy/35 outline-none focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-navy/60">
                  Match tiers
                </div>
                <div className="flex flex-wrap gap-2">
                  {TIER_OPTS.map((t) => {
                    const on = tiers.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleTier(t.id)}
                        aria-pressed={on}
                        className={cn(
                          "flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-all",
                          on
                            ? "border-navy bg-navy text-white"
                            : "border-line bg-paper text-navy/50 hover:border-navy hover:text-navy",
                        )}
                      >
                        <span className={cn("grid h-4 w-4 place-items-center rounded border-2", on ? "border-gold bg-gold text-navy" : "border-navy/40")}>
                          {on && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M1.5 5.5L4 8L8.5 2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={submit}
        disabled={searching}
        className={cn(
          "group mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] bg-coral px-7 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px disabled:opacity-60",
          hero ? "py-5 text-base" : "py-4",
        )}
      >
        {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="transition-transform group-hover:scale-110" />}
        {searching ? "Matching candidates…" : "Find candidates"}
      </button>
      <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-navy/50">
        free to search · counts shown before you spend a credit
      </p>
    </div>
  );
}
