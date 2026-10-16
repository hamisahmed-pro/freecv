import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cvyon API — Developer docs',
  description:
    'Cvyon\u2019s recruiter API: search the opt-in talent pool and verify ATS scores programmatically. API keys require an active recruiter access pass (30 days from purchase).',
};

export default function DevelopersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
