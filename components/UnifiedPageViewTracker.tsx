"use client";
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/** Includes SPA navigations and first accepted-consent page, with no
 * client-side identity sent to GA4. Admin and QA browsing are ignored. */
function TrackPage() {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api/')) return;
    const fire = () => {
      try {
        if (localStorage.getItem('cvyon-consent-v2') !== 'acknowledged' ||
            localStorage.getItem('cvyon_analytics_exclude') === 'true') return;
        const raw = localStorage.getItem('cvyon-storage');
        const data = raw ? JSON.parse(raw) : null;
        if (data?.state?.data?.consents?.analytics !== true) return;
        void trackEvent('page_view', undefined, { page: pathname });
        const ga = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
        ga?.('event', 'page_view', { page_path: pathname, page_location: window.location.href });
      } catch { /* user navigation must not fail because of telemetry */ }
    };
    fire();
    window.addEventListener('cvyon:consent-changed', fire);
    return () => window.removeEventListener('cvyon:consent-changed', fire);
  }, [pathname, params]);
  return null;
}

export default function UnifiedPageViewTracker() {
  return <Suspense fallback={null}><TrackPage /></Suspense>;
}
