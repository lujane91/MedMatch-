"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import {
  formatSar,
  formatSubscriptionDate,
} from "@/data/subscription";
import { formatPlanPrice } from "@/data/platform-subscription-plan";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function BillingPage() {
  const { hydrated, subscription, isExpiringSoon, setExpiringSoonWindowDays } =
    useSubscriptionStore();
  const { plan, hydrated: planHydrated } = usePlatformSubscriptionPlanStore();

  useEffect(() => {
    if (!planHydrated) return;
    const windowDays = Math.max(...plan.renewalReminderDays, 30);
    setExpiringSoonWindowDays(windowDays);
  }, [plan.renewalReminderDays, planHydrated, setExpiringSoonWindowDays]);

  if (!hydrated) {
    return (
      <AppShell title="Billing & Subscription">
        <p className="text-mm-text-muted">Loading…</p>
      </AppShell>
    );
  }

  const rows = [
    { label: "Current Plan", value: subscription.planName },
    { label: "Payment Status", value: subscription.paymentStatus },
    {
      label: "Amount Paid",
      value: formatSar(subscription.amountPaid ?? subscription.priceSar),
    },
    {
      label: "Subscription Start Date",
      value: formatSubscriptionDate(subscription.startDate),
    },
    {
      label: "Subscription Expiry Date",
      value: formatSubscriptionDate(subscription.expiryDate),
    },
  ];

  return (
    <AppShell title="Billing & Subscription">
      <div className="mx-auto max-w-xl">
        <h2 className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
          Billing & Subscription
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Your MedJourney annual internship plan.
        </p>

        {isExpiringSoon ? (
          <div className="mt-5 rounded-[var(--mm-radius-xl)] border border-amber-200 bg-amber-50 px-4 py-4">
            <p className="text-sm font-semibold text-mm-navy">
              Your MedJourney subscription expires soon.
            </p>
            <Link
              href="/subscription/pay?renew=1"
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-sm font-semibold text-white shadow-mm-teal"
            >
              Renew for {formatPlanPrice(plan)}
            </Link>
          </div>
        ) : null}

        <div className="mt-5 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
          <dl className="space-y-4">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 border-b border-mm-border pb-3 last:border-b-0 last:pb-0"
              >
                <dt className="text-sm text-mm-text-secondary">{row.label}</dt>
                <dd className="max-w-[55%] text-right text-sm font-semibold text-mm-navy">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/subscription/invoice"
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-sm font-semibold text-mm-navy hover:bg-mm-gray-50"
          >
            View Invoice
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-sm font-semibold text-mm-navy hover:bg-mm-gray-50"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </AppShell>
  );
}
