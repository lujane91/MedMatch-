"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { fieldLabel } from "@/data/intern";

export default function OnboardingReviewPage() {
  const router = useRouter();
  const { profile, completeOnboarding } = useInternStore();
  const { markUnpaidProgress } = useSubscriptionStore();
  const { plan } = usePlatformSubscriptionPlanStore();

  const rows = [
    { label: "Full name", value: profile.fullName || "—" },
    { label: "Email", value: profile.email || "—" },
    { label: "Mobile", value: profile.mobile || "—" },
    {
      label: "Pathway",
      value:
        profile.trainingStage === "intern"
          ? "Internship"
          : profile.trainingStage || "—",
    },
    { label: "Profession", value: fieldLabel(profile.field) || "—" },
  ];

  function continueToPayment() {
    completeOnboarding({
      field: profile.field ?? "medicine",
      trainingStage: "intern",
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

  return (
    <InternOnboardingShell
      stepId="review"
      title="Review your details"
      subtitle="Confirm your information before paying for your annual subscription."
      backHref="/onboarding/profession"
      footer={
        <button
          type="button"
          onClick={continueToPayment}
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
        >
          Continue to Payment
        </button>
      }
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <dl className="space-y-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 border-b border-mm-border pb-3 last:border-b-0 last:pb-0"
            >
              <dt className="text-sm text-mm-text-secondary">{row.label}</dt>
              <dd className="text-right text-sm font-semibold text-mm-navy">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.8125rem] text-mm-text-muted">
          Need to change something?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-mm-teal-700 hover:text-mm-teal"
          >
            Edit account details
          </Link>
        </p>
      </div>
    </InternOnboardingShell>
  );
}
