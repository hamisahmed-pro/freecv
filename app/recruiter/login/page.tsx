"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

/** Where to land after sign-in. Only same-origin relative paths are honored. */
function useNextPath() {
  const params = useSearchParams();
  const n = params.get("next") || "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/recruiter/dashboard";
}

function RecruiterLoginInner() {
  const router = useRouter();
  const nextPath = useNextPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) router.push(nextPath);
    });
  }, [router, nextPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Signed in.");
      router.push(nextPath);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://cvyon.com/recruiter/dashboard" },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://cvyon.com/recruiter/reset-password",
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email.");
      setIsReset(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <V3Page pageName="recruiter_login" logoSub="RECRUITER">
      <div className="mx-auto max-w-[520px] py-10">
        <div className="text-center">
          <V3Eyebrow>§ recruiter sign in</V3Eyebrow>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
            Welcome back.
          </h1>
          <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Sign in to search the opt-in talent pool.
          </p>
        </div>

        <div className="mt-8 rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
          {!isReset && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-3 text-[12px] font-extrabold text-navy transition-all hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  Google
                </button>
                <button
                  onClick={() => handleOAuth("linkedin_oidc")}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-3 text-[12px] font-extrabold text-navy transition-all hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  LinkedIn
                </button>
              </div>
              <div className="my-[22px] flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                <span className="h-px flex-1 bg-line" />
                or email
                <span className="h-px flex-1 bg-line" />
              </div>
            </>
          )}

          {isReset ? (
            <form onSubmit={handleReset} className="grid gap-[15px]">
              <h2 className="text-xl font-extrabold tracking-tight text-navy">Reset password</h2>
              <p className="text-sm text-muted">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                  placeholder="you@company.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy px-[18px] py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Send link"}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsReset(false)}
                className="w-full text-center text-xs font-bold uppercase tracking-wider text-muted hover:text-coral"
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="grid gap-[15px]">
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                  placeholder="you@company.com"
                />
              </div>
              <div className="grid gap-[7px]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsReset(true)}
                    className="text-[10px] font-bold uppercase tracking-wider text-brand hover:text-coral"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-[10px] bg-navy px-[18px] py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          No account?{" "}
          <Link href="/recruiter/signup" className="font-extrabold text-coral underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </V3Page>
  );
}

export default function RecruiterLogin() {
  return (
    <Suspense fallback={null}>
      <RecruiterLoginInner />
    </Suspense>
  );
}