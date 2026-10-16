'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';

type Status = 'loading' | 'success' | 'failed' | 'error';

function VerifyInner() {
  const params = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<Status>(reference ? 'loading' : 'error');
  const [inrAmount, setInrAmount] = useState('');
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
          setInrAmount(d.inr_amount);
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
    <div className="min-h-screen bg-cream font-brand text-ink antialiased">
      <header className="border-b border-line bg-paper/90">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <Logo />
          <span className="rounded-full border border-line bg-mint px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-navy">
            Secure payment
          </span>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="v3-card !p-0 overflow-hidden">
            <div className="border-b border-line bg-navy px-6 py-4 sm:px-8">
              <span className="v3-eyebrow !text-white/90">Cvyon · Payments</span>
            </div>

            <div className="px-6 py-8 text-center sm:px-8">
              {status === 'loading' && (
                <>
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gold">
                    <span className="animate-pulse text-2xl font-black text-navy">…</span>
                  </div>
                  <h1 className="v3-h-display text-3xl">Verifying…</h1>
                  <p className="mt-3 text-[15px] text-muted">Please wait, this takes a few seconds.</p>
                </>
              )}
              {status === 'success' && (
                <>
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-teal shadow-[4px_4px_0_#151a46]">
                    <span className="text-3xl font-black text-white">✓</span>
                  </div>
                  <h1 className="v3-h-display text-3xl">Payment successful.</h1>
                  <p className="mt-3 text-[15px] text-muted">
                    ₹{Number(inrAmount).toLocaleString('en-IN')} received. Thank you!
                  </p>
                  <p className="mt-4 break-all text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
                    Ref: {reference}
                  </p>
                </>
              )}
              {status === 'failed' && (
                <>
                  <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-coral shadow-[4px_4px_0_#151a46]">
                    <span className="text-3xl font-black text-white">✕</span>
                  </div>
                  <h1 className="v3-h-display text-3xl">Not completed.</h1>
                  <p className="mt-3 text-[15px] text-muted">{message}</p>
                  <a href="/payments" className="v3-btn v3-btn-primary mt-6 px-8 py-3 text-sm">
                    Try again
                  </a>
                </>
              )}
              {status === 'error' && (
                <>
                  <h1 className="v3-h-display text-3xl">Something went wrong.</h1>
                  <p className="mt-3 text-[15px] text-muted">{message || 'No payment reference was found.'}</p>
                  <a href="/payments" className="v3-btn v3-btn-primary mt-6 px-8 py-3 text-sm">
                    Back to payments
                  </a>
                </>
              )}
            </div>
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
        <main className="flex min-h-screen items-center justify-center bg-cream">
          <p className="text-muted">Loading…</p>
        </main>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
