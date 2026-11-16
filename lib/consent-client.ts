"use client";

import { useResumeStore } from "@/store/useResumeStore";

export type ConsentPreferences = {
  recruiterShare: boolean; emailJobs: boolean; analytics: boolean;
};

/** Called only in response to an explicit choice, never on mount or hydration. */
export async function acknowledgeConsent(choice: ConsentPreferences): Promise<void> {
  const res = await fetch("/api/consent/ack", {
    method: "POST", credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(choice),
  });
  if (!res.ok) throw new Error("Could not record your privacy choice");
  localStorage.setItem("cvyon-consent-v2", "acknowledged");
  localStorage.setItem("cvyon-consent-seen", "true");
  useResumeStore.getState().setConsents(choice);
  window.dispatchEvent(new Event("cvyon:consent-changed"));
}

export function existingExplicitConsent(): ConsentPreferences {
  try {
    if (localStorage.getItem("cvyon-consent-v2") !== "acknowledged")
      return { recruiterShare: false, emailJobs: false, analytics: false };
    const c = useResumeStore.getState().data.consents;
    return { recruiterShare: c.recruiterShare === true,
      emailJobs: c.emailJobs === true, analytics: c.analytics === true };
  } catch {
    return { recruiterShare: false, emailJobs: false, analytics: false };
  }
}
