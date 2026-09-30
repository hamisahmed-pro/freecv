import React from 'react';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import { ArrowRight, Calendar } from 'lucide-react';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
    <div className={`cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden ${body.className}`}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
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
        <header className="bg-[#151a46] text-[#f6f5ef] pt-24 pb-16 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <Link href="/" className="fm inline-block text-[#f6f5ef]/70 hover:text-[#ff604b] font-bold tracking-[0.2em] text-xs uppercase mb-8 transition-colors">
              ← Back to Cvyon
            </Link>
            <h1 className="fd text-5xl sm:text-6xl uppercase tracking-tight mb-4">The Career Hub</h1>
            <p className="text-[#f6f5ef]/70 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
              Expert insights on resume optimization, interview prep, and landing your dream job in 2026.
            </p>
          </div>
        </header>

        {/* Grid */}
        <main className="max-w-5xl mx-auto px-6 mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(!posts || posts.length === 0) ? (
              <div className="riso-card col-span-1 md:col-span-2 p-12 text-center">
                <p className="font-medium">No articles published yet. Check back soon!</p>
              </div>
            ) : (
              posts.map((post: any) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <article className="riso-card h-full flex flex-col relative overflow-hidden transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none">
                    {post.header_image && (
                      <div className="w-full aspect-[2/1] relative overflow-hidden border-b-[3px] border-[#151a46]">
                        <img src={post.header_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="fm flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-600 mb-4">
                        <Calendar size={14} />
                        {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h2 className="fh text-2xl font-extrabold uppercase tracking-tight mb-3 group-hover:text-[#5548f5] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-[#151a46]/70 mb-8 flex-1 line-clamp-3">
                        {post.meta_description || post.content?.replace(/<[^>]*>/g, '').substring(0, 150) || 'Read more about this topic...'}
                      </p>
                      <div className="fm flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                        Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
