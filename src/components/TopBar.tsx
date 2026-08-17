"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "@/components/ui/icons";
import { Logo } from "./Logo";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";

const mobileLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/internship", label: "Internship Year" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/applications", label: "Applications" },
  { href: "/saved", label: "Saved" },
  { href: "/notifications", label: "Notifications" },
  { href: "/billing", label: "Billing & Subscription" },
  { href: "/profile", label: "Profile" },
];

export function TopBar({ title }: { title?: string }) {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 border-b border-mm-border bg-mm-surface/90 backdrop-blur-xl"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="flex h-[var(--mm-topnav-height)] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <details className="relative lg:hidden">
            <summary
              className={cn(
                "flex list-none cursor-pointer items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white p-2 text-mm-navy",
                "marker:content-none [&::-webkit-details-marker]:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu size={18} strokeWidth={1.75} />
            </summary>
            <div className="absolute left-0 top-12 z-30 w-56 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-2 shadow-mm-md">
              <div className="mb-2 px-2 py-1">
                <Logo href="/dashboard" />
              </div>
              {mobileLinks.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-[var(--mm-radius-lg)] px-3 py-2 text-[0.875rem] font-medium transition-colors",
                      active
                        ? "bg-mm-teal-50 text-mm-teal-700"
                        : "text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </details>
          {title ? (
            <h1 className="truncate text-lg font-semibold tracking-tight text-mm-navy lg:text-xl">
              {title}
            </h1>
          ) : null}
        </div>

        <div className="mx-auto hidden max-w-md flex-1 md:block">
          <Link
            href="/opportunities"
            className="block"
            aria-label="Search opportunities"
          >
            <SearchInput
              label="Search"
              placeholder="Search opportunities, hospitals..."
              readOnly
              tabIndex={-1}
              className="pointer-events-none cursor-pointer"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/opportunities"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50 md:hidden"
            aria-label="Search opportunities"
          >
            <Search size={18} strokeWidth={1.75} />
          </Link>
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
            AH
          </Link>
        </div>
      </div>
    </header>
  );
}
