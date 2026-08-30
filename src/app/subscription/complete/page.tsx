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
} from "@/data/subscription";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";

export default function CompleteSubscriptionPage() {
  const router = useRouter();
  const { hydrated: internHydrated, profile } = useInternStore();
  const { hydrated, subscription, canAccessDashboard } = useSubscriptionStore();
  const { plan } = usePlatformSubscriptionPlanStore();

  useEffect(() => {
    if (!internHydrated || !hydrated) return;
    if (!profile.onboardingComplete) {
      router.replace("/onboarding/applying-for");
      return;
    }
    if (canAccessDashboard) {
      router.replace("/dashboard");
    }
  }, [
    canAccessDashboard,
    hydrated,
    internHydrated,
    profile.onboardingComplete,
    router,
  ]);

  if (!hydrated || !internHydrated) {
    return (
      <SubscriptionShell title="Complete Your Subscription">
        <p className="text-sm text-mm-text-muted">Loading…</p>
      </SubscriptionShell>
    );
  }

  return (
    <SubscriptionShell
      title="Complete Your Subscription"
      subtitle="Finish payment to activate your MedJourney account."
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <p className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold text-mm-navy">
          {formatSar(plan.price)} monthly subscription
        </p>
        <dl className="mt-5 space-y-3 border-t border-mm-border pt-5">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-mm-text-secondary">Payment status</dt>
            <dd className="text-sm font-semibold text-mm-navy">
              {subscription.paymentStatus}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-mm-text-secondary">Account</dt>
            <dd className="text-sm font-semibold text-mm-navy">
              {profile.email || "Saved"}
            </dd>
          </div>
        </dl>
      </div>

      <Link
        href="/subscription/pay"
        className={`${subscriptionPrimaryButtonClass} mt-8`}
      >
        Continue Payment
      </Link>
    </SubscriptionShell>
  );
}
