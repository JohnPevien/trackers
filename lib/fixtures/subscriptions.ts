// ============================================================================
//  subscriptions.ts — Faker factory for Subscription rows.
//
//  Uses the seeded faker (import "./seed"). Output is deterministic.
// ============================================================================

import { faker } from "@faker-js/faker";
import type {
  BillingInterval,
  Category,
  ReminderLeadDays,
  Subscription,
  SubscriptionWithCategory,
} from "@/types/db";
import "./seed";

const REALISTIC_NAMES = [
  "Netflix", "Spotify", "Disney+", "Apple Music", "YouTube Premium",
  "GitHub Pro", "Figma", "Notion", "Linear", "Vercel",
  "ChatGPT Plus", "Claude Pro", "1Password", "NordVPN", "ProtonMail",
  "Adobe Creative Cloud", "Microsoft 365", "Dropbox", "iCloud+", "Backblaze",
  "PS Plus", "Xbox Game Pass", "Nintendo Switch Online", "EA Play",
  "NY Times", "Bloomberg", "The Athletic", "Medium",
  "AWS", "DigitalOcean", "Cloudflare", "Sentry", "Datadog",
];

const INTERVALS: BillingInterval[] = ["month", "quarter", "year", "custom"];

const LEADS: ReminderLeadDays[] = [1, 3, 7];

let nextId = 1;
function id() {
  return `sub_${(nextId++).toString().padStart(6, "0")}`;
}

/**
 * Pick a renewal date. Weighted toward the next 1-30 days, with some further out
 * so the "renewing soon" list isn't always full and the chart isn't always empty.
 */
function pickRenewalDate(): string {
  const roll = faker.number.float({ min: 0, max: 1 });
  let daysAhead: number;
  if (roll < 0.6) daysAhead = faker.number.int({ min: 1, max: 7 });
  else if (roll < 0.9) daysAhead = faker.number.int({ min: 8, max: 30 });
  else daysAhead = faker.number.int({ min: 31, max: 365 });

  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function pickStartDate(): string {
  // Most subs started somewhere in the last 2 years.
  const d = faker.date.past({ years: 2 });
  return d.toISOString().slice(0, 10);
}

function pickAmount(interval: BillingInterval): number {
  // PHP-only, integer pesos, no centavos.
  // Tier by interval: yearly > quarterly > monthly > custom.
  const [min, max] =
    interval === "year" ? [1200, 12000] :
    interval === "quarter" ? [600, 3000] :
    interval === "month" ? [49, 1500] :
    /* custom */ [199, 999];
  return faker.number.int({ min, max });
}

/** A single fake subscription. Pass `categoryId` to link it to a category. */
export function makeSubscription(args: {
  userId: string;
  categoryId: string | null;
  overrides?: Partial<Subscription>;
}): Subscription {
  const billing_interval = faker.helpers.arrayElement(INTERVALS);
  const amount_php = pickAmount(billing_interval);
  const start_date = pickStartDate();

  return {
    id: id(),
    user_id: args.userId,
    name: faker.helpers.arrayElement(REALISTIC_NAMES),
    amount_php,
    billing_interval,
    interval_days: billing_interval === "custom"
      ? faker.helpers.arrayElement([7, 14, 28])
      : null,
    start_date,
    next_renewal_date: pickRenewalDate(),
    category_id: args.categoryId,
    notes: faker.datatype.boolean({ probability: 0.2 })
      ? faker.lorem.sentence({ min: 4, max: 10 })
      : null,
    is_paused: faker.datatype.boolean({ probability: 0.1 }),
    reminder_lead_days: faker.helpers.arrayElement(LEADS),
    created_at: faker.date.past({ years: 1 }).toISOString(),
    ...args.overrides,
  };
}

/** Make N subscriptions distributed across the given categories (randomly). */
export function makeSubscriptionList(args: {
  userId: string;
  categories: Category[];
  count: number;
}): Subscription[] {
  const { categories, count, userId } = args;
  return Array.from({ length: count }, () =>
    makeSubscription({
      userId,
      categoryId: faker.helpers.arrayElement(categories).id,
    })
  );
}

/** Join subscriptions with their categories for display. */
export function attachCategories(
  subs: Subscription[],
  cats: Category[]
): SubscriptionWithCategory[] {
  const map = new Map(cats.map((c) => [c.id, c]));
  return subs.map((s) => ({
    ...s,
    category: s.category_id ? map.get(s.category_id) ?? null : null,
  }));
}
