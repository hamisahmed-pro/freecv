import BuilderClient from '@/components/builder/BuilderClient';
import builderDict from '@/content/builder/en.json';

export default function BuildPage() {
  return <BuilderClient dict={builderDict} locale="en" />;
}
