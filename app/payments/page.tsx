'use client';

import { useMemo, useState } from 'react';
import { Logo } from '@/components/brand/Logo';

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
    <div className="min-h-screen bg-cream font-brand text-ink antialiased">
      {/* Header */}
      <header className="border-b border-line bg-paper/90">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-4">
          <Logo />
          <span className="rounded-full border border-line bg-mint px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-navy">
            Secure payment
          </span>
        </div>
      </header>

      {/* Body */}
      <main className="flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md">
          <div className="v3-card !p-0 overflow-hidden">
            <div className="border-b border-line bg-lavender px-6 py-4 sm:px-8">
              <span className="v3-eyebrow">Cvyon · Payments</span>
            </div>

            <form onSubmit={handlePay} className="px-6 py-7 sm:px-8">
              <h1 className="v3-h-display text-[40px]">Pay in rupees.</h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                Enter any amount in Indian Rupees and complete your payment securely through Paystack.
              </p>

              <div className="v3-field mt-7">
                <label htmlFor="pay-email">Email address</label>
                <input
                  id="pay-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="v3-field mt-5">
                <label htmlFor="pay-amount">Amount (INR)</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-extrabold text-muted">₹</span>
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
                    className="!pl-10 !text-xl !font-extrabold"
                  />
                </div>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  Min {formatINR(MIN_INR)} · Max {formatINR(MAX_INR)}
                </p>
              </div>

              {error && (
                <p className="mt-5 rounded-[10px] border border-coral bg-[#ffe1dc] px-4 py-3 text-sm font-bold text-navy">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!valid || submitting}
                className="v3-btn v3-btn-primary mt-7 w-full !py-4 text-[15px] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {submitting ? 'Redirecting…' : inr > 0 ? `Pay ${formatINR(inr)}` : 'Pay with Paystack'}
              </button>

              <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
                Secured by Paystack
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
