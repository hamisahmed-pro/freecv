import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";

export default function NotFound() {
  return (
    <V3Page pageName="not_found">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center py-20 text-center">
        <V3Eyebrow>§ error 404</V3Eyebrow>
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-lavender">
          <Compass size={36} className="text-brand" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-navy sm:text-6xl">
          Lost? Let&apos;s get you back.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-muted">
          This page doesn&apos;t exist. It may have been moved, deleted, or the
          address was typed wrong.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 rounded-[10px] bg-navy px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral"
          >
            Back home
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/build"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px hover:border-brand hover:text-brand"
          >
            Build my resume
          </Link>
          <Link
            href="/support"
            className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px hover:border-brand hover:text-brand"
          >
            Contact support
          </Link>
        </div>
      </section>
    </V3Page>
  );
}
