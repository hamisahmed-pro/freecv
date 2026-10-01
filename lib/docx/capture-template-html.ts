/**
 * capture-template-html.ts
 *
 * Client-side capture of the rendered résumé template for DOCX export.
 *
 * Strategy: the user already has the selected template rendered in the
 * builder preview. We clone that DOM, inline every element's *computed*
 * styles (so the DOCX matches the preview exactly — theme color, fonts,
 * spacing, colors), convert CSS row layouts (flex/grid) into real <table>s
 * (Word's native column primitive), and serialize to a clean HTML string
 * that the server converts with html-to-docx.
 *
 * Why client-side? getComputedStyle() is the only source of truth for the
 * *resolved* styles (Tailwind v4 CSS variables, theme color var, actual
 * flex/grid geometry). Doing this on the server would require shipping the
 * whole stylesheet + a layout engine and could never match the browser.
 */

const MARK_ATTR = 'data-docx-idx';

/**
 * Block-level tags whose `background-color` needs `display:block` inlined
 * alongside it. html-to-docx only applies paragraph shading (w:shd) when its
 * internal display attribute is exactly "block"; the capture generally does
 * not inline `display`, so backgrounds on these tags would otherwise render
 * as unshaded (notably: colored band headers, cards, pills-as-divs).
 */
const BG_BLOCK_TAGS = new Set([
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'DIV', 'HEADER', 'FOOTER',
  'SECTION', 'ARTICLE', 'ASIDE', 'MAIN', 'NAV', 'FIGURE', 'FIGCAPTION',
  'BLOCKQUOTE', 'PRE', 'ADDRESS', 'DT', 'DD',
]);

/**
 * Container tags that html-to-docx cannot handle as a direct child of <td>.
 * Its table-cell builder routes every child through buildParagraph, which
 * only understands inline content — a container holding block children
 * (p/h1/ul/…) inside a <td> has that content silently dropped. Pass 3c
 * hoists such containers' children directly into the cell.
 */
const TD_UNWRAP_TAGS = new Set([
  'DIV', 'SECTION', 'HEADER', 'FOOTER', 'ARTICLE', 'MAIN', 'NAV', 'ASIDE',
]);

/** Tags that count as "block content" when deciding whether to unwrap. */
const BLOCK_CONTENT_TAGS = new Set([
  'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'DIV', 'TABLE',
  'BLOCKQUOTE', 'PRE', 'ADDRESS', 'FIGURE', 'HR',
]);

/** Convert a CSS color (hex / rgb() / rgba()) to a 6-digit lowercase hex. */
function toHex6(color: string): string | null {
  const t = color.trim().toLowerCase();
  let m = t.match(/^#([0-9a-f]{6})$/);
  if (m) return m[1];
  m = t.match(/^#([0-9a-f]{3})$/);
  if (m) return m[1].split('').map((c) => c + c).join('');
  m = t.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/);
  if (m) {
    const hx = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
    return hx(+m[1]) + hx(+m[2]) + hx(+m[3]);
  }
  return null;
}

let colorCtx: CanvasRenderingContext2D | null | undefined;
const COLOR_FN_RE = /\b(?:lab|lch|oklab|oklch|hsl|hsla|hwb|color|color-mix|device-cmyk|light-dark)\([^()]*\)/gi;

/** CIE Lab (D50) -> sRGB hex. Tailwind v4 serializes computed colors as lab(). */
function labToHex(l: number, a: number, b: number): string {
  const f = (t: number) => (t ** 3 > 0.008856 ? t ** 3 : (t - 16 / 116) / 7.787);
  const fy = (l + 16) / 116;
  const fx = fy + a / 500;
  const fz = fy - b / 200;
  // XYZ with D50 white point
  let x = 0.96422 * f(fx);
  let y = 1.0 * f(fy);
  let z = 0.82521 * f(fz);
  // Bradford chromatic adaptation D50 -> D65
  const x2 = 0.9555766 * x - 0.0230393 * y + 0.0631636 * z;
  const y2 = -0.0282895 * x + 1.0099416 * y + 0.0210077 * z;
  const z2 = 0.0122982 * x - 0.0204830 * y + 1.3299098 * z;
  // XYZ -> linear sRGB
  const rl = 3.2404542 * x2 - 1.5371385 * y2 - 0.4985314 * z2;
  const gl = -0.969266 * x2 + 1.8760108 * y2 + 0.041556 * z2;
  const bl = 0.0556434 * x2 - 0.2040259 * y2 + 1.0572252 * z2;
  const gam = (c: number) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(v * 255)));
  };
  const hx = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hx(gam(rl))}${hx(gam(gl))}${hx(gam(bl))}`;
}

/** Oklab -> sRGB hex. */
function oklabToHex(l: number, a: number, b: number): string {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const lr = l_ ** 3;
  const mr = m_ ** 3;
  const sr = s_ ** 3;
  const rl = 4.0767416621 * lr - 3.3077115913 * mr + 0.2309699292 * sr;
  const gl = -1.2684380046 * lr + 2.6097574011 * mr - 0.3413193965 * sr;
  const bl = -0.0041960863 * lr - 0.7034186147 * mr + 1.707614701 * sr;
  const gam = (c: number) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.max(0, Math.min(255, Math.round(v * 255)));
  };
  const hx = (n: number) => n.toString(16).padStart(2, '0');
  return `#${hx(gam(rl))}${hx(gam(gl))}${hx(gam(bl))}`;
}

