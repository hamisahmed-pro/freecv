import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const read = (pathName: string) => readFileSync(path.resolve(process.cwd(), pathName), 'utf8');

test('privacy: export buttons do not submit resume PII to CRM', () => {
  const source = read('components/builder/BuilderClient.tsx');
  const start = source.indexOf('const handleDocxExport = ');
  const end = source.indexOf('const handleAddSkill = ', start);
  const pdfStart = source.indexOf('const handleDownload = ');
  const pdfEnd = source.indexOf('// =====', pdfStart);
  assert.ok(start > 0 && end > start);
  assert.ok(pdfStart > 0);
  assert.ok(!source.slice(start, end).includes('/api/crm/optin'));
  assert.ok(!source.slice(pdfStart, pdfEnd > pdfStart ? pdfEnd : pdfStart + 5500).includes('/api/crm/optin'));
});

test('privacy: user analytics never returns site-wide event records', () => {
  const endpoint = read('app/api/user/analytics/route.ts');
  assert.ok(endpoint.includes("from('profile_views')"));
  assert.ok(endpoint.includes(".eq('candidate_profile_id', candidate.id)"));
  assert.ok(!endpoint.includes("from('analytics_events')"));
  assert.ok(endpoint.includes('candidate_recruiter_search_impressions'));
  assert.ok(endpoint.includes('searchAppearances'));
  assert.ok(endpoint.includes('profileViews: null'));
});

test('privacy: explicit consent is required before optional CRM sharing', () => {
  const consent = read('components/ConsentManager.tsx');
  const api = read('app/api/crm/optin/route.ts');
  assert.ok(consent.includes("localStorage.getItem('cvyon-consent-v2') !== 'acknowledged'"));
  assert.ok(api.includes('verifyConsentReceipt'));
  assert.ok(api.includes('Explicit consent receipt required'));
});

test('analytics: session ID has inactivity expiry and does not persist across browser tabs', () => {
  const source = read('lib/analytics.ts');
  assert.ok(source.includes('30 * 60 * 1000'));
  assert.ok(source.includes('sessionStorage.getItem(SESSION_KEY)'));
  assert.ok(!source.includes("localStorage.getItem(SESSION_KEY)"));
});
