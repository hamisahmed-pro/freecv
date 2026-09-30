'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, FileText, ScanSearch, Sparkles } from 'lucide-react';
import { templates as htmlTemplates } from '@/components/html_templates';
import { initialData } from '@/store/useResumeStore';
import type { ResumeData } from '@/store/useResumeStore';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';
import { display, head, body, mono } from '@/lib/fonts';
import type { TemplateSeoEntry } from '@/lib/template-seo';

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
      <div className="aspect-[8.5/11] w-full bg-white flex items-center justify-center border-[3px] border-[#151a46]">
        <p className="fm text-xs font-bold uppercase tracking-[0.2em] text-[#151a46]/60">Preview coming soon</p>
      </div>
    );
  }

  const data: ResumeData = { ...sampleData, templateId: entry.id as ResumeData['templateId'] };
  const themeColor = data.theme?.color || '#2563eb';

  return (
    <div ref={containerRef} className="aspect-[8.5/11] bg-white w-full relative overflow-hidden pointer-events-none">
      <div
        className="absolute top-0 left-0 w-[816px] h-[1056px] origin-top-left bg-white"
        style={{ transform: `scale(${scale})`, '--theme-color': themeColor } as React.CSSProperties}
      >
        <Tmpl data={data} themeColor={themeColor} />
      </div>
    </div>
  );
}

