"use client";

import { useEffect } from 'react';
import { useResumeStore } from '@/store/useResumeStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const syncToCloud = useResumeStore((state) => state.syncToCloud);

  // 2026-10-25 perf round 2: @supabase/supabase-js (~100KB+) was statically
  // imported here, pulling it into every page's first chunk although auth
  // state is only observed after mount. It is now loaded on demand inside
  // this effect (same pattern as store/slices/syncSlice.ts); the subscription
  // still starts on mount, just after a fast same-origin chunk fetch, and the
  // cleanup guards unmount-before-load so nothing leaks.
  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    (async () => {
      const { supabase } = await import('@/lib/supabase');
      if (cancelled) return;
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session) {
            syncToCloud();
          }
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [syncToCloud]);

  return <>{children}</>;
}
