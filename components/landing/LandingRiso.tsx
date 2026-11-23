"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Sparkles, Check, Star, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { templates as htmlTemplates } from "@/components/html_templates";
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from "@/lib/fonts";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

const SAMPLE: any = {
  templateId: "SwissDesign", theme: { color: "#FF4326" },
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
  ["CorporateBlue", "Corporate"], ["MinimalistSplit", "Two‑Tone"], ["ModernGradient", "Soft / Card"],
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

// LIVE template miniature (renders the real template component, scaled — not an image)
function Mini({ k, color, scale = 0.235 }: { k: string; color: string; scale?: number }) {
  const Tmpl = (htmlTemplates as any)[k] || (htmlTemplates as any).Executive;
  return (
    <div className="relative overflow-hidden bg-white" style={{ width: 192, height: 250 }}>
      <div className="absolute top-0 left-0 origin-top-left" style={{ width: 816, transform: `scale(${scale})`, ["--theme-color" as any]: color }}>
        <Tmpl data={SAMPLE} themeColor={color} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5" />
    </div>
  );
}

const TICKER = ["NO PAYWALL", "NO WATERMARK", "NO SIGN‑UP TO DOWNLOAD", "RECRUITERS FUND IT — NOT YOU", "180 TEMPLATES", "AI ATS GRADER /100", "PDF + DOCX"];

import { AnalyticsTracker } from "./AnalyticsTracker";
import { FaqJsonLd } from "./FaqJsonLd";
import { FAQS } from "./LandingF_FAQS";

export default function LandingRiso() {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: +(-py * 7).toFixed(2), ry: +(px * 9).toFixed(2) });
  };

  const HeroTmpl = (htmlTemplates as any).SwissDesign || (htmlTemplates as any).Executive;

  return (
    <div className={cn("cv-riso relative min-h-screen overflow-x-hidden text-[#141312]", body.className, display.className, head.className, mono.className)}
      style={{ background: "#E8E7E1", ["--ink" as any]: "#141312", ["--verm" as any]: "#FF4326", ["--cob" as any]: "#2233FF", ["--hi" as any]: "#FFE14D", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <AnalyticsTracker />
      <FaqJsonLd faqs={FAQS} />
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .grain{position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.06;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .cv-riso .dots{background-image:radial-gradient(#14131222 1.2px,transparent 1.2px);background-size:22px 22px}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso [data-reveal]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)} .cv-riso [data-reveal].in{opacity:1;transform:none}
        .cv-riso .mq{display:flex;width:max-content;animation:risomq 26s linear infinite} .cv-riso .mq2{animation-duration:34s;animation-direction:reverse}
        @keyframes risomq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .cv-riso .blink{animation:risoblink 1.1s steps(2,start) infinite} @keyframes risoblink{50%{opacity:.15}}
        .cv-riso .floaty{animation:risofloat 6s ease-in-out infinite} @keyframes risofloat{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-9px) rotate(-8deg)}}
        .cv-riso .ul{background-image:linear-gradient(var(--ink),var(--ink));background-position:0 100%;background-repeat:no-repeat;background-size:0% 2px;transition:background-size .35s} .cv-riso .ul:hover{background-size:100% 2px}
        @media (prefers-reduced-motion:reduce){.cv-riso .mq,.cv-riso .floaty,.cv-riso .blink{animation:none!important}}
      `}</style>
      <div className="grain" />

      {/* TICKER */}
      <div className="relative z-40 border-b-[3px] border-[#141312] bg-[#141312] py-2 text-[#E8E7E1] overflow-hidden">
        <div className="mq fm text-[11px] font-bold uppercase tracking-[0.25em]">
          {[0, 1].map((d) => (<div key={d} className="flex shrink-0 items-center">{TICKER.map((t, i) => (<span key={i} className="flex items-center"><span className="px-5">{t}</span><span className="text-[#FF4326]">◆</span></span>))}</div>))}
        </div>
      </div>

      {/* NAV */}
      <header className="sticky top-0 z-40 border-b-[3px] border-[#141312] bg-[#E8E7E1]/95 backdrop-blur-0">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light-no-background.png"
              alt="Cvyon"
              width={240}
              height={80}
              priority
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-all"
            />
          </Link>
          <nav className="hidden items-center gap-7 fm text-[11px] font-bold uppercase tracking-[0.18em] md:flex">
            <a href="#grader" className="ul">Grader</a><a href="#plates" className="ul">Templates</a><a href="/blog" className="ul">Blog</a><a href="#start" className="ul">Start</a>
          </nav>
          <Link href="/build" className="group flex items-center gap-2 border-[3px] border-[#141312] bg-[#141312] px-4 py-2.5 fm text-[11px] font-bold uppercase tracking-[0.18em] text-[#E8E7E1] hs transition-all hover:bg-[#FF4326] hover:border-[#FF4326]">
            Build free <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 lg:px-8">
        {/* HERO */}
        <section className="dots relative grid grid-cols-1 gap-10 border-b-[3px] border-[#141312] py-14 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <div className="fm mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]">
              <span className="inline-flex items-center gap-2 border-[3px] border-[#141312] bg-white px-3 py-1.5 hs"><span className="blink inline-block h-2 w-2 rounded-full bg-[#FF4326]" /> live · grading free</span>
              <span className="text-[#141312]/50">spec no. 001</span>
            </div>
            <h1 className="fd text-[12vw] leading-[0.86] tracking-[-0.02em] sm:text-7xl lg:text-[5.4rem]">
              Your résumé,<br />graded by the<br />bots that <span className="relative inline-block"><span className="relative z-10">bin</span><span className="absolute inset-x-[-4px] bottom-1 z-0 h-[0.42em] bg-[#FFE14D]" /></span> it.
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-[#141312]/75">
              A free AI builder that scores you against any job description — the exact thing others charge $30/month for. No paywall. No watermark. No account to download.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/build" className="group flex items-center justify-center gap-2 border-[3px] border-[#141312] bg-[#141312] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#E8E7E1] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Build my résumé <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
              <a href="#grader" className="flex items-center justify-center gap-2 border-[3px] border-[#141312] bg-white px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">See the grader</a>
            </div>
            <div className="mt-9 flex flex-wrap gap-2 fm text-[10px] font-bold uppercase tracking-[0.16em]">
              {["180 templates", "PDF + DOCX", "ATS score /100", "AI rewrite"].map((c) => (<span key={c} className="border-2 border-[#141312] bg-white px-3 py-1.5">{c}</span>))}
            </div>
          </div>

          {/* HERO OBJECT — live template render */}
          <div className="relative lg:col-span-5" onMouseMove={onMove} onMouseLeave={() => setTilt({ rx: 0, ry: 0 })} style={{ perspective: 1100 }}>
            <div className="relative mx-auto w-fit" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`, transition: "transform .25s ease-out" }}>
              <div className="relative border-[3px] border-[#141312] bg-white hs" style={{ width: 232, height: 302 }}>
                <div className="absolute -left-2 -top-3 z-20 h-9 w-16 rotate-[-18deg] rounded-[3px] border-2 border-[#141312]/40 bg-[#c9c9c9]" />
                <div className="h-full w-full overflow-hidden">
                  <div className="origin-top-left" style={{ width: 816, transform: "scale(0.284)", ["--theme-color" as any]: "#FF4326" }}>
                    <HeroTmpl data={SAMPLE} themeColor="#FF4326" />
                  </div>
                </div>
              </div>
              <div className="floaty absolute -right-5 top-6 z-20 grid h-20 w-20 place-items-center rounded-full border-[3px] border-[#141312] bg-[#FF4326] text-center text-[#E8E7E1] hs">
                <div><div className="fd text-2xl leading-none"><Counter to={92} /></div><div className="fm text-[8px] font-bold uppercase tracking-widest">ATS</div></div>
              </div>
              <div className="absolute -bottom-4 -left-4 z-20 border-[3px] border-[#141312] bg-[#2233FF] px-3 py-2 fm text-[9px] font-bold uppercase tracking-[0.15em] text-white hs-c">AI rewrote this</div>
            </div>
          </div>
        </section>

        {/* FUNDING / MANIFESTO */}
        <section id="funding" className="scroll-mt-24 border-b-[3px] border-[#141312] bg-[#141312] py-16 text-[#E8E7E1] lg:py-24" style={{ marginLeft: "calc(-50vw + 50%)", marginRight: "calc(-50vw + 50%)", paddingLeft: "max(1.25rem,calc((100vw - 1240px)/2 + 1.25rem))", paddingRight: "max(1.25rem,calc((100vw - 1240px)/2 + 1.25rem))" }}>
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="fm mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF4326]">§ the honest part</div>
              <h2 className="fd text-4xl leading-[0.95] tracking-tight sm:text-6xl">We don't trap you at the download button.</h2>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#E8E7E1]/70">Other builders bait you with “free” and slam a paywall on the PDF. We made the opposite bet: the tool is free because the people who pay are recruiters — and only ever with your permission.</p>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-5">
              <div className="fm mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#E8E7E1]/50">how the money works</div>
              <ol className="space-y-0">
                {[["01", "You build & download", "Every template, every AI feature, every export. No card, ever."], ["02", "You may opt in", "Recruiters can find you — only if you tick the box. Granular, reversible, yours."], ["03", "Recruiters pay us", "Recruiters pay for access to the opt-in talent pool — you control whether your profile appears."]].map(([n, t, d], i) => (
                  <li key={n} className={cn("flex gap-5 border-t-2 border-[#E8E7E1]/20 py-5", i === 2 && "border-b-2")}>
                    <span className="fd text-3xl leading-none text-[#FF4326]">{n}</span>
                    <div><div className="fh text-lg font-extrabold">{t}</div><div className="mt-1 text-sm text-[#E8E7E1]/60">{d}</div></div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* GRADER */}
        <section id="grader" className="scroll-mt-24 grid grid-cols-1 gap-12 border-b-[3px] border-[#141312] py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <div className="border-[3px] border-[#141312] bg-white hs">
              <div className="flex items-center justify-between border-b-[3px] border-[#141312] bg-[#141312] px-5 py-3 fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8E7E1]"><span className="flex items-center gap-2"><Sparkles size={13} className="text-[#FFE14D]" /> ats_grader.exe</span></div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-6">
                  <div className="relative grid h-28 w-28 place-items-center border-[3px] border-[#141312]">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="#14131218" strokeWidth="8" /><circle cx="50" cy="50" r="42" fill="none" stroke="#FF4326" strokeWidth="8" strokeLinecap="square" strokeDasharray="264" strokeDashoffset={264 * (1 - 92 / 100)} /></svg>
                    <span className="fd text-3xl"><Counter to={92} /></span>
                  </div>
                  <div><div className="fh text-xl font-extrabold">Excellent match</div><div className="mt-1 text-sm text-[#141312]/60">Highly qualified for this role.</div></div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="border-2 border-[#141312] p-4"><div className="fm mb-2 text-[10px] font-bold uppercase tracking-widest text-[#2233FF]">+ strengths</div><ul className="space-y-1 text-sm">{["Strong action verbs", "Measurable impact"].map((s) => (<li key={s}>· {s}</li>))}</ul></div>
                  <div className="border-2 border-[#141312] p-4"><div className="fm mb-2 text-[10px] font-bold uppercase tracking-widest text-[#FF4326]">! add these</div><ul className="space-y-1 text-sm">{["Kubernetes", "CI/CD pipelines"].map((s) => (<li key={s}>· {s}</li>))}</ul></div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120} className="flex flex-col justify-center">
            <div className="fm mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#2233FF]">the grader</div>
            <h2 className="fd text-4xl leading-[0.95] tracking-tight sm:text-6xl">A grader that tells you the <span className="relative inline-block"><span className="relative z-10">truth</span><span className="absolute inset-x-[-3px] bottom-1 z-0 h-[0.4em] bg-[#FFE14D]" /></span>.</h2>
            <ul className="mt-7 space-y-4">
              {[["Score out of 100", "Strict and objective, against the real job post."], ["Missing keywords, named", "The exact terms the screeners scan for."], ["One‑click AI rewrite", "Executive, creative, or technical — your call."]].map(([t, d]) => (
                <li key={t} className="flex gap-4 border-t-2 border-[#141312]/15 pt-4"><span className="mt-1 grid h-6 w-6 shrink-0 place-items-center border-2 border-[#141312] bg-[#141312] text-[#E8E7E1]"><Check size={14} /></span><div><div className="fh text-lg font-extrabold">{t}</div><div className="text-sm text-[#141312]/60">{d}</div></div></li>
              ))}
            </ul>
            <Link href="/ats-grader" className="mt-8 inline-flex w-fit items-center gap-2 border-[3px] border-[#141312] bg-[#2233FF] px-6 py-3.5 fh text-sm font-extrabold uppercase tracking-wider text-white hs-c transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Try the grader <ArrowUpRight size={16} /></Link>
          </Reveal>
        </section>

        {/* PLATES / TEMPLATES — live miniatures */}
        <section id="plates" className="scroll-mt-24 border-b-[3px] border-[#141312] py-16 lg:py-24">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><div className="fm mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF4326]">the specimens</div><h2 className="fd text-4xl leading-[0.95] tracking-tight sm:text-6xl">180 plates.<br />Pick yours.</h2></div>
            <div className="fm flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/60"><MoveRight size={15} /> scroll the bench</div>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {GALLERY.map(([k, n], i) => (
              <Reveal key={k} delay={i * 60} className="shrink-0">
                <div className="group border-[3px] border-[#141312] bg-white hs transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
                  <div className="relative border-b-[3px] border-[#141312] bg-[#E8E7E1] p-3"><span className="fm absolute right-3 top-3 z-10 text-[10px] font-bold">{String(i + 1).padStart(2, "0")}</span><Mini k={k} color="#FF4326" /></div>
                  <div className="flex items-center justify-between px-4 py-3 fm text-[10px] font-bold uppercase tracking-[0.16em]"><span>{n}</span><ArrowUpRight size={14} className="text-[#FF4326] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROCESS LEDGER */}
        <section className="border-b-[3px] border-[#141312] py-16 lg:py-24">
          <div className="fm mb-8 text-[11px] font-bold uppercase tracking-[0.25em] text-[#2233FF]">the method — three moves</div>
          {[["01", "Build or import", "Type it in, or drop your old PDF — the AI extracts every line and fills the form.", "left"], ["02", "Grade it", "Paste the job. Get a strict score, the missing keywords, and a one‑click rewrite.", "right"], ["03", "Download free", "Export a crisp PDF or an editable Word doc. No account, no card, no catch.", "left"]].map(([n, t, d, side], i) => (
            <Reveal key={n}>
              <div className={cn("group grid grid-cols-1 items-center gap-6 border-t-[3px] border-[#141312] py-10 transition-colors hover:bg-white/50 md:grid-cols-12", side === "right" && "md:[direction:rtl]")}>
                <div className="md:col-span-3 md:[direction:ltr]"><span className="fd text-7xl leading-none text-[#141312]/15 transition-colors group-hover:text-[#FF4326]">{n}</span></div>
                <div className="md:col-span-6 md:[direction:ltr]"><h3 className="fh text-3xl font-extrabold tracking-tight">{t}</h3><p className="mt-2 max-w-md text-[#141312]/65">{d}</p></div>
                <div className="md:col-span-3 md:[direction:ltr] md:text-right"><ArrowRight size={26} className="inline-block transition-transform group-hover:translate-x-2" /></div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* HONEST PROOF */}
        <section className="border-b-[3px] border-[#141312] py-16 lg:py-20">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[["0", "paywalls", "#FF4326"], ["0", "features locked", "#2233FF"], ["180", "free templates", "#141312"], ["100%", "free AI", "#141312"]].map(([v, l, c], i) => (
              <Reveal key={l} delay={i * 70}>
                <div className="border-[3px] border-[#141312] bg-white p-6 hs"><div className="fd text-5xl leading-none" style={{ color: c as string }}>{v}</div><div className="fm mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#141312]/60">{l}</div></div>
              </Reveal>
            ))}
          </div>
          <p className="fm mt-6 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/50">No fake “10,000+ users” here — we publish real figures the day we earn them.</p>
        </section>

        {/* FINAL CTA */}
        <section id="start" className="scroll-mt-24 relative overflow-hidden py-20 lg:py-28">
          <div className="relative border-[3px] border-[#141312] bg-[#141312] p-10 text-[#E8E7E1] hs lg:p-16">
            <div className="absolute right-6 top-6 rotate-[10deg] border-2 border-[#FF4326] px-3 py-1.5 fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF4326]">free · forever</div>
            <div className="fm mb-5 text-[11px] font-bold uppercase tracking-[0.25em] text-[#FFE14D]">last page</div>
            <h2 className="fd max-w-2xl text-5xl leading-[0.92] tracking-tight sm:text-7xl">Stop paying to be seen.</h2>
            <p className="mt-5 max-w-md text-[#E8E7E1]/65">Build, grade, and download a résumé that gets past the bots — free, in minutes.</p>
            <Link href="/build" className="group mt-9 inline-flex items-center gap-2 border-[3px] border-[#E8E7E1] bg-[#FF4326] px-8 py-4 fh text-sm font-extrabold uppercase tracking-wider text-white hs-v transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">Start building free <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="relative overflow-hidden border-t-[3px] border-[#141312] bg-[#E8E7E1] px-5 pb-8 pt-14 lg:px-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-2 gap-8 border-b-2 border-[#141312] pb-10 md:grid-cols-4">
            {[
              ["Product", [{ label: "Builder", href: "/build" }, { label: "Cover Letter", href: "/build?tab=cover" }]],
              ["Company", [{ label: "Career Blog", href: "/blog" }, { label: "Recruiter Portal", href: "/recruiter" }, { label: "Support", href: "/support" }]],
              ["Legal", [{ label: "Privacy & GDPR", href: "/privacy" }, { label: "Manage Data", href: "/manage-data" }, { label: "Terms", href: "/terms" }]],
              ["Connect", [{ label: "Email us", href: "mailto:support@cvyon.com" }, { label: "Developers", href: "/developers" }]]
            ].map(([h, items]) => (
              <div key={h as string}>
                <div className="fm mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/50">{h as string}</div>
                <ul className="space-y-2 text-sm">
                  {(items as { label: string; href: string }[]).map((it) => (
                    <li key={it.label}><a href={it.href} className="ul">{it.label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
            <span className="fm text-[11px] font-bold uppercase tracking-[0.18em] text-[#141312]/50">© 2026 Cvyon — premium & forever free</span>
            <span className="fm flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em]"><Star size={13} className="fill-[#FF4326] text-[#FF4326]" /> built in the open</span>
          </div>
        </div>
        <div className="pointer-events-none mt-6 select-none text-center fd text-[20vw] leading-[0.8] tracking-tighter text-[#141312]/[0.05]">CVYON</div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-[#141312] bg-[#E8E7E1] p-3 md:hidden">
        <Link href="/build" className="flex items-center justify-center gap-2 border-[3px] border-[#141312] bg-[#141312] py-3.5 fh text-sm font-extrabold uppercase tracking-wider text-[#E8E7E1]">Build free <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}