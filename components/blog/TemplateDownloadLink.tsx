'use client';

import { trackEvent } from '@/lib/analytics';

export function TemplateDownloadLink({ name, file, sample }: { name: string; file: string; sample?: boolean }) {
  const format = sample ? 'pdf' : 'docx';
  const label = sample ? 'Sample PDF' : 'Blank Word (.docx)';
  return (
    <a href={`/downloads/resume-templates/${file}-${sample ? 'sample' : 'blank'}.${format}`}
      download aria-label={`Download ${name} ${label}`}
      onClick={() => void trackEvent('template_resource_click', name, { format, source: 'templates_guide' })}
      className="block py-1 text-sm font-bold text-[#2233FF] underline underline-offset-2">
      {label}
    </a>
  );
}
