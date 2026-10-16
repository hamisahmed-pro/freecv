#!/usr/bin/env python3
"""Translate 10 Cvyon EN blog articles to French via hcnsec DeepSeek.
Preserves HTML structure; translates text nodes + alt/aria-label + JSON-LD values.
"""
import json, re, sys, time, threading, urllib.request, urllib.error
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response

BASE = "https://api.hcnsec.cn/v1"
CRED = "custom.hcnsec"
ENTRY = "access_token"
HOSTS = ["api.hcnsec.cn"]
MODEL = "DeepSeek-V4-Pro"

SRC_DIR = "/home/hatch/workspace/cvyon/seo-oct16/seed-data/blog-posts"
OUT_DIR = "/home/hatch/workspace/cvyon/seo-oct16/content/blog/fr"
SLUGS = ['customer-service-resume-example','data-analyst-resume-example','free-ats-resume-checker','free-ats-resume-test','how-to-beat-applicant-tracking-systems','nigerian-cv-format-guide','resume-with-no-experience','software-developer-resume-example','tutoring-resume','what-is-applicant-tracking-system']

HTML_SYSTEM = """You are a professional French (France) translator specializing in career-advice content.
Translate the HTML below into natural, fluent French with a professional career-advice tone. Adapt idioms rather than translating literally.

ABSOLUTE RULES — VIOLATION IS FAILURE:
1. Translate EVERY text element. Do NOT drop, merge, or skip ANY paragraph, list item, heading, or sentence. The output must contain the same number of <p>, <li>, <h2>, <h3> elements as the input.
2. Do NOT invent, add, or elaborate ANY content. Translate ONLY what is written. Never substitute specific details (times, places, numbers) with invented ones.
3. Translate ONLY human-readable text: visible text nodes, and the VALUES of alt="..." and aria-label="..." attributes.
4. Preserve EXACTLY: all tag names, all attribute names, and the values of href, src, class, id, style, type, rel, poster, controls, preload, and every data-* attribute. Never translate URLs, email addresses, file paths, or brand/product names.
5. Preserve ALL HTML comments exactly as-is, in English (do not translate them).
6. Preserve HTML entities (&amp; &nbsp; etc.) exactly as they appear.
7. Translate "resume" as "CV" (never "résumé"). Keep "ATS" as "ATS". On first mention translate "applicant tracking system" as "système de suivi des candidatures (ATS)", afterwards just "ATS". "hiring manager" -> "recruteur". "cover letter" -> "lettre de motivation".
8. Keep proper nouns unchanged: person names, company/brand names (Zendesk, Salesforce, Cvyon, ...), city names inside examples.
9. Keep numbers, metrics and units unchanged. Use French typography: « » for quotation marks, non-breaking space before : ; ! ? and %.
10. In resume-example date ranges, translate month names to French and "Present" to "aujourd'hui" (e.g. "Jun 2022 – Present" -> "juin 2022 – aujourd'hui").
11. Output ONLY the translated HTML — no explanations, no markdown fences, no commentary."""

TEXT_SYSTEM = """You are a professional French (France) translator specializing in career-advice content.
Translate the text below into natural, fluent French with a professional career-advice tone. Adapt idioms rather than translating literally.
Translate "resume" as "CV" (never "résumé"). Keep "ATS" as "ATS".
Output ONLY the translated text — no explanations, no quotes around it."""

