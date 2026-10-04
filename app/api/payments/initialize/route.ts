import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

// Fixed conversion rate set by Hamis: 1 INR = 13.82 NGN.
// The INR amount is NEVER trusted from the client for charging —
// the NGN/kobo figure is always recomputed here, server-side.
const INR_TO_NGN = 13.82;
const MIN_INR = 100;
const MAX_INR = 500000;

export async function POST(req: Request) {
  const limited = await checkRateLimit(req, { limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const inr = Number(body.inr_amount);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!Number.isFinite(inr) || inr < MIN_INR || inr > MAX_INR) {
      return NextResponse.json(
        { error: `Amount must be between ₹${MIN_INR.toLocaleString('en-IN')} and ₹${MAX_INR.toLocaleString('en-IN')}.` },
        { status: 400 }
      );
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      logger.error('payments', 'PAYSTACK_SECRET_KEY is not set');
      return NextResponse.json({ error: 'Payment service not configured. Please try again later.' }, { status: 500 });
    }

    const ngn = inr * INR_TO_NGN;
    const kobo = Math.round(ngn * 100); // Paystack charges in kobo

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://cvyon.com';

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: kobo,
        currency: 'NGN',
        callback_url: `${siteUrl}/payments/verify`,
        metadata: {
          source: 'inr-payments',
          inr_amount: inr.toFixed(2),
          ngn_amount: (kobo / 100).toFixed(2),
          rate: String(INR_TO_NGN),
        },
      }),
    });

    const result = await response.json();
    if (!result.status) {
      throw new Error(result.message || 'Failed to initialize Paystack transaction');
    }

    return NextResponse.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
      inr_amount: inr.toFixed(2),
      ngn_amount: (kobo / 100).toFixed(2),
    });
  } catch (error: any) {
    logger.error('payments', 'initialize error:', error);
    return NextResponse.json({ error: 'Could not start the payment. Please try again.' }, { status: 500 });
  }
}
