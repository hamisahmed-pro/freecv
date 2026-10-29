import type { Metadata } from 'next';
import Link from 'next/link';
import { V3Page } from '@/components/v3/V3Chrome';

// Staged 2026-10-29, NOT published to production yet.
// Comparison page built only from the dated test runs of 2026-10-24
// (hidden_files/comparison-test-run-20261024.md,
// comparison-test-run2-20261024.md, and the 2026-10-24 preview verification
// log). No score, price, gate or "best" claim on this page comes from
// anywhere else. Binding rules, from the test assets file:
// - No tool here runs an employer's actual ATS parser. Every tool
//   "simulates how an ATS parses" a resume.
// - Disclosure in paragraph 1: this is Cvyon's own comparison.
// - "Best for X" verdicts only where the test supports them, including
//   where Cvyon loses.
// - The Cvyon score is NOT a clean production result: in the formal
//   24 Oct run Cvyon's grader returned NO score (overload fallbacks);
//   93/100 was observed only on a preview deployment, after a retry,
//   on the same fictional resume. That distinction is stated on the
//   page itself, and the page must not be published until a clean
//   production Cvyon re-run exists.

export const metadata: Metadata = {
  title: 'Best ATS Resume Checkers (2026): What We Tested, Without an Account | Cvyon',
  description:
    'We tested 9 ATS resume checkers on the same fictional resume on 24 October 2026, without creating an account or paying. Only one returned a free score. Here is what each tool actually did, what it gated, and what it costs.',
  alternates: { canonical: 'https://cvyon.com/best-ats-resume-checkers' },
  openGraph: {
    title: 'Best ATS Resume Checkers (2026): What We Tested, Without an Account',
    description:
      'We tested 9 ATS resume checkers on the same fictional resume on 24 October 2026, without creating an account or paying. Only one returned a free score.',
    url: 'https://cvyon.com/best-ats-resume-checkers',
    siteName: 'Cvyon',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Best ATS Resume Checkers (2026): What We Tested, Without an Account',
    description:
      'We tested 9 ATS resume checkers on the same fictional resume on 24 October 2026, without creating an account or paying. Only one returned a free score.',
  },
};

const ROWS = [
  {
    tool: 'Cvyon',
    freeScore: 'No score in the formal run',
    observed:
      'Upload worked and the job posting was pasted, with no signup gate. Four Analyze attempts each showed PROCESSING, then fell back to ANALYZE MATCH with the panel still "AWAITING INPUT"; the last two showed "The AI model is temporarily overloaded." No score, flags, rewrite or parse result in the formal run.',
    price: 'Free ATS grader, no signup, no watermark. 180 free templates.',
  },
  {
    tool: 'Enhancv',
    freeScore: 'Yes — 80/100',
    observed:
      'No signup for the free report. Content 96%, Sections 100%, ATS Essentials 68%, HR Red Flags 64%, Discrimination 67%, Seniority 55%, Tailoring 67%. ATS Parse Rate 90% read / 10% missed. Free view is a list of suggestions only — no bullet rewrites (those are PRO-gated).',
    price: 'No numeric Pro price beside the Upgrade buttons on the report page on test day (price shown as broken). Do not rely on a price for Enhancv Pro from this test.',
  },
  {
    tool: 'Jobscan',
    freeScore: 'Not determined',
    observed:
      'File upload could not be completed (iframe widget, repeated file-chooser errors); the scan step was never reached and the posting was never pasted. Whether a signup gate applies on the file route was therefore neither confirmed nor cleared. The 76% figure on its page is sample imagery, not a result.',
    price: 'Pricing page seen 24 Oct 2026: $49.95/month; free tier 5 scans/month.',
  },
  {
    tool: 'Resume Worded',
    freeScore: 'No — signup gate before score',
    observed:
      'After upload and a mid-level selection, the tool asked to "Create a free account to continue" before any score. Limit seen: English PDF/DOCX only, max 2 MB.',
    price: 'Pricing page seen 24 Oct 2026: Pro $49/month.',
  },
  {
    tool: 'SkillSyncer',
    freeScore: 'No — signup gate before upload',
    observed:
      'Homepage "Get started" went to an auth/register page before any upload. No score.',
    price: 'Pricing page seen 24 Oct 2026: Premium $14.95/month.',
  },
  {
    tool: 'Resume Optimizer Pro',
    freeScore: 'No — parse only, no job-match score',
    observed:
      'Parsed the resume (156 words, 25 lines, 1,210 characters; sections found: Contact, Summary, Experience, Skills, Education, Certifications; "Reads cleanly"). Its own page states job-match, wording and keywords are NOT included in the free parse. Signup gate at "Optimize My Resume".',
    price: 'Pricing page seen 24 Oct 2026: Free $0; Pro $16.65/month billed quarterly (a $29.95/month figure was also seen on the pricing page — check the current page before quoting).',
  },
  {
    tool: 'Rezi',
    freeScore: 'No — signup gate at the Score step',
    observed:
      '"Limited" Rezi Score returned no number without signup. No score.',
    price: 'Pricing page seen 24 Oct 2026: Free $0; Pro $29/month; Lifetime $149.',
  },
  {
    tool: 'Teal',
    freeScore: 'No — signup gate before upload',
    observed:
      'Homepage "Upload Your Resume Now" went to a sign-up page before any upload. No score.',
    price: 'Pricing page seen 24 Oct 2026: Free Forever; Teal+ $13/7 days, $29/30 days, $79/90 days.',
  },
  {
    tool: 'Kickresume',
    freeScore: 'Not observable',
    observed:
      'Site unusable on test day: empty-response error, then a correct title but a blank page with no interactive elements after reload and a 10-second wait. No checker, gate or price could be observed. This is a site-availability finding, not a judgement of the tool.',
    price: 'Not observable on test day.',
  },
];

