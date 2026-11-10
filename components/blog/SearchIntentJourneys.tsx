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
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/templates" className="riso-btn">Browse all 180 designs →</Link>
        <Link href="/build?source=seo" className="riso-btn riso-btn-ghost">Build my resume →</Link>
      </div>
      <p className="mt-4 text-xs text-[#141312]/65">Previews use illustrative sample details. Replace them with your own experience in the builder.</p>
    </section>
  );
}

const tutorResources = [
  { slug: 'tutoring-resume-example', title: 'See a complete tutoring resume example', path: '/blog/tutoring-resume-example' },
  { slug: 'describe-tutoring-experience', title: 'Learn how to describe tutoring experience', path: '/blog/describe-tutoring-experience' },
  { slug: 'tutor-resume-examples', title: 'Compare tutor resume examples', path: '/blog/tutor-resume-examples' },
  { slug: 'tutor-template', title: 'Preview an editable Tutor resume template', path: '/templates/tutor' },
  { slug: 'tutor-guide', title: 'Follow the tutor resume writing guide', path: '/resume-for/tutor' },
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
