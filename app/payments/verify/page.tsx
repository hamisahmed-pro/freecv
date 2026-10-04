'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Status = 'loading' | 'success' | 'failed' | 'error';

function VerifyInner() {
  const params = useSearchParams();
  const reference = params.get('reference');
  const [status, setStatus] = useState<Status>(reference ? 'loading' : 'error');
  const [detail, setDetail] = useState({ inr: '', ngn: '', paidAt: '' });
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
          setDetail({ inr: d.inr_amount, ngn: d.ngn_amount, paidAt: d.paid_at });
        } else {
          setStatus('failed');
          setMessage(d.error || 'Payment could not be verified.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Network error while verifying. Please check with the recipient before paying again.');
      });
  }, [reference]);

  return (
    <main className="min-h-screen bg-[#0e1330] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 backdrop-blur">
          {status === 'loading' && (
            <>
              <div className="mx-auto mb-5 h-10 w-10 rounded-full border-2 border-white/20 border-t-indigo-400 animate-spin" />
              <h1 className="text-xl font-semibold">Verifying your payment…</h1>
              <p className="text-white/50 text-sm mt-2">Please wait, this takes a few seconds.</p>
            </>
          )}
          {status === 'success' && (
            <>
              <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center">
                <span className="text-2xl text-emerald-300">✓</span>
              </div>
              <h1 className="text-2xl font-bold">Payment successful</h1>
              <p className="text-white/60 text-sm mt-3">
                ₹{Number(detail.inr).toLocaleString('en-IN')} received. Thank you!
              </p>
              <p className="text-white/30 text-xs mt-4 break-all">Ref: {reference}</p>
            </>
          )}
          {status === 'failed' && (
            <>
              <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-red-500/15 border border-red-400/30 flex items-center justify-center">
                <span className="text-2xl text-red-300">✕</span>
              </div>
              <h1 className="text-2xl font-bold">Payment not completed</h1>
              <p className="text-white/60 text-sm mt-3">{message}</p>
              <a
                href="/payments"
                className="inline-block mt-6 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 transition-colors"
              >
                Try again
              </a>
            </>
          )}
          {status === 'error' && (
            <>
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-white/60 text-sm mt-3">
                {message || 'No payment reference was found.'}
              </p>
              <a
                href="/payments"
                className="inline-block mt-6 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-6 py-3 transition-colors"
              >
                Back to payments
              </a>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0e1330] text-white flex items-center justify-center">
          <p className="text-white/50">Loading…</p>
        </main>
      }
    >
      <VerifyInner />
    </Suspense>
  );
}
