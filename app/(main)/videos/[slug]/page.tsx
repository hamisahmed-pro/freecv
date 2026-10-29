import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { V3Page } from '@/components/v3/V3Chrome';

// Dedicated watch pages, 2026-10-29 GSC fix.
// Google only indexes a video when it lives on a "watch page" whose main
// purpose is showing that single video (Google Search Central, Video
// indexing report). The two Cvyon videos were previously only embedded
// mid-article, so Search Console reported all 29 video pages as
// "Video isn't on a watch page" (0 videos indexed), even though the
// VideoObject markup itself passed validation. These pages put the video
// first, with no login, no paywall and no click-to-load player, and carry
// the same VideoObject data the articles already used (name, description,
// thumbnail, uploadDate with timezone, stable contentUrl).

type VideoEntry = {
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  uploadDate: string;
  duration: string;
  articleHref: string;
  articleLabel: string;
  points: string[];
};

const VIDEOS: VideoEntry[] = [
  {
    slug: 'what-is-ats-explainer',
    name: 'What Is an ATS? How Applicant Tracking Systems Filter Your Resume',
    description:
      'A clear visual explanation of how ATS software scans resumes: resume parsing, keyword matching, and match scoring, in clean motion graphics.',
    thumbnailUrl:
      'https://cvyon.com/blog/what-is-applicant-tracking-system-video-poster.jpg',
    contentUrl: 'https://cvyon.com/videos/what-is-ats-explainer.mp4',
    uploadDate: '2026-10-11T00:00:00+01:00',
    duration: 'PT55S',
    articleHref: '/blog/what-is-applicant-tracking-system',
    articleLabel: 'What Is an Applicant Tracking System?',
    points: [
      'Parse — the ATS strips your resume down to structured fields: name, contact info, work history, education and skills.',
      'Match — it compares that parsed text against the job description for skills, tools, certifications and job titles.',
      'Rank — each applicant gets a match score, and recruiters usually review only the top slice.',
    ],
  },
  {
    slug: 'how-to-check-ats-score',
    name: 'How to Check Your Resume ATS Score for Free',
    description:
      'Screen-recording-style walkthrough of uploading a resume to a free online ATS checker and reading the score report with actionable feedback.',
    thumbnailUrl:
      'https://cvyon.com/blog/free-ats-resume-test-video-poster.jpg',
    contentUrl: 'https://cvyon.com/videos/how-to-check-ats-score-walkthrough.mp4',
    uploadDate: '2026-10-11T00:00:00+01:00',
    duration: 'PT45S',
    articleHref: '/blog/free-ats-resume-test',
    articleLabel: 'Free ATS Resume Test: Check Your Resume Score Before You Apply',
    points: [
      'Upload your resume — PDF or DOCX, the exact file you would submit to the employer.',
      'Paste the job description — the test compares your resume against this specific posting, not a generic checklist.',
      'Read your match score — overall score, keywords you cover, and the exact missing keywords costing you points.',
      'Fix the gaps and re-test — add missing keywords where truthful, fix formatting flags, then test again before you apply.',
    ],
  },
];

function getVideo(slug: string): VideoEntry | undefined {
  return VIDEOS.find((v) => v.slug === slug);
}

export function generateStaticParams() {
  return VIDEOS.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) {
    return { title: 'Video not found | Cvyon' };
  }
  const canonical = `https://cvyon.com/videos/${video.slug}`;
  return {
    title: `${video.name} | Cvyon`,
    description: video.description,
    alternates: { canonical },
    openGraph: {
      title: video.name,
      description: video.description,
      url: canonical,
      siteName: 'Cvyon',
      type: 'video.other',
      images: [{ url: video.thumbnailUrl, alt: video.name }],
      videos: [{ url: video.contentUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: video.name,
      description: video.description,
      images: [video.thumbnailUrl],
    },
  };
}

export default async function VideoWatchPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const video = getVideo(slug);
  if (!video) notFound();

  const videoObject = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration,
    contentUrl: video.contentUrl,
    embedUrl: `https://cvyon.com/videos/${video.slug}`,
  };

  return (
    <V3Page pageName="video_watch" cta={{ label: 'Build free →', href: '/build' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObject) }}
      />
      <main className="mx-auto max-w-[860px] px-5 py-10">
        {/* The video itself is the main content: player first, no click-to-load. */}
        <video
          controls
          preload="metadata"
          poster={video.thumbnailUrl}
          aria-label={video.name}
          style={{ width: '100%', borderRadius: '12px', background: '#141312' }}
        >
          <source src={video.contentUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <h1 className="mt-8 text-3xl font-extrabold leading-tight sm:text-4xl">
          {video.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[#565a70]">
          {video.description}
        </p>

        <h2 className="mt-10 text-xl font-extrabold">What this video covers</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[16px] leading-relaxed">
          {video.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href={video.articleHref}
            className="inline-flex items-center justify-center rounded-lg bg-[#141312] px-5 py-3 text-sm font-bold text-white"
          >
            Read the full guide: {video.articleLabel}
          </Link>
          <Link
            href="/ats-grader"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#141312] px-5 py-3 text-sm font-bold"
          >
            Try the free ATS grader
          </Link>
          <Link
            href="/build"
            className="inline-flex items-center justify-center rounded-lg border-2 border-[#141312] px-5 py-3 text-sm font-bold"
          >
            Build your resume free
          </Link>
        </div>
      </main>
    </V3Page>
  );
}
