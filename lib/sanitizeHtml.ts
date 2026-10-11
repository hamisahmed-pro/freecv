/**
 * Dependency-free, serverless-safe HTML sanitizer (no jsdom).
 *
 * WHY THIS EXISTS: `isomorphic-dompurify` instantiates `new JSDOM()` at module
 * load time. In Vercel's Next.js serverless runtime that import crashes the
 * entire route module, producing a bare 500 that error boundaries cannot catch
 * (this took down /blog/[slug] for every slug). This sanitizer uses only
 * regex/string ops, so it is safe to import in any server component or API route.
 *
 * It is an allowlist sanitizer: unknown tags are dropped (their text content is
 * kept), event-handler attributes are stripped, and href/src URLs are limited
 * to safe schemes. Good enough for admin-authored CMS content rendered with
 * dangerouslySetInnerHTML.
 */

const ALLOWED_TAGS = new Set([
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'ul', 'ol', 'li',
  'strong', 'em', 'b', 'i', 'u', 's',
  'a', 'blockquote', 'code', 'pre',
  'span', 'div',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'img', 'figure', 'figcaption',
  'video', 'source',
]);

const GLOBAL_ATTRS = new Set(['title', 'class']);

const TAG_ATTRS: Record<string, Set<string>> = {
  a: new Set(['href', 'title', 'target', 'rel']),
  img: new Set(['src', 'alt', 'title', 'width', 'height', 'loading']),
  video: new Set(['controls', 'preload', 'poster', 'playsinline', 'aria-label', 'class', 'width', 'height']),
  source: new Set(['src', 'type']),
};

const VOID_TAGS = new Set(['br', 'hr', 'img']);

// Tags whose entire content must be removed, not just the tags themselves.
const DANGEROUS_TAGS = 'script|style|iframe|object|embed|applet|form|input|button|select|textarea|link|meta|base|noscript|template';

function isSafeUrl(url: string): boolean {
  const u = url.trim().toLowerCase();
  return (
    u.startsWith('http://') ||
    u.startsWith('https://') ||
    u.startsWith('mailto:') ||
    u.startsWith('/') ||
    u.startsWith('#') ||
    u.startsWith('?')
  );
}

export interface SanitizeOptions {
  /** Override the tag allowlist. Pass [] to strip every tag but keep text. */
  allowedTags?: string[];
}

export function sanitizeHtml(dirty: unknown, options: SanitizeOptions = {}): string {
  let html = String(dirty ?? '');

  // Strip HTML comments (can hide conditional execution vectors).
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Remove dangerous elements including everything inside them.
  const dangerousRe = new RegExp(`<(${DANGEROUS_TAGS})[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, 'gi');
  html = html.replace(dangerousRe, '');
  // Remove any leftover dangerous open/close tags (e.g. self-closed or unclosed).
  const dangerousTagRe = new RegExp(`<\\/?(${DANGEROUS_TAGS})\\b[^>]*>`, 'gi');
  html = html.replace(dangerousTagRe, '');

  const allowedTags =
    options.allowedTags !== undefined
      ? new Set(options.allowedTags.map((t) => t.toLowerCase()))
      : ALLOWED_TAGS;

  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/g, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!allowedTags.has(tag)) return '';
    if (match.startsWith('</')) return `</${tag}>`;

    let attrsOut = '';
    const allowedAttrs = TAG_ATTRS[tag];
    const attrRe = /([a-zA-Z][a-zA-Z0-9-:]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
    let m: RegExpExecArray | null;
    while ((m = attrRe.exec(rawAttrs)) !== null) {
      const name = m[1].toLowerCase();
      if (name.startsWith('on')) continue; // strip event handlers (onclick, onerror, ...)
      if (name === 'style' || name === 'srcset') continue;
      if (!GLOBAL_ATTRS.has(name) && !allowedAttrs?.has(name)) continue;
      const value = m[2] ?? m[3] ?? m[4] ?? '';
      if (name === 'href' || name === 'src') {
        if (!isSafeUrl(value)) continue; // block javascript:, data:, vbscript:, ...
      }
      attrsOut += ` ${name}="${value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`;
    }

    if (VOID_TAGS.has(tag)) return `<${tag}${attrsOut} />`;
    return `<${tag}${attrsOut}>`;
  });
}

/** Strip every tag and collapse whitespace — for plain-text fields. */
export function stripAllTags(dirty: unknown): string {
  return sanitizeHtml(dirty, { allowedTags: [] }).replace(/\s+/g, ' ').trim();
}
