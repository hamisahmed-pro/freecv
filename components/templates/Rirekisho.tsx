import React from 'react';
import { ResumeData } from '@/store/useResumeStore';
import { orderSections } from '@/lib/template-sections';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Register fonts for React-PDF. Open Sans carries the Latin text; Noto Sans
// JP carries the Japanese form labels (履歴書, 学歴・職歴, 資格・免許,
// 志望動機・自己PR) — a Latin-only font renders those as missing glyphs.
// Both come from the same CDN the other templates already use for Open Sans.
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-italic.ttf', fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ],
});
Font.register({
  family: 'Noto Sans JP',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/SubsetOTF/JP/NotoSansJP-Regular.otf' },
    { src: 'https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/SubsetOTF/JP/NotoSansJP-Bold.otf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
    color: '#111111',
    fontFamily: 'Open Sans',
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 43,
    paddingRight: 43,
    display: 'flex',
    flexDirection: 'column',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 2,
    borderBottomColor: '#111111',
    paddingBottom: 10,
  },
  formTitle: {
    fontFamily: 'Noto Sans JP',
    fontSize: 30,
    fontWeight: 700,
    letterSpacing: 8,
    color: '#111111',
  },
  formSubtitle: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#555555',
    textAlign: 'right',
  },
  personalRow: {
    flexDirection: 'row',
    marginTop: 14,
  },
  personalMain: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#555555',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    marginTop: 4,
    lineHeight: 1.1,
  },
  jobTitle: {
    fontSize: 11,
    color: '#333333',
    marginTop: 4,
  },
  contactLine: {
    fontSize: 10,
    lineHeight: 1.5,
    marginTop: 8,
  },
  photoBox: {
    width: 108,
    height: 137,
    borderWidth: 2,
    borderColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  photoLabelJp: {
    fontFamily: 'Noto Sans JP',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 4,
  },
  photoLabelEn: {
    fontSize: 8,
    color: '#555555',
    marginTop: 6,
    textAlign: 'center',
  },
  photoNote: {
    fontSize: 8,
    color: '#555555',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: '#111111',
    marginTop: 16,
  },
  sectionHeader: {
    backgroundColor: '#F5F5F0',
    borderBottomWidth: 1,
    borderBottomColor: '#111111',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
  },
  sectionTitleJp: {
    fontFamily: 'Noto Sans JP',
    fontWeight: 700,
  },
  sectionTitleEn: {
    fontWeight: 400,
    color: '#555555',
  },
  sectionBody: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  historyRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#111111',
  },
  historyDate: {
    width: 96,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#111111',
    fontSize: 10,
  },
  historyText: {
    flex: 1,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 10,
    lineHeight: 1.5,
  },
  historyHead: {
    fontWeight: 700,
  },
  historyDesc: {
    fontSize: 9,
    color: '#333333',
    marginTop: 2,
    lineHeight: 1.5,
  },
  bodyText: {
    fontSize: 10,
    lineHeight: 1.6,
  },
  footerNote: {
    fontSize: 8,
    color: '#555555',
    lineHeight: 1.5,
    marginTop: 18,
  },
});

