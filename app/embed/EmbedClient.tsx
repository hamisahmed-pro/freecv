'use client';

import { useState } from 'react';

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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
        Free for bloggers &amp; career sites
      </p>
      <h1 className="mt-2 text-3xl font-bold">
        Embed our free ATS grader on your site
      </h1>
      <p className="mt-4 text-gray-600">
        Give your readers a free AI resume score in seconds. Paste the snippet
        below anywhere on your site — no signup, no watermark, free forever.
      </p>

      <div className="mt-8 rounded-2xl border bg-gray-50 p-8">
        <p className="mb-4 text-sm font-medium text-gray-500">
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

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Copy-paste this code
          </p>
          <button
            onClick={copy}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>
        <pre className="mt-2 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100">
          {SNIPPET}
        </pre>
      </div>

      <p className="mt-8 text-sm text-gray-500">
        The badge links back to Cvyon&apos;s free ATS grader. Questions? Reach us
        at cvyon.com.
      </p>
    </main>
  );
}
