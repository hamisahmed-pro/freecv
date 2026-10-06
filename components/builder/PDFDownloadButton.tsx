"use client";

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import toast from 'react-hot-toast';

interface PDFDownloadButtonProps {
  TemplateComponent: any;
  data: any;
  themeColor: string;
  onDownloadComplete?: () => void;
  className?: string;
  telemetry?: Record<string, any>;
  dict?: Record<string, string>;
}

export default function PDFDownloadButton({ TemplateComponent, data, onDownloadComplete, className, telemetry, dict }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const t = (k: string) => dict?.[k] || k;

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<TemplateComponent data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (data.personalInfo?.fullName || 'My').replace(/[^\w\s-]/g, '').trim();
      const safeRole = (data.personalInfo?.jobTitle || t("builder.resume")).replace(/[^\w\s-]/g, '').trim();
      a.download = `${safeName}_${safeRole}_Resume.pdf`.replace(/\s+/g, '_');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Unified funnel event: every completed PDF download (desktop header,
      // mobile header, mobile preview overlay) reports milestone_downloaded.
      trackEvent('milestone_downloaded', data.templateId, telemetry);
      if (onDownloadComplete) setTimeout(onDownloadComplete, 500);
    } catch (err: any) {
      toast.error('PDF export failed: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={isGenerating} className={className}>
      {isGenerating ? (
        <><Loader2 size={16} className="animate-spin" />{t("builder.pdf.generating_pdf")}</>
      ) : (
        <><Download size={16} />{t("builder.pdf.pdf")}</>
      )}
    </button>
  );
}
