import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

// DIAGNOSTIC seeder — returns a progress marker after each step so we can
// see exactly where the authenticated path dies. ?step=N controls how far it
// goes: 1=auth only, 2=+list dir, 3=+read one file, 4=+select, 5=+insert.
// DELETE THIS ROUTE after diagnosing.
import { readdir, readFile } from 'fs/promises';
import path from 'path';

async function run(request: Request) {
  const step = parseInt(new URL(request.url).searchParams.get('step') || '5', 10);
  const log: string[] = [];
  try {
    await requireAdmin();
  } catch {
    return adminFail();
  }
  log.push('auth-ok');
  if (step <= 1) return NextResponse.json({ log });

  try {
    const dir = path.join(process.cwd(), 'seed-data', 'blog-posts');
    log.push('cwd=' + process.cwd());
    const files = await readdir(dir);
    log.push('readdir-ok:' + files.length);
    if (step <= 2) return NextResponse.json({ log });

    const raw = await readFile(path.join(dir, files[0]), 'utf8');
    const d = JSON.parse(raw);
    log.push('read-ok:' + d.slug);
    if (step <= 3) return NextResponse.json({ log });

    const { data: existing, error: selErr } = await supabaseAdmin
      .from('blog_posts')
      .select('id')
      .eq('slug', d.slug)
      .maybeSingle();
    log.push('select-ok:' + (selErr ? 'err=' + selErr.message : 'found=' + !!existing?.id));
    if (step <= 4) return NextResponse.json({ log });

    return NextResponse.json({ log, note: 'insert step skipped in diagnostic' });
  } catch (e: any) {
    log.push('THREW:' + (e?.message || String(e)));
    return NextResponse.json({ log }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return run(request);
}
export async function POST(request: Request) {
  return run(request);
}
