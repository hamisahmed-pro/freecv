-- Preserve historical observations; harden all future production events.
alter table public.analytics_events
  add column if not exists event_id uuid,
  add column if not exists traffic_type text;

create unique index if not exists analytics_events_event_id_created_at_unique
  on public.analytics_events (event_id, created_at);

comment on column public.analytics_events.traffic_type is
  'bot/internal/unclassified; not a declaration that unclassified means human';

-- Browser writes move to the authenticated, rate-limited application endpoint.
revoke insert, update, delete, select on public.analytics_events from anon, authenticated;
drop policy if exists "Enable insert for all users on analytics_events" on public.analytics_events;
