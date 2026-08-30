"use client";

import { useRouter } from "next/navigation";
import {
  Award,
  Briefcase,
  CalendarDays,
  GraduationCap,
  Medal,
  Stethoscope,
} from "lucide-react";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";
import type { TrainingStage } from "@/data/intern";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const stages: {
  id: TrainingStage;
  title: string;
  subtitle?: string;
  icon: typeof GraduationCap;
}[] = [
  {
    id: "medical-student",
    title: "Medical Student",
    icon: GraduationCap,
  },
  {
    id: "intern",
    title: "Intern",
    icon: CalendarDays,
  },
  {
    id: "advanced-training",
    title: "Advanced Training",
    subtitle: "For Nursing, Pharmacy and Allied Health",
    icon: Award,
  },
  {
    id: "resident",
    title: "Resident",
    icon: Stethoscope,
  },
  {
    id: "fellow",
    title: "Fellow",
    icon: Medal,
  },
  {
    id: "medical-practice",
    title: "Medical Practice",
    icon: Briefcase,
  },
];

export default function ApplyingForPage() {
  const router = useRouter();
  const { profile, setTrainingStage } = useInternStore();

  return (
    <InternOnboardingShell
      stepId="stage"
      title="Where are you in your medical journey?"
      subtitle="Select your current stage."
      backHref="/"
    >
      <div className="grid gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          const selected = profile.trainingStage === stage.id;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setTrainingStage(stage.id);
                router.push("/onboarding/profession");
              }}
              className={cn(
                "rounded-[var(--mm-radius-xl)] border bg-mm-surface p-5 text-left transition-[transform,border-color,box-shadow] duration-[var(--mm-duration)] hover:-translate-y-0.5 hover:border-mm-teal/40 hover:shadow-mm-sm sm:p-6",
                selected
                  ? "border-mm-teal shadow-mm-sm"
                  : "border-mm-border",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(31,166,160,0.12)] text-mm-teal">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="text-[1.0625rem] font-semibold text-mm-navy">
                    {stage.title}
                  </p>
                  {stage.subtitle ? (
                    <p className="mt-0.5 text-[0.8125rem] leading-snug text-mm-text-muted">
                      {stage.subtitle}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
