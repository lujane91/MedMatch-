"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Award, Briefcase, UserRound } from "lucide-react";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";
import type { ProfessionalLevel } from "@/data/intern";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const levels: {
  id: ProfessionalLevel;
  title: string;
  icon: typeof UserRound;
}[] = [
  {
    id: "gp",
    title: "GP",
    icon: UserRound,
  },
  {
    id: "specialist",
    title: "Specialist",
    icon: Award,
  },
  {
    id: "consultant",
    title: "Consultant",
    icon: Briefcase,
  },
];

export default function ProfessionalLevelPage() {
  const router = useRouter();
  const { hydrated, profile, setProfessionalLevel } = useInternStore();

  useEffect(() => {
    if (!hydrated) return;
    if (
      profile.trainingStage !== "medical-practice" ||
      profile.field !== "medicine"
    ) {
      router.replace("/onboarding/profession");
    }
  }, [hydrated, profile.field, profile.trainingStage, router]);

  return (
    <InternOnboardingShell
      stepId="level"
      title="What is your current professional level?"
      subtitle="Select the level that matches your current role."
      backHref="/onboarding/profession"
    >
      <div className="grid gap-3">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => {
                setProfessionalLevel(level.id);
                router.push("/onboarding/review");
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
                  {level.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
