import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// One-time seeder for the 8 SEO articles (Oct 2026 batch).
// Reads bundled JSON from the filesystem and inserts into blog_posts via the
// service-role client. Posts are processed IN PARALLEL to stay well under the
// serverless execution timeout. ?slug=<slug> seeds a single post.
// Safe to re-run: existing slugs are skipped.
// DELETE THIS ROUTE after the seed run.
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

async function runSeed(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return adminFail();
  }

  const dir = path.join(process.cwd(), 'seed-data', 'blog-posts');
  const only = new URL(request.url).searchParams.get('slug');
  const files = only
    ? FILES.filter((f) => f.replace(/\.json$/, '') === only)
    : FILES;
  if (only && files.length === 0) {
    return NextResponse.json({ error: `unknown slug: ${only}` }, { status: 400 });
  }

  const results = await Promise.all(files.map((f) => seedOne(dir, f)));
  return NextResponse.json({ results });
}

export async function POST(request: Request) {
  return runSeed(request);
}

// GET also triggers the seed (for browser navigation without JS execution).
// Same admin guard. DELETE THIS ROUTE after the seed run.
export async function GET(request: Request) {
  return runSeed(request);
}
