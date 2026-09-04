"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

/**
 * Reusable subscription access guard for student internship workspace routes.
 * Redirects unpaid / inactive students away from dashboard URLs.
 */
export function SubscriptionAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { hydrated: internHydrated, profile } = useInternStore();
  const {
    hydrated: subscriptionHydrated,
    canAccessDashboard,
    subscription,
  } = useSubscriptionStore();

  const ready = internHydrated && subscriptionHydrated;

  useEffect(() => {
    if (!ready) return;

    if (!profile.fullName || !profile.email) {
      router.replace("/sign-in");
      return;
    }

    if (!profile.onboardingComplete) {
      router.replace("/create-account");
      return;
    }

    if (!canAccessDashboard) {
      const target =
        subscription.paymentStatus === "Failed"
          ? "/subscription/failed"
          : "/subscription/complete";
      if (pathname !== target) {
        router.replace(target);
      }
    }
  }, [
    canAccessDashboard,
    pathname,
    profile.email,
    profile.fullName,
    profile.onboardingComplete,
    ready,
    router,
    subscription.paymentStatus,
  ]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4">
        <p className="text-sm text-mm-text-muted">Loading…</p>
      </div>
    );
  }

  if (!profile.onboardingComplete || !canAccessDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4">
        <p className="text-sm text-mm-text-muted">Checking subscription…</p>
      </div>
    );
  }

  return <>{children}</>;
}