export default function Rirekisho({ data }: { data: ResumeData }) {
  const hasHistory = data.education.length > 0 || data.experience.length > 0;
  const hasLicenses =
    data.skills.length > 0 || (data.showCertifications && data.certifications.length > 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleRow}>
          <Text style={styles.formTitle}>履歴書</Text>
          <Text style={styles.formSubtitle}>Rirekisho — Japanese standard resume form</Text>
        </View>

        {orderSections(
          data,
          {
            personal: (
              <View style={styles.personalRow}>
                <View style={styles.personalMain}>
                  <Text style={styles.fieldLabel}>氏名 — Name</Text>
                  <Text style={styles.name}>{data.personalInfo.fullName}</Text>
                  {data.personalInfo.jobTitle ? <Text style={styles.jobTitle}>{data.personalInfo.jobTitle}</Text> : null}
                  <View style={styles.contactLine}>
                    {data.personalInfo.location ? <Text>住所 Address: {data.personalInfo.location}</Text> : null}
                    {data.personalInfo.phone ? <Text>電話 Phone: {data.personalInfo.phone}</Text> : null}
                    {data.personalInfo.email ? <Text>メール Email: {data.personalInfo.email}</Text> : null}
                    {data.personalInfo.website ? <Text>ウェブ Website: {data.personalInfo.website}</Text> : null}
                  </View>
                </View>
                <View>
                  <View style={styles.photoBox}>
                    {data.personalInfo.profilePicture ? (
                      <Image src={data.personalInfo.profilePicture} style={{ width: 104, height: 133, objectFit: 'cover' }} />
                    ) : (
                      <View style={{ alignItems: 'center' }}>
                        <Text style={styles.photoLabelJp}>写真</Text>
                        <Text style={styles.photoLabelEn}>Photo{'\n'}4 × 3 cm</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.photoNote}>Photo if requested</Text>
                </View>
              </View>
            ),

            // One ruled table for the whole history: education, then work.
            experience: hasHistory ? (
              <View style={styles.sectionBox}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleJp}>学歴・職歴</Text>
                    <Text style={styles.sectionTitleEn}> — Education &amp; Work History</Text>
                  </Text>
                </View>
                {data.education.map((edu) => (
                  <View key={edu.id} style={styles.historyRow}>
                    <Text style={styles.historyDate}>{edu.graduationYear}</Text>
                    <View style={styles.historyText}>
                      <Text>
                        <Text style={styles.historyHead}>{edu.degree}</Text>
                        <Text> — {edu.school}</Text>
                      </Text>
                    </View>
                  </View>
                ))}
                {data.experience.map((exp) => (
                  <View key={exp.id} style={styles.historyRow}>
                    <Text style={styles.historyDate}>
                      {exp.startDate}
                      {exp.endDate ? ` – ${exp.endDate}` : ''}
                    </Text>
                    <View style={styles.historyText}>
                      <Text>
                        <Text style={styles.historyHead}>{exp.role}</Text>
                        <Text> — {exp.company}</Text>
                      </Text>
                      {exp.description ? <Text style={styles.historyDesc}>{exp.description}</Text> : null}
                    </View>
                  </View>
                ))}
              </View>
            ) : null,

            skills: hasLicenses ? (
              <View style={styles.sectionBox}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleJp}>資格・免許</Text>
                    <Text style={styles.sectionTitleEn}> — Licenses, Qualifications &amp; Skills</Text>
                  </Text>
                </View>
                <View style={styles.sectionBody}>
                  {data.showCertifications && data.certifications.length > 0 ? (
                    <Text style={styles.bodyText}>
                      {data.certifications
                        .map((c) => `${c.name}${c.issuer ? ` (${c.issuer}${c.date ? `, ${c.date}` : ''})` : ''}`)
                        .join(' · ')}
                    </Text>
                  ) : null}
                  {data.skills.length > 0 ? (
                    <Text style={[styles.bodyText, { marginTop: data.certifications.length > 0 ? 4 : 0 }]}>
                      {data.skills.map((s) => s.name).join(' · ')}
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null,
          },
          [
            // Self-PR always closes the form, after the ordered sections.
            data.summary ? (
              <View key="self-pr" style={styles.sectionBox}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>
                    <Text style={styles.sectionTitleJp}>志望動機・自己PR</Text>
                    <Text style={styles.sectionTitleEn}> — Motivation &amp; Self-PR</Text>
                  </Text>
                </View>
                <View style={styles.sectionBody}>
                  <Text style={styles.bodyText}>{data.summary}</Text>
                </View>
              </View>
            ) : null,
            ...(data.customSections || [])
              .filter((section) => section.items && section.items.length > 0)
              .map((section) => (
                <View key={section.id} style={styles.sectionBox}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                  </View>
                  <View style={styles.sectionBody}>
                    {section.items.map((item) => (
                      <View key={item.id} style={{ marginBottom: 8 }}>
                        <Text style={[styles.bodyText, { fontWeight: 700 }]}>
                          {item.title}
                          {item.date ? ` — ${item.date}` : ''}
                        </Text>
                        {item.subtitle ? <Text style={[styles.bodyText, { color: '#555555' }]}>{item.subtitle}</Text> : null}
                        {item.description ? <Text style={[styles.bodyText, { marginTop: 2 }]}>{item.description}</Text> : null}
                      </View>
                    ))}
                  </View>
                </View>
              )),
          ],
        )}

        <Text style={styles.footerNote}>
          A4で印刷。写真は応募先の指定に応じて添付してください。Print on A4. Attach a photo if requested.
        </Text>
      </Page>
    </Document>
  );
}
