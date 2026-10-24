import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase';
import { Redis } from '@upstash/redis';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export interface MediaPart {
  inlineData?: {
    data: string;
    mimeType: string;
  };
  fileData?: {
    fileUri: string;
    mimeType: string;
  };
  text?: string;
}

/**
 * Thrown when the Gemini API reports quota/rate-limit exhaustion on every
 * available key+model combo. Routes should catch this and return a clear,
 * honest "temporarily unavailable" response (HTTP 503) instead of a cryptic
 * error. With the key/model pool configured, this is thrown only after every
 * combo has been tried or Redis shows every combo already at its daily cap.
 */
export class AiQuotaExhaustedError extends Error {
  constructor() {
    super('AI is temporarily unavailable — today\u2019s usage limit has been reached. Please try again tomorrow.');
    this.name = 'AiQuotaExhaustedError';
  }
}

/**
 * Thrown when the Gemini API denies access (HTTP 401/403) on every
 * available key. Unlike quota exhaustion this is not about usage limits —
 * the key or its Google project is being refused. Routes should return an
 * honest 503; the owner may need to check the key/project in Google AI
 * Studio. (2026-09-25: seen flapping with 503s during a Gemini outage
 * window — often transient, so denied combos are NOT marked at-cap.)
 */
export class AiAccessDeniedError extends Error {
  constructor() {
    super('The AI service is refusing requests right now (access denied). Please try again in a little while.');
    this.name = 'AiAccessDeniedError';
  }
}

/**
 * Thrown when the Gemini API reports the model itself is overloaded
 * (HTTP 503 UNAVAILABLE / 500 / 502 / 504) on every available key+model
 * combo after backoff retries. Routes should catch this and return an
 * honest "try again in a bit" response (HTTP 503) — it is NOT a quota
 * problem and it is NOT the user's fault. (2026-09-25: the Adaeze
 * import-resume 500s were this — "high demand" 503s misclassified as
 * generic API errors, retried 3x on the same key, then 500.)
 */
export class AiOverloadedError extends Error {
  constructor() {
    super('The AI model is temporarily overloaded. Please try again in a minute or two.');
    this.name = 'AiOverloadedError';
  }
}

// ---------------------------------------------------------------------------
// Gemini key/model pool
//
// Free tier: ~20 generate requests/day per key PER MODEL. Configure:
//   GEMINI_API_KEYS  = comma-separated list of keys (each has its own quota)
//   GEMINI_MODELS    = comma-separated list of models, e.g.
//                      "gemini-3.8-flash,gemini-3.7-flash" (each model has its
//                      own daily budget on every key)
// Legacy single-key setup still works: GEMINI_API_KEY + GEMINI_MODEL.
// Per-key daily usage is tracked in Upstash Redis (shared across serverless
// instances); combos already at cap are skipped before any API call is made.
// Everything fails open: if Redis is down, the pool still rotates blindly.
// ---------------------------------------------------------------------------

const DAILY_CAP = Math.max(1, parseInt(process.env.GEMINI_DAILY_CAP || '20', 10) || 20);

function getKeyList(): string[] {
  const list = (process.env.GEMINI_API_KEYS || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  // Numbered vars GEMINI_API_KEY_1..GEMINI_API_KEY_12 — set one at a time
  // via the secure vault flow so keys never travel through chat or files.
  for (let i = 1; i <= 12; i++) {
    const v = (process.env[`GEMINI_API_KEY_${i}`] || '').trim();
    if (v && !list.includes(v)) list.push(v);
  }
  if (list.length > 0) return list;
  const single = (process.env.GEMINI_API_KEY || '').trim();
  return single ? [single] : [];
}

function getModelList(): string[] {
  const list = (process.env.GEMINI_MODELS || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  if (list.length > 0) return list;
  const legacy = (process.env.GEMINI_MODEL || '').trim();
  // Hamis's chosen rotation pair; each carries its own 20/day free budget.
  return legacy ? [legacy] : ['gemini-3.8-flash', 'gemini-3.7-flash'];
}

function getPoolRedis(): Redis | null {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return Redis.fromEnv();
    }
  } catch {
    // fail open — pool still rotates, just without cross-instance tracking
  }
  return null;
}

