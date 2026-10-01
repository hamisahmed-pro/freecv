import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import type { Metadata } from 'next';
import { PublicResumeClient } from '@/components/public/PublicResumeClient';
import { V3Nav, V3Footer } from '@/components/v3/V3Chrome';

type Props = {
  params: Promise<{ handle: string }>
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data } = await supabaseAdmin
    .from('public_resumes')
    .select('data')
    .eq('handle', params.handle)
    .single();

  if (!data) return { title: 'Resume Not Found | Cvyon' };

  const name = data.data?.personalInfo?.fullName || 'Candidate';
  const role = data.data?.personalInfo?.jobTitle || 'Professional';
  const skills = (data.data?.skills || []).map((s: any) => s.name).join(', ');

  return {
    title: `${name} - ${role} Resume | Cvyon`,
    description: `View the professional resume of ${name}. Skills include: ${skills}`,
    alternates: { canonical: `https://cvyon.com/r/${params.handle}` },
    openGraph: {
      title: `${name} - ${role}`,
      description: data.data?.summary?.substring(0, 160) || `View ${name}'s resume on Cvyon.`,
      url: `https://cvyon.com/r/${params.handle}`,
      siteName: 'Cvyon',
      type: 'profile'
    }
  };
}

export default async function PublicResumePage(props: Props) {
  const params = await props.params;
  // Fetch resume data
  const { data: record, error } = await supabaseAdmin
    .from('public_resumes')
    .select('data')
    .eq('handle', params.handle)
    .single();

  if (error || !record || !record.data) {
    notFound();
  }

  // Increment view count asynchronously
  supabaseAdmin.rpc('increment_resume_views', { resume_handle: params.handle }).then(() => {});

  const resumeData = record.data;

  return (
    <div className="min-h-screen bg-cream font-brand text-navy antialiased selection:bg-navy selection:text-white">
      <V3Nav cta={{ label: 'Create yours free →', href: '/build' }} />
      <main className="mx-auto w-full max-w-4xl px-4 py-10">
        <div className="h-[1000px] overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_16px_38px_rgba(23,27,75,0.10)]">
          <PublicResumeClient data={resumeData} />
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-paper p-6 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <p className="text-sm font-medium text-muted">
            Built free with{' '}
            <Link href="/" className="font-extrabold text-coral hover:underline">
              Cvyon
            </Link>
            . Create yours in minutes.
          </p>
          <Link
            href="/build"
            className="mt-4 inline-flex items-center justify-center rounded-[10px] bg-navy px-[22px] py-3.5 text-[12px] font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral"
          >
            Build my resume →
          </Link>
        </div>
      </main>
      <V3Footer />
    </div>
  );
}
