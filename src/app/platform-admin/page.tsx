"use client";

import Link from "next/link";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import { formatPlanPrice } from "@/data/platform-subscription-plan";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";

export default function PlatformAdminHomePage() {
  const basePath = usePlatformAdminBasePath();
  const { plan, hydrated } = usePlatformSubscriptionPlanStore();

  return (
    <PlatformAdminShell title="Overview">
      <div className="space-y-4">
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm sm:p-8">
          <h1 className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
            Platform Administration
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mm-text-secondary">
            Restricted MedJourney control area for Owners and authorized
            administrators.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Access model
              </dt>
              <dd className="mt-1 text-sm font-semibold text-mm-navy">
                Role-based · session protected
              </dd>
            </div>
            <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Current student plan
              </dt>
              <dd className="mt-1 text-sm font-semibold text-mm-navy">
                {hydrated
                  ? `${formatPlanPrice(plan)} · ${plan.status}`
                  : "Loading…"}
              </dd>
            </div>
          </dl>
        </div>

        <Link
          href={`${basePath}/subscriptions`}
          className="flex items-center justify-between rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-5 py-4 shadow-mm-sm transition-colors hover:border-mm-teal/35"
        >
          <div>
            <p className="font-semibold text-mm-navy">Subscription Management</p>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Edit price, duration, renewals, and view subscriber history.
            </p>
          </div>
          <span className="text-sm font-semibold text-mm-teal-700">Open</span>
        </Link>

        <Link
          href={`${basePath}/students`}
          className="flex items-center justify-between rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-5 py-4 shadow-mm-sm transition-colors hover:border-mm-teal/35"
        >
          <div>
            <p className="font-semibold text-mm-navy">Students</p>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Search students, review subscriptions, and manage account status.
            </p>
          </div>
          <span className="text-sm font-semibold text-mm-teal-700">Open</span>
        </Link>

        <Link
          href={`${basePath}/hospitals`}
          className="flex items-center justify-between rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-5 py-4 shadow-mm-sm transition-colors hover:border-mm-teal/35"
        >
          <div>
            <p className="font-semibold text-mm-navy">Hospitals</p>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Approve hospitals and manage accounts, specialties, and admins.
            </p>
          </div>
          <span className="text-sm font-semibold text-mm-teal-700">Open</span>
        </Link>
      </div>
    </PlatformAdminShell>
  );
}
