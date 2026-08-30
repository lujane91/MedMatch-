"use client";

import { useRouter } from "next/navigation";
import {
  Activity,
  HeartPulse,
  Pill,
  Smile,
  Stethoscope,
} from "lucide-react";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";
import type { HealthcareField } from "@/data/intern";
import { cn } from "@/lib/cn";
import { continueToSubscriptionPayment } from "@/lib/continue-to-subscription";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

const fields: {
  id: HealthcareField;
  title: string;
  icon: typeof Stethoscope;
}[] = [
  {
    id: "medicine",
    title: "Medicine",
    icon: Stethoscope,
  },
  {
    id: "dentistry",
    title: "Dentistry",
    icon: Smile,
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    icon: Pill,
  },
  {
    id: "nursing",
    title: "Nursing",
    icon: HeartPulse,
  },
  {
    id: "allied",
    title: "Allied Health",
    icon: Activity,
  },
];

export default function ProfessionPage() {
  const router = useRouter();
  const { profile, setField, completeOnboarding } = useInternStore();
  const { markUnpaidProgress } = useSubscriptionStore();
  const { plan } = usePlatformSubscriptionPlanStore();

  return (
    <InternOnboardingShell
      stepId="field"
      title="What is your healthcare field?"
      subtitle="Select the field that matches your background."
      backHref="/onboarding/applying-for"
    >
      <div className="grid gap-3">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <button
              key={field.id}
              type="button"
              onClick={() => {
                setField(field.id);
                if (
                  profile.trainingStage === "medical-practice" &&
                  field.id === "medicine"
                ) {
                  router.push("/onboarding/professional-level");
                  return;
                }
                continueToSubscriptionPayment({
                  profile: { ...profile, field: field.id },
                  plan,
                  completeOnboarding,
                  markUnpaidProgress,
                  router,
                });
              }}
              className={cn(
                "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left transition-[transform,border-color,box-shadow] duration-[var(--mm-duration)] hover:-translate-y-0.5 hover:border-mm-teal/40 hover:shadow-mm-sm sm:p-6",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(31,166,160,0.12)] text-mm-teal">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <p className="text-[1.0625rem] font-semibold text-mm-navy">
                  {field.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
