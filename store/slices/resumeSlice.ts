import { StateCreator } from 'zustand';
import { StoreState, ResumeSlice, ResumeData, ResumeSectionId, DEFAULT_SECTION_ORDER, ResumeDensity } from '../types';

export const initialData: ResumeData = {
  currentResumeId: null,
  resumeTitle: "Untitled Resume",
  templateId: 'Executive',
  theme: { color: '#2563eb' },
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
  },
  summary: "Detail-oriented Product Designer with 6+ years of experience crafting premium digital experiences. Passionate about brutalist minimalism and accessible design systems.",
  experience: [
    {
      id: '1',
      company: "Acme Corp",
      role: "Lead UI Designer",
      startDate: "2022",
      endDate: "Present",
      description: "Led the redesign of the core SaaS platform.\nManaged a team of 3 designers.\nImplemented a new design system."
    }
  ],
  education: [
    {
      id: '1',
      school: "Rhode Island School of Design",
      degree: "BFA in Interaction Design",
      graduationYear: "2018"
    }
  ],
  skills: [
    { id: '1', name: "Figma" },
    { id: '2', name: "React" },
    { id: '3', name: "Tailwind" }
  ],
  showProjects: false,
  projects: [],
  showCertifications: false,
  certifications: [],
  showReferences: false,
  references: [],
  consents: {
    recruiterShare: false,
    emailJobs: false,
    analytics: false
  },
  customSections: [],
  sectionVisibility: {},
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  density: 'comfortable' as ResumeDensity,
};