export default function BestAtsResumeCheckersPage() {
  return (
    <V3Page pageName="comparison_ats_checkers" cta={{ label: 'Build free →', href: '/build' }}>
      <main className="mx-auto max-w-[860px] px-5 py-10">
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Best ATS Resume Checkers (2026): What We Tested, Without an Account
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#565a70]">
          Disclosure first: this is Cvyon&apos;s own comparison. On 24 October
          2026 we tested 9 ATS resume checkers on the same fictional resume
          (a mid-level backend software engineer, &ldquo;Alex Morgan&rdquo; —
          not a real person) against the same fictional backend job posting.
          We created no accounts and paid nothing on any tool. No tool on this
          page runs an employer&apos;s actual ATS parser; each one simulates
          how an ATS parses a resume.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">The honest headline</h2>
        <p className="mt-4 leading-relaxed">
          Only <strong>one</strong> of the 9 tools returned a free score
          without an account in this test: Enhancv, at 80/100. Five tools
          gated the score behind signup, one parsed without scoring, one
          could not complete its upload, and one was unusable on test day.
          Cvyon&apos;s own grader returned <strong>no score in the formal
          run</strong> — that failure is recorded below, not hidden.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">What each tool actually did</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-[15px] leading-relaxed">
            <thead>
              <tr>
                <th className="border-b-2 border-[#141312] p-3 align-top">Tool</th>
                <th className="border-b-2 border-[#141312] p-3 align-top">Free score without an account?</th>
                <th className="border-b-2 border-[#141312] p-3 align-top">What we observed (24 Oct 2026)</th>
                <th className="border-b-2 border-[#141312] p-3 align-top">Price seen</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.tool}>
                  <td className="border-b p-3 align-top font-bold">{row.tool}</td>
                  <td className="border-b p-3 align-top">{row.freeScore}</td>
                  <td className="border-b p-3 align-top">{row.observed}</td>
                  <td className="border-b p-3 align-top">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-10 text-xl font-extrabold">About the Cvyon score you may see elsewhere</h2>
        <p className="mt-4 leading-relaxed">
          Separately from the formal run, on the same day and the same
          fictional resume, Cvyon&apos;s grader did return <strong>93/100 on
          a preview deployment after a retry</strong> (the first attempt
          showed the same overload message as the formal run). That score is
          <strong>not</strong> a clean production result, it was not produced
          under the formal run&apos;s conditions, and it is not comparable
          with Enhancv&apos;s 80/100 as if both came from the same test. We
          are not publishing this page as a score ranking until Cvyon&apos;s
          grader produces a clean score on production itself. If you try the
          grader today and it shows the overload fallback, that is the current
          production behaviour we still need to fix — not a contradiction of
          this page, but the reason it is held from publication.
        </p>

        <h2 className="mt-10 text-xl font-extrabold">What this test does not prove</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 leading-relaxed">
          <li>
            A score from any tool here is not an employer&apos;s ATS verdict.
            These tools simulate parsing, keyword matching and formatting
            checks; no employer system was involved.
          </li>
          <li>
            Prices change. Every price above is what the tool&apos;s own
            pricing page showed on 24 October 2026 — check the current page
            before you pay.
          </li>
          <li>
            &ldquo;Gated&rdquo; means gated on test day, on the route we
            tried. A tool may offer a different free route we did not test.
          </li>
          <li>
            One fictional resume, one fictional posting. Results will differ
            for other roles, formats and experience levels. We plan to re-run
            this test quarterly and update this page with the new date.
          </li>
        </ul>

        <h2 className="mt-10 text-xl font-extrabold">If you want a score without an account</h2>
        <p className="mt-4 leading-relaxed">
          On the evidence of this test alone, Enhancv was the only tool that
          showed a score free and ungated. Cvyon&apos;s grader is free and
          ungated too — it asks for no account — but on test day it did not
          return a score in the formal run, so we cannot honestly recommend
          it on the basis of this test until the production re-run lands.
          Try it yourself and judge it on what it returns for your resume,
          not on this page&apos;s claims.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/ats-grader"
            className="inline-flex items-center justify-center rounded-lg bg-[#141312] px-5 py-3 text-sm font-bold text-white"
          >
            Try the free ATS grader
          </Link>
          <Link
            href="/build"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#141312] px-5 py-3 text-sm font-bold"
          >
            Build your resume free
          </Link>
          <Link
            href="/blog/what-is-applicant-tracking-system"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#141312] px-5 py-3 text-sm font-bold"
          >
            What is an ATS?
          </Link>
        </div>

        <p className="mt-10 text-sm text-[#565a70]">
          Test date: 24 October 2026. Test resume: fictional, &ldquo;Alex
          Morgan&rdquo;, mid-level backend software engineer. Test posting:
          fictional mid-level backend role (Python/Go, REST APIs, PostgreSQL,
          Redis, Docker, CI/CD). No accounts created, nothing paid. Page
          prepared 29 October 2026; held from production publication pending
          a clean Cvyon production re-run.
        </p>
      </main>
    </V3Page>
  );
}
