"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, FileText, Loader2, Copy, CheckCircle2, Navigation } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { cn } from '@/lib/utils';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export default function CoverLetterClient() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;

    setLoading(true);
    setError('');

    try {
      trackEvent('cover_letter_start', tone);
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, tone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }

      setResult(data.coverLetter);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    trackEvent('cover_letter_copied', tone);
  };

  return (
    <div className={cn("cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden selection:bg-[#5548f5] selection:text-white", body.className)}
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

      {/* Brutalist Nav */}
      <nav className="border-b-[3px] border-[#151a46] bg-[#f6f5ef] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light-no-background.png"
              alt="Cvyon"
              width={240}
              height={80}
              priority
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-all"
            />
          </Link>
          <div className="flex gap-4">
            <Link href="/build" className="hidden sm:flex bg-[#151a46] text-[#f6f5ef] border-[3px] border-[#151a46] hover:bg-[#ff604b] hover:text-[#151a46] px-6 py-2.5 rounded-none fm font-bold uppercase tracking-wider text-sm transition-transform active:scale-95 hs items-center gap-2">
              <FileText size={16} /> Resume Builder
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12 lg:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#5548f5] text-white px-4 py-1.5 rounded-full fm text-xs font-bold uppercase tracking-widest border-[3px] border-[#151a46] mb-6 shadow-[2px_2px_0_#151a46]">
            <Sparkles size={14} /> 100% Free Tool
          </div>
          <h1 className="fd text-5xl md:text-7xl uppercase tracking-tight leading-[0.9] mb-6">
            AI Cover Letter <br />
            <span className="text-[#5548f5]">Generator</span>
          </h1>
          <p className="text-xl font-medium text-[#151a46]/70 max-w-2xl mx-auto">
            Paste your resume and the job description. Our AI will write a highly tailored, conversion-optimized cover letter in 5 seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white border-[3px] border-[#151a46] p-6 lg:p-8 hs flex flex-col gap-6">
            <div>
              <label className="fh flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest mb-2">
                <FileText size={16} /> 1. Paste Your Resume
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your full resume text here..."
                className="w-full h-40 bg-white border-[3px] border-[#151a46] p-4 text-sm font-medium focus:outline-none focus:border-[#ff604b] focus:translate-x-[2px] focus:translate-y-[2px] transition-all custom-scrollbar resize-none"
              />
            </div>

            <div>
              <label className="fh flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest mb-2">
                <Navigation size={16} /> 2. Paste Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description you are applying for..."
                className="w-full h-40 bg-white border-[3px] border-[#151a46] p-4 text-sm font-medium focus:outline-none focus:border-[#ff604b] focus:translate-x-[2px] focus:translate-y-[2px] transition-all custom-scrollbar resize-none"
              />
            </div>

            <div>
              <label className="fh flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest mb-2">
                3. Select Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-white border-[3px] border-[#151a46] p-4 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-[#ff604b] cursor-pointer appearance-none"
              >
                <option value="professional">Professional & Direct</option>
                <option value="confident">Confident & Bold</option>
                <option value="enthusiastic">Enthusiastic & Passionate</option>
                <option value="creative">Creative & Unconventional</option>
              </select>
            </div>

            {error && (
              <div className="bg-white border-[3px] border-[#ff604b] text-[#151a46] p-4 font-bold text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !resumeText || !jobDescription}
              className="w-full bg-[#ff604b] text-white border-[3px] border-[#151a46] py-5 fh font-extrabold uppercase tracking-widest text-lg transition-all shadow-[7px_7px_0_#151a46] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-3 mt-2"
            >
              {loading ? (
                <><Loader2 size={24} className="animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={24} /> Generate Cover Letter</>
              )}
            </button>
          </div>

          {/* Result Output */}
          <div className="bg-[#151a46] text-white border-[3px] border-[#151a46] shadow-[7px_7px_0_#ff604b] p-6 lg:p-8 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-6 border-b-[3px] border-[#f6f5ef]/20">
              <h2 className="fh text-xl font-extrabold uppercase tracking-widest flex items-center gap-2">
                <FileText size={20} className="text-[#ff604b]" /> Your Cover Letter
              </h2>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-[#5548f5] hover:bg-[#ff604b] px-4 py-2 fm text-xs font-bold uppercase tracking-widest transition-colors border-[3px] border-white shadow-[2px_2px_0_white]"
                >
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>

            {result ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 text-[#f6f5ef]/80 whitespace-pre-wrap font-medium leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-[#f6f5ef]/50">
                <FileText size={64} className="mb-4" />
                <p className="fh font-extrabold uppercase tracking-widest text-sm max-w-[200px]">
                  Your AI-generated cover letter will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
