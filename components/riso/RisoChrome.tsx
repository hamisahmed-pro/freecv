"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// `cn` is defined LOCALLY on purpose — do NOT import it from "@/lib/utils".
// Some files in this repo define cn locally and some import it; importing it
// here would make RisoChrome (and every page that uses it) break if that
// export is ever missing. clsx + tailwind-merge are guaranteed installed.
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ------------------------------------------------------------------ *
 *  NAV LINKS — single source of truth.
 *  Edit ONLY here to rename/reorder routes; every page updates at once.
 *  NOTE: the codebase I can see has the grader at "/ats-grader". If your
 *  live routes are "/grader" and "/cover-letter", change the two hrefs
 *  below; if "/grader" 404s, set it to "/ats-grader". Cover letter lives
 *  as a tab inside the builder, so it points at "/build" by default.
 * ------------------------------------------------------------------ */
const NAV = [
  { href: "/", label: "Home" },
  { href: "/build", label: "Builder" },
  { href: "/recruiter", label: "For Recruiters" },
];

/* Best-effort page_view tracker. Uses a DYNAMIC import so that if
 * @/lib/analytics or its `trackEvent` export is ever missing/renamed,
 * this silently no-ops instead of breaking the build. */
export function usePageView(page: string) {
  useEffect(() => {
    let alive = true;
    import("@/lib/analytics")
      .then((m: any) => {
        if (alive && typeof m?.trackEvent === "function") {
          m.trackEvent("page_view", page);
        }
      })
      .catch(() => {
        /* analytics unavailable — tracking is non-critical, ignore */
      });
    return () => {
      alive = false;
    };
  }, [page]);
}

