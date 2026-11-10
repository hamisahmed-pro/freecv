import { initialData } from '@/store/useResumeStore';
import type { ResumeData } from '@/store/useResumeStore';

/**
 * Illustrative data for the public template previews only.
 *
 * The preview must match the professional intent of a role-specific template:
 * showing a Product Designer on the Tutor page misleads search visitors.
 * Keep this separate from the builder store so changing a preview can never
 * overwrite a visitor's real resume or previously saved work.
 */
export function getTemplatePreviewData(templateId: ResumeData['templateId']): ResumeData {
  const generic: ResumeData = {
    ...initialData,
    templateId,
    personalInfo: {
      ...initialData.personalInfo,
      fullName: 'Jordan Mensah',
      jobTitle: 'Product Designer',
      email: 'jordan.mensah@example.com',
      phone: '+234 801 234 5678',
      location: 'Lagos, Nigeria',
      website: 'jordanmensah.design',
    },
  };

  if (templateId !== 'Tutor') return generic;

  return {
    ...generic,
    personalInfo: {
      fullName: 'Ada Okafor',
      jobTitle: 'Mathematics & English Tutor',
      email: 'ada.okafor@example.com',
      phone: '+234 800 000 0000',
      location: 'Abuja, Nigeria',
      website: '',
    },
    summary:
      'Patient academic tutor supporting secondary-school students through tailored lessons, clear explanations, and regular progress reviews.',
    experience: [
      {
        id: 'tutor-preview-experience',
        company: 'Independent Tutoring',
        role: 'Private Academic Tutor',
        startDate: '2022',
        endDate: 'Present',
        description:
          'Planned individualized Mathematics and English lessons for secondary-school students.\nDeveloped practice exercises and reviewed progress with learners and families.\nAdapted teaching methods to different learning needs.',
      },
    ],
    education: [
      {
        id: 'tutor-preview-education',
        school: 'Sample University',
        degree: 'BSc Mathematics Education',
        graduationYear: '2021',
      },
    ],
    skills: [
      { id: 'tutor-skill-1', name: 'Mathematics' },
      { id: 'tutor-skill-2', name: 'English Tutoring' },
      { id: 'tutor-skill-3', name: 'Lesson Planning' },
      { id: 'tutor-skill-4', name: 'Student Assessment' },
    ],
  };
}
