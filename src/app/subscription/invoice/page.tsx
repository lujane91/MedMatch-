"use client";

import Link from "next/link";
import {
  SubscriptionShell,
  subscriptionSecondaryButtonClass,
} from "@/components/subscription/SubscriptionShell";
import {
  formatSar,
  formatSubscriptionDate,
  paymentMethodLabel,
} from "@/data/subscription";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function SubscriptionInvoicePage() {
  const { hydrated, subscription, canAccessDashboard } = useSubscriptionStore();

  if (!hydrated) {
    return (
      <SubscriptionShell title="Invoice">
        <p className="text-sm text-mm-text-muted">Loading…</p>
      </SubscriptionShell>
    );
  }

  if (!subscription.invoiceNumber) {
    return (
      <SubscriptionShell title="Invoice">
        <p className="text-sm text-mm-text-secondary">
          No invoice is available yet.
        </p>
        <Link
          href={canAccessDashboard ? "/billing" : "/subscription/complete"}
          className={`${subscriptionSecondaryButtonClass} mt-6`}
        >
          Back
        </Link>
      </SubscriptionShell>
    );
  }

  const rows = [
    { label: "Invoice number", value: subscription.invoiceNumber },
    { label: "Transaction ID", value: subscription.transactionId ?? "—" },
    { label: "Plan", value: subscription.planName },
    {
      label: "Amount paid",
      value: formatSar(subscription.amountPaid ?? subscription.priceSar),
    },
    {
      label: "Payment method",
      value: paymentMethodLabel(subscription.paymentMethod),
    },
    {
      label: "Payment date",
      value: formatSubscriptionDate(subscription.lastPaymentAt),
    },
    {
      label: "Valid until",
      value: formatSubscriptionDate(subscription.expiryDate),
    },
  ];

  return (
    <SubscriptionShell
      title="Invoice"
      subtitle={subscription.invoiceNumber}
      backHref={canAccessDashboard ? "/billing" : "/subscription/success"}
      backLabel="Back"
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <dl className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 border-b border-mm-border pb-3 last:border-b-0 last:pb-0"
            >
              <dt className="text-sm text-mm-text-secondary">{row.label}</dt>
              <dd className="max-w-[60%] text-right text-sm font-semibold text-mm-navy">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <p className="mt-4 text-center text-[0.75rem] text-mm-text-muted">
        Demo invoice · no real payment was processed
      </p>
    </SubscriptionShell>
  );
}
