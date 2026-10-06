import { isLocale, LOCALES } from '@/lib/locale';
import LanguageSwitcher from '@/components/landing/LanguageSwitcher';

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function TestPrivacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return <div>not found</div>;
  return <div><LanguageSwitcher current={locale} />Privacy {locale}</div>;
}
