/**
 * Typed client for the recruiter marketplace APIs ("sell the match, not the database").
 *
 * Contracts (backend, being built in parallel — every call fails honestly when
 * the endpoint isn't there yet; NEVER fabricate candidates or counts here):
 *
 *  POST /api/recruiter/match   {jobDescription, jobTitle?, location?, page?, pageSize?, filters?}
 *    → {searchId, extracted:{...}, counts:{total, excellent, strong, moderate},
 *       matches:[{profileId, tier, score, reasons[], profile:{...}}], page, pageSize}
 *  POST /api/recruiter/unlock   {profileId}
 *    → {success, remainingCredits, contact:{fullName, email, phone}} (402 = out of credits)
 *  GET  /api/recruiter/credits → {balance, packs:[{id, name, credits, priceKobo, priceNgn}]}
 *  POST /api/recruiter/credits/checkout {packId} → {authorization_url}
 *  GET  /api/recruiter/searches / PATCH /api/recruiter/searches {id, saved}
 *  GET/POST/DELETE /api/recruiter/shortlist {profileId}
 *  GET  /api/recruiter/unlocks
 *  GET  /api/user/profile-views (candidate transparency)
 *
 * Auth: recruiter/candidate Supabase Bearer token. All responses are rendered
 * exactly as returned — anonymization is absolute pre-unlock.
 */
import { supabase } from "@/lib/supabase";

/* ------------------------------ types ------------------------------ */

export type MatchTier = "excellent" | "strong" | "moderate";

export interface MatchFilters {
  /** Hard minimum years of experience; candidates with unknown experience stay in. */
  minYears?: number;
  /** Extra must-have skills merged into the JD before FTS + scoring. */
  mustHaveSkills?: string[];
  /** Tier allow-list; omitted or empty = all tiers. */
  tiers?: MatchTier[];
  /** "score" (default) or "experience" (years desc, nulls last, tie-break score). */
  sort?: "score" | "experience";
}

export interface ExtractedJd {
  title: string;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  minYears: number | null;
  maxYears: number | null;
  location: string;
}

export interface AnonProfile {
  headline: string;
  currentTitle: string;
  yearsExperience: number | null;
  topSkills: string[];
  location: string;
  country: string;
  completenessScore: number;
}

export interface JdMatch {
  profileId: string;
  tier: MatchTier;
  score: number;
  reasons: string[];
  profile: AnonProfile;
  shortlisted?: boolean;
  /** Must-have + nice-to-have skills the candidate's profile matched. */
  matchedSkills: string[];
  /** Merged must-have skills absent from matchedSkills. */
  missingSkills: string[];
}

export interface MatchCounts {
  total: number;
  excellent: number;
  strong: number;
  moderate: number;
}

export interface MatchResult {
  searchId: string;
  extracted: ExtractedJd;
  counts: MatchCounts;
  matches: JdMatch[];
  page: number;
  pageSize: number;
}

export interface UnlockContact {
  fullName: string;
  email: string;
  phone: string;
}

export interface CreditPack {
  id: string;
  name: string;
  credits: number;
  priceKobo: number; // minor units (cents/kobo)
  currency: string;  // ISO code, e.g. USD, NGN
}

export interface SavedSearch {
  id: string;
  jobTitle?: string;
  jobDescription?: string;
  location?: string;
  saved?: boolean;
  createdAt?: string;
  counts?: Partial<MatchCounts>;
}

export interface ShortlistItem {
  profileId: string;
  profile?: Partial<AnonProfile>;
  addedAt?: string;
}

export interface UnlockRecord {
  profileId: string;
  unlockedAt?: string;
  creditsSpent?: number;
  contact?: Partial<UnlockContact>;
}

export interface ProfileViews {
  views: number;
  unlocks: number;
  recent?: Array<{ at?: string; unlocked?: boolean }>;
}

/* --------------------------- request core --------------------------- */

export class ApiError extends Error {
  status: number;
  code: "out_of_credits" | "auth" | "http";
  constructor(message: string, status: number, code: ApiError["code"] = "http") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function authed(path: string, init: RequestInit = {}): Promise<Response> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string> | undefined),
  };
  if (session?.access_token) headers["Authorization"] = `Bearer ${session.access_token}`;
  if (init.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(path, { ...init, headers, credentials: "same-origin" });
}

export async function parse<T>(res: Response): Promise<T> {
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg: string = json?.error || json?.message || `Request failed (${res.status})`;
    if (res.status === 402) throw new ApiError(msg || "Out of credits", 402, "out_of_credits");
    if (res.status === 401 || res.status === 403) throw new ApiError(msg || "Sign in required", res.status, "auth");
    throw new ApiError(msg, res.status, "http");
  }
  return json as T;
}

