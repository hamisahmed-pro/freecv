"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RisoNav, RisoFooter } from "@/components/riso/RisoChrome";
import { Loader2, RefreshCw, AlertCircle, CheckCircle, XCircle } from "lucide-react";
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
    <div className="relative min-h-screen bg-[#f6f5ef] text-[#151a46]">
      <RisoNav />
      <main className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="fd text-3xl tracking-tight sm:text-4xl">Webhook Dead-Letter Queue</h1>
            <p className="mt-2 text-[#151a46]/65">Monitor and retry failed Paystack webhook events.</p>
          </div>
          <button onClick={fetchEvents} className="riso-btn bg-white">
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#5548f5]" size={32} /></div>
        ) : events.length === 0 ? (
          <div className="riso-card p-12 text-center text-[#151a46]/60">
            <CheckCircle className="mx-auto mb-4 text-[#00AA55]" size={48} />
            <p>Queue is empty. All webhooks processed successfully.</p>
          </div>
        ) : (
          <div className="riso-card overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="border-b-2 border-[#151a46] bg-[#151a46]/5 fm uppercase tracking-widest text-[10px]">
                <tr>
                  <th className="p-4">Status</th>
                  <th className="p-4">Event Type</th>
                  <th className="p-4">Event ID</th>
                  <th className="p-4">Error</th>
                  <th className="p-4">Created</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151a46]/10">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-white/50 transition-colors">
                    <td className="p-4">
                      {evt.status === "failed" ? (
                        <span className="inline-flex items-center gap-1 text-[#ff604b] font-bold"><XCircle size={14} /> Failed</span>
                      ) : evt.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 text-[#FFB000] font-bold"><AlertCircle size={14} /> Pending</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#00AA55] font-bold"><CheckCircle size={14} /> Success</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-xs">{evt.event_type}</td>
                    <td className="p-4 font-mono text-xs text-[#151a46]/50 truncate max-w-[120px]" title={evt.event_id}>{evt.event_id}</td>
                    <td className="p-4 text-[#ff604b] text-xs truncate max-w-[200px]" title={evt.last_error}>{evt.last_error || "-"}</td>
                    <td className="p-4 text-[#151a46]/60 text-xs">{new Date(evt.created_at).toLocaleString()}</td>
                    <td className="p-4">
                      {evt.status !== "success" && (
                        <button onClick={() => retryEvent(evt.id, evt.payload)} className="text-[#5548f5] font-bold hover:underline text-xs">
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
      <RisoFooter />
    </div>
  );
}
