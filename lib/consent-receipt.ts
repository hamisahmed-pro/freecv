import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';

export type ConsentChoice = {
  recruiterShare: boolean;
  emailJobs: boolean;
  analytics: boolean;
};
export const CONSENT_COOKIE = 'cvyon_consent_v2';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

function secret(): string {
  const key = process.env.JWT_SECRET;
  if (!key || key.length < 24) throw new Error('Consent receipt signing key is missing');
  return key;
}

export function signConsentReceipt(choice: ConsentChoice): string {
  const payload = Buffer.from(JSON.stringify({
    v: 2, at: Date.now(), nonce: randomUUID(), choice,
  })).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return payload + '.' + signature;
}

export function verifyConsentReceipt(token?: string | null): ConsentChoice | null {
  if (!token || token.length > 1600) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  try {
    const expected = createHmac('sha256', secret()).update(parts[0]).digest();
    const received = Buffer.from(parts[1], 'base64url');
    if (received.length !== expected.length || !timingSafeEqual(expected, received)) return null;
    const parsed = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (parsed.v !== 2 || !Number.isFinite(parsed.at) || parsed.at > Date.now() + 60000 ||
        Date.now() - parsed.at > CONSENT_MAX_AGE_SECONDS * 1000) return null;
    const c = parsed.choice;
    if (typeof c?.recruiterShare !== 'boolean' ||
        typeof c?.emailJobs !== 'boolean' || typeof c?.analytics !== 'boolean') return null;
    return { recruiterShare: c.recruiterShare, emailJobs: c.emailJobs, analytics: c.analytics };
  } catch { return null; }
}
