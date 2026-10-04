'use client';

import { useMemo, useState } from 'react';

const INR_TO_NGN = 13.82;
const MIN_INR = 100;
const MAX_INR = 500000;

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatNGN(n: number) {
  return '₦' + n.toLocaleString('en-NG', { maximumFractionDigits: 2 });
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

  const ngn = inr * INR_TO_NGN;

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
    <main className="min-h-screen bg-[#0e1330] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Make a Payment</h1>
          <p className="text-white/60 mt-2 text-sm">
            Enter any amount in Indian Rupees. You&apos;ll be charged the Naira equivalent securely via Paystack.
          </p>
        </div>

        <form
          onSubmit={handlePay}
          className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur"
        >
          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="pay-email">
            Email address
          </label>
          <input
            id="pay-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl bg-white/5 border border-white/15 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 mb-5"
          />

          <label className="block text-sm font-medium text-white/80 mb-2" htmlFor="pay-amount">
            Amount (INR)
          </label>
          <div className="relative mb-2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">₹</span>
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
              className="w-full rounded-xl bg-white/5 border border-white/15 pl-10 pr-4 py-3 text-white text-lg placeholder:text-white/30 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </div>
          <p className="text-xs text-white/40 mb-5">
            Minimum {formatINR(MIN_INR)} · Maximum {formatINR(MAX_INR)}
          </p>

          <div className="rounded-xl bg-indigo-500/10 border border-indigo-400/20 px-4 py-3 mb-6 flex items-center justify-between">
            <span className="text-sm text-white/60">You will be charged</span>
            <span className="text-xl font-bold text-indigo-300">
              {inr > 0 ? formatNGN(ngn) : '₦0.00'}
            </span>
          </div>
          <p className="text-xs text-white/40 -mt-4 mb-6">
            Converted at 1 INR = ₦{INR_TO_NGN}. Your card is charged in Naira.
          </p>

          {error && (
            <p className="text-sm text-red-300 bg-red-500/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!valid || submitting}
            className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white font-semibold py-3.5 transition-colors"
          >
            {submitting ? 'Redirecting to Paystack…' : inr > 0 ? `Pay ${formatINR(inr)}` : 'Pay with Paystack'}
          </button>

          <p className="text-xs text-white/30 text-center mt-4">
            Secured by Paystack · Card charged in NGN (₦)
          </p>
        </form>
      </div>
    </main>
  );
}
