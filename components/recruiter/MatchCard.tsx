"use client";
import React, { useState } from "react";
import { MapPin, Briefcase, Unlock, Loader2, Bookmark, Check, Lock, Mail, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  JdMatch, UnlockContact, MatchTier,
  unlockContact, addToShortlist, removeFromShortlist, ApiError,
} from "@/lib/recruiter-api";
import toast from "react-hot-toast";

const TIER_STYLE: Record<MatchTier, { label: string; ring: string; border: string; text: string; bg: string }> = {
  excellent: { label: "Excellent", ring: "#0E8A4B", border: "border-[#0E8A4B]", text: "text-[#0E8A4B]", bg: "bg-[#0E8A4B]/10" },
  strong: { label: "Strong", ring: "#5548f5", border: "border-brand", text: "text-brand", bg: "bg-brand/10" },
  moderate: { label: "Moderate", ring: "#151a46", border: "border-navy/40", text: "text-navy/70", bg: "bg-cream" },
};

export function ScoreRing({ score, ring, size = 68 }: { score: number; ring: string; size?: number }) {  const r = 26;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const fill = ((pct / 100) * c).toFixed(1);
  return (
    <svg width={size} height={size} viewBox="0 0 68 68" className="shrink-0" role="img" aria-label={`match score ${pct} percent`}>
      <circle cx="34" cy="34" r={r} stroke="#151a46" strokeOpacity="0.12" strokeWidth="7" fill="none" />
      <circle
        cx="34" cy="34" r={r} stroke={ring} strokeWidth="7" fill="none"
        strokeDasharray={`${fill} ${c.toFixed(1)}`} transform="rotate(-90 34 34)"
      />
      <text x="34" y="34" textAnchor="middle" dominantBaseline="central"
        fontSize="17" fontWeight="900" fill="#151a46">{pct}</text>
    </svg>
  );
}

/**
 * Anonymized premium candidate card. Pre-unlock: headline, title, years, top
 * skills, location, match reasons — NEVER names, photos, or contact details.
 * Unlock spends 1 credit and reveals contact inline.
 */
