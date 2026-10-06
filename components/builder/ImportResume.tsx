"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ImportResume({ dict }: { dict: Record<string, string> }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const setAllData = useResumeStore((state) => state.setAllData);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processFile = async (file: File) => {
    setError(null);
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported for import at this time.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/ai/import-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to parse resume');
      }

      const parsedData = await res.json();
      
      const updates: any = {};
      
      // Personal Info: merge with existing, or overwrite. We'll overwrite completely except email if we want to be safe, but user wants old fields removed.
      updates.personalInfo = parsedData.personalInfo || { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '' };
      updates.summary = parsedData.summary || '';
      
      // Explicitly set arrays to empty if not returned, so old data is wiped out
      updates.experience = Array.isArray(parsedData.experience) ? parsedData.experience : [];
      updates.education = Array.isArray(parsedData.education) ? parsedData.education : [];
      updates.skills = Array.isArray(parsedData.skills) ? parsedData.skills : [];
      
      // Handle new sections
      if (Array.isArray(parsedData.projects) && parsedData.projects.length > 0) {
        updates.projects = parsedData.projects;
        updates.showProjects = true;
      } else {
        updates.projects = [];
        updates.showProjects = false;
      }

      if (Array.isArray(parsedData.certifications) && parsedData.certifications.length > 0) {
        updates.certifications = parsedData.certifications;
        updates.showCertifications = true;
      } else {
        updates.certifications = [];
        updates.showCertifications = false;
      }

      if (Array.isArray(parsedData.references) && parsedData.references.length > 0) {
        updates.references = parsedData.references;
        updates.showReferences = true;
      } else {
        updates.references = [];
        updates.showReferences = false;
      }

      if (Array.isArray(parsedData.customSections)) {
        updates.customSections = parsedData.customSections;
      } else {
        updates.customSections = [];
      }

      setAllData(updates);

      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during extraction.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 font-semibold rounded-xl border border-blue-200 transition-all mb-6"
      >
        <UploadCloud size={18} />{dict["builder.import.import_existing_resume_pdf"]}</button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />{dict["builder.import.import_from_pdf"]}</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
                disabled={isUploading}
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 text-center">{dict["builder.import.upload_your_old_resume_and_our_ai_will_i"]}</p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative",
                  isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50",
                  isUploading ? "opacity-50 pointer-events-none" : ""
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="application/pdf"
                  className="hidden"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center text-blue-600">
                    <Loader2 size={32} className="animate-spin mb-3" />
                    <span className="font-medium">{dict["builder.import.extracting_data"]}</span>
                    <span className="text-xs text-blue-400 mt-1">{dict["builder.import.this_usually_takes_about_5_seconds"]}</span>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className={cn("mb-3", isDragging ? "text-blue-500" : "text-gray-400")} />
                    <span className="font-semibold text-gray-700">{dict["builder.import.click_to_upload_or_drag_and_drop"]}</span>
                    <span className="text-xs text-gray-500 mt-1">{dict["builder.import.pdf_only_max_5mb"]}</span>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
