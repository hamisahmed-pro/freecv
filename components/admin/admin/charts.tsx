"use client";
import React, { useId, useState } from "react";
import { useAdminTheme } from "./theme";
import { cn, easeOutCubic, useDrawIn } from "./motion";

/* ----------------------------- Sparkline ----------------------------- */
export function Sparkline({ data, color, width = 132, height = 40, fill = true }:
  { data: number[]; color: string; width?: number; height?: number; fill?: boolean }) {
  const { ref, p } = useDrawIn<SVGSVGElement>(700);
  const gid = useId().replace(/:/g, "");
  if (!data.length) return <svg width={width} height={height} />;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pad = 3;
  const x = (i: number) => pad + (i * (width - pad * 2)) / Math.max(1, data.length - 1);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${height} L${x(0).toFixed(1)},${height} Z`;
  const lp = easeOutCubic(p);
  return (
    <svg ref={ref} width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sp-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#sp-${gid})`} opacity={lp} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"
        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="3" fill={color} opacity={lp}>
        <animate attributeName="r" values="3;5;3" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ----------------------------- Line / Area ----------------------------- */
export function LineChart({ data, labels, height = 240, color, unit = "", valueLabels = true }:
  { data: number[]; labels?: string[]; height?: number; color: string; unit?: string; valueLabels?: boolean }) {
  const { t } = useAdminTheme();
  const { ref, p } = useDrawIn<SVGSVGElement>(1100);
  const wrap = React.useRef<HTMLDivElement>(null);
  const gid = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);

  const W = 720, H = height;
  const padL = 38, padR = 14, padT = 16, padB = 26;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const min = Math.min(0, ...data), max = Math.max(...data, 1), span = max - min || 1;
  const n = data.length;
  const x = (i: number) => padL + (n <= 1 ? innerW / 2 : (i * innerW) / (n - 1));
  const y = (v: number) => padT + (1 - (v - min) / span) * innerH;
  const line = data.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(n - 1).toFixed(1)},${(padT + innerH).toFixed(1)} L${x(0).toFixed(1)},${(padT + innerH).toFixed(1)} Z`;
  const lp = easeOutCubic(p);
  const grid = [0, 0.25, 0.5, 0.75, 1];

  const onMove = (e: React.MouseEvent) => {
    const r = wrap.current?.getBoundingClientRect(); if (!r || !n) return;
    const rel = (e.clientX - r.left) / r.width;
    setHover(Math.max(0, Math.min(n - 1, Math.round(rel * (n - 1)))));
  };

  return (
    <div ref={wrap} className="relative w-full" onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
        <defs>
          <linearGradient id={`ln-${gid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {grid.map((g, i) => {
          const gy = padT + g * innerH;
          const val = Math.round(max - g * span);
          return (
            <g key={i}>
              <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke={t.border} strokeWidth="1" strokeDasharray="2 4" />
              {valueLabels && <text x={padL - 8} y={gy + 3} textAnchor="end" className="" fontSize="10" fill={t.muted}>{val}{unit}</text>}
            </g>
          );
        })}
        <path d={area} fill={`url(#ln-${gid})`} opacity={lp} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="miter"
          pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lp} />
        {data.map((v, i) => (
          <circle key={i} cx={x(i)} cy={y(v)} r={hover === i ? 4.5 : 2.5} fill={i === n - 1 ? color : t.surface}
            stroke={color} strokeWidth="2" opacity={lp} style={{ transition: "r .12s" }} />
        ))}
        {hover !== null && (
          <line x1={x(hover)} y1={padT} x2={x(hover)} y2={padT + innerH} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />
        )}
        {labels && labels.map((l, i) => (i % Math.ceil(n / 6) === 0 || i === n - 1) && (
          <text key={i} x={x(i)} y={H - 8} textAnchor="middle" className="" fontSize="10" fill={t.muted}>{l}</text>
        ))}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border px-2 py-1 text-[10px] font-bold"
          style={{ left: `${(x(hover) / W) * 100}%`, background: t.surface, borderColor: color, color: t.text, boxShadow: `0 6px 16px ${t.shadow}` }}>
          {labels?.[hover] ? <span style={{ color: t.muted }}>{labels[hover]} · </span> : null}
          <span style={{ color }}>{data[hover].toLocaleString()}{unit}</span>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- Radial Gauge ----------------------------- */
export function RadialGauge({ value, max = 100, color, label, size = 132, suffix = "%" }:
  { value: number; max?: number; color: string; label?: string; size?: number; suffix?: string }) {
  const { t } = useAdminTheme();
  const { ref, p } = useDrawIn<SVGSVGElement>(1100);
  const frac = Math.max(0, Math.min(1, value / max));
  const sw = 10, r = (size - sw) / 2, c = size / 2;
  return (
    <div className="flex flex-col items-center">
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke={t.surface2} strokeWidth={sw} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          pathLength={1} strokeDasharray={`${frac * easeOutCubic(p)} ${1 - frac * easeOutCubic(p)}`} strokeDashoffset={0} />
      </svg>
      <div className="flex flex-col items-center" style={{ marginTop: -size / 2 - 6 }}>
        <span className="text-3xl font-extrabold leading-none" style={{ color: t.text }}>{Math.round(value * easeOutCubic(p))}<span className="text-lg" style={{ color: t.muted }}>{suffix}</span></span>
      </div>
      {label && <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.muted }}>{label}</span>}
    </div>
  );
}

