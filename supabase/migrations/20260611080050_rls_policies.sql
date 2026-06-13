-- ============================================================================
--  20260611080050_rls_policies.sql
--
--  Row Level Security, strict from day one.
--
--  Pattern: enable RLS on every table, then add explicit per-table policies.
--  Supabase / Postgres default is "deny all" when RLS is enabled and no policy
--  matches. That's what we want — a missing policy is a *bug* you discover
--  immediately, not a silent leak.
--
--  Helper function: public.current_user_id() returns auth.uid() so policies
--  read clearly. It's a one-liner but makes the SQL scannable.
-- ============================================================================

create or replace function public.current_user_id()
returns uuid
language sql
stable
security definer
set search_path = public, auth
as $$
  select auth.uid()
$$;

comment on function public.current_user_id() is
  'Shorthand for auth.uid() in RLS policies. Wrapped so policy SQL stays scannable.';


-- ---------------------------------------------------------------------------
--  categories
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;

create policy "categories: owner can do everything"
  on public.categories
  for all
  to authenticated
  using     (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());


-- ---------------------------------------------------------------------------
--  subscriptions
-- ---------------------------------------------------------------------------
alter table public.subscriptions enable row level security;

create policy "subscriptions: owner can do everything"
  on public.subscriptions
  for all
  to authenticated
  using     (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());


-- ---------------------------------------------------------------------------
--  user_settings
-- ---------------------------------------------------------------------------
alter table public.user_settings enable row level security;

create policy "user_settings: owner can do everything"
  on public.user_settings
  for all
  to authenticated
  using     (user_id = public.current_user_id())
  with check (user_id = public.current_user_id());


-- ---------------------------------------------------------------------------
--  reminder_log
--
--  Slightly different: a user can *read* their own log entries (to show
--  "reminder sent" history in Settings), but the *writes* are done by the
--  Edge Function using the service role key, which bypasses RLS by design.
--  So we only need a read policy here.
-- ---------------------------------------------------------------------------
alter table public.reminder_log enable row level security;

-- Reminder log doesn't have user_id directly — join through subscriptions.
-- Use a subquery in the USING clause (RLS supports this).
create policy "reminder_log: owner can read"
  on public.reminder_log
  for select
  to authenticated
  using (
    subscription_id in (
      select id from public.subscriptions
      where user_id = public.current_user_id()
    )
  );

-- No insert/update/delete policy for authenticated users. Inserts happen
-- via the service role (Edge Function), and we never want a client to
-- tamper with the log.
