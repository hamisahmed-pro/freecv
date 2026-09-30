"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useResumeStore } from '@/store/useResumeStore';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Copy, Trash2, Edit2, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RecruiterOptInCard } from '@/components/candidate/RecruiterOptInCard';
import { RecruiterActivityCard } from '@/components/candidate/RecruiterActivityCard';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
      <div className="min-h-screen bg-[#f6f5ef] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5548f5]" />
      </div>
    );
  }

  return (
    <div className={cn("cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden", body.className)}
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
      `}</style>

      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/build" className="fm inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#151a46]/70 hover:text-[#ff604b] mb-4 transition-colors">
                <ArrowLeft size={16} /> Back to Builder
              </Link>
              <h1 className="fd text-4xl tracking-tight">My Resumes</h1>
              <p className="text-[#151a46]/70 mt-1">Manage, edit, and duplicate your resumes.</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="riso-btn"
            >
              <Plus size={18} />
              Create New
            </button>
          </div>

          {fetchError && (
            <div className="flex items-center gap-3 border-[3px] border-[#ff604b] bg-white hs p-4">
              <AlertTriangle size={20} className="text-[#ff604b] shrink-0" />
              <p className="text-sm font-bold">{fetchError}</p>
            </div>
          )}

          {/* recruiter discovery — opt-in moment #2 */}
          <RecruiterOptInCard variant="card" />

          {/* candidate transparency: real recruiter activity on their profile */}
          <RecruiterActivityCard />

          {resumes.length === 0 ? (
            <div className="riso-card p-12 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#f6f5ef] text-[#5548f5] border-[3px] border-[#151a46] flex items-center justify-center mb-4">
                <FileText size={32} />
              </div>
              <h3 className="fh text-xl font-extrabold mb-2">No resumes yet</h3>
              <p className="text-[#151a46]/70 max-w-sm mb-6">Create your first resume to get started building your professional profile.</p>
              <button
                onClick={handleCreateNew}
                className="riso-btn"
              >
                Build Resume
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map(resume => (
                <div key={resume.id} className="riso-card p-6 group relative flex flex-col transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-[#f6f5ef] flex items-center justify-center text-[#151a46] border-[3px] border-[#151a46]">
                        <FileText size={24} />
                      </div>
                    </div>
                    <h3 className="fh font-extrabold text-lg mb-1 line-clamp-1">{resume.title}</h3>
                    <p className="fm text-xs text-gray-600 mb-6">Last updated: {new Date(resume.updated_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t-[3px] border-[#151a46]/10">
                    <button
                      onClick={() => handleEdit(resume)}
                      className="flex-1 flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#f6f5ef] text-[#151a46] px-3 py-2 fh text-xs font-extrabold uppercase tracking-wider transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDuplicate(resume)}
                      className="p-2 border-[3px] border-[#151a46] bg-white text-[#151a46] transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                      title="Duplicate"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="p-2 border-[3px] border-[#151a46] bg-white text-[#151a46] transition-all hover:bg-[#ff604b] hover:border-[#ff604b] hover:text-white"
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
      </div>
    </div>
  );
}
