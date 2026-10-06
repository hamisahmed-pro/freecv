import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, LOCALES } from '@/lib/locale';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import BuilderClient from '@/components/builder/BuilderClient';

async function getBuilderDict(locale: string): Promise<Record<string, string>> {
  try {
    const mod = await import(`@/content/builder/${locale}.json`);
    return mod.default;
  } catch {
    const mod = await import(`@/content/builder/en.json`);
    return mod.default;
  }
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: 'Resume Builder — Cvyon',
    alternates: {
      canonical: `https://cvyon.com/${locale}/build`,
      languages: Object.fromEntries([
        ['en', 'https://cvyon.com/build'],
        ...LOCALES.map((l) => [l, `https://cvyon.com/${l}/build`]),
      ]),
    },
  };
}

export default async function LocalizedBuildPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getBuilderDict(locale);
  const rtl = locale === 'ar' || locale === 'ur';
  return (
    <div lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="relative">
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <BuilderClient dict={dict} locale={locale} />
    </div>
  );
}
