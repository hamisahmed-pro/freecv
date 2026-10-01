import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { V3Page } from '@/components/v3/V3Chrome';
import { compareSeoEntries, getCompareSeoEntry } from '@/lib/compare-seo';
import CompareSeoPage from '@/components/seo/CompareSeoPage';

export function generateStaticParams() {
  return compareSeoEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCompareSeoEntry(slug);
  if (!entry) {
    return { title: 'Comparison not found | Cvyon' };
  }
  const canonical = `https://cvyon.com/alternatives/${entry.slug}`;
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
  const entry = getCompareSeoEntry(slug);
  if (!entry) notFound();

  const more = compareSeoEntries.filter((e) => e.slug !== slug);

  return (
    <V3Page pageName="seo_alternative" cta={{ label: "Build free →", href: "/build" }}>
      <CompareSeoPage entry={entry} more={more} />
    </V3Page>
  );
}
