'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeCheck, FileText, ScanSearch, Search, Sparkles } from 'lucide-react';
import { templates as htmlTemplates } from '@/components/html_templates';
import { initialData } from '@/store/useResumeStore';
import type { ResumeData } from '@/store/useResumeStore';
import { templateSeoEntries, type TemplateSeoEntry } from '@/lib/template-seo';
import { display, head, body, mono } from '@/lib/fonts';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';

type HtmlTemplate = React.ComponentType<{ data: ResumeData; themeColor?: string }>;

// Sample person shown in the live thumbnails — same sample used on the
// per-template SEO pages, so the gallery matches what users see there.
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

// ---------------------------------------------------------------------------
// Categories — derived deterministically from each entry's own copy
// (name + tagline + bestFor + designTraits). Word-boundary matching so
// "data" never matches "candidates".
// ---------------------------------------------------------------------------
const CATEGORIES: { label: string; keywords: string[] }[] = [
  {
    label: 'Creative & Design',
    keywords: ['designer', 'art director', 'photographer', 'creative', 'portfolio', 'fashion', 'media', 'illustrator', 'musician', 'actor', 'stylist', 'artist'],
  },
  {
    label: 'Business & Corporate',
    keywords: ['executive', 'manager', 'director', 'leader', 'corporate', 'finance', 'bank', 'consultant', 'business', 'sales', 'marketing', 'operations', 'project', 'accountant', 'administrator', 'human resources', 'strategy', 'entrepreneur', 'founder', 'ats', 'traditional', 'conservative', 'government', 'career'],
  },
  {
    label: 'Technology',
    keywords: ['engineer', 'developer', 'software', 'tech', 'data', 'programmer'],
  },
  {
    label: 'Academic & Research',
    keywords: ['academic', 'research', 'professor', 'lecturer', 'scientist', 'scholar', 'phd', 'teacher', 'tutor', 'educator', 'student'],
  },
  {
    label: 'Healthcare',
    keywords: ['nurse', 'medical', 'clinic', 'health', 'healthcare', 'doctor', 'therapist', 'pharmacist', 'dental'],
  },
  {
    label: 'Legal',
    keywords: ['legal', 'lawyer', 'attorney', 'paralegal'],
  },
  {
    label: 'Simple & Minimal',
    keywords: ['minimal', 'minimalist', 'clean', 'simple'],
  },
];

