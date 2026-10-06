"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";

export type PrivacyDict = {
  eyebrow: string; h1: string; sub: string;
  s1_eyebrow: string; s1_title: string; s1_body: string;
  s2_eyebrow: string; s2_title: string; s2_body: string;
  cta_delete: string; cta_export: string;
  s3_eyebrow: string; s3_title: string; s3_body: string;
  toggle_label: string; toggle_sub: string;
  s4_eyebrow: string; s4_title: string; s4_body: string;
  s5_eyebrow: string; s5_title: string; s5_body: string;
  back: string;
};

/** Render {b}...{/b} as <strong> */
function rich(text: string): React.ReactNode {
  const parts = text.split(/(\{b\}|\{\/b\})/);
  let bold = false;
  return parts.map((p, i) => {
    if (p === "{b}") { bold = true; return null; }
    if (p === "{/b}") { bold = false; return null; }
    return bold
      ? <strong key={i} className="text-navy">{p}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export default function PrivacyClient({ dict, locale }: { dict: PrivacyDict; locale: string }) {
  const [doNotSell, setDoNotSell] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "globalPrivacyControl" in navigator) {
      if ((navigator as any).globalPrivacyControl) {
        setDoNotSell(true);
      }
    }
  }, []);

  const toggleDoNotSell = () => {
    setDoNotSell((v) => !v);
  };

  const loc = locale === "en" ? "" : `/${locale}`;

  return (
    <V3Page
      pageName="privacy"
      logoSub="BUILD • GET HIRED"
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

        <div className="mt-[34px] rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-9">
          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>{dict.s1_eyebrow}</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              {dict.s1_title}
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              {rich(dict.s1_body)}
            </p>
          </section>

          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>{dict.s2_eyebrow}</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              {dict.s2_title}
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              {dict.s2_body}
            </p>
            <div className="mt-5 flex flex-wrap gap-[10px]">
              <a
                href="mailto:support@cvyon.com?subject=Data%20deletion%20request"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
              >
                {dict.cta_delete}
              </a>
              <a
                href="mailto:support@cvyon.com?subject=Data%20export%20request"
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-lavender px-[18px] py-3 text-[12px] font-extrabold text-brand transition-transform hover:-translate-y-px"
              >
                {dict.cta_export}
              </a>
            </div>
          </section>

          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>{dict.s3_eyebrow}</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              {dict.s3_title}
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              {dict.s3_body}
            </p>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-[12px] border border-line bg-cream p-[18px]">
              <div>
                <strong className="text-[15px] font-extrabold text-navy">
                  {dict.toggle_label}
                </strong>
                <div className="mt-1 text-[12px] text-muted">
                  {dict.toggle_sub}
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={doNotSell}
                onClick={toggleDoNotSell}
                className={`shrink-0 rounded-[10px] border px-[18px] py-3 text-[12px] font-extrabold transition-colors ${
                  doNotSell
                    ? "border-coral bg-coral text-white"
                    : "border-line bg-paper text-navy"
                }`}
              >
                {doNotSell ? "ON" : "OFF"}
              </button>
            </div>
          </section>

          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>{dict.s4_eyebrow}</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              {dict.s4_title}
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              {dict.s4_body}
            </p>
          </section>

          <section className="pt-[34px] first:pt-0">
            <V3Eyebrow>{dict.s5_eyebrow}</V3Eyebrow>
            <h2 className="text-[28px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              {dict.s5_title}
            </h2>
            <p className="mt-3 max-w-[650px] text-[14px] leading-relaxed text-muted">
              {dict.s5_body}
            </p>
          </section>

          <div className="mt-[34px] border-t border-line pt-[22px]">
            <Link href={loc || "/"}>
              <V3Pill>← {dict.back}</V3Pill>
            </Link>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
