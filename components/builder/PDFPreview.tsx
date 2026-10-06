"use client";

import React, { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';

interface PDFPreviewProps {
  TemplateComponent: any;
  data: any;
  dict?: Record<string, string>;
}

export default function PDFPreview({ TemplateComponent, data, dict }: PDFPreviewProps) {
  const [isClient, setIsClient] = useState(false);
  const t = (k: string) => dict?.[k] || k;

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div className="w-full h-full bg-gray-100 flex items-center justify-center">{t("builder.pdf.loading_pdf")}</div>;

  return (
    <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }} showToolbar={false}>
      <TemplateComponent data={data} />
    </PDFViewer>
  );
}
