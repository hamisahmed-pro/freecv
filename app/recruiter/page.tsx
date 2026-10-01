"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";
import { JdSearchForm, JdInput } from "@/components/recruiter/JdSearchForm";
import { MatchResult } from "@/lib/recruiter-api";
import {
  ArrowRight, ArrowUpRight, Coins, FileText, Search, Unlock,
} from "lucide-react";

// Fallback if the packs API is unreachable — mirrors the admin-set defaults.
const FALLBACK_PACKS = [
  { id: "single", name: "Single unlock", credits: 1, price_kobo: 500, currency: "USD" },
  { id: "pack-10", name: "10-pack", credits: 10, price_kobo: 3900, currency: "USD" },
  { id: "pack-50", name: "50-pack", credits: 50, price_kobo: 14900, currency: "USD" },
];
const PACK_NOTES = ["One perfect candidate, one price.", "For an active hiring sprint.", "For teams hiring at volume."];
const CUR_SYM: Record<string, string> = { USD: "$", NGN: "₦", GHS: "₵", KES: "KSh ", ZAR: "R" };
const fmtNum = (n: number) => new Intl.NumberFormat("en-US").format(n);

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/recruiter", label: "For recruiters" },
  { href: "/support", label: "Support" },
];

const STEPS = [
  {
    n: "01",
    icon: FileText,
    t: "Paste the job description",
    d: "The JD is matched against candidate profiles so the search starts with role relevance.",
  },
  {
    n: "02",
    icon: Search,
    t: "See tiered matches",
    d: "Every candidate is ranked by relevance, with profile signals surfaced before you spend a credit.",
  },
  {
    n: "03",
    icon: Unlock,
    t: "Unlock the contact",
    d: "Unlock contact details only when you have found a candidate you want to reach.",
  },
];

const TRUST = [
  {
    t: "100% opted in",
    d: "Every profile in the pool is explicitly available for recruiter discovery.",
  },
  {
    t: "Anonymized until unlock",
    d: "Names, locations and contact details remain protected until a recruiter unlocks them.",
  },
  {
    t: "Honest counts",
    d: "Every search shows the number of relevant matches and the available pool.",
  },
];

