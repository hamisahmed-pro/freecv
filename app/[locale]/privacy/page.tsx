import { notFound } from 'next/navigation';
import { isLocale, LOCALES } from '../../page';

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function MinimalPrivacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <div>Privacy {locale}</div>;
}
