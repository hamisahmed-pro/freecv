// JSON-LD for the homepage itself. The site-wide JsonLd block describes the
// WebApplication product and the FaqJsonLd block describes the FAQ, but
// neither is the page: an audit of the homepage found "no primary type
// matched the page role". A WebPage block, part of the Cvyon WebSite and
// about the WebApplication (referenced by @id, not duplicated), is the
// page-role type. Every value here is already stated in the page's own
// title, description, and visible copy — no new claims.
export function HomeJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://cvyon.com/#website',
        url: 'https://cvyon.com',
        name: 'Cvyon',
        description:
          'Cvyon is a free resume builder and ATS grader: build an ATS-friendly resume from 180+ templates, check it against a job posting, and download it free, no sign-up.',
        inLanguage: 'en',
        publisher: { '@id': 'https://cvyon.com/#organization' },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://cvyon.com/#webpage',
        url: 'https://cvyon.com',
        name: 'Cvyon — Free Premium Resume Builder & ATS Grader',
        description:
          'Cvyon is a free resume builder and ATS grader: build an ATS-friendly resume from 180+ templates, check it against a job posting, and download it free, no sign-up.',
        inLanguage: 'en',
        isPartOf: { '@id': 'https://cvyon.com/#website' },
        about: { '@id': 'https://cvyon.com/#application' },
        primaryImageOfPage: 'https://cvyon.com/og-image.jpg',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
      }}
    />
  );
}
