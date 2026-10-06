import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ClientAtsGrader from "@/app/ats-grader/ClientAtsGrader";
import { isLocale, LOCALES } from "../page";
import type { Dict } from "@/dictionaries/en";

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
  return {
    title: `${dict.ats_grader.eyebrow.replace("§ ", "")} — Cvyon`,
    description: dict.ats_grader.sub,
    alternates: { canonical: `https://cvyon.com/${locale}/ats-grader` },
  };
}

export default async function LocaleGraderPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDict(locale);
  return (
    <div dir={dict.dir} lang={locale}>
      <ClientAtsGrader dict={dict} />
    </div>
  );
}
