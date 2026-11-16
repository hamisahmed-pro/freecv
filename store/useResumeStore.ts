import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { StoreState } from './types';
import { createResumeSlice, initialData } from './slices/resumeSlice';
import { createUISlice } from './slices/uiSlice';
import { createSyncSlice } from './slices/syncSlice';

export * from './types';
export { initialData } from './slices/resumeSlice';

export const useResumeStore = create<StoreState>()(
  temporal(
    persist(
      (...a) => ({
        ...createResumeSlice(...a),
        ...createUISlice(...a),
        ...createSyncSlice(...a),
      }),
      {
        name: 'cvyon-storage',
        version: 4,
        migrate: (persistedState: any, version: number) => {
          if (!persistedState || typeof persistedState !== 'object') {
            return persistedState;
          }
          // V4: legacy consents were preselected; they cannot prove an affirmative choice.
          // Require every user to make a fresh, explicit choice before any tracking/CRM opt-in.
          if (version < 4) {
            const data = persistedState.data || {};
            persistedState = { ...persistedState, data: {
              ...data,
              consents: { recruiterShare: false, emailJobs: false, analytics: false },
            } };
          }
          // Gracefully migrate legacy local storage structures
          if (version < 2) {
            const data = persistedState.data || {};
            if (!data.consents) {
              data.consents = { recruiterShare: false, emailJobs: false, analytics: false };
            }
            if (!Array.isArray(data.experience)) data.experience = [];
            if (!Array.isArray(data.education)) data.education = [];
            if (!Array.isArray(data.skills)) data.skills = [];
            if (!Array.isArray(data.customSections)) data.customSections = [];
            if (!Array.isArray(data.references)) data.references = [];
            return {
              ...persistedState,
              data: {
                ...initialData,
                ...data,
                personalInfo: { ...initialData.personalInfo, ...(data.personalInfo || {}) },
                theme: { ...initialData.theme, ...(data.theme || {}) },
              },
            };
          }
          // v3: section visibility/order + density. Missing keys default to
          // visible / default order / comfortable — never clobber user data.
          if (version < 3) {
            const data = persistedState.data || {};
            if (!data.sectionVisibility || typeof data.sectionVisibility !== 'object') {
              data.sectionVisibility = {};
            }
            if (!Array.isArray(data.sectionOrder) || data.sectionOrder.length === 0) {
              data.sectionOrder = [...initialData.sectionOrder];
            }
            if (data.density !== 'compact' && data.density !== 'comfortable') {
              data.density = 'comfortable';
            }
            return { ...persistedState, data };
          }
          return persistedState;
        },
      }
    ),
    { limit: 50 }
  )
);
