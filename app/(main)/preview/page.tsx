"use client";

import dynamic from 'next/dynamic';

const ClientPreview = dynamic(() => import('@/components/builder/ClientPreview'), {
  ssr: false,
});

export default function PreviewPage() {
  return <ClientPreview />;
}
