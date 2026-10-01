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
  BarChart3, RefreshCw, Undo2, Redo2, ChevronDown, ChevronUp, ZoomIn, ZoomOut, Upload, Share2,
  Pipette, Check, ArrowLeft, ArrowRight, FileDown, Target
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
import { Logo } from '@/components/brand/Logo';
import dynamic from 'next/dynamic';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { captureTemplateHtml } from '@/lib/docx/capture-template-html';

const ImportResume = dynamic(() => import('@/components/builder/ImportResume').then(m => m.ImportResume), { ssr: false });
const JobsModal = dynamic(() => import('@/components/builder/JobsModal').then(m => m.JobsModal), { ssr: false });
const PDFPreview = dynamic(() => import('@/components/builder/PDFPreview'), { ssr: false });
const LiveAtsScore = dynamic(() => import('@/components/builder/LiveAtsScore').then(m => m.LiveAtsScore), { ssr: false });

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useResumeStore, initialData, type ResumeData, type PersonalInfo, type Experience, type Education, type Skill, type Project, type Certification, type CustomSection, type CustomSectionItem, type Reference, type ResumeSectionId, DEFAULT_SECTION_ORDER } from '@/store/useResumeStore';
import { setRecruiterConsent } from '@/lib/recruiter-api';

// --- Section header tools: visibility eye + up/down ordering (v3 style) ---
// Restored from the pre-redesign builder. The eye toggles the section in the
// resume OUTPUT (preview/PDF/DOCX); up/down reorders via the store's
// sectionOrder, which templates honor through orderSections().
const SectionHeaderTools = ({ id, isHidden, isFirst, isLast, onToggle, onMove }: {
  id: ResumeSectionId; isHidden: boolean; isFirst: boolean; isLast: boolean;
  onToggle: (id: ResumeSectionId) => void; onMove: (id: ResumeSectionId, dir: 'up' | 'down') => void;
}) => {
  const btn = "p-2 rounded-lg border border-[#dddde5] bg-white text-[#151a46]/60 hover:text-[#151a46] hover:border-[#5548f5] hover:bg-[#eeecff] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#dddde5] disabled:hover:bg-white disabled:hover:text-[#151a46]/60";
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={() => onMove(id, 'up')} disabled={isFirst} title="Move section up" aria-label="Move section up" className={btn}>
        <ChevronUp size={14} />
      </button>
      <button type="button" onClick={() => onMove(id, 'down')} disabled={isLast} title="Move section down" aria-label="Move section down" className={btn}>
        <ChevronDown size={14} />
      </button>
      <button type="button" onClick={() => onToggle(id)} title={isHidden ? 'Show section in resume' : 'Hide section from resume'} aria-label={isHidden ? 'Show section in resume' : 'Hide section from resume'} aria-pressed={isHidden}
        className={cn(btn, isHidden && "bg-[#151a46]/10 border-[#151a46]/20")}>
        {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
};

// --- v3 primitives ---
const Input = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#151a46]/55">{label}</label>
    <input
      className="w-full bg-white border border-[#d9dae5] rounded-[10px] px-4 py-2.5 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)]"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#151a46]/55">{label}</label>
    <textarea
      className="w-full bg-white border border-[#d9dae5] rounded-[10px] px-4 py-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)] min-h-[100px] resize-y custom-scrollbar"
      {...props}
    />
  </div>
);

