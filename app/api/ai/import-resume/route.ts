import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiError } from '@/lib/api-error';
import { generateContentWithRetry, AiQuotaExhaustedError, AiOverloadedError, AiAccessDeniedError } from '@/lib/ai-retry';
import { createHash } from 'crypto';
import { Redis } from '@upstash/redis';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Minimum extracted characters to trust the text path. Below this the PDF is
// probably scanned/image-based, so we fall back to Gemini's native PDF input.
const MIN_TEXT_CHARS = 100;
const MAX_TEXT_CHARS = 30000;

// Parsed results are cached by SHA-256 of the uploaded bytes for 30 days.
// Re-importing the same file (retries, capture pipelines, re-uploads) costs
// zero Gemini quota.
const IMPORT_CACHE_TTL_SECONDS = 30 * 24 * 3600;

// Vercel kills this function at maxDuration (60s) and answers with a
// plain-text 504 ("An error occurred with your deployment...") that the
// client cannot parse as JSON. Time-box the AI work so we always return a
// JSON error ourselves before that happens. 55s (not 60s) so the JSON
// error still has room to be returned; 48s was too tight once the pool
// must rotate past a hanging model before reaching a healthy one.
const AI_DEADLINE_MS = 55_000;

class AiTimeoutError extends Error {
  constructor() {
    super('AI_TIMEOUT');
    this.name = 'AiTimeoutError';
  }
}

async function withAiDeadline<T>(promise: Promise<T>): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new AiTimeoutError()), AI_DEADLINE_MS);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function getImportCache(): Redis | null {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return Redis.fromEnv();
    }
  } catch {
    // fail open — caching is an optimization, never a requirement
  }
  return null;
}

/**
 * pdfjs-dist references DOMMatrix at module load (rendering path), which
 * does not exist in the Node.js serverless runtime. Text extraction never
 * renders, so a minimal stand-in is sufficient to let the module load.
 */
function ensureDomMatrix() {
  const g = globalThis as any;
  if (g.DOMMatrix) return;
  g.DOMMatrix = class DOMMatrixPolyfill {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
    constructor(init?: number[] | string) {
      if (Array.isArray(init) && init.length >= 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init;
      }
    }
    multiplySelf(_m?: any) { return this; }
    preMultiplySelf(_m?: any) { return this; }
    translate(_x = 0, _y = 0) { return this; }
    scale(_x = 1, _y?: number) { return this; }
    invertSelf() { return this; }
  };
}

/**
 * Extract selectable text from a PDF server-side with pdfjs-dist (already a
 * dependency via react-pdf). The legacy build runs in Node without a worker
 * for pure text extraction.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  ensureDomMatrix();
  const pdfjsLib: any = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const doc = await pdfjsLib.getDocument({ data }).promise;
  try {
    let text = '';
    const maxPages = Math.min(doc.numPages, 10);
    for (let i = 1; i <= maxPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const pageText = (content.items as any[])
        .map((item) => (typeof item?.str === 'string' ? item.str : ''))
        .join(' ');
      text += pageText + '\n';
      if (text.length > MAX_TEXT_CHARS) break;
    }
    return text.replace(/[ \t\u00a0]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  } finally {
    if (typeof doc.destroy === 'function') {
      await doc.destroy().catch(() => {});
    }
  }
}

/**
 * Defense in depth against model placeholder leakage (observed live
 * 2026-10-25: every imported company came back as "[Company Name]").
 * A string that is nothing but a bracketed phrase is a placeholder by
 * construction, never a real value — blank it in place rather than
 * letting it reach the builder. Mutates and returns nothing; safe to
 * call on the const parsed object.
 */
function stripPlaceholders(value: unknown): void {
  if (Array.isArray(value)) {
    value.forEach(stripPlaceholders);
    return;
  }
  if (value !== null && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        if (/^\[.*\]$/.test(v.trim())) obj[k] = '';
      } else {
        stripPlaceholders(v);
      }
    }
  }
}

