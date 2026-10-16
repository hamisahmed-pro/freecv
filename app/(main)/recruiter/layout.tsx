import type { Metadata } from 'next';

// Route-level metadata for the recruiter funnel (client-component pages can't
// export metadata themselves in Next 16). No canonical here: this layout also
// wraps /recruiter/login, /recruiter/signup, and /recruiter/dashboard, and a
// shared canonical would be wrong for those subpages.
export const metadata: Metadata = {
  title: 'Cvyon for Recruiters — Paste the JD, meet the shortlist',
  description:
    'Recruiters search Cvyon\u2019s opt-in talent pool free with a job description. Tiered matches (Excellent / Strong / Moderate) up front; unlock a candidate\u2019s contact for 1 credit. Billed via Paystack.',
};

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
