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
  // @id lets the homepage WebPage block (HomeJsonLd) reference this
  // application instead of duplicating it, and the richer fields raise the
  // semantic quality of the block: a web app runs on the Web (not "Any"),
  // its language and feature list are stated, and the free offer is explicit.
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': 'https://cvyon.com/#application',
    name,
    url,
    description,
    inLanguage: 'en',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    featureList: [
      'ATS grader that scores a resume against a real job description',
      '180+ resume templates',
      'PDF and DOCX export',
      'No sign-up required to build or download',
    ],
    screenshot: 'https://cvyon.com/og-image.jpg',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    creator: {
      '@type': 'Organization',
      '@id': 'https://cvyon.com/#organization',
      name: 'Cvyon',
      url: 'https://cvyon.com',
      logo: 'https://cvyon.com/logo.png',
      sameAs: ['https://www.instagram.com/cvyon_resume'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
