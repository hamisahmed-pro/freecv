import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import type { Metadata } from 'next';
import { PublicResumeClient } from '@/components/public/PublicResumeClient';

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
    <div className="min-h-screen bg-[#f6f5ef] flex flex-col items-center py-10 selection:bg-black selection:text-white">
      <div className="w-full max-w-4xl mx-auto px-4 h-[1000px] shadow-2xl">
        <PublicResumeClient data={resumeData} />
      </div>

      <footer className="mt-12 text-center text-sm font-medium text-gray-500 pb-10 uppercase tracking-widest">
        Built free with <a href="/" className="font-bold text-[#ff604b] hover:underline">Cvyon</a>. Create yours in minutes.
      </footer>
    </div>
  );
}
