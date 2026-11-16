import { NextRequest, NextResponse } from 'next/server';
import { CONSENT_COOKIE, CONSENT_MAX_AGE_SECONDS, signConsentReceipt } from '@/lib/consent-receipt';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin || origin !== req.nextUrl.origin) {
    return NextResponse.json({ error: 'Same-origin request required' }, { status: 403 });
  }
  const limited = await checkRateLimit(req, { limit: 12, windowMs: 60_000 });
  if (limited) return limited;
  let body: unknown;
  try {
    if (Number(req.headers.get('content-length') || 0) > 1000) throw Error('size');
    body = await req.json();
  } catch { return NextResponse.json({ error: 'Invalid consent choice' }, { status: 400 }); }
  const b = body as Record<string, unknown> | null;
  if (!b || typeof b !== 'object' ||
      typeof b.recruiterShare !== 'boolean' || typeof b.emailJobs !== 'boolean' ||
      typeof b.analytics !== 'boolean') {
    return NextResponse.json({ error: 'All three consent choices are required' }, { status: 400 });
  }
  try {
    const receipt = signConsentReceipt({
      recruiterShare: b.recruiterShare, emailJobs: b.emailJobs, analytics: b.analytics,
    });
    const response = NextResponse.json({ saved: true, version: 2 }, { status: 200 });
    response.cookies.set(CONSENT_COOKIE, receipt, {
      httpOnly: true, secure: req.nextUrl.protocol === 'https:', sameSite: 'lax',
      path: '/', maxAge: CONSENT_MAX_AGE_SECONDS,
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Consent preferences unavailable' }, { status: 503 });
  }
}
