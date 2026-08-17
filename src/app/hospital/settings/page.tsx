"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  ClipboardList,
  LogOut,
  Shield,
  Building2,
} from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { useRoleStore } from "@/lib/role-store";

const SETTINGS_LINKS = [
  {
    href: "/settings/profile",
    label: "Hospital Profile",
    description: "Name, logo, contact, and internship program details.",
    icon: Building2,
  },
  {
    href: "/settings/team",
    label: "Team Access & Permissions",
    description: "Add users and manage permissions for this hospital.",
    icon: Shield,
  },
  {
    href: "/settings/audit",
    label: "Audit & Activity Log",
    description: "Review actions taken across the hospital portal.",
    icon: ClipboardList,
  },
] as const;

export default function HospitalSettingsPage() {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const { clearRole } = useRoleStore();

  return (
    <HospitalShell title="Settings">
      <div className="mx-auto max-w-2xl">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy sm:text-2xl">
            Settings
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Configure the currently selected hospital.
          </p>
        </div>

        <ul className="overflow-hidden rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
          {SETTINGS_LINKS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li
                key={item.href}
                className={
                  index > 0 ? "border-t border-mm-border" : undefined
                }
              >
                <Link
                  href={`${base}${item.href}`}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-mm-gray-50 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal-700">
                    <Icon size={18} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-semibold text-mm-navy">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-sm text-mm-text-secondary">
                      {item.description}
                    </span>
                  </span>
                  <ChevronRight
                    size={18}
                    className="shrink-0 text-mm-gray-400"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}

          <li className="border-t border-mm-border">
            <Link
              href="/"
              onClick={() => clearRole()}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-mm-gray-50 sm:px-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-50 text-mm-text-muted">
                <LogOut size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[0.9375rem] font-semibold text-mm-navy">
                  Sign Out
                </span>
                <span className="mt-0.5 block text-sm text-mm-text-secondary">
                  Return to MedJourney and clear the hospital admin session.
                </span>
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </HospitalShell>
  );
}
