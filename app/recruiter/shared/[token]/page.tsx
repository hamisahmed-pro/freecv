import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';

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
  new: 'bg-white',
  contacted: 'bg-[#FFF6D6]',
  interviewing: 'bg-[#DDEBFF]',
  hired: 'bg-[#D8F5D0]',
  rejected: 'bg-[#FFDCD4]',
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
    <main className="fd min-h-screen bg-[#FFF9F0] px-4 py-10 text-[#151a46] sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 border-[3px] border-[#151a46] bg-white p-6 hs">
          <p className="fm mb-2 text-[11px] font-bold uppercase tracking-[0.22em]">
            Shared shortlist — via Cvyon for Recruiters
          </p>
          <h1 className="fh text-3xl font-black sm:text-4xl">
            {items.length} candidate{items.length === 1 ? '' : 's'} shortlisted
          </h1>
          {sharedOn && (
            <p className="mt-2 text-sm opacity-70">Shared on {sharedOn}</p>
          )}
        </div>

        {/* Candidate cards */}
        <div className="space-y-5">
          {items.map((item, i) => {
            const p = item.profile || {};
            const skills = Array.isArray(p.topSkills) ? p.topSkills : [];
            const location = [p.location, p.country].filter(Boolean).join(', ');
            const stage = (item.stage || 'new').toLowerCase();
            return (
              <article
                key={item.profileId || `item-${i}`}
                className="border-[3px] border-[#151a46] bg-white p-5 hs sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="fh text-xl font-black">{p.headline || 'Candidate'}</h2>
                    {p.currentTitle && (
                      <p className="mt-1 font-bold">{p.currentTitle}</p>
                    )}
                  </div>
                  <span
                    className={`inline-block border-[3px] border-[#151a46] px-3 py-1 text-xs font-black uppercase tracking-wider ${STAGE_STYLES[stage] || 'bg-white'}`}
                  >
                    {stageLabel(item.stage)}
                  </span>
                </div>

                <div className="fm mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm font-bold">
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
                        className="border-2 border-[#151a46] bg-[#FFF6D6] px-2.5 py-1 text-xs font-bold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {item.note && (
                  <div className="mt-4 border-l-[3px] border-[#151a46] bg-[#F7F3EA] px-4 py-3 text-sm italic">
                    {item.note}
                  </div>
                )}
              </article>
            );
          })}
          {items.length === 0 && (
            <p className="border-[3px] border-[#151a46] bg-white p-6 text-center hs">
              This shortlist is empty.
            </p>
          )}
        </div>

        {/* Footer */}
        <footer className="fm mt-10 border-[3px] border-[#151a46] bg-[#151a46] p-5 text-center text-sm font-bold text-white">
          Shared via Cvyon for Recruiters · candidate identities stay private until
          the recruiter unlocks contact.
        </footer>
      </div>
    </main>
  );
}
