// Shared locale configuration — import from here, never from app/[locale]/page
// (importing the page pulls in its full component dependency chain and breaks builds).
export const LOCALES = ["ar", "fr", "de", "nl", "zh", "ko", "ja", "la", "pt", "fil", "es", "it", "hi", "bn", "mr", "ru", "id", "ur"] as const;
export type Locale = (typeof LOCALES)[number];

const NATIVE_NAMES: Record<Locale, string> = {
  ar: "العربية", fr: "Français", de: "Deutsch", nl: "Nederlands", zh: "中文",
  ko: "한국어", ja: "日本語", la: "Latina", pt: "Português", fil: "Filipino",
  es: "Español", it: "Italiano", hi: "हिन्दी", bn: "বাংলা", mr: "मराठी",
  ru: "Русский", id: "Bahasa Indonesia", ur: "اردو",
};
export const LOCALE_NAMES = NATIVE_NAMES;

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

/** "/fr" prefix for non-English locales, "" for English */
export function localePrefix(locale: string): string {
  return locale && locale !== "en" ? `/${locale}` : "";
}

/** Prefix an internal path with the locale: L("/build", "fr") -> "/fr/build" */
export function localizedPath(path: string, locale: string): string {
  return `${localePrefix(locale)}${path}`;
}

const localizedPages = new Set(['/', '/build', '/ats-grader', '/blog', '/privacy', '/terms']);

/** Only prefix routes that have a page in this language. */
export function localizedPageHref(href: string, locale?: Locale): string {
  if (!locale) return href;
  const [pathname] = href.split(/[?#]/);
  if (!localizedPages.has(pathname)) return href;
  return `/${locale}${pathname === '/' ? '' : pathname}${href.slice(pathname.length)}`;
}
