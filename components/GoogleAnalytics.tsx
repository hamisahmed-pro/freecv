"use client";

import { useEffect } from "react";
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
 * - Storage is only granted after the user accepts analytics in the consent popup
 *   (ConsentManager -> data.consents.analytics).
 * - Renders nothing until NEXT_PUBLIC_GA_MEASUREMENT_ID is configured.
 */
export function GoogleAnalytics() {
  const analyticsConsent =
    useResumeStore((s) => s.data?.consents?.analytics) === true;

  useEffect(() => {
    if (!GA_ID || !analyticsConsent) return;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", { analytics_storage: "granted" });
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(["consent", "update", { analytics_storage: "granted" }]);
    }
  }, [analyticsConsent]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-consent-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
