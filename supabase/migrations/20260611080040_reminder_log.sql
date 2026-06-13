-- ============================================================================
--  20260611080040_reminder_log.sql
--
--  Audit trail for sent reminders. Inserted by the Edge Function in Phase 7
--  *after* the email goes out, so the row only exists if we actually fired.
--
--  The (subscription_id, renewal_date) unique key is the dedup mechanism:
--  if the cron re-fires before we mark the log, the insert fails fast and
--  we don't double-email.
-- ============================================================================

create type public.reminder_status as enum ('sent', 'failed');

create table public.reminder_log (
  id                  uuid primary key default gen_random_uuid(),
  subscription_id     uuid not null references public.subscriptions(id) on delete cascade,
  renewal_date        date not null,
  sent_at             timestamptz not null default now(),
  status              public.reminder_status not null,
  error_message       text,

  -- The whole point: never send the same reminder twice for the same renewal.
  constraint reminder_log_unique_per_renewal unique (subscription_id, renewal_date)
);

create index reminder_log_subscription_id_idx on public.reminder_log (subscription_id);
create index reminder_log_sent_at_idx         on public.reminder_log (sent_at desc);

comment on table public.reminder_log is
  'Audit trail for renewal reminder emails. Unique on (subscription_id, renewal_date) to prevent double-sends.';
