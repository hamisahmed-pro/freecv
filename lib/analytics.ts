import { supabase } from './supabase';

// ---- Session ID ----
const getSessionId = () => {
  if (typeof window === 'undefined') return 'server';
  let sid = localStorage.getItem('cvyon_session_id');
  if (!sid) {
    sid = crypto.randomUUID();
    localStorage.setItem('cvyon_session_id', sid);
  }
  return sid;
};

// ---- Device Detection ----
function getDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
  return 'desktop';
}

// ---- Browser Detection ----
function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera/')) return 'Opera';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('MSIE') || ua.includes('Trident/')) return 'IE';
  return 'Other';
}

// ---- OS Detection ----
function getOS(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac') && !ua.includes('iPhone') && !ua.includes('iPad')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('CrOS')) return 'ChromeOS';
  return 'Other';
}

// ---- Referrer Parsing ----
function getReferrer(): string {
  if (typeof window === 'undefined') return 'direct';
  const ref = document.referrer;
  if (!ref) return 'direct';
  try {
    const hostname = new URL(ref).hostname.replace('www.', '');
    // Don't count self-referrals
    if (hostname === window.location.hostname) return 'direct';
    return hostname;
  } catch {
    return 'direct';
  }
}

// ---- Geo Data (cached per session) ----
interface GeoData {
  country: string;
  city: string;
}

async function getGeoData(): Promise<GeoData> {
  if (typeof window === 'undefined') return { country: '', city: '' };

  // Check session cache first
  const cached = sessionStorage.getItem('cvyon_geo');
  if (cached) {
    try { return JSON.parse(cached); } catch { /* fall through */ }
  }

  // Strategy 1: Client-side ipapi.co (free tier: 1,000/day)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeout);
    
    if (res.ok) {
      const data = await res.json();
      if (data.country_name) {
        const geo = { country: data.country_name, city: data.city || '' };
        sessionStorage.setItem('cvyon_geo', JSON.stringify(geo));
        return geo;
      }
    }
  } catch {
    // ipapi failed (rate limited or network error), fall through to server fallback
  }

  // Strategy 2: Server-side fallback via our own API route
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('/api/geo', { signal: controller.signal });
    clearTimeout(timeout);
    
    if (res.ok) {
      const data = await res.json();
      const geo = { country: data.country || '', city: data.city || '' };
      sessionStorage.setItem('cvyon_geo', JSON.stringify(geo));
      return geo;
    }
  } catch {
    // Both strategies failed, proceed without geo
  }

  return { country: '', city: '' };
}

// ---- Main Track Event ----
export const trackEvent = async (eventType: string, templateId?: string, metadata?: Record<string, any>) => {
  try {
    const geo = await getGeoData();

    await supabase.from('analytics_events').insert([{
      event_type: eventType,
      session_id: getSessionId(),
      template_id: templateId || null,
      country: geo.country || null,
      city: geo.city || null,
      device_type: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      referrer: getReferrer(),
      page_url: typeof window !== 'undefined' ? window.location.pathname : null,
      screen_width: typeof window !== 'undefined' ? window.innerWidth : null,
      metadata: metadata || null
    }]);
  } catch (error) {
    console.error('Analytics tracking failed', error);
  }
};
