import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Cvyon — The Free ATS Résumé Builder',
  description: 'Learn why Cvyon provides a premium, AI-powered résumé builder and ATS grader for free. No paywalls, no watermarks, completely funded by transparent recruitment.',
  alternates: { canonical: 'https://cvyon.com/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
