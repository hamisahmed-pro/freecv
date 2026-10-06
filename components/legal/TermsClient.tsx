"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

export type TermsSection = { n: string; title: string; body: string };
export type TermsDict = {
  eyebrow: string; h1: string; sub: string; updated: string;
  sections: TermsSection[];
  disclaimer: string; back: string;
};

/** Render links: {settings_link}text{/}, {data_link}text{/}, {support_link}text{/} */
function rich(text: string, locale: string): React.ReactNode {
  const loc = locale === "en" ? "" : `/${locale}`;
  const linkMap: Record<string, string> = {
    settings_link: `${loc}/settings`,
    data_link: `${loc}/manage-data`,
    support_link: `${loc}/support`,
  };
  // Split on {xxx}...{/} patterns
  const parts = text.split(/(\{\w+_link\}|\{\/\})/);
  let currentLink: string | null = null;
  return parts.map((p, i) => {
    const m = p.match(/\{(\w+_link)\}/);
    if (m) { currentLink = linkMap[m[1]] || "#"; return null; }
    if (p === "{/}") { currentLink = null; return null; }
    if (currentLink) {
      const href = currentLink;
      currentLink = null; // single-use; next segment resets
      // Actually keep it for the text that follows in same segment
      return <Link key={i} href={href}>{p}</Link>;
    }
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default function TermsClient({ dict, locale }: { dict: TermsDict; locale: string }) {
  const loc = locale === "en" ? "" : `/${locale}`;
  return (
    <V3Page
      pageName="terms"
      cta={{ label: "Build free →", href: `${loc}/build` }}
    >
      <div className="mx-auto max-w-[900px]">
        <V3Eyebrow>{dict.eyebrow}</V3Eyebrow>
        <h1 className="max-w-[760px] text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy md:text-[52px]">
          {dict.h1}
        </h1>
        <p className="mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
          {dict.sub}
        </p>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
          {dict.updated}
        </p>

        <div className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          {dict.sections.map((s) => (
            <section key={s.n} className="border-t border-line pt-[34px] first:border-t-0 first:pt-0 [&+section]:mt-[34px]">
              <V3Eyebrow>{s.n}</V3Eyebrow>
              <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                {s.title}
              </h2>
              <div className="legal-prose mt-3 max-w-[700px] text-[15px] leading-relaxed text-navy/85 [&_a]:font-bold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-coral">
                {rich(s.body, locale)}
              </div>
            </section>
          ))}

          <p className="mt-8 border-t border-line pt-6 text-[13px] leading-relaxed text-muted">
            {dict.disclaimer}
          </p>

          <div className="mt-8 border-t border-line pt-6">
            <Link
              href={loc || "/"}
              className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.13em] text-brand hover:text-coral"
            >
              <ArrowLeft size={14} /> {dict.back}
            </Link>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
