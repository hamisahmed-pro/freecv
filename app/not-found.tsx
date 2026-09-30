import Link from "next/link";
import { RisoPage } from "@/components/riso/RisoChrome";

export default function NotFound() {
  return (
    <RisoPage pageName="not_found">
      <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center py-20 text-center">
        <div className="fm mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]">
          <span className="inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-3 py-1.5 hs">
            § error 404
          </span>
        </div>
        <h1 className="fd text-[22vw] leading-[0.86] tracking-[-0.02em] text-[#151a46] sm:text-8xl">
          Lost?
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-[#151a46]/70">
          This page doesn&apos;t exist. It may have been moved, deleted, or you
          typed the address wrong.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="riso-btn">
            Back home
          </Link>
          <Link href="/build" className="riso-btn riso-btn-ghost">
            Build my resume
          </Link>
          <Link href="/support" className="riso-btn riso-btn-ghost">
            Contact support
          </Link>
        </div>
      </section>
    </RisoPage>
  );
}
