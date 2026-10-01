'use client';

import { useState } from 'react';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';

const SNIPPET = `<a href="https://cvyon.com/ats-grader?utm_source=embed&utm_medium=badge">
  <img src="https://cvyon.com/embed/ats-badge.svg"
       alt="Free ATS resume grader by Cvyon"
       width="300" height="120" />
</a>`;

export default function EmbedClient() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SNIPPET);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = SNIPPET;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <V3Page pageName="embed">
      <div className="mx-auto max-w-3xl py-6">
        <V3Eyebrow>Free for bloggers &amp; career sites</V3Eyebrow>
        <h1 className="text-4xl font-black tracking-tight text-navy sm:text-5xl">
          Embed our free ATS grader on your site
        </h1>
        <p className="mt-4 max-w-[620px] text-[17px] leading-relaxed text-muted">
          Give your readers a free AI resume score in seconds. Paste the snippet
          below anywhere on your site — no signup, no watermark, free forever.
        </p>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-8 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          <p className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
            Live preview
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/embed/ats-badge.svg"
            alt="Free ATS resume grader by Cvyon"
            width={300}
            height={120}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
              Copy-paste this code
            </p>
            <button
              onClick={copy}
              className="rounded-[10px] bg-navy px-5 py-2.5 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px hover:bg-coral"
            >
              {copied ? 'Copied!' : 'Copy code'}
            </button>
          </div>
          <pre className="mt-4 overflow-x-auto rounded-xl bg-navy p-4 text-[13px] leading-relaxed text-cream">
            {SNIPPET}
          </pre>
        </div>

        <p className="mt-8 text-sm leading-relaxed text-muted">
          The badge links back to Cvyon&apos;s free ATS grader. Questions? Reach us
          at cvyon.com.
        </p>
      </div>
    </V3Page>
  );
}
