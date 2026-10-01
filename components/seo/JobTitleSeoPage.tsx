import Link from 'next/link';
import { ArrowRight, BadgeCheck, Check, ScanSearch, Sparkles, LayoutTemplate } from 'lucide-react';
import { FaqJsonLd } from '@/components/landing/FaqJsonLd';
import { V3Pill } from '@/components/v3/V3Chrome';
import type { JobTitleSeoEntry } from '@/lib/job-title-seo';

/* Rendered inside V3Page (see app/resume-for/[slug]/page.tsx) —
 * this component carries only the article body. */

export default function JobTitleSeoPage({ entry, more }: { entry: JobTitleSeoEntry; more: JobTitleSeoEntry[] }) {
  // Pre-fills the job title in the builder via the existing ?source=seo onboarding effect.
  const cta = `/build?source=seo&jobTitle=${encodeURIComponent(entry.jobTitle)}`;

  return (
    <div className="min-h-screen text-navy">
      <FaqJsonLd faqs={entry.faqs} />

      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 pt-2 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
        <Link href="/" className="hover:text-coral">Home</Link>
        <span>/</span>
        <span>Resume guides</span>
        <span>/</span>
        <span className="text-navy">{entry.jobTitle}</span>
      </nav>

      {/* HERO */}
      <section className="py-10">
        <div className="mb-5">
          <V3Pill><Sparkles size={12} /> Free resume guide</V3Pill>
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-navy sm:text-5xl">
          Free {entry.jobTitle} <span className="text-coral">resume template &amp; example</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{entry.intro}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={cta}
            className="group inline-flex items-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
          >
            Build my {entry.jobTitle.toLowerCase()} resume <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
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
          No sign-up · Unlimited downloads · 180 templates
        </div>
      </section>

      {/* TIPS */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-coral">01 — Playbook</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">{entry.jobTitle} resume tips that actually matter</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {entry.tips.map((tip, i) => (
            <div key={tip.title} className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <p className="mb-3 inline-block rounded-full bg-gold px-2.5 py-1 text-[11px] font-black text-navy">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="text-lg font-extrabold leading-snug text-navy">{tip.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{tip.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATE STYLES */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-brand">02 — Templates</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Cvyon templates that suit {entry.jobTitle.toLowerCase()}s</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {entry.templateStyles.map((tpl) => (
            <Link
              key={tpl.slug}
              href={`/templates/${tpl.slug}`}
              className="group rounded-[18px] border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px"
            >
              <div className="flex items-center gap-2 border-b border-line bg-cream px-5 py-3">
                <LayoutTemplate size={16} className="text-brand" />
                <h3 className="text-xl font-extrabold tracking-tight text-navy group-hover:text-coral">{tpl.name}</h3>
              </div>
              <div className="p-5">
                <p className="text-[15px] leading-relaxed text-muted">{tpl.why}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
                  <Check size={14} className="text-teal" strokeWidth={3.5} /> Use this template
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ATS NOTES */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-teal">03 — ATS</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">Will it pass applicant tracking systems?</h2>
        <div className="mt-7 rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal/15">
              <ScanSearch size={22} className="text-teal" />
            </span>
            <p className="text-[16px] leading-relaxed text-navy/85">{entry.atsNotes}</p>
          </div>
          <p className="mt-5 border-t border-dashed border-line pt-5 text-[15px] leading-relaxed text-muted">
            Every Cvyon template exports through your browser&apos;s print-to-PDF, so the text layer stays selectable
            and searchable — the thing parsers actually read. After downloading, run your resume through our{' '}
            <Link href="/ats-grader" className="font-bold text-brand underline underline-offset-2 hover:text-coral">
              free ATS grader
            </Link>{' '}
            to confirm it scores well before you apply.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line py-12">
        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-coral">04 — FAQ</p>
        <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">{entry.jobTitle} resume questions</h2>
        <div className="mt-7 space-y-4">
          {entry.faqs.map((faq) => (
            <div key={faq.q} className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              <h3 className="text-base font-extrabold leading-snug text-navy">{faq.q}</h3>
              <p className="mt-3 leading-relaxed text-muted">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MORE GUIDES */}
      {more.length > 0 && (
        <section className="border-t border-line py-12">
          <p className="mb-2 text-[11px] font-black uppercase tracking-[0.13em] text-brand">05 — Explore</p>
          <h2 className="text-3xl font-extrabold tracking-[-0.045em] text-navy">More free resume guides</h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {more.map((m) => (
              <Link
                key={m.slug}
                href={`/resume-for/${m.slug}`}
                className="group rounded-[18px] border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px"
              >
                <h3 className="text-xl font-extrabold tracking-tight text-navy group-hover:text-coral">{m.jobTitle}</h3>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.13em] text-muted">
                  View guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
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
            Ready to build your <span className="text-coral">{entry.jobTitle.toLowerCase()}</span> resume?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-[#bfc2d5]">
            Pick a template, fill in your details, download the PDF. Free, no sign-up, unlimited downloads.
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
