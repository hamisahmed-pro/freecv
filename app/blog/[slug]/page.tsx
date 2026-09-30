import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';
import { ArticleJsonLd } from '@/components/blog/ArticleJsonLd';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
    <div className={`cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden ${body.className}`}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <ArticleJsonLd post={post} />
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
        .cv-riso .riso-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 3px solid var(--ink); background-color: var(--ink); color: #f6f5ef; padding: 0.75rem 1.5rem; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 7px 7px 0 var(--ink); transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .cv-riso .riso-btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .cv-riso .riso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-btn-ghost { background-color: transparent; color: var(--ink); }
        .cv-riso .riso-card { border: 3px solid var(--ink); background-color: #ffffff; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-input { width: 100%; border: 3px solid var(--ink); background-color: #ffffff; padding: 0.75rem 1rem; font-family: var(--fm); font-size: 0.875rem; color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transition: all 0.2s; outline: none; }
        .cv-riso .riso-input:focus { box-shadow: none; transform: translate(2px, 2px); border-color: var(--verm); }
        .cv-riso .riso-label { display: block; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; color: var(--ink); }
        .cv-riso .riso-chip { display: inline-flex; align-items: center; gap: 0.25rem; border: 2px solid var(--ink); padding: 0.25rem 0.5rem; font-family: var(--fm); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; color: var(--ink); background: #ffffff; }
      `}</style>

      <div className="pb-24">
        {/* Header */}
        <header className="bg-[#151a46] text-[#f6f5ef] pt-24 pb-20 px-6 relative overflow-hidden">
          <div className="max-w-3xl mx-auto relative z-10">
            <Link href="/blog" className="fm inline-flex items-center gap-2 text-[#f6f5ef]/70 hover:text-[#ff604b] font-bold tracking-[0.2em] text-xs uppercase mb-8 transition-colors">
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <h1 className="fd text-4xl sm:text-5xl uppercase tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="fm flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#f6f5ef]/70">
              <Calendar size={14} />
              {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Article Content */}
        <main className="max-w-3xl mx-auto px-6 mt-10 relative z-20">
          <article className="riso-card overflow-hidden">
            {/* Header Image */}
            {post.header_image && (
              <div className="w-full aspect-[2/1] relative border-b-[3px] border-[#151a46]">
                <img
                  src={post.header_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content with proper HTML rendering */}
            <div className="p-8 sm:p-12">
              <div
                className="blog-content leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
              />
            </div>
          </article>
        </main>

        {/* Blog content styles - since @tailwindcss/typography is not installed */}
        <style dangerouslySetInnerHTML={{ __html: `
          .blog-content { color: #151a46; }
          .blog-content h1 { font-family: var(--fh); font-size: 2rem; font-weight: 800; margin: 1.5em 0 0.5em; line-height: 1.2; color: #151a46; }
          .blog-content h2 { font-family: var(--fh); font-size: 1.5rem; font-weight: 700; margin: 1.5em 0 0.5em; line-height: 1.3; color: #151a46; }
          .blog-content h3 { font-family: var(--fh); font-size: 1.25rem; font-weight: 600; margin: 1.25em 0 0.5em; line-height: 1.4; color: #151a46; }
          .blog-content p { margin: 1em 0; }
          .blog-content ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
          .blog-content ol { list-style-type: decimal; padding-left: 1.5em; margin: 1em 0; }
          .blog-content li { margin: 0.25em 0; }
          .blog-content a { color: #5548f5; text-decoration: underline; }
          .blog-content a:hover { color: #151a46; }
          .blog-content blockquote { border-left: 4px solid #151a46; padding-left: 1em; margin: 1em 0; color: #151a46; font-style: italic; }
          .blog-content strong { font-weight: 700; }
          .blog-content em { font-style: italic; }
          .blog-content code { background: #f6f5ef; border: 2px solid #151a46; padding: 0.2em 0.4em; font-size: 0.875em; font-family: monospace; }
          .blog-content pre { background: #151a46; color: #f6f5ef; padding: 1em; border: 3px solid #151a46; overflow-x: auto; margin: 1em 0; }
          .blog-content pre code { background: none; padding: 0; color: inherit; border: none; }
          .blog-content img { max-width: 100%; height: auto; margin: 1em 0; border: 3px solid #151a46; }
          .blog-content hr { border: none; border-top: 3px solid #151a46; margin: 2em 0; }
        `}} />
      </div>
    </div>
  );
}
