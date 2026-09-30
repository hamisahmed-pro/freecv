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

/* Riso palette. Dark mode keeps the hues PUNCHY (only lifted where ink-on-ink
   would fail contrast) so it reads as the SAME family as the front-end, just
   inverted. Light mode = the literal front-end bone/ink/verm/cob values. */
export const T: Record<Mode, Tokens> = {
  dark: {
    mode: "dark",
    bg: "#151a46", rail: "#0e0d0c", surface: "#1b1916", surface2: "#242019", inset: "#0c0b0a",
    border: "#322d27", borderStrong: "#f6f5ef",
    text: "#F2ECE1", muted: "#9a9187", faint: "#6a6258",
    verm: "#ff604b", cob: "#4F73FF", green: "#2FB877", gold: "#FFC83D", hi: "#ffd85a",
    shadow: "#000000", grid: "rgba(242,236,225,0.05)", dot: "rgba(242,236,225,0.06)",
    ring: "#4F73FF", onVerm: "#F2ECE1",
  },
  light: {
    mode: "light",
    bg: "#f6f5ef", rail: "#dedbd2", surface: "#ffffff", surface2: "#f1eee6", inset: "#f6f4ee",
    border: "#cdc8bd", borderStrong: "#151a46",
    text: "#151a46", muted: "#5d564c", faint: "#8c8478",
    verm: "#ff604b", cob: "#5548f5", green: "#0E8A4B", gold: "#b07d18", hi: "#d8a400",
    shadow: "#151a46", grid: "rgba(20,19,18,0.05)", dot: "rgba(20,19,18,0.07)",
    ring: "#5548f5", onVerm: "#F2ECE1",
  },
};

interface Ctx { mode: Mode; setMode: (m: Mode) => void; t: Tokens; }
const AdminThemeContext = createContext<Ctx | null>(null);
const KEY = "cvyon-admin-theme";

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
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
      className="grid h-9 w-9 shrink-0 place-items-center border-2 transition-colors"
      style={{ borderColor: t.border, background: t.inset, color: t.text }}
    >
      {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}