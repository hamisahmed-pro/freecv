import { notFound } from "next/navigation";
import type { Metadata } from "next";
import LandingV3 from "@/components/landing/LandingV3";
import type { Dict } from "@/dictionaries/en";

export const LOCALES = ["ar", "fr", "de", "nl", "zh", "ko", "ja", "la", "pt", "fil", "es", "it"] as const;
export type Locale = (typeof LOCALES)[number];

const NATIVE_NAMES: Record<Locale, string> = {
  ar: "العربية", fr: "Français", de: "Deutsch", nl: "Nederlands", zh: "中文",
  ko: "한국어", ja: "日本語", la: "Latina", pt: "Português", fil: "Filipino",
  es: "Español", it: "Italiano",
};
export const LOCALE_NAMES = NATIVE_NAMES;

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

async function getDict(locale: Locale): Promise<Dict> {
  const mod = await import(`@/dictionaries/${locale}.json`);
  return mod.default as Dict;
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  const languages: Record<string, string> = { en: "https://cvyon.com" };
  for (const l of LOCALES) languages[l] = `https://cvyon.com/${l}`;
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `https://cvyon.com/${locale}`,
      languages,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      url: `https://cvyon.com/${locale}`,
      siteName: "Cvyon",
      type: "website",
      locale,
      images: [{ url: "https://cvyon.com/og-image.jpg", width: 1200, height: 630, alt: dict.meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: ["https://cvyon.com/og-image.jpg"],
    },
  };
}

export default async function LocaleLandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);
  return (
    <div dir={dict.dir} lang={locale}>
      <LandingV3 dict={dict} />
    </div>
  );
}
