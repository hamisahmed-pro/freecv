import Link from "next/link";
import { Diamond, Download, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { V3Page, V3Eyebrow, V3Pill } from "@/components/v3/V3Chrome";

export const metadata: Metadata = {
  title: 'Manage Your Data — Cvyon',
  description: 'Request an export or deletion of your Cvyon data.',
  robots: 'noindex, nofollow',
  alternates: { canonical: 'https://cvyon.com/manage-data' },
};

export default function ManageDataPage() {
  return (
    <V3Page
      pageName="manage-data"
      logoSub="BUILD • GET HIRED"
      cta={{ label: "Build free →", href: "/build" }}
    >
      <div className="mx-auto max-w-[860px]">
        {/* Hero */}
        <div className="pb-[30px] pt-[70px] text-center">
          <div className="mx-auto mb-[18px] grid h-[44px] w-[44px] place-items-center rounded-[12px] bg-lavender text-brand">
            <Diamond size={22} />
          </div>
          <V3Eyebrow>Privacy centre</V3Eyebrow>
          <h1 className="text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy md:text-[52px]">
            Your privacy, your control.
          </h1>
          <p className="mx-auto mt-[18px] max-w-[650px] text-[17px] leading-relaxed text-muted">
            Cvyon is committed to radical transparency. You have complete control over your
            data.
          </p>
        </div>

        {/* Card with the two panels */}
        <div className="rounded-[18px] border border-line bg-paper p-6 shadow-[0_16px_38px_rgba(23,27,75,0.09)] md:p-7">
          <div className="grid grid-cols-1 gap-[28px] md:grid-cols-2">
            {/* Download my data */}
            <article className="rounded-[18px] border border-line bg-cream p-[22px]">
              <div className="grid h-[44px] w-[44px] place-items-center rounded-[12px] bg-lavender text-brand">
                <Download size={22} />
              </div>
              <h3 className="mt-4 text-[20px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                Download my data
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Request a JSON export of all data associated with your email address in our
                Talent CRM, including your parsed resume data, location, and metadata.
              </p>
              <a
                href="mailto:support@cvyon.com?subject=Data%20export%20request"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-[10px] bg-lavender px-[18px] py-3 text-[12px] font-extrabold text-brand transition-transform hover:-translate-y-px"
              >
                Email support@cvyon.com
              </a>
            </article>

            {/* Delete my data */}
            <article className="rounded-[18px] border border-line bg-coral/5 p-[22px]">
              <div className="grid h-[44px] w-[44px] place-items-center rounded-[12px] bg-coral/10 text-coral">
                <Trash2 size={22} />
              </div>
              <h3 className="mt-4 text-[20px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
                Delete my data
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Permanently erase your profile, resume data, and all traces of your email
                from our Talent CRM.
              </p>
              <a
                href="mailto:support@cvyon.com?subject=Data%20deletion%20request"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold text-white transition-transform hover:-translate-y-px"
              >
                Email support@cvyon.com
              </a>
            </article>
          </div>

          <div className="mt-[30px] text-center">
            <Link href="/build">
              <V3Pill>← Return to builder</V3Pill>
            </Link>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
