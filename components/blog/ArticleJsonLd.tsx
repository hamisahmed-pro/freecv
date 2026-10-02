// JSON-LD structured data for a blog article. Rendered by the article page JSX.
// Only fields that exist on `post` are included (all fields are defensive).
//
// FAQ support: if the article HTML contains an <h2>FAQ</h2> section whose
// questions are <p><strong>Question?</strong> Answer…</p> blocks, an FAQPage
// JSON-LD block is emitted alongside the Article block. Purely additive —
// when no FAQ section is found, output is identical to before.
function extractFaq(content: string): { q: string; a: string }[] {
  const faqs: { q: string; a: string }[] = [];
  try {
    const faqHead = /<h2[^>]*>\s*FAQ\s*<\/h2>/i.exec(content);
    if (!faqHead) return faqs;
    // Consider only the markup after the FAQ heading, up to the next h2/hr.
    let tail = content.slice(faqHead.index + faqHead[0].length);
    const stop = /<h2[\s>]|<hr[\s>]/.exec(tail);
    if (stop) tail = tail.slice(0, stop.index);
    const strip = (s: string) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const re = /<p[^>]*>\s*<strong>([\s\S]*?)<\/strong>([\s\S]*?)<\/p\s*>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(tail)) !== null) {
      const q = strip(m[1]);
      const a = strip(m[2]);
      if (q.length > 8 && a.length > 20) faqs.push({ q, a });
      if (faqs.length >= 10) break;
    }
  } catch {
    return faqs;
  }
  return faqs;
}

export function ArticleJsonLd({ post }: { post: any }) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
  };

  if (post?.title) {
    jsonLd.headline = post.title;
  }
  if (post?.meta_description) {
    jsonLd.description = post.meta_description;
  }
  const datePublished = post?.created_at || post?.datePublished;
  if (datePublished) {
    jsonLd.datePublished = datePublished;
  }
  if (post?.updated_at) {
    jsonLd.dateModified = post.updated_at;
  }
  const authorName = post?.author?.name || post?.author_name || (typeof post?.author === 'string' ? post.author : null);
  if (authorName) {
    jsonLd.author = { '@type': 'Person', name: authorName };
  }
  if (post?.header_image) {
    const raw = String(post.header_image);
    jsonLd.image = raw.startsWith('http') ? raw : `https://cvyon.com${raw.startsWith('/') ? '' : '/'}${raw}`;
  }

  const faqs = typeof post?.content === 'string' ? extractFaq(post.content) : [];
  const scrub = (s: string) => s.replace(/</g, '\\u003c');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Scrub '<' to neutralize any embedded HTML (XSS-safe JSON-LD).
          __html: scrub(JSON.stringify(jsonLd)),
        }}
      />
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: scrub(
              JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: faqs.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              })
            ),
          }}
        />
      )}
    </>
  );
}
