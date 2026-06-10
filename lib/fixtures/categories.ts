// ============================================================================
//  categories.ts — Faker factory for Category rows.
//
//  The "default" categories are the ones we seed into the DB on signup.
//  Everything else is user-created.
// ============================================================================

import { faker } from "@faker-js/faker";
import type { Category } from "@/types/db";
import "./seed"; // side-effect: seeds faker

/** The six categories we ship with. Stable — used by seed migrations too. */
export const DEFAULT_CATEGORIES: ReadonlyArray<
  Pick<Category, "name" | "color" | "icon">
> = [
  { name: "Streaming", color: "#ef4444", icon: "Play" },
  { name: "SaaS", color: "#3b82f6", icon: "Briefcase" },
  { name: "Gaming", color: "#a855f7", icon: "Gamepad2" },
  { name: "News", color: "#f59e0b", icon: "Newspaper" },
  { name: "Utilities", color: "#10b981", icon: "Zap" },
  { name: "Other", color: "#6b7280", icon: "Box" },
];

const ALL_ICONS = [
  "Play", "Briefcase", "Gamepad2", "Newspaper", "Zap", "Box",
  "Music", "Video", "Book", "Camera", "Cloud", "Code", "Coffee",
  "Heart", "Image", "Lock", "Mail", "Map", "Phone", "ShoppingCart",
];

let nextId = 1;
function id() {
  return `cat_${(nextId++).toString().padStart(6, "0")}`;
}

/** A default category, with all the fields a Category row needs. */
export function makeDefaultCategory(
  userId: string,
  index: number
): Category {
  const def = DEFAULT_CATEGORIES[index];
  if (!def) throw new Error(`No default category at index ${index}`);
  return {
    id: id(),
    user_id: userId,
    name: def.name,
    color: def.color,
    icon: def.icon,
    created_at: new Date().toISOString(),
  };
}

/** A user-created category (random name + color). */
export function makeUserCategory(userId: string): Category {
  return {
    id: id(),
    user_id: userId,
    name: faker.commerce.department(),
    color: faker.helpers.arrayElement([
      "#ef4444", "#f59e0b", "#10b981", "#3b82f6",
      "#a855f7", "#ec4899", "#14b8a6", "#f97316",
    ]),
    icon: faker.helpers.arrayElement(ALL_ICONS),
    created_at: faker.date.past({ years: 1 }).toISOString(),
  };
}
