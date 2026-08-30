"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SubscriptionShell,
  subscriptionPrimaryButtonClass,
  subscriptionSecondaryButtonClass,
} from "@/components/subscription/SubscriptionShell";
import { formatPlanPrice } from "@/data/platform-subscription-plan";
import {
  PAYMENT_METHODS,
  type PaymentMethod,
} from "@/data/subscription";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function SubscriptionPayClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRenew = searchParams.get("renew") === "1";
  const { profile, hydrated: internHydrated } = useInternStore();
  const { plan: catalogPlan, hydrated: planHydrated } =
    usePlatformSubscriptionPlanStore();
  const {
    hydrated,
    subscription,
    beginPayment,
    completePaymentSuccess,
    completePaymentFailure,
    renewSubscription,
    setPaymentMethod,
  } = useSubscriptionStore();

  const [method, setMethod] = useState<PaymentMethod>(
    subscription.paymentMethod ?? "mada",
  );
  const [termsAccepted, setTermsAccepted] = useState(
    Boolean(subscription.termsAcceptedAt),
  );
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const livePlan = useMemo(
    () => ({
      planName: catalogPlan.planName,
      price: catalogPlan.price,
      durationMonths: catalogPlan.durationMonths,
      currency: catalogPlan.currency,
      features: catalogPlan.features,
      shortName: "Monthly Subscription",
    }),
    [catalogPlan],
  );

  const priceLabel = formatPlanPrice(catalogPlan);
  const backHref = isRenew
    ? "/billing"
    : profile.trainingStage === "medical-practice" &&
        profile.field === "medicine"
      ? "/onboarding/professional-level"
      : "/onboarding/profession";

  async function runPayment(forceFail: boolean) {
    setError("");
    if (catalogPlan.status !== "Active") {
      setError("Subscriptions are not available right now.");
      return;
    }
    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }
    if (!method) {
      setError("Select a payment method.");
      return;
    }
    if (!profile.onboardingComplete && !isRenew) {
      setError("Please finish registration first.");
      return;
    }

    setProcessing(true);
    setPaymentMethod(method);
    beginPayment(method);

    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (forceFail) {
      completePaymentFailure(method);
      setProcessing(false);
      router.push("/subscription/failed");
      return;
    }

    if (isRenew) {
      renewSubscription(method, livePlan);
    } else {
      completePaymentSuccess(method, livePlan);
    }
    setProcessing(false);
    router.push("/subscription/success");
  }

  if (!hydrated || !internHydrated || !planHydrated) {
    return (
      <SubscriptionShell title="Monthly Subscription">
        <p className="text-sm text-mm-text-muted">Loading…</p>
      </SubscriptionShell>
    );
  }

  return (
    <SubscriptionShell
      title="Monthly Subscription"
      subtitle={`${priceLabel} per month · ${catalogPlan.durationMonths} month of access`}
      backHref={backHref}
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-teal">
          Monthly Subscription
        </p>
        <p className="mt-1 text-sm font-medium text-mm-navy">
          {catalogPlan.planName}
        </p>
        <p className="mt-2 font-[family-name:var(--mm-font-display)] text-3xl font-semibold tracking-tight text-mm-navy">
          {priceLabel}
          <span className="ml-1 text-base font-medium text-mm-text-secondary">
            / month
          </span>
        </p>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {catalogPlan.durationMonths} month of access
        </p>

        <ul className="mt-5 space-y-2 border-t border-mm-border pt-5">
          {catalogPlan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-mm-navy"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mm-teal"
                aria-hidden
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {catalogPlan.status !== "Active" ? (
        <p className="mt-4 rounded-[var(--mm-radius-lg)] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-mm-navy">
          This subscription plan is currently inactive. Please check back later.
        </p>
      ) : null}

      <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-mm-navy">
          Payment method
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {PAYMENT_METHODS.map((item) => {
            const selected = method === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMethod(item.id)}
                aria-pressed={selected}
                className={cn(
                  "rounded-[var(--mm-radius-lg)] border px-3 py-3 text-sm font-semibold transition-colors",
                  selected
                    ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                    : "border-mm-border bg-mm-white text-mm-navy hover:bg-mm-gray-50",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-mm-border text-mm-teal focus:ring-mm-teal"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        />
        <span className="text-sm leading-relaxed text-mm-text-secondary">
          I agree to the MedJourney terms and conditions for the monthly
          subscription.
        </span>
      </label>

      <div className="mt-6 flex items-center justify-between rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-3">
        <span className="text-sm font-medium text-mm-text-secondary">
          Total
        </span>
        <span className="text-lg font-semibold text-mm-navy">{priceLabel}</span>
      </div>

      {error ? (
        <p className="mt-3 text-sm font-medium text-mm-error-700" role="alert">
          {error}
        </p>
      ) : null}

      {processing ? (
        <p className="mt-4 text-center text-sm font-medium text-mm-teal-700">
          Processing payment…
        </p>
      ) : null}

      <div className="mt-6 space-y-3">
        <button
          type="button"
          className={subscriptionPrimaryButtonClass}
          disabled={processing || catalogPlan.status !== "Active"}
          onClick={() => void runPayment(false)}
        >
          {processing
            ? "Processing…"
            : `Pay ${priceLabel} & ${isRenew ? "Renew" : "Create Account"}`}
        </button>
        <Link href={backHref} className={subscriptionSecondaryButtonClass}>
          Back
        </Link>
        <button
          type="button"
          disabled={processing || catalogPlan.status !== "Active"}
          onClick={() => void runPayment(true)}
          className="w-full text-center text-[0.75rem] font-medium text-mm-text-muted underline-offset-2 hover:underline"
        >
          Simulate unsuccessful payment
        </button>
      </div>
    </SubscriptionShell>
  );
}
