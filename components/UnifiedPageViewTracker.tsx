"use client";
import { useEffect, useRef, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics';

/** Includes SPA navigations and first accepted-consent page, with no
 * client-side identity sent to GA4. Admin and QA browsing are ignored. */
function TrackPage() {
  const pathname = usePathname();
  const lastGaPath = useRef<string | null>(null);
  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api/')) return;
    const allowed = () => {
      try {
        if (localStorage.getItem('cvyon-consent-v2') !== 'acknowledged' ||
            localStorage.getItem('cvyon_analytics_exclude') === 'true' ||
            navigator.webdriver === true) return false;
        const raw = localStorage.getItem('cvyon-storage');
        const data = raw ? JSON.parse(raw) : null;
        return data?.state?.data?.consents?.analytics === true;
      } catch { return false; }
    };
    const sendGa = () => {
      if (!allowed() || lastGaPath.current === pathname) return;
      const ga = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
      if (ga) {
        ga('event', 'page_view', { page_path: pathname, page_location: window.location.href });
        lastGaPath.current = pathname;
      }
    };
    const fire = () => {
      if (!allowed()) return;
      void trackEvent('page_view', undefined, { page: pathname });
      sendGa();
    };
    fire();
    window.addEventListener('cvyon:consent-changed', fire);
    window.addEventListener('cvyon:ga-ready', sendGa);
    return () => {
      window.removeEventListener('cvyon:consent-changed', fire);
      window.removeEventListener('cvyon:ga-ready', sendGa);
    };
  }, [pathname]);
  return null;
}

export default function UnifiedPageViewTracker() {
  return <Suspense fallback={null}><TrackPage /></Suspense>;
}
