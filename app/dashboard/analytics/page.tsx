"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Download, MapPin, Monitor, ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
import { V3Page, V3Eyebrow, V3Pill } from '@/components/v3/V3Chrome';
import { trackEvent } from '@/lib/analytics';

export default function AnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/user/analytics');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
    trackEvent('analytics_dashboard_viewed');
  }, []);

  if (loading) {
    return (
      <V3Page pageName="dashboard_analytics">
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <Loader2 size={40} className="animate-spin text-brand" />
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-navy">Loading Analytics…</h2>
        </div>
      </V3Page>
    );
  }

  return (
    <V3Page pageName="dashboard_analytics">
      <div className="mx-auto max-w-6xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-navy/70 transition-colors hover:text-coral">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <V3Eyebrow>§ resume analytics</V3Eyebrow>
            <h1 className="text-4xl font-black tracking-tight text-navy sm:text-5xl">
              Link-in-Bio <span className="text-brand">Analytics</span>
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
              See exactly who is viewing and downloading your public Cvyon resume.
            </p>
          </div>
          <V3Pill>
            <TrendingUp size={14} /> Pro Analytics
          </V3Pill>
        </div>

        {/* Top Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center gap-6 rounded-2xl border border-line bg-paper p-8 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand">
              <Eye size={30} className="text-white" />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Total Profile Views</p>
              <h3 className="text-5xl font-black tracking-tight text-navy">{data?.views || 0}</h3>
            </div>
          </div>

          <div className="flex items-center gap-6 rounded-2xl border border-line bg-paper p-8 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-coral">
              <Download size={30} className="text-white" />
            </div>
            <div>
              <p className="mb-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">Total PDF Downloads</p>
              <h3 className="text-5xl font-black tracking-tight text-navy">{data?.downloads || 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Geolocation Data */}
          <div>
            <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy">
              <MapPin size={22} className="text-brand" /> Top Viewer Locations
            </h2>
            <div className="rounded-2xl border border-line bg-paper p-6 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
              {data?.topLocations?.length > 0 ? (
                <div className="space-y-4">
                  {data.topLocations.map((loc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0">
                      <span className="text-[16px] font-bold text-navy">{loc.name}</span>
                      <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">{loc.count} Views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm font-bold uppercase tracking-[0.14em] text-muted">No location data yet.</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy">
              <Monitor size={22} className="text-coral" /> Recent Activity
            </h2>
            <div className="rounded-2xl bg-navy p-6 text-white shadow-[0_8px_22px_rgba(23,27,75,0.18)]">
              {data?.recentEvents?.length > 0 ? (
                <div className="space-y-4">
                  {data.recentEvents.map((ev: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                      <div className="mt-1">
                        {ev.event_type.includes('download') ? <Download size={16} className="text-coral" /> : <Eye size={16} className="text-teal" />}
                      </div>
                      <div>
                        <p className="font-bold">{ev.event_type.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-white/50">
                          {new Date(ev.created_at).toLocaleString()} • {ev.device_type || 'Desktop'} • {ev.country || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm font-bold uppercase tracking-[0.14em] text-white/50">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </V3Page>
  );
}
