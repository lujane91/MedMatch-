"use client";

import { useRouter } from "next/navigation";
import {
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
  const { setTrainingStage } = useInternStore();

  return (
    <InternOnboardingShell
      stepId="stage"
      title="Where are you in your medical journey?"
      subtitle="Select your current stage."
      backHref="/create-account"
    >
      <div className="grid gap-3">
        {stages.map((stage) => {
          const Icon = stage.icon;
          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                setTrainingStage(stage.id);
                router.push("/onboarding/profession");
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
                  {stage.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
