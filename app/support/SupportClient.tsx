"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Send, MessageSquare, HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { V3Page, V3Eyebrow } from '@/components/v3/V3Chrome';

const FAQS = [
  {
    q: "Is Cvyon really free?",
    a: "Yes! Creating your resume, downloading it as PDF/DOCX, and using the ATS grader are 100% free forever for job seekers."
  },
  {
    q: "How does the ATS Grader work?",
    a: "Our AI analyzes your resume against a specific job description and scores it based on keyword matching, formatting, and relevance, providing actionable feedback to improve your chances."
  },
  {
    q: "Can recruiters see my resume?",
    a: "Only if you explicitly opt-in! When building your resume, you can toggle the 'Allow recruiters to find my profile' option. If disabled, your data is completely private."
  },
  {
    q: "I'm a recruiter. How do I access the talent pool?",
    a: "Create a recruiter account and buy 30-day access via Paystack to search the talent pool or use the API."
  }
];

export default function SupportClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [tickets, setTickets] = useState<any[]>([]);

  // Load saved ticket IDs from local storage (poor man's auth for public users)
  useEffect(() => {
    const savedIds = JSON.parse(localStorage.getItem('my_support_tickets') || '[]');
    if (savedIds.length > 0) {
      fetchTickets(savedIds);
    }

    // Subscribe to realtime updates for these tickets
    const channel = supabase
      .channel('public:support_tickets')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'support_tickets'
      }, (payload: any) => {
        // If it's one of our tickets, update the state
        if (savedIds.includes(payload.new.id)) {
          setTickets(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
          if (payload.new.admin_reply && payload.old.admin_reply !== payload.new.admin_reply) {
             toast.success('An admin replied to your ticket!');
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTickets = async (ids: string[]) => {
    const { data, error } = await supabase
      .from('support_tickets')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false });

    if (data) setTickets(data);
  };

  const [formData, setFormData] = useState({
    user_email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error('Failed to submit ticket');

      const responseData = await res.json();

      // Save ID
      if (responseData.ticket?.id) {
        const savedIds = JSON.parse(localStorage.getItem('my_support_tickets') || '[]');
        savedIds.push(responseData.ticket.id);
        localStorage.setItem('my_support_tickets', JSON.stringify(savedIds));
        fetchTickets(savedIds);
      }


      toast.success('Support ticket submitted successfully! We will email you back shortly.');
      setFormData({ user_email: '', subject: '', message: '' });
    } catch (err: any) {
      toast.error(err.message || 'Error submitting ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <V3Page pageName="support" logoSub="BUILD • GET HIRED" cta={{ label: "Build free →", href: "/build" }}>
      {/* Hero */}
      <div className="pb-[34px]">
        <V3Eyebrow>Support centre</V3Eyebrow>
        <h1 className="text-[clamp(42px,6vw,72px)] font-extrabold leading-[1.04] tracking-[-0.045em]">
          How can we help?
        </h1>
        <p className="mt-4 max-w-[650px] text-[17px] text-muted">
          Browse frequently asked questions or send us a message if you need further assistance.
        </p>
      </div>

      {/* FAQ + contact grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {/* Left: FAQ */}
        <section>
          <h2 className="mb-5 flex items-center gap-2 text-[28px] font-extrabold tracking-[-0.045em]">
            <HelpCircle className="text-brand" size={26} />
            Frequently asked questions
          </h2>
          <div className="overflow-hidden rounded-[18px] border border-line bg-paper shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-b border-line last:border-0">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between gap-4 px-[22px] py-5 text-left font-extrabold text-navy transition-colors hover:bg-cream"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp size={20} className="shrink-0 text-muted" />
                    : <ChevronDown size={20} className="shrink-0 text-muted" />}
                </button>
                {openFaq === idx && (
                  <p className="px-[22px] pb-5 text-[13px] leading-relaxed text-muted">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Right: contact form */}
        <section>
          <div className="rounded-[18px] border border-line bg-paper p-7 shadow-[0_16px_38px_rgba(23,27,75,0.09)]">
            <div className="mb-[22px] flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-[12px] bg-lavender text-brand">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="text-[20px] font-extrabold tracking-[-0.045em]">Contact support</h3>
                <p className="text-[12px] text-muted">We typically reply within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-muted">Email address</label>
                <input
                  type="email"
                  required
                  value={formData.user_email}
                  onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-navy outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-muted">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full rounded-[10px] border border-line bg-paper px-[13px] py-3 text-navy outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="What do you need help with?"
                />
              </div>

              <div className="grid gap-[7px]">
                <label className="text-[10px] font-black uppercase tracking-[0.08em] text-muted">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[130px] w-full resize-y rounded-[10px] border border-line bg-paper px-[13px] py-3 text-navy outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-[10px] bg-brand px-[18px] py-3 text-[12px] font-extrabold text-white shadow-[0_8px_18px_rgba(85,72,245,0.22)] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <span className="animate-spin text-xl leading-none">⟳</span>
                ) : (
                  <>
                    <Send size={16} />
                    Send message →
                  </>
                )}
              </button>
            </form>

            {/* My Recent Tickets */}
            {tickets.length > 0 && (
              <div className="mt-8 border-t border-line pt-8">
                <h3 className="mb-4 text-lg font-extrabold">My Recent Tickets</h3>
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="rounded-[12px] border border-line bg-cream p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold">{ticket.subject}</h4>
                        <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${ticket.status === 'open' ? 'bg-gold text-navy' : 'border border-line bg-paper text-muted'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="mb-3 text-xs text-muted">{ticket.message}</p>
                      {ticket.admin_reply && (
                        <div className="rounded-r-[8px] border-l-[3px] border-brand bg-paper p-3 text-sm">
                          <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-brand">Admin Reply</span>
                          {ticket.admin_reply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Privacy band */}
      <section className="mt-[72px] rounded-[18px] bg-navy px-6 py-[72px] text-center text-white">
        <div className="mx-auto mb-[18px] grid h-11 w-11 place-items-center rounded-[12px] bg-white/10 text-teal">
          <ShieldCheck size={22} />
        </div>
        <h2 className="text-[38px] font-extrabold tracking-[-0.045em]">Your privacy matters.</h2>
        <p className="mx-auto mt-[14px] max-w-[650px] text-[17px] text-[#bfc2d5]">
          You remain in control of your data. Export it, request deletion, or review your sharing choices.
        </p>
        <Link
          href="/manage-data"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-[10px] bg-lavender px-[18px] py-3 text-[12px] font-extrabold text-brand transition hover:-translate-y-px"
        >
          Manage my data →
        </Link>
      </section>
    </V3Page>
  );
}
