import type { Metadata } from 'next';
import CoverLetterClient from './CoverLetterClient';

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator — Cvyon',
  description: 'Generate a tailored cover letter with AI. Free, no sign-up required.',
  alternates: { canonical: 'https://cvyon.com/cover-letter' },
};

export default function CoverLetterPage() {
  return <CoverLetterClient />;
}
