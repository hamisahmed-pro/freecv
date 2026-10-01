"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";

const FEATURES = [
  "180 ATS-Optimized Templates (Grid, Swiss, Corporate)",
  "AI ATS Grader & Keyword Matcher",
  "One-Click LinkedIn Import",
  "PDF and DOCX Export",
  "Strict GDPR Compliance & Data Ownership",
];

export default function AboutClient() {
  return (
    <V3Page
      pageName="about"
      cta={{ label: "Build free →", href: "/build" }}
    >
      <div className="mx-auto max-w-[900px]">
        {/* ─── HERO ─── */}
        <V3Eyebrow>About Cvyon</V3Eyebrow>
        <h1 className="max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy md:text-[52px]">
          Premium tools.<br />
          <span className="text-coral">Forever free.</span>
        </h1>
        <div className="mt-5 max-w-[700px] space-y-5 text-[17px] leading-relaxed text-muted">
          <p>
            The job market is harder than it has been in a decade. Candidates send hundreds of applications into the void, hoping to bypass automated Applicant Tracking Systems (ATS) that ruthlessly filter out qualified talent due to formatting errors or keyword mismatches.
          </p>
          <p>
            Yet, the industry standard for résumé builders is to lure candidates in with a &ldquo;free builder,&rdquo; only to lock their completed PDF behind a sudden $30/month paywall right when they click download.
          </p>
        </div>

        {/* ─── MISSION ─── */}
        <section className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          <V3Eyebrow>Our mission</V3Eyebrow>
          <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
            Optimizing your career shouldn&rsquo;t cost you a week&rsquo;s groceries.
          </h2>
          <p className="mt-3 max-w-[700px] text-[15px] leading-relaxed text-muted">
            We built a world-class, AI-powered ATS Grader and Resume Builder that generates pristine, ATS-parsable PDFs and Word documents.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <V3Pill>No watermarks</V3Pill>
            <V3Pill>No required sign-ups</V3Pill>
            <V3Pill>No hidden paywalls</V3Pill>
          </div>
        </section>

        {/* ─── HOW WE KEEP IT FREE ─── */}
        <section className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          <V3Eyebrow>How we keep it free</V3Eyebrow>
          <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
            If you aren&rsquo;t paying, how do we keep the servers running?
          </h2>
          <div className="mt-3 max-w-[700px] space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              <strong className="text-navy">Transparent Recruitment.</strong> When you download your resume, you have the option to opt-in to our talent network. If you choose to opt-in, verified recruiters can discover your profile and reach out with relevant opportunities. The recruiters pay for sourcing tools—which fully subsidizes the infrastructure that keeps the builder free for you and other candidates.
            </p>
            <p>
              If you choose <em>not</em> to opt-in, that&rsquo;s completely fine too. Your data remains on your device, and you still get to download your resume for free.
            </p>
          </div>
        </section>

        {/* ─── WHAT YOU GET ─── */}
        <section className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          <V3Eyebrow>What you get</V3Eyebrow>
          <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
            Everything a paid builder gives you
          </h2>
          <ul className="mt-6 space-y-4">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-[15px] font-medium text-navy">
                <CheckCircle2 size={20} className="shrink-0 text-brand" />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* ─── CTA ─── */}
        <section className="mt-[34px] rounded-[18px] bg-navy px-7 py-12 text-center text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:py-16">
          <h2 className="text-[30px] leading-[1.04] tracking-[-0.045em] sm:text-[40px]">
            Build a resume that gets read.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[650px] text-[17px] leading-relaxed text-[#bfc2d5]">
            Free forever. No sign-up. No watermark. Just a resume that passes the robots.
          </p>
          <Link
            href="/build"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Start building <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </V3Page>
  );
}
