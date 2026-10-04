'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ['latin'], weight: '400', display: 'swap' });
const head = Archivo({ subsets: ['latin'], weight: ['800'], display: 'swap' });
const body = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], display: 'swap' });

const MIN_INR = 100;
const MAX_INR = 500000;

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

export default function PaymentsPage() {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const inr = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [amount]);

  const valid =
    inr >= MIN_INR && inr <= MAX_INR && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), inr_amount: inr }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not start the payment. Please try again.');
        setSubmitting(false);
        return;
      }
      window.location.href = data.authorization_url;
    } catch {
      setError('Network error. Please check your connection and try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className={`${body.className} min-h-screen bg-[#E8E7E1] text-[#141312]`}>
      <style>{`
        .pay-dots{background-image:radial-gradient(#14131218 1.2px,transparent 1.2px);background-size:22px 22px}
        .pay-hs{box-shadow:8px 8px 0 #141312}
        .pay-hs-sm{box-shadow:5px 5px 0 #141312}
      `}</style>

      {/* Header */}
      <header className="border-b-[3px] border-[#141312]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <Image src="/logo-dark-no-background.png" alt="Cvyon" width={130} height={32} className="h-8 w-auto" />
          <span className={`${mono.className} border-[3px] border-[#141312] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] pay-hs-sm`}>
            Secure payment
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="pay-dots flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="border-[3px] border-[#141312] bg-white pay-hs">
            <div className="border-b-[3px] border-[#141312] bg-[#FF4326] px-6 py-3">
              <span className={`${mono.className} text-[11px] font-bold uppercase tracking-[0.25em] text-white`}>
                Cvyon · Payments
              </span>
            </div>

            <form onSubmit={handlePay} className="p-6 sm:p-8">
              <h1 className={`${display.className} text-4xl leading-none`}>
                Pay in<br />rupees.
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#141312]/70">
                Enter any amount in Indian Rupees and complete your payment securely through Paystack.
              </p>

              <label htmlFor="pay-email" className={`${mono.className} mt-7 block text-[11px] font-bold uppercase tracking-[0.2em]`}>
                Email address
              </label>
              <input
                id="pay-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border-[3px] border-[#141312] bg-[#E8E7E1]/60 px-4 py-3 text-[15px] outline-none placeholder:text-[#141312]/30 focus:bg-white"
              />

              <label htmlFor="pay-amount" className={`${mono.className} mt-5 block text-[11px] font-bold uppercase tracking-[0.2em]`}>
                Amount (INR)
              </label>
              <div className="relative mt-2">
                <span className={`${head.className} pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#141312]/40`}>₹</span>
                <input
                  id="pay-amount"
                  type="number"
                  required
                  min={MIN_INR}
                  max={MAX_INR}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="20000"
                  className={`${head.className} w-full border-[3px] border-[#141312] bg-[#E8E7E1]/60 py-3 pl-11 pr-4 text-2xl font-extrabold outline-none placeholder:text-[#141312]/30 focus:bg-white`}
                />
              </div>
              <p className={`${mono.className} mt-2 text-[11px] uppercase tracking-[0.14em] text-[#141312]/50`}>
                Min {formatINR(MIN_INR)} · Max {formatINR(MAX_INR)}
              </p>

              {error && (
                <p className="mt-5 border-[3px] border-[#141312] bg-[#FF4326] px-4 py-3 text-sm font-bold text-white">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!valid || submitting}
                className={`${head.className} mt-7 w-full border-[3px] border-[#141312] bg-[#FF4326] px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-white pay-hs-sm transition-all enabled:hover:translate-x-[2px] enabled:hover:translate-y-[2px] enabled:hover:shadow-none disabled:cursor-not-allowed disabled:bg-[#141312]/15 disabled:text-[#141312]/40 disabled:shadow-none`}
              >
                {submitting ? 'Redirecting…' : inr > 0 ? `Pay ${formatINR(inr)}` : 'Pay with Paystack'}
              </button>

              <p className={`${mono.className} mt-5 text-center text-[10px] uppercase tracking-[0.22em] text-[#141312]/40`}>
                Secured by Paystack
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
