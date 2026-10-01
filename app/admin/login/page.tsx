"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Logo } from "@/components/brand/Logo";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      toast.success("Signed in successfully");
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Invalid credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream p-6">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-line bg-paper p-8 shadow-[0_16px_38px_rgba(23,27,75,0.09)] sm:p-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Logo size={30} wordSize={24} sub="ADMIN" />
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-lavender">
              <Lock size={18} className="text-brand" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="admin-email" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-navy/60">Admin email</label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-sm text-navy outline-none transition-shadow placeholder:text-navy/35 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                placeholder="admin@cvyon.com"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="admin-password" className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-navy/60">Password</label>
              <input
                id="admin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-paper px-4 py-3 text-sm text-navy outline-none transition-shadow placeholder:text-navy/35 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm font-bold text-coral">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral disabled:opacity-60"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              {isLoading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
          Cvyon Admin
        </p>
      </div>
    </div>
  );
}
