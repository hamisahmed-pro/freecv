"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Users, ShieldCheck, Loader2, Check, X, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getRecruiterConsent, setRecruiterConsent, ApiError } from "@/lib/recruiter-api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type Status = "loading" | "in" | "out" | "no-session";

const DISMISS_KEY = "cvyon_optin_dismissed";

/**
 * First-class, benefit-framed recruiter-discovery opt-in.
 * Used in: builder completion flow (JobsModal), user dashboard, settings.
 * - Explicit Allow / Not now buttons; one-tap revoke ("Stop sharing").
 * - Uses the canonical POST /api/user/consent (explicit + timestamped server-side).
 * - Anonymous builder users: Allow starts Google sign-in, then completes opt-in on return.
 */
export function RecruiterOptInCard({
  variant = "card",
  onChange,
}: {
  variant?: "card" | "banner";
  onChange?: (optedIn: boolean) => void;
}) {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const refresh = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setStatus("no-session"); return; }
    const c = await getRecruiterConsent();
    setStatus(c?.optedIn ? "in" : "out");
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY)) { setDismissed(true); return; }
    } catch {}
    refresh();
  }, [refresh]);

  const handleAllow = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      // Anonymous builder: sign in once (Google), then complete opt-in on return.
      try { sessionStorage.setItem("cvyon_pending_optin", "1"); } catch {}
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/build?optin=pending` },
      });
      if (error) toast.error(error.message || "Sign-in failed");
      return;
    }
    setBusy(true);
    try {
      await setRecruiterConsent(true);
      try { localStorage.removeItem(DISMISS_KEY); } catch {}
      setStatus("in");
      onChange?.(true);
      toast.success("You're discoverable — recruiters can now find you.");
    } catch (e: any) {
      toast.error(e instanceof ApiError ? e.message : "Couldn't save your preference.");
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    setBusy(true);
    try {
      await setRecruiterConsent(false);
      setStatus("out");
      onChange?.(false);
      toast.success("Done — recruiters can no longer find your profile.");
    } catch (e: any) {
      toast.error(e instanceof ApiError ? e.message : "Couldn't save your preference.");
    } finally {
      setBusy(false);
    }
  };

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setDismissed(true);
  };

  if (dismissed) return null;
  if (status === "loading") {
    return (
      <div className="flex items-center gap-3 border-[3px] border-[#151a46] bg-white p-5">
        <Loader2 size={18} className="animate-spin text-[#5548f5]" />
        <span className="fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60">checking…</span>
      </div>
    );
  }

  const banner = variant === "banner";
  // Banner variant (inside the post-download JobsModal) carries its own tinted
  // strip so a dismissed card leaves no empty container behind.
  const wrap = (inner: React.ReactNode) =>
    banner ? (
      <div className="border-b-2 border-[#151a46] bg-[#ffd85a]/30 p-4 sm:p-5">{inner}</div>
    ) : (
      inner
    );

  /* ------------------------- already opted in ------------------------- */
  if (status === "in") {
    return wrap(
      <div className={cn("border-[3px] border-[#151a46] bg-[#0E8A4B]/10", banner ? "p-4 sm:p-5" : "hs p-6")}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center border-[3px] border-[#0E8A4B] bg-white text-[#0E8A4B]">
              <Check size={20} />
            </span>
            <div>
              <div className="fh font-extrabold text-[#151a46]">You&apos;re discoverable</div>
              <p className="mt-0.5 text-sm text-[#151a46]/65">
                Verified recruiters can find your anonymized profile and unlock your contact. One tap stops it.
              </p>
            </div>
          </div>
          <button
            onClick={handleRevoke}
            disabled={busy}
            className="flex shrink-0 items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-5 py-2.5 fh text-[11px] font-extrabold uppercase tracking-wider text-[#151a46] transition-all hover:bg-[#ff604b] hover:border-[#ff604b] hover:text-white disabled:opacity-60"
          >
            {busy ? <Loader2 size={14} className="animate-spin" /> : <EyeOff size={14} />}
            Stop sharing
          </button>
        </div>
      </div>
    );
  }

  /* --------------------------- opt-in prompt -------------------------- */
  return wrap(
    <div className={cn(
      "relative border-[3px] border-[#151a46] bg-white",
      banner ? "p-4 sm:p-6" : "hs overflow-hidden p-6 sm:p-8",
    )}>
      {!banner && <div className="absolute inset-x-0 top-0 h-2 bg-[#ffd85a] border-b-[3px] border-[#151a46]" />}
      <div className="flex items-start justify-between gap-3">
        <div className={cn("fm inline-flex items-center gap-2 border-2 border-[#151a46] bg-[#ffd85a] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]", !banner && "mt-2")}>
          <span className="blink inline-block h-2 w-2 rounded-full bg-[#ff604b]" /> free · 10 seconds
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="grid h-8 w-8 place-items-center border-2 border-[#151a46]/20 text-[#151a46]/50 transition-colors hover:border-[#151a46] hover:text-[#151a46]"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-3 flex items-start gap-4">
        <span className="hidden sm:grid h-12 w-12 shrink-0 place-items-center border-[3px] border-[#151a46] bg-[#151a46] text-[#ffd85a]">
          <Users size={22} />
        </span>
        <div>
          <h3 className={cn("fh font-extrabold tracking-tight text-[#151a46]", banner ? "text-lg" : "text-xl sm:text-2xl")}>
            Get discovered by recruiters
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#151a46]/70">
            Top employers search Cvyon for people like you. Opt in and your <strong>anonymized</strong> profile
            (title, skills, experience — never your name or contact) appears in their matches.
            You stay in control: <strong>one tap stops it</strong>, anytime.
          </p>
          <div className="mt-3 flex items-center gap-2 fm text-[10px] font-bold uppercase tracking-[0.16em] text-[#151a46]/55">
            <ShieldCheck size={13} className="text-[#0E8A4B]" /> explicit consent · timestamped · revocable
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAllow}
          disabled={busy}
          className="flex flex-1 items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-6 py-3.5 fh text-sm font-extrabold uppercase tracking-wider text-[#f6f5ef] transition-all hover:bg-[#0E8A4B] hover:border-[#0E8A4B] disabled:opacity-60"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          {status === "no-session" ? "Allow — sign in (free)" : "Allow recruiters to find me"}
        </button>
        <button
          onClick={handleDismiss}
          disabled={busy}
          className="flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-white px-6 py-3.5 fh text-sm font-extrabold uppercase tracking-wider text-[#151a46] transition-all hover:bg-[#f6f5ef] disabled:opacity-60"
        >
          Not now
        </button>
      </div>
      {status === "no-session" && (
        <p className="mt-3 fm text-[10px] uppercase tracking-[0.14em] text-[#151a46]/50">
          One-tap Google sign-in — we only use it to record your consent.
        </p>
      )}
    </div>
  );
}
