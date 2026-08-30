"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { continueToSubscriptionPayment } from "@/lib/continue-to-subscription";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

type NafathStep = "start" | "waiting" | "verified";

export default function NafathVerificationPage() {
  const router = useRouter();
  const { profile, completeOnboarding, updateProfile } = useInternStore();
  const { markUnpaidProgress } = useSubscriptionStore();
  const { plan } = usePlatformSubscriptionPlanStore();
  const [step, setStep] = useState<NafathStep>("start");

  useEffect(() => {
    if (step !== "verified") return;
    const timer = window.setTimeout(() => {
      updateProfile({ identityVerified: true });
      continueToSubscriptionPayment({
        profile: { ...profile, identityVerified: true },
        plan,
        completeOnboarding,
        markUnpaidProgress,
        router,
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [
    completeOnboarding,
    markUnpaidProgress,
    plan,
    profile,
    router,
    step,
    updateProfile,
  ]);

  const subtitle =
    step === "start"
      ? "Continue with Nafath to verify your identity."
      : step === "waiting"
        ? "Open the Nafath app and approve the request using the number below."
        : "Identity verified";

  return (
    <AuthShell
      title="Verify your identity"
      subtitle={subtitle}
      panelTitle="Verify your identity"
      panelBody="Continue with Nafath to verify your identity."
      footer={
        <>
          Need help?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
          >
            Back to Complete Your Account
          </Link>
        </>
      }
    >
      {step === "start" ? (
        <button
          type="button"
          onClick={() => setStep("waiting")}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
        >
          Verify with Nafath
        </button>
      ) : null}

      {step === "waiting" ? (
        <div className="space-y-6">
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 px-6 py-8 text-center">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-mm-teal">
              Nafath number
            </p>
            <p className="mt-3 font-[family-name:var(--mm-font-display)] text-[4.5rem] leading-none tracking-[-0.04em] text-mm-navy">
              25
            </p>
            <p className="mt-4 text-[0.9375rem] text-mm-text-muted">
              Waiting for approval
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep("verified")}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
          >
            I approved it
          </button>
        </div>
      ) : null}

      {step === "verified" ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 px-6 py-10 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(31,166,160,0.12)] text-mm-teal">
            <CheckCircle2 size={32} strokeWidth={1.75} aria-hidden />
          </span>
          <p className="mt-4 text-[1.125rem] font-semibold text-mm-navy">
            Identity verified
          </p>
        </div>
      ) : null}
    </AuthShell>
  );
}
