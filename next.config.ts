import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

// Fail fast on build if critical env vars are missing
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'PAYSTACK_SECRET_KEY'
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    // We only throw in production build so local dev isn't fully blocked if testing UI only,
    // BUT since we want to fail fast for production, we check NODE_ENV
    if (process.env.NODE_ENV === 'production' || process.env.CI) {
      console.warn(`WARNING: Missing environment variable ${envVar}. Some features may not work.`);
    } else {
      console.warn(`WARNING: Missing environment variable ${envVar}`);
    }
  }
}

const nextConfig: NextConfig = {
  // pdfjs-dist must run from node_modules (not bundled) so its worker file
  // resolves correctly at runtime for server-side PDF text extraction.
  serverExternalPackages: ['pdfjs-dist'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://js.stripe.com https://js.paystack.co https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https:; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
  async redirects() {
    // Legacy kebab-case template URLs (pre-rename) -> current slugs.
    // These pages were indexed before the slug consolidation; keep them 301'd.
    const legacy = [
      ['modern-gradient', 'moderngradient'],
      ['night-shift', 'nightshift'],
      ['parse-perfect', 'parseperfect'],
      ['swiss-design', 'swissdesign'],
      ['swiss-grid', 'swissgrid'],
      ['swiss-minimal', 'swissminimal'],
      ['tech-pro', 'techpro'],
      ['typography-first', 'typographyfirst'],
      ['zen-japanese', 'zenjapanese'],
      ['academic-journal', 'academicjournal'],
      ['corporate-blue', 'corporateblue'],
      ['elegant-editorial', 'eleganteditorial'],
      ['executive-split', 'executivesplit'],
      ['minimalist-split', 'minimalistsplit'],
    ];
    return legacy.map(([from, to]) => ({
      source: `/templates/${from}`,
      destination: `/templates/${to}`,
      permanent: true,
    }));
  },
};

export default withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "cvyon",
    project: "javascript-nextjs",
    widenClientFileUpload: true,
    tunnelRoute: "/monitoring",
    disableLogger: true,
    automaticVercelMonitors: true,
  }
);
