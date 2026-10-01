import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Recruiter Pricing — Cvyon Talent Network',
  description: 'Search the opt-in Cvyon talent pool. One-time recruiter access — no subscription, no stale profiles.',
  alternates: { canonical: 'https://cvyon.com/pricing' },
};

export default function PricingPage() {
  return <PricingClient />;
}
