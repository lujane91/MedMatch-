"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Bookmark,
  Briefcase,
  CalendarRange,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  UserRound,
} from "lucide-react";
import { Logo } from "./Logo";
import { fieldLabel } from "@/data/intern";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/internship", label: "Internship Year", icon: CalendarRange },
  { href: "/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/billing", label: "Billing & Subscription", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, firstName } = useInternStore();
  const initials =
    profile.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "IN";

  return (
    <aside className="hidden w-[var(--mm-sidebar-width)] shrink-0 flex-col border-r border-mm-border bg-mm-surface lg:flex">
      <div className="flex h-[var(--mm-topnav-height)] items-center border-b border-mm-border px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-[var(--mm-radius-lg)] px-3.5 py-2.5 text-[0.875rem] font-medium transition-colors duration-[var(--mm-duration)]",
                active
                  ? "bg-mm-teal-50 text-mm-teal-700"
                  : "text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
              )}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                className={active ? "text-mm-teal-700" : "text-mm-gray-400"}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-mm-border p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-[var(--mm-radius-lg)] p-2 transition-colors hover:bg-mm-gray-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mm-navy text-[0.75rem] font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-semibold text-mm-navy">
              {profile.fullName || firstName}
            </p>
            <p className="truncate text-[0.75rem] text-mm-text-muted">
              Intern · {fieldLabel(profile.field)}
            </p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
