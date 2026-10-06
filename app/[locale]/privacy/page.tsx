import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, LOCALES } from '@/lib/locale';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
import PrivacyClient from '@/app/privacy/PrivacyClient';

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
  return (
    <div lang={locale} className="relative">
      {/* Floating language switcher — same position as homepage header */}
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <PrivacyClient />
    </div>
  );
}
