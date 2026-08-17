"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";

/** Compact header control — opens the dedicated Filters page. */
export function DashboardPeriodFilter() {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);

  return (
    <Link
      href={`${base}/dashboard/filters`}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
      aria-label="Open dashboard filters"
    >
      <SlidersHorizontal size={18} strokeWidth={1.75} aria-hidden />
    </Link>
  );
}