export function MatchCard({
  match,
  onCreditsChanged,
  defaultShortlisted = false,
  compareSelected = false,
  onToggleCompare,
  compareDisabled = false,
}: {
  match: JdMatch;
  onCreditsChanged: (remaining: number) => void;
  defaultShortlisted?: boolean;
  compareSelected?: boolean;
  onToggleCompare?: (m: JdMatch) => void;
  compareDisabled?: boolean;
}) {
  const [unlocking, setUnlocking] = useState(false);
  const [contact, setContact] = useState<UnlockContact | null>(null);
  const [shortlisted, setShortlisted] = useState(defaultShortlisted || !!match.shortlisted);
  const [shortlistBusy, setShortlistBusy] = useState(false);
  const p = match.profile;
  const tier = TIER_STYLE[match.tier] ?? TIER_STYLE.moderate;
  const matched = match.matchedSkills ?? [];
  const missing = match.missingSkills ?? [];

  const handleUnlock = async () => {
    if (contact || unlocking) return;
    setUnlocking(true);
    try {
      const res = await unlockContact(match.profileId);
      setContact(res.contact);
      onCreditsChanged(res.remainingCredits);
      toast.success(`Contact unlocked — ${res.remainingCredits} credit${res.remainingCredits === 1 ? "" : "s"} left.`);
    } catch (e: any) {
      if (e instanceof ApiError && e.code === "out_of_credits") {
        toast.error("You're out of credits — buy a pack to unlock contacts.", { duration: 5000 });
      } else {
        toast.error(e?.message || "Couldn't unlock this contact.");
      }
    } finally {
      setUnlocking(false);
    }
  };

  const toggleShortlist = async () => {
    if (shortlistBusy) return;
    setShortlistBusy(true);
    try {
      if (shortlisted) {
        await removeFromShortlist(match.profileId);
        setShortlisted(false);
        toast.success("Removed from shortlist.");
      } else {
        await addToShortlist(match.profileId);
        setShortlisted(true);
        toast.success("Shortlisted — now in your pipeline.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update shortlist.");
    } finally {
      setShortlistBusy(false);
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
      {/* ── header: score ring + tier + identity ── */}
      <div className="flex items-start gap-4 rounded-t-2xl border-b border-line bg-cream/60 p-5">
        <ScoreRing score={match.score} ring={tier.ring} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em]", tier.border, tier.text, tier.bg)}>
              {tier.label}
            </span>
            <span className="rounded-full border border-line bg-cream px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-navy/70">
              {p.completenessScore}% profile
            </span>
          </div>
          <h3 className="mt-2 text-lg font-extrabold leading-tight tracking-tight text-navy">{p.headline || "Candidate"}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-navy/75">
            <Briefcase size={13} className="shrink-0 text-brand" />
            <span className="truncate">{p.currentTitle || "—"}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-wider text-navy/70">
            {(p.location || p.country) && (
              <span className="flex items-center gap-1"><MapPin size={12} /> {[p.location, p.country].filter(Boolean).join(", ")}</span>
            )}
            {p.yearsExperience != null && <span>{p.yearsExperience} yrs exp</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {/* ── skill-match bars ── */}
        {matched.length > 0 && (
          <div>
            <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#0E8A4B]">
              Matched ({matched.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matched.slice(0, 8).map((s) => (
                <span key={s} className="rounded-full border border-[#0E8A4B] bg-[#0E8A4B]/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0E8A4B]">{s}</span>
              ))}
              {matched.length > 8 && (
                <span className="px-1 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0E8A4B]/70">+{matched.length - 8} more</span>
              )}
            </div>
          </div>
        )}
        {missing.length > 0 && (
          <div className="mt-3">
            <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/50">
              Missing ({missing.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {missing.slice(0, 8).map((s) => (
                <span key={s} className="rounded-full border border-dashed border-navy/25 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-navy/50">{s}</span>
              ))}
              {missing.length > 8 && (
                <span className="px-1 py-1 text-[9px] font-extrabold uppercase tracking-[0.14em] text-navy/40">+{missing.length - 8} more</span>
              )}
            </div>
          </div>
        )}

        {/* ── match-reason chips ── */}
        {match.reasons.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {match.reasons.map((r, i) => (
              <span key={i} className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1.5 text-[11px] font-medium text-navy/80">
                <Check size={12} className="shrink-0 text-[#0E8A4B]" /> {r}
              </span>
            ))}
          </div>
        )}

        {/* ── actions row ── */}
        <div className="mt-auto flex items-stretch gap-2 pt-5">
          <button
            onClick={toggleShortlist}
            disabled={shortlistBusy}
            aria-label={shortlisted ? "Remove from shortlist" : "Shortlist candidate"}
            title={shortlisted ? "Remove from shortlist" : "Shortlist candidate"}
            className={cn(
              "grid h-[46px] w-[46px] shrink-0 place-items-center rounded-[10px] border transition-transform hover:-translate-y-px",
              shortlisted
                ? "border-navy bg-gold text-navy"
                : "border-line bg-paper text-navy/40 hover:border-navy hover:text-navy",
            )}
          >
            {shortlistBusy ? <Loader2 size={16} className="animate-spin" /> : <Bookmark size={16} fill={shortlisted ? "currentColor" : "none"} />}
          </button>
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(match)}
              disabled={compareDisabled}
              aria-pressed={compareSelected}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-[10px] border px-3 text-[11px] font-extrabold uppercase tracking-wider transition-transform hover:-translate-y-px disabled:opacity-40",
                compareSelected
                  ? "border-brand bg-brand text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)]"
                  : "border-line bg-paper text-navy/60 hover:border-navy hover:text-navy",
              )}
            >
              <span className={cn("grid h-4 w-4 place-items-center rounded-[4px] border", compareSelected ? "border-white bg-white text-brand" : "border-current")}>
                {compareSelected && <Check size={12} strokeWidth={3} />}
              </span>
              Compare
            </button>
          )}
          {!contact && (
            <button
              onClick={handleUnlock}
              disabled={unlocking}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-navy px-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral disabled:opacity-60",
                onToggleCompare ? "" : "flex-[2]",
              )}
            >
              {unlocking ? <Loader2 size={14} className="animate-spin" /> : <Lock size={13} />}
              Unlock · 1 credit
            </button>
          )}
        </div>

        {/* ── inline contact reveal ── */}
        {contact ? (
          <div className="mt-3 rounded-2xl border border-[#0E8A4B]/40 bg-[#0E8A4B]/10 p-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#0E8A4B]">
              <Unlock size={12} /> contact unlocked
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 font-bold text-navy"><User size={14} className="text-navy/50" /> {contact.fullName}</div>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 font-semibold text-brand hover:underline">
                <Mail size={14} className="text-navy/50" /> {contact.email}
              </a>
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 font-semibold text-brand hover:underline">
                  <Phone size={14} className="text-navy/50" /> {contact.phone}
                </a>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-navy/45">
            name & contact stay hidden until unlock
          </p>
        )}
      </div>
    </article>
  );
}
