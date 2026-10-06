import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientAtsGrader from "@/app/ats-grader/ClientAtsGrader";
import { isLocale, LOCALES } from "../page";
import type { Dict } from "@/dictionaries/en";
import LanguageSwitcher from "@/components/landing/LanguageSwitcher";

async function getDict(locale: string): Promise<Dict> {
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
  const languages: Record<string, string> = { en: 'https://cvyon.com/ats-grader' };
  for (const l of LOCALES) languages[l] = `https://cvyon.com/${l}/ats-grader`;
  return {
    title: `${dict.ats_grader.eyebrow.replace("§ ", "")} — Cvyon`,
    description: dict.ats_grader.sub,
    alternates: {
      canonical: `https://cvyon.com/${locale}/ats-grader`,
      languages,
    },
  };
}

export default async function LocaleGraderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);
  return (
    <div dir={dict.dir} lang={locale} className="relative">
      {/* Floating language switcher — same position as homepage header */}
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <ClientAtsGrader dict={dict} />
    </div>
  );
}
