import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { templateSeoEntries, getTemplateSeoEntry } from '@/lib/template-seo';
import TemplateSeoPage from './TemplateSeoPage';

// Derived from the data file so new entries (added by the second half of this
// task) are picked up automatically — no manual list to keep in sync.
export function generateStaticParams() {
  return templateSeoEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getTemplateSeoEntry(slug);
  if (!entry) {
    return { title: 'Template not found | Cvyon' };
  }
  const canonical = `https://cvyon.com/templates/${entry.slug}`;
  return {
    title: entry.metaTitle,
    description: entry.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: entry.metaTitle,
      description: entry.metaDescription,
      url: canonical,
      siteName: 'Cvyon',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: entry.metaTitle,
      description: entry.metaDescription,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getTemplateSeoEntry(slug);
  if (!entry) notFound();

  // Deterministic "more templates" picks spread across the full entry list.
  const idx = templateSeoEntries.findIndex((e) => e.slug === slug);
  const more = [5, 11, 17].map((offset) => templateSeoEntries[(idx + offset) % templateSeoEntries.length]);

  return <TemplateSeoPage entry={entry} more={more} />;
}
