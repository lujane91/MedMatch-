"use client";

import { useRouter } from "next/navigation";
import { CalendarDays, GraduationCap, Stethoscope } from "lucide-react";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

const pathways = [
  {
    id: "intern" as const,
    title: "Internship",
    description:
      "Plan and apply for your one-year internship rotations across Saudi hospitals.",
    icon: CalendarDays,
    available: true,
  },
  {
    id: "residency" as const,
    title: "Residency",
    description:
      "Apply for or manage residency programs across specialties.",
    icon: Stethoscope,
    available: false,
  },
  {
    id: "fellowship" as const,
    title: "Fellowship",
    description:
      "Explore fellowship pathways after completing residency training.",
    icon: GraduationCap,
    available: false,
  },
];

export default function ApplyingForPage() {
  const router = useRouter();
  const { setTrainingStage } = useInternStore();

  return (
    <InternOnboardingShell
      stepId="stage"
      title="What are you applying for?"
      subtitle="Choose the pathway that matches your next training step."
      backHref="/create-account"
    >
      <div className="grid gap-3">
        {pathways.map((pathway) => {
          const Icon = pathway.icon;
          if (!pathway.available) {
            return (
              <div
                key={pathway.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface/70 p-5 opacity-80 sm:p-6"
                aria-disabled
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-mm-gray-100 text-mm-text-muted">
                    <Icon size={22} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[1.0625rem] font-semibold text-mm-navy">
                        {pathway.title}
                      </p>
                      <span className="rounded-full bg-mm-gray-100 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mm-text-muted">
                        Coming Soon
                      </span>
                    </div>
                    <p className="mt-1.5 text-[0.875rem] leading-relaxed text-mm-text-muted">
                      {pathway.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <button
              key={pathway.id}
              type="button"
              onClick={() => {
                setTrainingStage("intern");
                router.push("/onboarding/profession");
              }}
              className={cn(
                "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left transition-[transform,border-color,box-shadow] duration-[var(--mm-duration)] hover:-translate-y-0.5 hover:border-mm-teal/40 hover:shadow-mm-sm sm:p-6",
              )}
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[rgba(31,166,160,0.12)] text-mm-teal">
                  <Icon size={22} strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[1.0625rem] font-semibold text-mm-navy">
                      {pathway.title}
                    </p>
                    <span className="rounded-full bg-mm-teal-50 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mm-teal-700">
                      Available now
                    </span>
                  </div>
                  <p className="mt-1.5 text-[0.875rem] leading-relaxed text-mm-text-muted">
                    {pathway.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </InternOnboardingShell>
  );
}
