"use client";

import React, { useState, useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Shield, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConsentManager() {
  const { data, setConsents } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeen, setHasSeen] = useState(true);

  useEffect(() => {
    const seen = localStorage.getItem('cvyon-consent-seen');
    if (!seen) {
      setHasSeen(false);
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const email = data.personalInfo?.email?.trim()?.toLowerCase();
    const isValidEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

    // Skip auto-sync for empty, demo, or placeholder emails
    const BLOCKED = ['jane@cvyon.dev', 'your.email@example.com', 'test@test.com', 'example@example.com', 'user@example.com'];
    if (!isValidEmail || !email || BLOCKED.includes(email)) return;

    // Also require the user to have entered a real name (not empty/default)
    const name = data.personalInfo?.fullName?.trim();
    if (!name || name.length < 2) return;

    const timer = setTimeout(() => {
      fetch('/api/crm/optin', {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch((e) => console.warn('Consent sync error', e));
    }, 2000);

    return () => clearTimeout(timer);
  }, [data.personalInfo.email, data.personalInfo.fullName, data.personalInfo.jobTitle, data.skills, data.consents]);

  const syncConsent = (updatedConsents: any) => {
    const email = data.personalInfo?.email?.trim()?.toLowerCase();
    const BLOCKED = ['jane@cvyon.dev', 'your.email@example.com', 'test@test.com', 'example@example.com', 'user@example.com', ''];
    if (!email || !email.includes('@') || BLOCKED.includes(email)) return;
    fetch('/api/crm/optin', {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, consents: updatedConsents }),
    }).catch((e) => console.warn('Consent sync error', e));
  };

  const handleSave = () => {
    localStorage.setItem('cvyon-consent-seen', 'true');
    setHasSeen(true);
    setIsOpen(false);
    syncConsent(data.consents);
  };

  const handleAcceptAll = () => {
    const fullConsents = { recruiterShare: true, emailJobs: true, analytics: true };
    setConsents(fullConsents);
    localStorage.setItem('cvyon-consent-seen', 'true');
    setHasSeen(true);
    setIsOpen(false);
    syncConsent(fullConsents);
  };

  // The privacy dialog appears only on first visit (until dismissed). There is
  // no persistent tab — users manage preferences anytime via the dedicated
  // Privacy Policy & Consent Center page (/privacy).
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-3 left-3 z-[400] print:hidden max-w-[280px] w-full" role="dialog" aria-label="Privacy and Data Preferences">
      <div className="bg-white/95 backdrop-blur-md text-gray-800 rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-300">
        <div className="p-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-1.5 text-[#151a46]">
              <Shield size={12} className="text-[#ff604b]" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider">Privacy & Data</h2>
            </div>
            {hasSeen && (
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close privacy preferences"
                className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <p className="text-[10px] text-gray-600 mb-3 leading-tight">
            We use your data for AI features and optionally connect you with recruiters. Manage your preferences.
          </p>

          <div className="space-y-1.5 mb-3" role="group" aria-label="Consent Options">
            {/* Essential & AI */}
            <div className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-100 bg-gray-50" aria-disabled="true">
              <div className="w-3.5 h-3.5 rounded bg-gray-300 flex items-center justify-center text-white">
                <Check size={8} />
              </div>
              <span className="font-semibold text-[10px] text-gray-700">Essential & AI Processing (Required)</span>
            </div>

            {/* Talent Pool */}
            <div
              role="checkbox"
              aria-checked={data.consents.recruiterShare}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setConsents({ ...data.consents, recruiterShare: !data.consents.recruiterShare });
                }
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-[#ff604b]"
              onClick={() => setConsents({ ...data.consents, recruiterShare: !data.consents.recruiterShare })}
            >
              <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center transition-colors", data.consents.recruiterShare ? 'bg-[#ff604b] text-white' : 'border border-gray-300')}>
                {data.consents.recruiterShare && <Check size={8} />}
              </div>
              <span className="font-semibold text-[10px] text-gray-700">Allow recruiters to find my profile</span>
            </div>

            {/* Job Alerts & Matches */}
            <div
              role="checkbox"
              aria-checked={data.consents.emailJobs}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setConsents({ ...data.consents, emailJobs: !data.consents.emailJobs });
                }
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5548f5]"
              onClick={() => setConsents({ ...data.consents, emailJobs: !data.consents.emailJobs })}
            >
              <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center transition-colors", data.consents.emailJobs ? 'bg-[#5548f5] text-white' : 'border border-gray-300')}>
                {data.consents.emailJobs && <Check size={8} />}
              </div>
              <span className="font-semibold text-[10px] text-gray-700">Job Alerts & Matching</span>
            </div>

            {/* Analytics */}
            <div
              role="checkbox"
              aria-checked={data.consents.analytics}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  setConsents({ ...data.consents, analytics: !data.consents.analytics });
                }
              }}
              className="flex items-center gap-2 p-1.5 rounded-lg border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-1 focus:ring-[#151a46]"
              onClick={() => setConsents({ ...data.consents, analytics: !data.consents.analytics })}
            >
              <div className={cn("w-3.5 h-3.5 rounded flex items-center justify-center transition-colors", data.consents.analytics ? 'bg-[#151a46] text-white' : 'border border-gray-300')}>
                {data.consents.analytics && <Check size={8} />}
              </div>
              <span className="font-semibold text-[10px] text-gray-700">Anonymous Analytics</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-wider bg-[#151a46] text-white hover:bg-[#ff604b] transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
