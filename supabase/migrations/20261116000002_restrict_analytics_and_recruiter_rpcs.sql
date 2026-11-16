-- Companion migration for the 16 November analytics and consent release.
-- Applied to production on 2026-11-16 after Vercel reported READY.
-- Kept here as the reproducible, idempotent permission state.

REVOKE SELECT, INSERT, UPDATE, DELETE
  ON public.analytics_events FROM anon, authenticated;
DROP POLICY IF EXISTS "Enable insert for all users on analytics_events"
  ON public.analytics_events;

DO $$
DECLARE child RECORD;
BEGIN
  FOR child IN
    SELECT format('%I.%I', n.nspname, c.relname) AS fq_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relispartition = true
      AND c.oid IN (
        SELECT inhrelid
        FROM pg_inherits
        WHERE inhparent = 'public.analytics_events'::regclass
      )
  LOOP
    EXECUTE 'REVOKE SELECT, INSERT, UPDATE, DELETE ON ' ||
      child.fq_name || ' FROM anon, authenticated';
  END LOOP;
END $$;

-- Server routes use the service_role client. These internal RPCs must
-- never be callable by unauthenticated browser code through PostgREST.
REVOKE EXECUTE ON FUNCTION public.match_candidate_ranks(text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.match_candidate_ranks(text) TO service_role;

REVOKE EXECUTE ON FUNCTION public.unlock_candidate_contact(uuid,uuid,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unlock_candidate_contact(uuid,uuid,text)
  TO service_role;

REVOKE EXECUTE ON FUNCTION public.adjust_recruiter_credits(uuid,integer,text,text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.adjust_recruiter_credits(uuid,integer,text,text)
  TO service_role;

COMMENT ON TABLE public.analytics_events IS
  'Private analytics event ledger; production writes via validated, consent-gated application endpoint.';
