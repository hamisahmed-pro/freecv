"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, pdfjs } from 'react-pdf';
import { templates, TemplateKey } from '@/components/templates';
import { useResumeStore } from '@/store/useResumeStore';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function ClientPreview({ dict }: { dict: Record<string, string> }) {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get('template') as TemplateKey;
  const data = useResumeStore(state => state.data);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!templateParam || !templates[templateParam]) return;
    const SelectedTemplate = templates[templateParam];
    
    // Generate PDF blob
    const generatePDF = async () => {
      try {
        const blob = await pdf(<SelectedTemplate data={data} />).toBlob();
        setUrl(URL.createObjectURL(blob));
      } catch (e: any) {
        console.error('PDF generation error:', e.message);
      }
    };
    generatePDF();
  }, [templateParam, data]);

  if (!templateParam || !templates[templateParam]) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4 font-brand">
        <div className="max-w-sm rounded-2xl border border-line bg-paper p-8 text-center shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
          <p className="text-lg font-extrabold tracking-tight text-navy">{dict["builder.preview.invalid_template"]}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{dict["builder.preview.this_preview_link_doesn_apos_t_point_to"]}</p>
        </div>
      </div>
    );
  }

  if (!url) return (
    <div id="pdf-generating" className="flex min-h-screen items-center justify-center bg-cream px-4 font-brand">
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-6 py-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand" aria-hidden="true" />
        <p className="text-sm font-bold text-navy">{dict["builder.preview.generating_pdf"]}</p>
      </div>
    </div>
  );

  return (
    <div id="raw-template-container" style={{ width: '816px', height: '1056px', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: 'white' }}>
      <Document 
        file={url} 
        onLoadError={(error) => console.error('Document load error:', error.message)}
        onSourceError={(error) => console.error('Document source error:', error.message)}
      >
        <Page 
          pageNumber={1} 
          width={816} 
          renderTextLayer={false} 
          renderAnnotationLayer={false} 
          onLoadError={(error) => console.error('Page load error:', error.message)}
          onRenderError={(error) => console.error('Page render error:', error.message)}
        />
      </Document>
    </div>
  );
}
