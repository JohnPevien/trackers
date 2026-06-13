# Build Phases

> The build order. The team works top to bottom. Don't skip ahead — each phase has a testable artifact.
> **For a fresh agent or handoff context, start with [`HANDOFF.md`](./HANDOFF.md) instead — it has the current state and the workflow rules.**

## Phase 0 — Repo setup ✅ DONE
- [x] `git init` with `main` branch
- [x] `.gitignore` covering `/docs/`, `.env`, `node_modules`, `.next`
- [x] `todo.md` at repo root (secrets checklist, user-only)
- [x] `/docs/` with PRD, phases, changelog, decisions
- [x] Initial commit
- [x] Workflow locked: phase-N branches → PR → staging → main, only you commit/push/merge

## Phase 1 — Frontend scaffold → branch `phase-1-frontend-scaffold` ✅ MERGED to `staging` (PR #1, commit `eac5368`)
> Sub-phases if needed: none expected. Single PR.
- [x] `pnpm create next-app` with App Router + TypeScript + Tailwind
- [x] Install shadcn/ui, init with dark theme
- [x] Install Recharts
- [x] Set up Geist font
- [x] Base layout with sidebar/topbar shell (empty for now)
- [x] Landing page → redirects to /dashboard
- **Exit criteria**: `pnpm dev` shows a dark, empty dashboard at `/`
- **Keys needed**: none

## Phase 2a — Supabase schema + RLS → branch `phase-2a-supabase-schema`
> **Keys needed**: none (migration files only). Will pause at 2b for Supabase project URL.
- [ ] `supabase init` locally
- [x] Migration: enable required extensions (`pgcrypto`, `citext`)
- [x] Migration: `categories` table
- [x] Migration: `subscriptions` table
- [x] Migration: `user_settings` table
- [x] Migration: `reminder_log` table
- [x] RLS policies: strict from day one, every table filters by `user_id`
- **Exit criteria**: migrations exist locally, can be reviewed line-by-line
- **Status (2026-06-13)**: ✅ written, uncommitted on `phase-2a-supabase-schema`. 10 files, +355/−4. Awaiting user to commit/push/PR.

## Phase 2b — Supabase deploy + seed + pg_cron → branch `phase-2b-supabase-deploy`
> **Keys needed**: Supabase project URL + service role key. Will pause if `todo.md` is empty.
- [ ] Link local `supabase/` to the remote project
- [ ] `supabase db push` (applies 2a migrations)
- [ ] Migration: enable `pg_cron` extension
- [ ] Seed migration: default categories
- **Exit criteria**: `supabase db push` succeeds, all tables exist on the remote with RLS, `pg_cron` is enabled

## Phase 3 — Auth → branch `phase-3-auth`
- [ ] Supabase client setup in Next.js
- [ ] Signup / login / logout pages
- [ ] Middleware: protect all routes except `/login` and `/signup`
- [ ] On signup, create default `user_settings` row + seed categories for the user
- **Exit criteria**: I can sign up, log out, log in, and the dashboard is locked when logged out

## Phase 4 — Subscription CRUD → branch `phase-4-subscription-crud`
- [ ] List view with table/cards
- [ ] Add dialog (form: name, amount, category, start_date, billing pattern, lead time, notes)
- [ ] Edit dialog
- [ ] Delete confirmation
- [ ] Pause / resume toggle
- [ ] Override renewal date toggle
- **Exit criteria**: I can add 5 fake subs, edit one, pause one, delete one, override a date on one

## Phase 5 — Categories CRUD → branch `phase-5-categories-crud`
- [ ] List view
- [ ] Add / rename / delete dialogs
- [ ] Default categories seeded on signup
- **Exit criteria**: I can create "Fitness", rename it, assign a sub to it, delete it (cascade or block — pick one and document)

## Phase 6 — Dashboard → branch `phase-6-dashboard`
- [ ] Monthly total card (live, recomputes on subscription change)
- [ ] Yearly projection card
- [ ] "Renewing in next 7 days" list
- [ ] Spend-by-category donut chart (Recharts)
- [ ] Active subscription count
- **Exit criteria**: All four cards + chart show real numbers that match my SQL

## Phase 7 — Reminder system → branch `phase-7-reminders`
> **Keys needed**: Resend API key + sender email.
- [ ] Resend SDK installed in Edge Function
- [ ] Edge Function: query `subscriptions` where `next_renewal_date - today ≤ reminder_lead_days` and `is_paused = false` and not already in `reminder_log` for this date
- [ ] Email template (HTML + plain text)
- [ ] `pg_cron` schedule: daily at 00:00 UTC = 08:00 Asia/Manila
- [ ] "Send test email" button in Settings
- **Exit criteria**: I trigger a sub with renewal tomorrow and an email lands in my inbox within 2 minutes of cron running

## Phase 8 — Deploy → branch `phase-8-deploy`
- [ ] Vercel project, link to repo
- [ ] Env vars from `todo.md` populated
- [ ] Supabase redirect URLs updated to include the Vercel domain
- [ ] Production smoke test: signup, add a sub, see dashboard, get an email
- **Exit criteria**: App is live at a real URL, end-to-end works

## Phase 9 — Polish → branch `phase-9-polish` (optional, time permitting)
- [ ] Empty states
- [ ] Loading skeletons
- [ ] Error toasts
- [ ] Mobile responsive audit
- [ ] Favicon + meta tags
