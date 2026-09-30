"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { RisoPage } from "@/components/riso/RisoChrome";
import { ArrowRight, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

const PLAN_NAMES: Record<string, string> = {
  payg: "Pay as you go",
  enterprise: "Enterprise",
};

function SelectedPlanLine() {
  const params = useSearchParams();
  const name = PLAN_NAMES[params.get("plan") || ""] || null;
  if (!name) return null;
  return (
    <p className="mt-3 fm text-[11px] font-bold uppercase tracking-[0.22em] text-[#151a46]/60">
      Selected plan: {name}
    </p>
  );
}

export default function RecruiterSignup() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) router.push("/recruiter/dashboard");
    });
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const BANNED_DOMAINS = [
      "yopmail.com", "mailinator.com", "guerrillamail.com",
      "10minutemail.com", "tempmail.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    if (BANNED_DOMAINS.includes(domain)) {
      toast.error("Please use a permanent email address.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "https://cvyon.com/recruiter/dashboard",
          data: { company_name: company },
        },
      });
      if (error) throw error;
      setDone(true);
      toast.success("Check your email to confirm.");
    } catch (err: any) {
      toast.error(err.message || "Sign up failed");
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

  return (
    <RisoPage pageName="recruiter_signup">
      <div className="mx-auto flex max-w-md flex-col py-10">
        <div className="fm mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.22em]">
          <span className="inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-3 py-1.5 hs">
            § create recruiter account
          </span>
        </div>
        <h1 className="fd text-5xl leading-[0.86] tracking-[-0.02em] sm:text-6xl">
          Start sourcing.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#151a46]/70">
          Free to create. Search the pool free — pay only when you unlock a contact.
        </p>
        <Suspense fallback={null}>
          <SelectedPlanLine />
        </Suspense>

        {done ? (
          <div className="mt-8 border-[3px] border-[#151a46] bg-white hs p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center border-[3px] border-[#0E8A4B] text-[#0E8A4B]">
                <Check size={20} />
              </span>
              <h2 className="fd text-2xl tracking-tight">Confirm your email</h2>
            </div>
            <p className="mt-4 text-[#151a46]/70">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate
              your account — it lands right back here on Cvyon.
            </p>
            <Link
              href="/recruiter/login"
              className="mt-6 flex w-full items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <div className="mt-8 border-[3px] border-[#151a46] bg-white hs p-8">
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
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="fh text-xs font-extrabold uppercase tracking-wider">Company name</label>
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b]"
                  placeholder="Acme Talent"
                />
              </div>
              <div>
                <label className="fh text-xs font-extrabold uppercase tracking-wider">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b]"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="fh text-xs font-extrabold uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full border-[3px] border-[#151a46] bg-white px-4 py-3.5 fm text-sm text-[#151a46] outline-none transition-all focus:border-[#ff604b]"
                  placeholder="At least 8 characters"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-7 py-4 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[7px_7px_0_#151a46]"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Create account"}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="fm text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#151a46]/45">
                by continuing you agree to our terms & privacy policy
              </p>
            </form>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-[#151a46]/60">
          Already have an account?{" "}
          <Link href="/recruiter/login" className="fh font-extrabold text-[#ff604b] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </RisoPage>
  );
}