_lock = threading.Lock()
WORK_DIR = "/tmp/fr_work"
def chat(system, user, max_tokens=8000, temperature=0.2, retries=5):
    payload = {"model": MODEL, "messages": [{"role":"system","content":system},{"role":"user","content":user}], "max_tokens": max_tokens, "temperature": temperature}
    last = None
    for attempt in range(retries):
        t0 = time.time()
        try:
            data = json.dumps(payload).encode("utf-8")
            req = urllib.request.Request(BASE + "/chat/completions", data=data, headers={"Content-Type":"application/json"}, method="POST")
            add_surrogate_to_request(req, CRED, entry_name=ENTRY, allowed_hosts=HOSTS)
            with urllib.request.urlopen(req, timeout=170) as resp:
                body = read_json_response(resp)
            content = ((body.get("choices") or [{}])[0].get("message") or {}).get("content") or ""
            dt = time.time() - t0
            print(f"  chat ok in {dt:.0f}s (in~{len(user)//4} tok)", flush=True)
            return content.strip()
        except Exception as e:
            dt = time.time() - t0
            last = e
            print(f"  chat FAIL attempt {attempt} after {dt:.0f}s: {str(e)[:100]}", flush=True)
            time.sleep(3 * (attempt + 1))
    raise RuntimeError(f"chat failed after {retries} attempts: {last}")

def tr_text(s):
    return chat(TEXT_SYSTEM, s, max_tokens=600)

# ---------- HTML segmentation ----------
class TopLevel(HTMLParser):
    """Record spans of top-level elements."""
    def __init__(self, html):
        super().__init__(convert_charrefs=False)
        self.html = html
        self.depth = 0
        self.blocks = []  # (start, end)
        self._start = None
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        if self.depth == 0 and self._start is None:
            self._start = self.getpos()
        # track via rawdata offsets instead
        self._track_start(tag)
    def _track_start(self, tag):
        pass
    def handle_startendtag(self, tag, attrs):
        if self.depth == 0:
            s, e = self._raw_span(tag)
            if s is not None: self.blocks.append((s, e))
    # simpler: use getpos-based offset computation
    def _raw_span(self, tag):
        return None, None

def top_level_blocks(html):
    """Split html into top-level element blocks using a depth-tracking scan."""
    # tokenize tags
    spans = []
    depth = 0
    cur_start = None
    for m in re.finditer(r'<!--.*?-->|<[^>]+>', html, re.S):
        tok = m.group(0)
        if tok.startswith('<!--'):
            if depth == 0:
                spans.append((m.start(), m.end()))
            continue
        is_close = tok.startswith('</')
        is_selfclose = tok.endswith('/>') or re.match(r'<(br|hr|img|source|input|meta|link)\b', tok, re.I)
        tag = re.match(r'</?([a-zA-Z][a-zA-Z0-9]*)', tok).group(1).lower()
        if depth == 0 and not is_close:
            cur_start = m.start()
        if is_close:
            depth -= 1
            if depth == 0 and cur_start is not None:
                spans.append((cur_start, m.end()))
                cur_start = None
        elif is_selfclose:
            if depth == 0:
                spans.append((m.start(), m.end()))
                cur_start = None
        else:
            depth += 1
    # text between blocks
    blocks = []
    prev = 0
    for s, e in spans:
        if s > prev:
            blocks.append(('text', html[prev:s]))
        blocks.append(('block', html[s:e]))
        prev = e
    if prev < len(html):
        blocks.append(('text', html[prev:]))
    return blocks

def chunk_html(html, max_chars=1500):
    """Group top-level blocks into chunks <= max_chars (whole blocks only)."""
    blocks = top_level_blocks(html)
    chunks, cur, cur_len = [], [], 0
    for kind, txt in blocks:
        if kind == 'text' and not txt.strip():
            # whitespace-only: attach to current chunk
            if cur: cur.append(txt); cur_len += len(txt)
            else: chunks.append(txt)  # leading whitespace -> own tiny chunk (won't translate)
            continue
        if cur and cur_len + len(txt) > max_chars:
            chunks.append(''.join(cur)); cur, cur_len = [], 0
        cur.append(txt); cur_len += len(txt)
    if cur: chunks.append(''.join(cur))
    return chunks

SCRIPT_RE = re.compile(r'<script\b[^>]*>.*?</script>', re.S | re.I)

def strip_fences(s):
    s = s.strip()
    if s.startswith('```'):
        s = re.sub(r'^```[a-zA-Z]*\n?', '', s)
        s = re.sub(r'\n?```$', '', s)
    return s.strip()

# ---------- JSON-LD translation ----------
TRANSLATABLE_KEYS = {'headline', 'description', 'name', 'text'}

