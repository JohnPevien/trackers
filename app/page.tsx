import { redirect } from "next/navigation";

export default function Home() {
  // Phase 1 stub: the real app lives at /dashboard.
  // Once auth lands (Phase 3), this becomes a session-aware redirect.
  redirect("/dashboard");
}
