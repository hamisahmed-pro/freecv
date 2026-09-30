import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from "@/lib/fonts";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "About Cvyon — The Free ATS Résumé Builder",
  description: "Learn why Cvyon provides a premium, AI-powered résumé builder and ATS grader for free. No paywalls, no watermarks, completely funded by transparent recruitment.",
  alternates: { canonical: "https://cvyon.com/about" },
};

export default function AboutPage() {
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
        <Link href="/build" className="fm text-sm font-bold uppercase tracking-widest border-[3px] border-[#151a46] px-4 py-2 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#151a46] hover:text-[#f6f5ef]">Build Free</Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 mt-16 md:mt-24">
        <h1 className="fd text-5xl md:text-7xl uppercase tracking-tight mb-8 leading-[0.9]">
          Premium Tools.<br />
          <span className="text-[#ff604b]">Forever Free.</span>
        </h1>

        <div className="text-[#151a46]/80 space-y-6 text-lg md:text-xl font-medium leading-relaxed">
          <p>
            The job market is harder than it has been in a decade. Candidates send hundreds of applications into the void, hoping to bypass automated Applicant Tracking Systems (ATS) that ruthlessly filter out qualified talent due to formatting errors or keyword mismatches.
          </p>
          <p>
            Yet, the industry standard for résumé builders is to lure candidates in with a "free builder," only to lock their completed PDF behind a sudden $30/month paywall right when they click download.
          </p>
          <h2 className="fh text-3xl font-extrabold text-[#151a46] uppercase tracking-tight mt-12 mb-6">Our Mission</h2>
          <p>
            At Cvyon, we believe that optimizing your career shouldn't cost you a week's groceries. We built a world-class, AI-powered ATS Grader and Resume Builder that generates pristine, ATS-parsable PDFs and Word documents.
          </p>
          <p className="fh font-extrabold text-[#151a46]">
            No watermarks. No required sign-ups. No hidden paywalls.
          </p>

          <h2 className="fh text-3xl font-extrabold text-[#151a46] uppercase tracking-tight mt-12 mb-6">How We Keep It Free</h2>
          <p>
            If you aren't paying, how do we keep the servers running?
          </p>
          <p>
            <strong>Transparent Recruitment.</strong> When you download your resume, you have the option to opt-in to our talent network. If you choose to opt-in, verified recruiters can discover your profile and reach out with relevant opportunities. The recruiters pay for sourcing tools—which fully subsidizes the infrastructure that keeps the builder free for you and other candidates.
          </p>
          <p>
            If you choose <em>not</em> to opt-in, that's completely fine too. Your data remains on your device, and you still get to download your resume for free.
          </p>

          <div className="riso-card p-8 mt-12 mb-12">
            <h3 className="fh text-xl font-extrabold uppercase tracking-wider mb-6">What You Get</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3"><CheckCircle2 className="text-[#5548f5] shrink-0" /> 180 ATS-Optimized Templates (Grid, Swiss, Corporate)</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-[#5548f5] shrink-0" /> AI ATS Grader & Keyword Matcher</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-[#5548f5] shrink-0" /> One-Click LinkedIn Import</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-[#5548f5] shrink-0" /> PDF and DOCX Export</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="text-[#5548f5] shrink-0" /> Strict GDPR Compliance & Data Ownership</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/build" className="riso-btn text-lg">
            Start Building
          </Link>
        </div>
      </main>
    </div>
  );
}
