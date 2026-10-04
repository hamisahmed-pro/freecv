import { MetadataRoute } from 'next'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { templateSeoEntries } from '@/lib/template-seo'
import { compareSeoEntries } from '@/lib/compare-seo'
import { jobTitleSeoEntries } from '@/lib/job-title-seo'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvyon.com';

// Render on every request so newly published blog posts appear in the
// sitemap immediately instead of waiting for the next full redeploy.
export const dynamic = 'force-dynamic';

const staticRoutes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },
  { path: '/build', priority: 0.9 },
  { path: '/templates', priority: 0.9 },
  { path: '/ats-grader', priority: 0.8 },
  { path: '/cover-letter', priority: 0.8 },
  { path: '/recruiter', priority: 0.8 },
  { path: '/about', priority: 0.6 },
  { path: '/pricing', priority: 0.7 },
  { path: '/blog', priority: 0.8 },
  { path: '/developers', priority: 0.6 },
  { path: '/support', priority: 0.6 },
  { path: '/privacy', priority: 0.5 },
  { path: '/terms', priority: 0.5 },
  { path: '/manage-data', priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes: no lastmod emitted; they change infrequently.
  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    changeFrequency: 'weekly' as const,
    priority: r.priority,
  }));

  // Per-template SEO landing pages, derived from the data file (180 slugs).
  const templateSlugs = templateSeoEntries.map((e) => e.slug);
  for (const slug of templateSlugs) {
    routes.push({
      url: `${baseUrl}/templates/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Free-alternative comparison pages (3 slugs).
  for (const slug of compareSeoEntries.map((e) => e.slug)) {
    routes.push({
      url: `${baseUrl}/alternatives/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Job-title resume guide pages (50 slugs).
  for (const slug of jobTitleSeoEntries.map((e) => e.slug)) {
    routes.push({
      url: `${baseUrl}/resume-for/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Dynamic blog article URLs (only when a real database is configured —
  // never emit the local mock fixture's sample URLs).
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .select('slug, updated_at, created_at')
        .eq('is_published', true);
      if (!error && Array.isArray(data)) {
        for (const post of data) {
          if (!post?.slug) continue;
          routes.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.updated_at
              ? new Date(post.updated_at)
              : post.created_at
                ? new Date(post.created_at)
                : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          });
        }
      }
    } catch {
      // Sitemap must never fail the build because the CMS is unreachable.
    }
  }

  return routes;
}
