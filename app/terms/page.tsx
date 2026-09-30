import type { Metadata } from 'next';
import Link from 'next/link';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: 'Terms of Service — Cvyon',
  description: 'The terms governing your use of Cvyon.',
  alternates: { canonical: 'https://cvyon.com/terms' },
};

export default function TermsOfService() {
  return (
    <div className={`cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden py-20 px-6 ${body.className}`}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
        .cv-riso .riso-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 3px solid var(--ink); background-color: var(--ink); color: #f6f5ef; padding: 0.75rem 1.5rem; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 7px 7px 0 var(--ink); transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .cv-riso .riso-btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .cv-riso .riso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-btn-ghost { background-color: transparent; color: var(--ink); }
        .cv-riso .riso-card { border: 3px solid var(--ink); background-color: #ffffff; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-input { width: 100%; border: 3px solid var(--ink); background-color: #ffffff; padding: 0.75rem 1rem; font-family: var(--fm); font-size: 0.875rem; color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transition: all 0.2s; outline: none; }
        .cv-riso .riso-input:focus { box-shadow: none; transform: translate(2px, 2px); border-color: var(--verm); }
        .cv-riso .riso-label { display: block; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; color: var(--ink); }
        .cv-riso .riso-chip { display: inline-flex; align-items: center; gap: 0.25rem; border: 2px solid var(--ink); padding: 0.25rem 0.5rem; font-family: var(--fm); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; color: var(--ink); background: #ffffff; }
        .cv-riso .legal-prose h2 { font-family: var(--fh); font-size: 1.5rem; font-weight: 800; margin: 1.75em 0 0.75em; text-transform: uppercase; letter-spacing: -0.01em; }
        .cv-riso .legal-prose p { margin: 1em 0; color: #151a46; }
        .cv-riso .legal-prose ul { list-style-type: disc; padding-left: 1.5em; margin: 1em 0; }
        .cv-riso .legal-prose li { margin: 0.25em 0; }
        .cv-riso .legal-prose a { color: #5548f5; text-decoration: underline; }
        .cv-riso .legal-prose a:hover { color: #151a46; }
      `}</style>

      <div className="max-w-3xl mx-auto riso-card p-10">
        <h1 className="fd text-4xl tracking-tight mb-8">Terms of Service</h1>

        <div className="legal-prose">
          <p className="fm text-xs font-bold uppercase tracking-widest text-[#151a46]/70">Last Updated: September 2026</p>

          <h2>1. The Service</h2>
          <p>
            Cvyon (&ldquo;we&rdquo;, &ldquo;us&rdquo;) provides a free online resume builder, cover-letter
            builder, ATS grader, and related career tools at cvyon.com (the
            &ldquo;Service&rdquo;). The core resume builder is free to use and does not
            require an account. By accessing or using the Service, you agree to
            these Terms.
          </p>

          <h2>2. Your Content</h2>
          <p>
            You retain full ownership of the resumes, cover letters, and other
            materials you create with Cvyon (&ldquo;Your Content&rdquo;). By using the
            Service you grant us a limited, worldwide license to store, process,
            and display Your Content solely to operate the Service — for example
            to render your resume, generate PDF/DOCX exports, and run the AI
            features you request. We do not sell Your Content.
          </p>

          <h2>3. AI Features</h2>
          <p>
            Features such as AI rewriting, ATS scoring, and resume import are
            powered by third-party AI providers (currently Google Gemini). When
            you use these features, the content you submit is processed by that
            provider under their terms. AI output is generated automatically and
            may be inaccurate — always review it before sending it to employers.
          </p>

          <h2>4. Talent Pool &amp; Recruiter Sharing</h2>
          <p>
            Cvyon offers an optional talent pool that lets verified recruiters
            discover candidates. You are <strong>never</strong> added to the
            talent pool by default: sharing happens only if you explicitly opt in
            through the consent controls in the builder or your{' '}
            <Link href="/settings">settings</Link>.
            You can withdraw that consent at any time from the same place, or
            via the <Link href="/manage-data">data management</Link> page.
          </p>
          <p>
            You can request an export or deletion of your data any time via support@cvyon.com.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Upload content you do not own or have no right to use;</li>
            <li>Submit false, misleading, or impersonating information;</li>
            <li>Attempt to disrupt, scrape at abusive rates, or gain unauthorized access to the Service;</li>
            <li>Use the Service for unlawful purposes or to send spam.</li>
          </ul>

          <h2>6. Accounts</h2>
          <p>
            Some features (saving resumes online, recruiter accounts) require an
            account. You are responsible for keeping your credentials
            confidential and for activity under your account. We may suspend
            accounts that violate these Terms.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            The Cvyon name, design, templates&apos; layout code, and all site
            content other than Your Content remain our property or that of our
            licensors. You may not copy or redistribute the Service&apos;s
            underlying code or designs except as the Service itself allows
            (e.g. exporting your own resume).
          </p>

          <h2>8. No Employment Guarantee</h2>
          <p>
            Cvyon helps you present yourself well; it does not guarantee
            interviews, job offers, or any employment outcome. ATS scores and AI
            suggestions are guidance, not professional career advice.
          </p>

          <h2>9. Disclaimers &amp; Limitation of Liability</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; without warranties of any kind.
            To the maximum extent permitted by law, Cvyon is not liable for any
            indirect, incidental, or consequential damages arising from your use
            of the Service. Our total liability is limited to the amount you
            paid us for the Service (the core builder is free, so: zero).
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be
            announced on the site, and continued use of the Service after changes
            take effect constitutes acceptance.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these Terms? Reach us via the{' '}
            <Link href="/support">support page</Link>{' '}
            or at support@cvyon.com.
          </p>

          <p className="fm text-xs text-[#151a46]/70 mt-8">
            This is a plain-language summary of our terms prepared for launch.
            If Cvyon grows to handle significant revenue or sensitive data flows,
            these terms should be reviewed by qualified legal counsel.
          </p>

          <div className="mt-8 pt-8 border-t-[3px] border-[#151a46]">
            <Link href="/" className="fm text-sm font-bold uppercase tracking-widest text-[#5548f5] hover:text-[#151a46]">← Back to Cvyon</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
