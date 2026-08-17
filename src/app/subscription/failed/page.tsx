"use client";

import Link from "next/link";
import {
  SubscriptionShell,
  subscriptionPrimaryButtonClass,
  subscriptionSecondaryButtonClass,
} from "@/components/subscription/SubscriptionShell";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function SubscriptionFailedPage() {
  const { resetPaymentAttempt } = useSubscriptionStore();

  return (
    <SubscriptionShell
      title="Payment Unsuccessful"
      subtitle="Your account information has been saved. Please try again."
    >
      <div className="space-y-3">
        <Link
          href="/subscription/pay"
          onClick={() => resetPaymentAttempt()}
          className={subscriptionPrimaryButtonClass}
        >
          Try Again
        </Link>
        <Link
          href="/subscription/pay"
          onClick={() => resetPaymentAttempt()}
          className={subscriptionSecondaryButtonClass}
        >
          Change Payment Method
        </Link>
      </div>
    </SubscriptionShell>
  );
}