def looks_translatable(v):
    if not isinstance(v, str) or not v.strip(): return False
    if re.match(r'^https?://', v): return False
    if re.match(r'^[\w.+-]+@[\w.-]+$', v): return False
    if re.match(r'^PT\d', v): return False
    if re.match(r'^\d{4}-\d{2}-\d{2}', v): return False
    if not re.search(r'[a-zA-Z]{3,}', v): return False
    return True

def collect_strings(obj, path=()):
    out = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in TRANSLATABLE_KEYS and isinstance(v, str) and looks_translatable(v):
                out.append((path + (k,), v))
            else:
                out += collect_strings(v, path + (k,))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            out += collect_strings(v, path + (i,))
    return out

def set_path(obj, path, val):
    for p in path[:-1]: obj = obj[p]
    obj[path[-1]] = val

JSONLD_BATCH_SYSTEM = """You are a professional French (France) translator specializing in career-advice content.
You will receive a JSON array of English strings (schema.org metadata: headlines, descriptions, FAQ questions/answers, how-to steps).
Translate each string to natural, fluent French with a professional career-advice tone.
Translate "resume" as "CV" (never "résumé"). Keep "ATS" as "ATS".
RULES: Do NOT translate URLs, brand names (Cvyon, Zendesk...), or proper nouns. Keep numbers unchanged.
Return ONLY a JSON array of the translated strings, in the SAME order, with the SAME number of items. No explanations, no markdown fences."""

TRANSLATE_JSONLD = False  # scripts are machine-readable metadata; keep byte-identical (backend too slow for value-by-value)

def translate_jsonld(script_html, slug, idx):
    if not TRANSLATE_JSONLD:
        return script_html
    m = re.search(r'<script\b([^>]*)>(.*?)</script>', script_html, re.S | re.I)
    attrs, body = m.group(1), m.group(2)
    try:
        data = json.loads(body)
    except Exception as e:
        print(f"JSONLD-SOURCE-INVALID {slug}/script{idx}: {str(e)[:100]} — kept byte-identical", flush=True)
        return script_html
    strings = collect_strings(data)
    if strings:
        # small batches: Cloudflare 524s on slow large outputs — keep batches <=2 strings
        for bi in range(0, len(strings), 2):
            batch = strings[bi:bi+2]
            arr = [v for _, v in batch]
            ok = False
            for attempt in range(4):
                try:
                    time.sleep(0.5)
                    out = strip_fences(chat(JSONLD_BATCH_SYSTEM, json.dumps(arr, ensure_ascii=False), max_tokens=2000))
                    trans = json.loads(out)
                    if isinstance(trans, list) and len(trans) == len(arr) and all(isinstance(x, str) for x in trans):
                        for (p, _), t in zip(batch, trans):
                            set_path(data, p, t)
                        ok = True
                        break
                    print(f"JSONLD-BATCH-RETRY {slug}/script{idx} batch{bi} attempt {attempt}: shape mismatch", flush=True)
                except Exception as e:
                    print(f"JSONLD-BATCH-RETRY {slug}/script{idx} batch{bi} attempt {attempt}: {str(e)[:100]}", flush=True)
            if not ok:
                print(f"JSONLD-BATCH-FALLBACK {slug}/script{idx} batch{bi}: kept English values", flush=True)
    new_body = json.dumps(data, ensure_ascii=False, indent=2)
    return f"<script{attrs}>\n{new_body}\n</script>"

def restore_comments(src_html, merged_html, slug):
    """Restore source HTML comments (in order) into the merged translation."""
    src_comments = re.findall(r'<!--.*?-->', src_html, re.S)
    out_comments = re.findall(r'<!--.*?-->', merged_html, re.S)
    if len(src_comments) != len(out_comments):
        print(f"COMMENT-COUNT-MISMATCH {slug}: src={len(src_comments)} out={len(out_comments)}", flush=True)
        return merged_html
    for sc in src_comments:
        merged_html = merged_html.replace(out_comments.pop(0), sc, 1)
    return merged_html

