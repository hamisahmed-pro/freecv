"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, FileText, Loader2, Copy, CheckCircle2, Navigation } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";

const TONES = [
  { value: 'professional', label: 'Professional & Direct' },
  { value: 'confident', label: 'Confident & Bold' },
  { value: 'enthusiastic', label: 'Enthusiastic & Passionate' },
  { value: 'creative', label: 'Creative & Unconventional' },
];

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
      trackEvent('cover_letter_start', undefined, { tone });
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
    trackEvent('cover_letter_copied', undefined, { tone });
  };

  const inputCls =
    "w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]";

  return (
    <V3Page
      pageName="cover_letter"
      cta={{ label: "Build free →", href: "/build" }}
    >
      {/* ─── HERO ─── */}
      <div className="mx-auto max-w-[900px] py-10 text-center md:py-[70px]">
        <V3Eyebrow>AI tool</V3Eyebrow>
        <div className="mb-5 flex justify-center">
          <V3Pill><Sparkles size={12} /> 100% free tool</V3Pill>
        </div>
        <h1 className="mx-auto max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy sm:text-6xl lg:text-7xl">
          AI Cover Letter <span className="text-brand">Generator</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
          Paste your resume and a job description to draft a role-specific cover letter. Review and personalize the result before applying.
        </p>
      </div>

      {/* ─── TOOL ─── */}
      <div className="mx-auto grid max-w-[1120px] gap-[18px] pb-[50px] lg:grid-cols-2 md:pb-[72px]">
        {/* Input form */}
        <div className="flex flex-col gap-6 rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-8">
          <div>
            <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.13em] text-navy/70">
              <FileText size={15} className="text-brand" /> 1. Paste your resume
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your full resume text here..."
              className={`${inputCls} h-40 resize-none`}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.13em] text-navy/70">
              <Navigation size={15} className="text-brand" /> 2. Paste job description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you are applying for..."
              className={`${inputCls} h-40 resize-none`}
            />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.13em] text-navy/70">
              3. Select tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={`${inputCls} cursor-pointer appearance-none font-bold`}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-[10px] border border-coral/50 bg-coral/10 p-4 text-sm font-bold text-navy">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !resumeText || !jobDescription}
            className="mt-2 flex w-full items-center justify-center gap-3 rounded-[10px] bg-coral px-[18px] py-4 text-[12px] font-extrabold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-px disabled:opacity-50"
          >
            {loading ? (
              <><Loader2 size={20} className="animate-spin" /> Generating...</>
            ) : (
              <><Sparkles size={20} /> Generate cover letter</>
            )}
          </button>
        </div>

        {/* Result output */}
        <div className="flex flex-col rounded-[18px] bg-navy p-6 text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-white/15 pb-6">
            <h2 className="flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.13em]">
              <FileText size={18} className="text-coral" /> Your cover letter
            </h2>
            {result && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-px"
              >
                {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy text'}
              </button>
            )}
          </div>

          {result ? (
            <div className="flex-1 overflow-y-auto whitespace-pre-wrap pr-2 font-medium leading-relaxed text-[#bfc2d5]">
              {result}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center text-white/40">
              <FileText size={64} className="mb-4" />
              <p className="max-w-[220px] text-[12px] font-extrabold uppercase tracking-[0.13em]">
                Your AI-generated cover letter will appear here
              </p>
            </div>
          )}
        </div>
      </div>
      <section aria-labelledby="cover-letter-guide" className="mx-auto mt-12 max-w-[920px] border-t border-line pt-10">
        <h2 id="cover-letter-guide" className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          How to write a tailored cover letter with Cvyon
        </h2>
        <p className="mt-4 max-w-[760px] text-sm leading-7 text-muted">
          A useful cover letter connects your real experience to the employer&apos;s needs. Paste your resume
          and the job description into the generator, choose a tone, and use the draft as a starting point.
          Check all dates, employers, achievements, and claims before sending it: AI-generated writing
          can omit important context or introduce details that are not in your resume.
        </p>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-base font-extrabold text-navy">What should the letter include?</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Start with the role you want, then show one or two specific accomplishments related to its
              requirements. Explain why this position interests you. Close with a concise invitation
              to discuss your application instead of repeating your entire resume.
            </p>
          </div>
          <div>
            <h3 className="text-base font-extrabold text-navy">Can I use the draft as-is?</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              Treat it as a first draft. Adjust the tone to match the organization, remove generic
              statements, and make sure it sounds like you. When your resume needs work too,
              you can edit it with Cvyon&apos;s free builder.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-extrabold text-brand">
              <Link href="/build" className="underline underline-offset-4">Build your resume</Link>
              <Link href="/templates" className="underline underline-offset-4">Explore resume templates</Link>
            </div>
          </div>
        </div>
      </section>
    </V3Page>
  );
}
