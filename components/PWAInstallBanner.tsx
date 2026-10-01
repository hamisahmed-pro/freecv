"use client";

import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallBanner() {
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("pwa-dismissed") === "1") return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    // Hide while the privacy dialog is open so the two never overlap.
    const consentHandler = (e: Event) => {
      setConsentOpen((e as CustomEvent<{ open: boolean }>).detail?.open === true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("cvyon:consent-visibility", consentHandler);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("cvyon:consent-visibility", consentHandler);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setVisible(false);
    }
    deferredPrompt.current = null;
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("pwa-dismissed", "1");
  };

  return (
    <div
      data-pwa-banner
      className={`fixed bottom-0 left-0 right-0 z-50 border-t-2 border-[#f6f5ef]/20 bg-[#151a46] text-white px-4 py-3 transition-transform duration-300 ${
        visible && !consentOpen ? "translate-y-0" : "translate-y-full pointer-events-none"
      }`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">📱</span>
          <span>Install Cvyon for quick access</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleInstall}
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-black"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-2 text-lg leading-none text-white/60 hover:text-white"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
