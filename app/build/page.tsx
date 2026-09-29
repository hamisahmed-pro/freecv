"use client";

import toast from 'react-hot-toast';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import {
  User, Briefcase, GraduationCap, Wrench, Plus, Trash2, Download, X, Eye, EyeOff, Layout,
  FolderOpen, Award, Users, Paintbrush, Sparkles, Loader2, GripVertical, FileText,
  BarChart3, RefreshCw, Undo2, Redo2, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Upload, Share2, Pencil, Target
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';
import { trackEvent } from '@/lib/analytics';
import { supabase } from '@/lib/supabase';

import { templates, TemplateKey } from '@/components/templates';
import { templates as htmlTemplates } from '@/components/html_templates';
import NewsletterCapture from '@/components/NewsletterCapture';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { captureTemplateHtml } from '@/lib/docx/capture-template-html';

const ImportResume = dynamic(() => import('@/components/builder/ImportResume').then(m => m.ImportResume), { ssr: false });
const CoverLetterTab = dynamic(() => import('@/components/builder/CoverLetterTab').then(m => m.CoverLetterTab), { ssr: false });
const JobsModal = dynamic(() => import('@/components/builder/JobsModal').then(m => m.JobsModal), { ssr: false });
const PDFPreview = dynamic(() => import('@/components/builder/PDFPreview'), { ssr: false });
const PDFDownloadButton = dynamic(() => import('@/components/builder/PDFDownloadButton'), { ssr: false });
const LiveAtsScore = dynamic(() => import('@/components/builder/LiveAtsScore').then(m => m.LiveAtsScore), { ssr: false });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useResumeStore, initialData, type ResumeData, type PersonalInfo, type Experience, type Education, type Skill, type Project, type Certification, type CustomSection, type CustomSectionItem, type Reference, type ResumeSectionId, type ResumeDensity, DEFAULT_SECTION_ORDER } from '@/store/useResumeStore';
import { setRecruiterConsent } from '@/lib/recruiter-api';

// --- Riso primitives ---
const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/60">{label}</label>
    <input
      className="w-full bg-white border-[3px] border-[#141312] rounded-none px-4 py-2.5 text-sm text-[#141312] placeholder:text-[#141312]/35 outline-none transition-all focus:border-[#FF4326]"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/60">{label}</label>
    <textarea
      className="w-full bg-white border-[3px] border-[#141312] rounded-none px-4 py-3 text-sm text-[#141312] placeholder:text-[#141312]/35 outline-none transition-all focus:border-[#FF4326] min-h-[100px] resize-y custom-scrollbar"
      {...props}
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title, description, onRemove }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] hs-v w-fit shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="fh font-extrabold text-[#141312] leading-tight tracking-tight">{title}</h3>
        <p className="fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#141312]/50">{description}</p>
      </div>
    </div>
    {onRemove && (
      <button onClick={onRemove} className="fm text-[10px] font-bold uppercase tracking-widest text-[#D8362A] border-2 border-[#D8362A] px-3 py-1.5 hover:bg-[#D8362A] hover:text-white transition-colors">
        Remove Section
      </button>
    )}
  </div>
);

const Card = ({ children, className }: any) => (
  <div className={cn("bg-white border-[3px] border-[#141312] hs rounded-none p-5 sm:p-6 mb-8 text-[#141312]", className)}>
    {children}
  </div>
);

// Collapsible section wrapper. Sections start expanded on desktop (lg+)
// and collapsed on smaller screens; the header toggles on every viewport.
// (The old approach — "lg:block" overriding "hidden" in CSS — lost the
// cascade in production builds, leaving the Density/Theme controls
// unreachable on desktop, so expansion is now state-driven instead.)
const SectionAccordion = ({ id, icon: Icon, title, description, action, onRemove, tools, defaultOpen = false, children }: any) => {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) setOpen(true);
  }, []);
  const toggle = () => setOpen((o: boolean) => !o);
  return (
    <div>
      <div className="flex justify-between items-center gap-3 mb-6">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={`section-body-${id}`}
          className="flex-1 min-w-0 text-left cursor-pointer"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="p-2.5 bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] hs-v w-fit shrink-0">
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="fh font-extrabold text-[#141312] leading-tight tracking-tight">{title}</h3>
                <p className="fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#141312]/50">{description}</p>
              </div>
            </div>
            <span className={cn("shrink-0 p-2 border-2 border-[#141312] bg-white text-[#141312] transition-transform", open && "rotate-180")}>
              <ChevronDown size={16} />
            </span>
          </div>
        </button>
        {tools && (
          <div className="shrink-0 flex items-center gap-1.5">
            {tools}
          </div>
        )}
        {(action || onRemove) && (
          <div className="shrink-0 flex items-center gap-2" onClickCapture={() => setOpen(true)}>
            {action}
            {onRemove && (
              <button onClick={onRemove} className="fm text-[10px] font-bold uppercase tracking-widest text-[#D8362A] border-2 border-[#D8362A] px-3 py-1.5 hover:bg-[#D8362A] hover:text-white transition-colors">
                Remove
              </button>
            )}
          </div>
        )}
      </div>
      <div id={`section-body-${id}`} className={open ? "block" : "hidden"}>
        {children}
      </div>
    </div>
  );
};