// Pacific-time calendar date: Gemini free-tier quota resets at midnight PT.
function pacificDate(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function secondsToNextPacificMidnight(): number {
  const nowMs = Date.now();
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(new Date(nowMs)).map((p) => [p.type, p.value])
  );
  const ptWallAsUtc =
    Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour) % 24,
      Number(parts.minute),
      Number(parts.second)
    ) - nowMs; // PT offset in ms (negative)
  const nowPtAsUtc = nowMs + ptWallAsUtc;
  const nextMidnight = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day) + 1,
    0, 0, 0
  );
  return Math.max(60, Math.ceil((nextMidnight - nowPtAsUtc) / 1000));
}

export interface GeminiCombo {
  keyIndex: number;
  apiKey: string;
  model: string;
}

function usageKey(combo: GeminiCombo): string {
  // keyIndex (not key material) + model + PT date. Never stores secrets.
  return `cvyon:gemini-usage:${combo.keyIndex}:${combo.model}:${pacificDate()}`;
}

function allCombos(): GeminiCombo[] {
  const keys = getKeyList();
  const models = getModelList();
  const combos: GeminiCombo[] = [];
  keys.forEach((apiKey, keyIndex) => {
    models.forEach((model) => combos.push({ keyIndex, apiKey, model }));
  });
  return combos;
}

/** Combos that Redis does not already show at their daily cap. Fails open. */
async function getAvailableCombos(): Promise<GeminiCombo[]> {
  const combos = allCombos();
  if (combos.length === 0) return [];
  const redis = getPoolRedis();
  if (!redis) return combos;
  try {
    const counts = await redis.mget(...combos.map(usageKey));
    const arr = counts as unknown as (string | number | null)[];
    return combos.filter((_, i) => {
      const n = Number(arr[i]);
      return !Number.isFinite(n) || n < DAILY_CAP;
    });
  } catch {
    return combos;
  }
}

/**
 * Record one use of a combo. `exhausted=true` marks it at cap immediately
 * (called when the API tells us this combo's daily quota is spent).
 */
async function recordComboUse(combo: GeminiCombo, exhausted: boolean): Promise<void> {
  const redis = getPoolRedis();
  if (!redis) return;
  try {
    const key = usageKey(combo);
    if (exhausted) {
      await redis.set(key, String(DAILY_CAP), { ex: secondsToNextPacificMidnight() });
    } else {
      const n = await redis.incr(key);
      if (n === 1) await redis.expire(key, secondsToNextPacificMidnight());
    }
  } catch {
    // usage tracking is best-effort; never break generation
  }
}

/**
 * Pick one usable key+model combo (for callers that manage their own
 * single-shot Gemini call, e.g. background enrichment). Returns null when
 * no keys are configured or every combo is at its daily cap.
 */
export async function pickGeminiCombo(): Promise<GeminiCombo | null> {
  const combos = await getAvailableCombos();
  if (combos.length === 0) return null;
  return combos[Math.floor(Math.random() * combos.length)];
}

// ---------------------------------------------------------------------------
// Error classification
// ---------------------------------------------------------------------------

type GeminiFailure = 'quota' | 'ratelimit' | 'overloaded' | 'denied' | 'other';

/**
 * 'quota'      = daily budget spent for this key+model (fail over NOW;
 *                waiting cannot help). Signals: per-day quota language.
 * 'ratelimit'  = per-minute throttling (back off, optionally try next key).
 * 'overloaded' = the model itself is saturated or erroring (HTTP 500/502/
 *                503/504, "high demand", "overloaded", "unavailable").
 *                Back off and spread across keys like ratelimit — the
 *                capacity crunch is usually temporary.
 * 'denied'     = the key/project is refused (HTTP 401/403, permission
 *                denied). Fail over to the next key immediately — another
 *                key may be fine. NOT marked at-cap: denials often flap.
 * 'other'      = API/parse errors (limited retries, same as before).
 */
