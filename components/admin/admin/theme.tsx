"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export type Mode = "dark" | "light";

export interface Tokens {
  mode: Mode;
  bg: string; rail: string; surface: string; surface2: string; inset: string;
  border: string; borderStrong: string;
  text: string; muted: string; faint: string;
  verm: string; cob: string; green: string; gold: string; hi: string;
  shadow: string; grid: string; dot: string; ring: string;
  onVerm: string;
}

/* Cvyon v3 palette for the admin tool. Dark mode stays dark (navy family);
   light mode uses the front-end cream/paper/navy values. */
export const T: Record<Mode, Tokens> = {
  dark: {
    mode: "dark",
    bg: "#151a46", rail: "#10143a", surface: "#1c2154", surface2: "#252b66", inset: "#0f1233",
    border: "#2e3577", borderStrong: "#f6f5ef",
    text: "#F2ECE1", muted: "#a3a7c8", faint: "#6e74a3",
    verm: "#ff604b", cob: "#5548f5", green: "#24c9bd", gold: "#ffd85a", hi: "#ffd85a",
    shadow: "rgba(0,0,0,0.45)", grid: "rgba(242,236,225,0.05)", dot: "rgba(242,236,225,0.06)",
    ring: "#5548f5", onVerm: "#ffffff",
  },
  light: {
    mode: "light",
    bg: "#ffffff", rail: "#f7f7fc", surface: "#ffffff", surface2: "#f4f5fb", inset: "#f0f1f8",
    border: "#e4e5ef", borderStrong: "#151a46",
    text: "#151a46", muted: "#5f6379", faint: "#a8abc0",
    verm: "#ff604b", cob: "#5548f5", green: "#0ea5a0", gold: "#d9a021", hi: "#ffd85a",
    shadow: "rgba(23,27,75,0.08)", grid: "rgba(21,26,70,0.04)", dot: "rgba(21,26,70,0.06)",
    ring: "#5548f5", onVerm: "#ffffff",
  },
};

interface Ctx { mode: Mode; setMode: (m: Mode) => void; t: Tokens; }
const AdminThemeContext = createContext<Ctx | null>(null);
const KEY = "cvyon-admin-theme-v2";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("light");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(KEY) : null;
    if (saved === "light" || saved === "dark") setModeState(saved);
  }, []);
  const setMode = (m: Mode) => { setModeState(m); try { localStorage.setItem(KEY, m); } catch {} };
  return <AdminThemeContext.Provider value={{ mode, setMode, t: T[mode] }}>{children}</AdminThemeContext.Provider>;
}

export function useAdminTheme() {
  const c = useContext(AdminThemeContext);
  if (!c) throw new Error("useAdminTheme must be used within AdminThemeProvider");
  return c;
}

export function ThemeToggle() {
  const { mode, setMode, t } = useAdminTheme();
  return (
    <button
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      title={mode === "dark" ? "Switch to light" : "Switch to dark"}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border transition-colors"
      style={{ borderColor: t.border, background: t.inset, color: t.text }}
    >
      {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}