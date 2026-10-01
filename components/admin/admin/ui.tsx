"use client";
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { useAdminTheme } from "./theme";
import { cn, CountUp, Reveal } from "./motion";
import { Sparkline, RadialGauge } from "./charts";

export { cn, CountUp, Reveal };

/* Global admin styling: soft v3 cards, reveal/hover animations, and terminal
   scrollbars. Mount once in the shell. */
export function AdminStyle() {
  return (
    <style>{`
      .adm-reveal{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.2,.7,.2,1),transform .6s cubic-bezier(.2,.7,.2,1)}
      .adm-reveal.adm-in{opacity:1;transform:none}
      .adm-hover{transition:transform .15s ease, box-shadow .15s ease}
      .adm-hover:hover{transform:translateY(-1px)}
      .adm-pop{animation:admpop .26s cubic-bezier(.2,.8,.2,1) both}
      @keyframes admpop{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
      .adm-drawer{animation:admdraw .3s cubic-bezier(.2,.7,.2,1) both}
      @keyframes admdraw{from{transform:translateX(100%)}to{transform:none}}
      .adm-heat{transition:opacity .4s ease, transform .4s ease;transform:scale(.4);opacity:0}
      .adm-heat{animation:admheat .5s ease forwards}
      @keyframes admheat{to{transform:scale(1)}}
      .adm-blink{animation:admb 1.1s steps(2,start) infinite}
      @keyframes admb{50%{opacity:.15}}
      .adm-scroll::-webkit-scrollbar{width:9px;height:9px}
      .adm-scroll::-webkit-scrollbar-thumb{background:var(--sb,#2e3577);border:2px solid transparent;background-clip:padding-box;border-radius:8px}
      .adm-scroll::-webkit-scrollbar-track{background:transparent}
      @media (prefers-reduced-motion:reduce){.adm-reveal,.adm-hover,.adm-pop,.adm-drawer,.adm-heat,.adm-blink{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}}
    `}</style>
  );
}

/* ----------------------------- Card ----------------------------- */
export function Card({ children, className = "", hover = false, style, accent }:
  { children: React.ReactNode; className?: string; hover?: boolean; style?: React.CSSProperties; accent?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className={cn("relative rounded-2xl border adm-hover", hover && "adm-hover", className)}
      style={{ background: t.surface, borderColor: accent || t.border, boxShadow: `0 8px 22px ${t.shadow}`, ...style }}>
      {accent && <span className="absolute left-0 top-0 h-full w-1 rounded-l-2xl" style={{ background: accent }} />}
      {children}
    </div>
  );
}

export function SectionLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  const { t } = useAdminTheme();
  return <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: color || t.cob }}>§ {children}</div>;
}

/* ----------------------------- KPI ----------------------------- */
export function Kpi({ label, value, sub, accent, icon, spark, delta, gauge }:
  { label: string; value: React.ReactNode; sub?: string; accent?: string; icon?: React.ReactNode;
    spark?: number[]; delta?: number; gauge?: { value: number; max?: number } }) {
  const { t } = useAdminTheme();
  const c = accent || t.text;
  const up = (delta ?? 0) >= 0;
  return (
    <Card hover className="p-5" accent={c}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.muted }}>{label}</span>
        {icon && <span style={{ color: c }}>{icon}</span>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[2rem] font-extrabold leading-none tracking-tight" style={{ color: c }}>{value}</div>
          {sub && <div className="mt-1.5 text-[11px]" style={{ color: t.faint }}>{sub}</div>}
        </div>
        {gauge && <RadialGauge value={gauge.value} max={gauge.max} color={c} size={70} />}
        {spark && spark.length > 1 && <Sparkline data={spark} color={c} width={104} height={38} />}
      </div>
      {delta !== undefined && (
        <div className="mt-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
          style={{ borderColor: up ? t.green : t.verm, color: up ? t.green : t.verm }}>
          {up ? "▲" : "▼"} {Math.abs(delta)}%
        </div>
      )}
    </Card>
  );
}

export function Pill({ children, color, bg }: { children: React.ReactNode; color?: string; bg?: string }) {
  const { t } = useAdminTheme();
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={{ color: color || t.muted, borderColor: color || t.border, background: bg || "transparent" }}>{children}</span>
  );
}

