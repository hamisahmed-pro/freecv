import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// One-time seeder for the 8 SEO articles (Oct 2026 batch).
// Guarded by a temporary shared key (?key=...) instead of session auth so it
// can be triggered via curl against the deployment URL. The key is rotated
// per deploy and the route is DELETED after the seed run.
const SEED_KEY = 'cvyon-seed-8f3a9c2d1e7b4a5f';
const FILES = [
  'free-ats-resume-checker.json',
  'nigerian-cv-format-guide.json',
  'customer-service-resume-example.json',
  'how-to-beat-applicant-tracking-systems.json',
  'software-developer-resume-example.json',
  'data-analyst-resume-example.json',
  'what-is-applicant-tracking-system.json',
  'free-ats-resume-test.json',
];

async function seedOne(dir: string, file: string): Promise<Record<string, unknown>> {
  try {
    const raw = await readFile(path.join(dir, file), 'utf8');
    const d = JSON.parse(raw);
    const slug = String(d.slug || '').trim();
    if (!slug || !d.title || !d.content_html) {
      return { file, status: 'skipped', reason: 'missing slug/title/content' };
    }
    const { data: existing, error: selErr } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (selErr) return { slug, status: 'error', error: `select: ${selErr.message}` };
    if (existing?.id) return { slug, status: 'exists' };
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .insert([
        {
          title: d.title,
          slug,
          content: d.content_html,
          meta_description: d.meta_description || null,
          header_image: d.header_image || null,
          is_published: true,
        },
      ])
      .select('id, slug')
      .single();
    if (error) return { slug, status: 'error', error: `insert: ${error.message}` };
    return { slug, status: 'created', id: data.id };
  } catch (e: any) {
    return { file, status: 'error', error: e?.message || 'unknown' };
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get('key') !== SEED_KEY) {
    return NextResponse.json({ error: 'Unauthorized', v: 'key-v2' }, { status: 401 });
  }
  const only = url.searchParams.get('slug');
  const dir = path.join(process.cwd(), 'seed-data', 'blog-posts');
  const files = only ? FILES.filter((f) => f.replace(/\.json$/, '') === only) : FILES;
  if (only && files.length === 0) {
    return NextResponse.json({ error: `unknown slug: ${only}` }, { status: 400 });
  }
  const results = await Promise.all(files.map((f) => seedOne(dir, f)));
  return NextResponse.json({ results });
}
