/**
 * Typed client for the recruiter portal phase-1 features:
 *  - shortlist pipeline (stages + notes) — PATCH /api/recruiter/shortlist
 *  - JD library CRUD (rename/delete/duplicate) — /api/recruiter/searches
 *  - shareable shortlist links — /api/recruiter/shared
 *
 * Uses the `authed` / `parse` helpers from @/lib/recruiter-api.
 */
import { authed, parse, ApiError } from "@/lib/recruiter-api";
import type { AnonProfile } from "@/lib/recruiter-api";

/* ------------------------------ types ------------------------------ */

export type PipelineStage = "new" | "contacted" | "interviewing" | "hired" | "rejected";

export interface PortalShortlistItem {
  profileId: string;
  shortlistedAt?: string;
  profile?: Partial<AnonProfile>;
  stage: PipelineStage;
  note?: string;
  updatedAt?: string;
}

export interface SharedLink {
  token: string;
  url: string;
  itemCount: number;
  createdAt?: string;
}

const STAGES: PipelineStage[] = ["new", "contacted", "interviewing", "hired", "rejected"];

function asStage(value: unknown): PipelineStage {
  return STAGES.includes(value as PipelineStage) ? (value as PipelineStage) : "new";
}

/* ------------------------- pipeline (shortlist) --------------------- */

/** GET /api/recruiter/shortlist — tolerant mapping, stage defaults to "new". */
export async function getPipelineShortlist(): Promise<{ shortlist: PortalShortlistItem[] }> {
  const res = await authed("/api/recruiter/shortlist");
  const json = await parse<any>(res);
  const raw = Array.isArray(json?.shortlist) ? json.shortlist : Array.isArray(json) ? json : [];
  const shortlist: PortalShortlistItem[] = raw.map((row: any) => ({
    profileId: String(row?.profileId ?? row?.candidate_profile_id ?? ""),
    shortlistedAt: row?.shortlistedAt ?? row?.created_at,
    profile: row?.profile,
    stage: asStage(row?.stage),
    note: row?.note ?? undefined,
    updatedAt: row?.updatedAt ?? row?.updated_at,
  }));
  return { shortlist };
}

/** PATCH /api/recruiter/shortlist — move through the pipeline / set a note. */
export async function updateShortlistItem(
  profileId: string,
  patch: { stage?: PipelineStage; note?: string }
): Promise<void> {
  const res = await authed("/api/recruiter/shortlist", {
    method: "PATCH",
    body: JSON.stringify({ profileId, ...patch }),
  });
  await parse(res);
}

/* ------------------------------ JD library -------------------------- */

/** PATCH /api/recruiter/searches — rename a saved search. */
export async function renameSearch(id: string, title: string): Promise<void> {
  const res = await authed("/api/recruiter/searches", {
    method: "PATCH",
    body: JSON.stringify({ id, title }),
  });
  await parse(res);
}

/** DELETE /api/recruiter/searches — delete a saved search. */
export async function deleteSearch(id: string): Promise<void> {
  const res = await authed("/api/recruiter/searches", {
    method: "DELETE",
    body: JSON.stringify({ id }),
  });
  await parse(res);
}

/**
 * Duplicate a search: fetch the row, then POST a copy. Throws an honest error
 * when the source search has no stored job description (older rows may lack it).
 */
export async function duplicateSearch(id: string): Promise<void> {
  const listRes = await authed("/api/recruiter/searches");
  const listJson = await parse<any>(listRes);
  const rows: any[] = Array.isArray(listJson?.searches)
    ? listJson.searches
    : Array.isArray(listJson)
      ? listJson
      : [];
  const source = rows.find((r) => String(r?.id) === String(id));
  if (!source) {
    throw new ApiError("That search no longer exists, so it can't be duplicated.", 404, "http");
  }
  const jobTitle = String(source.jobTitle ?? source.job_title ?? "").trim();
  const jobDescription = String(source.jobDescription ?? source.job_description ?? "").trim();
  if (!jobDescription) {
    throw new ApiError(
      "This search has no job description stored, so it can't be duplicated.",
      422,
      "http"
    );
  }
  const createRes = await authed("/api/recruiter/searches", {
    method: "POST",
    body: JSON.stringify({ jobTitle, jobDescription }),
  });
  await parse(createRes);
}

/* --------------------------- shared links --------------------------- */

/** POST /api/recruiter/shared — snapshot the current shortlist into a link. */
export async function createSharedLink(): Promise<SharedLink> {
  const res = await authed("/api/recruiter/shared", {
    method: "POST",
    body: JSON.stringify({}),
  });
  const json = await parse<any>(res);
  return {
    token: String(json?.token ?? ""),
    url: String(json?.url ?? ""),
    itemCount: Number(json?.itemCount ?? 0),
    createdAt: json?.createdAt,
  };
}

/** GET /api/recruiter/shared — the recruiter's own links, newest first. */
export async function listSharedLinks(): Promise<{ links: SharedLink[] }> {
  const res = await authed("/api/recruiter/shared");
  const json = await parse<any>(res);
  const raw = Array.isArray(json?.links) ? json.links : [];
  const links: SharedLink[] = raw.map((l: any) => ({
    token: String(l?.token ?? ""),
    url: String(l?.url ?? ""),
    itemCount: Number(l?.itemCount ?? 0),
    createdAt: l?.createdAt,
  }));
  return { links };
}

/** DELETE /api/recruiter/shared — revoke a link. */
export async function revokeSharedLink(token: string): Promise<void> {
  const res = await authed("/api/recruiter/shared", {
    method: "DELETE",
    body: JSON.stringify({ token }),
  });
  await parse(res);
}