/* ----------------------------- Controls ----------------------------- */
export function Btn({ children, onClick, variant = "primary", disabled, type = "button", className = "" }:
  { children: React.ReactNode; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; variant?: "primary" | "ghost" | "danger"; disabled?: boolean; type?: "button" | "submit"; className?: string }) {
  const { t } = useAdminTheme();
  const base = "inline-flex items-center justify-center gap-2 rounded-[10px] border px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-all hover:-translate-y-px active:translate-y-0 disabled:opacity-50";
  const styles: React.CSSProperties =
    variant === "danger" ? { background: t.verm, borderColor: t.verm, color: t.onVerm, boxShadow: `0 4px 12px ${t.shadow}` } :
    variant === "ghost" ? { background: "transparent", borderColor: t.border, color: t.text, boxShadow: `0 2px 8px ${t.shadow}` } :
    { background: t.verm, borderColor: t.verm, color: t.onVerm, boxShadow: `0 4px 12px ${t.shadow}` };
  return <button type={type} onClick={onClick} disabled={disabled} className={cn(base, className)} style={styles}>{children}</button>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  const { t } = useAdminTheme();
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.muted }}>{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px]" style={{ color: t.faint }}>{hint}</span>}
    </label>
  );
}

const fieldBox = (t: any): React.CSSProperties => ({
  background: t.inset, borderColor: t.border, color: t.text, ["--ring" as any]: t.ring,
});
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { t } = useAdminTheme();
  return <input {...props} className={cn("w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ring)]", props.className)} style={{ ...fieldBox(t), ...props.style }} />;
}
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { t } = useAdminTheme();
  return <textarea {...props} className={cn("w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ring)]", props.className)} style={{ ...fieldBox(t), ...props.style }} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { t } = useAdminTheme();
  return <select {...props} className={cn("w-full rounded-[10px] border px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--ring)]", props.className)} style={{ ...fieldBox(t), ...props.style }} />;
}
export function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  const { t } = useAdminTheme();
  return (
    <button type="button" onClick={() => onChange(!on)} aria-pressed={on}
      className="relative h-6 w-11 shrink-0 rounded-full border transition-colors"
      style={{ borderColor: t.border, background: on ? t.green : t.inset }}>
      <span className="absolute top-[3px] h-[18px] w-[18px] rounded-full bg-[#F2ECE1] transition-all" style={{ left: on ? 22 : 3 }} />
    </button>
  );
}

/* ----------------------------- Overlays ----------------------------- */
export function Modal({ open, onClose, title, children, wide }:
  { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  const { t } = useAdminTheme();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "adm-pop relative my-auto max-h-[88vh] w-full flex flex-col overflow-hidden rounded-2xl border shadow-2xl",
          wide ? "max-w-3xl" : "max-w-lg"
        )}
        style={{
          background: t.bg,
          borderColor: t.borderStrong,
          boxShadow: `0 18px 44px ${t.shadow}`,
        }}
      >
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between border-b px-5 py-3.5 sm:px-6 sm:py-4 shrink-0"
          style={{ borderColor: t.border, background: t.surface }}
        >
          <h3 className="truncate text-base sm:text-lg tracking-tight font-extrabold" style={{ color: t.text }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-[10px] border transition-transform hover:scale-105 active:scale-95 shrink-0 ml-2"
            style={{ borderColor: t.border, color: t.muted, background: t.surface2 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="adm-scroll flex-1 overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Drawer({ open, onClose, title, children }:
  { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      {children}
    </Modal>
  );
}

/* ----------------------------- Table ----------------------------- */
export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  const { t } = useAdminTheme();
  return (
    <div className="adm-scroll overflow-x-auto rounded-xl border" style={{ borderColor: t.border }}>
      <table className="w-full text-left text-sm">
        <thead><tr style={{ background: t.surface2 }}>
          {head.map((h) => <th key={h} className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>{h}</th>)}
        </tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
export function Row({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const { t } = useAdminTheme();
  return (
    <tr onClick={onClick} className={cn("border-t transition-colors", onClick && "cursor-pointer")}
      style={{ borderColor: t.border }}
      onMouseEnter={(e) => (e.currentTarget.style.background = t.surface2)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>{children}</tr>
  );
}
export function Cell({ children, className = "", style, title }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; title?: string }) {
  const { t } = useAdminTheme();
  return <td title={title} className={cn("px-4 py-3", className)} style={{ color: t.text, ...style }}>{children}</td>;
}

export function EmptyState({ icon, title, hint }: { icon?: React.ReactNode; title: string; hint?: string }) {
  const { t } = useAdminTheme();
  return (
    <div className="py-16 text-center">
      {icon && <div className="mb-3 flex justify-center" style={{ color: t.faint }}>{icon}</div>}
      <p className="text-lg font-bold" style={{ color: t.text }}>{title}</p>
      {hint && <p className="mt-1 text-sm" style={{ color: t.muted }}>{hint}</p>}
    </div>
  );
}

export function Spinner({ size = 24 }: { size?: number }) {
  const { t } = useAdminTheme();
  return <span className="inline-block animate-spin" style={{ width: size, height: size, border: `3px solid ${t.cob}`, borderTopColor: "transparent" }} />;
}