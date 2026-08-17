"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { cn } from "@/lib/cn";

export type RotationCrumb = {
  label: string;
  href?: string;
};

export function RotationBreadcrumbs({
  items,
  className,
}: {
  items: RotationCrumb[];
  className?: string;
}) {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const rotationsHref = `${base}/rotations`;

  return (
    <nav
      aria-label="Rotations breadcrumb"
      className={cn("mb-5 flex flex-wrap items-center gap-1.5 text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const href =
          item.href === "/rotations" || item.href === rotationsHref
            ? rotationsHref
            : item.href;
        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <ChevronRight
                size={14}
                className="text-mm-gray-400"
                aria-hidden
              />
            ) : null}
            {href && !isLast ? (
              <Link
                href={href}
                className="font-semibold text-mm-teal-700 transition-colors hover:text-mm-teal"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  isLast
                    ? "font-semibold text-mm-navy"
                    : "font-medium text-mm-text-secondary",
                )}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function RotationBackLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
    >
      <ArrowLeft size={16} aria-hidden />
      {label}
    </Link>
  );
}
