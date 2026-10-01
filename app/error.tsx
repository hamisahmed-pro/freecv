"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Client-side error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-10 text-center shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10">
          <AlertTriangle size={26} className="text-coral" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-navy">
          Something went wrong
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-navy/65">
          We've logged this issue and will look into it. Your resume data is safe.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-navy px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px"
          >
            <RotateCcw size={15} /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-paper px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-navy transition-colors hover:border-navy"
          >
            <Home size={15} /> Home
          </Link>
        </div>
      </div>
    </div>
  );
}