function entryCategories(entry: TemplateSeoEntry): string[] {
  const haystack = [
    entry.name,
    entry.tagline,
    entry.bestFor.join(' '),
    entry.designTraits.join(' '),
  ]
    .join(' ')
    .toLowerCase();
  // Word-boundary matching (plus a plain plural) so "data" never matches
  // "candidates" but "designer" still matches "designers".
  const matches = (kw: string) =>
    new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}(s)?\\b`).test(haystack);
  return CATEGORIES.filter((cat) => cat.keywords.some(matches)).map((cat) => cat.label);
}

// ---------------------------------------------------------------------------
// Live thumbnail — renders the real template component with sample data,
// scaled to the card. Offscreen cards skip rendering via contentVisibility.
// ---------------------------------------------------------------------------
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
      <div className="aspect-[8.5/11] w-full bg-white flex items-center justify-center border-b-[3px] border-[#141312]">
        <p className="fm text-xs font-bold uppercase tracking-[0.2em] text-[#141312]/60 px-4 text-center">
          Preview coming soon
        </p>
      </div>
    );
  }

  const data: ResumeData = { ...sampleData, templateId: entry.id as ResumeData['templateId'] };
  const themeColor = data.theme?.color || '#2563eb';

  return (
    <div
      ref={containerRef}
      className="aspect-[8.5/11] bg-white w-full relative overflow-hidden pointer-events-none border-b-[3px] border-[#141312]"
    >
      <div
        className="absolute top-0 left-0 w-[816px] h-[1056px] origin-top-left bg-white"
        style={{ transform: `scale(${scale})`, '--theme-color': themeColor } as React.CSSProperties}
      >
        <Tmpl data={data} themeColor={themeColor} />
      </div>
    </div>
  );
}

const PAGE_SIZE = 24;

const FAQS = [
  {
    q: 'Are these resume templates really free?',
    a: 'Yes. Every one of the 180 designs is free to use — no sign-up, no watermark, unlimited PDF and DOCX downloads. Click any template and the builder opens with that design already selected.',
  },
  {
    q: 'Will these templates pass applicant tracking systems?',
    a: 'They are built for it: standard section labels, clean single-column parsing order, and real selectable text throughout. Stylized designs like Noir are the exception — they are screen-first and best for direct applications to a hiring manager, which we say plainly on each template page.',
  },
  {
    q: 'How do I use a template?',
    a: 'Click any design in the gallery. The builder opens with that template active — fill in your details, rearrange sections if you like, then download your resume as PDF or DOCX.',
  },
  {
    q: 'Can I switch templates after I start building?',
    a: 'Yes. The builder has a template gallery with all 180 designs, and you can switch at any time — your content carries over to the new design automatically.',
  },
];

export default function TemplateGallery() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Category membership is computed once — deterministic, from the data file.
  const entriesWithCats = useMemo(
    () => templateSeoEntries.map((entry) => ({ entry, cats: entryCategories(entry) })),
    [],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: templateSeoEntries.length };
    for (const cat of CATEGORIES) {
      map[cat.label] = entriesWithCats.filter((e) => e.cats.includes(cat.label)).length;
    }
    return map;
  }, [entriesWithCats]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entriesWithCats.filter(({ entry, cats }) => {
      if (category !== 'All' && !cats.includes(category)) return false;
      if (!q) return true;
      const haystack = [entry.name, entry.tagline, entry.bestFor.join(' '), entry.designTraits.join(' ')]
        .join(' ')
        .toLowerCase();
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [entriesWithCats, query, category]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category]);

  const visible = filtered.slice(0, visibleCount);

  const popularIds = ['Tutor', 'Executive', 'Noir', 'Advocate'];
  const popular = popularIds
    .map((id) => templateSeoEntries.find((e) => e.id === id))
    .filter((e): e is TemplateSeoEntry => Boolean(e));

  return (
    <div
      className={`tpl-gallery ${body.className} ${display.className} ${head.className} ${mono.className} min-h-screen text-[#141312]`}
      style={{
        background: '#E8E7E1',
        '--ink': '#141312',
        '--verm': '#FF4326',
        '--cob': '#2233FF',
        '--hi': '#FFE14D',
        '--grn': '#0E8A4B',
        '--fd': display.style.fontFamily,
        '--fh': head.style.fontFamily,
        '--fb': body.style.fontFamily,
        '--fm': mono.style.fontFamily,
      } as React.CSSProperties}
    >
      <FaqJsonLd faqs={FAQS} />
      <style>{`
        .tpl-gallery{font-family:var(--fb)} .tpl-gallery .fd{font-family:var(--fd)} .tpl-gallery .fh{font-family:var(--fh)} .tpl-gallery .fm{font-family:var(--fm)}
        .tpl-gallery .hs{box-shadow:7px 7px 0 var(--ink)} .tpl-gallery .hs-v{box-shadow:7px 7px 0 var(--verm)} .tpl-gallery .hs-c{box-shadow:6px 6px 0 var(--cob)} .tpl-gallery .hs-g{box-shadow:7px 7px 0 var(--grn)}
        .tpl-gallery .dots{background-image:radial-gradient(#14131222 1.2px,transparent 1.2px);background-size:22px 22px}
        .tpl-gallery .card-cv{content-visibility:auto;contain-intrinsic-size:300px 480px}
        .tpl-gallery .clamp2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      `}</style>

      {/* TOP BAR */}
      <header className="border-b-[3px] border-[#141312] bg-[#E8E7E1] sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="fd text-xl tracking-tight">
            CVYON<span className="text-[#FF4326]">.</span>
          </Link>
          <Link
            href="/build"
            className="fm border-[3px] border-[#141312] bg-[#141312] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8E7E1] transition-colors hover:bg-[#FF4326] hover:border-[#FF4326]"
          >
            Start building free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5">
        {/* BREADCRUMB */}
        <nav className="fm flex items-center gap-2 pt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/60">
          <Link href="/" className="hover:text-[#FF4326]">Home</Link>
          <span>/</span>
          <span className="text-[#141312]">Templates</span>
        </nav>

        {/* HERO */}
        <section className="py-10 lg:py-14">
          <div className="mb-5 inline-flex items-center gap-2 border-[3px] border-[#141312] bg-[#FFE14D] px-3 py-1.5 hs">
            <Sparkles size={14} />
            <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">180 free templates</span>
          </div>
          <h1 className="fd max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Free resume templates <span className="text-[#FF4326]">that get interviews</span>
          </h1>
          <p className="fh mt-4 max-w-2xl text-lg font-bold">
            Pick a design, click it, and start building — the builder opens with that template already selected.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[#141312]/85">
            Every template below is free: no sign-up, no watermark, unlimited downloads. They are built to be
            read by humans and applicant tracking systems alike — standard section labels, clean parsing order,
            and real selectable text. No lorem ipsum, no fake promises: each design has its own page explaining
            exactly who it suits and how ATS-safe it is.
          </p>
          <div className="fm mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/60">
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-[#0E8A4B]" /> No sign-up</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-[#0E8A4B]" /> No watermark</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-[#0E8A4B]" /> Unlimited downloads</span>
            <span className="inline-flex items-center gap-2"><BadgeCheck size={15} className="text-[#0E8A4B]" /> ATS-friendly</span>
          </div>
        </section>

        {/* SEARCH + FILTERS */}
        <section className="border-[3px] border-[#141312] bg-white p-4 hs sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#141312]/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search templates — try “nurse”, “minimal”, “executive”…"
                className="fh w-full border-[3px] border-[#141312] bg-[#E8E7E1] py-3 pl-11 pr-4 text-sm font-bold placeholder:font-medium placeholder:text-[#141312]/45 focus:outline-none focus:bg-white"
                aria-label="Search templates"
              />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['All', ...CATEGORIES.map((c) => c.label)].map((label) => {
              const active = category === label;
              return (
                <button
                  key={label}
                  onClick={() => setCategory(label)}
                  className={`fm border-[3px] border-[#141312] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                    active
                      ? 'bg-[#141312] text-[#E8E7E1]'
                      : 'bg-[#E8E7E1] text-[#141312] hover:bg-[#FFE14D]'
                  }`}
                >
                  {label} <span className={active ? 'text-[#FFE14D]' : 'text-[#141312]/50'}>({counts[label] ?? 0})</span>
                </button>
              );
            })}
          </div>
          <p className="fm mt-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/50">
            Showing {visible.length} of {filtered.length} templates
            {filtered.length !== templateSeoEntries.length && ` (filtered from ${templateSeoEntries.length})`}
          </p>
        </section>

        {/* GRID */}
        <section className="py-10" aria-label="Template gallery">
          {visible.length === 0 ? (
            <div className="border-[3px] border-[#141312] bg-white p-10 text-center hs">
              <FileText size={32} className="mx-auto text-[#141312]/40" />
              <p className="fh mt-4 text-lg font-bold">No templates match “{query}”</p>
              <button
                onClick={() => { setQuery(''); setCategory('All'); }}
                className="fm mt-4 border-[3px] border-[#141312] bg-[#FFE14D] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
              {visible.map(({ entry }) => (
                <article
                  key={entry.id}
                  className="card-cv group flex flex-col border-[3px] border-[#141312] bg-white transition-all hover:-translate-y-1 hs hover:hs-v"
                >
                  <Link
                    href={`/build?source=seo&template=${entry.id}`}
                    aria-label={`Use the ${entry.name} resume template`}
                    className="block"
                  >
                    <TemplateThumbnail entry={entry} />
                    <div className="p-4">
                      <h2 className="fh text-base font-extrabold leading-tight">{entry.name}</h2>
                      <p className="clamp2 mt-1.5 text-[13px] leading-snug text-[#141312]/70">{entry.tagline}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t-[3px] border-[#141312] bg-[#E8E7E1] px-4 py-3 transition-colors group-hover:bg-[#2233FF] group-hover:text-white">
                      <span className="fm text-[11px] font-bold uppercase tracking-[0.18em]">Use this template</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                  <div className="border-t-[3px] border-[#141312] bg-white px-4 py-2">
                    <Link
                      href={`/templates/${entry.slug}`}
                      className="fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#141312]/50 hover:text-[#FF4326]"
                    >
                      About this template →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="fh border-[3px] border-[#141312] bg-[#FF4326] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
              >
                Show more templates ({filtered.length - visibleCount} left)
              </button>
            </div>
          )}
        </section>

        {/* POPULAR */}
        <section className="border-t-[3px] border-[#141312] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#2233FF]">Popular right now</p>
          <h2 className="fd text-3xl tracking-tight">Templates job seekers love</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.map((entry) => (
              <Link
                key={entry.id}
                href={`/templates/${entry.slug}`}
                className="group border-[3px] border-[#141312] bg-white p-5 hs transition-all hover:-translate-y-1"
              >
                <p className="fh text-base font-extrabold group-hover:text-[#FF4326]">{entry.name}</p>
                <p className="clamp2 mt-2 text-[13px] leading-snug text-[#141312]/70">{entry.tagline}</p>
                <p className="fm mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2233FF]">
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t-[3px] border-[#141312] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF4326]">Questions</p>
          <h2 className="fd text-3xl tracking-tight">Template FAQs</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-[3px] border-[#141312] bg-white p-5 hs">
                <p className="fh text-[15px] font-extrabold">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-[#141312]/80">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="pb-16">
          <div className="dots border-[3px] border-[#141312] bg-[#141312] p-8 text-center hs-v sm:p-12">
            <h2 className="fd text-3xl tracking-tight text-[#E8E7E1] sm:text-4xl">
              Found your design? <span className="text-[#FFE14D]">Build it free.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#E8E7E1]/75">
              No sign-up, no watermark. Your resume downloads as PDF or DOCX in minutes.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/build"
                className="group inline-flex items-center gap-2 border-[3px] border-[#E8E7E1] bg-[#FF4326] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                Start building <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/ats-grader"
                className="inline-flex items-center gap-2 border-[3px] border-[#E8E7E1] bg-transparent px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#E8E7E1] transition-colors hover:bg-[#E8E7E1] hover:text-[#141312]"
              >
                <ScanSearch size={17} /> Check your ATS score
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
