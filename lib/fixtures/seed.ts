// ============================================================================
//  seed.ts — A single, deterministic seed for the whole app.
//
//  Faker's default randomness means every render produces different data.
//  We don't want that — we want the dev dashboard to look the same on every
//  reload so design choices are reproducible. Calling `faker.seed(SEED)`
//  before any faker.* call makes the data deterministic.
//
//  If you ever need a new "look" for the dev data, change SEED to a new
//  integer and re-run `pnpm seed:dump`.
// ============================================================================

import { faker } from "@faker-js/faker";

export const SEED = 424242;

faker.seed(SEED);
