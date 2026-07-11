import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logout } from "../actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/rooms", label: "Rooms" },
  { href: "/admin/residences", label: "Residences" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function DashLayout({ children }: { children: ReactNode }) {
  await requireAdmin();
  return (
    <div>
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <span className="font-display font-semibold">LOFTZ Admin</span>
            <nav className="hidden gap-4 text-sm text-ink-soft sm:flex">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="hover:text-accent">
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <form action={logout}>
            <button className="text-sm text-muted hover:text-ink">Sign out</button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
