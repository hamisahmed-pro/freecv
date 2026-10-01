"use client";
import React, { useEffect, useState } from "react";
import { Eye, Unlock, Loader2 } from "lucide-react";
import { getProfileViews } from "@/lib/recruiter-api";

/**
 * Candidate transparency: "Recruiter activity on your profile".
 * Renders EXACTLY what /api/user/profile-views returns. If the endpoint
 * isn't available yet, the section hides itself — never invented numbers.
 */
export function RecruiterActivityCard() {
  const [data, setData] = useState<{ views: number; unlocks: number } | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getProfileViews()
      .then((d) => { if (d) setData(d); else setFailed(true); })
      .catch(() => setFailed(true));
  }, []);

  if (failed || data === null) return null;

  return (
    <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
      <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-navy/50">
        § recruiter activity on your profile
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-line bg-cream p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Eye size={18} className="text-brand" />
            <span className="text-3xl font-black tracking-tight text-navy">{data.views}</span>
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-navy/60">
            recruiter{data.views === 1 ? "" : "s"} viewed you
          </div>
        </div>
        <div className="rounded-xl border border-line bg-cream p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Unlock size={18} className="text-[#0E8A4B]" />
            <span className="text-3xl font-black tracking-tight text-navy">{data.unlocks}</span>
          </div>
          <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-navy/60">
            unlocked your contact
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-navy/65">
        {data.views === 0
          ? "No recruiter has viewed your profile yet. Keep your profile complete — the pool grows daily as job seekers join."
          : "Recruiters only ever see your anonymized profile until they unlock your contact."}
      </p>
    </div>
  );
}

export function RecruiterActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-5">
      <Loader2 size={18} className="animate-spin text-brand" />
      <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy/60">loading activity…</span>
    </div>
  );
}