export function RisoTicker() {
  const items = [
    "NO PAYWALL",
    "NO WATERMARK",
    "NO SIGN-UP TO DOWNLOAD",
    "RECRUITERS FUND IT — NOT YOU",
    "18 TEMPLATES",
    "AI ATS GRADER /100",
    "PDF + DOCX",
  ];
  return (
    <div className="relative z-40 overflow-hidden border-b-[3px] border-[#151a46] bg-[#151a46] py-2 text-[#f6f5ef]">
      <div className="riso-ticker fm text-[11px] font-bold uppercase tracking-[0.25em]">
        {[0, 1].map((d) => (
          <div key={d} className="flex shrink-0 items-center">
            {items.map((t, i) => (
              <span key={i} className="flex items-center">
                <span className="px-5">{t}</span>
                <span className="text-[#ff604b]">◆</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function RisoNav() {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b-[3px] border-[#151a46] bg-[#f6f5ef]/95">
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
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "transition-colors hover:text-[#ff604b]",
                pathname === n.href ? "text-[#ff604b]" : "text-[#151a46]/70"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/build"
            className="riso-btn hs-sm hidden !px-4 !py-2.5 sm:inline-flex"
          >
            Build free <ArrowRight size={15} />
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center md:hidden"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-[#f6f5ef] md:hidden">
          <div className="flex items-center justify-between border-b-[3px] border-[#151a46] px-5 py-4">
            <Image
              src="/logo-light-no-background.png"
              alt="Cvyon"
              width={200}
              height={60}
              priority
              className="h-10 w-auto object-contain"
            />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-5 pt-4">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "fd border-b-[3px] border-[#151a46] py-5 text-3xl tracking-tight",
                  pathname === n.href ? "text-[#ff604b]" : ""
                )}
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/build"
              onClick={() => setOpen(false)}
              className="riso-btn mt-8"
            >
              Build free <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function RisoFooter() {
  const cols: [string, { label: string; href: string }[]][] = [
    ["product", [{ label: "Builder", href: "/build" }, { label: "ATS Grader", href: "/ats-grader" }, { label: "Cover Letter", href: "/cover-letter" }, { label: "Templates", href: "/build" }]],
    ["company", [{ label: "Career Blog", href: "/blog" }, { label: "Recruiter Portal", href: "/recruiter" }, { label: "Support", href: "/support" }]],
    ["legal", [{ label: "Privacy & GDPR", href: "/privacy" }, { label: "Manage Data", href: "/manage-data" }, { label: "Terms", href: "/terms" }]],
    ["connect", [{ label: "Email us", href: "mailto:hello@cvyon.com" }, { label: "Developers", href: "/developers" }]],
  ];
  return (
    <footer className="relative overflow-hidden border-t-[3px] border-[#151a46] bg-[#f6f5ef] px-5 pb-8 pt-14 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid grid-cols-2 gap-8 border-b-2 border-[#151a46] pb-10 md:grid-cols-4">
          {cols.map(([h, items]) => (
            <div key={h}>
              <div className="fm mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#151a46]/50">
                {h}
              </div>
              <ul className="space-y-2 text-sm">
                {items.map((it) => (
                  <li key={it.label}>
                    <Link href={it.href} className="hover:text-[#ff604b]">
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start justify-between gap-4 pt-6 sm:flex-row sm:items-center">
          <span className="fm text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46]/50">
            © 2026 Cvyon — built in the open · free for candidates, funded by recruiters
          </span>
        </div>
      </div>
      <div className="pointer-events-none mt-6 select-none text-center fd text-[20vw] leading-[0.8] tracking-tighter text-[#151a46]/[0.05]">
        CVYON
      </div>
    </footer>
  );
}

export function RisoSectionLabel({
  children,
  color = "#5548f5",
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div
      className="fm mb-4 text-[11px] font-bold uppercase tracking-[0.25em]"
      style={{ color }}
    >
      § {children}
    </div>
  );
}

import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from "@/lib/fonts";
import { AnalyticsTracker } from "../landing/AnalyticsTracker";

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

/* Wrap any front page in this to get grain + nav + footer + page_view for free.
 * `ticker` adds the top marquee. `pageName` drives the page_view event. */
export function RisoPage({
  pageName,
  children,
  ticker = false,
}: {
  pageName: string;
  children: React.ReactNode;
  ticker?: boolean;
}) {
  usePageView(pageName);
  return (
    <div className={cn("cv-riso relative min-h-screen overflow-x-hidden text-[#151a46]", body.className, display.className, head.className, mono.className)}
      style={{ background: "#f6f5ef", ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <AnalyticsTracker />
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .grain{position:fixed;inset:0;pointer-events:none;z-index:60;opacity:.06;mix-blend-mode:multiply;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
        .cv-riso .dots{background-image:radial-gradient(#151a4622 1.2px,transparent 1.2px);background-size:22px 22px}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso [data-reveal]{opacity:0;transform:translateY(24px);transition:opacity .7s cubic-bezier(.2,.7,.2,1),transform .7s cubic-bezier(.2,.7,.2,1)} .cv-riso [data-reveal].in{opacity:1;transform:none}
        .cv-riso .mq{display:flex;width:max-content;animation:risomq 26s linear infinite} .cv-riso .mq2{animation-duration:34s;animation-direction:reverse}
        @keyframes risomq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .cv-riso .blink{animation:risoblink 1.1s steps(2,start) infinite} @keyframes risoblink{50%{opacity:.15}}
        .cv-riso .floaty{animation:risofloat 6s ease-in-out infinite} @keyframes risofloat{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-9px) rotate(-8deg)}}
        .cv-riso .ul{background-image:linear-gradient(var(--ink),var(--ink));background-position:0 100%;background-repeat:no-repeat;background-size:0% 2px;transition:background-size .35s} .cv-riso .ul:hover{background-size:100% 2px}
        @media (prefers-reduced-motion:reduce){.cv-riso .mq,.cv-riso .floaty,.cv-riso .blink{animation:none!important}}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
        .cv-riso .riso-ticker{display:flex;width:max-content;animation:risomq 26s linear infinite}

        /* Riso Form & UI Components */
        .cv-riso .riso-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 3px solid var(--ink); background-color: var(--ink); color: #f6f5ef; padding: 0.75rem 1.5rem; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 7px 7px 0 var(--ink); transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .cv-riso .riso-btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .cv-riso .riso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-btn-ghost { background-color: transparent; color: var(--ink); }
        .cv-riso .riso-card { border: 3px solid var(--ink); background-color: #ffffff; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-input { width: 100%; border: 3px solid var(--ink); background-color: #ffffff; padding: 0.75rem 1rem; font-family: var(--fm); font-size: 0.875rem; color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transition: all 0.2s; outline: none; }
        .cv-riso .riso-input:focus { box-shadow: none; transform: translate(2px, 2px); border-color: var(--verm); }
        .cv-riso .riso-label { display: block; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; color: var(--ink); }
        .cv-riso .riso-chip { display: inline-flex; align-items: center; gap: 0.25rem; border: 2px solid var(--ink); padding: 0.25rem 0.5rem; font-family: var(--fm); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; color: var(--ink); background: #ffffff; }
      `}</style>
      <div className="grain" />
      {ticker && <RisoTicker />}
      <RisoNav />
      <main className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8">{children}</main>
      <RisoFooter />
    </div>
  );
}