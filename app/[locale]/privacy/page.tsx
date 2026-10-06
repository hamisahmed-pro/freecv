import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isLocale, LOCALES, type Locale } from '../../page';
import { V3Page } from '@/components/v3/V3Chrome';
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
  const loc = `/${locale}`;
  return (
    <div lang={locale}>
      <V3Page
        pageName="privacy"
        switcher={<LanguageSwitcher current={locale} />}
        links={[
          { href: loc, label: 'Home' },
          { href: `${loc}/build`, label: 'Builder' },
          { href: `${loc}/ats-grader`, label: 'ATS Grader' },
        ]}
        cta={{ label: 'Build free →', href: `${loc}/build` }}
      >
        <PrivacyClient />
      </V3Page>
    </div>
  );
}