/* ----------------------------- Donut ----------------------------- */
export function Donut({ segments, size = 168, thickness = 26 }:
  { segments: { label: string; value: number; color: string }[]; size?: number; thickness?: number }) {
  const { t } = useAdminTheme();
  const { ref, p } = useDrawIn<SVGSVGElement>(1000);
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2, c = size / 2;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-7">
      <svg ref={ref} width={size} height={size} className="-rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke={t.surface2} strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / total;
          const local = Math.max(0, Math.min(1, (easeOutCubic(p) - i * 0.12) / (1 - i * 0.12 || 1)));
          const dash = frac * local;
          const el = (
            <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={s.color} strokeWidth={thickness}
              pathLength={1} strokeDasharray={`${dash} ${1 - dash}`} strokeDashoffset={-acc} />
          );
          acc += frac;
          return el;
        })}
      </svg>
      <div className="grid w-full grid-cols-1 gap-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-3 border-b py-1.5" style={{ borderColor: t.border }}>
            <span className="flex items-center gap-2 text-sm" style={{ color: t.text }}>
              <span className="h-3 w-3 shrink-0" style={{ background: s.color }} />{s.label}
            </span>
            <span className="text-[11px] font-bold" style={{ color: t.muted }}>
              {s.value.toLocaleString()} · {Math.round((s.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------- Heatmap ----------------------------- */
export function Heatmap({ grid, cols, rowLabels, color, cell = 15 }:
  { grid: number[]; cols: number; rowLabels?: string[]; color: string; cell?: number }) {
  const { t } = useAdminTheme();
  const rows = Math.ceil(grid.length / cols);
  const gap = 3;
  return (
    <div className="flex gap-2 overflow-x-auto">
      {rowLabels && (
        <div className="flex flex-col justify-around py-0.5 text-[9px] font-bold uppercase" style={{ color: t.faint }}>
          {rowLabels.map((l) => <span key={l} style={{ height: cell }}>{l}</span>)}
        </div>
      )}
      <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, ${cell}px)`, gridAutoRows: cell, gap }}>
        {grid.map((v, i) => (
          <span key={i} className="adm-heat" style={{
            width: cell, height: cell, background: v > 0 ? color : t.inset,
            opacity: v > 0 ? 0.18 + 0.82 * v : 1, transitionDelay: `${(i % cols) * 12 + Math.floor(i / cols) * 18}ms`,
          }} title={`${Math.round(v * 100)}%`} />
        ))}
      </div>
      <div className="flex items-end gap-1 pl-2 text-[9px]" style={{ color: t.faint }}>
        <span>less</span>
        {[0.1, 0.4, 0.7, 1].map((o) => <span key={o} style={{ width: cell, height: cell, background: color, opacity: o }} />)}
        <span>more</span>
      </div>
    </div>
  );
}

/* ----------------------------- Bars ----------------------------- */
export function Bars({ data, color, horizontal = true, height }:
  { data: { label: string; value: number }[]; color: string; horizontal?: boolean; height?: number }) {
  const { t } = useAdminTheme();
  const { ref, p } = useDrawIn<HTMLDivElement>(800);
  const max = Math.max(1, ...data.map((d) => d.value));
  if (!horizontal) {
    const h = height || 150;
    return (
      <div ref={ref} className="flex items-end gap-2" style={{ height: h + 22 }}>
        {data.map((d, i) => {
          const ep = easeOutCubic(Math.max(0, Math.min(1, (p - i * 0.05) / (1 - i * 0.05 || 1))));
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[9px] font-bold" style={{ color: t.muted }}>{d.value}</span>
              <div className="w-full" style={{ height: (d.value / max) * h * ep, background: color, minHeight: d.value ? 3 : 0, transition: "height .1s" }} />
              <span className="w-full truncate text-center text-[8px] uppercase" style={{ color: t.faint }}>{d.label}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <div ref={ref} className="space-y-2.5">
      {data.map((d, i) => {
        const ep = easeOutCubic(Math.max(0, Math.min(1, (p - i * 0.06) / (1 - i * 0.06 || 1))));
        return (
          <div key={i}>
            <div className="mb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
              <span className="truncate pr-2" style={{ color: t.text }}>{d.label}</span>
              <span style={{ color: t.muted }}>{d.value.toLocaleString()}</span>
            </div>
            <div className="h-3 w-full overflow-hidden" style={{ background: t.surface2 }}>
              <div className="h-full" style={{ width: `${(d.value / max) * 100 * ep}%`, background: color, transition: "width .1s" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}