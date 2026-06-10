// ============================================================================
//  seed-dump.ts
//
//  `pnpm seed:dump` → writes ./data.json containing a full snapshot of mock
//  data (6 default categories + 25 subscriptions for one fake user).
//
//  Useful for:
//   - Sharing a fixed dataset in a PR ("here's what the dashboard looks like
//     with this data")
//   - Eyeballing the JSON shape without booting the app
//   - Loading into a design tool or Storybook
//
//  The seeded faker means the output is the same every time, unless you
//  change the SEED constant in lib/fixtures/seed.ts.
// ============================================================================

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  DEFAULT_CATEGORIES,
  makeDefaultCategory,
  makeSubscriptionList,
} from "../lib/fixtures";

const FAKE_USER_ID = "usr_dev_seed";
const N_SUBS = 25;

const categories = DEFAULT_CATEGORIES.map((_, i) =>
  makeDefaultCategory(FAKE_USER_ID, i)
);
const subscriptions = makeSubscriptionList({
  userId: FAKE_USER_ID,
  categories,
  count: N_SUBS,
});

const snapshot = {
  generatedAt: new Date().toISOString(),
  user: { id: FAKE_USER_ID, email: "dev@subtrack.local" },
  categories,
  subscriptions,
};

const out = join(process.cwd(), "data.json");
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n", "utf8");

console.log(`Wrote ${out}`);
console.log(`  ${categories.length} categories, ${subscriptions.length} subscriptions`);
