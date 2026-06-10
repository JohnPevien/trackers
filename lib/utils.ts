// `cn` is the canonical shadcn class-merging helper.
// It's used by every shadcn component, so we need it from day one.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
