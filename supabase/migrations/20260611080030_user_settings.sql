-- ============================================================================
--  20260611080030_user_settings.sql
--
--  One row per user. Created by a Supabase trigger on auth.users insert
--  (defined in 2b, since it touches both schemas).
-- ============================================================================

create table public.user_settings (
  id                            uuid primary key default gen_random_uuid(),
  user_id                       uuid not null unique references auth.users(id) on delete cascade,
  email                         citext not null,
  display_name                  text,
  default_reminder_lead_days    public.reminder_lead_days not null default '3',
  created_at                    timestamptz not null default now()
);

create index user_settings_user_id_idx on public.user_settings (user_id);

comment on table public.user_settings is
  'Per-user preferences. Created on signup, edited from the Settings page.';
