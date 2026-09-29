// SEO landing-page data for cvyon.com/resume-for/<slug>/ pages.
// Plain data only — no imports, no JSX. Safe under a strict Next.js tsconfig.

export interface JobTitleSeoEntry {
  slug: string;
  jobTitle: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  tips: { title: string; body: string }[];
  templateStyles: { name: string; slug: string; why: string }[];
  atsNotes: string;
  faqs: { q: string; a: string }[];
}

export const jobTitleSeoEntries: JobTitleSeoEntry[] = [
  {
    slug: "software-engineer",
    jobTitle: "Software Engineer",
    metaTitle: "Software Engineer Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free software engineer resume template with role-specific tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Software engineering hiring moves fast and usually starts with a screen — often an automated one. Your resume has to parse cleanly for applicant tracking systems and impress a hiring manager in under a minute. This guide covers what actually matters on a software engineer resume, which Cvyon templates fit the role, and how to keep the robots happy.",
    tips: [
      { title: "Mirror the posting's stack, literally", body: "List languages, frameworks, and tools exactly as the job post names them — “React”, not “a popular frontend library”. Both ATS keyword matching and recruiter skims look for literal matches. Only list tools you could discuss in an interview." },
      { title: "Quantify impact, not just technologies", body: "“Cut API latency by 40%” beats a longer list of libraries. Give each role two to four bullets naming what you built and what changed because of it — users served, uptime, cost, revenue." },
      { title: "Let projects carry junior resumes", body: "If your work history is thin, a projects section with links to GitHub or a live demo carries real weight. Describe what you built, the stack, and one concrete outcome." },
      { title: "One page until you're senior", body: "A single page forces you to cut filler. Two pages become reasonable past roughly eight years of relevant experience — trim older roles first." }
    ],
    templateStyles: [
      { name: "Engine", slug: "engine", why: "A spec-sheet layout that presents your stack and experience like technical documentation — natural for engineering hiring managers." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems: plain structure and real text that parsers read reliably." },
      { name: "Syntax", slug: "syntax", why: "Monospace skill chips give your tools section a developer-native feel while staying single-column and parseable." }
    ],
    atsNotes: "Large tech companies run every resume through a parser before a human sees it. Single-column layouts with standard headings — Work Experience, Skills, Education — parse reliably; multi-column designs, graphics-based skill bars, and icons standing in for text do not. Pick a single-column Cvyon template and run the finished PDF through our free ATS grader before you apply.",
    faqs: [
      { q: "How long should a software engineer resume be?", a: "One page for most engineers. Two pages is fine with about eight or more years of experience — cut the oldest and least relevant roles first." },
      { q: "Should I include a photo?", a: "No. Photos add nothing for engineering roles and can confuse some parsers. Keep the focus on skills and impact." },
      { q: "Do I need to list every technology I've touched?", a: "No — list what you're strong in and what the target role asks for. A shorter, honest skills section beats a long padded one." }
    ]
  },
  {
    slug: "data-analyst",
    jobTitle: "Data Analyst",
    metaTitle: "Data Analyst Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free data analyst resume template with analytics-specific resume tips, ATS guidance and FAQs. Build and download in minutes — no sign-up.",
    intro: "Data analyst hiring is proof-driven: hiring managers scan for your tools, your data, and the decisions your work influenced. A vague “data-driven professional” summary loses to a single quantified dashboard story. Here is how to make an analyst resume read like evidence.",
    tips: [
      { title: "List tools exactly as postings name them", body: "SQL, Excel, Power BI, Tableau, Python — use the literal names, in a dedicated skills section. Analyst postings are keyword-heavy and both recruiters and parsers match on exact terms." },
      { title: "Tie every dashboard to a decision", body: "“Built a churn dashboard” is a task; “built a churn dashboard the retention team used to redesign onboarding” is a result. Name who used your work and what changed because of it." },
      { title: "Show the messy middle, not just the chart", body: "Cleaning, joining, and validating data is half the job. One bullet on data quality or pipeline work proves you can handle real-world data, not just polished datasets." },
      { title: "Link a portfolio, not a promise", body: "One GitHub repo or portfolio page with a cleaned dataset and a short write-up of your approach carries more weight than a paragraph of adjectives. Keep the link as plain text so parsers read it." }
    ],
    templateStyles: [
      { name: "Teller", slug: "teller", why: "Numbers-forward and crisp — a natural fit for a resume whose argument is made of metrics." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs put your quantified wins first, which is exactly how analysts are judged." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, so your SQL, Python, and Tableau keywords parse as real text." }
    ],
    atsNotes: "Analytics roles are among the most keyword-filtered in hiring: postings list exact tools and parsers match them literally. Keep your skills as plain text in a single column, use standard headings like Work Experience and Skills, and never bury tool names inside graphics or skill-meter icons. Run the finished resume through Cvyon's free ATS grader to confirm every keyword is readable.",
    faqs: [
      { q: "How much SQL should I claim on an analyst resume?", a: "Claim what you can demonstrate. List the operations you actually use — joins, CTEs, window functions — rather than just “SQL”, and be ready to talk through a query in an interview." },
      { q: "Do I need a portfolio for data analyst roles?", a: "Not strictly, but one strong project write-up with real analysis answers the question “can this person actually do the work?” better than any summary line." },
      { q: "Should my resume be one page?", a: "Yes for most analysts. Two pages only makes sense with several years of varied experience — trim older or unrelated roles first." }
    ]
  },
  {
    slug: "data-scientist",
    jobTitle: "Data Scientist",
    metaTitle: "Data Scientist Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free data scientist resume template with ML-role resume tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Data science hiring separates people who train models from people who ship them. Recruiters and hiring managers look for modeling depth, engineering awareness, and business impact — in that order. This guide shows how to structure a data scientist resume that proves all three.",
    tips: [
      { title: "Lead with deployed models, not trained ones", body: "“Built a demand-forecast model that runs in production” beats “trained XGBoost on retail data”. Mention deployment, monitoring, or retraining if you touched them — production awareness is the differentiator." },
      { title: "Name algorithms, scale, and tools literally", body: "Use the exact terms postings use: regression, gradient boosting, PyTorch, scikit-learn, Airflow. Include the scale you worked at — row counts, feature counts — in plain words." },
      { title: "Translate modeling into business language", body: "Every technical bullet should end with why it mattered: reduced fraud losses, improved targeting, cut manual review time. Hiring managers fund outcomes, not notebooks." },
      { title: "Let education and publications support, not lead", body: "Degrees, papers, and conference talks belong in clear sections — but for industry roles, work impact comes first. New PhDs can lead with research; everyone else leads with results." }
    ],
    templateStyles: [
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems: plain structure that keeps your technical keywords machine-readable." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs — ideal for translating modeling work into readable impact." },
      { name: "Scanner", slug: "scanner", why: "Keywords up top, built for the six-second scan that technical recruiters give every resume." }
    ],
    atsNotes: "Data science postings are long lists of exact technical terms, and parsers match them literally against your resume. Put every tool, library, and method as plain text — not in icons, charts, or images — and use standard section headings so nothing lands in the wrong bucket. Cvyon's free ATS grader will show you exactly which keywords your resume is missing.",
    faqs: [
      { q: "Should I list Kaggle competitions on my resume?", a: "One or two strong finishes can support a junior resume. For experienced candidates, shipped production work matters far more — keep competitions to a single line." },
      { q: "How technical should the skills section be?", a: "Very — but organized. Group by languages, ML frameworks, data tools, and cloud platforms so a skimmer can find each in seconds." },
      { q: "Do data scientists need a longer resume?", a: "One page works for most; research-heavy candidates with publications can justify two. Keep the first page complete on its own in case nobody turns it." }
    ]
  },
  {
    slug: "web-developer",
    jobTitle: "Web Developer",
    metaTitle: "Web Developer Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free web developer resume template with portfolio-first tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "For web developers, the resume is the trailer and the portfolio is the film — but the trailer still has to survive the ATS and hook a recruiter in seconds. Your stack, your shipped sites, and your live links have to be unmissable. Here is how to write one that does both jobs.",
    tips: [
      { title: "Put live links where eyes land first", body: "Portfolio, GitHub, and live project URLs belong near the top as plain text links. Recruiters click before they read; make the path obvious and keep links parseable, not embedded in icons." },
      { title: "Name the stack literally", body: "HTML, CSS, JavaScript, React, Node.js, WordPress — write them exactly as postings do. Paraphrases like “modern frontend frameworks” match nothing in a keyword search." },
      { title: "Show shipped work, not coursework alone", body: "Client sites, freelance projects, and deployed side projects all count. For each, name the site, the stack, and one thing it does well — speed, accessibility, conversions." },
      { title: "Mention performance and accessibility wins", body: "Faster load times, responsive rebuilds, and accessibility fixes are concrete differentiators. State what you improved and how users or the business felt it." }
    ],
    templateStyles: [
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — puts your projects and live links at the center where a developer resume needs them." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems so your stack keywords survive the first automated screen." },
      { name: "Pixel", slug: "pixel", why: "Card-based experience with a skill-meter rail — a developer-flavored layout that still keeps structure clean." }
    ],
    atsNotes: "Web roles flow through the same parsers as all tech hiring: single column, standard headings, and plain-text links. Two traps to avoid: contact info or links hidden inside a header graphic, and project URLs shortened to the point of being unclickable. Use full plain-text URLs and run the finished PDF through Cvyon's free ATS grader.",
    faqs: [
      { q: "Should a web developer resume include a photo or fancy design?", a: "Your portfolio is where design belongs. Keep the resume itself clean and parseable — one page, single column, plain text links." },
      { q: "How do I show freelance work on my resume?", a: "List it like employment: client name or “Freelance”, dates, and the sites you shipped with one-line outcomes. It counts fully." },
      { q: "Is a two-page resume okay for developers?", a: "One page is the norm. Go to two only with deep experience across many shipped products — and keep the strongest work on page one." }
    ]
  },
  {
    slug: "it-support-specialist",
    jobTitle: "IT Support Specialist",
    metaTitle: "IT Support Specialist Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free IT support specialist resume template with help-desk tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "IT support hiring managers want one reassurance above all: you can keep their users working. That means naming your environments, your tools, and your ticketing systems precisely — and showing you treat users like customers, not tickets. Here is how to write a support resume that reads as reliable.",
    tips: [
      { title: "Name your environment, not just “IT support”", body: "Windows and macOS fleets, Active Directory, Google Workspace or Microsoft 365, MDM tools — spell out what you actually administered. Hiring managers hire for their specific stack." },
      { title: "List ticketing and remote tools literally", body: "Jira, ServiceNow, Zendesk, TeamViewer, remote desktop tools — use exact product names. Support postings keyword-match on these more than on anything else." },
      { title: "Put certifications where they are seen", body: "CompTIA A+, Network+, Microsoft or Google certs belong in a certifications line near the top. For support roles they are often a hard filter, not a nice-to-have." },
      { title: "Show user-facing skill through duties", body: "Onboarding new hires, writing help guides, training users on new tools — these prove patience and communication better than any adjective. Describe the work, not your personality." }
    ],
    templateStyles: [
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — the visual equivalent of a support pro who keeps things clear." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, so your tool and certification keywords parse reliably." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs help turn ticket work into readable accomplishments." }
    ],
    atsNotes: "Support roles are posted with long lists of exact tools and systems, and corporate ATS software matches them literally. Write every product name as plain text in a single column, avoid tables that split your skills across cells, and keep certifications as text rather than badge images. Cvyon's free ATS grader will flag anything the parser cannot read.",
    faqs: [
      { q: "Do I need certifications for IT support roles?", a: "They help enormously, especially CompTIA A+ for entry-level roles. List what you hold and what is in progress — “in progress” is honest and shows momentum." },
      { q: "How do I describe help-desk volume without exaggerating?", a: "Use ranges from your real experience — “supported a 200-person office” or “handled Tier 1 tickets for two sites”. Honest scope beats impressive-sounding guesses." },
      { q: "Should I include home-lab or personal projects?", a: "Yes, briefly. A home lab with virtualization or a small network you built shows initiative and gives interviewers something concrete to ask about." }
    ]
  },
  {
    slug: "cybersecurity-analyst",
    jobTitle: "Cybersecurity Analyst",
    metaTitle: "Cybersecurity Analyst Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free cybersecurity analyst resume template with security-role tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Cybersecurity resumes are read by people who think adversarially — and they will probe every claim. Precision about your tools, your certifications, and what you actually did during incidents is what separates a credible analyst resume from a padded one. Here is how to write it tight.",
    tips: [
      { title: "Name your tools like a practitioner", body: "SIEM platforms, EDR tools, Wireshark, vulnerability scanners — use exact product names (Splunk, CrowdStrike, Nessus) as postings do. Generic “security tools” matches nothing." },
      { title: "Put certifications at the top", body: "Security+, CySA+, CISSP, CEH — whichever you hold goes in a credentials line right under your name. Many postings filter on these before anything else is read." },
      { title: "Describe incidents without disclosing secrets", body: "You can say you triaged phishing campaigns, contained endpoint infections, or tuned detection rules without naming employers' sensitive details. Focus on your actions and the outcome class." },
      { title: "Count labs, CTFs, and home labs as experience", body: "TryHackMe rooms, CTF placements, a home SOC lab — these are legitimate proof of hands-on skill for junior analysts. List them in a projects section with what you practiced." }
    ],
    templateStyles: [
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe, which suits a field where parsers do the first screening." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems: plain structure that keeps every tool and cert keyword machine-readable." },
      { name: "Mono", slug: "mono", why: "A pure black-and-white typographic statement — understated and precise, like good security work." }
    ],
    atsNotes: "Security postings are acronym-dense and parsers match certifications and tool names literally — “SIEM” and “Splunk” must appear as plain text, not inside graphics. Keep a single column with standard headings, spell out each acronym at least once (some parsers expand them, some do not), and verify with Cvyon's free ATS grader before applying.",
    faqs: [
      { q: "Which certification matters most for analyst roles?", a: "Security+ is the common entry filter; CySA+ and CISSP carry weight with experience. List what you hold — never list one you are merely studying for as if earned." },
      { q: "Can I mention incidents from my current job?", a: "Describe your role in general terms without employer-identifying detail. “Led containment for a ransomware incident” is fine; naming the victim organization is not." },
      { q: "Do I need a degree for cybersecurity analyst roles?", a: "Many postings list one, but certifications plus demonstrable hands-on skill get interviews. Lead with what you can do, and keep education factual." }
    ]
  },
  {
    slug: "product-manager",
    jobTitle: "Product Manager",
    metaTitle: "Product Manager Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free product manager resume template with PM-specific tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Product manager resumes fail when they read like a list of meetings attended. Hiring managers want outcomes you drove, decisions you owned, and the scale you operated at. This guide shows how to write a PM resume that reads like a record of shipped results.",
    tips: [
      { title: "Lead with outcomes, not responsibilities", body: "“Grew trial-to-paid conversion” beats “responsible for the onboarding flow”. Every bullet should name a decision you made and what happened because of it." },
      { title: "Name your product stack literally", body: "A/B testing tools, analytics platforms, roadmapping and ticketing tools — use exact names (Amplitude, Mixpanel, Jira). PM postings keyword-match on these." },
      { title: "Show cross-functional scope plainly", body: "State the teams you worked with and the size of what you shipped — engineers, designers, data scientists; users served; revenue influenced. Scope is how seniority is judged." },
      { title: "Own your metrics honestly", body: "Claim only the numbers you actually moved and can defend. Vague “drove growth” invites hard questions; one specific, honest metric invites a conversation." }
    ],
    templateStyles: [
      { name: "Gateway", slug: "gateway", why: "A bold boxed summary opening the page — perfect for the positioning statement a PM resume needs up top." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn shipped work into scannable proof of impact." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your tool and methodology keywords readable." }
    ],
    atsNotes: "PM roles flow through standard corporate ATS software that matches on tools, methodologies (Agile, Scrum), and domain terms. Use plain-text skills, standard headings, and a single column — and avoid stuffing the summary with keyword soup, since PM hiring managers actually read the top third closely. Check the result with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do product managers need technical skills on the resume?", a: "Enough to be credible with engineers: SQL basics, analytics tools, API familiarity. List what you can actually use, not what you have merely heard of." },
      { q: "How do I show PM experience without the title?", a: "Describe the product work you did under any title — shipped features, ran experiments, owned metrics. Many strong PMs come from support, design, or engineering." },
      { q: "Should I include a photo or creative design?", a: "No. PM hiring is conservative about format; a clean, scannable resume with a strong summary wins." }
    ]
  },
  {
    slug: "ux-designer",
    jobTitle: "UX Designer",
    metaTitle: "UX Designer Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free UX designer resume template with portfolio-first tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "A UX designer's resume is judged alongside a portfolio — but the resume still has to survive the ATS and explain your process in words, not just pixels. Hiring managers want to see research, iteration, and measurable usability wins. Here is how to write one that complements your portfolio instead of duplicating it.",
    tips: [
      { title: "Make the portfolio link unmissable", body: "Put your portfolio URL near the top as plain text. Recruiters click it before reading further — and some parsers follow links, so keep it a full, clean URL." },
      { title: "Describe process, not just screens", body: "User interviews, usability testing, journey mapping, iteration cycles — name the methods you used on each project. Process is what separates a designer from a decorator." },
      { title: "Name your tools literally", body: "Figma, Sketch, prototyping and testing tools — exact names, since postings keyword-match on them. Mention design systems if you built or maintained one." },
      { title: "Quantify usability outcomes", body: "Reduced task-completion time, cut support tickets, improved conversion on a flow — state the before and after in plain terms. Numbers make design work legible to non-designers." }
    ],
    templateStyles: [
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — the resume equivalent of letting the work speak." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — a layout that practices what UX preaches." },
      { name: "Pixel", slug: "pixel", why: "Card-based experience layout that presents projects the way designers think about them." }
    ],
    atsNotes: "Design roles sit in an awkward spot: the work is visual but the hiring pipeline is textual. Keep the resume itself single-column and parseable with standard headings, and let the portfolio carry the visuals. Never embed your only copy of key skills inside an image, and confirm parseability with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should my resume itself be a design showcase?", a: "No — restraint is the showcase. A clean, well-typeset resume demonstrates design judgment; the portfolio demonstrates craft." },
      { q: "How many portfolio pieces should I reference?", a: "Three to five strong case studies beat ten shallow ones. On the resume, link the portfolio once rather than listing every project." },
      { q: "Do I need to know how to code as a UX designer?", a: "Not usually, but basic HTML/CSS fluency is a plus for many roles. List it only if you can genuinely use it." }
    ]
  },
  {
    slug: "devops-engineer",
    jobTitle: "DevOps Engineer",
    metaTitle: "DevOps Engineer Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free DevOps engineer resume template with infrastructure-role tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "DevOps hiring managers scan for two things: the exact toolchain they run, and evidence you have kept real systems alive. Vague “CI/CD experience” loses to named tools and named outcomes. Here is how to write a DevOps resume that reads as battle-tested.",
    tips: [
      { title: "Name the cloud and toolchain literally", body: "AWS, Azure, or GCP; Kubernetes, Docker, Terraform, Ansible; Jenkins, GitHub Actions, GitLab CI — exact names, because postings and parsers match on them and “cloud platforms” matches on nothing." },
      { title: "Show reliability outcomes", body: "Uptime improvements, deploy frequency gains, incident response, cost reductions — state what changed in the systems you ran. Reliability is the product of DevOps work." },
      { title: "Prove infrastructure-as-code fluency", body: "Mention what you codified — environments, networking, pipelines — and at what scale. “Managed Terraform for 40+ services” tells a hiring manager you have done it for real." },
      { title: "Include on-call and incident stories", body: "On-call rotations, postmortems you led, and outages you resolved are first-class experience. Describe your role plainly without disclosing employer-sensitive detail." }
    ],
    templateStyles: [
      { name: "Engine", slug: "engine", why: "A spec-sheet resume for engineers — presents your toolchain and systems like technical documentation." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, so every tool acronym parses as real text." },
      { name: "TechPro", slug: "techpro", why: "A developer resume in full monospace — a native look for infrastructure engineers." }
    ],
    atsNotes: "DevOps postings are among the most acronym-heavy in tech, and parsers match them literally — write “CI/CD” and “Kubernetes” as plain text, and spell out key acronyms at least once. Single column, standard headings, no graphics-based skill diagrams. Verify with Cvyon's free ATS grader before you apply.",
    faqs: [
      { q: "Should I list every tool I have touched?", a: "List what you could operate on day one and what the posting asks for. A focused toolchain section beats a fifty-item cloud of names." },
      { q: "How do I show DevOps experience from a developer role?", a: "Name the infrastructure work you actually did — pipelines you built, deployments you owned, incidents you handled. Many DevOps engineers start exactly this way." },
      { q: "Do certifications like AWS Solutions Architect help?", a: "Yes, especially for cloud-heavy roles. Put them in a certifications line near the top where filters can find them." }
    ]
  },
  {
    slug: "machine-learning-engineer",
    jobTitle: "Machine Learning Engineer",
    metaTitle: "Machine Learning Engineer Resume — Free & ATS | Cvyon",
    metaDescription: "Free machine learning engineer resume template with MLOps tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Machine learning engineers are hired for the unglamorous middle: turning a model that works in a notebook into a system that works in production. Hiring managers look for frameworks, serving infrastructure, and latency or scale numbers. Here is how to write an MLE resume that proves production chops.",
    tips: [
      { title: "Prove the model shipped", body: "Training accuracy is table stakes; deployment is the story. Mention serving (batch or real-time), monitoring, retraining pipelines, and who consumed the model's output." },
      { title: "Name frameworks and infra literally", body: "PyTorch, TensorFlow, JAX; MLflow, Kubeflow, SageMaker, Vertex AI — exact names as postings list them. Include GPU or distributed-training experience if you have it." },
      { title: "State latency and scale in plain terms", body: "Inference latency, requests per second, data volumes — these numbers tell a hiring manager you have operated at real scale. Use your real figures, not aspirational ones." },
      { title: "Link code and papers", body: "A GitHub repo with clean training code or a published paper strengthens any MLE resume. Put links as plain text near the top so both humans and parsers find them." }
    ],
    templateStyles: [
      { name: "Engine", slug: "engine", why: "A spec-sheet resume for engineers — the right register for production ML work." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems so framework and platform keywords parse reliably." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs translate model work into readable impact." }
    ],
    atsNotes: "MLE postings read like infrastructure shopping lists, and parsers match framework and platform names literally. Keep every technical term as plain text in a single column, spell out acronyms at least once, and never hide your stack inside an image. Cvyon's free ATS grader will confirm what the parser actually sees.",
    faqs: [
      { q: "What is the difference between a data scientist and ML engineer resume?", a: "Emphasis. MLE resumes lead with deployment, serving, and infrastructure; data science resumes lead with modeling and analysis. Mirror the posting you are targeting." },
      { q: "Should I include research or papers?", a: "Yes if published or genuinely strong — a short publications line adds credibility. Production experience still comes first for industry roles." },
      { q: "How long should an MLE resume be?", a: "One page for most; two is fine with substantial shipped systems. Keep page one complete on its own." }
    ]
  }
,
  {
    slug: "registered-nurse",
    jobTitle: "Registered Nurse",
    metaTitle: "Registered Nurse Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free registered nurse resume template with clinical resume tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Nursing resumes are read by two audiences: the hospital's applicant tracking system and a nurse manager with minutes to spare. Credentials, specialties, and clinical settings have to be impossible to miss. Here's how to structure a registered nurse resume that clears both.",
    tips: [
      { title: "Put license and certifications at the top", body: "RN license, state, BLS/ACLS and specialty certifications (CCRN, CEN, OCN) belong in a credentials line right under your name or in the summary. Recruiters filter on these first." },
      { title: "Name your unit, setting, and patient ratios", body: "“12-bed ICU, 1:2 ratios” tells a hiring manager more than “provided patient care”. Include facility type, unit specialty, and EMR systems like Epic or Cerner." },
      { title: "Use clinical action verbs", body: "Assessed, triaged, administered, coordinated, educated — strong verbs make each bullet scan faster and match the language of nursing job posts." },
      { title: "Keep it to one or two pages", body: "New grads: one page, lead with clinical rotations. Experienced nurses: two pages max, most recent roles in detail." }
    ],
    templateStyles: [
      { name: "Clinician", slug: "clinician", why: "Credential-forward and calm — designed for medical careers where licenses and certifications lead." },
      { name: "Practitioner", slug: "practitioner", why: "A calm, trustworthy layout that suits healthcare hiring without visual noise." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Hospital portals parse aggressively; a template engineered for ATS keeps your credentials readable." }
    ],
    atsNotes: "Health systems receive huge applicant volumes and rely heavily on parsers. Put your credentials, license numbers, and certifications as plain text — never inside images, headers, or text boxes, which some parsers skip. Standard section headings and a single column keep everything in reading order.",
    faqs: [
      { q: "Where do certifications go on a nursing resume?", a: "In a dedicated Certifications section and echoed in your summary line. BLS/ACLS, plus any specialty certs, should be visible without scrolling." },
      { q: "Should new grad nurses include clinical rotations?", a: "Yes — list them like work experience with the facility, unit, hours, and key skills practiced. It's the strongest experience section you have." },
      { q: "Can I use a colorful creative template?", a: "Better not to. Nursing hiring runs through conservative portals and busy managers; clean and credential-forward wins." }
    ]
  },
  {
    slug: "medical-assistant",
    jobTitle: "Medical Assistant",
    metaTitle: "Medical Assistant Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free medical assistant resume template with clinic-ready tips, ATS guidance and FAQs. Build and download in minutes — no sign-up.",
    intro: "Medical assistants are hired for versatility: rooming patients, taking vitals, drawing blood, and keeping the front office moving. Hiring managers scan for certifications, clinical skills, and the settings you have worked in. Here is how to make all three obvious in seconds.",
    tips: [
      { title: "Lead with certification and clinical skills", body: "CMA, RMA, or CCMA status belongs right under your name. Follow it with a skills line covering vitals, phlebotomy, EKG, injections, and specimen collection — the exact terms postings list." },
      { title: "Name your setting and specialty", body: "Family practice, urgent care, pediatrics, OB-GYN — each values different skills. Naming the setting tells a hiring manager you can step into their workflow." },
      { title: "Include your EHR systems literally", body: "Epic, eClinicalWorks, Athenahealth — use exact product names. Clinics hire for their specific system, and these names are keyword-matched." },
      { title: "Show the admin half too", body: "Scheduling, insurance verification, prior authorizations, and patient intake are core MA duties. A bullet or two on the front-office side proves you are the complete package." }
    ],
    templateStyles: [
      { name: "Practitioner", slug: "practitioner", why: "Calm and trustworthy for healthcare professionals — the right tone for clinical support roles." },
      { name: "Clinician", slug: "clinician", why: "Credential-forward and calm, built for medical careers where certifications lead." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, so your clinical keywords parse as plain text." }
    ],
    atsNotes: "Clinic and hospital portals filter heavily on certification acronyms and EHR names, matched literally by parsers. Keep credentials, skills, and systems as plain text in a single column — never inside images or text boxes — and use standard headings. Confirm everything parses with Cvyon's free ATS grader.",
    faqs: [
      { q: "CMA vs RMA — does it matter which I list?", a: "List the credential you actually hold, with the issuing body. Hiring managers recognize both; accuracy matters more than the letters." },
      { q: "Should I separate clinical and administrative skills?", a: "A single skills section is fine, but grouping them under two subheadings makes both halves easy to scan." },
      { q: "How long should a medical assistant resume be?", a: "One page. Lead with certification and skills, keep experience tight, and cut anything unrelated to patient care." }
    ]
  },
  {
    slug: "certified-nursing-assistant",
    jobTitle: "Certified Nursing Assistant",
    metaTitle: "Certified Nursing Assistant Resume — Free & ATS | Cvyon",
    metaDescription: "Free certified nursing assistant resume template with CNA-specific tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "CNA hiring moves on reliability and heart — but the resume still has to get past the facility's applicant tracking system first. Certification, state registry status, and the care settings you know have to be plain and prominent. Here is how to write a CNA resume that opens doors.",
    tips: [
      { title: "Put certification in the header line", body: "CNA, your state, and registry status belong right under your name. It is the first filter every facility applies, so do not make anyone hunt for it." },
      { title: "Describe ADL care in plain, specific terms", body: "Bathing, feeding, mobility assistance, toileting, vital signs — name the duties. Specific care language matches postings and proves hands-on experience better than “patient care”." },
      { title: "Name your care settings", body: "Long-term care, skilled nursing, hospital med-surg, home health, memory care — each setting values different experience. Hiring managers match your background to their unit." },
      { title: "Show reliability through work history", body: "Steady employment, consistent shifts, and long tenures speak loudly in CNA hiring. Keep dates clean and gaps explained briefly — dependability is the headline trait." }
    ],
    templateStyles: [
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — a straightforward layout that suits frontline care work." },
      { name: "Practitioner", slug: "practitioner", why: "Calm and trustworthy for healthcare professionals, with room for certifications to stand out." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for high-volume facility portals." }
    ],
    atsNotes: "Nursing facilities and home-health agencies run high-volume portals that parse for certification acronyms and care keywords. Keep your CNA status, state, and skills as plain text in a single column — parsers often skip headers, footers, and text boxes entirely. Run the finished resume through Cvyon's free ATS grader before applying.",
    faqs: [
      { q: "Should I list my CNA license number?", a: "Listing the state and active status is enough for most applications. Include the number only if a posting specifically asks for it." },
      { q: "How do I handle short job tenures?", a: "Be honest and brief. Facilities understand per-diem and agency work — label it as such rather than leaving gaps unexplained." },
      { q: "Can a CNA resume be more than one page?", a: "One page is plenty. Certification, settings, and duties fit comfortably — save the second page for when you have years of varied experience." }
    ]
  },
  {
    slug: "pharmacist",
    jobTitle: "Pharmacist",
    metaTitle: "Pharmacist Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free pharmacist resume template with pharmacy-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Pharmacist resumes are credential-first documents read by pharmacy directors and HR screeners alike. License, setting, and clinical services have to lead — everything else supports. Here is how to structure one for retail, hospital, or clinical roles.",
    tips: [
      { title: "Lead with license and state", body: "PharmD, RPh, license number status, and state belong in a credentials line under your name. It is the non-negotiable filter for every pharmacy posting." },
      { title: "Name your practice setting precisely", body: "Retail, hospital, clinical, specialty, compounding — each values different experience. Describe your setting and core responsibilities so the reader can place you instantly." },
      { title: "List clinical services you provide", body: "Immunizations, MTM, anticoagulation management, antimicrobial stewardship — name the services you actually deliver. These differentiate you from every other licensed applicant." },
      { title: "Include residency and specialty training", body: "PGY-1/PGY-2 residencies and board certifications (BCPS, BCACP) belong prominently for clinical roles. For retail roles, keep them brief but present." }
    ],
    templateStyles: [
      { name: "Clinician", slug: "clinician", why: "Credential-forward and calm — designed for medical careers where licenses lead." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for conservative pharmacy hiring." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping credentials and clinical terms machine-readable." }
    ],
    atsNotes: "Health-system and retail-chain portals parse pharmacist resumes for license status, degree, and clinical keywords. Keep all credentials as plain text — never in a header graphic or badge image — and use standard headings in a single column. Cvyon's free ATS grader will verify the parser sees what you see.",
    faqs: [
      { q: "Where do I put my pharmacy license?", a: "Directly under your name, with the state: “PharmD, RPh — Licensed in [State]”. Recruiters should never have to search for it." },
      { q: "Should retail pharmacists mention prescription volume?", a: "Describe your setting honestly — high-volume retail, community, specialty — without inventing figures. Scope and responsibilities matter more than raw numbers." },
      { q: "Do I need different resumes for retail and hospital roles?", a: "Yes, reorder the same content: lead with dispensing efficiency and patient counseling for retail, clinical services and residency for hospital." }
    ]
  },
  {
    slug: "physical-therapist",
    jobTitle: "Physical Therapist",
    metaTitle: "Physical Therapist Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free physical therapist resume template with rehab-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Physical therapist hiring centers on license, setting, and the populations you treat. Clinic directors want to picture you with their caseload on day one. Here is how to write a PT resume that makes that picture easy.",
    tips: [
      { title: "Put license and state up top", body: "PT, DPT, license status, and state go right under your name. Like all clinical roles, this is the first filter — make it impossible to miss." },
      { title: "Name your settings and populations", body: "Outpatient orthopedics, neuro rehab, sports, pediatrics, geriatrics, home health — each tells a different story. Name yours and the conditions you treat most." },
      { title: "Describe outcomes in plain clinical terms", body: "Return-to-sport progressions, post-surgical protocols, discharge planning, functional independence gains — concrete clinical language beats “helped patients improve”." },
      { title: "List specialty certifications", body: "OCS, SCS, NCS, dry needling, manual therapy certifications — these differentiate you fast. Put them in a certifications section and echo the key ones near the top." }
    ],
    templateStyles: [
      { name: "Practitioner", slug: "practitioner", why: "Calm and trustworthy for healthcare professionals — the right register for rehab careers." },
      { name: "Clinician", slug: "clinician", why: "Credential-forward and calm, built for medical careers where licenses lead." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, so your credentials parse reliably through clinic portals." }
    ],
    atsNotes: "Rehab clinics and hospital systems parse PT resumes for license status, degree (DPT), and specialty terms. Keep credentials and certifications as plain text in a single column — parsers skip images, headers, and text boxes. Standard headings and a clean layout, verified with Cvyon's free ATS grader, keep you in the readable pile.",
    faqs: [
      { q: "Should new DPT grads include clinical affiliations?", a: "Absolutely — list them like work experience with setting, population, and skills practiced. It is your strongest proof of readiness." },
      { q: "How do I show a specialty interest like sports or neuro?", a: "Lead with the relevant setting and certifications, and tailor the summary. One resume can flex between settings by reordering sections." },
      { q: "Is a photo appropriate on a PT resume?", a: "No. Clinical hiring runs through conservative portals; keep it credential-forward and text-based." }
    ]
  },
  {
    slug: "dental-assistant",
    jobTitle: "Dental Assistant",
    metaTitle: "Dental Assistant Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free dental assistant resume template with chairside-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Dental offices hire assistants who can step into the operatory on day one — chairside skills, radiology certification, and sterilization protocol. Hiring dentists scan for these specifics, not generalities. Here is how to write a dental assistant resume that reads as ready.",
    tips: [
      { title: "Lead with certification and radiology status", body: "RDA/CDA status and radiology certification go right under your name. Many states require radiology credentials to take x-rays, so this is often a hard filter." },
      { title: "Name your chairside skills specifically", body: "Four-handed dentistry, impressions, temporary crowns, suction and retraction, instrument transfer — specific operatory language proves real chairside time." },
      { title: "Include sterilization and compliance", body: "Instrument sterilization, OSHA and infection-control protocol, HIPAA — these reassure a hiring dentist you will protect the practice. One bullet is enough." },
      { title: "Name your software and specialties", body: "Dentrix, Eaglesoft, Open Dental — exact names. And note specialties: general, ortho, oral surgery, pediatrics, endo. Offices hire for their chair." }
    ],
    templateStyles: [
      { name: "Practitioner", slug: "practitioner", why: "Calm and trustworthy for healthcare professionals — suits clinical support roles well." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean and professional for small-practice hiring." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for larger dental group portals." }
    ],
    atsNotes: "Larger dental groups and DSOs run applicant portals that parse for certification acronyms and software names. Keep credentials as plain text in a single column — never in badge images or text boxes — and use standard headings. Smaller private practices read resumes directly, where the same clean layout simply reads well. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do I need x-ray certification on my resume?", a: "If your state requires it to take radiographs, yes — prominently. List the certification and where it is valid." },
      { q: "How do I show experience across specialties?", a: "Name each specialty with dates and one line on what you did there. Versatility is a selling point in dental assisting." },
      { q: "Should front-office skills go on a chairside resume?", a: "Briefly, yes — scheduling and insurance verification make you more useful to a small practice. Keep the focus chairside." }
    ]
  },
  {
    slug: "healthcare-administrator",
    jobTitle: "Healthcare Administrator",
    metaTitle: "Healthcare Administrator Resume — Free & ATS | Cvyon",
    metaDescription: "Free healthcare administrator resume template with operations-leadership tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Healthcare administrators are hired for scope: the staff they led, the budgets they managed, the operations they improved. Hiring committees want evidence you can run the business side of care without breaking the clinical side. Here is how to write that resume.",
    tips: [
      { title: "State your scope honestly", body: "Staff headcount, departments overseen, facilities, budget responsibility — use your real figures. Scope is how administrator candidates are compared, so be specific and truthful." },
      { title: "Speak compliance fluently", body: "HIPAA, Joint Commission, CMS regulations, state licensing — name the regulatory frameworks you have operated under. This language signals you can keep a facility survey-ready." },
      { title: "Show operations improvements", body: "Throughput gains, reduced wait times, smoother scheduling, EHR implementations — describe the problem, your action, and the result in plain terms." },
      { title: "Include relevant credentials", body: "MHA, MBA, FACHE, or nursing leadership background — put the credential that qualifies you near the top. Match it to what the posting asks for." }
    ],
    templateStyles: [
      { name: "Brief", slug: "brief", why: "An executive brief with a boxed summary — the right register for leadership resumes." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for hospital committee hiring." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your operations keywords machine-readable." }
    ],
    atsNotes: "Health-system leadership postings run through enterprise ATS software that matches on titles, credentials, and regulatory terms. Use standard headings, plain-text credentials, and a single column — committee members print these resumes, so a clean black-on-white layout matters too. Check parseability with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do I need a clinical background for healthcare administration?", a: "Not always — many administrators come from business or operations. If you have one, feature it; if not, lead with operations results." },
      { q: "Should I list budget figures I managed?", a: "Yes, using your real scope — it is standard in administrator hiring and expected by committees. Never inflate them." },
      { q: "How long should an administrator resume be?", a: "Two pages is normal for leadership roles with real scope. One page if you are early-career — do not pad." }
    ]
  },
  {
    slug: "medical-coder",
    jobTitle: "Medical Coder",
    metaTitle: "Medical Coder Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free medical coder resume template with coding-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Medical coding hiring is certification-gated: the credential gets you read, and specialty experience gets you hired. Hiring managers want to know your code sets, your setting, and your accuracy at a glance. Here is how to write a coder resume that clears the filters.",
    tips: [
      { title: "Put certifications first — they are the filter", body: "CPC, CCS, CRC, or specialty credentials go right under your name. Most postings screen on these before reading anything else, so never bury them." },
      { title: "Name your code sets and specialties", body: "ICD-10-CM, CPT, HCPCS; inpatient, outpatient, ED, risk adjustment, HCC — exact terms. Coders are hired for specific code sets, so match the posting's language." },
      { title: "Describe accuracy and productivity honestly", body: "If you track accuracy rates or charts-per-day from your actual work, include them — these are the performance metrics of coding. Never invent them." },
      { title: "Note remote-readiness and tools", body: "Encoder software, EHR systems, and remote-work experience matter enormously since so many coding roles are remote. Name the tools literally." }
    ],
    templateStyles: [
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems — maximum parseability for a certification-filtered field." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe, ideal for high-volume coding portals." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — clean and conservative for healthcare hiring." }
    ],
    atsNotes: "Coding roles are among the most aggressively filtered in healthcare: parsers scan for certification acronyms and code-set terms before a human ever looks. Keep every credential as plain text in a single column — never in images or text boxes — and spell out each acronym once. Cvyon's free ATS grader will show you exactly what the parser extracts.",
    faqs: [
      { q: "CPC or CCS — which should I get first?", a: "CPC suits outpatient and physician coding; CCS suits hospital inpatient. Match the credential to the setting you want, and list whichever you hold prominently." },
      { q: "How do new coders get experience without a job?", a: "Practicum hours, externships, and coding practice programs count — list them like experience with the code sets you worked. Accuracy on practice charts is still evidence." },
      { q: "Should I mention typing speed?", a: "Only if genuinely strong and relevant. Accuracy and code-set knowledge matter far more to hiring managers." }
    ]
  },
  {
    slug: "physician-assistant",
    jobTitle: "Physician Assistant",
    metaTitle: "Physician Assistant Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free physician assistant resume template with PA-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Physician assistant hiring is specialty-driven: credentials get you screened, but your setting and procedures get you interviewed. Hiring physicians want to see you can handle their patient population. Here is how to write a PA resume that proves it.",
    tips: [
      { title: "Lead with NCCPA certification and state license", body: "PA-C, NCCPA status, and state license go right under your name. Like every clinical role, this is the first filter — make it unmissable." },
      { title: "Name your specialty and setting", body: "Emergency medicine, primary care, surgery, dermatology, hospitalist — each values different experience. State yours plainly with the patient populations you manage." },
      { title: "List procedures you perform", body: "Suturing, joint injections, lumbar punctures, casting, first-assist — name what you actually do. Procedural scope is how PAs are compared." },
      { title: "New grads: detail your rotations", body: "List clinical rotations like work experience — specialty, site, weeks, and key skills. Strong rotations are the best evidence a new PA has." }
    ],
    templateStyles: [
      { name: "Clinician", slug: "clinician", why: "Credential-forward and calm — designed for medical careers where certifications lead." },
      { name: "Practitioner", slug: "practitioner", why: "A calm, trustworthy layout that suits healthcare hiring without visual noise." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Hospital portals parse aggressively; a template engineered for ATS keeps your credentials readable." }
    ],
    atsNotes: "Health systems parse PA resumes for NCCPA status, state license, and specialty keywords. Keep credentials as plain text in a single column — parsers skip images, headers, and text boxes — and use standard section headings. Verify what the parser sees with Cvyon's free ATS grader before you apply.",
    faqs: [
      { q: "Should I tailor my resume per specialty?", a: "Yes — reorder to lead with the relevant setting, procedures, and rotations. One base resume, specialty-ordered versions." },
      { q: "Where do procedures go on a PA resume?", a: "In a dedicated Procedures or Clinical Skills section, and echoed in experience bullets where they were performed regularly." },
      { q: "Do PAs need a cover letter?", a: "Many postings ask for one. Keep the resume itself factual and complete — the letter carries your motivation." }
    ]
  },
  {
    slug: "pharmacy-technician",
    jobTitle: "Pharmacy Technician",
    metaTitle: "Pharmacy Technician Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free pharmacy technician resume template with tech-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Pharmacy technicians are hired for precision and pace: certification, setting, and the systems you run. Hiring pharmacists want to know you can keep their workflow safe and moving. Here is how to write a technician resume that proves it.",
    tips: [
      { title: "Put CPhT status up top", body: "Certified Pharmacy Technician status and state registration go right under your name. Certification is the primary filter for technician postings." },
      { title: "Name your setting", body: "Retail, hospital, compounding, specialty, long-term care — each runs a different workflow. Naming your setting tells the hiring pharmacist you know their world." },
      { title: "List your pharmacy systems literally", body: "QS1, Enterprise, RxConnect, Pyxis, Omnicell — exact product names. Pharmacies hire for their specific system and keyword-match on these." },
      { title: "Show the full skill set", body: "Filling, compounding, inventory management, insurance billing, prior authorizations — a technician who covers the whole workflow is the most hireable kind." }
    ],
    templateStyles: [
      { name: "Practitioner", slug: "practitioner", why: "Calm and trustworthy for healthcare professionals — the right tone for pharmacy support roles." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for high-volume pharmacy portals." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your certification and system keywords readable." }
    ],
    atsNotes: "Retail chains and hospital systems filter technician resumes on certification acronyms and system names, matched literally by parsers. Keep everything as plain text in a single column — never in images or text boxes — and use standard headings. Cvyon's free ATS grader confirms the parser reads what you wrote.",
    faqs: [
      { q: "Is CPhT certification required?", a: "Many states and employers require or strongly prefer it. List your status honestly, including “in progress” with an exam date if applicable." },
      { q: "Should I include non-pharmacy work experience?", a: "Briefly — customer service and cash-handling experience transfers well to retail pharmacy. Keep it to a line or two." },
      { q: "How long should a pharmacy technician resume be?", a: "One page. Certification, setting, systems, and duties fit comfortably without filler." }
    ]
  }
,
  {
    slug: "accountant",
    jobTitle: "Accountant",
    metaTitle: "Accountant Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free accountant resume template with finance-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Accounting hiring is precision hiring: credentials, software, and the complexity of the books you have kept. Hiring managers want to place your experience instantly — public vs industry, close process, systems. Here is how to write an accountant resume that adds up.",
    tips: [
      { title: "State your CPA status plainly", body: "Licensed CPA, CPA candidate with exams passed, or “CPA eligible” — put the exact status in a line under your name. It is the single most-filtered item on accountant resumes, so be precise and honest." },
      { title: "Name your accounting software literally", body: "QuickBooks, NetSuite, SAP, Oracle, Xero — exact product names. Employers hire for their system, and these names are keyword-matched by both recruiters and parsers." },
      { title: "Describe the complexity you handled", body: "Multi-entity close, consolidations, intercompany, revenue recognition, audit support — name the hard parts of your close. Complexity is how accountants are compared." },
      { title: "Show process improvements", body: "Faster closes, cleaner reconciliations, automation you built in Excel — describe what you fixed and the result in plain terms. Accuracy plus efficiency is the ideal combination." }
    ],
    templateStyles: [
      { name: "Teller", slug: "teller", why: "Numbers-forward and crisp for finance professionals — the natural register for accounting." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for conservative finance hiring." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your credential and software keywords readable." }
    ],
    atsNotes: "Accounting postings run through corporate ATS software that filters on CPA status and exact software names. Keep credentials and systems as plain text in a single column — never in images or text boxes — and use standard headings like Work Experience and Education. Verify the parser's view with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list CPA exams I have passed but not the license?", a: "Yes — “CPA candidate, 3 of 4 exams passed” is honest and valued. Never imply licensure you do not hold." },
      { q: "Public accounting vs industry — different resumes?", a: "Reorder the same content: lead with clients and engagements for public, close process and systems for industry. Match the posting's language." },
      { q: "Do accountants need a summary?", a: "A two-line positioning statement helps — credential, years, specialty. Skip the paragraph of adjectives." }
    ]
  },
  {
    slug: "project-manager",
    jobTitle: "Project Manager",
    metaTitle: "Project Manager Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free project manager resume template with PM-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Project manager resumes are judged on delivery: what shipped, on what timeline, at what scale. Hiring managers want methodology, scope, and outcomes — not a list of meetings. Here is how to write a PM resume that reads like a track record.",
    tips: [
      { title: "Match methodology to the posting", body: "Agile/Scrum, Kanban, Waterfall, hybrid — name the methodologies you actually ran, using the posting's terms. Methodology mismatch is a common silent filter." },
      { title: "Put certifications where filters find them", body: "PMP, CAPM, CSM, PRINCE2 — list what you hold in a certifications line near the top. For many postings these are hard requirements, not preferences." },
      { title: "State scope in concrete terms", body: "Team size, budget, timeline, stakeholder count — use your real figures. “Led a 12-person team delivering a 9-month migration” lets a hiring manager calibrate instantly." },
      { title: "Show delivery outcomes", body: "On-time delivery, budget adherence, adoption, defect reduction — describe what the project achieved because you ran it. Outcomes separate managers from coordinators." }
    ],
    templateStyles: [
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs — built for resumes argued through delivered results." },
      { name: "Gateway", slug: "gateway", why: "A bold boxed summary opening the page, ideal for the positioning statement a PM resume needs." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping methodology and certification keywords readable." }
    ],
    atsNotes: "PM postings are keyword-dense on methodologies, certifications, and tools (Jira, MS Project, Asana), and corporate parsers match them literally. Keep every term as plain text in a single column with standard headings — and spell out acronyms like PMP at least once, since some parsers do not expand them. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "PMP or Scrum certification — which matters more?", a: "It depends on the posting. Traditional industries filter on PMP; software teams on Scrum/Agile. List what you hold and target postings that match." },
      { q: "How do I show PM experience without the title?", a: "Describe projects you actually ran under any title — scope, timeline, outcome. Many PMs are promoted from coordinator, analyst, or engineer roles." },
      { q: "Should I list every project I have managed?", a: "No — list the most relevant and impressive, with outcomes. A curated track record beats an exhaustive one." }
    ]
  },
  {
    slug: "marketing-manager",
    jobTitle: "Marketing Manager",
    metaTitle: "Marketing Manager Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free marketing manager resume template with growth-role tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Marketing manager hiring is portfolio-of-proof hiring: channels you ran, campaigns you led, results you can defend. Hiring managers want to see you can own a number, not just a calendar. Here is how to write a marketing resume that proves it.",
    tips: [
      { title: "Name your channels literally", body: "SEO, paid search, paid social, email, lifecycle, content — use the exact terms postings use, plus the platforms (Google Ads, Meta, HubSpot). Channel expertise is keyword-matched." },
      { title: "Attach outcomes to campaigns", body: "“Grew organic pipeline” with the before-and-after beats “managed SEO”. State what you ran, what changed, and over what timeframe — using your real results." },
      { title: "Show budget and team scope honestly", body: "Budget managed, team size, agency relationships — use your real figures. Scope tells a hiring manager what level you operated at." },
      { title: "Prove cross-functional leadership", body: "Launching campaigns means aligning sales, product, and creative. A bullet on stakeholder management shows you can run marketing inside a real company, not just a channel." }
    ],
    templateStyles: [
      { name: "Marketing", slug: "marketing", why: "A marketer's resume with brand energy — the right voice for marketing hiring." },
      { name: "Rainmaker", slug: "rainmaker", why: "Metrics-forward for closers who sell on numbers — ideal when your argument is campaign results." },
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — lets standout campaigns take center stage." }
    ],
    atsNotes: "Marketing postings list channels, platforms, and methodologies as keywords, and corporate ATS software matches them literally. Keep every platform name as plain text in a single column — and resist the urge to make the resume itself a design piece, since parsers punish that. Verify readability with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should a marketing resume be creative and colorful?", a: "Restrained. A touch of brand energy is fine, but the resume must still parse cleanly — let your portfolio carry the creativity." },
      { q: "How do I show results without revealing confidential data?", a: "Use percentages, indexed growth, or ranges from your real work. “Grew demo bookings ~40% in two quarters” is honest without naming figures." },
      { q: "Do I need to list every channel I have touched?", a: "Lead with depth in your strongest channels. A long shallow list reads as dabbling; two or three deep ones read as expertise." }
    ]
  },
  {
    slug: "sales-associate",
    jobTitle: "Sales Associate",
    metaTitle: "Sales Associate Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free sales associate resume template with retail-sales tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Sales associate hiring is refreshingly direct: can you sell, can you show up, can you handle customers. Hiring managers scan for product knowledge, reliability, and any numbers from your record. Here is how to write a sales resume that reads as a closer.",
    tips: [
      { title: "Lead with numbers from your record", body: "Quota attainment, units sold, average transaction value — use your real figures. In sales hiring, honest numbers beat adjectives every time." },
      { title: "Name your product and customer", body: "Electronics, apparel, furniture, B2B services — product knowledge transfers. Naming what you sold and who you sold it to helps the next employer picture you on their floor." },
      { title: "Show customer skills through duties", body: "Handling objections, recovering unhappy customers, building repeat clientele — describe the work. These prove the soft skills sales actually runs on." },
      { title: "List your systems literally", body: "POS systems, Salesforce, HubSpot, inventory tools — exact names. Retail and inside-sales postings keyword-match on these more than candidates expect." }
    ],
    templateStyles: [
      { name: "Rainmaker", slug: "rainmaker", why: "Metrics-forward for closers who sell on numbers — the natural home for a sales resume." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like good selling." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn sales results into scannable proof." }
    ],
    atsNotes: "Retail and sales postings run through high-volume ATS portals that match on product categories, systems, and sales keywords. Keep everything as plain text in a single column with standard headings — many applications are completed on phones, so a clean layout matters twice. Check parseability with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I include commission-only or part-time sales roles?", a: "Yes — selling is selling. List the role, what you sold, and your honest results. Part-time experience still counts." },
      { q: "How do I handle a gap in sales employment?", a: "Briefly and honestly. Sales managers care most about what you did when you were selling — keep the focus there." },
      { q: "Do I need a summary on a sales resume?", a: "Two lines max: what you sell and your track record. Then let the numbers talk." }
    ]
  },
  {
    slug: "human-resources-manager",
    jobTitle: "Human Resources Manager",
    metaTitle: "Human Resources Manager Resume — Free & ATS | Cvyon",
    metaDescription: "Free human resources manager resume template with HR-leadership tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "HR manager hiring balances two stories: the people work (relations, development, culture) and the compliance work (policy, investigations, law). Hiring leaders want scope, systems, and judgment. Here is how to write an HR resume that shows all three.",
    tips: [
      { title: "State your scope honestly", body: "Headcount supported, sites, HR team led — use your real figures. “Sole HR for a 150-person plant” tells a hiring leader exactly what you can handle." },
      { title: "Name your HRIS literally", body: "Workday, ADP, BambooHR, UKG — exact product names. HR postings keyword-match on systems, and “HR software” matches nothing." },
      { title: "Show the compliance backbone", body: "FMLA, ADA, EEO, investigations, policy writing — name the regulatory and employee-relations work you have owned. This is the load-bearing half of HR management." },
      { title: "Put certifications up top", body: "SHRM-CP/SCP or PHR/SPHR go in a credentials line near the top. Many postings filter on these, so do not bury them." }
    ],
    templateStyles: [
      { name: "Gateway", slug: "gateway", why: "A bold boxed summary opening the page — ideal for positioning an HR leader's scope and philosophy." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for conservative HR hiring." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — professional and uncluttered." }
    ],
    atsNotes: "HR postings run through the same corporate ATS software you would one day administer — and it matches on certification acronyms, HRIS names, and compliance terms literally. Keep every keyword as plain text in a single column, spell out acronyms at least once, and use standard headings. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "SHRM or HRCI certification — which should I list?", a: "List whichever you hold; both are widely recognized. Never list a certification you are merely studying for as if earned." },
      { q: "How do I show employee-relations experience?", a: "Describe the work in general terms — investigations conducted, grievances resolved, policy rollouts — without disclosing confidential details." },
      { q: "Should HR resumes mention recruiting?", a: "Yes, briefly — talent acquisition is part of most HR manager roles. Note roles filled and sourcing channels if you led hiring." }
    ]
  },
  {
    slug: "business-analyst",
    jobTitle: "Business Analyst",
    metaTitle: "Business Analyst Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free business analyst resume template with BA-specific tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Business analysts are hired as translators: business problem in, clear requirements out. Hiring managers scan for your artifacts, your tools, and proof your recommendations changed something. Here is how to write a BA resume that reads as indispensable.",
    tips: [
      { title: "Name your artifacts", body: "BRDs, user stories, process maps, use cases, data dictionaries — list what you actually produced. Artifacts are the tangible proof of BA work, so be specific." },
      { title: "List tools literally", body: "Jira, Confluence, SQL, Tableau, Excel, Visio or Lucidchart — exact names. BA postings keyword-match on tools, and “requirements tools” matches nothing." },
      { title: "Show stakeholder scope", body: "Who you worked with — executives, engineering, vendors, end users — and at what scale. Facilitating across groups is the core BA skill; make the scope visible." },
      { title: "Tie analysis to decisions", body: "“Recommended process change adopted across three teams” beats “analyzed processes”. Every artifact should connect to something that happened because of it." }
    ],
    templateStyles: [
      { name: "Teller", slug: "teller", why: "Numbers-forward and crisp — suits analysts whose work is measured in outcomes." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn analysis work into readable results." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your tool and methodology keywords readable." }
    ],
    atsNotes: "BA postings are keyword-heavy on tools, methodologies (Agile, Scrum, Waterfall), and artifact terms, matched literally by corporate parsers. Keep everything as plain text in a single column with standard headings — avoid tables that split your skills across cells. Confirm with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do business analysts need SQL?", a: "Increasingly, yes — at least enough to validate data and write basic queries. List your honest level; “proficient in joins and aggregations” is credible." },
      { q: "How is a BA resume different from a PM resume?", a: "BAs lead with requirements, analysis, and stakeholder facilitation; PMs lead with shipped outcomes and roadmaps. Mirror the posting you are targeting." },
      { q: "Should I include domain expertise?", a: "Absolutely — finance, healthcare, and logistics BAs are hired for domain knowledge as much as method. Name your domains plainly." }
    ]
  },
  {
    slug: "administrative-assistant",
    jobTitle: "Administrative Assistant",
    metaTitle: "Administrative Assistant Resume — Free & ATS | Cvyon",
    metaDescription: "Free administrative assistant resume template with office-support tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Administrative assistants are hired for trust: calendars kept, inboxes tamed, offices running. Hiring managers scan for the scope you supported and the tools you run — then read for judgment and reliability. Here is how to write an admin resume that reads as indispensable.",
    tips: [
      { title: "Lead with the scope you supported", body: "Number of executives, team size, office headcount — “supported three VPs and a 40-person office” calibrates you instantly. Scope is the headline of admin hiring." },
      { title: "Name your tools literally", body: "Microsoft 365, Google Workspace, Outlook, scheduling and travel tools, expense systems — exact names. Postings keyword-match on these, and “office software” matches nothing." },
      { title: "Show judgment through duties", body: "Prioritizing competing requests, handling confidential information, solving problems before they reached your executive — describe the work that proves discretion and initiative." },
      { title: "Quantify the operational wins", body: "Streamlined filing, cut scheduling conflicts, organized events for 100+ — concrete improvements show you run the office, not just sit in it." }
    ],
    templateStyles: [
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for office hiring." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean and professional." },
      { name: "Brief", slug: "brief", why: "An executive brief with a boxed summary — neat and organized, like good admin work." }
    ],
    atsNotes: "Admin postings run through corporate ATS portals that match on software names and support keywords literally. Keep tools and duties as plain text in a single column with standard headings — many admin applications are screened quickly, so scannability matters. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list typing speed?", a: "Only if genuinely strong and the posting values it. Tool fluency and scope matter more to most hiring managers." },
      { q: "How do I show I handled confidential work?", a: "State it as a duty — “managed confidential personnel documents” — without revealing any confidential content itself." },
      { q: "Is one page enough for an admin resume?", a: "Yes for most. Two pages only with many years across varied offices — keep the strongest scope on page one." }
    ]
  },
  {
    slug: "office-manager",
    jobTitle: "Office Manager",
    metaTitle: "Office Manager Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free office manager resume template with operations tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Office managers are hired to own the place: vendors, budgets, people, and the hundred small fires nobody else sees. Hiring leaders want scope, systems thinking, and proof you made an office run better. Here is how to write that resume.",
    tips: [
      { title: "State your scope in real terms", body: "Headcount, locations, vendors managed, budget owned — use your actual figures. “Ran operations for a 60-person, two-floor office” tells the whole story in one line." },
      { title: "Show the money you saved or fixed", body: "Renegotiated contracts, streamlined supply ordering, fixed broken processes — describe the problem and the result honestly. Operational wins are an office manager's portfolio." },
      { title: "Name your systems literally", body: "Expense tools, HRIS, facility ticketing, inventory systems — exact names. Postings keyword-match on these, and they prove you can step into their stack." },
      { title: "Prove people leadership", body: "Hiring, training, and supervising front-desk or admin staff counts as management experience. Name the team size and what you built in them." }
    ],
    templateStyles: [
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for operations hiring." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn operations work into readable wins." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like good operations." }
    ],
    atsNotes: "Office manager postings run through corporate ATS software matching on systems, budget, and operations keywords. Keep everything as plain text in a single column with standard headings — and keep the layout clean enough to print well, since office hiring still involves paper. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "How is an office manager resume different from an admin's?", a: "Scope and ownership: budgets, vendors, and teams led. Lead with what you owned, not just what you supported." },
      { q: "Should I mention facilities or safety duties?", a: "Yes — safety compliance, emergency procedures, and vendor management are valued parts of the role. One or two bullets suffice." },
      { q: "What if I managed an office without the title?", a: "Claim the work, not the title: describe what you actually ran. Many office managers start as senior admins doing the job already." }
    ]
  },
  {
    slug: "financial-analyst",
    jobTitle: "Financial Analyst",
    metaTitle: "Financial Analyst Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free financial analyst resume template with finance-modeling tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Financial analyst hiring is model-first: can you build it, can you defend it, can you explain it to non-finance people. Hiring managers scan for modeling skills, tools, and the decisions your analysis informed. Here is how to write an FA resume that reads as rigorous.",
    tips: [
      { title: "Name your modeling skills precisely", body: "Three-statement models, DCF, comps, budgeting and forecasting, variance analysis — list what you actually build. Modeling vocabulary is how analysts are screened." },
      { title: "List tools literally", body: "Excel (with your honest level — pivot tables, Power Query, VBA), SQL, Power BI, Tableau, Bloomberg or Capital IQ — exact names, keyword-matched by postings and parsers." },
      { title: "Tie analysis to decisions", body: "“Built the model behind a pricing change” or “forecasting informed headcount planning” — connect your work to something the business did. Analysis without influence is just homework." },
      { title: "Show CFA or credential progress honestly", body: "“CFA Level II candidate” is a real signal — list your exact status. Never imply a charter you do not hold." }
    ],
    templateStyles: [
      { name: "Teller", slug: "teller", why: "Numbers-forward and crisp for finance professionals — the natural register for analysts." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs make analytical impact scannable." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Engineered for applicant tracking systems, keeping your tool and modeling keywords readable." }
    ],
    atsNotes: "Finance postings run through corporate ATS software that matches on modeling terms, tools, and credential acronyms literally. Keep every keyword as plain text in a single column with standard headings — and spell out acronyms like DCF at least once. Cvyon's free ATS grader will verify the parser sees your skills.",
    faqs: [
      { q: "Is the CFA worth listing in progress?", a: "Yes — “Level I/II/III candidate” signals seriousness. Just state your exact status honestly." },
      { q: "How technical should the skills section be?", a: "Very specific: name the model types, Excel capabilities, and data tools. Vague “financial modeling” tells a hiring manager nothing." },
      { q: "Should I include deal or transaction experience?", a: "Yes if you have it — M&A support, fundraising models, or portfolio analysis are high-value signals. Describe your role precisely." }
    ]
  },
  {
    slug: "customer-service-representative",
    jobTitle: "Customer Service Representative",
    metaTitle: "Customer Service Representative Resume — Free & ATS | Cvyon",
    metaDescription: "Free customer service representative resume template with support-role tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Customer service hiring is about proof of temperament: volume handled, problems solved, customers kept. Hiring managers scan for your channels, your tools, and evidence you stay calm under pressure. Here is how to write a CSR resume that reads as unflappable.",
    tips: [
      { title: "Describe volume in your real terms", body: "Calls, chats, or tickets per shift; team or queue size — use your actual experience. “Handled 60+ calls daily in a billing queue” calibrates you instantly and honestly." },
      { title: "Name your channels and tools literally", body: "Phone, chat, email; Zendesk, Salesforce, Freshdesk — exact names. Postings keyword-match on channels and systems, so spell them out." },
      { title: "Show problem-solving, not just answering", body: "De-escalations, first-contact resolutions, process gaps you flagged — describe situations you turned around. Anyone can answer; fewer can resolve." },
      { title: "Frame metrics from your record", body: "CSAT scores, resolution rates, QA results — include the ones you actually earned. Honest metrics from your record beat impressive-sounding claims." }
    ],
    templateStyles: [
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward and human." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean for high-volume hiring." },
      { name: "Scanner", slug: "scanner", why: "Keywords up top, built for the six-second scan that high-volume recruiters give every resume." }
    ],
    atsNotes: "CSR roles are hired at volume through ATS portals that match on channel, system, and service keywords literally. Keep everything as plain text in a single column — many applicants apply from phones, so a simple layout parses best. Run the finished resume through Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list every company I did support for?", a: "List the roles with dates and one or two outcome bullets each. Tenure and reliability matter enormously in service hiring." },
      { q: "How do I show soft skills on a resume?", a: "Through duties: “de-escalated billing disputes” proves patience better than the word “patient” ever could." },
      { q: "Do I need a summary?", a: "One or two lines: channels, volume, and what you are known for. Then let experience do the talking." }
    ]
  }