// Per-section header controls: eye toggle (hide from resume output) plus
// move up/down. Rendered outside the accordion's own toggle button so they
// never trigger open/close. `hideEye` omits the visibility toggle for
// editor-only sections (cover letter) that never render into the output.
const SectionHeaderTools = ({ id, isHidden, isFirst, isLast, onToggle, onMove, hideEye = false }: {
  id: ResumeSectionId; isHidden: boolean; isFirst: boolean; isLast: boolean;
  onToggle: (id: ResumeSectionId) => void; onMove: (id: ResumeSectionId, dir: 'up' | 'down') => void;
  hideEye?: boolean;
}) => {
  const btn = "p-1.5 border-2 border-[#141312] bg-white text-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#141312]";
  return (
    <>
      <button type="button" onClick={() => onMove(id, 'up')} disabled={isFirst} title="Move section up" aria-label="Move section up" className={btn}>
        <ChevronUp size={13} />
      </button>
      <button type="button" onClick={() => onMove(id, 'down')} disabled={isLast} title="Move section down" aria-label="Move section down" className={btn}>
        <ChevronDown size={13} />
      </button>
      {!hideEye && (
        <button type="button" onClick={() => onToggle(id)} title={isHidden ? 'Show section in resume output' : 'Hide section from resume output'} aria-label={isHidden ? 'Show section in resume output' : 'Hide section from resume output'} aria-pressed={isHidden}
          className={cn(btn, isHidden && "bg-[#141312]/30")}>
          {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
        </button>
      )}
    </>
  );
};

const HTMLThumbnail = ({ Tmpl, data }: { Tmpl: any, data: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => { setScale(entries[0].contentRect.width / 816); });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="aspect-[8.5/11] bg-white w-full relative overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-0 w-[816px] h-[1056px] origin-top-left bg-white" style={{ transform: `scale(${scale})`, '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}>
        <Tmpl data={data} themeColor={data.theme?.color || '#2563eb'} />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
    </div>
  );
};

const HTMLPreview = ({ Tmpl, data }: { Tmpl: any, data: any }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => { setScale(Math.min(1.5, entries[0].contentRect.width / 816)); });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="w-full h-full bg-[#E8E7E1] flex justify-center overflow-auto p-4 sm:p-8 cv-riso custom-scrollbar">
      <div
        data-cvyon-template-stage
        className={cn("bg-white shadow-2xl flex-shrink-0 relative border-[3px] border-[#141312] hs-c", data.density === 'compact' && "density-compact")}
        style={{ width: '816px', height: '1056px', transform: `scale(${scale})`, transformOrigin: 'top center', marginBottom: `-${1056 * (1 - scale)}px`, '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}
      >
        <Tmpl data={data} themeColor={data.theme?.color || '#2563eb'} />
      </div>
    </div>
  );
};

// --- Main Page ---
const BLOCKED_EMAILS = ['jane@cvyon.dev', 'your.email@example.com', 'test@test.com', 'example@example.com', 'user@example.com', ''];
function isRealUserEmail(email?: string): boolean {
  const e = (email || '').trim().toLowerCase();
  return !!(e && e.includes('@') && e.length >= 5 && !BLOCKED_EMAILS.includes(e));
}

export default function FreeCVApp() {
  const [isHydrated, setIsHydrated] = useState(false);
  const onboardingAppliedRef = useRef(false);
  const previewViewportRef = useRef<HTMLElement | null>(null);
  const resumePageRef = useRef<HTMLDivElement | null>(null);
  const {
    data: storeData, setTemplateId, setThemeColor, updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkill, removeSkill,
    toggleProjects, addProject, updateProject, removeProject,
    toggleCertifications, addCertification, updateCertification, removeCertification,
    toggleReferences, addReference, updateReference, removeReference, setConsents,
    reorderExperience, reorderEducation, reorderSkills, setAllData, addCustomSection, updateCustomSectionTitle, removeCustomSection, addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem, reorderCustomSections, reorderCustomSectionItems,
    toggleSectionVisibility, moveSection, setDensity
  } = useResumeStore();

  const data = useMemo(() => ({
    ...storeData,
    projects: storeData.projects || [],
    certifications: storeData.certifications || [],
    references: storeData.references || [],
    customSections: storeData.customSections || [],
    sectionVisibility: storeData.sectionVisibility || {},
    sectionOrder: storeData.sectionOrder && storeData.sectionOrder.length ? storeData.sectionOrder : DEFAULT_SECTION_ORDER,
    density: storeData.density === 'compact' ? 'compact' : 'comfortable',
    consents: storeData.consents || { recruiterShare: false, emailJobs: false, analytics: false }
  }), [storeData]);

  // Data as rendered in the resume OUTPUT (on-screen preview, print/PDF,
  // DOCX capture). Sections the user hid via the eye toggle are stripped
  // here, so every output channel stays consistent from this single point.
  const previewData = useMemo(() => {
    const vis = data.sectionVisibility || {};
    const shown = (id: ResumeSectionId) => vis[id] !== false;
    const blankPersonal = { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', profilePicture: undefined };
    return {
      ...data,
      personalInfo: shown('personal') ? data.personalInfo : blankPersonal,
      summary: shown('personal') ? data.summary : '',
      experience: shown('experience') ? data.experience : [],
      education: shown('education') ? data.education : [],
      skills: shown('skills') ? data.skills : [],
      projects: shown('projects') ? data.projects : [],
      showProjects: data.showProjects && shown('projects'),
      certifications: shown('certifications') ? data.certifications : [],
      showCertifications: data.showCertifications && shown('certifications'),
      references: shown('references') ? data.references : [],
      showReferences: data.showReferences && shown('references'),
    };
  }, [data]);

  // Sections currently present in the editor, in the user's chosen order.
  // (projects/certifications/references only appear once added.)
  const editorSectionIds = useMemo(() => {
    const inEditor = (id: ResumeSectionId) =>
      id === 'projects' ? data.showProjects
      : id === 'certifications' ? data.showCertifications
      : id === 'references' ? data.showReferences
      : true;
    return (data.sectionOrder || DEFAULT_SECTION_ORDER).filter(inEditor);
  }, [data.sectionOrder, data.showProjects, data.showCertifications, data.showReferences]);

  const [skillInput, setSkillInput] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(false);
  const [mobilePreviewMetrics, setMobilePreviewMetrics] = useState({ scale: 1, width: 816, height: 1056 });
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatingExpId, setGeneratingExpId] = useState<string | null>(null);
  const [polishingExpId, setPolishingExpId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);

  const [atsJobDesc, setAtsJobDesc] = useState('');
  const [atsResult, setAtsResult] = useState<any>(null);

  useEffect(() => {
    if (data.atsRecommendations) {
      setIsATSOpen(true);
      setAtsResult({ score: 0, strengths: [], weaknesses: [], missingKeywords: data.atsRecommendations.missingKeywords || [], tips: data.atsRecommendations.tips || [] });
      useResumeStore.getState().setAtsRecommendations(null);
    }
  }, [data.atsRecommendations]);
  const [isATSLoading, setIsATSLoading] = useState(false);

  // Tailor-to-job modal state
  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const [tailorJobDesc, setTailorJobDesc] = useState('');
  const [tailorResult, setTailorResult] = useState<any>(null);
  const [isTailorLoading, setIsTailorLoading] = useState(false);
  const [tailorApplied, setTailorApplied] = useState<{ summary: boolean; skills: string[]; bullets: number[] }>({ summary: false, skills: [], bullets: [] });

  const [isRewriterOpen, setIsRewriterOpen] = useState(false);
  const [rewriteTone, setRewriteTone] = useState('Executive');
  const [isRewriting, setIsRewriting] = useState(false);

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // OAuth return: finish a recruiter-discovery opt-in started (Allow → sign in)
  // before the user had a session. Explicit + timestamped via the consent API.
  useEffect(() => {
    let pending = false;
    try { pending = sessionStorage.getItem("cvyon_pending_optin") === "1"; } catch {}
    if (!pending) return;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      try { sessionStorage.removeItem("cvyon_pending_optin"); } catch {}
      try {
        await setRecruiterConsent(true);
        setConsents({ ...(data.consents || {}), recruiterShare: true });
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.2 }, colors: ["#FF4326", "#FFE14D", "#2233FF"] });
        toast.success("You're discoverable — recruiters can now find you.");
      } catch (e: any) {
        toast.error(e?.message || "Couldn't save your preference.");
      }
      // clean the ?optin=pending marker without a reload
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.has("optin")) { u.searchParams.delete("optin"); window.history.replaceState(null, "", u.toString()); }
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination, type } = result;
    if (type === 'experience') reorderExperience(source.index, destination.index);
    else if (type === 'education') reorderEducation(source.index, destination.index);
    else if (type === 'skills') reorderSkills(source.index, destination.index);
  };

  const handlePolishExperience = async (id: string, currentText: string) => {
    if (!currentText.trim() || !data.personalInfo.jobTitle) { toast.error("Please enter a Job Title and some text to polish."); return; }
    try {
      setPolishingExpId(id);
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'polish', jobTitle: data.personalInfo.jobTitle, additionalContext: currentText }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'Request timed out.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const json = await res.json();
      if (json.text) updateExperience(id, { description: json.text });
      else if (json.error) toast.error(json.error);
    } catch (err) { console.error(err); toast.error("Failed to polish text. Please try again."); }
    finally { setPolishingExpId(null); }
  };

  const handleLinkedInImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/ai/parse-linkedin', { method: 'POST', body: formData });
      const resData = await res.json();
      if (res.ok) setAllData(resData);
      else throw new Error(resData.error || 'Failed to parse LinkedIn PDF');
    } catch (err: any) { toast.error("LinkedIn Import failed: " + err.message); }
    setIsImporting(false);
    e.target.value = '';
  };

  const handleGenerateSummary = async () => {
    if (!data.personalInfo.jobTitle) { toast.error("Please enter a Job Title in the Personal Info section first so the AI knows what to write about."); return; }
    setIsGeneratingSummary(true);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'summary', jobTitle: data.personalInfo.jobTitle || 'Professional' }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'Request timed out. Please try again.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const json = await res.json();
      if (json.text) updateSummary(json.text);
    } catch (err: any) { toast.error("AI Generation failed: " + err.message); }
    setIsGeneratingSummary(false);
  };

  const handleGenerateExperience = async (expId: string, role: string, company: string) => {
    const jobTitleToUse = role || data.personalInfo.jobTitle;
    if (!jobTitleToUse) { toast.error("Please enter a Role for this experience (or a global Job Title) so the AI knows what to write."); return; }
    setGeneratingExpId(expId);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'experience', jobTitle: jobTitleToUse, company }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'Request timed out.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const json = await res.json();
      if (json.text) updateExperience(expId, { description: json.text });
    } catch (err: any) { toast.error("AI Generation failed: " + err.message); }
    setGeneratingExpId(null);
  };

  useEffect(() => {
    setIsHydrated(true);
    trackEvent('page_view', 'build');
    trackEvent('milestone_started');
  }, []);

  useEffect(() => {
    if (!isHydrated || onboardingAppliedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('source') !== 'seo') return;
    const template = params.get('template') as TemplateKey | null;
    const jobTitle = params.get('jobTitle');
    const summary = params.get('summary');
    const skills = (params.get('skills') || '').split('|').map(skill => skill.trim()).filter(Boolean);
    const templateId = template && templates[template] ? template : data.templateId;
    const shouldReplaceDefaultSkills = data.skills.length === initialData.skills.length && data.skills.every((skill, index) => skill.name === initialData.skills[index]?.name);
    const nextSkills = skills.length > 0
      ? (shouldReplaceDefaultSkills
        ? skills.map((name, index) => ({ id: `seo-skill-${index}`, name }))
        : [...data.skills, ...skills.filter(skill => !data.skills.some(existing => existing.name.toLowerCase() === skill.toLowerCase())).map((name, index) => ({ id: `seo-skill-${Date.now()}-${index}`, name }))])
      : data.skills;
    setAllData({
      templateId,
      personalInfo: { ...data.personalInfo, jobTitle: jobTitle || data.personalInfo.jobTitle },
      summary: summary && (!data.summary || data.summary === initialData.summary) ? summary : data.summary,
      skills: nextSkills
    });
    onboardingAppliedRef.current = true;
    window.history.replaceState({}, '', window.location.pathname);
  }, [isHydrated, data, setAllData]);

  useEffect(() => {
    if (!isHydrated || templates[data.templateId]) return;
    setTemplateId('Executive');
  }, [isHydrated, data.templateId, setTemplateId]);

  useEffect(() => {
    const updatePreviewMetrics = () => {
      const viewportWidth = previewViewportRef.current?.clientWidth || window.innerWidth;
      const pageWidth = resumePageRef.current?.offsetWidth || 816;
      const pageHeight = resumePageRef.current?.scrollHeight || 1056;
      const gutter = isPreviewOpen ? 32 : 0;
      const availableWidth = Math.max(320, viewportWidth - gutter);
      const fitScale = Math.min(1, availableWidth / pageWidth);
      const scale = isPreviewOpen && !mobileZoom ? fitScale : 1;
      setMobilePreviewMetrics({ scale, width: Math.ceil(pageWidth * scale), height: Math.ceil(pageHeight * scale) });
    };
    updatePreviewMetrics();
    window.addEventListener('resize', updatePreviewMetrics);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updatePreviewMetrics) : null;
    if (observer && resumePageRef.current) observer.observe(resumePageRef.current);
    if (observer && previewViewportRef.current) observer.observe(previewViewportRef.current);
    return () => { window.removeEventListener('resize', updatePreviewMetrics); observer?.disconnect(); };
  }, [isHydrated, isPreviewOpen, mobileZoom, data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); useResumeStore.temporal.getState().undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); useResumeStore.temporal.getState().redo(); }
      // Escape dismisses the ATS grader / AI rewriter / tailor overlays (the jobs
      // modal handles its own Escape via its portal).
      if (e.key === 'Escape') { setIsATSOpen(false); setIsRewriterOpen(false); setIsTailorOpen(false); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleATSGrade = async () => {
    if (!atsJobDesc.trim()) return;
    setIsATSLoading(true);
    setAtsResult(null);
    try {
      const resumePayload = { ...data, personalInfo: { ...data.personalInfo, profilePicture: undefined } };
      const res = await fetch('/api/ai/ats-score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeData: resumePayload, jobDescription: atsJobDesc }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'The AI request timed out. Please try again.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const resData = await res.json();
      setAtsResult(resData);
      if (resData.score >= 85) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0E8A4B', '#2233FF', '#FF4326'] });
    } catch (err: any) { toast.error('ATS Grading failed: ' + err.message); }
    setIsATSLoading(false);
  };

  // ---- Tailor to Job ----
  const handleTailor = async () => {
    if (!tailorJobDesc.trim()) return;
    setIsTailorLoading(true);
    setTailorResult(null);
    setTailorApplied({ summary: false, skills: [], bullets: [] });
    try {
      const resumePayload = { ...data, personalInfo: { ...data.personalInfo, profilePicture: undefined } };
      const res = await fetch('/api/ai/tailor-resume', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeData: resumePayload, jobDescription: tailorJobDesc }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'The AI request timed out. Please try again.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const resData = await res.json();
      setTailorResult(resData);
    } catch (err: any) { toast.error('Tailoring failed: ' + err.message); }
    setIsTailorLoading(false);
  };

  const applyTailorSummary = () => {
    if (!tailorResult?.summary) return;
    updateSummary(tailorResult.summary);
    setTailorApplied(prev => ({ ...prev, summary: true }));
    toast.success('Summary updated');
  };

  const applyTailorSkill = (skill: string) => {
    addSkill(skill);
    setTailorApplied(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    toast.success(`Skill added: ${skill}`);
  };

  const applyTailorBullet = (index: number) => {
    const b = tailorResult?.bulletImprovements?.[index];
    if (!b) return;
    const exp = data.experience.find(e => e.id === b.experienceId);
    if (!exp) { toast.error('That experience entry no longer exists.'); return; }
    // Match the bullet line exactly; the AI was instructed to copy it verbatim.
    const lines = (exp.description || '').split('\n');
    const lineIdx = lines.findIndex(l => l.trim() === (b.original || '').trim());
    if (lineIdx === -1) { toast.error('Could not find the original bullet — it may have been edited.'); return; }
    lines[lineIdx] = b.improved;
    updateExperience(b.experienceId, { description: lines.join('\n') });
    setTailorApplied(prev => ({ ...prev, bullets: [...prev.bullets, index] }));
    toast.success('Bullet updated');
  };

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'rewrite', tone: rewriteTone, jobTitle: data.personalInfo.jobTitle, resumeData: { summary: data.summary, experience: data.experience.map(e => ({ id: e.id, description: e.description })) } }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'Request timed out. Please try again.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const json = await res.json();
      if (json.summary) {
        updateSummary(json.summary);
        if (json.experience) json.experience.forEach((exp: any) => { if (exp.id && exp.description) updateExperience(exp.id, { description: exp.description }); });
      }
    } catch (err: any) { toast.error('Rewrite failed: ' + err.message); }
    setIsRewriting(false);
    setIsRewriterOpen(false);
  };

  const handleSuggestSkills = async () => {
    if (!data.personalInfo.jobTitle) return;
    setIsLoadingSkills(true);
    try {
      const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'skills', jobTitle: data.personalInfo.jobTitle || 'Professional' }) });
      if (!res.ok) {
        const text = await res.text(); let errMsg = '';
        try { const err = JSON.parse(text); errMsg = err.error || `API error: ${res.status}`; } catch (e) { errMsg = text.includes('An error') ? 'Request timed out.' : `API error: ${res.status}`; }
        throw new Error(errMsg);
      }
      const json = await res.json();
      if (json.skills) {
        const existingNames = data.skills.map(s => s.name.toLowerCase());
        setSuggestedSkills(json.skills.filter((s: string) => !existingNames.includes(s.toLowerCase())));
      }
    } catch (err) { console.error('Skill suggestion failed', err); }
    setIsLoadingSkills(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setPublishedUrl('');
    try {
      const res = await fetch('/api/resume/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to publish');
      setPublishedUrl(result.url);
      trackEvent('milestone_published_web', data.templateId);
    } catch (err: any) { toast.error('Publish failed: ' + err.message); }
    finally { setIsPublishing(false); }
  };

  const getTelemetryMetadata = (format: 'pdf' | 'docx') => {
    let length = 0;
    if (data.summary) length += data.summary.length;
    data.experience.forEach(e => { length += (e.description?.length || 0); });
    const skipped_sections: string[] = [];
    if (!data.summary) skipped_sections.push('Summary');
    if (data.experience.length === 0) skipped_sections.push('Experience');
    if (data.education.length === 0) skipped_sections.push('Education');
    if (data.skills.length === 0) skipped_sections.push('Skills');
    return { format, themeColor: data.theme.color, resume_length: length, skipped_sections };
  };

  const handleDocxExport = async () => {
    try {
      if (isRealUserEmail(data.personalInfo.email)) {
        try {
          fetch('/api/crm/optin', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then(r => { if (!r.ok) r.text().then(t => console.error('[CRM opt-in] HTTP', r.status, t)); })
            .catch(err => console.error('[CRM opt-in] Network error:', err));
        } catch (err) { console.error('[CRM opt-in] Sync error:', err); }
      }
      // Capture the rendered template (inlined computed styles + table
      // layout) so the DOCX matches the selected template's design. Falls
      // back to the server-side generic builder when capture is unavailable.
      // previewData carries the user's section visibility + density, so both
      // the capture path and the generic fallback stay consistent.
      let body: any = previewData;
      try {
        const templateHtml = captureTemplateHtml();
        if (templateHtml) {
          body = { data: previewData, templateHtml, templateId: data.templateId };
        }
      } catch (capErr) {
        console.error('[DOCX] template capture failed, using generic builder:', capErr);
      }
      const res = await fetch('/api/export/docx', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error('Failed to generate DOCX');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = data.personalInfo.fullName.replace(/[^\w\s-]/g, '').trim() || 'My';
      const safeRole = data.personalInfo.jobTitle.replace(/[^\w\s-]/g, '').trim() || 'Resume';
      a.download = `${safeName}_${safeRole}_Resume.docx`.replace(/\s+/g, '_');
      a.click();
      URL.revokeObjectURL(url);
      trackEvent('milestone_downloaded', data.templateId, getTelemetryMetadata('docx'));
      setIsJobsModalOpen(true);
    } catch (err: any) { toast.error('DOCX export failed: ' + err.message); }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(''); }
  };

  const triggerPrint = (onAfterPrint?: () => void) => {
    const originalTitle = document.title;
    const safeName = data.personalInfo.fullName.replace(/[\r\n]+/g, ' ').replace(/[^\w\s-]/g, '').trim() || 'My';
    const safeRole = data.personalInfo.jobTitle.replace(/[\r\n]+/g, ' ').replace(/[^\w\s-]/g, '').trim() || 'Resume';
    document.title = `${safeName} - ${safeRole} - Resume`;
    const panel = document.getElementById('preview-panel');
    if (panel) panel.scrollTop = 0;
    window.scrollTo(0, 0);
    document.body.classList.add('printing');
    // window.print() blocks until the native print dialog is dismissed, so the
    // jobs upsell opens after — never racing/covered by the native dialog.
    setTimeout(() => { window.print(); document.body.classList.remove('printing'); document.title = originalTitle; onAfterPrint?.(); }, 150);
  };

  const handleDownload = async () => {
    trackEvent('milestone_downloaded', data.templateId, getTelemetryMetadata('pdf'));
    if (isRealUserEmail(data.personalInfo.email)) {
      try {
        fetch('/api/crm/optin', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(r => { if (!r.ok) r.text().then(t => console.error('[CRM opt-in] HTTP', r.status, t)); })
          .catch(err => console.error('[CRM opt-in] Network error:', err));
      } catch (err) { console.error('[CRM opt-in] Sync error:', err); }
    }
    triggerPrint(() => setIsJobsModalOpen(true));
  };

  if (!isHydrated) return null;


  // ---- Editor section blocks: visibility toggles + up/down ordering ----
  // Each block keeps its own JSX (and mobile accordion state); the editor
  // renders them in sectionOrder via editorSectionIds below.
  const makeSectionTools = (id: ResumeSectionId, opts?: { hideEye?: boolean }) => (
    <SectionHeaderTools
      id={id}
      isHidden={data.sectionVisibility[id] === false}
      isFirst={editorSectionIds[0] === id}
      isLast={editorSectionIds[editorSectionIds.length - 1] === id}
      onToggle={toggleSectionVisibility}
      onMove={moveSection}
      hideEye={opts?.hideEye}
    />
  );

  const sectionBlocks: Record<ResumeSectionId, React.ReactNode> = {
    personal: (
    <SectionAccordion id="personal" tools={makeSectionTools('personal')} icon={User} title="Personal Identity" description="Who are you and what do you do?" defaultOpen>
    <Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={data.personalInfo.fullName} onChange={(e: any) => updatePersonalInfo({ fullName: e.target.value })} placeholder="Jane Doe" />
        <Input label="Job Title" value={data.personalInfo.jobTitle} onChange={(e: any) => updatePersonalInfo({ jobTitle: e.target.value })} placeholder="Senior Designer" />
        <Input 
          label="Email" 
          value={data.personalInfo.email} 
          onChange={(e: any) => updatePersonalInfo({ email: e.target.value })} 
          onBlur={() => {
            if (isRealUserEmail(data.personalInfo?.email)) {
              fetch('/api/crm/optin', {
                method: 'POST',
                keepalive: true,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              }).catch((e) => console.warn('Email blur sync error', e));
            }
          }}
        />
        <Input label="Phone" value={data.personalInfo.phone} onChange={(e: any) => updatePersonalInfo({ phone: e.target.value })} />
        <Input label="Location" value={data.personalInfo.location} onChange={(e: any) => updatePersonalInfo({ location: e.target.value })} />
        <Input label="Website/Portfolio" value={data.personalInfo.website} onChange={(e: any) => updatePersonalInfo({ website: e.target.value })} />
        <div className="col-span-1 sm:col-span-2 mt-2 flex items-center justify-between p-4 border-2 border-[#141312] bg-white hs-sm">
          <div>
            <h4 className="fh font-bold text-sm text-[#141312]">Allow recruiters to find my profile</h4>
            <p className="fm text-[10px] uppercase tracking-[0.14em] text-[#141312]/55">Allow recruiters to find your resume on Cvyon.</p>
          </div>
          <button onClick={() => {
            const newShare = !data.consents.recruiterShare;
            const nextConsents = { ...data.consents, recruiterShare: newShare };
            setConsents(nextConsents);
            if (isRealUserEmail(data.personalInfo.email)) {
              fetch('/api/crm/optin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, consents: nextConsents }),
              }).catch((e) => console.warn('Background consent sync error', e));
            }
          }}
            role="switch"
            aria-checked={data.consents.recruiterShare}
            aria-label="Allow recruiters to find my profile"
            className={cn("w-12 h-6 rounded-full transition-colors relative flex-shrink-0 border-2 border-[#141312]", data.consents.recruiterShare ? 'bg-[#2233FF]' : 'bg-gray-300')}>
            <div className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform", data.consents.recruiterShare ? 'translate-x-6' : 'translate-x-1')} />
          </button>
        </div>
        <div className="col-span-1 sm:col-span-2 mt-2 flex justify-center sm:justify-start">
          <div className="relative group cursor-pointer">
            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => updatePersonalInfo({ profilePicture: reader.result as string });
                  reader.readAsDataURL(file);
                }
              }} />
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#141312]/40 hover:border-[#2233FF] bg-white flex flex-col items-center justify-center overflow-hidden transition-all">
              {data.personalInfo.profilePicture ? (
                <img src={data.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={24} className='text-[#141312]/40 mb-1' />
                  <span className="fm text-[9px] font-bold uppercase tracking-wider text-center px-2 text-[#141312]/40">Add Photo</span>
                </>
              )}
            </div>
            {data.personalInfo.profilePicture && (
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updatePersonalInfo({ profilePicture: undefined }); }}
                className="absolute -top-2 -right-2 bg-[#D8362A] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm hover:bg-[#141312]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1.5">
          <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/60">Professional Summary</label>
          <button onClick={handleGenerateSummary} disabled={isGeneratingSummary}
            className="flex items-center gap-1.5 fm text-[10px] font-bold uppercase tracking-widest text-[#FF4326] border-2 border-[#FF4326] hover:bg-[#FF4326] hover:text-white px-2.5 py-1 transition-colors disabled:opacity-50">
            {isGeneratingSummary ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {isGeneratingSummary ? 'Writing...' : 'Generate with AI'}
          </button>
        </div>
        <textarea
          className="mt-1.5 w-full bg-white border-2 border-[#141312] rounded-none px-4 py-3 text-sm text-[#141312] placeholder:text-[#141312]/35 outline-none transition-shadow focus:shadow-[3px_3px_0_#2233FF] min-h-[100px] resize-none"
          value={data.summary} onChange={(e) => updateSummary(e.target.value)} />
      </div>
    </Card>
    </SectionAccordion>
    ),
    experience: (
    <SectionAccordion id="experience" tools={makeSectionTools('experience')} icon={Briefcase} title="Professional Experience" description="Showcase your career milestones"
      action={<button onClick={addExperience} aria-label="Add experience" className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors shrink-0"><Plus size={18} /></button>}>
    <Droppable droppableId="experience" type="experience">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {data.experience.map((exp, index) => (
            <Draggable key={exp.id} draggableId={exp.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="mb-6 relative group">
                  <div {...provided.dragHandleProps} className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-2 text-[#141312]/30 hover:text-[#141312] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <Card className="mb-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <Input label="Company" value={exp.company} onChange={(e: any) => updateExperience(exp.id, { company: e.target.value })} />
                      <Input label="Role" value={exp.role} onChange={(e: any) => updateExperience(exp.id, { role: e.target.value })} />
                      <Input label="Start Date" value={exp.startDate} onChange={(e: any) => updateExperience(exp.id, { startDate: e.target.value })} />
                      <Input label="End Date" value={exp.endDate} onChange={(e: any) => updateExperience(exp.id, { endDate: e.target.value })} />
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/60">Accomplishments (New line per point)</label>
                        <div className="flex gap-2">
                          <button onClick={() => handlePolishExperience(exp.id, exp.description)} disabled={polishingExpId === exp.id || !exp.description.trim()}
                            className="flex items-center gap-1.5 fm text-[10px] font-bold uppercase tracking-widest text-[#2233FF] border-2 border-[#2233FF] hover:bg-[#2233FF] hover:text-white px-2.5 py-1 transition-colors disabled:opacity-50" title="Polish this text with AI">
                            {polishingExpId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {polishingExpId === exp.id ? 'Polishing...' : 'Polish'}
                          </button>
                          <button onClick={() => handleGenerateExperience(exp.id, exp.role, exp.company)} disabled={generatingExpId === exp.id}
                            className="flex items-center gap-1.5 fm text-[10px] font-bold uppercase tracking-widest text-[#FF4326] border-2 border-[#FF4326] hover:bg-[#FF4326] hover:text-white px-2.5 py-1 transition-colors disabled:opacity-50">
                            {generatingExpId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {generatingExpId === exp.id ? 'Writing...' : 'Generate with AI'}
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="w-full bg-white border-2 border-[#141312] rounded-none px-4 py-3 text-sm text-[#141312] placeholder:text-[#141312]/35 outline-none transition-shadow focus:shadow-[3px_3px_0_#2233FF] min-h-[100px] resize-none"
                        value={exp.description} onChange={(e: any) => updateExperience(exp.id, { description: e.target.value })} />
                    </div>
                    <button onClick={() => removeExperience(exp.id)} className="w-full mt-6 bg-white text-[#D8362A] border-2 border-[#D8362A] py-3 fm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
                      <Trash2 size={16} /> Delete Experience
                    </button>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    </SectionAccordion>
    ),
    education: (
    <SectionAccordion id="education" tools={makeSectionTools('education')} icon={GraduationCap} title="Education" description="Where did you learn your craft?"
      action={<button onClick={addEducation} aria-label="Add education" className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors shrink-0"><Plus size={18} /></button>}>
    <Droppable droppableId="education" type="education">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {data.education.map((edu, index) => (
            <Draggable key={edu.id} draggableId={edu.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="mb-6 relative group">
                  <div {...provided.dragHandleProps} className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-2 text-[#141312]/30 hover:text-[#141312] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <Card className="mb-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-1 sm:col-span-2">
                        <Input label="School/University" value={edu.school} onChange={(e: any) => updateEducation(edu.id, { school: e.target.value })} />
                      </div>
                      <Input label="Degree" value={edu.degree} onChange={(e: any) => updateEducation(edu.id, { degree: e.target.value })} />
                      <Input label="Graduation Year" value={edu.graduationYear} onChange={(e: any) => updateEducation(edu.id, { graduationYear: e.target.value })} />
                    </div>
                    <button onClick={() => removeEducation(edu.id)} className="w-full mt-6 bg-white text-[#D8362A] border-2 border-[#D8362A] py-3 fm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
                      <Trash2 size={16} /> Delete Education
                    </button>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    </SectionAccordion>
    ),
    skills: (
    <SectionAccordion id="skills" tools={makeSectionTools('skills')} icon={Wrench} title="Skill Arsenal" description="What tools do you master?">
    <Card>
      <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-white border-2 border-[#141312] rounded-none px-4 py-3 text-sm text-[#141312] placeholder:text-[#141312]/35 outline-none transition-shadow focus:shadow-[3px_3px_0_#2233FF]"
          placeholder="Add a skill (e.g. TypeScript, AWS)" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
        <button type="submit" className="bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs px-6 py-3 fm text-sm font-bold uppercase tracking-wider">Add</button>
      </form>
      <Droppable droppableId="skills" type="skills" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-3">
            {data.skills.map((s, index) => (
              <Draggable key={s.id} draggableId={s.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} className="relative flex items-center">
                    <div {...provided.dragHandleProps} className="absolute left-[-8px] text-[#141312]/30 hover:text-[#141312] cursor-grab active:cursor-grabbing z-10">
                      <GripVertical size={14} />
                    </div>
                    <span className="group flex items-center gap-2 bg-white border-2 border-[#141312] pl-6 pr-2 py-2 fm text-xs font-bold uppercase tracking-wider text-[#141312] transition-all">
                      {s.name}
                      <button onClick={() => removeSkill(s.id)} className="p-1 rounded-full text-[#141312]/40 hover:text-[#D8362A] hover:bg-[#D8362A]/10 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Card>

    {/* Smart Skill Suggestions */}
    <div className="mb-6">
      <button onClick={handleSuggestSkills} disabled={isLoadingSkills || !data.personalInfo.jobTitle}
        className="flex items-center gap-2 fm text-[11px] font-bold uppercase tracking-widest text-[#FF4326] border-2 border-[#FF4326] hover:bg-[#FF4326] hover:text-white px-4 py-2.5 transition-colors disabled:opacity-40">
        {isLoadingSkills ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {isLoadingSkills ? 'Finding skills...' : 'Suggest Skills with AI'}
      </button>
      {suggestedSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedSkills.map((skill, i) => (
            <button key={i} onClick={() => { addSkill(skill); setSuggestedSkills(prev => prev.filter(s => s !== skill)); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] fm text-xs font-bold uppercase tracking-wider text-[#141312] transition-all">
              <Plus size={12} /> {skill}
            </button>
          ))}
        </div>
      )}
    </div>
    </SectionAccordion>
    ),
    projects: data.showProjects ? (
      <SectionAccordion id="projects" tools={makeSectionTools('projects')} icon={FolderOpen} title="Projects" description="Showcase your key projects" onRemove={toggleProjects}
        action={<button onClick={addProject} aria-label="Add project" className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors shrink-0"><Plus size={18} /></button>}>
        {(data.projects || []).map((proj) => (
          <Card key={proj.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input label="Project Name" value={proj.name} onChange={(e: any) => updateProject(proj.id, { name: e.target.value })} />
              <Input label="Link / URL" value={proj.link} onChange={(e: any) => updateProject(proj.id, { link: e.target.value })} />
            </div>
            <Input label="Description" value={proj.description} onChange={(e: any) => updateProject(proj.id, { description: e.target.value })} />
            <button onClick={() => removeProject(proj.id)} className="w-full mt-6 bg-white text-[#D8362A] border-2 border-[#D8362A] py-3 fm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Project
            </button>
          </Card>
        ))}
      </SectionAccordion>
    ) : null,
    certifications: data.showCertifications ? (
      <SectionAccordion id="certifications" tools={makeSectionTools('certifications')} icon={Award} title="Certifications" description="Official recognitions" onRemove={toggleCertifications}
        action={<button onClick={addCertification} aria-label="Add certification" className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors shrink-0"><Plus size={18} /></button>}>
        {(data.certifications || []).map((cert) => (
          <Card key={cert.id}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input label="Certification Name" value={cert.name} onChange={(e: any) => updateCertification(cert.id, { name: e.target.value })} />
              <Input label="Issuer" value={cert.issuer} onChange={(e: any) => updateCertification(cert.id, { issuer: e.target.value })} />
              <Input label="Date Earned" value={cert.date} onChange={(e: any) => updateCertification(cert.id, { date: e.target.value })} />
            </div>
            <button onClick={() => removeCertification(cert.id)} className="w-full mt-6 bg-white text-[#D8362A] border-2 border-[#D8362A] py-3 fm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Certification
            </button>
          </Card>
        ))}
      </SectionAccordion>
    ) : null,
    references: data.showReferences ? (
      <SectionAccordion id="references" tools={makeSectionTools('references')} icon={Users} title="References" description="People who vouch for you" onRemove={toggleReferences}
        action={<button onClick={addReference} aria-label="Add reference" className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors shrink-0"><Plus size={18} /></button>}>
        {(data.references || []).map((ref) => (
          <Card key={ref.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input label="Name" value={ref.name} onChange={(e: any) => updateReference(ref.id, { name: e.target.value })} />
              <Input label="Title" value={ref.title} onChange={(e: any) => updateReference(ref.id, { title: e.target.value })} />
              <Input label="Company" value={ref.company} onChange={(e: any) => updateReference(ref.id, { company: e.target.value })} />
              <Input label="Contact (Email/Phone)" value={ref.contact} onChange={(e: any) => updateReference(ref.id, { contact: e.target.value })} />
            </div>
            <button onClick={() => removeReference(ref.id)} className="w-full mt-6 bg-white text-[#D8362A] border-2 border-[#D8362A] py-3 fm text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Reference
            </button>
          </Card>
        ))}
      </SectionAccordion>
    ) : null,
    'cover-letter': (
      <SectionAccordion id="cover-letter" tools={makeSectionTools('cover-letter', { hideEye: true })} icon={FileText} title="Cover Letter" description="Generate a tailored cover letter.">
        <CoverLetterTab />
      </SectionAccordion>
    ),
  };

  const SelectedTemplate = templates[data.templateId] || templates.Executive;

  return (
    <main className={cn("flex flex-col lg:flex-row min-h-screen w-full overflow-x-clip font-sans selection:bg-black selection:text-white print:block print:h-auto print:overflow-visible", 'bg-[#E8E7E1] text-[#141312] cv-riso')}>
      <h1 className="sr-only">Free Resume Builder — create, edit, and download your resume</h1>

      {/* EDITOR PANEL */}
      <section className="w-full lg:w-[45%] border-r-[3px] border-[#141312] print:hidden px-6 py-8 lg:px-10 lg:py-12 flex-shrink-0 relative bg-white">
        <div className="max-w-xl mx-auto pb-24 lg:pb-0">

          <header className="sticky top-0 z-30 -mx-6 -mt-8 px-6 py-4 lg:-mx-10 lg:-mt-12 lg:px-10 lg:py-4 bg-white/95 backdrop-blur-md border-b-2 border-[#141312] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-8 transition-all">
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Image src="/logo-light-no-background.png" alt="Cvyon" width={200} height={65} priority className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-all" />
              </Link>
              <div className="flex items-center gap-2 mt-1">
                <p className="fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/50">Premium & Forever Free</p>
                <span className="text-[#141312]/30">•</span>
                <span className="flex items-center gap-1 text-[10px] fm font-semibold text-[#10B981]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Auto-saved
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LiveAtsScore />
              <div className="hidden sm:flex items-center gap-1 border-l-2 border-[#141312]/20 pl-2">
                <button onClick={() => useResumeStore.temporal.getState().undo()} className="p-2 border-2 border-[#141312] bg-white hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors text-[#141312]" title="Undo (Ctrl+Z)">
                  <Undo2 size={16} />
                </button>
                <button onClick={() => useResumeStore.temporal.getState().redo()} className="p-2 border-2 border-[#141312] bg-white hover:bg-[#141312] hover:text-[#E8E7E1] transition-colors text-[#141312]" title="Redo (Ctrl+Y)">
                  <Redo2 size={16} />
                </button>
              </div>
              <button onClick={handleDownload} className="group flex items-center gap-2 bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs px-4 py-2.5 fm text-xs font-bold uppercase tracking-widest active:translate-y-[2px] active:shadow-none transition-all">
                <Download size={15} className="group-hover:-translate-y-0.5 transition-transform" /> Download PDF
              </button>
              <button onClick={handleDocxExport} className="flex group items-center gap-2 bg-[#2233FF] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs px-4 py-2.5 fm text-xs font-bold uppercase tracking-widest active:translate-y-[2px] active:shadow-none transition-all" title="Download Word Document">
                <FileText size={15} className="group-hover:-translate-y-0.5 transition-transform" /> Download DOCX
              </button>
            </div>
          </header>


          {publishedUrl && (
            <div className="mb-8 p-4 bg-white border-[3px] border-[#0E8A4B] hs-sm flex items-center justify-between">
              <div>
                <p className="text-[#0E8A4B] fh font-bold text-sm">Your resume is live!</p>
                <a href={publishedUrl} target="_blank" rel="noreferrer" className="text-[#0E8A4B] fm text-xs hover:underline mt-1 block">{publishedUrl}</a>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(publishedUrl); toast.success('Copied!'); }} className="px-3 py-1.5 bg-[#0E8A4B] text-white fm text-[10px] font-bold uppercase tracking-widest hover:bg-[#141312] transition-colors">
                Copy link
              </button>
            </div>
          )}

          {/* AI Tools Bar */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setIsATSOpen(true)} className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#141312] bg-white text-[#141312] hs-sm fm text-[11px] font-bold uppercase tracking-[0.16em] transition-all hover:bg-[#0E8A4B] hover:text-white hover:border-[#0E8A4B]">
              <BarChart3 size={14} /> ATS Grader
            </button>
            <button onClick={() => setIsRewriterOpen(true)} className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#141312] bg-white text-[#141312] hs-sm fm text-[11px] font-bold uppercase tracking-[0.16em] transition-all hover:bg-[#FF4326] hover:text-[#141312] hover:border-[#FF4326]">
              <RefreshCw size={14} /> AI Rewriter
            </button>
            <button onClick={() => { setTailorResult(null); setTailorApplied({ summary: false, skills: [], bullets: [] }); setIsTailorOpen(true); }} className="flex items-center gap-2 px-4 py-2.5 border-2 border-[#141312] bg-white text-[#141312] hs-sm fm text-[11px] font-bold uppercase tracking-[0.16em] transition-all hover:bg-[#2233FF] hover:text-white hover:border-[#2233FF]">
              <Target size={14} /> Tailor to Job
            </button>
          </div>

          {/* Template Gallery Button */}
          <div className="mb-12">
            <button onClick={() => setIsGalleryOpen(true)} className="w-full relative overflow-hidden bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] hs p-4 sm:p-6 font-bold flex items-center justify-between group transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
              <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-[#FF4326] border-2 border-[#E8E7E1] flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <Layout className="text-[#141312] w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="fd text-lg sm:text-xl tracking-tight leading-none mb-1">Template Gallery</span>
                  <span className="hidden sm:block fm text-[10px] text-[#E8E7E1]/60 font-bold tracking-[0.18em] uppercase">{Object.keys(templates).length} ATS-optimized layouts</span>
                  <span className="sm:hidden fm text-[9px] text-[#E8E7E1]/60 font-bold uppercase">{Object.keys(templates).length} layouts</span>
                </div>
              </div>
              <div className="relative z-10 bg-[#E8E7E1] text-[#141312] px-4 py-2.5 fm text-[10px] sm:text-xs uppercase tracking-widest font-black group-hover:bg-[#FF4326] group-hover:text-[#141312] transition-colors flex items-center gap-2">
                <span className="hidden sm:inline">Change Design</span>
                <Paintbrush size={16} className="block sm:hidden" />
              </div>
            </button>
          </div>

          {/* Theme Color Picker */}
          <SectionAccordion id="theme" icon={Paintbrush} title="Theme Accent" description="Select a global accent color.">
          <Card>
            <div className="flex flex-wrap gap-3">
              {['#000000', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0d9488', '#475569'].map((hex) => (
                <button key={hex} onClick={() => setThemeColor(hex)}
                  className={cn("w-10 h-10 rounded-full shadow-sm border-2 transition-transform", data.theme?.color === hex ? "border-[#141312] scale-110" : "border-transparent hover:scale-105")}
                  style={{ backgroundColor: hex }} aria-label={`Select color ${hex}`} />
              ))}
              <div className="relative">
                <input type="color" value={data.theme?.color || '#2563eb'} onChange={(e) => setThemeColor(e.target.value)} className="w-10 h-10 rounded-full cursor-pointer opacity-0 absolute inset-0 z-10" />
                <div className={cn("w-10 h-10 rounded-full shadow-sm border-2 flex items-center justify-center text-xl font-bold bg-[#FF4326]", !['#000000', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0d9488', '#475569'].includes(data.theme?.color || '') ? "border-[#141312] scale-110" : "border-transparent")}>
                  <span className="text-white drop-shadow-md">+</span>
                </div>
              </div>
            </div>
          </Card>
          </SectionAccordion>

          {/* Density control — persisted in resume state, applies to preview, PDF, DOCX */}
          <SectionAccordion id="density" icon={Layout} title="Resume Density" description="Comfortable or compact spacing">
          <Card>
            <div className="grid grid-cols-2 gap-3">
              {(['comfortable', 'compact'] as const).map((d) => (
                <button key={d} type="button" onClick={() => setDensity(d)}
                  className={cn("px-4 py-3 fm text-[11px] font-bold uppercase tracking-[0.16em] border-2 transition-all",
                    data.density === d
                      ? "bg-[#141312] text-[#E8E7E1] border-[#141312] hs-sm"
                      : "bg-white text-[#141312]/60 border-[#141312]/30 hover:border-[#141312] hover:text-[#141312]")}>
                  {d}
                </button>
              ))}
            </div>
            <p className="fm text-[10px] text-[#141312]/45 mt-3 leading-relaxed">Compact tightens spacing and type size across the on-screen preview, PDF and DOCX exports.</p>
          </Card>
          </SectionAccordion>

          <DragDropContext onDragEnd={onDragEnd}>

            <ImportResume />

            {/* Editor sections — rendered in the user's chosen order.
                Visibility toggles strip sections from the output via previewData. */}
            {editorSectionIds.map((id) => (
              <React.Fragment key={id}>{sectionBlocks[id]}</React.Fragment>
            ))}

            {/* Add New Sections */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t-2 border-[#141312]/20 flex-wrap">
              {!data.showProjects && (
                <button onClick={toggleProjects} className="flex-1 min-w-[200px] py-4 bg-white border-2 border-dashed border-[#141312]/50 hover:border-[#141312] hover:bg-[#141312]/5 rounded-none fm text-xs font-bold uppercase tracking-widest text-[#141312]/70 hover:text-[#141312] flex items-center justify-center gap-2 transition-all">
                  <Plus size={18} /> Add Projects
                </button>
              )}
              {!data.showCertifications && (
                <button onClick={toggleCertifications} className="flex-1 min-w-[200px] py-4 bg-white border-2 border-dashed border-[#141312]/50 hover:border-[#141312] hover:bg-[#141312]/5 rounded-none fm text-xs font-bold uppercase tracking-widest text-[#141312]/70 hover:text-[#141312] flex items-center justify-center gap-2 transition-all">
                  <Plus size={18} /> Add Certifications
                </button>
              )}
              {!data.showReferences && (
                <button onClick={toggleReferences} className="flex-1 min-w-[200px] py-4 bg-white border-2 border-dashed border-[#141312]/50 hover:border-[#141312] hover:bg-[#141312]/5 rounded-none fm text-xs font-bold uppercase tracking-widest text-[#141312]/70 hover:text-[#141312] flex items-center justify-center gap-2 transition-all">
                  <Plus size={18} /> Add References
                </button>
              )}
            </div>

            {/* Custom Sections */}
            {data.customSections?.map((section: any, sectionIndex: number) => (
              <div key={section.id} className="mt-8">
                <div className="flex items-center justify-between mb-4 bg-white p-4 border-[3px] border-[#141312] hs-sm">
                  <input type="text" value={section.title} onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                    className="fd uppercase tracking-tight text-lg bg-transparent border-none outline-none focus:ring-0 flex-1 text-[#141312]" />
                  <button onClick={() => removeCustomSection(section.id)} className="text-[#141312]/40 hover:text-[#D8362A] transition-colors p-2"><Trash2 size={16} /></button>
                </div>
                <Droppable droppableId={`custom-${section.id}`} type="custom-item">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {section.items.map((item: any, index: number) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={cn("bg-white border-2 border-[#141312] hs-sm rounded-none p-4 sm:p-5 relative group transition-all", snapshot.isDragging ? 'border-[#2233FF] shadow-[6px_6px_0_#2233FF] scale-[1.02] z-50' : 'hover:shadow-none')}>
                              <div {...provided.dragHandleProps} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#141312]/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-grab active:cursor-grabbing hover:text-[#141312]">
                                <GripVertical size={16} />
                              </div>
                              <div className="pl-8">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                  <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                      <Input label="Title" value={item.title} onChange={(e: any) => updateCustomSectionItem(section.id, item.id, { title: e.target.value })} placeholder="Project Name, Language, etc." />
                                      <Input label="Subtitle" value={item.subtitle} onChange={(e: any) => updateCustomSectionItem(section.id, item.id, { subtitle: e.target.value })} placeholder="Role, Level, etc." />
                                    </div>
                                    <Input label="Date/Info" value={item.date} onChange={(e: any) => updateCustomSectionItem(section.id, item.id, { date: e.target.value })} placeholder="2024, Fluent, etc." />
                                  </div>
                                  <button onClick={() => removeCustomSectionItem(section.id, item.id)} className="text-[#141312]/40 hover:text-[#D8362A] transition-colors p-2 mt-6"><Trash2 size={16} /></button>
                                </div>
                                <div className="mt-3">
                                  <label className="block fm text-[10px] font-bold uppercase tracking-[0.2em] text-[#141312]/60 mb-2">Description</label>
                                  <textarea value={item.description} onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
                                    className="w-full bg-white border-2 border-[#141312] rounded-none p-3 min-h-[80px] outline-none transition-shadow focus:shadow-[3px_3px_0_#2233FF] resize-y text-sm text-[#141312]" placeholder="Describe this item..." />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <button onClick={() => addCustomSectionItem(section.id)} className="w-full py-3 bg-white border-2 border-dashed border-[#141312]/50 hover:border-[#141312] hover:bg-[#141312]/5 rounded-none fm text-xs font-bold uppercase tracking-widest text-[#141312]/70 hover:text-[#141312] flex items-center justify-center gap-2 transition-all">
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

            <div className="mt-8">
              <button onClick={addCustomSection} className="w-full py-4 bg-white border-2 border-dashed border-[#2233FF] hover:bg-[#2233FF]/5 rounded-none fm text-xs font-bold uppercase tracking-widest text-[#2233FF] flex items-center justify-center gap-2 transition-all">
                <Plus size={18} /> Create Custom Section
              </button>
            </div>

            {/* Newsletter */}
            <div className="mt-16 pt-8 border-t-2 border-[#141312]/20">
              <NewsletterCapture source="main_editor" />
            </div>

            {/* Footer Links */}
            <footer className="mt-12 pt-6 border-t-2 border-[#141312]/20 flex flex-wrap gap-4 fm text-xs font-bold uppercase tracking-widest justify-center pb-8 text-[#141312]/55">
              <Link href="/blog" className="hover:text-[#FF4326] transition-colors">Career Blog</Link>
              <span>&bull;</span>
              <Link href="/recruiter" className="hover:text-[#FF4326] transition-colors">Recruiter Portal</Link>
              <span>&bull;</span>
              <Link href="/privacy" className="hover:text-[#FF4326] transition-colors">Privacy Policy & GDPR</Link>
              <span>&bull;</span>
              <Link href="/manage-data" className="hover:text-[#FF4326] transition-colors">Manage Data</Link>
            </footer>

          </DragDropContext>
        </div>
      </section>

      {/* MOBILE EDIT/PREVIEW SWITCH — one pane at a time below lg.
          Positioning is inline (not Tailwind utilities) so it can never be
          dropped by the utility scanner: fixed bottom-center. */}
      <div className="lg:hidden fixed z-40 print:hidden w-full max-w-sm px-6"
        style={{ position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="grid grid-cols-2 bg-white border-[3px] border-[#141312] hs overflow-hidden" role="tablist" aria-label="Editor view">
          <button
            role="tab"
            aria-selected={!isPreviewOpen}
            onClick={() => setIsPreviewOpen(false)}
            className={cn("flex items-center justify-center gap-2 px-4 py-3.5 fm text-xs font-bold uppercase tracking-widest transition-colors", !isPreviewOpen ? "bg-[#141312] text-[#E8E7E1]" : "bg-white text-[#141312]/50 hover:text-[#141312]")}>
            <Pencil size={15} /> Edit
          </button>
          <button
            role="tab"
            aria-selected={isPreviewOpen}
            onClick={() => { trackEvent('milestone_previewed', data.templateId); setIsPreviewOpen(true); }}
            className={cn("flex items-center justify-center gap-2 px-4 py-3.5 fm text-xs font-bold uppercase tracking-widest transition-colors border-l-[3px] border-[#141312]", isPreviewOpen ? "bg-[#141312] text-[#E8E7E1]" : "bg-white text-[#141312]/50 hover:text-[#141312]")}>
            <Eye size={15} /> Preview
          </button>
        </div>
      </div>

      {/* PREVIEW PANEL — NON-STICKY, scrolls naturally with the page */}
      <section
        ref={previewViewportRef}
        id="preview-panel"
        className={cn(
          "flex-1 bg-[#E8E7E1] p-0 lg:p-12 print:p-0 print:bg-white flex lg:justify-center items-start print-safe-container",
          isPreviewOpen && !mobileZoom ? "overflow-x-hidden justify-center" : "overflow-x-auto",
          isPreviewOpen ? "fixed inset-0 z-50 flex-col h-screen overflow-y-auto custom-scrollbar" : "hidden lg:flex"
        )}>

        {/* Mobile Modal Actions */}
        {isPreviewOpen && (
          <div className="fixed bottom-0 left-0 w-full bg-white p-3 flex gap-1.5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 lg:hidden print:hidden border-t-[3px] border-[#141312]">
            <button onClick={() => setIsPreviewOpen(false)} className="bg-white border-2 border-[#141312] hs-sm text-[#141312] px-3 py-3 fm text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-1 active:translate-y-[2px] active:shadow-none transition-all">
              <X size={14} /> Edit
            </button>
            <button onClick={() => setMobileZoom(!mobileZoom)} className="bg-white border-2 border-[#141312] hs-sm text-[#141312] px-3 py-3 fm text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-1 active:translate-y-[2px] active:shadow-none transition-all">
              {mobileZoom ? <ZoomOut size={14} /> : <ZoomIn size={14} />} Zoom
            </button>
            <PDFDownloadButton
              TemplateComponent={SelectedTemplate}
              data={previewData}
              themeColor={data.theme?.color || '#2563eb'}
              onDownloadComplete={() => setIsJobsModalOpen(true)}
              className="flex-1 bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs py-3 fm text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-1 active:translate-y-[2px] active:shadow-none transition-all"
            />
            <button onClick={handleDocxExport} className="bg-[#2233FF] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs px-3.5 py-3 fm text-[10px] font-bold uppercase tracking-widest flex justify-center items-center gap-1 active:translate-y-[2px] active:shadow-none transition-all">
              <FileText size={14} /> DOCX
            </button>
          </div>
        )}


        <div
          className={cn("preview-scale-frame shrink-0 transition-all print:block", isPreviewOpen ? "mb-32 mt-8 lg:mt-4 mx-auto" : "mx-auto lg:mx-0")}
          style={isPreviewOpen ? { width: mobilePreviewMetrics.width, height: mobilePreviewMetrics.height } : undefined}
        >
          <div
            ref={resumePageRef}
            className="w-[816px] origin-top-left shrink-0 shadow-2xl print:shadow-none bg-white transition-transform print-safe-content"
            style={{ transform: isPreviewOpen && mobilePreviewMetrics.scale !== 1 ? `scale(${mobilePreviewMetrics.scale})` : undefined, '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}
          >
            <ErrorBoundary fallbackTitle="Resume Preview Error" fallbackMessage="Could not render the current template. Try selecting another template or verifying your text inputs.">
              <HTMLPreview Tmpl={htmlTemplates[data.templateId as keyof typeof htmlTemplates]} data={previewData} />
            </ErrorBoundary>
          </div>
        </div>
      </section>

      {/* TEMPLATE GALLERY MODAL */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[400] bg-[#E8E7E1] flex flex-col print:hidden">
          <div className="p-6 lg:p-8 border-b-[3px] border-[#141312] flex justify-between items-center bg-[#E8E7E1] z-10 relative">
            <div>
              <h2 className="fd text-3xl font-black uppercase tracking-tight leading-none text-[#141312]">Template Gallery</h2>
              <p className="fm text-[10px] font-bold uppercase tracking-widest text-[#141312]/55 mt-2">See your exact resume in {Object.keys(templates).length} ATS-optimized styles</p>
            </div>
            <button onClick={() => setIsGalleryOpen(false)} className="p-4 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] rounded-none transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-[#E8E7E1]">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
              {(Object.keys(templates) as TemplateKey[]).map((key) => {
                const isActive = data.templateId === key;
                return (
                  <button key={key} onClick={() => { trackEvent('template_selected', key); setTemplateId(key); setIsGalleryOpen(false); }}
                    className={cn("flex flex-col text-left group bg-white border-[3px] rounded-none overflow-hidden transition-all relative", isActive ? "border-[#2233FF] shadow-[8px_8px_0_#2233FF] scale-[1.02]" : "border-[#141312] hs hover:-translate-y-1")}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '300px 400px' }}>
                    <HTMLThumbnail Tmpl={htmlTemplates[key as keyof typeof htmlTemplates]} data={data} />
                    {isActive && (
                      <div className="absolute top-4 right-4 bg-[#2233FF] text-[#E8E7E1] border-2 border-[#141312] px-3 py-1.5 fm text-[9px] font-black uppercase tracking-widest rounded-none shadow-lg z-10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                      </div>
                    )}
                    <div className="p-4 border-t-2 border-[#141312] bg-white z-10 w-full flex items-center justify-between">
                      <div className="truncate pr-2">
                        <h3 className="fh font-bold text-sm lg:text-base leading-tight truncate text-[#141312]">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ATS GRADER MODAL */}
      {isATSOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm overflow-y-auto print:hidden">
          <div className="min-h-screen px-4 flex items-center justify-center py-10">
            <div className="rounded-none border-[3px] border-[#141312] hs max-w-2xl w-full p-6 sm:p-8 flex flex-col relative bg-white text-[#141312]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="fd text-2xl font-black leading-tight flex items-center gap-2"><BarChart3 className="text-[#0E8A4B]" /> ATS Grader</h2>
                  <p className="fm text-[11px] uppercase tracking-widest text-[#141312]/55 mt-1">Paste the job description to see how well your resume matches.</p>
                </div>
                <button onClick={() => setIsATSOpen(false)} className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] rounded-none transition-colors"><X size={20} /></button>
              </div>

              <textarea
                className="w-full bg-white border-2 border-[#141312] rounded-none p-4 text-sm min-h-[150px] mb-4 outline-none transition-shadow focus:shadow-[3px_3px_0_#0E8A4B] resize-none text-[#141312]"
                placeholder="Paste the target job description here..." value={atsJobDesc} onChange={(e) => setAtsJobDesc(e.target.value)} />

              <button onClick={handleATSGrade} disabled={isATSLoading || !atsJobDesc.trim()}
                className="w-full bg-[#141312] hover:bg-[#0E8A4B] hover:border-[#0E8A4B] disabled:opacity-50 text-[#E8E7E1] border-[3px] border-[#141312] hs py-4 fm font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 mb-6">
                {isATSLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isATSLoading ? 'Analyzing Resume...' : 'Analyze & Grade Resume'}
              </button>

              {atsResult && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-[#141312]/10">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="289.026" strokeDashoffset={289.026 * (1 - atsResult.score / 100)} className={atsResult.score >= 80 ? 'text-[#0E8A4B]' : atsResult.score >= 60 ? 'text-[#FFB800]' : 'text-[#D8362A]'} strokeLinecap="round" />
                      </svg>
                      <span className="fd text-2xl font-black">{atsResult.score}</span>
                    </div>
                    <div>
                      <h3 className="fh text-xl font-bold">Match Score</h3>
                      <p className="fm text-xs uppercase tracking-wider text-[#141312]/60">
                        {atsResult.score >= 80 ? 'Excellent match! You are highly qualified.' : atsResult.score >= 60 ? 'Good match. Consider adding missing keywords.' : 'Low match. Significant tailoring recommended.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border-2 border-[#0E8A4B]">
                      <h4 className="fh font-bold text-[#0E8A4B] mb-2 flex items-center gap-2"><Plus size={16} /> Strengths</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">{atsResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-white border-2 border-[#D8362A]">
                      <h4 className="fh font-bold text-[#D8362A] mb-2 flex items-center gap-2"><RefreshCw size={16} /> Missing Keywords</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">{atsResult.missingKeywords?.map((k: string, i: number) => <li key={i}>{k}</li>)}</ul>
                    </div>
                  </div>

                  <div className="p-4 bg-white border-2 border-[#2233FF]">
                    <h4 className="fh font-bold text-[#2233FF] mb-2 flex items-center gap-2"><Sparkles size={16} /> Actionable Tips</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">{atsResult.tips?.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                  </div>

                  <button onClick={() => { setIsATSOpen(false); setIsRewriterOpen(true); }}
                    className="w-full bg-[#FF4326] hover:bg-[#141312] hover:text-[#E8E7E1] text-[#141312] border-[3px] border-[#141312] hs py-3 fm font-bold uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4">
                    <RefreshCw size={14} /> Implement Recommendations with AI Rewriter
                  </button>

                  {atsResult.score >= 85 && (
                    <button onClick={() => {
                      const text = `I just scored a ${atsResult.score}% on my resume with Cvyon! Check out this free AI ATS Grader at cvyon.com`;
                      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                      className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white border-2 border-[#141312] py-3 fm font-bold uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4">
                      <Share2 size={14} /> Share Score to LinkedIn
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* JOBS MODAL (after download) */}
      <JobsModal isOpen={isJobsModalOpen} onClose={() => setIsJobsModalOpen(false)} />

      {/* AI REWRITER MODAL */}
      {isRewriterOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm overflow-y-auto print:hidden">
          <div className="min-h-screen px-4 flex items-center justify-center py-10">
            <div className="rounded-none border-[3px] border-[#141312] hs max-w-md w-full p-6 sm:p-8 relative bg-white text-[#141312]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="fd text-2xl font-black leading-tight flex items-center gap-2"><RefreshCw className="text-[#FF4326]" /> AI Rewriter</h2>
                <button onClick={() => setIsRewriterOpen(false)} className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] rounded-none transition-colors"><X size={20} /></button>
              </div>
              <p className="text-sm mb-6 text-[#141312]/65">Instantly rewrite your Summary and Experience sections to match a specific tone or career level.</p>
              <div className="mb-6">
                <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-[#141312]/60">Target Tone / Style</label>
                <div className="relative">
                  <select value={rewriteTone} onChange={(e) => setRewriteTone(e.target.value)}
                    className="w-full appearance-none bg-white border-2 border-[#141312] rounded-none px-4 py-3 pr-10 text-sm font-bold text-[#141312] outline-none transition-shadow focus:shadow-[3px_3px_0_#FF4326] cursor-pointer">
                    <option value="Executive">Executive & Strategic</option>
                    <option value="Creative">Creative & Dynamic</option>
                    <option value="Technical">Technical & Analytical</option>
                    <option value="Entry-Level">Entry-Level & Enthusiastic</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#141312]/40" />
                </div>
              </div>
              <button onClick={handleRewrite} disabled={isRewriting}
                className="w-full bg-[#141312] hover:bg-[#FF4326] hover:text-[#141312] disabled:opacity-50 text-[#E8E7E1] border-[3px] border-[#141312] hs py-4 fm font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2">
                {isRewriting ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isRewriting ? 'Rewriting Resume...' : 'Rewrite Entire Resume'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAILOR TO JOB MODAL */}
      {isTailorOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm overflow-y-auto print:hidden">
          <div className="min-h-screen px-4 flex items-center justify-center py-10">
            <div className="rounded-none border-[3px] border-[#141312] hs max-w-2xl w-full p-6 sm:p-8 flex flex-col relative bg-white text-[#141312]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="fd text-2xl font-black leading-tight flex items-center gap-2"><Target className="text-[#2233FF]" /> Tailor to Job</h2>
                <button onClick={() => setIsTailorOpen(false)} className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] rounded-none transition-colors"><X size={20} /></button>
              </div>
              <p className="text-sm mb-6 text-[#141312]/65">Paste the job description and AI will rewrite your summary, suggest keyword-aligned skills, and sharpen your experience bullets — using only what's already on your resume. Nothing is invented.</p>
              <label className="fm text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-[#141312]/60">Job Description</label>
              <textarea
                value={tailorJobDesc}
                onChange={(e) => setTailorJobDesc(e.target.value)}
                placeholder="Paste the job posting here..."
                rows={7}
                maxLength={15000}
                className="w-full bg-white border-2 border-[#141312] rounded-none px-4 py-3 text-sm text-[#141312] outline-none transition-shadow focus:shadow-[3px_3px_0_#2233FF] resize-y mb-4"
              />
              <button onClick={handleTailor} disabled={isTailorLoading || !tailorJobDesc.trim()}
                className="w-full bg-[#2233FF] hover:bg-[#141312] disabled:opacity-50 text-[#E8E7E1] border-[3px] border-[#141312] hs py-4 fm font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 mb-6">
                {isTailorLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isTailorLoading ? 'Tailoring Resume...' : 'Tailor My Resume'}
              </button>

              {tailorResult && (
                <div className="space-y-6">
                  {/* Rewritten summary */}
                  {tailorResult.summary && (
                    <div className="border-2 border-[#141312] bg-white hs-sm p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#141312]/60">Rewritten Summary</h3>
                        <button onClick={applyTailorSummary} disabled={tailorApplied.summary}
                          className="fm text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-2 border-[#0E8A4B] text-[#0E8A4B] hover:bg-[#0E8A4B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#0E8A4B]">
                          {tailorApplied.summary ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                      <p className="text-sm text-[#141312]/80 leading-relaxed whitespace-pre-wrap">{tailorResult.summary}</p>
                    </div>
                  )}

                  {/* Skills to add */}
                  {Array.isArray(tailorResult.skillsToAdd) && tailorResult.skillsToAdd.length > 0 && (
                    <div className="border-2 border-[#141312] bg-white hs-sm p-5">
                      <h3 className="fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#141312]/60 mb-3">Skills to Add</h3>
                      <div className="flex flex-wrap gap-2">
                        {tailorResult.skillsToAdd.map((skill: string) => {
                          const applied = tailorApplied.skills.includes(skill);
                          return (
                            <button key={skill} onClick={() => !applied && applyTailorSkill(skill)} disabled={applied}
                              className={cn("fm text-[11px] font-bold px-3 py-1.5 border-2 transition-colors",
                                applied ? "border-[#0E8A4B] bg-[#0E8A4B]/10 text-[#0E8A4B]/60 cursor-default"
                                        : "border-[#141312] bg-white text-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1]")}>
                              {applied ? `${skill} ✓` : `+ ${skill}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Improved bullets */}
                  {Array.isArray(tailorResult.bulletImprovements) && tailorResult.bulletImprovements.length > 0 && (
                    <div className="border-2 border-[#141312] bg-white hs-sm p-5">
                      <h3 className="fm text-[11px] font-bold uppercase tracking-[0.2em] text-[#141312]/60 mb-3">Sharpened Experience Bullets</h3>
                      <div className="space-y-4">
                        {tailorResult.bulletImprovements.map((b: any, i: number) => {
                          const applied = tailorApplied.bullets.includes(i);
                          const exp = data.experience.find(e => e.id === b.experienceId);
                          return (
                            <div key={i} className="border-t-2 border-[#141312]/10 pt-4 first:border-t-0 first:pt-0">
                              {exp && <p className="fm text-[10px] font-bold uppercase tracking-widest text-[#141312]/45 mb-2">{exp.role} @ {exp.company}</p>}
                              <p className="text-xs text-[#141312]/50 line-through mb-1.5">{b.original}</p>
                              <p className="text-sm text-[#141312]/85 leading-relaxed mb-3">{b.improved}</p>
                              <button onClick={() => applyTailorBullet(i)} disabled={applied}
                                className="fm text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border-2 border-[#0E8A4B] text-[#0E8A4B] hover:bg-[#0E8A4B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#0E8A4B]">
                                {applied ? 'Applied ✓' : 'Apply Bullet'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DOWNLOAD OPTIONS MODAL (MOBILE) */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-end justify-center print:hidden lg:hidden">
          <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="fd text-xl font-black text-[#141312]">Download Options</h2>
              <button onClick={() => setIsDownloadModalOpen(false)} className="p-2 bg-white border-2 border-[#141312] hover:bg-[#141312] hover:text-[#E8E7E1] rounded-none text-[#141312] transition-colors"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setIsDownloadModalOpen(false); handleDownload(); }} className="w-full bg-[#141312] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs p-4 flex items-center gap-4 active:translate-y-[2px] active:shadow-none transition-all">
                <div className="bg-white/20 p-2.5"><Download size={20} /></div>
                <div className="text-left flex-1"><div className="fm font-bold uppercase tracking-wider text-sm">Download PDF</div><div className="fm text-xs text-white/70">Best for printing & sharing</div></div>
              </button>
              <button onClick={() => { setIsDownloadModalOpen(false); handleDocxExport(); }} className="w-full bg-[#2233FF] text-[#E8E7E1] border-[3px] border-[#141312] rounded-none hover:bg-[#FF4326] hover:text-[#141312] hs p-4 flex items-center gap-4 active:translate-y-[2px] active:shadow-none transition-all mb-6">
                <div className="bg-white/20 p-2.5"><FileText size={20} /></div>
                <div className="text-left flex-1"><div className="fm font-bold uppercase tracking-wider text-sm">Download Word (DOCX)</div><div className="fm text-xs text-white/70">Editable in Microsoft Word</div></div>
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @page { size: letter; margin: 0; }
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
          .custom-scrollbar { scrollbar-width: none; }
          .custom-scrollbar::-webkit-scrollbar { display: none; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #14131233; border-radius: 0; }
                /* Compact density: generated from html_templates usage — 292 rules. */
        .density-compact .-ml-16 { margin-left: -2.48rem !important; }
        .density-compact .-mt-4 { margin-top: -0.62rem !important; }
        .density-compact .-mx-12 { margin-left: -1.86rem; margin-right: -1.86rem !important; }
        .density-compact .gap-1 { gap: 0.155rem !important; }
        .density-compact .gap-1\\.5 { gap: 0.232rem !important; }
        .density-compact .gap-10 { gap: 1.55rem !important; }
        .density-compact .gap-12 { gap: 1.86rem !important; }
        .density-compact .gap-2 { gap: 0.31rem !important; }
        .density-compact .gap-2\\.5 { gap: 0.388rem !important; }
        .density-compact .gap-3 { gap: 0.465rem !important; }
        .density-compact .gap-4 { gap: 0.62rem !important; }
        .density-compact .gap-5 { gap: 0.775rem !important; }
        .density-compact .gap-6 { gap: 0.93rem !important; }
        .density-compact .gap-7 { gap: 1.085rem !important; }
        .density-compact .gap-8 { gap: 1.24rem !important; }
        .density-compact .gap-9 { gap: 1.395rem !important; }
        .density-compact .gap-x-10 { column-gap: 1.55rem !important; }
        .density-compact .gap-x-2 { column-gap: 0.31rem !important; }
        .density-compact .gap-x-3 { column-gap: 0.465rem !important; }
        .density-compact .gap-x-4 { column-gap: 0.62rem !important; }
        .density-compact .gap-x-5 { column-gap: 0.775rem !important; }
        .density-compact .gap-x-6 { column-gap: 0.93rem !important; }
        .density-compact .gap-x-8 { column-gap: 1.24rem !important; }
        .density-compact .gap-y-1 { row-gap: 0.155rem !important; }
        .density-compact .gap-y-1\\.5 { row-gap: 0.232rem !important; }
        .density-compact .gap-y-2 { row-gap: 0.31rem !important; }
        .density-compact .gap-y-3 { row-gap: 0.465rem !important; }
        .density-compact .gap-y-4 { row-gap: 0.62rem !important; }
        .density-compact .gap-y-5 { row-gap: 0.775rem !important; }
        .density-compact .gap-y-6 { row-gap: 0.93rem !important; }
        .density-compact .gap-y-8 { row-gap: 1.24rem !important; }
        .density-compact .mb-0\\.5 { margin-bottom: 0.077rem !important; }
        .density-compact .mb-1 { margin-bottom: 0.155rem !important; }
        .density-compact .mb-1\\.5 { margin-bottom: 0.232rem !important; }
        .density-compact .mb-10 { margin-bottom: 1.55rem !important; }
        .density-compact .mb-12 { margin-bottom: 1.86rem !important; }
        .density-compact .mb-14 { margin-bottom: 2.17rem !important; }
        .density-compact .mb-16 { margin-bottom: 2.48rem !important; }
        .density-compact .mb-2 { margin-bottom: 0.31rem !important; }
        .density-compact .mb-2\\.5 { margin-bottom: 0.388rem !important; }
        .density-compact .mb-20 { margin-bottom: 3.1rem !important; }
        .density-compact .mb-3 { margin-bottom: 0.465rem !important; }
        .density-compact .mb-4 { margin-bottom: 0.62rem !important; }
        .density-compact .mb-5 { margin-bottom: 0.775rem !important; }
        .density-compact .mb-6 { margin-bottom: 0.93rem !important; }
        .density-compact .mb-7 { margin-bottom: 1.085rem !important; }
        .density-compact .mb-8 { margin-bottom: 1.24rem !important; }
        .density-compact .mb-9 { margin-bottom: 1.395rem !important; }
        .density-compact .ml-10 { margin-left: 1.55rem !important; }
        .density-compact .ml-2 { margin-left: 0.31rem !important; }
        .density-compact .ml-3 { margin-left: 0.465rem !important; }
        .density-compact .ml-3\\.5 { margin-left: 0.542rem !important; }
        .density-compact .ml-4 { margin-left: 0.62rem !important; }
        .density-compact .ml-5 { margin-left: 0.775rem !important; }
        .density-compact .ml-6 { margin-left: 0.93rem !important; }
        .density-compact .ml-8 { margin-left: 1.24rem !important; }
        .density-compact .ml-\\[154px\\] { margin-left: 95.5px !important; }
        .density-compact .ml-\\[26px\\] { margin-left: 16.1px !important; }
        .density-compact .mr-1\\.5 { margin-right: 0.232rem !important; }
        .density-compact .mr-2 { margin-right: 0.31rem !important; }
        .density-compact .mr-3 { margin-right: 0.465rem !important; }
        .density-compact .mr-5 { margin-right: 0.775rem !important; }
        .density-compact .mt-0\\.5 { margin-top: 0.077rem !important; }
        .density-compact .mt-1 { margin-top: 0.155rem !important; }
        .density-compact .mt-1\\.5 { margin-top: 0.232rem !important; }
        .density-compact .mt-10 { margin-top: 1.55rem !important; }
        .density-compact .mt-11 { margin-top: 1.705rem !important; }
        .density-compact .mt-12 { margin-top: 1.86rem !important; }
        .density-compact .mt-14 { margin-top: 2.17rem !important; }
        .density-compact .mt-16 { margin-top: 2.48rem !important; }
        .density-compact .mt-2 { margin-top: 0.31rem !important; }
        .density-compact .mt-2\\.5 { margin-top: 0.388rem !important; }
        .density-compact .mt-3 { margin-top: 0.465rem !important; }
        .density-compact .mt-4 { margin-top: 0.62rem !important; }
        .density-compact .mt-5 { margin-top: 0.775rem !important; }
        .density-compact .mt-6 { margin-top: 0.93rem !important; }
        .density-compact .mt-7 { margin-top: 1.085rem !important; }
        .density-compact .mt-8 { margin-top: 1.24rem !important; }
        .density-compact .mt-9 { margin-top: 1.395rem !important; }
        .density-compact .mt-\\[2px\\] { margin-top: 1.2px !important; }
        .density-compact .mt-\\[3px\\] { margin-top: 1.9px !important; }
        .density-compact .mt-\\[4px\\] { margin-top: 2.5px !important; }
        .density-compact .mt-\\[5px\\] { margin-top: 3.1px !important; }
        .density-compact .mt-\\[7px\\] { margin-top: 4.3px !important; }
        .density-compact .mx-2 { margin-left: 0.31rem; margin-right: 0.31rem !important; }
        .density-compact .mx-3 { margin-left: 0.465rem; margin-right: 0.465rem !important; }
        .density-compact .mx-5 { margin-left: 0.775rem; margin-right: 0.775rem !important; }
        .density-compact .my-1 { margin-top: 0.155rem; margin-bottom: 0.155rem !important; }
        .density-compact .my-10 { margin-top: 1.55rem; margin-bottom: 1.55rem !important; }
        .density-compact .my-3 { margin-top: 0.465rem; margin-bottom: 0.465rem !important; }
        .density-compact .my-6 { margin-top: 0.93rem; margin-bottom: 0.93rem !important; }
        .density-compact .p-10 { padding: 1.55rem !important; }
        .density-compact .p-12 { padding: 1.86rem !important; }
        .density-compact .p-14 { padding: 2.17rem !important; }
        .density-compact .p-16 { padding: 2.48rem !important; }
        .density-compact .p-3 { padding: 0.465rem !important; }
        .density-compact .p-4 { padding: 0.62rem !important; }
        .density-compact .p-5 { padding: 0.775rem !important; }
        .density-compact .p-6 { padding: 0.93rem !important; }
        .density-compact .p-7 { padding: 1.085rem !important; }
        .density-compact .p-8 { padding: 1.24rem !important; }
        .density-compact .pb-1 { padding-bottom: 0.155rem !important; }
        .density-compact .pb-1\\.5 { padding-bottom: 0.232rem !important; }
        .density-compact .pb-10 { padding-bottom: 1.55rem !important; }
        .density-compact .pb-12 { padding-bottom: 1.86rem !important; }
        .density-compact .pb-14 { padding-bottom: 2.17rem !important; }
        .density-compact .pb-2 { padding-bottom: 0.31rem !important; }
        .density-compact .pb-2\\.5 { padding-bottom: 0.388rem !important; }
        .density-compact .pb-3 { padding-bottom: 0.465rem !important; }
        .density-compact .pb-4 { padding-bottom: 0.62rem !important; }
        .density-compact .pb-5 { padding-bottom: 0.775rem !important; }
        .density-compact .pb-6 { padding-bottom: 0.93rem !important; }
        .density-compact .pb-7 { padding-bottom: 1.085rem !important; }
        .density-compact .pb-8 { padding-bottom: 1.24rem !important; }
        .density-compact .pl-10 { padding-left: 1.55rem !important; }
        .density-compact .pl-16 { padding-left: 2.48rem !important; }
        .density-compact .pl-2\\.5 { padding-left: 0.388rem !important; }
        .density-compact .pl-3 { padding-left: 0.465rem !important; }
        .density-compact .pl-4 { padding-left: 0.62rem !important; }
        .density-compact .pl-5 { padding-left: 0.775rem !important; }
        .density-compact .pl-6 { padding-left: 0.93rem !important; }
        .density-compact .pl-8 { padding-left: 1.24rem !important; }
        .density-compact .pl-\\[116px\\] { padding-left: 71.9px !important; }
        .density-compact .pr-10 { padding-right: 1.55rem !important; }
        .density-compact .pr-12 { padding-right: 1.86rem !important; }
        .density-compact .pr-2 { padding-right: 0.31rem !important; }
        .density-compact .pr-4 { padding-right: 0.62rem !important; }
        .density-compact .pr-6 { padding-right: 0.93rem !important; }
        .density-compact .pr-8 { padding-right: 1.24rem !important; }
        .density-compact .pt-1 { padding-top: 0.155rem !important; }
        .density-compact .pt-1\\.5 { padding-top: 0.232rem !important; }
        .density-compact .pt-10 { padding-top: 1.55rem !important; }
        .density-compact .pt-12 { padding-top: 1.86rem !important; }
        .density-compact .pt-14 { padding-top: 2.17rem !important; }
        .density-compact .pt-16 { padding-top: 2.48rem !important; }
        .density-compact .pt-3 { padding-top: 0.465rem !important; }
        .density-compact .pt-4 { padding-top: 0.62rem !important; }
        .density-compact .pt-6 { padding-top: 0.93rem !important; }
        .density-compact .pt-7 { padding-top: 1.085rem !important; }
        .density-compact .pt-8 { padding-top: 1.24rem !important; }
        .density-compact .pt-9 { padding-top: 1.395rem !important; }
        .density-compact .px-1 { padding-left: 0.155rem; padding-right: 0.155rem !important; }
        .density-compact .px-10 { padding-left: 1.55rem; padding-right: 1.55rem !important; }
        .density-compact .px-11 { padding-left: 1.705rem; padding-right: 1.705rem !important; }
        .density-compact .px-12 { padding-left: 1.86rem; padding-right: 1.86rem !important; }
        .density-compact .px-14 { padding-left: 2.17rem; padding-right: 2.17rem !important; }
        .density-compact .px-16 { padding-left: 2.48rem; padding-right: 2.48rem !important; }
        .density-compact .px-2 { padding-left: 0.31rem; padding-right: 0.31rem !important; }
        .density-compact .px-2\\.5 { padding-left: 0.388rem; padding-right: 0.388rem !important; }
        .density-compact .px-20 { padding-left: 3.1rem; padding-right: 3.1rem !important; }
        .density-compact .px-3 { padding-left: 0.465rem; padding-right: 0.465rem !important; }
        .density-compact .px-3\\.5 { padding-left: 0.542rem; padding-right: 0.542rem !important; }
        .density-compact .px-4 { padding-left: 0.62rem; padding-right: 0.62rem !important; }
        .density-compact .px-5 { padding-left: 0.775rem; padding-right: 0.775rem !important; }
        .density-compact .px-6 { padding-left: 0.93rem; padding-right: 0.93rem !important; }
        .density-compact .px-7 { padding-left: 1.085rem; padding-right: 1.085rem !important; }
        .density-compact .px-8 { padding-left: 1.24rem; padding-right: 1.24rem !important; }
        .density-compact .px-9 { padding-left: 1.395rem; padding-right: 1.395rem !important; }
        .density-compact .py-0\\.5 { padding-top: 0.077rem; padding-bottom: 0.077rem !important; }
        .density-compact .py-1 { padding-top: 0.155rem; padding-bottom: 0.155rem !important; }
        .density-compact .py-1\\.5 { padding-top: 0.232rem; padding-bottom: 0.232rem !important; }
        .density-compact .py-10 { padding-top: 1.55rem; padding-bottom: 1.55rem !important; }
        .density-compact .py-11 { padding-top: 1.705rem; padding-bottom: 1.705rem !important; }
        .density-compact .py-12 { padding-top: 1.86rem; padding-bottom: 1.86rem !important; }
        .density-compact .py-14 { padding-top: 2.17rem; padding-bottom: 2.17rem !important; }
        .density-compact .py-16 { padding-top: 2.48rem; padding-bottom: 2.48rem !important; }
        .density-compact .py-2 { padding-top: 0.31rem; padding-bottom: 0.31rem !important; }
        .density-compact .py-2\\.5 { padding-top: 0.388rem; padding-bottom: 0.388rem !important; }
        .density-compact .py-24 { padding-top: 3.72rem; padding-bottom: 3.72rem !important; }
        .density-compact .py-3 { padding-top: 0.465rem; padding-bottom: 0.465rem !important; }
        .density-compact .py-3\\.5 { padding-top: 0.542rem; padding-bottom: 0.542rem !important; }
        .density-compact .py-4 { padding-top: 0.62rem; padding-bottom: 0.62rem !important; }
        .density-compact .py-5 { padding-top: 0.775rem; padding-bottom: 0.775rem !important; }
        .density-compact .py-6 { padding-top: 0.93rem; padding-bottom: 0.93rem !important; }
        .density-compact .py-7 { padding-top: 1.085rem; padding-bottom: 1.085rem !important; }
        .density-compact .py-8 { padding-top: 1.24rem; padding-bottom: 1.24rem !important; }
        .density-compact .py-9 { padding-top: 1.395rem; padding-bottom: 1.395rem !important; }
        .density-compact .space-y-0\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.077rem !important; }
        .density-compact .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.155rem !important; }
        .density-compact .space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.232rem !important; }
        .density-compact .space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.55rem !important; }
        .density-compact .space-y-12 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.86rem !important; }
        .density-compact .space-y-14 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.17rem !important; }
        .density-compact .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.31rem !important; }
        .density-compact .space-y-2\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.388rem !important; }
        .density-compact .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.465rem !important; }
        .density-compact .space-y-3\\.5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.542rem !important; }
        .density-compact .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.62rem !important; }
        .density-compact .space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.775rem !important; }
        .density-compact .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.93rem !important; }
        .density-compact .space-y-7 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.085rem !important; }
        .density-compact .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.24rem !important; }
        .density-compact .space-y-9 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.395rem !important; }
        .density-compact .leading-5 { line-height: 1rem !important; }
        .density-compact .leading-6 { line-height: 1.2rem !important; }
        .density-compact .leading-\\[0\\.85\\] { line-height: 0.72 !important; }
        .density-compact .leading-\\[0\\.95\\] { line-height: 0.81 !important; }
        .density-compact .leading-\\[0\\.9\\] { line-height: 0.77 !important; }
        .density-compact .leading-\\[1\\.02\\] { line-height: 0.87 !important; }
        .density-compact .leading-\\[1\\.05\\] { line-height: 0.89 !important; }
        .density-compact .leading-\\[1\\.55\\] { line-height: 1.32 !important; }
        .density-compact .leading-\\[1\\.65\\] { line-height: 1.4 !important; }
        .density-compact .leading-\\[1\\.6\\] { line-height: 1.36 !important; }
        .density-compact .leading-\\[1\\.75\\] { line-height: 1.49 !important; }
        .density-compact .leading-\\[1\\.7\\] { line-height: 1.44 !important; }
        .density-compact .leading-\\[1\\.85\\] { line-height: 1.57 !important; }
        .density-compact .leading-\\[1\\.8\\] { line-height: 1.53 !important; }
        .density-compact .leading-\\[1\\.95\\] { line-height: 1.66 !important; }
        .density-compact .leading-\\[1\\.9\\] { line-height: 1.61 !important; }
        .density-compact .leading-\\[2\\.1\\] { line-height: 1.78 !important; }
        .density-compact .leading-\\[2\\.2\\] { line-height: 1.87 !important; }
        .density-compact .leading-\\[2\\.4\\] { line-height: 2.04 !important; }
        .density-compact .leading-\\[2\\] { line-height: 1.7 !important; }
        .density-compact .text-2xl { font-size: 1.2rem; line-height: 1.6rem !important; }
        .density-compact .text-3xl { font-size: 1.5rem; line-height: 1.8rem !important; }
        .density-compact .text-4xl { font-size: 1.8rem; line-height: 2rem !important; }
        .density-compact .text-5xl { font-size: 2.4rem; line-height: 0.8rem !important; }
        .density-compact .text-\\[10px\\] { font-size: 8px !important; }
        .density-compact .text-\\[11\\.5px\\] { font-size: 9.2px !important; }
        .density-compact .text-\\[11px\\] { font-size: 8.8px !important; }
        .density-compact .text-\\[12\\.5px\\] { font-size: 10px !important; }
        .density-compact .text-\\[12px\\] { font-size: 9.6px !important; }
        .density-compact .text-\\[13\\.5px\\] { font-size: 10.8px !important; }
        .density-compact .text-\\[13px\\] { font-size: 10.4px !important; }
        .density-compact .text-\\[14\\.5px\\] { font-size: 11.6px !important; }
        .density-compact .text-\\[14px\\] { font-size: 11.2px !important; }
        .density-compact .text-\\[15\\.5px\\] { font-size: 12.4px !important; }
        .density-compact .text-\\[15px\\] { font-size: 12px !important; }
        .density-compact .text-\\[16px\\] { font-size: 12.8px !important; }
        .density-compact .text-\\[17px\\] { font-size: 13.6px !important; }
        .density-compact .text-\\[22px\\] { font-size: 17.6px !important; }
        .density-compact .text-\\[26px\\] { font-size: 20.8px !important; }
        .density-compact .text-\\[28px\\] { font-size: 22.4px !important; }
        .density-compact .text-\\[32px\\] { font-size: 25.6px !important; }
        .density-compact .text-\\[34px\\] { font-size: 27.2px !important; }
        .density-compact .text-\\[36px\\] { font-size: 28.8px !important; }
        .density-compact .text-\\[38px\\] { font-size: 30.4px !important; }
        .density-compact .text-\\[40px\\] { font-size: 32px !important; }
        .density-compact .text-\\[42px\\] { font-size: 33.6px !important; }
        .density-compact .text-\\[44px\\] { font-size: 35.2px !important; }
        .density-compact .text-\\[46px\\] { font-size: 36.8px !important; }
        .density-compact .text-\\[52px\\] { font-size: 41.6px !important; }
        .density-compact .text-\\[56px\\] { font-size: 44.8px !important; }
        .density-compact .text-\\[64px\\] { font-size: 51.2px !important; }
        .density-compact .text-\\[8px\\] { font-size: 6.4px !important; }
        .density-compact .text-\\[9px\\] { font-size: 7.2px !important; }
        .density-compact .text-base { font-size: 0.8rem; line-height: 1.2rem !important; }
        .density-compact .text-lg { font-size: 0.9rem; line-height: 1.4rem !important; }
        .density-compact .text-sm { font-size: 0.7rem; line-height: 1rem !important; }
        .density-compact .text-xl { font-size: 1rem; line-height: 1.4rem !important; }
        .density-compact .text-xs { font-size: 0.6rem; line-height: 0.8rem !important; }
        .density-compact .leading-loose { line-height: 1.65 !important; }
        .density-compact .leading-none { line-height: 1 !important; }
        .density-compact .leading-relaxed { line-height: 1.35 !important; }
        .density-compact .leading-snug { line-height: 1.15 !important; }
        .density-compact .leading-tight { line-height: 1.05 !important; }

      
        .density-compact .-mt-\\[0\\.75in\\] { margin-top: -0.46in !important; }
        .density-compact .-mx-\\[0\\.75in\\] { margin-left: -0.46in; margin-right: -0.46in !important; }
        .density-compact .-mx-\\[0\\.9in\\] { margin-left: -0.56in; margin-right: -0.56in !important; }
        .density-compact .p-\\[0\\.75in\\] { padding: 0.46in !important; }
        .density-compact .p-\\[0\\.85in\\] { padding: 0.53in !important; }
        .density-compact .p-\\[0\\.9in\\] { padding: 0.56in !important; }
        .density-compact .p-\\[1\\.25in\\] { padding: 0.78in !important; }
        .density-compact .p-\\[1\\.2in\\] { padding: 0.74in !important; }
        .density-compact .p-\\[1in\\] { padding: 0.62in !important; }
        .density-compact .pb-\\[0\\.85in\\] { padding-bottom: 0.53in !important; }
        .density-compact .pb-\\[0\\.8in\\] { padding-bottom: 0.5in !important; }
        .density-compact .pb-\\[0\\.9in\\] { padding-bottom: 0.56in !important; }
        .density-compact .pb-\\[1\\.3in\\] { padding-bottom: 0.81in !important; }
        .density-compact .pb-\\[1in\\] { padding-bottom: 0.62in !important; }
        .density-compact .pt-\\[0\\.65in\\] { padding-top: 0.4in !important; }
        .density-compact .pt-\\[0\\.75in\\] { padding-top: 0.46in !important; }
        .density-compact .pt-\\[0\\.7in\\] { padding-top: 0.43in !important; }
        .density-compact .pt-\\[0\\.85in\\] { padding-top: 0.53in !important; }
        .density-compact .pt-\\[0\\.8in\\] { padding-top: 0.5in !important; }
        .density-compact .pt-\\[0\\.9in\\] { padding-top: 0.56in !important; }
        .density-compact .pt-\\[1\\.3in\\] { padding-top: 0.81in !important; }
        .density-compact .px-\\[0\\.65in\\] { padding-left: 0.4in; padding-right: 0.4in !important; }
        .density-compact .px-\\[0\\.75in\\] { padding-left: 0.46in; padding-right: 0.46in !important; }
        .density-compact .px-\\[0\\.85in\\] { padding-left: 0.53in; padding-right: 0.53in !important; }
        .density-compact .px-\\[0\\.8in\\] { padding-left: 0.5in; padding-right: 0.5in !important; }
        .density-compact .px-\\[0\\.9in\\] { padding-left: 0.56in; padding-right: 0.56in !important; }
        .density-compact .px-\\[1\\.1in\\] { padding-left: 0.68in; padding-right: 0.68in !important; }
        .density-compact .px-\\[1\\.4in\\] { padding-left: 0.87in; padding-right: 0.87in !important; }
        .density-compact .px-\\[1in\\] { padding-left: 0.62in; padding-right: 0.62in !important; }
        .density-compact .py-\\[0\\.55in\\] { padding-top: 0.34in; padding-bottom: 0.34in !important; }
        .density-compact .py-\\[0\\.75in\\] { padding-top: 0.46in; padding-bottom: 0.46in !important; }
        .density-compact .py-\\[0\\.7in\\] { padding-top: 0.43in; padding-bottom: 0.43in !important; }
        .density-compact .py-\\[0\\.85in\\] { padding-top: 0.53in; padding-bottom: 0.53in !important; }
        .density-compact .py-\\[0\\.8in\\] { padding-top: 0.5in; padding-bottom: 0.5in !important; }
        .density-compact .py-\\[0\\.9in\\] { padding-top: 0.56in; padding-bottom: 0.56in !important; }
        .density-compact .py-\\[1in\\] { padding-top: 0.62in; padding-bottom: 0.62in !important; }
`}} />
    </main>
  );
}