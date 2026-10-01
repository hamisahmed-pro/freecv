import React from 'react';

interface JsonLdProps {
  type?: 'WebApplication' | 'Organization' | 'BreadcrumbList';
  url?: string;
  name?: string;
  description?: string;
}

export function JsonLd({
  type = 'WebApplication',
  url = 'https://cvyon.com',
  name = 'Cvyon — Free Resume & CV Builder',
  description = 'Build ATS-friendly resumes and CVs with modern templates, AI assistance, and instant PDF/DOCX downloads forever free.',
}: JsonLdProps) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    url,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Cvyon',
      url: 'https://cvyon.com',
      logo: 'https://cvyon.com/logo-dark-no-background.png',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
