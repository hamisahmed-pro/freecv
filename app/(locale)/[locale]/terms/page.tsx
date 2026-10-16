import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, LOCALES } from '@/lib/locale';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import TermsClient, { type TermsDict } from '@/components/legal/TermsClient';

async function getLegal(locale: string): Promise<{ terms: TermsDict }> {
  try {
    const mod = await import(`@/content/legal/${locale}.json`);
    return mod.default;
  } catch {
    const mod = await import(`@/content/legal/en.json`);
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
    title: 'Terms of Service — Cvyon',
    alternates: {
      canonical: `https://cvyon.com/${locale}/terms`,
      languages: Object.fromEntries([
        ['en', 'https://cvyon.com/terms'],
        ...LOCALES.map((l) => [l, `https://cvyon.com/${l}/terms`]),
      ]),
    },
  };
}

export default async function LocalizedTermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { terms } = await getLegal(locale);
  const rtl = locale === 'ar' || locale === 'ur';
  return (
    <div lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="relative">
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <TermsClient dict={terms} locale={locale} />
    </div>
  );
}
