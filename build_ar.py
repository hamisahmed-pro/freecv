#!/usr/bin/env python3
"""Build + verify Arabic blog JSON files from translated HTML.

Usage:
  python3 build_ar.py <slug> "<title>" "<meta_description>"
Reads:
  seed-data/blog-posts/<slug>.json   (EN source: slug, header_image)
  /tmp/ar_html/<slug>.html            (Arabic content_html, plain text)
Writes:
  content/blog/ar/<slug>.json        (keys: slug, title, meta_description, header_image, content_html)
Then verifies: valid JSON, key order, tag sequence identical to source,
all href/src/action URLs identical, JSON-LD blocks parse with identical key trees.
"""
import json, re, sys, os

BASE = os.path.expanduser('~/workspace/cvyon/seo-oct16')

def tag_seq(h):
    """All markup tags in order. alt/title attribute VALUES are normalized away
    (they are human-readable and translated); everything else (tag name,
    attribute names, src/href/class/id/style values) must match exactly."""
    tags = re.findall(r'<!--.*?-->|<[^>]+>', h, flags=re.S)
    norm = []
    for t in tags:
        if t.startswith('<!--'):
            norm.append(t)
            continue
        # blank out alt="..." and title="..." values but keep the attributes
        t2 = re.sub(r'''\b(alt|title)\s*=\s*("[^"]*"|'[^']*')''', r'\1=""', t)
        norm.append(t2)
    return norm

def urls(h):
    return sorted(set(re.findall(r'''(?:href|src|action|contentUrl|thumbnailUrl|embedUrl)=["']([^"']+)["']''', h)))

def jsonld_blocks(h):
    return re.findall(r'<script type="application/ld\+json">(.*?)</script>', h, flags=re.S)

def keytree(o):
    if isinstance(o, dict):
        return {k: keytree(v) for k, v in o.items()}
    if isinstance(o, list):
        return [keytree(v) for v in o]
    return type(o).__name__

def main():
    slug, title, meta = sys.argv[1], sys.argv[2], sys.argv[3]
    src = json.load(open(f'{BASE}/seed-data/blog-posts/{slug}.json'))
    ar_html = open(f'/tmp/ar_html/{slug}.html', encoding='utf-8').read()
    # normalize: no trailing whitespace/newlines at the very end, match source style
    ar_html = ar_html.rstrip('\n')
    if src['content_html'].endswith('\n') and not ar_html.endswith('\n'):
        pass  # keep as-is; whitespace-only difference is fine

    out = {
        'slug': src['slug'],
        'title': title,
        'meta_description': meta,
        'header_image': src['header_image'],
        'content_html': ar_html,
    }
    opath = f'{BASE}/content/blog/ar/{slug}.json'
    with open(opath, 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
        f.write('\n')

    # ---- verification ----
    errs = []
    back = json.load(open(opath))
    if list(back.keys()) != ['slug', 'title', 'meta_description', 'header_image', 'content_html']:
        errs.append(f"key order/keys wrong: {list(back.keys())}")
    if back['slug'] != src['slug']:
        errs.append('slug mismatch')
    if back['header_image'] != src['header_image']:
        errs.append('header_image mismatch')

    st, at = tag_seq(src['content_html']), tag_seq(back['content_html'])
    if st != at:
        errs.append(f'tag sequence differs: src={len(st)} ar={len(at)}')
        for i, (a, b) in enumerate(zip(st, at)):
            if a != b:
                errs.append(f'  first tag diff at #{i}: src={a[:80]!r} ar={b[:80]!r}')
                break
        if len(st) != len(at):
            errs.append(f'  length diff src={len(st)} ar={len(at)}')

    su, au = urls(src['content_html']), urls(back['content_html'])
    if su != au:
        errs.append(f'URL sets differ:\n  src-only={set(su)-set(au)}\n  ar-only={set(au)-set(su)}')

    sj, aj = jsonld_blocks(src['content_html']), jsonld_blocks(back['content_html'])
    if len(sj) != len(aj):
        errs.append(f'JSON-LD block count: src={len(sj)} ar={len(aj)}')
    else:
        for i, (s, a) in enumerate(zip(sj, aj)):
            try:
                so = json.loads(s); s_ok = True
            except Exception:
                s_ok = False
            try:
                ao = json.loads(a); a_ok = True
            except Exception as e:
                a_ok = False; a_err = e
            if s_ok and a_ok:
                if keytree(so) != keytree(ao):
                    errs.append(f'JSON-LD block {i} key tree differs')
                for pat in [r'"https?://[^"]+"']:
                    if sorted(set(re.findall(pat, s))) != sorted(set(re.findall(pat, a))):
                        errs.append(f'JSON-LD block {i} URL set differs')
            elif s_ok != a_ok:
                errs.append(f'JSON-LD block {i} parseability differs from source (src_ok={s_ok}): {a_err if not a_ok else ""}')
            else:
                # neither parses (source itself has raw quotes in a text value):
                # compare JSON key sequences and URL/entity sets instead
                sk = re.findall(r'"([^"]+)"\s*:', s)
                ak = re.findall(r'"([^"]+)"\s*:', a)
                if sk != ak:
                    errs.append(f'JSON-LD block {i} (unparseable in src too) key sequence differs')
                for pat in [r'https?://[^"<>\\s]+']:
                    if sorted(set(re.findall(pat, s))) != sorted(set(re.findall(pat, a))):
                        errs.append(f'JSON-LD block {i} (unparseable) URL set differs')

    # entities preserved
    se = sorted(set(re.findall(r'&[a-zA-Z#0-9]+;', src['content_html'])))
    ae = sorted(set(re.findall(r'&[a-zA-Z#0-9]+;', back['content_html'])))
    if se != ae:
        errs.append(f'entity sets differ: src={se} ar={ae}')

    # word count (text only)
    txt = re.sub(r'<script.*?</script>', ' ', back['content_html'], flags=re.S)
    txt = re.sub(r'<!--.*?-->', ' ', txt, flags=re.S)
    txt = re.sub(r'<[^>]+>', ' ', txt)
    txt = html_unescape(txt)
    words = [w for w in re.split(r'\s+', txt) if w]
    wc = len(words) + len(title.split()) + len(meta.split())

    if errs:
        print(f'FAIL {slug}:')
        for e in errs:
            print(' ', e)
        sys.exit(1)
    print(f'OK {slug}: words={wc} tags={len(at)} urls={len(au)} jsonld={len(aj)}')

def html_unescape(s):
    import html as h
    return h.unescape(s)

if __name__ == '__main__':
    main()
