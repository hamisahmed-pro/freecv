"use client";
import React from "react";
import { cn } from "@/lib/utils";

/** Cvyon v3 brand mark: navy ring with a coral dot. */
export function LogoMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <circle cx="15" cy="16" r="11" stroke="#151a46" strokeWidth="4.6" />
      <circle cx="25.4" cy="7.2" r="4.6" fill="#ff604b" />
    </svg>
  );
}

/** Full v3 lockup: mark + "cvyon" wordmark. */
export function Logo({
  size = 30,
  wordSize = 22,
  dark = false,
  className,
  wordClassName,
}: {
  size?: number;
  wordSize?: number;
  dark?: boolean;
  className?: string;
  wordClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)} aria-label="Cvyon">
      <LogoMark size={size} />
      <span
        className={wordClassName}
        style={{
          fontFamily: "var(--font-brand)",
          fontWeight: 950,
          fontSize: wordSize,
          letterSpacing: "-0.07em",
          color: dark ? "#ffffff" : "#151a46",
          lineHeight: 1,
        }}
      >
        cvyon
      </span>
    </span>
  );
}
