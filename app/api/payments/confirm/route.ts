import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

/**
 * POST /api/payments/confirm { reference }
 * Verifies a Paystack reference server-side for the public INR payments page.
 * Only references created by /api/payments/initialize (metadata.source ===
 * 'inr-payments') are accepted — an unrelated successful transaction cannot
 * be passed off as payment here.
 */
export async function POST(req: Request) {
  const limited = await checkRateLimit(req, { limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const { reference } = await req.json().catch(() => ({}));
    if (!reference || typeof reference !== 'string' || reference.length > 100) {
      return NextResponse.json({ ok: false, error: 'Missing transaction reference.' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      logger.error('payments', 'PAYSTACK_SECRET_KEY is not set');
      return NextResponse.json({ ok: false, error: 'Payment service not configured.' }, { status: 500 });
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );
    const result = await response.json();
    const data = result?.data;

    if (!result?.status || data?.status !== 'success') {
      return NextResponse.json({ ok: false, error: 'This payment was not successful.' }, { status: 402 });
    }
    if (data?.metadata?.source !== 'inr-payments') {
      logger.warn('payments', 'reference source mismatch for', reference);
      return NextResponse.json({ ok: false, error: 'Transaction reference not recognized.' }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      reference,
      inr_amount: data.metadata.inr_amount,
      ngn_amount: (data.amount / 100).toFixed(2),
      paid_at: data.paid_at,
    });
  } catch (error: any) {
    logger.error('payments', 'confirm error:', error);
    return NextResponse.json({ ok: false, error: 'Could not verify the payment. Please try again.' }, { status: 500 });
  }
}
