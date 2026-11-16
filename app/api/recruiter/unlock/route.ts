import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRecruiter } from '@/lib/recruiter-auth';
import { MATCH_ELIGIBILITY } from '@/lib/recruiter-match';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function activePacks() {
  const { data } = await supabaseAdmin
    .from('credit_packs')
    .select('id, name, credits, price_kobo')
    .eq('active', true)
    .order('credits', { ascending: true });
  return data || [];
}

function contactFrom(candidate: any) {
  const rd = candidate?.resume_data || {};
  const phone =
    rd?.personalInfo?.phone || rd?.phone || rd?.contact?.phone || null;
  return {
    fullName: candidate?.full_name || candidate?.name || null,
    email: candidate?.email || null,
    phone: phone ? String(phone) : null,
  };
}

export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req, { limit: 30, windowMs: 60_000 });
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
  const profileId = String(body?.profileId || '').trim();
  if (!profileId) {
    return NextResponse.json({ error: 'profileId is required' }, { status: 400 });
  }

  try {
    // 404 path: profile missing OR consent revoked — never reveal which.
    const { data: profile } = await supabaseAdmin
      .from('candidate_profiles')
      .select('id, current_title, country')
      .eq('id', profileId)
      .eq('consent_recruiter_share', MATCH_ELIGIBILITY.consent_recruiter_share)
      .eq('consent_version', 'v2.0')
      .is('deleted_at', MATCH_ELIGIBILITY.deleted_at)
      .single();
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Already unlocked: idempotent — return the contact again, no new charge.
    const { data: existing } = await supabaseAdmin
      .from('contact_unlocks')
      .select('id, receipt_ref, unlocked_at')
      .eq('recruiter_id', recruiter.id)
      .eq('candidate_profile_id', profileId)
      .single();
    const { data: candidate } = await supabaseAdmin
      .from('candidates')
      .select('full_name, name, email, resume_data')
      .eq('id', profileId)
      .single();
    if (!candidate) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (existing) {
      const { data: creditRow } = await supabaseAdmin
        .from('recruiter_credits')
        .select('balance')
        .eq('recruiter_id', recruiter.id)
        .single();
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        receiptRef: existing.receipt_ref,
        remainingCredits: creditRow?.balance ?? 0,
        contact: contactFrom(candidate),
      });
    }

    // Atomic spend: decrement + ledger + unlock + view rows in one RPC.
    // Raises 'insufficient_credits' when the balance is below 1.
    const receiptRef = `CU-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(3)
      .toString('hex')
      .toUpperCase()}`;
    const { data: remaining, error: rpcError } = await supabaseAdmin.rpc('unlock_candidate_contact', {
      p_recruiter_id: recruiter.id,
      p_profile_id: profileId,
      p_receipt_ref: receiptRef,
    });

    if (rpcError) {
      const msg = String(rpcError.message || '');
      if (msg.includes('insufficient_credits')) {
        return NextResponse.json(
          { error: 'Insufficient credits', packs: await activePacks() },
          { status: 402 }
        );
      }
      throw rpcError;
    }

    // The RPC is idempotent under the row lock: a concurrent unlock of the
    // same pair is not charged twice. The stored receipt tells us which case
    // this was.
    const { data: unlockRow } = await supabaseAdmin
      .from('contact_unlocks')
      .select('receipt_ref, unlocked_at')
      .eq('recruiter_id', recruiter.id)
      .eq('candidate_profile_id', profileId)
      .single();
    const wasAlreadyUnlocked = !unlockRow || unlockRow.receipt_ref !== receiptRef;

    logger.info('unlock', 'contact unlocked', { recruiter: recruiter.id, receiptRef: unlockRow?.receipt_ref });
    return NextResponse.json({
      success: true,
      alreadyUnlocked: wasAlreadyUnlocked,
      receiptRef: unlockRow?.receipt_ref || receiptRef,
      remainingCredits: Number(remaining ?? 0),
      contact: contactFrom(candidate),
    });
  } catch (e: any) {
    logger.error('unlock', 'recruiter/unlock error', e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