function classifyGeminiError(err: unknown): GeminiFailure {
  const e = err as any;
  const status = e?.status ?? e?.code;
  const msg = String(e?.message ?? err ?? '').toLowerCase();
  const looksDenied =
    status === 401 ||
    status === 403 ||
    msg.includes('"code":401') ||
    msg.includes('"code":403') ||
    msg.includes('permission_denied') ||
    msg.includes('permission denied') ||
    msg.includes('denied access');
  if (looksDenied) return 'denied';
  const looks5xxTransient =
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504 ||
    msg.includes('"code":500') ||
    msg.includes('"code":502') ||
    msg.includes('"code":503') ||
    msg.includes('"code":504') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('temporarily unavailable') ||
    msg.includes('unavailable');
  if (looks5xxTransient) return 'overloaded';
  const looks429 =
    status === 429 ||
    msg.includes('429') ||
    msg.includes('resource_exhausted') ||
    msg.includes('resource exhausted') ||
    msg.includes('too many requests');
  if (!looks429) return 'other';
  if (
    msg.includes('per_day') ||
    msg.includes('per day') ||
    msg.includes('daily') ||
    msg.includes('check your plan') ||
    msg.includes('billing')
  ) {
    return 'quota';
  }
  return 'ratelimit';
}

/** Extract model text with a diagnostic when the model returns nothing. */
function extractResponseText(response: any): string {
  let text = '';
  try {
    text = response.text || '';
  } catch {
    const candidates: any[] = response?.candidates || [];
    const finishReasons =
      candidates.map((c) => c?.finishReason).filter(Boolean).join(',') || 'none';
    const blockReason = response?.promptFeedback?.blockReason || 'none';
    throw new Error(
      `Gemini returned no text (finishReasons: ${finishReasons}; blockReason: ${blockReason})`
    );
  }
  if (!text) {
    const candidates: any[] = response?.candidates || [];
    const finishReasons =
      candidates.map((c) => c?.finishReason).filter(Boolean).join(',') || 'none';
    throw new Error(`Gemini returned empty text (finishReasons: ${finishReasons})`);
  }
  return text;
}

/**
 * Clean model output into parseable JSON. Besides markdown fences and
 * trailing commas, this escapes ALL raw control characters (U+0000–U+001F)
 * inside string values. The previous version only handled \n \r \t; PDFs
 * frequently contain form feeds and other control chars that echo into
 * model output and make JSON.parse throw — the likely cause of the
 * import-resume HTTP 500 on long resumes (2026-09-25).
 */
