"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/useResumeStore";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, Loader2, Target, Lightbulb, ChevronLeft, X, Share2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { trackEvent } from "@/lib/analytics";
import confetti from "canvas-confetti";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

interface AtsResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  tips: string[];
}

export default function ClientAtsGrader() {
  const router = useRouter();
  const setAtsRecommendations = useResumeStore(state => state.setAtsRecommendations);
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AtsResult | null>(null);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    trackEvent('ats_grader_viewed');
    // Challenge banner: honor ?s=<0-100> share links, ignore everything else.
    try {
      const raw = new URLSearchParams(window.location.search).get('s');
      if (raw && /^\d{1,3}$/.test(raw.trim())) {
        const n = parseInt(raw.trim(), 10);
        if (n >= 0 && n <= 100) {
          setChallengeScore(n);
          setBannerVisible(true);
        }
      }
    } catch {
      /* ignore malformed query strings */
    }
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(f.type) && !f.name.endsWith('.docx') && !f.name.endsWith('.pdf')) {
      toast.error("Only PDF and DOCX files are supported.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 4MB.");
      return;
    }
    setFile(f);
  };

  
  const handleFixResume = () => {
    if (result) {
      setAtsRecommendations({
        missingKeywords: result.missingKeywords,
        tips: result.tips
      });
      router.push('/build');
    }
  };

  // ---- Share-your-score viral loop ----
  const scoreInt = result ? Math.max(0, Math.min(100, Math.round(result.score))) : 0;
  const shareText = `My resume scored ${scoreInt}/100 on Cvyon's free ATS grader. Think yours beats it?`;
  const shareUrl = `https://cvyon.com/ats-grader?s=${scoreInt}`;

  const doShare = (channel: 'native' | 'x' | 'facebook' | 'whatsapp' | 'linkedin' | 'copy') => {
    trackEvent('ats_score_shared', undefined, { score: scoreInt, channel });
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);
    switch (channel) {
      case 'native':
        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
          navigator.share({ title: "Cvyon ATS Grader", text: shareText, url: shareUrl }).catch(() => { /* user dismissed */ });
        }
        break;
      case 'x':
        window.open(`https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank', 'noopener,noreferrer');
        break;
      case 'copy':
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }).catch(() => {
            toast.error("Could not copy link.");
          });
        } else {
          toast.error("Copy not supported in this browser.");
        }
        break;
    }
  };
  
  const handleGrade = async () => {
    if (!file) {
      toast.error("Please upload your resume.");
      return;
    }
    if (!jd.trim()) {
      toast.error("Please paste the job description.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jd);

    try {
      const res = await fetch("/api/ai/standalone-ats-score", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        let errMsg = "An error occurred.";
        try {
          const json = JSON.parse(text);
          errMsg = json.error || errMsg;
        } catch (e) {
          errMsg = text || errMsg;
        }
        throw new Error(errMsg);
      }

      const data: AtsResult = await res.json();
      setResult(data);
      trackEvent('ats_grader_completed', undefined, { score: data.score });

      if (data.score >= 80) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      } else {
        toast.success("Analysis complete. See your results below!");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <V3Page pageName="ats_grader" logoSub="ATS GRADER">
      <div className="mx-auto max-w-[960px]">
        {challengeScore !== null && bannerVisible && (
          <div className="mb-10 flex items-start gap-4 rounded-2xl border border-gold/60 bg-gold/15 p-4 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:items-center sm:p-5">
            <div className="flex-1">
              <p className="text-base font-extrabold uppercase tracking-wide leading-tight text-navy sm:text-lg">
                Someone scored {challengeScore}/100 on this grader
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted sm:text-sm">
                Can you beat it? Upload your resume to find out.
              </p>
            </div>
            <button
              onClick={() => setBannerVisible(false)}
              aria-label="Dismiss challenge"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-line bg-paper text-navy transition-colors hover:border-coral hover:bg-coral hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <V3Eyebrow>§ free ATS grader</V3Eyebrow>
          <h1 className="text-4xl font-black tracking-tight text-navy sm:text-6xl">
            Pass the <span className="text-coral">bots.</span><br />
            Get the interview.
          </h1>
          <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Upload your resume (PDF/DOCX) and paste a job description. Our AI analyzes your match score exactly how an ATS would.
          </p>
        </div>

        <div className="grid items-stretch gap-8 md:grid-cols-2 lg:gap-10">
          {/* LEFT: Upload & JD */}
          <div className="flex flex-col gap-6">
            <div className="flex h-full flex-col rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-7">
              <h2 className="mb-5 flex items-center gap-2.5 text-[15px] font-extrabold uppercase tracking-wider text-navy">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-navy text-white"><FileText size={16} /></span>
                1. Resume
              </h2>

              <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
              <div
                onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex min-h-[200px] flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-cream/60 p-8 text-center transition-all",
                  isDragging ? "border-brand bg-lavender" : "hover:border-brand/60",
                  file ? "border-brand bg-lavender/70" : ""
                )}
              >
                {file ? (
                  <>
                    <FileText size={44} className="mb-4 text-brand" />
                    <p className="max-w-full truncate text-lg font-bold text-navy">{file.name}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB • Click to replace</p>
                  </>
                ) : (
                  <>
                    <UploadCloud size={44} className="mb-4 text-navy/40" />
                    <p className="text-lg font-bold text-navy">Drag &amp; drop resume</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-muted">Supported: PDF, DOCX (max 4MB)</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-7">
              <h2 className="mb-5 flex items-center gap-2.5 text-[15px] font-extrabold uppercase tracking-wider text-navy">
                <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-navy text-white"><Target size={16} /></span>
                2. Job target
              </h2>
              <textarea
                placeholder="Paste the target job description here..."
                value={jd}
                onChange={e => setJd(e.target.value)}
                className="min-h-[180px] w-full resize-y rounded-[10px] border border-line bg-cream/60 p-4 text-sm text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
              />
            </div>

            <button
              onClick={handleGrade}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-[10px] bg-coral px-8 py-4 text-[15px] font-extrabold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(255,96,75,0.35)] transition-transform hover:-translate-y-px disabled:opacity-70 disabled:pointer-events-none"
            >
              {isLoading ? <><Loader2 className="animate-spin" size={22} /> Processing...</> : <><Sparkles size={22} /> Analyze match</>}
            </button>
          </div>

          {/* RIGHT: Results */}
          <div className="relative flex min-h-[500px] flex-col rounded-2xl bg-navy p-6 text-white shadow-[0_16px_38px_rgba(23,27,75,0.22)] sm:p-8">
            {!result ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center opacity-60">
                <Target size={56} className="mb-6 opacity-30" />
                <p className="mb-2 text-xl font-extrabold uppercase tracking-wide">Awaiting input</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Your AI-generated scorecard will appear here.</p>
              </div>
            ) : (
              <div className="flex h-full flex-col animate-in fade-in zoom-in-95 duration-500">
                <div className="mb-8 border-b border-white/15 pb-8 text-center">
                  <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gold">Match score</p>
                  <div className="flex items-end justify-center gap-2 leading-none">
                    <span className={cn("text-8xl font-black tracking-tighter", result.score >= 80 ? "text-teal" : result.score >= 60 ? "text-gold" : "text-coral")}>
                      {result.score}
                    </span>
                    <span className="pb-2 text-3xl font-black text-white/50">/100</span>
                  </div>
                </div>

                {/* SHARE YOUR SCORE */}
                <div className="mb-8 rounded-xl border border-gold/40 bg-gold/10 p-5 text-center sm:p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">Share your score</p>
                  <p className="mb-5 text-sm font-bold leading-relaxed sm:text-base">
                    I scored <span className="text-gold">{scoreInt}/100</span> — think you can beat it?
                  </p>
                  {canNativeShare ? (
                    <button
                      onClick={() => doShare('native')}
                      className="inline-flex items-center gap-2 rounded-[10px] bg-gold px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px"
                    >
                      <Share2 size={18} /> Share
                    </button>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                      <button onClick={() => doShare('x')} className="rounded-[10px] border border-white/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gold hover:text-navy hover:border-gold">X</button>
                      <button onClick={() => doShare('facebook')} className="rounded-[10px] border border-white/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gold hover:text-navy hover:border-gold">Facebook</button>
                      <button onClick={() => doShare('whatsapp')} className="rounded-[10px] border border-white/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gold hover:text-navy hover:border-gold">WhatsApp</button>
                      <button onClick={() => doShare('linkedin')} className="rounded-[10px] border border-white/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gold hover:text-navy hover:border-gold">LinkedIn</button>
                      <button onClick={() => doShare('copy')} className="inline-flex items-center gap-1.5 rounded-[10px] border border-white/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-gold hover:text-navy hover:border-gold">
                        {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy link</>}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-teal">
                      <CheckCircle2 size={16} /> Strengths
                    </h3>
                    <ul className="space-y-3">
                      {result.strengths.map((s, i) => (
                        <li key={i} className="flex gap-3 text-sm"><span className="text-teal/60">◆</span> {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-coral">
                      <AlertCircle size={16} /> Weaknesses
                    </h3>
                    <ul className="space-y-3">
                      {result.weaknesses.map((w, i) => (
                        <li key={i} className="flex gap-3 text-sm"><span className="text-coral/60">◆</span> {w}</li>
                      ))}
                    </ul>
                  </div>

                  {result.missingKeywords.length > 0 && (
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gold">
                        <Target size={16} /> Missing keywords
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.missingKeywords.map((k, i) => (
                          <span key={i} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.tips.length > 0 && (
                    <div>
                      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand">
                        <Lightbulb size={16} /> Actionable tips
                      </h3>
                      <ul className="space-y-3">
                        {result.tips.map((t, i) => (
                          <li key={i} className="flex gap-3 text-sm"><span className="text-brand/70">◆</span> {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-white/15 pt-8 text-center">
                  <button onClick={handleFixResume} className="inline-flex items-center gap-2 rounded-[10px] bg-paper px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px">Fix my resume in builder</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </V3Page>
  );
}
