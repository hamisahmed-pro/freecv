import type { Metadata } from 'next';
import ClientAtsGrader from './ClientAtsGrader';

export const metadata: Metadata = {
  title: 'Free ATS Resume Grader — Score Your Resume | Cvyon',
  description: 'Upload your resume and paste a job description to get an instant AI match score with actionable feedback. Free, no signup.',
  openGraph: {
    title: 'Free ATS Resume Grader — Score Your Resume | Cvyon',
    description: 'Get an instant AI match score for your resume against any job description. Free, no signup. Think you can beat my score?',
    url: 'https://cvyon.com/ats-grader',
    siteName: 'Cvyon',
    type: 'website',
    images: [{ url: 'https://cvyon.com/og-image.jpg', width: 1200, height: 630, alt: 'Cvyon ATS Grader' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free ATS Resume Grader — Score Your Resume | Cvyon',
    description: 'Get an instant AI match score for your resume against any job description. Free, no signup. Think you can beat my score?',
    images: ['https://cvyon.com/og-image.jpg'],
  },
  alternates: { canonical: 'https://cvyon.com/ats-grader' },
};

export default function AtsGraderPage() {
  return <ClientAtsGrader />;
}
