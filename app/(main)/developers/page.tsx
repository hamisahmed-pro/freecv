"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Terminal, Shield, Server, Database } from 'lucide-react';
import { V3Page, V3Eyebrow } from "@/components/v3/V3Chrome";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CodeBlock = ({ language, code }: { language: string, code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-[18px] border border-line bg-navy">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-xs text-[#bfc2d5]">
          <Terminal size={13} /> {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-xs font-bold text-[#bfc2d5] transition-colors hover:text-white"
        >
          {copied ? <Check size={14} className="text-teal" /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="font-mono text-sm leading-relaxed text-[#dfe1ee]">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default function DevelopersPage() {
  const [activeSection, setActiveSection] = useState('authentication');

  const curlExample = `curl -X GET "https://api.cvyon.com/v1/talent?query=software+engineer" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

  const nodeExample = `const fetchCandidates = async () => {
  const response = await fetch('https://api.cvyon.com/v1/talent?query=software+engineer', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  console.log(data);
};`;

  const pythonExample = `import requests

url = "https://api.cvyon.com/v1/talent"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
params = {
    "query": "software engineer"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`;

  const NAV = [
    { group: "Getting started", items: [
      { id: "authentication", label: "Authentication" },
      { id: "rate-limits", label: "Rate Limits" },
    ]},
    { group: "Endpoints", items: [
      { id: "search-talent", label: "Search Talent" },
      { id: "get-candidate", label: "Get Candidate" },
    ]},
  ];

  return (
    <V3Page
      pageName="developers"
      logoSub="API"
      links={[
        { href: "/", label: "Home" },
        { href: "/recruiter", label: "Recruiter Portal" },
        { href: "/support", label: "Support" },
      ]}
      cta={{ label: "Build free →", href: "/build" }}
    >
      <div className="flex gap-10">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-60 shrink-0 md:block">
          <nav className="space-y-6 rounded-[18px] border border-line bg-paper p-4 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            {NAV.map((g) => (
              <div key={g.group}>
                <h4 className="mb-2 px-3 text-[11px] font-black uppercase tracking-[0.13em] text-muted">{g.group}</h4>
                {g.items.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "block rounded-[10px] px-3 py-2 text-sm font-bold transition-colors",
                      activeSection === item.id ? "bg-lavender text-brand" : "text-muted hover:bg-cream hover:text-navy"
                    )}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 max-w-[760px] flex-1">
          <div className="mb-12">
            <V3Eyebrow>Developer docs</V3Eyebrow>
            <h1 className="text-[44px] font-extrabold leading-[1.04] tracking-[-0.045em] text-navy">
              Cvyon B2B API
            </h1>
            <p className="mt-5 max-w-[650px] text-[17px] leading-relaxed text-muted">
              Integrate Cvyon&apos;s highly-structured talent pool directly into your ATS, CRM, or custom internal tools. Our REST API provides programmatic access to candidates who have opted in to be contacted by recruiters.
            </p>
          </div>

          <div id="authentication" className="mb-14 scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy">
              <Shield size={22} className="text-brand" /> Authentication
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Authenticate your API requests by including your secret API key in the <code className="rounded bg-lavender px-1.5 py-0.5 font-mono text-sm text-brand">Authorization</code> HTTP header.
            </p>
            <div className="mt-4 rounded-[14px] border border-line bg-lavender/50 p-4 text-sm font-medium text-navy">
              API keys require an active recruiter access pass (30 days from purchase). Keys are managed in the Recruiter Portal.
            </div>
            <CodeBlock language="HTTP" code="Authorization: Bearer YOUR_API_KEY" />
          </div>

          <div id="rate-limits" className="mb-14 scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy">
              <Server size={22} className="text-brand" /> Rate Limits
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              To ensure platform stability, API requests are rate-limited based on your access tier.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-muted">
              <li><strong className="text-navy">Pro Tier:</strong> 100 requests per minute, up to 10,000 requests per day.</li>
            </ul>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              If you exceed the rate limit, the API will return a <code className="rounded bg-lavender px-1.5 py-0.5 font-mono text-sm text-brand">429 Too Many Requests</code> HTTP status code.
            </p>
          </div>

          <div id="search-talent" className="mb-14 scroll-mt-24">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy">
              <Database size={22} className="text-brand" /> Search Talent
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Search for candidates across the Cvyon database. You can filter by keywords, job titles, or location.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-teal">GET</span>
              <code className="font-mono text-[15px] text-navy">/v1/talent</code>
            </div>

            <h3 className="mb-3 mt-8 text-lg font-extrabold text-navy">Query parameters</h3>
            <div className="overflow-x-auto rounded-[14px] border border-line bg-paper">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-line bg-cream text-muted">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em]">Parameter</th>
                    <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em]">Type</th>
                    <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.13em]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-navy/80">
                  <tr>
                    <td className="px-4 py-3 font-mono text-brand">query</td>
                    <td className="px-4 py-3">string</td>
                    <td className="px-4 py-3">Search term (e.g. &ldquo;software engineer&rdquo;, &ldquo;marketing&rdquo;).</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-brand">country</td>
                    <td className="px-4 py-3">string</td>
                    <td className="px-4 py-3">Filter by candidate location.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-brand">limit</td>
                    <td className="px-4 py-3">integer</td>
                    <td className="px-4 py-3">Max results to return (default 20, max 100).</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mb-3 mt-8 text-lg font-extrabold text-navy">Examples</h3>

            <div className="mb-6">
              <h4 className="mb-1 text-[11px] font-black uppercase tracking-[0.13em] text-muted">cURL</h4>
              <CodeBlock language="bash" code={curlExample} />
            </div>

            <div className="mb-6">
              <h4 className="mb-1 text-[11px] font-black uppercase tracking-[0.13em] text-muted">Node.js</h4>
              <CodeBlock language="javascript" code={nodeExample} />
            </div>

            <div className="mb-6">
              <h4 className="mb-1 text-[11px] font-black uppercase tracking-[0.13em] text-muted">Python</h4>
              <CodeBlock language="python" code={pythonExample} />
            </div>

            <h3 className="mb-3 mt-8 text-lg font-extrabold text-navy">Response</h3>
            <CodeBlock language="json" code={`{
  "success": true,
  "data": [
    {
      "id": "cnd_123456789",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "target_role": "Senior Software Engineer",
      "country": "United States",
      "skills": ["React", "TypeScript", "Node.js"],
      "resume_url": "https://cvyon.com/resume/jane-doe"
    }
  ],
  "meta": {
    "total_count": 145,
    "has_more": true
  }
}`} />

            <div id="get-candidate" className="mt-14 scroll-mt-24">
              <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-navy">
                <Database size={22} className="text-brand" /> Get Candidate
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Retrieve a single candidate profile by ID. Candidate contact details are only returned after you have unlocked the profile with a credit.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="rounded-full bg-teal/15 px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-teal">GET</span>
                <code className="font-mono text-[15px] text-navy">/v1/talent/:id</code>
              </div>
              <CodeBlock language="bash" code={`curl -X GET "https://api.cvyon.com/v1/talent/cnd_123456789" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`} />
            </div>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
