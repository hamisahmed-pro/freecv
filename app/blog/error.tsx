'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog article failed to load:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 font-brand">
      <div className="w-full max-w-md rounded-2xl border border-line bg-paper p-10 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-muted">
          Article unavailable
        </p>
        <h1 className="mb-3 text-2xl font-black tracking-tight text-navy">
          Couldn&apos;t load this article
        </h1>
        <p className="mb-8 text-muted">
          Something went wrong on our end. Please try again in a moment.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => reset()}
            className="rounded-full bg-navy px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:-translate-y-px hover:bg-coral"
          >
            Try again
          </button>
          <Link
            href="/blog"
            className="rounded-full border border-line bg-paper px-6 py-3 text-sm font-bold uppercase tracking-widest text-navy transition-all hover:border-navy hover:bg-navy hover:text-white"
          >
            All articles
          </Link>
        </div>
      </div>
    </div>
  );
}
