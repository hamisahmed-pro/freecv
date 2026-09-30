import Link from 'next/link';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, ScanSearch, Sparkles, LayoutTemplate } from 'lucide-react';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';
import { display, head, body, mono } from '@/lib/fonts';
import type { JobTitleSeoEntry } from '@/lib/job-title-seo';

export default function JobTitleSeoPage({ entry, more }: { entry: JobTitleSeoEntry; more: JobTitleSeoEntry[] }) {
  // Pre-fills the job title in the builder via the existing ?source=seo onboarding effect.
  const cta = `/build?source=seo&jobTitle=${encodeURIComponent(entry.jobTitle)}`;

  return (
    <div
      className={`seo-job ${body.className} ${display.className} ${head.className} ${mono.className} min-h-screen text-[#151a46]`}
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
        .seo-job{font-family:var(--fb)} .seo-job .fd{font-family:var(--fd)} .seo-job .fh{font-family:var(--fh)} .seo-job .fm{font-family:var(--fm)}
        .seo-job .hs{box-shadow:7px 7px 0 var(--ink)} .seo-job .hs-v{box-shadow:7px 7px 0 var(--verm)} .seo-job .hs-c{box-shadow:6px 6px 0 var(--cob)} .seo-job .hs-g{box-shadow:7px 7px 0 var(--grn)}
        .seo-job .dots{background-image:radial-gradient(#151a4622 1.2px,transparent 1.2px);background-size:22px 22px}
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
          <span className="hover:text-[#ff604b]">Resume guides</span>
          <span>/</span>
          <span className="text-[#151a46]">{entry.jobTitle}</span>
        </nav>

        {/* HERO */}
        <section className="py-10">
          <div className="mb-5 inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#ffd85a] px-3 py-1.5 hs">
            <Sparkles size={14} />
            <span className="fm text-[11px] font-bold uppercase tracking-[0.2em]">Free resume guide</span>
          </div>
          <h1 className="fd max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Free {entry.jobTitle} <span className="text-[#ff604b]">resume template & example</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#151a46]/85">{entry.intro}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={cta}
              className="group inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#ff604b] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Build my {entry.jobTitle.toLowerCase()} resume <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
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
            No sign-up · Unlimited downloads · 180 templates
          </div>
        </section>

        {/* TIPS */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#ff604b]">01 — Playbook</p>
          <h2 className="fd text-3xl tracking-tight">{entry.jobTitle} resume tips that actually matter</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {entry.tips.map((tip, i) => (
              <div key={tip.title} className="border-[3px] border-[#151a46] bg-white p-6 hs">
                <p className="fm mb-3 inline-block border-[3px] border-[#151a46] bg-[#ffd85a] px-2 py-1 text-[11px] font-bold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="fh text-lg font-extrabold leading-snug">{tip.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#151a46]/85">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TEMPLATE STYLES */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#5548f5]">02 — Templates</p>
          <h2 className="fd text-3xl tracking-tight">Cvyon templates that suit {entry.jobTitle.toLowerCase()}s</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {entry.templateStyles.map((tpl) => (
              <Link
                key={tpl.slug}
                href={`/templates/${tpl.slug}`}
                className="group border-[3px] border-[#151a46] bg-white hs transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
              >
                <div className="flex items-center gap-2 border-b-[3px] border-[#151a46] bg-[#f6f5ef] px-5 py-3 dots">
                  <LayoutTemplate size={16} className="text-[#5548f5]" />
                  <h3 className="fd text-xl tracking-tight group-hover:text-[#ff604b]">{tpl.name}</h3>
                </div>
                <div className="p-5">
                  <p className="text-[15px] leading-relaxed text-[#151a46]/85">{tpl.why}</p>
                  <p className="fm mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                    <Check size={14} className="text-[#0E8A4B]" strokeWidth={3.5} /> Use this template
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ATS NOTES */}
        <section className="border-t-[3px] border-[#151a46] py-12">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0E8A4B]">03 — ATS</p>
          <h2 className="fd text-3xl tracking-tight">Will it pass applicant tracking systems?</h2>
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
          <h2 className="fd text-3xl tracking-tight">{entry.jobTitle} resume questions</h2>
          <div className="mt-7 space-y-4">
            {entry.faqs.map((faq) => (
              <div key={faq.q} className="border-[3px] border-[#151a46] bg-white p-6 hs">
                <h3 className="fh text-base font-extrabold leading-snug">{faq.q}</h3>
                <p className="mt-3 leading-relaxed text-[#151a46]/85">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MORE GUIDES */}
        {more.length > 0 && (
          <section className="border-t-[3px] border-[#151a46] py-12">
            <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#5548f5]">05 — Explore</p>
            <h2 className="fd text-3xl tracking-tight">More free resume guides</h2>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/resume-for/${m.slug}`}
                  className="group border-[3px] border-[#151a46] bg-white hs transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none"
                >
                  <div className="h-3 border-b-[3px] border-[#151a46] bg-[#ffd85a] transition-colors group-hover:bg-[#ff604b]" />
                  <div className="p-5">
                    <h3 className="fd text-xl tracking-tight group-hover:text-[#ff604b]">{m.jobTitle}</h3>
                    <p className="fm mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
                      View guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="pb-16 pt-4">
          <div className="border-[3px] border-[#151a46] bg-[#151a46] p-8 text-center text-[#f6f5ef] hs-v sm:p-12">
            <h2 className="fd text-3xl tracking-tight sm:text-4xl">
              Ready to build your <span className="text-[#ff604b]">{entry.jobTitle.toLowerCase()}</span> resume?
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#f6f5ef]/80">
              Pick a template, fill in your details, download the PDF. Free, no sign-up, unlimited downloads.
            </p>
            <Link
              href={cta}
              className="group mt-8 inline-flex items-center gap-2 border-[3px] border-[#f6f5ef] bg-[#ff604b] px-8 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              Start building free <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
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
