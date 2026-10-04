'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ['latin'], weight: '400', display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

type Status = 'loading' | 'success' | 'failed' | 'error';

function VerifyInner() {
  const params = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<Status>(reference ? 'loading' : 'error');
  const [detail, setDetail] = useState({ inr: '', paidAt: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!reference) return;
    fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reference }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) {
          setStatus('success');
          setDetail({ inr: d.inr_amount, paidAt: d.paid_at });
        } else {
          setStatus('failed');
          setMessage(d.error || 'Payment could not be verified.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error while verifying. Please confirm with the recipient before paying again.');
      });
  }, [reference]);

  return (
    <div className={`${body.className} min-h-screen bg-[#E8E7E1] text-[#141312]`}>
      <style>{`
        .pay-dots{background-image:radial-gradient(#14131218 1.2px,transparent 1.2px);background-size:22px 22px}
        .pay-hs{box-shadow:8px 8px 0 #141312}
        .pay-hs-sm{box-shadow:5px 5px 0 #141312}
        .pay-blink{animation:payblink 1.1s steps(2,start) infinite} @keyframes payblink{50%{opacity:.15}}
      `}</style>

      <header className="border-b-[3px] border-[#141312]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <Image src="/logo-dark-no-background.png" alt="Cvyon" width={130} height={32} className="h-8 w-auto" />
          <span className={`${mono.className} border-[3px] border-[#141312] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] pay-hs-sm`}>
            Secure payment
          </span>
        </div>
      </header>

      <main className="pay-dots flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md border-[3px] border-[#141312] bg-white pay-hs">
          <div className="border-b-[3px] border-[#141312] bg-[#141312] px-6 py-3">
            <span className={`${mono.className} text-[11px] font-bold uppercase tracking-[0.25em] text-[#E8E7E1]`}>
              Cvyon · Payments
            </span>
          </div>

          <div className="p-6 text-center sm:p-8">
            {status === 'loading' && (
              <>
                <div className="pay-blink mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border-[3px] border-[#141312] bg-[#FFE14D]">
                  <span className={`${mono.className} text-xl font-bold`}>…</span>
                </div>
                <h1 className={`${display.className} text-3xl`}>Verifying…</h1>
                <p className="mt-3 text-[15px] text-[#141312]/70">Please wait, this takes a few seconds.</p>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border-[3px] border-[#141312] bg-[#2233FF] pay-hs-sm">
                  <span className="text-3xl font-black text-white">✓</span>
                </div>
                <h1 className={`${display.className} text-3xl leading-tight`}>Payment<br />successful.</h1>
                <p className="mt-3 text-[15px] text-[#141312]/70">
                  ₹{Number(detail.inr).toLocaleString('en-IN')} received. Thank you!
                </p>
                <p className={`${mono.className} mt-4 break-all text-[10px] uppercase tracking-[0.18em] text-[#141312]/40`}>
                  Ref: {reference}
                </p>
              </>
            )}
            {status === 'failed' && (
              <>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border-[3px] border-[#141312] bg-[#FF4326] pay-hs-sm">
                  <span className="text-3xl font-black text-white">✕</span>
                </div>
                <h1 className={`${display.className} text-3xl leading-tight`}>Not<br />completed.</h1>
                <p className="mt-3 text-[15px] text-[#141312]/70">{message}</p>
                <a
                  href="/payments"
                  className="mt-6 inline-block border-[3px] border-[#141312] bg-[#FF4326] px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-white pay-hs-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  Try again
                </a>
              </>
            )}
            {status === 'error' && (
              <>
                <h1 className={`${display.className} text-3xl leading-tight`}>Something<br />went wrong.</h1>
                <p className="mt-3 text-[15px] text-[#141312]/70">{message || 'No payment reference was found.'}</p>
                <a
                  href="/payments"
                  className="mt-6 inline-block border-[3px] border-[#141312] bg-[#FF4326] px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-white pay-hs-sm transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                >
                  Back to payments
                </a>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#E8E7E1]">
          <p className="text-[#141312]/50">Loading…</p>
        </main>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
