import { Suspense } from "react";
import LandingV3 from "@/components/landing/LandingV3";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cvyon — Free Premium Resume Builder & ATS Grader",
  description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
  alternates: { canonical: "https://cvyon.com" },
  openGraph: {
    title: "Cvyon — Free Premium Resume Builder & ATS Grader",
    description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
    url: "https://cvyon.com",
    siteName: "Cvyon",
    type: "website",
    images: [{ url: "https://cvyon.com/og-image.jpg", width: 1200, height: 630, alt: "Cvyon — Free premium resume builder & ATS grader" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvyon — Free Premium Resume Builder & ATS Grader",
    description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
    images: ["https://cvyon.com/og-image.jpg"],
  },
};

export default function Page() {
  return <LandingV3 />;
}