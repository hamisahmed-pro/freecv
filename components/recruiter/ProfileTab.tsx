"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getRecruiterProfile,
  updateRecruiterProfile,
  type RecruiterProfile,
} from "@/lib/recruiter-api";
import { Building2, ShieldCheck, Loader2, Save, KeyRound, Mail } from "lucide-react";
import toast from "react-hot-toast";

const inputCls =
  "w-full rounded-[10px] border border-line bg-white px-4 py-3 text-sm font-semibold text-navy outline-none transition-colors placeholder:font-normal placeholder:text-navy/35 focus:border-brand";
const labelCls =
  "mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.18em] text-navy/55";

function Card({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-gold">
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-black tracking-tight text-navy">{title}</h2>
          <p className="text-xs text-navy/55">{hint}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ProfileTab({ signInEmail }: { signInEmail: string }) {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [newSignInEmail, setNewSignInEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailPending, setEmailPending] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRecruiterProfile()
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setCompany(p.company_name || "");
        setContactEmail(p.contact_email || "");
      })
      .catch(() => toast.error("Couldn't load your profile."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const p = await updateRecruiterProfile({
        company_name: company.trim(),
        contact_email: contactEmail.trim(),
      });
      setProfile(p);
      toast.success("Profile saved.");
    } catch (err: any) {
      toast.error(err.message || "Couldn't save profile.");
    } finally {
      setSaving(false);
    }
  };

  const changeSignInEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = newSignInEmail.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (next === (signInEmail || "").toLowerCase()) {
      toast.error("That's already your sign-in email.");
      return;
    }
    setEmailSaving(true);
    try {
      // Supabase emails a confirmation link to the NEW address; the sign-in
      // email only switches after the user clicks it. Until then the old
      // email keeps working.
      const { error } = await supabase.auth.updateUser(
        { email: next },
        { emailRedirectTo: "https://cvyon.com/recruiter/dashboard" }
      );
      if (error) throw error;
      // Keep the public contact email in sync when it was mirroring the old
      // sign-in email (the common case).
      if (contactEmail.trim().toLowerCase() === (signInEmail || "").toLowerCase()) {
        try {
          const p = await updateRecruiterProfile({ contact_email: next });
          setProfile(p);
          setContactEmail(next);
        } catch {
          /* non-fatal: contact email can be updated separately above */
        }
      }
      setEmailPending(next);
      setNewSignInEmail("");
      toast.success("Confirmation email sent.");
    } catch (err: any) {
      toast.error(err.message || "Couldn't change sign-in email.");
    } finally {
      setEmailSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("New passwords don't match.");
      return;
    }
    setPwSaving(true);
    try {
      // Re-authenticate with the current password first (skipped for
      // Google/LinkedIn sign-ins, which never set one).
      if (currentPw) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: signInEmail,
          password: currentPw,
        });
        if (signInError) throw new Error("Current password is incorrect.");
      }
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      toast.success("Password changed.");
    } catch (err: any) {
      toast.error(err.message || "Couldn't change password.");
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-16 text-navy/60">
        <Loader2 size={22} className="animate-spin text-brand" /> Loading profile…
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <Card
        icon={<Building2 size={18} />}
        title="Company profile"
        hint="How your company appears on receipts and shared shortlists."
      >
        <form onSubmit={saveProfile} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Company name</label>
            <input
              className={inputCls}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Staffing Ltd"
              maxLength={120}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Contact email</label>
            <input
              className={inputCls}
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="hiring@company.com"
              maxLength={160}
              required
            />
            <p className="mt-1.5 text-[11px] text-navy/50">
              Public contact shown on receipts and shared shortlists — not used for sign-in.
            </p>
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-navy/50">
              Signed in as <b className="text-navy">{signInEmail}</b>
              {profile?.created_at && (
                <>
                  {" "}· member since{" "}
                  {new Date(profile.created_at).toLocaleDateString()}
                </>
              )}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral disabled:opacity-60"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save changes
            </button>
          </div>
        </form>
      </Card>

      <Card
        icon={<Mail size={18} />}
        title="Sign-in email"
        hint="The email address you use to log in."
      >
        {emailPending ? (
          <div className="rounded-[10px] border border-line bg-white p-4">
            <p className="text-sm text-navy/70">
              We sent a confirmation link to <b className="text-navy">{emailPending}</b>.
              Click it to finish changing your sign-in email — until then, keep
              signing in with <b className="text-navy">{signInEmail}</b>.
            </p>
            <button
              type="button"
              onClick={() => setEmailPending(null)}
              className="mt-3 text-xs font-bold text-brand underline underline-offset-2"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={changeSignInEmail} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Current sign-in email</label>
              <input className={inputCls} value={signInEmail} disabled />
            </div>
            <div>
              <label className={labelCls}>New sign-in email</label>
              <input
                className={inputCls}
                type="email"
                value={newSignInEmail}
                onChange={(e) => setNewSignInEmail(e.target.value)}
                placeholder="you@newcompany.com"
                maxLength={160}
                required
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-navy/50">
                We'll email the new address a confirmation link before the change takes effect.
              </p>
              <button
                type="submit"
                disabled={emailSaving}
                className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral disabled:opacity-60"
              >
                {emailSaving ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                Send confirmation link
              </button>
            </div>
          </form>
        )}
      </Card>

      <Card
        icon={<ShieldCheck size={18} />}
        title="Password"
        hint="Change the password you use to sign in."
      >
        <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Current password</label>
            <input
              className={inputCls}
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <p className="mt-1.5 text-[11px] text-navy/50">
              Leave blank if you signed up with Google or LinkedIn.
            </p>
          </div>
          <div>
            <label className={labelCls}>New password</label>
            <input
              className={inputCls}
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className={labelCls}>Confirm new password</label>
            <input
              className={inputCls}
              type="password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
              required
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={pwSaving}
              className="inline-flex items-center gap-2 rounded-[10px] bg-navy px-6 py-3 text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:-translate-y-px hover:bg-coral disabled:opacity-60"
            >
              {pwSaving ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} />}
              Change password
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
