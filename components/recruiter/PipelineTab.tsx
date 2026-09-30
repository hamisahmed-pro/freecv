"use client";
import React, { useMemo, useState } from "react";
import {
  KanbanSquare, MapPin, Briefcase, X, Loader2, Share2, Download, Copy,
  StickyNote, Check, Plus,
} from "lucide-react";
import {
  PortalShortlistItem, PipelineStage,
  updateShortlistItem, createSharedLink,
} from "@/lib/recruiter-portal";
import { removeFromShortlist } from "@/lib/recruiter-api";
import { downloadCsv } from "@/lib/recruiter-csv";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const STAGES: { id: PipelineStage | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "contacted", label: "Contacted" },
  { id: "interviewing", label: "Interviewing" },
  { id: "hired", label: "Hired" },
  { id: "rejected", label: "Rejected" },
];

const STAGE_OPTIONS: PipelineStage[] = ["new", "contacted", "interviewing", "hired", "rejected"];

function stageLabel(stage: PipelineStage): string {
  return STAGES.find((s) => s.id === stage)?.label ?? stage;
}

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

function PipelineCard({ item, onChanged }: { item: PortalShortlistItem; onChanged: () => void }) {
  const p = item.profile || {};
  const [stageBusy, setStageBusy] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState(item.note || "");
  const [noteBusy, setNoteBusy] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleStage = async (stage: PipelineStage) => {
    if (stage === item.stage || stageBusy) return;
    setStageBusy(true);
    try {
      await updateShortlistItem(item.profileId, { stage });
      toast.success(`Moved to ${stageLabel(stage)}.`);
      onChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't update the stage.");
    } finally {
      setStageBusy(false);
    }
  };

  const handleSaveNote = async () => {
    setNoteBusy(true);
    try {
      await updateShortlistItem(item.profileId, { note: noteDraft.trim() });
      toast.success("Note saved.");
      setNoteOpen(false);
      onChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't save the note.");
    } finally {
      setNoteBusy(false);
    }
  };

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeFromShortlist(item.profileId);
      toast.success("Removed from pipeline.");
      onChanged();
    } catch (e: any) {
      toast.error(e?.message || "Couldn't remove from pipeline.");
      setRemoving(false);
    }
  };

  return (
    <div className="flex flex-col border-[3px] border-[#151a46] bg-white hs">
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <h3 className="fh text-lg font-extrabold leading-tight tracking-tight">{p.headline || "Shortlisted candidate"}</h3>
          {p.currentTitle && (
            <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-[#151a46]/75">
              <Briefcase size={13} className="shrink-0 text-[#5548f5]" /> <span className="truncate">{p.currentTitle}</span>
            </div>
          )}
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 fm text-[11px] uppercase tracking-wider text-[#151a46]/60">
            {(p.location || p.country) && (
              <span className="flex items-center gap-1"><MapPin size={11} /> {[p.location, p.country].filter(Boolean).join(", ")}</span>
            )}
            {p.yearsExperience != null && <span>{p.yearsExperience} yrs exp</span>}
            {item.shortlistedAt && <span>shortlisted {fmtDate(item.shortlistedAt)}</span>}
          </div>
        </div>
        <button
          onClick={handleRemove}
          disabled={removing}
          aria-label="Remove from pipeline"
          title="Remove from pipeline"
          className="grid h-9 w-9 shrink-0 place-items-center border-[3px] border-[#151a46] bg-[#ffd85a] transition-all hover:bg-[#ff604b] hover:text-white disabled:opacity-60"
        >
          {removing ? <Loader2 size={15} className="animate-spin" /> : <X size={15} />}
        </button>
      </div>

      {Array.isArray(p.topSkills) && p.topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5">
          {p.topSkills.slice(0, 6).map((s: string) => (
            <span key={s} className="border-2 border-[#151a46] bg-[#f6f5ef] px-2 py-0.5 fm text-[9px] font-bold uppercase tracking-[0.14em]">{s}</span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 px-5">
        <label className="fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60">Stage</label>
        <select
          value={item.stage}
          disabled={stageBusy}
          onChange={(e) => handleStage(e.target.value as PipelineStage)}
          className="border-[3px] border-[#151a46] bg-white px-3 py-2 text-sm font-bold text-[#151a46] outline-none focus:border-[#ff604b] disabled:opacity-60"
        >
          {STAGE_OPTIONS.map((s) => (
            <option key={s} value={s}>{stageLabel(s)}</option>
          ))}
        </select>
        {stageBusy && <Loader2 size={14} className="animate-spin text-[#151a46]/50" />}
      </div>

      <div className="px-5 pt-3">
        <button
          onClick={() => { setNoteDraft(item.note || ""); setNoteOpen((o) => !o); }}
          className="flex items-center gap-1.5 fm text-[10px] font-bold uppercase tracking-[0.18em] text-[#151a46]/60 hover:text-[#151a46]"
        >
          <StickyNote size={12} /> {item.note ? "Edit note" : "Add note"}
        </button>
        {item.note && !noteOpen && (
          <p className="mt-2 border-l-[3px] border-[#ffd85a] bg-[#f6f5ef]/50 px-3 py-2 text-sm text-[#151a46]/80">{item.note}</p>
        )}
        {noteOpen && (
          <div className="mt-2">
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              rows={3}
              placeholder="e.g. First call Tue — asked for salary band…"
              className="w-full resize-y border-[3px] border-[#151a46] bg-white p-3 text-sm text-[#151a46] placeholder:text-[#151a46]/35 outline-none focus:border-[#ff604b]"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={handleSaveNote}
                disabled={noteBusy}
                className="flex items-center gap-1.5 border-[3px] border-[#151a46] bg-[#151a46] px-4 py-2 fh text-[11px] font-extrabold uppercase tracking-wider text-[#f6f5ef] hover:bg-[#0E8A4B] hover:border-[#0E8A4B] disabled:opacity-60"
              >
                {noteBusy ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Save
              </button>
              <button
                onClick={() => setNoteOpen(false)}
                className="border-[3px] border-[#151a46]/30 px-4 py-2 fh text-[11px] font-extrabold uppercase tracking-wider text-[#151a46]/60 hover:border-[#151a46] hover:text-[#151a46]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-auto px-5 pb-4 pt-4 fm text-[10px] uppercase tracking-[0.14em] text-[#151a46]/45">
        anonymized · unlock from a search to reveal contact
      </p>
    </div>
  );
}

/**
 * Hiring pipeline: stage filter chips, per-candidate cards with stage select
 * + notes, share-link generation, CSV export.
 */
export function PipelineTab({
  items,
  onChanged,
  onNewSearch,
}: {
  items: PortalShortlistItem[];
  onChanged: () => void;
  onNewSearch: () => void;
}) {
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");
  const [sharing, setSharing] = useState(false);
  const [sharedUrl, setSharedUrl] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    for (const s of STAGE_OPTIONS) c[s] = items.filter((i) => i.stage === s).length;
    return c;
  }, [items]);

  const filtered = useMemo(
    () => (stageFilter === "all" ? items : items.filter((i) => i.stage === stageFilter)),
    [items, stageFilter],
  );

  const handleShare = async () => {
    setSharing(true);
    try {
      const link = await createSharedLink();
      setSharedUrl(link.url);
      toast.success(`Share link created — ${link.itemCount} candidate${link.itemCount === 1 ? "" : "s"} in it.`);
    } catch (e: any) {
      toast.error(e?.message || "Couldn't create a share link.");
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    if (!sharedUrl) return;
    try {
      await navigator.clipboard.writeText(sharedUrl);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy — select the link and copy it manually.");
    }
  };

  const handleExport = () => {
    downloadCsv(
      "cvyon-shortlist.csv",
      filtered.map((i) => ({
        Headline: i.profile?.headline ?? "",
        Title: i.profile?.currentTitle ?? "",
        Years: i.profile?.yearsExperience ?? "",
        Location: [i.profile?.location, i.profile?.country].filter(Boolean).join(", "),
        Skills: (i.profile?.topSkills ?? []).join("; "),
        Stage: stageLabel(i.stage),
        Note: i.note ?? "",
        Shortlisted: fmtDate(i.shortlistedAt),
      })),
    );
    toast.success("Shortlist exported to CSV.");
  };

  if (items.length === 0) {
    return (
      <div className="py-8">
        <div className="border-[3px] border-[#151a46] bg-white hs py-20 text-center">
          <KanbanSquare size={40} className="mx-auto mb-3 text-[#151a46]/30" />
          <p className="fh text-lg font-extrabold">Your pipeline is empty.</p>
          <p className="mt-1 text-sm text-[#151a46]/60">Bookmark candidates from search results to start tracking them here.</p>
          <button
            onClick={onNewSearch}
            className="mt-6 inline-flex items-center gap-2 border-[3px] border-[#151a46] bg-[#ff604b] px-6 py-3 fh text-xs font-extrabold uppercase tracking-wider text-[#151a46] hs transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          >
            <Plus size={14} /> New search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 border-[3px] border-[#151a46] bg-[#5548f5] px-5 py-3 fh text-[11px] font-extrabold uppercase tracking-wider text-white transition-all hover:bg-[#151a46] disabled:opacity-60"
        >
          {sharing ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
          Share shortlist
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 border-[3px] border-[#151a46] bg-white px-5 py-3 fh text-[11px] font-extrabold uppercase tracking-wider text-[#151a46] transition-all hover:bg-[#f6f5ef]"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {sharedUrl && (
        <div className="mb-6 border-[3px] border-[#0E8A4B] bg-[#0E8A4B]/10 p-4">
          <div className="fm mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0E8A4B]">
            <Share2 size={12} /> share link — anyone with it can view this shortlist
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              readOnly
              value={sharedUrl}
              onFocus={(e) => e.target.select()}
              className="flex-1 border-[3px] border-[#151a46] bg-white px-3 py-2.5 fm text-xs text-[#151a46] outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 border-[3px] border-[#151a46] bg-[#151a46] px-5 py-2.5 fh text-[11px] font-extrabold uppercase tracking-wider text-[#f6f5ef] hover:bg-[#0E8A4B] hover:border-[#0E8A4B]"
            >
              <Copy size={13} /> Copy link
            </button>
          </div>
        </div>
      )}

      {/* stage filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStageFilter(s.id)}
            className={cn(
              "flex items-center gap-2 border-[3px] px-3.5 py-2 fm text-[11px] font-bold uppercase tracking-[0.14em] transition-all",
              stageFilter === s.id
                ? "border-[#151a46] bg-[#151a46] text-[#f6f5ef]"
                : "border-[#151a46]/25 bg-white text-[#151a46]/60 hover:border-[#151a46] hover:text-[#151a46]",
            )}
          >
            {s.label}
            <span className={cn(
              "px-1.5 py-0.5 text-[10px]",
              stageFilter === s.id ? "bg-[#ffd85a] text-[#151a46]" : "bg-[#151a46]/10 text-[#151a46]/70",
            )}>
              {counts[s.id] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border-[3px] border-dashed border-[#151a46]/35 bg-white/50 py-16 text-center">
          <p className="fh text-lg font-extrabold">No candidates in “{stageLabel(stageFilter as PipelineStage)}”.</p>
          <p className="mt-1 text-sm text-[#151a46]/60">Move candidates here with the stage dropdown.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <PipelineCard key={item.profileId} item={item} onChanged={onChanged} />
          ))}
        </div>
      )}
    </div>
  );
}