export default function RecruiterLanding() {
  const router = useRouter();
  const [packs, setPacks] = useState(FALLBACK_PACKS);

  useEffect(() => {
    fetch("/api/recruiter/packs")
      .then((r) => r.json())
      .then((j) => { if (Array.isArray(j.packs) && j.packs.length) setPacks(j.packs); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session?.user) return;
      // Returning from Paystack? Verify the transaction server-side before
      // landing on the dashboard, so activation never depends on the webhook.
      const params = new URLSearchParams(window.location.search);
      const reference = params.get("reference") || params.get("trxref");
      if (reference) {
        try {
          const res = await fetch("/api/paystack/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "same-origin",
            body: JSON.stringify({ reference }),
          });
          const json = await res.json().catch(() => ({}));
          router.push(json.ok ? "/recruiter/dashboard?payment=success" : "/recruiter/dashboard?payment=failed");
        } catch {
          router.push("/recruiter/dashboard?payment=failed");
        }
      } else {
        router.push("/recruiter/dashboard");
      }
    });
  }, [router]);

  const handleHeroSearch = async (result: MatchResult, input: JdInput) => {
    try { sessionStorage.setItem("cvyon_jd_result", JSON.stringify({ result, input })); } catch {}
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      router.push("/recruiter/dashboard");
    } else {
      // Keep the JD so the dashboard can run it right after sign-in.
      try { sessionStorage.setItem("cvyon_pending_jd", JSON.stringify(input)); } catch {}
      router.push("/recruiter/login?next=/recruiter/dashboard");
    }
  };

  return (
    <V3Page
      pageName="recruiter_landing"
      logoSub="RECRUITER"
      links={LINKS}
      cta={{ label: "Create account", href: "/recruiter/signup" }}
    >
      {/* ─── HERO ─── */}
      <section className="grid grid-cols-1 items-center gap-10 py-10 md:grid-cols-2 md:gap-[60px] md:py-[70px]">
        <div>
          <V3Pill>Recruiter platform</V3Pill>
          <h1 className="mt-[18px] text-[44px] leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Paste the JD.<br />
            Meet the <span className="text-brand">shortlist.</span>
          </h1>
          <p className="mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Drop in a job description and Cvyon matches it against verified
            candidate profiles — ranked by relevance, with contact details
            available when you need them.
          </p>
          <div className="mt-6 flex flex-wrap gap-[10px]">
            <Link
              href="/recruiter/signup"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-navy px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
            >
              Create account <ArrowRight size={16} />
            </Link>
            <Link
              href="/recruiter/login"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-[18px] py-3 text-[12px] font-extrabold text-navy transition-transform hover:-translate-y-px"
            >
              Sign in
            </Link>
          </div>
          <div className="mt-[18px] flex flex-wrap gap-2">
            <V3Pill>Free to search</V3Pill>
            <V3Pill>Consent-verified</V3Pill>
            <V3Pill>Candidate opt-in</V3Pill>
          </div>
        </div>

        {/* RIGHT — live JD search */}
        <div className="rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
          <V3Eyebrow>Paste JD</V3Eyebrow>
          <JdSearchForm variant="hero" onResult={handleHeroSearch} />
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-[50px] md:py-[72px]">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-[30px]">
          <div>
            <V3Eyebrow>How it works</V3Eyebrow>
            <h2 className="text-[30px] leading-[1.04] tracking-[-0.045em] sm:text-[46px]">
              Sell the match,<br />not the database.
            </h2>
          </div>
          <p className="max-w-[500px] text-muted">
            Search first. Pay only when you unlock a candidate&rsquo;s contact — one clear credit at a time.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {STEPS.map((s) => (
            <article
              key={s.n}
              className="rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-lavender text-[13px] font-black text-brand">
                {s.n}
              </div>
              <h3 className="mt-[18px] text-xl font-extrabold tracking-tight">
                <s.icon size={18} className="mb-2 block text-brand" />{s.t}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-[30px] md:py-[50px]">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-[30px]">
          <div>
            <V3Eyebrow>Transparent pricing</V3Eyebrow>
            <h2 className="text-[30px] leading-[1.04] tracking-[-0.045em] sm:text-[46px]">
              Pay per hire-lead.
            </h2>
          </div>
          <p className="max-w-[500px] text-muted">
            Searching is free. Unlocking a contact uses one credit.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {packs.map((p, i) => {
            const sym = CUR_SYM[p.currency] || `${p.currency} `;
            const major = Math.round(p.price_kobo / 100);
            const per = p.credits > 0 ? Math.round(p.price_kobo / p.credits) / 100 : 0;
            const hot = i === 1;
            return (
              <div
                key={p.id || p.name}
                className={`relative flex flex-col rounded-[18px] bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)] ${
                  hot ? "border-2 border-coral" : "border border-line"
                }`}
              >
                {hot ? (
                  <span className="mb-4 inline-flex w-fit items-center gap-[7px] rounded-full bg-[#ffe8e4] px-[11px] py-[7px] text-[10px] font-black uppercase tracking-[0.1em] text-[#e54c40]">
                    Best for teams
                  </span>
                ) : (
                  <span className="mb-4 inline-flex w-fit items-center gap-[7px] rounded-full bg-lavender px-[11px] py-[7px] text-[10px] font-black uppercase tracking-[0.1em] text-brand">
                    <Coins size={12} /> {p.credits} credit{p.credits === 1 ? "" : "s"}
                  </span>
                )}
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  {p.credits} credit{p.credits === 1 ? "" : "s"} · {p.name}
                </p>
                <h3 className="text-[32px] font-extrabold leading-none tracking-tight">
                  {sym}{fmtNum(major)}
                </h3>
                <p className="mt-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-teal">
                  {sym}{per.toFixed(2)} / contact
                </p>
                <p className="mt-2 text-[13px] text-muted">{PACK_NOTES[i] || p.name}</p>
                <Link
                  href="/recruiter/signup"
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px ${
                    hot ? "bg-coral" : "bg-navy"
                  }`}
                >
                  Start free <ArrowUpRight size={15} />
                </Link>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          credits never expire · billed securely via Paystack · receipts on every unlock
        </p>
      </section>

      {/* ─── TRUST BAND ─── */}
      <section className="py-[50px] md:py-[72px]">
        <div className="rounded-[18px] bg-navy p-7 text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {TRUST.map((c) => (
              <div key={c.t}>
                <strong className="text-[15px] font-extrabold">{c.t}</strong>
                <p className="mt-2 text-[12px] leading-relaxed text-[#bfc2d5]">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="pb-[50px] md:pb-[72px]">
        <div className="rounded-[18px] bg-navy px-7 py-12 text-center text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:py-16">
          <h2 className="text-[30px] leading-[1.04] tracking-[-0.045em] sm:text-[40px]">
            Your next hire is one JD away.
          </h2>
          <p className="mx-auto mt-[14px] max-w-[650px] text-[17px] leading-relaxed text-[#bfc2d5]">
            Create a free recruiter account, paste a job description, and search verified candidates.
          </p>
          <Link
            href="/recruiter/signup"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Create account <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </V3Page>
  );
}
