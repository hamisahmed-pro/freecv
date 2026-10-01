"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { AnalyticsTracker } from "@/components/landing/AnalyticsTracker";

export type V3NavLink = { href: string; label: string };

const DEFAULT_LINKS: V3NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/build", label: "Builder" },
  { href: "/recruiter", label: "For recruiters" },
  { href: "/support", label: "Support" },
];

const FOOTER_COLS: [string, { label: string; href: string }[]][] = [
  [
    "Product",
    [
      { label: "Builder", href: "/build" },
      { label: "ATS Grader", href: "/ats-grader" },
      { label: "Cover Letter", href: "/cover-letter" },
      { label: "Templates", href: "/build" },
    ],
  ],
  [
    "Company",
    [
      { label: "Career Blog", href: "/blog" },
      { label: "Recruiter Portal", href: "/recruiter" },
      { label: "Support", href: "/support" },
    ],
  ],
  [
    "Legal",
    [
      { label: "Privacy & GDPR", href: "/privacy" },
      { label: "Manage Data", href: "/manage-data" },
      { label: "Terms", href: "/terms" },
    ],
  ],
];

export function V3Nav({
  logoSub,
  links = DEFAULT_LINKS,
  cta = { label: "Build free →", href: "/build" },
}: {
  logoSub?: string;
  links?: V3NavLink[];
  cta?: { label: string; href: string };
}) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Topline — hidden on mobile so content starts immediately (matches approved landing behavior) */}
      <div
        aria-hidden="true"
        className="hidden h-[5px] md:block"
        style={{ background: "linear-gradient(90deg,#5548f5,#24c9bd,#ff604b)" }}
      />
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between gap-6 px-5">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Cvyon home">
            <Logo size={30} wordSize={22} />
            {logoSub && (
              <span className="mt-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-muted">
                {logoSub}
              </span>
            )}
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[12px] font-extrabold text-[#565a70] transition-colors hover:text-brand",
                  pathname === l.href && "text-brand"
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href={cta.href}
              className="hidden items-center gap-2 rounded-[10px] bg-brand px-[18px] py-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition-transform hover:-translate-y-px sm:inline-flex"
            >
              {cta.label}
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper md:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-cream md:hidden">
          <div className="flex h-[72px] items-center justify-between border-b border-line px-5">
            <Logo size={30} wordSize={22} />
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-5 pt-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-line py-5 font-brand text-2xl font-extrabold tracking-tight",
                  pathname === l.href ? "text-coral" : "text-navy"
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={cta.href}
              onClick={() => setOpen(false)}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand px-[18px] py-4 text-[13px] font-extrabold text-white"
            >
              {cta.label} <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}

export function V3Footer() {
  return (
    <footer className="border-t border-line bg-[#f2f1ea]">
      <div className="mx-auto max-w-[1120px] px-5 py-[42px]">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block" aria-label="Cvyon home">
              <Logo size={30} wordSize={22} />
            </Link>
            <p className="mt-3 max-w-[240px] text-[12px] leading-relaxed text-[#696d80]">
              Build a clearer resume. Understand how recruiters and ATS systems read it.
            </p>
          </div>
          {FOOTER_COLS.map(([h, items]) => (
            <div key={h}>
              <h4 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#8a8d9d]">
                {h}
              </h4>
              {items.map((it) => (
                <Link
                  key={it.label}
                  href={it.href}
                  className="block py-[3.5px] text-[12px] text-[#696d80] transition-colors hover:text-brand"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-7 border-t border-[#d9dae0] pt-[18px] text-[10px] font-medium uppercase tracking-[0.08em] text-[#8a8d9d]">
          © 2026 Cvyon · Built in the open · Free for candidates, funded by recruiters
        </div>
      </div>
    </footer>
  );
}

/* Page shell: topline + nav + footer + analytics, on the v3 cream surface.
 * All six inner pages (recruiter, signup, dashboard, privacy, manage-data,
 * support) wrap in this so chrome stays consistent. */
export function V3Page({
  pageName,
  logoSub,
  links,
  cta,
  children,
  wide = false,
}: {
  pageName: string;
  logoSub?: string;
  links?: V3NavLink[];
  cta?: { label: string; href: string };
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cream font-brand text-navy antialiased">
      <AnalyticsTracker />
      <V3Nav logoSub={logoSub} links={links} cta={cta} />
      <main className={cn("mx-auto px-5 py-14", wide ? "max-w-[1120px]" : "max-w-[1120px]")}>
        {children}
      </main>
      <V3Footer />
    </div>
  );
}

/* Small shared bits matching the mockup language */
export function V3Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-[14px] text-[11px] font-black uppercase tracking-[0.13em] text-brand">
      {children}
    </div>
  );
}

export function V3Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full bg-lavender px-[11px] py-[7px] text-[10px] font-black uppercase tracking-[0.1em] text-brand">
      {children}
    </span>
  );
}
