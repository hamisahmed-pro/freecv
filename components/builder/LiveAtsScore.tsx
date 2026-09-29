"use client";

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowUpRight,
  X,
  Zap,
  BarChart2,
  Target,
  AlertOctagon
} from 'lucide-react';
import { calculateAtsScore, AtsScoreResult } from '@/lib/ats-engine';
import { useResumeStore } from '@/store/useResumeStore';
import Link from 'next/link';

export function LiveAtsScore() {
  const [isOpen, setIsOpen] = useState(false);
  const data = useResumeStore((s) => s.data);

  const atsResult: AtsScoreResult = useMemo(() => {
    return calculateAtsScore(data || {});
  }, [data]);

  const { score, grade, breakdown, metrics, highlights, suggestions, penalties } = atsResult;

  // Grade color scheme
  const getGradeBadge = (g: string) => {
    switch (g) {
      case 'A+':
      case 'A':
        return 'bg-[#10B981] text-white border-[#141312]';
      case 'B':
        return 'bg-[#3B82F6] text-white border-[#141312]';
      case 'C':
        return 'bg-[#F59E0B] text-black border-[#141312]';
      default:
        return 'bg-[#EF4444] text-white border-[#141312]';
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-[#10B981]';
    if (s >= 65) return 'text-[#3B82F6]';
    if (s >= 50) return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  const getStatusBadge = (status: 'good' | 'fair' | 'poor') => {
    switch (status) {
      case 'good':
        return 'bg-[#E8F8F0] text-[#10B981] border-[#10B981]';
      case 'fair':
        return 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]';
      case 'poor':
        return 'bg-[#FEE2E2] text-[#EF4444] border-[#EF4444]';
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Live ATS Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#FFFDF8] hover:bg-white border-2 border-[#141312] px-2 sm:px-3 py-1.5 transition-all shadow-[2px_2px_0_#141312] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer select-none"
        title="Click to view real-time ATS scoring breakdown & suggestions"
        aria-label="ATS Score Breakdown"
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} className={getScoreColor(score)} />
          <span className="fm text-[11px] font-bold tracking-wider text-[#141312]">
            ATS <span className={getScoreColor(score)}>{score}/100</span>
          </span>
        </div>
        <span className={`hidden sm:inline-block fm text-[9px] font-black px-1.5 py-0.5 border border-[#141312] ${getGradeBadge(grade)}`}>
          {grade}
        </span>
        {isOpen ? <ChevronUp size={13} className="hidden sm:block text-[#141312]" /> : <ChevronDown size={13} className="hidden sm:block text-[#141312]" />}
      </button>

      {/* Centered Modal Overlay (portaled to document.body so ancestor
          backdrop-filters/transforms — e.g. the sticky builder header — can
          never trap it and clip the top of the card on mobile or desktop) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          {/* Backdrop Click Dismiss */}
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg bg-[#FFFDF8] border-[3px] border-[#141312] p-4 sm:p-6 shadow-[6px_6px_0_#141312] sm:shadow-[8px_8px_0_#141312] max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col gap-4 text-[#141312] animate-in zoom-in-95 duration-150"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#141312]/20">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#141312] text-[#FFFDF8] border border-[#141312]">
                  <Sparkles size={16} className="text-[#FFCC00]" />
                </div>
                <div>
                  <h3 className="fh font-extrabold text-sm sm:text-base leading-tight text-[#141312]">
                    ATS Grader
                  </h3>
                  <p className="fm text-[10px] font-bold uppercase tracking-[0.16em] text-[#141312]/50">
                    Live Enterprise Keyword & Metric Parser
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`fm text-xs font-black px-2.5 py-1 border-2 border-[#141312] shadow-[2px_2px_0_#141312] ${getGradeBadge(grade)}`}>
                  {grade} • {score}/100
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-[#141312]/60 hover:text-[#141312] hover:bg-[#141312]/10 transition-colors rounded-none"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid (4 Cards) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 bg-white border-2 border-[#141312] hs-sm">
                <div className="flex items-center gap-1 text-[#2233FF] mb-1">
                  <Zap size={13} />
                  <span className="fm text-[9px] font-bold uppercase tracking-wider">Action Verbs</span>
                </div>
                <div className="fh font-extrabold text-sm text-[#141312]">
                  {metrics.actionVerbCount} <span className="text-[10px] fm font-normal text-[#141312]/60">({metrics.actionVerbRatio}%)</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-[#141312] hs-sm">
                <div className="flex items-center gap-1 text-[#10B981] mb-1">
                  <BarChart2 size={13} />
                  <span className="fm text-[9px] font-bold uppercase tracking-wider">Quantified</span>
                </div>
                <div className="fh font-extrabold text-sm text-[#141312]">
                  {metrics.quantifiableMetricCount} <span className="text-[10px] fm font-normal text-[#141312]/60">metrics</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-[#141312] hs-sm">
                <div className="flex items-center gap-1 text-[#EA580C] mb-1">
                  <Target size={13} />
                  <span className="fm text-[9px] font-bold uppercase tracking-wider">Keywords</span>
                </div>
                <div className="fh font-extrabold text-sm text-[#141312]">
                  {breakdown.skills.score} <span className="text-[10px] fm font-normal text-[#141312]/60">/ {breakdown.skills.max} pts</span>
                </div>
              </div>

              <div className="p-2.5 bg-white border-2 border-[#141312] hs-sm">
                <div className="flex items-center gap-1 text-[#D8362A] mb-1">
                  <AlertOctagon size={13} />
                  <span className="fm text-[9px] font-bold uppercase tracking-wider">Issues</span>
                </div>
                <div className="fh font-extrabold text-sm text-[#141312]">
                  {metrics.weakPhrasesFound.length + metrics.clichesFound.length + penalties.length} <span className="text-[10px] fm font-normal text-[#141312]/60">flagged</span>
                </div>
              </div>
            </div>

            {/* Section Breakdown Bars */}
            <div className="space-y-2.5 bg-white border-2 border-[#141312] p-3.5 hs-sm">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#141312]/60 fm mb-1">
                Detailed Pillar Scores
              </div>

              {/* Contact Info */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#141312] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Contact Info & Links</span>
                    <span className={`text-[9px] px-1 py-0.2 border fm font-black ${getStatusBadge(breakdown.contactInfo.status)}`}>
                      {breakdown.contactInfo.status}
                    </span>
                  </div>
                  <span className="fm">{breakdown.contactInfo.score}/{breakdown.contactInfo.max} pts</span>
                </div>
                <div className="w-full h-2 bg-[#E8E7E1] border border-[#141312]">
                  <div
                    className="h-full bg-[#141312] transition-all duration-300"
                    style={{ width: `${(breakdown.contactInfo.score / breakdown.contactInfo.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#141312] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Professional Summary</span>
                    <span className={`text-[9px] px-1 py-0.2 border fm font-black ${getStatusBadge(breakdown.summary.status)}`}>
                      {breakdown.summary.status}
                    </span>
                  </div>
                  <span className="fm">{breakdown.summary.score}/{breakdown.summary.max} pts</span>
                </div>
                <div className="w-full h-2 bg-[#E8E7E1] border border-[#141312]">
                  <div
                    className="h-full bg-[#141312] transition-all duration-300"
                    style={{ width: `${(breakdown.summary.score / breakdown.summary.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#141312] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Work Experience & Impact</span>
                    <span className={`text-[9px] px-1 py-0.2 border fm font-black ${getStatusBadge(breakdown.experience.status)}`}>
                      {breakdown.experience.status}
                    </span>
                  </div>
                  <span className="fm">{breakdown.experience.score}/{breakdown.experience.max} pts</span>
                </div>
                <div className="w-full h-2 bg-[#E8E7E1] border border-[#141312]">
                  <div
                    className="h-full bg-[#141312] transition-all duration-300"
                    style={{ width: `${(breakdown.experience.score / breakdown.experience.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#141312] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Skills & Keyword Match</span>
                    <span className={`text-[9px] px-1 py-0.2 border fm font-black ${getStatusBadge(breakdown.skills.status)}`}>
                      {breakdown.skills.status}
                    </span>
                  </div>
                  <span className="fm">{breakdown.skills.score}/{breakdown.skills.max} pts</span>
                </div>
                <div className="w-full h-2 bg-[#E8E7E1] border border-[#141312]">
                  <div
                    className="h-full bg-[#141312] transition-all duration-300"
                    style={{ width: `${(breakdown.skills.score / breakdown.skills.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="flex justify-between text-xs font-bold text-[#141312] mb-1">
                  <div className="flex items-center gap-1.5">
                    <span>Education & Certifications</span>
                    <span className={`text-[9px] px-1 py-0.2 border fm font-black ${getStatusBadge(breakdown.education.status)}`}>
                      {breakdown.education.status}
                    </span>
                  </div>
                  <span className="fm">{breakdown.education.score}/{breakdown.education.max} pts</span>
                </div>
                <div className="w-full h-2 bg-[#E8E7E1] border border-[#141312]">
                  <div
                    className="h-full bg-[#141312] transition-all duration-300"
                    style={{ width: `${(breakdown.education.score / breakdown.education.max) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Warnings / Penalties Section (if any detected) */}
            {penalties.length > 0 && (
              <div className="bg-[#FFF0EE] border-2 border-[#D8362A] p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D8362A] mb-1">
                  <AlertTriangle size={14} />
                  <span>Deductions Applied</span>
                </div>
                <ul className="text-xs text-[#141312] space-y-1 pl-4 list-disc">
                  {penalties.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actionable Suggestions */}
            {suggestions.length > 0 ? (
              <div className="bg-[#FFFBEB] border-2 border-[#D97706] p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D97706] mb-1.5">
                  <AlertTriangle size={14} />
                  <span>Key ATS Optimizations Needed</span>
                </div>
                <ul className="text-xs text-[#141312] space-y-1.5 pl-4 list-disc">
                  {suggestions.slice(0, 4).map((sugg, idx) => (
                    <li key={idx} className="leading-relaxed">{sugg}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-[#E8F8F0] border-2 border-[#10B981] p-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#10B981] mb-1">
                  <CheckCircle2 size={14} />
                  <span>Elite ATS Compliance!</span>
                </div>
                <p className="text-xs text-[#141312] leading-relaxed">
                  Your resume demonstrates exceptional action verb variety, quantified business metrics, and high keyword coverage.
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="pt-2 border-t border-[#141312]/20 flex justify-between items-center gap-3">
              <Link
                href="/ats-grader"
                target="_blank"
                className="fm text-xs font-bold text-[#2233FF] hover:underline flex items-center gap-1"
              >
                Scan with Job Description <ArrowUpRight size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="fm text-xs font-bold text-[#141312] bg-[#E8E7E1] hover:bg-[#141312] hover:text-[#E8E7E1] border-2 border-[#141312] px-4 py-1.5 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
