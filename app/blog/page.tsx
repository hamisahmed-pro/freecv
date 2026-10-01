import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { ArrowRight, Calendar } from 'lucide-react';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: 'Cvyon Blog - Career Advice & Resume Tips',
  description: 'Expert advice on resume building, job hunting, and career advancement to help you land your dream job.',
  alternates: { canonical: 'https://cvyon.com/blog' },
};

export default async function BlogIndex() {
  const { data: posts } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <V3Page pageName="blog">
      <div className="mx-auto max-w-[880px]">
        <div className="text-center">
          <V3Eyebrow>§ Career blog</V3Eyebrow>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-navy sm:text-5xl">
            The Career Hub
          </h1>
          <p className="mx-auto mt-4 max-w-[650px] text-[17px] leading-relaxed text-muted">
            Expert insights on resume optimization, interview prep, and landing your dream job in 2026.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {(!posts || posts.length === 0) ? (
            <div className="col-span-1 rounded-2xl border border-line bg-paper p-12 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)] md:col-span-2">
              <p className="font-medium text-navy/70">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            posts.map((post: any) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(23,27,75,0.12)]">
                  {post.header_image && (
                    <div className="aspect-[2/1] w-full overflow-hidden border-b border-line">
                      <img src={post.header_image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                      <Calendar size={14} />
                      {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <h2 className="mb-3 text-[22px] font-extrabold tracking-tight text-navy transition-colors group-hover:text-brand">
                      {post.title}
                    </h2>
                    <p className="mb-7 line-clamp-3 flex-1 text-[15px] leading-relaxed text-navy/70">
                      {post.meta_description || post.content?.replace(/<[^>]*>/g, '').substring(0, 150) || 'Read more about this topic...'}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-brand">
                      Read Article <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>
      </div>
    </V3Page>
  );
}
