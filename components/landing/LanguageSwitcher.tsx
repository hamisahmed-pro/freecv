"use client";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Globe, Check } from "lucide-react";

const LANGS: [string, string][] = [
  ["en", "English"],
  ["ar", "العربية"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["nl", "Nederlands"],
  ["zh", "中文"],
  ["ko", "한국어"],
  ["ja", "日本語"],
  ["la", "Latina"],
  ["pt", "Português"],
  ["fil", "Filipino"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["hi", "हिन्दी"],
  ["bn", "বাংলা"],
  ["mr", "मराठी"],
  ["ru", "Русский"],
  ["id", "Bahasa Indonesia"],
  ["ur", "اردو"],
];

const LOCALE_CODES = LANGS.map(([c]) => c);

export default function LanguageSwitcher({ current = "en", dark = false }: { current?: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  // Preserve the current page when switching languages:
  // /fr/blog/my-article -> /hi/blog/my-article, /build -> /ar/build
  const localizedHref = (code: string) => {
    const segs = pathname.split("/").filter(Boolean);
    if (segs.length > 0 && LOCALE_CODES.includes(segs[0])) segs.shift();
    const rest = segs.join("/");
    if (code === "en") return rest ? `/${rest}` : "/";
    return rest ? `/${code}/${rest}` : `/${code}`;
  };
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
          {LANGS.map(([code, name]) => (
            <a
              key={code}
              href={localizedHref(code)}
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
