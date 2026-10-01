"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, Download, Trash2, Lock, LogOut, CheckCircle2 } from 'lucide-react';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';
import { RecruiterOptInCard } from '@/components/candidate/RecruiterOptInCard';
import { RecruiterActivityCard } from '@/components/candidate/RecruiterActivityCard';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [consents, setConsents] = useState({
    consent_recruiter_share: false,
    consent_email_jobs: false,
    consent_analytics: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);
      
      try {
        const res = await fetch(`/api/user/consent?email=${encodeURIComponent(session.user.email || '')}`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });
        const d = await res.json();
        if (d?.success && d?.consents) {
          setConsents({
            consent_recruiter_share: !!d.consents.consent_recruiter_share,
            consent_email_jobs: !!d.consents.consent_email_jobs,
            consent_analytics: d.consents.consent_analytics !== undefined ? !!d.consents.consent_analytics : true,
          });
        }
      } catch (err) {
        console.warn('Failed to load user consents', err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleToggle = async (field: string, value: boolean) => {
    if (!user?.email) return;
    const nextConsents = { ...consents, [field]: value };
    setConsents(nextConsents);
    setSaving(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/user/consent', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          email: user.email,
          consents: nextConsents
        })
      });
      if (res.ok) {
        setMsg('Preferences updated');
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {
      console.error('Failed to update consent preferences', e);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <V3Page pageName="settings">
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-brand"></div>
        </div>
      </V3Page>
    );
  }

  return (
    <V3Page pageName="settings">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <V3Eyebrow>§ account</V3Eyebrow>
            <h1 className="text-4xl font-black tracking-tight text-navy sm:text-5xl">Account Settings</h1>
            <p className="mt-2 text-[15px] text-muted">Manage your privacy preferences and data.</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-navy transition-all hover:-translate-y-px hover:border-navy"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          <div className="flex items-center gap-4 border-b border-line p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-lavender text-lg font-extrabold text-brand">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-navy">{user?.email}</div>
              <div className="text-sm text-muted">Cvyon Account</div>
            </div>
          </div>

          <div className="space-y-8 p-6">
            {msg && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={16} /> {msg}
              </div>
            )}

            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold tracking-tight text-navy">
                <Shield size={20} className="text-brand" /> Privacy &amp; Consent
              </h3>

              {/* recruiter discovery — opt-in moment #3: benefit-framed, explicit, one-tap revoke */}
              <div className="mb-6">
                <RecruiterOptInCard
                  variant="card"
                  onChange={(optedIn) => setConsents((c) => ({ ...c, consent_recruiter_share: optedIn }))}
                />
              </div>

              {/* candidate transparency: real recruiter activity on their profile */}
              <div className="mb-6">
                <RecruiterActivityCard />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-cream p-4">
                  <div>
                    <div className="font-bold text-navy">Job Match Emails</div>
                    <div className="text-sm text-muted">Receive emails when we match you with new roles.</div>
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => handleToggle('consent_email_jobs', !consents.consent_email_jobs)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${consents.consent_email_jobs ? 'bg-brand' : 'bg-line'}`}
                    aria-label="Toggle job match emails"
                  >
                    <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${consents.consent_email_jobs ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-cream p-4">
                  <div>
                    <div className="font-bold text-navy">Analytics (Anonymous)</div>
                    <div className="text-sm text-muted">Help us improve Cvyon by sharing anonymous usage data.</div>
                  </div>
                  <button
                    disabled={saving}
                    onClick={() => handleToggle('consent_analytics', !consents.consent_analytics)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${consents.consent_analytics ? 'bg-brand' : 'bg-line'}`}
                    aria-label="Toggle anonymous analytics"
                  >
                    <div className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${consents.consent_analytics ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-line pt-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-extrabold tracking-tight text-navy">
                <Lock size={20} className="text-navy" /> Data Portability &amp; Deletion
              </h3>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-4 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-px hover:bg-coral">
                  <Download size={16} /> Download My Data
                </button>
                <button className="inline-flex items-center gap-2 rounded-[10px] bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition-transform hover:-translate-y-px hover:bg-red-100">
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">Under GDPR and CCPA, you have the right to request an export of your data or complete erasure from our systems.</p>
            </div>

          </div>
        </div>
      </div>
    </V3Page>
  );
}
