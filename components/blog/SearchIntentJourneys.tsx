import { TutorBulletSelector } from './TutorBulletSelector';
import { tutorBullets, tutorExampleUrl } from '@/lib/tutor-examples';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Search-intent bridges for existing English blog articles.
 * The CMS stores the article body in Supabase; these server-rendered links and
 * previews improve the live published page without a database migration.
 */
const featured = [
  { name: 'Classic', slug: 'classic', image: '/thumbnails/Classic.webp', note: 'A straightforward, traditional layout' },
  { name: 'Swiss Minimal', slug: 'swissminimal', image: '/thumbnails/SwissMinimal.webp', note: 'Clean typography with plenty of breathing room' },
  { name: 'Corporate Blue', slug: 'corporateblue', image: '/thumbnails/CorporateBlue.webp', note: 'A polished layout for business applications' },
];

export function FeaturedFreeResumeTemplates() {
  return (
    <section aria-labelledby="featured-free-templates" className="mb-10 border-[3px] border-[#141312] bg-white p-5 shadow-[7px_7px_0_#141312] sm:p-8">
      <p className="fm text-xs font-bold uppercase tracking-[0.16em] text-[#2233FF]">Try the templates in this guide</p>
      <h2 id="featured-free-templates" className="fh mt-2 text-2xl font-black leading-tight">
        Free resume templates you can actually open and edit
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#141312]/80">
        Advice helps, but the right design is easier to choose when you can see it. Preview three real Cvyon templates below, or browse the complete gallery.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {featured.map((template) => (
          <Link key={template.slug} href={`/templates/${template.slug}`} className="group block border-2 border-[#141312] bg-[#F5F4EF] transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#2233FF]">
            <div className="relative aspect-[8.5/11] overflow-hidden bg-white">
              <Image
                src={template.image}
                alt={`Resume design preview of the ${template.name} template`}
                fill
                sizes="(max-width: 640px) 90vw, 220px"
                className="object-contain"
              />
            </div>
            <div className="border-t-2 border-[#141312] p-3">
              <h3 className="fh text-base font-black group-hover:text-[#2233FF]">{template.name}</h3>
              <p className="mt-1 text-xs leading-relaxed">{template.note}</p>
              <span className="fm mt-3 inline-block text-[11px] font-bold uppercase tracking-wide text-[#2233FF]">Preview &amp; use →</span>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6 border-t-2 border-[#141312] pt-5">
        <h3 className="fh text-lg font-black">Choose a resume design for the job, not just its appearance</h3>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="font-extrabold">Traditional or regulated roles</dt>
            <dd className="mt-1">Start with the straightforward Classic layout and conventional section headings.</dd></div>
          <div><dt className="font-extrabold">Modern professional roles</dt>
            <dd className="mt-1">Consider Swiss Minimal or Corporate Blue, then inspect text order and export readability yourself.</dd></div>
          <div><dt className="font-extrabold">Early-career applicants</dt>
            <dd className="mt-1">Prioritize education, projects and relevant achievements over decorative elements.</dd></div>
          <div><dt className="font-extrabold">ATS-submitted applications</dt>
            <dd className="mt-1">Use recognizable headings and selectable text. No template can guarantee an ATS score or interview.</dd></div>
        </dl>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/templates" className="riso-btn">Browse all 180 designs →</Link>
        <Link href="/build?source=seo" className="riso-btn riso-btn-ghost">Build my resume →</Link>
      </div>
      <p className="mt-4 text-xs text-[#141312]/65">Previews use illustrative sample details. Replace them with your own experience in the builder.</p>
    </section>
  );
}

// 2026-11-16 SEO audit: the tutoring cluster has one owner per query type,
// linked in a chain with keyword anchors — guide → examples → description →
// template → builder. The box renders on every tutoring article except the
// one the reader is already on (filtered by blog slug below).
const tutorResources = [
  { slug: 'tutoring-resume', title: 'Tutoring resume: how to write one', path: '/blog/tutoring-resume' },
  { slug: 'tutoring-resume-example', title: 'Tutoring resume examples', path: '/blog/tutoring-resume-example' },
  { slug: 'tutor-resume-examples', title: 'More tutor resume examples', path: '/blog/tutor-resume-examples' },
  { slug: 'describe-tutoring-experience', title: 'How to describe tutoring experience on a resume', path: '/blog/describe-tutoring-experience' },
  { slug: 'tutor-resume-template', title: 'Tutor resume template', path: '/blog/tutor-resume-template' },
  { slug: 'tutor-template', title: 'Tutor resume template design', path: '/templates/tutor' },
  { slug: 'tutor-guide', title: 'Tutor resume example and writing guide', path: '/resume-for/tutor' },
  { slug: 'tutor-build', title: 'Build your tutoring resume free', path: '/build' },
];

export const tutoringArticleSlugs = [
  'tutoring-resume',
  'tutoring-resume-example',
  'tutor-resume-examples',
  'describe-tutoring-experience',
  'tutor-resume-template',
];

export function TutorResumeReadingPath({ currentSlug }: { currentSlug: string }) {
  return (
    <aside aria-labelledby="related-tutor-resources" className="mt-10 border-[3px] border-[#141312] bg-[#FFE14D] p-6 shadow-[7px_7px_0_#141312] sm:p-8">
      <p className="fm text-xs font-bold uppercase tracking-[0.16em]">Tutoring resume resources</p>
      <h2 id="related-tutor-resources" className="fh mt-2 text-2xl font-black">
        Pick the next step for your tutor resume
      </h2>
      <ul className="mt-5 space-y-3">
        {tutorResources.filter((resource) => resource.slug !== currentSlug).map((resource) => (
          <li key={resource.path}>
            <Link href={resource.path} className="inline-flex text-sm font-bold underline decoration-2 underline-offset-4 hover:text-[#2233FF]">
              {resource.title} →
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}


/** Search-facing, original concise answers that keep neighboring tutor pages
 * distinct instead of forcing the same keyword onto all of them. */
export function TutorSearchAnswer({ slug }: { slug: string }) {
  const items: Record<string, { title: string; description: string; next: string; href: string; anchor: string }> = {
    'tutoring-resume': {
      title: 'How to write a tutoring resume',
      description: 'List the subjects and grade levels you taught, the teaching approach you used, and specific evidence of progress. Structure your resume with a concise summary, relevant experience, education and skills; avoid generic claims without examples.',
      next: 'Need to see a complete layout before writing?',
      href: '/blog/tutoring-resume-example', anchor: 'View six tutoring resume examples',
    },
    'tutoring-resume-example': {
      title: 'What a strong tutoring resume example demonstrates',
      description: 'A convincing sample connects the learner group, subject, teaching action and measurable result. For instance: “Prepared weekly Algebra I practice plans for 8 students; six improved by at least one course grade.” This is fictional sample wording—replace it with truthful experience.',
      next: 'Want to put your own achievements into the design?',
      href: '/templates/tutor', anchor: 'Use an editable tutor resume template',
    },
    'describe-tutoring-experience': {
      title: 'How to describe tutoring experience in one resume bullet',
      description: 'Use this pattern: action verb + subject and learner group + teaching method + supported result. Only quote real scores, counts and achievements you can substantiate. “Tutored high-school biology students using weekly practice quizzes” is stronger than “helped students.”',
      next: 'Need the entire resume, not just experience bullets?',
      href: '/blog/tutoring-resume', anchor: 'Read the tutor resume writing guide',
    },
    'tutor-resume-template': {
      title: 'Choose and edit a tutor resume template',
      description: 'Use an existing template with standard education, experience and skills headings. Add tutoring subjects and relevant age groups. Review the rendered file before submitting; no template removes the need to check your content.',
      next: 'Open the design and replace its sample details',
      href: '/templates/tutor', anchor: 'Preview the editable tutor template',
    },
    'tutor-resume-examples': {
      title: 'Tutor resume examples: make the evidence specific',
      description: 'Examples should distinguish first-time tutors, online tutors, test-prep instructors and subject specialists. Match the sample closest to your real work, then edit every outcome so it is accurate.',
      next: 'Want a practical writing process?',
      href: '/blog/tutoring-resume', anchor: 'Start the tutoring resume guide',
    },
  };
  const item = items[slug];
  if (!item) return null;
  return (
    <section aria-label="Quick answer" className="mb-9 border-[3px] border-[#141312] bg-white p-6 shadow-[5px_5px_0_#141312]">
      <p className="fm text-[11px] font-black uppercase tracking-widest text-[#2233FF]">Practical answer</p>
      <h2 className="fh mt-2 text-xl font-black">{item.title}</h2>
      <p className="mt-3 text-sm leading-7">{item.description}</p>
      {slug === 'describe-tutoring-experience' && <TutorBulletSelector />}
      {slug === 'tutoring-resume-example' && (
        <div className="mt-5 border-t-2 border-[#141312] pt-4">
          <h3 className="fh text-lg font-bold">First tutoring job at a learning center</h3>
          <p className="mt-2 text-sm">Applying after a role at Kumon or another learning center? Use your actual job title and distinguish assisting an instructor from teaching your own class.</p>
          <p className="mt-3 text-sm"><strong>Example experience entry</strong><br />Learning Center Assistant · [Center name] · [Dates worked]</p>
          <blockquote className="my-3 border-l-4 border-[#2233FF] pl-3 text-sm">{tutorBullets[0].text}</blockquote>
          <Link href={tutorExampleUrl} className="font-bold underline">Edit this learning-center example in Cvyon →</Link>
        </div>
      )}
      <p className="mt-3 text-sm"><strong>{item.next}</strong>{' '}
        <Link className="font-extrabold underline decoration-2 underline-offset-4" href={item.href}>{item.anchor}</Link></p>
    </section>
  );
}
