import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import { getLocalizedPosts, readingTimeMinutes, type BlogPost } from '@/lib/blog-i18n';
import { isLocale, LOCALES, type Locale } from '@/lib/locale';
import type { Dict } from '@/dictionaries/en';

export const revalidate = 3600;

async function getDict(locale: Locale): Promise<Dict> {
  const mod = await import(`@/dictionaries/${locale}.json`);
  return mod.default as Dict;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  const b = (dict as any).blog || {};
  const title = b.index_title || 'Cvyon Blog - Career Advice & Resume Tips';
  const description = b.index_sub || 'Expert advice on resume building, job hunting, and career advancement.';
  const languages: Record<string, string> = { en: 'https://cvyon.com/blog' };
  for (const l of LOCALES) languages[l] = `https://cvyon.com/${l}/blog`;
  return {
    title,
    description,
    alternates: { canonical: `https://cvyon.com/${locale}/blog`, languages },
    openGraph: { title, description, url: `https://cvyon.com/${locale}/blog`, locale },
  };
}

function Card({ post, locale, b, featured }: { post: BlogPost; locale: string; b: any; featured?: boolean }) {
  const dateStr = new Date(post.date_iso + 'T00:00:00').toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  const img = post.header_image?.startsWith('http') ? post.header_image : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80';
  return (
    <Link href={`/${locale}/blog/${post.slug}`} className="group block">
      <article className={`flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-all hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(23,27,75,0.13)] ${featured ? 'md:grid md:grid-cols-2' : ''}`}>
        <div className={`relative w-full overflow-hidden ${featured ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          <img src={img} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
            <span className="inline-flex items-center gap-1.5"><Calendar size={13} />{dateStr}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={13} />{readingTimeMinutes(post.content_html)} {b.min_read || 'min'}</span>
          </div>
          <h3 className={`mb-2.5 font-extrabold leading-snug tracking-tight text-navy transition-colors group-hover:text-brand ${featured ? 'text-2xl' : 'text-[19px]'}`}>
            {post.title}
          </h3>
          <p className="mb-5 line-clamp-2 flex-1 text-[14px] leading-relaxed text-navy/65">{post.meta_description}</p>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand">
            {b.read_article || 'Read article'} <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function LocalizedBlogIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);
  const b = (dict as any).blog || {};
  const rtl = (dict as any).dir === 'rtl';
  const posts = getLocalizedPosts(locale);
  const featured = posts[0];
  const rest = posts.slice(1);
  const loc = `/${locale}`;
  const L = (path: string) => `${loc}${path}`;

  return (
    <div dir={rtl ? 'rtl' : 'ltr'} lang={locale}>
      <V3Page
        pageName="blog"
        switcher={<LanguageSwitcher current={locale} />}
        links={[
          { href: loc, label: b.nav_home || 'Home' },
          { href: L('/build'), label: b.nav_builder || 'Builder' },
          { href: L('/ats-grader'), label: b.nav_grader || 'ATS Grader' },
        ]}
        cta={{ label: b.nav_build || 'Build free →', href: L('/build') }}
      >
        <div className="mx-auto max-w-[1120px]">
          <div className="text-center">
            <V3Eyebrow>{b.index_eyebrow || '§ Career blog'}</V3Eyebrow>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">{b.index_h1 || 'The Career Hub'}</h1>
            <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">{b.index_sub || 'Practical guides on resumes, ATS optimization, interviews, and getting hired.'}</p>
          </div>

          {posts.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-line bg-paper p-12 text-center">
              <p className="font-medium text-navy/70">{b.index_empty || 'No articles published yet. Check back soon!'}</p>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mt-12"><Card post={featured} locale={locale} b={b} featured /></div>
              )}
              <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <Card key={post.slug} post={post} locale={locale} b={b} />
                ))}
              </div>
            </>
          )}
        </div>
      </V3Page>
    </div>
  );
}