function sanitizeJsonText(text: string): string {
  let t = text.replace(/```json\n?|\n?```/gi, '').trim();
  const firstBrace = t.indexOf('{');
  const lastBrace = t.lastIndexOf('}');
  const firstBracket = t.indexOf('[');
  const lastBracket = t.lastIndexOf(']');

  if (firstBrace !== -1 && lastBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    t = t.substring(firstBrace, lastBrace + 1);
  } else if (firstBracket !== -1 && lastBracket !== -1) {
    t = t.substring(firstBracket, lastBracket + 1);
  }

  t = t.replace(/"(?:[^"\\]|\\.)*"/g, (str) =>
    str.replace(/[\u0000-\u001F]/g, (ch) => {
      switch (ch) {
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\t': return '\\t';
        case '\b': return '\\b';
        case '\f': return '\\f';
        default:
          return '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
      }
    })
  );

  // Remove trailing commas
  t = t.replace(/,\s*([}\]])/g, '$1');
  return t;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export async function generateContentWithRetry<T = unknown>(
  prompt: string,
  systemInstruction: string = '',
  maxTokens: number = 2000,
  forceJson: boolean = true,
  mediaParts: MediaPart[] = [],
  endpointName: string = 'unknown',
  // Preferred models, tried first (import passes the models that probed
  // healthy on 2026-10-24). When given, the start combo is deterministic
  // (first preferred) instead of random, so a hanging model cannot burn
  // the route deadline before a healthy model is tried. Fallback to the
  // rest of the pool still applies when preferred models fail or are out.
  preferredModels: string[] = [],
  // Per-attempt cap in ms (0 = disabled). A model that hangs (3.8-flash
  // proved to hang 30s+ on 2026-10-24) must not eat the route's whole
  // deadline: the timeout throws a 503-class error so the pool counts it
  // as an overload strike and rotates, exactly like a fast 503.
  attemptTimeoutMs: number = 0
): Promise<T | string> {
  // 1. Check Circuit Breaker
  try {
    const { data: flag } = await supabaseAdmin
      .from('feature_flags')
      .select('is_enabled')
      .eq('key', 'ai_circuit_breaker')
      .single();

    if (flag && flag.is_enabled === false) {
      throw new Error('AI generation is temporarily disabled due to budget limits.');
    }
  } catch (e) {
    // If table doesn't exist or fetch fails, proceed silently
  }

  // 2. Resolve the pool. Combos already at their daily cap are skipped
  //    before any API call, so a fully-spent pool fails fast with 503.
  let combos = await getAvailableCombos();
  if (combos.length === 0) {
    if (allCombos().length === 0) {
      throw new Error(
        'GEMINI_API_KEY environment variable is missing (or GEMINI_API_KEYS is empty).'
      );
    }
    throw new AiQuotaExhaustedError();
  }

  // Preferred-model ordering: within each key, preferred models come
  // first, so the first attempts go to known-healthy models instead of a
  // random combo that may hang. The cap filter above already ran, so an
  // at-cap preferred combo is simply absent from this list.
  if (preferredModels.length > 0) {
    const rank = (m: string) => {
      const i = preferredModels.indexOf(m);
      return i === -1 ? preferredModels.length : i;
    };
    combos = [...combos].sort((a, b) =>
      a.keyIndex !== b.keyIndex ? a.keyIndex - b.keyIndex : rank(a.model) - rank(b.model)
    );
  }

  // Randomize the starting combo so concurrent requests spread across keys,
  // unless a preferred order was given (then start at the first preferred).
  let ci = preferredModels.length > 0 ? 0 : Math.floor(Math.random() * combos.length);
  const maxAttempts = Math.min(Math.max(combos.length + 2, 4), 16);
  let attempts = 0;
  let rateLimitStreak = 0;
  let overloadFailures = 0;
  let deniedFailures = 0;
  let sawOverload = false;
  let otherFailures = 0;

  while (attempts < maxAttempts && combos.length > 0) {
    const combo = combos[ci % combos.length];
    attempts++;
    try {
      const parts: MediaPart[] = [{ text: systemInstruction + '\n\n' + prompt }];
      if (mediaParts.length > 0) parts.push(...mediaParts);

      const ai = new GoogleGenAI({ apiKey: combo.apiKey });

      const sdkPromise = ai.models.generateContent({
        model: combo.model,
        contents: [{ role: 'user', parts: parts as any }], // GenAI SDK internal type mismatch
        config: {
          temperature: 0.1 + Math.min(otherFailures, 2) * 0.1,
          maxOutputTokens: maxTokens,
          responseMimeType: forceJson ? 'application/json' : 'text/plain'
        }
      });
      // Silence the orphaned SDK promise: when the race below times out,
      // a late rejection from the abandoned call must not surface as an
      // unhandled rejection. Its result is ignored either way.
      sdkPromise.catch(() => {});
      const response = attemptTimeoutMs > 0
        ? await Promise.race([
            sdkPromise,
            delay(attemptTimeoutMs).then(() => {
              throw Object.assign(
                new Error(`Gemini request timed out after ${attemptTimeoutMs}ms (model overloaded)`),
                { status: 503 }
              );
            }),
          ])
        : await sdkPromise;

      await recordComboUse(combo, false);
      rateLimitStreak = 0;

      // Log Usage
      try {
        const usage = response.usageMetadata;
        if (usage) {
          const inputTokens = usage.promptTokenCount || 0;
          const outputTokens = usage.candidatesTokenCount || 0;
          // Approximate cost: $0.075 per 1M input, $0.30 per 1M output for 1.5 flash
          const costEstimate = (inputTokens / 1000000) * 0.075 + (outputTokens / 1000000) * 0.30;

          await supabaseAdmin.from('ai_usage_logs').insert({
            id: crypto.randomUUID(),
            session_id: 'anonymous', // we can extract from headers later if needed
            endpoint: endpointName,
            input_tokens: inputTokens,
            output_tokens: outputTokens,
            cost_estimate: costEstimate,
            cache_hit: false
          });
        }
      } catch (logError) {
        console.warn('Failed to log AI usage', logError);
      }

      const text = extractResponseText(response);

      if (forceJson) {
        const clean = sanitizeJsonText(text);
        try {
          return JSON.parse(clean) as T;
        } catch (parseError) {
          // PII-safe diagnostic for server logs (position info only, no content).
          const msg = parseError instanceof Error ? parseError.message : String(parseError);
          throw new SyntaxError(`JSON parse failed: ${msg} (response length ${clean.length})`);
        }
      }

      return text;
    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      if (errMessage.includes('AI generation is temporarily disabled')) {
        throw error;
      }
      if (error instanceof AiQuotaExhaustedError) {
        throw error;
      }

      const kind = classifyGeminiError(error);

      if (kind === 'denied') {
        // This key/project is refused (401/403). Don't wait and don't
        // burn the 3-strike budget — try the next key immediately. Not
        // marked at-cap in Redis: denials often flap (seen alternating
        // with 503s during a Gemini outage window).
        deniedFailures++;
        rateLimitStreak = 0;
        console.warn(`[gemini-pool] access denied on key#${combo.keyIndex}/${combo.model} (failure ${deniedFailures}); failing over`);
        if (deniedFailures >= combos.length) {
          throw new AiAccessDeniedError();
        }
        ci++;
        continue;
      }

      if (kind === 'quota') {
        // Daily budget for this key+model is spent — waiting cannot help.
        // Mark it and move to the next combo immediately.
        console.warn(
          `[gemini-pool] key#${combo.keyIndex}/${combo.model} daily quota exhausted; failing over (${combos.length - 1} combos left)`
        );
        await recordComboUse(combo, true);
        combos = combos.filter((_, i) => i !== ci % combos.length);
        rateLimitStreak = 0;
        if (combos.length === 0) {
          throw new AiQuotaExhaustedError();
        }
        ci = ci % combos.length;
        await delay(300);
        continue;
      }

      if (kind === 'overloaded') {
        // The model itself is saturated or erroring (HTTP 503 etc.).
        // Hard cap: 3 overload failures total, then report honestly.
        // This MUST stay well under the route's maxDuration (60s):
        // back off briefly and rotate to the next key each time.
        sawOverload = true;
        overloadFailures++;
        rateLimitStreak = 0;
        console.warn(`[gemini-pool] model overloaded on key#${combo.keyIndex}/${combo.model} (failure ${overloadFailures}/3)`);
        if (overloadFailures >= 3) {
          throw new AiOverloadedError();
        }
        await delay(Math.min(2000 * Math.pow(2, overloadFailures - 1), 8000));
        ci++; // spread the next attempt to another key
        continue;
      }

      if (kind === 'ratelimit') {
        // Per-minute throttling: back off; after a couple of hits on the
        // same combo, spread the load to the next key instead of waiting.
        rateLimitStreak++;
        console.warn(`[gemini-pool] rate limit on key#${combo.keyIndex}/${combo.model} (streak ${rateLimitStreak}); backing off`);
        await delay(Math.min(1000 * Math.pow(2, rateLimitStreak), 8000));
        if (rateLimitStreak >= 2) {
          ci++;
          rateLimitStreak = 0;
        }
        continue;
      }

      otherFailures++;
      console.warn(`AI Generation Attempt ${attempts} failed:`, errMessage);

      if (otherFailures >= 3) {
        const lastKind = error instanceof SyntaxError ? 'parse' : 'api';
        throw new Error(forceJson ? `Failed to generate valid JSON after 3 attempts (last failure: ${lastKind}: ${errMessage})` : `AI generation failed after 3 attempts (last failure: ${lastKind}: ${errMessage})`);
      }

      await delay(1000 * Math.pow(2, otherFailures - 1));

      if (error instanceof SyntaxError && forceJson) {
        prompt = `CRITICAL SYSTEM ERROR PREVIOUSLY: YOU MUST RETURN ONLY RAW, VALID, PARSABLE JSON. NO MARKDOWN. NO BACKTICKS. NO CONVERSATION. \n\n` + prompt;
      }
    }
  }

  // Attempts exhausted: report WHY. Model overload gets its own honest
  // error (retry soon); true quota exhaustion keeps the daily-limit message.
  throw sawOverload ? new AiOverloadedError() : new AiQuotaExhaustedError();
}
