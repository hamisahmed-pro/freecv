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
