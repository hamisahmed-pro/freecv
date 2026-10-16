import React from 'react';
import Link from 'next/link';

/**
 * Author bio for article pages (E-E-A-T). The bio text is Hamis's own —
 * update AUTHOR_BIO if he revises it. Photo: uses initials avatar until
 * he provides a headshot.
 */
const AUTHOR_NAME = 'Hamis Ahmed';
const AUTHOR_ROLE = 'Founder, Cvyon';
const AUTHOR_BIO =
  'Hamis Ahmed is the founder of Cvyon and a full-stack engineer with over a decade of experience building web applications. As a Senior Full Stack Engineer at Payfaci (London) and Dexter Cyberlabs, he shipped products used by thousands — then started Cvyon to give job seekers the same professional-grade tools for free: 180 ATS-friendly resume templates, an AI-powered ATS grader, and unlimited downloads with no signup and no watermark. He writes about resumes, applicant tracking systems, and what actually gets candidates hired.';

export function AuthorBio({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`flex gap-4 rounded-2xl border border-line bg-white p-5 ${compact ? '' : 'mt-10'}`}
      aria-label={`About ${AUTHOR_NAME}`}
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-black text-white"
        aria-hidden
      >
        HA
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-extrabold text-navy">{AUTHOR_NAME}</span>
          <span className="text-[12px] font-bold uppercase tracking-wider text-muted">{AUTHOR_ROLE}</span>
        </div>
        <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{AUTHOR_BIO}</p>
        <Link
          href="/about"
          className="mt-2 inline-block text-[13px] font-bold text-brand hover:underline"
        >
          More about Hamis →
        </Link>
      </div>
    </aside>
  );
}
