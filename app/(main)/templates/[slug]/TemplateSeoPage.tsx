'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, FileText, ScanSearch, Sparkles } from 'lucide-react';
import { templates as htmlTemplates } from '@/components/html_templates';
import { initialData } from '@/store/useResumeStore';
import type { ResumeData } from '@/store/useResumeStore';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';
import type { TemplateSeoEntry } from '@/lib/template-seo';
import { V3Page, V3Pill } from '@/components/v3/V3Chrome';

type HtmlTemplate = React.ComponentType<{ data: ResumeData; themeColor?: string }>;

// Sample person shown in the live thumbnail. Base is the store's initialData;
// only personalInfo is filled so the preview reads like a real resume.
const sampleData = {
  ...initialData,
  personalInfo: {
    ...initialData.personalInfo,
    fullName: 'Jordan Mensah',
    jobTitle: 'Product Designer',
    email: 'jordan.mensah@example.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    website: 'jordanmensah.design',
  },
};

function TemplateThumbnail({ entry }: { entry: TemplateSeoEntry }) {
  const Tmpl = (htmlTemplates as Record<string, HtmlTemplate | undefined>)[entry.id];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      setScale(entries[0].contentRect.width / 816);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!Tmpl) {
    return (
      <div className="flex aspect-[8.5/11] w-full items-center justify-center rounded-b-2xl bg-cream">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-navy/50">Preview coming soon</p>
      </div>
    );
  }

  const data: ResumeData = { ...sampleData, templateId: entry.id as ResumeData['templateId'] };
  const themeColor = data.theme?.color || '#2563eb';

  return (
    <div ref={containerRef} className="relative aspect-[8.5/11] w-full overflow-hidden bg-paper pointer-events-none">
      <div
        className="absolute top-0 left-0 w-[816px] h-[1056px] origin-top-left bg-paper"
        style={{ transform: `scale(${scale})`, '--theme-color': themeColor } as React.CSSProperties}
      >
        <Tmpl data={data} themeColor={themeColor} />
      </div>
    </div>
  );
}

const SECTION_EYEBROW = "mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-brand";

export default function TemplateSeoPage({ entry, more }: { entry: TemplateSeoEntry; more: TemplateSeoEntry[] }) {
  const cta = `/build?source=seo&template=${entry.id}`;

  return (
    <V3Page pageName={`template_${entry.id}`}>
      <FaqJsonLd faqs={entry.faqs} />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        <span className="text-navy">{entry.name} template</span>
      </nav>

      {/* HERO */}
      <section className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-14">
        <div>
          <V3Pill><Sparkles size={13} /> Free template</V3Pill>
          <h1 className="mt-[18px] text-4xl font-black leading-[1.05] tracking-tight text-navy sm:text-5xl">
            {entry.h1 ?? (
              <>
                {entry.name} <span className="text-coral">resume template</span>
              </>
            )}
          </h1>
          <p className="mt-4 text-lg font-bold text-navy">{entry.tagline}</p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{entry.description}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={cta}
              className="group inline-flex items-center gap-2 rounded-[10px] bg-coral px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(255,96,75,0.35)] transition-transform hover:-translate-y-px"
            >
              Use this template <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/ats-grader"
              className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-paper px-7 py-4 text-sm font-extrabold uppercase tracking-wider text-navy transition-all hover:border-brand hover:text-brand"
            >
              <ScanSearch size={17} /> Check your ATS score
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            <BadgeCheck size={15} className="text-teal" />
            No sign-up · Unlimited downloads
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_16px_38px_rgba(23,27,75,0.12)]">
            <div className="bg-navy px-5 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                Live preview — {entry.name}
              </p>
            </div>
            <Link href={cta} className="group block cursor-pointer" aria-label={`Use the ${entry.name} template`}>
              <TemplateThumbnail entry={entry} />
            </Link>
          </div>
          <p className="mt-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
            Shown with sample content — yours will look this sharp
          </p>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="border-t border-line py-12">
        <p className={SECTION_EYEBROW}>01 — Fit</p>
        <h2 className="text-3xl font-black tracking-tight text-navy">Who the {entry.name} template is for</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entry.bestFor.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal">
                <Check size={14} className="text-white" strokeWidth={3.5} />
              </span>
              <p className="text-sm font-bold leading-snug text-navy">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESIGN TRAITS */}
      <section className="border-t border-line py-12">
        <p className={SECTION_EYEBROW}>02 — Design</p>
        <h2 className="text-3xl font-black tracking-tight text-navy">What makes {entry.name} look the way it does</h2>
        <ul className="mt-7 grid gap-4 md:grid-cols-2">
          {entry.designTraits.map((trait) => (
            <li key={trait} className="flex items-start gap-3 rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <FileText size={20} className="mt-0.5 shrink-0 text-brand" />
              <p className="text-[15px] font-medium leading-relaxed text-navy">{trait}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* ATS NOTES */}
      <section className="border-t border-line py-12">
        <p className={SECTION_EYEBROW}>03 — ATS</p>
        <h2 className="text-3xl font-black tracking-tight text-navy">Will {entry.name} pass applicant tracking systems?</h2>
        <div className="mt-7 rounded-2xl border border-teal/40 bg-mint/60 p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-teal">
              <ScanSearch size={22} className="text-white" />
            </span>
            <p className="text-[16px] leading-relaxed text-navy">{entry.atsNotes}</p>
          </div>
          <p className="mt-5 border-t border-dashed border-navy/20 pt-5 text-[15px] leading-relaxed text-muted">
            Every Cvyon template exports through your browser&apos;s print-to-PDF, so the text layer stays selectable
            and searchable — the thing parsers actually read. After downloading, run your resume through our{' '}
            <Link href="/ats-grader" className="font-bold text-brand underline underline-offset-2">
              free ATS grader
            </Link>{' '}
            to confirm it scores well before you apply.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-12">
        <p className={SECTION_EYEBROW}>04 — FAQ</p>
        <h2 className="text-3xl font-black tracking-tight text-navy">Questions about the {entry.name} template</h2>
        <div className="mt-7 space-y-4">
          {entry.faqs.map((faq) => (
            <div key={faq.q} className="rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <h3 className="text-base font-extrabold leading-snug text-navy">{faq.q}</h3>
              <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MORE TEMPLATES */}
      <section className="border-t border-line py-12">
        <p className={SECTION_EYEBROW}>05 — Explore</p>
        <h2 className="text-3xl font-black tracking-tight text-navy">More free resume templates</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {more.map((m) => (
            <Link
              key={m.slug}
              href={`/templates/${m.slug}`}
              className="group overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-1"
            >
              <div className="h-2.5 bg-gold transition-colors group-hover:bg-coral" />
              <div className="p-5">
                <h3 className="text-xl font-black tracking-tight text-navy group-hover:text-coral">{m.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.tagline}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-navy">
                  View template <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="pb-6 pt-4">
        <div className="rounded-2xl bg-navy p-8 text-center text-white shadow-[0_16px_38px_rgba(23,27,75,0.22)] sm:p-12">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Ready to build your <span className="text-coral">{entry.name}</span> resume?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/75">
            The template is pre-selected — just fill in your details and download. Free, no sign-up, unlimited downloads.
          </p>
          <Link
            href={cta}
            className="group mt-8 inline-flex items-center gap-2 rounded-[10px] bg-coral px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white shadow-[0_10px_24px_rgba(255,96,75,0.35)] transition-transform hover:-translate-y-px"
          >
            Start with {entry.name} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </V3Page>
  );
}
