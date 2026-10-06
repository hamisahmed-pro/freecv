import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { V3Page } from '@/components/v3/V3Chrome';
import { ArticleJsonLd } from '@/components/blog/ArticleJsonLd';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { getLocalizedPost, blogOrder } from '@/lib/blog-i18n';
import { isLocale, LOCALES, type Locale } from '../../page';
import type { Dict } from '@/dictionaries/en';

export const revalidate = 3600;

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) for (const slug of blogOrder()) params.push({ locale, slug });
  return params;
}

async function getDict(locale: Locale): Promise<Dict> {
  const mod = await import(`@/dictionaries/${locale}.json`);
  return mod.default as Dict;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = getLocalizedPost(locale, slug);
  if (!post) return { title: 'Post Not Found' };
  const languages: Record<string, string> = { en: `https://cvyon.com/blog/${slug}` };
  for (const l of LOCALES) languages[l] = `https://cvyon.com/${l}/blog/${slug}`;
  const canonical = `https://cvyon.com/${locale}/blog/${slug}`;
  const ogImage = post.header_image?.startsWith('http')
    ? post.header_image
    : `https://cvyon.com${post.header_image?.startsWith('/') ? '' : '/'}${post.header_image || 'og-image.jpg'}`;
  return {
    title: `${post.title} | Cvyon Blog`,
    description: post.meta_description || `Read ${post.title} on the Cvyon Career Hub.`,
    alternates: { canonical, languages },
    openGraph: {
      title: post.title,
      description: post.meta_description,
      type: 'article',
      url: canonical,
      locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description: post.meta_description, images: [ogImage] },
  };
}

export default async function LocalizedBlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);
  const post = getLocalizedPost(locale, slug);
  if (!post) notFound();
  const b = (dict as any).blog || {};
  const rtl = (dict as any).dir === 'rtl';
  const dateStr = new Date(post.date_iso + 'T00:00:00').toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
  const img = post.header_image?.startsWith('http') ? post.header_image : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80';
  const jsonLdPost = { title: post.title, meta_description: post.meta_description, content: post.content_html, datePublished: post.date_iso, header_image: post.header_image };

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} lang={locale}>
      <V3Page pageName="blog_article">
        <ArticleJsonLd post={jsonLdPost} />
        <div className="mx-auto max-w-[760px]">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted transition-colors hover:text-brand"
          >
            <ArrowLeft size={14} /> {b.back || 'Back to blog'}
          </Link>

          <h1 className="mt-5 text-3xl font-black tracking-tight text-navy sm:text-[42px] sm:leading-[1.15]">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.12em] text-muted">
            <Calendar size={14} />
            {dateStr}
          </div>

          <article className="mt-8 overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <div className="aspect-[2/1] w-full overflow-hidden border-b border-line">
              <img src={img} alt={post.title} className="h-full w-full object-cover" />
            </div>
            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content_html) }} />
            </div>
          </article>

          <div className="mt-8 rounded-2xl border border-line bg-lavender/60 p-8 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <h2 className="text-2xl font-black tracking-tight text-navy">{b.cta_h2 || 'Put this advice to work'}</h2>
            <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-navy/70">
              {b.cta_p || "Build an ATS-friendly resume with Cvyon's free builder — no signup, no watermark."}
            </p>
            <Link
              href={`/${locale}/ats-grader`}
              className="mt-5 inline-flex items-center gap-2 rounded-[10px] bg-brand px-[22px] py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition-transform hover:-translate-y-px"
            >
              {b.cta_button || 'Build my resume'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <style>{`
          .blog-content { color: var(--color-ink); font-size: 1.0625rem; line-height: 1.8; }
          .blog-content h2 { font-size: 1.5rem; font-weight: 800; margin: 1.75em 0 0.6em; line-height: 1.3; color: var(--color-navy); letter-spacing: -0.02em; }
          .blog-content h3 { font-size: 1.25rem; font-weight: 800; margin: 1.5em 0 0.5em; color: var(--color-navy); }
          .blog-content p { margin: 1em 0; }
          .blog-content ul, .blog-content ol { margin: 1em 0; padding-inline-start: 1.5em; }
          .blog-content li { margin: 0.5em 0; }
          .blog-content a { color: var(--color-brand); font-weight: 600; text-decoration: underline; }
          .blog-content img { border-radius: 12px; margin: 1.5em 0; }
          .blog-content blockquote { border-inline-start: 4px solid var(--color-brand); padding-inline-start: 1em; margin: 1.5em 0; color: var(--color-navy); font-style: italic; }
          .blog-content strong { color: var(--color-navy); }
        `}</style>
      </V3Page>
    </div>
  );
}
