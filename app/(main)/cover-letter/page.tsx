import type { Metadata } from 'next';
import CoverLetterClient from './CoverLetterClient';

export const metadata: Metadata = {
  title: 'AI Cover Letter Generator — Cvyon',
  description: 'Create a tailored cover letter using your resume and a job description. Choose a tone, review the draft, and copy it for free — no sign-up required.',
  alternates: { canonical: 'https://cvyon.com/cover-letter' },
};

export default function CoverLetterPage() {
  return <CoverLetterClient />;
}