const LAB_RE = /^lab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i;
const LCH_RE = /^lch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i;
const OKLAB_RE = /^oklab\(\s*([\d.]+%?)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i;
const OKLCH_RE = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i;

function normColorToken(token: string): string {
  const t = token.trim();
  let m: RegExpMatchArray | null;
  if ((m = t.match(LAB_RE))) {
    const l = m[1].endsWith('%') ? parseFloat(m[1]) : parseFloat(m[1]);
    return labToHex(l, parseFloat(m[2]), parseFloat(m[3]));
  }
  if ((m = t.match(LCH_RE))) {
    const l = parseFloat(m[1]);
    const c = parseFloat(m[2]);
    const h = (parseFloat(m[3]) * Math.PI) / 180;
    return labToHex(l, c * Math.cos(h), c * Math.sin(h));
  }
  if ((m = t.match(OKLAB_RE))) {
    const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    return oklabToHex(l, parseFloat(m[2]), parseFloat(m[3]));
  }
  if ((m = t.match(OKLCH_RE))) {
    const l = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
    const c = parseFloat(m[2]);
    const h = (parseFloat(m[3]) * Math.PI) / 180;
    return oklabToHex(l, c * Math.cos(h), c * Math.sin(h));
  }
  // Canvas normalizes hsl()/hwb()/named colors; it echoes lab()/color() back.
  try {
    if (colorCtx === undefined) {
      colorCtx = document.createElement('canvas').getContext('2d');
    }
    if (colorCtx) {
      colorCtx.fillStyle = '#000001'; // sentinel: invalid input keeps old value
      colorCtx.fillStyle = t;
      const out = colorCtx.fillStyle;
      if (out && out !== '#000001' && out.toLowerCase() !== t.toLowerCase()) return out;
    }
  } catch {
    /* fall through */
  }
  return token;
}
function normColors(v: string): string {
  COLOR_FN_RE.lastIndex = 0;
  if (!COLOR_FN_RE.test(v)) return v;
  COLOR_FN_RE.lastIndex = 0;
  return v.replace(COLOR_FN_RE, (m) => normColorToken(m));
}

// CSS properties we inline. This list mirrors what html-to-docx honors:
// color, background, font-*, text-align, line-height, margins, paddings,
// widths, vertical-align, list styles. Borders and text-decoration are
// handled structurally (see below). Layout props (display/flex/grid) are
// consumed by the table conversion, not inlined.
const INLINE_PROPS = [
  'color',
  'background-color',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'text-align',
  'line-height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'width',
  'vertical-align',
] as const;

const TRANSPARENT = new Set(['transparent', 'rgba(0, 0, 0, 0)']);

function isVisibleTextColor(v: string): boolean {
  return !!v && v !== 'rgba(0, 0, 0, 0)';
}

/**
 * Locate the template root element inside the builder preview.
 * The preview wraps the template in an 816px stage div that carries the
 * --theme-color custom property (set by HTMLPreview).
 */
export function findTemplateRoot(): HTMLElement | null {
  // Preferred: explicit stage marker (added in HTMLPreview).
  // NOTE: several stage markers can exist in the DOM at once (desktop
  // preview, mobile preview overlay). The old code searched only inside
  // #preview-panel and took the first marker in DOM order — the desktop
  // preview stage, which is display:none on mobile — so mobile DOCX exports
  // silently fell back to the generic builder even with the preview overlay
  // open. Search the whole document and pick the first stage that is
  // actually visible/measurable instead.
  const stages = document.querySelectorAll<HTMLElement>('[data-cvyon-template-stage]');
  for (const stage of stages) {
    const root = stage.firstElementChild;
    if (root instanceof HTMLElement && root.offsetWidth > 0) return root;
  }
  // Fallback: the 816px wrapper carrying --theme-color in its style.
  const panel = document.getElementById('preview-panel');
  const scope = panel || document.documentElement;
  const cands = scope.querySelectorAll<HTMLElement>('div[style*="--theme-color"]');
  for (const c of cands) {
    const root = c.firstElementChild;
    if (root instanceof HTMLElement && root.offsetWidth > 0) return root;
  }
  // If no preview is visible (e.g. mobile with preview closed),
  // computed geometry is 0 and capture would be garbage.
  return null;
}

interface WalkPair {
  orig: Element;
  clone: Element;
}

/**
 * Capture the rendered template as standalone HTML with inlined styles.
 * Returns null when the template is not currently rendered/measurable.
 */
/**
 * Lucide icon name -> text glyph for DOCX export. Word cannot consume raw
 * SVG, so contact icons are swapped for a glyph carrying the same meaning.
 * Only icons in this map survive; other SVGs (decorative) are stripped.
 */
const ICON_GLYPHS: Record<string, string> = {
  'mail': '\u2709',      // envelope
  'phone': '\u260E',     // telephone
  'map-pin': '\uD83D\uDCCD', // round pushpin
  'globe': '\uD83C\uDF10',   // globe with meridians
  'linkedin': 'in',
  'github': 'gh',
  'twitter': '\uD835\uDD4F',
  'link': '\uD83D\uDD17',
};

/**
 * Downscale a data-URL photo in place (synchronous canvas draw). The
 * ORIGINAL img is rendered and fully loaded, so naturalWidth is reliable —
 * the detached clone's is not. Caps the longest edge at 256px to keep the
 * captured HTML (and the resulting DOCX) small.
 */
function downscalePhotoInPlace(cloneImg: HTMLImageElement, origImg: HTMLImageElement): void {
  const src = cloneImg.getAttribute('src') || '';
  if (!src.startsWith('data:image/')) {
    cloneImg.remove(); // remote images: strip (privacy/perf)
    return;
  }
  try {
    const w = origImg.naturalWidth;
    const h = origImg.naturalHeight;
    if (!w || !h) return; // dimensions unknown — keep original
    const MAX = 256;
    const scale = Math.min(1, MAX / Math.max(w, h));
    if (scale >= 1) return; // already small enough
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(origImg, 0, 0, canvas.width, canvas.height);
    const mime = src.startsWith('data:image/jpeg') || src.startsWith('data:image/jpg') ? 'image/jpeg' : 'image/png';
    cloneImg.setAttribute('src', canvas.toDataURL(mime, 0.85));
    cloneImg.setAttribute('width', String(canvas.width));
    cloneImg.setAttribute('height', String(canvas.height));
  } catch {
    /* keep the original src on any failure */
  }
}

export function captureTemplateHtml(): string | null {
  const root = findTemplateRoot();
  if (!root) return null;

  const clone = root.cloneNode(true) as HTMLElement;

  // --- Pass 0: index pairs (original <-> clone) for lockstep walks ------
  const origWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const cloneWalker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT);
  const pairs: WalkPair[] = [];
  let o: Node | null = origWalker.currentNode;
  let c: Node | null = cloneWalker.currentNode;
  let idx = 0;
  while (o && c) {
    (o as Element).setAttribute(MARK_ATTR, String(idx));
    (c as Element).setAttribute(MARK_ATTR, String(idx));
    pairs.push({ orig: o as Element, clone: c as Element });
    idx++;
    o = origWalker.nextNode();
    c = cloneWalker.nextNode();
  }
  const cloneByIdx = new Map<number, Element>();
  for (const p of pairs) {
    const i = Number(p.clone.getAttribute(MARK_ATTR));
    cloneByIdx.set(i, p.clone);
  }

  try {
  // --- Pass 1.5: effective backgrounds (top-down) ------------------------
  // A descendant's rendered background is its own non-transparent
  // background-color, else its nearest ancestor's. The ROOT's own
  // background is deliberately excluded — it becomes the Word *page*
  // background via the marker emitted at the end (avoids redundant
  // per-paragraph shading and keeps dark templates legible).
  const effBgOf = new Map<Element, string>();
  {
    const bgWalker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    let bn: Node | null = bgWalker.currentNode;
    while (bn) {
      const bel = bn as Element;
      if (bel === root) {
        effBgOf.set(bel, '');
      } else {
        const own = normColors(
          window.getComputedStyle(bel).getPropertyValue('background-color').trim()
        );
        effBgOf.set(
          bel,
          own && !TRANSPARENT.has(own) ? own : (effBgOf.get(bel.parentElement as Element) ?? '')
        );
      }
      bn = bgWalker.nextNode();
    }
  }

  // --- Pass 1: text nodes — text-transform, underline, strike ----------
  // Runs BEFORE any subtree removal so the original/clone text-node
  // sequences stay in lockstep.
  const origTextWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const cloneTextWalker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT);
  let ot: Node | null = origTextWalker.nextNode();
  let ct: Node | null = cloneTextWalker.nextNode();
  while (ot && ct) {
    const parent = ot.parentElement;
    const text = ot.textContent || '';
    if (parent && text.trim() !== '') {
      const cs = window.getComputedStyle(parent);
      const tt = cs.getPropertyValue('text-transform');
      let out = text;
      if (tt === 'uppercase') out = text.toUpperCase();
      else if (tt === 'lowercase') out = text.toLowerCase();
      else if (tt === 'capitalize') out = text.replace(/\b\w/g, (m) => m.toUpperCase());
      const tdLine = cs.getPropertyValue('text-decoration-line');
      if (out !== text) ct.textContent = out;
      if (tdLine.includes('underline') || tdLine.includes('line-through')) {
        const wrap = document.createElement(tdLine.includes('underline') ? 'u' : 's');
        ct.parentNode?.replaceChild(wrap, ct);
        wrap.appendChild(ct);
      }
    }
    ot = origTextWalker.nextNode();
    ct = cloneTextWalker.nextNode();
  }

  // --- Pass 2: inline computed styles, drop display:none subtrees -------
  // Iterate in reverse so removing hidden subtrees doesn't disturb walkers.
  // NOTE: the clone is detached from the document, so we track removals
  // explicitly instead of relying on isConnected.
  const removedClones = new Set<Element>();
  const isRemoved = (cl: Element): boolean => {
    let p: Element | null = cl;
    while (p) {
      if (removedClones.has(p)) return true;
      p = p.parentElement;
    }
    return false;
  };
  for (let i = pairs.length - 1; i >= 0; i--) {
    const { orig, clone: cl } = pairs[i];
    const cs = window.getComputedStyle(orig);
    if (cs.display === 'none') {
      removedClones.add(cl);
      cl.remove();
      continue;
    }
    const decl: string[] = [];
    for (const prop of INLINE_PROPS) {
      let v = cs.getPropertyValue(prop);
      if (!v) continue;
      if (prop === 'background-color') {
        // Root background -> Word page background (marker at the end).
        // Descendants get the EFFECTIVE (own-or-inherited) background so
        // colored bands/cards keep their fill. display:block is required
        // for html-to-docx to emit paragraph shading (w:shd).
        if (orig === root) continue;
        const bg = effBgOf.get(orig) ?? '';
        if (!bg || TRANSPARENT.has(bg)) continue;
        decl.push(`background-color:${bg}`);
        if (BG_BLOCK_TAGS.has(orig.tagName)) decl.push('display:block');
        continue;
      }
      if (prop === 'color' && !isVisibleTextColor(v)) continue;
      // Margins/paddings of 0px add noise; keep them only when non-zero.
      if ((prop.startsWith('margin') || prop.startsWith('padding')) && parseFloat(v) === 0) continue;
      if (prop === 'width') {
        // Only keep explicit-looking widths on elements where width matters
        // (table cells are set explicitly later). Keep for block containers.
        const tag = orig.tagName;
        if (tag === 'SPAN' || tag === 'A' || tag === 'STRONG' || tag === 'EM' || tag === 'B' || tag === 'I' || tag === 'U')
          continue;
      }
      if (prop === 'line-height' && v === 'normal') continue;
      decl.push(`${prop}:${normColors(v)}`);
    }
    if (decl.length) cl.setAttribute('style', decl.join(';'));
  }

  // --- Pass 3: structural — borders, then flex/grid -> tables ----------
  // First, precompute for every ORIGINAL element whether it is a row
  // layout and at what table depth it sits. This MUST be top-down and
  // complete before any conversion, because conversion happens deepest-
  // first (ancestors aren't marked yet when descendants convert).
  const px = (v: string): number => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const isRowLayoutOf = (el: Element): { row: boolean; wrap: boolean; cols: number } => {
    const cs = window.getComputedStyle(el);
    const display = cs.getPropertyValue('display');
    const flexRow =
      (display === 'flex' || display === 'inline-flex') &&
      cs.getPropertyValue('flex-direction') === 'row';
    let cols = 0;
    if (display === 'grid') {
      const tracks = cs.getPropertyValue('grid-template-columns').trim();
      if (tracks && tracks !== 'none') cols = tracks.split(/\s+/).filter(Boolean).length;
    }
    return {
      row: flexRow || cols > 1,
      wrap: cs.getPropertyValue('flex-wrap') === 'wrap' || cs.getPropertyValue('flex-wrap') === 'wrap-reverse',
      cols,
    };
  };

  // top-down precompute
  const tableDepthOf = new Map<Element, number>();
  const convertsToTable = new Set<Element>();
  {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
    const els: Element[] = [];
    let n0: Node | null = walker.currentNode;
    while (n0) {
      els.push(n0 as Element);
      n0 = walker.nextNode();
    }
    for (const el of els) {
      const parent = el.parentElement;
      const parentDepth = parent && parent !== root ? tableDepthOf.get(parent) ?? 0 : 0;
      const parentConverts = parent ? convertsToTable.has(parent) : false;
      const depth = parentDepth + (parentConverts ? 1 : 0);
      tableDepthOf.set(el, depth);
      if (depth === 0 && el !== root) {
        const { row, wrap } = isRowLayoutOf(el);
        const kids = [...el.children].filter((k) => k instanceof HTMLElement);
        if (row && !wrap && kids.length >= 2) convertsToTable.add(el);
      }
    }
  }

  const depthOf = (el: Element): number => {
    let d = 0;
    let p: Element | null = el;
    while (p && p !== root) {
      d++;
      p = p.parentElement;
    }
    return d;
  };
  const byDepthDesc = [...pairs].sort((a, b) => depthOf(b.orig) - depthOf(a.orig));

  for (const { orig, clone: cl } of byDepthDesc) {
      if (isRemoved(cl)) continue; // removed as part of a hidden subtree
    const cs = window.getComputedStyle(orig);
    const depth = tableDepthOf.get(orig) ?? 0;

    // 3a. Horizontal rules: border-top/bottom -> colored bar paragraphs.
    // A real <table> wrapper would nest illegally inside converted table
    // cells (html-to-docx drops nested tables), so a thin shaded paragraph
    // is the faithful, always-safe rendering of an accent rule.
    for (const side of ['border-top', 'border-bottom'] as const) {
      const style = cs.getPropertyValue(`${side}-style`);
      const width = px(cs.getPropertyValue(`${side}-width`));
      const color = cs.getPropertyValue(`${side}-color`);
      if (style !== 'none' && width > 0 && isVisibleTextColor(color)) {
        const bar = document.createElement('p');
        const hpx = Math.max(1, Math.round(width));
        const barColor = normColors(color);
        bar.setAttribute(
          'style',
          `background-color:${barColor};font-size:${hpx}px;line-height:${hpx}px;margin:0;padding:0;`
        );
        bar.innerHTML = '&nbsp;';
        if (side === 'border-top') cl.parentNode?.insertBefore(bar, cl);
        else cl.parentNode?.insertBefore(bar, cl.nextSibling);
      }
    }

    // 3b. Row layouts.
    const { row: isRowLayout, wrap } = isRowLayoutOf(orig);
    if (!isRowLayout) continue;

    const kids = [...orig.children].filter((k) => k instanceof HTMLElement) as HTMLElement[];
    if (kids.length === 0) continue;

    if (!convertsToTable.has(orig)) {
      if (depth > 0 || wrap) {
        // Linearize: stack children as blocks. For wrapping chip rows keep
        // inline flow (run-level shading preserves chip colors).
        // For the ubiquitous space-between title/date pattern, right-align
        // the trailing child.
        const justify = cs.getPropertyValue('justify-content');
        const cloneKids = [...cl.children].filter((k) => k instanceof HTMLElement) as HTMLElement[];
        cloneKids.forEach((ck, i) => {
          const cur = ck.getAttribute('style') || '';
          let extra = ';display:block';
          if (wrap) extra = ';display:inline';
          else if (
            i === cloneKids.length - 1 &&
            cloneKids.length === 2 &&
            (justify === 'space-between' || justify === 'flex-end' || justify === 'end')
          )
            extra = ';display:block;text-align:right';
          ck.setAttribute('style', `${cur}${extra}`.replace(/^;/, ''));
        });
      }
      continue;
    }

    // Depth 0, non-wrapping row with >= 2 children: build the table.
    const table = document.createElement('table');
    table.setAttribute('cellpadding', '0');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('style', 'width:100%;border-collapse:collapse');
    const tr = document.createElement('tr');
    table.appendChild(tr);

    const alignItems = cs.getPropertyValue('align-items');
    const valign =
      alignItems === 'center' ? 'middle' : alignItems === 'flex-end' || alignItems === 'end' ? 'bottom' : 'top';
    const gap = px(cs.getPropertyValue('column-gap'));
    const n = kids.length;

    kids.forEach((kid, i) => {
      const td = document.createElement('td');
      const kcs = window.getComputedStyle(kid);
      const wpx = px(kcs.getPropertyValue('width'));
      let tdStyle = `vertical-align:${valign};padding-top:0;padding-bottom:0;border:none`;
      if (wpx > 0) tdStyle += `;width:${Math.round(wpx)}px`;
      // Continuous cell shading from the kid's effective background keeps
      // colored bands/cards seamless (no white striping between paragraphs).
      const kidBg = effBgOf.get(kid);
      if (kidBg && !TRANSPARENT.has(kidBg)) tdStyle += `;background-color:${kidBg}`;
      if (gap > 0) {
        const half = Math.round(gap / 2);
        if (i > 0) tdStyle += `;padding-left:${half}px`;
        if (i < n - 1) tdStyle += `;padding-right:${half}px`;
      }
      td.setAttribute('style', tdStyle);
      const cloneKid = cloneByIdx.get(Number(kid.getAttribute(MARK_ATTR)));
      if (cloneKid) td.appendChild(cloneKid);
      tr.appendChild(td);
    });

    cl.replaceWith(table);
  }

  // --- Pass 3c: unwrap containers inside table cells --------------------
  // html-to-docx routes every <td> child through buildParagraph, which only
  // understands inline content. A <div> (or section/header/…) holding block
  // children (p/h1/ul/…) directly inside a <td> has that content silently
  // DROPPED. Hoist such containers' children directly into the cell.
  // Safe: every hoisted child already carries its own inlined computed
  // styles (including the effective background from Pass 1.5/2), so no
  // color, alignment, or shading is lost. Containers with only inline
  // content are left alone (they convert fine and keep their text-align).
  for (const td of clone.querySelectorAll('td')) {
    let changed = true;
    while (changed) {
      changed = false;
      for (const child of [...td.children]) {
        if (
          TD_UNWRAP_TAGS.has(child.tagName) &&
          [...child.children].some((k) => BLOCK_CONTENT_TAGS.has(k.tagName))
        ) {
          while (child.firstChild) td.insertBefore(child.firstChild, child);
          child.remove();
          changed = true;
        }
      }
    }
  }

  // --- Pass 4: media + cleanup --------------------------------------------
  // Profile photos (<img> with data: URL src) are the user's uploaded photo:
  // keep them, downscaled to cap size. SVG contact icons become text glyphs
  // (Word cannot render raw SVG). Everything else media/script is stripped.
  // Afterwards, class/id/data attributes are removed as before (styles are
  // inlined; classes only bloat).
  const origByClone = new Map<Element, Element>();
  for (const pr of pairs) origByClone.set(pr.clone, pr.orig);
  clone.querySelectorAll('img').forEach((img) => {
    const orig = origByClone.get(img) as HTMLImageElement | undefined;
    if (orig instanceof HTMLImageElement) downscalePhotoInPlace(img as HTMLImageElement, orig);
    else img.remove();
  });
  clone.querySelectorAll('svg').forEach((svg) => {
    const cls = svg.getAttribute('class') || '';
    const m = cls.match(/lucide-([a-z-]+)/);
    const glyph = m ? ICON_GLYPHS[m[1]] : undefined;
    if (!glyph) {
      svg.remove();
      return;
    }
    const span = document.createElement('span');
    span.textContent = glyph;
    // Carry the icon's rendered size/color (Pass 2 inlined them on the svg).
    const style = svg.getAttribute('style') || '';
    const sizeMatch = style.match(/width\s*:\s*([\d.]+)px/);
    const colorMatch = style.match(/color\s*:\s*([^;]+)/);
    let spanStyle = '';
    if (sizeMatch) spanStyle += `font-size:${sizeMatch[1]}px;`;
    if (colorMatch) spanStyle += `color:${colorMatch[1].trim()};`;
    if (spanStyle) span.setAttribute('style', spanStyle);
    svg.replaceWith(span);
  });
  clone.querySelectorAll('script,style,button,canvas,video,iframe').forEach((el) => el.remove());
  const all = [clone, ...clone.querySelectorAll('*')];
  for (const el of all) {
    for (const attr of [...el.attributes]) {
      const name = attr.name;
      if (
        name === 'class' ||
        name === 'id' ||
        name.startsWith('data-') ||
        name.startsWith('on') ||
        (name === 'style' && !attr.value.trim())
      ) {
        el.removeAttribute(name);
      }
    }
  }

  // Root: pin to full page width (page margins are 0 in the DOCX).
  const rootStyle = clone.getAttribute('style') || '';
  if (!/width\s*:/.test(rootStyle)) {
    clone.setAttribute('style', `${rootStyle};width:816px`.replace(/^;/, ''));
  }

  // Root background -> Word page background. The server turns this marker
  // into <w:background>, so dark templates (Noir, Executive, …) stay legible
  // without painting every paragraph. Skipped for white/transparent roots
  // (the Word default).
  let prefix = '';
  const rootBgRaw = window.getComputedStyle(root).getPropertyValue('background-color').trim();
  if (rootBgRaw && !TRANSPARENT.has(rootBgRaw)) {
    const hex = toHex6(normColors(rootBgRaw));
    if (hex && hex !== 'ffffff') prefix = `<!--docx-page-bg:${hex}-->`;
  }

  return prefix + clone.outerHTML;
  } finally {
    // Never leave pairing markers on the live preview DOM, even on error.
    root.removeAttribute(MARK_ATTR);
    root.querySelectorAll(`[${MARK_ATTR}]`).forEach((el) => el.removeAttribute(MARK_ATTR));
  }
}
