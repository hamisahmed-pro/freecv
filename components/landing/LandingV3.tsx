"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { templates as htmlTemplates } from "@/components/html_templates";
import { Logo } from "@/components/brand/Logo";
import { renderToStaticMarkup } from "react-dom/server";
import { AnalyticsTracker } from "./AnalyticsTracker";
import { FaqJsonLd } from "./FaqJsonLd";
import { FAQS } from "./LandingF_FAQS";
import { en, type Dict } from "@/dictionaries/en";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";

const SAMPLE: any = {
  templateId: "SwissDesign", theme: { color: "#ff604b" },
  personalInfo: { fullName: "Amara Okafor", jobTitle: "Senior Software Engineer", email: "amara@cvyon.com", phone: "+234 800 000 0000", location: "Lagos, Nigeria", website: "amara.dev" },
  summary: "Backend engineer with 6+ years building scalable APIs and payment systems. Shipped services handling 4M+ daily requests at 99.98% uptime.",
  experience: [{ id: "1", company: "Paystack", role: "Senior Software Engineer", startDate: "2022", endDate: "Present", description: "Led migration of the payouts service to event-driven architecture.\nCut p99 latency 38% across checkout.\nMentored 4 engineers through promotion." }],
  education: [{ id: "1", school: "University of Lagos", degree: "B.Sc. Computer Science", graduationYear: "2018" }],
  skills: [{ id: "1", name: "TypeScript" }, { id: "2", name: "Node.js" }, { id: "3", name: "PostgreSQL" }, { id: "4", name: "AWS" }],
  showProjects: false, projects: [], showCertifications: false, certifications: [], showReferences: false, references: [], customSections: [],
  consents: { recruiterShare: false, emailJobs: false, analytics: false },
};
const GALLERY = [
  ["SwissDesign", "Swiss / Grid"], ["TechPro", "Mono / Dev"], ["Marketing", "Bold / Brand"],
  ["CorporateBlue", "Corporate"], ["MinimalistSplit", "Two-Tone"], ["ModernGradient", "Soft / Card"],
];

function Counter({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const [n, setN] = useState(0); const ref = useRef<HTMLSpanElement>(null); const done = useRef(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
        const s = performance.now();
        const tick = (t: number) => { const p = Math.min(1, (t - s) / duration); setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }), { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}
function Reveal({ children, delay = 0, className = "" }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } }), { threshold: 0.15 });
    io.observe(el); return () => io.disconnect();
  }, []);
  return <div ref={ref} data-reveal className={className} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

/* LIVE template miniature (renders the real template component, scaled) */
function Mini({ k, color, scale = 0.235 }: { k: string; color: string; scale?: number }) {
  const Tmpl = (htmlTemplates as any)[k] || (htmlTemplates as any).Executive;
  return (
    <div className="relative overflow-hidden rounded-lg bg-white" style={{ width: 192, height: 250 }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: 816, transform: `scale(${scale})`, ["--theme-color" as any]: color }}>
        <PreviewSafe tmpl={Tmpl} color={color} label={`Sample resume in the ${k} template`} />
      </div>
      <div className="pointer-events-none absolute inset-0 transition-colors group-hover:bg-navy/5" />
    </div>
  );
}

/* PreviewSafe: template components render the candidate name as <h1>, which is
   correct on their own pages/exports — but embedded in the landing it would
   create multiple H1s. Templates are pure presentational components, so we
   render to static markup and demote H1s to divs (styles preserved) at render
   time — this fixes the raw SSR HTML, not just the hydrated DOM. The preview
   is marked as a decorative illustration for assistive tech. */
function PreviewSafe({ tmpl: Tmpl, color, label }: { tmpl: any; color: string; label: string }) {
  const html = useMemo(() => {
    const raw = renderToStaticMarkup(<Tmpl data={SAMPLE} themeColor={color} />);
    return raw.replace(/<h1(\s|>)/gi, "<div$1").replace(/<\/h1>/gi, "</div>");
  }, [Tmpl, color]);
  return <div role="img" aria-label={label} dangerouslySetInnerHTML={{ __html: html }} />;
}

const TOPLINE: string[] = []; // moved to dict.topline

