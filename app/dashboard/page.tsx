import Link from "next/link";
import { Plus, LayoutDashboard, ListChecks, FolderKanban, Settings } from "lucide-react";

// Phase 1: skeleton dashboard rendered with mock (Faker) data.
// The real numbers land in Phase 6.

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      {/* Topbar */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="size-6 rounded-md bg-foreground" />
            <span>SubTrack</span>
          </Link>
          <button className="inline-flex h-9 items-center gap-2 rounded-md bg-foreground px-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
            <Plus className="size-4" />
            Add subscription
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-6 py-8">
        {/* Sidebar */}
        <aside className="hidden w-48 shrink-0 md:block">
          <nav className="space-y-1 text-sm">
            <NavItem href="/dashboard" icon={<LayoutDashboard className="size-4" />} label="Dashboard" active />
            <NavItem href="/subscriptions" icon={<ListChecks className="size-4" />} label="Subscriptions" />
            <NavItem href="/categories" icon={<FolderKanban className="size-4" />} label="Categories" />
            <NavItem href="/settings" icon={<Settings className="size-4" />} label="Settings" />
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 space-y-8">
          {/* Hero with monthly total */}
          <section className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
            <div className="bg-grid absolute inset-0 opacity-50" />
            <div className="relative">
              <p className="text-sm text-muted-foreground">Monthly spend</p>
              <p className="mt-2 font-mono text-5xl font-medium tracking-tight tabular-nums">
                ₱&mdash;
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Yearly projection: <span className="text-foreground">₱&mdash;</span>
              </p>
            </div>
          </section>

          {/* Two-column: renewing soon + category breakdown placeholder */}
          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium text-muted-foreground">
                Renewing in the next 7 days
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                No renewals yet. Add a subscription to get started.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium text-muted-foreground">
                Spend by category
              </h2>
              <p className="mt-4 text-sm text-muted-foreground">
                Chart lands in Phase 6.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}
