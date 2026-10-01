"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { V3Page, V3Pill } from "@/components/v3/V3Chrome";
import { GoogleIcon, LinkedInIcon, oauthErrorMessage } from "@/components/auth/ProviderIcons";
import { ArrowRight, Loader2, Check } from "lucide-react";
import toast from "react-hot-toast";

const PLAN_NAMES: Record<string, string> = {
  payg: "Pay as you go",
  enterprise: "Enterprise",
};

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/recruiter", label: "For recruiters" },
  { href: "/support", label: "Support" },
];

function SelectedPlanLine() {
  const params = useSearchParams();
  const name = PLAN_NAMES[params.get("plan") || ""] || null;
  if (!name) return null;
  return (
    <p className="mt-3 text-center text-[11px] font-black uppercase tracking-[0.13em] text-brand">
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
    if (!company.trim()) {
      toast.error("Enter your company name — we need to know who we're working with.");
      return;
    }
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
          data: { company_name: company.trim() },
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
    if (!company.trim()) {
      toast.error("Enter your company name first — we need to know who we're working with.");
      return;
    }
    // Supabase OAuth carries no custom metadata, so the company name rides
    // along in sessionStorage and is written to the recruiter row on landing.
    try {
      sessionStorage.setItem("cvyon-recruiter-company", company.trim());
    } catch {}
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "https://cvyon.com/recruiter/dashboard" },
    });
    if (error) {
      toast.error(oauthErrorMessage(provider, error.message));
      setLoading(false);
    }
  };

  return (
    <V3Page
      pageName="recruiter_signup"
      logoSub="RECRUITER"
      links={LINKS}
      cta={{ label: "Sign in", href: "/recruiter/login" }}
    >
      <div className="mx-auto max-w-[760px]">
        <div className="py-[45px] text-center md:pb-7 md:pt-[70px]">
          <V3Pill>Create recruiter account</V3Pill>
          <h1 className="mt-[18px] text-[44px] leading-[1.04] tracking-[-0.045em] sm:text-6xl">
            Start sourcing.
          </h1>
          <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Free to create. Search the pool free — pay only when you unlock a contact.
          </p>
          <Suspense fallback={null}>
            <SelectedPlanLine />
          </Suspense>
        </div>

        <div className="mx-auto max-w-[520px]">
          {done ? (
            <div className="rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-teal">
                  <Check size={20} />
                </span>
                <h2 className="text-2xl font-extrabold tracking-tight">Confirm your email</h2>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-muted">
                We sent a confirmation link to <strong className="text-navy">{email}</strong>.
                Click it to activate your account — it lands right back here on Cvyon.
              </p>
              <Link
                href="/recruiter/login"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-[18px] py-3 text-[12px] font-extrabold text-navy transition-transform hover:-translate-y-px"
              >
                Go to sign in
              </Link>
            </div>
          ) : (
            <div className="rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">
                  Company name
                </label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Talent"
                  autoComplete="organization"
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                />
                <p className="m-0 text-[11px] leading-relaxed text-muted">
                  Required — whichever way you sign up, we keep a record of the company behind every account.
                </p>
              </div>

              <div className="my-[22px] flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                <span className="h-px flex-1 bg-line" />
                continue with
                <span className="h-px flex-1 bg-line" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth("google")}
                  disabled={loading || !company.trim()}
                  title={!company.trim() ? "Enter your company name first" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-3 text-[12px] font-extrabold text-navy transition-all hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  <GoogleIcon size={16} />
                  Google
                </button>
                <button
                  onClick={() => handleOAuth("linkedin_oidc")}
                  disabled={loading || !company.trim()}
                  title={!company.trim() ? "Enter your company name first" : undefined}
                  className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-3 text-[12px] font-extrabold text-navy transition-all hover:border-brand hover:text-brand disabled:opacity-60"
                >
                  <LinkedInIcon size={16} />
                  LinkedIn
                </button>
              </div>

              <div className="my-[22px] flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                <span className="h-px flex-1 bg-line" />
                or email
                <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={handleSignup} className="grid gap-[15px]">
                <div className="grid gap-[7px]">
                  <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">
                    Work email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                  />
                </div>
                <div className="grid gap-[7px]">
                  <label className="text-[10px] font-black uppercase tracking-[0.08em] text-[#656a82]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-[14px] text-navy outline-none transition-shadow placeholder:text-muted/60 focus:border-brand focus:shadow-[0_0_0_4px_rgba(85,72,245,0.1)]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-[18px] py-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition-transform hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : "Create account"}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="m-0 text-center text-[10px] leading-relaxed text-muted">
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="font-extrabold text-brand hover:underline">
                    Terms
                  </Link>{" "}
                  &amp;{" "}
                  <Link href="/privacy" className="font-extrabold text-brand hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </form>
            </div>
          )}

          <p className="mt-6 text-center text-[12px] text-muted">
            Already have an account?{" "}
            <Link href="/recruiter/login" className="font-extrabold text-brand hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </V3Page>
  );
}
