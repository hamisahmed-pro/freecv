"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

/* Legal text kept verbatim from the original Terms page — only the
 * chrome and typography were changed. */

const SECTIONS: { n: string; title: string; body: React.ReactNode }[] = [
  {
    n: "01",
    title: "The Service",
    body: (
      <p>
        Cvyon (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides a free online resume builder, cover-letter
        builder, ATS grader, and related career tools at cvyon.com (the
        &ldquo;Service&rdquo;). The core resume builder is free to use and does not
        require an account. By accessing or using the Service, you agree to
        these Terms.
      </p>
    ),
  },
  {
    n: "02",
    title: "Your Content",
    body: (
      <p>
        You retain full ownership of the resumes, cover letters, and other
        materials you create with Cvyon (&ldquo;Your Content&rdquo;). By using the
        Service you grant us a limited, worldwide license to store, process,
        and display Your Content solely to operate the Service — for example
        to render your resume, generate PDF/DOCX exports, and run the AI
        features you request. We do not sell Your Content.
      </p>
    ),
  },
  {
    n: "03",
    title: "AI Features",
    body: (
      <p>
        Features such as AI rewriting, ATS scoring, and resume import are
        powered by third-party AI providers (currently Google Gemini). When
        you use these features, the content you submit is processed by that
        provider under their terms. AI output is generated automatically and
        may be inaccurate — always review it before sending it to employers.
      </p>
    ),
  },
  {
    n: "04",
    title: "Talent Pool & Recruiter Sharing",
    body: (
      <>
        <p>
          Cvyon offers an optional talent pool that lets verified recruiters
          discover candidates. You are <strong>never</strong> added to the
          talent pool by default: sharing happens only if you explicitly opt in
          through the consent controls in the builder or your{' '}
          <Link href="/settings">settings</Link>.
          You can withdraw that consent at any time from the same place, or
          via the <Link href="/manage-data">data management</Link> page.
        </p>
        <p className="mt-4">
          You can request an export or deletion of your data any time via support@cvyon.com.
        </p>
      </>
    ),
  },
  {
    n: "05",
    title: "Acceptable Use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="mt-2 list-disc space-y-1 pl-6">
          <li>Upload content you do not own or have no right to use;</li>
          <li>Submit false, misleading, or impersonating information;</li>
          <li>Attempt to disrupt, scrape at abusive rates, or gain unauthorized access to the Service;</li>
          <li>Use the Service for unlawful purposes or to send spam.</li>
        </ul>
      </>
    ),
  },
  {
    n: "06",
    title: "Accounts",
    body: (
      <p>
        Some features (saving resumes online, recruiter accounts) require an
        account. You are responsible for keeping your credentials
        confidential and for activity under your account. We may suspend
        accounts that violate these Terms.
      </p>
    ),
  },
  {
    n: "07",
    title: "Intellectual Property",
    body: (
      <p>
        The Cvyon name, design, templates&apos; layout code, and all site
        content other than Your Content remain our property or that of our
        licensors. You may not copy or redistribute the Service&apos;s
        underlying code or designs except as the Service itself allows
        (e.g. exporting your own resume).
      </p>
    ),
  },
  {
    n: "08",
    title: "No Employment Guarantee",
    body: (
      <p>
        Cvyon helps you present yourself well; it does not guarantee
        interviews, job offers, or any employment outcome. ATS scores and AI
        suggestions are guidance, not professional career advice.
      </p>
    ),
  },
  {
    n: "09",
    title: "Disclaimers & Limitation of Liability",
    body: (
      <p>
        The Service is provided &ldquo;as is&rdquo; without warranties of any kind.
        To the maximum extent permitted by law, Cvyon is not liable for any
        indirect, incidental, or consequential damages arising from your use
        of the Service. Our total liability is limited to the amount you
        paid us for the Service (the core builder is free, so: zero).
      </p>
    ),
  },
  {
    n: "10",
    title: "Changes to These Terms",
    body: (
      <p>
        We may update these Terms from time to time. Material changes will be
        announced on the site, and continued use of the Service after changes
        take effect constitutes acceptance.
      </p>
    ),
  },
  {
    n: "11",
    title: "Contact",
    body: (
      <p>
        Questions about these Terms? Reach us via the{' '}
        <Link href="/support">support page</Link>{' '}
        or at support@cvyon.com.
      </p>
    ),
  },
];

export default function TermsClient() {
  return (
    <V3Page
      pageName="terms"
      cta={{ label: "Build free →", href: "/build" }}
    >
      <div className="mx-auto max-w-[900px]">
        <V3Eyebrow>Legal</V3Eyebrow>
        <h1 className="max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy md:text-[52px]">
          Terms of Service
        </h1>
        <p className="mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
          The terms governing your use of Cvyon.
        </p>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
          Last updated: September 2026
        </p>

        <div className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          {SECTIONS.map((s) => (
            <section key={s.n} className="border-t border-line pt-[34px] first:border-t-0 first:pt-0 [&+section]:mt-[34px]">
              <V3Eyebrow>{s.n}</V3Eyebrow>
              <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                {s.title}
              </h2>
              <div className="legal-prose mt-3 max-w-[700px] text-[15px] leading-relaxed text-navy/85 [&_a]:font-bold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-coral">
                {s.body}
              </div>
            </section>
          ))}

          <p className="mt-8 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
            This is a plain-language summary of our terms prepared for launch.
            If Cvyon grows to handle significant revenue or sensitive data flows,
            these terms should be reviewed by qualified legal counsel.
          </p>

          <div className="mt-8 border-t border-line pt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.13em] text-brand hover:text-coral"
            >
              <ArrowLeft size={14} /> Back to Cvyon
            </Link>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
