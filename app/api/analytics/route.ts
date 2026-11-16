import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { CONSENT_COOKIE, verifyConsentReceipt } from '@/lib/consent-receipt';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BOT_RE = /bot|crawler|spider|slurp|headless|lighthouse|playwright|puppeteer|selenium|phantom|curl|wget|axios|python/i;
const META_KEYS = new Set([
  'source', 'page', 'format', 'device_type', 'density', 'tone', 'reason',
  'feature', 'template', 'score', 'word_count', 'char_count', 'experience_count',
  'education_count', 'skills_count', 'section_count', 'source_type', 'download_type',
  'generation_mode', 'file_size', 'selected_template', 'start_method',
]);
function browser(ua: string) {
  if (BOT_RE.test(ua)) return 'Bot';
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/SamsungBrowser\//i.test(ua)) return 'Samsung Internet';
  if (/Chrome\//i.test(ua)) return 'Chrome';
  if (/Safari\//i.test(ua)) return 'Safari';
  return 'Other';
}
function os(ua: string) {
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad/i.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Macintosh/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Other';
}
function device(ua: string) {
  if (/iPad|tablet/i.test(ua)) return 'tablet';
  if (/mobi|iPhone|Android/i.test(ua)) return 'mobile';
  return 'desktop';
}
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (!origin || origin !== req.nextUrl.origin)
    return NextResponse.json({ error: 'Origin rejected' }, { status: 403 });
  const consent = verifyConsentReceipt(req.cookies.get(CONSENT_COOKIE)?.value);
  if (!consent?.analytics)
    return NextResponse.json({ error: 'Analytics consent required' }, { status: 403 });
  const limited = await checkRateLimit(req, { limit: 100, windowMs: 60_000 });
  if (limited) return limited;
  let b: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 3000) return NextResponse.json({ error: 'Too large' }, { status: 413 });
    b = JSON.parse(raw);
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw Error('Invalid');
  } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }); }
  const event = String(b.event_type || '');
  const sid = String(b.session_id || '');
  const eid = String(b.event_id || '');
  const page = String(b.page_url || '');
  const timestamp = typeof b.created_at === 'string' ? new Date(b.created_at) : new Date(NaN);
  if (!/^[a-z][a-z0-9_]{2,63}$/.test(event) || !UUID_RE.test(sid) ||
      !UUID_RE.test(eid) || !page.startsWith('/') || page.length > 250 ||
      !Number.isFinite(timestamp.getTime()) ||
      Math.abs(Date.now() - timestamp.getTime()) > 12 * 60 * 60 * 1000)
    return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
  const ua = (req.headers.get('user-agent') || '').slice(0, 300);
  const mode = BOT_RE.test(ua) || b.webdriver === true ? 'bot' :
    b.qa === true || page.startsWith('/admin') || page.startsWith('/dashboard') ? 'internal' : 'unclassified';
  const meta: Record<string, string | number | boolean> = { source: 'browser' };
  if (b.metadata && typeof b.metadata === 'object' && !Array.isArray(b.metadata)) {
    for (const [key, value] of Object.entries(b.metadata as Record<string, unknown>)) {
      if (META_KEYS.has(key) && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
        meta[key] = typeof value === 'string' ? value.slice(0, 80) : value;
      }
    }
  }
  const utm: Record<string, string | null> = {};
  for (const key of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']) {
    const val = b[key];
    utm[key] = typeof val === 'string' ? val.slice(0, 150) : null;
  }
  const countryHeader = req.headers.get('x-vercel-ip-country') || '';
  const country = /^[A-Z]{2}$/.test(countryHeader) ? countryHeader : null;
  const refer = typeof b.referrer === 'string' && /^[a-z0-9.-]{1,120}$/i.test(b.referrer)
    ? b.referrer : 'direct';
  const { error } = await supabaseAdmin.from('analytics_events').insert({
    id: eid, event_id: eid, created_at: timestamp.toISOString(),
    event_type: event, session_id: sid, page_url: page,
    template_id: typeof b.template_id === 'string' ? b.template_id.slice(0, 80) : null,
    screen_width: Number.isInteger(b.screen_width) && Number(b.screen_width) >= 0 && Number(b.screen_width) <= 20000 ? b.screen_width : null,
    country, city: null, referrer: refer, device_type: device(ua),
    browser: browser(ua), os: os(ua), metadata: meta, traffic_type: mode,
    ...utm,
  });
  if (error) {
    if (error.code === '23505') return new Response(null, { status: 204 });
    console.error('[analytics] Supabase rejected event', { code: error.code, message: error.message });
    return NextResponse.json({ error: 'Event storage unavailable' }, { status: 503 });
  }
  return new Response(null, { status: 204 });
}
