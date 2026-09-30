"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RisoPage, RisoSectionLabel } from "@/components/riso/RisoChrome";
import { JdSearchForm, JdInput } from "@/components/recruiter/JdSearchForm";
import { MatchResult } from "@/lib/recruiter-api";
import {
  ArrowRight, ArrowUpRight, ShieldCheck, Search, Unlock, FileText,
  Check, EyeOff, Coins,
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
    <RisoPage pageName="recruiter_landing" ticker={true}>
      {/* ─── HERO: the JD-match flow ─── */}
      <section className="dots relative grid grid-cols-1 gap-10 border-b-[3px] border-[#151a46] py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-6">
          <div className="fm mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]">
            <span className="inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-3 py-1.5 hs">
              <span className="blink inline-block h-2 w-2 rounded-full bg-[#ff604b]" />
              recruiter access
            </span>
            <span className="text-[#151a46]/50">est. 2026</span>
          </div>
          <h1 className="fd text-[12vw] leading-[0.86] tracking-[-0.02em] sm:text-7xl lg:text-[5rem]">
            Paste the JD.<br />
            Meet the <span className="relative inline-block"><span className="relative z-10">shortlist</span><span className="absolute inset-x-[-4px] bottom-1 z-0 h-[0.42em] bg-[#ffd85a]" /></span>.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#151a46]/75">
            Drop in a job description and Cvyon matches it against every opted-in
            candidate — ranked <strong>Excellent / Strong / Moderate</strong>, with
            counts shown <em>before</em> you spend anything. Unlock a contact for
            1 credit. No database to trawl. No scraping.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/recruiter/login"
              className="group flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Sign in <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/recruiter/signup"
              className="flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Create account
            </Link>
          </div>
          <div className="mt-9 flex flex-wrap gap-2 fm text-[10px] font-bold uppercase tracking-[0.16em]">
            {["free to search", "consent-verified", "anonymized until unlock", "₦0 to try"].map((c) => (
              <span key={c} className="border-2 border-[#151a46] bg-white px-3 py-1.5">{c}</span>
            ))}
          </div>
        </div>

        {/* RIGHT COL — live JD search */}
        <div className="lg:col-span-6">
          <div className="border-[3px] border-[#151a46] bg-white hs p-5 sm:p-7">
            <div className="fm mb-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.22em] text-[#151a46]/50">
              <span>§ try it now</span>
              <span className="text-[#ff604b]">live match</span>
            </div>
            <JdSearchForm variant="hero" onResult={handleHeroSearch} />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="mt-16">
        <RisoSectionLabel color="#ff604b">how it works</RisoSectionLabel>
        <h2 className="fd text-4xl tracking-tight sm:text-5xl">Sell the match,<br />not the database.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { n: "01", icon: FileText, t: "Paste the job description", d: "The full JD — not keywords. Cvyon extracts the title, must-have and nice-to-have skills, years, and location automatically." },
            { n: "02", icon: Search, t: "See tiered matches", d: "Every candidate is ranked Excellent, Strong, or Moderate with plain-English reasons — “8/10 required skills, 5 yrs experience”. Counts up front, free." },
            { n: "03", icon: Unlock, t: "Unlock the contact", d: "Found the one? Spend 1 credit to reveal their name, email, and phone. Nothing is ever shown before you choose to unlock." },
          ].map((s) => (
            <div key={s.n} className="border-[3px] border-[#151a46] bg-white hs p-7">
              <div className="flex items-center justify-between">
                <span className="fd text-3xl text-[#ff604b]">{s.n}</span>
                <s.icon size={26} className="text-[#151a46]" />
              </div>
              <h3 className="fh mt-5 text-xl font-extrabold tracking-tight">{s.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#151a46]/70">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="mt-20">
        <RisoSectionLabel color="#0E8A4B">pricing</RisoSectionLabel>
        <h2 className="fd text-4xl tracking-tight sm:text-5xl">Pay per hire-lead.<br />Nothing else.</h2>
        <p className="mt-4 max-w-lg text-lg text-[#151a46]/70">
          Searching is free, forever. You only pay when you unlock a candidate&apos;s contact — 1 credit each.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {packs.map((p, i) => {
            const sym = CUR_SYM[p.currency] || `${p.currency} `;
            const major = Math.round(p.price_kobo / 100);
            const per = p.credits > 0 ? Math.round(p.price_kobo / p.credits) / 100 : 0;
            const hot = i === 1;
            return (
            <div
              key={p.id || p.name}
              className={`relative flex flex-col border-[3px] border-[#151a46] bg-white p-8 ${hot ? "hs-v" : "hs"}`}>
              {hot && (
                <span className="fm absolute -top-4 left-6 border-[3px] border-[#151a46] bg-[#ff604b] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                  most popular
                </span>
              )}
              <div className="flex items-center gap-2 fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/55">
                <Coins size={14} className="text-[#ff604b]" /> {p.credits} credit{p.credits === 1 ? "" : "s"}
              </div>
              <h3 className="fh mt-2 text-2xl font-extrabold tracking-tight">{p.name}</h3>
              <div className="fd mt-3 text-5xl tracking-tight">{sym}{fmtNum(major)}</div>
              <div className="fm mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0E8A4B]">{sym}{per.toFixed(2)} / contact</div>
              <p className="mt-3 text-sm text-[#151a46]/65">{PACK_NOTES[i] || ""}</p>
              <Link
                href="/recruiter/signup"
                className={`mt-6 flex items-center justify-center gap-2 border-[3px] border-[#151a46] px-6 py-3.5 fh text-xs font-extrabold uppercase tracking-wider transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${hot ? "bg-[#ff604b] text-[#151a46] hs" : "bg-[#151a46] text-[#f6f5ef] hs"}`}
              >
                Start free <ArrowUpRight size={15} />
              </Link>
            </div>
            );
          })}
        </div>
        <p className="mt-6 text-center fm text-[11px] uppercase tracking-[0.16em] text-[#151a46]/50">
          credits never expire · billed securely via Paystack · receipts on every unlock
        </p>
      </section>

      {/* ─── TRUST / PRIVACY ─── */}
      <section className="mt-20 border-[3px] border-[#151a46] bg-white hs p-8 sm:p-10">
        <RisoSectionLabel>trust & privacy</RisoSectionLabel>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "100% opted in", d: "Every profile in the pool explicitly allowed recruiters to find them. Consent is timestamped and revocable — the moment someone opts out, they vanish from search." },
            { icon: EyeOff, t: "Anonymized until unlock", d: "You see headlines, skills, experience, and match reasons — never names, photos, or contact details — until you spend a credit to unlock." },
            { icon: Check, t: "Honest counts", d: "Every search shows the real number of excellent, strong, and moderate matches first. A small pool is labeled as a small, growing pool — never padded." },
          ].map((c) => (
            <div key={c.t} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center border-[3px] border-[#151a46] bg-[#f6f5ef] text-[#151a46]">
                <c.icon size={20} />
              </span>
              <div>
                <h3 className="fh text-lg font-extrabold">{c.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#151a46]/65">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="mt-16 border-[3px] border-[#151a46] bg-[#151a46] hs-v p-10 text-center text-[#f6f5ef] sm:p-14">
        <h2 className="fd text-4xl tracking-tight sm:text-5xl">Your next hire is one JD away.</h2>
        <p className="mx-auto mt-4 max-w-lg text-[#f6f5ef]/70">
          Create a free recruiter account, paste a job description, and see your
          tiered shortlist in seconds. Pay only when you unlock.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/recruiter/signup"
            className="group flex items-center justify-center gap-2 border-[3px] border-[#f6f5ef] bg-[#f6f5ef] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#151a46] transition-all hover:bg-[#ffd85a] hover:border-[#ffd85a]"
          >
            Create account <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="/recruiter/login"
            className="flex items-center justify-center gap-2 border-[3px] border-[#f6f5ef]/40 px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] transition-all hover:border-[#f6f5ef]"
          >
            Sign in
          </Link>
        </div>
      </section>
    </RisoPage>
  );
}
