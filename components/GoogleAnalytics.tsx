"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { useResumeStore } from "@/store/useResumeStore";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 via Consent Mode v2.
 * - gtag loads with analytics_storage denied by default (GDPR-friendly).
 * - 2026-10-25 perf round 2: the gtag.js loader is lazyOnload (idle-time)
 *   so the 181KB download no longer competes with first paint. The inline
 *   stub below stays afterInteractive, so gtag()/dataLayer queueing and the
 *   consent defaults exist from hydration; queued events drain in order
 *   once gtag.js arrives. Nothing is removed: GA still loads on every page.
 * - Storage is only granted after the user accepts analytics in the consent popup
 *   (ConsentManager -> data.consents.analytics).
 * - Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 */
export function GoogleAnalytics() {
  const analyticsConsent =
    useResumeStore((s) => s.data?.consents?.analytics) === true;
  const [explicitConsent, setExplicitConsent] = useState(false);
  useEffect(() => {
    const sync = () => {
      try { setExplicitConsent(localStorage.getItem('cvyon-consent-v2') === 'acknowledged'); }
      catch { setExplicitConsent(false); }
    };
    sync();
    window.addEventListener('cvyon:consent-changed', sync);
    return () => window.removeEventListener('cvyon:consent-changed', sync);
  }, []);
  const active = analyticsConsent && explicitConsent;

  useEffect(() => {
    if (!GA_ID) return;
    const w = window as unknown as Record<string, unknown>;
    w['ga-disable-' + GA_ID] = !active;
    window.gtag?.('consent', 'update', { analytics_storage: active ? 'granted' : 'denied' });
  }, [active]);

  // Do not download or initialize the Google tag for undecided/declined visitors.
  if (!GA_ID || !active) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-consent-init" strategy="afterInteractive"
        onReady={() => window.dispatchEvent(new Event('cvyon:ga-ready'))}>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
