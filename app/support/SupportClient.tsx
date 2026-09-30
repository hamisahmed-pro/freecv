"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Send, MessageSquare, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Archivo, Archivo_Black, DM_Sans, Space_Mono } from '@/lib/fonts';

const display = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap" });
const head = Archivo({ subsets: ["latin"], weight: ["600", "800", "900"], display: "swap" });
const body = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], display: "swap" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
    <div className={cn("cv-riso relative min-h-screen text-[#151a46] bg-[#f6f5ef] overflow-x-hidden flex flex-col", body.className)}
      style={{ ["--ink" as any]: "#151a46", ["--verm" as any]: "#ff604b", ["--cob" as any]: "#5548f5", ["--hi" as any]: "#ffd85a", ["--fd" as any]: display.style.fontFamily, ["--fh" as any]: head.style.fontFamily, ["--fb" as any]: body.style.fontFamily, ["--fm" as any]: mono.style.fontFamily }}>
      <style>{`
        .cv-riso{font-family:var(--fb)} .cv-riso .fd{font-family:var(--fd)} .cv-riso .fh{font-family:var(--fh)} .cv-riso .fm{font-family:var(--fm)}
        .cv-riso .hs{box-shadow:7px 7px 0 var(--ink)} .cv-riso .hs-v{box-shadow:7px 7px 0 var(--verm)} .cv-riso .hs-c{box-shadow:6px 6px 0 var(--cob)}
        .cv-riso .hs-sm{box-shadow:5px 5px 0 var(--ink)}
        .cv-riso .riso-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; border: 3px solid var(--ink); background-color: var(--ink); color: #f6f5ef; padding: 0.75rem 1.5rem; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; box-shadow: 7px 7px 0 var(--ink); transition: all 0.2s; cursor: pointer; text-decoration: none; }
        .cv-riso .riso-btn:hover { transform: translate(2px, 2px); box-shadow: none; }
        .cv-riso .riso-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-btn-ghost { background-color: transparent; color: var(--ink); }
        .cv-riso .riso-card { border: 3px solid var(--ink); background-color: #ffffff; box-shadow: 7px 7px 0 var(--ink); }
        .cv-riso .riso-input { width: 100%; border: 3px solid var(--ink); background-color: #ffffff; padding: 0.75rem 1rem; font-family: var(--fm); font-size: 0.875rem; color: var(--ink); box-shadow: 4px 4px 0 var(--ink); transition: all 0.2s; outline: none; }
        .cv-riso .riso-input:focus { box-shadow: none; transform: translate(2px, 2px); border-color: var(--verm); }
        .cv-riso .riso-label { display: block; font-family: var(--fh); font-size: 0.875rem; font-weight: 800; color: var(--ink); }
        .cv-riso .riso-chip { display: inline-flex; align-items: center; gap: 0.25rem; border: 2px solid var(--ink); padding: 0.25rem 0.5rem; font-family: var(--fm); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; font-weight: bold; color: var(--ink); background: #ffffff; }
      `}</style>

      {/* Header */}
      <header className="bg-[#f6f5ef] border-b-[3px] border-[#151a46] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-light-no-background.png"
              alt="Cvyon"
              width={200}
              height={60}
              priority
              className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-all"
            />
            <span className="riso-chip">Support</span>
          </Link>
          <nav className="fm flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.18em]">
            <Link href="/" className="hover:text-[#ff604b] transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-[#ff604b] transition-colors">Blog</Link>
            <Link href="/developers" className="hover:text-[#ff604b] transition-colors">API Docs</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: FAQ */}
        <div className="space-y-8">
          <div>
            <h1 className="fd text-4xl tracking-tight mb-4">How can we help?</h1>
            <p className="text-lg text-[#151a46]/70">
              Browse our frequently asked questions or send us a message if you need further assistance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="fh text-2xl font-extrabold flex items-center gap-2">
              <HelpCircle className="text-[#5548f5]" />
              Frequently Asked Questions
            </h2>
            <div className="riso-card overflow-hidden">
              {FAQS.map((faq, idx) => (
                <div key={idx} className={`border-b-[3px] border-[#151a46] last:border-0`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f6f5ef] transition-colors"
                  >
                    <span className="fh font-extrabold">{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={20} className="text-[#151a46]/70" /> : <ChevronDown size={20} className="text-[#151a46]/70" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-4 text-[#151a46]/70 animate-in slide-in-from-top-2 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Ticket Form */}
        <div>
          <div className="riso-card p-8 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#f6f5ef] border-[3px] border-[#151a46]">
                <MessageSquare className="text-[#5548f5]" size={24} />
              </div>
              <div>
                <h2 className="fh text-2xl font-extrabold">Contact Support</h2>
                <p className="fm text-xs text-[#151a46]/70 font-bold uppercase tracking-widest">We typically reply within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="riso-label mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.user_email}
                  onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                  className="riso-input"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="riso-label mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="riso-input"
                  placeholder="What do you need help with?"
                />
              </div>

              <div>
                <label className="riso-label mb-2">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="riso-input resize-none"
                  placeholder="Please describe your issue in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="riso-btn w-full"
              >
                {isSubmitting ? (
                  <span className="animate-spin text-xl leading-none">⟳</span>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>

            {/* My Tickets */}
            {tickets.length > 0 && (
              <div className="mt-8 pt-8 border-t-[3px] border-[#151a46]">
                <h3 className="fh font-extrabold text-lg mb-4">My Recent Tickets</h3>
                <div className="space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-[#f6f5ef] border-[3px] border-[#151a46] p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-sm">{ticket.subject}</h4>
                        <span className={`fm text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-[#151a46] ${ticket.status === 'open' ? 'bg-[#ffd85a]' : 'bg-white'}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#151a46]/70 mb-3">{ticket.message}</p>
                      {ticket.admin_reply && (
                        <div className="bg-white border-l-[3px] border-[#5548f5] p-3 text-sm">
                          <span className="fm text-[10px] font-bold text-[#5548f5] uppercase tracking-widest block mb-1">Admin Reply</span>
                          {ticket.admin_reply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
