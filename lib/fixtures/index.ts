// ============================================================================
//  index.ts — Public surface of the fixtures module.
//  Don't import from individual files; import from "@/lib/fixtures".
// ============================================================================

export {
  makeSubscription,
  makeSubscriptionList,
  attachCategories,
} from "./subscriptions";
export {
  DEFAULT_CATEGORIES,
  makeDefaultCategory,
  makeUserCategory,
} from "./categories";
export { SEED } from "./seed";
