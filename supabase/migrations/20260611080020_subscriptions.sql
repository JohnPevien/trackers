-- ============================================================================
--  20260611080020_subscriptions.sql
--
--  Subscriptions: the heart of the app. One row per recurring bill.
--  Money is stored in centavos (integer) to avoid float rounding —
--  we expose pesos to the UI by dividing by 100 at the edge.
--
--  Actually — for MVP, pesos is fine. Adding centavos later is a 1-line
--  migration: rename the column, multiply existing values, change the
--  type. Keeping it simple now. (If the user wants centavos, we'll change
--  it in Phase 4 when the form is built.)
-- ============================================================================

create type public.billing_interval as enum (
  'month',     -- every ~30 days
  'quarter',   -- every ~90 days
  'year',      -- every ~365 days
  'custom'     -- every interval_days
);

create type public.reminder_lead_days as enum ('1', '3', '7');

create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null,
  amount_php          numeric(10, 2) not null check (amount_php >= 0),
  billing_interval    public.billing_interval not null,
  interval_days       integer check (interval_days is null or interval_days > 0),
  start_date          date not null,
  next_renewal_date   date not null,
  category_id         uuid references public.categories(id) on delete set null,
  notes               text,
  is_paused           boolean not null default false,
  reminder_lead_days  public.reminder_lead_days not null default '3',
  created_at          timestamptz not null default now(),

  -- If billing is 'custom', interval_days must be set. Otherwise it should be null.
  constraint subscriptions_interval_consistency check (
    (billing_interval = 'custom' and interval_days is not null)
    or
    (billing_interval <> 'custom' and interval_days is null)
  ),

  -- next_renewal_date should be on or after start_date. (Auto-roll math
  -- from Phase 6's dashboard will keep this invariant; this check is
  -- belt-and-suspenders for manual edits via the override toggle.)
  constraint subscriptions_renewal_after_start check (next_renewal_date >= start_date)
);

create index subscriptions_user_id_idx         on public.subscriptions (user_id);
create index subscriptions_category_id_idx     on public.subscriptions (category_id);
create index subscriptions_next_renewal_idx    on public.subscriptions (user_id, next_renewal_date)
  where is_paused = false;  -- hot path: reminder cron only scans active rows
create index subscriptions_active_user_idx     on public.subscriptions (user_id, is_paused);

comment on table public.subscriptions is
  'Recurring subscriptions tracked by a single user. PHP amounts only.';
comment on column public.subscriptions.amount_php is
  'Amount in Philippine pesos. Two decimal places to be safe (some yearly subs have centavos).';
comment on column public.subscriptions.next_renewal_date is
  'Next charge date. Auto-rolled from start_date + interval, but the user can override (e.g. after a pause).';
comment on column public.subscriptions.is_paused is
  'When true, no reminder emails are sent and the row is excluded from the monthly total.';
