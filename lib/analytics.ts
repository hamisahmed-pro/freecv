// Browser telemetry: explicit consent, 30-minute sessions, first-party delivery.
// No third-party geo call or personal resume content is sent to analytics.
const CONSENT_KEY = 'cvyon-consent-v2';
const SESSION_KEY = 'cvyon_session_v2';
const SESSION_IDLE_MS = 30 * 60 * 1000;

function currentSessionId(): string {
  const now = Date.now();
  try {
    const saved = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null') as { id?: string; last?: number } | null;
    const valid = saved && typeof saved.id === 'string' &&
      /^[0-9a-f-]{36}$/i.test(saved.id) && typeof saved.last === 'number' &&
      now - saved.last < SESSION_IDLE_MS && saved.last <= now;
    const id = valid ? saved!.id! : crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, last: now }));
    return id;
  } catch { return crypto.randomUUID(); }
}

const BOT_RE = /bot|crawler|spider|headless|lighthouse|playwright|puppeteer|selenium|phantom/i;
function allowed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem(CONSENT_KEY) !== 'acknowledged') return false;
    // Read the persisted preferences rather than a stale component closure.
    const state = JSON.parse(localStorage.getItem('cvyon-storage') || '{}');
    return state?.state?.data?.consents?.analytics === true;
  } catch { return false; }
}

function sourceParams(): Record<string, string | null> {
  const q = new URLSearchParams(window.location.search);
  const result: Record<string, string | null> = {};
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
    result[key] = q.get(key)?.slice(0, 150) || null;
  }
  return result;
}

export function getUTMParams() {
  if (typeof window === 'undefined') return {
    utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null,
  };
  return sourceParams();
}

function qaMode(): boolean {
  try {
    return localStorage.getItem('cvyon_analytics_exclude') === 'true' ||
      location.pathname.startsWith('/admin') ||
      navigator.webdriver === true;
  } catch { return false; }
}

let lastPageView: { path: string; at: number } | null = null;
const GA_EVENTS: Record<string, string> = {
  milestone_started: 'resume_builder_started',
  download_completed: 'file_download',
  ats_grader_completed: 'ats_analysis_completed',
  cover_letter_generated: 'cover_letter_generated',
  affiliate_job_clicked: 'select_content',
};

export async function trackEvent(
  eventType: string, templateId?: string, metadata?: Record<string, unknown>
): Promise<void> {
  if (!allowed() || !/^[a-z][a-z0-9_]{2,63}$/.test(eventType)) return;
  if (eventType === 'page_view') {
    const now = Date.now();
    if (lastPageView?.path === window.location.pathname && now - lastPageView.at < 2000) return;
    lastPageView = { path: window.location.pathname, at: now };
  }
  try {
    const body = JSON.stringify({
      event_id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      event_type: eventType,
      session_id: currentSessionId(),
      template_id: templateId || null,
      page_url: window.location.pathname.slice(0, 250),
      referrer: (() => {
        try { return document.referrer ? new URL(document.referrer).hostname : 'direct'; }
        catch { return 'direct'; }
      })(),
      ...sourceParams(),
      screen_width: window.innerWidth,
      metadata: metadata || null,
      qa: qaMode(),
      webdriver: navigator.webdriver === true,
    });
    if (body.length > 3000) return;
    // The endpoint checks the server-signed consent cookie, validates fields and
    // deduplicates by event_id + created_at. It never trusts client conversions as payments.
    const promise = fetch('/api/analytics', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body, keepalive: true, credentials: 'same-origin',
    });
    // GA4 reflects user consent and receives no resume text, email or identities.
    const gaName = GA_EVENTS[eventType];
    if (gaName && !qaMode() && !BOT_RE.test(navigator.userAgent)) {
      (window as Window & { gtag?: (...a: unknown[]) => void }).gtag?.(
        'event', gaName, { page_path: window.location.pathname, template_id: templateId || undefined }
      );
    }
    const res = await promise;
    if (!res.ok && process.env.NODE_ENV !== 'production') console.warn('Telemetry rejected', res.status);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.warn('Telemetry delivery failed', error);
  }
}
