import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { ArticleJsonLd } from '@/components/blog/ArticleJsonLd';
import { V3Page } from '@/components/v3/V3Chrome';

export const revalidate = 60; // Revalidate every minute

// Generate dynamic metadata for SEO + OpenGraph
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post: any = null;
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('title, meta_description, header_image, content')
      .eq('slug', resolvedParams.slug)
      .maybeSingle();
    if (!error) post = data;
  } catch {
    post = null;
  }

  if (!post) {
    return { title: 'Post Not Found' };
  }

  // Description fallback chain: meta_description → first 160 chars of
  // content (HTML stripped) → generic fallback.
  const contentExcerpt = (post.content || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
  const description = post.meta_description || contentExcerpt || `Read ${post.title} on the Cvyon Career Hub.`;
  // og:image fallback: header_image (absolutized) → site default og image.
  const rawOg = post.header_image || 'https://cvyon.com/og-image.jpg';
  const ogImage = rawOg.startsWith('http') ? rawOg : `https://cvyon.com${rawOg.startsWith('/') ? '' : '/'}${rawOg}`;

  return {
    title: `${post.title} | Cvyon Blog`,
    description,
    alternates: { canonical: `https://cvyon.com/blog/${resolvedParams.slug}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post: any = null;
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('slug', resolvedParams.slug)
      .maybeSingle();
    if (error) throw error;
    post = data;
  } catch {
    // Database/network failure: let the error boundary render a friendly page
    // instead of a raw 500.
    throw new Error('Failed to load this article. Please try again.');
  }

  if (!post || !post.is_published) {
    notFound();
  }

  return (
    <V3Page pageName="blog_article">
      <ArticleJsonLd post={post} />
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft size={14} /> Back to blog
        </Link>

        <h1 className="mt-5 text-3xl font-black tracking-tight text-navy sm:text-[42px] sm:leading-[1.15]">
          {post.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
          <Calendar size={14} />
          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <article className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          {post.header_image && (
            <div className="aspect-[2/1] w-full overflow-hidden border-b border-line">
              <img
                src={post.header_image}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Content with proper HTML rendering (TipTap-authored, sanitized) */}
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          </div>
        </article>

        {/* Product CTA */}
        <div className="mt-8 rounded-2xl border border-line bg-lavender/60 p-8 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          <h2 className="text-2xl font-black tracking-tight text-navy">
            Put this advice to work
          </h2>
          <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-navy/70">
            Build an ATS-friendly resume with Cvyon&apos;s free builder — no signup, no watermark.
          </p>
          <Link
            href="/build"
            className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-brand px-[22px] py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition-transform hover:-translate-y-px"
          >
            Build my resume <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Article body typography — styled on v3 tokens since @tailwindcss/typography is not installed */}
      <style>{`
        .blog-content { color: var(--color-ink); font-size: 1.0625rem; line-height: 1.8; }
        .blog-content h1 { font-size: 1.875rem; font-weight: 800; margin: 1.75em 0 0.6em; line-height: 1.25; color: var(--color-navy); letter-spacing: -0.02em; }
        .blog-content h2 { font-size: 1.5rem; font-weight: 800; margin: 1.75em 0 0.6em; line-height: 1.3; color: var(--color-navy); letter-spacing: -0.02em; }
        .blog-content h3 { font-size: 1.25rem; font-weight: 700; margin: 1.5em 0 0.5em; line-height: 1.4; color: var(--color-navy); }
        .blog-content p { margin: 1em 0; }
        .blog-content ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
        .blog-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
        .blog-content li { margin: 0.35em 0; }
        .blog-content a { color: var(--color-brand); text-decoration: underline; text-underline-offset: 3px; font-weight: 600; }
        .blog-content a:hover { color: var(--color-brand-deep); }
        .blog-content blockquote { border-left: 4px solid var(--color-brand); padding: 0.25em 0 0.25em 1.25em; margin: 1.5em 0; color: var(--color-muted); font-style: italic; }
        .blog-content strong { font-weight: 700; color: var(--color-navy); }
        .blog-content em { font-style: italic; }
        .blog-content code { background: var(--color-cream); border: 1px solid var(--color-line); border-radius: 6px; padding: 0.2em 0.45em; font-size: 0.875em; font-family: ui-monospace, monospace; }
        .blog-content pre { background: var(--color-navy); color: var(--color-cream); padding: 1.25em; border-radius: 16px; overflow-x: auto; margin: 1.5em 0; }
        .blog-content pre code { background: none; padding: 0; color: inherit; border: none; border-radius: 0; }
        .blog-content img { max-width: 100%; height: auto; margin: 1.5em 0; border-radius: 16px; border: 1px solid var(--color-line); }
        .blog-content hr { border: none; border-top: 1px solid var(--color-line); margin: 2.5em 0; }
      `}</style>
    </V3Page>
  );
}
