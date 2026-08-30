"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";
import "@/components/onboarding/onboarding.css";

const steps = [
  { id: "stage", path: "/onboarding/applying-for", label: "Pathway" },
  { id: "field", path: "/onboarding/profession", label: "Profession" },
  { id: "level", path: "/onboarding/professional-level", label: "Level" },
  { id: "review", path: "/onboarding/review", label: "Review" },
] as const;

type InternOnboardingShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  stepId: (typeof steps)[number]["id"] | "coming-soon";
  backHref?: string | null;
  footer?: ReactNode;
};

export function InternOnboardingShell({
  children,
  title,
  subtitle,
  stepId,
  backHref,
  footer,
}: InternOnboardingShellProps) {
  const stepIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === stepId),
  );
  const total = steps.length;
  const progress =
    stepId === "coming-soon" ? 25 : ((stepIndex + 1) / total) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-mm-bg">
      <header className="border-b border-mm-border/80 bg-mm-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">
          <Logo href="/" />
          <p className="text-[0.8125rem] font-medium text-mm-text-muted">
            {stepId === "coming-soon"
              ? "Coming soon"
              : `Step ${stepIndex + 1} of ${total}`}
          </p>
        </div>
        <div className="h-1 w-full bg-mm-gray-100">
          <div
            className="h-full bg-mm-teal transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10 lg:px-8 lg:py-14">
        <div className="onboarding-enter">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-mm-teal">
            {stepId === "coming-soon"
              ? "Pathway"
              : steps[stepIndex]?.label}
          </p>
          <h1 className="mt-3 font-[family-name:var(--mm-font-display)] text-[clamp(1.875rem,4vw,2.5rem)] leading-[1.12] tracking-[-0.03em] text-mm-navy">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-mm-text-secondary">
              {subtitle}
            </p>
          ) : null}
          <div className="mt-8">{children}</div>
        </div>

        <div
          className="sticky bottom-0 z-20 -mx-6 mt-auto border-t border-mm-border bg-mm-bg/95 px-6 pt-4 backdrop-blur-xl lg:static lg:mx-0 lg:mt-10 lg:bg-transparent lg:px-0 lg:pt-0 lg:backdrop-blur-none"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-gray-50"
              >
                Back
              </Link>
            ) : (
              <span />
            )}
            <div className={cn("flex flex-1 justify-end gap-2")}>{footer}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
