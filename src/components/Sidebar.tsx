"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  CalendarRange,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Mic2,
  UserRound,
} from "lucide-react";
import { Logo } from "./Logo";
import { fieldLabel, trainingStageLabel } from "@/data/intern";
import { getJourneyNavItems } from "@/data/journey-dashboard";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const iconById = {
  journey: LayoutDashboard,
  training: CalendarRange,
  research: FlaskConical,
  conferences: Mic2,
  career: Briefcase,
} as const;

export function Sidebar() {
  const pathname = usePathname();
  const { profile, firstName } = useInternStore();
  const navItems = getJourneyNavItems(profile.trainingStage);
  const initials =
    profile.fullName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "MJ";

  return (
    <aside className="hidden w-[var(--mm-sidebar-width)] shrink-0 flex-col border-r border-mm-border bg-mm-surface lg:flex">
      <div className="flex h-[var(--mm-topnav-height)] items-center border-b border-mm-border px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Primary">
        {navItems.map(({ id, href, label }) => {
          const Icon = iconById[id] ?? Compass;
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
              {trainingStageLabel(profile.trainingStage) || "Journey"} ·{" "}
              {fieldLabel(profile.field)}
            </p>
          </div>
        </Link>
        <Link
          href="/profile"
          className="mt-2 flex items-center gap-2 px-2 py-1.5 text-[0.75rem] font-medium text-mm-text-muted hover:text-mm-navy"
        >
          <UserRound size={14} strokeWidth={1.75} />
          Passport and profile
        </Link>
      </div>
    </aside>
  );
}
