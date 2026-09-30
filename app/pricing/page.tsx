import React from "react";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from "@/lib/fonts";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Recruiter Pricing — Cvyon Talent Network",
  description: "Search the opt-in Cvyon talent pool. One-time recruiter access — no subscription, no stale profiles.",
  alternates: { canonical: "https://cvyon.com/pricing" },
};

export default function PricingPage() {
  return (
    <div className={`cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden selection:bg-[#ff604b] selection:text-white pb-20 ${body.className}`}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
        .cv-riso .riso-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 3px solid var(--ink); background-color: var(--ink); color: #f6f5ef; padding: 0.75rem 1.5rem; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 7px 7px 0 var(--ink); transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .cv-riso .riso-btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .cv-riso .riso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-btn-ghost { background-color: transparent; color: var(--ink); }
        .cv-riso .riso-card { border: 3px solid var(--ink); background-color: #ffffff; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-input { width: 100%; border: 3px solid var(--ink); background-color: #ffffff; padding: 0.75rem 1rem; font-family: var(--fm); font-size: 0.875rem; color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transition: all 0.2s; outline: none; }
        .cv-riso .riso-input:focus { box-shadow: none; transform: translate(2px, 2px); border-color: var(--verm); }
        .cv-riso .riso-label { display: block; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; color: var(--ink); }
        .cv-riso .riso-chip { display: inline-flex; align-items: center; gap: 0.25rem; border: 2px solid var(--ink); padding: 0.25rem 0.5rem; font-family: var(--fm); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; color: var(--ink); background: #ffffff; }
      `}</style>

      <nav className="border-b-[3px] border-[#151a46] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#f6f5ef] z-50">
        <Link href="/" className="fd text-xl tracking-tight hover:text-[#ff604b] transition-colors">CVYON</Link>
        <Link href="/recruiter/login" className="fm text-sm font-bold uppercase tracking-widest border-[3px] border-[#151a46] px-4 py-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#151a46] hover:text-[#f6f5ef]">Sign In</Link>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-16 md:mt-24">
        <div className="text-center mb-16">
          <h1 className="fd text-5xl md:text-7xl uppercase tracking-tight mb-6 leading-[0.9]">
            Source the opt-in talent pool.<br />
            <span className="text-[#5548f5]">Skip the noise.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#151a46]/70 max-w-2xl mx-auto font-medium">
            Our talent network consists of candidates actively optimizing their careers. No stale profiles, just high-intent professionals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Pay as you go */}
          <div className="bg-white border-[3px] border-[#151a46] hs p-8 flex flex-col transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
            <h2 className="fh text-2xl font-extrabold uppercase tracking-wider mb-2">Pay As You Go</h2>
            <p className="text-[#151a46]/60 mb-6 font-medium">Perfect for boutique agencies and solo recruiters.</p>
            <div className="fd text-5xl mb-8 tracking-tight">$49<span className="fm text-lg text-[#151a46]/60 font-bold uppercase tracking-widest"> / unlock</span></div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ff604b] mt-0.5 shrink-0" size={20} /> Access to full ATS-parsed profiles</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ff604b] mt-0.5 shrink-0" size={20} /> Download PDF/DOCX resumes</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ff604b] mt-0.5 shrink-0" size={20} /> Direct contact email and phone</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ff604b] mt-0.5 shrink-0" size={20} /> Advanced boolean search filtering</li>
            </ul>

            <Link href="/recruiter/signup?plan=payg" className="riso-btn w-full">
              Start Sourcing <ArrowRight size={16} />
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-[#151a46] text-white border-[3px] border-[#151a46] shadow-[7px_7px_0_#5548f5] p-8 flex flex-col transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none relative">
            <div className="fm absolute top-0 right-8 -translate-y-1/2 bg-[#5548f5] text-white px-3 py-1 font-bold text-xs uppercase tracking-widest border-2 border-[#151a46]">Best Value</div>
            <h2 className="fh text-2xl font-extrabold uppercase tracking-wider mb-2">Enterprise</h2>
            <p className="text-white/60 mb-6 font-medium">For high-volume in-house talent teams.</p>
            <div className="fd text-5xl mb-8 tracking-tight">$499<span className="fm text-lg text-white/60 font-bold uppercase tracking-widest"> one-time</span></div>

            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ffd85a] mt-0.5 shrink-0" size={20} /> 50 profile unlocks</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ffd85a] mt-0.5 shrink-0" size={20} /> $29 per additional unlock</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ffd85a] mt-0.5 shrink-0" size={20} /> ATS Integration (Greenhouse, Lever)</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ffd85a] mt-0.5 shrink-0" size={20} /> Shared team folders & collaboration</li>
              <li className="flex items-start gap-3 font-medium"><Check className="text-[#ffd85a] mt-0.5 shrink-0" size={20} /> Priority support</li>
            </ul>

            <Link href="/recruiter/signup?plan=enterprise" className="riso-btn w-full" style={{ backgroundColor: "#ffd85a", color: "#151a46" }}>
              Buy 30 days of recruiter access <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