const SectionHeader = ({ icon: Icon, title, description, onRemove }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-[#151a46] text-white rounded-xl w-fit shrink-0">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="font-brand font-extrabold text-[#151a46] leading-tight tracking-tight">{title}</h3>
        <p className="font-brand text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/50">{description}</p>
      </div>
    </div>
    {onRemove && (
      <button onClick={onRemove} className="font-brand text-[10px] font-bold uppercase tracking-widest text-[#D8362A] border border-[#D8362A] rounded-lg px-3 py-1.5 hover:bg-[#D8362A] hover:text-white transition-colors">
        Remove Section
      </button>
    )}
  </div>
);

const Card = ({ children, className }: any) => (
  <div className={cn("bg-white border border-[#dddde5] rounded-2xl shadow-[0_2px_8px_rgba(21,26,70,.05)] p-5 sm:p-6 mb-8 text-[#151a46]", className)}>
    {children}
  </div>
);

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
    <div ref={containerRef} className="w-full h-full bg-[#f6f5ef] flex justify-center overflow-auto p-4 sm:p-8 cv-riso custom-scrollbar">
      <div
        data-cvyon-template-stage
        className={cn("bg-white shadow-[0_12px_40px_rgba(21,26,70,.14)] rounded-lg overflow-hidden flex-shrink-0 relative border border-[#dddde5]", data.density === 'compact' && "density-compact")}
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
    toggleReferences, addReference, updateReference, removeReference, setConsents, setDensity,
    reorderExperience, reorderEducation, reorderSkills, setAllData, addCustomSection, updateCustomSectionTitle, removeCustomSection, addCustomSectionItem, updateCustomSectionItem, removeCustomSectionItem, reorderCustomSections, reorderCustomSectionItems,
    toggleSectionVisibility, moveSection
  } = useResumeStore();

  const data = useMemo(() => ({
    ...storeData,
    projects: storeData.projects || [],
    certifications: storeData.certifications || [],
    references: storeData.references || [],
    customSections: storeData.customSections || [],
    sectionVisibility: storeData.sectionVisibility || {},
    sectionOrder: storeData.sectionOrder && storeData.sectionOrder.length ? storeData.sectionOrder : DEFAULT_SECTION_ORDER,
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

  const [skillInput, setSkillInput] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [mobileZoom, setMobileZoom] = useState(false);
  const [mobilePreviewMetrics, setMobilePreviewMetrics] = useState({ scale: 1, width: 816, height: 1056 });
  const [isATSOpen, setIsATSOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generatingExpId, setGeneratingExpId] = useState<string | null>(null);
  const [polishingExpId, setPolishingExpId] = useState<string | null>(null);
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

  const [isRewriterOpen, setIsRewriterOpen] = useState(false);
  const [rewriteTone, setRewriteTone] = useState('Executive');
  const [isRewriting, setIsRewriting] = useState(false);

  // Tailor to Job (restored from pre-redesign builder)
  const [isTailorOpen, setIsTailorOpen] = useState(false);
  const [tailorJobDesc, setTailorJobDesc] = useState('');
  const [tailorResult, setTailorResult] = useState<any>(null);
  const [isTailorLoading, setIsTailorLoading] = useState(false);
  const [tailorApplied, setTailorApplied] = useState<{ summary: boolean; skills: string[]; bullets: number[] }>({ summary: false, skills: [], bullets: [] });

  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  // Undo/redo availability from the zundo temporal store (drives the
  // header buttons' disabled state; keyboard shortcuts work regardless).
  const undoDepth = React.useSyncExternalStore(
    useResumeStore.temporal.subscribe,
    () => useResumeStore.temporal.getState().pastStates.length,
    () => 0
  );
  const redoDepth = React.useSyncExternalStore(
    useResumeStore.temporal.subscribe,
    () => useResumeStore.temporal.getState().futureStates.length,
    () => 0
  );

  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  // v3 concept: live-preview zoom controls (-/+) in the preview bar.
  const [previewZoom, setPreviewZoom] = useState(1);
  // v3 concept: fit the 816px paper into the desktop preview column.
  const previewCanvasRef = useRef<HTMLDivElement | null>(null);
  const [desktopPreviewFit, setDesktopPreviewFit] = useState({ scale: 1, paperH: 1056 });
  useEffect(() => {
    const update = () => {
      const canvasW = previewCanvasRef.current?.clientWidth || 0;
      const paperH = resumePageRef.current?.scrollHeight || 1056;
      if (canvasW > 0) setDesktopPreviewFit({ scale: Math.min(1, (canvasW - 70) / 816), paperH });
    };
    update();
    window.addEventListener('resize', update);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
    if (ro && previewCanvasRef.current) ro.observe(previewCanvasRef.current);
    if (ro && resumePageRef.current) ro.observe(resumePageRef.current);
    return () => { window.removeEventListener('resize', update); ro?.disconnect(); };
  }, [isHydrated, data.templateId]);

  // ---- Desktop tabbed editor ----
  // On lg+ the editor sections become sleek tab panes (one visible at a time)
  // instead of one endless scroll. On mobile the same panes render stacked as
  // ---- v3 step wizard (matches the Cvyon v3 builder concept) ----
  // Six steps in the left sidebar. On desktop the editor shows every step's
  // cards in one scroll; on mobile one step shows at a time with a bottom
  // tab bar (Edit / Preview / AI / Export).
  const [activeStep, setActiveStep] = useState(0);

  const WIZARD_STEPS = [
    { id: 'basics', label: 'Basics', heading: 'Make your first impression count.', sub: 'These details appear at the top of your resume. Keep them clear and professional.' },
    { id: 'summary', label: 'Summary', heading: 'Tell the story in a few sharp lines.', sub: '2–4 lines. Show what you do and the value you create.' },
    { id: 'experience', label: 'Experience', heading: 'Turn experience into evidence.', sub: 'Turn responsibilities into evidence. Quantify where possible.' },
    { id: 'education', label: 'Education', heading: 'Show the qualifications behind you.', sub: 'Add your most relevant qualifications first.' },
    { id: 'skills', label: 'Skills', heading: 'Match your strongest skills to the role.', sub: 'Prioritize skills that match your target role.' },
    { id: 'extras', label: 'Extras', heading: 'Add the details that make you memorable.', sub: 'Add only what strengthens the story.' },
  ];

  const stepComplete: Record<string, boolean> = {
    basics: !!(data.personalInfo.fullName?.trim() && data.personalInfo.jobTitle?.trim()),
    summary: !!(data.summary?.trim()),
    experience: data.experience.length > 0,
    education: data.education.length > 0,
    skills: data.skills.length > 0,
    extras: ((data.projects || []).length > 0) || ((data.certifications || []).length > 0) || ((data.references || []).length > 0) || ((data.customSections || []).length > 0),
  };
  const completedSteps = WIZARD_STEPS.filter((s) => stepComplete[s.id]).length;
  const completionPct = Math.round((completedSteps / WIZARD_STEPS.length) * 100);

  const goStep = (index: number) => {
    const i = Math.max(0, Math.min(WIZARD_STEPS.length - 1, index));
    setActiveStep(i);
    requestAnimationFrame(() => {
      // One step is visible at a time, so reset the editor column (desktop)
      // or the window (mobile) to the top — never the whole page on desktop,
      // which would blank the preview.
      const editor = document.querySelector('.v3-editor') as HTMLElement | null;
      // On mobile .v3-editor has overflow:visible, so editor.scrollTo() is a
      // no-op there — fall back to the window scroll in that case.
      if (editor && getComputedStyle(editor).overflowY !== 'visible') editor.scrollTo({ top: 0 });
      else window.scrollTo({ top: 0 });
    });
  };

  // Enabling an optional section also jumps straight to the Extras step.
  const enableSectionAndGo = (toggle: () => void) => {
    toggle();
    goStep(5);
  };

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
        confetti({ particleCount: 90, spread: 70, origin: { y: 0.2 }, colors: ["#ff604b", "#ffd85a", "#5548f5"] });
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
    else if (type === 'custom-item') {
      // droppableId is `custom-${section.id}`; items stay within their section.
      const srcId = String(source.droppableId || '').replace(/^custom-/, '');
      const dstId = String(destination.droppableId || '').replace(/^custom-/, '');
      if (!srcId || srcId !== dstId) return; // reject cross-section moves
      reorderCustomSectionItems(srcId, source.index, destination.index);
    }
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
    trackEvent('page_view', undefined, { page: 'build' });
  }, []);

  // milestone_started fires on the FIRST MEANINGFUL EDIT, not on page mount.
  // (Mount-time firing inflated "started" with bounces and SEO landers.)
  const startedFiredRef = useRef(false);
  const initialDataRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isHydrated || startedFiredRef.current) return;
    const snapshot = JSON.stringify({
      pi: storeData.personalInfo,
      exp: storeData.experience,
      edu: storeData.education,
      skills: storeData.skills,
      summary: storeData.summary,
    });
    if (initialDataRef.current === null) {
      initialDataRef.current = snapshot;
      return;
    }
    if (snapshot !== initialDataRef.current) {
      startedFiredRef.current = true;
      trackEvent('milestone_started', data.templateId);
    }
  }, [isHydrated, storeData, data.templateId]);

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
    // Close the SEO-flow tracking gap: users arriving from /templates/[slug]
    // silently get this template applied — record it like a gallery selection.
    if (template && templates[template]) {
      trackEvent('template_selected', template, { source: 'seo' });
    }
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
      // Escape dismisses the ATS grader / AI rewriter / tailor / template gallery /
      // download overlays (the jobs modal handles its own Escape via its portal).
      if (e.key === 'Escape') { setIsATSOpen(false); setIsRewriterOpen(false); setIsTailorOpen(false); setIsGalleryOpen(false); setIsDownloadModalOpen(false); }
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
      if (resData.score >= 85) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#0E8A4B', '#5548f5', '#ff604b'] });
    } catch (err: any) { toast.error('ATS Grading failed: ' + err.message); }
    setIsATSLoading(false);
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
      // Only close on success — a failed rewrite keeps the modal open so the
      // user can retry without losing their tone selection.
      setIsRewriterOpen(false);
    } catch (err: any) { toast.error('Rewrite failed: ' + err.message); }
    setIsRewriting(false);
  };

  // ---- Tailor to Job (restored from pre-redesign builder) ----
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
    const telemetry = getTelemetryMetadata('docx');
    const deviceType = typeof window !== 'undefined' && window.innerWidth < 1024 ? 'mobile' : 'desktop';
    trackEvent('download_attempted', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable' });
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
      // previewData carries the user's section visibility, so both
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
      // Guard: never save an error payload (HTML/JSON) with a .docx extension —
      // Word reports those as corrupt files. The server only returns 200 with
      // the DOCX content type.
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('officedocument.wordprocessingml')) {
        const text = await res.text();
        throw new Error('Server returned an unexpected response (' + contentType + '): ' + text.slice(0, 120));
      }
      const blob = await res.blob();
      if (blob.size < 1000) throw new Error('Generated file is unexpectedly small (' + blob.size + ' bytes)');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = data.personalInfo.fullName.replace(/[^\w\s-]/g, '').trim() || 'My';
      const safeRole = data.personalInfo.jobTitle.replace(/[^\w\s-]/g, '').trim() || 'Resume';
      a.download = `${safeName}_${safeRole}_Resume.docx`.replace(/\s+/g, '_');
      // The anchor must be in the DOM for the download to start reliably,
      // and the object URL must stay alive until the browser has picked it
      // up — revoking synchronously after click() races the download and can
      // produce a truncated (unopenable) file.
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      trackEvent('milestone_downloaded', data.templateId, getTelemetryMetadata('docx'));
      trackEvent('download_completed', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable' });
      setIsJobsModalOpen(true);
    } catch (err: any) {
      trackEvent('download_failed', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable', error: err.message?.slice(0, 200) || 'unknown' });
      toast.error('DOCX export failed: ' + err.message);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (skillInput.trim()) { addSkill(skillInput.trim()); setSkillInput(''); }
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownload = async () => {
    const telemetry = getTelemetryMetadata('pdf');
    const deviceType = typeof window !== 'undefined' && window.innerWidth < 1024 ? 'mobile' : 'desktop';
    trackEvent('download_attempted', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable' });
    if (isRealUserEmail(data.personalInfo.email)) {
      try {
        fetch('/api/crm/optin', { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(r => { if (!r.ok) r.text().then(t => console.error('[CRM opt-in] HTTP', r.status, t)); })
          .catch(err => console.error('[CRM opt-in] Network error:', err));
      } catch (err) { console.error('[CRM opt-in] Sync error:', err); }
    }
    // Generate the PDF programmatically with React-PDF (client-side) so the
    // file contains ONLY the resume — no browser print headers/footers (date,
    // title, URL, page numbers) and no PWA install banner. window.print()
    // cannot suppress those; they are browser chrome, not page content.
    setIsGeneratingPdf(true);
    try {
      const { pdf } = await import('@react-pdf/renderer');
      const PdfTemplate = templates[data.templateId as TemplateKey];
      if (!PdfTemplate) throw new Error('PDF template not available for ' + data.templateId);
      const blob = await pdf(<PdfTemplate data={previewData} />).toBlob();
      if (!blob || blob.size < 1000) throw new Error('Generated PDF is unexpectedly small');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = data.personalInfo.fullName.replace(/[^\w\s-]/g, '').trim() || 'My';
      const safeRole = data.personalInfo.jobTitle.replace(/[^\w\s-]/g, '').trim() || 'Resume';
      a.download = `${safeName}_${safeRole}_Resume.pdf`.replace(/\s+/g, '_');
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      // Confirmed delivery only: the file was generated and the download was
      // triggered. Firing on click inflates the download count with failed or
      // abandoned generations.
      trackEvent('milestone_downloaded', data.templateId, getTelemetryMetadata('pdf'));
      trackEvent('download_completed', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable' });
      setIsJobsModalOpen(true);
    } catch (err: any) {
      // Hard error — no silent fallback to window.print() (a dead end on
      // mobile, and it masked failures behind a print dialog + jobs upsell).
      console.error('[PDF] React-PDF generation failed:', err);
      trackEvent('download_failed', data.templateId, { ...telemetry, device_type: deviceType, density: data.density || 'comfortable', error: err.message?.slice(0, 200) || 'unknown' });
      toast.error('PDF download failed: ' + err.message + '. Please try again, or use the Word (DOCX) download instead.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!isHydrated) return null;


  // ---- Section visibility + ordering (restored from pre-redesign builder) --
  // editorSectionIds: sections as they appear in the editor, in the user's
  // sectionOrder, skipping removed optional sections. Drives the up/down
  // disabled states; the store's moveSection does the actual reordering.
  const editorSectionIds = useMemo(() => {
    const order = data.sectionOrder && data.sectionOrder.length ? data.sectionOrder : DEFAULT_SECTION_ORDER;
    return order.filter((id) =>
      id !== 'cover-letter' &&
      (id !== 'projects' || data.showProjects) &&
      (id !== 'certifications' || data.showCertifications) &&
      (id !== 'references' || data.showReferences)
    );
  }, [data.sectionOrder, data.showProjects, data.showCertifications, data.showReferences]);

  const makeSectionTools = (id: ResumeSectionId) => (
    <SectionHeaderTools
      id={id}
      isHidden={data.sectionVisibility?.[id] === false}
      isFirst={editorSectionIds[0] === id}
      isLast={editorSectionIds[editorSectionIds.length - 1] === id}
      onToggle={toggleSectionVisibility}
      onMove={moveSection}
    />
  );

  // ---- Editor section blocks: visibility toggles + up/down ordering ----
  // Each block keeps its own JSX (and mobile accordion state); the editor
  // renders them in sectionOrder via editorSectionIds below.
  // v3 wizard: editor blocks keyed by wizard step id ('basics'/'summary' split
  // the old 'personal' model key for the step layout; data model untouched).
  const sectionBlocks: Record<string, React.ReactNode> = {
    basics: (
    <Card>
      <div className="v3-card-head">
        <div>
          <h3>Personal information</h3>
          <p className="v3-card-hint">Keep this simple. Your name and role do the heavy lifting.</p>
        </div>
        <div className="flex items-center gap-2">
          {makeSectionTools('personal')}
          <span className="v3-autosaved">Autosaved</span>
        </div>
      </div>
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
        <div className="col-span-1 sm:col-span-2 mt-2 flex items-center justify-between p-4 border border-[#dddde5] rounded-xl bg-white">
          <div>
            <h4 className="font-brand font-bold text-sm text-[#151a46]">Allow recruiters to find my profile</h4>
            <p className="font-brand text-[10px] uppercase tracking-[0.14em] text-[#151a46]/55">Allow recruiters to find your resume on Cvyon.</p>
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
            className="v3-switch">
            <span className="v3-switch-knob" />
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
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#151a46]/40 hover:border-[#5548f5] bg-white flex flex-col items-center justify-center overflow-hidden transition-all">
              {data.personalInfo.profilePicture ? (
                <img src={data.personalInfo.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={24} className='text-[#151a46]/40 mb-1' />
                  <span className="font-brand text-[9px] font-bold uppercase tracking-wider text-center px-2 text-[#151a46]/40">Add Photo</span>
                </>
              )}
            </div>
            {data.personalInfo.profilePicture && (
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); updatePersonalInfo({ profilePicture: undefined }); }}
                className="absolute -top-2 -right-2 bg-[#D8362A] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-sm hover:bg-[#151a46]">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
    ),
    summary: (
    <Card>
      <div className="v3-card-head">
        <div>
          <h3>Professional summary</h3>
          <p className="v3-card-hint">Aim for 3–5 concise lines focused on impact.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleGenerateSummary} disabled={isGeneratingSummary}
            className="v3-ai-btn">
            {isGeneratingSummary ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {isGeneratingSummary ? 'Writing...' : 'Generate with AI'}
          </button>
          <button onClick={() => setIsRewriterOpen(true)} className="v3-ai-btn">
            <Sparkles size={14} /> Improve with AI
          </button>
        </div>
      </div>
      <div className="v3-field">
        <textarea
          className="v3-textarea"
          value={data.summary} onChange={(e) => updateSummary(e.target.value)}
          placeholder="Analytical professional with experience in..." />
      </div>
    </Card>
    ),
    experience: (
    <Card>
      <div className="v3-card-head">
        <div>
          <h3>Experience</h3>
          <p className="v3-card-hint">Turn responsibilities into evidence. Quantify where possible.</p>
        </div>
        <div className="flex items-center gap-2">
          {makeSectionTools('experience')}
          <button onClick={addExperience} aria-label="Add experience" className="v3-icon-btn"><Plus size={18} /></button>
        </div>
      </div>
    <Droppable droppableId="experience" type="experience">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {data.experience.map((exp, index) => (
            <Draggable key={exp.id} draggableId={exp.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="mb-6 relative group">
                  <div {...provided.dragHandleProps} className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-2 text-[#151a46]/30 hover:text-[#151a46] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
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
                        <label className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60">Accomplishments (New line per point)</label>
                        <div className="flex gap-2">
                          <button onClick={() => handlePolishExperience(exp.id, exp.description)} disabled={polishingExpId === exp.id || !exp.description.trim()}
                            className="flex items-center gap-1.5 font-brand text-[10px] font-bold uppercase tracking-widest text-[#5548f5] border border-[#5548f5] rounded-full hover:bg-[#5548f5] hover:text-white px-2.5 py-1 transition-colors disabled:opacity-50" title="Polish this text with AI">
                            {polishingExpId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {polishingExpId === exp.id ? 'Polishing...' : 'Polish'}
                          </button>
                          <button onClick={() => handleGenerateExperience(exp.id, exp.role, exp.company)} disabled={generatingExpId === exp.id}
                            className="flex items-center gap-1.5 font-brand text-[10px] font-bold uppercase tracking-widest text-[#ff604b] border border-[#ff604b] rounded-full hover:bg-[#ff604b] hover:text-white px-2.5 py-1 transition-colors disabled:opacity-50">
                            {generatingExpId === exp.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {generatingExpId === exp.id ? 'Writing...' : 'Generate with AI'}
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="w-full bg-white border border-[#d9dae5] rounded-[10px] px-4 py-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)] min-h-[100px] resize-none"
                        value={exp.description} onChange={(e: any) => updateExperience(exp.id, { description: e.target.value })} />
                    </div>
                    <button onClick={() => removeExperience(exp.id)} className="w-full mt-6 bg-white text-[#D8362A] border border-[#D8362A] rounded-xl py-3 font-brand text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
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
    </Card>
    ),
    education: (
    <Card>
      <div className="v3-card-head">
        <div>
          <h3>Education</h3>
          <p className="v3-card-hint">Add your most relevant qualifications first.</p>
        </div>
        <div className="flex items-center gap-2">
          {makeSectionTools('education')}
          <button onClick={addEducation} aria-label="Add education" className="v3-icon-btn"><Plus size={18} /></button>
        </div>
      </div>
    <Droppable droppableId="education" type="education">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {data.education.map((edu, index) => (
            <Draggable key={edu.id} draggableId={edu.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} className="mb-6 relative group">
                  <div {...provided.dragHandleProps} className="absolute left-[-16px] top-1/2 -translate-y-1/2 p-2 text-[#151a46]/30 hover:text-[#151a46] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
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
                    <button onClick={() => removeEducation(edu.id)} className="w-full mt-6 bg-white text-[#D8362A] border border-[#D8362A] rounded-xl py-3 font-brand text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
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
    </Card>
    ),
    skills: (
    <Card>
      <div className="v3-card-head">
        <div>
          <h3>Skills</h3>
          <p className="v3-card-hint">Prioritize skills that match your target role.</p>
        </div>
        {makeSectionTools('skills')}
      </div>
      <form onSubmit={handleAddSkill} className="flex gap-2 mb-6">
        <input
          className="flex-1 bg-white border border-[#d9dae5] rounded-[10px] px-4 py-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)]"
          placeholder="Add a skill (e.g. TypeScript, AWS)" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
        <button type="submit" className="bg-[#5548f5] text-white rounded-xl shadow-[3px_3px_0_#151a46] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] px-6 py-3 font-brand text-sm font-bold uppercase tracking-wider transition-all">Add</button>
      </form>
      <Droppable droppableId="skills" type="skills" direction="horizontal">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-wrap gap-3">
            {data.skills.map((s, index) => (
              <Draggable key={s.id} draggableId={s.id} index={index}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} className="relative flex items-center">
                    <div {...provided.dragHandleProps} className="absolute left-[-8px] text-[#151a46]/30 hover:text-[#151a46] cursor-grab active:cursor-grabbing z-10">
                      <GripVertical size={14} />
                    </div>
                    <span className="group flex items-center gap-2 bg-white border border-[#dddde5] rounded-full pl-6 pr-2 py-2 font-brand text-xs font-bold uppercase tracking-wider text-[#151a46] transition-all hover:border-[#5548f5]">
                      {s.name}
                      <button onClick={() => removeSkill(s.id)} className="p-1 rounded-full text-[#151a46]/40 hover:text-[#D8362A] hover:bg-[#D8362A]/10 transition-colors">
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

    {/* Smart Skill Suggestions */}
    <div className="mb-6">
      <button onClick={handleSuggestSkills} disabled={isLoadingSkills || !data.personalInfo.jobTitle}
        className="flex items-center gap-2 font-brand text-[11px] font-bold uppercase tracking-widest text-[#ff604b] border border-[#ff604b] rounded-full hover:bg-[#ff604b] hover:text-white px-4 py-2.5 transition-colors disabled:opacity-40">
        {isLoadingSkills ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {isLoadingSkills ? 'Finding skills...' : 'Suggest Skills with AI'}
      </button>
      {suggestedSkills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedSkills.map((skill, i) => (
            <button key={i} onClick={() => { addSkill(skill); setSuggestedSkills(prev => prev.filter(s => s !== skill)); }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#dddde5] rounded-lg hover:bg-[#151a46] hover:text-white font-brand text-xs font-bold uppercase tracking-wider text-[#151a46] transition-all">
              <Plus size={12} /> {skill}
            </button>
          ))}
        </div>
      )}
    </div>
    </Card>
    ),
    projects: data.showProjects ? (
      <Card>
        <div className="v3-card-head">
          <div>
            <h3>Projects</h3>
            <p className="v3-card-hint">Showcase your key projects.</p>
          </div>
          <div className="flex items-center gap-2">
            {makeSectionTools('projects')}
            <button onClick={addProject} aria-label="Add project" className="v3-icon-btn"><Plus size={18} /></button>
            <button onClick={toggleProjects} className="v3-remove-btn">Remove</button>
          </div>
        </div>
        {(data.projects || []).map((proj) => (
          <Card key={proj.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input label="Project Name" value={proj.name} onChange={(e: any) => updateProject(proj.id, { name: e.target.value })} />
              <Input label="Link / URL" value={proj.link} onChange={(e: any) => updateProject(proj.id, { link: e.target.value })} />
            </div>
            <Input label="Description" value={proj.description} onChange={(e: any) => updateProject(proj.id, { description: e.target.value })} />
            <button onClick={() => removeProject(proj.id)} className="w-full mt-6 bg-white text-[#D8362A] border border-[#D8362A] rounded-xl py-3 font-brand text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Project
            </button>
          </Card>
        ))}
      </Card>
    ) : null,
    certifications: data.showCertifications ? (
      <Card>
        <div className="v3-card-head">
          <div>
            <h3>Certifications</h3>
            <p className="v3-card-hint">Official recognitions.</p>
          </div>
          <div className="flex items-center gap-2">
            {makeSectionTools('certifications')}
            <button onClick={addCertification} aria-label="Add certification" className="v3-icon-btn"><Plus size={18} /></button>
            <button onClick={toggleCertifications} className="v3-remove-btn">Remove</button>
          </div>
        </div>
        {(data.certifications || []).map((cert) => (
          <Card key={cert.id}>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input label="Certification Name" value={cert.name} onChange={(e: any) => updateCertification(cert.id, { name: e.target.value })} />
              <Input label="Issuer" value={cert.issuer} onChange={(e: any) => updateCertification(cert.id, { issuer: e.target.value })} />
              <Input label="Date Earned" value={cert.date} onChange={(e: any) => updateCertification(cert.id, { date: e.target.value })} />
            </div>
            <button onClick={() => removeCertification(cert.id)} className="w-full mt-6 bg-white text-[#D8362A] border border-[#D8362A] rounded-xl py-3 font-brand text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Certification
            </button>
          </Card>
        ))}
      </Card>
    ) : null,
    references: data.showReferences ? (
      <Card>
        <div className="v3-card-head">
          <div>
            <h3>References</h3>
            <p className="v3-card-hint">People who vouch for you.</p>
          </div>
          <div className="flex items-center gap-2">
            {makeSectionTools('references')}
            <button onClick={addReference} aria-label="Add reference" className="v3-icon-btn"><Plus size={18} /></button>
            <button onClick={toggleReferences} className="v3-remove-btn">Remove</button>
          </div>
        </div>
        {(data.references || []).map((ref) => (
          <Card key={ref.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input label="Name" value={ref.name} onChange={(e: any) => updateReference(ref.id, { name: e.target.value })} />
              <Input label="Title" value={ref.title} onChange={(e: any) => updateReference(ref.id, { title: e.target.value })} />
              <Input label="Company" value={ref.company} onChange={(e: any) => updateReference(ref.id, { company: e.target.value })} />
              <Input label="Contact (Email/Phone)" value={ref.contact} onChange={(e: any) => updateReference(ref.id, { contact: e.target.value })} />
            </div>
            <button onClick={() => removeReference(ref.id)} className="w-full mt-6 bg-white text-[#D8362A] border border-[#D8362A] rounded-xl py-3 font-brand text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#D8362A] hover:text-white transition-colors">
              <Trash2 size={16} /> Delete Reference
            </button>
          </Card>
        ))}
      </Card>
    ) : null,
  };

  // v3 wizard: which section blocks render under each step.
  const stepBlocks: Record<string, React.ReactNode[]> = {
    basics: [sectionBlocks.basics],
    summary: [sectionBlocks.summary],
    experience: [sectionBlocks.experience],
    education: [sectionBlocks.education],
    skills: [sectionBlocks.skills],
    extras: [
      sectionBlocks.projects,
      sectionBlocks.certifications,
      sectionBlocks.references,
    ].filter(Boolean),
  };

  // Sidebar completion hint + desktop "Next up" card, derived from real state.
  const nextMissingSteps = WIZARD_STEPS.filter((s) => !stepComplete[s.id]);
  const completionHint = nextMissingSteps.length === 0
    ? 'Your resume is complete. Download it or check your ATS match.'
    : `Add ${nextMissingSteps[0].label.toLowerCase()} details to strengthen your resume.`;
  const nextUpItems = [...nextMissingSteps.slice(0, 3).map((s) => `Add your ${s.label.toLowerCase()}`), 'Check ATS match'];

  return (
    <main className="v3-builder print:block print:h-auto print:overflow-visible">
      <h1 className="sr-only">Free Resume Builder — create, edit, and download your resume</h1>

      {/* ===== TOP BAR (v3 concept) ===== */}
      <header className="v3-top print:hidden">
        <div className="v3-top-left">
          <Link href="/" aria-label="Cvyon home">
            <Logo size={30} wordSize={20} />
          </Link>
          <span className="v3-crumb">/ Build your resume</span>
        </div>
        <div className="v3-top-right">
          <span className="v3-autosave-pill"><span className="v3-dot" /> Auto-saved</span>
          <button className="v3-iconbtn" onClick={() => useResumeStore.temporal.getState().undo()} disabled={undoDepth === 0} title="Undo (Ctrl+Z)" aria-label="Undo"><Undo2 size={15} /></button>
          <button className="v3-iconbtn" onClick={() => useResumeStore.temporal.getState().redo()} disabled={redoDepth === 0} title="Redo (Ctrl+Y)" aria-label="Redo"><Redo2 size={15} /></button>
          <button className="v3-dl v3-dl-docx" onClick={handleDocxExport} title="Download Word document"><FileText size={14} /> Download DOCX</button>
          <button className="v3-dl v3-dl-pdf" onClick={handleDownload} disabled={isGeneratingPdf}><FileDown size={14} /> {isGeneratingPdf ? 'Generating…' : 'Download PDF'}</button>
          {/* Mobile: persistent download CTA (header buttons are hidden on mobile by CSS) */}
          <button className="v3-dl v3-dl-pdf v3-mobile-dl" onClick={() => { trackEvent('milestone_previewed', data.templateId); setIsPreviewOpen(true); }} title="Review and download">
            <FileDown size={14} /> Download
          </button>
        </div>
      </header>

      <div className="v3-workspace">
        {/* ===== SIDEBAR (v3 concept) ===== */}
        <aside className="v3-sidebar print:hidden">
          <p className="v3-side-title">Resume</p>
          <nav className="v3-nav" aria-label="Resume steps">
            {WIZARD_STEPS.map((s, i) => (
              <button key={s.id} onClick={() => goStep(i)}
                className={cn('v3-nav-btn', activeStep === i && 'active')}
                aria-current={activeStep === i ? 'step' : undefined}>
                <span className="v3-num">{stepComplete[s.id] ? <Check size={12} strokeWidth={4} /> : i + 1}</span>
                {s.label}
              </button>
            ))}
          </nav>
          <div className="v3-progress">
            <small>Completion</small>
            <strong>{completionPct}%</strong>
            <div className="v3-bar"><i style={{ width: `${completionPct}%` }} /></div>
            <p>{completionHint}</p>
          </div>
        </aside>

        {/* ===== EDITOR (v3 concept) ===== */}
        <section className="v3-editor print:hidden">
          <div className="v3-editor-inner" id="builder-editor-top">
            <div className="v3-mobilebar">
              <div><strong>Step {activeStep + 1} of 6</strong><br /><small>{WIZARD_STEPS[activeStep].label}</small></div>
              <button className="v3-primary" onClick={() => setIsGalleryOpen(true)}>Templates</button>
            </div>

            <p className="v3-eyebrow">Step {activeStep + 1} of 6</p>
            <h2 className="v3-heading">{WIZARD_STEPS[activeStep].heading}</h2>
            <p className="v3-sub">{WIZARD_STEPS[activeStep].sub}</p>

            <DragDropContext onDragEnd={onDragEnd}>
              {WIZARD_STEPS.map((s, i) => (
                <div key={s.id} id={`v3-step-${s.id}`} className={cn('v3-step', activeStep === i && 'v3-step-active')}>
                  {s.id === 'basics' && (
                    <div className="v3-block"><div className="v3-import"><ImportResume /></div></div>
                  )}
                  {s.id === 'extras' && (
                    <div className="v3-block">
                      <div className="v3-addrow">
                        {!data.showProjects && (
                          <button onClick={() => enableSectionAndGo(toggleProjects)} className="v3-addbtn">
                            <Plus size={18} /> Add Projects
                          </button>
                        )}
                        {!data.showCertifications && (
                          <button onClick={() => enableSectionAndGo(toggleCertifications)} className="v3-addbtn">
                            <Plus size={18} /> Add Certifications
                          </button>
                        )}
                        {!data.showReferences && (
                          <button onClick={() => enableSectionAndGo(toggleReferences)} className="v3-addbtn">
                            <Plus size={18} /> Add References
                          </button>
                        )}
                        <button onClick={addCustomSection} className="v3-addbtn v3-addbtn-accent">
                          <Plus size={18} /> Create Custom Section
                        </button>
                      </div>
                    </div>
                  )}
                  {(stepBlocks[s.id] || []).map((block, bi) => (
                    <div key={bi} className="v3-block">{block}</div>
                  ))}
                  {s.id === 'extras' && (
                    <>
                                  {/* Custom Sections */}
            {data.customSections?.map((section: any, sectionIndex: number) => (
              <div key={section.id} className="mt-8">
                <div className="flex items-center justify-between mb-4 bg-white p-4 border border-[#dddde5] rounded-xl shadow-[0_2px_8px_rgba(21,26,70,.05)]">
                  <input type="text" value={section.title} onChange={(e) => updateCustomSectionTitle(section.id, e.target.value)}
                    className="font-brand uppercase tracking-tight text-lg bg-transparent border-none outline-none focus:ring-0 flex-1 text-[#151a46] font-bold" />
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={() => reorderCustomSections(sectionIndex, sectionIndex - 1)} disabled={sectionIndex === 0} title="Move section up" aria-label="Move custom section up"
                      className="p-2 rounded-lg border border-[#dddde5] bg-white text-[#151a46]/60 hover:text-[#151a46] hover:border-[#5548f5] hover:bg-[#eeecff] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#dddde5] disabled:hover:bg-white"><ChevronUp size={14} /></button>
                    <button type="button" onClick={() => reorderCustomSections(sectionIndex, sectionIndex + 1)} disabled={sectionIndex === (data.customSections?.length || 1) - 1} title="Move section down" aria-label="Move custom section down"
                      className="p-2 rounded-lg border border-[#dddde5] bg-white text-[#151a46]/60 hover:text-[#151a46] hover:border-[#5548f5] hover:bg-[#eeecff] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[#dddde5] disabled:hover:bg-white"><ChevronDown size={14} /></button>
                    <button onClick={() => removeCustomSection(section.id)} className="text-[#151a46]/40 hover:text-[#D8362A] transition-colors p-2"><Trash2 size={16} /></button>
                  </div>
                </div>
                <Droppable droppableId={`custom-${section.id}`} type="custom-item">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {section.items.map((item: any, index: number) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} className={cn("bg-white border border-[#dddde5] rounded-xl p-4 sm:p-5 relative group transition-all shadow-[0_2px_8px_rgba(21,26,70,.05)]", snapshot.isDragging ? 'border-[#5548f5] shadow-[0_8px_24px_rgba(85,72,245,.25)] scale-[1.02] z-50' : '')}>
                              <div {...provided.dragHandleProps} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#151a46]/30 opacity-0 group-hover:opacity-100 transition-opacity p-2 cursor-grab active:cursor-grabbing hover:text-[#151a46]">
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
                                  <button onClick={() => removeCustomSectionItem(section.id, item.id)} className="text-[#151a46]/40 hover:text-[#D8362A] transition-colors p-2 mt-6"><Trash2 size={16} /></button>
                                </div>
                                <div className="mt-3">
                                  <label className="block font-brand text-[10px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60 mb-2">Description</label>
                                  <textarea value={item.description} onChange={(e) => updateCustomSectionItem(section.id, item.id, { description: e.target.value })}
                                    className="w-full bg-white border border-[#d9dae5] rounded-[10px] p-3 min-h-[80px] outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)] resize-y text-sm text-[#151a46]" placeholder="Describe this item..." />
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      <button onClick={() => addCustomSectionItem(section.id)} className="w-full py-3 bg-white border border-dashed border-[#151a46]/30 hover:border-[#5548f5] hover:bg-[#eeecff] rounded-xl font-brand text-xs font-bold uppercase tracking-widest text-[#151a46]/70 hover:text-[#151a46] flex items-center justify-center gap-2 transition-all">
                        <Plus size={16} /> Add Item
                      </button>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}

                    </>
                  )}
                </div>
              ))}
            </DragDropContext>

            {/* Target the right role — desktop only (v3 concept) */}
            <div className="v3-card v3-desktop-only">
              <div className="v3-card-head">
                <div>
                  <h3>Target the right role</h3>
                  <p className="v3-card-hint">Cvyon uses this to guide your ATS suggestions.</p>
                </div>
              </div>
              <div className="v3-target">
                <div className="v3-field">
                  <label>Target job title</label>
                  <input value={atsJobDesc} onChange={(e) => setAtsJobDesc(e.target.value)} placeholder="e.g. Senior Product Engineer" />
                </div>
                <button className="v3-primary" onClick={() => setIsATSOpen(true)}>Analyze</button>
              </div>
            </div>

            {/* Tailor to Job — desktop only (v3 concept) */}
            <div className="v3-card v3-desktop-only">
              <div className="v3-card-head">
                <div>
                  <h3>Tailor to a job</h3>
                  <p className="v3-card-hint">Paste a job posting — AI rewrites your summary, suggests skills, and sharpens bullets using only what's already on your resume.</p>
                </div>
              </div>
              <button className="v3-primary w-full flex items-center justify-center gap-2" onClick={() => { setTailorResult(null); setTailorApplied({ summary: false, skills: [], bullets: [] }); setIsTailorOpen(true); }}>
                <Target size={16} /> Tailor to Job
              </button>
            </div>

            {/* Next up — desktop only (v3 concept) */}
            <div className="v3-card v3-desktop-only">
              <div className="v3-card-head">
                <div>
                  <h3>Next up</h3>
                  <p className="v3-card-hint">Small actions, visible progress.</p>
                </div>
              </div>
              <p className="v3-nextup">
                {nextUpItems.map((item, i) => (
                  <span key={item}>{i + 1}&#8419; {item}{i < nextUpItems.length - 1 ? '\u00A0\u00A0' : ''}</span>
                ))}
              </p>
            </div>

            {/* Mobile step navigation: Back + Continue */}
            <div className="v3-mobile-nav">
              {activeStep > 0 && (
                <button
                  className="v3-pill v3-mobile-back"
                  onClick={() => goStep(activeStep - 1)}>
                  ← Back
                </button>
              )}
              <button
                className="v3-primary v3-mobile-next"
                onClick={() => {
                  if (activeStep < 5) goStep(activeStep + 1);
                  else { trackEvent('milestone_previewed', data.templateId); setIsPreviewOpen(true); }
                }}>
                {activeStep === 5 ? 'Review & Download \u2192' : `Continue to ${WIZARD_STEPS[activeStep + 1].label} \u2192`}
              </button>
            </div>

            <div className="v3-desktop-only">
              <div className="v3-newsletter">
                <NewsletterCapture source="main_editor" />
              </div>
              <footer className="v3-footer">
                <Link href="/blog" className="hover:text-[#5548f5] transition-colors">Career Blog</Link>
                <span>&bull;</span>
                <Link href="/recruiter" className="hover:text-[#5548f5] transition-colors">Recruiter Portal</Link>
                <span>&bull;</span>
                <Link href="/privacy" className="hover:text-[#5548f5] transition-colors">Privacy Policy & GDPR</Link>
                <span>&bull;</span>
                <Link href="/manage-data" className="hover:text-[#5548f5] transition-colors">Manage Data</Link>
              </footer>
            </div>
          </div>
        </section>

        {/* ===== LIVE PREVIEW (v3 concept) ===== */}
        <section className="v3-preview" id="preview-panel" ref={previewViewportRef}>
          <div className="v3-previewbar print:hidden">
            <strong>Live preview</strong>
            <div className="v3-preview-actions">
              <button className="v3-pill-sm" onClick={() => setIsGalleryOpen(true)} title="Change template">
                <Layout size={14} /> Templates
              </button>
              <button className="v3-pill-sm" onClick={() => setIsATSOpen(true)} title="Grade against a job description">
                <BarChart3 size={14} /> ATS
              </button>
              <button className="v3-pill-sm" onClick={() => setIsRewriterOpen(true)} title="Rewrite with AI">
                <Sparkles size={14} /> AI
              </button>
              <div className="v3-zoom">
                <button onClick={() => setPreviewZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} aria-label="Zoom out">&minus;</button>
                <button onClick={() => setPreviewZoom((z) => Math.min(1.3, +(z + 0.1).toFixed(2)))} aria-label="Zoom in">+</button>
              </div>
            </div>
          </div>
          <div className="v3-canvas print:hidden" ref={previewCanvasRef}>
            <div style={{ width: 816 * desktopPreviewFit.scale * previewZoom, height: desktopPreviewFit.paperH * desktopPreviewFit.scale * previewZoom, flexShrink: 0 }}>
            <div className="v3-paperwrap" style={{ transform: `scale(${desktopPreviewFit.scale * previewZoom})`, width: 816 }}>
              <div
                ref={resumePageRef}
                className="v3-paper"
                style={{ '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}
              >
                <ErrorBoundary fallbackTitle="Resume Preview Error" fallbackMessage="Could not render the current template. Try selecting another template or verifying your text inputs.">
                  <HTMLPreview Tmpl={htmlTemplates[data.templateId as keyof typeof htmlTemplates]} data={previewData} />
                </ErrorBoundary>
              </div>
            </div>
            </div>
          </div>
          {/* Print: render the template directly, without the screen preview
              chrome (HTMLPreview's cream background, padding, scale transform,
              and fixed 1056px height would otherwise clip multi-page resumes
              and print the preview frame into the PDF). The --theme-color
              variable is set here so the printed PDF matches the on-screen
              preview accents. */}
          <div
            className={cn("hidden print:block print-resume", previewData.density === 'compact' && "density-compact")}
            style={{ '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}
          >
            {(() => {
              const PrintTmpl = htmlTemplates[data.templateId as keyof typeof htmlTemplates];
              return <PrintTmpl data={previewData} />;
            })()}
          </div>
        </section>
      </div>

      {/* ATS readiness badge (v3 concept) */}
      <div className="v3-score print:hidden">
        <LiveAtsScore />
      </div>

      {/* Mobile bottom tabs (v3 concept) */}
      <nav className="v3-mobiletabs print:hidden" aria-label="Builder">
        <button className={cn(!isPreviewOpen && 'active')} onClick={() => { setIsPreviewOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <span>&#9998;</span>Edit
        </button>
        <button onClick={() => { trackEvent('milestone_previewed', data.templateId); setIsPreviewOpen(true); }}>
          <span>&#9635;</span>Preview
        </button>
        <button onClick={() => setIsRewriterOpen(true)}>
          <span>&#10022;</span>AI
        </button>
        <button onClick={() => setIsDownloadModalOpen(true)}>
          <span>&darr;</span>Export
        </button>
      </nav>

      {/* Mobile preview overlay */}
      {isPreviewOpen && (
        <div className="v3-preview-overlay print:hidden">
          <div className="v3-previewbar">
            <strong>Live preview</strong>
            <button className="v3-pill-sm" onClick={() => setIsPreviewOpen(false)}>
              <X size={14} /> Close
            </button>
          </div>
          <div className="v3-canvas">
            <div
              className="preview-scale-frame shrink-0"
              style={{ width: mobilePreviewMetrics.width, height: mobilePreviewMetrics.height }}
            >
              <div
                className="w-[816px] origin-top-left shrink-0 bg-white"
                style={{ transform: mobilePreviewMetrics.scale !== 1 ? `scale(${mobilePreviewMetrics.scale})` : undefined, '--theme-color': data.theme?.color || '#2563eb' } as React.CSSProperties}
              >
                <ErrorBoundary fallbackTitle="Resume Preview Error" fallbackMessage="Could not render the current template. Try selecting another template or verifying your text inputs.">
                  <HTMLPreview Tmpl={htmlTemplates[data.templateId as keyof typeof htmlTemplates]} data={previewData} />
                </ErrorBoundary>
              </div>
            </div>
          </div>
          <div className="v3-overlay-actions">
            <button onClick={() => setIsPreviewOpen(false)} className="v3-pill-sm">
              <X size={14} /> Edit
            </button>
            <button onClick={() => setMobileZoom(!mobileZoom)} className="v3-pill-sm">
              {mobileZoom ? <ZoomOut size={14} /> : <ZoomIn size={14} />} Zoom
            </button>
            {/* Unified PDF path: React-PDF renders the matching React-PDF template
                to a real file (no browser print headers/footers) —
                the same engine as the desktop "Download PDF" button. */}
            <button onClick={handleDownload} className="v3-primary" disabled={isGeneratingPdf}>
              <Download size={14} /> {isGeneratingPdf ? 'Generating…' : 'PDF'}
            </button>
            <button onClick={handleDocxExport} className="v3-pill-sm">
              <FileText size={14} /> DOCX
            </button>
          </div>
        </div>
      )}


      {/* TEMPLATE GALLERY MODAL */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[400] bg-[#f6f5ef] font-brand flex flex-col print:hidden">
          <div className="p-6 lg:p-8 border-b border-[#dddde5] bg-white z-10 relative">
            <div className="flex justify-between items-center gap-4">
              <div>
                <h2 className="font-brand text-3xl font-black uppercase tracking-tight leading-none text-[#151a46]">Template Gallery</h2>
                <p className="font-brand text-[10px] font-bold uppercase tracking-widest text-[#151a46]/55 mt-2">See your exact resume in {Object.keys(templates).length} ATS-optimized styles</p>
              </div>
              <button onClick={() => setIsGalleryOpen(false)} className="p-3 bg-white border border-[#dddde5] hover:bg-[#151a46] hover:text-white rounded-xl transition-colors shrink-0">
                <X size={24} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="font-brand text-[10px] font-bold uppercase tracking-widest text-[#151a46]/55">Resume density</span>
              <div className="flex rounded-full border border-[#dddde5] p-0.5 bg-[#f6f5ef]">
                {(['comfortable', 'compact'] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setDensity(d)}
                    aria-pressed={data.density === d}
                    className={cn("px-4 py-1.5 rounded-full font-brand text-[10px] font-bold uppercase tracking-widest transition-colors",
                      data.density === d ? "bg-[#151a46] text-white shadow" : "text-[#151a46]/60 hover:text-[#151a46]")}>
                    {d === 'comfortable' ? 'Comfortable' : 'Compact'}
                  </button>
                ))}
              </div>
              <span className="font-brand text-[10px] text-[#151a46]/45">Compact tightens spacing and type across preview, PDF and DOCX.</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-[#f6f5ef]">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1600px] mx-auto">
              {(Object.keys(templates) as TemplateKey[]).map((key) => {
                const isActive = data.templateId === key;
                const selectTemplate = () => { trackEvent('template_selected', key); setTemplateId(key); setIsGalleryOpen(false); };
                return (
                  <div key={key} role="button" tabIndex={0}
                    onClick={selectTemplate}
                    onKeyDown={(e) => {
                      const t = e.target as HTMLElement;
                      if (t.closest('[data-colorctl]')) return;
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectTemplate(); }
                    }}
                    className={cn("flex flex-col text-left group bg-white border rounded-xl overflow-hidden transition-all relative cursor-pointer", isActive ? "border-[#5548f5] shadow-[0_8px_24px_rgba(85,72,245,.25)] scale-[1.02]" : "border-[#dddde5] hover:border-[#151a46] hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(21,26,70,.1)]")}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '300px 400px' }}>
                    <HTMLThumbnail Tmpl={htmlTemplates[key as keyof typeof htmlTemplates]} data={data} />
                    {isActive && (
                      <div className="absolute top-4 right-4 bg-[#5548f5] text-white px-3 py-1.5 font-brand text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg z-10 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Active
                      </div>
                    )}
                    <div className="px-4 py-3 border-t border-[#dddde5] bg-white z-10 w-full">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-brand font-bold text-sm lg:text-base leading-tight truncate text-[#151a46]">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0" data-colorctl onClick={(e) => e.stopPropagation()} title="Pick this template's color">
                          {['#000000', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c'].map((hex) => (
                            <button key={hex} type="button" onClick={() => setThemeColor(hex)} aria-label={`Use color ${hex}`}
                              className={cn("w-6 h-6 rounded-full border-2 transition-transform hover:scale-110", (data.theme?.color || '').toLowerCase() === hex ? "border-[#151a46] scale-110" : "border-black/10")}
                              style={{ backgroundColor: hex }} />
                          ))}
                          <div className="relative w-6 h-6" title="Pick any custom color">
                            <input type="color" value={data.theme?.color || '#2563eb'} onChange={(e) => setThemeColor(e.target.value)}
                              className="v3-color-input" aria-label="Pick a custom color" />
                            <div className="w-6 h-6 rounded-full border-2 border-black/10 flex items-center justify-center pointer-events-none"
                              style={{ background: 'conic-gradient(from 20deg, #ef4444, #f59e0b, #84cc16, #06b6d4, #3b82f6, #a855f7, #ef4444)' }}>
                              <Pipette size={11} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <div className="rounded-2xl border border-[#dddde5] shadow-[0_24px_70px_rgba(21,26,70,.22)] max-w-2xl w-full p-6 sm:p-8 flex flex-col relative bg-white text-[#151a46]">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-brand text-2xl font-black leading-tight flex items-center gap-2"><BarChart3 className="text-[#0E8A4B]" /> ATS Grader</h2>
                  <p className="font-brand text-[11px] uppercase tracking-widest text-[#151a46]/55 mt-1">Paste the job description to see how well your resume matches.</p>
                </div>
                <button onClick={() => setIsATSOpen(false)} className="p-2 bg-white border border-[#dddde5] hover:bg-[#151a46] hover:text-white rounded-xl transition-colors"><X size={20} /></button>
              </div>

              <textarea
                className="w-full bg-white border border-[#d9dae5] rounded-[10px] p-4 text-sm min-h-[150px] mb-4 outline-none transition-all focus:border-[#0E8A4B] focus:shadow-[0_0_0_3px_rgba(14,138,75,.12)] resize-none text-[#151a46]"
                placeholder="Paste the target job description here..." value={atsJobDesc} onChange={(e) => setAtsJobDesc(e.target.value)} />

              <button onClick={handleATSGrade} disabled={isATSLoading || !atsJobDesc.trim()}
                className="w-full bg-[#0E8A4B] hover:bg-[#0b6e3e] disabled:opacity-50 text-white rounded-xl shadow-[3px_3px_0_#151a46] py-4 font-brand font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2 mb-6">
                {isATSLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isATSLoading ? 'Analyzing Resume...' : 'Analyze & Grade Resume'}
              </button>

              {atsResult && (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-8 border-[#151a46]/10">
                      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="289.026" strokeDashoffset={289.026 * (1 - atsResult.score / 100)} className={atsResult.score >= 80 ? 'text-[#0E8A4B]' : atsResult.score >= 60 ? 'text-[#FFB800]' : 'text-[#D8362A]'} strokeLinecap="round" />
                      </svg>
                      <span className="font-brand text-2xl font-black">{atsResult.score}</span>
                    </div>
                    <div>
                      <h3 className="font-brand text-xl font-bold">Match Score</h3>
                      <p className="font-brand text-xs uppercase tracking-wider text-[#151a46]/60">
                        {atsResult.score >= 80 ? 'Excellent match! You are highly qualified.' : atsResult.score >= 60 ? 'Good match. Consider adding missing keywords.' : 'Low match. Significant tailoring recommended.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-[#0E8A4B] rounded-xl">
                      <h4 className="font-brand font-bold text-[#0E8A4B] mb-2 flex items-center gap-2"><Plus size={16} /> Strengths</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">{atsResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}</ul>
                    </div>
                    <div className="p-4 bg-white border border-[#D8362A] rounded-xl">
                      <h4 className="font-brand font-bold text-[#D8362A] mb-2 flex items-center gap-2"><RefreshCw size={16} /> Missing Keywords</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">{atsResult.missingKeywords?.map((k: string, i: number) => <li key={i}>{k}</li>)}</ul>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-[#5548f5] rounded-xl">
                    <h4 className="font-brand font-bold text-[#5548f5] mb-2 flex items-center gap-2"><Sparkles size={16} /> Actionable Tips</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">{atsResult.tips?.map((t: string, i: number) => <li key={i}>{t}</li>)}</ul>
                  </div>

                  <button onClick={() => { setIsATSOpen(false); setIsRewriterOpen(true); }}
                    className="w-full bg-[#ff604b] hover:bg-[#e54a34] text-white rounded-xl shadow-[3px_3px_0_#151a46] py-3 font-brand font-bold uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4">
                    <RefreshCw size={14} /> Implement Recommendations with AI Rewriter
                  </button>

                  {atsResult.score >= 85 && (
                    <button onClick={() => {
                      const text = `I just scored a ${atsResult.score}% on my resume with Cvyon! Check out this free AI ATS Grader at cvyon.com`;
                      window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                      className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white rounded-xl py-3 font-brand font-bold uppercase tracking-widest text-xs transition-all flex justify-center items-center gap-2 mt-4">
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
            <div className="rounded-2xl border border-[#dddde5] shadow-[0_24px_70px_rgba(21,26,70,.22)] max-w-md w-full p-6 sm:p-8 relative bg-white text-[#151a46]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-brand text-2xl font-black leading-tight flex items-center gap-2"><RefreshCw className="text-[#ff604b]" /> AI Rewriter</h2>
                <button onClick={() => setIsRewriterOpen(false)} className="p-2 bg-white border border-[#dddde5] hover:bg-[#151a46] hover:text-white rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <p className="text-sm mb-6 text-[#151a46]/65">Instantly rewrite your Summary and Experience sections to match a specific tone or career level.</p>
              <div className="mb-6">
                <label className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-[#151a46]/60">Target Tone / Style</label>
                <div className="relative">
                  <select value={rewriteTone} onChange={(e) => setRewriteTone(e.target.value)}
                    className="w-full appearance-none bg-white border border-[#d9dae5] rounded-[10px] px-4 py-3 pr-10 text-sm font-bold text-[#151a46] outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)] cursor-pointer">
                    <option value="Executive">Executive & Strategic</option>
                    <option value="Creative">Creative & Dynamic</option>
                    <option value="Technical">Technical & Analytical</option>
                    <option value="Entry-Level">Entry-Level & Enthusiastic</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#151a46]/40" />
                </div>
              </div>
              <button onClick={handleRewrite} disabled={isRewriting}
                className="w-full bg-[#5548f5] hover:bg-[#4538e0] disabled:opacity-50 text-white rounded-xl shadow-[3px_3px_0_#151a46] py-4 font-brand font-bold uppercase tracking-widest text-sm transition-all flex justify-center items-center gap-2">
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
            <div className="rounded-2xl border border-[#dddde5] shadow-[0_24px_70px_rgba(21,26,70,.22)] max-w-2xl w-full p-6 sm:p-8 flex flex-col relative bg-white text-[#151a46]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-brand text-2xl font-black leading-tight flex items-center gap-2"><Target className="text-[#5548f5]" /> Tailor to Job</h2>
                <button onClick={() => setIsTailorOpen(false)} className="p-2 bg-white border border-[#dddde5] hover:bg-[#151a46] hover:text-white rounded-xl transition-colors"><X size={20} /></button>
              </div>
              <p className="text-sm mb-6 text-[#151a46]/65">Paste the job description and AI will rewrite your summary, suggest keyword-aligned skills, and sharpen your experience bullets — using only what's already on your resume. Nothing is invented.</p>
              <label className="font-brand text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block text-[#151a46]/60">Job Description</label>
              <textarea
                value={tailorJobDesc}
                onChange={(e) => setTailorJobDesc(e.target.value)}
                placeholder="Paste the job posting here..."
                rows={7}
                maxLength={15000}
                className="w-full bg-white border border-[#d9dae5] rounded-[10px] px-4 py-3 text-sm text-[#151a46] outline-none transition-all focus:border-[#5548f5] focus:shadow-[0_0_0_3px_rgba(85,72,245,.12)] resize-y mb-4"
              />
              <button onClick={handleTailor} disabled={isTailorLoading || !tailorJobDesc.trim()}
                className="v3-primary w-full flex justify-center items-center gap-2 mb-6 disabled:opacity-50">
                {isTailorLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                {isTailorLoading ? 'Tailoring Resume...' : 'Tailor My Resume'}
              </button>

              {tailorResult && (
                <div className="space-y-6">
                  {/* Rewritten summary */}
                  {tailorResult.summary && (
                    <div className="border border-[#dddde5] bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(21,26,70,.05)]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-brand text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60">Rewritten Summary</h3>
                        <button onClick={applyTailorSummary} disabled={tailorApplied.summary}
                          className="font-brand text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#0E8A4B] text-[#0E8A4B] rounded-lg hover:bg-[#0E8A4B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#0E8A4B]">
                          {tailorApplied.summary ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                      <p className="text-sm text-[#151a46]/80 leading-relaxed whitespace-pre-wrap">{tailorResult.summary}</p>
                    </div>
                  )}

                  {/* Skills to add */}
                  {Array.isArray(tailorResult.skillsToAdd) && tailorResult.skillsToAdd.length > 0 && (
                    <div className="border border-[#dddde5] bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(21,26,70,.05)]">
                      <h3 className="font-brand text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60 mb-3">Skills to Add</h3>
                      <div className="flex flex-wrap gap-2">
                        {tailorResult.skillsToAdd.map((skill: string) => {
                          const applied = tailorApplied.skills.includes(skill);
                          return (
                            <button key={skill} onClick={() => !applied && applyTailorSkill(skill)} disabled={applied}
                              className={cn("font-brand text-[11px] font-bold px-3 py-1.5 border rounded-lg transition-colors",
                                applied ? "border-[#0E8A4B] bg-[#0E8A4B]/10 text-[#0E8A4B]/60 cursor-default"
                                        : "border-[#dddde5] bg-white text-[#151a46] hover:border-[#5548f5] hover:bg-[#eeecff]")}>
                              {applied ? `${skill} ✓` : `+ ${skill}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Improved bullets */}
                  {Array.isArray(tailorResult.bulletImprovements) && tailorResult.bulletImprovements.length > 0 && (
                    <div className="border border-[#dddde5] bg-white rounded-xl p-5 shadow-[0_2px_8px_rgba(21,26,70,.05)]">
                      <h3 className="font-brand text-[11px] font-bold uppercase tracking-[0.2em] text-[#151a46]/60 mb-3">Sharpened Experience Bullets</h3>
                      <div className="space-y-4">
                        {tailorResult.bulletImprovements.map((b: any, i: number) => {
                          const applied = tailorApplied.bullets.includes(i);
                          const exp = data.experience.find(e => e.id === b.experienceId);
                          return (
                            <div key={i} className="border-t border-[#151a46]/10 pt-4 first:border-t-0 first:pt-0">
                              {exp && <p className="font-brand text-[10px] font-bold uppercase tracking-widest text-[#151a46]/45 mb-2">{exp.role} @ {exp.company}</p>}
                              <p className="text-xs text-[#151a46]/50 line-through mb-1.5">{b.original}</p>
                              <p className="text-sm text-[#151a46]/85 leading-relaxed mb-3">{b.improved}</p>
                              <button onClick={() => applyTailorBullet(i)} disabled={applied}
                                className="font-brand text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-[#0E8A4B] text-[#0E8A4B] rounded-lg hover:bg-[#0E8A4B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-[#0E8A4B]">
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
              <h2 className="font-brand text-xl font-black text-[#151a46]">Download Options</h2>
              <button onClick={() => setIsDownloadModalOpen(false)} className="p-2 bg-white border border-[#dddde5] hover:bg-[#151a46] hover:text-white rounded-xl text-[#151a46] transition-colors"><X size={16} /></button>
            </div>
            <div className="flex flex-col gap-4">
              <button onClick={() => { setIsDownloadModalOpen(false); handleDownload(); }} disabled={isGeneratingPdf} className="w-full bg-[#5548f5] text-white rounded-xl shadow-[3px_3px_0_#151a46] p-4 flex items-center gap-4 transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] disabled:opacity-60">
                <div className="bg-[#151a46]/10 p-2.5 rounded-lg text-[#151a46]"><Download size={20} /></div>
                <div className="text-left flex-1"><div className="font-brand font-bold uppercase tracking-wider text-sm">{isGeneratingPdf ? 'Generating PDF…' : 'Download PDF'}</div><div className="font-brand text-xs text-white/70">Best for printing & sharing</div></div>
              </button>
              <button onClick={() => { setIsDownloadModalOpen(false); handleDocxExport(); }} className="w-full bg-white text-[#151a46] border border-[#dddde5] rounded-xl shadow-[3px_3px_0_#151a46] p-4 flex items-center gap-4 transition-all hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] mb-6">
                <div className="bg-[#151a46]/10 p-2.5 rounded-lg text-[#151a46]"><FileText size={20} /></div>
                <div className="text-left flex-1"><div className="font-brand font-bold uppercase tracking-wider text-sm">Download Word (DOCX)</div><div className="font-brand text-xs text-[#151a46]/60">Editable in Microsoft Word</div></div>
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
          .v3-builder { display: block; height: auto; overflow: visible; }
          .v3-workspace { display: block; overflow: visible; }
          .v3-top, .v3-sidebar, .v3-editor, .v3-score, .v3-mobiletabs, .v3-preview-overlay { display: none !important; }
          .v3-preview { display: block; border: 0; background: #fff; }
        }
        /* Compact density: tightens spacing + type on the resume output.
           Applied as a class on the template stage, so it flows through the
           on-screen preview, print/PDF (same DOM) and the DOCX capture path
           (which inlines computed styles). */
        .density-compact .p-\\[0\\.75in\\] { padding: 0.45in !important; }
        .density-compact .mb-8 { margin-bottom: 1rem !important; }
        .density-compact .mb-6 { margin-bottom: 0.75rem !important; }
        .density-compact .mb-5 { margin-bottom: 0.65rem !important; }
        .density-compact .mb-4 { margin-bottom: 0.55rem !important; }
        .density-compact .mb-3 { margin-bottom: 0.45rem !important; }
        .density-compact .mb-2 { margin-bottom: 0.35rem !important; }
        .density-compact .mb-1 { margin-bottom: 0.2rem !important; }
        .density-compact .mt-8 { margin-top: 1rem !important; }
        .density-compact .mt-6 { margin-top: 0.75rem !important; }
        .density-compact .mt-4 { margin-top: 0.55rem !important; }
        .density-compact .pb-8 { padding-bottom: 1rem !important; }
        .density-compact .pt-8 { padding-top: 1rem !important; }
        .density-compact .pl-6 { padding-left: 0.85rem !important; }
        .density-compact .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.9rem !important; }
        .density-compact .space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem !important; }
        .density-compact .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.6rem !important; }
        .density-compact .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.45rem !important; }
        .density-compact .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.35rem !important; }
        .density-compact .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.2rem !important; }
        .density-compact .gap-12 { gap: 1.5rem !important; }
        .density-compact .gap-8 { gap: 1.1rem !important; }
        .density-compact .gap-6 { gap: 0.9rem !important; }
        .density-compact .gap-4 { gap: 0.6rem !important; }
        .density-compact .gap-3 { gap: 0.45rem !important; }
        .density-compact .gap-2 { gap: 0.35rem !important; }
        .density-compact .text-5xl { font-size: 2.35rem !important; }
        .density-compact .text-4xl { font-size: 1.85rem !important; }
        .density-compact .text-3xl { font-size: 1.45rem !important; }
        .density-compact .text-2xl { font-size: 1.25rem !important; }
        .density-compact .text-xl { font-size: 1.02rem !important; }
        .density-compact .text-lg { font-size: 0.92rem !important; }
        .density-compact .text-base { font-size: 0.83rem !important; }
        .density-compact .text-sm { font-size: 0.76rem !important; }
        .density-compact .text-xs { font-size: 0.68rem !important; }
        .density-compact .leading-relaxed { line-height: 1.4 !important; }
`}} />
    </main>
  );
}
