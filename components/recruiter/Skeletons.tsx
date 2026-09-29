"use client";
import React from "react";
import { cn } from "@/lib/utils";

function Block({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-[#E8E7E1]", className)} />;
}

/** Single card skeleton — mirrors the rough shape of a MatchCard. */
export function CardSkeleton() {
  return (
    <div className="border-[3px] border-[#141312] bg-white hs p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-3">
          <Block className="h-5 w-16" />
          <Block className="h-7 w-3/4" />
          <Block className="h-4 w-1/2" />
        </div>
        <Block className="h-16 w-16 rounded-full" />
      </div>
      <div className="mt-5 flex gap-2">
        <Block className="h-7 w-20" />
        <Block className="h-7 w-24" />
        <Block className="h-7 w-16" />
      </div>
      <div className="mt-3 flex gap-2">
        <Block className="h-7 w-28" />
        <Block className="h-7 w-20" />
      </div>
      <div className="mt-6 flex gap-3">
        <Block className="h-11 w-11" />
        <Block className="h-11 flex-1" />
        <Block className="h-11 flex-1" />
      </div>
    </div>
  );
}

/** Three stacked card skeletons — for search results and pipeline lists. */
export function ResultListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2" aria-hidden>
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

/** Table skeleton — for the unlocks ledger. */
export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden border-[3px] border-[#141312] bg-white hs" aria-hidden>
      <div className="border-b-[3px] border-[#141312] bg-[#E8E7E1] p-5">
        <Block className="h-4 w-2/3 bg-white" />
      </div>
      <div className="divide-y-2 divide-[#141312]/10">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-5 px-5 py-4">
            <Block className="h-5 w-1/4" />
            <Block className="h-5 w-1/3" />
            <Block className="h-5 w-1/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
