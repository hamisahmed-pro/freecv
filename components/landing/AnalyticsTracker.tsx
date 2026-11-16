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
    const locale = pathname.startsWith('/') ? pathname.slice(1) : '';
    if (pathname !== '/' && !(locale.length >= 2 && locale.length <= 3 &&
        [...locale].every((ch) => ch >= 'a' && ch <= 'z'))) return;
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
