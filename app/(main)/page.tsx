import { Suspense } from "react";
import LandingV3 from "@/components/landing/LandingV3";
import type { Metadata } from "next";

// The description states, in one sentence, what Cvyon is — the entity
// definition the homepage's visible copy also now opens with, so title, H1
// context, meta, Open Graph, and schema all name the same entity and offer.
export const metadata: Metadata = {
  title: "Cvyon — Free Premium Resume Builder & ATS Grader",
  description: "Cvyon is a free resume builder and ATS grader: build an ATS-friendly resume from 180+ templates, check it against a job posting, and download it free, no sign-up.",
  alternates: { canonical: "https://cvyon.com" },
  openGraph: {
    title: "Cvyon — Free Premium Resume Builder & ATS Grader",
    description: "Cvyon is a free resume builder and ATS grader: build an ATS-friendly resume from 180+ templates, check it against a job posting, and download it free, no sign-up.",
    url: "https://cvyon.com",
    siteName: "Cvyon",
    type: "website",
    images: [{ url: "https://cvyon.com/og-image.jpg", width: 1200, height: 630, alt: "Cvyon — Free premium resume builder & ATS grader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvyon — Free Premium Resume Builder & ATS Grader",
    description: "Cvyon is a free resume builder and ATS grader: build an ATS-friendly resume from 180+ templates, check it against a job posting, and download it free, no sign-up.",
    images: ["https://cvyon.com/og-image.jpg"],
  },
};

export default function Page() {
  return <LandingV3 />;
}