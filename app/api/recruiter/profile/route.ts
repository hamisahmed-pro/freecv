import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';

export const dynamic = 'force-dynamic';

/** GET /api/recruiter/profile -> the signed-in recruiter's own profile. */
export async function GET(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter, email } = auth.auth;

  return NextResponse.json({
    company_name: recruiter.company_name || '',
    contact_email: recruiter.contact_email || email || '',
    status: recruiter.status || null,
    created_at: recruiter.created_at || null,
    sign_in_email: email || '',
  });
}

/** PATCH /api/recruiter/profile { company_name?, contact_email? } */
export async function PATCH(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  const auth = await authenticateRecruiter(req);
  if (!auth.ok) return auth.response;
  const { recruiter } = auth.auth;

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const patch: Record<string, string> = {};
  if (body.company_name !== undefined) {
    const v = String(body.company_name || '').trim().slice(0, 120);
    if (!v) return NextResponse.json({ error: 'Company name cannot be empty.' }, { status: 400 });
    patch.company_name = v;
  }
  if (body.contact_email !== undefined) {
    const v = String(body.contact_email || '').trim().toLowerCase().slice(0, 160);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return NextResponse.json({ error: 'Enter a valid contact email.' }, { status: 400 });
    }
    patch.contact_email = v;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  try {
    const { error } = await supabaseAdmin.from('recruiters').update(patch).eq('id', recruiter.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, ...patch });
  } catch (e: any) {
    logger.error('recruiter-profile', 'profile PATCH error', e);
    return NextResponse.json({ error: 'Could not save profile.' }, { status: 500 });
  }
}
