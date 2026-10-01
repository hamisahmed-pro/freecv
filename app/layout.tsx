import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  verification: {
    google: "Yg_Y3Iu-WAx7l6TkcVEehUCuSbEAVS7DkFBLGkWg78A",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://cvyon.com'),
  title: "Cvyon | Build a Premium, ATS-Friendly Resume for Free",
  description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
  keywords: ["Free Resume Builder", "ATS Friendly Resume Builder", "No Sign Up Resume Maker", "Free PDF Resume Creator", "No Hidden Fees Resume Builder"],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/favicon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Cvyon | Premium, ATS-Friendly Resume Builder",
    description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
    url: "https://cvyon.com",
    siteName: "Cvyon",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Cvyon — Free AI Resume Builder",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cvyon | Premium, ATS-Friendly Resume Builder",
    description: "A free premium resume builder with an ATS grader, unlimited downloads, and no sign-up required.",
    images: ["/og-image.jpg"],
  },
};

// Next 16+: themeColor belongs to the viewport export, not metadata.
export const viewport: Viewport = { themeColor: '#151a46' };

import { ConsentManager } from "@/components/ConsentManager";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from 'react-hot-toast';
import { AffiliateTracker } from "@/components/AffiliateTracker";
import { JsonLd } from "@/components/JsonLd";
import { Suspense } from "react";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=2" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon.png?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png?v=2" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){var hadController=!!navigator.serviceWorker.controller;window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js');if(hadController){var reloaded=false;navigator.serviceWorker.addEventListener('controllerchange',function(){if(reloaded)return;reloaded=true;window.location.reload();});}})}`
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd />
        <AuthProvider>
          {children}
          <ConsentManager />
          <Suspense fallback={null}>
            <AffiliateTracker />
          </Suspense>
          <Toaster position="top-right" />
          <PWAInstallBanner />
        </AuthProvider>
      </body>
    </html>
  );
}
