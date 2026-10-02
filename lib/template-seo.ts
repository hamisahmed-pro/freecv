// SEO data for per-template landing pages (app/templates/[slug]).
// Each entry describes one resume template from components/html_templates.
// Copy is hand-written per template from the actual component code —
// no lorem ipsum, no invented metrics, no placeholder claims.

export interface TemplateSeoEntry {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  bestFor: string[];
  designTraits: string[];
  atsNotes: string;
  faqs: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
  /** Optional H1 override. When set, the template page renders this as the
   *  H1 instead of the default "{name} resume template". Used when the
   *  page's top Google query differs from the template name. */
  h1?: string;
}

export const templateSeoEntries: TemplateSeoEntry[] = [
  {
    id: "Noir",
    slug: "noir",
    name: "Noir",
    tagline: "A dramatic dark-mode resume for people who want to be remembered.",
    description:
      "Noir inverts the usual resume: a near-black page with light text, an editorial header, and a single colored accent rule for contrast. The sections use magazine-style labels — Profile, Experience, Education, Skills, Projects, Certifications, References — arranged in one calm column with no photo.",
    bestFor: [
      "designers and art directors",
      "photographers and videographers",
      "creative directors",
      "portfolio-led creative roles",
      "direct applications and email submissions",
    ],
    designTraits: [
      "dark near-black page background with light text",
      "editorial header with a single accent rule",
      "magazine-style section labels",
      "single-column layout with no photo",
      "one restrained accent color against monochrome",
    ],
    atsNotes:
      "Honest assessment: Noir is the least ATS-safe template in this collection. Dark backgrounds can confuse some parsers and print poorly on office printers, so it is best for direct applications, email attachments and portfolio submissions where a human opens the file — not for uploading into large corporate applicant tracking systems. All text is real and selectable, so nothing is hidden, but parsing order and color contrast are not guaranteed in every system.",
    faqs: [
      {
        q: "Will Noir work if I upload it to a job portal?",
        a: "It will upload fine, but automated parsing of dark-background PDFs is less reliable than with a plain template. For portals, pair it with ParsePerfect, or submit Noir directly to the hiring manager by email.",
      },
      {
        q: "Will it print well?",
        a: "Not on a standard office printer — a black background eats toner and can look muddy. Noir is a screen-first template.",
      },
      {
        q: "Who is it really for?",
        a: "Creatives whose work is the application: designers, photographers, art directors. The dark canvas makes the resume itself part of the portfolio.",
      },
    ],
    metaTitle: "Noir Resume Template — Free, Dark & Bold | Cvyon",
    metaDescription:
      "Free Noir resume template: a striking dark-mode, editorial design. Best for designers and creatives applying directly — build yours in minutes.",
  },
  {
    id: "Nomad",
    slug: "nomad",
    name: "Nomad",
    tagline: "A remote-first resume that literally badges you as remote-ready.",
    description:
      "Nomad watches for remote signals: if your location or summary mentions remote work, a “Remote” badge appears under your name in the accent color. Skills get their own “Remote Stack” section rendered as clean tags, and the header keeps your photo, title and contact details in one confident row.",
    bestFor: [
      "remote software engineers",
      "digital marketers working remotely",
      "customer support specialists",
      "freelancers and contractors",
      "virtual assistants",
      "anyone targeting fully remote roles",
    ],
    designTraits: [
      "automatic “Remote” badge when remote work is mentioned",
      "“Remote Stack” tag-style skills section",
      "photo in the centered header",
      "single-column layout with a contact row",
      "themeable accent color (blue by default)",
    ],
    atsNotes:
      "Single column, standard section labels, real text throughout — parsers handle it cleanly. The “Remote” badge is plain text, not a graphic, so it is extracted like any other line. The tag-style skills are individual text elements, which most modern parsers read left to right without trouble.",
    faqs: [
      {
        q: "How does the Remote badge appear?",
        a: "If the word “remote” appears in your location field or summary, the template automatically adds a Remote line under your name. Leave it out and the badge stays hidden.",
      },
      {
        q: "Is it only for remote jobs?",
        a: "It shines for remote applications, but the layout works for any role — just skip the remote wording and the badge disappears.",
      },
      {
        q: "Will the badge help with keyword searches?",
        a: "It cannot hurt: “remote” appears as real text on the page, which is exactly what recruiter searches look for.",
      },
    ],
    metaTitle: "Nomad Resume Template — Free Remote-Work CV | Cvyon",
    metaDescription:
      "Free Nomad resume template: a remote-first design with an automatic Remote badge and Remote Stack skills. Ideal for remote job seekers.",
  },
  {
    id: "Pivot",
    slug: "pivot",
    name: "Pivot",
    tagline: "Skills first, history second — the resume for career changers.",
    description:
      "Pivot leads with what you can do, not where you have been. Your skills are automatically grouped into three labeled clusters — Technical, Leadership and Domain — displayed side by side, so transferable strengths reach the reader before your work history. Only then does “Work History” appear, followed by education, projects and certifications.",
    bestFor: [
      "career changers",
      "professionals returning after a break",
      "military veterans entering civilian work",
      "bootcamp graduates",
      "consultants reframing experience",
      "internal role switchers",
    ],
    designTraits: [
      "skills-first layout with three labeled clusters (Technical, Leadership, Domain)",
      "work history placed after competencies",
      "single-column flow",
      "underlined section titles in the accent color",
      "clean, uncluttered spacing",
    ],
    atsNotes:
      "Single-column reading order with standard labels keeps parsing straightforward. One thing to know: your skills are visually grouped into three clusters, and some parsers may read them column by column rather than in your original list order — the words are all captured, just possibly out of sequence. For maximum keyword matching, keep the skill names themselves simple and standard.",
    faqs: [
      {
        q: "How are the three skill clusters decided?",
        a: "Your skills are split evenly into the Technical, Leadership and Domain groups in the order you list them, so put your most relevant skills first to land them in the right cluster.",
      },
      {
        q: "Will recruiters miss my job titles?",
        a: "No — Work History is still there with full details. It simply comes after your competencies, which is the right emphasis when your past titles do not match your target role.",
      },
      {
        q: "Is Pivot good for a complete industry switch?",
        a: "That is exactly its purpose: the competency-first structure lets a hiring manager see your transferable value before noticing the unfamiliar job titles.",
      },
    ],
    metaTitle: "Pivot Resume Template — Free Career-Change CV | Cvyon",
    metaDescription:
      "Free Pivot resume template: a skills-first design with clustered competencies for career changers. Reframe your experience with confidence.",
  },
  {
    id: "Polyglot",
    slug: "polyglot",
    name: "Polyglot",
    tagline: "A spacious, reader-friendly single column with room to breathe.",
    description:
      "Polyglot is the human-reader counterpart to ParsePerfect: the same honest single-column structure, but with a larger name, softer grays, generous whitespace and section headings in your accent color with underline rules. Skills appear as outlined tag pills that are easy to scan without looking busy.",
    bestFor: [
      "international applicants",
      "customer-facing roles",
      "project managers",
      "analysts and researchers",
      "nonprofit and NGO roles",
      "anyone who wants warmth without clutter",
    ],
    designTraits: [
      "spacious single-column layout",
      "large name with soft gray tones",
      "accent-colored underlined section headings",
      "skills as outlined tag pills",
      "generous whitespace and line spacing",
    ],
    atsNotes:
      "One column, real text, standard headings — parsing is clean. The outlined skill tags are text in bordered boxes, which modern parsers extract without issue. There is no photo, no iconography and no multi-column content, so it is a safe all-rounder for portals while remaining pleasant for human readers.",
    faqs: [
      {
        q: "How is Polyglot different from ParsePerfect?",
        a: "ParsePerfect is stripped to the bone for maximum parser safety; Polyglot keeps the same single-column structure but adds breathing room, color accents and tag-style skills for a friendlier read.",
      },
      {
        q: "Is it good for applications abroad?",
        a: "Yes — the clean, uncluttered layout travels well across hiring cultures, and there is no photo slot, which many European and North American employers prefer.",
      },
      {
        q: "Does the extra whitespace waste space?",
        a: "It uses space deliberately: the airy layout makes a dense career easy to scan, which is an advantage when a recruiter spends seconds on the first pass.",
      },
    ],
    metaTitle: "Polyglot Resume Template — Free, ATS-Friendly | Cvyon",
    metaDescription:
      "Free Polyglot resume template: a spacious single-column design with tag-style skills. A safe, readable choice for portals and humans alike.",
  },
  {
    id: "Portrait",
    slug: "portrait",
    name: "Portrait",
    tagline: "A photo-forward sidebar resume with a confident left rail.",
    description:
      "Portrait gives your photo pride of place in a left rail alongside your contact details, skills and education, while the main column carries your name, title, profile and experience. It reads like a speaker bio page — personal, polished and easy to skim.",
    bestFor: [
      "actors, models and performers",
      "hospitality and front-of-house roles",
      "real estate agents",
      "sales professionals",
      "personal trainers and coaches",
      "client-facing roles where a photo is expected",
    ],
    designTraits: [
      "left sidebar rail with photo, contact, skills and education",
      "main column for name, title, profile and experience",
      "section titles in the accent color",
      "photo-first layout",
      "two-column structure with a narrow rail",
    ],
    atsNotes:
      "Be aware that the two-column sidebar layout is harder for some applicant tracking systems to parse in the right order — sidebar content can be read out of sequence. Portrait is ideal for direct applications and email submissions where a person reads it; for job portals, choose a single-column template like ParsePerfect or Polyglot. The photo itself is an image file, so it is invisible to parsers by design.",
    faqs: [
      {
        q: "Is a photo on a resume a good idea?",
        a: "It depends on your market: expected in hospitality, real estate and entertainment in many countries, discouraged in US corporate hiring. Use Portrait where photos are the norm.",
      },
      {
        q: "What if I do not upload a photo?",
        a: "The rail still works — contact, skills and education fill the space — but the template's signature look is photo-led, so consider Showcase's subtler layout instead.",
      },
      {
        q: "Will the sidebar confuse recruiters?",
        a: "No — humans read sidebars naturally. The caution is only about automated parsers, which is why we recommend it for direct applications.",
      },
    ],
    metaTitle: "Portrait Resume Template — Free Photo CV | Cvyon",
    metaDescription:
      "Free Portrait resume template: a photo-forward sidebar design for client-facing roles. Ideal for real estate, hospitality and sales.",
  },
  {
    id: "Rainmaker",
    slug: "rainmaker",
    name: "Rainmaker",
    tagline: "A metrics-forward resume for closers who sell on numbers.",
    description:
      "Rainmaker is built for salespeople: your summary becomes a “Track Record” callout with an accent border, section titles render as bold colored chips, and every bullet gets a hanging indent with a marker that draws the eye down the line — perfect for quota figures and revenue lines. Experience, Core Competencies, Projects, Certifications, Education and References follow in a single confident column, with an optional photo up top.",
    bestFor: [
      "account executives and sales reps",
      "business development managers",
      "real estate agents",
      "recruiters",
      "insurance and financial advisors",
      "any quota-carrying role",
    ],
    designTraits: [
      "“Track Record” summary callout with accent border",
      "section titles as colored label chips",
      "hanging-indent bullets with accent markers",
      "optional photo in the header",
      "single-column, high-contrast layout",
    ],
    atsNotes:
      "The reading order is a clean single column with standard section labels, so the text parses well. The colored label chips and bullet markers are decorative — your words are all real text. Write your metrics as plain numbers in the bullet text (for example, “Exceeded quota by 132%”) rather than relying on any visual, and parsers will capture them exactly.",
    faqs: [
      {
        q: "How should I write my numbers in this template?",
        a: "As plain text inside your bullets — revenue, quota attainment, pipeline size. The template's job is to make those lines visually prominent; the figures themselves should read naturally in a sentence.",
      },
      {
        q: "Is it too aggressive for non-sales roles?",
        a: "The design language is sales-coded. For account management or customer success it still works; for engineering or finance, pick something quieter.",
      },
      {
        q: "Does the photo help or hurt?",
        a: "It is optional and common in fields like real estate and insurance. In markets where photos are discouraged, simply leave it out — the layout stands on its own.",
      },
    ],
    metaTitle: "Rainmaker Resume Template — Free Sales CV | Cvyon",
    metaDescription:
      "Free Rainmaker resume template: a metrics-forward sales design with a Track Record callout. Built for closers who sell on numbers.",
  },
  {
    id: "Reentry",
    slug: "reentry",
    name: "Reentry",
    tagline: "A narrative-first resume for professionals coming back.",
    description:
      "Reentry is designed for the return: your Profile section leads the page with an accent rule beneath it, telling your story before any dates appear. A “Strengths” section of soft pill tags follows, then Experience, Projects, and a combined “Education & Certifications” section that showcases fresh upskilling. Warm neutrals keep the tone encouraging, never apologetic.",
    bestFor: [
      "parents returning to work",
      "caregivers re-entering the workforce",
      "professionals after a sabbatical",
      "career restarters",
      "freelancers going permanent",
      "anyone with an employment gap to own confidently",
    ],
    designTraits: [
      "Profile section leads before experience, with accent rule",
      "“Strengths” pill-tag skills section",
      "combined “Education & Certifications” section",
      "warm neutral palette",
      "optional photo in the header",
    ],
    atsNotes:
      "Single column, standard-enough headings and real text throughout — parsers cope well. Two labels to be aware of: “Strengths” is usually mapped to Skills by most systems, and the combined “Education & Certifications” heading is slightly non-standard but still contains the keywords parsers look for. Nothing is hidden in graphics.",
    faqs: [
      {
        q: "How do I address my career gap in this template?",
        a: "Use the leading Profile section to state your return directly and positively — one or two sentences on what you bring now. The layout puts that story ahead of your dates on purpose.",
      },
      {
        q: "Should I list freelance or volunteer work during the gap?",
        a: "Yes — put it in Experience or Projects. Reentry's structure treats all relevant work equally, which is exactly the point.",
      },
      {
        q: "Will recruiters see the gap as a weakness?",
        a: "A confident, well-framed return reads as maturity, not weakness. The Profile-first layout helps you control that narrative from the first line.",
      },
    ],
    metaTitle: "Reentry Resume Template — Free Return-to-Work CV | Cvyon",
    metaDescription:
      "Free Reentry resume template: a narrative-first design for professionals returning to work. Lead with your story, not your dates.",
  },
  {
    id: "Showcase",
    slug: "showcase",
    name: "Showcase",
    tagline: "Work first, biography second — a portfolio-led resume.",
    description:
      "Showcase flips the conventional order: “Selected Work” — your projects — comes before your profile, because for portfolio careers the work is the argument. A right-aligned photo, a full-width accent bar and dash-marked labels give it a gallery feel, while experience, skills, education and the rest follow in a single column.",
    bestFor: [
      "UI/UX and product designers",
      "software developers",
      "writers and content creators",
      "photographers",
      "architects",
      "portfolio-driven applicants",
    ],
    designTraits: [
      "projects (“Selected Work”) placed before the profile",
      "photo right-aligned in the header",
      "full-width accent bar divider",
      "dash-marked section labels",
      "single-column body",
    ],
    atsNotes:
      "Single column with real text, so parsing is straightforward — but note the unusual section order: some older systems expect Experience before Projects, and here Projects lead. The content is all captured; only the sequence differs. For strict portal applications where order matters, consider a conventional template and link your portfolio in the header instead.",
    faqs: [
      {
        q: "Should projects really come before my experience?",
        a: "If your strongest proof is what you built rather than where you worked — yes. Hiring managers for design and dev roles often look at work samples first.",
      },
      {
        q: "How do I link my portfolio?",
        a: "Put your portfolio URL in the website field so it appears in the header, and add live links to individual projects in their descriptions.",
      },
      {
        q: "Is the photo required?",
        a: "No — it sits right-aligned in the header and is entirely optional. The layout works with or without it.",
      },
    ],
    metaTitle: "Showcase Resume Template — Free Portfolio CV | Cvyon",
    metaDescription:
      "Free Showcase resume template: a portfolio-led design with Selected Work first. Ideal for designers, developers and creatives.",
  },
  {
    id: "Sovereign",
    slug: "sovereign",
    name: "Sovereign",
    tagline: "An executive two-column resume with boardroom presence.",
    description:
      "Sovereign speaks the language of senior leadership: your summary becomes an “Executive Summary”, experience becomes “Professional Experience”, and projects become “Key Engagements”. The main column carries the narrative while a side rail holds Contact, Capabilities, Education and Certifications — and the header adapts, showing your photo or a centered name block.",
    bestFor: [
      "C-suite and VP candidates",
      "directors and senior managers",
      "management consultants",
      "board and advisory roles",
      "senior public-sector leaders",
      "executives in finance and industry",
    ],
    designTraits: [
      "two-column layout: narrative main column plus side rail",
      "executive vocabulary: “Executive Summary”, “Key Engagements”, “Capabilities”",
      "header adapts to photo or centered name block",
      "underlined accent section headings",
      "restrained, formal spacing",
    ],
    atsNotes:
      "The two-column layout is the trade-off here: it looks authoritative to a human reader, but some applicant tracking systems read sidebars out of order. Sovereign is best for executive search, referrals and direct applications. If you are applying through a portal, export a single-column version (ParsePerfect or Polyglot) for the upload and send Sovereign to the human.",
    faqs: [
      {
        q: "Is two columns okay for executive resumes?",
        a: "For human readers — recruiters, boards, search firms — yes, it is standard. For automated portals, keep a single-column backup.",
      },
      {
        q: "What goes in “Key Engagements”?",
        a: "Board roles, major transformations, flagship client work — the projects section renamed for senior scope. Treat it as your highlight reel.",
      },
      {
        q: "Should executives include a photo?",
        a: "Sovereign supports both: upload one for markets where it is expected, or leave it out for the centered name block where it is not.",
      },
    ],
    metaTitle: "Sovereign Resume Template — Free Executive CV | Cvyon",
    metaDescription:
      "Free Sovereign resume template: an executive two-column design with an Executive Summary. Built for directors, VPs and C-suite candidates.",
  },
  {
    id: "Timeline",
    slug: "timeline",
    name: "Timeline",
    tagline: "Your career as a visual timeline, with a rail through every role.",
    description:
      "Timeline draws a vertical accent rail down your experience section, marking each role with a dot and setting its dates in the accent color — your career progression becomes visible at a glance. A centered header with an optional photo ring opens the page, followed by Summary, Experience, Education, Skills, Projects, Certifications and References in one column.",
    bestFor: [
      "professionals with steady progression",
      "project managers",
      "consultants",
      "operations leaders",
      "anyone with a clear upward trajectory",
      "visual thinkers",
    ],
    designTraits: [
      "vertical timeline rail with dots through experience",
      "dates set in the accent color",
      "centered header with optional photo ring",
      "single-column section flow",
      "themeable accent color (blue by default)",
    ],
    atsNotes:
      "The rail and dots are pure decoration — the text reads as a normal single column, which parsers handle well. Dates are real text in the accent color, not graphics. The one visual element to know about is the rail itself; it carries no information, so nothing is lost if a parser ignores it.",
    faqs: [
      {
        q: "Does the timeline hide employment gaps?",
        a: "No — and it should not. The rail makes chronology visible, which rewards steady progression. If you have gaps to reframe, Reentry or Pivot suit you better.",
      },
      {
        q: "What if I only have one or two roles?",
        a: "The timeline still works, but its impact grows with more entries. With a short history, consider Modern Gradient or Polyglot.",
      },
      {
        q: "Can I change the rail color?",
        a: "Yes — the rail, dots and dates all follow your Cvyon theme accent color.",
      },
    ],
    metaTitle: "Timeline Resume Template — Free, ATS-Friendly | Cvyon",
    metaDescription:
      "Free Timeline resume template: a visual career timeline with an accent rail. Ideal for professionals with steady, upward progression.",
  },
  {
    id: "Valor",
    slug: "valor",
    name: "Valor",
    tagline: "A disciplined resume that translates military service for civilian hiring.",
    description:
      "Valor was made for veterans: your experience section is titled “Service Record”, skills become a “Transferable Skills” grid, and award-style markers keep achievements crisp. A double rule under the header — thick black over a thin accent line — gives it a formal, ceremonial feel, with an optional photo and zero gimmicks.",
    bestFor: [
      "military veterans",
      "service leavers",
      "reservists",
      "defense contractors",
      "law enforcement and security",
      "anyone translating service into civilian roles",
    ],
    designTraits: [
      "“Service Record” and “Transferable Skills” section labels",
      "double-rule header (thick black plus thin accent)",
      "award-style achievement markers",
      "optional photo",
      "formal single-column layout, no gimmicks",
    ],
    atsNotes:
      "Single column, real text, no graphics — parsing is clean. The distinctive labels are worth knowing about: “Service Record” contains your employment history and “Transferable Skills” your skills, which human readers in veteran-friendly programs understand immediately; fully automated keyword scans looking for the literal heading “Work Experience” are the only edge case, and most modern parsers match on content too.",
    faqs: [
      {
        q: "How do I translate my military role titles?",
        a: "Use the Service Record entries to pair each service role with its civilian equivalent in plain language — the template's formal tone supports that translation.",
      },
      {
        q: "Should I list awards and commendations?",
        a: "Yes — the award markers are designed for exactly that. Keep them concise and translate any jargon.",
      },
      {
        q: "Is Valor only for military veterans?",
        a: "It was designed for them, but the disciplined, formal style also suits law enforcement, security and emergency-services backgrounds.",
      },
    ],
    metaTitle: "Valor Resume Template — Free Veteran CV | Cvyon",
    metaDescription:
      "Free Valor resume template: a disciplined design with Service Record and Transferable Skills sections. Built for veterans entering civilian work.",
  },
  {
    id: "Vivid",
    slug: "vivid",
    name: "Vivid",
    tagline: "A full-color header block that makes your name impossible to miss.",
    description:
      "Vivid opens with a full-bleed colored header block — your photo, name, title and contact line in white on your accent color — then drops into a two-column body: Profile, Experience and Projects in the main column, Skills, Education and Certifications in the side column, with References to close. It is the boldest layout in the collection.",
    bestFor: [
      "marketers and brand professionals",
      "designers",
      "event planners",
      "media and entertainment",
      "startup generalists",
      "anyone who wants maximum visual impact",
    ],
    designTraits: [
      "full-bleed colored header block with photo",
      "white-on-accent name and contact line",
      "two-column body: main narrative plus side rail",
      "accent-colored company names",
      "bold, high-saturation first impression",
    ],
    atsNotes:
      "The two-column body is the trade-off: striking for humans, but side-rail content can be read out of order by older applicant tracking systems. The header block is a solid color with real white text — not an image — so your name and contact details extract normally. Use Vivid for direct applications and keep a single-column alternative for strict portals.",
    faqs: [
      {
        q: "Is Vivid too loud for corporate roles?",
        a: "For conservative industries, yes — choose Sovereign or Swiss Minimal. For creative, marketing and startup roles, the boldness is the point.",
      },
      {
        q: "Can I tone down the header color?",
        a: "Yes — the accent follows your Cvyon theme, so a deep navy or charcoal keeps the structure while quieting the impact.",
      },
      {
        q: "Does the colored header affect ATS parsing?",
        a: "No — it is a solid color fill behind real text, not an image. Your name and contact details parse normally.",
      },
    ],
    metaTitle: "Vivid Resume Template — Free, Bold & Colorful | Cvyon",
    metaDescription:
      "Free Vivid resume template: a bold full-color header block with a two-column body. Maximum visual impact for creatives and marketers.",
  },
  {
    id: "Summit",
    slug: "summit",
    name: "Summit",
    tagline: "A commanding dark header band over a clean, readable body.",
    description:
      "Summit opens with a full-width dark header block carrying your name in large white type, your title, and a single contact line — then drops into a bright, airy body where every section starts with a theme-colored left border. The contrast gives your name real presence on the page while keeping the reading experience effortless for recruiters and ATS parsers alike.",
    bestFor: [
      "Managers and team leads",
      "Sales and business development professionals",
      "Operations and project managers",
      "Consultants",
      "Anyone who wants a strong first impression without a dark full-page design",
    ],
    designTraits: [
      "Full-width dark header band with reversed white name type",
      "Theme-color accent bar under the header",
      "Left-bordered section headers in the accent color",
      "Skills as wrapped pill tags",
      "Single-column body for clean ATS parsing",
    ],
    atsNotes:
      "The header is a solid color fill behind real text, not an image, so your name and contact details parse normally. The single-column body with standard section headings keeps parsing straightforward.",
    faqs: [
      {
        q: "Can I change the dark header color?",
        a: "The header uses a deep charcoal base with your Cvyon theme color as the accent bar, so picking a navy or forest theme shifts the accent while the header stays commanding.",
      },
      {
        q: "Does the dark header affect ATS parsing?",
        a: "No — it is a solid fill behind real selectable text, not an image. Parsers read your name and contact line normally.",
      },
      {
        q: "Is Summit good for senior roles?",
        a: "Yes. The strong header reads as confident and executive, while the clean body keeps long experience histories scannable.",
      },
    ],
    metaTitle: "Summit Resume Template — Free Dark Header CV | Cvyon",
    metaDescription:
      "Free Summit resume template: a bold dark header band with your name in white over a clean single-column body. Confident, readable, ATS-friendly.",
  },
  {
    id: "Gauge",
    slug: "gauge",
    name: "Gauge",
    tagline: "A sidebar resume with visual skill proficiency bars.",
    description:
      "Gauge pairs a theme-colored sidebar with a crisp white main column. Your contact details, skills — each with a horizontal proficiency bar — and extra sections live in the sidebar, while your summary, experience, and education get the full width they deserve on the right. It is the classic two-column resume done with discipline: dense where it should be, spacious where it counts.",
    bestFor: [
      "Software developers and engineers",
      "Designers with tool-heavy skill sets",
      "Data analysts",
      "IT professionals",
      "Anyone with a long skills inventory to show off",
    ],
    designTraits: [
      "Theme-colored left sidebar with white text",
      "Horizontal skill proficiency bars",
      "Circular initial avatar mark",
      "Wide right column for experience and education",
      "Custom sections supported in the sidebar",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep your most critical keywords (job titles, employers) in the main column, and export a PDF to check the reading order. The text itself is fully selectable and real.",
    faqs: [
      {
        q: "How are the skill bar levels determined?",
        a: "The bars give each skill a visual weight so recruiters can scan your strengths at a glance. Order your skills with the strongest first for the best effect.",
      },
      {
        q: "Will the sidebar confuse applicant tracking systems?",
        a: "Modern parsers handle two-column resumes well, and all text is real and selectable. If a portal is very old, the single-column templates are the safest fallback.",
      },
      {
        q: "Can I add more sections to the sidebar?",
        a: "Yes — custom sections you add in the builder appear in the sidebar, keeping the main column focused on experience.",
      },
    ],
    metaTitle: "Gauge Resume Template — Free Sidebar CV with Skill Bars | Cvyon",
    metaDescription:
      "Free Gauge resume template: a theme-colored sidebar with skill proficiency bars beside a clean main column. Perfect for developers and designers.",
  },
  {
    id: "Rail",
    slug: "rail",
    name: "Rail",
    tagline: "A thin accent rail with a timeline experience section.",
    description:
      "Rail is minimalism with a spine: a slim theme-colored bar runs down the left edge of the page while your experience unfolds as a dot timeline — each role anchored to the rail with a marker, dates, and clean bullets. Your name sits huge at the top with wide letter-spaced section titles. It reads as calm and confident, with just enough structure to guide the eye down your career story.",
    bestFor: [
      "Professionals with a clear career progression",
      "Project managers",
      "Academics and researchers",
      "Marketing professionals",
      "Minimalists who want one distinctive visual idea",
    ],
    designTraits: [
      "Slim vertical accent rail on the left edge",
      "Experience rendered as a dot timeline",
      "Oversized name with generous whitespace",
      "Letter-spaced uppercase section titles",
      "Single-column layout throughout",
    ],
    atsNotes:
      "Fully single-column with standard headings, so parsing is clean. The timeline dots are pure decoration — dates sit in text next to each role, exactly where parsers expect them.",
    faqs: [
      {
        q: "Does the timeline format hurt ATS parsing?",
        a: "No. The dots are decorative CSS; every role, company, and date is plain text in a normal single-column flow.",
      },
      {
        q: "Is Rail good for long work histories?",
        a: "Yes — the timeline structure actually helps long histories stay scannable, since each role is visually separated along the rail.",
      },
      {
        q: "Can I change the rail color?",
        a: "Yes, the rail follows your Cvyon theme color, so it adapts to any accent you choose.",
      },
    ],
    metaTitle: "Rail Resume Template — Free Timeline CV | Cvyon",
    metaDescription:
      "Free Rail resume template: a slim accent rail with your experience as a clean dot timeline. Minimal, elegant, and ATS-friendly.",
  },
  {
    id: "Chevron",
    slug: "chevron",
    name: "Chevron",
    tagline: "Geometric ribbon headers with block skill ratings.",
    description:
      "Chevron gives every section a ribbon-style header — a theme-colored chevron marker carrying the section title in white — so the page has a rhythmic, engineered feel from top to bottom. Skills get a five-segment block rating instead of plain text, and the body stays a disciplined single column. It is professional with personality: structured enough for finance, distinctive enough for tech.",
    bestFor: [
      "Engineers and technical professionals",
      "Analysts and finance professionals",
      "IT and operations staff",
      "Consultants",
      "Candidates who want structure with a modern edge",
    ],
    designTraits: [
      "Chevron/ribbon section headers in the accent color",
      "Five-segment block skill ratings",
      "Single-column professional body",
      "Clean sans typography",
      "Strong repeated geometric motif",
    ],
    atsNotes:
      "Section titles are real text inside the ribbon shapes, so parsers read them normally. The block ratings are decorative; skill names are plain text alongside them.",
    faqs: [
      {
        q: "Do the ribbon headers confuse ATS software?",
        a: "No — the header text is real and selectable, and the words Experience, Education, and Skills are all present as normal text.",
      },
      {
        q: "What do the skill blocks mean?",
        a: "They are a visual rating from one to five segments, giving recruiters a quick read on your relative strengths. List your strongest skills first.",
      },
      {
        q: "Is Chevron too flashy for conservative industries?",
        a: "It reads as engineered rather than flashy — the geometry is disciplined, and the body is a classic single column. It works well in finance and consulting.",
      },
    ],
    metaTitle: "Chevron Resume Template — Free Geometric CV | Cvyon",
    metaDescription:
      "Free Chevron resume template: ribbon section headers and block skill ratings in a disciplined single column. Modern structure, professional feel.",
  },
  {
    id: "Glyph",
    slug: "glyph",
    name: "Glyph",
    tagline: "Airy icon-led minimalism with generous whitespace.",
    description:
      "Glyph lets small, elegant line icons do the talking: each section opens with a hand-drawn style icon, and your contact details sit in one centered row with tiny glyphs instead of labels. The layout is deliberately airy — abundant whitespace, minimal color, small bar meters for skills. Nothing shouts; everything is easy to find. It is the resume equivalent of a well-designed app screen.",
    bestFor: [
      "Designers and creatives",
      "Product managers",
      "Marketing professionals",
      "Tech workers who like clean interfaces",
      "Anyone whose resume needs to breathe",
    ],
    designTraits: [
      "Line icons for every section heading",
      "Single centered icon contact row",
      "Abundant whitespace, minimal color",
      "Small horizontal bar meters for skills",
      "Restrained accent color used sparingly",
    ],
    atsNotes:
      "The icons are decorative SVGs; all headings and contact details are real text. Single-column flow with standard section words keeps parsing clean.",
    faqs: [
      {
        q: "Will the icons break ATS parsing?",
        a: "No — icons are decorative and every heading and contact detail exists as real text. Parsers ignore the artwork and read the words.",
      },
      {
        q: "Is Glyph too minimal for experienced candidates?",
        a: "The whitespace is deliberate, not empty — multi-role histories fit fine, and the clean structure keeps long resumes scannable.",
      },
      {
        q: "Can I add more color?",
        a: "The design is intentionally restrained, but your theme color appears in section titles and skill meters — pick a bolder theme for more presence.",
      },
    ],
    metaTitle: "Glyph Resume Template — Free Minimal Icon CV | Cvyon",
    metaDescription:
      "Free Glyph resume template: airy icon-led minimalism with line icons, a centered contact row, and skill meters. Clean, modern, ATS-friendly.",
  },
  {
    id: "Triad",
    slug: "triad",
    name: "Triad",
    tagline: "Three calm color zones for instant scannability.",
    description:
      "Triad divides the page into three horizontal zones: a white header with your name and contact, a softly tinted band holding your summary and skill pills, and a white main zone for experience and education. The zoning does the organizing work — a recruiter's eye lands on exactly the right band in seconds — without a single heavy border or box. Small uppercase section headers in your theme color tie it together.",
    bestFor: [
      "Generalists and multi-disciplinary professionals",
      "Customer service and operations staff",
      "Administrators",
      "Recent graduates with internships to show",
      "Anyone who wants clear visual organization",
    ],
    designTraits: [
      "Three horizontal zones with subtle tinting",
      "Tinted summary + skills band",
      "Skill pills in the middle zone",
      "Small uppercase theme-colored headers",
      "Borderless, calm separation",
    ],
    atsNotes:
      "The zones are background tints behind real text in a single-column flow, so parsers read straight through. Standard section headings throughout.",
    faqs: [
      {
        q: "Do the background tints affect printing?",
        a: "The tint is very light (about 8% of your theme color), so it prints cleanly and never obscures text.",
      },
      {
        q: "Is Triad ATS-safe?",
        a: "Yes — single-column flow, real text, standard headings. The zoning is purely visual.",
      },
      {
        q: "Can I change the tint color?",
        a: "The tint derives from your Cvyon theme color, so changing the theme re-tints the band automatically.",
      },
    ],
    metaTitle: "Triad Resume Template — Free Color-Zoned CV | Cvyon",
    metaDescription:
      "Free Triad resume template: three subtle color zones organize your header, summary/skills, and experience. Calm, scannable, ATS-friendly.",
  },
  {
    id: "Mono",
    slug: "mono",
    name: "Mono",
    tagline: "A pure black-and-white typographic statement.",
    description:
      "Mono uses zero color — distinction comes entirely from type. Your name sets huge in serif, section titles pair serif headlines with a neutral sans body, and thick black rules separate each section. Skills run as a bold slash-separated inline list; dates align hard right. It is the most print-reliable template on Cvyon: no color to misprint, no graphics to pixelate, just typography doing all the work.",
    bestFor: [
      "Writers, editors, and journalists",
      "Lawyers and legal professionals",
      "Academics",
      "Executives in traditional industries",
      "Anyone applying through portals that mangle color",
    ],
    designTraits: [
      "Pure black, white, and gray — no color at all",
      "Oversized serif name and headings",
      "Thick black section rules",
      "Slash-separated inline skills list",
      "Right-aligned dates",
    ],
    atsNotes:
      "As clean as parsing gets: single column, black text, standard headings, no graphics, no color tricks. An excellent choice for the strictest ATS portals.",
    faqs: [
      {
        q: "Can I add color to Mono?",
        a: "Mono intentionally ignores the theme color — that is the point. If you want color, any of the other 50+ templates will oblige.",
      },
      {
        q: "Is black-and-white too plain?",
        a: "Plain is the strategy: the oversized type and heavy rules give it real presence, and it prints perfectly everywhere, every time.",
      },
      {
        q: "Is Mono good for creative roles?",
        a: "For writing, editing, and editorial design — absolutely. For visual design portfolios, a template with more color may show range better.",
      },
    ],
    metaTitle: "Mono Resume Template — Free Black & White CV | Cvyon",
    metaDescription:
      "Free Mono resume template: a pure black-and-white typographic statement with serif headlines and bold rules. Maximum print reliability, zero color risk.",
  },
  {
    id: "Ember",
    slug: "ember",
    name: "Ember",
    tagline: "Warm editorial styling with a terracotta soul.",
    description:
      "Ember has its own warm identity: terracotta section headings in serif italic, hairline rules between sections, and your summary set as a pull-quote with a terracotta left border. Skills appear as warm-tinted chips, and your contact details center beneath your name with middot separators. It reads like a magazine profile — soft, human, and memorable — while keeping every section exactly where recruiters expect it.",
    bestFor: [
      "Marketing and brand professionals",
      "Content creators and writers",
      "Hospitality and customer experience staff",
      "Nonprofit workers",
      "Creatives who want warmth without chaos",
    ],
    designTraits: [
      "Fixed terracotta accent with serif italic headings",
      "Pull-quote style summary",
      "Hairline rules between sections",
      "Warm-tinted skill chips",
      "Centered middot contact row",
    ],
    atsNotes:
      "Single-column layout with standard section words; the serif italic styling does not affect parsing. All text is real and selectable.",
    faqs: [
      {
        q: "Can I change the terracotta color?",
        a: "Ember keeps its fixed warm identity by design — the terracotta is part of the template's character. Other templates follow your theme color if you want control.",
      },
      {
        q: "Is the pull-quote summary ATS-safe?",
        a: "Yes — it is a normal paragraph with a decorative left border. Parsers read it as regular text.",
      },
      {
        q: "Is Ember professional enough for corporate roles?",
        a: "The structure is classic single-column; only the styling is warm. It suits brand, marketing, hospitality, and people-facing roles best.",
      },
    ],
    metaTitle: "Ember Resume Template — Free Warm Editorial CV | Cvyon",
    metaDescription:
      "Free Ember resume template: warm terracotta serif headings, pull-quote summary, and skill chips in an editorial single column. Human, memorable, ATS-friendly.",
  },
  {
    id: "Arsenal",
    slug: "arsenal",
    name: "Arsenal",
    tagline: "Skills-first layout built for career changers.",
    description:
      "Arsenal leads with what you can do, not where you have been. A Core Competencies grid of skill pills opens the resume, followed by Selected Achievements — every bullet from your experience, flattened into one punchy list — then a compact one-line-per-role Employment History and your education. It is the functional resume done right: built for career changers, generalists, and anyone whose skills outshine their job titles.",
    bestFor: [
      "Career changers",
      "Generalists and multi-skilled professionals",
      "Freelancers consolidating varied work",
      "Returners to the workforce",
      "Technical staff pivoting industries",
    ],
    designTraits: [
      "Core Competencies skill grid first",
      "Flattened achievements list from all roles",
      "One-line employment history",
      "Skills-led rather than chronology-led",
      "Clean single-column flow",
    ],
    atsNotes:
      "Functional layouts need care with parsers: Arsenal keeps company names and dates as real text in the employment history, and standard headings throughout. Include a chronological work history (it is there) so parsers can build your timeline.",
    faqs: [
      {
        q: "Is a skills-first resume risky for ATS?",
        a: "Pure functional resumes can be. Arsenal hedges: it leads with skills but still includes a real employment history with companies and dates, which is what parsers need.",
      },
      {
        q: "Who should use Arsenal?",
        a: "Career changers, freelancers, and generalists — anyone whose strongest story is competency, not a tidy chronological ladder.",
      },
      {
        q: "Where do my job bullets go?",
        a: "Every bullet from your experience entries is gathered into Selected Achievements automatically, so nothing you wrote is lost.",
      },
    ],
    metaTitle: "Arsenal Resume Template — Free Skills-First CV | Cvyon",
    metaDescription:
      "Free Arsenal resume template: a skills-first functional layout with a competencies grid, achievements list, and compact work history. Built for career changers.",
  },
  {
    id: "Density",
    slug: "density",
    name: "Density",
    tagline: "Maximum content on one page, engineered cleanly.",
    description:
      "Density is built for candidates with a lot to say: compact 11px type, tight disciplined spacing, a two-column header, skills in a three-column grid, and experience rows that fit role, company, and dates on single lines. The density comes from spacing discipline, not clutter — every section still breathes, and theme-colored headers with bottom borders keep the structure obvious. One page, everything on it, nothing cramped.",
    bestFor: [
      "Senior engineers with long skill lists",
      "Experienced professionals condensing 10+ years",
      "Technical specialists",
      "Consultants with many engagements",
      "Anyone told their resume must be one page",
    ],
    designTraits: [
      "Compact 11px type with tight spacing",
      "Two-column header (name left, contact right)",
      "Three-column skills grid",
      "Single-line role/company/date rows",
      "Theme-colored headers with bottom borders",
    ],
    atsNotes:
      "Single-column body with standard headings; the compact sizing does not affect parsing since all text remains real and selectable. Keep font sizes readable — Density already optimizes this for you.",
    faqs: [
      {
        q: "Will recruiters find small text hard to read?",
        a: "Density uses 11px body text — the same size many professional resumes use — with strong headers and spacing so nothing feels cramped.",
      },
      {
        q: "Can Density handle a very long work history?",
        a: "That is its purpose: single-line role rows and compact bullets fit far more per page than standard templates while staying clean.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column flow, real text, standard section headings throughout.",
      },
    ],
    metaTitle: "Density Resume Template — Free Compact One-Page CV | Cvyon",
    metaDescription:
      "Free Density resume template: a compact high-density one-pager with tight disciplined spacing. Fit more on one page without looking cramped.",
  },
  {
    id: "Chancellor",
    slug: "chancellor",
    name: "Chancellor",
    tagline: "Navy serif authority with a split header.",
    description:
      "Chancellor opens with a two-part header — your name in deep navy serif on the left, contact details stacked on the right — then organizes everything under theme-underlined section titles. Experience leads with the company name, which suits candidates whose employers carry weight. The navy-and-theme palette reads as institutional without feeling stiff.",
    bestFor: [
      "Senior managers and directors",
      "Consultants",
      "University administrators",
      "Nonprofit leaders",
      "Finance and insurance professionals",
    ],
    designTraits: [
      "Split header: name left, contact right",
      "Deep navy serif typography",
      "Theme-colored section underlines",
      "Company-first experience entries",
      "Two-column skills grid with accent bullets",
    ],
    atsNotes:
      "The two-part header is a single text flow, not a table, and the body is one column — parsing stays straightforward. Keep the contact stack in the standard order for best results.",
    faqs: [
      {
        q: "Why does experience lead with the company name?",
        a: "Chancellor assumes your employers strengthen your story. If your roles matter more than the brands, look for a role-first template instead.",
      },
      {
        q: "Can I change the navy color?",
        a: "Navy is the template's fixed institutional base; your Cvyon theme color controls the section underlines and accent bullets.",
      },
      {
        q: "Does the split header confuse applicant tracking systems?",
        a: "No — the header renders as ordinary text in reading order, and the single-column body uses standard headings.",
      },
    ],
    metaTitle: "Chancellor Resume Template — Free Navy Executive CV | Cvyon",
    metaDescription:
      "Free Chancellor resume template: navy serif authority with a split header and company-first experience. Built for managers, consultants, and administrators.",
  },
  {
    id: "Magistrate",
    slug: "magistrate",
    name: "Magistrate",
    tagline: "A curriculum-vitae formality with a date rail.",
    description:
      "Magistrate declares itself a curriculum vitae with a wide-tracked eyebrow, then sets your name in uppercase serif above an italic job title. Experience uses a dedicated left date column, so your chronology is visible at a glance before a single word is read. The all-black, decoration-free body is the resume equivalent of a well-cut suit.",
    bestFor: [
      "Legal professionals",
      "Judges and clerks",
      "Academics with long publication records",
      "Public sector and civil service applicants",
      "Senior professionals in traditional industries",
    ],
    designTraits: [
      "CURRICULUM VITAE eyebrow above the name",
      "Uppercase tracked serif name",
      "Dedicated left date column for experience",
      "Italic job title and company lines",
      "All-black body with zero decoration",
    ],
    atsNotes:
      "Outstanding for ATS: linear single-column flow, real text, standard headings, and dates in a consistent left column that parsers associate with each role cleanly.",
    faqs: [
      {
        q: "Is Magistrate suitable for non-legal roles?",
        a: "Its formality fits any traditional field — academia, government, banking — but it will feel stiff for creative or startup applications.",
      },
      {
        q: "Why are dates in their own column?",
        a: "The date rail lets recruiters scan your timeline vertically without reading a word — ideal for steady, progressive careers.",
      },
      {
        q: "Can I add color to Magistrate?",
        a: "The design is intentionally monochrome; the theme color appears only in small accents like project links.",
      },
    ],
    metaTitle: "Magistrate Resume Template — Free Formal CV Layout | Cvyon",
    metaDescription:
      "Free Magistrate resume template: curriculum-vitae formality with a date-rail experience layout. Made for legal, academic, and public-sector careers.",
  },
  {
    id: "Senate",
    slug: "senate",
    name: "Senate",
    tagline: "Heavyweight name, full-width theme rule.",
    description:
      "Senate leads with a black, tightly-tracked name and drives a full-width theme-colored rule straight underneath — a confident, modern-government feel. Section titles carry a short theme underline bar, and experience joins role and company on one bold line. It is assertive without ornament: every element earns its place.",
    bestFor: [
      "Directors and department heads",
      "Operations managers",
      "Government and policy professionals",
      "Program managers",
      "Professionals who want quiet confidence",
    ],
    designTraits: [
      "Heavy black name with tight tracking",
      "Full-width theme-colored rule under the header",
      "Section titles with short theme underline bars",
      "Role and company on one combined line",
      "Single-column body with generous spacing",
    ],
    atsNotes:
      "Single-column layout with standard headings and real text — the full-width rule is decorative CSS. Parses cleanly in modern and older systems alike.",
    faqs: [
      {
        q: "What does the full-width rule do for the design?",
        a: "It anchors the page and carries your theme color across the whole width, giving the resume a deliberate, finished feel.",
      },
      {
        q: "Can I soften the heavy name?",
        a: "The black weight is the template's signature. If you want something lighter, the minimalist family will suit you better.",
      },
      {
        q: "Is Senate ATS-friendly?",
        a: "Yes — one column, real text, conventional section headings, and no graphics or tables.",
      },
    ],
    metaTitle: "Senate Resume Template — Free Bold Professional CV | Cvyon",
    metaDescription:
      "Free Senate resume template: a heavyweight name over a full-width theme rule. Confident, modern formatting for directors and operations leaders.",
  },
  {
    id: "Covenant",
    slug: "covenant",
    name: "Covenant",
    tagline: "Your name in a bordered frame, pill section titles.",
    description:
      "Covenant frames your name inside a bordered box — a deliberate, seal-like opening — and labels each section with an outlined pill badge in your theme color. The centered profile paragraph reads like a statement of intent. It is a template for people who treat their career as a commitment, and want the design to say so.",
    bestFor: [
      "Mission-driven professionals",
      "Nonprofit and NGO applicants",
      "Education professionals",
      "Healthcare administrators",
      "Candidates who want a distinctive but serious look",
    ],
    designTraits: [
      "Name framed in a bordered box",
      "Outlined pill badges for section titles",
      "Centered profile statement",
      "Serif name with theme-colored job title",
      "Single-column structured body",
    ],
    atsNotes:
      "The framed name and pill badges are CSS borders around real text, so nothing is hidden from parsers. Single-column body with standard headings keeps parsing simple.",
    faqs: [
      {
        q: "Does the bordered name box affect ATS parsing?",
        a: "No — it is a border around ordinary text, not an image. Your name parses normally.",
      },
      {
        q: "What tone does Covenant strike?",
        a: "Deliberate and principled — it suits mission-driven fields better than fast-moving startups.",
      },
      {
        q: "Can I change the pill badge color?",
        a: "The badges use your Cvyon theme color automatically, so they follow whatever accent you pick.",
      },
    ],
    metaTitle: "Covenant Resume Template — Free Boxed-Header CV | Cvyon",
    metaDescription:
      "Free Covenant resume template: a framed name and pill section badges for a deliberate, principled look. Ideal for nonprofit, education, and healthcare careers.",
  },
  {
    id: "Paragon",
    slug: "paragon",
    name: "Paragon",
    tagline: "Split header with a vertical divider.",
    description:
      "Paragon divides its header with a slim vertical rule — name and title on the left, contact details on the right — creating a balanced, architectural first impression. Section titles are marked by small theme-colored bars, and experience leads with the company name for candidates whose employers speak first. Slate tones keep it cool and corporate.",
    bestFor: [
      "Corporate managers",
      "Analysts and strategists",
      "Banking and finance professionals",
      "Consultants",
      "Mid-career professionals in large organizations",
    ],
    designTraits: [
      "Header split by a vertical divider",
      "Theme-bar markers on section titles",
      "Company-first experience layout",
      "Slate corporate color palette",
      "Balanced two-zone header composition",
    ],
    atsNotes:
      "The split header renders in normal reading order and the body is a single column, so parsing is uncomplicated. All text is real and selectable.",
    faqs: [
      {
        q: "How does the vertical divider affect mobile viewing?",
        a: "The divider is a simple CSS rule that scales with the layout; on narrow screens the header stacks naturally.",
      },
      {
        q: "Why company-first experience?",
        a: "Paragon is tuned for corporate careers where the employer's name carries signal. Role-first alternatives exist in the collection if you prefer.",
      },
      {
        q: "Is the slate palette fixed?",
        a: "Slate is the base tone; your theme color drives the section bars, contact accents, and highlights.",
      },
    ],
    metaTitle: "Paragon Resume Template — Free Corporate Split-Header CV | Cvyon",
    metaDescription:
      "Free Paragon resume template: a vertically divided header and theme-bar section titles. A balanced corporate look for managers and analysts.",
  },
  {
    id: "Laurel",
    slug: "laurel",
    name: "Laurel",
    tagline: "Serif italics with forest-green grace.",
    description:
      "Laurel is the gentlest executive template: section titles set in centered serif italics, your job title framed by forest-green rules, and companies named in green italics under each role. The overall effect is cultivated and calm — prestige without stiffness, formality with warmth.",
    bestFor: [
      "Nonprofit executives",
      "Education leaders",
      "Arts and culture administrators",
      "Sustainability professionals",
      "Writers and editors",
    ],
    designTraits: [
      "Centered serif-italic section titles",
      "Forest-green accent system",
      "Job title framed by horizontal rules",
      "Italic green company names",
      "Soft, cultivated serif typography",
    ],
    atsNotes:
      "The italics and centered titles are styling on real text in a single column — parsers read it fine. Standard section headings keep the structure recognizable.",
    faqs: [
      {
        q: "Is Laurel too soft for corporate roles?",
        a: "Laurel shines in mission-driven and cultural fields. For hard corporate environments, choose a sharper template like Senate or Consul.",
      },
      {
        q: "Can I change the forest-green accents?",
        a: "Green is the template's signature base; your theme color tints the job title and interactive accents.",
      },
      {
        q: "Do italic section titles hurt ATS parsing?",
        a: "No — italics are a font style on real text, and the heading words themselves are standard.",
      },
    ],
    metaTitle: "Laurel Resume Template — Free Elegant Serif CV | Cvyon",
    metaDescription:
      "Free Laurel resume template: serif italics and forest-green accents for a cultivated, graceful look. Perfect for nonprofit, education, and arts leaders.",
  },
  {
    id: "Tribunal",
    slug: "tribunal",
    name: "Tribunal",
    tagline: "Numbered sections, monospace dates, total order.",
    description:
      "Tribunal organizes your career like a docket: every section carries a gray index number (01, 02, 03…), dates render in monospace, and the contact line sits under a clean top rule. Nothing is decorative for its own sake — the numbering gives long resumes a navigable structure that detail-oriented readers love.",
    bestFor: [
      "Legal and compliance professionals",
      "Auditors and accountants",
      "Policy analysts",
      "Project managers with complex histories",
      "Anyone with many sections to organize",
    ],
    designTraits: [
      "Numbered section headings",
      "Monospace date styling",
      "Contact strip under a top rule",
      "Strict black-and-gray palette",
      "Docket-like structural clarity",
    ],
    atsNotes:
      "Excellent parsing: linear layout, real text, and conventional headings. The section numbers are plain text prefixes that do not interfere with keyword extraction.",
    faqs: [
      {
        q: "Why are the sections numbered?",
        a: "Numbering gives multi-section resumes a clear order and helps interviewers reference parts of your background in conversation.",
      },
      {
        q: "Is the monospace date style readable?",
        a: "Yes — monospace digits align neatly, which actually makes timelines easier to scan than proportional figures.",
      },
      {
        q: "Does Tribunal work outside legal fields?",
        a: "Its orderliness suits any analytical or process-driven role: audit, compliance, operations, program management.",
      },
    ],
    metaTitle: "Tribunal Resume Template — Free Numbered-Section CV | Cvyon",
    metaDescription:
      "Free Tribunal resume template: numbered sections and monospace dates for total structural clarity. Built for legal, compliance, and analytical careers.",
  },
  {
    id: "Consul",
    slug: "consul",
    name: "Consul",
    tagline: "An oversized name that owns the page.",
    description:
      "Consul opens with your name at a commanding 5xl black weight — the largest in the executive family — followed by your title and contact on a single flowing baseline. Section titles sit under stark black underlines, and dates render in uppercase for a crisp, declarative rhythm. This is a template for people who do not need to ask for attention.",
    bestFor: [
      "Senior executives and founders",
      "Public speakers and thought leaders",
      "Sales leaders",
      "Candidates with strong personal brands",
      "Anyone targeting high-visibility roles",
    ],
    designTraits: [
      "Oversized 5xl black name",
      "Title and contact on one baseline",
      "Black-underlined section titles",
      "Uppercase date styling",
      "Declarative, high-contrast rhythm",
    ],
    atsNotes:
      "The large name is just a font size on real text. Single-column body and standard headings keep parsing clean; the uppercase dates are still plain text.",
    faqs: [
      {
        q: "Is the huge name unprofessional?",
        a: "At senior levels, a confident name is expected — Consul keeps everything else restrained so the scale reads as authority, not ego.",
      },
      {
        q: "Can I tone down the name size?",
        a: "The scale is the template's point. For a quieter executive look, try Regent or Senate.",
      },
      {
        q: "Will ATS handle the uppercase dates?",
        a: "Yes — case does not affect date parsing, and the dates remain ordinary text.",
      },
    ],
    metaTitle: "Consul Resume Template — Free Bold Executive CV | Cvyon",
    metaDescription:
      "Free Consul resume template: an oversized name and stark black underlines for maximum presence. Made for senior executives and high-visibility roles.",
  },
  {
    id: "Warden",
    slug: "warden",
    name: "Warden",
    tagline: "Contact card header with boxed section titles.",
    description:
      "Warden pairs your name with a bordered contact card on the right — like details kept on file — and boxes each section title in a thin slate frame. The result feels organized and custodial: everything in its place, everything accounted for. Slate tones keep it steady and trustworthy.",
    bestFor: [
      "Operations managers",
      "Facilities and administration professionals",
      "Logistics coordinators",
      "Office managers",
      "Professionals who prize order and reliability",
    ],
    designTraits: [
      "Bordered contact card in the header",
      "Boxed slate section titles",
      "Name-left, details-right composition",
      "Steady slate color system",
      "Methodical single-column body",
    ],
    atsNotes:
      "The contact card is a bordered box around real text in normal reading order. Single-column body with standard headings parses without issues.",
    faqs: [
      {
        q: "Does the contact card waste space?",
        a: "It occupies the header's right side where whitespace would otherwise sit, so the page stays efficient.",
      },
      {
        q: "What tone does Warden convey?",
        a: "Reliability and order — it tells the reader that details are handled, which suits operations and administration roles.",
      },
      {
        q: "Is Warden ATS-safe?",
        a: "Yes. The card is CSS styling around ordinary text, and the body is a plain single column.",
      },
    ],
    metaTitle: "Warden Resume Template — Free Structured Admin CV | Cvyon",
    metaDescription:
      "Free Warden resume template: a contact-card header and boxed section titles for an organized, trustworthy look. Ideal for operations and administration.",
  },
  {
    id: "Vector",
    slug: "vector",
    name: "Vector",
    tagline: "Icon-led sections with a theme-colored spine.",
    description:
      "Vector gives every section a small theme-colored glyph marker and runs your experience along a left theme border — a subtle spine that guides the eye downward. Skills appear as soft pills with accent icons. It is the most approachable template in the tech family: structured, but with personality.",
    bestFor: [
      "Marketers and growth professionals",
      "Product managers",
      "Customer success managers",
      "Junior to mid-level tech professionals",
      "Candidates who want warmth with structure",
    ],
    designTraits: [
      "Glyph markers on every section title",
      "Theme-colored left border on experience",
      "Pill-shaped skill tags with icons",
      "Clean sans-serif body",
      "Friendly but organized rhythm",
    ],
    atsNotes:
      "The glyphs are small decorative characters beside real text headings. The layout is single-column with standard headings, so parsing is unaffected.",
    faqs: [
      {
        q: "Do the icons hurt ATS parsing?",
        a: "No — they are decorative glyphs next to ordinary text headings, and the body is a plain single column.",
      },
      {
        q: "What makes Vector different from other tech templates?",
        a: "Its icon-led section titles and pill skills give it a friendlier, more designed feel than the plainer engineering templates.",
      },
      {
        q: "Can I change the glyph colors?",
        a: "They follow your Cvyon theme color automatically.",
      },
    ],
    metaTitle: "Vector Resume Template — Free Modern Tech CV | Cvyon",
    metaDescription:
      "Free Vector resume template: icon-led sections and pill skills with a theme-colored spine. A friendly, structured look for tech and product roles.",
  },
  {
    id: "Kernel",
    slug: "kernel",
    name: "Kernel",
    tagline: "A terminal-dark header for engineers.",
    description:
      "Kernel opens with a dark rounded block carrying your name in monospace — a nod to the terminal — while the body stays clean and readable in sans-serif. Section titles get monospace prefixes and dates render in mono, giving the whole document an engineer's precision without sacrificing recruiter readability.",
    bestFor: [
      "Software engineers",
      "DevOps and SRE professionals",
      "Data engineers",
      "System administrators",
      "Technical candidates who want subtle character",
    ],
    designTraits: [
      "Dark monospace header block",
      "Monospace section-title prefixes",
      "Monospace date styling",
      "Sans-serif readable body",
      "Terminal-inspired precision",
    ],
    atsNotes:
      "The dark header is a background fill behind real text. Body is single-column with standard headings; monospace styling does not affect parsing.",
    faqs: [
      {
        q: "Will the dark header confuse ATS?",
        a: "No — it is a solid fill behind real, selectable text. Parsers read your name and title normally.",
      },
      {
        q: "Is Kernel too niche for non-engineers?",
        a: "Its terminal flavor is aimed at technical roles. Non-technical candidates should pick a neutral template.",
      },
      {
        q: "Can I change the header color?",
        a: "The dark charcoal base is fixed for contrast; your theme color accents the section prefixes and highlights.",
      },
    ],
    metaTitle: "Kernel Resume Template — Free Developer CV | Cvyon",
    metaDescription:
      "Free Kernel resume template: a terminal-dark monospace header over a clean readable body. Built for software engineers and DevOps professionals.",
  },
  {
    id: "Pixel",
    slug: "pixel",
    name: "Pixel",
    tagline: "Card-based experience with a skill-meter rail.",
    description:
      "Pixel splits the page 70/30: experience lives in bordered cards on the left, while a soft-gray right rail carries skill meters, education, and extras. The card treatment gives each role its own contained space — ideal for candidates whose jobs each deserve a moment. It feels designed without feeling decorated.",
    bestFor: [
      "Designers and UX professionals",
      "Product managers",
      "Frontend developers",
      "Consultants with distinct engagements",
      "Mid-career professionals with varied roles",
    ],
    designTraits: [
      "Bordered cards for each experience entry",
      "70/30 split with a gray right rail",
      "Skill proficiency meters in the rail",
      "Contained, modular composition",
      "Modern sans-serif typography",
    ],
    atsNotes:
      "Two-column layouts need care: keep critical keywords and job titles in the main left column. All text is real and selectable, and modern parsers handle the split well.",
    faqs: [
      {
        q: "Do the cards waste vertical space?",
        a: "Cards add light padding per role, but the containment makes each position easier to scan — a fair trade for varied careers.",
      },
      {
        q: "How are skill meter levels set?",
        a: "Meters give visual weight to your ordering — list your strongest skills first for the best impression.",
      },
      {
        q: "Is the right rail ATS-safe?",
        a: "Modern parsers handle it, but keep your most important keywords in the main column as a precaution.",
      },
    ],
    metaTitle: "Pixel Resume Template — Free Card-Layout Tech CV | Cvyon",
    metaDescription:
      "Free Pixel resume template: card-based experience with a skill-meter sidebar. A modern modular look for designers, PMs, and developers.",
  },
  {
    id: "Syntax",
    slug: "syntax",
    name: "Syntax",
    tagline: "Monospace skill chips, theme-colored companies.",
    description:
      "Syntax is restraint with a technical accent: a clean single column where companies glow in your theme color and skills render as monospace chips. Nothing shouts — the code-editor flavor is in the details. It reads as the resume of someone who writes clean code and cleaner prose.",
    bestFor: [
      "Software developers",
      "Technical writers",
      "QA engineers",
      "Data analysts",
      "Students and recent CS graduates",
    ],
    designTraits: [
      "Monospace skill chips",
      "Theme-colored company names",
      "Minimal single-column layout",
      "Code-editor flavored details",
      "Quiet, precise typography",
    ],
    atsNotes:
      "One of the safest layouts for parsing: single column, real text, standard headings, monospace used only for small chips.",
    faqs: [
      {
        q: "Is Syntax too plain?",
        a: "Its plainness is the point — in technical hiring, clarity beats decoration, and the mono chips add just enough character.",
      },
      {
        q: "Can I add more visual interest?",
        a: "Your theme color drives the company names and chips; a bolder color choice adds energy without changing the layout.",
      },
      {
        q: "Is Syntax good for ATS?",
        a: "Excellent — single column, standard headings, no graphics, no tables.",
      },
    ],
    metaTitle: "Syntax Resume Template — Free Minimal Developer CV | Cvyon",
    metaDescription:
      "Free Syntax resume template: monospace skill chips and theme-colored companies in a clean single column. Minimal precision for developers.",
  },
  {
    id: "Framework",
    slug: "framework",
    name: "Framework",
    tagline: "A two-column grid body under a bordered header.",
    description:
      "Framework treats your resume like a well-structured app: a bordered header up top, then a two-column grid where summary and skills share the first row and experience spans below. Section titles carry theme-colored underlines. It packs a lot of information into an orderly system without ever feeling cramped.",
    bestFor: [
      "Consultants",
      "Project managers",
      "Business analysts",
      "Professionals with broad skill sets",
      "Candidates who need density with order",
    ],
    designTraits: [
      "Two-column grid body",
      "Summary and skills share the top row",
      "Full-width experience section below",
      "Theme-underlined section titles",
      "Bordered header band",
    ],
    atsNotes:
      "Grid layouts can challenge older parsers: keep job titles and employers in the main flow, and check the PDF reading order. All text is real and selectable.",
    faqs: [
      {
        q: "Does the grid confuse ATS software?",
        a: "Modern parsers handle it well since all text is real. For very old portals, a single-column template is the safest fallback.",
      },
      {
        q: "Why are summary and skills side by side?",
        a: "It puts your pitch and your toolkit in the recruiter's first glance — the two things that decide whether they keep reading.",
      },
      {
        q: "Can the grid handle long content?",
        a: "Yes — the experience section spans full width below, so long histories get the room they need.",
      },
    ],
    metaTitle: "Framework Resume Template — Free Grid-Layout CV | Cvyon",
    metaDescription:
      "Free Framework resume template: a two-column grid body that organizes summary, skills, and experience systematically. For consultants and analysts.",
  },
  {
    id: "Deploy",
    slug: "deploy",
    name: "Deploy",
    tagline: "An availability badge for people ready to ship.",
    description:
      "Deploy signals readiness from the first glance: a green status dot and availability badge beside your name, dot-led section titles, and experience entries anchored to a theme border. It is the resume of someone open for work and proud of it — direct, energetic, and unambiguous.",
    bestFor: [
      "Freelancers and contractors",
      "Active job seekers",
      "Consultants between engagements",
      "Recent graduates",
      "Anyone who wants to signal availability",
    ],
    designTraits: [
      "Green availability status badge",
      "Status dot beside the name",
      "Dot-led section titles",
      "Theme-bordered experience entries",
      "Energetic, direct composition",
    ],
    atsNotes:
      "The badge and dots are decorative elements around real text in a single-column flow. Standard headings keep parsing straightforward.",
    faqs: [
      {
        q: "Can I remove the availability badge?",
        a: "The badge is part of Deploy's identity — if you are not actively job hunting, choose a template without the status signal.",
      },
      {
        q: "Does the badge look unprofessional?",
        a: "It reads as confident transparency, which hiring managers appreciate — it answers their first question immediately.",
      },
      {
        q: "Is Deploy ATS-friendly?",
        a: "Yes — single column, real text, standard headings; the decorative elements are CSS only.",
      },
    ],
    metaTitle: "Deploy Resume Template — Free Availability-Badge CV | Cvyon",
    metaDescription:
      "Free Deploy resume template: an availability badge and status dot for candidates ready to work. Direct and energetic for freelancers and job seekers.",
  },
  {
    id: "Interface",
    slug: "interface",
    name: "Interface",
    tagline: "A tinted sidebar with an avatar and dot ratings.",
    description:
      "Interface puts a softly tinted sidebar on the left with your avatar, contact details, dot-rated skills, and education — while the main column tells your experience story. The tint follows your theme color at low opacity, so the whole page feels coordinated. It is the friendliest sidebar template: personal, organized, and warm.",
    bestFor: [
      "UX and UI designers",
      "Frontend developers",
      "Product designers",
      "Customer-facing tech roles",
      "Creative technologists",
    ],
    designTraits: [
      "Theme-tinted left sidebar",
      "Circular avatar placeholder",
      "Dot-level skill ratings",
      "Sidebar contact and education",
      "Warm, coordinated composition",
    ],
    atsNotes:
      "Sidebar layouts need care with older parsers: keep job titles and employers in the main column. All text is real and selectable; modern systems parse the split fine.",
    faqs: [
      {
        q: "Should I include a photo in the avatar?",
        a: "The avatar shows your initial by default, which is the safest choice — photos can introduce bias in many hiring markets.",
      },
      {
        q: "How do dot ratings work?",
        a: "Dots give a quick visual sense of your strengths; order skills strongest-first for the best effect.",
      },
      {
        q: "Will the sidebar hurt ATS parsing?",
        a: "Keep critical keywords in the main column and you will be fine with modern parsers.",
      },
    ],
    metaTitle: "Interface Resume Template — Free Sidebar Designer CV | Cvyon",
    metaDescription:
      "Free Interface resume template: a theme-tinted sidebar with avatar and dot-rated skills. Warm and organized for designers and frontend roles.",
  },
  {
    id: "Bandwidth",
    slug: "bandwidth",
    name: "Bandwidth",
    tagline: "Progress bars that visualize your capacity.",
    description:
      "Bandwidth makes scope visible: a progress bar under your name sets the tone, and each experience entry carries its own tenure bar. Recruiters grasp the shape of your career — long tenures, broad scope — before reading a word. It is a confident template for people whose track record is the argument.",
    bestFor: [
      "Sales professionals with quotas",
      "Operations managers",
      "Professionals with long tenures",
      "Account managers",
      "Candidates whose scope is a selling point",
    ],
    designTraits: [
      "Progress bar under the header name",
      "Per-role tenure bars",
      "Scope-visualizing composition",
      "Clean single-column body",
      "Confident, metric-friendly tone",
    ],
    atsNotes:
      "Bars are decorative CSS; all text is real and in a single column with standard headings. Parsers ignore the visuals and read the content cleanly.",
    faqs: [
      {
        q: "What do the bars represent?",
        a: "They are visual rhythm, not data — they suggest scope and tenure at a glance. Your words carry the actual claims.",
      },
      {
        q: "Could bars look gimmicky?",
        a: "Bandwidth keeps them thin and restrained, so they read as design rather than decoration.",
      },
      {
        q: "Is Bandwidth ATS-safe?",
        a: "Yes — single column, real text, standard headings; the bars are pure CSS.",
      },
    ],
    metaTitle: "Bandwidth Resume Template — Free Visual-Scope CV | Cvyon",
    metaDescription:
      "Free Bandwidth resume template: progress bars that visualize tenure and scope. For sales, operations, and professionals whose track record speaks.",
  },
  {
    id: "Cache",
    slug: "cache",
    name: "Cache",
    tagline: "Highlighted titles, compact inline entries.",
    description:
      "Cache is built for speed-reading: section titles sit on soft theme-tinted highlights, and experience compresses role and company onto single inline lines. The header splits name and contact across the page for maximum efficiency. Dense careers fit without feeling dense — every line is retrievable at a glance.",
    bestFor: [
      "Engineers with long histories",
      "Consultants with many engagements",
      "Technical specialists",
      "Professionals condensing 10+ years",
      "Anyone told to keep it to one page",
    ],
    designTraits: [
      "Theme-tinted highlighted section titles",
      "Inline role · company single lines",
      "Split name/contact header",
      "Compact, efficient spacing",
      "High information density",
    ],
    atsNotes:
      "Single-column flow with standard headings and real text — density comes from spacing, not tricks. Parses cleanly.",
    faqs: [
      {
        q: "Is the text too small?",
        a: "Cache uses standard readable sizes with tighter spacing — density without eye strain.",
      },
      {
        q: "How much can fit on one page?",
        a: "Significantly more than standard templates, thanks to inline entries and disciplined spacing.",
      },
      {
        q: "Does density hurt ATS parsing?",
        a: "No — the layout is still a single column of real text with conventional headings.",
      },
    ],
    metaTitle: "Cache Resume Template — Free Compact Tech CV | Cvyon",
    metaDescription:
      "Free Cache resume template: highlighted section titles and compact inline entries for maximum content per page. Built for dense technical careers.",
  },
  {
    id: "Mainframe",
    slug: "mainframe",
    name: "Mainframe",
    tagline: "Full monospace, bordered like a terminal table.",
    description:
      "Mainframe commits fully to the bit: the entire resume is monospace, your name sits in a double-bordered box, experience renders as a bordered table with `>` bullet prefixes, and skills fill a bordered three-column grid. It is a love letter to computing history that still reads clearly to any recruiter.",
    bestFor: [
      "Systems engineers",
      "Backend developers",
      "DevOps professionals",
      "Retro-computing enthusiasts",
      "Technical candidates with personality",
    ],
    designTraits: [
      "Full monospace typography",
      "Double-bordered name box",
      "Bordered experience table",
      "Terminal-style > bullet prefixes",
      "Three-column bordered skills grid",
    ],
    atsNotes:
      "Monospace is just a font — the text is real and linear. The bordered table uses CSS borders, not an actual table element, so reading order stays simple.",
    faqs: [
      {
        q: "Is full monospace readable?",
        a: "Yes at these sizes, and it gives the resume unmistakable character. For conservative industries, pick a neutral template instead.",
      },
      {
        q: "Will recruiters take it seriously?",
        a: "In technical hiring, character is an asset — Mainframe signals genuine engineering culture.",
      },
      {
        q: "Does the table layout hurt ATS?",
        a: "No — the 'table' is CSS borders around normal text blocks, not a real table element.",
      },
    ],
    metaTitle: "Mainframe Resume Template — Free Monospace Tech CV | Cvyon",
    metaDescription:
      "Free Mainframe resume template: full monospace type with terminal-table styling. A characterful pick for systems engineers and backend developers.",
  },
  {
    id: "Uplink",
    slug: "uplink",
    name: "Uplink",
    tagline: "A split header with a full theme-color panel.",
    description:
      "Uplink's header is a bold two-tone composition: your name in white space on the left, contact details inside a full theme-colored panel on the right. Below, the body stays clean and conventional with theme-underlined sections. The color panel gives the page instant identity while the content remains classically readable.",
    bestFor: [
      "Tech professionals",
      "Sales and business development",
      "Startup candidates",
      "Young professionals",
      "Anyone wanting bold but tidy color",
    ],
    designTraits: [
      "Two-tone split header",
      "Full theme-color contact panel",
      "White-on-color contact text",
      "Theme-underlined section titles",
      "Clean conventional body",
    ],
    atsNotes:
      "The color panel is a background fill behind real text; reading order is name first, then contact. Body is single-column with standard headings.",
    faqs: [
      {
        q: "Does the color panel affect ATS?",
        a: "No — it is a solid fill behind real, selectable text, and the reading order is natural.",
      },
      {
        q: "Can I pick the panel color?",
        a: "It follows your Cvyon theme color, so any accent you choose flows through the design.",
      },
      {
        q: "Is white-on-color text readable?",
        a: "Yes — the template pairs the panel with high-contrast white type for accessibility.",
      },
    ],
    metaTitle: "Uplink Resume Template — Free Two-Tone Header CV | Cvyon",
    metaDescription:
      "Free Uplink resume template: a bold two-tone header with a full theme-color contact panel. Modern identity for tech and startup candidates.",
  },
  {
    id: "Overclock",
    slug: "overclock",
    name: "Overclock",
    tagline: "An oversized italic name with staggered entries.",
    description:
      "Overclock turns the volume up: your name at a massive italic 6xl, an all-italic treatment across the page, and experience entries that alternate indentation for rhythmic energy. It is unapologetically expressive — the template equivalent of walking into the room like you own it.",
    bestFor: [
      "Creative directors",
      "Brand strategists",
      "Marketing leaders",
      "Founders and entrepreneurs",
      "Candidates with bold personal brands",
    ],
    designTraits: [
      "Massive italic display name",
      "All-italic typographic treatment",
      "Alternating indented entries",
      "High-energy composition",
      "Expressive, confident tone",
    ],
    atsNotes:
      "Italics and indentation are styling on real text in a single column. Standard headings keep it parseable, though the expressive style suits creative industries best.",
    faqs: [
      {
        q: "Is Overclock too much?",
        a: "For conservative fields, yes — it is designed for creative and entrepreneurial contexts where boldness is currency.",
      },
      {
        q: "Does the staggered layout confuse readers?",
        a: "The alternation is gentle and rhythmic; the eye follows it naturally down the page.",
      },
      {
        q: "Will ATS parse the italic text?",
        a: "Yes — italics are a font style on real, selectable text in normal reading order.",
      },
    ],
    metaTitle: "Overclock Resume Template — Free Bold Creative CV | Cvyon",
    metaDescription:
      "Free Overclock resume template: an oversized italic name and high-energy staggered layout. For creatives, founders, and bold personal brands.",
  },
  {
    id: "Ledger",
    slug: "ledger",
    name: "Ledger",
    tagline: "A dark slate sidebar with skill bars.",
    description:
      "Ledger anchors the page with a dark slate sidebar carrying your avatar, contact details, skill bars, and education — while the main column presents experience in clean white space. The dark/light contrast gives the resume weight and structure, and the skill bars let strengths register instantly.",
    bestFor: [
      "Finance and accounting professionals",
      "Analysts",
      "Project managers",
      "Operations professionals",
      "Candidates who want structure with presence",
    ],
    designTraits: [
      "Dark slate sidebar",
      "Avatar with initial",
      "Skill proficiency bars",
      "Sidebar contact and education",
      "High-contrast two-column layout",
    ],
    atsNotes:
      "Keep job titles and employers in the main column for older parsers. The dark sidebar is a background fill behind real text; modern systems handle the split well.",
    faqs: [
      {
        q: "Does the dark sidebar use too much ink?",
        a: "For screen applications it is striking; if you are printing, most browsers offer background-graphics toggles.",
      },
      {
        q: "How are skill bar levels determined?",
        a: "Order your skills strongest-first — the bars give visual weight to your ordering.",
      },
      {
        q: "Is the sidebar ATS-safe?",
        a: "Modern parsers handle it; keep critical keywords in the main column as a precaution.",
      },
    ],
    metaTitle: "Ledger Resume Template — Free Dark Sidebar CV | Cvyon",
    metaDescription:
      "Free Ledger resume template: a dark slate sidebar with skill bars beside a clean main column. Structured presence for finance and operations.",
  },
  {
    id: "Harbor",
    slug: "harbor",
    name: "Harbor",
    tagline: "Your name inside a full theme-colored sidebar.",
    description:
      "Harbor puts your name at the top of a full-height theme-colored sidebar — your identity literally framed in your chosen color — with pill-shaped skills, contact, and extras below. The main column stays bright and conventional. It is the most color-forward professional template: memorable, but never messy.",
    bestFor: [
      "Young professionals",
      "Marketing and communications",
      "Customer success",
      "Hospitality professionals",
      "Candidates who want color with control",
    ],
    designTraits: [
      "Name inside the colored sidebar",
      "Full-height theme-color panel",
      "Pill-shaped skill tags",
      "Bright conventional main column",
      "Color-forward but controlled",
    ],
    atsNotes:
      "The sidebar is a background fill behind real text. Keep job titles in the main column; modern parsers read the two-column flow correctly.",
    faqs: [
      {
        q: "Can I change the sidebar color?",
        a: "It follows your Cvyon theme color exactly — pick any accent and the sidebar updates.",
      },
      {
        q: "Is a full-color sidebar professional?",
        a: "When the main column stays clean, a color sidebar reads as confident branding rather than decoration.",
      },
      {
        q: "Does the sidebar hurt ATS parsing?",
        a: "Modern systems handle it; the text is all real and the reading order is natural.",
      },
    ],
    metaTitle: "Harbor Resume Template — Free Color Sidebar CV | Cvyon",
    metaDescription:
      "Free Harbor resume template: your name in a full theme-colored sidebar with pill skills. Color-forward confidence for modern professionals.",
  },
  {
    id: "Beacon",
    slug: "beacon",
    name: "Beacon",
    tagline: "A right-side rail of white cards on gray.",
    description:
      "Beacon flips the sidebar to the right: a soft-gray rail carrying white cards for skills, references, and extras, while the main column leads with heavy black section titles. The card treatment organizes supporting content into neat containers, keeping the left column focused on your story.",
    bestFor: [
      "Consultants",
      "Analysts",
      "Researchers",
      "Project managers",
      "Professionals with strong supporting credentials",
    ],
    designTraits: [
      "Right-side gray rail",
      "White cards for supporting sections",
      "Heavy black section titles",
      "Main column for experience story",
      "Organized, container-based layout",
    ],
    atsNotes:
      "Right-rail layouts need the same care as left sidebars: keep job titles and employers in the main column. All text is real; modern parsers handle the split.",
    faqs: [
      {
        q: "Why is the sidebar on the right?",
        a: "Western readers start left, so your experience story gets first attention while credentials wait neatly on the right.",
      },
      {
        q: "Do the cards print well?",
        a: "The cards use soft shadows and white fills that translate cleanly to PDF.",
      },
      {
        q: "Is Beacon ATS-friendly?",
        a: "With critical content in the main column, modern parsers read it without trouble.",
      },
    ],
    metaTitle: "Beacon Resume Template — Free Right-Sidebar CV | Cvyon",
    metaDescription:
      "Free Beacon resume template: a right-side rail of white cards with heavy black section titles. Organized support for consultants and analysts.",
  },
  {
    id: "Compass",
    slug: "compass",
    name: "Compass",
    tagline: "A deep-navy sidebar with dot-rated skills.",
    description:
      "Compass sets a deep-navy sidebar against a bright main column: contact, dot-rated skills, and custom sections on the left in white and blue-tinted type; your name and experience story on the right. The navy gives the page direction and gravity — a steady, navigational feel for careers with clear trajectories.",
    bestFor: [
      "Project managers",
      "Operations professionals",
      "Logistics and supply chain",
      "Military-to-civilian transitions",
      "Professionals with clear career progression",
    ],
    designTraits: [
      "Deep-navy sidebar",
      "Dot-rated skill indicators",
      "Blue-tinted sidebar typography",
      "Bright experience-focused main column",
      "Steady, directional composition",
    ],
    atsNotes:
      "Navy sidebar is a background fill behind real text. Keep employers and titles in the main column; modern parsers handle the two-column flow.",
    faqs: [
      {
        q: "Is the navy too dark?",
        a: "Navy is a classic professional dark — authoritative without the heaviness of black.",
      },
      {
        q: "How do the dot ratings work?",
        a: "They visualize your skill ordering at a glance; list strongest skills first.",
      },
      {
        q: "Will ATS read the sidebar?",
        a: "Modern parsers do; as always, keep your most important keywords in the main column too.",
      },
    ],
    metaTitle: "Compass Resume Template — Free Navy Sidebar CV | Cvyon",
    metaDescription:
      "Free Compass resume template: a deep-navy sidebar with dot-rated skills beside a bright main column. Steady direction for PMs and operations.",
  },
  {
    id: "Meridian",
    slug: "meridian",
    name: "Meridian",
    tagline: "A dark theme sidebar with skill meters beside a crisp main column.",
    description:
      "Meridian puts a dark theme-colored sidebar on the right and your story on the left: a bold black name, your title in the accent color, and a clean experience column. The sidebar carries contact, education, and skill proficiency meters rendered as sleek white bars. The contrast between the dark panel and the light main column gives the page a confident, contemporary edge without sacrificing readability.",
    bestFor: [
      "Software engineers and developers",
      "Product managers",
      "Data analysts and scientists",
      "IT and systems professionals",
      "Candidates who want a modern, confident look",
    ],
    designTraits: [
      "Dark theme-colored right sidebar",
      "Skill proficiency meters as white bars",
      "Bold black name with accent-colored title",
      "Uppercase section headers with accent ticks",
      "Compact experience rows in the main column",
    ],
    atsNotes:
      "The dark sidebar uses real text over a solid fill, so contact details and skills parse normally. Experience sits in a single left column with standard headings for reliable parsing.",
    faqs: [
      {
        q: "How are the skill meter levels determined?",
        a: "The meters give each skill a visual weight so recruiters can scan your strengths at a glance. List your strongest skills first for the best effect.",
      },
      {
        q: "Does the dark sidebar use too much ink when printed?",
        a: "It can — for printing, choose a lighter theme color or export and print in grayscale. On screen and as a PDF, it looks sharp.",
      },
      {
        q: "Will the right sidebar confuse applicant tracking systems?",
        a: "All text is real and selectable. Keep job titles and employers in the left main column, which older parsers read first.",
      },
    ],
    metaTitle: "Meridian Resume Template — Free Dark Sidebar CV | Cvyon",
    metaDescription:
      "Free Meridian resume template: a dark theme sidebar with skill meters beside a crisp main column. Great for developers and tech professionals.",
  },
  {
    id: "Northstar",
    slug: "northstar",
    name: "Northstar",
    tagline: "A charcoal sidebar with star-marked skill blocks.",
    description:
      "Northstar sets a charcoal sidebar against a light main column and marks your skills with small star bullets in your theme color. Contact, skill blocks, and education live in the dark panel, while experience unfolds on the right with a slim left rail and quiet gray headers. The star motif gives the design a subtle sense of direction — a resume for people who know where they are headed.",
    bestFor: [
      "Project and program managers",
      "Marketing professionals",
      "Operations specialists",
      "Customer success managers",
      "Mid-career professionals with a clear trajectory",
    ],
    designTraits: [
      "Charcoal left sidebar with white text",
      "Star bullets in the theme color marking each skill",
      "Skills presented as bordered blocks",
      "Slim accent rail alongside the main column",
      "Quiet gray section headers in the body",
    ],
    atsNotes:
      "Sidebar text is real and selectable over the solid charcoal fill. The main column keeps a straightforward single-column flow with standard headings.",
    faqs: [
      {
        q: "Are the star bullets just decoration?",
        a: "They are a small visual signature that makes the skills panel scannable. The stars are text glyphs, not images, so they do not affect parsing.",
      },
      {
        q: "Can I change the charcoal sidebar color?",
        a: "The charcoal is fixed for contrast, but the star bullets, rails, and accents all follow your Cvyon theme color.",
      },
      {
        q: "Is a dark sidebar ATS-friendly?",
        a: "Yes — the text is real and selectable, not an image. Keep your most important keywords in the main column for the oldest parsers.",
      },
    ],
    metaTitle: "Northstar Resume Template — Free Charcoal Sidebar CV | Cvyon",
    metaDescription:
      "Free Northstar resume template: a charcoal sidebar with star-marked skill blocks beside a clean main column. For professionals with direction.",
  },
  {
    id: "Trellis",
    slug: "trellis",
    name: "Trellis",
    tagline: "A sage-tinted sidebar with pill skills and an airy main column.",
    description:
      "Trellis is a breath of fresh air: a soft sage-tinted sidebar holding contact, pill-shaped skills, and education, while your name leads a spacious main column with gentle green-gray headers. The humanist sans and generous line spacing keep everything calm and readable. It suits people-facing and purpose-driven roles where warmth matters as much as competence.",
    bestFor: [
      "Teachers and educators",
      "Healthcare and social workers",
      "Nonprofit professionals",
      "HR and people operations",
      "Hospitality and customer-facing roles",
    ],
    designTraits: [
      "Soft sage-tinted left sidebar",
      "Skills as rounded white pills",
      "Airy main column with generous spacing",
      "Soft green-gray section headers",
      "Warm humanist sans typography",
    ],
    atsNotes:
      "A gentle, single-flow layout with real text throughout. The light sidebar tint does not affect parsing, and standard headings keep it ATS-safe.",
    faqs: [
      {
        q: "Is the sage color fixed?",
        a: "The sage tint is part of the design's character, while section titles and accents follow your Cvyon theme color.",
      },
      {
        q: "Does the light design work for formal industries?",
        a: "Trellis is warm rather than formal — it shines in education, healthcare, nonprofits, and people roles rather than banking or law.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column reading flow, real text, and standard section headings throughout.",
      },
    ],
    metaTitle: "Trellis Resume Template — Free Soft Sidebar CV | Cvyon",
    metaDescription:
      "Free Trellis resume template: a sage-tinted sidebar with pill skills and an airy main column. Warm and readable for people-focused roles.",
  },
  {
    id: "Keystone",
    slug: "keystone",
    name: "Keystone",
    tagline: "Your key skills lead a theme-colored sidebar; the rest follows.",
    description:
      "Keystone makes a strategic choice for you: your first four skills get star treatment as highlighted cards at the top of a theme-colored sidebar, followed by contact and the remaining skills as compact tags. The main column keeps strong black headers with accent underlines. It is built for candidates whose headline skills win interviews — lead with your best, let the rest support.",
    bestFor: [
      "Specialists with standout expertise",
      "Engineers with a flagship skill set",
      "Certified professionals (PMP, CPA, AWS)",
      "Consultants selling core capabilities",
      "Career changers emphasizing transferable strengths",
    ],
    designTraits: [
      "Theme-colored left sidebar",
      "Top four skills highlighted as feature cards",
      "Remaining skills as compact tags",
      "Strong black headers with accent underlines",
      "Standard experience layout in the main column",
    ],
    atsNotes:
      "Highlighted skills are real text, so parsers read them normally. The main column's standard headings and single flow keep parsing reliable.",
    faqs: [
      {
        q: "Which skills become the highlighted ones?",
        a: "Your first four skills in the builder appear as the highlighted cards — order them with your strongest first.",
      },
      {
        q: "What if I have fewer than four skills?",
        a: "The highlighted area simply shows what you have; add more skills in the builder to fill all four slots.",
      },
      {
        q: "Does the colored sidebar hurt ATS parsing?",
        a: "No — it is a solid fill behind real selectable text. Keep job titles and employers in the main column for the oldest parsers.",
      },
    ],
    metaTitle: "Keystone Resume Template — Free Highlighted-Skills CV | Cvyon",
    metaDescription:
      "Free Keystone resume template: your top four skills highlighted in a theme-colored sidebar. Built for specialists who lead with expertise.",
  },
  {
    id: "Cornerstone",
    slug: "cornerstone",
    name: "Cornerstone",
    tagline: "A cream right sidebar beside a classic serif main column.",
    description:
      "Cornerstone is old-school confidence: a bold serif name opens the main column, followed by formal sections with classic ruled headers, while a cream right sidebar quietly holds contact, inline skills, and references. The cream panel softens the formality just enough to feel human. It is a natural fit for law, academia, finance, and senior leadership — fields where tradition still carries weight.",
    bestFor: [
      "Lawyers and legal professionals",
      "Academics and researchers",
      "Banking and finance professionals",
      "Senior executives",
      "Board and advisory candidates",
    ],
    designTraits: [
      "Cream right sidebar with contact and skills",
      "Classic serif typography in the main column",
      "Bold serif name with italic title",
      "Ruled formal section headers",
      "Traditional stacked experience entries",
    ],
    atsNotes:
      "A traditional layout with real text throughout. The cream sidebar parses normally, and the main column follows a conventional top-to-bottom flow that parsers handle well.",
    faqs: [
      {
        q: "Is the cream sidebar professional enough for law firms?",
        a: "Yes — cream and ivory tones are long-established in legal and financial stationery. The overall effect is formal and restrained.",
      },
      {
        q: "Can I change the cream color?",
        a: "The cream is part of the design; accents and sidebar titles follow your Cvyon theme color.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Very — conventional layout, real text, and standard section headings make it one of the safest choices for strict parsers.",
      },
    ],
    metaTitle: "Cornerstone Resume Template — Free Classic Serif CV | Cvyon",
    metaDescription:
      "Free Cornerstone resume template: a cream right sidebar beside a classic serif main column. Formal and timeless for law, finance, and academia.",
  },
  {
    id: "Lighthouse",
    slug: "lighthouse",
    name: "Lighthouse",
    tagline: "A deep-teal sidebar with an angled beam top and skill bars.",
    description:
      "Lighthouse opens with a deep-teal sidebar whose top is cut at an angle like a beam of light, carrying your initials and a quiet 'Navigator' label. Below, contact and skill bars fill the panel while the main column presents experience as clean cards with diamond-bullet headers. It is a distinctive but disciplined design — memorable on first glance, easy to read on the second.",
    bestFor: [
      "Designers and creatives",
      "Marketing professionals",
      "Product managers",
      "Tech professionals who want character",
      "Freelancers and consultants",
    ],
    designTraits: [
      "Deep-teal sidebar with an angled clip-path top",
      "Skill proficiency bars in the sidebar",
      "Initials medallion in the beam header",
      "Diamond-bullet section headers in the main column",
      "Experience presented as clean cards",
    ],
    atsNotes:
      "The angled top is pure styling — all text remains real and selectable. Sidebar content parses normally; keep job titles and employers in the main column for older parsers.",
    faqs: [
      {
        q: "Does the angled sidebar top affect printing?",
        a: "It prints as designed on modern printers. The angle is a CSS clip-path, so it renders cleanly in PDF export.",
      },
      {
        q: "Can I change the teal color?",
        a: "The deep teal is signature to the design; your theme color drives the diamond bullets, bars, and accents.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text throughout and a standard main-column flow. The decorative angle does not interfere with parsing.",
      },
    ],
    metaTitle: "Lighthouse Resume Template — Free Teal Sidebar CV | Cvyon",
    metaDescription:
      "Free Lighthouse resume template: a deep-teal sidebar with an angled top and skill bars. Distinctive yet disciplined for modern professionals.",
  },
  {
    id: "Waypoint",
    slug: "waypoint",
    name: "Waypoint",
    tagline: "Your career path as a dot timeline in a tinted sidebar.",
    description:
      "Waypoint turns your work history into a visual journey: a lightly tinted sidebar carries a vertical dot timeline of every role — title, company, and dates marked along the line — above your contact details. The main column then expands each role with full descriptions. It is a thoughtful design for people with a clear progression who want recruiters to see the arc of their career at a glance.",
    bestFor: [
      "Professionals with clear career progression",
      "Project managers",
      "Operations and logistics professionals",
      "Military veterans translating service history",
      "Anyone with 3+ roles showing growth",
    ],
    designTraits: [
      "Light theme-tinted left sidebar",
      "Vertical dot timeline of your career in the sidebar",
      "Contact details at the top of the sidebar",
      "Expanded experience descriptions in the main column",
      "Clean black section headers",
    ],
    atsNotes:
      "The timeline is a visual summary — full role details with standard headings live in the main column, which parsers read normally.",
    faqs: [
      {
        q: "Does the timeline duplicate my experience section?",
        a: "It summarizes it: the sidebar shows roles, companies, and dates, while the main column carries the full descriptions. Both draw from the same data.",
      },
      {
        q: "What if I have many short roles?",
        a: "The timeline handles them gracefully — each role gets a dot. Very long histories may fit better in a compact template like Brief.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — the main column uses standard headings and real text, and the timeline dots are simple styling.",
      },
    ],
    metaTitle: "Waypoint Resume Template — Free Career Timeline CV | Cvyon",
    metaDescription:
      "Free Waypoint resume template: your career as a dot timeline in a tinted sidebar with full details in the main column. Shows your trajectory.",
  },
  {
    id: "Breakwater",
    slug: "breakwater",
    name: "Breakwater",
    tagline: "A slate sidebar divided from the main column by a wave.",
    description:
      "Breakwater's signature is a flowing wave divider that separates the main column from a slate right sidebar — a subtle, organic touch in an otherwise crisp professional layout. Your name leads in bold black, the sidebar holds contact, skill chips, and education, and experience flows in the main column. Distinctive enough to be remembered, structured enough for any industry.",
    bestFor: [
      "Marketing and brand professionals",
      "Designers",
      "Environmental and marine professionals",
      "Tech professionals",
      "Candidates who want one memorable design element",
    ],
    designTraits: [
      "Wave-shaped SVG divider between columns",
      "Slate right sidebar with white text",
      "Skills as chips in the sidebar",
      "Bold black name with accent title",
      "Crisp single-column experience layout",
    ],
    atsNotes:
      "The wave is a decorative SVG shape — all text is real and selectable. The main column follows a standard flow that parsers read reliably.",
    faqs: [
      {
        q: "Is the wave too playful for formal roles?",
        a: "It is subtle — a single flowing line. For very conservative fields like law or banking, a plainer template may fit better.",
      },
      {
        q: "Does the wave print correctly?",
        a: "Yes — it is a vector SVG shape that renders cleanly in PDF export and on modern printers.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text throughout and a standard main-column layout with conventional headings.",
      },
    ],
    metaTitle: "Breakwater Resume Template — Free Wave-Divider CV | Cvyon",
    metaDescription:
      "Free Breakwater resume template: a slate sidebar separated by a wave divider. One memorable design element in a crisp professional layout.",
  },
  {
    id: "Headland",
    slug: "headland",
    name: "Headland",
    tagline: "Your name in a theme block crowning a white sidebar.",
    description:
      "Headland puts your name where it cannot be missed: a solid theme-colored block at the top of the left sidebar, with your name in bold white and your title beneath. Below it, the white sidebar continues with contact and skill bars, while the main column presents your experience cleanly. It is a strong, grounded design that leads with identity — ideal when your name should carry the page.",
    bestFor: [
      "Sales leaders and account executives",
      "Real estate professionals",
      "Recruiters and talent professionals",
      "Entrepreneurs and founders",
      "Personal-brand-driven professionals",
    ],
    designTraits: [
      "Theme-colored name block crowning the sidebar",
      "White sidebar body with contact details",
      "Skill proficiency bars in the sidebar",
      "Clean black section headers in the main column",
      "Strong identity-led first impression",
    ],
    atsNotes:
      "The name block is a solid fill behind real text, so your name parses normally. The main column keeps a standard single-column flow.",
    faqs: [
      {
        q: "Can I change the name block color?",
        a: "Yes — it follows your Cvyon theme color, so it shifts with your chosen palette.",
      },
      {
        q: "Does the name block use too much ink when printed?",
        a: "For heavy printing, pick a lighter theme color. As a PDF on screen, the block looks bold and clean.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text over a solid fill, with a conventional main-column layout.",
      },
    ],
    metaTitle: "Headland Resume Template — Free Bold-Name Sidebar CV | Cvyon",
    metaDescription:
      "Free Headland resume template: your name in a theme block crowning a white sidebar with skill bars. Leads with identity.",
  },
  {
    id: "Estuary",
    slug: "estuary",
    name: "Estuary",
    tagline: "Dual-tint design: a theme sidebar plus tinted main-column cards.",
    description:
      "Estuary works two tints at once: a theme-colored sidebar with white-text skill pills, contact, and education, while the main column sets each experience entry as a softly tinted card. The layered color gives the page depth and rhythm without clutter. It is a modern, friendly design that keeps long resumes feeling organized and scannable.",
    bestFor: [
      "Customer success and support professionals",
      "HR and people operations",
      "Marketing professionals",
      "Healthcare administrators",
      "Candidates with long, varied experience",
    ],
    designTraits: [
      "Theme-colored left sidebar",
      "White-text skill pills with subtle borders",
      "Experience entries as tinted cards in the main column",
      "Dual-tint color system for depth",
      "Modern sans typography",
    ],
    atsNotes:
      "Cards and tints are styling only — all text is real and selectable. Experience entries use standard headings within a clear single flow.",
    faqs: [
      {
        q: "Do the tinted cards hurt readability?",
        a: "No — the tints are light and text stays dark, keeping contrast strong. The cards actually help separate roles visually.",
      },
      {
        q: "Can I change the tint colors?",
        a: "Both tints derive from your Cvyon theme color, so the whole palette stays coordinated.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text, standard headings, and a clear reading order throughout.",
      },
    ],
    metaTitle: "Estuary Resume Template — Free Dual-Tint CV | Cvyon",
    metaDescription:
      "Free Estuary resume template: a theme sidebar with white-text pills plus tinted experience cards. Modern depth for long resumes.",
  },
  {
    id: "Marquee",
    slug: "marquee",
    name: "Marquee",
    tagline: "A giant uppercase name over a theme-colored contact bar.",
    description:
      "Marquee makes your name the headline: a huge 56px uppercase name spans the full width of the page, followed by your title and a full-width theme-colored bar carrying your contact details. The body below is deliberately simple — bold uppercase section headers with black rules and clean experience entries. Maximum presence up top, total clarity below.",
    bestFor: [
      "Senior executives",
      "Public speakers and thought leaders",
      "Sales leaders",
      "Entrepreneurs and founders",
      "Anyone who wants undeniable presence",
    ],
    designTraits: [
      "Giant 56px uppercase name spanning full width",
      "Full-width theme-colored contact bar",
      "Bold uppercase section headers with black rules",
      "Inline skills separated by bullets",
      "Clean single-column body",
    ],
    atsNotes:
      "A single-column layout with real text and standard headings — the giant name parses as ordinary text, so this is very ATS-safe.",
    faqs: [
      {
        q: "Is the giant name too much?",
        a: "It is a statement look. If you prefer presence with more restraint, try Jumbotron or Ensign instead.",
      },
      {
        q: "Can I change the contact bar color?",
        a: "Yes — the bar follows your Cvyon theme color.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Very — single column, real text, standard headings. The large name is just styled text.",
      },
    ],
    metaTitle: "Marquee Resume Template — Free Bold-Name CV | Cvyon",
    metaDescription:
      "Free Marquee resume template: a giant uppercase name over a theme-colored contact bar. Maximum presence for senior leaders.",
  },
  {
    id: "Billboard",
    slug: "billboard",
    name: "Billboard",
    tagline: "A full-bleed theme header with a huge white name and timeline experience.",
    description:
      "Billboard opens with a full-bleed theme-colored header block: your name in huge white type, your title, and a single contact line. Below, experience unfolds as a dot timeline against hairline section headers, with skills as soft pills. It is confident and contemporary — the resume equivalent of a well-designed poster that still reads like a serious document.",
    bestFor: [
      "Marketing and advertising professionals",
      "Product managers",
      "Tech professionals",
      "Startup candidates",
      "Creative-adjacent professionals",
    ],
    designTraits: [
      "Full-bleed theme-colored header block",
      "Huge white name with white title and contact line",
      "Experience as a dot timeline",
      "Hairline section headers in the body",
      "Skills as soft pill tags",
    ],
    atsNotes:
      "The header is a solid fill behind real white text, so your name and contact parse normally. The body is a single column with standard headings.",
    faqs: [
      {
        q: "Does the colored header use too much ink?",
        a: "For printing, choose a lighter theme color. As a PDF — how most resumes are submitted — it looks striking.",
      },
      {
        q: "Is the timeline hard for ATS to parse?",
        a: "The timeline is visual styling around real text with standard headings, so parsers read it fine.",
      },
      {
        q: "Can I change the header color?",
        a: "Yes — it follows your Cvyon theme color, and the body accents shift with it.",
      },
    ],
    metaTitle: "Billboard Resume Template — Free Statement CV | Cvyon",
    metaDescription:
      "Free Billboard resume template: a full-bleed theme header with huge white type and timeline experience. Confident and contemporary.",
  },
  {
    id: "Masthead",
    slug: "masthead",
    name: "Masthead",
    tagline: "A newspaper nameplate: centered serif, thin rules, dateline contact.",
    description:
      "Masthead borrows the authority of the front page: your name set like a newspaper nameplate in large centered serif, framed by thin black rules, with contact arranged like a dateline beneath. Sections are headed by centered serif titles flanked by rules. It is a design for writers, editors, academics, and anyone whose work lives in words — formal, literate, and quietly commanding.",
    bestFor: [
      "Writers, editors, and journalists",
      "Academics and researchers",
      "Lawyers",
      "Policy and communications professionals",
      "Publishing professionals",
    ],
    designTraits: [
      "Newspaper-style nameplate header",
      "Large centered serif name with thin black rules",
      "Dateline-style contact line",
      "Centered serif section headers flanked by rules",
      "Classic single-column editorial layout",
    ],
    atsNotes:
      "One of the most ATS-safe designs available: single column, real text, conventional headings, no graphics that matter. An excellent choice for strict portals.",
    faqs: [
      {
        q: "Is it too old-fashioned for tech roles?",
        a: "Masthead is deliberately traditional — it suits writing, academia, law, and policy far better than startups or engineering.",
      },
      {
        q: "Can I add color?",
        a: "The design is intentionally black and white for that newsprint authority; accents follow your theme color subtly.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Extremely — single column, standard headings, real text throughout.",
      },
    ],
    metaTitle: "Masthead Resume Template — Free Newspaper-Style CV | Cvyon",
    metaDescription:
      "Free Masthead resume template: a newspaper nameplate with centered serif and thin rules. Authoritative for writers, academics, and lawyers.",
  },
  {
    id: "Jumbotron",
    slug: "jumbotron",
    name: "Jumbotron",
    tagline: "An oversized left-aligned name with a theme underline.",
    description:
      "Jumbotron leads with scale: your name at a commanding 64px, left-aligned, underlined by a short thick bar in your theme color. Below, generous spacing gives every section room to breathe — bold uppercase headers, airy experience entries, and wide line spacing. It is a design for people with the achievements to fill the space: senior, established, and unhurried.",
    bestFor: [
      "Senior executives",
      "Directors and VPs",
      "Consultants with major engagements",
      "Academics with extensive records",
      "Established professionals with long histories",
    ],
    designTraits: [
      "Oversized 64px left-aligned name",
      "Thick theme-colored underline bar",
      "Bold uppercase section headers",
      "Generous spacing and wide line height",
      "Airy, unhurried single-column layout",
    ],
    atsNotes:
      "Single column, real text, standard headings — the large name is just styled text, so parsing is straightforward.",
    faqs: [
      {
        q: "Will the big name push content onto two pages?",
        a: "The header is compact despite the large type, and generous spacing is balanced to keep typical resumes to one or two pages.",
      },
      {
        q: "Can I change the underline color?",
        a: "Yes — it follows your Cvyon theme color.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Very — single-column flow with conventional headings throughout.",
      },
    ],
    metaTitle: "Jumbotron Resume Template — Free Large-Name CV | Cvyon",
    metaDescription:
      "Free Jumbotron resume template: an oversized left-aligned name with a theme underline and generous spacing. For established professionals.",
  },
  {
    id: "Flagship",
    slug: "flagship",
    name: "Flagship",
    tagline: "Navy and gold formality: a banded header with serif gravitas.",
    description:
      "Flagship is ceremony done right: a deep navy band carries your name in white serif, your title in gold, and a contact line — finished with a gold rule. The body continues the formality with serif section headers underlined in navy over gold. It is the resume for boardrooms, partnerships, and institutions where gravitas is the whole point.",
    bestFor: [
      "C-suite executives",
      "Board candidates",
      "Partners in professional firms",
      "Diplomats and public officials",
      "Senior finance and legal leaders",
    ],
    designTraits: [
      "Deep navy header band with white serif name",
      "Gold title and gold rule accents",
      "Serif section headers with navy-over-gold rules",
      "Formal stacked experience entries",
      "Ceremonial, institutional character",
    ],
    atsNotes:
      "The navy band is a solid fill behind real text, so your name parses normally. The body is a conventional single column with standard headings.",
    faqs: [
      {
        q: "Are the navy and gold colors fixed?",
        a: "Yes — they are the signature of this design. If you want your own palette, try Regent or Senate instead.",
      },
      {
        q: "Is it too formal for startups?",
        a: "Flagship is built for institutions — boards, firms, and public office. Startup candidates will fit better elsewhere.",
      },
      {
        q: "Does the navy band hurt ATS parsing?",
        a: "No — it is a solid fill behind real selectable text, and the body follows a standard layout.",
      },
    ],
    metaTitle: "Flagship Resume Template — Free Navy and Gold CV | Cvyon",
    metaDescription:
      "Free Flagship resume template: a navy band with gold accents and serif gravitas. Formal and ceremonial for executives and institutions.",
  },
  {
    id: "Vitrine",
    slug: "vitrine",
    name: "Vitrine",
    tagline: "Display serif with a theme backdrop disc; sections as gallery cards.",
    description:
      "Vitrine treats your resume like a gallery: your name in large display serif, backed by a soft theme-colored disc, with your title in italic accent beneath. Each section sits in its own clean card with a subtle shadow, and skills appear as chips. It is elegant and contemporary — a strong choice for design-adjacent professionals who want their resume to show taste.",
    bestFor: [
      "Designers and art directors",
      "Architects",
      "Marketing and brand professionals",
      "Photographers and visual artists",
      "Creative directors",
    ],
    designTraits: [
      "Display serif name with a soft theme backdrop disc",
      "Sections presented as gallery-like cards",
      "Italic accent-colored job title",
      "Skills as chips",
      "Elegant, curated visual rhythm",
    ],
    atsNotes:
      "Cards are simple bordered containers around real text with standard headings, so parsing is unaffected. Keep the most critical keywords in the card bodies.",
    faqs: [
      {
        q: "Do the cards waste space?",
        a: "Cards add padding, so very long resumes may run longer — but for typical one-to-two-page resumes the structure aids scanning.",
      },
      {
        q: "Can I change the backdrop disc color?",
        a: "Yes — it follows your Cvyon theme color at low opacity.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text, standard headings, and a clear top-to-bottom flow.",
      },
    ],
    metaTitle: "Vitrine Resume Template — Free Gallery-Style CV | Cvyon",
    metaDescription:
      "Free Vitrine resume template: display serif with a theme backdrop disc and gallery-card sections. Elegant for design-minded professionals.",
  },
  {
    id: "Podium",
    slug: "podium",
    name: "Podium",
    tagline: "A tiered centered header with numbered, ranked sections.",
    description:
      "Podium is built around achievement: a centered tiered header — your name, your title in a theme pill, your contact line — opens the page, and every section is numbered like a ranking. Experience entries emphasize your top role with a distinctive treatment. It is a confident, competitive design for candidates who want their resume to read like a record of wins.",
    bestFor: [
      "Sales professionals with strong numbers",
      "Athletes and coaches",
      "Competitive, results-driven professionals",
      "Award-winning creatives",
      "Candidates with standout achievements",
    ],
    designTraits: [
      "Centered tiered header with title pill",
      "Numbered section headers like rankings",
      "Top role visually emphasized",
      "Theme pill for the job title",
      "Confident, achievement-led character",
    ],
    atsNotes:
      "Single column with real text and standard headings — the numbers are decorative prefixes that do not interfere with parsing.",
    faqs: [
      {
        q: "Do the section numbers confuse ATS parsers?",
        a: "No — they are small decorative numerals before standard headings, and all text remains real and selectable.",
      },
      {
        q: "Can I change the title pill color?",
        a: "Yes — it follows your Cvyon theme color.",
      },
      {
        q: "Is a centered layout professional?",
        a: "Centered headers are a long-standing resume convention. Podium keeps the body left-aligned for readability.",
      },
    ],
    metaTitle: "Podium Resume Template — Free Achievement CV | Cvyon",
    metaDescription:
      "Free Podium resume template: a tiered centered header with numbered sections. Built for candidates who lead with achievements.",
  },
  {
    id: "Aperture",
    slug: "aperture",
    name: "Aperture",
    tagline: "A circular portrait with a theme ring beside your name.",
    description:
      "Aperture opens with you: a circular photo — or your initial in a theme-colored disc — ringed in your accent color beside your name and title. The body below is clean and conventional, with hairline section headers and standard experience entries. It is a warm, personable design that works wherever a face helps: client-facing roles, hospitality, education, and personal brands.",
    bestFor: [
      "Client-facing and sales roles",
      "Hospitality professionals",
      "Teachers and trainers",
      "Healthcare professionals",
      "Personal brands and freelancers",
    ],
    designTraits: [
      "Circular portrait with a theme-colored ring",
      "Initial fallback in a theme disc when no photo",
      "Name and title beside the portrait",
      "Clean body with hairline section headers",
      "Warm, personable character",
    ],
    atsNotes:
      "The photo is decorative — all text content is real and separate. The body is a standard single column, so parsing is unaffected. Note: some regions and industries prefer no photo; check local norms.",
    faqs: [
      {
        q: "Should I include a photo on my resume?",
        a: "It depends on your market — photos are common in much of Europe, Africa, and Asia but discouraged in the US and UK. Aperture works with or without one.",
      },
      {
        q: "What if I do not upload a photo?",
        a: "Your initial appears in a theme-colored disc instead, which looks intentional and clean.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — the body is a conventional single column with real text and standard headings.",
      },
    ],
    metaTitle: "Aperture Resume Template — Free Photo CV | Cvyon",
    metaDescription:
      "Free Aperture resume template: a circular portrait with a theme ring beside your name. Warm and personable for client-facing roles.",
  },
  {
    id: "Spotlight",
    slug: "spotlight",
    name: "Spotlight",
    tagline: "A dark band with a spotlight glow and glowing section dots.",
    description:
      "Spotlight literally puts you center stage: a dark header band with a soft radial glow carries your name in white, while section headers in the light body are marked with small glowing dots in your theme color. The contrast between the dramatic header and the clean body makes the page memorable without hurting readability — a strong pick for performers, presenters, and anyone who owns the room.",
    bestFor: [
      "Performers and entertainers",
      "Public speakers and trainers",
      "Event professionals",
      "Media and broadcasting",
      "Charismatic client-facing professionals",
    ],
    designTraits: [
      "Dark header band with a radial spotlight glow",
      "White name with soft-lit contact details",
      "Glowing theme-colored dots marking section headers",
      "Clean light body with standard experience entries",
      "Dramatic yet readable contrast",
    ],
    atsNotes:
      "The dark band is a solid fill behind real text, so your name parses normally. The body is a standard single column with conventional headings.",
    faqs: [
      {
        q: "Is the spotlight effect too theatrical for corporate roles?",
        a: "It has drama by design — it suits media, events, and presenting roles. For conservative corporates, choose a quieter template.",
      },
      {
        q: "Does the glow print well?",
        a: "The glow is subtle and prints as a soft gradient. As a PDF on screen, it looks its best.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text over solid fills and a standard body layout.",
      },
    ],
    metaTitle: "Spotlight Resume Template — Free Dramatic CV | Cvyon",
    metaDescription:
      "Free Spotlight resume template: a dark glowing header band with luminous section dots. For performers, speakers, and presenters.",
  },
  {
    id: "Ensign",
    slug: "ensign",
    name: "Ensign",
    tagline: "A theme pennant carrying your contact beneath your name.",
    description:
      "Ensign's signature is a flag-like pennant: a theme-colored band with an angled cut that carries your contact details beneath your name. Small triangular markers echo the motif at each section header. It is crisp, distinctive, and quietly confident — a design with one strong idea that never overwhelms the content.",
    bestFor: [
      "Marketing professionals",
      "Project managers",
      "Tech professionals",
      "Operations specialists",
      "Candidates who want one distinctive element",
    ],
    designTraits: [
      "Flag-like pennant with an angled cut carrying contact",
      "Triangular motif echoed at section headers",
      "Bold black name with accent-colored title",
      "Crisp single-column body",
      "One strong, restrained design idea",
    ],
    atsNotes:
      "The pennant is a styled band behind real text, so contact details parse normally. The body is a standard single column with conventional headings.",
    faqs: [
      {
        q: "Does the angled pennant print correctly?",
        a: "Yes — it is a CSS clip-path shape that renders cleanly in PDF export and on modern printers.",
      },
      {
        q: "Can I change the pennant color?",
        a: "Yes — it follows your Cvyon theme color, and the section markers shift with it.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — real text throughout and a standard single-column flow.",
      },
    ],
    metaTitle: "Ensign Resume Template — Free Pennant CV | Cvyon",
    metaDescription:
      "Free Ensign resume template: a theme pennant carrying your contact beneath your name. Crisp and distinctive with one strong idea.",
  },
  {
    id: "Whisper",
    slug: "whisper",
    name: "Whisper",
    tagline: "Extreme whitespace: a tiny name and whisper-quiet type.",
    description:
      "Whisper is minimalism at its most extreme: a small, light name, vast margins, faint micro section headers with wide tracking, and generous line spacing throughout. Nothing shouts; everything breathes. It is a design for people whose restraint is the statement — senior creatives, strategists, and anyone confident enough to let white space do the talking.",
    bestFor: [
      "Senior creatives and art directors",
      "Brand strategists",
      "Architects",
      "Writers and editors",
      "Minimalists with strong portfolios",
    ],
    designTraits: [
      "Tiny light-weight name with huge margins",
      "Faint micro section headers with wide tracking",
      "Extreme whitespace throughout",
      "Light type weights and soft gray tones",
      "Understated, confident character",
    ],
    atsNotes:
      "About as ATS-safe as a resume gets: single column, real text, standard headings, no graphics. The light styling does not affect parsing at all.",
    faqs: [
      {
        q: "Is the text too light to read?",
        a: "Body text stays at readable contrast; only the decorative headers are faint. It is designed for screen-first reading.",
      },
      {
        q: "Will it work for a long resume?",
        a: "The generous spacing means long resumes run to more pages — Whisper suits concise, curated careers best.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Extremely — single column, standard headings, real text, nothing decorative that matters.",
      },
    ],
    metaTitle: "Whisper Resume Template — Free Ultra-Minimal CV | Cvyon",
    metaDescription:
      "Free Whisper resume template: extreme whitespace with a tiny name and whisper-quiet type. Minimalism for the confident.",
  },
  {
    id: "Paper",
    slug: "paper",
    name: "Paper",
    tagline: "Hairline rules and quiet serif — paper-like restraint.",
    description:
      "Paper feels like a beautifully typeset document: quiet serif type, hairline rules under every section header and the contact block, and calm, even spacing. There is no color shouting for attention — just the texture of well-set type. It suits academics, writers, editors, and traditional professionals who believe a resume should read like a fine printed page.",
    bestFor: [
      "Academics and researchers",
      "Writers and editors",
      "Lawyers",
      "Librarians and archivists",
      "Traditional professionals",
    ],
    designTraits: [
      "Quiet serif typography throughout",
      "Hairline rules under headers and contact",
      "Restrained black-and-gray palette",
      "Calm, even single-column spacing",
      "Printed-page character",
    ],
    atsNotes:
      "Single column, real text, standard headings, minimal styling — an excellent choice for the strictest ATS portals.",
    faqs: [
      {
        q: "Can I add color to Paper?",
        a: "The design is intentionally near-monochrome; your theme color appears only in the subtlest accents.",
      },
      {
        q: "Is serif type okay for ATS?",
        a: "Yes — parsers read characters, not typefaces. Serif versus sans makes no difference to parsing.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Very — about as safe as a resume can be.",
      },
    ],
    metaTitle: "Paper Resume Template — Free Serif Minimal CV | Cvyon",
    metaDescription:
      "Free Paper resume template: hairline rules and quiet serif type. Paper-like restraint for academics, writers, and traditional roles.",
  },
  {
    id: "Blank",
    slug: "blank",
    name: "Blank",
    tagline: "No decoration at all: bold type and tight lines.",
    description:
      "Blank strips the resume to its essence: your name, your details, and bold small section headers — no rules, no colors, no ornaments. Roles and companies run on single tight lines with compact bullets. It is the fastest-reading resume in the collection, built for high-volume hiring where recruiters spend seconds, not minutes, per page.",
    bestFor: [
      "High-volume job applicants",
      "Engineers and technical staff",
      "Operations and logistics",
      "Government and civil service applications",
      "Anyone who values speed of reading",
    ],
    designTraits: [
      "Zero decoration — pure typographic hierarchy",
      "Bold small section headers",
      "Tight single-line role and company rows",
      "Compact bullet spacing",
      "Maximum content density without clutter",
    ],
    atsNotes:
      "The most parser-friendly layout possible: single column, plain text, standard headings, no styling that could confuse any system.",
    faqs: [
      {
        q: "Does it look too plain?",
        a: "Plain is the point — Blank is for situations where content must win in seconds. For more visual presence, try Marquee or Billboard.",
      },
      {
        q: "Can I add any color?",
        a: "Blank is intentionally monochrome to maximize compatibility and print economy.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Maximally — this is the safest template in the collection for strict parsers.",
      },
    ],
    metaTitle: "Blank Resume Template — Free Ultra-Plain CV | Cvyon",
    metaDescription:
      "Free Blank resume template: zero decoration, bold type, tight lines. The fastest-reading, most ATS-safe resume in the collection.",
  },
  {
    id: "Still",
    slug: "still",
    name: "Still",
    tagline: "Fully centered and quiet: a calm serif composition.",
    description:
      "Still centers everything — name, title, contact, section headers, and body — in a calm serif composition with soft gray tones and delicate dividers. The symmetry gives the page a meditative, balanced feel. It suits contemplative professions and anyone whose personal brand is calm competence: counselors, clergy, academics, and writers.",
    bestFor: [
      "Counselors and therapists",
      "Clergy and chaplains",
      "Academics",
      "Writers and poets",
      "Wellness professionals",
    ],
    designTraits: [
      "Fully centered layout",
      "Calm serif typography",
      "Soft gray tones",
      "Delicate centered dividers",
      "Symmetrical, meditative composition",
    ],
    atsNotes:
      "Centered text parses the same as left-aligned text — parsers read characters, not alignment. Single column with standard headings keeps it safe.",
    faqs: [
      {
        q: "Is centered text hard to read?",
        a: "For long paragraphs it can be, so Still keeps entries concise. The symmetry is the design's signature — embrace it or choose a left-aligned template.",
      },
      {
        q: "Does centering hurt ATS parsing?",
        a: "No — alignment does not affect how parsers read text.",
      },
      {
        q: "Is it professional enough for corporate roles?",
        a: "Still is calm rather than corporate — it fits helping professions, academia, and creative writing better than banking or sales.",
      },
    ],
    metaTitle: "Still Resume Template — Free Centered Serif CV | Cvyon",
    metaDescription:
      "Free Still resume template: a fully centered, quiet serif composition. Calm and balanced for counselors, academics, and writers.",
  },
  {
    id: "Hush",
    slug: "hush",
    name: "Hush",
    tagline: "Muted tones with soft dotted dividers.",
    description:
      "Hush speaks softly: your name left-aligned in bold, contact muted on the right, sections divided by gentle dotted rules, and your summary set in a soft tinted card. Muted grays keep the whole page calm and approachable. It is a kind, understated design for people-focused roles where warmth and clarity matter more than flash.",
    bestFor: [
      "HR and people operations",
      "Customer support professionals",
      "Teachers and teaching assistants",
      "Healthcare support roles",
      "Nonprofit professionals",
    ],
    designTraits: [
      "Muted gray tones throughout",
      "Soft dotted section dividers",
      "Summary set in a tinted card",
      "Left name with right-aligned muted contact",
      "Gentle, approachable character",
    ],
    atsNotes:
      "Single column, real text, standard headings — the dotted dividers and tint are pure styling that parsers ignore.",
    faqs: [
      {
        q: "Are the dotted dividers professional?",
        a: "They are soft rather than stark — a deliberate, gentle look that suits people-focused roles.",
      },
      {
        q: "Can I strengthen the contrast?",
        a: "Your theme color drives the accents; the muted grays are part of the design's calm character.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column flow with conventional headings and real text throughout.",
      },
    ],
    metaTitle: "Hush Resume Template — Free Soft Minimal CV | Cvyon",
    metaDescription:
      "Free Hush resume template: muted tones with soft dotted dividers. Gentle and understated for people-focused roles.",
  },
  {
    id: "Meadow",
    slug: "meadow",
    name: "Meadow",
    tagline: "Soft sage accents and room to breathe.",
    description:
      "Meadow wraps your resume in a soft sage-green world: your title glows in sage, section headers carry a sage underline, skills become gentle rounded chips in a sage tint, and even the bullet dots are sage. Wide padding gives every line space to breathe. The result feels human and warm — professional without any of the cold corporate stiffness.",
    bestFor: [
      "Healthcare and wellness professionals",
      "Teachers and educators",
      "Nonprofit and NGO workers",
      "Customer experience roles",
      "Anyone who wants a warm, approachable resume",
    ],
    designTraits: [
      "Signature sage-green accent system",
      "Soft rounded skill chips in sage tint",
      "Sage bullet dots and section underlines",
      "Wide comfortable page padding",
      "Relaxed humanist rhythm throughout",
    ],
    atsNotes:
      "Single-column flow with real text parses cleanly. The sage color is styling only — all content remains plain selectable text with standard section headings.",
    faqs: [
      {
        q: "Will the green color look unprofessional?",
        a: "Meadow uses a muted, desaturated sage — closer to a warm gray than a bright green — so it reads calm and refined rather than flashy.",
      },
      {
        q: "Is Meadow ATS-friendly?",
        a: "Yes: single-column layout, real text, conventional headings. The color accents are pure CSS on top of normal text.",
      },
      {
        q: "Can I change the sage color?",
        a: "Meadow's sage is fixed as the design's signature, but your Cvyon theme color applies across the builder for other elements.",
      },
    ],
    metaTitle: "Meadow Resume Template — Free Soft Green CV | Cvyon",
    metaDescription:
      "Free Meadow resume template: a warm single-column CV with soft sage accents and skill chips. Ideal for healthcare, education, and nonprofit roles.",
  },
  {
    id: "Drift",
    slug: "drift",
    name: "Drift",
    tagline: "Effortless flow — no rules, no boxes, just rhythm.",
    description:
      "Drift lets your career read like a stream: slate-gray type on a rule-free page where section headers simply float in bold, bullets are replaced by flowing paragraph lines, and skills join into an easy inline stream. Nothing is boxed or divided. For readers, it is the most relaxed resume in the collection — and for you, the easiest to write.",
    bestFor: [
      "Creatives who want calm, not clutter",
      "Career changers with narrative stories",
      "Freelancers and contractors",
      "Marketing and communications professionals",
      "Anyone tired of rigid resume grids",
    ],
    designTraits: [
      "Rule-free layout — no dividers or boxes",
      "Floating bold section headers",
      "Paragraph-style flowing achievement lines",
      "Skills as an inline dotted stream",
      "Soft slate-gray palette",
    ],
    atsNotes:
      "Single column, real text, standard headings — parsing is simple. The flowing bullet style uses separate paragraph lines, so each achievement still reads as its own line.",
    faqs: [
      {
        q: "Does the lack of bullets make achievements hard to scan?",
        a: "Each achievement is its own spaced paragraph line, so scanning still works — it just feels calmer than a bullet wall.",
      },
      {
        q: "Is Drift professional enough for corporate roles?",
        a: "Its slate palette and disciplined spacing keep it serious; the rule-free style reads as confident, not casual.",
      },
      {
        q: "Will ATS systems handle the flowing bullets?",
        a: "Yes — they are ordinary text lines. Parsers pick them up the same as standard bullets.",
      },
    ],
    metaTitle: "Drift Resume Template — Free Relaxed Flow CV | Cvyon",
    metaDescription:
      "Free Drift resume template: a rule-free slate resume with floating headers and flowing text. Calm, modern, and effortless to read.",
  },
  {
    id: "Calm",
    slug: "calm",
    name: "Calm",
    tagline: "Generous margins, slow rhythm, serif grace.",
    description:
      "Calm is the most spacious resume in the collection: 1.25-inch margins, warm-gray serif type, and line heights up to double-spaced so every sentence has room to land. Roles are set large, achievements are plain un-bulleted lines, and section titles are quiet letterspaced caps. It reads like a well-printed book — unhurried, assured, and quietly senior.",
    bestFor: [
      "Senior executives",
      "Academics and researchers",
      "Therapists and counselors",
      "Nonprofit leaders",
      "Anyone whose experience deserves unhurried reading",
    ],
    designTraits: [
      "Extra-wide 1.25-inch page margins",
      "Warm-gray serif typography",
      "Double line spacing for slow rhythm",
      "Plain un-bulleted achievement lines",
      "Quiet letterspaced section caps",
    ],
    atsNotes:
      "Single column with real text and conventional headings parses well. Very long careers may run past one page at this spacious sizing — that is the intended trade-off.",
    faqs: [
      {
        q: "Will Calm fit on one page?",
        a: "Calm's spacious sizing favors careers that read well across two pages. For very long histories, a denser template may fit better.",
      },
      {
        q: "Is serif type safe for ATS?",
        a: "Yes — ATS parsers read text content, not fonts. All text here is real and selectable.",
      },
      {
        q: "Why are there no bullets?",
        a: "Plain spaced lines keep the rhythm slow and elegant. Each achievement still sits on its own line for easy scanning.",
      },
    ],
    metaTitle: "Calm Resume Template — Free Spacious Serif CV | Cvyon",
    metaDescription:
      "Free Calm resume template: wide margins, warm serif type, and unhurried spacing. A graceful resume for senior and academic professionals.",
  },
  {
    id: "Bare",
    slug: "bare",
    name: "Bare",
    tagline: "Your whole career as clean running prose.",
    description:
      "Bare strips the resume to its essence: no boxes, no bullets, no dividers — just elegant serif paragraphs where each section opens with a bold run-in lead (\"Experience.\") and flows on. Roles chain together with em dashes, details join with semicolons, and your contact line sits inline under your name. It is the boldest minimalism in the collection, and it reads with remarkable narrative force.",
    bestFor: [
      "Writers and authors",
      "Senior professionals with story-like careers",
      "Consultants and advisors",
      "Academics with narrative CVs",
      "Minimalists who trust their words",
    ],
    designTraits: [
      "Run-in paragraph section headers",
      "No bullets, boxes, or dividers",
      "Roles chained with em dashes",
      "Inline contact line under the name",
      "Elegant serif prose styling",
    ],
    atsNotes:
      "All content is real single-column text, which parses fine. The unconventional run-in headings mean you should confirm the parser detects section titles — most modern parsers will.",
    faqs: [
      {
        q: "Is Bare too unconventional for job applications?",
        a: "It suits fields where voice and narrative matter — writing, consulting, academia. For rigid corporate portals, pair it with a conventional PDF export.",
      },
      {
        q: "How do recruiters scan it without bullets?",
        a: "Bold role names and section lead-ins create natural scanning anchors; the prose flows between them.",
      },
      {
        q: "Will my achievements get lost in the paragraphs?",
        a: "Keep each achievement as a short clause separated by semicolons, and the rhythm stays punchy rather than dense.",
      },
    ],
    metaTitle: "Bare Resume Template — Free Prose-Style CV | Cvyon",
    metaDescription:
      "Free Bare resume template: a bold prose-style resume with run-in section headers. For writers, consultants, and narrative careers.",
  },
  {
    id: "Byline",
    slug: "byline",
    name: "Byline",
    tagline: "Your career, reported like front-page news.",
    description:
      "Byline treats your resume like a newspaper feature: your location opens as a dateline kicker, your name sets huge under a double rule, and a proper \"By\" byline carries your contact details. Sections get journalistic kicker-and-headline treatment, and your summary opens with a classic drop cap. It is storytelling structure applied to a career — and it makes recruiters want to keep reading.",
    bestFor: [
      "Journalists and media professionals",
      "PR and communications specialists",
      "Content strategists",
      "Authors and editors",
      "Anyone with a story worth reporting",
    ],
    designTraits: [
      "Dateline kicker with your location",
      "\"By\" byline contact line",
      "Double-rule newspaper header",
      "Kicker-and-headline section treatment",
      "Drop-cap summary opener",
    ],
    atsNotes:
      "Single-column, real text, conventional headings — parsing is clean. The journalistic kickers are styled text, not images, so nothing is lost to parsers.",
    faqs: [
      {
        q: "Is a journalism-style resume right for non-media roles?",
        a: "The structure reads as narrative confidence in any field — it suits marketers, founders, and communicators of every kind.",
      },
      {
        q: "Does the drop cap break text selection?",
        a: "No — it is a styled first letter of real text, fully selectable and parseable.",
      },
      {
        q: "Can I remove the dateline?",
        a: "The dateline only appears when you have a location in your profile; leave location blank and it disappears.",
      },
    ],
    metaTitle: "Byline Resume Template — Free Journalist-Style CV | Cvyon",
    metaDescription:
      "Free Byline resume template: a newspaper-style resume with dateline, byline, and drop-cap summary. Perfect for media and communications professionals.",
  },
  {
    id: "Column",
    slug: "column",
    name: "Column",
    tagline: "A magazine feature with a 65/35 story-and-notes layout.",
    description:
      "Column is a magazine spread for your career: a feature-style header with a \"Résumé\" kicker, then a wide 65% main column carrying your summary and experience beside a 35% side column of pull-quoted skills, education, and notes. Section kickers in your theme color act as magazine eyebrows. It feels editorial and substantial — ideal when your experience deserves feature treatment.",
    bestFor: [
      "Designers and art directors",
      "Marketing leaders",
      "Editors and publishers",
      "Brand strategists",
      "Professionals with rich, multi-part careers",
    ],
    designTraits: [
      "Magazine feature header with kicker",
      "65/35 main-and-notes column split",
      "Theme-colored editorial kickers",
      "Pull-quote style sidebar skills",
      "Serif feature typography",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers — keep job titles and employers in the main column. All text is real and selectable; modern parsers handle it well.",
    faqs: [
      {
        q: "Will the two-column layout confuse ATS?",
        a: "Modern parsers handle two columns well, and all text is real. For very old portals, a single-column template is the safest fallback.",
      },
      {
        q: "What goes in the side column?",
        a: "Skills, education, certifications, and custom sections — the supporting material — while experience owns the main column.",
      },
      {
        q: "Can I change the kicker labels?",
        a: "The kickers are part of the editorial design; your section content and theme color are fully yours to control.",
      },
    ],
    metaTitle: "Column Resume Template — Free Magazine-Style CV | Cvyon",
    metaDescription:
      "Free Column resume template: a magazine-style two-column resume with editorial kickers. For designers, marketers, and editorial professionals.",
  },
  {
    id: "Spread",
    slug: "spread",
    name: "Spread",
    tagline: "Full-bleed feature energy with a drop-cap summary.",
    description:
      "Spread opens like a magazine cover story: a full-width tinted header with your name at display size, then a summary that begins with a giant theme-colored drop cap. Section headings are large and editorial, experience entries carry a theme-colored left border, and skills are generous pill chips. It is the boldest editorial template in the collection — presence on the page, guaranteed.",
    bestFor: [
      "Creative directors",
      "Founders and entrepreneurs",
      "Public speakers and thought leaders",
      "Senior marketers",
      "Anyone who wants maximum presence",
    ],
    designTraits: [
      "Full-width tinted feature header",
      "Display-size name typography",
      "Theme-colored drop-cap summary",
      "Theme-bordered experience entries",
      "Large pill skill chips",
    ],
    atsNotes:
      "Single-column body with real text and standard headings parses cleanly. The large display header is real selectable text, not an image.",
    faqs: [
      {
        q: "Is Spread too bold for conservative industries?",
        a: "It is built for creative and leadership roles. For banking or law, choose a quieter template from the Formal family.",
      },
      {
        q: "Does the drop cap affect parsing?",
        a: "No — it is a styled first letter of real text.",
      },
      {
        q: "Can I tone down the header?",
        a: "The tinted header is the design's signature; your theme color controls the accent details throughout.",
      },
    ],
    metaTitle: "Spread Resume Template — Free Bold Editorial CV | Cvyon",
    metaDescription:
      "Free Spread resume template: a bold editorial resume with a feature header and drop-cap summary. For creatives, founders, and leaders.",
  },
  {
    id: "Gutter",
    slug: "gutter",
    name: "Gutter",
    tagline: "Dates live in the margins — your story owns the page.",
    description:
      "Gutter borrows a book-design trick: every role's dates sit in a dedicated left margin column in small italic type, leaving your main column entirely for roles, companies, and achievements. Wide outer margins and a serif face complete the printed-book feel. The result is a resume that reads like a well-typeset chapter of your career.",
    bestFor: [
      "Academics and researchers",
      "Editors and publishers",
      "Lawyers and legal professionals",
      "Policy professionals",
      "Readers who love printed books",
    ],
    designTraits: [
      "Dedicated margin column for dates",
      "Small italic marginalia date style",
      "Wide book-like outer margins",
      "Serif typesetting throughout",
      "Clean grid-aligned rows",
    ],
    atsNotes:
      "The margin dates are real text in a grid layout. Some older parsers read grids in unexpected order — check your PDF export's reading order for critical applications.",
    faqs: [
      {
        q: "Will the margin dates confuse recruiters?",
        a: "The grid alignment is precise, so dates clearly belong to their rows. Recruiters actually scan them faster in the margin.",
      },
      {
        q: "Is Gutter ATS-safe?",
        a: "Mostly — verify the reading order in your exported PDF for roles where parsing matters most.",
      },
      {
        q: "What if a role has no dates?",
        a: "The margin cell simply stays empty and the row still aligns cleanly.",
      },
    ],
    metaTitle: "Gutter Resume Template — Free Book-Style CV | Cvyon",
    metaDescription:
      "Free Gutter resume template: a book-style resume with dates in the margins. Elegant serif typesetting for academics and professionals.",
  },
  {
    id: "Folio",
    slug: "folio",
    name: "Folio",
    tagline: "A printed-folio resume with a running head.",
    description:
      "Folio is designed like a fine printed document: a running head at the top of the page carries your name and \"Résumé\" in theme-colored caps, your name and \"Curriculum Vitae\" face each other in a classic folio header, and every section heading extends a hairline rule to the page edge. It feels archival and deliberate — the resume equivalent of quality paper.",
    bestFor: [
      "Academics and scholars",
      "Archivists and librarians",
      "Legal professionals",
      "Diplomats and civil servants",
      "Traditional professions",
    ],
    designTraits: [
      "Running head with name and Résumé",
      "Classic folio name/CV header pairing",
      "Section rules extending to page edge",
      "Serif typography throughout",
      "Print-document formality",
    ],
    atsNotes:
      "Single-column, real text, conventional headings — clean parsing. The running head is styled text, not an image.",
    faqs: [
      {
        q: "Is the running head repeated on every page?",
        a: "It appears at the top of the page as a design element, keeping your name visible wherever the reader looks.",
      },
      {
        q: "Does Folio work for modern tech roles?",
        a: "Its formality suits traditional fields best; tech candidates may prefer a template from the Modern Tech family.",
      },
      {
        q: "Can I change the running head text?",
        a: "It automatically uses your name; without a name it reads \"Curriculum Vitae\".",
      },
    ],
    metaTitle: "Folio Resume Template — Free Classic Print CV | Cvyon",
    metaDescription:
      "Free Folio resume template: a classic print-style CV with running head and folio header. For academics, legal, and traditional professionals.",
  },
  {
    id: "Kerning",
    slug: "kerning",
    name: "Kerning",
    tagline: "Extreme letterspacing as a design statement.",
    description:
      "Kerning makes typography the entire design: your name sets uppercase with dramatic tracking, your title and contact follow in tracked caps, section headings carry even wider spacing above a solid black rule, and even roles and dates are letterspaced. There is no color beyond black and gray — the rhythm of spaced letters does all the talking. Striking, architectural, and unmistakable.",
    bestFor: [
      "Graphic designers",
      "Typographers and brand designers",
      "Architects",
      "Fashion industry professionals",
      "Design-literate hiring managers",
    ],
    designTraits: [
      "Dramatically tracked uppercase name",
      "Letterspaced headings above a black rule",
      "Tracked roles, companies, and dates",
      "Strict black-and-gray palette",
      "Architectural sans-serif rhythm",
    ],
    atsNotes:
      "All text is real and selectable; letter-spacing is CSS styling that parsers ignore. Single-column flow keeps reading order clean.",
    faqs: [
      {
        q: "Does heavy letterspacing break ATS parsing?",
        a: "No — letter-spacing is visual styling on ordinary text. Parsers read the underlying characters normally.",
      },
      {
        q: "Is Kerning readable at a glance?",
        a: "The extreme tracking is deliberate and consistent, so the eye quickly adapts. It is a statement piece — best for design-aware audiences.",
      },
      {
        q: "Can I add color?",
        a: "Kerning's discipline is its black-and-gray restraint; that monochrome identity is the design.",
      },
    ],
    metaTitle: "Kerning Resume Template — Free Typographic CV | Cvyon",
    metaDescription:
      "Free Kerning resume template: a bold typographic resume built on dramatic letterspacing. For designers and typography lovers.",
  },
  {
    id: "Pullquote",
    slug: "pullquote",
    name: "Pullquote",
    tagline: "Your summary as the centerpiece quote.",
    description:
      "Pullquote puts your professional summary on a pedestal: centered under your name, set large and italic beneath a giant theme-colored quotation mark with a rule below. The message is clear — this is what you're about. Section headings then carry a theme-colored left border as the resume settles into a clean serif flow. Confident, personal, and memorable.",
    bestFor: [
      "Executives with a clear value proposition",
      "Consultants and coaches",
      "Speakers and authors",
      "Sales leaders",
      "Anyone with a summary worth spotlighting",
    ],
    designTraits: [
      "Oversized pull-quote summary centerpiece",
      "Giant theme-colored quotation mark",
      "Centered name header",
      "Theme-bordered serif section heads",
      "Clean single-column body",
    ],
    atsNotes:
      "Single column with real text and standard headings parses well. The quotation mark is a text character, not an image.",
    faqs: [
      {
        q: "What if my summary is long?",
        a: "Keep it to two or three sentences — the pull-quote treatment shines with a tight, quotable statement.",
      },
      {
        q: "Does the big quote mark affect ATS?",
        a: "No — it is an ordinary text character around real selectable text.",
      },
      {
        q: "Is Pullquote too personal for corporate roles?",
        a: "It suits leadership and client-facing roles best; for strictly technical roles, a plainer template may fit better.",
      },
    ],
    metaTitle: "Pullquote Resume Template — Free Statement CV | Cvyon",
    metaDescription:
      "Free Pullquote resume template: a resume built around your summary as a pull-quote centerpiece. For executives, consultants, and coaches.",
  },
  {
    id: "Marginalia",
    slug: "marginalia",
    name: "Marginalia",
    tagline: "Supporting details live in the margins.",
    description:
      "Marginalia runs your career down a generous 68% main column while skills, education, and certifications become annotated notes in a side margin under theme-colored \"Margin Notes\" headings with accent rules. It feels like a scholar's annotated manuscript — the main argument flows uninterrupted while the evidence sits beside it. Distinctive, literate, and highly scannable.",
    bestFor: [
      "Researchers and analysts",
      "Technical specialists with long skill lists",
      "Academics",
      "Consultants",
      "Anyone with substantial supporting credentials",
    ],
    designTraits: [
      "68% main column with margin notes",
      "Theme-colored margin headings with rules",
      "Annotated-manuscript aesthetic",
      "Uninterrupted main career flow",
      "Serif typography throughout",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers — keep job titles and employers in the main column. All text is real and selectable.",
    faqs: [
      {
        q: "What belongs in the margin?",
        a: "Skills, education, certifications, and custom sections — everything that supports rather than drives your story.",
      },
      {
        q: "Will ATS handle the margin layout?",
        a: "Modern parsers do; for older portals, verify the exported PDF's reading order.",
      },
      {
        q: "Can the margin hold custom sections?",
        a: "Yes — custom sections you add appear in the margin notes area.",
      },
    ],
    metaTitle: "Marginalia Resume Template — Free Margin-Notes CV | Cvyon",
    metaDescription:
      "Free Marginalia resume template: an annotated-manuscript resume with margin notes beside your career flow. For researchers and specialists.",
  },
  {
    id: "OpEd",
    slug: "oped",
    name: "OpEd",
    tagline: "An opinion-page voice for your career.",
    description:
      "OpEd gives your resume the authority of a newspaper opinion page: your job title opens as a tracked-out theme-colored kicker, your name lands like a 5xl headline, and a heavy four-pixel rule slams the masthead shut. Section heads are bold serif with double borders, and your summary reads as the lede paragraph. It is for professionals with a point of view — and the record to back it.",
    bestFor: [
      "Executives and thought leaders",
      "Policy professionals",
      "Journalists and commentators",
      "Founders",
      "Anyone with strong professional convictions",
    ],
    designTraits: [
      "Tracked theme-colored title kicker",
      "Oversized 5xl headline name",
      "Heavy four-pixel masthead rule",
      "Bold serif section heads with double borders",
      "Lede-style summary paragraph",
    ],
    atsNotes:
      "Single column, real text, standard headings — parsing is clean. The heavy rules are CSS borders, not images.",
    faqs: [
      {
        q: "Is OpEd too aggressive for job applications?",
        a: "It is assertive by design — ideal for leadership, media, and advocacy roles where voice matters.",
      },
      {
        q: "Does the kicker-style title help?",
        a: "It frames your professional identity before the name even registers, like a columnist's beat.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes: single-column flow, real selectable text, conventional section headings.",
      },
    ],
    metaTitle: "OpEd Resume Template — Free Editorial Voice CV | Cvyon",
    metaDescription:
      "Free OpEd resume template: an opinion-page style resume with headline presence. For executives, founders, and thought leaders.",
  },
  {
    id: "Squeeze",
    slug: "squeeze",
    name: "Squeeze",
    tagline: "Your whole identity on a single line.",
    description:
      "Squeeze is the ultimate space-saver: your name, title, and full contact line compress into one elegant inline header under a slim theme-colored top strip. Everything below runs compact at 13px with tight spacing and minimal section heads. When you need every achievement on a single page — or you're emailing recruiters who skim — Squeeze delivers maximum content with minimum fuss.",
    bestFor: [
      "Professionals condensing long careers to one page",
      "Contractors with many engagements",
      "Technical specialists with long skill lists",
      "Anyone told their resume must be one page",
      "High-volume applicants",
    ],
    designTraits: [
      "Single-line inline name/title/contact header",
      "Slim theme-colored top strip",
      "Compact 13px body type",
      "Tight disciplined spacing",
      "Minimal uppercase section heads",
    ],
    atsNotes:
      "Single-column, real text, standard headings — parses cleanly. Compact sizing does not affect parsing since all text remains selectable.",
    faqs: [
      {
        q: "Is 13px text too small?",
        a: "It matches what many professional resumes use, with strong hierarchy keeping everything scannable.",
      },
      {
        q: "Can Squeeze really fit on one page?",
        a: "That is its purpose — the inline header alone saves several lines, and tight spacing compounds the savings.",
      },
      {
        q: "Does compression hurt readability?",
        a: "Spacing is disciplined rather than cramped, and theme-colored heads keep the structure obvious.",
      },
    ],
    metaTitle: "Squeeze Resume Template — Free Ultra-Compact CV | Cvyon",
    metaDescription:
      "Free Squeeze resume template: an ultra-compact one-pager with an inline header. Fit more on one page without looking cramped.",
  },
  {
    id: "Capsule",
    slug: "capsule",
    name: "Capsule",
    tagline: "An even 50/50 two-column body, perfectly balanced.",
    description:
      "Capsule splits your resume into two equal columns under a centered spanning header: experience flows down the left while education, skills, and credentials stack down the right. Theme-colored section borders keep both columns anchored, and the symmetry makes the page feel orderly and complete. It is the balanced two-column — neither sidebar-dominant nor cramped.",
    bestFor: [
      "Mid-career professionals",
      "Project managers",
      "Designers",
      "Consultants",
      "Anyone who wants balance between story and credentials",
    ],
    designTraits: [
      "Even 50/50 two-column body",
      "Centered full-width header",
      "Theme-colored section borders",
      "Symmetrical, orderly page feel",
      "Compact readable sizing",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers — keep job titles and employers in the left column. All text is real and selectable.",
    faqs: [
      {
        q: "How is Capsule different from sidebar templates?",
        a: "Both columns are equal partners rather than main-plus-sidebar, giving credentials the same visual weight as experience.",
      },
      {
        q: "Will ATS read the columns in order?",
        a: "Modern parsers handle it; verify the exported PDF reading order for critical applications.",
      },
      {
        q: "What goes in the right column?",
        a: "Education, skills, certifications, and custom sections — the credentials that support your experience.",
      },
    ],
    metaTitle: "Capsule Resume Template — Free Balanced Two-Column CV | Cvyon",
    metaDescription:
      "Free Capsule resume template: a balanced 50/50 two-column resume under a centered header. Orderly and complete for mid-career professionals.",
  },
  {
    id: "Throttle",
    slug: "throttle",
    name: "Throttle",
    tagline: "Everything in grids — micro header, maximum structure.",
    description:
      "Throttle runs your resume like a dashboard: a micro header with your name small and contact right-aligned, then every section becomes a grid — skills in a four-column tile grid, experience as bordered cards in a two-column grid, all in cool slate. It is dense, systematic, and unmistakably modern. For technical minds who think in systems, it feels like home.",
    bestFor: [
      "Software engineers",
      "Data analysts",
      "Systems administrators",
      "Technical project managers",
      "Anyone who loves structured information",
    ],
    designTraits: [
      "Micro header with right-aligned contact",
      "Four-column skills tile grid",
      "Two-column bordered experience cards",
      "Cool slate color system",
      "Dashboard-like systematic layout",
    ],
    atsNotes:
      "Grid layouts can challenge older parsers' reading order — check your exported PDF for critical applications. All text is real and selectable.",
    faqs: [
      {
        q: "Is the grid layout ATS-safe?",
        a: "Modern parsers handle grids well, but verify reading order in your PDF export for the most critical applications.",
      },
      {
        q: "Why is the header so small?",
        a: "The micro header trades name size for content density — more of your actual experience fits on the page.",
      },
      {
        q: "Is Throttle too dense?",
        a: "It is deliberately information-rich; technical recruiters who scan for keywords tend to love it.",
      },
    ],
    metaTitle: "Throttle Resume Template — Free Grid-Layout CV | Cvyon",
    metaDescription:
      "Free Throttle resume template: a dashboard-style resume with grid sections and a micro header. For engineers and systems thinkers.",
  },
  {
    id: "Brief",
    slug: "brief",
    name: "Brief",
    tagline: "An executive brief — summary boxed, bullets capped.",
    description:
      "Brief treats your resume like a decision-maker's memo: your professional summary sits in a highlighted \"Executive Summary\" box with a theme-colored spine, and each role shows at most three sharp bullets — forcing the discipline executives respect. Clean heads, calm spacing, zero fluff. When the reader has ninety seconds, Brief makes every one count.",
    bestFor: [
      "Executives and directors",
      "Management consultants",
      "Senior managers",
      "Board candidates",
      "Busy decision-makers' audiences",
    ],
    designTraits: [
      "Boxed Executive Summary panel",
      "Theme-colored summary spine",
      "Three-bullet cap per role",
      "Memo-like clean structure",
      "Calm professional spacing",
    ],
    atsNotes:
      "Single-column, real text, standard headings — parses cleanly. The summary box is styled text, not an image.",
    faqs: [
      {
        q: "Why only three bullets per role?",
        a: "Constraint forces impact: your three strongest achievements per role beat ten forgettable ones.",
      },
      {
        q: "Can I show more bullets?",
        a: "The three-bullet cap is the design's discipline; your full detail can live in your LinkedIn or portfolio.",
      },
      {
        q: "Is Brief right for junior candidates?",
        a: "It is tuned for experienced professionals with a summary worth boxing; juniors may prefer a fuller template.",
      },
    ],
    metaTitle: "Brief Resume Template — Free Executive Summary CV | Cvyon",
    metaDescription:
      "Free Brief resume template: an executive-brief resume with a boxed summary and capped bullets. For leaders who respect the reader's time.",
  },
  {
    id: "Docket",
    slug: "docket",
    name: "Docket",
    tagline: "Every entry numbered like a legal docket.",
    description:
      "Docket numbers everything: sections get docket-style numbered heads (01 — Experience), each role carries its own mono number, and your contact line runs in monospace type. The legal-docket metaphor brings an air of precision and order — every item accounted for, every entry in its place. Distinctive without a hint of gimmick.",
    bestFor: [
      "Legal professionals",
      "Compliance and audit roles",
      "Paralegals",
      "Operations managers",
      "Detail-oriented process professionals",
    ],
    designTraits: [
      "Docket-numbered sections and entries",
      "Monospace numbering in theme color",
      "Mono contact line",
      "Legal-document precision aesthetic",
      "Clean single-column flow",
    ],
    atsNotes:
      "Single-column with real text parses well. The numbers are ordinary text characters that parsers read normally.",
    faqs: [
      {
        q: "Do the numbers confuse ATS parsers?",
        a: "No — they are plain text characters like any other. Section titles remain clearly labeled.",
      },
      {
        q: "Is Docket only for lawyers?",
        a: "The precision aesthetic suits any detail-driven field — audit, operations, compliance, engineering.",
      },
      {
        q: "Why monospace?",
        a: "Monospace numbering echoes legal dockets and technical documents, reinforcing the exactness theme.",
      },
    ],
    metaTitle: "Docket Resume Template — Free Numbered-Entry CV | Cvyon",
    metaDescription:
      "Free Docket resume template: a legal-docket style resume with numbered entries. Precision and order for detail-driven professionals.",
  },
  {
    id: "Satchel",
    slug: "satchel",
    name: "Satchel",
    tagline: "Every section packed into its own padded card.",
    description:
      "Satchel packs your resume like a well-organized bag: each section — summary, experience, education, skills — sits in its own softly padded card with a rounded border, subtle shadow, and theme-colored head. The cards create clear visual compartments while the generous padding keeps everything feeling organized rather than boxed-in. Friendly structure, zero chaos.",
    bestFor: [
      "Generalists with diverse experience",
      "Career changers",
      "Project coordinators",
      "Administrative professionals",
      "Anyone who likes clear compartments",
    ],
    designTraits: [
      "Individual padded section cards",
      "Rounded borders with soft shadows",
      "Theme-colored card heads",
      "Clear visual compartments",
      "Friendly organized feel",
    ],
    atsNotes:
      "Single-column card flow with real text parses cleanly — cards are CSS styling, not images, and content order is preserved.",
    faqs: [
      {
        q: "Do the cards waste space?",
        a: "Padding is calibrated to feel organized, not bloated; the compartments actually help recruiters navigate faster.",
      },
      {
        q: "Is Satchel ATS-friendly?",
        a: "Yes — cards are pure CSS around ordinary text in normal reading order.",
      },
      {
        q: "Can cards span pages?",
        a: "Cards flow naturally with your content across the page.",
      },
    ],
    metaTitle: "Satchel Resume Template — Free Card-Section CV | Cvyon",
    metaDescription:
      "Free Satchel resume template: a friendly resume with each section in its own padded card. Clear compartments for diverse careers.",
  },
  {
    id: "Rucksack",
    slug: "rucksack",
    name: "Rucksack",
    tagline: "A dense 60/40 pack — experience left, credentials right.",
    description:
      "Rucksack packs a lot into a little: a spanning header, then a 60% left column carrying your summary and experience beside a 40% right column densely stacked with skills, education, and certifications. Everything runs compact with tight spacing and small theme-colored heads. It is the template for careers with serious volume — years of roles, stacks of skills, shelves of credentials — all carried comfortably.",
    bestFor: [
      "Senior engineers with long skill lists",
      "Healthcare professionals with many credentials",
      "Academics with extensive histories",
      "IT professionals with certifications",
      "Anyone with more to show than fits elsewhere",
    ],
    designTraits: [
      "Dense 60/40 two-column body",
      "Spanning full-width header",
      "Stacked credentials column",
      "Compact type with tight spacing",
      "High content capacity",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers — keep job titles and employers in the left column. All text is real and selectable.",
    faqs: [
      {
        q: "Is Rucksack too dense to read?",
        a: "Density is disciplined: consistent spacing and small clear heads keep it scannable despite the volume.",
      },
      {
        q: "Will ATS handle the dense columns?",
        a: "Modern parsers do; verify reading order in your exported PDF for critical applications.",
      },
      {
        q: "How much content can it hold?",
        a: "More than any single-column template — the 60/40 split effectively adds half a page of capacity.",
      },
    ],
    metaTitle: "Rucksack Resume Template — Free High-Capacity CV | Cvyon",
    metaDescription:
      "Free Rucksack resume template: a dense 60/40 two-column resume for high-volume careers. Carry more credentials comfortably.",
  },
  {
    id: "Vellum",
    slug: "vellum",
    name: "Vellum",
    tagline: "Engraved elegance — fine rules, letterspaced serif.",
    description:
      "Vellum is crafted like a fine engraving: your name sets centered and uppercase with wide letterspacing between double rules, section headings sit centered and flanked by hairlines, and your summary runs centered and italic. Everything is serif, everything is deliberate. It is the most formal, ceremonial resume in the collection — for careers that deserve a sense of occasion.",
    bestFor: [
      "Senior executives",
      "Diplomats and dignitaries",
      "Academics",
      "Legal professionals",
      "Formal and ceremonial contexts",
    ],
    designTraits: [
      "Engraved double-rule title block",
      "Centered uppercase letterspaced name",
      "Hairline-flanked section headings",
      "Centered italic summary",
      "Pure serif formality",
    ],
    atsNotes:
      "Single-column, real text, conventional headings — parsing is clean. The decorative rules are CSS borders, not images.",
    faqs: [
      {
        q: "Is Vellum too formal for modern roles?",
        a: "It is intentionally ceremonial — best for senior, traditional, or formal contexts rather than startups.",
      },
      {
        q: "Does centered text hurt readability?",
        a: "The centered elements are short (name, headings, summary); body content like experience stays structured for scanning.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column flow with real selectable text throughout.",
      },
    ],
    metaTitle: "Vellum Resume Template — Free Engraved Formal CV | Cvyon",
    metaDescription:
      "Free Vellum resume template: an engraved-style formal resume with fine rules and serif elegance. For senior and ceremonial careers.",
  },
  {
    id: "Quarto",
    slug: "quarto",
    name: "Quarto",
    tagline: "Your career as a book — chapters in roman numerals.",
    description:
      "Quarto turns your resume into a beautifully bound book: a title-page header with your name and a theme rule, then each section opens as a numbered chapter — Chapter I, Chapter II — with a theme-colored drop cap on the chapter title. Your summary gets its own drop-cap preface. For readers, it is delightful; for you, it frames a career as a story with real structure.",
    bestFor: [
      "Authors and writers",
      "Academics",
      "Historians and researchers",
      "Senior professionals with storied careers",
      "Anyone whose career reads like a narrative",
    ],
    designTraits: [
      "Book title-page header",
      "Roman-numeral chapter numbering",
      "Theme drop caps on chapter titles",
      "Drop-cap summary preface",
      "Literary serif design",
    ],
    atsNotes:
      "Single-column with real text parses well. Chapter titles include the section name (e.g. \"Experience\") alongside the numeral, so parsers detect them.",
    faqs: [
      {
        q: "Will ATS recognize \"Chapter I\" as Experience?",
        a: "Chapter titles pair the numeral with the plain section name, so parsers see \"Experience\" normally.",
      },
      {
        q: "Is Quarto too playful for serious roles?",
        a: "It is literary rather than playful — best for fields that value narrative and intellect.",
      },
      {
        q: "Do the drop caps affect text selection?",
        a: "No — they are styled first letters of real, selectable text.",
      },
    ],
    metaTitle: "Quarto Resume Template — Free Book-Style CV | Cvyon",
    metaDescription:
      "Free Quarto resume template: a book-style resume with roman-numeral chapters and drop caps. For writers, academics, and storied careers.",
  },
  {
    id: "Manuscript",
    slug: "manuscript",
    name: "Manuscript",
    tagline: "Sepia ink, justified lines — an old-style manuscript.",
    description:
      "Manuscript is set entirely in warm sepia ink like a treasured document: your name large at center, your summary justified and italic like a manuscript paragraph, and section headings in tracked sepia caps over soft rules. Experience entries pair bold roles with italic companies and dates. It feels archival and personal — a resume with the warmth of handwritten history.",
    bestFor: [
      "Historians and archivists",
      "Writers and poets",
      "Academics in the humanities",
      "Museum and heritage professionals",
      "Anyone drawn to classic documents",
    ],
    designTraits: [
      "Warm sepia ink throughout",
      "Justified italic summary paragraph",
      "Tracked sepia section caps",
      "Italic company and date styling",
      "Archival manuscript character",
    ],
    atsNotes:
      "Single-column, real text, conventional headings — parses cleanly. Sepia is styling only; parsers read the underlying text normally.",
    faqs: [
      {
        q: "Is sepia ink professional?",
        a: "The warm brown reads as classic and archival rather than casual — it suits humanities and heritage fields beautifully.",
      },
      {
        q: "Does justified text cause parsing issues?",
        a: "No — justification is visual spacing; the text content and order are unchanged.",
      },
      {
        q: "Will it print well?",
        a: "Sepia prints as a rich warm tone on any printer, in both color and grayscale.",
      },
    ],
    metaTitle: "Manuscript Resume Template — Free Sepia Classic CV | Cvyon",
    metaDescription:
      "Free Manuscript resume template: a sepia-ink manuscript-style resume with justified text. Warm and archival for humanities professionals.",
  },
  {
    id: "Calligraphy",
    slug: "calligraphy",
    name: "Calligraphy",
    tagline: "A swash-script name with italic serif grace.",
    description:
      "Calligraphy opens with your name in flowing italic serif — the first letter oversized like a calligrapher's flourish — then carries that elegance through italic section headings with soft rules and uppercase tracked companies. Your summary centers in italic. It is the most graceful template in the collection: refined, personal, and quietly luxurious without ever feeling decorative for its own sake.",
    bestFor: [
      "Creative professionals",
      "Event planners and hospitality",
      "Fashion and luxury industries",
      "Client-facing consultants",
      "Anyone who values refined presentation",
    ],
    designTraits: [
      "Swash italic serif name treatment",
      "Oversized flourish initial",
      "Italic serif section headings",
      "Uppercase tracked company names",
      "Centered italic summary",
    ],
    atsNotes:
      "Single-column, real text, conventional headings — parsing is clean. The italic styling is font styling on ordinary selectable text.",
    faqs: [
      {
        q: "Is the script name hard to read?",
        a: "It is an elegant italic serif, not a handwriting font — legibility is fully preserved with a graceful feel.",
      },
      {
        q: "Is Calligraphy ATS-safe?",
        a: "Yes: single-column flow, real text, standard headings throughout.",
      },
      {
        q: "Does it suit corporate roles?",
        a: "It suits refined industries — luxury, hospitality, creative — best; very conservative fields may prefer a plainer template.",
      },
    ],
    metaTitle: "Calligraphy Resume Template — Free Elegant Script CV | Cvyon",
    metaDescription:
      "Free Calligraphy resume template: an elegant resume with a swash-script name and italic serif grace. Refined presentation for creatives.",
  },
  {
    id: "Parchment",
    slug: "parchment",
    name: "Parchment",
    tagline: "Warm cream paper, brown ink — a resume with archival soul.",
    description:
      "Parchment prints your career on warm cream, like fine stationery: brown ink serif type, double-rule section dividers, and a stately centered header. It feels archival and considered — perfect for academics, writers, and heritage institutions where a plain white page would feel too cold.",
    bestFor: [
      "Academics and researchers",
      "Writers, editors, and publishers",
      "Museum, archive, and heritage professionals",
      "Clergy and nonprofit leaders",
      "Anyone who wants warmth without color noise",
    ],
    designTraits: [
      "Warm cream page background with brown ink text",
      "Double-rule section dividers in parchment tones",
      "Serif typography throughout",
      "Italic job titles and company names",
      "Generous traditional margins",
    ],
    atsNotes:
      "All text is real and selectable on a light background, so parsing is unaffected. The cream tint is subtle enough that printed and scanned copies remain fully legible.",
    faqs: [
      {
        q: "Will the cream background print well?",
        a: "Yes — it is a very light tint that prints cleanly on standard printers and photocopies without obscuring text.",
      },
      {
        q: "Is Parchment too informal for corporate roles?",
        a: "It reads as traditional rather than informal — well suited to education, publishing, and mission-driven organizations.",
      },
      {
        q: "Does the tinted background affect ATS parsing?",
        a: "No — parsers read the text layer, which is standard and fully selectable. The tint is purely visual.",
      },
    ],
    metaTitle: "Parchment Resume Template — Free Warm Cream CV | Cvyon",
    metaDescription:
      "Free Parchment resume template: warm cream background with brown serif ink. An archival, traditional CV for academics and writers.",
  },
  {
    id: "Inscription",
    slug: "inscription",
    name: "Inscription",
    tagline: "Inscriptional caps in the Roman manner — monumental and calm.",
    description:
      "Inscription sets your name like carved stone: wide-tracked uppercase serif, a 'Curriculum Vitae' overline, and stone-gray diamond dividers. Everything is centered and monumental. It suits senior statesmen of their fields — people whose resume should read with gravity and permanence.",
    bestFor: [
      "Senior academics and distinguished professors",
      "Judges, diplomats, and public servants",
      "Architects and classical design professionals",
      "Board members and trustees",
      "Anyone whose career deserves monumental presentation",
    ],
    designTraits: [
      "Wide-tracked inscriptional uppercase serif name",
      "'Curriculum Vitae' overline in spaced caps",
      "Stone-gray diamond-and-rule section dividers",
      "Fully centered monumental composition",
      "Skills as a spaced uppercase inline sequence",
    ],
    atsNotes:
      "All-caps text can slightly slow keyword matching in older parsers, but modern systems normalize case. The single-column structure with clear headings keeps parsing reliable.",
    faqs: [
      {
        q: "Is all-caps text harder for recruiters to read?",
        a: "The generous letter-spacing keeps it readable, and it is used for headers and short lines — body bullets stay in normal case.",
      },
      {
        q: "What fields suit Inscription best?",
        a: "Academia, public service, law, architecture, and governance — anywhere gravitas is an asset.",
      },
      {
        q: "Will ATS systems handle the uppercase text?",
        a: "Modern applicant tracking systems normalize case automatically, so your keywords match normally.",
      },
    ],
    metaTitle: "Inscription Resume Template — Free Monumental Serif CV | Cvyon",
    metaDescription:
      "Free Inscription resume template: Roman-style inscriptional caps in stone gray. A monumental CV for distinguished careers.",
  },
  {
    id: "Sonnet",
    slug: "sonnet",
    name: "Sonnet",
    tagline: "Poetic spacing and centered verse — a resume that breathes.",
    description:
      "Sonnet treats your career like verse: fully centered, stanza-like spacing between entries, italic section markers set between em dashes, and airy line-height throughout. It is a bold, literary choice — best for writers, artists, and educators who want their resume to feel composed rather than merely listed.",
    bestFor: [
      "Writers, poets, and literary professionals",
      "Artists and creative educators",
      "Therapists and counselors",
      "Liberal arts academics",
      "Anyone who wants a distinctive literary presentation",
    ],
    designTraits: [
      "Fully centered composition with stanza-like spacing",
      "Italic section markers between em dashes",
      "Generous line-height for a verse-like rhythm",
      "Serif typography with italic accents",
      "Bullet-free achievement lines",
    ],
    atsNotes:
      "Centered layouts can confuse older parsers' reading order; the text itself is real and selectable. For maximum ATS safety with this design, keep section titles standard and export a PDF to check.",
    faqs: [
      {
        q: "Is Sonnet appropriate for traditional employers?",
        a: "It is a statement design — best for creative, academic, and human-centered fields rather than conservative corporate roles.",
      },
      {
        q: "Why is everything centered?",
        a: "The centered, stanza-like layout is Sonnet's poetic signature — it slows the reader down and gives each role its own verse.",
      },
      {
        q: "How do I keep it to one page?",
        a: "Sonnet's generous spacing rewards brevity — select your strongest roles and let the white space do the talking.",
      },
    ],
    metaTitle: "Sonnet Resume Template — Free Poetic Centered CV | Cvyon",
    metaDescription:
      "Free Sonnet resume template: centered, stanza-like spacing with serif type. A literary CV for writers and creatives.",
  },
  {
    id: "Parse",
    slug: "parse",
    name: "Parse",
    tagline: "Maximum parseability — plain, clean, and machine-friendly.",
    description:
      "Parse is the resume reduced to its essence: plain black sans-serif, standard headings, comma-separated skills, and zero decoration. Nothing competes with your words. It is the safest possible choice for applicant tracking systems and the clearest possible read for humans.",
    bestFor: [
      "Applicants prioritizing ATS compliance above all",
      "Federal and government job applications",
      "High-volume online applications",
      "Career changers who need clarity",
      "Anyone who wants zero visual distraction",
    ],
    designTraits: [
      "Plain black sans-serif with no decoration",
      "Standard section headings in reading order",
      "Comma-separated inline skills list",
      "Simple disc bullets for achievements",
      "Left-aligned header with stacked contact lines",
    ],
    atsNotes:
      "This is the gold standard for ATS parsing: single column, standard headings, no tables, no graphics, no text in headers or footers. If a portal accepts only one format, this is it.",
    faqs: [
      {
        q: "Is Parse too plain for human recruiters?",
        a: "Recruiters consistently say content beats decoration — Parse's clarity lets your achievements carry the full weight.",
      },
      {
        q: "When should I choose Parse over a designed template?",
        a: "When applying through strict ATS portals, government systems, or whenever you want parsing certainty above styling.",
      },
      {
        q: "Can I still show personality in Parse?",
        a: "Through your summary and achievement bullets — Parse gives your words the entire stage.",
      },
    ],
    metaTitle: "Parse Resume Template — Free ATS-Safe Plain CV | Cvyon",
    metaDescription:
      "Free Parse resume template: plain, machine-friendly, maximum ATS parseability. The safest format for online applications.",
  },
  {
    id: "Scanner",
    slug: "scanner",
    name: "Scanner",
    tagline: "Keywords up top — built for the six-second scan.",
    description:
      "Scanner puts your Core Competencies first in a three-column grid, right under your name — so both software and humans meet your keywords immediately. Clear ruled section headers and tight spacing keep the six-second scan working in your favor.",
    bestFor: [
      "Technical professionals with keyword-heavy skill sets",
      "Project managers and operations leaders",
      "Applicants targeting ATS-heavy portals",
      "Consultants with broad competencies",
      "Anyone whose keywords deserve top billing",
    ],
    designTraits: [
      "Core Competencies grid placed before experience",
      "Three-column keyword layout for fast scanning",
      "Ruled uppercase section headers",
      "Role and dates on a single baseline row",
      "Two-column references grid",
    ],
    atsNotes:
      "Excellent for parsing: keywords appear early in the document, single-column flow, standard headings, and real text throughout. The grid is a simple layout that parsers handle well.",
    faqs: [
      {
        q: "Why are skills placed before experience?",
        a: "Both ATS software and recruiters scan the top of the page first — leading with keywords maximizes matches and the six-second scan.",
      },
      {
        q: "Should I list every skill I have?",
        a: "List the ones matching your target roles — a focused keyword set outperforms a exhaustive one.",
      },
      {
        q: "Is the three-column skills grid ATS-safe?",
        a: "Yes — it is a simple text layout with real selectable text, which parsers read in order without trouble.",
      },
    ],
    metaTitle: "Scanner Resume Template — Free Keyword-First ATS CV | Cvyon",
    metaDescription:
      "Free Scanner resume template: skills-first keyword grid with clean ruled headers. Built for ATS portals and fast recruiter scans.",
  },
  {
    id: "Gateway",
    slug: "gateway",
    name: "Gateway",
    tagline: "A bold boxed summary opens the door to your experience.",
    description:
      "Gateway frames your professional summary in a strong double-bordered box — a literal gateway the reader passes through before your experience. Squared section markers and clean spacing keep it confident and architectural without sacrificing ATS friendliness.",
    bestFor: [
      "Professionals with a compelling summary statement",
      "Career changers who need to frame their story",
      "Project managers and operations professionals",
      "Applicants who want one strong focal point",
      "Anyone whose pitch deserves a frame",
    ],
    designTraits: [
      "Double-bordered professional summary box",
      "Squared section markers before each heading",
      "Strong 28px name header",
      "Italic company names for visual rhythm",
      "Two-column references grid",
    ],
    atsNotes:
      "The summary box is a simple border around real text — parsers read straight through it. Single-column body with standard headings keeps everything else straightforward.",
    faqs: [
      {
        q: "Does the boxed summary affect ATS parsing?",
        a: "No — it is a border around normal text, not a text box or image. Parsers read it as ordinary paragraph text.",
      },
      {
        q: "What should go in the boxed summary?",
        a: "Your two-to-three sentence pitch: who you are, your headline strengths, and what you are targeting.",
      },
      {
        q: "Can I remove the box and keep the rest?",
        a: "The box is Gateway's signature — if you prefer it plain, the Parse or Standard templates are the natural alternatives.",
      },
    ],
    metaTitle: "Gateway Resume Template — Free Boxed-Summary CV | Cvyon",
    metaDescription:
      "Free Gateway resume template: a bold boxed professional summary with squared section markers. Make your pitch the gateway.",
  },
  {
    id: "Checkpoint",
    slug: "checkpoint",
    name: "Checkpoint",
    tagline: "A checklist feel — every credential, checked off.",
    description:
      "Checkpoint gives your resume the satisfying order of a checklist: square bullets, checkbox-style section markers, and a two-column Skills Checklist. It reads as organized, thorough, and dependable — the visual equivalent of someone who gets things done.",
    bestFor: [
      "Operations and logistics professionals",
      "Quality assurance and compliance specialists",
      "Project managers and coordinators",
      "Administrative professionals",
      "Anyone who wants to project reliability",
    ],
    designTraits: [
      "Square checkbox-style section markers",
      "Skills presented as a two-column checklist",
      "Square bullets on achievement lines",
      "Each entry wrapped in a checkbox row",
      "Crisp black-on-white with generous spacing",
    ],
    atsNotes:
      "The checkbox styling is CSS-only — all content is real linear text in a single column. Parsers handle it without issues.",
    faqs: [
      {
        q: "Do the checkbox graphics confuse ATS software?",
        a: "No — they are simple styled elements around real text. The document reads as a normal single-column resume.",
      },
      {
        q: "Is Checkpoint too casual for senior roles?",
        a: "It reads as organized and methodical rather than casual — well suited to operations, PM, and compliance leadership.",
      },
      {
        q: "Why a checklist metaphor?",
        a: "It signals thoroughness and follow-through — qualities every hiring manager wants to see verified, line by line.",
      },
    ],
    metaTitle: "Checkpoint Resume Template — Free Checklist-Style CV | Cvyon",
    metaDescription:
      "Free Checkpoint resume template: checkbox styling with a skills checklist. Project reliability and thoroughness.",
  },
  {
    id: "Clearance",
    slug: "clearance",
    name: "Clearance",
    tagline: "Badge-style pills — your credentials, cleared for viewing.",
    description:
      "Clearance styles your resume like a credentials badge: your job title sits in a theme-colored pill in the header, section headings are pill badges, and each role gets its own bordered card with a tinted date pill. Modern, friendly, and unmistakably organized.",
    bestFor: [
      "Security-cleared and defense professionals",
      "IT administrators and systems engineers",
      "Healthcare and compliance staff",
      "Government contractors",
      "Anyone who wants a modern badge-like presentation",
    ],
    designTraits: [
      "Theme-colored job-title pill in the header",
      "Pill-style section heading badges",
      "Bordered cards for each experience entry",
      "Tinted date pills on every role",
      "Outlined pill skill tags in the theme color",
    ],
    atsNotes:
      "Pills and cards are styled containers around real text — fully parseable. The single-column reading order keeps ATS extraction clean.",
    faqs: [
      {
        q: "Do the pill badges and cards hurt ATS parsing?",
        a: "No — they are CSS styling around real selectable text in a single-column flow. Parsers read the content normally.",
      },
      {
        q: "Can I change the pill color?",
        a: "Yes — the pills use your Cvyon theme color, so they adapt to whatever accent you choose in the builder.",
      },
      {
        q: "Is Clearance suitable outside defense and IT?",
        a: "Absolutely — the badge metaphor reads as modern and organized in any field.",
      },
    ],
    metaTitle: "Clearance Resume Template — Free Badge-Style Modern CV | Cvyon",
    metaDescription:
      "Free Clearance resume template: badge-style pills, bordered role cards, theme accents. A modern, organized CV.",
  },
  {
    id: "Protocol",
    slug: "protocol",
    name: "Protocol",
    tagline: "Explicit labeled fields — a candidate dossier, precisely filed.",
    description:
      "Protocol presents you as a candidate dossier: every field explicitly labeled — Role, Tenure, Employer, Degree, Institution — under a 'Candidate Dossier' header. Nothing is implied; everything is declared. Ideal for formal, process-driven hiring environments.",
    bestFor: [
      "Government and civil service applications",
      "Legal and compliance professionals",
      "Military-to-civilian transitions",
      "Regulated industries (finance, pharma, aviation)",
      "Anyone applying through formal HR processes",
    ],
    designTraits: [
      "'Candidate Dossier' header with labeled contact fields",
      "Explicit field labels on every entry (Role, Tenure, Employer)",
      "Numbered skills inventory",
      "Heavy ruled section dividers",
      "Structured, declarative layout",
    ],
    atsNotes:
      "The labeled-field structure is excellent for parsing: field names and values appear as adjacent real text in a single column, which extraction engines handle reliably.",
    faqs: [
      {
        q: "Why label every field explicitly?",
        a: "In formal hiring processes, explicit labels remove all ambiguity — the reader never has to guess what a line means.",
      },
      {
        q: "Is Protocol too rigid for creative fields?",
        a: "It is designed for formal environments — government, legal, regulated industries — where precision is the point.",
      },
      {
        q: "Does the labeled format help with ATS?",
        a: "Yes — clear field labels adjacent to values give parsing engines clean, unambiguous data to extract.",
      },
    ],
    metaTitle: "Protocol Resume Template — Free Formal Dossier CV | Cvyon",
    metaDescription:
      "Free Protocol resume template: explicitly labeled fields in a candidate-dossier format. Precision for formal hiring processes.",
  },
  {
    id: "Standard",
    slug: "standard",
    name: "Standard",
    tagline: "The canonical resume, perfected.",
    description:
      "Standard is the resume everyone expects, executed flawlessly: centered header with a double rule, ruled uppercase section headings, role and dates on one line, italic companies, comma-separated skills. No surprises — just the format recruiters have read ten thousand times, done right.",
    bestFor: [
      "First-time job seekers who want a safe choice",
      "Professionals in traditional industries",
      "Anyone applying across mixed industries",
      "Return-to-work candidates",
      "When in doubt, choose Standard",
    ],
    designTraits: [
      "Centered header with double bottom rule",
      "Ruled uppercase section headings",
      "Role and dates on a single baseline",
      "Italic company names",
      "Comma-separated inline skills",
    ],
    atsNotes:
      "The canonical safe choice: single column, standard headings, no graphics, no tables, real text throughout. Parses correctly on virtually every system.",
    faqs: [
      {
        q: "How is Standard different from other simple templates?",
        a: "It is the deliberate, perfected version of the conventional resume — familiar to every recruiter, with spacing and hierarchy tuned to a professional standard.",
      },
      {
        q: "Will I look generic using Standard?",
        a: "Familiar is not generic — recruiters read hundreds of resumes and reward clarity. Your achievements provide the distinction.",
      },
      {
        q: "Is Standard the safest ATS choice?",
        a: "Among the safest: conventional structure, standard headings, and zero decorative elements that could interfere with parsing.",
      },
    ],
    metaTitle: "Standard Resume Template — Free Classic Professional CV | Cvyon",
    metaDescription:
      "Free Standard resume template: the canonical resume format, perfected. Familiar, clean, and safe for every application.",
  },
  {
    id: "Merit",
    slug: "merit",
    name: "Merit",
    tagline: "Achievement-led bullets with bold lead verbs.",
    description:
      "Merit is built around one powerful device: every bullet leads with a bolded action verb — Led, Built, Delivered — so your impact hits before the detail. Triangular markers and an 'Achievements & Experience' section keep the focus exactly where hiring managers look: what you accomplished.",
    bestFor: [
      "Results-driven professionals (sales, marketing, operations)",
      "Managers with quantifiable achievements",
      "Consultants selling outcomes",
      "Anyone with strong metrics to showcase",
      "Performance-focused industries",
    ],
    designTraits: [
      "Bold lead action verbs on every bullet",
      "Triangular bullet markers",
      "'Achievements & Experience' section framing",
      "Role and company combined on one strong line",
      "Short underline accent on section headings",
    ],
    atsNotes:
      "Bold lead verbs are inline text styling — fully parseable. Single-column layout with standard headings keeps extraction clean while the verbs help human skimmers.",
    faqs: [
      {
        q: "How do the bold lead verbs work?",
        a: "Merit automatically bolds the first word of each bullet — write strong action verbs (Led, Built, Cut, Grew) and your impact leads every line.",
      },
      {
        q: "Should every bullet start with a verb?",
        a: "Ideally yes — action-led bullets are a resume best practice, and Merit is designed to reward exactly that habit.",
      },
      {
        q: "Does the bold formatting affect ATS?",
        a: "No — bold is inline text styling that parsers ignore while reading the words normally.",
      },
    ],
    metaTitle: "Merit Resume Template — Free Achievement-Focused CV | Cvyon",
    metaDescription:
      "Free Merit resume template: bold lead action verbs on every bullet. An achievement-led CV for results-driven professionals.",
  },
  {
    id: "Tenure",
    slug: "tenure",
    name: "Tenure",
    tagline: "Dates first, prominent — a career timeline you can trust.",
    description:
      "Tenure leads with time: every role and degree gets a bold date column on the left, separated by a soft rule from the details. It is the resume for people proud of their longevity — steady careers, long tenures, and clear progression read beautifully here.",
    bestFor: [
      "Professionals with long, stable tenures",
      "Candidates showing clear career progression",
      "Academics with chronological credentials",
      "Public sector and institutional careers",
      "Anyone whose loyalty is a selling point",
    ],
    designTraits: [
      "Bold left date column for every entry",
      "Soft vertical rule separating dates from detail",
      "Start and end dates stacked for emphasis",
      "Same date-first treatment for education",
      "Calm, trustworthy single-column flow",
    ],
    atsNotes:
      "Dates appear as real text adjacent to their entries — parsers extract them normally. The two-part visual layout reads as a single logical column to extraction engines.",
    faqs: [
      {
        q: "Is Tenure good for job hoppers?",
        a: "Honestly, no — Tenure spotlights dates, so it favors steady careers. Frequent movers may prefer Merit or Standard.",
      },
      {
        q: "Why emphasize dates so strongly?",
        a: "Longevity signals reliability and depth — Tenure makes that signal impossible to miss.",
      },
      {
        q: "Do parsers handle the date column correctly?",
        a: "Yes — dates are real text positioned next to their entries, which extraction engines associate correctly.",
      },
    ],
    metaTitle: "Tenure Resume Template — Free Date-Prominent Career CV | Cvyon",
    metaDescription:
      "Free Tenure resume template: bold date-first columns for every role. Showcase career longevity and steady progression.",
  },
  {
    id: "Studio",
    slug: "studio",
    name: "Studio",
    tagline: "A studio header — your name with discipline tags.",
    description:
      "Studio opens like a design studio's portfolio: your name in bold 48px type, discipline tags auto-built from your title and top skills in theme-colored pills, and pill section headers throughout. Project-forward and confident — made for people who make things.",
    bestFor: [
      "Designers (UX, UI, graphic, product)",
      "Developers with portfolio projects",
      "Architects and creative technologists",
      "Freelancers and studio founders",
      "Makers who want a portfolio feel",
    ],
    designTraits: [
      "48px extrabold name header",
      "Auto-generated discipline tag pills from your title and skills",
      "Theme-colored pill section headers",
      "Company names in the theme color",
      "Project-forward section ordering",
    ],
    atsNotes:
      "The tag pills are styled text in normal reading order — parseable. Single-column body with standard headings keeps the rest straightforward.",
    faqs: [
      {
        q: "Where do the discipline tags come from?",
        a: "Studio builds them automatically from the words in your job title plus your first four skills — keep those sharp and the tags sell you.",
      },
      {
        q: "Is Studio too bold for non-designers?",
        a: "It suits any maker — developers, architects, marketers with portfolio work. Purely corporate roles may prefer Standard.",
      },
      {
        q: "Do the pill headers affect ATS parsing?",
        a: "No — they are styled text in reading order. The content parses like any single-column resume.",
      },
    ],
    metaTitle: "Studio Resume Template — Free Creative Portfolio CV | Cvyon",
    metaDescription:
      "Free Studio resume template: bold studio header with discipline tags and pill sections. A portfolio-feel CV for makers.",
  },
  {
    id: "Workshop",
    slug: "workshop",
    name: "Workshop",
    tagline: "A craft sidebar in warm amber — tools, skills, process.",
    description:
      "Workshop pairs a warm amber craft sidebar — Contact, Tools & Skills, and Process — with a clean main column for your story. It feels hands-on and honest, like a maker's bench: perfect for trades, crafts, and applied professions where skill is proven by doing.",
    bestFor: [
      "Skilled trades (electricians, carpenters, machinists)",
      "Chefs and culinary professionals",
      "Makers, artisans, and craftspeople",
      "Technicians and field engineers",
      "Applied and vocational professionals",
    ],
    designTraits: [
      "Warm amber left sidebar with cream text",
      "Tools & Skills list in the sidebar",
      "Process section for methods or custom content",
      "Deep brown name header in the main column",
      "Craft-metaphor section organization",
    ],
    atsNotes:
      "Two-column layouts need care with older parsers: keep critical keywords and job titles in the main column. All text is real and selectable; modern parsers handle the layout well.",
    faqs: [
      {
        q: "What goes in the Process section?",
        a: "Your methods, workflows, or custom sections — Workshop maps custom builder sections into the sidebar's Process area automatically.",
      },
      {
        q: "Is the amber sidebar too colorful for employers?",
        a: "It is a deep, warm craft amber — it reads as honest and skilled, not flashy. Ideal for trades and applied fields.",
      },
      {
        q: "Will the sidebar confuse ATS software?",
        a: "Modern parsers handle two-column resumes well. For very old portals, a single-column template is the safer fallback.",
      },
    ],
    metaTitle: "Workshop Resume Template — Free Craft Sidebar CV | Cvyon",
    metaDescription:
      "Free Workshop resume template: warm amber craft sidebar with tools and process sections. For trades, makers, and applied professionals.",
  },
  {
    id: "Gallery",
    slug: "gallery",
    name: "Gallery",
    tagline: "Generous white space — your career, hung like artwork.",
    description:
      "Gallery gives every entry room to breathe: wide margins, spacious serif type, centered section labels in tracked gray, and your projects framed as 'Selected Work'. It is restraint as a luxury — for people whose work speaks quietly and confidently.",
    bestFor: [
      "Artists, curators, and gallerists",
      "Architects and interior designers",
      "Academics with select publications",
      "Senior creatives",
      "Anyone who values restraint over density",
    ],
    designTraits: [
      "Generous white space and wide margins",
      "Centered tracked-gray section labels",
      "Serif typography with loose leading",
      "Projects framed as 'Selected Work'",
      "Centered education entries",
    ],
    atsNotes:
      "Single-column with standard headings and real text throughout — parses cleanly. The generous spacing does not affect extraction.",
    faqs: [
      {
        q: "Will the white space make my resume look empty?",
        a: "Gallery is deliberately sparse — it signals confidence and seniority. It works best with curated, high-impact content rather than exhaustive lists.",
      },
      {
        q: "Is Gallery ATS-friendly?",
        a: "Yes — single column, standard headings, real text. The spacing is purely visual.",
      },
      {
        q: "How much content fits in Gallery?",
        a: "Less than dense templates — choose your strongest roles and achievements. That selectivity is the point.",
      },
    ],
    metaTitle: "Gallery Resume Template — Free Minimal Artistic CV | Cvyon",
    metaDescription:
      "Free Gallery resume template: generous white space with serif elegance. A restrained, artistic CV for creatives.",
  },
  {
    id: "Palette",
    slug: "palette",
    name: "Palette",
    tagline: "A color story header — your theme in three swatches.",
    description:
      "Palette opens with a designer's touch: three swatches of your theme color — Primary, Soft, Mist — displayed under your name like a brand palette. Swatch-square section markers tie the whole page to your chosen accent. Distinctive, cohesive, and unmistakably yours.",
    bestFor: [
      "Brand designers and visual designers",
      "Marketing professionals",
      "Front-end developers with design sensibility",
      "Creative directors",
      "Anyone who wants a signature color story",
    ],
    designTraits: [
      "Three theme-color swatches in the header",
      "Swatch-square section markers",
      "48px extrabold name with theme-colored title",
      "Cohesive single-accent color system",
      "Clean single-column body",
    ],
    atsNotes:
      "The swatches are decorative color blocks; all content text is real and in reading order. Single-column structure keeps parsing clean.",
    faqs: [
      {
        q: "Do the color swatches confuse ATS parsers?",
        a: "No — they are simple decorative blocks. Parsers read the text content, which flows in normal single-column order.",
      },
      {
        q: "Can I change the swatch colors?",
        a: "The swatches derive from your Cvyon theme color at three opacities — change your theme and the whole palette updates.",
      },
      {
        q: "Is Palette professional enough for corporate roles?",
        a: "It is polished and cohesive — best for creative-adjacent roles, marketing, and design-minded professionals.",
      },
    ],
    metaTitle: "Palette Resume Template — Free Color-Story Creative CV | Cvyon",
    metaDescription:
      "Free Palette resume template: a theme-color swatch story in the header. A cohesive, distinctive CV for design-minded professionals.",
  },
  {
    id: "Canvas",
    slug: "canvas",
    name: "Canvas",
    tagline: "A big creative name — then total discipline.",
    description:
      "Canvas makes one bold move — your name at a massive 60px with a thick theme underline bar — then stays perfectly disciplined: ruled theme-colored section titles, clean rows, quiet gray body text. Creative confidence up top, professional rigor everywhere else.",
    bestFor: [
      "Designers who want one bold statement",
      "Creative directors and art directors",
      "Developers with a design edge",
      "Personal-brand-focused professionals",
      "Anyone who wants presence without chaos",
    ],
    designTraits: [
      "60px black name with thick theme underline bar",
      "Theme-colored ruled section titles",
      "Disciplined single-column body",
      "Em-dash date ranges",
      "Quiet gray body text balancing the bold header",
    ],
    atsNotes:
      "One large name does not affect parsing — it is real text. The disciplined single-column body with standard headings parses cleanly.",
    faqs: [
      {
        q: "Is the huge name unprofessional?",
        a: "It is a confident design choice common in creative industries — the disciplined body keeps the overall read professional.",
      },
      {
        q: "Does the large header waste space?",
        a: "It uses vertical space deliberately as a statement; the compact body below keeps the resume to a sensible length.",
      },
      {
        q: "Will ATS read the oversized name correctly?",
        a: "Yes — size is styling; the text itself is standard and selectable.",
      },
    ],
    metaTitle: "Canvas Resume Template — Free Bold-Name Creative CV | Cvyon",
    metaDescription:
      "Free Canvas resume template: oversized creative name with a disciplined professional body. Presence plus rigor.",
  },
  {
    id: "Draft",
    slug: "draft",
    name: "Draft",
    tagline: "Blueprint precision — monospace details, exacting rows.",
    description:
      "Draft brings engineering-drawing precision: monospace dates, company names, and section labels, blueprint-blue accents, and arrow date ranges. Technical, exact, and quietly distinctive — for people who measure twice.",
    bestFor: [
      "Software engineers and developers",
      "Data engineers and analysts",
      "Technical writers",
      "Systems architects",
      "Precision-minded technical professionals",
    ],
    designTraits: [
      "Monospace type for dates, companies, and labels",
      "Blueprint-blue accent color",
      "Arrow-style date ranges",
      "Precise, exacting row alignment",
      "Technical drawing-board feel",
    ],
    atsNotes:
      "Monospace is still standard text — parsers read it normally. Single-column layout with clear headings keeps extraction reliable.",
    faqs: [
      {
        q: "Is monospace text hard to read?",
        a: "Draft uses it for details and labels, not body paragraphs — it adds technical character without hurting readability.",
      },
      {
        q: "Does monospace affect ATS parsing?",
        a: "No — it is a font choice, not an image. Parsers extract the characters normally.",
      },
      {
        q: "Who is Draft really for?",
        a: "Engineers, developers, and technical specialists who want their resume to feel as precise as their work.",
      },
    ],
    metaTitle: "Draft Resume Template — Free Blueprint Technical CV | Cvyon",
    metaDescription:
      "Free Draft resume template: blueprint precision with monospace details. A technical CV for engineers and developers.",
  },
  {
    id: "Mosaic",
    slug: "mosaic",
    name: "Mosaic",
    tagline: "Tile sections in varied widths — your career as a mosaic.",
    description:
      "Mosaic arranges your resume as a set of bordered tiles — summary, experience, education, skills, and more — each with a theme-colored top edge and tile marker. The varied grid feels designed and modern while keeping every section scannable on its own.",
    bestFor: [
      "Designers and visual professionals",
      "Marketers with diverse skill sets",
      "Product managers",
      "Freelancers with varied offerings",
      "Anyone who wants a designed, modular feel",
    ],
    designTraits: [
      "Bordered tile cards for each section",
      "Theme-colored top edge on every tile",
      "Varied-width mosaic grid arrangement",
      "Tinted skill chips inside the skills tile",
      "Full-width header above the tile field",
    ],
    atsNotes:
      "Tiles are styled containers in logical reading order — parsers read through them normally. Keep the section order conventional so extraction follows your career story.",
    faqs: [
      {
        q: "Do the tiles confuse ATS software?",
        a: "Modern parsers read tiled layouts in document order without trouble, since all text is real and sequential.",
      },
      {
        q: "Can I reorder the tiles?",
        a: "Tiles follow your builder section order — arrange sections in the builder and Mosaic tiles follow.",
      },
      {
        q: "Is Mosaic too playful for serious roles?",
        a: "It reads as designed and modern rather than playful — well suited to creative, marketing, and product roles.",
      },
    ],
    metaTitle: "Mosaic Resume Template — Free Tiled Modular CV | Cvyon",
    metaDescription:
      "Free Mosaic resume template: bordered tile sections with theme accents. A modern, modular CV for designers and marketers.",
  },
  {
    id: "Collage",
    slug: "collage",
    name: "Collage",
    tagline: "Layered tint blocks — depth without clutter.",
    description:
      "Collage layers soft theme tints behind your sections, giving the page gentle depth — like paper layered on paper. Sections flow in a clean single column over the tints, with pill skill tags and theme-colored companies. Artistic, but calm and readable.",
    bestFor: [
      "Creative professionals",
      "Marketing and brand specialists",
      "Content creators and strategists",
      "Design-adjacent technologists",
      "Anyone who wants subtle artistic depth",
    ],
    designTraits: [
      "Layered theme-tint blocks behind sections",
      "Clean single-column flow over the tints",
      "Pill skill tags in the theme color",
      "Theme-colored company names",
      "Soft, calm artistic depth",
    ],
    atsNotes:
      "Background tints are purely visual — all text sits in normal reading order as real selectable text. Parsing is unaffected.",
    faqs: [
      {
        q: "Do the background tints print well?",
        a: "They are very light tints that print cleanly; text contrast remains strong on paper.",
      },
      {
        q: "Will tints interfere with ATS parsing?",
        a: "No — parsers read the text layer, which is standard single-column content.",
      },
      {
        q: "Is Collage too artistic for corporate jobs?",
        a: "The tints are subtle — it reads as polished rather than avant-garde, suitable for creative-adjacent corporate roles.",
      },
    ],
    metaTitle: "Collage Resume Template — Free Layered Artistic CV | Cvyon",
    metaDescription:
      "Free Collage resume template: layered theme tints with clean single-column flow. Subtle artistic depth for creatives.",
  },
  {
    id: "Kindred",
    slug: "kindred",
    name: "Kindred",
    tagline: "Warm and human — a resume that feels like a handshake.",
    description:
      "Kindred is the friendly professional: warm amber tones, rounded cards for each role, a quote-styled summary with a left border, and soft pill section headers. It suits people-centered professions where warmth is a qualification, not a decoration.",
    bestFor: [
      "Teachers and educators",
      "Healthcare and caregiving professionals",
      "HR and people operations",
      "Customer success and support leaders",
      "Nonprofit and community professionals",
    ],
    designTraits: [
      "Warm amber color system throughout",
      "Rounded cards for each experience entry",
      "Quote-styled summary with amber left border",
      "Soft pill section headers",
      "Warm pill skill tags",
    ],
    atsNotes:
      "Cards and quotes are styled containers around real text in reading order — fully parseable. Single-column flow keeps extraction clean.",
    faqs: [
      {
        q: "Is Kindred too soft for leadership roles?",
        a: "Warmth and leadership are not opposites — Kindred suits people-leading managers in education, healthcare, HR, and nonprofits.",
      },
      {
        q: "Do the rounded cards affect ATS?",
        a: "No — they are CSS styling around normal text. Parsers read the content in order.",
      },
      {
        q: "Can I use Kindred in corporate roles?",
        a: "It shines in people-centered fields; very formal corporate environments may prefer Standard or Protocol.",
      },
    ],
    metaTitle: "Kindred Resume Template — Free Warm Human CV | Cvyon",
    metaDescription:
      "Free Kindred resume template: warm amber tones with rounded cards. A human, approachable CV for people-centered professions.",
  },
  {
    id: "Lumen",
    slug: "lumen",
    name: "Lumen",
    tagline: "Light and luminous — soft glow accents on clean white.",
    description:
      "Lumen is all light: clean white page, section headers as glowing theme pills with soft shadows, glow-chip skills, and hairline dividers between roles. It feels optimistic and modern — a resume with the brightness turned up.",
    bestFor: [
      "Tech professionals and startup talent",
      "Designers and creative technologists",
      "Marketing and growth professionals",
      "Young professionals",
      "Anyone who wants a bright, modern feel",
    ],
    designTraits: [
      "Glowing theme pill section headers with soft shadows",
      "Glow-chip skill tags",
      "Hairline dividers between experience entries",
      "Bright, airy single-column layout",
      "Theme-colored company names and titles",
    ],
    atsNotes:
      "Glow effects are CSS shadows around real text — invisible to parsers. The clean single-column structure extracts reliably.",
    faqs: [
      {
        q: "Do the glow effects print well?",
        a: "They render as soft shadows that print subtly; the text itself remains crisp and high-contrast.",
      },
      {
        q: "Is Lumen too trendy for conservative employers?",
        a: "It is modern but clean — best for tech, startups, and creative-adjacent roles rather than traditional finance or law.",
      },
      {
        q: "Will ATS handle the styled pills?",
        a: "Yes — pills are styled text in normal reading order; parsers extract the words normally.",
      },
    ],
    metaTitle: "Lumen Resume Template — Free Bright Modern CV | Cvyon",
    metaDescription:
      "Free Lumen resume template: luminous glow accents on clean white. A bright, modern CV for tech and startup talent.",
  },
  {
    id: "Clinician",
    slug: "clinician",
    name: "Clinician",
    tagline: "Credential-forward and calm — built for medical careers.",
    description:
      "Clinician leads with what matters in healthcare: certifications and licenses get their own prominent section with blue accent rules, under a calm clinical-blue header. Clean, trustworthy, and credential-forward — the resume equivalent of a steady bedside manner.",
    bestFor: [
      "Nurses and nurse practitioners",
      "Physicians and physician assistants",
      "Allied health professionals",
      "Healthcare administrators",
      "Medical researchers and technicians",
    ],
    designTraits: [
      "Certifications & Licenses section with blue accent rules",
      "Calm clinical-blue header band",
      "Two-column clinical skills grid",
      "Blue section headers with light rules",
      "Clean, trustworthy single-column flow",
    ],
    atsNotes:
      "Healthcare ATS portals parse this cleanly: single column, standard headings, credentials listed as real text with issuers and dates adjacent.",
    faqs: [
      {
        q: "Why do certifications come before experience?",
        a: "In healthcare, licenses and certifications are often the first filter — Clinician puts them where credential-checkers look first.",
      },
      {
        q: "Is Clinician only for clinical roles?",
        a: "It is optimized for healthcare, but the clean credential-forward structure suits any licensed profession.",
      },
      {
        q: "Does the blue styling affect parsing?",
        a: "No — color is purely visual. All text is real, selectable, and in standard reading order.",
      },
    ],
    metaTitle: "Clinician Resume Template — Free Medical Credential CV | Cvyon",
    metaDescription:
      "Free Clinician resume template: credential-forward with calm clinical blue. Built for nurses, physicians, and healthcare professionals.",
  },
  {
    id: "Advocate",
    slug: "advocate",
    name: "Advocate",
    tagline: "Legal formality — numbered sections, serif, structured.",
    description:
      "Advocate argues your case like a brief: serif throughout, sections numbered with Roman numerals between rules, justified summary text, and a double-rule header. Formal, structured, and precise — for professions where how you present is part of what you practice.",
    bestFor: [
      "Lawyers and attorneys",
      "Paralegals and legal assistants",
      "Policy analysts and advisors",
      "Academics in law and humanities",
      "Compliance and governance professionals",
    ],
    designTraits: [
      "Roman-numeral section numbering between rules",
      "Full serif typography",
      "Justified summary text",
      "Double-rule formal header",
      "Structured, brief-like organization",
    ],
    atsNotes:
      "Single-column with real text throughout — parses reliably. Roman numerals are decorative text that do not interfere with keyword extraction.",
    faqs: [
      {
        q: "Is Advocate appropriate outside law?",
        a: "It suits any formal profession — policy, academia, governance, compliance — where structured presentation signals competence.",
      },
      {
        q: "Do the Roman numerals confuse ATS?",
        a: "No — they are short text labels; parsers read past them to your section content normally.",
      },
      {
        q: "Why justified text?",
        a: "Justified setting gives the formal, brief-like texture — a deliberate nod to legal document conventions.",
      },
    ],
    metaTitle: "Advocate Resume Template — Free Formal Legal CV | Cvyon",
    metaDescription:
      "Free Advocate resume template: Roman-numeral sections with formal serif structure. A brief-like CV for legal professionals.",
  },
  {
    id: "Engine",
    slug: "engine",
    name: "Engine",
    tagline: "A spec-sheet resume for engineers.",
    description:
      "Engine treats your resume like a technical specification: it opens with a mono '// Resume Specification' kicker, numbers each section like a spec document, and renders contact details as labeled spec rows. Skills sit in a precise three-column mono grid. The result feels exact and credible — exactly the signal engineering hiring managers look for.",
    bestFor: [
      "Software and systems engineers",
      "Mechanical and electrical engineers",
      "DevOps and infrastructure specialists",
      "Technical architects",
      "Engineering students and graduates",
    ],
    designTraits: [
      "Mono '// Resume Specification' kicker in the header",
      "Numbered section headers in monospace type",
      "Spec-style labeled rows for contact details",
      "Three-column monospace skills grid",
      "Steel-slate palette with disciplined spacing",
    ],
    atsNotes:
      "Single-column flow with real text; the monospace styling does not affect parsing. Standard section headings keep the content machine-readable.",
    faqs: [
      {
        q: "Is monospace type readable enough for recruiters?",
        a: "Yes — monospace is used for labels and structure while body text stays in a clean sans, so it reads as precise rather than hard.",
      },
      {
        q: "Does the spec styling suit senior engineers?",
        a: "It suits engineers at any level; the numbered, spec-like structure signals rigor, which senior technical roles value.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column layout, real selectable text, and standard section headings throughout.",
      },
    ],
    metaTitle: "Engine Resume Template — Free Engineering CV | Cvyon",
    metaDescription:
      "Free Engine resume template: a spec-sheet style resume with numbered sections and monospace detail for engineers and technical specialists.",
  },
  {
    id: "Teller",
    slug: "teller",
    name: "Teller",
    tagline: "Numbers-forward and crisp for finance professionals.",
    description:
      "Teller is built like a clean financial statement: your name and contact details share a header split by a thick accent rule, and every section starts with a bold black uppercase heading over a hard rule. Experience entries keep figures and outcomes prominent, and the crisp grid-like rows feel exact. It reads as trustworthy and precise — the currency of finance hiring.",
    bestFor: [
      "Accountants and auditors",
      "Bankers and financial analysts",
      "Finance managers and controllers",
      "Insurance professionals",
      "Fintech operators",
    ],
    designTraits: [
      "Header split: name left, right-aligned contact column",
      "Thick accent rule dividing header from body",
      "Bold black uppercase section headings with hard rules",
      "Crisp grid-like experience rows",
      "Numbers-forward styling that highlights figures",
    ],
    atsNotes:
      "Single-column body with standard headings parses cleanly. Right-aligned contact text is still real text in the document's reading order.",
    faqs: [
      {
        q: "Will the right-aligned contact column confuse ATS parsers?",
        a: "No — the text is real and part of the document flow, not an image or text box. Modern parsers read it normally.",
      },
      {
        q: "Is Teller right for non-finance roles?",
        a: "Its crisp precision works for any numbers-driven role — operations, analytics, consulting — but it was tuned for finance.",
      },
      {
        q: "Can I emphasize financial results in experience entries?",
        a: "Yes — the crisp rows keep figures prominent; put your metrics and outcomes early in each bullet for maximum effect.",
      },
    ],
    metaTitle: "Teller Resume Template — Free Finance CV | Cvyon",
    metaDescription:
      "Free Teller resume template: a crisp, numbers-forward design for finance professionals with bold headings and a clean statement-like layout.",
  },
  {
    id: "Practitioner",
    slug: "practitioner",
    name: "Practitioner",
    tagline: "Calm and trustworthy for healthcare professionals.",
    description:
      "Practitioner is designed for the trust healthcare demands: a centered header with a soft initial medallion, a calm teal-tinted summary card, and section headings set in quiet teal with hairline rules. Clinical experience entries read cleanly with generous spacing. The whole page feels steady, competent, and reassuring — exactly what patients and hiring panels want to see.",
    bestFor: [
      "Doctors, nurses, and clinicians",
      "Pharmacists and lab technicians",
      "Allied health professionals",
      "Healthcare administrators",
      "Public health and social care workers",
    ],
    designTraits: [
      "Centered header with a soft initial medallion",
      "Calm teal-tinted summary card",
      "Teal section headings with hairline rules",
      "Clinical experience entries with generous spacing",
      "Soft pill skills with a trustworthy tone",
    ],
    atsNotes:
      "Single-column, real text, standard headings — fully parseable. The teal tints are fills behind text and do not affect machine reading.",
    faqs: [
      {
        q: "Can I list clinical certifications prominently?",
        a: "Yes — add them in the builder's certifications section; the calm section styling keeps credentials clear and credible.",
      },
      {
        q: "Is the teal color fixed?",
        a: "The calm teal accents follow your Cvyon theme color, so you can shift the tone while keeping the trustworthy design.",
      },
      {
        q: "Will ATS software read the centered header?",
        a: "Yes — it is real selectable text in a single-column flow, so parsers handle it normally.",
      },
    ],
    metaTitle: "Practitioner Resume Template — Free Healthcare CV | Cvyon",
    metaDescription:
      "Free Practitioner resume template: a calm, trustworthy design for healthcare professionals with a medallion header and clean clinical sections.",
  },
  {
    id: "Barrister",
    slug: "barrister",
    name: "Barrister",
    tagline: "Courtroom formality in a serif resume.",
    description:
      "Barrister carries the gravity of the legal profession: full serif typography, a centered formal header with your name in wide-tracked uppercase, and an ornamental line-and-diamond divider beneath every section heading. Body text is justified for a composed, document-like finish. It is the resume equivalent of a well-tailored suit — formal, structured, and serious.",
    bestFor: [
      "Lawyers and attorneys",
      "Paralegals and legal assistants",
      "Judges and court professionals",
      "Compliance and legal operations staff",
      "Law students and graduates",
    ],
    designTraits: [
      "Full serif typography throughout",
      "Centered header with wide-tracked uppercase name",
      "Ornamental line-and-diamond section dividers",
      "Justified body text for a document-like finish",
      "Formal black palette with disciplined hierarchy",
    ],
    atsNotes:
      "Serif typefaces parse fine in modern ATS software. Single-column layout and standard headings keep everything machine-readable.",
    faqs: [
      {
        q: "Is serif type okay for ATS systems?",
        a: "Yes — modern parsers handle serif fonts without issue. The single-column layout and standard headings matter far more than the typeface.",
      },
      {
        q: "Can I use Barrister outside law?",
        a: "Its formality suits any traditional profession — academia, diplomacy, senior public service — but it was designed for legal careers.",
      },
      {
        q: "Does the ornamental divider affect parsing?",
        a: "No — the dividers are decorative lines; all section text remains real and selectable.",
      },
    ],
    metaTitle: "Barrister Resume Template — Free Legal CV | Cvyon",
    metaDescription:
      "Free Barrister resume template: a formal serif resume for legal professionals with an ornamental header and composed, document-like styling.",
  },
  {
    id: "Tutor",
    slug: "tutor",
    name: "Tutor",
    h1: "Tutoring resume example — the free Tutor template",
    tagline: "Clear and encouraging for tutors and coaches.",
    description:
      "Looking for a tutoring resume example you can actually use? Tutor is built for people who explain things for a living — private tutors, academic coaches, corporate trainers. Section titles pair a bold black heading with a thick theme-colored rule running to the right margin, and body text is set large (15px) for effortless reading. Skills appear as clear pills with crisp borders. The design feels encouraging and uncluttered — the visual equivalent of a great explainer, and a strong starting point for any tutoring resume.",
    bestFor: [
      "Private tutors and academic coaches",
      "Corporate trainers",
      "Workshop facilitators",
      "Online course creators",
      "Mentors and onboarding specialists",
    ],
    designTraits: [
      "Bold section titles with a thick theme rule to the margin",
      "Large 15px body type for effortless reading",
      "Clear bordered skill pills",
      "Warm approachable header with contact row",
      "Uncluttered single-column flow",
    ],
    atsNotes:
      "Single-column layout with real text and clear headings parses without issues. The decorative rules are lines, not text obstructions.",
    faqs: [
      {
        q: "What should a tutoring resume include?",
        a: "Your subjects and the levels you teach, measurable student outcomes (grades improved, exams passed), relevant certifications, and any curriculum or materials you created. Private tutors should also note whether sessions were in-person or online — employers screen for it.",
      },
      {
        q: "How do I write a tutoring resume with no tutoring experience?",
        a: "Lead with adjacent experience: mentoring, coaching, teaching-assistant work, volunteering, or strong coursework in your subject. A skills-first layout like Tutor's keeps the focus on what you can teach rather than job titles you don't have yet.",
      },
      {
        q: "Is this tutoring resume example ATS-friendly?",
        a: "Yes — single-column flow, real selectable text, and standard section headings. The decorative rules are lines, not text obstructions, so parsers read every section in order.",
      },
      {
        q: "Is the large text okay for a one-page resume?",
        a: "The 15px body type is chosen for readability; if you have a lot of content, another compact template may fit better — Tutor prioritizes clarity over density.",
      },
      {
        q: "Can the rule color be changed?",
        a: "Yes — the thick section rules follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Tutoring Resume Example — Free Tutor Template | Cvyon",
    metaDescription:
      "A tutoring resume example built on Cvyon's free Tutor template — ATS-friendly, no signup, no watermark. Clear, encouraging design for tutors and coaches.",
  },
  {
    id: "Navigator",
    slug: "navigator",
    name: "Navigator",
    tagline: "A route-map resume for logistics professionals.",
    description:
      "Navigator turns your career into a route: the header opens with a journey motif — a circle, a dashed line, and a diamond waypoint — and section headings pair a rotated square marker with a dashed rule, like plotted stops on a map. Experience entries follow a route-like timeline. It is a confident, purposeful design for people who move things, plan routes, and deliver on time.",
    bestFor: [
      "Logistics and supply chain professionals",
      "Operations and dispatch managers",
      "Transport and fleet coordinators",
      "Warehouse and distribution staff",
      "Travel and tour professionals",
    ],
    designTraits: [
      "Route-map header motif: circle, dashed line, diamond",
      "Section heads with rotated square markers and dashed rules",
      "Route-like experience timeline",
      "Bold black section titles with confident spacing",
      "Theme-colored waypoints throughout",
    ],
    atsNotes:
      "The route motifs are decorative shapes; all text is real and in a single-column reading order, so parsing is unaffected.",
    faqs: [
      {
        q: "Do the decorative shapes hurt ATS parsing?",
        a: "No — they are simple vector shapes behind and beside real text. The document reads top-to-bottom in one column.",
      },
      {
        q: "Is Navigator too playful for senior roles?",
        a: "The motif is subtle and geometric, not cartoonish — it reads as purposeful design, suitable up to senior operations levels.",
      },
      {
        q: "Can the route color change?",
        a: "Yes — the markers, rules, and accents follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Navigator Resume Template — Free Logistics CV | Cvyon",
    metaDescription:
      "Free Navigator resume template: a route-map inspired design for logistics and operations professionals with waypoint markers and dashed rules.",
  },
  {
    id: "Frontline",
    slug: "frontline",
    name: "Frontline",
    tagline: "Bold and direct for service professionals.",
    description:
      "Frontline does not whisper — a full theme-colored header carries your name in huge white uppercase type, and every section starts with a solid theme-colored header bar. Your summary is framed as a 'Mission Statement' with an accent border. Skills sit in a clean two-column grid. It is built for customer-facing roles where confidence, clarity, and dependability are the whole pitch.",
    bestFor: [
      "Customer service representatives",
      "Retail and hospitality professionals",
      "Call center and support staff",
      "Security and front-desk professionals",
      "Sales associates",
    ],
    designTraits: [
      "Full theme-colored header with huge white uppercase name",
      "Solid theme section header bars",
      "Summary framed as a 'Mission Statement' with accent border",
      "Two-column skills grid",
      "Bold, direct typography throughout",
    ],
    atsNotes:
      "The colored header is a fill behind real white text, which parses normally. Single-column body with standard headings keeps the rest straightforward.",
    faqs: [
      {
        q: "Does the big colored header affect ATS parsing?",
        a: "No — it is a solid fill behind real selectable text, not an image. Your name and contact details parse normally.",
      },
      {
        q: "Can I change the header color?",
        a: "Yes — the header, section bars, and accents all follow your Cvyon theme color.",
      },
      {
        q: "Is 'Mission Statement' editable?",
        a: "It is the fixed title of the summary section in this design; the text itself is fully yours to write.",
      },
    ],
    metaTitle: "Frontline Resume Template — Free Service CV | Cvyon",
    metaDescription:
      "Free Frontline resume template: a bold, direct design for customer-facing roles with a strong color header and mission-statement summary.",
  },
  {
    id: "Duotone",
    slug: "duotone",
    name: "Duotone",
    tagline: "A disciplined two-color system for your resume.",
    description:
      "Duotone builds your entire resume on exactly two colors: a deep slate and your theme color. The header splits into a dark panel holding your name and a theme panel holding your contact details, and section headers alternate between dark and theme block labels with matching rules. The restraint is the design — every element feels intentional, and nothing competes for attention.",
    bestFor: [
      "Designers who value restraint",
      "Marketing and brand professionals",
      "Product managers",
      "Consultants",
      "Anyone who wants color without clutter",
    ],
    designTraits: [
      "Two-color system: deep slate plus theme color",
      "Split header: dark name panel, theme contact panel",
      "Alternating dark/theme block section labels",
      "Matching rules that tie sections together",
      "Disciplined, intentional use of color throughout",
    ],
    atsNotes:
      "Single-column body with real text and standard headings parses cleanly. The dark header panel is a fill behind real white text.",
    faqs: [
      {
        q: "Can I change the two colors?",
        a: "The theme color follows your Cvyon theme choice; the deep slate anchor stays constant to preserve the two-color discipline.",
      },
      {
        q: "Is two colors enough to look distinctive?",
        a: "Yes — the strict pairing is what makes it distinctive. Limiting the palette makes each color use feel deliberate.",
      },
      {
        q: "Will the dark panel confuse ATS parsers?",
        a: "No — it is a fill behind real selectable text, and the body reads in a single column.",
      },
    ],
    metaTitle: "Duotone Resume Template — Free Two-Color CV | Cvyon",
    metaDescription:
      "Free Duotone resume template: a disciplined two-color resume design with a split dark/theme header and alternating block section labels.",
  },
  {
    id: "Bichrome",
    slug: "bichrome",
    name: "Bichrome",
    tagline: "A dark sidebar with theme highlights.",
    description:
      "Bichrome pairs a deep dark sidebar with bright theme accents: your initial sits in a theme medallion, contact details and theme pill skills live on the dark panel, and the main column stays clean and standard for maximum readability. The contrast gives the page drama while keeping your experience section calm and scannable.",
    bestFor: [
      "Developers and designers",
      "Data professionals",
      "Creative technologists",
      "Freelancers and contractors",
      "Anyone who wants a striking two-tone resume",
    ],
    designTraits: [
      "Deep dark sidebar with theme highlights",
      "Theme medallion with your initial",
      "Theme pill skills on the dark panel",
      "Clean standard main column",
      "Theme-bordered sidebar section headings",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep critical keywords (titles, employers) in the main column. All text is real and selectable.",
    faqs: [
      {
        q: "Will the dark sidebar hurt ATS parsing?",
        a: "Modern parsers handle sidebars well, and all text is real. If a portal is very old, a single-column template is the safest fallback.",
      },
      {
        q: "Can I change the sidebar color?",
        a: "The dark panel stays deep by design; the theme color drives the medallion, pills, and accents.",
      },
      {
        q: "What goes in the sidebar?",
        a: "Contact details and skills live there by default; custom sections you add in the builder appear in the sidebar too.",
      },
    ],
    metaTitle: "Bichrome Resume Template — Free Dark Sidebar CV | Cvyon",
    metaDescription:
      "Free Bichrome resume template: a dark sidebar with theme highlights beside a clean main column. Striking two-tone design for developers and designers.",
  },
  {
    id: "Sepia",
    slug: "sepia",
    name: "Sepia",
    tagline: "An archival sepia tone for distinguished careers.",
    description:
      "Sepia wraps your resume in a warm archival palette: a parchment background, a 'Curriculum Vitae' eyebrow over your name, and full serif typography in rich sepia browns. Section headings carry wide letter-spacing over fine sepia rules. It feels like a distinguished document from a personal archive — ideal for careers where gravitas and tradition carry weight.",
    bestFor: [
      "Academics and researchers",
      "Historians and archivists",
      "Senior executives with long careers",
      "Legal and diplomatic professionals",
      "Writers and editors",
    ],
    designTraits: [
      "Full sepia palette on a warm parchment background",
      "'Curriculum Vitae' eyebrow over the name",
      "Serif typography throughout",
      "Wide-tracked section headings over fine rules",
      "Archival, distinguished document feel",
    ],
    atsNotes:
      "The parchment background is a fill behind real text, so parsing is unaffected. Single-column layout with standard headings keeps it machine-readable.",
    faqs: [
      {
        q: "Is the sepia background okay for printing?",
        a: "It prints as a light warm tint; if you need pure white for a specific submission, another template may be safer.",
      },
      {
        q: "Does the background affect ATS parsing?",
        a: "No — it is a flat fill behind real selectable text, not an image.",
      },
      {
        q: "Is Sepia too old-fashioned for modern roles?",
        a: "It is intentionally classical — best for academia, law, heritage, and senior roles where tradition is an asset.",
      },
    ],
    metaTitle: "Sepia Resume Template — Free Archival CV | Cvyon",
    metaDescription:
      "Free Sepia resume template: a warm archival design with parchment tones and serif type for distinguished academic and professional careers.",
  },
  {
    id: "Slate",
    slug: "slate",
    name: "Slate",
    tagline: "Understated slate-on-slate professionalism.",
    description:
      "Slate is quiet confidence in monochrome: an all-slate palette where your theme color appears only sparingly, small-caps gray section headings over hairline rules, and soft slate pill skills. Nothing shouts. The restraint reads as maturity and self-assurance — the resume equivalent of speaking softly because you know your record speaks loudly.",
    bestFor: [
      "Senior managers and directors",
      "Operations professionals",
      "Analysts and researchers",
      "Administrators",
      "Professionals who prefer understatement",
    ],
    designTraits: [
      "All-slate palette with theme color used sparingly",
      "Small-caps gray section headings over hairlines",
      "Soft slate pill skills",
      "Quiet, confident typography",
      "Monochrome restraint throughout",
    ],
    atsNotes:
      "Excellent for parsing: single-column, real text, standard headings, and minimal decorative elements.",
    faqs: [
      {
        q: "Is Slate too plain?",
        a: "Its plainness is the point — disciplined restraint that lets your achievements carry the page. If you want more visual energy, try a color-family template.",
      },
      {
        q: "Where does the theme color appear?",
        a: "Sparingly — in small accents only. Slate is designed to stay near-monochrome regardless of your theme choice.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Very — single-column flow, real text, standard headings, and almost no decorative elements.",
      },
    ],
    metaTitle: "Slate Resume Template — Free Minimalist CV | Cvyon",
    metaDescription:
      "Free Slate resume template: an understated slate-on-slate design with sparing color accents for confident, mature professionals.",
  },
  {
    id: "Forest",
    slug: "forest",
    name: "Forest",
    tagline: "A deep-green identity with natural authority.",
    description:
      "Forest gives your resume a deep-green identity: a dark green header block with a serif 'Professional Résumé' eyebrow, section headings marked by a green bar and serif title, and soft pill skills. The palette feels grounded and organic — distinctive without being loud, and memorable in a stack of blue-and-gray resumes.",
    bestFor: [
      "Environmental and sustainability professionals",
      "Nonprofit and NGO staff",
      "Outdoor and agriculture industries",
      "Wellness and health professionals",
      "Anyone wanting a distinctive natural palette",
    ],
    designTraits: [
      "Deep-green header block with serif eyebrow",
      "Green bar markers beside serif section headings",
      "Soft pill skills in a natural palette",
      "Grounded, organic color system",
      "Distinctive without being loud",
    ],
    atsNotes:
      "The dark green header is a fill behind real white text, which parses normally. Single-column body with standard headings.",
    faqs: [
      {
        q: "Is the green too unusual for conservative industries?",
        a: "Deep green reads as classic and grounded rather than flashy — it works in finance, consulting, and law as well as green industries.",
      },
      {
        q: "Can I change the green?",
        a: "The deep-green identity is fixed by design; the theme color drives smaller accents. For full theme control, choose a theme-driven template.",
      },
      {
        q: "Does the dark header affect ATS parsing?",
        a: "No — it is a solid fill behind real selectable text.",
      },
    ],
    metaTitle: "Forest Resume Template — Free Green CV | Cvyon",
    metaDescription:
      "Free Forest resume template: a deep-green resume identity with a dark header block and serif details for grounded, distinctive professionals.",
  },
  {
    id: "Navy",
    slug: "navy",
    name: "Navy",
    tagline: "Classic navy formality, crisply executed.",
    description:
      "Navy is the timeless choice, executed with precision: a navy masthead block frames your name inside a thin white border, and section headings pair serif navy titles with a rule and diamond accent. The serif body text and disciplined spacing feel established and reliable. When in doubt about what a hiring manager expects, Navy is the safe answer that still looks considered.",
    bestFor: [
      "Corporate professionals",
      "Bankers and consultants",
      "Government and public sector applicants",
      "Military-to-civilian transitions",
      "Recent graduates targeting traditional firms",
    ],
    designTraits: [
      "Navy masthead with a thin white border frame",
      "Serif navy section titles with rule and diamond accents",
      "Classic serif body typography",
      "Disciplined, formal spacing",
      "Timeless navy-and-white palette",
    ],
    atsNotes:
      "The navy masthead is a fill behind real text; the single-column body with standard headings parses cleanly. Serif type is fine for modern parsers.",
    faqs: [
      {
        q: "Is navy too conservative?",
        a: "Navy is the most universally accepted resume color — it is conservative in the best sense: appropriate everywhere, from banks to tech.",
      },
      {
        q: "Can the navy color be changed?",
        a: "The navy identity is fixed by design to keep the classic look; accents follow your theme color.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column layout, real selectable text, and standard section headings.",
      },
    ],
    metaTitle: "Navy Resume Template — Free Classic CV | Cvyon",
    metaDescription:
      "Free Navy resume template: a classic navy-and-white resume with a framed masthead and serif details for corporate and traditional careers.",
  },
  {
    id: "Crimson",
    slug: "crimson",
    name: "Crimson",
    tagline: "Bold crimson energy for confident candidates.",
    description:
      "Crimson leads with conviction: a thick accent band across the top of the page, your name set huge in black, and section headings in theme color with heavy bottom borders. Skills appear as confident pills. It is a high-energy design for people whose record backs up a bold presentation — sales leaders, founders, and anyone competing for attention in a crowded field.",
    bestFor: [
      "Sales leaders and rainmakers",
      "Founders and entrepreneurs",
      "Marketing professionals",
      "Media and communications staff",
      "Competitive early-career applicants",
    ],
    designTraits: [
      "Thick accent band across the top of the page",
      "Huge black name with bold presence",
      "Theme-colored section heads with heavy bottom borders",
      "Confident pill skills",
      "High-energy, assertive typography",
    ],
    atsNotes:
      "Single-column layout with real text and standard headings parses cleanly. The top band is a decorative fill, not content.",
    faqs: [
      {
        q: "Is Crimson too bold for my industry?",
        a: "It suits competitive, results-driven fields. For conservative industries like law or traditional banking, a quieter template is safer.",
      },
      {
        q: "Can the accent color be changed?",
        a: "Yes — the band, headings, and accents all follow your Cvyon theme color.",
      },
      {
        q: "Will the large name take too much space?",
        a: "The header is compact vertically despite the large type; the body keeps efficient single-column spacing.",
      },
    ],
    metaTitle: "Crimson Resume Template — Free Bold CV | Cvyon",
    metaDescription:
      "Free Crimson resume template: a bold, high-energy design with an accent top band and heavy section borders for confident candidates.",
  },
  {
    id: "Teal",
    slug: "teal",
    name: "Teal",
    tagline: "Modern teal with geometric precision.",
    description:
      "Teal is modern professionalism with a geometric edge: a square theme monogram of your initial anchors the header, and every section opens with a diamond marker, a bold theme-colored title, and a hairline rule. Skills are crisp bordered pills. The geometry feels fresh and tech-adjacent without being cold — a strong pick for contemporary companies.",
    bestFor: [
      "Product and project managers",
      "Designers and UX professionals",
      "Tech-adjacent business roles",
      "Marketing and growth staff",
      "Startup applicants",
    ],
    designTraits: [
      "Square theme monogram with your initial",
      "Diamond markers with bold theme section titles",
      "Hairline rules under every section head",
      "Crisp bordered pill skills",
      "Fresh geometric modern styling",
    ],
    atsNotes:
      "Single-column layout with real text and standard headings parses cleanly. The geometric markers are decorative shapes beside real text.",
    faqs: [
      {
        q: "Is Teal too trendy to age well?",
        a: "The geometry is restrained and the structure is classic single-column, so it reads modern without dating quickly.",
      },
      {
        q: "Can the teal color be changed?",
        a: "Yes — the monogram, markers, and accents all follow your Cvyon theme color.",
      },
      {
        q: "Does the monogram hurt ATS parsing?",
        a: "No — it is a shape behind a single letter; your full name appears as real text right beside it.",
      },
    ],
    metaTitle: "Teal Resume Template — Free Modern CV | Cvyon",
    metaDescription:
      "Free Teal resume template: a modern geometric design with a monogram header and diamond section markers for contemporary professionals.",
  },
  {
    id: "Ochre",
    slug: "ochre",
    name: "Ochre",
    tagline: "Warm ochre tones with humanist type.",
    description:
      "Ochre brings warmth to the page: a centered, welcoming header, section headings in a rich tone finished with a rounded underline bar, and soft pill skills — all set in a friendly humanist typeface. It feels approachable and genuine, like a firm handshake. A strong choice for roles where people skills are the product.",
    bestFor: [
      "HR and people operations",
      "Customer success managers",
      "Community and nonprofit professionals",
      "Hospitality and tourism staff",
      "Coaches and mentors",
    ],
    designTraits: [
      "Warm centered welcoming header",
      "Rounded underline bars under section headings",
      "Soft pill skills",
      "Friendly humanist typeface",
      "Genuine, approachable tone throughout",
    ],
    atsNotes:
      "Single-column layout with real text and standard headings parses without issues. The warm tones are text colors and fills behind real text.",
    faqs: [
      {
        q: "Is Ochre professional enough for corporate roles?",
        a: "Yes — the warmth is in tone, not casualness. The structure is disciplined and it suits people-facing corporate roles well.",
      },
      {
        q: "Can the warm color be changed?",
        a: "Yes — the accents follow your Cvyon theme color while the warm typeface keeps the friendly feel.",
      },
      {
        q: "Is it ATS-friendly?",
        a: "Yes — single-column flow, real selectable text, and standard section headings.",
      },
    ],
    metaTitle: "Ochre Resume Template — Free Warm CV | Cvyon",
    metaDescription:
      "Free Ochre resume template: a warm, approachable design with humanist type and rounded section bars for people-focused professionals.",
  },
  {
    id: "Split",
    slug: "split",
    name: "Split",
    tagline: "An even 50/50 mirror split of your resume.",
    description:
      "Split divides the body into two perfectly even columns beneath a full-width header: experience and career on one side, skills and education mirrored on the other, with matching section headers on both. The symmetry is striking on the page and lets a recruiter scan two storylines at once — what you have done, and what you bring.",
    bestFor: [
      "Professionals balancing depth and breadth",
      "Career changers showing two storylines",
      "Consultants with skills and engagements",
      "Designers with process and portfolio highlights",
      "Anyone with evenly weighted content",
    ],
    designTraits: [
      "Even 50/50 mirrored two-column body",
      "Full-width header spanning both columns",
      "Mirrored section headers on each side",
      "Parallel career and capability storylines",
      "Striking symmetrical composition",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep critical keywords (job titles, employers) readable in order. All text is real and selectable.",
    faqs: [
      {
        q: "Will the two columns confuse ATS software?",
        a: "Modern parsers handle two columns well. For very old portals, export the PDF and check the reading order, or use a single-column template.",
      },
      {
        q: "How should I divide content between columns?",
        a: "Career narrative (experience) on one side, capability proof (skills, education, certifications) on the other works best.",
      },
      {
        q: "Can I change the column balance?",
        a: "The even 50/50 mirror is fixed by design — that symmetry is Split's identity. Other templates offer different ratios.",
      },
    ],
    metaTitle: "Split Resume Template — Free Two-Column CV | Cvyon",
    metaDescription:
      "Free Split resume template: an even 50/50 mirrored two-column design with a full-width header for balanced career storytelling.",
  },
  {
    id: "Tandem",
    slug: "tandem",
    name: "Tandem",
    tagline: "Career and skills riding side by side.",
    description:
      "Tandem runs your career and your capabilities in parallel: a full-width theme header up top, then a wider left column for your work history riding alongside a right column stacked with skills and education. Section headers are clean and bold on both sides. It is the classic two-column resume done with confident proportions.",
    bestFor: [
      "Mid-career professionals",
      "Technical specialists with deep skill lists",
      "Project managers",
      "Analysts",
      "Anyone with a strong skills story",
    ],
    designTraits: [
      "Full-width theme header",
      "Wider left column for career history",
      "Right column stacked with skills and education",
      "Clean bold tandem section headers",
      "Confident, classic two-column proportions",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep critical keywords in the main left column. All text is real and selectable.",
    faqs: [
      {
        q: "Will ATS software read both columns?",
        a: "Modern parsers do. If a portal is very old, check the PDF reading order or fall back to a single-column template.",
      },
      {
        q: "What goes in the right column?",
        a: "Skills and education by default; custom sections you add in the builder stack there too.",
      },
      {
        q: "Can the header color change?",
        a: "Yes — the full-width header and all accents follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Tandem Resume Template — Free Two-Column CV | Cvyon",
    metaDescription:
      "Free Tandem resume template: a classic two-column resume with a full-width header, career history left and skills stacked right.",
  },
  {
    id: "Bifocal",
    slug: "bifocal",
    name: "Bifocal",
    tagline: "A dual-focus intro, then a single clean column.",
    description:
      "Bifocal opens with a dual-focus intro — your summary and skills side by side at the top, so a recruiter gets your story and your toolkit in one glance — then settles into a clean single column for experience and education. It front-loads what matters most while keeping the long read effortless. A smart structure for anyone whose skills deserve equal billing with their history.",
    bestFor: [
      "Career changers leading with skills",
      "Technical professionals with deep toolkits",
      "Consultants selling capabilities",
      "Recent graduates with strong skills",
      "Freelancers pitching services",
    ],
    designTraits: [
      "Summary and skills side by side at the top",
      "Clean single column for the rest",
      "Front-loaded key information",
      "Balanced intro with effortless long read",
      "Smart structure for skills-first positioning",
    ],
    atsNotes:
      "Mostly single-column, which parses very well. The top dual area is a short two-part row of real text — keep key terms in both parts readable.",
    faqs: [
      {
        q: "Does the side-by-side intro hurt ATS parsing?",
        a: "It is a short row of real text at the top, not a full two-column layout — parsers handle it fine, and the rest is single-column.",
      },
      {
        q: "Is Bifocal good for career changers?",
        a: "Excellent — putting skills beside your summary lets your capabilities lead before your history.",
      },
      {
        q: "Can I reorder the intro panels?",
        a: "The summary-left, skills-right arrangement is fixed by design.",
      },
    ],
    metaTitle: "Bifocal Resume Template — Free Skills-First CV | Cvyon",
    metaDescription:
      "Free Bifocal resume template: a dual-focus intro with summary and skills side by side, then a clean single column for experience.",
  },
  {
    id: "Trifold",
    slug: "trifold",
    name: "Trifold",
    tagline: "Three balanced columns: experience, skills, education.",
    description:
      "Trifold organizes your resume into three balanced columns beneath a full-width centered header: experience, skills, and education each get their own lane with matching section headers. The triptych composition is distinctive and lets three storylines breathe independently — ideal when your skills and education deserve as much space as your work history.",
    bestFor: [
      "Academics with publications and teaching",
      "Multidisciplinary professionals",
      "Creatives with skills, work, and training",
      "Recent graduates balancing all sections",
      "Consultants with three service pillars",
    ],
    designTraits: [
      "Three balanced content columns",
      "Full-width centered header",
      "Matching section headers per column",
      "Triptych composition with breathing room",
      "Equal weight for three storylines",
    ],
    atsNotes:
      "Three-column layouts are the hardest for older parsers — keep critical keywords prominent and check the PDF reading order. All text is real and selectable.",
    faqs: [
      {
        q: "Is a three-column resume ATS-safe?",
        a: "Modern parsers cope, but older ones may read columns out of order. For maximum safety with strict portals, choose a single-column template.",
      },
      {
        q: "How do I balance content across three columns?",
        a: "Give each column a comparable amount of content; the builder's sections map to columns automatically.",
      },
      {
        q: "Can the header color change?",
        a: "Yes — accents and the job title follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Trifold Resume Template — Free Three-Column CV | Cvyon",
    metaDescription:
      "Free Trifold resume template: a distinctive three-column design with experience, skills, and education in balanced lanes.",
  },
  {
    id: "Cascade",
    slug: "cascade",
    name: "Cascade",
    tagline: "Sections that waterfall down the page.",
    description:
      "Cascade gives your resume a waterfall rhythm: each section steps progressively further right as you read down the page, with section headers marked by a bold accent bar. The cascading indent creates visual momentum — your eye flows from one section to the next like water over steps. It is memorable without sacrificing the clean single-column structure recruiters expect.",
    bestFor: [
      "Creatives who want subtle distinction",
      "Marketing and communications professionals",
      "Product designers",
      "Anyone wanting a memorable but safe layout",
      "Professionals with a clear section hierarchy",
    ],
    designTraits: [
      "Progressively indenting sections down the page",
      "Bold accent-bar section markers",
      "Waterfall rhythm with visual momentum",
      "Clean single-column reading order",
      "Memorable yet recruiter-safe structure",
    ],
    atsNotes:
      "Single-column reading order is preserved — the indents are visual only — so parsing is unaffected. All text is real and selectable.",
    faqs: [
      {
        q: "Does the indenting confuse ATS parsers?",
        a: "No — the document still reads top-to-bottom in one column; indentation is purely visual spacing.",
      },
      {
        q: "Is Cascade too unusual for conservative roles?",
        a: "The structure underneath is a standard single-column resume, so it stays professional while looking distinctive.",
      },
      {
        q: "Can the accent bar color change?",
        a: "Yes — the bars and accents follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Cascade Resume Template — Free Waterfall CV | Cvyon",
    metaDescription:
      "Free Cascade resume template: sections waterfall down the page with progressive indents and accent-bar headers. Distinctive yet recruiter-safe.",
  },
  {
    id: "Zigzag",
    slug: "zigzag",
    name: "Zigzag",
    tagline: "Sections that alternate sides down the page.",
    description:
      "Zigzag keeps the reader engaged by alternating each section's alignment: one section sits left, the next right, with section headers flipping direction to match via an accent bar marker. The rhythm is dynamic and editorial, like a well-designed magazine spread. Underneath the movement, every section remains a clean, readable block — distinctive without ever becoming hard to follow.",
    bestFor: [
      "Creative professionals",
      "Editorial and media professionals",
      "Designers and art directors",
      "Marketing storytellers",
      "Anyone wanting an editorial rhythm",
    ],
    designTraits: [
      "Alternating left/right section alignment",
      "Flipping section headers with accent bars",
      "Dynamic editorial rhythm",
      "Magazine-spread feel",
      "Readable blocks beneath the movement",
    ],
    atsNotes:
      "Sections still read top-to-bottom in document order; alignment is visual only, so parsing is unaffected. All text is real and selectable.",
    faqs: [
      {
        q: "Does alternating alignment hurt readability?",
        a: "Each block is internally clean and left-to-right; the alternation adds rhythm without breaking reading flow.",
      },
      {
        q: "Is Zigzag ATS-friendly?",
        a: "Yes — document order is preserved top-to-bottom and all text is real and selectable.",
      },
      {
        q: "Can the accent color change?",
        a: "Yes — the bars and accents follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Zigzag Resume Template — Free Editorial CV | Cvyon",
    metaDescription:
      "Free Zigzag resume template: sections alternate sides down the page in an editorial rhythm with flipping accent-bar headers.",
  },
  {
    id: "Stack",
    slug: "stack",
    name: "Stack",
    tagline: "Your resume as a stack of clean cards.",
    description:
      "Stack presents your resume as a deck of cards: each section sits in its own white rounded card with a soft shadow on a light gray page, and the header card is crowned with a theme-colored top border. The card metaphor makes every section feel self-contained and scannable — a modern, product-like presentation that feels instantly organized.",
    bestFor: [
      "Product managers and tech professionals",
      "Designers familiar with card UIs",
      "Startup applicants",
      "Anyone wanting a modern organized feel",
      "Professionals with clearly separated sections",
    ],
    designTraits: [
      "Each section in its own rounded card",
      "Soft shadows on a light gray page",
      "Header card with theme-colored top border",
      "Self-contained, scannable sections",
      "Modern product-like presentation",
    ],
    atsNotes:
      "Cards are visual containers; the document reads top-to-bottom in one column with real text, so parsing is unaffected.",
    faqs: [
      {
        q: "Do the cards waste space?",
        a: "Card padding is efficient — the design fits a full resume comfortably while gaining scannability from the separation.",
      },
      {
        q: "Is the card style professional enough?",
        a: "Cards are a mainstream modern UI pattern; the result reads as organized and current, not casual.",
      },
      {
        q: "Does the gray background print okay?",
        a: "It prints as a very light gray. For strict black-and-white submissions, a plainer template may be preferable.",
      },
    ],
    metaTitle: "Stack Resume Template — Free Card-Style CV | Cvyon",
    metaDescription:
      "Free Stack resume template: your resume as a stack of clean cards with soft shadows and a theme-bordered header card.",
  },
  {
    id: "Ladder",
    slug: "ladder",
    name: "Ladder",
    tagline: "Your career as rungs on a ladder.",
    description:
      "Ladder visualizes progression: the header opens with three fading vertical bars — like rungs seen from the side — and each role in your experience reads as a rung on your career ladder with clean rails and dates. Section headers are bold and minimal. It is a quiet metaphor for upward movement, perfect for professionals whose story is steady, deliberate advancement.",
    bestFor: [
      "Professionals with clear upward progression",
      "Managers climbing the leadership ladder",
      "Long-tenure employees showing growth",
      "Promoted-from-within candidates",
      "Anyone whose story is advancement",
    ],
    designTraits: [
      "Header with three fading vertical ladder bars",
      "Experience entries as ladder rungs with rails",
      "Clean dates anchoring each rung",
      "Bold minimal section headers",
      "Quiet metaphor for upward movement",
    ],
    atsNotes:
      "Single-column layout with real text and standard headings parses cleanly. The ladder bars are decorative shapes.",
    faqs: [
      {
        q: "Is the ladder metaphor too literal?",
        a: "It is subtle — fading bars in the header and clean rung-like rows — so it reads as design, not illustration.",
      },
      {
        q: "Does it work for lateral career moves?",
        a: "The design emphasizes progression, but clean rows suit any history; the metaphor simply flatters upward stories most.",
      },
      {
        q: "Can the accent color change?",
        a: "Yes — the bars, rails, and accents follow your Cvyon theme color.",
      },
    ],
    metaTitle: "Ladder Resume Template — Free Career-Growth CV | Cvyon",
    metaDescription:
      "Free Ladder resume template: your career as rungs on a ladder, with fading header bars and clean rails for steady, upward professionals.",
  },
  {
    id: "AcademicJournal",
    slug: "academicjournal",
    name: "AcademicJournal",
    tagline: "Your career, typeset like a journal article.",
    description:
      "AcademicJournal borrows the structure of a scholarly paper: your summary becomes an “Abstract” set in justified serif type, and the body splits into two columns under Roman-numeral section headings — I. Professional Appointments, II. Education, III. Technical Skills. The result reads with quiet scholarly authority, perfect for research-adjacent roles where precision matters.",
    bestFor: [
      "Researchers and scientists",
      "Policy analysts and think-tank staff",
      "PhD holders entering industry",
      "Editors and publishers",
      "Librarians and archivists",
    ],
    designTraits: [
      "“Abstract” section for the professional summary",
      "Roman-numeral section headings (I–IV)",
      "Two-column serif body with justified text",
      "Centered journal-style masthead header",
      "Theme-color accents on section rules",
    ],
    atsNotes:
      "The two-column body can challenge older parsers, so keep critical keywords in the main flow and export a PDF to check reading order. All text is real and selectable, and the single-column header parses normally.",
    faqs: [
      {
        q: "What is the “Abstract” section?",
        a: "It is AcademicJournal's name for your professional summary — set like a paper abstract in justified serif type, giving your profile a scholarly frame.",
      },
      {
        q: "Are the Roman numerals just decorative?",
        a: "They structure the document like a journal article's sections, but the words beside them (Professional Appointments, Education) are standard headings parsers recognize.",
      },
      {
        q: "Who is this template really for?",
        a: "Anyone whose credibility rests on research, writing, or deep expertise — scientists, analysts, editors, and academics moving into industry roles.",
      },
    ],
    metaTitle: "AcademicJournal Resume Template — Free Scholarly CV | Cvyon",
    metaDescription:
      "Free AcademicJournal resume template: a journal-style CV with an abstract summary and Roman-numeral sections. For researchers and analysts.",
  },
  {
    id: "Atelier",
    slug: "atelier",
    name: "Atelier",
    tagline: "Gallery-quiet minimalism for creative professionals.",
    description:
      "Atelier treats your resume like a studio wall: an enormous light-weight name with wide letter spacing, a grayscale portrait, and vast whitespace between sections separated only by faint hairline rules. Small tracked labels replace shouty headers. It is the template for people whose work speaks visually and who want the document to whisper, not shout.",
    bestFor: [
      "Graphic and visual designers",
      "Photographers and art directors",
      "Architects and interior designers",
      "Fashion and luxury professionals",
      "Creative directors",
    ],
    designTraits: [
      "Oversized light-weight name with wide tracking",
      "Grayscale portrait treatment",
      "Hairline dividers instead of boxed sections",
      "Small tracked label headers",
      "Expansive gallery-style whitespace",
    ],
    atsNotes:
      "The extreme minimalism is beautiful but sparse: standard section labels are present and text is real, though the airy layout means less keyword density per page. Best for roles where a human reads first.",
    faqs: [
      {
        q: "Is Atelier too minimal for recruiters?",
        a: "For creative roles, restraint is a credential — it demonstrates design judgment. For high-volume ATS-first applications, pair it with a denser template.",
      },
      {
        q: "Can I use Atelier without a photo?",
        a: "Yes — the layout holds its balance without one, and the wide spacing keeps the header elegant either way.",
      },
      {
        q: "Why is everything so spaced out?",
        a: "Whitespace is Atelier's luxury signal. It paces the reader and makes each section feel considered, like work hung in a gallery.",
      },
    ],
    metaTitle: "Atelier Resume Template — Free Minimalist Creative CV | Cvyon",
    metaDescription:
      "Free Atelier resume template: gallery-quiet minimalism with an oversized light name and hairline dividers. For designers and creatives.",
  },
  {
    id: "Caliber",
    slug: "caliber",
    name: "Caliber",
    tagline: "Bold type and skill bars that measure your impact.",
    description:
      "Caliber leads with a five-extra-bold name in your theme color, then quantifies you: skills render as proficiency bars in a two-column grid, and experience entries carry large bold role titles with theme-colored company names. It is a performance resume — built for candidates who want their capability to look measurable at a glance.",
    bestFor: [
      "Sales professionals with quotas to show",
      "Engineers with deep technical stacks",
      "Project managers",
      "Consultants",
      "Anyone whose strengths are best shown as levels",
    ],
    designTraits: [
      "Extra-bold theme-colored name headline",
      "Skill proficiency bars in a two-column grid",
      "Large bold role titles",
      "Theme-colored company names",
      "High-contrast, high-energy hierarchy",
    ],
    atsNotes:
      "Skill bars are visual only — the skill names beside them are real text and parse normally. Keep the strongest skills first so both humans and parsers meet them early.",
    faqs: [
      {
        q: "Do the skill bars hurt ATS parsing?",
        a: "No. The bars are decorative fills; every skill name is real selectable text that parsers read normally.",
      },
      {
        q: "Is Caliber too bold for conservative industries?",
        a: "It is confident rather than flashy — the boldness is typographic, not colorful. It works wherever results matter, including finance and tech.",
      },
      {
        q: "How should I order my skills?",
        a: "Strongest first. The bars give visual weight, so lead with the capabilities most relevant to the role you're targeting.",
      },
    ],
    metaTitle: "Caliber Resume Template — Free Bold CV with Skill Bars | Cvyon",
    metaDescription:
      "Free Caliber resume template: bold theme-colored headlines with skill proficiency bars. For high-impact professionals.",
  },
  {
    id: "Classic",
    slug: "classic",
    name: "Classic",
    tagline: "The timeless serif resume that never goes out of style.",
    description:
      "Classic is the resume everyone pictures: centered serif name in uppercase, a ruled contact line, centered section headers with bottom borders, and a tidy two-column footer for skills and references. Black ink on white with one-inch margins. It has no tricks because it needs none — this is the format hiring managers have read comfortably for decades.",
    bestFor: [
      "First-time job seekers",
      "Career changers",
      "Administrative professionals",
      "Anyone applying through traditional portals",
      "Conservative industries",
    ],
    designTraits: [
      "Centered uppercase serif name",
      "Centered section headers with bottom rules",
      "Ruled contact line under the header",
      "Two-column skills and references footer",
      "One-inch margins, black on white",
    ],
    atsNotes:
      "As ATS-friendly as resumes get: single column, standard headings, real text throughout, no graphics or tables. If a portal accepts only one format safely, this is it.",
    faqs: [
      {
        q: "Is Classic too plain?",
        a: "Plain is its strategy. In conservative fields and high-volume portals, a clean classic outperforms decorative templates because nothing distracts from your record.",
      },
      {
        q: "Can I add color to Classic?",
        a: "Your theme color applies subtly where supported, but Classic's strength is its black-and-white discipline — it reads as serious either way.",
      },
      {
        q: "Who should avoid Classic?",
        a: "Creative roles where visual distinctiveness is part of the application. Everywhere else, it is a safe, strong choice.",
      },
    ],
    metaTitle: "Classic Resume Template — Free Traditional Serif CV | Cvyon",
    metaDescription:
      "Free Classic resume template: the timeless centered serif resume with ruled sections. Maximum ATS safety, zero gimmicks.",
  },
  {
    id: "Clarity",
    slug: "clarity",
    name: "Clarity",
    tagline: "High-contrast black-on-white with total legibility.",
    description:
      "Clarity is built for instant reading: a circular portrait ringed in thick black, a bold oversized name, square bullet markers, and skills as bordered chips — everything in pure black on white at generous sizes. No gray text, no faint elements, nothing to squint at. When your resume must survive a six-second scan, Clarity makes every second count.",
    bestFor: [
      "High-volume application blasts",
      "Blue-collar and skilled trades",
      "Customer-facing roles",
      "Older hiring managers",
      "Anyone prioritizing readability above all",
    ],
    designTraits: [
      "Circular portrait with thick black border",
      "Pure black type at generous sizes",
      "Square bullet markers",
      "Bordered skill chips",
      "Short thick rule under the header",
    ],
    atsNotes:
      "Excellent for parsing: single column, large real text, standard headings, no low-contrast elements. One of the safest templates for older ATS software.",
    faqs: [
      {
        q: "Why is everything black?",
        a: "Maximum contrast means maximum legibility — on screen, in print, and through scanners. Clarity trades color for readability and wins.",
      },
      {
        q: "Do I need a photo for Clarity?",
        a: "No. The layout works cleanly without one; the portrait is optional and the bold header carries the design on its own.",
      },
      {
        q: "Is Clarity professional enough for office roles?",
        a: "Yes — its discipline reads as confident and straightforward, which suits operations, admin, sales, and service roles well.",
      },
    ],
    metaTitle: "Clarity Resume Template — Free High-Contrast CV | Cvyon",
    metaDescription:
      "Free Clarity resume template: bold black-on-white design with bordered skill chips for maximum legibility. Reads instantly.",
  },
  {
    id: "Condensed",
    slug: "condensed",
    name: "Condensed",
    tagline: "A full career on one page, without the clutter.",
    description:
      "Condensed is an exercise in disciplined density: compact 11px type, tight spacing, theme-colored small-caps headers with bottom borders, and single-line role rows that fit title, company, and dates together. It is engineered for experienced candidates who refuse to spill onto page two — everything fits, and nothing feels cramped.",
    bestFor: [
      "Senior professionals condensing long careers",
      "Consultants with many engagements",
      "Academics trimming long CVs",
      "Anyone with a strict one-page requirement",
      "Contractors with dense work histories",
    ],
    designTraits: [
      "Compact 11px type with tight spacing",
      "Small-caps theme headers with bottom borders",
      "Single-line role/company/date rows",
      "Efficient two-part contact header",
      "One-page discipline throughout",
    ],
    atsNotes:
      "Single-column flow with real text throughout parses cleanly. The small type is a human-readability choice, not a parsing issue — keep it at this size and it stays comfortable.",
    faqs: [
      {
        q: "Will recruiters struggle with the small text?",
        a: "Condensed uses 11px body type — standard for professional resumes — with strong headers and spacing, so it reads cleanly despite the density.",
      },
      {
        q: "How much can fit on one page?",
        a: "Far more than a standard template: single-line rows and tight bullets compress a 10+ year history onto one page without looking squeezed.",
      },
      {
        q: "When should I not use Condensed?",
        a: "Early-career candidates with little to list — the density looks empty rather than efficient. It is built for people with a lot to say.",
      },
    ],
    metaTitle: "Condensed Resume Template — Free Compact One-Page CV | Cvyon",
    metaDescription:
      "Free Condensed resume template: disciplined high-density layout that fits a full career on one page. Compact without clutter.",
  },
  {
    id: "CorporateBlue",
    slug: "corporateblue",
    name: "CorporateBlue",
    tagline: "Boardroom polish with navy, gold, and a full-bleed header.",
    description:
      "CorporateBlue opens with a full-bleed theme-colored header band carrying your name at 44px, then settles into a navy-and-gold system: gold accents, tracked micro-labels, a gold-bordered summary, and skill tags in a two-column footer. It is the visual language of banks, consultancies, and multinationals — formal, expensive-looking, and unmistakably corporate.",
    bestFor: [
      "Banking and finance professionals",
      "Management consultants",
      "Corporate executives",
      "Insurance and legal-adjacent roles",
      "Multinational corporate applications",
    ],
    designTraits: [
      "Full-bleed theme-colored header band",
      "Gold accent system throughout",
      "Navy body text for formality",
      "Gold-bordered summary block",
      "Skill tags in a two-column footer",
    ],
    atsNotes:
      "The header is a solid color fill behind real text, so your name and contact details parse normally. The single-column body with standard headings keeps parsing straightforward.",
    faqs: [
      {
        q: "Is the blue fixed or can I change it?",
        a: "The header follows your Cvyon theme color — pick navy for the classic corporate look, or shift it while keeping the gold accent system.",
      },
      {
        q: "Does the dark header hurt ATS parsing?",
        a: "No. It is a solid fill behind real selectable text, not an image. Parsers read your name and contact line normally.",
      },
      {
        q: "Is CorporateBlue too formal for startups?",
        a: "It speaks boardroom, not garage. For startups and creative roles, choose something lighter; for enterprise, it is exactly right.",
      },
    ],
    metaTitle: "CorporateBlue Resume Template — Free Corporate CV | Cvyon",
    metaDescription:
      "Free CorporateBlue resume template: full-bleed header with navy-and-gold corporate polish. For banking, consulting, and executives.",
  },
  {
    id: "Counsel",
    slug: "counsel",
    name: "Counsel",
    tagline: "Legal-grade formality in centered serif.",
    description:
      "Counsel is built for professions where words carry weight: a centered five-extra-large serif name, an italic title line, and section headers in tracked theme color flanked by hairline rules. Experience reads in justified serif paragraphs like a well-drafted brief. It signals precision, discretion, and judgment — the qualities clients pay counsel for.",
    bestFor: [
      "Lawyers and attorneys",
      "Legal consultants and paralegals",
      "Policy advisors",
      "Compliance professionals",
      "Executive advisors",
    ],
    designTraits: [
      "Centered extra-large serif name",
      "Italic title line",
      "Tracked theme-color section headers with flanking rules",
      "Justified serif body text",
      "Formal, symmetrical composition",
    ],
    atsNotes:
      "Single-column, standard headings, real text — parses cleanly. Justified text is a visual setting only and does not affect parsing.",
    faqs: [
      {
        q: "Is Counsel only for lawyers?",
        a: "It was designed with legal formality in mind, but any advisory role — consulting, compliance, policy — benefits from its measured tone.",
      },
      {
        q: "Why justified text?",
        a: "It mirrors legal documents and briefs, giving the page a drafted, deliberate feel. The trade-off is slightly wider word spacing, which suits the formal aesthetic.",
      },
      {
        q: "Can Counsel work for in-house roles?",
        a: "Yes — corporate counsel, compliance, and governance roles all fit its register of precision and trust.",
      },
    ],
    metaTitle: "Counsel Resume Template — Free Legal CV Template | Cvyon",
    metaDescription:
      "Free Counsel resume template: formal centered serif with justified text for legal and advisory professionals. Precision on the page.",
  },
  {
    id: "Diplomat",
    slug: "diplomat",
    name: "Diplomat",
    tagline: "Quiet international polish with refined restraint.",
    description:
      "Diplomat is poise on paper: a circular portrait, an uppercase name with wide tracking, and a centered italic summary on warm off-white. Sections open with small tracked labels and a single short rule; experience unfolds in dot-led lines. It is the resume equivalent of a well-cut suit — appropriate in any capital, in any boardroom.",
    bestFor: [
      "International relations professionals",
      "NGO and nonprofit leaders",
      "Executives and senior managers",
      "Hospitality leadership",
      "Anyone applying across cultures",
    ],
    designTraits: [
      "Circular portrait with soft shadow",
      "Uppercase wide-tracked name",
      "Centered italic summary",
      "Small tracked section labels with divider rules",
      "Warm off-white paper tone",
    ],
    atsNotes:
      "Single-column flow, standard headings, real text — parsing is clean. The centered layout is visual only and does not affect text extraction.",
    faqs: [
      {
        q: "Is Diplomat too soft for competitive roles?",
        a: "Its softness is confidence: the restraint reads as seniority. It suits leadership and international roles where composure matters.",
      },
      {
        q: "Do I need a photo?",
        a: "No — the design balances perfectly without one. Include it only where photos are customary.",
      },
      {
        q: "What paper should I print it on?",
        a: "A warm white or cream stock complements the off-white tone and elevates the tactile impression.",
      },
    ],
    metaTitle: "Diplomat Resume Template — Free Elegant International CV | Cvyon",
    metaDescription:
      "Free Diplomat resume template: refined centered design with warm paper tones. For executives and international professionals.",
  },
  {
    id: "Elegant",
    slug: "elegant",
    name: "Elegant",
    tagline: "Understated luxury with wide margins and gray tones.",
    description:
      "Elegant believes restraint is the ultimate luxury: extra-wide 1.2-inch margins, a light uppercase name framed by double rules, a centered italic summary, and section labels in small tracked gray. The palette barely rises above charcoal and silver. For senior professionals who have nothing left to prove, it proves it anyway.",
    bestFor: [
      "Senior executives",
      "Luxury brand professionals",
      "Private banking and wealth management",
      "Board candidates",
      "Established consultants",
    ],
    designTraits: [
      "Extra-wide 1.2-inch margins",
      "Double-rule framed header",
      "Light uppercase wide-tracked name",
      "Centered italic summary",
      "Charcoal-and-silver restrained palette",
    ],
    atsNotes:
      "Single column with real text and standard headings parses well. The wide margins reduce content per page — keep entries concise so nothing important spills.",
    faqs: [
      {
        q: "Is Elegant too plain for its name?",
        a: "Its elegance is in proportion and restraint, not ornament. Like a tailored suit, the quality is in the cut — margins, tracking, and balance.",
      },
      {
        q: "Who should not use Elegant?",
        a: "Early-career candidates — the wide margins and airy layout need substantive content to feel intentional rather than empty.",
      },
      {
        q: "Does it work in color?",
        a: "It is designed for grayscale discipline; your theme color applies sparingly. The power is in the monochrome restraint.",
      },
    ],
    metaTitle: "Elegant Resume Template — Free Luxury Minimal CV | Cvyon",
    metaDescription:
      "Free Elegant resume template: wide margins, double-rule header, and restrained gray tones. Understated luxury for senior professionals.",
  },
  {
    id: "ElegantEditorial",
    slug: "eleganteditorial",
    name: "ElegantEditorial",
    tagline: "A magazine-spread resume on warm editorial paper.",
    description:
      "ElegantEditorial sets your career like a magazine feature: warm cream paper, an italic oversized name flanked by hairline rules, and a two-column body where a narrow rail holds contact and skills beside a wide main column. Small-caps section headers with bottom borders complete the editorial rhythm. It reads as cultured and literate — ideal for content, media, and communications leaders.",
    bestFor: [
      "Editors and publishers",
      "Content strategists",
      "Communications directors",
      "Brand storytellers",
      "Academics with a public profile",
    ],
    designTraits: [
      "Warm cream paper background",
      "Italic oversized name with flanking rules",
      "Two-column body with bordered rail",
      "Small-caps section headers with bottom borders",
      "Magazine-style editorial rhythm",
    ],
    atsNotes:
      "The two-column body can challenge older parsers — keep key job titles and employers in the main column and check reading order in the exported PDF. All text is real and selectable.",
    faqs: [
      {
        q: "Is the cream background a problem for printing?",
        a: "It prints as a very light warm tint that stays professional; on screen it gives the page its distinctive editorial warmth.",
      },
      {
        q: "Who is ElegantEditorial best for?",
        a: "People whose work is words and ideas — editors, writers, comms leaders, and strategists who want the document itself to show editorial judgment.",
      },
      {
        q: "Does the two-column layout hurt ATS?",
        a: "Modern parsers handle it well since all text is real. For very old portals, a single-column template is the safer fallback.",
      },
    ],
    metaTitle: "ElegantEditorial Resume Template — Free Editorial CV | Cvyon",
    metaDescription:
      "Free ElegantEditorial resume template: magazine-style two-column resume on warm paper. For editors, writers, and comms leaders.",
  },
  {
    id: "Executive",
    slug: "executive",
    name: "Executive",
    tagline: "C-suite authority with a heavy black rule.",
    description:
      "Executive announces seniority before a word is read: a five-extra-large black uppercase name, a thick four-pixel rule under the header, and a right-aligned contact block. The summary sits as an italic pull-quote with a left border; experience carries large bold titles with tracked gray dates. It is the resume of someone used to being the most senior person in the room.",
    bestFor: [
      "C-suite executives",
      "VPs and directors",
      "General managers",
      "Board candidates",
      "Senior public-sector leaders",
    ],
    designTraits: [
      "Extra-large black uppercase name",
      "Thick 4px rule under the header",
      "Right-aligned contact block",
      "Italic pull-quote summary with left border",
      "Large bold role titles with tracked dates",
    ],
    atsNotes:
      "Single-column flow with standard headings and real text parses cleanly. The heavy rules are visual only and do not interfere with extraction.",
    faqs: [
      {
        q: "Is Executive too aggressive?",
        a: "It is assertive, not aggressive — the weight is typographic and reads as established authority, which is exactly what senior hiring expects.",
      },
      {
        q: "Can mid-level managers use Executive?",
        a: "It works best when the content matches the frame. Directors and above will feel at home; earlier-career candidates may find it oversells.",
      },
      {
        q: "Why is the contact block right-aligned?",
        a: "It creates a classic executive letterhead balance — name commanding the left, details discreet on the right.",
      },
    ],
    metaTitle: "Executive Resume Template — Free C-Suite CV | Cvyon",
    metaDescription:
      "Free Executive resume template: bold black uppercase name with heavy rules for C-suite authority. For senior leaders.",
  },
  {
    id: "ExecutiveSplit",
    slug: "executivesplit",
    name: "ExecutiveSplit",
    tagline: "Commanding band header over an organized two-column body.",
    description:
      "ExecutiveSplit pairs presence with structure: a six-pixel black band header with your name in tracked uppercase, then a 65/35 split body where experience commands the wide column and supporting sections sit in the narrow one. Section headers are inline-block with black underlines; square bullets keep the tone crisp. Authority, organized.",
    bestFor: [
      "Senior managers",
      "Operations leaders",
      "Program directors",
      "Experienced consultants",
      "Leaders with broad supporting credentials",
    ],
    designTraits: [
      "6px black band header",
      "Tracked uppercase centered name",
      "65/35 two-column body",
      "Inline-block section headers with black underlines",
      "Square bullet markers",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep critical keywords in the main column and verify reading order in the exported PDF. All text is real and selectable.",
    faqs: [
      {
        q: "How is ExecutiveSplit different from Executive?",
        a: "Executive is a single commanding column; ExecutiveSplit adds a narrow rail for skills, education, and credentials, keeping the main column focused on leadership experience.",
      },
      {
        q: "What goes in the narrow column?",
        a: "Supporting material — skills, education, certifications, languages — so your experience column stays clean and dominant.",
      },
      {
        q: "Is the black band too heavy?",
        a: "It is the design's signature: a confident frame that makes your name unmissable while the body stays light and readable.",
      },
    ],
    metaTitle: "ExecutiveSplit Resume Template — Free Two-Column Executive CV | Cvyon",
    metaDescription:
      "Free ExecutiveSplit resume template: black band header with a 65/35 split body. Authority with organized structure.",
  },
  {
    id: "Forge",
    slug: "forge",
    name: "Forge",
    tagline: "Industrial-strength type, built not decorated.",
    description:
      "Forge is heavy metal for resumes: an eight-pixel theme bar across the top, a five-extra-large black uppercase name, and section headers with thick theme underlines. Skills sit as bordered cards in a two-column grid; the summary carries a theme left border. It reads as forged — strong, deliberate, and built to hold weight.",
    bestFor: [
      "Engineers and technicians",
      "Manufacturing professionals",
      "Operations managers",
      "Skilled trades leaders",
      "Anyone who builds things",
    ],
    designTraits: [
      "8px theme top bar",
      "Extra-large black uppercase name",
      "Thick theme-underlined section headers",
      "Bordered skill cards in a two-column grid",
      "Theme-bordered summary block",
    ],
    atsNotes:
      "Single-column flow with real text and standard headings parses well. The bordered skill cards are simple bordered boxes, not tables, so extraction stays clean.",
    faqs: [
      {
        q: "Is Forge too heavy for office roles?",
        a: "Its weight is typographic confidence, not clutter. It suits any role where capability and reliability matter — which is most of them.",
      },
      {
        q: "Can I soften Forge with my theme color?",
        a: "Yes — the theme bar, underlines, and borders all follow your color choice, so a cooler tone tempers the industrial edge.",
      },
      {
        q: "Why bordered skill cards?",
        a: "They give each capability visual mass, like plates riveted to a structure — appropriate for a template about built strength.",
      },
    ],
    metaTitle: "Forge Resume Template — Free Bold Industrial CV | Cvyon",
    metaDescription:
      "Free Forge resume template: heavy black type with theme bars and bordered skill cards. Built-strong resumes for builders.",
  },
  {
    id: "Founder",
    slug: "founder",
    name: "Founder",
    tagline: "Startup energy with a project-forward layout.",
    description:
      "Founder is the resume of someone who ships: a six-extra-large black name, your title in theme color, a circular portrait, and a full-width theme rule dividing a project-forward body. The summary sits behind a theme left border like a thesis statement. It tells investors, partners, and hiring managers one thing: this person builds.",
    bestFor: [
      "Startup founders and co-founders",
      "Entrepreneurs",
      "Product managers",
      "Indie hackers and makers",
      "Anyone with ventures to showcase",
    ],
    designTraits: [
      "Six-extra-large black name",
      "Theme-colored title line",
      "Full-width theme divider rule",
      "Project-forward section ordering",
      "Theme-bordered thesis-style summary",
    ],
    atsNotes:
      "Single-column, real text, standard headings — parses cleanly. The project-forward ordering is a section-order choice only and does not affect extraction.",
    faqs: [
      {
        q: "I'm not a founder — can I still use Founder?",
        a: "Absolutely. It is really a builder's template: product managers, makers, and anyone with projects worth leading with will feel at home.",
      },
      {
        q: "Why are projects so prominent?",
        a: "For founders and builders, shipped work is the credential. Founder puts ventures where they belong — near the top.",
      },
      {
        q: "Is Founder too casual for corporate roles?",
        a: "It is energetic rather than casual — the typography stays disciplined. For innovation and product roles inside corporates, it fits well.",
      },
    ],
    metaTitle: "Founder Resume Template — Free Startup CV Template | Cvyon",
    metaDescription:
      "Free Founder resume template: bold startup-style CV with project-forward layout. For founders, builders, and product people.",
  },
  {
    id: "Gigfolio",
    slug: "gigfolio",
    name: "Gigfolio",
    tagline: "A freelancer's portfolio-resume with gig-grid experience.",
    description:
      "Gigfolio is built for portfolio careers: a theme top bar, a rounded portrait beside a six-extra-large black name, and experience laid out on a twelve-column grid — dates in a narrow rail, roles and results in the wide span. It handles many short engagements gracefully, reading as a curated portfolio of work rather than a job list.",
    bestFor: [
      "Freelancers and contractors",
      "Gig workers with many clients",
      "Creatives with project-based careers",
      "Consultants",
      "Portfolio-career professionals",
    ],
    designTraits: [
      "Theme top bar",
      "Twelve-column gig-grid experience layout",
      "Narrow date rail beside wide content span",
      "Rounded portrait treatment",
      "Portfolio-style curation of engagements",
    ],
    atsNotes:
      "The grid is visual — text remains real and linear in the document order. Keep each engagement's title and client in the wide span so parsers meet them in a natural reading sequence.",
    faqs: [
      {
        q: "How does Gigfolio handle many short gigs?",
        a: "The narrow date rail keeps timelines scannable while the wide span gives each engagement room — many clients fit without visual chaos.",
      },
      {
        q: "Is Gigfolio only for freelancers?",
        a: "It shines for any project-based history: contractors, consultants, and creatives. Traditional single-employer careers may prefer a classic layout.",
      },
      {
        q: "Can clients see my portfolio links?",
        a: "Yes — project entries support links, and the layout gives them prominence so your work is one click away.",
      },
    ],
    metaTitle: "Gigfolio Resume Template — Free Freelancer CV | Cvyon",
    metaDescription:
      "Free Gigfolio resume template: portfolio-style CV with a gig-grid experience layout. For freelancers and contractors.",
  },
  {
    id: "Launchpad",
    slug: "launchpad",
    name: "Launchpad",
    tagline: "A career-starter template with lift-off energy.",
    description:
      "Launchpad is the first-job resume done right: a theme-colored header block with your portrait and name in white, experience entries with theme left borders, and projects presented as cards in a two-column grid. It gives students and early-career candidates a structure that makes internships, coursework, and side projects look like the beginnings of a trajectory.",
    bestFor: [
      "Students and recent graduates",
      "Internship seekers",
      "Career starters",
      "Bootcamp graduates",
      "Anyone with more potential than history",
    ],
    designTraits: [
      "Theme-colored header block with portrait",
      "Theme-bordered experience entries",
      "Two-column project cards",
      "White-on-theme name treatment",
      "Upbeat, structured starter layout",
    ],
    atsNotes:
      "Single-column body with real text and standard headings parses cleanly. The colored header is a solid fill behind real text, not an image.",
    faqs: [
      {
        q: "I have almost no experience — will Launchpad look empty?",
        a: "It is designed for exactly that: projects, coursework, and internships fill the card grids so potential reads as substance.",
      },
      {
        q: "Is Launchpad too colorful for serious applications?",
        a: "The color is contained in the header; the body is clean and professional. It reads as confident, not casual.",
      },
      {
        q: "Can experienced candidates use Launchpad?",
        a: "Its starter framing suits early careers best. Experienced professionals will find more fitting options among the senior templates.",
      },
    ],
    metaTitle: "Launchpad Resume Template — Free Graduate CV | Cvyon",
    metaDescription:
      "Free Launchpad resume template: energetic starter CV with project cards and a theme header. For students and graduates.",
  },
  {
    id: "Maitre",
    slug: "maitre",
    name: "Maitre",
    tagline: "Fine-dining refinement for hospitality professionals.",
    description:
      "Maitre serves your career like a tasting menu: warm paper, a centered serif name, an italic title, and a diamond divider setting off the contact line. The summary is centered and italic like a menu description; experience entries are centered compositions with serif role titles. It is unmistakably hospitality — polished, welcoming, and precise.",
    bestFor: [
      "Chefs and culinary professionals",
      "Hotel and restaurant managers",
      "Sommeliers and F&B specialists",
      "Event planners",
      "Luxury service professionals",
    ],
    designTraits: [
      "Warm paper background",
      "Diamond divider ornament",
      "Centered serif compositions",
      "Italic menu-style summary",
      "Fine-dining visual register",
    ],
    atsNotes:
      "Centered single-column layout with real text and standard headings parses normally — centering is visual only. Keep role titles standard so parsers recognize them.",
    faqs: [
      {
        q: "Is Maitre only for chefs?",
        a: "It was composed for hospitality — chefs, hoteliers, event professionals — but any service role that values polish can wear it well.",
      },
      {
        q: "Will the centered layout confuse ATS?",
        a: "No. Text extraction ignores alignment; all content is real text in a logical order with standard section headings.",
      },
      {
        q: "Why the diamond divider?",
        a: "It is a quiet nod to fine-dining plating and hotel stationery — a small ornament that sets the register without clutter.",
      },
    ],
    metaTitle: "Maitre Resume Template — Free Hospitality CV | Cvyon",
    metaDescription:
      "Free Maitre resume template: fine-dining style CV with diamond dividers and warm paper. For chefs and hospitality pros.",
  },
  {
    id: "Marketing",
    slug: "marketing",
    name: "Marketing",
    tagline: "A marketer's resume with brand energy.",
    description:
      "Marketing practices what it preaches: a tilted monogram badge with your initials, a five-extra-large black name, and your title in uppercase theme color. Experience entries carry pill date badges; bullets are led by theme markers. The summary sits in a soft bordered card. It is a personal brand piece — exactly what a marketing hire should submit.",
    bestFor: [
      "Marketing managers and directors",
      "Brand strategists",
      "Content marketers",
      "Growth marketers",
      "Social media professionals",
    ],
    designTraits: [
      "Tilted monogram initial badge",
      "Extra-large black name with uppercase theme title",
      "Pill date badges on experience",
      "Theme-led bullet markers",
      "Bordered summary card",
    ],
    atsNotes:
      "Single-column body with real text parses cleanly. The monogram badge is decorative; your name appears as real text beside it, so parsing is unaffected.",
    faqs: [
      {
        q: "Is the tilted badge too playful?",
        a: "It is a controlled tilt — a deliberate brand gesture, not a joke. For marketing roles, showing brand instincts in the document itself is an asset.",
      },
      {
        q: "Can I change the badge color?",
        a: "Yes — it follows your Cvyon theme color, so your personal brand color carries through the whole document.",
      },
      {
        q: "Does Marketing work outside marketing roles?",
        a: "Its energy suits any role where communication matters — sales, PR, and creative leadership. Conservative fields may prefer something quieter.",
      },
    ],
    metaTitle: "Marketing Resume Template — Free Marketer CV | Cvyon",
    metaDescription:
      "Free Marketing resume template: personal-brand CV with monogram badge and pill date badges. For marketers who ship.",
  },
  {
    id: "Mentor",
    slug: "mentor",
    name: "Mentor",
    tagline: "A coach's resume built on guidance and growth.",
    description:
      "Mentor carries the tone of a good advisor: a theme-bordered header with portrait, an italic summary that reads like counsel, experience rows with theme left borders, and skills as rounded outline pills. Education entries appear as bordered cards with theme dot markers. It suits people whose work is developing others — the design itself feels supportive.",
    bestFor: [
      "Coaches and mentors",
      "Teachers and trainers",
      "L&D professionals",
      "Team leads",
      "Community managers",
    ],
    designTraits: [
      "Theme-bordered header",
      "Italic counsel-style summary",
      "Theme-bordered experience rows",
      "Rounded outline skill pills",
      "Bordered education cards with dot markers",
    ],
    atsNotes:
      "Single-column flow with real text and standard headings parses well. The bordered cards are simple boxes, not tables, keeping extraction clean.",
    faqs: [
      {
        q: "Is Mentor only for teachers?",
        a: "No — it fits anyone whose value is growing people: coaches, trainers, team leads, and L&D professionals.",
      },
      {
        q: "Why an italic summary?",
        a: "It reads as voice rather than statement — like advice from a mentor — which sets the template's supportive register.",
      },
      {
        q: "Can Mentor handle corporate roles?",
        a: "Yes, especially people-management and enablement roles where developing others is the job.",
      },
    ],
    metaTitle: "Mentor Resume Template — Free Coaching CV | Cvyon",
    metaDescription:
      "Free Mentor resume template: supportive design with bordered rows and outline skill pills. For coaches and educators.",
  },
  {
    id: "MinimalistSplit",
    slug: "minimalistsplit",
    name: "MinimalistSplit",
    tagline: "The classic 35/65 sidebar split, perfectly balanced.",
    description:
      "MinimalistSplit is the two-column resume refined to its essence: a theme-colored sidebar holding your initial avatar, contact details, and skills as translucent cards, beside a light main column for summary, experience, and education. Gray tracked micro-labels keep both sides organized. It is the most imitated layout in resume design — here in its cleanest form.",
    bestFor: [
      "General professional use",
      "Designers and creatives",
      "Tech professionals",
      "Career changers",
      "Anyone wanting a modern, scannable layout",
    ],
    designTraits: [
      "35/65 theme-colored sidebar split",
      "Initial avatar circle in the sidebar",
      "Translucent skill cards",
      "Gray tracked micro-labels",
      "Light, airy main column",
    ],
    atsNotes:
      "Two-column layouts can challenge older parsers: keep critical keywords (titles, employers) in the main column and check reading order in the exported PDF. All text is real and selectable.",
    faqs: [
      {
        q: "Will the sidebar confuse ATS software?",
        a: "Modern parsers handle sidebar layouts well, and all text is real. For very old portals, a single-column template is the safest fallback.",
      },
      {
        q: "What goes in the sidebar?",
        a: "Contact details, skills, and compact sections — keeping the main column focused on your experience story.",
      },
      {
        q: "Can I change the sidebar color?",
        a: "Yes — it follows your Cvyon theme color, so the whole design re-skins with one choice.",
      },
    ],
    metaTitle: "MinimalistSplit Resume Template — Free Sidebar CV | Cvyon",
    metaDescription:
      "Free MinimalistSplit resume template: the classic sidebar split with skill cards and clean hierarchy. Modern and scannable.",
  },
  {
    id: "ModernGradient",
    slug: "moderngradient",
    name: "ModernGradient",
    tagline: "A contemporary gradient header with card-based sections.",
    description:
      "ModernGradient brings a product-design sensibility to resumes: a rounded gradient header card with your portrait and name, a soft gray summary card with a theme left border, and experience presented as white cards with date pills in a two-column body. It feels like a well-designed app — current, friendly, and confident.",
    bestFor: [
      "Product managers",
      "UX/UI designers",
      "Tech professionals",
      "Startup applicants",
      "Digital marketers",
    ],
    designTraits: [
      "Rounded gradient header card",
      "Portrait with soft ring treatment",
      "Card-based experience entries with date pills",
      "Soft gray summary card with theme border",
      "Two-column contemporary body",
    ],
    atsNotes:
      "The header is a gradient fill behind real text, so name and contact parse normally. Card layouts are visual boxes, not tables — but as a two-column design, verify reading order in the exported PDF for older parsers.",
    faqs: [
      {
        q: "Does the gradient print well?",
        a: "Yes — it renders as a smooth, professional gradient in PDF and print. It is bold but tasteful, not neon.",
      },
      {
        q: "Is ModernGradient too trendy?",
        a: "It is current without being faddish: the card system and soft geometry are now standard in professional digital design.",
      },
      {
        q: "Can I use it for conservative industries?",
        a: "Choose a deeper theme color and it tempers nicely — but its natural home is tech, product, and creative companies.",
      },
    ],
    metaTitle: "ModernGradient Resume Template — Free Modern CV | Cvyon",
    metaDescription:
      "Free ModernGradient resume template: gradient header card with card-based sections. Contemporary design for modern roles.",
  },
  {
    id: "NightShift",
    slug: "nightshift",
    name: "NightShift",
    tagline: "Calm neutral cards with a centered, composed header.",
    description:
      "NightShift keeps things composed: a centered header with your name and theme-colored title, then experience rendered as soft neutral cards with theme left borders in a single column, and skills as cards in a two-column grid. The neutral palette and generous line-height make long reads effortless — a steady, reliable presence on the page.",
    bestFor: [
      "Operations professionals",
      "Support and service roles",
      "Analysts",
      "Project coordinators",
      "Anyone wanting calm professionalism",
    ],
    designTraits: [
      "Centered composed header",
      "Soft neutral experience cards with theme borders",
      "Two-column skill card grid",
      "Generous line-height for readability",
      "Calm, steady neutral palette",
    ],
    atsNotes:
      "Single-column flow with real text and standard headings parses cleanly. The cards are simple bordered boxes, not tables, so extraction stays straightforward.",
    faqs: [
      {
        q: "Is NightShift a dark template?",
        a: "No — despite the name, it is a light, calm design. The name nods to its composed, after-hours steadiness, not a dark mode.",
      },
      {
        q: "Why cards instead of plain entries?",
        a: "Cards give each role its own visual container, which helps recruiters scan discrete positions — especially useful with several roles.",
      },
      {
        q: "Is it formal enough for corporate use?",
        a: "Yes. The neutrality and structure read as dependable and professional across industries.",
      },
    ],
    metaTitle: "NightShift Resume Template — Free Calm Professional CV | Cvyon",
    metaDescription:
      "Free NightShift resume template: calm neutral cards with a centered header. Steady, readable professionalism.",
  },
  {
    id: "ParsePerfect",
    slug: "parseperfect",
    name: "ParsePerfect",
    tagline: "Engineered for applicant tracking systems.",
    description:
      "ParsePerfect has one job: get through the robots. Pure black text on white, zero color, zero graphics, standard section headings, and a strict single-column flow — every choice serves machine readability. When you're applying through portals with aggressive ATS filters, this is the template that gives your content the cleanest possible path to a human reader.",
    bestFor: [
      "High-volume portal applications",
      "Government and institutional roles",
      "Anyone burned by ATS rejection before",
      "Technical roles with keyword screening",
      "Maximum-compatibility needs",
    ],
    designTraits: [
      "Pure black text, zero color or graphics",
      "Strict single-column flow",
      "Standard ATS-recognized section headings",
      "No tables, text boxes, or images",
      "Simple bold hierarchy throughout",
    ],
    atsNotes:
      "This is the safest template in the collection for parsing: plain text flow, conventional headings, no columns or graphics. If any template clears a strict ATS, it is this one.",
    faqs: [
      {
        q: "Is ParsePerfect too boring?",
        a: "Its audience is software, not people — and software loves boring. Once you clear the ATS, your content does the impressing.",
      },
      {
        q: "Should I use ParsePerfect for every application?",
        a: "Use it for portal applications with unknown ATS strictness. For direct-to-human applications (email, referrals), a designed template shows more personality.",
      },
      {
        q: "Does it really make a difference?",
        a: "Elaborate layouts are the top cause of parsing failures. Removing every risk factor maximizes the chance your keywords are extracted correctly.",
      },
    ],
    metaTitle: "ParsePerfect Resume Template — Free ATS-Optimized CV | Cvyon",
    metaDescription:
      "Free ParsePerfect resume template: pure black-on-white, zero graphics, built for ATS parsing. Maximum compatibility.",
  },
  {
    id: "SwissDesign",
    slug: "swissdesign",
    name: "SwissDesign",
    tagline: "International Style grid discipline, pure and simple.",
    description:
      "SwissDesign is a love letter to the International Typographic Style: a twelve-column grid, a six-extra-large black uppercase name, heavy black rules, a grayscale portrait, and micro-labels in tracked gray capitals. Asymmetric, mathematical, and utterly confident — the choice of designers who know exactly where this aesthetic comes from.",
    bestFor: [
      "Graphic designers",
      "Art directors",
      "Design educators",
      "Brand designers",
      "Typography enthusiasts",
    ],
    designTraits: [
      "Twelve-column asymmetric grid",
      "Six-extra-large black uppercase name",
      "Heavy black rules",
      "Grayscale portrait",
      "Tracked gray micro-labels",
    ],
    atsNotes:
      "The grid is visual; text remains linear and real. As a multi-column layout, verify reading order in the exported PDF for older parsers — modern systems handle it well.",
    faqs: [
      {
        q: "What is Swiss design?",
        a: "The International Typographic Style: grid-based, asymmetric layouts with objective typography, pioneered in Switzerland in the 1950s. This template follows its rules faithfully.",
      },
      {
        q: "Is SwissDesign only for designers?",
        a: "Designers will appreciate it most, but anyone in a visually literate field — architecture, media, tech — can carry it.",
      },
      {
        q: "Why no color?",
        a: "Swiss discipline treats color as information, not decoration. The black-white-gray system is the point — add your theme color only where it earns its place.",
      },
    ],
    metaTitle: "SwissDesign Resume Template — Free Swiss Style CV | Cvyon",
    metaDescription:
      "Free SwissDesign resume template: International Typographic Style grid with bold black type. For design purists.",
  },
  {
    id: "SwissGrid",
    slug: "swissgrid",
    name: "SwissGrid",
    tagline: "Swiss grid rigor with a bold theme-color frame.",
    description:
      "SwissGrid takes the Swiss grid and gives it a spine of color: a twenty-pixel theme border across the top, a seven-extra-large name, and a 4/8 column split on a light gray page. Section headers pair theme color with black underlines; skills are bordered tags. It is grid discipline with energy — structure you can feel.",
    bestFor: [
      "Designers wanting structure with color",
      "Engineers",
      "Architects",
      "Product designers",
      "Systems thinkers",
    ],
    designTraits: [
      "20px theme top border",
      "Seven-extra-large name",
      "4/8 asymmetric column split",
      "Theme headers with black underlines",
      "Bordered skill tags",
    ],
    atsNotes:
      "Multi-column grid layout: keep critical keywords in the main column and check reading order in the exported PDF. All text is real and selectable; modern parsers handle grids well.",
    faqs: [
      {
        q: "How is SwissGrid different from SwissDesign?",
        a: "SwissDesign is pure monochrome Swiss orthodoxy; SwissGrid keeps the grid rigor but adds a bold theme-color frame and warmer structure.",
      },
      {
        q: "Is the top border too much?",
        a: "It is the design's signature — a single confident gesture that frames everything below it. One strong move, then total discipline.",
      },
      {
        q: "Can I use SwissGrid outside design?",
        a: "Yes — engineers, architects, and analysts all benefit from its message: this person thinks in systems.",
      },
    ],
    metaTitle: "SwissGrid Resume Template — Free Grid CV with Color | Cvyon",
    metaDescription:
      "Free SwissGrid resume template: Swiss grid discipline with a bold theme-color frame. Structure with energy.",
  },
  {
    id: "SwissMinimal",
    slug: "swissminimal",
    name: "SwissMinimal",
    tagline: "Swiss restraint at its quietest.",
    description:
      "SwissMinimal whispers in the language of grids: a 42px black uppercase name, nine-pixel gray micro-labels with wide tracking, hairline rules, and dot-led bullets. A two-column footer holds skills and credentials. Nothing is louder than it needs to be — the confidence is in what was left out.",
    bestFor: [
      "Minimalists",
      "Design-adjacent professionals",
      "Writers and editors",
      "Consultants",
      "Anyone who believes less is more",
    ],
    designTraits: [
      "42px black uppercase name",
      "9px gray tracked micro-labels",
      "Hairline rules throughout",
      "Dot-led bullet markers",
      "Two-column skills footer",
    ],
    atsNotes:
      "Mostly single-column flow with real text parses cleanly. The micro-labels are small but real text — headings remain standard and recognizable.",
    faqs: [
      {
        q: "Are the tiny labels readable?",
        a: "They are navigational, not body text — 9px tracked capitals are standard for labels in editorial design and read clearly as signposts.",
      },
      {
        q: "Is SwissMinimal too quiet to stand out?",
        a: "In a stack of loud resumes, quiet is distinctive. It stands out precisely by refusing to shout.",
      },
      {
        q: "Who should avoid it?",
        a: "Candidates who need to project energy or fill space — the restraint demands substantive content to feel intentional.",
      },
    ],
    metaTitle: "SwissMinimal Resume Template — Free Minimal Swiss CV | Cvyon",
    metaDescription:
      "Free SwissMinimal resume template: quiet Swiss restraint with micro-labels and hairline rules. Less, but better.",
  },
  {
    id: "TechPro",
    slug: "techpro",
    name: "TechPro",
    tagline: "A developer's resume in full monospace.",
    description:
      "TechPro speaks engineer: the entire resume is set in monospace, section headers are inverted — white text on black blocks — and the summary sits in a bordered callout. Links pick up your theme color like syntax highlighting. It reads as a well-maintained README for your career, and technical hiring managers will feel immediately at home.",
    bestFor: [
      "Software engineers",
      "DevOps and SRE professionals",
      "Data engineers",
      "Technical leads",
      "Anyone hiring through technical screeners",
    ],
    designTraits: [
      "Full monospace typography",
      "Inverted black-block section headers",
      "Bordered summary callout",
      "Theme-colored links like syntax highlighting",
      "README-style technical register",
    ],
    atsNotes:
      "Monospace is just a font — parsing is unaffected. Single-column flow with standard headings and real text throughout makes this very parser-friendly.",
    faqs: [
      {
        q: "Is monospace professional?",
        a: "In tech, it is native. It signals you live in code, and technical reviewers read it as authenticity, not quirk.",
      },
      {
        q: "Will non-technical recruiters dislike it?",
        a: "It is still clean and readable — the inverted headers give it clear structure for any reader. But its heart belongs to technical audiences.",
      },
      {
        q: "Can I use TechPro outside software?",
        a: "Data, IT, and technical operations roles fit well. For non-technical fields, choose a template in a more conventional register.",
      },
    ],
    metaTitle: "TechPro Resume Template — Free Developer CV | Cvyon",
    metaDescription:
      "Free TechPro resume template: full-monospace developer resume with inverted section headers. Built for engineers.",
  },
  {
    id: "TypographyFirst",
    slug: "typographyfirst",
    name: "TypographyFirst",
    tagline: "Type-led design where the letterforms do the talking.",
    description:
      "TypographyFirst removes everything but type: an italic five-extra-large serif name, a bordered summary band set like an epigraph, italic section titles, and experience in a 1fr/3fr grid of labels and entries. No icons, no colors shouting — just hierarchy, contrast, and rhythm in letterforms. For people who know that type is the original interface.",
    bestFor: [
      "Writers and editors",
      "Typographers and type designers",
      "Academics",
      "Publishing professionals",
      "Design-literate generalists",
    ],
    designTraits: [
      "Italic extra-large serif name",
      "Bordered epigraph-style summary band",
      "Italic serif section titles",
      "1fr/3fr label-and-entry grid",
      "Pure typographic hierarchy, no ornament",
    ],
    atsNotes:
      "Single-column flow with real text and standard headings parses well. The grid rows are visual alignment only — text extracts in logical order.",
    faqs: [
      {
        q: "Why no icons or colors?",
        a: "The premise is that typography alone can carry hierarchy. Removing ornament proves the point — and keeps the page timeless.",
      },
      {
        q: "Is italic text hard to parse?",
        a: "No — italics are a font style, and parsers read the underlying characters normally.",
      },
      {
        q: "Who appreciates this template most?",
        a: "Readers who notice type: editors, designers, academics, and anyone in publishing or communications.",
      },
    ],
    metaTitle: "TypographyFirst Resume Template — Free Typographic CV | Cvyon",
    metaDescription:
      "Free TypographyFirst resume template: pure typographic hierarchy with serif italics. For people who love letterforms.",
  },
  {
    id: "ZenJapanese",
    slug: "zenjapanese",
    name: "ZenJapanese",
    tagline: "Japanese minimalism with wide-tracked micro labels.",
    description:
      "ZenJapanese practices ma — the beauty of empty space: warm paper, light-weight type, and section labels as eight-pixel wide-tracked theme-color capitals floating above hairline dividers. The summary is an italic meditation behind a theme border. It is the calmest resume in the collection, for professionals whose presence needs no volume.",
    bestFor: [
      "Wellness and mindfulness professionals",
      "Designers",
      "Academics",
      "Hospitality and service leaders",
      "Anyone valuing calm and balance",
    ],
    designTraits: [
      "Warm paper background",
      "Light-weight airy typography",
      "8px wide-tracked theme micro-labels",
      "Italic meditation-style summary",
      "Generous negative space throughout",
    ],
    atsNotes:
      "Single-column flow with real text parses cleanly. The micro-labels are small but genuine text; standard section words accompany them so headings stay recognizable.",
    faqs: [
      {
        q: "Is ZenJapanese too sparse for recruiters?",
        a: "Its sparseness is deliberate and reads as confidence. It suits roles where composure and judgment matter more than volume of keywords.",
      },
      {
        q: "What does the aesthetic reference?",
        a: "Japanese design principles — ma (negative space), restraint, and the beauty of the essential. The warm paper and light type carry it.",
      },
      {
        q: "Can it work for corporate roles?",
        a: "For senior and advisory roles, its calm authority fits well. High-energy sales or startup roles may want something bolder.",
      },
    ],
    metaTitle: "ZenJapanese Resume Template — Free Zen Minimal CV | Cvyon",
    metaDescription:
      "Free ZenJapanese resume template: Japanese minimalism with warm paper and wide-tracked labels. Calm, confident resumes.",
  },
  {
    id: "Academic",
    slug: "academic",
    name: "Academic",
    tagline: "A formal curriculum vitae in classic serif type.",
    description:
      "Academic is built like a proper CV: a centered serif header with a “Curriculum Vitae” subtitle, education placed before experience, and every entry set in a two-column date grid so appointments read chronologically at a glance. Pure black ink, uppercase section headers with hairline rules, and generous one-inch margins give it the gravity that hiring committees and academic panels expect.",
    bestFor: [
      "University faculty and researchers",
      "PhD candidates and postdocs",
      "Medical and clinical academics",
      "Grant and fellowship applicants",
      "Anyone submitting a formal CV rather than a resume",
    ],
    designTraits: [
      "Centered serif header with “Curriculum Vitae” subtitle",
      "Education section placed before experience",
      "Two-column date grid for appointments",
      "Uppercase section headers with hairline rules",
      "Pure black ink on white with one-inch margins",
    ],
    atsNotes:
      "Single-column flow with standard headings parses cleanly; the date-grid uses real text in a simple two-column layout. Academic CVs often run long — every page keeps the same clean structure.",
    faqs: [
      {
        q: "Is Academic a resume or a CV?",
        a: "It is structured as a curriculum vitae: education leads, appointments carry date columns, and sections like Research & Projects and Certifications & Awards are built in — ideal for academic applications.",
      },
      {
        q: "Can it handle a multi-page CV?",
        a: "Yes. The disciplined grid and consistent headers scale naturally across pages, which is exactly what academic CVs need.",
      },
      {
        q: "Why is education listed first?",
        a: "Academic hiring evaluates credentials before roles. Academic leads with your degrees and appointments so committees see qualifications immediately.",
      },
    ],
    metaTitle: "Academic Resume Template — Free Serif CV Template | Cvyon",
    metaDescription:
      "Free Academic resume template: a formal serif curriculum vitae with education-first ordering and date-grid appointments. Ideal for faculty and researchers.",
  },
  {
    id: "Anchor",
    slug: "anchor",
    name: "Anchor",
    tagline: "Serif elegance anchored by a bordered white sidebar.",
    description:
      "Anchor pairs a stately serif main column with a 35% white sidebar divided by a theme-colored rule. Your initials sit in a bordered monogram medallion above contact, a ruled skills list, and education — while the main column carries your name, profile, and experience under theme-bordered section headers. It reads as composed and trustworthy, the kind of resume that suits established professionals who want polish without noise.",
    bestFor: [
      "Senior managers and directors",
      "Finance and consulting professionals",
      "Legal and compliance roles",
      "Academics and researchers",
      "Established professionals with 10+ years of experience",
    ],
    designTraits: [
      "White left sidebar divided by a theme-colored border",
      "Serif typography throughout for a formal feel",
      "Initials monogram in a bordered circle",
      "Ruled skills list in the sidebar",
      "Theme-bordered section headers in the main column",
    ],
    atsNotes:
      "All text is real and selectable, and the single reading flow of the main column parses cleanly. Keep job titles and employers in the main column so older parsers catch them first.",
    faqs: [
      {
        q: "Is the sidebar too formal for creative roles?",
        a: "Anchor is deliberately formal — it is aimed at corporate, legal, finance, and academic applications. Creative candidates will find a better match in the Gallery or Studio templates.",
      },
      {
        q: "Can I change the sidebar border color?",
        a: "Yes — the border, monogram, and headers all follow your Cvyon theme color, so the whole accent system shifts together.",
      },
      {
        q: "Will the sidebar confuse applicant tracking systems?",
        a: "Modern parsers handle two-column resumes well, and the main column reads top to bottom. If a portal is very old, a single-column template is the safest fallback.",
      },
    ],
    metaTitle: "Anchor Resume Template — Free Serif Sidebar CV | Cvyon",
    metaDescription:
      "Free Anchor resume template: a bordered white sidebar with serif typography and a monogram medallion. Ideal for senior and formal professionals.",
  },
  {
    id: "Gilt",
    slug: "gilt",
    name: "Gilt",
    tagline: "Gold accents on charcoal — quiet luxury for distinguished careers.",
    description:
      "Gilt frames a distinguished career in gold: charcoal serif text with gleaming gold section headers flanked by hairline rules, a diamond ornament crowning your name, and gold-bordered skill chips. The centered, symmetrical layout reads like a formal certificate — ideal for candidates who want their resume to feel earned and prestigious without a single flashy element.",
    bestFor: [
      "Senior executives and board candidates",
      "Finance, private banking, and wealth management professionals",
      "Luxury hospitality and premium brand leaders",
      "Partners at professional services firms",
      "Anyone who wants a formal, prestigious presentation",
    ],
    designTraits: [
      "Gold hairline rules framing every section header",
      "Diamond ornament above the centered name",
      "Gold-bordered skill chips on a warm ivory tint",
      "Diamond-bulleted achievements in gold",
      "Centered serif composition throughout",
    ],
    atsNotes:
      "Single-column flow with standard section headings parses cleanly. The gold styling is color-only — all text is real and selectable, so applicant tracking systems read it normally.",
    faqs: [
      {
        q: "Is the gold color appropriate for conservative industries?",
        a: "Yes — Gilt uses a muted antique gold as an accent, not a background, so it reads as refined rather than flashy. It suits finance, law, and executive roles well.",
      },
      {
        q: "Can I change the gold accent to my own theme color?",
        a: "The gold is a fixed signature of this template's identity, giving it its distinctive gilt character regardless of theme.",
      },
      {
        q: "Does the centered layout hurt readability?",
        a: "No — Gilt centers headers while keeping body text in a comfortable measure, balancing ceremony with comfortable reading.",
      },
    ],
    metaTitle: "Gilt Resume Template — Free Gold-Accent Executive CV | Cvyon",
    metaDescription:
      "Free Gilt resume template: gold accents on charcoal serif type with diamond details. A prestigious, formal CV for senior leaders.",
  },
  {
    id: "Lucid",
    slug: "lucid",
    name: "Lucid",
    tagline: "Pure clarity through generous leading and crisp hierarchy.",
    description:
      "Lucid is restraint done well: a single ink column where your name, title, and contact line stack in clear typographic order, then generous line spacing carries every section. Section titles are small, widely tracked caps with real breathing room above them, and skills sit in a clean three-column grid with hairline dividers. Nothing shouts — the design earns its authority from precision and whitespace.",
    bestFor: [
      "Writers and editors",
      "Consultants and analysts",
      "Legal and compliance professionals",
      "Project managers",
      "Anyone who wants a calm, supremely readable resume",
    ],
    designTraits: [
      "Single ink-only column with generous leading",
      "Widely tracked small-caps section titles",
      "Three-column skills grid with hairline dividers",
      "Clear name/title/contact hierarchy",
      "Ample vertical rhythm between sections",
    ],
    atsNotes:
      "Fully single-column with real text and conventional headings, so parsing is straightforward. The wide letter-spacing on headings is decorative styling on plain text, not an image.",
    faqs: [
      {
        q: "Does the wide letter-spacing on headings cause parsing problems?",
        a: "No — the headings are ordinary selectable text with CSS letter-spacing applied. Parsers read them as normal words.",
      },
      {
        q: "Is Lucid too plain for competitive roles?",
        a: "Its calm confidence is the point. Recruiters read every word when nothing on the page fights for attention.",
      },
      {
        q: "Can I add accent color?",
        a: "Lucid is deliberately ink-on-white, but your Cvyon theme color can be introduced through section accents in the builder preview if you want a touch of color.",
      },
    ],
    metaTitle: "Lucid Resume Template — Free Clean Minimal CV | Cvyon",
    metaDescription:
      "Free Lucid resume template: a calm single-column resume with generous spacing and crisp hierarchy. Perfect for writers, analysts, and consultants.",
  },
  {
    id: "Pedagogue",
    slug: "pedagogue",
    name: "Pedagogue",
    tagline: "A warm, approachable design made for educators.",
    description:
      "Pedagogue speaks the language of the classroom: a warm fixed orange identity with a deep-brown name, an inviting job title line, and section headers finished with a soft rounded underline. Skills appear as friendly warm-toned pills and experience reads in generous, readable type. It feels encouraging and human — the tone schools and training organizations respond to.",
    bestFor: [
      "Teachers and lecturers",
      "Tutors and academic coaches",
      "Training and L&D professionals",
      "Education administrators",
      "Childcare and youth-work professionals",
    ],
    designTraits: [
      "Fixed warm orange identity that does not change with theme",
      "Deep-brown name with an inviting orange job title",
      "Rounded warm-toned skill pills",
      "Section headers with a soft rounded underline bar",
      "Generous readable body type with a human touch",
    ],
    atsNotes:
      "Single-column layout with real text and standard headings; the warm background tints are fills behind selectable text, so parsing is straightforward.",
    faqs: [
      {
        q: "Can I change the orange color?",
        a: "No — Pedagogue's warm orange identity is fixed by design, chosen to keep the friendly educator tone consistent. Other templates let your theme color drive the palette if you want that control.",
      },
      {
        q: "Is this template suitable outside education?",
        a: "Its warmth works anywhere approachability matters — customer success, HR, community roles — but it was designed with educators in mind.",
      },
      {
        q: "Will the warm styling parse in ATS software?",
        a: "Yes. All text is real and selectable in a single-column flow; the warm colors are fills behind text, not images.",
      },
    ],
    metaTitle: "Pedagogue Resume Template — Free Teacher CV | Cvyon",
    metaDescription:
      "Free Pedagogue resume template: a warm, approachable design made for educators, with friendly skill pills and readable type. Ideal for teachers and trainers.",
  },
  {
    id: "Regent",
    slug: "regent",
    name: "Regent",
    tagline: "Centered serif formality with a double-rule masthead.",
    description:
      "Regent is built for authority: a centered serif name above a double black rule, section titles set between flanking hairlines, and a centered skills line that reads like a signature. Every section is single-column and calmly spaced, so long careers read as composed rather than crowded — the visual language of board papers and formal correspondence.",
    bestFor: [
      "C-suite and senior executives",
      "Board members and advisors",
      "Legal professionals",
      "Academics and researchers",
      "Anyone whose industry still respects formal stationery",
    ],
    designTraits: [
      "Centered serif name with double black rule",
      "Section titles bracketed by hairlines",
      "Skills as a centered comma-joined line",
      "Italic company names under bold roles",
      "Fully single-column layout",
    ],
    atsNotes:
      "Excellent for parsing: single-column flow, real text throughout, and standard section headings. The decorative rules are pure CSS and invisible to parsers.",
    faqs: [
      {
        q: "Is Regent too formal for tech jobs?",
        a: "Regent's formality suits leadership, legal, and academic roles best. For startups or creative roles, pick a template with more modern energy.",
      },
      {
        q: "Can I change the serif font?",
        a: "The template uses your browser's default serif stack for that classic editorial feel; the theme color controls the job-title accent.",
      },
      {
        q: "Will the centered layout hurt ATS parsing?",
        a: "No — centering is a visual style applied to real, selectable text in a single column, which parsers handle without issue.",
      },
    ],
    metaTitle: "Regent Resume Template — Free Formal Serif CV | Cvyon",
    metaDescription:
      "Free Regent resume template: centered serif formality with a double-rule masthead. Ideal for executives, legal, and academic professionals.",
  },
];

export function getTemplateSeoEntry(slug: string): TemplateSeoEntry | undefined {
  return templateSeoEntries.find((e) => e.slug === slug);
}
