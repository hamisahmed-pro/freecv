import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { ArrowRight, ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';

export const revalidate = 60;

export const metadata = {
  title: 'Cvyon Blog - Career Advice & Resume Tips',
  description: 'Expert advice on resume building, job hunting, and career advancement to help you land your dream job.',
  alternates: { canonical: 'https://cvyon.com/blog' },
};

const POSTS_PER_PAGE = 9;

// Curated stock photos (Unsplash) as fallbacks when a post has no/broken header image.
// These are real photography, not vectors — matched to career/resume topics.
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80', // resume writing
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', // professional woman
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80', // team meeting
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', // planning/strategy
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', // professional man
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', // handshake/interview
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', // workspace
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // whiteboard meeting
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80', // presentation
];

function getImage(post: any, index: number): string {
  const img = post.header_image;
  // Use the post's image if it looks like a valid URL; otherwise fall back to stock
  if (img && typeof img === 'string' && img.startsWith('http') && !img.includes('placeholder')) {
    return img;
  }
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

function readingTime(content: string | null): number {
  if (!content) return 4;
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

function excerpt(post: any): string {
  if (post.meta_description) return post.meta_description;
  const text = (post.content || '').replace(/<[^>]*>/g, '').trim();
  return text.substring(0, 160) + (text.length > 160 ? '…' : '') || 'Read more about this topic…';
}

export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);

  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('id, slug, title, meta_description, header_image, content, created_at, category')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  const allPosts = posts || [];
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const pagePosts = allPosts.slice(startIdx, startIdx + POSTS_PER_PAGE);
  const featured = safePage === 1 ? pagePosts[0] : null;
  const gridPosts = featured ? pagePosts.slice(1) : pagePosts;

  return (
    <V3Page pageName="blog">
      <div className="mx-auto max-w-[1120px]">
        {/* Header */}
        <div className="text-center">
          <V3Eyebrow>§ Career blog</V3Eyebrow>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
            The Career Hub
          </h1>
          <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Practical guides on resumes, ATS optimization, interviews, and getting hired — written for job seekers, not algorithms.
          </p>
        </div>

        {allPosts.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-line bg-paper p-12 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <p className="font-medium text-navy/70">No articles published yet. Check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="group mt-12 block">
                <article className="overflow-hidden rounded-3xl border border-line bg-paper shadow-[0_12px_32px_rgba(23,27,75,0.10)] transition-all hover:shadow-[0_20px_48px_rgba(23,27,75,0.14)]">
                  <div className="grid md:grid-cols-2">
                    <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[320px]">
                      <img
                        src={getImage(featured, 0)}
                        alt={featured.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute left-5 top-5">
                        <span className="rounded-full bg-coral px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-white">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <div className="mb-4 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(featured.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={14} />
                          {readingTime(featured.content)} min read
                        </span>
                        {featured.category && (
                          <span className="inline-flex items-center gap-1.5 text-brand">
                            <Tag size={14} />
                            {featured.category}
                          </span>
                        )}
                      </div>
                      <h2 className="text-3xl font-black tracking-tight text-navy transition-colors group-hover:text-brand md:text-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-[16px] leading-relaxed text-navy/70">
                        {excerpt(featured)}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.12em] text-brand">
                        Read article
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid */}
            <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post: any, i: number) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-all hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(23,27,75,0.13)]">
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <img
                        src={getImage(post, startIdx + i + (featured ? 1 : 0))}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {post.category && (
                        <span className="absolute left-4 top-4 rounded-full bg-navy/90 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white backdrop-blur">
                          {post.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock size={13} />
                          {readingTime(post.content)} min
                        </span>
                      </div>
                      <h3 className="mb-2.5 text-[19px] font-extrabold leading-snug tracking-tight text-navy transition-colors group-hover:text-brand">
                        {post.title}
                      </h3>
                      <p className="mb-5 line-clamp-2 flex-1 text-[14px] leading-relaxed text-navy/65">
                        {excerpt(post)}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand">
                        Read article
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-14 flex items-center justify-center gap-2" aria-label="Blog pagination">
                {safePage > 1 && (
                  <Link
                    href={`/blog?page=${safePage - 1}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-5 py-3 text-sm font-bold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                  >
                    <ArrowLeft size={15} /> Newer
                  </Link>
                )}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}`}
                      aria-current={p === safePage ? 'page' : undefined}
                      className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-extrabold transition-colors ${
                        p === safePage
                          ? 'bg-navy text-white'
                          : 'border border-line bg-paper text-navy hover:border-navy'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                </div>
                {safePage < totalPages && (
                  <Link
                    href={`/blog?page=${safePage + 1}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-line bg-paper px-5 py-3 text-sm font-bold text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
                  >
                    Older <ArrowRight size={15} />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-navy p-10 text-center md:p-14">
          <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
            Put what you learned into action
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/70">
            Build a free ATS-friendly resume in minutes. No signup, no watermark, no paywall.
          </p>
          <Link
            href="/build"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-coral px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-white transition-transform hover:scale-[1.03]"
          >
            Build my resume <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </V3Page>
  );
}
