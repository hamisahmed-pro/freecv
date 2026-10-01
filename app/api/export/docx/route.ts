import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import HTMLtoDOCX from 'html-to-docx';
import JSZip from 'jszip';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  TabStopType,
} from 'docx';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiError } from '@/lib/api-error';
import { sanitizeResumeData } from '@/lib/validation';

interface PersonalInfo {
  fullName: string; jobTitle: string; email: string; phone: string;
  location: string; website: string; profilePicture?: string;
}
interface Experience { id: string; company: string; role: string; startDate: string; endDate: string; description: string; }
interface Education { id: string; school: string; degree: string; graduationYear: string; }
interface Skill { id: string; name: string; }
interface Project { id: string; name: string; description: string; link: string; }
interface Certification { id: string; name: string; issuer: string; date: string; }
interface Reference { id: string; name: string; title: string; company: string; contact: string; }
interface CustomSectionItem { id: string; title: string; subtitle: string; date: string; description: string; }
interface CustomSection { id: string; title: string; items: CustomSectionItem[]; }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize any theme color input to a 6-digit hex string (no '#') for docx. */
function normalizeAccent(input: unknown): string {
  const fallback = '2563EB';
  if (typeof input !== 'string') return fallback;
  let hex = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  return /^[0-9a-fA-F]{6}$/.test(hex) ? hex.toUpperCase() : fallback;
}

/** Strip any stray HTML tags and collapse whitespace (descriptions are plain text with \n). */
function cleanText(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|ul|ol|h\d)>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** Split a description into bullet lines (handles real newlines and literal \n). */
function toBulletLines(input: unknown): string[] {
  const text = cleanText(input);
  if (!text) return [];
  return text
    .split(/\\n|\r?\n/)
    .map((line) => line.replace(/^[-\u2022*\s]+/, '').trim())
    .filter(Boolean);
}

const INK = '141312'; // near-black, matches the Cvyon preview ink
const GRAY = '6B7280';

/** Max captured-template HTML we'll convert (bytes). Captures are ~200-600KB. */
const MAX_TEMPLATE_HTML_BYTES = 2_000_000;

/**
 * Validate + sanitize the client-captured template HTML before conversion.
 * The capture is produced by our own client code from the rendered template,
 * but we still strip scripts/styles/event handlers and enforce size/shape.
 * Returns null when the HTML is missing or unusable (caller falls back to
 * the generic builder).
 */
function sanitizeTemplateHtml(html: unknown): string | null {
  if (typeof html !== 'string') return null;
  const t = html.trim();
  if (t.length < 200 || t.length > MAX_TEMPLATE_HTML_BYTES) return null;
  if (!/<(div|p|table|h1|h2|h3|ul|ol|li)\b/i.test(t)) return null;
  const out = t
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<link[\s\S]*?>/gi, '')
    .replace(/\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g, '');
  return out;
}

/**
 * When the capture emits a `<!--docx-page-bg:RRGGBB-->` marker (template root
 * has a non-white background, e.g. dark templates), html-to-docx has no way
 * to paint the Word page itself (`w:background` does not survive PDF/print
 * rendering). Instead we wrap the whole document in a single full-width
 * layout table whose cell carries the background as cell shading — Word-safe
 * and prints correctly.
 *
 * IMPORTANT: html-to-docx drops block content in `td > div > p/h1/...`
 * structures. The captured HTML root is always a <div>, so we hoist its
 * children directly into the wrapper cell (moving its padding/background
 * to the cell) to avoid content loss.
 */
