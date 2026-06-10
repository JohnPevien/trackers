# SubTrack — Setup & Secrets Checklist

> **This file is the source of truth for the secret values you need to plug in.**
> The team never reads this. Only you. It's at the repo root on purpose so it's not in `/docs/`.

---

## 1. Supabase

Create the project at https://supabase.com/dashboard (free tier is fine).

| Variable | Where to find it | Value |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL | `<paste here>` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → `anon` `public` | `<paste here>` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → `service_role` **secret** | `<paste here>` |
| `DATABASE_URL` (direct connection, for `pg_cron`) | Project Settings → Database → Connection string → **Direct** (not pooler) | `<paste here>` |

When you create the project, **note the region** and tell the team — we need `pg_cron` to fire in Asia/Singapore time ideally, so pick the closest region (Singapore or Tokyo).

## 2. Resend (transactional email)

Sign up at https://resend.com (free tier: 100 emails/day, 3,000/month).

| Variable | Where to find it | Value |
|---|---|---|
| `RESEND_API_KEY` | API Keys → Create API key | `<paste here>` |
| `RESEND_FROM_EMAIL` | The `From` address on outgoing emails | `onboarding@resend.dev` (default sandbox, works for testing) **OR** `subtrack@yourdomain.com` (after you verify your domain) |

For MVP, `onboarding@resend.dev` is fine — you can only send to the email you signed up with, but that's you anyway. When you want reminders to go to any address, verify your own domain in Resend and swap this in.

## 3. Vercel (hosting)

When the team is ready to deploy:

| Step | Detail |
|---|---|
| Sign up | https://vercel.com (use the "Continue with GitHub" option, link this repo) |
| Project name | `subtrack` (or whatever) |
| Add env vars | Copy **every** `NEXT_PUBLIC_*` and server-side variable from sections 1 & 2 into the Vercel project's Environment Variables |
| Deploy | The team will wire this up; you just need the account + repo access |

## 4. Local dev setup

Once you have the keys above, the team will hand you a `.env.example` with the variable names. Copy it to `.env`, fill in the values, then `pnpm install && pnpm dev`.

---

## 5. What's still open

- [ ] Supabase project created
- [ ] Supabase keys filled in above
- [ ] Resend account created
- [ ] Resend API key filled in above
- [ ] Vercel account created
- [ ] `pg_cron` extension enabled in Supabase (the team's migration will do this, but you may need to flip a toggle in Dashboard → Database → Extensions)
