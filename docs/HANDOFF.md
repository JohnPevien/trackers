# Handoff & Onboarding

> **If you're an AI assistant (Claude, GPT, Cursor, Mavis, anything) joining this project: read this first.**
> It tells you what we're building, how we work, and where we are *right now*.
> For deeper context, follow the links — they go to the single source of truth for each topic.

---

## TL;DR

We're building **SubTrack**, a personal subscription tracker. Single user (the repo owner, JohnPevien), PHP currency, email reminders, no push notifications, no bank/email integration. Web app on Next.js, Supabase for the backend, Resend for email, Vercel for hosting. **Target: $0–$5/month, runs on free tiers.**

The build is a **9-phase, one-PR-per-phase pipeline**. The user (John) commits, pushes, opens the PR, and merges — neither the AI nor any other agent does that. AI assistants prepare the diff, suggest a commit message, and stop. See [§ Workflow](#workflow) below.

**Current state**: Phase 1 (frontend scaffold) is merged on `staging`. Phase 2a (Supabase schema + RLS) is fully written but uncommitted on the `phase-2a-supabase-schema` branch — it's the next thing to ship. See [§ Where we are](#where-we-are) for the exact state.

---

## Repo map

```
/                       ← tracked: package.json, tsconfig, README, etc.
/app/                   ← Next.js 15 App Router pages
  /dashboard/           ← main view (skeleton for now, real data in Phase 6)
/lib/                   ← shared utilities
  /fixtures/            ← @faker-js/faker factories for mock data (Phase 1+)
/types/db.ts            ← single source of truth for the data shape
/scripts/seed-dump.ts   ← `pnpm seed:dump` writes a data.json snapshot
/supabase/
  /config.toml          ← local Supabase config (project_id is a placeholder)
  /migrations/          ← versioned SQL migrations (Phase 2a+)
/docs/                  ← GITIGNORED — internal project brain (this file lives here)
  PRD.md                ← what we're building + why + out-of-scope
  phases.md             ← the 9-phase roadmap with status
  decisions.md          ← locked stack + product decisions (with "rejected" history)
  changelog.md          ← dated, append-only log of what shipped
  HANDOFF.md            ← this file
/todo.md                ← tracked: secrets & setup checklist (user-only)
```

The `/docs/` directory is **gitignored on purpose**. It's the project's local brain — never gets pushed, never reviewed in PRs. The user keeps it on their machine as their private project notebook.

---

## Where we are

### What's shipped

| Phase | Branch | Status | Merged into |
|---|---|---|---|
| **Phase 0** — repo setup | n/a | ✅ done | `main` (commit `5ac9e51`) |
| **Phase 1** — frontend scaffold | `phase-1-frontend-scaffold` | ✅ merged | `staging` (PR #1, commit `eac5368`) |
| **Phase 2a** — Supabase schema + RLS | `phase-2a-supabase-schema` | 🟡 uncommitted, ready to ship | not yet pushed |
| **Phase 2b** — Supabase deploy + pg_cron + seed | not started | ⏳ blocked on user keys | — |
| **Phase 3+** | not started | — | — |

### Phase 2a — exactly what's in the diff (uncommitted on `phase-2a-supabase-schema`)

```
M  .env.example       ← Supabase/Resend sectioning + warnings
M  .gitignore         ← trailing whitespace only (carry-over from editor)
M  README.md          ← Supabase CLI section, current-branch reference updated
M  todo.md            ← Supabase CLI install instructions
?? supabase/config.toml
?? supabase/migrations/20260611080000_enable_extensions.sql
?? supabase/migrations/20260611080010_categories.sql
?? supabase/migrations/20260611080020_subscriptions.sql
?? supabase/migrations/20260611080030_user_settings.sql
?? supabase/migrations/20260611080040_reminder_log.sql
?? supabase/migrations/20260611080050_rls_policies.sql
```

Net: 10 files, 355 insertions, 4 deletions. **No new npm dependencies, no env keys, no live service calls.** Pure SQL + config + doc edits. Reviewable in 5 minutes.

### Phase 2b — what's coming next (after 2a is merged)

Phase 2b needs real Supabase keys and applies the schema to a live project. The user does:
1. `brew install supabase/tap/supabase` (one-time)
2. Create a free-tier project at supabase.com/dashboard
3. Fill 4 keys into `todo.md` (URL, anon key, service role key, direct DB URL)
4. `supabase login && supabase link --project-ref <ref>`
5. `supabase db push` (applies 2a migrations + 2b additions)

The AI's job in 2b is to write two more migration files (`enable_pg_cron.sql` + `seed_default_categories.sql`) and hand the user a clean diff. After that, Phase 3 (auth) needs the Supabase project to exist, so it follows 2b directly.

---

## Workflow

This is the most important section. **The rules:**

### Branch model

```
phase-N-<slug>  ──PR──▶  staging  ──merge──▶  main
   (your work)            (integration)        (deployed / sacred)
```

- **`main`** — only working, deployed site lands here. Protected on GitHub (require PR, 1 approval, no direct push, no force-push, no deletion). The user merges `staging` → `main` themselves, by hand, when they decide a phase is "released."
- **`staging`** — long-lived integration branch. **Not protected.** The user pushes to it freely. Each phase's PR targets `staging`. Vercel preview deploys off it.
- **`phase-N-<slug>`** — short-lived feature branch. One per phase. The AI does all work here. Deleted on the remote after the PR merges (GitHub does this automatically).

### Who does what

| Action | AI | User |
|---|---|---|
| Write code / SQL / config | ✅ | — |
| Run `git add`, `git commit`, `git push`, `gh pr create`, merge | — | ✅ |
| `supabase db push` and other live-service commands | — | ✅ |
| Install CLI tools, create cloud accounts, paste keys | — | ✅ |
| Review and approve PRs (self-review, but enforced via branch protection) | — | ✅ |
| Decide "is this phase done?" | — | ✅ |

**Hard rule**: AI assistants NEVER run `git commit`, `git push`, `gh pr create`, or `gh pr merge`. The user does all of it. AI's last action in any phase is to print a clean handoff: what changed, suggested commit message, exact `git push` + `gh pr create` commands, what's needed from the user next.

### Phase protocol

For each phase, the AI:

1. **Creates a branch** from `staging` (not `main` — see Lessons Learned §1)
   ```bash
   git checkout staging && git pull --ff-only
   git checkout -b phase-N-<slug>
   ```
2. **Writes the work** in focused commits (1–3 commits per phase is ideal; one mega-commit is fine if it reads linearly)
3. **Stages nothing permanently** — leaves the working tree with unstaged or staged-as-it-falls changes so the user can review the diff before committing
4. **Hands off** with: file list, line count, suggested commit message, the exact `git push -u origin phase-N-<slug>` command, the `gh pr create` command, and a one-paragraph "what to do next"
5. **Stops.** Waits for the user to merge before touching the next phase.

### When a phase is too big

If a phase has more than ~400 lines of diff or touches more than 2 unrelated concerns, **split it into sub-phases** before starting:
- Phase 2 was split into 2a (schema + RLS) and 2b (deploy + pg_cron + seed) for this reason.
- Naming: `phase-2a-supabase-schema`, `phase-2b-supabase-deploy`.
- The split decision is made *before* writing, not mid-PR.

---

## The user

**John Pevien** (GitHub: `JohnPevien`). Solo developer building this for personal use. He works on macOS (we know because `/scratch/` in the gitignore and the path structure suggest it; also he's been pasting screenshot output that matches macOS UI). Uses `pnpm`. Comfortable with terminal, git, and the GitHub web UI. Has a workflow where he reviews every PR himself.

### Working with him

- **Be direct.** He pushed back on me once for over-explaining in a commit message. Keep commit messages tight (what + why, no implementation details like "uses SEED = 424242").
- **Don't ask "is this OK?" — make a recommendation.** He's running a tight loop: AI suggests, he approves or pushes back. If you propose two options, pick one and say why.
- **He runs the show on git.** Don't commit, push, or PR. Hand him the diff and the exact commands.
- **He takes breaks.** Phases don't all happen in one session. Make sure each handoff is self-contained — the next session might be a different agent, and they need to be able to pick up from the handoff doc alone.
- **He prefers structured, PR-sized work** over big-bang deliveries. If a phase is 500+ lines, it should have been two phases.
- **Memory note**: He keeps his project brain in `/docs/` (gitignored). Anything we decide together that affects the project should land in those files, not just in chat history.

---

## Lessons learned (read these before suggesting anything)

These are things that came up in earlier sessions and the user pushed back on. Don't repeat them.

1. **Always base phase branches on `staging`, not `main`.** Phase 1 was branched from `main` and the initial diff looked like we deleted the whole app. Rebasing onto `staging` fixed it, but the lesson is: `git checkout staging && git pull && git checkout -b phase-N-...` is the canonical first move.
2. **Don't include implementation details in commit messages.** "Implements a seeded Faker factory with `SEED = 424242`" is what *I* wrote; the user said it belongs in the code, not the commit. A good commit message says *what* and *why*, period. A future reader of `git log` doesn't need to know the constant name.
3. **Don't propose two options and say "your call."** Pick one and say why. The user is the bottleneck, not us. If you genuinely can't decide, name your default and put a one-line "if you prefer X, here's the change" footnote.
4. **`docs/` is gitignored for a reason.** The whole PRD/phases/decisions/changelog system lives there. Never commit anything from `/docs/` — it's the user's local-only project brain. The `.gitignore` line is `/docs/` (no exceptions for specific files).
5. **Phase 2a doesn't need keys.** The user asked "no need for keys yet?" after seeing the handoff — the answer is "no, this is local SQL files." Don't add Supabase SDK imports or env-var reads to a 2a diff even if it would be "more complete." Wait for 2b where the project exists.
6. **The user uses macOS** (we infer from shell paths and screenshot UI). Recommend `brew` install commands when introducing CLI tools.
7. **Sequential questioning is fine, but a real blocker needs an `ask_user` call.** Don't ask 4 questions in a row in chat. Use the structured ask_user tool when the decision is real and the answer changes the deliverable.
8. **Two-day gaps are normal.** Don't assume the user is always there. Each handoff is a snapshot — the next session (AI or human) should be able to read HANDOFF.md + the existing `docs/` and start working without re-asking 10 questions.

---

## If you're continuing the work

1. **Read this file fully.** Then read [`phases.md`](./phases.md) for the roadmap, [`decisions.md`](./decisions.md) for "why we picked this," and [`PRD.md`](./PRD.md) for scope.
2. **Check `changelog.md`** to see what's already shipped. Don't redo work.
3. **Find the current phase** by looking at the phases table above and the git branch state. Run `git branch -a` and `git status`.
4. **For Phase 2a specifically**: the diff is already written on `phase-2a-supabase-schema`. If the user asked you to "finish 2a," your job is to verify the diff, hand it off (commands in § Phase 2a above), and stop.
5. **For Phase 2b**: confirm the user has Supabase keys in `todo.md`. If not, stop and ask for them — don't write 2b code speculatively.
6. **For any new phase**: branch from `staging`, follow the protocol in § Workflow, and don't commit/push/PR.

---

## Pointers to other docs (in this same `/docs/` folder, all gitignored)

- **[`PRD.md`](./PRD.md)** — the product spec, target user, core flows, data model overview, UI direction, out-of-scope list
- **[`phases.md`](./phases.md)** — the 9-phase roadmap with status checkboxes, branch names, and "keys needed" flags per phase
- **[`decisions.md`](./decisions.md)** — the locked stack + product decisions, plus a "rejected options" list so you don't re-propose them
- **[`changelog.md`](./changelog.md)** — append-only dated log of what shipped, one entry per phase

Everything outside this folder that matters:
- **[`/todo.md`](../todo.md)** — secrets & setup checklist. The only "user-only" file at the repo root.
- **[`/README.md`](../README.md)** — public-facing quick start (quick start, mock data, supabase CLI install, workflow)
- **[`/types/db.ts`](../types/db.ts)** — TypeScript types for the data model. The single source of truth for what a Subscription / Category / etc. looks like in code.
- **[`/supabase/migrations/`](../supabase/)** — versioned SQL migrations, in dependency order (extensions → tables → RLS).

---

## Last updated

2026-06-13 — by Mavis. Added because the user is running a parallel LLM agent and wants self-contained onboarding.
