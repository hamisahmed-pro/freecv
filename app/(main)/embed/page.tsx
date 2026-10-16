import type { Metadata } from 'next';
import EmbedClient from './EmbedClient';

export const metadata: Metadata = {
  title: 'Embed Our Free ATS Grader Badge | Cvyon',
  description:
    'Add Cvyon\'s free ATS resume grader badge to your blog or career site. One copy-paste snippet, free forever.',
};

export default function EmbedPage() {
  return <EmbedClient />;
}
