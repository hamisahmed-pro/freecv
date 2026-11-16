"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";
import { supabase } from "@/lib/supabase";
import { getRecruiterConsent, setRecruiterConsent } from "@/lib/recruiter-api";

export default function PrivacyClient() {
  // The switch reflects a persisted recruiter-discovery choice, not just UI state.
  const [doNotSell, setDoNotSell] = useState(true);
  const [busy, setBusy] = useState(false);
  const [privacyStatus, setPrivacyStatus] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const gpc = Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
      const { data: { session } } = await supabase.auth.getSession();
      if (!alive) return;
      setSignedIn(Boolean(session));
      if (!session) { setDoNotSell(true); return; }
      const consent = await getRecruiterConsent();
      if (!alive) return;
      if (gpc && consent?.optedIn) {
        try {
          await setRecruiterConsent(false);
          if (alive) setPrivacyStatus('Your browser’s privacy preference has been respected.');
        } catch {
          if (alive) setPrivacyStatus('We could not confirm your opt-out. Please retry or contact support.');
        }
      }
      if (alive) setDoNotSell(gpc || !consent?.optedIn);
    };
    void refresh();
    return () => { alive = false; };
  }, []);

  const toggleDoNotSell = async () => {
    if (busy || doNotSell) return;
    setBusy(true);
    setPrivacyStatus('');
    try {
      await setRecruiterConsent(false);
      setDoNotSell(true);
      setPrivacyStatus('Confirmed: your profile is no longer shared with recruiters.');
    } catch {
      setPrivacyStatus('We could not save this opt-out. Please try again or contact support.');
    } finally { setBusy(false); }
  };

  return (
    <V3Page
      pageName="privacy"
      logoSub="BUILD • GET HIRED"
      cta={{ label: "Build free →", href: "/build" }}
    >
      <div className="mx-auto max-w-[900px]">
        <V3Eyebrow>Privacy &amp; consent</V3Eyebrow>
        <h1 className="max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy md:text-[52px]">
          Your data. Your choices.
        </h1>
        <p className="mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
          A clearer, calmer way to understand how Cvyon handles resume, account and
          recruiter-matching data.
        </p>

        <div className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          {/* 01 · AI data processing */}
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>01 · AI data processing</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              AI features and your content
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              By using Cvyon&rsquo;s AI features (such as ATS Scoring, Rewriting, and Import),
              you acknowledge that your resume content and job descriptions are processed by{" "}
              <strong className="text-navy">Google Gemini AI</strong>. Google&rsquo;s API terms
              apply. Prompts sent via the API may be retained by Google for up to 30 days for
              abuse monitoring, but are <strong className="text-navy">not</strong> used to train
              Google&rsquo;s foundation models.
            </p>
          </section>

          {/* 02 · Your rights */}
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>02 · Your rights</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              GDPR access, export and deletion
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              If you are an EU resident, you have the right to access, rectify, export, and
              erase your personal data. You can request an export or deletion of your data any
              time via support@cvyon.com.
            </p>
            <div className="mt-5 flex flex-wrap gap-[10px]">
              <a
                href="mailto:support@cvyon.com?subject=Data%20deletion%20request"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
              >
                Request data deletion
              </a>
              <a
                href="mailto:support@cvyon.com?subject=Data%20export%20request"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-lavender px-[18px] py-3 text-[12px] font-extrabold text-brand transition-transform hover:-translate-y-px"
              >
                Export my data
              </a>
            </div>
          </section>

          {/* 03 · California privacy rights */}
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>03 · California privacy rights</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              CCPA / CPRA
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              California residents have the right to opt-out of the &ldquo;sale&rdquo; or
              &ldquo;sharing&rdquo; of their personal information. If you joined the Cvyon
              Talent Pool, your data may be shared with recruiters.
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-[12px] border border-line bg-cream p-[18px]">
              <div>
                <strong className="text-[15px] font-extrabold text-navy">
                  Do not sell my personal information
                </strong>
                <div className="mt-1 text-[12px] text-muted">
                  Opt out of sharing your resume with recruiters.
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={doNotSell}
                onClick={() => { void toggleDoNotSell(); }}
                disabled={busy || doNotSell}
                className={`shrink-0 rounded-[10px] border px-[18px] py-3 text-[12px] font-extrabold transition-colors ${
                  doNotSell
                    ? "border-coral bg-coral text-white"
                    : "border-line bg-paper text-navy"
                }`}
              >
                {busy ? "Saving…" : doNotSell ? "ON" : "OFF"}
              </button>
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-muted" role="status">
              {privacyStatus || (doNotSell
                ? "Recruiter sharing is disabled. To opt in later, use the explicit consent control in account settings."
                : "Your recruiter-sharing preference is enabled. Switch this on to stop sharing.")}
            </p>
            {signedIn && (
              <Link href="/settings" className="mt-2 inline-block text-[12px] font-bold text-brand underline">
                Manage all consent preferences in your account
              </Link>
            )}
          </section>

          {/* 04 · Data retention */}
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>04 · Data retention</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              How long we retain data
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              Our internal retention policy sets a 90-day target for raw analytics
              events. Retention and deletion controls are reviewed as part of our
              privacy operations; we do not claim that every record is already
              automatically deleted on a fixed schedule. You can request access
              to or deletion of your personal information at support@cvyon.com.
            </p>
          </section>

          {/* 05 · Data protection officer */}
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>05 · Data protection officer</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              Questions about your data?
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              If you have any questions about this Privacy Policy, your rights, or how we
              handle your data, please contact our Data Protection Officer:
              <br />
              <br />
              <strong className="text-navy">Cvyon Privacy Team</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:support@cvyon.com"
                className="font-bold text-brand underline hover:text-navy"
              >
                support@cvyon.com
              </a>
            </p>
          </section>

          <div className="mt-[34px] border-t border-line pt-[22px]">
            <Link href="/">
              <V3Pill>← Back to Cvyon</V3Pill>
            </Link>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
