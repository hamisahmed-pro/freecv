"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useResumeStore } from '@/store/useResumeStore';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Copy, Trash2, Edit2, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';
import { RecruiterOptInCard } from '@/components/candidate/RecruiterOptInCard';
import { RecruiterActivityCard } from '@/components/candidate/RecruiterActivityCard';

export default function DashboardClient() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const { setCurrentResumeId, setResumeTitle, setAllData } = useResumeStore();

  useEffect(() => {
    const fetchUserAndResumes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);

      try {
        const res = await fetch('/api/user/resumes');
        if (res.ok) {
          const data = await res.json();
          setResumes(data);
        } else {
          setFetchError("Couldn't load your resumes. Please check your connection and try again.");
        }
      } catch (err) {
        console.error(err);
        setFetchError("Couldn't load your resumes. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserAndResumes();
  }, [router]);

  const handleCreateNew = async () => {
    try {
      // Empty resume payload
      const payload = {
        title: 'New Resume',
        resume_data: {} // In reality, we could use initialData from store
      };
      const res = await fetch('/api/user/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newResume = await res.json();
        setResumes([newResume, ...resumes]);
        handleEdit(newResume);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (resume: any) => {
    setCurrentResumeId(resume.id);
    setResumeTitle(resume.title);
    if (resume.resume_data && Object.keys(resume.resume_data).length > 0) {
      setAllData(resume.resume_data);
    }
    router.push('/');
  };

  const handleDuplicate = async (resume: any) => {
    try {
      const payload = {
        title: `${resume.title} (Copy)`,
        resume_data: resume.resume_data
      };
      const res = await fetch('/api/user/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newResume = await res.json();
        setResumes([newResume, ...resumes]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/user/resumes/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setResumes(resumes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <V3Page pageName="dashboard">
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      </V3Page>
    );
  }

  return (
    <V3Page pageName="dashboard">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/build" className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy/70 transition-colors hover:text-coral">
              <ArrowLeft size={16} /> Back to Builder
            </Link>
            <V3Eyebrow>§ my account</V3Eyebrow>
            <h1 className="text-4xl font-black tracking-tight text-navy sm:text-5xl">My Resumes</h1>
            <p className="mt-2 text-[15px] text-muted">Manage, edit, and duplicate your resumes.</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_18px_rgba(255,96,75,0.28)] transition-transform hover:-translate-y-px"
          >
            <Plus size={18} />
            Create New
          </button>
        </div>

        {fetchError && (
          <div className="flex items-center gap-3 rounded-2xl border border-coral/40 bg-coral/10 p-4">
            <AlertTriangle size={20} className="shrink-0 text-coral" />
            <p className="text-sm font-bold text-navy">{fetchError}</p>
          </div>
        )}

        {/* recruiter discovery — opt-in moment #2 */}
        <RecruiterOptInCard variant="card" />

        {/* candidate transparency: real recruiter activity on their profile */}
        <RecruiterActivityCard />

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-line bg-paper p-12 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)] flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender text-brand">
              <FileText size={32} />
            </div>
            <h3 className="mb-2 text-xl font-extrabold tracking-tight text-navy">No resumes yet</h3>
            <p className="mb-6 max-w-sm text-[15px] text-muted">Create your first resume to get started building your professional profile.</p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-2 rounded-[10px] bg-coral px-[18px] py-3 text-[12px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_18px_rgba(255,96,75,0.28)] transition-transform hover:-translate-y-px"
            >
              Build Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map(resume => (
              <div key={resume.id} className="relative flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] transition-transform hover:-translate-y-px">
                <div className="flex-grow">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cream text-navy">
                      <FileText size={24} />
                    </div>
                  </div>
                  <h3 className="mb-1 line-clamp-1 text-lg font-extrabold tracking-tight text-navy">{resume.title}</h3>
                  <p className="mb-6 text-xs text-muted">Last updated: {new Date(resume.updated_at).toLocaleDateString()}</p>
                </div>

                <div className="flex items-center gap-2 border-t border-line pt-4">
                  <button
                    onClick={() => handleEdit(resume)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-[10px] bg-navy px-3 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-transform hover:-translate-y-px hover:bg-coral"
                  >
                    <Edit2 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDuplicate(resume)}
                    className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper text-navy transition-all hover:-translate-y-px hover:border-brand hover:text-brand"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="grid h-10 w-10 place-items-center rounded-[10px] border border-line bg-paper text-navy transition-all hover:-translate-y-px hover:border-coral hover:bg-coral hover:text-white"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </V3Page>
  );
}
