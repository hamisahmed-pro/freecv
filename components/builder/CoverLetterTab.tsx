"use client";

import React, { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { PenTool, Loader2, Download, AlertCircle, Copy, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CoverLetterTab({ dict }: { dict: Record<string, string> }) {
  const data = useResumeStore((state) => state.data);
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterText, setCoverLetterText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste the target job description.');
      return;
    }
    
    // Check if we have enough resume data
    if (!data.summary && data.experience.length === 0) {
      setError('Your resume is empty. Please fill out your summary and experience first so the AI can write a tailored cover letter.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: data, jobDescription, tone })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate cover letter');
      }

      const resData = await res.json();
      setCoverLetterText(resData.text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during generation.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <PenTool size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{dict["builder.cover_letter.ai_cover_letter_generator"]}</h3>
          <p className="text-xs text-gray-500">{dict["builder.cover_letter.generate_a_highly_tailored_cover_letter"]}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{dict["builder.cover_letter.target_job_description"]}</label>
          <textarea
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none min-h-[120px] resize-y custom-scrollbar"
            placeholder={dict["builder.cover_letter.paste_the_job_description_here"]}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">{dict["builder.cover_letter.tone"]}</label>
          <select
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none appearance-none"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option value="Professional">{dict["builder.cover_letter.professional_default"]}</option>
            <option value={dict["builder.cover_letter.confident_executive"]}>{dict["builder.cover_letter.confident_executive"]}</option>
            <option value={dict["builder.cover_letter.creative_passionate"]}>{dict["builder.cover_letter.creative_passionate"]}</option>
            <option value={dict["builder.technical_analytical"]}>{dict["builder.technical_analytical"]}</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <PenTool size={18} />}
          {isGenerating ? 'Drafting Cover Letter...' : 'Generate Cover Letter'}
        </button>

        {coverLetterText && (
          <div className="mt-6 border-t pt-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-bold text-gray-900">{dict["builder.cover_letter.your_tailored_cover_letter"]}</h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <textarea
                className="w-full bg-transparent text-sm text-gray-800 leading-relaxed outline-none min-h-[300px] resize-y custom-scrollbar"
                value={coverLetterText}
                onChange={(e) => setCoverLetterText(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
