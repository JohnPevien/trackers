# AGENTS.md

> Read this first if you're an AI assistant (Claude, GPT, Cursor, Mavis, anything) working in this repo.
> It points you at the onboarding doc with everything you need.

## Start here

**`docs/HANDOFF.md`** — onboarding for new agents: project overview, workflow rules, branch model, current state, and "lessons learned" from previous sessions.

## The non-negotiables

1. **Never commit, push, open a PR, or merge.** The user does all of that.
2. **Branch from `staging`, not `main`.** Phase branches are short-lived and PR into `staging`.
3. **`/docs/` is gitignored on purpose.** It's the user's local project brain. Don't commit anything from it.
4. **The user runs the show on git, accounts, and live services.** You write code and stop. You don't run `supabase db push`, you don't fill in API keys, you don't open a Vercel project.

## More context

- [`docs/PRD.md`](docs/PRD.md) — what we're building and why
- [`docs/phases.md`](docs/phases.md) — the 9-phase roadmap with current status
- [`docs/decisions.md`](docs/decisions.md) — locked stack and product decisions (with rejected options so you don't re-propose them)
- [`docs/changelog.md`](docs/changelog.md) — what shipped, when
- [`/todo.md`](todo.md) — secrets & setup checklist (user-only)
- [`/README.md`](README.md) — public quick start

> **Reminder**: `/docs/` is gitignored. To read it, the user (or a session that has access to their local working tree) must be the one running the agent. Don't try to fetch these from GitHub — they aren't there.
