import { notFound } from 'next/navigation';
import { isLocale, LOCALES, type Locale } from '../../page';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';
// Reuse the English builder UI; localized chrome keeps language context.
// Full builder string localization is tracked separately.
import FreeCVApp from '@/app/build/page';

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return {
    title: 'Resume Builder | Cvyon',
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
  return (
    <div className="relative">
      {/* Floating language switcher — same position as homepage header */}
      <div className="fixed right-4 top-4 z-50 rounded-xl border border-line bg-cream/95 shadow-lg backdrop-blur-md">
        <LanguageSwitcher current={locale} />
      </div>
      <FreeCVApp />
    </div>
  );
}
