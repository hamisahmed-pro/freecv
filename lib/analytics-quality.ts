// Analytics quality: bot-session detection + honest funnel math.
//
// Lessons (2026-10-01): the admin funnel was unreadable because (a) "Started CV"
// and "Downloaded CV" counted RAW EVENTS, so one scripted session firing ~300
// back-to-back events inflated both sides, and (b) nothing excluded bot-like
// sessions at all. This module is the single source of truth for both fixes.
// It is pure functions only (no window/localStorage) so it is safe to import
// from client components and server routes alike. Raw events are NEVER dropped
// from storage — filtering happens at read/aggregate time so heuristics stay
// reversible and auditable.

// ---- Canonical event names (must match the strings passed to trackEvent()) ----
export const EVT_PAGE_VIEW = 'page_view';
export const EVT_LANDING_STARTED = 'landing_started';
export const EVT_STARTED = 'milestone_started';
export const EVT_PREVIEWED = 'milestone_previewed';
export const EVT_TEMPLATE_SELECTED = 'template_selected';
/** Download completions: the builder fires milestone_downloaded (docx/pdf) and
 *  PDFDownloadButton fires milestone_downloaded too. resume_downloaded is kept
 *  in DOWNLOAD_EVENTS for historical events. Both mean the user got a file. */
export const DOWNLOAD_EVENTS = ['milestone_downloaded', 'resume_downloaded'] as const;

// ---- Bot heuristics ----
// Tuned 2026-10-01 from observed scripted bursts (one session: ~250 back-to-back
// recruiter events; another: ~300 back-to-back build-page events on 2026-09-30).
// Deliberately conservative — a real human session never approaches these volumes.
export const BOT_MAX_EVENTS_PER_SESSION = 100;
export const BOT_MAX_REPEAT_EVENT = 30;

export interface QualityReport {
  /** session_ids flagged as bot-like */
  botSessions: Set<string>;
  /** events excluding bot-like sessions */
  humanEvents: any[];
  botEventCount: number;
  botSessionCount: number;
}

const sidOf = (e: any): string => e?.session_id || 'unknown';

export function analyzeSessionQuality(events: any[]): QualityReport {
  const perSession = new Map<string, { total: number; byType: Map<string, number> }>();
  for (const e of events) {
    const sid = sidOf(e);
    let s = perSession.get(sid);
    if (!s) { s = { total: 0, byType: new Map() }; perSession.set(sid, s); }
    s.total += 1;
    s.byType.set(e.event_type, (s.byType.get(e.event_type) || 0) + 1);
  }
  const botSessions = new Set<string>();
  for (const [sid, s] of perSession) {
    if (s.total > BOT_MAX_EVENTS_PER_SESSION) { botSessions.add(sid); continue; }
    for (const n of s.byType.values()) {
      if (n > BOT_MAX_REPEAT_EVENT) { botSessions.add(sid); break; }
    }
  }
  const humanEvents = events.filter((e) => !botSessions.has(sidOf(e)));
  return {
    botSessions,
    humanEvents,
    botEventCount: events.length - humanEvents.length,
    botSessionCount: botSessions.size,
  };
}

export interface Funnel {
  /** unique human sessions */
  sessions: number;
  /** unique sessions with >= 1 milestone_started */
  started: number;
  /** unique sessions with >= 1 download-completion event */
  downloaded: number;
  /** started / sessions */
  startRate: number;
  /** downloaded / started */
  downloadRate: number;
}

/** Session-based funnel: every stage counts UNIQUE SESSIONS, never raw events,
 *  so a burst of 300 events from one session contributes exactly 1, not 300. */
export function computeFunnel(events: any[]): Funnel {
  const sessions = new Set<string>();
  const started = new Set<string>();
  const downloaded = new Set<string>();
  for (const e of events) {
    const sid = sidOf(e);
    sessions.add(sid);
    if (e.event_type === EVT_STARTED) started.add(sid);
    else if ((DOWNLOAD_EVENTS as readonly string[]).includes(e.event_type)) downloaded.add(sid);
  }
  const s = sessions.size;
  const st = started.size;
  const dl = downloaded.size;
  return {
    sessions: s,
    started: st,
    downloaded: dl,
    startRate: s ? st / s : 0,
    downloadRate: st ? dl / st : 0,
  };
}
