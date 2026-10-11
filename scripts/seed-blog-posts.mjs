// One-time build-time seeder for the 8 SEO articles (Oct 2026 batch).
// Reads seed-data/blog-posts/*.json and inserts into blog_posts via the
// service-role client. Idempotent: existing slugs are skipped.
// Run: node scripts/seed-blog-posts.mjs (requires SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY env vars). DELETE after the seed run.
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'seed-data', 'blog-posts');

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

async function main() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) {
    console.log('[seed] SKIP: SUPABASE_URL or SERVICE_ROLE_KEY not set');
    return;
  }
  const supabase = createClient(url, key);
  const results = [];
  // Graceful no-op if seed data was removed (e.g. after the one-time seed).
  let filesPresent = true;
  try {
    await readdir(DATA_DIR);
  } catch {
    filesPresent = false;
  }
  if (!filesPresent) {
    console.log('[seed] SKIP: seed-data/blog-posts not present');
    return;
  }
  for (const file of FILES) {
    try {
      const d = JSON.parse(await readFile(path.join(DATA_DIR, file), 'utf8'));
      const slug = String(d.slug || '').trim();
      if (!slug || !d.title || !d.content_html) {
        results.push({ file, status: 'skipped' });
        continue;
      }
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();
      if (existing?.id) {
        results.push({ slug, status: 'exists' });
        continue;
      }
      const { error } = await supabase.from('blog_posts').insert([
        {
          title: d.title,
          slug,
          content: d.content_html,
          meta_description: d.meta_description || null,
          header_image: d.header_image || null,
          is_published: true,
        },
      ]);
      results.push({ slug, status: error ? 'error:' + error.message : 'created' });
    } catch (e) {
      results.push({ file, status: 'error:' + (e?.message || e) });
    }
  }
  console.log('[seed] results:', JSON.stringify(results));
  const failed = results.filter((r) => String(r.status).startsWith('error'));
  if (failed.length) process.exitCode = 1;
}

main();
