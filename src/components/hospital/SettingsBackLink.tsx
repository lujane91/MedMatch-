"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";

export function SettingsBackLink({
  label = "Back to Settings",
}: {
  label?: string;
}) {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  return (
    <Link
      href={`${base}/settings`}
      className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mm-teal-700 transition-colors hover:text-mm-teal"
    >
      <ArrowLeft size={16} strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  );
}
