"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SubscriptionShell,
  subscriptionPrimaryButtonClass,
} from "@/components/subscription/SubscriptionShell";
import {
  formatSar,
  formatSubscriptionDate,
} from "@/data/subscription";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const { hydrated, subscription, canAccessDashboard } = useSubscriptionStore();

  useEffect(() => {
    if (!hydrated) return;
    if (!canAccessDashboard) {
      router.replace("/subscription/complete");
    }
  }, [canAccessDashboard, hydrated, router]);

  if (!hydrated) {
    return (
      <SubscriptionShell title="Account Created Successfully">
        <p className="text-sm text-mm-text-muted">Loading…</p>
      </SubscriptionShell>
    );
  }

  return (
    <SubscriptionShell
      title="Account Created Successfully"
      subtitle="Your MedJourney monthly subscription is active."
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <dl className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-mm-text-secondary">Amount Paid</dt>
            <dd className="text-sm font-semibold text-mm-navy">
              {formatSar(subscription.amountPaid ?? subscription.priceSar)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-mm-border pt-4">
            <dt className="text-sm text-mm-text-secondary">
              Subscription Expiry Date
            </dt>
            <dd className="text-sm font-semibold text-mm-navy">
              {formatSubscriptionDate(subscription.expiryDate)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-mm-border pt-4">
            <dt className="text-sm text-mm-text-secondary">Transaction ID</dt>
            <dd className="text-sm font-semibold text-mm-navy">
              {subscription.transactionId ?? "—"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 space-y-4">
        <Link href="/passport?welcome=1" className={subscriptionPrimaryButtonClass}>
          Open MedJourney Passport
        </Link>
        <Link
          href="/subscription/invoice"
          className="block text-center text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
        >
          View Invoice
        </Link>
      </div>
    </SubscriptionShell>
  );
}