,
  {
    slug: "executive-assistant",
    jobTitle: "Executive Assistant",
    metaTitle: "Executive Assistant Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free executive assistant resume template with C-suite support tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Executive assistants are hired for judgment: the calendar you protect, the travel you untangle, the discretion you keep. Hiring executives scan for the level you supported and the complexity you handled. Here is how to write an EA resume that reads as trusted.",
    tips: [
      { title: "Name the level you supported", body: "CEO, CFO, board of directors — state it plainly. “Executive assistant to the CEO of a 300-person company” sets your level in one line; vagueness invites doubt." },
      { title: "Show complexity, not just tasks", body: "Multi-timezone travel, board meeting prep, investor visit logistics — describe the hardest things you coordinated. Complexity is how EAs are compared." },
      { title: "Prove discretion through duties", body: "Handling confidential compensation, M&A, or personnel matters — state the duty without revealing content. Discretion is shown, never claimed." },
      { title: "List tools and gatekeeping honestly", body: "Calendar and inbox management at executive scale, expense systems, event planning — name your tools literally and describe how you protected your executive's time." }
    ],
    templateStyles: [
      { name: "Brief", slug: "brief", why: "An executive brief with a boxed summary — polished and organized, like the best EAs." },
      { name: "Classic", slug: "classic", why: "A timeless serif resume — understated authority for C-suite support roles." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for executive hiring." }
    ],
    atsNotes: "EA postings run through corporate ATS software matching on tools, travel, and support keywords. Keep everything as plain text in a single column with standard headings — executives and their recruiters often print these, so a clean, professional layout matters. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I name the executives I supported?", a: "Title and company size are enough — “EA to CEO, Series C SaaS”. Never disclose private details about individuals." },
      { q: "How do I show I am more than a scheduler?", a: "Describe ownership: projects you ran, processes you built, problems you solved without being asked. That is the EA difference." },
      { q: "Is a photo appropriate?", a: "No. Keep it professional and text-based; your competence is the visual." }
    ]
  },
  {
    slug: "recruiter",
    jobTitle: "Recruiter",
    metaTitle: "Recruiter Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free recruiter resume template with talent-acquisition tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Recruiters are hired on their own track record — which makes a recruiter resume deliciously meta. Hiring leaders want roles filled, sourcing channels, and time-to-fill from your record. Here is how to write a recruiter resume that would pass your own screen.",
    tips: [
      { title: "Lead with roles filled, from your record", body: "Requisitions closed, roles and levels hired, hiring volume — use your real numbers. A recruiter who will not state their own track record raises the exact flag they screen for." },
      { title: "Name your sourcing channels", body: "LinkedIn Recruiter, referrals, direct sourcing, agencies managed — describe how you actually found people. Sourcing craft is the core skill; make it visible." },
      { title: "List your ATS and tools literally", body: "Greenhouse, Lever, Workday, iCIMS — exact names. Companies hire for their stack, and these are keyword-matched." },
      { title: "Show stakeholder partnership", body: "Calibrating with hiring managers, advising on offers, improving interview processes — describe how you partnered with the business, not just filled reqs." }
    ],
    templateStyles: [
      { name: "Gateway", slug: "gateway", why: "A bold boxed summary opening the page — strong positioning for a people-facing role." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn hiring results into scannable proof." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — clean and credible for HR leadership." }
    ],
    atsNotes: "Recruiting postings run through the very ATS software you would administer, matching on tools, sourcing terms, and role types literally. Keep every keyword as plain text in a single column with standard headings — a recruiter's resume that fails parsing is a particularly bad look. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "Agency or corporate recruiting — different resumes?", a: "Emphasize volume and business development for agency; stakeholder partnership and process for corporate. Same record, different lead." },
      { q: "Should I list the roles I hired for?", a: "Yes — role types and seniority levels show your range. “Hired 40 engineers across backend, mobile, and data” is concrete and credible." },
      { q: "How do I show sourcing skill?", a: "Name channels and describe hard fills: niche roles, competitive markets, pipelines you built from scratch. That is the craft." }
    ]
  },
  {
    slug: "teacher",
    jobTitle: "Teacher",
    metaTitle: "Teacher Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free teacher resume template with classroom-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Teacher hiring runs through district portals and principal inboxes — both want certification, subject, and grade level at a glance. Then they read for classroom craft: management, differentiation, results. Here is how to write a teacher resume that gets the interview.",
    tips: [
      { title: "Put certification, subject, and grade up top", body: "State credential, subject area, and grade band right under your name. Districts filter on these three before reading anything else." },
      { title: "Show classroom management plainly", body: "Routines you built, behavior systems you ran, the learning environment you maintained — describe the craft, not just “managed a classroom of 28”." },
      { title: "Prove learning happened", body: "Assessment data, growth you documented, interventions that worked — describe outcomes in honest terms. Principals hire teachers who move students." },
      { title: "Include the whole-teacher picture", body: "Coaching, clubs, committees, parent communication — one or two lines show you contribute beyond your classroom. Schools hire colleagues, not just instructors." }
    ],
    templateStyles: [
      { name: "Pedagogue", slug: "pedagogue", why: "A warm, approachable design for educators — the right voice for teaching." },
      { name: "Tutor", slug: "tutor", why: "Clear and encouraging for tutors and coaches — supportive tone, clean structure." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default for district portals." }
    ],
    atsNotes: "School districts run applicant portals (Frontline, AppliTrack, TalentEd) that parse for certification, subject, and grade-level keywords. Keep credentials as plain text in a single column with standard headings — never in images or text boxes. Verify parseability with Cvyon's free ATS grader before submitting.",
    faqs: [
      { q: "Should new teachers include student teaching?", a: "Yes — list it like experience with grade, subject, cooperating teacher's school, and what you taught. It is your primary credential." },
      { q: "How do I show test-score improvement honestly?", a: "Describe growth in your own terms — “moved 80% of students to proficiency on unit assessments” — using your real data, never inflated." },
      { q: "Do I need different resumes per grade level?", a: "Reorder to lead with the relevant grade experience and tailor the summary. One base resume adapts easily." }
    ]
  },
  {
    slug: "teaching-assistant",
    jobTitle: "Teaching Assistant",
    metaTitle: "Teaching Assistant Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free teaching assistant resume template with classroom-support tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Teaching assistants are hired for classroom presence: small-group instruction, one-on-one support, and the reliability teachers depend on. Hiring principals want to see what you actually did with students — not just that you were in the room. Here is how to write that resume.",
    tips: [
      { title: "Describe your instructional role specifically", body: "Small-group reading intervention, math support, one-on-one aides, behavior plans you implemented — name the work. Specific duties separate strong TAs from seat-fillers." },
      { title: "Note special populations honestly", body: "Special education, ELL, early childhood — name the populations you have supported and what you did. This experience is highly valued and should be prominent." },
      { title: "Show education in progress", body: "Coursework toward a teaching degree or paraprofessional certification belongs near the top. Schools hire TAs who are growing toward teaching." },
      { title: "Prove reliability through tenure", body: "Consistent school years, long placements, teachers who requested you back — steadiness is gold in support roles. Keep dates clean and complete." }
    ],
    templateStyles: [
      { name: "Tutor", slug: "tutor", why: "Clear and encouraging for tutors and coaches — the natural tone for classroom support." },
      { name: "Pedagogue", slug: "pedagogue", why: "A warm, approachable design for educators." },
      { name: "Launchpad", slug: "launchpad", why: "A career-starter template with lift-off energy — ideal if you are working toward full certification." }
    ],
    atsNotes: "District portals parse TA resumes for paraprofessional credentials, education level, and support keywords. Keep everything as plain text in a single column with standard headings — many TA applications are screened quickly at volume. Confirm with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do I need certification to be a teaching assistant?", a: "Requirements vary by district and state — some require paraprofessional credentials or college credits. List exactly what you hold." },
      { q: "Should I include volunteer classroom experience?", a: "Yes, briefly — tutoring, Sunday school teaching, camp counseling all show classroom presence. Label it clearly as volunteer." },
      { q: "How long should a TA resume be?", a: "One page. Duties, populations, and education fit comfortably without filler." }
    ]
  },
  {
    slug: "school-counselor",
    jobTitle: "School Counselor",
    metaTitle: "School Counselor Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free school counselor resume template with counseling-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "School counselors are hired for caseload wisdom: academic guidance, social-emotional support, and crisis calm. Hiring committees want credentials, scope, and programs you have actually run. Here is how to write a counselor resume that reads as steady and capable.",
    tips: [
      { title: "Lead with license and credential", body: "State license, school counseling credential, and degree right under your name. Districts filter on credentialing first — make it unmissable." },
      { title: "Describe your caseload honestly", body: "Student count, grade levels, populations served — use your real scope. “Sole counselor for 450 students, grades 9–12” tells the whole story." },
      { title: "Name programs you ran", body: "College application workshops, SEL curriculum, peer mediation, attendance interventions — describe programs you built or led and what changed." },
      { title: "Show collaboration, protect confidentiality", body: "Working with teachers, families, and outside providers is core to the role — describe the collaboration without ever disclosing student details." }
    ],
    templateStyles: [
      { name: "Tutor", slug: "tutor", why: "Clear and encouraging for tutors and coaches — a supportive, trustworthy tone." },
      { name: "Pedagogue", slug: "pedagogue", why: "A warm, approachable design for educators." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — professional for committee hiring." }
    ],
    atsNotes: "District portals parse counselor resumes for credential, degree, and program keywords. Keep credentials as plain text in a single column with standard headings — never in images or text boxes. Committee members print these resumes, so a clean layout matters too. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "What credential do school counselors need?", a: "It varies by state — typically a master's in school counseling plus state certification. List your exact credential and where it is valid." },
      { q: "How do I show counseling impact without breaching confidentiality?", a: "Describe programs and aggregate outcomes — “ran grief groups for 30 students” — never individual cases." },
      { q: "Should I mention crisis experience?", a: "Yes, in general terms — crisis response protocols, threat assessment teams. It is valued experience; keep details appropriately vague." }
    ]
  },
  {
    slug: "electrician",
    jobTitle: "Electrician",
    metaTitle: "Electrician Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free electrician resume template with trade-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Electrician hiring is license-first: journeyman status, state, and the work you are qualified to do. Contractors and facilities managers scan for these, then for your specialties. Here is how to write a trade resume that gets the call.",
    tips: [
      { title: "Put license and status in the header", body: "Journeyman or master electrician, license number status, and state go right under your name. It is the first filter for every electrical posting." },
      { title: "Name your work type", body: "Residential, commercial, industrial, new construction, service and troubleshooting — each values different experience. State yours so the right contractors call." },
      { title: "Show code and safety fluency", body: "NEC knowledge, permit and inspection experience, lockout/tagout, OSHA training — name them. Safe, code-compliant work is the whole reputation in this trade." },
      { title: "List systems and specialties", body: "Panel upgrades, lighting, motor controls, low-voltage, solar — name what you install and service. Specialties differentiate you from every other licensed applicant." }
    ],
    templateStyles: [
      { name: "Workshop", slug: "workshop", why: "A craft sidebar in warm amber — tools, skills, process — built for the trades." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like trade hiring." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for larger contractor portals." }
    ],
    atsNotes: "Larger contractors and facilities run ATS portals that parse for license status and trade keywords, while small shops read resumes directly or find you on job boards. Keep your license and skills as plain text in a single column — readable by both parsers and humans. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list my license number?", a: "State and status are enough for most applications. Provide the number when a posting or contractor asks for it." },
      { q: "How do apprentices show experience?", a: "List apprenticeship hours, the journeymen you trained under, and the work you performed. Hours and scope are the currency." },
      { q: "Do I need a summary?", a: "One line: license, years, specialty. Contractors skim — make the first line count." }
    ]
  },
  {
    slug: "plumber",
    jobTitle: "Plumber",
    metaTitle: "Plumber Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free plumber resume template with trade-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Plumber hiring runs on license, reliability, and the systems you know. Whether it is residential service or commercial new construction, the hiring contractor wants to place you in one line. Here is how to write a plumbing resume that does that.",
    tips: [
      { title: "Lead with license and state", body: "Journeyman or master plumber, license status, and state go right under your name. Unlicensed helpers should state apprenticeship status honestly instead." },
      { title: "Name your specialty", body: "Residential service, new construction, commercial, gas fitting, hydronics, septic — each is practically a different trade. Name yours so the right work finds you." },
      { title: "Show code and troubleshooting depth", body: "Code compliance, diagnostics, leak detection, remodel rough-ins — describe the work that proves you solve problems, not just install pipe." },
      { title: "Mention on-call and customer work", body: "Emergency service experience and homeowner-facing work matter enormously in residential plumbing. Reliability and communication are hiring criteria, not extras." }
    ],
    templateStyles: [
      { name: "Workshop", slug: "workshop", why: "A craft sidebar in warm amber — tools, skills, process — built for the trades." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like trade hiring." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for larger contractor portals." }
    ],
    atsNotes: "Larger plumbing companies and facilities run ATS portals parsing for license status and specialty keywords; small shops and homeowners read directly. Plain text, single column, license up top — readable everywhere. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should helpers and apprentices apply with a resume?", a: "Yes — list your apprenticeship, hours, and the work you have performed. Eagerness plus documented hours gets callbacks." },
      { q: "Do I list tools I own?", a: "Briefly, if substantial — a well-equipped service plumber is more hireable. One line in skills is enough." },
      { q: "How do I show reliability?", a: "Steady employment history, on-call experience, and long tenures. In the trades, showing up is half the job." }
    ]
  },
  {
    slug: "hvac-technician",
    jobTitle: "HVAC Technician",
    metaTitle: "HVAC Technician Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free HVAC technician resume template with trade-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "HVAC hiring is certification-first: EPA 608, then your systems, then your diagnostic skill. Contractors need techs who can troubleshoot under pressure in someone's home or on a commercial roof. Here is how to write an HVAC resume that proves you can.",
    tips: [
      { title: "Put EPA 608 certification at the top", body: "Universal EPA 608 certification is legally required to handle refrigerants — it belongs right under your name. It is the first filter for HVAC postings." },
      { title: "Name your systems", body: "Residential split systems, heat pumps, commercial RTUs, chillers, refrigeration — state what you install and service. System range determines which contractors call." },
      { title: "Show diagnostic skill", body: "Troubleshooting electrical and refrigerant issues, combustion analysis, airflow diagnostics — describe the problems you solve. Diagnostics separate technicians from installers." },
      { title: "List NATE and manufacturer training", body: "NATE certification and factory training (Carrier, Trane, Lennox) carry real weight. List them with your other credentials where filters find them." }
    ],
    templateStyles: [
      { name: "Workshop", slug: "workshop", why: "A craft sidebar in warm amber — tools, skills, process — built for the trades." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like trade hiring." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean and professional." }
    ],
    atsNotes: "HVAC companies large and small parse or skim for EPA 608 status and system keywords. Keep certifications as plain text in a single column — never in badge images — and use standard headings. Verify the parser's view with Cvyon's free ATS grader.",
    faqs: [
      { q: "Is EPA 608 really required?", a: "Yes, to handle refrigerants — which is most HVAC work. Type I, II, III, or Universal: list exactly what you hold." },
      { q: "Installer vs service tech — different resumes?", a: "Lead with the relevant experience for the posting. Many techs do both; reorder sections to match the job." },
      { q: "Should I mention sales experience?", a: "Briefly — residential companies value techs who can explain replacement options honestly. One line is enough." }
    ]
  },
  {
    slug: "carpenter",
    jobTitle: "Carpenter",
    metaTitle: "Carpenter Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free carpenter resume template with trade-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Carpenter hiring is show-me hiring: your specialties, your tools, your eye. Contractors want to know if you frame, finish, or build cabinets — and whether you can read a print. Here is how to write a carpentry resume that reads as skilled hands.",
    tips: [
      { title: "Name your carpentry type first", body: "Rough framing, finish carpentry, cabinetry, remodeling, formwork — each is a different craft. State yours plainly so the right contractors call." },
      { title: "Show blueprint and layout skill", body: "Reading prints, laying out from plans, building to spec — these separate carpenters from laborers. Name the project types you have built from drawings." },
      { title: "List tools and materials honestly", body: "Your kit and the materials you work — hardwoods, trim profiles, engineered lumber — tell a contractor what you can do on day one. Be specific and truthful." },
      { title: "Point to finished work", body: "Photos of finished projects, a simple portfolio link, or references from GCs — visible proof of craft carries enormous weight in carpentry hiring." }
    ],
    templateStyles: [
      { name: "Workshop", slug: "workshop", why: "A craft sidebar in warm amber — tools, skills, process — built for the trades." },
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — lets photos of finished work take center stage." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like trade hiring." }
    ],
    atsNotes: "Carpentry hiring splits between contractor portals with basic parsing and direct human reads. Plain text, single column, specialties up top — and keep any portfolio link as full plain-text URL so both humans and parsers can follow it. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I include photos of my work?", a: "Yes — via a portfolio link, not embedded in the resume. Keep the resume itself clean text; link out to the proof." },
      { q: "How do I show years of informal experience?", a: "List it honestly with dates and project types. “Self-employed finish carpenter, 2019–present” is a real work history." },
      { q: "Do carpenters need certifications?", a: "Union journeyman status or OSHA training helps where relevant — list what you hold. Skill and proof matter most." }
    ]
  },
  {
    slug: "welder",
    jobTitle: "Welder",
    metaTitle: "Welder Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free welder resume template with trade-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Welder hiring is process-specific: MIG, TIG, Stick — and the positions and materials you can run them on. Shops and contractors filter on exactly these details. Here is how to write a welding resume that passes the filter and gets the test.",
    tips: [
      { title: "Name your processes and positions", body: "GMAW/MIG, GTAW/TIG, SMAW/Stick, FCAW — plus positions (1G–6G) and materials (carbon steel, stainless, aluminum). This is the core vocabulary of welder hiring; be exact." },
      { title: "List certifications prominently", body: "AWS D1.1, ASME Section IX, or employer-specific certs go right under your name. Certified welders clear filters that others do not." },
      { title: "Describe your shop and field work", body: "Structural, pipe, fabrication shop, field erection, maintenance — each values different experience. Name your settings and the work you performed in each." },
      { title: "Show safety and quality fluency", body: "WPS/PQR familiarity, x-ray-quality work, OSHA training — these reassure a shop you will pass inspection. One or two lines carry real weight." }
    ],
    templateStyles: [
      { name: "Workshop", slug: "workshop", why: "A craft sidebar in warm amber — tools, skills, process — built for the trades." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for industrial hiring portals." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs — good for certifications and specialties." }
    ],
    atsNotes: "Industrial employers and staffing firms parse welder resumes for process acronyms, certifications, and position codes — matched literally. Keep every term as plain text in a single column, spell out acronyms at least once, and avoid graphics. Cvyon's free ATS grader will confirm the parser reads your processes.",
    faqs: [
      { q: "Which welding process should I lead with?", a: "The one the posting asks for. Tailor the order — TIG for precision shops, MIG/Stick for structural — to match the job." },
      { q: "Do I need AWS certification?", a: "It opens doors, especially for structural and pipe work. List what you hold; employer tests still decide, but certs get you to the test." },
      { q: "Should I mention travel or per-diem willingness?", a: "Yes, briefly — many welding jobs involve travel. Stating availability upfront helps." }
    ]
  }
