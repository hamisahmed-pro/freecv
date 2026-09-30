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
    <div className={cn(hero ? "" : "border-[3px] border-[#151a46] bg-white hs p-5 sm:p-7")}>
      {!hero && (
        <div className="fm mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#151a46]/50">
          § new JD search
        </div>
      )}
      <label className="fm mb-2 block text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/70">
        Paste a job description
      </label>
      <div className="relative">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={hero ? 7 : 6}
          placeholder={"e.g.\nSenior Backend Engineer — Lagos (hybrid).\nMust have: Node.js, PostgreSQL, 4+ years…\nNice to have: AWS, GraphQL…"}
          className="w-full resize-y border-[3px] border-[#151a46] bg-white p-4 text-sm leading-relaxed text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#ff604b] min-h-[140px]"
        />
        <span className="pointer-events-none absolute right-3 top-3 flex items-center gap-1 fm text-[10px] font-bold uppercase tracking-widest text-[#151a46]/30">
          <Sparkles size={12} /> AI-matched
        </span>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Job title (optional)"
          className="border-[3px] border-[#151a46] bg-white px-4 py-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#ff604b]"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (optional)"
          className="border-[3px] border-[#151a46] bg-white px-4 py-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#ff604b]"
        />
      </div>

      {!hero && (
        <div className="mt-4 border-[3px] border-[#151a46]">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="flex w-full items-center justify-between bg-[#f6f5ef] px-4 py-3 fm text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46] transition-colors hover:bg-[#ffd85a]"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={14} /> Advanced filters
              {buildFilters() && (
                <span className="border-2 border-[#151a46] bg-[#ff604b] px-1.5 py-0.5 text-[9px] text-white">on</span>
              )}
            </span>
            <ChevronDown size={15} className={cn("transition-transform", filtersOpen && "rotate-180")} />
          </button>
          {filtersOpen && (
            <div className="grid gap-4 border-t-[3px] border-[#151a46] bg-white p-4 sm:grid-cols-2">
              <div>
                <label className="fm mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
                  Min years of experience
                </label>
                <input
                  type="number"
                  min={0}
                  value={minYears}
                  onChange={(e) => setMinYears(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full border-[3px] border-[#151a46] bg-white px-3 py-2.5 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none focus:border-[#ff604b]"
                />
              </div>
              <div>
                <label className="fm mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
                  Sort results
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "score" | "experience")}
                  className="w-full border-[3px] border-[#151a46] bg-white px-3 py-2.5 text-sm font-semibold text-[#151a46] outline-none focus:border-[#ff604b]"
                >
                  <option value="score">Best match</option>
                  <option value="experience">Most experienced</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="fm mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
                  Must-have skills (comma separated)
                </label>
                <input
                  value={mustHaveSkills}
                  onChange={(e) => setMustHaveSkills(e.target.value)}
                  placeholder="e.g. Node.js, PostgreSQL, AWS"
                  className="w-full border-[3px] border-[#151a46] bg-white px-3 py-2.5 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none focus:border-[#ff604b]"
                />
              </div>
              <div className="sm:col-span-2">
                <div className="fm mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
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
                          "flex items-center gap-2 border-[3px] px-3 py-2 fm text-[11px] font-bold uppercase tracking-[0.14em] transition-all",
                          on
                            ? "border-[#151a46] bg-[#151a46] text-[#f6f5ef]"
                            : "border-[#151a46]/30 bg-white text-[#151a46]/50 hover:border-[#151a46] hover:text-[#151a46]",
                        )}
                      >
                        <span className={cn("grid h-4 w-4 place-items-center border-2", on ? "border-[#ffd85a] bg-[#ffd85a] text-[#151a46]" : "border-[#151a46]/40")}>
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
          "group mt-4 flex w-full items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#ff604b] px-7 fh text-sm font-extrabold uppercase tracking-wider text-[#151a46] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0",
          hero ? "py-5 text-base" : "py-4",
        )}
      >
        {searching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} className="transition-transform group-hover:scale-110" />}
        {searching ? "Matching candidates…" : "Find candidates"}
      </button>
      <p className="mt-3 text-center fm text-[10px] uppercase tracking-[0.16em] text-[#151a46]/50">
        free to search · counts shown before you spend a credit
      </p>
    </div>
  );
}
