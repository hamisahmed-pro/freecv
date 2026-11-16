import test from 'node:test';
import assert from 'node:assert/strict';
import { signConsentReceipt, verifyConsentReceipt } from '../lib/consent-receipt';

const ORIGINAL_SECRET = process.env.JWT_SECRET;
const QA_SECRET = 'cvyon-only-testing-secret-strong-20261116';
test.after(() => { 
  if (ORIGINAL_SECRET === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = ORIGINAL_SECRET;
});

test('consent: explicitly selected choices round-trip in a signed receipt', () => {
  process.env.JWT_SECRET = QA_SECRET;
  const choice = { analytics: true, emailJobs: false, recruiterShare: false };
  const token = signConsentReceipt(choice);
  assert.deepEqual(verifyConsentReceipt(token), choice);
});

test('consent: tampered receipts are rejected', () => {
  process.env.JWT_SECRET = QA_SECRET;
  const token = signConsentReceipt({ analytics: true, recruiterShare: false, emailJobs: false });
  const parts = token.split('.');
  const altered = parts[0].slice(0, -1) + (parts[0].endsWith('x') ? 'y' : 'x') + '.' + parts[1];
  assert.equal(verifyConsentReceipt(altered), null);
  assert.equal(verifyConsentReceipt('invalid'), null);
});

test('consent: expired receipts cannot authorize future analytics', () => {
  process.env.JWT_SECRET = QA_SECRET;
  const realNow = Date.now;
  try {
    const t0 = realNow();
    Date.now = () => t0;
    const token = signConsentReceipt({ analytics: true, emailJobs: true, recruiterShare: false });
    Date.now = () => t0 + 92 * 86400 * 1000;
    assert.equal(verifyConsentReceipt(token), null);
  } finally { Date.now = realNow; }
});

test('consent: an unknown or missing signing key fails closed', () => {
  process.env.JWT_SECRET = QA_SECRET;
  const token = signConsentReceipt({ analytics: true, emailJobs: true, recruiterShare: true });
  process.env.JWT_SECRET = 'another-testing-only-secret-strong-20261116';
  assert.equal(verifyConsentReceipt(token), null);
});
