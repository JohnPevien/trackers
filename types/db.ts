// ============================================================================
//  db.ts — The single source of truth for the app's data shape.
//
//  This file is consumed by:
//   - lib/fixtures/  (Faker factories generate fake data matching these types)
//   - the real Supabase client in Phase 2+ (typed query results)
//   - every component that takes a Subscription or Category as a prop
//
//  If you change a field here, TypeScript will yell at every callsite.
//  That's a feature — it's how we prevent fixture drift.
// ============================================================================

/**
 * How often a subscription bills. Custom means use `interval_days`.
 * - "month"      → every ~30 days from start_date
 * - "quarter"    → every ~90 days
 * - "year"       → every ~365 days
 * - "custom"     → every `interval_days` (e.g. every 14 days for a biweekly box)
 */
export type BillingInterval = "month" | "quarter" | "year" | "custom";

/**
 * User-tunable reminder lead time, in days before renewal.
 * Default per sub is 3, but every sub can override.
 */
export type ReminderLeadDays = 1 | 3 | 7;

// ---------------------------------------------------------------------------
//  Category
// ---------------------------------------------------------------------------
export interface Category {
  id: string;
  user_id: string;
  name: string;
  /** Hex color for chips and the donut chart, e.g. "#7c3aed" */
  color: string;
  /** Lucide icon name (rendered by CategoryIcon component, added in Phase 4) */
  icon: string;
  created_at: string; // ISO timestamp
}

// ---------------------------------------------------------------------------
//  Subscription
// ---------------------------------------------------------------------------
export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  /** Amount in Philippine pesos. We don't deal with centavos for MVP. */
  amount_php: number;
  billing_interval: BillingInterval;
  /** Only meaningful when billing_interval === "custom" */
  interval_days: number | null;
  /** The day the user first started paying for this. */
  start_date: string; // ISO date (YYYY-MM-DD)
  /**
   * The next time the user will be charged. Auto-rolled from start_date
   * by SQL/computed property, but the user can override it (e.g. after a pause).
   */
  next_renewal_date: string; // ISO date
  category_id: string | null;
  notes: string | null;
  is_paused: boolean;
  reminder_lead_days: ReminderLeadDays;
  created_at: string; // ISO timestamp
}

/** A subscription joined with its category, for display. */
export interface SubscriptionWithCategory extends Subscription {
  category: Category | null;
}

// ---------------------------------------------------------------------------
//  User settings (one row per user, created on signup)
// ---------------------------------------------------------------------------
export interface UserSettings {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  default_reminder_lead_days: ReminderLeadDays;
}

// ---------------------------------------------------------------------------
//  Reminder log (audit trail, prevents duplicate emails)
// ---------------------------------------------------------------------------
export interface ReminderLog {
  id: string;
  subscription_id: string;
  /** Which renewal this reminder was for (so we don't double-send for the same date) */
  renewal_date: string; // ISO date
  sent_at: string; // ISO timestamp
  status: "sent" | "failed";
  error_message: string | null;
}
