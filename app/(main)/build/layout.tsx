import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Resume Builder — No Sign-Up Required | Cvyon',
  description:
    'Build a professional, ATS-friendly resume in minutes with Cvyon\u2019s free resume builder. 180 templates, AI rewriting, instant PDF & DOCX download. No sign-up, no paywall.',
  alternates: { canonical: 'https://cvyon.com/build' },
  openGraph: {
    title: 'Free Resume Builder — No Sign-Up Required | Cvyon',
    description:
      'Build a professional, ATS-friendly resume in minutes. 180 templates, AI rewriting, instant PDF & DOCX download. Free forever.',
    url: 'https://cvyon.com/build',
    images: [{ url: 'https://cvyon.com/og-image.jpg', width: 1200, height: 630, alt: 'Cvyon free resume builder' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder — No Sign-Up Required | Cvyon',
    description:
      'Build a professional, ATS-friendly resume in minutes. 180 templates, AI rewriting, instant PDF & DOCX download. Free forever.',
    images: ['https://cvyon.com/og-image.jpg'],
  },
};

export default function BuildLayout({ children }: { children: React.ReactNode }) {
  return children;
}
