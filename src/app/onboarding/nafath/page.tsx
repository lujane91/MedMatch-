"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui";
import { continueToSubscriptionPayment } from "@/lib/continue-to-subscription";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { cn } from "@/lib/cn";

type NafathStep = "start" | "waiting" | "verified";

/** Saudi National ID / Iqama are 10-digit numbers. */
function isValidNationalIdOrIqama(value: string) {
  return /^\d{10}$/.test(value.trim());
}

export default function NafathVerificationPage() {
  const router = useRouter();
  const { profile, hydrated, completeOnboarding, updateProfile } =
    useInternStore();
  const { markUnpaidProgress } = useSubscriptionStore();
  const { plan } = usePlatformSubscriptionPlanStore();
  const [step, setStep] = useState<NafathStep>("start");
  const [nationalId, setNationalId] = useState("");
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!hydrated || prefilled) return;
    const saved = profile.nationalId?.replace(/\D/g, "") || "";
    if (saved) setNationalId(saved.slice(0, 10));
    setPrefilled(true);
  }, [hydrated, prefilled, profile.nationalId]);

  const canVerify = isValidNationalIdOrIqama(nationalId);

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

  function startMockNafath() {
    if (!canVerify) return;
    const trimmed = nationalId.trim();
    updateProfile({ nationalId: trimmed });
    setStep("waiting");
  }

  return (
    <AuthShell
      title="Verify your identity"
      subtitle={subtitle}
      panelTitle="Verify your identity"
      panelBody="Continue with Nafath to verify your identity."
      footer={null}
    >
      {step === "start" ? (
        <div className="space-y-4">
          <Input
            label="National ID or Iqama Number"
            name="nationalId"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="Enter your National ID or Iqama number"
            value={nationalId}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
              setNationalId(digits);
            }}
            required
          />
          <button
            type="button"
            disabled={!canVerify}
            onClick={startMockNafath}
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background,opacity] duration-[var(--mm-duration)]",
              canVerify
                ? "hover:-translate-y-px hover:bg-mm-teal-700"
                : "cursor-not-allowed opacity-50",
            )}
          >
            Verify with Nafath
          </button>
        </div>
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
