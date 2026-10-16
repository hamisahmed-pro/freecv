import type { Metadata } from 'next';
import SupportClient from './SupportClient';

export const metadata: Metadata = {
  title: 'Support — Cvyon',
  description: 'Get help with Cvyon — FAQs and support for candidates and recruiters.',
  alternates: { canonical: 'https://cvyon.com/support' },
};

export default function SupportPage() {
  return <SupportClient />;
}
