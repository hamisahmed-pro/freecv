"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";
import { ArrowRight, Loader2, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

type Phase = "checking" | "ready" | "expired" | "done";

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // PKCE-style links arrive with ?code=… — exchange it for a session.
        const code = params.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // Hash-fragment links (#access_token=…&type=recovery) are picked up
        // automatically by the client on page load.
        const { data } = await supabase.auth.getSession();
        if (!cancelled) setPhase(data.session?.user ? "ready" : "expired");
      } catch {
        if (!cancelled) setPhase("expired");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      setPhase("done");
    } catch (err: any) {
      toast.error(err.message || "Couldn't update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <V3Page pageName="recruiter_reset_password" logoSub="RECRUITER">
      <div className="mx-auto max-w-[520px] py-10">
        <div className="text-center">
          <V3Eyebrow>§ recruiter password reset</V3Eyebrow>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-navy sm:text-4xl">
            Choose a new password
          </h1>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          {phase === "checking" && (
            <div className="flex items-center justify-center gap-3 py-10 text-navy/60">
              <Loader2 size={22} className="animate-spin text-brand" />
              <span className="text-sm font-semibold">Verifying your reset link…</span>
            </div>
          )}

          {phase === "expired" && (
            <div className="text-center">
              <AlertTriangle size={36} className="mx-auto mb-4 text-coral" />
              <h2 className="text-xl font-extrabold tracking-tight text-navy">
                This link is invalid or has expired
              </h2>
              <p className="mt-2 text-sm text-navy/60">
                Reset links are single-use and expire after a short while. Request a fresh one
                and try again.
              </p>
              <Link
                href="/recruiter/login"
                className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral"
              >
                Back to sign in <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {phase === "done" && (
            <div className="text-center">
              <CheckCircle2 size={36} className="mx-auto mb-4 text-teal" />
              <h2 className="text-xl font-extrabold tracking-tight text-navy">
                Password updated
              </h2>
              <p className="mt-2 text-sm text-navy/60">
                Your new password is live. Head to your hiring dashboard.
              </p>
              <button
                onClick={() => {
                  router.push("/recruiter/dashboard");
                  router.refresh();
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral"
              >
                Go to dashboard <ArrowRight size={14} />
              </button>
            </div>
          )}

          {phase === "ready" && (
            <form onSubmit={handleSubmit} className="grid gap-[15px]">
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">
                  New password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy outline-none transition-colors placeholder:font-normal placeholder:text-navy/35 focus:border-brand"
                />
              </div>
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat new password"
                  autoComplete="new-password"
                  className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy outline-none transition-colors placeholder:font-normal placeholder:text-navy/35 focus:border-brand"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] bg-navy px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                Set new password
              </button>
            </form>
          )}
        </div>
      </div>
    </V3Page>
  );
}

export default function RecruiterResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <V3Page pageName="recruiter_reset_password" logoSub="RECRUITER">
          <div className="mx-auto max-w-[520px] py-10 text-center text-navy/60">Loading…</div>
        </V3Page>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