/* ------------------------------ API fns ----------------------------- */

export async function runJdMatch(input: {
  jobDescription: string;
  jobTitle?: string;
  location?: string;
  page?: number;
  pageSize?: number;
  filters?: MatchFilters;
}): Promise<MatchResult> {
  const res = await authed("/api/recruiter/match", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parse<MatchResult>(res);
}

export async function unlockContact(profileId: string): Promise<{
  success: boolean;
  remainingCredits: number;
  contact: UnlockContact;
}> {
  const res = await authed("/api/recruiter/unlock", {
    method: "POST",
    body: JSON.stringify({ profileId }),
  });
  return parse(res);
}

export async function getCredits(): Promise<{ balance: number; packs: CreditPack[] }> {
  const res = await authed("/api/recruiter/credits");
  const json = await parse<any>(res);
  const packs: CreditPack[] = (json.packs || []).map((p: any) => ({
    id: String(p.id),
    name: String(p.name ?? ""),
    credits: Number(p.credits ?? 0),
    priceKobo: Number(p.price_kobo ?? p.priceKobo ?? 0),
    currency: String(p.currency || "USD"),
  }));
  return { balance: Number(json.balance ?? 0), packs };
}

export async function checkoutCredits(packId: string): Promise<{ authorization_url: string }> {
  const res = await authed("/api/recruiter/credits/checkout", {
    method: "POST",
    body: JSON.stringify({ packId }),
  });
  return parse(res);
}

export async function getSearches(): Promise<{ searches: SavedSearch[] }> {
  const res = await authed("/api/recruiter/searches");
  const json = await parse<any>(res);
  const searches = Array.isArray(json?.searches) ? json.searches : Array.isArray(json) ? json : [];
  return { searches };
}

export async function setSearchSaved(id: string, saved: boolean): Promise<void> {
  const res = await authed("/api/recruiter/searches", {
    method: "PATCH",
    body: JSON.stringify({ id, saved }),
  });
  await parse(res);
}

export async function getShortlist(): Promise<{ shortlist: ShortlistItem[] }> {
  const res = await authed("/api/recruiter/shortlist");
  const json = await parse<any>(res);
  const shortlist = Array.isArray(json?.shortlist) ? json.shortlist : Array.isArray(json) ? json : [];
  return { shortlist };
}

export async function addToShortlist(profileId: string): Promise<void> {
  const res = await authed("/api/recruiter/shortlist", {
    method: "POST",
    body: JSON.stringify({ profileId }),
  });
  await parse(res);
}

export async function removeFromShortlist(profileId: string): Promise<void> {
  const res = await authed("/api/recruiter/shortlist", {
    method: "DELETE",
    body: JSON.stringify({ profileId }),
  });
  await parse(res);
}

export async function getUnlocks(): Promise<{ unlocks: UnlockRecord[] }> {
  const res = await authed("/api/recruiter/unlocks");
  const json = await parse<any>(res);
  const unlocks = Array.isArray(json?.unlocks) ? json.unlocks : Array.isArray(json) ? json : [];
  return { unlocks };
}

export async function getProfileViews(): Promise<ProfileViews | null> {
  try {
    const res = await authed("/api/user/profile-views");
    const json = await parse<any>(res);
    return {
      views: Number(json?.views ?? json?.viewCount ?? 0),
      unlocks: Number(json?.unlocks ?? json?.unlockCount ?? 0),
      recent: Array.isArray(json?.recent) ? json.recent : [],
    };
  } catch {
    return null; // endpoint may not exist yet — callers hide the section honestly
  }
}

/* ------------------------- candidate consent ------------------------ */

export async function getRecruiterConsent(): Promise<{ optedIn: boolean; at?: string } | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    const res = await fetch("/api/user/consent", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    if (!res.ok) return null;
    const json = await res.json().catch(() => ({}));
    const optedIn = !!json?.consents?.consent_recruiter_share;
    const at: string | undefined = json?.consents?.consent_at;
    return { optedIn, at };
  } catch {
    return null;
  }
}

export async function setRecruiterConsent(allow: boolean): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) throw new ApiError("Sign in to save this preference.", 401, "auth");
  const res = await fetch("/api/user/consent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      email: session.user.email,
      consents: { consent_recruiter_share: allow },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(json?.error || "Couldn't save your preference.", res.status, res.status === 401 || res.status === 403 ? "auth" : "http");
  return !!json?.success;
}
