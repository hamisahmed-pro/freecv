import BuilderClient from '@/components/builder/BuilderClient';
import builderDict from '@/content/builder/en.json';
import type { Metadata } from 'next';
import { LOCALES } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Free Resume Builder — Cvyon',
  description: 'Build a job-ready resume free. No signup, no watermark, unlimited downloads.',
  alternates: {
    canonical: 'https://cvyon.com/build',
    languages: Object.fromEntries([
      ['en', 'https://cvyon.com/build'],
      ['x-default', 'https://cvyon.com/build'],
      ...LOCALES.map((l) => [l, `https://cvyon.com/${l}/build`]),
    ]),
  },
};

export default function BuildPage() {
  return (
    <>
      <h1 className="sr-only">{builderDict["builder.free_resume_builder_create_edit_and_down"]}</h1>
      <BuilderClient dict={builderDict} locale="en" />
    </>
  );
}
