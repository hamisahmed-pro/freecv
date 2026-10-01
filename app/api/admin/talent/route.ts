import { logger } from '@/lib/logger';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin, adminFail } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return adminFail();
  }

  try {
    const fetchCandidates = async () => {
      let lastError: any = null;
      const attempts = [
        () => supabaseAdmin
          .from('candidates')
          .select('*')
          .is('deleted_at', null)
          .order('opted_in_at', { ascending: false, nullsFirst: false }),
        () => supabaseAdmin
          .from('candidates')
          .select('*')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false, nullsFirst: false }),
        () => supabaseAdmin.from('candidates').select('*').is('deleted_at', null),
      ];
      for (const attempt of attempts) {
        try {
          const res = await attempt();
          if (!res.error && res.data) return res.data;
          lastError = res.error;
        } catch (e: any) { lastError = e; }
      }
      logger.error('talent', 'All candidate fetch fallbacks failed', { error: lastError?.message || String(lastError) });
      throw new Error('Failed to fetch candidates: ' + (lastError?.message || 'database unreachable'));
    };

    const fetchProfiles = async () => {
      let lastError: any = null;
      const attempts = [
        () => supabaseAdmin
          .from('candidate_profiles')
          .select('*')
          .is('deleted_at', null)
          .order('updated_at', { ascending: false, nullsFirst: false }),
        () => supabaseAdmin.from('candidate_profiles').select('*').is('deleted_at', null),
      ];
      for (const attempt of attempts) {
        try {
          const res = await attempt();
          if (!res.error && res.data) return res.data;
          lastError = res.error;
        } catch (e: any) { lastError = e; }
      }
      logger.error('talent', 'All candidate-profile fetch fallbacks failed', { error: lastError?.message || String(lastError) });
      throw new Error('Failed to fetch candidate profiles: ' + (lastError?.message || 'database unreachable'));
    };

    const [candidatesData, profilesData] = await Promise.all([
      fetchCandidates(),
      fetchProfiles(),
    ]);

    // Map profiles by ID and by Email for robust pairing
    const profileById = new Map<string, any>(profilesData.map((p: any) => [p.id, p]));
    const profileByEmail = new Map<string, any>(
      profilesData.filter((p: any) => p.email).map((p: any) => [String(p.email).toLowerCase(), p])
    );
    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();

    const mergedCandidates: any[] = (candidatesData || []).map((c: any) => {
      seenIds.add(c.id);
      if (c.email) seenEmails.add(String(c.email).toLowerCase());
      
      const prof = profileById.get(c.id) || (c.email ? profileByEmail.get(String(c.email).toLowerCase()) : null);
      return {
        id: c.id,
        email: c.email || '',
        full_name: c.full_name || c.name || prof?.full_name || (c.email ? c.email.split('@')[0] : 'Candidate'),
        current_title: c.job_title || c.current_title || prof?.current_title || 'Professional',
        title_category: prof?.title_category || c.industry || '',
        country: c.country || prof?.country || 'Unknown',
        city: c.city || prof?.city || c.location || '',
        location: c.location || prof?.city || c.city || '',
        device_type: c.device_type || prof?.device_type || 'desktop',
        experience_years: c.experience_years ?? prof?.experience_years ?? 0,
        skills: (Array.isArray(prof?.skills) && prof.skills.length > 0) ? prof.skills : (c.skills || []),
        completeness_score: prof?.completeness_score || (c.skills?.length ? 85 : 70),
        consent_recruiter_share: prof?.consent_recruiter_share ?? true,
        consent_email_jobs: prof?.consent_email_jobs ?? true,
        consent_analytics: prof?.consent_analytics ?? true,
        opted_in_at: c.opted_in_at || c.created_at || prof?.consent_at || prof?.created_at,
        created_at: c.created_at || c.opted_in_at || prof?.created_at,
        updated_at: c.updated_at || prof?.updated_at,
        resume_data: c.resume_data || prof?.resume_data,
      };
    });

    // Include any profiles not yet in candidates
    (profilesData || []).forEach((p: any) => {
      const emailKey = p.email ? String(p.email).toLowerCase() : '';
      if (!seenIds.has(p.id) && (!emailKey || !seenEmails.has(emailKey))) {
        seenIds.add(p.id);
        if (emailKey) seenEmails.add(emailKey);
        mergedCandidates.push({
          id: p.id,
          email: p.email || '',
          full_name: p.full_name || 'Candidate',
          current_title: p.current_title || 'Professional',
          title_category: p.title_category || '',
          country: p.country || 'Unknown',
          city: p.city || '',
          location: p.city || '',
          device_type: p.device_type || 'desktop',
          experience_years: p.experience_years ?? 0,
          skills: p.skills || [],
          completeness_score: p.completeness_score || 80,
          consent_recruiter_share: p.consent_recruiter_share ?? true,
          consent_email_jobs: p.consent_email_jobs ?? true,
          consent_analytics: p.consent_analytics ?? true,
          opted_in_at: p.consent_at || p.created_at,
          created_at: p.created_at,
          updated_at: p.updated_at,
          resume_data: p.resume_data,
        });
      }
    });

    // Sort strictly newest-to-oldest so latest opt-in is always first
    mergedCandidates.sort((a, b) => {
      const timeA = new Date(a.opted_in_at || a.created_at || 0).getTime();
      const timeB = new Date(b.opted_in_at || b.created_at || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json({
      candidates: mergedCandidates,
      total: mergedCandidates.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('talent', 'Error fetching talent candidates:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
