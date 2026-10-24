// File-driven localized blog content loader.
// Articles live at content/blog/{locale}/{slug}.json (translated) with
// content/blog/en/{slug}.json as the structural fallback (dates, images).
import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  meta_description: string;
  header_image: string;
  content_html: string;
  date_iso: string;
}

const ROOT = path.join(process.cwd(), 'content', 'blog');

export function blogOrder(): string[] {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'order.json'), 'utf8'));
  } catch {
    return [];
  }
}

function readJson(p: string): any | null {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

export function getLocalizedPost(locale: string, slug: string): BlogPost | null {
  const en = readJson(path.join(ROOT, 'en', `${slug}.json`));
  if (!en) return null;
  const loc = readJson(path.join(ROOT, locale, `${slug}.json`));
  return {
    slug,
    title: loc?.title || en.title,
    meta_description: loc?.meta_description || en.meta_description,
    header_image: en.header_image,
    content_html: loc?.content_html || en.content_html,
    date_iso: en.date_iso,
  };
}

// 2026-10-24 fix: locale video pages render a <video> tag but emit no
// VideoObject (the 29 "Video isn't on a watch page" items in Search Console),
// because the translated JSONs carry no embedded VideoObject script. Return
// the EN post's embedded VideoObject block verbatim (same video file, same
// uploadDate) so the locale template can emit it. Returns null when the EN
// post has no VideoObject or the block is unparseable — never emit broken
// schema.
export function getEnglishVideoObject(slug: string): string | null {
  const en = readJson(path.join(ROOT, 'en', `${slug}.json`));
  const html = String(en?.content_html || '');
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const video = items.find((p: any) => p && p['@type'] === 'VideoObject');
      if (video) return JSON.stringify(video);
    } catch {
      // Skip broken blocks; a later block may still be valid.
    }
  }
  return null;
}

export function getLocalizedPosts(locale: string): BlogPost[] {
  return blogOrder()
    .map((slug) => getLocalizedPost(locale, slug))
    .filter((p): p is BlogPost => p !== null);
}

export function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

