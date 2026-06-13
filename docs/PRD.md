# SubTrack — Product Requirements Document

> Living spec. Last updated: 2026-06-11.
> Anything the team builds should trace back to a line in here. If you change behavior, change this file in the same commit.

---

## 1. The problem

I forget which subscriptions I have and how much they cost. I keep paying for things I don't use. I need a single dashboard that:

1. Lists every recurring subscription I have
2. Tells me my total monthly burn
3. Tells me when the next bill hits
4. Emails me a few days before a renewal so I can cancel in time

## 2. Target user

Just me. Single user, personal use. No team features, no sharing, no public profiles. If I add a family later, we revisit.

## 3. Non-goals (for MVP)

- No multi-currency. PHP only, no FX.
- No bank/email integration. Manual entry only.
- No mobile app. Web responsive is enough.
- No push notifications. Email reminders only.
- No analytics-grade charts on day one. A donut + a number is enough.

## 4. Core user flows

### 4.1 Add a subscription
1. Click **+ Add subscription**
2. Fill: name, amount (₱), category, start date, billing pattern (monthly / quarterly / yearly / custom days), reminder lead time (1 / 3 / 7 days), notes (optional)
3. Save → returns to list, new row appears, dashboard totals refresh

### 4.2 Pause / cancel / delete
- **Pause** → stops reminders, keeps in list with a "paused" badge
- **Cancel** → marks `is_paused = true` + sets `cancelled_at`. Stays in history.
- **Delete** → hard delete. Asks for confirmation. (No undo, but low cost to re-add.)

### 4.3 View dashboard
- Big number: **Total monthly spend (₱)**
- Secondary: **Yearly projection (₱)** = sum of `amount_php` annualized
- "Renewing in the next 7 days" list, sorted by date
- Spend-by-category donut chart
- Total active subscription count

### 4.4 Receive a renewal reminder
- Cron runs daily at 08:00 Asia/Manila
- For every active sub where `(next_renewal_date - today) ≤ reminder_lead_days`:
  - Send one email via Resend
  - Log to `reminder_log` to prevent duplicates
- Email contains: subscription name, amount, category, exact renewal date, "open app" link

### 4.5 Override a renewal date
- Edit dialog shows the *auto-computed* next date
- A toggle reveals a date input — user picks the actual next date
- After override, future renewals re-auto-roll from that new date

## 5. Data model (locked)

See `/supabase/migrations/` for the canonical schema. Summary:

- `categories` — id, user_id, name, color, icon
- `subscriptions` — id, user_id, name, amount_php, billing_interval, interval_days, start_date, next_renewal_date, category_id, notes, is_paused, reminder_lead_days, created_at
- `user_settings` — id, user_id, email, display_name, default_reminder_lead_days
- `reminder_log` — id, subscription_id, sent_at, status

## 6. UI direction

Dark, Vercel-style:
- Background: near-black (`#0a0a0a`), surfaces slightly lighter
- Typography: Geist Sans (default Next.js), tight tracking, large display numbers on dashboard
- Spacing: generous, lots of breathing room
- Charts: muted palette, no rainbow colors
- Motion: subtle, no bouncing
- shadcn/ui as the base, customized for the dark theme

## 7. Out of scope (explicit)

- Auth providers other than email+password (no Google, no SSO)
- Multi-user / sharing
- Real-time updates (CRUD is fine, no live sync needed)
- Mobile native apps
- Receipts / attachments
- Tax reporting

## 8. Open questions for later

- Do I want a yearly view ("what hits each month")? Maybe.
- Do I want a "trial ending" reminder distinct from "renewal"? Probably yes, v2.
- Should I add a "savings goal" feature (cap my monthly spend)? Nice-to-have, not now.
