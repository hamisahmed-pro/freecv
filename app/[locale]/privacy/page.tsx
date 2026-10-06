import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, LOCALES } from '@/lib/locale';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import PrivacyClient, { type PrivacyDict } from '@/components/legal/PrivacyClient';

async function getLegal(locale: string): Promise<{ privacy: PrivacyDict }> {
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
    title: 'Privacy Policy — Cvyon',
    alternates: {
      canonical: `https://cvyon.com/${locale}/privacy`,
      languages: Object.fromEntries([
        ['en', 'https://cvyon.com/privacy'],
        ...LOCALES.map((l) => [l, `https://cvyon.com/${l}/privacy`]),
      ]),
    },
  };
}

export default async function LocalizedPrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { privacy } = await getLegal(locale);
  const rtl = locale === 'ar' || locale === 'ur';
  return (
    <div lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="relative">
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <PrivacyClient dict={privacy} locale={locale} />
    </div>
  );
}
