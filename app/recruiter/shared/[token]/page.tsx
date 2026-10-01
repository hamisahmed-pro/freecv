import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';

export const dynamic = 'force-dynamic';

interface SharedSnapshotItem {
  profileId?: string;
  stage?: string;
  note?: string | null;
  profile?: {
    headline?: string;
    currentTitle?: string;
    yearsExperience?: number | null;
    topSkills?: string[];
    location?: string;
    country?: string;
    completenessScore?: number;
  };
}

const STAGE_STYLES: Record<string, string> = {
  new: 'border-line bg-paper',
  contacted: 'border-gold/60 bg-gold/30',
  interviewing: 'border-brand/30 bg-lavender',
  hired: 'border-teal/40 bg-mint',
  rejected: 'border-coral/40 bg-coral/10',
};

function stageLabel(stage?: string) {
  if (!stage) return 'New';
  return stage.charAt(0).toUpperCase() + stage.slice(1);
}

/** PUBLIC page — anyone with the token can view the anonymized snapshot. */
export default async function SharedShortlistPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const { data } = await supabaseAdmin
    .from('recruiter_shared_shortlists')
    .select('token, snapshot, created_at')
    .eq('token', token)
    .single();

  if (!data) notFound();

  const items: SharedSnapshotItem[] = Array.isArray(data.snapshot)
    ? data.snapshot
    : [];
  const sharedOn = data.created_at
    ? new Date(data.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <V3Page pageName="recruiter_shared" logoSub="RECRUITER">
      <div className="mx-auto max-w-3xl py-6">
        {/* Header */}
        <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-8">
          <V3Eyebrow>Shared shortlist — via Cvyon for Recruiters</V3Eyebrow>
          <h1 className="text-3xl font-black tracking-tight text-navy sm:text-4xl">
            {items.length} candidate{items.length === 1 ? '' : 's'} shortlisted
          </h1>
          {sharedOn && (
            <p className="mt-2 text-sm text-muted">Shared on {sharedOn}</p>
          )}
        </div>

        {/* Candidate cards */}
        <div className="mt-6 space-y-5">
          {items.map((item, i) => {
            const p = item.profile || {};
            const skills = Array.isArray(p.topSkills) ? p.topSkills : [];
            const location = [p.location, p.country].filter(Boolean).join(', ');
            const stage = (item.stage || 'new').toLowerCase();
            return (
              <article
                key={item.profileId || `item-${i}`}
                className="rounded-2xl border border-line bg-paper p-5 shadow-[0_8px_22px_rgba(23,27,75,0.08)] sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-navy">{p.headline || 'Candidate'}</h2>
                    {p.currentTitle && (
                      <p className="mt-1 font-bold text-navy/80">{p.currentTitle}</p>
                    )}
                  </div>
                  <span
                    className={`inline-block rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-navy ${STAGE_STYLES[stage] || 'border-line bg-paper'}`}
                  >
                    {stageLabel(item.stage)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold text-navy/70">
                  {p.yearsExperience != null && (
                    <span>{p.yearsExperience} yrs experience</span>
                  )}
                  {location && <span>{location}</span>}
                </div>

                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map((s, j) => (
                      <span
                        key={j}
                        className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-bold text-navy"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {item.note && (
                  <div className="mt-4 rounded-r-lg border-l-2 border-gold bg-cream/60 px-4 py-3 text-sm italic text-navy/80">
                    {item.note}
                  </div>
                )}
              </article>
            );
          })}
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-navy/25 bg-paper p-8 text-center text-sm font-bold text-muted">
              This shortlist is empty.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-2xl bg-navy p-6 text-center text-sm font-bold text-white/90">
          Shared via Cvyon for Recruiters · candidate identities stay private until
          the recruiter unlocks contact.
        </div>
      </div>
    </V3Page>
  );
}
