"use client";
import { useState, useRef, useEffect } from "react";
import { Globe, Check } from "lucide-react";

const LANGS: [string, string, string][] = [
  ["en", "English", "/"],
  ["ar", "العربية", "/ar"],
  ["fr", "Français", "/fr"],
  ["de", "Deutsch", "/de"],
  ["nl", "Nederlands", "/nl"],
  ["zh", "中文", "/zh"],
  ["ko", "한국어", "/ko"],
  ["ja", "日本語", "/ja"],
  ["la", "Latina", "/la"],
  ["pt", "Português", "/pt"],
  ["fil", "Filipino", "/fil"],
  ["es", "Español", "/es"],
  ["it", "Italiano", "/it"],
];

export default function LanguageSwitcher({ current = "en", dark = false }: { current?: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const label = LANGS.find(([c]) => c === current)?.[1] ?? "English";
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Change language"
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12px] font-extrabold transition-colors ${dark ? "text-white/80 hover:text-white" : "text-[#5c6076] hover:text-navy"}`}
      >
        <Globe size={15} />
        <span className="hidden sm:inline">{label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[320px] w-44 overflow-y-auto rounded-xl border border-line bg-white p-1.5 shadow-[0_16px_38px_rgba(23,27,75,0.22)]">
          {LANGS.map(([code, name, href]) => (
            <a
              key={code}
              href={code === "en" ? "/" : href}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-bold transition-colors ${code === current ? "bg-lavender text-brand" : "text-navy hover:bg-cream"}`}
            >
              {name}
              {code === current && <Check size={14} />}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
