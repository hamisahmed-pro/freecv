"use client";
import React from "react";
import { GitCompare, X, MapPin, Check, ArrowLeft } from "lucide-react";
import { JdMatch, MatchTier } from "@/lib/recruiter-api";
import { ScoreRing } from "@/components/recruiter/MatchCard";
import { cn } from "@/lib/utils";

const TIER_META: Record<MatchTier, { label: string; ring: string; badge: string }> = {
  excellent: { label: "Excellent", ring: "#0E8A4B", badge: "border-[#0E8A4B] text-[#0E8A4B] bg-[#0E8A4B]/10" },
  strong: { label: "Strong", ring: "#5548f5", badge: "border-[#5548f5] text-[#5548f5] bg-[#5548f5]/10" },
  moderate: { label: "Moderate", ring: "#151a46", badge: "border-[#151a46]/40 text-[#151a46]/70 bg-[#f6f5ef]" },
};

function chips(list: string[], kind: "matched" | "missing") {
  return (
    <div className="flex flex-wrap gap-1.5">
      {list.length === 0 && <span className="text-xs text-[#151a46]/40">—</span>}
      {list.slice(0, 10).map((s) => (
        <span
          key={s}
          className={cn(
            "border-2 px-2 py-0.5 fm text-[9px] font-bold uppercase tracking-[0.14em]",
            kind === "matched"
              ? "border-[#0E8A4B] bg-[#0E8A4B]/10 text-[#0E8A4B]"
              : "border-dashed border-[#151a46]/35 text-[#151a46]/50",
          )}
        >
          {s}
        </span>
      ))}
      {list.length > 10 && (
        <span className="px-1 py-0.5 fm text-[9px] font-bold text-[#151a46]/45">+{list.length - 10} more</span>
      )}
    </div>
  );
}

const ROWS: { key: string; label: string }[] = [
  { key: "score", label: "Score" },
  { key: "tier", label: "Tier" },
  { key: "years", label: "Experience" },
  { key: "location", label: "Location" },
  { key: "title", label: "Current title" },
  { key: "matched", label: "Matched skills" },
  { key: "missing", label: "Missing skills" },
  { key: "reasons", label: "Why they match" },
];

/**
 * Side-by-side candidate comparison (max 3). Sticky row-label column on
 * desktop, horizontally scrollable on mobile.
 */
export function CompareTab({
  candidates,
  onRemove,
  onBack,
}: {
  candidates: JdMatch[];
  onRemove: (profileId: string) => void;
  onBack?: () => void;
}) {
  if (candidates.length === 0) {
    return (
      <div className="py-8">
        <div className="border-[3px] border-[#151a46] bg-white hs py-20 text-center">
          <GitCompare size={40} className="mx-auto mb-3 text-[#151a46]/30" />
          <p className="fh text-lg font-extrabold">Nothing to compare yet.</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-[#151a46]/60">
            Select up to 3 candidates from your search results to compare them side by side.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="mt-6 inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-6 py-3 fh text-xs font-extrabold uppercase tracking-wider text-[#f6f5ef] hover:bg-[#ff604b] hover:border-[#ff604b]"
            >
              <ArrowLeft size={14} /> Back to search
            </button>
          )}
        </div>
      </div>
    );
  }

  const shown = candidates.slice(0, 3);

  const cell = (m: JdMatch, rowKey: string): React.ReactNode => {
    const p = m.profile;
    const tier = TIER_META[m.tier] ?? TIER_META.moderate;
    switch (rowKey) {
      case "score":
        return <ScoreRing score={m.score} ring={tier.ring} size={52} />;
      case "tier":
        return (
          <span className={cn("border-2 px-2 py-0.5 fm text-[10px] font-bold uppercase tracking-[0.16em]", tier.badge)}>
            {tier.label}
          </span>
        );
      case "years":
        return <span className="font-bold">{p.yearsExperience != null ? `${p.yearsExperience} yrs` : "—"}</span>;
      case "location":
        return (
          <span className="flex items-center gap-1 text-sm">
            <MapPin size={13} className="shrink-0 text-[#151a46]/50" />
            {[p.location, p.country].filter(Boolean).join(", ") || "—"}
          </span>
        );
      case "title":
        return <span className="text-sm font-semibold">{p.currentTitle || "—"}</span>;
      case "matched":
        return chips(m.matchedSkills ?? [], "matched");
      case "missing":
        return chips(m.missingSkills ?? [], "missing");
      case "reasons":
        return (
          <ul className="space-y-1.5">
            {m.reasons.length === 0 && <li className="text-xs text-[#151a46]/40">—</li>}
            {m.reasons.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#151a46]/80">
                <Check size={12} className="mt-0.5 shrink-0 text-[#0E8A4B]" /> {r}
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      <div className="overflow-x-auto border-[3px] border-[#151a46] bg-white hs">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b-[3px] border-[#151a46]">
              <th className="sticky left-0 z-10 w-36 border-r-[3px] border-[#151a46] bg-[#f6f5ef] px-4 py-4 fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
                &nbsp;
              </th>
              {shown.map((m) => (
                <th key={m.profileId} className="min-w-[220px] bg-[#151a46] px-4 py-4 align-top text-[#f6f5ef]">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="fh truncate text-base font-extrabold tracking-tight">{m.profile.headline || "Candidate"}</div>
                      <div className="fm mt-1 text-[10px] uppercase tracking-[0.14em] text-[#f6f5ef]/60">anonymized</div>
                    </div>
                    <button
                      onClick={() => onRemove(m.profileId)}
                      aria-label="Remove from comparison"
                      className="grid h-8 w-8 shrink-0 place-items-center border-2 border-[#f6f5ef]/40 text-[#f6f5ef]/70 transition-colors hover:border-[#ff604b] hover:bg-[#ff604b] hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, ri) => (
              <tr key={row.key} className={cn("border-b-2 border-[#151a46]/10 last:border-0", ri % 2 === 1 && "bg-[#f6f5ef]/40")}>
                <th className="sticky left-0 z-10 border-r-[3px] border-[#151a46] bg-[#f6f5ef] px-4 py-4 fm text-[10px] font-bold uppercase tracking-[0.16em] text-[#151a46]/70">
                  {row.label}
                </th>
                {shown.map((m) => (
                  <td key={m.profileId} className="px-4 py-4 align-top">
                    {cell(m, row.key)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 fm text-[10px] uppercase tracking-[0.16em] text-[#151a46]/50">
        anonymized · unlock from a search to reveal contact details
      </p>
    </div>
  );
}
