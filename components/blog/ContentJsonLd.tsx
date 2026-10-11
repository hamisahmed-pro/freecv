// Re-emits <script type="application/ld+json"> blocks that authors embed in
// CMS article content. The HTML sanitizer strips <script> from the rendered
// body, so without this the article's FAQ / Video / HowTo schema would never
// reach the page. Article blocks are skipped: ArticleJsonLd already emits one
// generated from live post data.
export function ContentJsonLd({ content }: { content: unknown }) {
  const blocks: string[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m: RegExpExecArray | null;
  const html = String(content || '');
  while ((m = re.exec(html)) !== null) {
    const raw = m[1].trim();
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      const types = items.map((p: any) => p && p['@type']).filter(Boolean);
      if (types.includes('Article')) continue; // covered by ArticleJsonLd
      blocks.push(JSON.stringify(parsed));
    } catch {
      // Never emit broken schema.
    }
  }
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            // Scrub '<' to neutralize any embedded HTML (XSS-safe JSON-LD).
            __html: json.replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
