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
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const professions = [
  {
    id: "medicine" as const,
    title: "Medicine",
    description: "MBBS / MD graduates preparing for clinical internship.",
    icon: Stethoscope,
    available: true,
  },
  {
    id: "dentistry" as const,
    title: "Dentistry",
    description: "Dental graduates completing clinical internship rotations.",
    icon: Smile,
    available: false,
  },
  {
    id: "pharmacy" as const,
    title: "Pharmacy",
    description: "Pharmacy graduates entering hospital or clinical training.",
    icon: Pill,
    available: false,
  },
  {
    id: "nursing" as const,
    title: "Nursing",
    description: "Nursing graduates completing structured internship years.",
    icon: HeartPulse,
    available: false,
  },
  {
    id: "allied" as const,
    title: "Allied Health",
    description: "Therapy, imaging, lab, and rehabilitation disciplines.",
    icon: Activity,
    available: false,
  },
];

export default function ProfessionPage() {
  const router = useRouter();
  const { setField } = useInternStore();

  return (
    <InternOnboardingShell
      stepId="field"
      title="Choose Your Profession"
      subtitle="Select the profession that matches your academic background."
      backHref="/onboarding/applying-for"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {professions.map((profession) => {
          const Icon = profession.icon;

          if (!profession.available) {
            return (
              <div
                key={profession.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface/70 p-4 opacity-80 sm:p-5"
                aria-disabled
              >
                <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-mm-gray-100 text-mm-text-muted">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.9375rem] font-semibold text-mm-navy">
                    {profession.title}
                  </p>
                  <span className="rounded-full bg-mm-gray-100 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mm-text-muted">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-mm-text-muted">
                  {profession.description}
                </p>
              </div>
            );
          }

          return (
            <button
              key={profession.id}
              type="button"
              onClick={() => {
                setField("medicine");
                router.push("/onboarding/review");
              }}
              className={cn(
                "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 text-left transition-[transform,border-color,box-shadow,background] duration-[var(--mm-duration)] hover:-translate-y-0.5 hover:border-mm-teal/40 hover:shadow-mm-sm sm:p-5",
              )}
            >
              <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[rgba(31,166,160,0.12)] text-mm-teal">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[0.9375rem] font-semibold text-mm-navy">
                  {profession.title}
                </p>
                <span className="rounded-full bg-mm-teal-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mm-teal-700">
                  Available now
                </span>
              </div>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-mm-text-muted">
                {profession.description}
              </p>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