function wrapWithPageBg(html: string, pageBg: string): string {
  // Use a lightweight DOM parse to unwrap the root div safely.
  // (jsdom is available in the Next.js server runtime via node_modules.)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(`<body>${html}</body>`);
    const body = dom.window.document.body;
    const rootDiv = body.firstElementChild;
    let innerHtml = html;
    let cellExtraStyle = '';
    if (rootDiv && rootDiv.tagName === 'DIV') {
      const style = rootDiv.getAttribute('style') || '';
      // Move padding to the cell so spacing is preserved after unwrapping.
      const paddings = style.match(/padding[^;:]*\s*:[^;]+;?/gi);
      if (paddings) cellExtraStyle = paddings.join(' ');
      innerHtml = rootDiv.innerHTML;
    }
    return (
      `<table style="width:100%;border:none;border-collapse:collapse;"><tr>` +
      `<td style="background-color:#${pageBg};border:none;${cellExtraStyle}vertical-align:top;">${innerHtml}</td>` +
      `</tr></table>`
    );
  } catch {
    // Fallback: wrap as-is (content may drop in edge cases, but no crash).
    return (
      `<table style="width:100%;border:none;border-collapse:collapse;"><tr>` +
      `<td style="background-color:#${pageBg};border:none;padding:0;vertical-align:top;">${html}</td>` +
      `</tr></table>`
    );
  }
}

async function postProcessDocx(buffer: Buffer, pageBg: string | null): Promise<Buffer> {
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file('word/document.xml');
  if (!docFile) return buffer;
  let xml = await docFile.async('string');
  xml = xml.replace(/<w:tblBorders>[\s\S]*?<\/w:tblBorders>/g, '');
  if (pageBg) {
    // The page-bg wrapper table is always the first <w:tbl> in the document.
    // html-to-docx emits a fixed 8640 dxa width; expand it to the full page
    // width (12240 dxa = 8.5" — margins are 0 for template exports) so the
    // background is truly full-bleed.
    xml = xml.replace(
      /(<w:tbl>\s*<w:tblPr>[\s\S]*?<w:tblW w:type="dxa" w:w=")\d+(")/,
      '$112240$2'
    );
  }
  zip.file('word/document.xml', xml);
  return zip.generateAsync({ type: 'nodebuffer' });
}

/**
 * Pull the `<!--docx-page-bg:RRGGBB-->` marker (if any) out of the captured
 * HTML. Returns the HTML without the marker and the hex color (or null).
 */
function extractPageBg(html: string): { html: string; pageBg: string | null } {
  const m = html.match(/<!--docx-page-bg:([0-9a-fA-F]{6})-->/);
  if (!m) return { html, pageBg: null };
  return { html: html.replace(m[0], ''), pageBg: m[1].toUpperCase() };
}

