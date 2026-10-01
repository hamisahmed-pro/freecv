"use client";

import { useEffect } from "react";

/**
 * Error boundary for /admin — renders when the admin page throws
 * (e.g. database fetch failures are surfaced instead of silently
 * returning empty data).
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-[480px] rounded-2xl border border-line bg-paper p-8 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
        <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-coral">
          Admin · load failed
        </div>
        <h1 className="text-xl font-black tracking-tight text-navy">
          Couldn&apos;t load the dashboard
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {error?.message ||
            "Something went wrong while fetching admin data. Check the server logs for details."}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => reset()}
            className="rounded-[10px] bg-navy px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral"
          >
            Try again
          </button>
          <a
            href="/admin/login"
            className="rounded-[10px] border border-line bg-paper px-5 py-2.5 text-[12px] font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px hover:border-brand hover:text-brand"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
