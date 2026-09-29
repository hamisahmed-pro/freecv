import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';

export const dynamic = 'force-dynamic';

/** GET /api/recruiter/searches — list the recruiter's JD searches (newest first). */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  try {
    const { data, error } = await supabaseAdmin
      .from('jd_searches')
      .select('id, job_title, job_description, extracted_json, counts_json, saved, created_at')
      .eq('recruiter_id', recruiter.id)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json({ searches: data || [] });
  } catch (e: any) {
    logger.error('searches', 'recruiter/searches GET error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** POST /api/recruiter/searches { jobTitle?, jobDescription } — create a new
 * saved search (used for "duplicate an existing search"). */
export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const jobTitle = String(body?.jobTitle || body?.job_title || '').trim();
  const jobDescription = String(body?.jobDescription || body?.job_description || '').trim();
  if (jobDescription.length < 20) {
    return NextResponse.json(
      { error: 'jobDescription is required and must be at least 20 characters' },
      { status: 400 }
    );
  }
  if (jobTitle.length > 120) {
    return NextResponse.json({ error: 'jobTitle must be 120 characters or fewer' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('jd_searches')
      .insert({
        recruiter_id: recruiter.id,
        job_title: jobTitle || null,
        job_description: jobDescription,
        saved: true,
      })
      .select('id, job_title, job_description, saved, created_at')
      .single();
    if (error || !data) throw error || new Error('insert failed');
    return NextResponse.json(
      {
        id: data.id,
        jobTitle: data.job_title,
        jobDescription: data.job_description,
        saved: data.saved,
        createdAt: data.created_at,
      },
      { status: 201 }
    );
  } catch (e: any) {
    logger.error('searches', 'recruiter/searches POST error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** PATCH /api/recruiter/searches { id, saved?, title? } — save/unsave and/or rename. */
export async function PATCH(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const id = String(body?.id || '').trim();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const update: Record<string, any> = {};
  if (body?.saved !== undefined) {
    if (typeof body.saved !== 'boolean') {
      return NextResponse.json({ error: 'saved must be a boolean' }, { status: 400 });
    }
    update.saved = body.saved;
  }
  if (body?.title !== undefined) {
    if (typeof body.title !== 'string') {
      return NextResponse.json({ error: 'title must be a string' }, { status: 400 });
    }
    const title = body.title.trim();
    if (title.length > 120) {
      return NextResponse.json({ error: 'title must be 120 characters or fewer' }, { status: 400 });
    }
    update.job_title = title.length > 0 ? title : null;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: 'Nothing to update — provide saved and/or title' },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('jd_searches')
      .update(update)
      .eq('id', id)
      .eq('recruiter_id', recruiter.id)
      .select('id, job_title, saved')
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Search not found' }, { status: 404 });
    }
    return NextResponse.json({
      ok: true,
      id: data.id,
      jobTitle: data.job_title,
      saved: data.saved,
    });
  } catch (e: any) {
    logger.error('searches', 'recruiter/searches PATCH error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/** DELETE /api/recruiter/searches { id } — delete the recruiter's own search. */
export async function DELETE(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  const body = await req.json().catch(() => ({}));
  const id = String(body?.id || new URL(req.url).searchParams.get('id') || '').trim();
  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin
      .from('jd_searches')
      .delete()
      .eq('id', id)
      .eq('recruiter_id', recruiter.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, id });
  } catch (e: any) {
    logger.error('searches', 'recruiter/searches DELETE error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
