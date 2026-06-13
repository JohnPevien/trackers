# Changelog

> Append-only. Date + what shipped. If you change behavior, link the phase number from `phases.md`.

## 2026-06-11 — Phase 0
- Initialized git repo on `main`
- Created `.gitignore` (covers `/docs/`, env, node_modules, .next)
- Created `todo.md` at repo root (secrets & setup checklist, user-only)
- Created `/docs/` with PRD, build phases, this changelog, and decisions log
- Locked the stack and feature scope in `docs/decisions.md`
- Locked the workflow: phase-N branches → PR → `staging` → `main`, only user commits/pushes/merges
- Tagged every phase with its target branch name and which keys it needs

## 2026-06-11 — Phase 1 (frontend scaffold) — MERGED to `staging` (PR #1, commit `eac5368`)
**Branch**: `phase-1-frontend-scaffold`
**Keys needed**: none
**Status**: ✅ merged

- `package.json`: Next.js 15, React 19, Tailwind 3, Recharts, Faker, geist, lucide-react
- `tsconfig.json` with `@/*` path alias
- `next.config.ts`, `postcss.config.js`, `tailwind.config.ts` (dark Vercel-style palette via oklch)
- `app/layout.tsx` with Geist Sans + Mono, dark mode
- `app/page.tsx` → redirects to `/dashboard`
- `app/dashboard/page.tsx`: topbar + sidebar + skeleton (monthly total, renewing soon, category breakdown placeholders)
- `app/globals.css`: Tailwind directives, Vercel-y base styles, subtle bg-grid utility
- `lib/utils.ts`: `cn()` shadcn helper
- `types/db.ts`: single source of truth for Subscription / Category / UserSettings / ReminderLog
- `lib/fixtures/`: seeded Faker factories (`makeSubscription`, `makeSubscriptionList`, `attachCategories`, `makeDefaultCategory`, `makeUserCategory`)
- `scripts/seed-dump.ts`: `pnpm seed:dump` writes `data.json` snapshot
- `.env.example`: documented, no values

## 2026-06-13 — Phase 2a (Supabase schema + RLS) — written, uncommitted
**Branch**: `phase-2a-supabase-schema`
**Keys needed**: none
**Status**: 🟡 diff is fully written on the local branch, awaiting user to commit/push/PR. Net: 10 files, +355/−4.

- `supabase/config.toml` — local dev config (project_id placeholder)
- `supabase/migrations/20260611080000_enable_extensions.sql` — pgcrypto, citext
- `supabase/migrations/20260611080010_categories.sql` — categories table
- `supabase/migrations/20260611080020_subscriptions.sql` — subscriptions + billing_interval enum + reminder_lead_days enum
- `supabase/migrations/20260611080030_user_settings.sql` — user_settings table
- `supabase/migrations/20260611080040_reminder_log.sql` — reminder_log + reminder_status enum (unique on (subscription_id, renewal_date) to dedup)
- `supabase/migrations/20260611080050_rls_policies.sql` — strict per-user RLS, plus `public.current_user_id()` helper
- `.env.example` — Supabase/Resend sectioning + warnings
- `README.md` — Supabase CLI section, current-branch reference
- `todo.md` — Supabase CLI install instructions

## 2026-06-13 — Docs updated for parallel-agent handoff
- Added `/docs/HANDOFF.md` — onboarding doc for new agents (or new humans)
- Added `/AGENTS.md` at repo root — signpost pointing to `HANDOFF.md`
- Updated `docs/phases.md` and `docs/changelog.md` to reflect the current state (Phase 1 merged, Phase 2a uncommitted)
