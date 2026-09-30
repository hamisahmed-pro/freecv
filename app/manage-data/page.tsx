import React from 'react';
import Link from 'next/link';
import { Shield, Trash2, Download } from 'lucide-react';
import type { Metadata } from 'next';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: 'Manage Your Data — Cvyon',
  description: 'Request an export or deletion of your Cvyon data.',
  robots: 'noindex, nofollow',
  alternates: { canonical: 'https://cvyon.com/manage-data' },
};

export default function ManageDataPage() {
  return (
    <div className={`cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden flex items-center justify-center p-6 ${body.className}`}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
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

      <div className="max-w-2xl w-full riso-card p-8 sm:p-12">
        <div className="flex justify-center mb-6">
          <div className="bg-[#f6f5ef] p-4 border-[3px] border-[#151a46] text-[#5548f5]">
            <Shield size={48} />
          </div>
        </div>

        <h1 className="fd text-3xl tracking-tight text-center mb-4">Your Privacy Matters</h1>
        <p className="text-[#151a46]/70 text-center mb-10 text-sm font-medium">
          Cvyon is committed to radical transparency. You have complete control over your data. If you opted into our Talent CRM, you can download everything we have on you or delete it permanently.
        </p>

        <div className="space-y-6">
          {/* Download Data */}
          <div className="border-[3px] border-[#151a46] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#f6f5ef] p-3 border-[3px] border-[#151a46] shrink-0 mt-1">
                <Download size={24} className="text-[#151a46]" />
              </div>
              <div>
                <h3 className="fh text-lg font-extrabold">Download My Data</h3>
                <p className="text-sm text-[#151a46]/70 mt-1 mb-4">
                  Request a JSON export of all data associated with your email address in our Talent CRM, including your full parsed resume data, location, and metadata.
                </p>
                <div className="border-[3px] border-[#151a46] bg-[#f6f5ef] px-4 py-3 text-sm font-bold">
                  Export and delete requests: email <a href="mailto:support@cvyon.com" className="text-[#5548f5] underline">support@cvyon.com</a>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Data */}
          <div className="border-[3px] border-[#151a46] bg-white p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#ff604b]/10 p-3 border-[3px] border-[#ff604b] shrink-0 mt-1">
                <Trash2 size={24} className="text-[#ff604b]" />
              </div>
              <div>
                <h3 className="fh text-lg font-extrabold">Delete My Data</h3>
                <p className="text-sm text-[#151a46]/70 mt-1 mb-4">
                  Permanently erase your profile, resume data, and all traces of your email from our Talent CRM. This action cannot be undone.
                </p>
                <div className="border-[3px] border-[#151a46] bg-[#f6f5ef] px-4 py-3 text-sm font-bold">
                  Export and delete requests: email <a href="mailto:support@cvyon.com" className="text-[#5548f5] underline">support@cvyon.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/build" className="fm text-sm font-bold text-[#151a46]/70 hover:text-[#ff604b] transition-colors uppercase tracking-[0.18em]">
            ← Return to Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
