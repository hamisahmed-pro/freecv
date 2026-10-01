import React from 'react';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin-auth';
import { logger } from '@/lib/logger';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Server-side auth — requireAdmin() throws on missing/invalid session or
  // non-admin user; redirect those to the admin login page.
  try { await requireAdmin(); } catch { redirect('/admin/login'); }

  // Resilient candidate fetching that safely handles any column naming variation
  const fetchCandidates = async () => {
    let lastError: any = null;
    const attempts = [
      () => supabaseAdmin.from('candidates').select('*').is('deleted_at', null).order('opted_in_at', { ascending: false }),
      () => supabaseAdmin.from('candidates').select('*').is('deleted_at', null).order('updated_at', { ascending: false }),
      () => supabaseAdmin.from('candidates').select('*').is('deleted_at', null),
    ];
    for (const attempt of attempts) {
      try {
        const res = await attempt();
        if (!res.error && res.data) return res.data;
        lastError = res.error;
      } catch (e: any) { lastError = e; }
    }
    logger.error('admin', 'All candidate fetch fallbacks failed', { error: lastError?.message || String(lastError) });
    throw new Error('Failed to load talent pool: ' + (lastError?.message || 'database unreachable'));
  };

  const fetchProfiles = async () => {
    let lastError: any = null;
    const attempts = [
      () => supabaseAdmin.from('candidate_profiles').select('*').is('deleted_at', null).order('updated_at', { ascending: false }),
      () => supabaseAdmin.from('candidate_profiles').select('*').is('deleted_at', null),
    ];
    for (const attempt of attempts) {
      try {
        const res = await attempt();
        if (!res.error && res.data) return res.data;
        lastError = res.error;
      } catch (e: any) { lastError = e; }
    }
    logger.error('admin', 'All candidate-profile fetch fallbacks failed', { error: lastError?.message || String(lastError) });
    throw new Error('Failed to load candidate profiles: ' + (lastError?.message || 'database unreachable'));
  };

  const [candidatesList, profilesList, analytics, aiLogs, siteSettings, featureFlags, blogPosts, appSettingsRes] = await Promise.all([
    fetchCandidates(),
    fetchProfiles(),
    supabaseAdmin.from('analytics_events').select('*').order('created_at', { ascending: false }).limit(5000),
    supabaseAdmin.from('ai_usage_logs').select('*').order('created_at', { ascending: false }).limit(3000),
    supabaseAdmin.from('site_settings').select('*').maybeSingle(),
    supabaseAdmin.from('feature_flags').select('*').order('key'),
    supabaseAdmin.from('blog_posts').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('app_settings').select('*'),
  ]);

  const candidatesData = candidatesList || [];
  const profilesData = profilesList || [];

  // Parse app_settings into a clean key-value object
  const appSettings: Record<string, any> = {};
  if (appSettingsRes?.data) {
    appSettingsRes.data.forEach((item: any) => {
      appSettings[item.key] = item.value;
    });
  }

  // Combine candidates and candidate_profiles seamlessly so 100% of candidates appear
  const profileMap = new Map<string, any>(profilesData.map((p: any) => [p.id, p]));
  const seenIds = new Set<string>();

  const mergedCandidates: any[] = candidatesData.map((c: any) => {
    seenIds.add(c.id);
    const prof = profileMap.get(c.id);
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

  // Include any orphan profiles from candidate_profiles
  profilesData.forEach((p: any) => {
    if (!seenIds.has(p.id)) {
      seenIds.add(p.id);
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

  // Sort strictly newest-to-oldest
  mergedCandidates.sort((a, b) => {
    const timeA = new Date(a.opted_in_at || a.created_at || 0).getTime();
    const timeB = new Date(b.opted_in_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  return (
    <AdminDashboard
      candidates={mergedCandidates}
      analytics={analytics.data || []}
      aiLogs={aiLogs.data || []}
      siteSettings={siteSettings.data || {}}
      featureFlags={featureFlags.data || []}
      blogPosts={blogPosts.data || []}
      appSettings={appSettings}
    />
  );
}