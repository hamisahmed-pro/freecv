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
    <div className="border-[3px] border-[#151a46] bg-white hs p-6">
      <div className="fm mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#151a46]/50">
        § recruiter activity on your profile
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-[#151a46] bg-[#f6f5ef] p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Eye size={18} className="text-[#5548f5]" />
            <span className="fd text-3xl tracking-tight">{data.views}</span>
          </div>
          <div className="fm mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#151a46]/60">
            recruiter{data.views === 1 ? "" : "s"} viewed you
          </div>
        </div>
        <div className="border-2 border-[#151a46] bg-[#f6f5ef] p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Unlock size={18} className="text-[#0E8A4B]" />
            <span className="fd text-3xl tracking-tight">{data.unlocks}</span>
          </div>
          <div className="fm mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#151a46]/60">
            unlocked your contact
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-[#151a46]/65">
        {data.views === 0
          ? "No recruiter has viewed your profile yet. Keep your profile complete — the pool grows daily as job seekers join."
          : "Recruiters only ever see your anonymized profile until they unlock your contact."}
      </p>
    </div>
  );
}

export function RecruiterActivitySkeleton() {
  return (
    <div className="flex items-center gap-3 border-[3px] border-[#151a46] bg-white p-5">
      <Loader2 size={18} className="animate-spin text-[#5548f5]" />
      <span className="fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60">loading activity…</span>
    </div>
  );
}
