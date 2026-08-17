"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ArrowRight,
  Bell,
  Bookmark,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  FileWarning,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { fieldLabel } from "@/data/intern";
import { formatPlanPrice } from "@/data/platform-subscription-plan";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function DashboardPage() {
  const { profile, rotations, firstName, hydrated } = useInternStore();
  const { isExpiringSoon, setExpiringSoonWindowDays } = useSubscriptionStore();
  const { plan, hydrated: planHydrated } = usePlatformSubscriptionPlanStore();

  useEffect(() => {
    if (!planHydrated) return;
    const windowDays = Math.max(...plan.renewalReminderDays, 30);
    setExpiringSoonWindowDays(windowDays);
  }, [plan.renewalReminderDays, planHydrated, setExpiringSoonWindowDays]);

  if (!hydrated) {
    return (
      <AppShell title="Dashboard">
        <p className="text-mm-text-muted">Loading your internship workspace…</p>
      </AppShell>
    );
  }

  if (!profile.onboardingComplete) {
    return (
      <AppShell title="Dashboard">
        <div className="mx-auto max-w-lg rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-8 text-center">
          <h1 className="font-[family-name:var(--mm-font-display)] text-2xl text-mm-navy">
            Finish setting up your intern profile
          </h1>
          <p className="mt-3 text-mm-text-secondary">
            Complete onboarding to unlock your internship dashboard.
          </p>
          <Link
            href="/onboarding/applying-for"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
          >
            Continue setup
            <ArrowRight size={16} />
          </Link>
        </div>
      </AppShell>
    );
  }

  const approved = rotations.filter((r) => r.status === "Accepted").length;
  const pending = rotations.filter((r) =>
    ["Submitted", "Under Review", "Changes Requested", "Ready to Submit"].includes(
      r.status,
    ),
  ).length;
  const incomplete = rotations.filter(
    (r) =>
      r.status === "Draft" || r.status === "Requirements Incomplete",
  ).length;
  const upcoming = [...rotations]
    .filter((r) => r.status !== "Rejected")
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0];

  const cards = [
    {
      label: "Internship Year Progress",
      value: `${approved} approved`,
      detail: `${rotations.length} planned rotations`,
    },
    {
      label: "Upcoming Rotation",
      value: upcoming?.specialty ?? "Not planned",
      detail: upcoming
        ? `${upcoming.startDate} → ${upcoming.endDate}`
        : "Add your first rotation",
    },
    {
      label: "Pending Applications",
      value: String(pending),
      detail: "Awaiting review or action",
    },
    {
      label: "Approved Rotations",
      value: String(approved),
      detail: "Confirmed hospital placements",
    },
    {
      label: "Incomplete Requirements",
      value: String(incomplete),
      detail: "Drafts needing documents",
    },
  ];

  const quickLinks = [
    { href: "/opportunities", label: "Browse Opportunities", icon: ClipboardList },
    { href: "/applications", label: "My Applications", icon: FileWarning },
    { href: "/saved", label: "Saved Opportunities", icon: Bookmark },
    { href: "/profile", label: "My Profile", icon: UserRound },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <AppShell title="Intern Dashboard">
      <div className="mx-auto max-w-6xl space-y-8">
        {isExpiringSoon ? (
          <div className="rounded-[var(--mm-radius-xl)] border border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
            <p className="text-sm font-semibold text-mm-navy">
              Your MedJourney subscription expires soon.
            </p>
            <Link
              href="/subscription/pay?renew=1"
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
            >
              Renew for {formatPlanPrice(plan)}
            </Link>
          </div>
        ) : null}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal">
              {fieldLabel(profile.field)} · Intern
            </p>
            <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.02em] text-mm-navy">
              Welcome, {firstName}
            </h1>
            <p className="mt-2 max-w-xl text-[1.0625rem] text-mm-text-secondary">
              Plan, apply for, and track your internship rotations.
            </p>
          </div>
          <Link
            href="/internship"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] hover:-translate-y-px hover:bg-mm-teal-700"
          >
            <CalendarRange size={16} />
            Manage My Internship Year
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm"
            >
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                {card.label}
              </p>
              <p className="mt-3 text-[1.375rem] font-semibold text-mm-navy">
                {card.value}
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                {card.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-mm-teal" size={18} />
            <h2 className="text-[1rem] font-semibold text-mm-navy">
              Quick links
            </h2>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3 text-[0.875rem] font-medium text-mm-navy transition-colors hover:border-mm-teal/40 hover:bg-mm-teal-50/40"
              >
                <Icon size={16} className="text-mm-teal" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