,
  {
    slug: "truck-driver",
    jobTitle: "Truck Driver",
    metaTitle: "Truck Driver Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free truck driver resume template with CDL-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Truck driver hiring is credential-and-record hiring: CDL class, endorsements, and a clean driving history. Carriers scan for these three, then for your equipment and route experience. Here is how to write a driver resume that gets dispatched.",
    tips: [
      { title: "Put CDL class and endorsements in the header", body: "Class A or B, plus endorsements (HazMat, Tanker, Doubles/Triples) go right under your name. This is the first filter for every driving posting — make it unmissable." },
      { title: "Name your equipment", body: "Dry van, reefer, flatbed, tanker — state what you have driven. Equipment experience determines which carriers and loads fit you." },
      { title: "State your driving record plainly", body: "Clean MVR, accident-free years from your real record — say it directly. Safety history is the currency of driver hiring, so be honest and specific." },
      { title: "Describe your route type", body: "OTR, regional, dedicated, local — each is a different lifestyle and pay structure. Naming yours helps carriers match you to the right seat." }
    ],
    templateStyles: [
      { name: "Navigator", slug: "navigator", why: "A route-map resume for logistics professionals — the natural fit for drivers." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like driver hiring." },
      { name: "Blank", slug: "blank", why: "No decoration, bold type and tight lines — very ATS-safe for carrier portals and hiring kiosks." }
    ],
    atsNotes: "Carriers hire at volume through ATS portals and hiring kiosks that parse for CDL class, endorsements, and safety keywords. Keep credentials as plain text in a single column — kiosk applications especially punish fancy layouts. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list my CDL number?", a: "State, class, and endorsements are enough for the resume. Provide the number on the application itself." },
      { q: "How do new CDL holders show experience?", a: "List your training program, hours, and any supervised driving. Many carriers hire new grads — documented training is the proof." },
      { q: "Do I mention accidents or violations?", a: "Be honest on applications where asked. On the resume, state your clean record if it is clean; do not volunteer violations there." }
    ]
  },
  {
    slug: "warehouse-worker",
    jobTitle: "Warehouse Worker",
    metaTitle: "Warehouse Worker Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free warehouse worker resume template with logistics tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Warehouse hiring is about capability and reliability: what equipment you run, what systems you know, and whether you show up for every shift. Hiring managers scan for these fast. Here is how to write a warehouse resume that gets you on the floor.",
    tips: [
      { title: "List equipment and certifications first", body: "Forklift certification, pallet jack, order picker, RF scanners — name what you operate. Equipment credentials are the primary filter for warehouse postings." },
      { title: "Name your WMS and processes", body: "Warehouse management systems, pick/pack/ship, receiving, inventory counts — describe the workflow you know. Facilities hire for their process." },
      { title: "Show shift reliability", body: "Consistent attendance, overtime availability, shift flexibility — state it plainly. In warehouse hiring, reliability is a headline qualification." },
      { title: "Mention safety record honestly", body: "OSHA training, safety committee work, incident-free tenure from your real record — safety matters enormously in warehouses. Be specific and truthful." }
    ],
    templateStyles: [
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like warehouse hiring." },
      { name: "Navigator", slug: "navigator", why: "A route-map resume for logistics professionals — fits the supply-chain world." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean for high-volume hiring." }
    ],
    atsNotes: "Warehouses and staffing firms hire at high volume through ATS portals and kiosks parsing for equipment, certifications, and shift keywords. Keep everything as plain text in a single column — simple layouts parse best on every device. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "Is forklift certification required?", a: "Many postings require or strongly prefer it. List your certification and type; OSHA-compliant training is the standard." },
      { q: "Should I list temp or seasonal warehouse work?", a: "Yes — it is real experience. List the agency or facility, dates, and duties. Volume of experience counts here." },
      { q: "How long should a warehouse resume be?", a: "One page. Equipment, experience, and reliability fit comfortably without filler." }
    ]
  },
  {
    slug: "delivery-driver",
    jobTitle: "Delivery Driver",
    metaTitle: "Delivery Driver Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free delivery driver resume template with route-driver tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Delivery driver hiring centers on three things: a valid license, a clean record, and reliability under route pressure. Whether it is parcels, food, or freight, hiring managers want to know you can run the route. Here is how to write that resume.",
    tips: [
      { title: "State license and record up top", body: "Valid driver's license, CDL if you hold one, and clean driving record go right under your name. These are the first filters — make them immediate." },
      { title: "Describe your route experience", body: "Stops per day, route types, time-sensitive deliveries — use your real experience. “120 stops daily across metro routes” calibrates you instantly." },
      { title: "Show customer-facing care", body: "Proof of delivery, customer interactions, handling exceptions — describe the service half of the job. Delivery is customer-facing work, not just driving." },
      { title: "Name vehicles and tools", body: "Box trucks, vans, step vans; route apps, GPS, handheld scanners — exact names. Employers hire for their fleet and their tech." }
    ],
    templateStyles: [
      { name: "Navigator", slug: "navigator", why: "A route-map resume for logistics professionals — built for drivers." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward and human." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — clean for high-volume hiring." }
    ],
    atsNotes: "Delivery companies hire at volume through ATS portals and mobile-first applications parsing for license status and route keywords. Keep everything as plain text in a single column — many applicants apply from phones, so simplicity wins. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do I need a CDL for delivery driver roles?", a: "Most last-mile roles need only a standard license; larger vehicles require a CDL. Match your resume to the posting's requirement." },
      { q: "Should gig delivery experience count?", a: "Yes — list the platform, timeframe, and volume honestly. It proves route discipline and customer handling." },
      { q: "How do I show reliability?", a: "On-time record, attendance, and consistent tenure. In delivery hiring, dependability is the headline trait." }
    ]
  },
  {
    slug: "restaurant-server",
    jobTitle: "Restaurant Server",
    metaTitle: "Restaurant Server Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free restaurant server resume template with hospitality tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Server hiring is about floor craft: service style, volume, and the guest experience you create. Hiring managers want to picture you on their floor during a Friday rush. Here is how to write a server resume that does that.",
    tips: [
      { title: "Name your service style and volume", body: "Fine dining, casual, high-volume, banquets — each values different skills. Describe the setting and pace honestly so the right restaurants call." },
      { title: "List your POS and systems literally", body: "Toast, Square, Aloha, Micros — exact names. Restaurants hire for their system, and these are the keywords managers scan for." },
      { title: "Show the money skills", body: "Upselling, wine and cocktail knowledge, handling large parties — describe what increased the check or the experience. Servers are revenue, not just labor." },
      { title: "Prove grace under pressure", body: "High-volume shifts, guest recovery, multitasking across a full section — describe the rush work. Composure during service is the core skill." }
    ],
    templateStyles: [
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like hospitality hiring." },
      { name: "Maitre", slug: "maitre", why: "Fine-dining refinement for hospitality professionals — ideal for upscale service roles." },
      { name: "Standard", slug: "standard", why: "The canonical resume, perfected — a safe default everywhere." }
    ],
    atsNotes: "Restaurant groups with online portals parse for POS names and service keywords; independent restaurants read resumes directly. Plain text, single column, systems up top — readable by both. Larger hospitality groups' parsers punish graphics, so keep it clean. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I list food handler or alcohol certifications?", a: "Yes — food handler cards and TIPS or equivalent alcohol training are often required. List them with their validity." },
      { q: "How do I show fine-dining experience?", a: "Name the restaurant type, service style (coursed tasting menus, wine service), and table count. Specificity signals the level." },
      { q: "Do I need a summary?", a: "One line: service style, years, and what you are known for. Then let experience carry it." }
    ]
  },
  {
    slug: "bartender",
    jobTitle: "Bartender",
    metaTitle: "Bartender Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free bartender resume template with bar-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Bartender hiring splits two ways: craft cocktail programs and high-volume service — and they want different resumes. Hiring managers want to know your speed, your knowledge, and your crowd control. Here is how to write a bartender resume for the bar you want.",
    tips: [
      { title: "Name your bar type", body: "Craft cocktail, high-volume nightclub, restaurant bar, hotel, dive — each values different skills. State yours so the right bars call." },
      { title: "Show drink knowledge specifically", body: "Classic cocktails, spirits categories, wine and beer programs you ran — name what you know. “Built a seasonal cocktail menu” beats “mixology skills”." },
      { title: "Prove speed and volume", body: "Drinks per shift, tickets handled, solo bar shifts — describe your pace honestly. Volume tolerance is the core hiring criterion for busy bars." },
      { title: "List certifications and POS literally", body: "TIPS or state alcohol certification, food handler card; Toast, Square, Aloha — exact names. These are filtered and keyword-matched." }
    ],
    templateStyles: [
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward, like bar hiring." },
      { name: "Maitre", slug: "maitre", why: "Fine-dining refinement for hospitality professionals — suits craft cocktail programs." },
      { name: "Pivot", slug: "pivot", why: "Skills-first for career changers — useful if you are moving between bar types or into hospitality." }
    ],
    atsNotes: "Larger bar groups and hotels parse for certification and POS keywords; independent bars read directly. Keep certifications and systems as plain text in a single column — clean enough for a manager reading between shifts. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Do I need bartending school on my resume?", a: "Only if it is your main credential. Real bar experience outweighs school every time — lead with where you have worked." },
      { q: "Should I list flair or competition wins?", a: "Briefly, if relevant to the venue. Craft bars care about menus; clubs care about speed — tailor accordingly." },
      { q: "How do I show I can handle a busy bar?", a: "Describe volume honestly: solo shifts, ticket counts, peak nights. Specifics prove composure." }
    ]
  },
  {
    slug: "chef",
    jobTitle: "Chef",
    metaTitle: "Chef Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free chef resume template with culinary-career tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Chef hiring is brigade hiring: cuisine, station leadership, and the kitchens you have run. Executive chefs and owners want to know your food, your team, and your numbers. Here is how to write a chef resume that earns the tasting.",
    tips: [
      { title: "Lead with cuisine and role", body: "Executive chef, sous chef, chef de partie — plus cuisine: Italian, farm-to-table, sushi, French. Title and cuisine are the first filter; make them immediate." },
      { title: "Describe kitchen scope honestly", body: "Covers per night, brigade size, stations overseen — use your real figures. “Ran a 10-person line doing 300 covers” tells the whole story." },
      { title: "Show menu and food-cost ownership", body: "Menus you wrote, specials you ran, food-cost control you managed — describe the creative and business halves. Chefs are hired for both." },
      { title: "List sanitation credentials", body: "ServSafe or equivalent certification goes with your credentials. It is often required and always reassuring — do not leave it off." }
    ],
    templateStyles: [
      { name: "Maitre", slug: "maitre", why: "Fine-dining refinement for hospitality professionals — the right register for culinary careers." },
      { name: "Frontline", slug: "frontline", why: "Bold and direct for service professionals — straightforward kitchen energy." },
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — lets signature dishes and menus take center stage." }
    ],
    atsNotes: "Restaurant groups parse for title, cuisine, and certification keywords; independent owners read directly. Keep credentials and cuisine as plain text in a single column — and link any portfolio of plated work as a full plain-text URL. Check with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should culinary school go at the top?", a: "For recent grads, yes — with externships detailed. For experienced chefs, experience leads and education follows." },
      { q: "How do I show food-cost skill?", a: "Describe what you managed honestly — inventory, waste reduction, menu engineering — without inventing figures." },
      { q: "Do chefs need a portfolio?", a: "Photos of plated work help enormously. Link them as plain text; keep the resume itself clean." }
    ]
  },
  {
    slug: "hotel-manager",
    jobTitle: "Hotel Manager",
    metaTitle: "Hotel Manager Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free hotel manager resume template with hospitality-leadership tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Hotel manager hiring is property hiring: the size and type of hotel you ran, the departments you oversaw, the guest experience you protected. Owners and GMs want scope and composure. Here is how to write a hotel manager resume that checks in strong.",
    tips: [
      { title: "State property scope honestly", body: "Room count, property type (boutique, resort, extended-stay), star level — use your real scope. “GM of a 120-room select-service property” calibrates you instantly." },
      { title: "Name departments you oversaw", body: "Front office, housekeeping, F&B, maintenance, sales — list what reported to you. Departmental range is how hotel managers are compared." },
      { title: "Show guest-satisfaction ownership", body: "Review scores, guest recovery, service standards you implemented — describe from your real record. The guest experience is the product." },
      { title: "List your PMS literally", body: "Opera, Cloudbeds, Mews — exact names. Hotels hire for their system, and these are keyword-matched." }
    ],
    templateStyles: [
      { name: "Maitre", slug: "maitre", why: "Fine-dining refinement for hospitality professionals — polished, like good hotel leadership." },
      { name: "Gateway", slug: "gateway", why: "A bold boxed summary opening the page — strong positioning for a management role." },
      { name: "Merit", slug: "merit", why: "Achievement-led bullets with bold lead verbs turn operations results into scannable proof." }
    ],
    atsNotes: "Hotel groups run corporate ATS portals matching on PMS names, property types, and management keywords. Keep everything as plain text in a single column with standard headings — committee hiring still involves printed resumes, so clean layout matters. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I mention revenue or ADR?", a: "Yes, using your real scope — revenue responsibility is standard in hotel management hiring. Never inflate figures." },
      { q: "Front desk to manager — how do I show the climb?", a: "List the progression with dates and what each step added: shifts led, departments learned, scope grown. The climb itself is the story." },
      { q: "Do I need hospitality-specific certifications?", a: "CHA and similar credentials help where held — list them. Operational track record matters most." }
    ]
  },
  {
    slug: "graphic-designer",
    jobTitle: "Graphic Designer",
    metaTitle: "Graphic Designer Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free graphic designer resume template with portfolio-first tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "A graphic designer's resume is the trailer; the portfolio is the film. But the trailer still has to survive the ATS and explain your range in words. Hiring managers want tools, specialties, and proof you design for outcomes. Here is how to write one that complements the portfolio.",
    tips: [
      { title: "Make the portfolio link unmissable", body: "Put your portfolio URL near the top as plain text. Creative directors click before reading — and keep it a full, clean URL so parsers and humans both follow it." },
      { title: "Name your tools and specialties literally", body: "Adobe Creative Suite, Figma; brand identity, print, packaging, digital, motion — exact terms. Postings keyword-match on both tools and disciplines." },
      { title: "Describe the brief, not just the deliverable", body: "“Rebranded a regional retailer across 40 locations” beats “designed logos”. Context — client, constraints, scale — proves professional-grade work." },
      { title: "Show design for outcomes", body: "Packaging that lifted shelf presence, campaigns with results, identities that launched — connect design to what it did. Outcome-aware designers get hired faster." }
    ],
    templateStyles: [
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — the resume equivalent of letting the work speak." },
      { name: "Pixel", slug: "pixel", why: "Card-based experience with a skill-meter rail — a design-forward layout with clean structure." },
      { name: "Marketing", slug: "marketing", why: "A marketer's resume with brand energy — suits designers working in brand and campaign worlds." }
    ],
    atsNotes: "Design roles flow through textual hiring pipelines despite visual work: parsers match on tool and discipline keywords, so keep them as plain text in a single column. Never embed your only copy of key skills inside an image, and keep the resume itself restrained — the portfolio carries the visuals. Confirm with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should my resume be a design piece?", a: "Restrained and well-typeset — that itself demonstrates judgment. Save the fireworks for the portfolio." },
      { q: "How many portfolio pieces should I show?", a: "Curate ruthlessly: your best 8–12 pieces. On the resume, link the portfolio once rather than listing projects." },
      { q: "Freelance design work — how do I list it?", a: "Like employment: client or “Freelance”, dates, project types with one-line outcomes. It counts fully." }
    ]
  },
  {
    slug: "content-writer",
    jobTitle: "Content Writer",
    metaTitle: "Content Writer Resume Template — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free content writer resume template with clips-first tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Content writers are hired on clips: the proof is in the published work. Hiring managers want your niches, your range, and links they can click right now. Here is how to write a writer resume that gets read — and clicked.",
    tips: [
      { title: "Link clips like your career depends on it", body: "Portfolio or 3–5 best published links near the top as plain text. Editors click before they read; dead or missing links end the conversation." },
      { title: "Name your niches and formats", body: "SaaS blogs, healthcare, finance; long-form guides, landing pages, scripts, newsletters — exact terms. Writers are hired for specific beats, so claim yours." },
      { title: "Show SEO fluency without overclaiming", body: "Brief-driven writing, keyword research basics, CMS publishing (WordPress, Webflow) — name what you actually do. Honest capability beats “SEO expert”." },
      { title: "Prove range and reliability", body: "Volume handled, deadlines met, editors worked with — describe the professional half. Anyone can write; fewer deliver clean copy on schedule." }
    ],
    templateStyles: [
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — puts your clips at the center where a writer resume needs them." },
      { name: "Clarity", slug: "clarity", why: "High-contrast black-on-white with total legibility — a writer's layout should read beautifully." },
      { name: "Brief", slug: "brief", why: "An executive brief with a boxed summary — neat and editorial." }
    ],
    atsNotes: "Content roles run through standard ATS portals matching on niche, format, and tool keywords. Keep clips as full plain-text URLs in a single column — shortened or embedded links can break in parsing — and use standard headings. Verify with Cvyon's free ATS grader.",
    faqs: [
      { q: "What if my best work is ghostwritten?", a: "Describe it without breaking confidentiality: “ghostwrote executive thought leadership for a fintech CEO”. Ask permission before linking anything." },
      { q: "Should I include a writing sample in the resume?", a: "No — link out. The resume stays tight; the portfolio carries the samples." },
      { q: "How do I show niche expertise?", a: "Lead with the niche: summary, clips, and experience ordered around it. One strong beat beats five shallow ones." }
    ]
  },
  {
    slug: "social-media-manager",
    jobTitle: "Social Media Manager",
    metaTitle: "Social Media Manager Resume — Free & ATS-Friendly | Cvyon",
    metaDescription: "Free social media manager resume template with platform-growth tips, ATS notes and FAQs. Build and download in minutes — no sign-up.",
    intro: "Social media managers are hired on accounts: the platforms you ran, the audiences you grew, the content engines you operated. Hiring managers want handles, tools, and honest growth stories. Here is how to write a social resume that proves you can grow something.",
    tips: [
      { title: "Name platforms and accounts from your record", body: "TikTok, Instagram, YouTube, X, LinkedIn — plus the accounts or brands you actually ran. Platform fluency is keyword-matched, and real accounts are the proof." },
      { title: "Describe growth honestly", body: "Follower growth, engagement lifts, viral posts — use your real numbers and timeframes. “Grew TikTok from 2k to 40k in eight months” is credible; vague “explosive growth” is not." },
      { title: "Show the content engine", body: "Content calendars, posting cadence, shooting and editing workflow, scheduling tools (Buffer, Hootsuite, native schedulers) — describe the operation behind the posts." },
      { title: "Prove community and reporting skill", body: "Comment management, DMs, crisis handling, monthly reporting — the unglamorous halves that keep accounts healthy. Name them plainly." }
    ],
    templateStyles: [
      { name: "Marketing", slug: "marketing", why: "A marketer's resume with brand energy — the natural voice for social roles." },
      { name: "Showcase", slug: "showcase", why: "Portfolio-led, work first — lets standout accounts and campaigns lead." },
      { name: "Pixel", slug: "pixel", why: "Card-based experience with a skill-meter rail — a modern layout for a modern role." }
    ],
    atsNotes: "Social roles run through standard ATS portals matching on platform names, tools, and content keywords. Keep every platform and tool as plain text in a single column — and link accounts as full plain-text URLs. Verify parseability with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should I link my personal accounts?", a: "Link professional or brand accounts you ran. Personal accounts only if they demonstrate the skill — keep the resume professional." },
      { q: "How do I show results without revealing client data?", a: "Use percentages and indexed growth from your real work. “Grew engagement ~3x in six months” is honest without naming figures." },
      { q: "Do I need video editing skills listed?", a: "If you edit, name the tools (CapCut, Premiere, native editors). Short-form video is central to most social roles now." }
    ]
  },
  {
    slug: "tutor",
    jobTitle: "Tutor",
    metaTitle: "Tutoring Resume Example — Free Template & Writing Guide | Cvyon",
    metaDescription: "Free tutoring resume example with tutor-specific writing tips, ATS guidance and FAQs. Build and download your tutor resume in minutes — no sign-up.",
    intro: "Tutoring resumes are read by two audiences: parents and students who want to trust you, and agencies or learning centers that want proof you deliver results. Both look for the same things — your subjects, your students' progress, and a presentation that feels competent and approachable. Here is how to write a tutoring resume that books clients and passes agency screens.",
    tips: [
      { title: "Lead with subjects and levels, not adjectives", body: "“Algebra I–II, SAT Math (700+ scorers), grades 6–12” tells a parent everything in one line. Name every subject and the exact levels you teach — this is the first filter for tutoring work." },
      { title: "Show student progress with real numbers", body: "Grade improvements, score gains, and exam pass rates from your actual students are the strongest currency a tutor has. “Raised 12 students an average of one full letter grade in a semester” beats any paragraph about passion." },
      { title: "Name your formats", body: "One-on-one, small group, online, in-home — say which you do. Agencies and platforms match tutors to formats, and parents search by them. List your tools too (Zoom, whiteboard apps, shared docs)." },
      { title: "Credentials go near the top", body: "Degrees, teaching certificates, and test scores of your own (your SAT/GRE if strong) belong high on the page. For parents choosing between strangers, credentials are the trust shortcut." }
    ],
    templateStyles: [
      { name: "Tutor", slug: "tutor", why: "Made for this exact role — clear, encouraging, and structured for subjects and results." },
      { name: "Pedagogue", slug: "pedagogue", why: "A warm, approachable educator's design that builds parent trust at a glance." },
      { name: "ParsePerfect", slug: "parseperfect", why: "Plain structure and real text that agency portals and ATS parsers read reliably." }
    ],
    atsNotes: "Tutoring agencies and platforms run resumes through parsers that match on subject names, grade levels, and credential keywords. Keep subjects and levels as plain text in a single column with standard headings — never inside graphics or text boxes. Run the finished resume through Cvyon's free ATS grader before you submit.",
    faqs: [
      { q: "Should a tutoring resume be one page?", a: "Yes for most tutors. One page forces your subjects, results, and credentials to the front — everything a parent or agency needs. Add a second page only with many years of agency or center experience." },
      { q: "How do I list private clients without naming them?", a: "Describe them anonymously: “Private SAT math tutor, 15 students, grades 10–12.” Never name minors or families — describe the work and the outcomes." },
      { q: "Do online tutors need a different resume?", a: "Mostly the same, with your online setup explicit: platforms used, whiteboard and scheduling tools, and comfort with remote sessions. Agencies hiring remote tutors screen for this." }
    ]
  },
  {
    slug: "legal-assistant",
    jobTitle: "Legal Assistant",
    metaTitle: "Legal Assistant Resume Template — Free & Formal | Cvyon",
    metaDescription: "Free formal legal assistant resume templates for legal assistants, paralegals and attorneys. ATS-friendly, no sign-up, download in minutes.",
    intro: "Legal hiring is formal by tradition and precise by necessity. Partners and office managers scan for your practice areas, the software you run, and evidence you handle confidential work carefully. A legal assistant resume should look conservative, read fast, and contain zero errors. Here is how to write one.",
    tips: [
      { title: "Name your practice areas explicitly", body: "Litigation, corporate, family law, real estate — state them plainly. Firms hire for the areas they practice, and both partners and parsers match on these terms." },
      { title: "List your legal software by name", body: "Document management, e-filing, billing, and case management systems — name the exact products you use. “Legal tech stack” vagueness loses to a literal list every time." },
      { title: "Show precision through the document itself", body: "In legal hiring, your resume is a writing sample. Consistent formatting, perfect spelling, and aligned dates signal the detail-orientation the job demands. Proofread it twice, then once more." },
      { title: "Handle confidentiality visibly", body: "Describe sensitive work without breaching it: “Managed discovery documents for active litigation” says everything a firm needs without naming a client or matter. Discretion demonstrated is discretion trusted." }
    ],
    templateStyles: [
      { name: "Barrister", slug: "barrister", why: "A formal, traditional design with the conservative voice legal hiring expects." },
      { name: "Counsel", slug: "counsel", why: "Understated and precise — reads like it belongs in a law office." },
      { name: "Brief", slug: "brief", why: "Crisp single-column structure that keeps every detail scannable and parser-safe." }
    ],
    atsNotes: "Law firms and legal departments run applicant systems that match on practice-area terms, software names, and credentials. Keep everything as plain text in a single column with standard headings — Work Experience, Skills, Education. Conservative formatting is both tradition and parseability. Confirm with Cvyon's free ATS grader.",
    faqs: [
      { q: "Should legal assistant resumes include an objective?", a: "A short professional summary works better: practice areas, years, and key software in two lines. Objectives read dated; summaries read current." },
      { q: "How do I describe litigation support without naming cases?", a: "Describe the work category and scale: “Prepared trial binders and exhibit lists for multi-week civil litigation.” Firms understand the constraint — they live it." },
      { q: "Do I need a different resume for paralegal vs legal assistant roles?", a: "Mostly one resume with the emphasis shifted: paralegal applications lead with substantive legal work (research, drafting), legal assistant applications lead with office and case-management skills." }
    ]
  }
];

export function getJobTitleSeoEntry(slug: string): JobTitleSeoEntry | undefined {
  return jobTitleSeoEntries.find((e) => e.slug === slug);
}
