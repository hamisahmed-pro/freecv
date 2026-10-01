import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, ScanSearch, Sparkles, X } from 'lucide-react';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';
import { V3Pill } from '@/components/v3/V3Chrome';
import type { CompareSeoEntry } from '@/lib/compare-seo';

/* Rendered inside V3Page (see app/alternatives/[slug]/page.tsx) —
 * this component carries only the article body. */

export default function CompareSeoPage({ entry, more }: { entry: CompareSeoEntry; more: CompareSeoEntry[] }) {
  const cta = '/build?source=seo-alternative';

  return (
    <div className="min-h-screen text-navy">
      <FaqJsonLd faqs={entry.faqs} />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 pt-2 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
        <Link href="/" className="hover:text-coral">Home</Link>
        <span>/</span>
        <span>Alternatives</span>
        <span>/</span>
        <span className="text-navy">{entry.competitor}</span>
      </nav>

      {/* HERO */}
      <section className="py-10">
        <div className="mb-5">
          <V3Pill><Sparkles size={12} /> Free alternative</V3Pill>
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-navy sm:text-5xl">
          {entry.pageTitle}: <span className="text-coral">build it free, download it free</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{entry.intro}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={cta}
            className="group inline-flex items-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Build my resume free <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/ats-grader"
            className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-paper px-[18px] py-3 text-[12px] font-extrabold text-navy transition-transform hover:-translate-y-px"
          >
            <ScanSearch size={16} className="text-brand" /> Check your ATS score
          </Link>
        </div>

        <div className="mt-6 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
          <BadgeCheck size={15} className="text-teal" />
          No sign-up · No paywall · Unlimited downloads
        </div>
      </section>

      {/* VERDICT */}
      <section className="border-t border-line py-10">
        <div className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <p className="mb-3 text-[11px] font-black uppercase tracking-[0.13em] text-teal">The short version</p>
          <p className="text-lg font-bold leading-relaxed text-navy">{entry.verdict}</p>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-coral">01 — Head to head</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Cvyon vs {entry.competitor}</h2>
        <div className="mt-7 overflow-x-auto rounded-[18px] border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="p-4 text-[11px] font-black uppercase tracking-[0.13em] text-muted">Feature</th>
                <th className="border-l border-line bg-navy p-4 text-[11px] font-black uppercase tracking-[0.13em] text-white">
                  Cvyon
                </th>
                <th className="border-l border-line bg-cream p-4 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
                  {entry.competitor}
                </th>
              </tr>
            </thead>
            <tbody>
              {entry.rows.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <td className="p-4 text-sm font-bold text-navy">{row.label}</td>
                  <td className="border-l border-line p-4">
                    <span className="flex items-start gap-2 text-[15px] font-medium leading-snug text-navy">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal">
                        <Check size={12} className="text-white" strokeWidth={4} />
                      </span>
                      {row.cvyon}
                    </span>
                  </td>
                  <td className="border-l border-line p-4">
                    <span className="flex items-start gap-2 text-[15px] leading-snug text-muted">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy/10">
                        <X size={12} className="text-muted" strokeWidth={3.5} />
                      </span>
                      {row.competitor}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
          Competitor details reflect their publicly documented free-tier limits, which change over time.
        </p>
      </section>

      {/* WHY SWITCH */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-brand">02 — Why switch</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">What you get by switching to Cvyon</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {entry.switchReasons.map((reason, i) => (
            <div key={reason.title} className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <p className="mb-3 inline-block rounded-full bg-gold px-2.5 py-1 text-[11px] font-black text-navy">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-extrabold leading-snug text-navy">{reason.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ATS NOTE */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-teal">03 — ATS</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Built to pass applicant tracking systems</h2>
        <div className="mt-7 rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/15">
              <ScanSearch size={22} className="text-teal" />
            </span>
            <p className="text-[16px] leading-relaxed text-navy/85">
              Every Cvyon template uses a single-column layout, standard section headings, and real selectable text —
              the combination applicant tracking systems parse most reliably. And unlike {entry.competitor}, Cvyon
              includes a free ATS grader that scores your finished resume and flags exactly what to fix before you
              apply.
            </p>
          </div>
          <p className="mt-5 border-t border-dashed border-line pt-5 text-[15px] leading-relaxed text-muted">
            Templates export through your browser&apos;s print-to-PDF, so the text layer stays selectable and
            searchable — the thing parsers actually read. After downloading, run your resume through our{' '}
            <Link href="/ats-grader" className="font-bold text-brand underline underline-offset-2 hover:text-coral">
              free ATS grader
            </Link>{' '}
            to confirm it scores well.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-coral">04 — FAQ</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Questions about switching from {entry.competitor}</h2>
        <div className="mt-7 space-y-4">
          {entry.faqs.map((faq) => (
            <div key={faq.q} className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <h3 className="text-base font-extrabold leading-snug text-navy">{faq.q}</h3>
              <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* OTHER ALTERNATIVES */}
      {more.length > 0 && (
        <section className="border-t border-line py-12">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-brand">05 — Explore</p>
          <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Compare Cvyon with others</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {more.map((m) => (
              <Link
                key={m.slug}
                href={`/alternatives/${m.slug}`}
                className="group rounded-[18px] border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px"
              >
                <h3 className="text-xl font-extrabold tracking-tight text-navy group-hover:text-coral">{m.pageTitle}</h3>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
                  Read comparison <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="pb-4 pt-4">
        <div className="rounded-[18px] bg-navy p-8 text-center text-white shadow-[0_16px_38px_rgba(23,27,75,0.09)] sm:p-12">
          <h2 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
            Ditch the paywall. <span className="text-coral">Build it free.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#bfc2d5]">
            180 templates, unlimited downloads, no sign-up, and a free ATS grader. Your resume is ready when you are.
          </p>
          <Link
            href={cta}
            className="group mt-8 inline-flex items-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Start building free <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