function docxResponse(buffer: Buffer, fullName: string, jobTitle: string) {  const safeName =
    fullName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'My';
  const safeRole =
    jobTitle.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_') || 'Resume';
  return new Response(buffer as any, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename=${safeName}_${safeRole}_Resume.docx`,
    },
  });
}

export async function POST(request: Request) {
  try {
    const rateLimitResponse = await checkRateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    const rawBody: any = await request.json();

    // New envelope shape from the client capture:
    //   { data: <resume payload>, templateHtml: <inlined template HTML>, templateId }
    // Old shape (kept for compatibility): the resume payload directly.
    const isEnvelope =
      rawBody &&
      typeof rawBody === 'object' &&
      typeof rawBody.templateHtml === 'string' &&
      rawBody.data &&
      typeof rawBody.data === 'object';
    const rawData: any = isEnvelope ? rawBody.data : rawBody;
    const templateHtml = isEnvelope ? sanitizeTemplateHtml(rawBody.templateHtml) : null;
    const templateId = isEnvelope ? String(rawBody.templateId || '') : '';

    // Sanitize the incoming payload (validation + XSS stripping). The builder
    // payload predates parts of the resume schema, so fall back to the raw
    // payload rather than 400-ing a legitimate export.
    let data: any;
    try {
      data = sanitizeResumeData(rawData) as any;
    } catch (zodError: any) {
      logger.warn('docx', 'Payload did not fully match resume schema; exporting raw payload:', zodError?.message);
      data = rawData;
    }

    if (!data?.personalInfo) {
      return NextResponse.json({ error: 'Invalid resume data' }, { status: 400 });
    }

    const nameForFile = cleanText(data.personalInfo.fullName);
    const titleForFile = cleanText(data.personalInfo.jobTitle);

    // -- Template-faithful path -------------------------------------------
    // Convert the captured, style-inlined template HTML straight to DOCX so
    // the download matches the selected template's design (layout, colors,
    // fonts, accent rules). Page margins are 0: the template carries its
    // own padding, exactly like the on-screen preview.
    if (templateHtml) {
      try {
        const { html: cleanHtml, pageBg } = extractPageBg(templateHtml);
        // Dark/full-bleed templates: wrap in a shaded page table so the
        // background survives Word and PDF rendering (w:background does not).
        const htmlForDocx = pageBg ? wrapWithPageBg(cleanHtml, pageBg) : cleanHtml;
        const raw = await HTMLtoDOCX(htmlForDocx, null, {
          orientation: 'portrait',
          margins: { top: 0, right: 0, bottom: 0, left: 0, header: 0, footer: 0 },
          title: nameForFile ? `${nameForFile} Resume` : 'Resume',
          creator: 'Cvyon',
          lastModifiedBy: 'Cvyon',
          description:
            'Resume generated with Cvyon \u2014 free resume builder' +
            (templateId ? ` (${templateId} template)` : ''),
          lang: 'en-US',
        });
        const buffer = await postProcessDocx(raw, pageBg);
        return docxResponse(buffer, nameForFile, titleForFile);
      } catch (convError: any) {
        logger.warn(
          'docx',
          'Template-HTML conversion failed; falling back to generic builder:',
          convError?.message
        );
        // fall through to the generic builder below
      }
    }

    // -- Generic fallback builder (unchanged) -------------------------------

    // Theme + visibility flags live on the raw builder payload (zod strips
    // unknown keys), so read them from there.
    const accent = normalizeAccent(rawData?.theme?.color ?? data?.themeColor);
    const showProjects = Boolean(rawData?.showProjects);
    const showCertifications = Boolean(rawData?.showCertifications);
    const showReferences = Boolean(rawData?.showReferences);

    const personalInfo: PersonalInfo = data.personalInfo;
    const summary: string = cleanText(data.summary);
    const experience: Experience[] = Array.isArray(data.experience) ? data.experience : [];
    const education: Education[] = Array.isArray(data.education) ? data.education : [];
    const skills: Skill[] = Array.isArray(data.skills) ? data.skills : [];
    const projects: Project[] = Array.isArray(data.projects) ? data.projects : [];
    const certifications: Certification[] = Array.isArray(data.certifications) ? data.certifications : [];
    const references: Reference[] = Array.isArray(data.references) ? data.references : [];
    const customSections: CustomSection[] = Array.isArray(data.customSections) ? data.customSections : [];

    const children: Paragraph[] = [];

    // -- Small builders ------------------------------------------------------
    const run = (text: string, opts: Record<string, unknown> = {}) =>
      new TextRun({ text, font: 'Calibri', ...opts });

    /** Section heading that mirrors the preview: uppercase, accent color, accent rule. */
    const sectionHeading = (title: string) =>
      new Paragraph({
        children: [run(title.toUpperCase(), { bold: true, color: accent, size: 22 })],
        spacing: { before: 320, after: 140 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 6, color: accent, space: 4 },
        },
      });

    const bodyPara = (text: string) =>
      new Paragraph({
        children: [run(text, { size: 20, color: INK })],
        spacing: { after: 120 },
      });

    const bulletPara = (text: string) =>
      new Paragraph({
        children: [run(text, { size: 20, color: INK })],
        bullet: { level: 0 },
        spacing: { after: 60 },
      });

    /** Right-aligned tab stop at the content width (7.1in for 0.7in margins). */
    const RIGHT_TAB = 10224;

    // -- Header: name / title / contact (mirrors the preview header) ---------
    const fullName = cleanText(personalInfo.fullName);
    const jobTitle = cleanText(personalInfo.jobTitle);
    if (fullName) {
      children.push(
        new Paragraph({
          children: [run(fullName, { bold: true, size: 44, color: INK })],
          spacing: { after: 60 },
        })
      );
    }
    if (jobTitle) {
      children.push(
        new Paragraph({
          children: [run(jobTitle, { bold: true, size: 26, color: accent })],
          spacing: { after: 80 },
        })
      );
    }

    const contactInfo = [
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      personalInfo.website,
    ]
      .map(cleanText)
      .filter(Boolean)
      .join('  |  ');
    if (contactInfo) {
      children.push(
        new Paragraph({
          children: [run(contactInfo, { size: 18, color: GRAY })],
          spacing: { after: 120 },
        })
      );
    }

    // Accent rule under the header, like the preview's header divider.
    children.push(
      new Paragraph({
        children: [],
        spacing: { after: 160 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 12, color: accent, space: 1 },
        },
      })
    );

    // -- Professional Summary -------------------------------------------------
    if (summary) {
      children.push(sectionHeading('Professional Summary'));
      children.push(bodyPara(summary));
    }

    // -- Experience ------------------------------------------------------------
    if (experience.length > 0) {
      children.push(sectionHeading('Experience'));
      experience.forEach((exp) => {
        const role = cleanText(exp.role);
        const company = cleanText(exp.company);
        const dates = [cleanText(exp.startDate), cleanText(exp.endDate)]
          .filter(Boolean)
          .join(' \u2013 ');
        const headlineRuns = [];
        if (role) headlineRuns.push(run(role, { bold: true, size: 22, color: INK }));
        if (company) {
          if (role) headlineRuns.push(run('  \u2014  ', { size: 22, color: GRAY }));
          headlineRuns.push(run(company, { bold: true, size: 22, color: INK }));
        }
        if (dates) {
          headlineRuns.push(run('\t', { size: 22 }));
          headlineRuns.push(run(dates, { italics: true, size: 19, color: GRAY }));
        }
        if (headlineRuns.length > 0) {
          children.push(
            new Paragraph({
              children: headlineRuns,
              tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
              spacing: { before: 140, after: 60 },
            })
          );
        }
        toBulletLines(exp.description).forEach((line) => children.push(bulletPara(line)));
      });
    }

    // -- Education ---------------------------------------------------------------
    if (education.length > 0) {
      children.push(sectionHeading('Education'));
      education.forEach((edu) => {
        const degree = cleanText(edu.degree);
        const school = cleanText(edu.school);
        const year = cleanText(edu.graduationYear);
        const eduHeadline = [degree, school].filter(Boolean).join(', ');
        const eduRuns = [];
        if (eduHeadline) eduRuns.push(run(eduHeadline, { bold: Boolean(degree), size: 22, color: INK }));
        if (year) {
          eduRuns.push(run('\t', { size: 22 }));
          eduRuns.push(run(year, { italics: true, size: 19, color: GRAY }));
        }
        if (eduRuns.length > 0) {
          children.push(
            new Paragraph({
              children: eduRuns,
              tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
              spacing: { before: 140, after: 60 },
            })
          );
        }
      });
    }

    // -- Skills --------------------------------------------------------------------
    const skillNames = skills.map((s) => cleanText(s.name)).filter(Boolean);
    if (skillNames.length > 0) {
      children.push(sectionHeading('Skills'));
      children.push(bodyPara(skillNames.join('  \u2022  ')));
    }

    // -- Projects ----------------------------------------------------------------------
    if (showProjects && projects.length > 0) {
      children.push(sectionHeading('Projects'));
      projects.forEach((proj) => {
        const name = cleanText(proj.name);
        const link = cleanText(proj.link);
        const desc = cleanText(proj.description);
        const projRuns = [];
        if (name) projRuns.push(run(name, { bold: true, size: 22, color: INK }));
        if (link) projRuns.push(run(`  (${link})`, { italics: true, size: 19, color: GRAY }));
        if (projRuns.length > 0) {
          children.push(
            new Paragraph({ children: projRuns, spacing: { before: 140, after: desc ? 40 : 60 } })
          );
        }
        if (desc) children.push(bodyPara(desc));
      });
    }

    // -- Certifications ----------------------------------------------------------------------
    if (showCertifications && certifications.length > 0) {
      children.push(sectionHeading('Certifications'));
      certifications.forEach((cert) => {
        const name = cleanText(cert.name);
        const issuer = cleanText(cert.issuer);
        const date = cleanText(cert.date);
        const meta = [issuer, date].filter(Boolean).join('  \u00b7  ');
        const certRuns = [];
        if (name) certRuns.push(run(name, { bold: true, size: 21, color: INK }));
        if (meta) certRuns.push(run(`  \u2014  ${meta}`, { size: 20, color: GRAY }));
        if (certRuns.length > 0) {
          children.push(new Paragraph({ children: certRuns, spacing: { after: 80 } }));
        }
      });
    }

    // -- References ----------------------------------------------------------------------
    if (showReferences && references.length > 0) {
      children.push(sectionHeading('References'));
      references.forEach((ref) => {
        const name = cleanText(ref.name);
        const title = cleanText(ref.title);
        const company = cleanText(ref.company);
        const contact = cleanText(ref.contact);
        const detail = [title, company].filter(Boolean).join(', ');
        const refRuns = [];
        if (name) refRuns.push(run(name, { bold: true, size: 21, color: INK }));
        if (detail) refRuns.push(run(`  \u2014  ${detail}`, { size: 20, color: INK }));
        if (contact) refRuns.push(run(`  \u00b7  ${contact}`, { italics: true, size: 19, color: GRAY }));
        if (refRuns.length > 0) {
          children.push(new Paragraph({ children: refRuns, spacing: { after: 80 } }));
        }
      });
    }

    // -- Custom sections ----------------------------------------------------------------------
    customSections.forEach((section) => {
      const title = cleanText(section.title);
      const items = Array.isArray(section.items) ? section.items : [];
      if (!title && items.length === 0) return;
      if (title) children.push(sectionHeading(title));
      items.forEach((item) => {
        const itemTitle = cleanText(item.title);
        const subtitle = cleanText(item.subtitle);
        const date = cleanText(item.date);
        const desc = cleanText(item.description);
        const itemRuns = [];
        if (itemTitle) itemRuns.push(run(itemTitle, { bold: true, size: 22, color: INK }));
        if (subtitle) itemRuns.push(run(`, ${subtitle}`, { italics: true, size: 20, color: INK }));
        if (date) {
          itemRuns.push(run('\t', { size: 22 }));
          itemRuns.push(run(date, { italics: true, size: 19, color: GRAY }));
        }
        if (itemRuns.length > 0) {
          children.push(
            new Paragraph({
              children: itemRuns,
              tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
              spacing: { before: 140, after: desc ? 40 : 60 },
            })
          );
        }
        if (desc) children.push(bodyPara(desc));
      });
    });

    const doc = new Document({
      creator: 'Cvyon',
      title: fullName ? `${fullName} Resume` : 'Resume',
      description: 'Resume generated with Cvyon \u2014 free resume builder',
      styles: {
        default: {
          document: {
            run: { font: 'Calibri', size: 20, color: INK },
            paragraph: { spacing: { line: 276 } },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1008, bottom: 1008, left: 1008, right: 1008 },
            },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return docxResponse(buffer, fullName, jobTitle);
  } catch (error: any) {
    return apiError('docx', error);
  }
}
