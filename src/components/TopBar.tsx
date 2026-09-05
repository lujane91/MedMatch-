"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "@/components/ui/icons";
import { getJourneyNavItems } from "@/data/journey-dashboard";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

export function TopBar({ title }: { title?: string }) {
  const pathname = usePathname();
  const { profile } = useInternStore();
  const initials =
    profile.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "MJ";

  return (
    <header
      className="sticky top-0 z-40 border-b border-mm-border bg-mm-surface/90 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-[var(--mm-topnav-height)] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="min-w-0">
          {title ? (
            <h1 className="truncate text-lg font-semibold tracking-tight text-mm-navy lg:text-xl">
              {title}
            </h1>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-mm-teal/25 bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal-700 sm:inline-flex">
            Demo
          </span>
          <Link
            href="/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
            aria-label="Notifications"
          >
            <Bell size={18} strokeWidth={1.75} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-mm-teal" />
          </Link>
          <Link
            href="/profile"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mm-navy text-[0.75rem] font-semibold text-white"
            aria-label="Profile"
          >
            {initials}
          </Link>
        </div>
      </div>

      {/* Compact secondary row for smaller tablets; phones use bottom nav */}
      <nav
        className="hidden gap-1 overflow-x-auto border-t border-mm-border px-4 py-2 md:flex lg:hidden"
        aria-label="Journey sections"
      >
        {getJourneyNavItems(profile.trainingStage).map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold transition-colors",
                active
                  ? "bg-mm-teal-50 text-mm-teal-700"
                  : "text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
