const LOCALES = ["ar","fr","de","nl","zh","ko","ja","la","pt","fil","es","it","hi","bn","mr","ru","id","ur"] as const;

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function MinimalPrivacy({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <div>Privacy {locale}</div>;
}