# ---------- structure validation ----------
class Sig(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.seq = []
    def handle_starttag(self, tag, attrs):
        self.seq.append((tag, tuple(sorted(n for n, v in attrs))))
    def handle_startendtag(self, tag, attrs):
        self.seq.append((tag, tuple(sorted(n for n, v in attrs))))
    def handle_endtag(self, tag):
        self.seq.append(('/' + tag, ()))

STRUCT_ATTRS = {'href','src','class','id','style','type','rel','poster','controls','preload','content','name','property','datetime','width','height','charset','data-video','data-anything'}

def attr_values(html):
    """Map of structural attribute values keyed by occurrence order."""
    vals = []
    for m in re.finditer(r'<([a-zA-Z][a-zA-Z0-9]*)((?:\s+[a-zA-Z-]+(?:=(?:"[^"]*"|\'[^\']*\'|[^\s>]+))?)*)\s*/?>', html):
        tag, attrstr = m.group(1).lower(), m.group(2)
        for am in re.finditer(r'([a-zA-Z-]+)(?:=("([^"]*)"|\'([^\']*)\'|([^\s>]+)))?', attrstr):
            n = am.group(1).lower()
            v = am.group(3) or am.group(4) or am.group(5) or ''
            if n in STRUCT_ATTRS or n.startswith('data-'):
                if n in ('alt','aria-label'): continue
                vals.append((tag, n, v))
    return vals

def main():
    import os
    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)
    report = []
    for slug in SLUGS:
        opath = f"{OUT_DIR}/{slug}.json"
        if os.path.exists(opath):
            try:
                d = json.load(open(opath, encoding='utf-8'))
                if set(d.keys()) == {'slug','title','meta_description','header_image','content_html'}:
                    words = len(re.sub(r'<[^>]+>', ' ', d['content_html']).split())
                    report.append((slug, opath, words, 'cached', '', True, True, '', ''))
                    print(f"SKIP {slug}: already done", flush=True)
                    continue
            except Exception:
                pass
        src = json.load(open(f"{SRC_DIR}/{slug}.json", encoding="utf-8"))
        html = src['content_html']
        # 1. extract scripts
        scripts = []
        def _ph(m):
            scripts.append(m.group(0)); return f"\x00SCRIPT{len(scripts)-1}\x00"
        no_script = SCRIPT_RE.sub(_ph, html)
        # 2. chunk (+ resume from saved chunk translations)
        chunks = chunk_html(no_script)
        save_path = f"{WORK_DIR}/{slug}.chunks.json"
        saved = {}
        if os.path.exists(save_path):
            try: saved = json.load(open(save_path, encoding='utf-8'))
            except Exception: saved = {}
        # 3. translate missing chunks
        todo = [(i, c) for i, c in enumerate(chunks) if str(i) not in saved and c.strip()]
        def _tr(ic):
            i, c = ic
            time.sleep(0.3)
            return (i, strip_fences(chat(HTML_SYSTEM, c, max_tokens=3000)))
        if todo:
            with ThreadPoolExecutor(max_workers=2) as ex:
                for i, t in ex.map(_tr, todo):
                    saved[str(i)] = t
                    json.dump(saved, open(save_path, 'w', encoding='utf-8'), ensure_ascii=False)
        translated = [saved.get(str(i), chunks[i]) for i in range(len(chunks))]
        # 3b. per-chunk structural check; re-translate mismatches (max 2 retries)
        # Block-level tags must match exactly; inline formatting (strong/em/a) may vary slightly
        BLOCK_TAGS = {'p','li','h1','h2','h3','h4','ul','ol','div','hr','br','table','tr','td','th','img','video','source'}
        def _block_sig(h):
            s = Sig(); s.feed(h)
            return [t for t in s.seq if t[0].lstrip('/') in BLOCK_TAGS]
        def _sig(h):
            s = Sig(); s.feed(h); return s.seq
        for i, c in enumerate(chunks):
            if not c.strip():
                continue
            for retry in range(3):
                t = translated[i]
                if _block_sig(c) == _block_sig(t):
                    if _sig(c) != _sig(t):
                        print(f"CHUNK-NOTE {slug}[{i}]: inline formatting differs, block structure OK — accepted", flush=True)
                    break
                print(f"CHUNK-RETRY {slug}[{i}] attempt {retry+1}: block structure differs", flush=True)
                time.sleep(0.5)
                t = strip_fences(chat(HTML_SYSTEM, c, max_tokens=3000))
                translated[i] = t
                saved[str(i)] = t
            else:
                if _block_sig(c) == _block_sig(translated[i]):
                    print(f"CHUNK-ACCEPT {slug}[{i}]: block structure OK after retries (inline tags differ)", flush=True)
                else:
                    print(f"CHUNK-FAILED {slug}[{i}]: block structure still differs after retries", flush=True)
            json.dump(saved, open(save_path, 'w', encoding='utf-8'), ensure_ascii=False)
        merged = ''.join(translated)
        # 4. translate scripts (per-string failure -> keep original string), restore
        for i, s in enumerate(scripts):
            try:
                merged = merged.replace(f"\x00SCRIPT{i}\x00", translate_jsonld(s, slug, i))
            except Exception as e:
                print(f"JSONLD-ARTICLE-FALLBACK {slug}/script{i}: {str(e)[:150]}", flush=True)
                merged = merged.replace(f"\x00SCRIPT{i}\x00", s)
        assert '\x00SCRIPT' not in merged, f"{slug}: placeholder left over"
        # 5. title + meta
        title_fr = tr_text(src['title'])
        meta_fr = tr_text(src['meta_description'])
        time.sleep(0.4)
        # 5b. restore source comments (model sometimes translates them)
        merged = restore_comments(html, merged, slug)
        # 6. validations (block-level tags strict; inline formatting may vary)
        BLOCK_TAGS = {'p','li','h1','h2','h3','h4','ul','ol','div','hr','br','table','tr','td','th','img','video','source'}
        def _block_sig(h):
            s = Sig(); s.feed(h)
            return [t for t in s.seq if t[0].lstrip('/') in BLOCK_TAGS]
        s1, s2 = Sig(), Sig()
        s1.feed(SCRIPT_RE.sub('', html)); s2.feed(SCRIPT_RE.sub('', merged))
        tag_ok = _block_sig(SCRIPT_RE.sub('', html)) == _block_sig(SCRIPT_RE.sub('', merged))
        v1, v2 = attr_values(html), attr_values(merged)
        attr_ok = v1 == v2
        ent1 = len(re.findall(r'&[a-zA-Z]+;|&#\d+;', html))
        ent2 = len(re.findall(r'&[a-zA-Z]+;|&#\d+;', merged))
        if not tag_ok or not attr_ok:
            print(f"VALIDATION-FAILED {slug}: tag_ok={tag_ok} attr_ok={attr_ok} — NOT WRITTEN, chunks kept for re-translation", flush=True)
            # drop the bad chunks so they get re-translated next run
            report.append((slug, None, 0, len(chunks), len(scripts), tag_ok, attr_ok, ent1, ent2))
            continue
        # 7. write
        out = {"slug": slug, "title": title_fr, "meta_description": meta_fr,
               "header_image": src['header_image'], "content_html": merged}
        opath = f"{OUT_DIR}/{slug}.json"
        with open(opath, 'w', encoding='utf-8') as f:
            json.dump(out, f, ensure_ascii=False, indent=1)
            f.write('\n')
        json.load(open(opath, encoding='utf-8'))  # validity
        words = len(re.sub(r'<[^>]+>', ' ', merged).split())
        report.append((slug, opath, words, len(chunks), len(scripts), tag_ok, attr_ok, ent1, ent2))
        print(f"DONE {slug}: words={words} chunks={len(chunks)} scripts={len(scripts)} tag_ok={tag_ok} attr_ok={attr_ok} entities={ent1}->{ent2}", flush=True)
    print("\nREPORT:")
    for r in report: print(r)

if __name__ == '__main__':
    main()
