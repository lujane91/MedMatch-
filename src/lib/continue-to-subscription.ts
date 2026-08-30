"use client";

import { useRouter } from "next/navigation";
import type { InternProfile } from "@/data/intern";
import type { PlatformSubscriptionPlan } from "@/data/platform-subscription-plan";

type ContinueArgs = {
  profile: InternProfile;
  plan: PlatformSubscriptionPlan;
  completeOnboarding: (data: Partial<InternProfile>) => void;
  markUnpaidProgress: (live: {
    planName: string;
    price: number;
    durationMonths: number;
    currency: "SAR";
    features: string[];
  }) => void;
  router: ReturnType<typeof useRouter>;
};

/** Completes onboarding selection and opens subscription payment. */
export function continueToSubscriptionPayment({
  profile,
  plan,
  completeOnboarding,
  markUnpaidProgress,
  router,
}: ContinueArgs) {
  completeOnboarding({
    field: profile.field ?? "medicine",
    trainingStage: profile.trainingStage ?? "intern",
    identityVerified: true,
  });
  markUnpaidProgress({
    planName: plan.planName,
    price: plan.price,
    durationMonths: plan.durationMonths,
    currency: plan.currency,
    features: plan.features,
  });
  router.push("/subscription/pay");
}
