"use client";

import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

const PAYG_FEATURES = [
  "Access to full ATS-parsed profiles",
  "Download PDF/DOCX resumes",
  "Direct contact email and phone",
  "Advanced boolean search filtering",
];

const ENTERPRISE_FEATURES = [
  "50 profile unlocks",
  "$29 per additional unlock",
  "ATS Integration (Greenhouse, Lever)",
  "Shared team folders & collaboration",
  "Priority support",
];

export default function PricingClient() {
  return (
    <V3Page
      pageName="pricing"
      logoSub="RECRUITER"
      links={[
        { href: "/", label: "Home" },
        { href: "/recruiter", label: "For recruiters" },
        { href: "/support", label: "Support" },
      ]}
      cta={{ label: "Sign in", href: "/recruiter/login" }}
    >
      {/* ─── HERO ─── */}
      <div className="mx-auto max-w-[900px] py-10 text-center md:py-[70px]">
        <V3Eyebrow>Recruiter pricing</V3Eyebrow>
        <h1 className="mx-auto max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy sm:text-6xl lg:text-7xl">
          Source the opt-in talent pool.<br />
          <span className="text-brand">Skip the noise.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
          Our talent network consists of candidates actively optimizing their careers. No stale profiles, just high-intent professionals.
        </p>
      </div>

      {/* ─── PLANS ─── */}
      <div className="mx-auto grid max-w-[900px] gap-[18px] md:grid-cols-2">
        {/* Pay as you go */}
        <div className="flex flex-col rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
          <span className="mb-4 inline-flex w-fit items-center gap-[7px] rounded-full bg-lavender px-[11px] py-[7px] text-[10px] font-black uppercase tracking-[0.1em] text-brand">
            Flexible
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy">Pay As You Go</h2>
          <p className="mt-2 text-[14px] font-medium text-muted">Perfect for boutique agencies and solo recruiters.</p>
          <div className="mt-6 text-[48px] font-extrabold leading-none tracking-tight text-navy">
            $49<span className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted"> / unlock</span>
          </div>

          <ul className="mb-10 mt-8 flex-1 space-y-4">
            {PAYG_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] font-medium text-navy">
                <Check size={20} className="mt-0.5 shrink-0 text-coral" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/recruiter/signup?plan=payg"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Start Sourcing <ArrowRight size={16} />
          </Link>
        </div>

        {/* Enterprise */}
        <div className="relative flex flex-col rounded-[18px] border-2 border-coral bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
          <span className="absolute -top-[14px] right-7 inline-flex w-fit items-center gap-[7px] rounded-full bg-coral px-[11px] py-[7px] text-[10px] font-black uppercase tracking-[0.1em] text-white">
            Best Value
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-navy">Enterprise</h2>
          <p className="mt-2 text-[14px] font-medium text-muted">For high-volume in-house talent teams.</p>
          <div className="mt-6 text-[48px] font-extrabold leading-none tracking-tight text-navy">
            $499<span className="text-[14px] font-bold uppercase tracking-[0.1em] text-muted"> one-time</span>
          </div>

          <ul className="mb-10 mt-8 flex-1 space-y-4">
            {ENTERPRISE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-[15px] font-medium text-navy">
                <Check size={20} className="mt-0.5 shrink-0 text-gold" />
                {f}
              </li>
            ))}
          </ul>

          <Link
            href="/recruiter/signup?plan=enterprise"
            className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Buy 30 days of recruiter access <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ─── TRUST LINE ─── */}
      <p className="mx-auto mt-10 max-w-[900px] pb-[50px] text-center text-[11px] font-bold uppercase tracking-[0.16em] text-muted md:pb-[72px]">
        One-time access · No subscription · No stale profiles
      </p>
    </V3Page>
  );
}
