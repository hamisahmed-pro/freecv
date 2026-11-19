import { Suspense } from "react";
import LandingV3 from "@/components/landing/LandingV3";
import type { Metadata } from "next";
import { LOCALES } from "@/lib/locale";

// The description states, in one sentence, what Cvyon is — the entity
// definition the homepage's visible copy also now opens with, so title, H1
// context, meta, Open Graph, and schema all name the same entity and offer.
export const metadata: Metadata = {
  title: "Cvyon: Free ATS Resume Builder in 18 Languages",
  description: "Build an ATS-friendly resume or CV free in minutes with Cvyon. 18 languages, modern templates, AI-powered ATS check. No paywall.",
  alternates: {
    canonical: "https://cvyon.com",
    // 2026-11-19: the EN homepage was the one localized-family page NOT
    // declaring hreflang (every other family shipped it in the 2026-11-16
    // audit). Declare the full map: en + x-default here, one per locale.
    languages: {
      en: "https://cvyon.com",
      "x-default": "https://cvyon.com",
      ...Object.fromEntries(LOCALES.map((l) => [l, `https://cvyon.com/${l}`])),
    },
  },
  openGraph: {
    title: "Cvyon: Free ATS Resume Builder in 18 Languages",
    description: "Build an ATS-friendly resume or CV free in minutes with Cvyon. 18 languages, modern templates, AI-powered ATS check. No paywall.",
    url: "https://cvyon.com",
    siteName: "Cvyon",
    type: "website",
    images: [{ url: "https://cvyon.com/og-image.jpg", width: 1200, height: 630, alt: "Cvyon — Free ATS resume builder in 18 languages" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvyon: Free ATS Resume Builder in 18 Languages",
    description: "Build an ATS-friendly resume or CV free in minutes with Cvyon. 18 languages, modern templates, AI-powered ATS check. No paywall.",
    images: ["https://cvyon.com/og-image.jpg"],
  },
};

export default function Page() {
  return <LandingV3 />;
}