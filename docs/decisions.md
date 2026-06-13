# Decisions Log

> The single source of truth for *why* we picked what we picked. The team reads this to avoid re-asking you.
> If a decision changes, log the change here AND update the relevant doc (PRD, phases) in the same commit.

## Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind v4 + shadcn/ui (dark theme)
- **Backend**: Supabase (Postgres + Auth + Edge Functions + pg_cron)
- **Email**: Resend (free tier)
- **Charts**: Recharts
- **Hosting**: Vercel Hobby
- **Package manager**: pnpm

## Product
- **Users**: single (me). Real email+password auth via Supabase Auth, but only one user expected.
- **Subscription entry**: manual form only. No bank/email parsing in MVP.
- **Currency**: PHP only. No FX, no multi-currency, no per-sub currency field.
- **Renewal model**: auto-roll from start_date + interval (monthly / quarterly / yearly / custom_days), with manual date override.
- **Reminder lead time**: per-subscription setting, 1 / 3 / or 7 days, default 3.
- **Notifications**: email only. No push.
- **UI direction**: dark, Vercel-style, Geist Sans, Recharts with muted palette, no rainbow.

## Operational
- **Cron schedule**: `pg_cron` daily at 00:00 UTC (= 08:00 Asia/Manila).
- **Reminder dedup**: log every sent reminder to `reminder_log` keyed on (subscription_id, next_renewal_date). Never double-email for the same renewal.
- **Region**: Supabase project should be Singapore or Tokyo (closest to Asia/Manila, avoids weird cron drift).
- **Repo structure**:
  - `todo.md` at root — secrets checklist, user-only
  - `/docs/` — gitignored, holds PRD + phases + changelog + decisions
  - Everything else is normal Next.js layout

## Workflow (this is the most important section)
> For new agents or parallel sessions: read [`HANDOFF.md`](./HANDOFF.md) for the full operational rules and "lessons learned." This section is the short version.

- **`main` is sacred.** Only working, deployed site lands here. Never commit to `main` directly. The user does the merges.
- **`staging` is the long-lived integration branch.** Vercel preview deploys off it. Phase branches PR into `staging`.
- **`phase-N-<slug>` per phase.** Short-lived feature branches. The agent works here, hands the user a clean diff, user commits/pushes/PRs → `staging` → `main`.
- **One phase = one PR, by default.** If a phase is too big for a clean review, split it into sub-phases (e.g. `phase-2a-...`, `phase-2b-...`) *before* starting, and tell the user the split.
- **AI agents never commit, push, or merge.** The user does all of that, because real code review happens on every PR.
- **No keys in the diffs.** Supabase + Resend secrets live in `todo.md` (user-only) and in the user's local `.env` (gitignored). Phase 1 needs no keys. Phase 2+ pauses if a key is missing — that's a feature, not a bug.
- **Phase branches are based on `staging`, not `main`.** Rebase onto `staging` before opening the PR so the diff only shows the phase's work.

## Rejected options
- **Auth via single shared secret** — rejected, user wanted real email+password so multi-user is possible later without rewrite.
- **Push notifications** — rejected for MVP, deferred.
- **Bank/email integration** — rejected for MVP, deferred.
- **Multi-currency / FX** — rejected for MVP, deferred.
- **Convex / Neon** — rejected in favor of Supabase (one dashboard, pg_cron built-in, free tier covers years of personal use).
- **Auth.js / Clerk** — rejected in favor of Supabase Auth (one less service, one less bill).
- **Vercel Postgres / KV** — rejected, Supabase already covers storage.
