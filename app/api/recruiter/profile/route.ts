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
    contact_name: recruiter.contact_name || '',
    contact_email: recruiter.contact_email || email || '',
    phone: recruiter.phone || '',
    website: recruiter.website || '',
    location: recruiter.location || '',
    country: recruiter.country || '',
    company_size: recruiter.company_size || '',
    industry: recruiter.industry || '',
    notes: recruiter.notes || '',
    status: recruiter.status || null,
    created_at: recruiter.created_at || null,
    sign_in_email: email || '',
  });
}

/** PATCH /api/recruiter/profile { company_name?, contact_name?, contact_email?, phone?, website?, location?, country?, company_size?, industry?, notes? }
 *  `status` stays admin-controlled and is never editable here. */
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
  const optStr = (v: any, max: number) => String(v ?? '').trim().slice(0, max);
  if (body.company_name !== undefined) {
    const v = String(body.company_name || '').trim().slice(0, 120);
    if (!v) return NextResponse.json({ error: 'Company name cannot be empty.' }, { status: 400 });
    patch.company_name = v;
  }
  if (body.contact_name !== undefined) patch.contact_name = optStr(body.contact_name, 120);
  if (body.contact_email !== undefined) {
    const v = String(body.contact_email || '').trim().toLowerCase().slice(0, 160);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return NextResponse.json({ error: 'Enter a valid contact email.' }, { status: 400 });
    }
    patch.contact_email = v;
  }
  if (body.phone !== undefined) patch.phone = optStr(body.phone, 40);
  if (body.website !== undefined) patch.website = optStr(body.website, 200);
  if (body.location !== undefined) patch.location = optStr(body.location, 120);
  if (body.country !== undefined) patch.country = optStr(body.country, 80);
  if (body.company_size !== undefined) patch.company_size = optStr(body.company_size, 20);
  if (body.industry !== undefined) patch.industry = optStr(body.industry, 120);
  if (body.notes !== undefined) patch.notes = optStr(body.notes, 2000);
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
