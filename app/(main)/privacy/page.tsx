import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy — Cvyon',
  description: 'How Cvyon collects, uses, and protects your data.',
  alternates: { canonical: 'https://cvyon.com/privacy' },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
