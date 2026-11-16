import React from 'react';
import { ResumeData } from '@/store/useResumeStore';
import { orderSections } from '@/lib/template-sections';

/**
 * Rirekisho — the Japanese standard resume form (履歴書).
 *
 * A real rirekisho is a ruled form, not a free-layout resume: a photo box,
 * a chronological 学歴・職歴 (education & work history) table, a 資格・免許
 * (licenses & skills) block, and a 志望動機・自己PR (motivation / self-PR)
 * block. This template lays the builder's ResumeData out in that form, with
 * bilingual section labels so English-speaking applicants can use it too.
 *
 * Notes on the mapping (2026-11-16 SEO audit, Fix 3):
 * - The history table is ONE form section: education rows first, then work
 *   rows, both keyed to the 'experience' block so the table never splits.
 *   Hiding 'experience' hides the whole table, by design.
 * - Dates print exactly as entered (Western years are acceptable on a
 *   rirekisho; Japanese era years are not computed).
 * - The photo box shows the builder's profile picture when one is set, and
 *   an empty labelled box otherwise — a rirekisho is submitted with a
 *   4×3 cm photo attached.
 * - Print on A4.
 */

export default function Rirekisho({ data }: { data: ResumeData }) {
  const hasHistory = data.education.length > 0 || data.experience.length > 0;
  const hasLicenses = data.skills.length > 0 || (data.showCertifications && data.certifications.length > 0);

  return (
    <div className="bg-white text-[#111111] font-sans w-[8.5in] min-h-[11in] shadow-xl print:shadow-none px-[0.6in] py-[0.5in] flex flex-col border-2 border-[#111111] print:border-[#111111] mx-auto">
      {/* Form title */}
      <div className="flex items-end justify-between border-b-2 border-[#111111] pb-3">
        <h1 className="text-[34px] font-bold tracking-[0.35em] leading-none">履 歴 書</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555] text-right">
          Rirekisho — Japanese standard resume form
        </p>
      </div>

      {orderSections(
        data,
        {
          personal: (
            <>
              {/* Identity + photo box */}
              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#555555]">氏名 — Name</p>
                  <p className="text-[26px] font-bold leading-tight mt-1">{data.personalInfo.fullName}</p>
                  {data.personalInfo.jobTitle && (
                    <p className="text-[13px] text-[#333333] mt-1">{data.personalInfo.jobTitle}</p>
                  )}
                  <div className="mt-3 space-y-1 text-[12px] leading-relaxed">
                    {data.personalInfo.location && <p><span className="font-bold">住所 Address: </span>{data.personalInfo.location}</p>}
                    {data.personalInfo.phone && <p><span className="font-bold">電話 Phone: </span>{data.personalInfo.phone}</p>}
                    {data.personalInfo.email && <p><span className="font-bold">メール Email: </span>{data.personalInfo.email}</p>}
                    {data.personalInfo.website && <p><span className="font-bold">ウェブ Website: </span>{data.personalInfo.website}</p>}
                  </div>
                </div>
                <div className="w-[1.5in] shrink-0">
                  <div className="border-2 border-[#111111] w-[1.5in] h-[1.9in] flex flex-col items-center justify-center bg-white overflow-hidden">
                    {data.personalInfo.profilePicture ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={data.personalInfo.profilePicture} alt="Applicant photograph" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="text-[16px] font-bold tracking-[0.3em]">写 真</span>
                        <span className="text-[9px] text-[#555555] mt-2 px-2 text-center leading-relaxed">Photo<br />4 × 3 cm</span>
                      </>
                    )}
                  </div>
                  <p className="text-[9px] text-[#555555] mt-1 text-center">Attach a 4 × 3 cm photo</p>
                </div>
              </div>
            </>
          ),

          // One ruled table for the whole history: education, then work.
          experience: hasHistory && (
            <div className="mt-5">
              <div className="border border-[#111111]">
                <div className="bg-[#F5F5F0] border-b border-[#111111] px-3 py-2">
                  <h2 className="text-[12px] font-bold tracking-wide">学歴・職歴 <span className="font-normal text-[#555555]">— Education &amp; Work History</span></h2>
                </div>
                <table className="w-full text-[12px] leading-relaxed" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    {data.education.map((edu) => (
                      <tr key={edu.id} className="border-t border-[#111111]">
                        <td className="px-3 py-2 align-top w-[1.35in] border-r border-[#111111] whitespace-nowrap">{edu.graduationYear}</td>
                        <td className="px-3 py-2 align-top">
                          <span className="font-bold">{edu.degree}</span>
                          <span className="text-[#333333]"> — {edu.school}</span>
                        </td>
                      </tr>
                    ))}
                    {data.experience.map((exp) => (
                      <tr key={exp.id} className="border-t border-[#111111]">
                        <td className="px-3 py-2 align-top w-[1.35in] border-r border-[#111111] whitespace-nowrap">{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</td>
                        <td className="px-3 py-2 align-top">
                          <span className="font-bold">{exp.role}</span>
                          <span className="text-[#333333]"> — {exp.company}</span>
                          {exp.description && (
                            <span className="block text-[11px] text-[#333333] mt-1 whitespace-pre-wrap">{exp.description}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ),

          skills: hasLicenses && (
            <div className="mt-5">
              <div className="border border-[#111111]">
                <div className="bg-[#F5F5F0] border-b border-[#111111] px-3 py-2">
                  <h2 className="text-[12px] font-bold tracking-wide">資格・免許 <span className="font-normal text-[#555555]">— Licenses, Qualifications &amp; Skills</span></h2>
                </div>
                <div className="px-3 py-2 text-[12px] leading-relaxed">
                  {data.showCertifications && data.certifications.length > 0 && (
                    <p className="mb-1">
                      {data.certifications.map((c) => `${c.name}${c.issuer ? ` (${c.issuer}${c.date ? `, ${c.date}` : ''})` : ''}`).join(' · ')}
                    </p>
                  )}
                  {data.skills.length > 0 && (
                    <p>{data.skills.map((s) => s.name).join(' · ')}</p>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        [
          // Self-PR always closes the form, after the ordered sections.
          data.summary ? (
            <div key="self-pr" className="mt-5">
              <div className="border border-[#111111]">
                <div className="bg-[#F5F5F0] border-b border-[#111111] px-3 py-2">
                  <h2 className="text-[12px] font-bold tracking-wide">志望動機・自己PR <span className="font-normal text-[#555555]">— Motivation &amp; Self-PR</span></h2>
                </div>
                <p className="px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap">{data.summary}</p>
              </div>
            </div>
          ) : null,
          ...(data.customSections || [])
            .filter((section) => section.items && section.items.length > 0)
            .map((section) => (
              <div key={section.id} className="mt-5">
                <div className="border border-[#111111]">
                  <div className="bg-[#F5F5F0] border-b border-[#111111] px-3 py-2">
                    <h2 className="text-[12px] font-bold tracking-wide">{section.title}</h2>
                  </div>
                  <div className="px-3 py-2 space-y-3">
                    {section.items.map((item) => (
                      <div key={item.id}>
                        <div className="flex justify-between items-baseline">
                          <p className="text-[12px] font-bold">{item.title}</p>
                          {item.date && <span className="text-[11px] text-[#555555]">{item.date}</span>}
                        </div>
                        {item.subtitle && <p className="text-[11px] text-[#555555]">{item.subtitle}</p>}
                        {item.description && <p className="text-[12px] leading-relaxed whitespace-pre-wrap mt-1">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )),
        ],
      )}

      <p className="mt-6 text-[10px] text-[#555555] leading-relaxed">
        履歴書は A4 サイズで印刷し、4×3 cm の写真を貼ってください。Print on A4 and attach a 4×3 cm photograph.
      </p>
    </div>
  );
}
