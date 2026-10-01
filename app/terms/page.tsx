import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service — Cvyon',
  description: 'The terms governing your use of Cvyon.',
  alternates: { canonical: 'https://cvyon.com/terms' },
};

export default function TermsOfService() {
  return <TermsClient />;
}
