import type { Metadata } from 'next';
import TemplateGallery from '@/components/seo/TemplateGallery';

const canonical = 'https://cvyon.com/templates';
const title = 'Free Resume Templates — 180 ATS-Friendly Designs | Cvyon';
const description =
  'Browse 180 free ATS-friendly resume templates. No sign-up, no watermark, unlimited downloads. Click any design and the builder opens with that template already selected.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: 'Cvyon',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function TemplatesIndexPage() {
  return <TemplateGallery />;
}