export async function POST(req: Request) {
  const rateLimitResponse = await checkRateLimit(req);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Please upload a valid PDF file' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Magic-byte validation: the `file.type` check above only inspects the
    // attacker-controlled multipart Content-Type. Refuse anything that isn't
    // actually a PDF before it reaches the parser or the AI fallback, so
    // arbitrary bytes can't be laundered into paid model calls.
    if (buffer.subarray(0, 5).toString('ascii') !== '%PDF-') {
      return NextResponse.json({ error: 'Please upload a valid PDF file' }, { status: 400 });
    }

    // Content-hash cache: identical bytes => identical parse. Skip Gemini.
    // v2 prefix (2026-10-25): v1 cached parses predate the placeholder
    // scrub below, so a re-import of the same file must NOT return a
    // stale "[Company Name]" parse.
    const fingerprint = createHash('sha256').update(buffer).digest('hex');
    const cacheKey = `cvyon:import-cache:v2:${fingerprint}`;
    const cache = getImportCache();
    if (cache) {
      try {
        const hit = await cache.get<string>(cacheKey);
        if (hit) {
          logger.info('import-resume', 'cache HIT — returning stored parse, no Gemini call');
          const parsed = typeof hit === 'string' ? JSON.parse(hit) : hit;
          return NextResponse.json(parsed, { headers: { 'X-Cache': 'HIT' } });
        }
      } catch (cacheReadError) {
        logger.warn('import-resume', 'cache read failed (non-fatal):', cacheReadError);
      }
    }
    const storeInCache = async (parsedData: unknown) => {
      if (!cache) return;
      try {
        await cache.set(cacheKey, JSON.stringify(parsedData), { ex: IMPORT_CACHE_TTL_SECONDS });
      } catch (cacheWriteError) {
        logger.warn('import-resume', 'cache write failed (non-fatal):', cacheWriteError);
      }
    };

    const systemInstruction = `You are an expert ATS (Applicant Tracking System) parser. Your job is to read the attached PDF and structure it EXACTLY according to the JSON schema.`;

    const schemaBlock = `
Rules:
1. Extract as much relevant information as possible.
2. If a field is missing, leave it as an empty string ("") or empty array ([]).
3. Do not make up information.
4. Format dates consistently if possible (e.g., "Jan 2020 - Present").
5. Return ONLY RAW valid JSON. Do NOT include markdown code blocks or backticks.
6. Make sure all strings are properly escaped. Do not use unescaped newlines in JSON values.
7. If the resume contains information that does not fit into standard sections, map them into the "customSections" array.
8. NEVER output bracketed placeholders such as "[Company Name]", "[Your Name]", or "[Date]". If a value cannot be found in the resume, use an empty string ("") or an empty array ([]) — never fill the slot with a placeholder.
9. Extract the education section completely: every institution with its degree/qualification and years, even if the section is titled differently (e.g. "Academic Background", "Qualifications", "Training"). Education belongs in the "education" array, never in "customSections".

JSON Schema to match:
{
  "personalInfo": {
    "fullName": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string"
  },
  "summary": "string",
  "experience": [
    {
      "id": "string (generate unique id)",
      "company": "string",
      "role": "string",
      "startDate": "string",
      "endDate": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "id": "string (generate unique id)",
      "school": "string",
      "degree": "string",
      "graduationYear": "string"
    }
  ],
  "skills": [
    {
      "id": "string (generate unique id)",
      "name": "string"
    }
  ],
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "link": "string"
    }
  ],
  "certifications": [
    {
      "id": "string",
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "references": [
    {
      "id": "string",
      "name": "string",
      "title": "string",
      "company": "string",
      "contact": "string"
    }
  ],
  "customSections": [
    {
      "id": "string",
      "title": "string (e.g. 'Awards', 'Volunteering')",
      "items": [
        {
          "id": "string",
          "title": "string",
          "subtitle": "string",
          "date": "string",
          "description": "string"
        }
      ]
    }
  ]
}`;

    // Primary path: extract text locally and send TEXT to the model. The
    // text+JSON path is the proven reliable one (same as ATS scoring); the
    // multimodal PDF path has been observed to fail consistently.
    let resumeText = '';
    try {
      resumeText = await extractPdfText(buffer);
    } catch (extractError) {
      logger.warn('import-resume', 'PDF text extraction failed, trying native PDF input:', extractError);
    }

    if (resumeText.length >= MIN_TEXT_CHARS) {
      const prompt = `${schemaBlock}\n\nRESUME TEXT:\n${resumeText.substring(0, MAX_TEXT_CHARS)}`;
      // Preferred models first + per-attempt timeout: on 2026-10-24
      // gemini-3.8-flash hung 30s+ and gemini-3.7-flash 503'd, while
      // 3.5/3.6-flash answered instantly. The 25s cap turns a hang into
      // an overload strike (rotate) instead of eating the 55s deadline.
      // If the preferred models saturate later, the pool still falls
      // back to the rest of GEMINI_MODELS.
      const parsedData = await withAiDeadline(generateContentWithRetry(prompt, systemInstruction, 8192, true, [], 'import_resume', ['gemini-3.5-flash', 'gemini-3.6-flash'], 25_000));
      stripPlaceholders(parsedData);
      await storeInCache(parsedData);
      return NextResponse.json(parsedData, { headers: { 'X-Cache': 'MISS' } });
    }

    // Fallback for scanned/image PDFs with no selectable text: send the raw
    // PDF bytes and let Gemini read the document natively.
    logger.warn('import-resume', `Only ${resumeText.length} chars extracted; falling back to native PDF input.`);
    const base64Data = buffer.toString('base64');
    const mediaParts = [{
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf'
      }
    }];
    const fallbackPrompt = `${schemaBlock}\n\nThe resume is attached as a PDF document. Read it and extract the details.`;
    const parsedData = await withAiDeadline(generateContentWithRetry(fallbackPrompt, systemInstruction, 8192, true, mediaParts, 'import_resume_pdf', ['gemini-3.5-flash', 'gemini-3.6-flash'], 25_000));
    stripPlaceholders(parsedData);
    await storeInCache(parsedData);
    return NextResponse.json(parsedData, { headers: { 'X-Cache': 'MISS' } });
  } catch (error: any) {
    if (error instanceof AiTimeoutError) {
      return NextResponse.json(
        { error: 'The AI service is taking too long right now. Please try again in a minute.', code: 'AI_TIMEOUT' },
        { status: 503 }
      );
    }
    if (error instanceof AiQuotaExhaustedError) {
      return NextResponse.json({ error: error.message, code: 'AI_UNAVAILABLE' }, { status: 503 });
    }
    if (error instanceof AiOverloadedError) {
      return NextResponse.json({ error: error.message, code: 'AI_OVERLOADED' }, { status: 503 });
    }
    if (error instanceof AiAccessDeniedError) {
      return NextResponse.json({ error: error.message, code: 'AI_ACCESS_DENIED' }, { status: 503 });
    }
    return apiError('import-resume', error);
  }
}

