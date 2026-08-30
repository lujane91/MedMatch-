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
} from "lucide-react";
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

export function MobileBottomNav() {
  const pathname = usePathname();
  const { profile } = useInternStore();
  const items = getJourneyNavItems(profile.trainingStage);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-mm-border bg-mm-surface/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {items.map((item) => {
          const Icon = iconById[item.id] ?? Compass;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 px-1 text-[0.625rem] font-semibold",
                  active ? "text-mm-teal-700" : "text-mm-text-muted",
                )}
              >
                <Icon size={20} strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
