-- ============================================================================
--  20260611080010_categories.sql
--
--  Categories: user-defined groupings for subscriptions.
--  Default categories are seeded in 2b (so we can scope the seed to the
--  current user, which requires the auth.users row to exist).
-- ============================================================================

create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  color       text not null,
  icon        text not null,
  created_at  timestamptz not null default now(),

  -- A user can't have two categories with the same name.
  constraint categories_user_name_unique unique (user_id, name),

  -- Hex color in #RRGGBB form. Validated at the DB so a bad UI write
  -- can't poison the chart palette.
  constraint categories_color_format check (color ~ '^#[0-9a-fA-F]{6}$')
);

create index categories_user_id_idx on public.categories (user_id);

comment on table public.categories is
  'User-defined groupings for subscriptions. Defaults seeded on signup.';
comment on column public.categories.color is
  'Hex color in #RRGGBB form, used for chart segments and chips.';
comment on column public.categories.icon is
  'Lucide icon name (e.g. "Play", "Briefcase"). Resolved client-side.';
