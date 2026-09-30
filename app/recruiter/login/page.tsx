"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RisoPage } from "@/components/riso/RisoChrome";
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
        redirectTo: "https://cvyon.com/recruiter/dashboard",
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
    <RisoPage pageName="recruiter_login">
      <div className="mx-auto flex max-w-md flex-col py-10">
        <div className="fm mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]">
          <span className="inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-3 py-1.5 hs">
            § recruiter sign in
          </span>
        </div>
        <h1 className="fd text-5xl leading-[0.86] tracking-[-0.02em] sm:text-6xl">
          Welcome back.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#151a46]/70">
          Sign in to search the opt-in talent pool.
        </p>

        <div className="mt-8 border-[3px] border-[#151a46] bg-white hs p-8">
          {!isReset && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-4 py-3.5 fh text-xs font-extrabold uppercase tracking-wider transition-all hover:bg-[#151a46] hover:text-[#f6f5ef]"
                >
                  Google
                </button>
                <button
                  onClick={() => handleOAuth("linkedin_oidc")}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-4 py-3.5 fh text-xs font-extrabold uppercase tracking-wider transition-all hover:bg-[#151a46] hover:text-[#f6f5ef]"
                >
                  LinkedIn
                </button>
              </div>
              <div className="my-6 flex items-center gap-4">
                <span className="h-[3px] flex-1 bg-[#151a46]/15" />
                <span className="fm text-[10px] font-bold uppercase tracking-widest text-[#151a46]/50">or email</span>
                <span className="h-[3px] flex-1 bg-[#151a46]/15" />
              </div>
            </>
          )}

          {isReset ? (
            <form onSubmit={handleReset} className="space-y-5">
              <h2 className="fh text-xl font-extrabold tracking-tight">Reset Password</h2>
              <p className="text-sm text-[#151a46]/70">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
              <div>
                <label className="fh text-xs font-extrabold uppercase tracking-wider">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b] focus:translate-x-[2px] focus:translate-y-[2px]"
                  placeholder="you@company.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[7px_7px_0_#151a46]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Send link"}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsReset(false)}
                className="fm w-full text-center text-xs font-bold uppercase tracking-wider text-[#151a46]/60 hover:text-[#ff604b]"
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="fh text-xs font-extrabold uppercase tracking-wider">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b] focus:translate-x-[2px] focus:translate-y-[2px]"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="fh text-xs font-extrabold uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsReset(true)}
                    className="fm text-[10px] font-bold uppercase tracking-wider text-[#5548f5] hover:text-[#ff604b]"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b] focus:translate-x-[2px] focus:translate-y-[2px]"
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[7px_7px_0_#151a46]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign in"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[#151a46]/60">
          No account?{" "}
          <Link href="/recruiter/signup" className="fh font-extrabold text-[#ff604b] underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </RisoPage>
  );
}

export default function RecruiterLogin() {
  return (
    <Suspense fallback={null}>
      <RecruiterLoginInner />
    </Suspense>
  );
}