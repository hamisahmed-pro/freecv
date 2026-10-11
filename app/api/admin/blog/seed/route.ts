import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';
import { readFile } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

// One-time seeder for the 8 SEO articles (Oct 2026 batch).
// Reads bundled JSON from seed-data/blog-posts/ and inserts into blog_posts
// via the service-role client. Safe to re-run: existing slugs are skipped.
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

export async function POST() {
  return runSeed();
}

// GET also triggers the seed (for browser navigation without JS execution).
// Same admin guard. DELETE THIS ROUTE after the seed run.
export async function GET() {
  return runSeed();
}

async function runSeed() {
  try {
    await requireAdmin();
  } catch {
    return adminFail();
  }

  const dir = path.join(process.cwd(), 'seed-data', 'blog-posts');
  const results: Array<Record<string, unknown>> = [];

  for (const file of FILES) {
    try {
      const raw = await readFile(path.join(dir, file), 'utf8');
      const d = JSON.parse(raw);
      const slug = String(d.slug || '').trim();
      if (!slug || !d.title || !d.content_html) {
        results.push({ file, status: 'skipped', reason: 'missing slug/title/content' });
        continue;
      }

      const { data: existing } = await supabaseAdmin
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (existing?.id) {
        results.push({ slug, status: 'exists' });
        continue;
      }

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

      if (error) {
        results.push({ slug, status: 'error', error: error.message });
      } else {
        results.push({ slug, status: 'created', id: data.id });
      }
    } catch (e: any) {
      results.push({ file, status: 'error', error: e?.message || 'read failed' });
    }
  }

  return NextResponse.json({ results });
}
