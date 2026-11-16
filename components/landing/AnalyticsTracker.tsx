"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

function Tracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // The shared page shell mounts this component on many inner pages.
    // Landing-start must not fire for every route or every search-param change.
    if (pathname !== '/' && !/^\\/[a-z]{2,3}$/.test(pathname)) return;
    void trackEvent('landing_started', undefined, { source: searchParams.get('source') || 'direct' });
  }, [pathname, searchParams]);

  return null;
}

export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
