import { MetadataRoute } from 'next'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { templateSeoEntries } from '@/lib/template-seo'
import { compareSeoEntries } from '@/lib/compare-seo'
import { jobTitleSeoEntries } from '@/lib/job-title-seo'
import { LOCALES } from '@/lib/locale'
import { blogOrder } from '@/lib/blog-i18n'
import fs from 'fs'
import path from 'path'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvyon.com';

// Cache the sitemap for 1 hour (ISR) instead of hitting Supabase on every
// request. Newly published posts appear within the hour — fast enough for
// crawlers, cheap enough for the database.
export const revalidate = 3600;

// Last-modified for code-driven routes (static pages, templates, comparisons,
// job-title guides). Bump when site content changes; articles use their own
// file/DB timestamps below.
const CODE_LAST_MODIFIED = new Date('2026-10-16T00:00:00Z');

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
  { path: '/embed', priority: 0.5 },
];

// Localized page routes that exist under app/[locale]/
const localizedPageRoutes: { path: string; priority: number }[] = [
  { path: '', priority: 1 },           // /{locale}/ landing
  { path: '/build', priority: 0.9 },
  { path: '/ats-grader', priority: 0.8 },
  { path: '/blog', priority: 0.8 },
  { path: '/privacy', priority: 0.5 },
  { path: '/terms', priority: 0.5 },
];

function localizedArticleExists(locale: string, slug: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), 'content', 'blog', locale, `${slug}.json`));
  } catch {
    return false;
  }
}

function localizedArticleMtime(locale: string, slug: string): Date {
  try {
    const st = fs.statSync(path.join(process.cwd(), 'content', 'blog', locale, `${slug}.json`));
    return st.mtime;
  } catch {
    return CODE_LAST_MODIFIED;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: CODE_LAST_MODIFIED,
    changeFrequency: 'weekly' as const,
    priority: r.priority,
  }));

  // Localized page routes: /{locale}/, /{locale}/ats-grader, /{locale}/blog,
  // /{locale}/privacy, /{locale}/terms
  for (const locale of LOCALES) {
    for (const r of localizedPageRoutes) {
      routes.push({
        url: `${baseUrl}/${locale}${r.path}`,
        lastModified: CODE_LAST_MODIFIED,
        changeFrequency: 'weekly' as const,
        priority: r.priority,
      });
    }
  }

  // Localized blog articles: /{locale}/blog/{slug} for each slug that has
  // a translated file (falls back to English content where missing, but the
  // localized URL still renders).
  // blogOrder() covers both the original JSON set and the ATS/seed set
  // (order.json includes all 19 slugs).
  const slugs = blogOrder();
  for (const locale of LOCALES) {
    for (const slug of slugs) {
      if (!localizedArticleExists(locale, slug)) continue;
      routes.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified: localizedArticleMtime(locale, slug),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  // Per-template SEO landing pages, derived from the data file (180 slugs).
  const templateSlugs = templateSeoEntries.map((e) => e.slug);
  for (const slug of templateSlugs) {
    routes.push({
      url: `${baseUrl}/templates/${slug}`,
      lastModified: CODE_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Free-alternative comparison pages (3 slugs).
  for (const slug of compareSeoEntries.map((e) => e.slug)) {
    routes.push({
      url: `${baseUrl}/alternatives/${slug}`,
      lastModified: CODE_LAST_MODIFIED,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });
  }

  // Job-title resume guide pages (50 slugs).
  for (const slug of jobTitleSeoEntries.map((e) => e.slug)) {
    routes.push({
      url: `${baseUrl}/resume-for/${slug}`,
      lastModified: CODE_LAST_MODIFIED,
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
