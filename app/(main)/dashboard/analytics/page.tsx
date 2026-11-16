"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, SearchCheck, FileDown, Loader2, ShieldCheck } from "lucide-react";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

type Report = {
  searchAppearances: number;
  profileViews: null;
  downloads: null;
  measurementScope: string;
  capped: boolean;
  recentEvents: { event_type: string; created_at: string }[];
};

export default function CandidateVisibilityPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/user/analytics", { credentials: "same-origin", cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Analytics unavailable");
        return (await response.json()) as Report;
      })
      .then(data => {
        if (controller.signal.aborted) return;
        if (data.measurementScope !== "candidate_recruiter_search_impressions") {
          throw new Error("Unexpected measurement scope");
        }
        setReport(data); setStatus("ready");
      })
      .catch(() => { if (!controller.signal.aborted) setStatus("error"); });
    return () => controller.abort();
  }, []);

  return <V3Page pageName="dashboard_analytics">
    <div className="mx-auto max-w-4xl">
      <Link href="/dashboard" className="mb-7 inline-flex items-center gap-2 text-xs font-extrabold text-muted hover:text-brand">
        <ArrowLeft size={16} /> Back to dashboard
      </Link>
      <V3Eyebrow>Candidate visibility · account-specific</V3Eyebrow>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-5xl">Your recruiter visibility</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">
        This page shows recorded appearances of your profile in recruiter search results.
        A search-result appearance is <strong>not</strong> confirmation that a recruiter opened,
        read, or downloaded your resume.
      </p>
      <div className="mt-8 rounded-2xl border border-line bg-paper p-5 sm:p-7">
        {status === "loading" && <p role="status" className="flex items-center gap-2 text-muted"><Loader2 size={17} className="animate-spin"/> Loading your account records…</p>}
        {status === "error" && <p role="alert" className="text-sm text-red-700">We could not verify your analytics records. No figures are being estimated or substituted.</p>}
        {status === "ready" && report && <>
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand/10 p-4 text-brand"><SearchCheck size={26}/></div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-muted">Recorded recruiter search appearances</p>
              <p className="mt-1 text-4xl font-black tabular-nums text-navy">{report.searchAppearances.toLocaleString()}</p>
            </div>
          </div>
          {report.capped && <p className="mt-3 text-sm text-muted">Showing the latest 1,000 recorded appearances; historical totals may be higher.</p>}
          <h2 className="mt-7 text-lg font-extrabold text-navy">Recent search appearances</h2>
          {report.recentEvents.length === 0
            ? <p className="mt-3 text-sm text-muted">No recruiter search appearances have been recorded for your account.</p>
            : <ol className="mt-3 space-y-2">{report.recentEvents.map((item,i)=>
                <li key={i} className="flex items-center gap-2 rounded-lg bg-lavender/50 p-3 text-sm text-navy">
                  <Eye size={15} aria-hidden="true"/> Appeared in recruiter matches · {new Date(item.created_at).toLocaleString()}
                </li>
              )}</ol>}
        </>}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <section className="rounded-2xl border border-line bg-paper p-5">
          <Eye className="text-brand" size={21}/>
          <h2 className="mt-3 text-base font-extrabold text-navy">Actual profile opens</h2>
          <p className="mt-2 text-sm text-muted">Not currently measured. We will not turn recruiter search impressions into fabricated profile-view counts.</p>
        </section>
        <section className="rounded-2xl border border-line bg-paper p-5">
          <FileDown className="text-brand" size={21}/>
          <h2 className="mt-3 text-base font-extrabold text-navy">Third-party resume downloads</h2>
          <p className="mt-2 text-sm text-muted">Not currently measured per candidate. Your own builder exports are a separate action and should not be counted as recruiter downloads.</p>
        </section>
      </div>
      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <ShieldCheck size={18} className="shrink-0"/> Only events linked to your authenticated candidate record are shown. 
        Analytics is privacy-scoped; unrecorded actions cannot be reconstructed.
      </p>
    </div>
  </V3Page>;
}
