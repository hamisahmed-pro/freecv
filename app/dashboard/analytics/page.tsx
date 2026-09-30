"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Eye, Download, MapPin, Monitor, ArrowLeft, Loader2, TrendingUp } from 'lucide-react';
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
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#5548f5] mb-4" />
        <h2 className="text-xl font-black uppercase tracking-widest text-[#151a46]">Loading Analytics...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#151a46] selection:bg-[#5548f5] selection:text-white font-sans">
      <nav className="border-b-[4px] border-[#151a46] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="text-sm font-black tracking-widest uppercase flex items-center gap-2 group text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="flex gap-4">
            <div className="hidden sm:flex bg-[#151a46] text-[#f6f5ef] border-[3px] border-[#151a46] px-6 py-2.5 rounded-none font-bold uppercase tracking-wider text-sm items-center gap-2">
              <TrendingUp size={16} className="text-[#ff604b]" /> Pro Analytics
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
            Link-in-Bio <br />
            <span className="text-[#5548f5]">Analytics</span>
          </h1>
          <p className="text-lg font-medium text-gray-600 max-w-2xl">
            See exactly who is viewing and downloading your public Cvyon resume.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border-[4px] border-[#151a46] p-8 shadow-[8px_8px_0_#151a46] flex items-center gap-6 group hover:-translate-y-1 hover:shadow-[12px_12px_0_#151a46] transition-all">
            <div className="w-16 h-16 bg-[#5548f5] flex items-center justify-center border-[3px] border-[#151a46] shadow-[4px_4px_0_#151a46] group-hover:scale-110 transition-transform">
              <Eye size={32} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-500 mb-1">Total Profile Views</p>
              <h3 className="text-6xl font-black tracking-tighter">{data?.views || 0}</h3>
            </div>
          </div>

          <div className="bg-white border-[4px] border-[#151a46] p-8 shadow-[8px_8px_0_#ff604b] flex items-center gap-6 group hover:-translate-y-1 hover:shadow-[12px_12px_0_#ff604b] transition-all">
            <div className="w-16 h-16 bg-[#ff604b] flex items-center justify-center border-[3px] border-[#151a46] shadow-[4px_4px_0_#151a46] group-hover:scale-110 transition-transform">
              <Download size={32} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-500 mb-1">Total PDF Downloads</p>
              <h3 className="text-6xl font-black tracking-tighter">{data?.downloads || 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Geolocation Data */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-[#5548f5]" /> Top Viewer Locations
            </h2>
            <div className="bg-white border-[4px] border-[#151a46] p-6 shadow-[6px_6px_0_#151a46]">
              {data?.topLocations?.length > 0 ? (
                <div className="space-y-4">
                  {data.topLocations.map((loc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b-2 border-gray-100 pb-3 last:border-0 last:pb-0">
                      <span className="font-bold text-lg">{loc.name}</span>
                      <span className="bg-[#151a46] text-white px-3 py-1 text-xs font-black uppercase tracking-widest">{loc.count} Views</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 font-bold py-8 text-center uppercase tracking-widest text-sm">No location data yet.</p>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <Monitor size={24} className="text-[#ff604b]" /> Recent Activity
            </h2>
            <div className="bg-[#151a46] border-[4px] border-[#151a46] p-6 shadow-[6px_6px_0_#5548f5] text-white">
              {data?.recentEvents?.length > 0 ? (
                <div className="space-y-4">
                  {data.recentEvents.map((ev: any, i: number) => (
                    <div key={i} className="flex items-start gap-4 border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                      <div className="mt-1">
                        {ev.event_type.includes('download') ? <Download size={16} className="text-[#ff604b]" /> : <Eye size={16} className="text-[#5548f5]" />}
                      </div>
                      <div>
                        <p className="font-bold">{ev.event_type.replace(/_/g, ' ').toUpperCase()}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium tracking-widest uppercase">
                          {new Date(ev.created_at).toLocaleString()} • {ev.device_type || 'Desktop'} • {ev.country || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 font-bold py-8 text-center uppercase tracking-widest text-sm">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
