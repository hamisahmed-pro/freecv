import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { V3Page } from '@/components/v3/V3Chrome';
import { jobTitleSeoEntries, getJobTitleSeoEntry } from '@/lib/job-title-seo';
import JobTitleSeoPage from '@/components/seo/JobTitleSeoPage';

export function generateStaticParams() {
  return jobTitleSeoEntries.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJobTitleSeoEntry(slug);
  if (!entry) {
    return { title: 'Resume guide not found | Cvyon' };
  }
  const canonical = `https://cvyon.com/resume-for/${entry.slug}`;
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
  const entry = getJobTitleSeoEntry(slug);
  if (!entry) notFound();

  // Deterministic "more guides" picks spread across the full entry list.
  const idx = jobTitleSeoEntries.findIndex((e) => e.slug === slug);
  const more = [5, 11, 17].map((offset) => jobTitleSeoEntries[(idx + offset) % jobTitleSeoEntries.length]);

  return (
    <V3Page pageName="seo_job_title" cta={{ label: "Build free →", href: "/build" }}>
      <JobTitleSeoPage entry={entry} more={more} />
    </V3Page>
  );
}