export const createResumeSlice: StateCreator<StoreState, [], [], ResumeSlice> = (set) => ({
  data: initialData,
  updatePersonalInfo: (info) => set((state) => ({ data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } } })),
  updateSummary: (summary) => set((state) => ({ data: { ...state.data, summary } })),
  
  addExperience: () => set((state) => ({
    data: { ...state.data, experience: [...state.data.experience, { id: crypto.randomUUID(), company: '', role: '', startDate: '', endDate: '', description: '' }] }
  })),
  updateExperience: (id, updates) => set((state) => ({
    data: { ...state.data, experience: state.data.experience.map(exp => exp.id === id ? { ...exp, ...updates } : exp) }
  })),
  removeExperience: (id) => set((state) => ({
    data: { ...state.data, experience: state.data.experience.filter(exp => exp.id !== id) }
  })),
  reorderExperience: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.data.experience);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { data: { ...state.data, experience: result } };
  }),

  addEducation: () => set((state) => ({
    data: { ...state.data, education: [...state.data.education, { id: crypto.randomUUID(), school: '', degree: '', graduationYear: '' }] }
  })),
  updateEducation: (id, updates) => set((state) => ({
    data: { ...state.data, education: state.data.education.map(edu => edu.id === id ? { ...edu, ...updates } : edu) }
  })),
  removeEducation: (id) => set((state) => ({
    data: { ...state.data, education: state.data.education.filter(edu => edu.id !== id) }
  })),
  reorderEducation: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.data.education);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { data: { ...state.data, education: result } };
  }),

  addSkill: (name) => set((state) => ({
    data: { ...state.data, skills: [...state.data.skills, { id: crypto.randomUUID(), name }] }
  })),
  removeSkill: (id) => set((state) => ({
    data: { ...state.data, skills: state.data.skills.filter(s => s.id !== id) }
  })),
  reorderSkills: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.data.skills);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { data: { ...state.data, skills: result } };
  }),

  addProject: () => set((state) => ({
    data: { ...state.data, projects: [...(state.data.projects || []), { id: crypto.randomUUID(), name: '', description: '', link: '' }] }
  })),
  updateProject: (id, updates) => set((state) => ({
    data: { ...state.data, projects: (state.data.projects || []).map(p => p.id === id ? { ...p, ...updates } : p) }
  })),
  removeProject: (id) => set((state) => ({
    data: { ...state.data, projects: (state.data.projects || []).filter(p => p.id !== id) }
  })),

  addCertification: () => set((state) => ({
    data: { ...state.data, certifications: [...(state.data.certifications || []), { id: crypto.randomUUID(), name: '', issuer: '', date: '' }] }
  })),
  updateCertification: (id, updates) => set((state) => ({
    data: { ...state.data, certifications: (state.data.certifications || []).map(c => c.id === id ? { ...c, ...updates } : c) }
  })),
  removeCertification: (id) => set((state) => ({
    data: { ...state.data, certifications: (state.data.certifications || []).filter(c => c.id !== id) }
  })),

  addReference: () => set((state) => ({
    data: { ...state.data, references: [...(state.data.references || []), { id: crypto.randomUUID(), name: '', title: '', company: '', contact: '' }] }
  })),
  updateReference: (id, updates) => set((state) => ({
    data: { ...state.data, references: (state.data.references || []).map(r => r.id === id ? { ...r, ...updates } : r) }
  })),
  removeReference: (id) => set((state) => ({
    data: { ...state.data, references: (state.data.references || []).filter(r => r.id !== id) }
  })),

  addCustomSection: () => set((state) => ({
    data: { ...state.data, customSections: [...(state.data.customSections || []), { id: crypto.randomUUID(), title: 'Custom Section', items: [] }] }
  })),
  updateCustomSectionTitle: (id, title) => set((state) => ({
    data: { ...state.data, customSections: (state.data.customSections || []).map(s => s.id === id ? { ...s, title } : s) }
  })),
  removeCustomSection: (id) => set((state) => ({
    data: { ...state.data, customSections: (state.data.customSections || []).filter(s => s.id !== id) }
  })),
  addCustomSectionItem: (sectionId) => set((state) => ({
    data: { ...state.data, customSections: (state.data.customSections || []).map(s => s.id === sectionId ? { ...s, items: [...s.items, { id: crypto.randomUUID(), title: '', subtitle: '', date: '', description: '' }] } : s) }
  })),
  updateCustomSectionItem: (sectionId, itemId, updates) => set((state) => ({
    data: { ...state.data, customSections: (state.data.customSections || []).map(s => s.id === sectionId ? { ...s, items: s.items.map(i => i.id === itemId ? { ...i, ...updates } : i) } : s) }
  })),
  removeCustomSectionItem: (sectionId, itemId) => set((state) => ({
    data: { ...state.data, customSections: (state.data.customSections || []).map(s => s.id === sectionId ? { ...s, items: s.items.filter(i => i.id !== itemId) } : s) }
  })),
  reorderCustomSections: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.data.customSections || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { data: { ...state.data, customSections: result } };
  }),
  reorderCustomSectionItems: (sectionId, startIndex, endIndex) => set((state) => {
    const result = Array.from(state.data.customSections || []);
    const sectionIndex = result.findIndex(s => s.id === sectionId);
    if (sectionIndex === -1) return state;
    const newItems = Array.from(result[sectionIndex].items);
    const [removed] = newItems.splice(startIndex, 1);
    newItems.splice(endIndex, 0, removed);
    result[sectionIndex] = { ...result[sectionIndex], items: newItems };
    return { data: { ...state.data, customSections: result } };
  }),

  setAllData: (newData) => set((state) => ({
    data: { ...state.data, ...newData }
  })),
  setConsents: (consents) => set((state) => ({ data: { ...state.data, consents: { ...state.data.consents, ...consents } } })),

  // Show/hide a section in the resume output (preview, PDF, DOCX).
  // The editor accordion stays put — only the output changes.
  toggleSectionVisibility: (id) => set((state) => ({
    data: {
      ...state.data,
      sectionVisibility: {
        ...(state.data.sectionVisibility || {}),
        [id]: (state.data.sectionVisibility || {})[id] === false,
      },
    },
  })),

  // Move a section up/down in the editor order, skipping sections that are
  // currently removed from the editor (showProjects/showCertifications/
  // showReferences false). Note: the 181 fixed-layout templates render
  // sections in their own order — this controls the editor arrangement.
  moveSection: (id, direction) => set((state) => {
    const d = state.data;
    const order: ResumeSectionId[] = [...(d.sectionOrder && d.sectionOrder.length ? d.sectionOrder : DEFAULT_SECTION_ORDER)];
    for (const sid of DEFAULT_SECTION_ORDER) if (!order.includes(sid)) order.push(sid);
    const inEditor = (sid: ResumeSectionId) =>
      sid === 'projects' ? !!d.showProjects
      : sid === 'certifications' ? !!d.showCertifications
      : sid === 'references' ? !!d.showReferences
      : true;
    const idx = order.indexOf(id);
    if (idx < 0) return state;
    const step = direction === 'up' ? -1 : 1;
    let target = idx + step;
    while (target >= 0 && target < order.length && !inEditor(order[target])) target += step;
    if (target < 0 || target >= order.length) return state;
    const next = [...order];
    [next[idx], next[target]] = [next[target], next[idx]];
    return { data: { ...d, sectionOrder: next } };
  }),

  setDensity: (density) => set((state) => ({
    data: { ...state.data, density },
  })),
});