export default function LandingV3({ dict = en }: { dict?: Dict }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: +(-py * 7).toFixed(2), ry: +(px * 9).toFixed(2) });
  };
  const HeroTmpl = (htmlTemplates as any).SwissDesign || (htmlTemplates as any).Executive;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream font-brand text-ink antialiased">
      <AnalyticsTracker />
      <FaqJsonLd faqs={dict.faq.items} />
      <style>{`
        [data-reveal]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)}
        [data-reveal].in{opacity:1;transform:none}
        .floaty{animation:v3float 6s ease-in-out infinite}
        @keyframes v3float{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
        @media (prefers-reduced-motion:reduce){.floaty{animation:none!important}}
      `}</style>

      {/* TOPLINE — hidden on mobile to keep the hero immediately visible */}
      <div className="hidden md:flex min-h-[32px] items-center justify-center gap-7 bg-navy px-4 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.12em] text-white">
        {dict.topline.map((t, i) => (<span key={t} className={i === 1 ? "text-teal" : ""}>{t}</span>))}
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b border-line bg-cream/92 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 lg:px-7">
          <Link href="/" aria-label="Cvyon home"><Logo /></Link>
          <nav className="hidden items-center gap-7 text-[12px] font-extrabold text-[#5c6076] md:flex">
            <a href="#features" className="transition-colors hover:text-navy">{dict.nav.features}</a>
            <a href="#grader" className="transition-colors hover:text-navy">{dict.nav.ats_grader}</a>
            <a href="#plates" className="transition-colors hover:text-navy">{dict.nav.templates}</a>
            <a href="#how" className="transition-colors hover:text-navy">{dict.nav.how}</a>
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={dict.locale} />
            <Link href="/build" className="v3-btn v3-btn-primary !px-4 !py-2.5 text-[13px]">{dict.nav.build} <ArrowRight size={15} /></Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_82%_23%,#dedcff_0,transparent_24%),radial-gradient(circle_at_12%_75%,#d9f8f4_0,transparent_20%),#f6f5ef] px-5 py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-brand">
                <span className="h-2 w-2 rounded-full bg-coral shadow-[0_0_0_4px_#ffe1dc]" /> {dict.hero.eyebrow}
              </div>
              <h1 className="v3-h-display mt-4 max-w-[650px] text-[clamp(50px,6.4vw,84px)]">
                {dict.hero.h1a} <em className="relative not-italic text-coral">{dict.hero.h1b}<span className="absolute inset-x-0 -bottom-[3px] -z-10 h-[7px] -rotate-1 bg-gold" /></em> {dict.hero.h1c}
              </h1>
              <p className="mt-6 max-w-[520px] text-[16px] leading-[1.6] text-muted">
                {dict.hero.sub}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/build" className="v3-btn v3-btn-primary px-7 py-4 text-[15px]">{dict.hero.cta_build} <ArrowRight size={17} /></Link>
                <a href="#grader" className="v3-btn v3-btn-light px-7 py-4 text-[15px]">{dict.hero.cta_grader}</a>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[11px] font-extrabold text-[#707489]">
                {dict.hero.checks.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1.5"><Check size={13} className="text-teal" strokeWidth={3.5} />{m}</span>
                ))}
              </div>
            </div>

            {/* HERO ART — live template + score */}
            <div className="relative mx-auto hidden min-h-[510px] w-full max-w-[520px] sm:block" onMouseMove={onMove} onMouseLeave={() => setTilt({ rx: 0, ry: 0 })} style={{ perspective: 1100 }}>
              <div className="absolute right-0 top-0 h-[470px] w-[470px] rounded-full bg-[#e8e6ff]" />
              <div className="relative mx-auto w-fit" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: "transform .25s ease-out" }}>
                <div className="relative rotate-[-2.2deg] border-2 border-navy bg-white shadow-[14px_16px_0_#151a46]" style={{ width: 350, height: 455 }}>
                  <div className="absolute inset-x-0 top-0 h-[10px] bg-[linear-gradient(90deg,#ff604b_0_24%,#5548f5_24%_70%,#24c9bd_70%)]" />
                  <div className="h-full w-full overflow-hidden p-8 pt-10">
                    <div className="origin-top-left" style={{ width: 816, transform: "scale(0.36)", ["--theme-color" as any]: "#ff604b" }}>
                      <PreviewSafe tmpl={HeroTmpl} color="#ff604b" label={dict.hero.art_score_label_full} />
                    </div>
                  </div>
                </div>
                <div className="floaty absolute -right-7 top-12 z-20 grid h-[92px] w-[92px] place-items-center rounded-full border-[7px] border-coral bg-white text-center text-navy shadow-[7px_8px_0_#151a46]">
                  <div><div className="text-[25px] font-black leading-none"><Counter to={92} /></div><div className="text-[7px] font-black tracking-widest">{dict.hero.art_score_label}</div></div>
                </div>
                <div className="absolute -bottom-2 right-2 rounded-xl bg-navy px-4 py-3 text-[10px] font-extrabold text-white shadow-[7px_8px_0_#5548f5]">{dict.hero.art_keywords}</div>
                <div className="absolute -bottom-6 left-2 rounded-xl border border-line bg-white px-4 py-3 text-[10px] font-extrabold text-navy shadow-[7px_8px_0_#24c9bd]">{dict.hero.art_rewrite}</div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 gap-6 px-5 py-6 lg:grid-cols-4">
            {dict.trust.map(([t, d], i) => (
              <div key={t} className={cn("text-[11px] text-[#6f7286] lg:border-r lg:border-line lg:px-6 lg:first:pl-0", i === 3 && "lg:border-0")}>
                <strong className="mb-1 block text-[14px] text-navy">{t}</strong>{d}
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="scroll-mt-24 px-5 py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="mb-11 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <div className="v3-eyebrow">{dict.features.eyebrow}</div>
                  <h2 className="v3-h-display mt-3 max-w-[700px] text-[clamp(38px,5vw,61px)]">{dict.features.h2}</h2>
                </div>
                <p className="max-w-[370px] leading-[1.6] text-muted">{dict.features.sub}</p>
              </div>
            </Reveal>
            <div className="grid gap-[18px] md:grid-cols-3">
              {dict.features.cards.map((c, i) => {
                const meta = [["bg-cream", "bg-navy"], ["bg-lavender", "bg-brand"], ["bg-mint", "bg-coral"]][i];
                const n = ["01", "02", "03"][i];
                const [t, d] = [c.t, c.d]; const [bg, icon] = meta;
                return (
                <Reveal key={t} delay={i * 90}>
                  <article className={cn("min-h-[250px] rounded-[18px] border border-line p-7", bg)}>
                    <div className={cn("mb-9 grid h-[42px] w-[42px] place-items-center rounded-xl font-black text-white", icon)}>{n}</div>
                    <h3 className="mb-2 text-[20px] font-bold text-navy">{t}</h3>
                    <p className="text-[13px] leading-[1.55] text-muted">{d}</p>
                  </article>
                </Reveal>
                );})}
            </div>
          </div>
        </section>

        {/* MANIFESTO */}
        <section className="bg-navy px-5 py-16 text-white lg:py-24">
          <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.25em] text-coral">{dict.manifesto.eyebrow}</div>
              <h2 className="v3-h-display !text-white max-w-[640px] text-[clamp(36px,4.6vw,60px)]">{dict.manifesto.h2}</h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">{dict.manifesto.p}</p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5">
              <div className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.22em] text-white/50">{dict.manifesto.money_title}</div>
              <ol>
                {dict.manifesto.steps.map(([n, t, d], i) => (
                  <li key={n} className={cn("flex gap-5 border-t-2 border-white/20 py-5", i === 2 && "border-b-2")}>
                    <span className="text-3xl font-black leading-none text-coral">{n}</span>
                    <div><div className="text-lg font-extrabold">{t}</div><div className="mt-1 text-sm text-white/60">{d}</div></div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* GRADER */}
        <section id="grader" className="scroll-mt-24 bg-white px-5 py-20 lg:py-28">
          <div className="mx-auto grid max-w-[1180px] items-center gap-16 lg:grid-cols-2">
            <Reveal>
              <div className="relative overflow-hidden rounded-[20px] bg-navy p-8 shadow-[12px_14px_0_#ff604b] sm:p-9">
                <div className="absolute -bottom-[100px] -right-[100px] h-[280px] w-[280px] rounded-full bg-[#292f72]" />
                <div className="relative z-10 rounded-[10px] bg-white p-6 shadow-[0_18px_35px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center gap-5 border-b border-line pb-5">
                    <div className="grid h-[78px] w-[78px] shrink-0 place-items-center rounded-full border-[7px] border-coral text-[22px] font-black text-navy"><Counter to={92} /></div>
                    <div><strong className="text-navy">{dict.grader_section.mock[0]}</strong><br /><small className="text-[#8b8ea0]">{dict.grader_section.mock[1]}</small></div>
                  </div>
                  <div className="mt-4 grid gap-2.5 text-[12px] text-[#5e6276]">
                    <div><b className="text-teal">✓</b> {dict.grader_section.mock[2]}</div>
                    <div><b className="text-teal">✓</b> {dict.grader_section.mock[3]}</div>
                    <div><b className="text-coral">!</b> {dict.grader_section.mock[4]}</div>
                    <div><b className="text-coral">!</b> {dict.grader_section.mock[5]}</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="v3-eyebrow">{dict.grader_section.eyebrow}</div>
              <h2 className="v3-h-display mt-3 max-w-[560px] text-[clamp(38px,5vw,61px)]">{dict.grader_section.h2}</h2>
              <p className="mt-5 max-w-[520px] leading-[1.65] text-muted">{dict.grader_section.p}</p>
              <ul className="mt-7 space-y-4">
                {dict.grader_section.items.map(([t, d]) => (
                  <li key={t} className="flex gap-4 border-t border-line pt-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md bg-navy text-white"><Check size={14} strokeWidth={3} /></span>
                    <div><div className="text-lg font-extrabold text-navy">{t}</div><div className="text-sm text-muted">{d}</div></div>
                  </li>
                ))}
              </ul>
              <Link href="/ats-grader" className="v3-btn v3-btn-primary mt-8 px-6 py-3.5 text-[14px]">{dict.grader_section.cta} <ArrowUpRight size={16} /></Link>
            </Reveal>
          </div>
        </section>

        {/* TEMPLATES */}
        <section id="plates" className="scroll-mt-24 px-5 py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="mb-11 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                <div>
                  <div className="v3-eyebrow">{dict.templates_section.eyebrow}</div>
                  <h2 className="v3-h-display mt-3 text-[clamp(38px,5vw,61px)]">{dict.templates_section.h2}</h2>
                </div>
                <p className="max-w-[370px] leading-[1.6] text-muted">{dict.templates_section.p}</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {GALLERY.map(([k, n], i) => (
                <Reveal key={k} delay={i * 60}>
                  <Link href={`/build?source=seo&template=${k}`} className="group block rounded-xl border border-line bg-white p-2.5 shadow-[0_8px_18px_rgba(21,26,70,0.06)] transition-transform hover:-translate-y-1">
                    <Mini k={k} color="#ff604b" />
                    <span className="mt-2.5 block px-1 pb-1 text-[9px] font-black uppercase tracking-[0.08em] text-navy">{n}</span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-8 text-center">
              <Link href="/build" className="v3-btn v3-btn-light px-6 py-3 text-[14px]">{dict.templates_section.cta} <ArrowRight size={15} /></Link>
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="scroll-mt-24 bg-white px-5 py-20 lg:py-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="v3-eyebrow">{dict.how.eyebrow}</div>
              <h2 className="v3-h-display mb-10 mt-3 text-[clamp(38px,5vw,61px)]">{dict.how.h2}</h2>
            </Reveal>
            <div className="border-t-2 border-navy">
              {dict.how.steps.map(([n, t, d]) => (
                <Reveal key={n}>
                  <div className="grid grid-cols-[64px_1fr_32px] items-center gap-4 border-b-2 border-navy py-7 sm:grid-cols-[120px_1fr_40px]">
                    <div className="text-[30px] font-black text-[#c9cad1] sm:text-[42px]">{n}</div>
                    <div><h3 className="mb-1 text-[19px] font-bold text-navy">{t}</h3><p className="m-0 text-[13px] text-muted">{d}</p></div>
                    <ArrowRight size={22} className="text-navy" />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-14 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
              {dict.how.stats.map(([v, l], i) => (
                <Reveal key={l} delay={i * 70}>
                  <div className="rounded-xl border border-line bg-cream p-5">
                    <strong className="block text-[35px] font-black tracking-[-0.05em] text-navy">{v}</strong>
                    <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#808397]">{l}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-center text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted/70">{dict.how.note}</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 px-5 py-20 lg:py-28">
          <div className="mx-auto max-w-[820px]">
            <Reveal>
              <div className="v3-eyebrow text-center">{dict.faq.eyebrow}</div>
              <h2 className="v3-h-display mt-3 text-center text-[clamp(32px,4.4vw,52px)]">{dict.faq.h2}</h2>
            </Reveal>
            <div className="mt-10 space-y-3">
              {dict.faq.items.map((f, i) => {
                const open = openFaq === i;
                return (
                  <Reveal key={f.q} delay={i * 50}>
                    <div className={cn("overflow-hidden rounded-2xl border bg-white transition-colors", open ? "border-brand" : "border-line")}>
                      <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open} className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                        <span className="text-[16px] font-bold text-navy">{f.q}</span>
                        <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-full text-lg font-black transition-colors", open ? "bg-brand text-white" : "bg-cream text-navy")}>{open ? "−" : "+"}</span>
                      </button>
                      {open && <p className="px-6 pb-6 text-[14px] leading-[1.7] text-muted">{f.a}</p>}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="start" className="scroll-mt-24 px-5 pb-20 lg:pb-28">
          <div className="mx-auto max-w-[1180px]">
            <Reveal>
              <div className="relative flex flex-col gap-10 overflow-hidden rounded-[22px] bg-navy p-10 text-white lg:flex-row lg:items-end lg:justify-between lg:p-14">
                <div className="absolute -right-[90px] -top-[140px] h-[300px] w-[300px] rounded-full bg-[#292f72]" />
                <div className="relative z-10">
                  <div className="v3-eyebrow !text-gold">{dict.final_cta.eyebrow}</div>
                  <h2 className="v3-h-display !text-white mt-3 max-w-[560px] text-[clamp(36px,4.8vw,60px)]">{dict.final_cta.h2}</h2>
                  <p className="mt-4 max-w-[480px] text-white/70">{dict.final_cta.p}</p>
                </div>
                <Link href="/build" className="v3-btn v3-btn-coral relative z-10 shrink-0 px-8 py-4 text-[15px]">{dict.final_cta.button} <ArrowRight size={17} /></Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-line bg-white px-5 pb-8 pt-14">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid grid-cols-2 gap-8 border-b border-line pb-10 md:grid-cols-4">
            <div>
              <Logo size={26} wordSize={20} />
              <p className="mt-4 max-w-[220px] text-[12px] leading-relaxed text-muted">{dict.footer.tagline}</p>
            </div>
            {[
              [dict.footer.col_product, [["Builder", "/build"], ["ATS Grader", "/ats-grader"], ["Templates", "/build"], ["Cover Letter", "/cover-letter"]]],
              [dict.footer.col_company, [["About", "/about"], ["Career Blog", "/blog"], ["Recruiter Portal", "/recruiter"], ["Support", "/support"]]],
              [dict.footer.col_legal, [["Privacy", "/privacy"], ["Terms", "/terms"], ["Manage data", "/manage-data"], ["Developers", "/developers"]]],
            ].map(([h, items]) => (
              <div key={h as string}>
                <h4 className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#a0a2b1]">{h as string}</h4>
                {(items as [string, string][]).map(([label, href]) => (
                  <Link key={label} href={href} className="mb-2.5 block text-[12px] text-[#6d7184] transition-colors hover:text-navy">{label}</Link>
                ))}
              </div>
            ))}
          </div>
          <div className="flex flex-col justify-between gap-3 pt-5 text-[9px] font-extrabold uppercase tracking-[0.1em] text-[#9a9cac] sm:flex-row">
            <span>{dict.footer.copyright}</span>
            <span className="inline-flex items-center gap-1.5"><Sparkles size={12} className="text-coral" /> {dict.footer.bottom_tag}</span>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-cream p-3 md:hidden">
        <Link href="/build" className="v3-btn v3-btn-dark w-full py-3.5 text-[14px]">{dict.mobile_cta} <ArrowRight size={16} /></Link>
      </div>
      <div className="h-[76px] md:hidden" />
    </div>
  );
}