export default function TemplateSeoPage({ entry, more }: { entry: TemplateSeoEntry; more: TemplateSeoEntry[] }) {
  const cta = `/build?source=seo&template=${entry.id}`;

  return (
    <div
      className={`seo-tpl ${body.className} ${display.className} ${head.className} ${mono.className} min-h-screen text-[#151a46]`}
      style={{
        background: '#f6f5ef',
        '--ink': '#151a46',
        '--verm': '#ff604b',
        '--cob': '#5548f5',
        '--hi': '#ffd85a',
        '--grn': '#0E8A4B',
        '--fd': display.style.fontFamily,
        '--fh': head.style.fontFamily,
        '--fb': body.style.fontFamily,
        '--fm': mono.style.fontFamily,
      } as React.CSSProperties}
    >
      <FaqJsonLd faqs={entry.faqs} />
      <style>{`
        .seo-tpl{font-family:var(--fb)} .seo-tpl .fd{font-family:var(--fd)} .seo-tpl .fh{font-family:var(--fh)} .seo-tpl .fm{font-family:var(--fm)}
        .seo-tpl .hs{box-shadow:7px 7px 0 var(--ink)} .seo-tpl .hs-v{box-shadow:7px 7px 0 var(--verm)} .seo-tpl .hs-c{box-shadow:6px 6px 0 var(--cob)} .seo-tpl .hs-g{box-shadow:7px 7px 0 var(--grn)}
        .seo-tpl .dots{background-image:radial-gradient(#151a4622 1.2px,transparent 1.2px);background-size:22px 22px}
      `}</style>

      {/* TOP BAR */}
      <header className="border-b-[3px] border-[#151a46] bg-[#f6f5ef]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="fd text-xl tracking-tight">
            CVYON<span className="text-[#ff604b]">.</span>
          </Link>
          <Link
            href={cta}
            className="fm border-[3px] border-[#151a46] bg-[#151a46] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6f5ef] transition-colors hover:bg-[#ff604b] hover:border-[#ff604b]"
          >
            Start building free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {/* BREADCRUMB */}
        <nav className="fm flex items-center gap-2 pt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
          <Link href="/" className="hover:text-[#ff604b]">Home</Link>
          <span>/</span>
          <span className="text-[#151a46]">{entry.name} template</span>
        </nav>

        {/* HERO */}
        <section className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#ffd85a] px-3 py-1.5 hs">
              <Sparkles size={14} />
              <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">Free template</span>
            </div>
            <h1 className="fd text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              {entry.name} <span className="text-[#ff604b]">resume template</span>
            </h1>
            <p className="fh mt-4 text-lg font-bold">{entry.tagline}</p>
            <p className="mt-4 max-w-xl leading-relaxed text-[#151a46]/85">{entry.description}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={cta}
                className="group inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#ff604b] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Use this template <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/ats-grader"
                className="inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                <ScanSearch size={17} /> Check your ATS score
              </Link>
            </div>

            <div className="fm mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">
              <BadgeCheck size={15} className="text-[#0E8A4B]" />
              No sign-up · Unlimited downloads
            </div>
          </div>

          <div>
            <div className="border-[3px] border-[#151a46] bg-white hs-c">
              <div className="border-b-[3px] border-[#151a46] bg-[#151a46] px-4 py-2.5">
                <p className="fm text-[11px] font-bold uppercase tracking-[0.22em] text-[#f6f5ef]">
                  Live preview — {entry.name}
                </p>
              </div>
              <Link href={cta} className="group block cursor-pointer" aria-label={`Use the ${entry.name} template`}>
                <TemplateThumbnail entry={entry} />
              </Link>
            </div>
            <p className="fm mt-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46]/50">
              Shown with sample content — yours will look this sharp
            </p>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#ff604b]">01 — Fit</p>
          <h2 className="fd text-3xl tracking-tight">Who the {entry.name} template is for</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entry.bestFor.map((item) => (
              <div key={item} className="flex items-start gap-3 border-[3px] border-[#151a46] bg-white p-4 hs">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border-[3px] border-[#151a46] bg-[#0E8A4B]">
                  <Check size={14} className="text-white" strokeWidth={3.5} />
                </span>
                <p className="fh text-sm font-bold leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DESIGN TRAITS */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#5548f5]">02 — Design</p>
          <h2 className="fd text-3xl tracking-tight">What makes {entry.name} look the way it does</h2>
          <ul className="mt-7 grid gap-4 md:grid-cols-2">
            {entry.designTraits.map((trait) => (
              <li key={trait} className="flex items-start gap-3 border-[3px] border-[#151a46] bg-[#f6f5ef] p-5 dots">
                <FileText size={20} className="mt-0.5 shrink-0 text-[#5548f5]" />
                <p className="text-[15px] font-medium leading-relaxed">{trait}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ATS NOTES */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E8A4B]">03 — ATS</p>
          <h2 className="fd text-3xl tracking-tight">Will {entry.name} pass applicant tracking systems?</h2>
          <div className="mt-7 border-[3px] border-[#151a46] bg-white p-6 sm:p-8 hs-g">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-[#151a46] bg-[#0E8A4B]">
                <ScanSearch size={22} className="text-white" />
              </span>
              <p className="text-[16px] leading-relaxed">{entry.atsNotes}</p>
            </div>
            <p className="mt-5 border-t-[3px] border-dashed border-[#151a46]/25 pt-5 text-[15px] leading-relaxed text-[#151a46]/80">
              Every Cvyon template exports through your browser&apos;s print-to-PDF, so the text layer stays selectable
              and searchable — the thing parsers actually read. After downloading, run your resume through our{' '}
              <Link href="/ats-grader" className="font-bold text-[#5548f5] underline underline-offset-2">
                free ATS grader
              </Link>{' '}
              to confirm it scores well before you apply.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#ff604b]">04 — FAQ</p>
          <h2 className="fd text-3xl tracking-tight">Questions about the {entry.name} template</h2>
          <div className="mt-7 space-y-4">
            {entry.faqs.map((faq) => (
              <div key={faq.q} className="border-[3px] border-[#151a46] bg-white p-6 hs">
                <h3 className="fh text-base font-extrabold leading-snug">{faq.q}</h3>
                <p className="mt-3 leading-relaxed text-[#151a46]/85">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MORE TEMPLATES */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#5548f5]">05 — Explore</p>
          <h2 className="fd text-3xl tracking-tight">More free resume templates</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {more.map((m) => (
              <Link
                key={m.slug}
                href={`/templates/${m.slug}`}
                className="group border-[3px] border-[#151a46] bg-white hs transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <div className="h-3 border-b-[3px] border-[#151a46] bg-[#ffd85a] transition-colors group-hover:bg-[#ff604b]" />
                <div className="p-5">
                  <h3 className="fd text-xl tracking-tight group-hover:text-[#ff604b]">{m.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#151a46]/75">{m.tagline}</p>
                  <p className="fm mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                    View template <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="pb-16 pt-4">
          <div className="border-[3px] border-[#151a46] bg-[#151a46] p-8 text-center text-[#f6f5ef] hs-v sm:p-12">
            <h2 className="fd text-3xl tracking-tight sm:text-4xl">
              Ready to build your <span className="text-[#ff604b]">{entry.name}</span> resume?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#f6f5ef]/80">
              The template is pre-selected — just fill in your details and download. Free, no sign-up, unlimited downloads.
            </p>
            <Link
              href={cta}
              className="group mt-8 inline-flex items-center gap-2 border-[3px] border-[#f6f5ef] bg-[#ff604b] px-8 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Start with {entry.name} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t-[3px] border-[#151a46] bg-[#151a46] text-[#f6f5ef]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <p className="fd text-lg">
            CVYON<span className="text-[#ff604b]">.</span>
          </p>
          <nav className="fm flex flex-wrap items-center justify-center gap-5 text-[11px] font-bold uppercase tracking-[0.18em]">
            <Link href="/" className="hover:text-[#ff604b]">Home</Link>
            <Link href="/build" className="hover:text-[#ff604b]">Builder</Link>
            <Link href="/ats-grader" className="hover:text-[#ff604b]">ATS grader</Link>
            <Link href="/about" className="hover:text-[#ff604b]">About</Link>
          </nav>
          <Link href="/" className="fm inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6f5ef]/60 hover:text-[#f6f5ef]">
            <ArrowLeft size={14} /> Cvyon home
          </Link>
        </div>
      </footer>
    </div>
  );
}
