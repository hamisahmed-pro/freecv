-- Recruiter portal phase 1: shortlist pipeline stages + notes, shareable shortlist links.
--
-- NOT applied automatically: the deployer applies this migration by hand.
-- Every statement is idempotent (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

-- ---------------------------------------------------------------------------
-- 1. shortlists: pipeline stage + recruiter note + updated_at.
-- ---------------------------------------------------------------------------
ALTER TABLE public.shortlists
  ADD COLUMN IF NOT EXISTS stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new', 'contacted', 'interviewing', 'hired', 'rejected'));
ALTER TABLE public.shortlists
  ADD COLUMN IF NOT EXISTS note TEXT;
ALTER TABLE public.shortlists
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

CREATE INDEX IF NOT EXISTS idx_shortlists_recruiter_stage
  ON public.shortlists(recruiter_id, stage);

-- ---------------------------------------------------------------------------
-- 2. recruiter_shared_shortlists: snapshot links recruiters can send to
--    hiring managers. Snapshots hold ONLY anonymized profile fields —
--    never names, emails, or phones (enforced in the API layer).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recruiter_shared_shortlists (
  token TEXT PRIMARY KEY,
  recruiter_id UUID NOT NULL REFERENCES public.recruiters(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
CREATE INDEX IF NOT EXISTS idx_shared_shortlists_recruiter
  ON public.recruiter_shared_shortlists(recruiter_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- 3. RLS: enable + service-role-only policy (same pattern as 20260925).
--    Routes run through supabaseAdmin (service_role), which bypasses RLS;
--    anon/authenticated get no access.
-- ---------------------------------------------------------------------------
ALTER TABLE public.recruiter_shared_shortlists ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'recruiter_shared_shortlists'
  ] LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Service role full access" ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY "Service role full access" ON public.%I FOR ALL USING (auth.role() = ''service_role'')',
      t
    );
  END LOOP;
END $$;
