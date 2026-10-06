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

export function getLocalizedPosts(locale: string): BlogPost[] {
  return blogOrder()
    .map((slug) => getLocalizedPost(locale, slug))
    .filter((p): p is BlogPost => p !== null);
}

export function readingTimeMinutes(html: string): number {
  const words = html.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}
