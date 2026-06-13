# SubTrack

A single-user subscription tracker. PHP only. Email reminders. No auth drama.

> Personal project — see `/docs/` (gitignored) for the PRD, build phases, decisions log, and changelog.

## Quick start

```bash
pnpm install
cp .env.example .env   # empty for now, all keys come in later phases
pnpm dev               # http://localhost:3000
```

Open the app — `/` redirects to `/dashboard`, which is a dark, empty skeleton.

## Mock data (no backend needed)

The dashboard runs on seeded fake data so you can iterate on the UI without a database.

```bash
pnpm seed:dump   # writes ./data.json — a snapshot of 6 categories + 25 subscriptions
```

The Faker factories in `lib/fixtures/` use a fixed seed (`SEED = 424242`) so the data is deterministic. Change the seed in `lib/fixtures/seed.ts` for a new "look."

## Build phases

This is a phase-N-per-PR project. See `docs/phases.md` for the full roadmap. Current branch on this repo: **`phase-2a-supabase-schema`** (Phase 2a, schema + RLS only).

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind 3 + Geist font
- shadcn/ui (added component-by-component as needed)
- Recharts (dashboard charts, Phase 6)
- @faker-js/faker (mock data)
- Supabase (Postgres + Auth + Edge Functions + pg_cron)
- Resend (transactional email)

## Supabase CLI (Phases 2b+)

Migrations live in `supabase/migrations/`. To apply them locally or push to your remote project:

```bash
# Install once: https://supabase.com/docs/guides/cli
brew install supabase/tap/supabase   # macOS
# or: npm i -g supabase
# or: scoop install supabase         # Windows

# Link to your remote project (after Phase 2b)
supabase login
supabase link --project-ref <your-project-ref>

# Push migrations to remote
supabase db push
```

## Workflow

- `main` is sacred — only working, deployed site lands here
- `staging` is the long-lived integration branch
- `phase-N-<slug>` per phase — one PR per phase
- The user commits, pushes, opens the PR, and merges
- Nothing reaches `main` unless it's working
