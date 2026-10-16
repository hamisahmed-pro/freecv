"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/brand/Logo";
import { Loader2, RefreshCw, AlertCircle, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function WebhooksAdmin() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("webhook_event_queue")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast.error(error.message);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const retryEvent = async (id: string, payload: any) => {
    toast.loading("Retrying event...", { id: "retry" });
    try {
      const { error } = await supabase
        .from("webhook_event_queue")
        .update({ status: "pending", next_retry_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Event queued for retry", { id: "retry" });
      fetchEvents();
    } catch (err: any) {
      toast.error(err.message, { id: "retry" });
    }
  };

  return (
    <div className="min-h-screen bg-cream text-navy">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 lg:px-8">
          <Logo size={26} wordSize={20} sub="ADMIN" />
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-paper px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px hover:border-brand hover:text-brand"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Webhook Dead-Letter Queue</h1>
            <p className="mt-2 text-navy/65">Monitor and retry failed Paystack webhook events.</p>
          </div>
          <button
            onClick={fetchEvents}
            className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-paper px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider text-navy transition-transform hover:-translate-y-px hover:border-brand hover:text-brand"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand" size={32} /></div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl border border-line bg-paper p-12 text-center text-navy/60 shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <CheckCircle className="mx-auto mb-4 text-teal" size={48} />
            <p>Queue is empty. All webhooks processed successfully.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_8px_22px_rgba(23,27,75,0.08)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-cream text-[10px] uppercase tracking-[0.12em] text-navy/60">
                <tr>
                  <th className="p-4">Status</th>
                  <th className="p-4">Event Type</th>
                  <th className="p-4">Event ID</th>
                  <th className="p-4">Error</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {events.map((evt) => (
                  <tr key={evt.id} className="transition-colors hover:bg-cream/60">
                    <td className="p-4">
                      {evt.status === "failed" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-coral"><XCircle size={14} /> Failed</span>
                      ) : evt.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 font-bold text-navy/70"><AlertCircle size={14} /> Pending</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-teal"><CheckCircle size={14} /> Success</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs">{evt.event_type}</td>
                    <td className="max-w-[120px] truncate p-4 font-mono text-xs text-navy/50" title={evt.event_id}>{evt.event_id}</td>
                    <td className="max-w-[200px] truncate p-4 text-xs text-coral" title={evt.last_error}>{evt.last_error || "-"}</td>
                    <td className="p-4 text-xs text-navy/60">{new Date(evt.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      {evt.status !== "success" && (
                        <button onClick={() => retryEvent(evt.id, evt.payload)} className="text-xs font-bold text-brand hover:underline">
                          Queue Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
