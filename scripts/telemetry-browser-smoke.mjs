/**
 * Browser QA for CVYON's live, public consent screen.
 * Server endpoints are intercepted and no CRM or analytics record is saved.
 * Tests distinguish a declined visitor from one who explicitly opted in.
 */
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';

const base = process.env.CVYON_QA_BASE_URL || 'https://cvyon.com';
const browser = await chromium.launch({ headless: true });
let failed = false;
async function check(label, consent) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const acceptedEvents = [];
  const otherRequests = [];
  try {
    await page.route('**/api/analytics', async route => {
      acceptedEvents.push(route.request().postDataJSON());
      await route.fulfill({ status: 204, body: '' });
    });
    await page.route('**/api/crm/optin', async route => {
      otherRequests.push(route.request().url());
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"skipped":true}' });
    });
    await page.route('**/api/consent/ack', async route => {
      const choice = route.request().postDataJSON();
      assert.equal(choice.recruiterShare, false);
      assert.equal(choice.emailJobs, false);
      assert.equal(choice.analytics, consent === 'granted');
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"saved":true,"version":2}' });
    });
    // Do not transmit synthetic QA data to Google Analytics.
    await page.route('**/www.googletagmanager.com/**', route => route.abort());
    await page.route('**/www.google-analytics.com/**', route => route.abort());

    const r = await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
    assert.equal(r?.status(), 200);
    const dialog = page.getByRole('dialog', { name: 'Privacy and Data Preferences' });
    await dialog.waitFor({ timeout: 15000 });
    assert.equal(await dialog.getByRole('checkbox', { name: 'Allow recruiters to find my profile' }).getAttribute('aria-checked'), 'false');
    assert.equal(await dialog.getByRole('checkbox', { name: 'Job Alerts & Matching' }).getAttribute('aria-checked'), 'false');
    assert.equal(await dialog.getByRole('checkbox', { name: 'Anonymous Analytics' }).getAttribute('aria-checked'), 'false');

    if (consent === 'granted') {
      await dialog.getByRole('checkbox', { name: 'Anonymous Analytics' }).click();
    }
    await dialog.getByRole('button', { name: 'Save', exact: true }).click();
    await dialog.waitFor({ state: 'hidden', timeout: 12000 });
    await page.waitForTimeout(1200);
    assert.equal(otherRequests.length, 0, 'No unsolicited CRM opt-in');
    if (consent === 'granted') {
      assert.ok(acceptedEvents.some(e => e.event_type === 'page_view'), 'Opted-in page_view not sent');
      for (const item of acceptedEvents) {
        assert.match(item.event_id, /^[0-9a-f-]{36}$/i);
        assert.match(item.session_id, /^[0-9a-f-]{36}$/i);
        assert.equal(item.qa, true, 'Headless QA activity must be classified');
      }
    } else {
      assert.equal(acceptedEvents.length, 0, 'Declined visitor sent a tracking event');
    }
    console.log('PASS', label, JSON.stringify({ eventTypes: acceptedEvents.map(x=>x.event_type) }));
  } catch (err) {
    failed = true;
    console.error('FAIL', label, err);
  } finally {
    await context.close();
  }
}
await check('declined consent', 'declined');
await check('analytics-only consent', 'granted');
await browser.close();
if (failed) process.exitCode = 1;
