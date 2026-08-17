"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { getStepIndex, onboardingSteps } from "@/data/onboarding";
import { cn } from "@/lib/cn";
import "./onboarding.css";

type OnboardingShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  illustration?: ReactNode;
  backHref?: string | null;
  nextHref?: string | null;
  nextLabel?: string;
  skipHref?: string | null;
  hideNav?: boolean;
};

export function OnboardingShell({
  children,
  title,
  subtitle,
  illustration,
  backHref,
  nextHref,
  nextLabel = "Next",
  skipHref,
  hideNav = false,
}: OnboardingShellProps) {
  const pathname = usePathname();
  const stepIndex = getStepIndex(pathname);
  const total = onboardingSteps.length;
  const progress = ((stepIndex + 1) / total) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-mm-bg">
      <header className="border-b border-mm-border/80 bg-mm-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 lg:px-8">
          <Logo href="/" />
          <p className="text-[0.8125rem] font-medium text-mm-text-muted">
            Step {stepIndex + 1} of {total}
          </p>
        </div>
        <div className="h-1 w-full bg-mm-gray-100">
          <div
            className="h-full bg-mm-teal transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 lg:px-8 lg:py-14">
        <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="onboarding-enter order-2 lg:order-1">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-mm-teal">
              {onboardingSteps[stepIndex]?.label}
            </p>
            <h1 className="mt-3 font-[family-name:var(--mm-font-display)] text-[clamp(2rem,4vw,2.75rem)] leading-[1.1] tracking-[-0.03em] text-mm-navy">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-4 max-w-md text-[1.0625rem] leading-relaxed text-mm-text-secondary">
                {subtitle}
              </p>
            ) : null}
            <div className="mt-8">{children}</div>
          </div>

          <div className="onboarding-enter-delay order-1 lg:order-2">
            {illustration ?? <DefaultIllustration />}
          </div>
        </div>

        {!hideNav ? (
          <div
            className="sticky bottom-0 z-20 -mx-6 mt-10 border-t border-mm-border bg-mm-bg/95 px-6 pt-4 backdrop-blur-xl lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-6 lg:backdrop-blur-none"
            style={{
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {backHref ? (
                  <Link
                    href={backHref}
                    className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-gray-50"
                  >
                    Back
                  </Link>
                ) : (
                  <span className="inline-flex min-h-11 items-center px-2 text-[0.875rem] text-mm-text-muted">
                    Welcome
                  </span>
                )}
                {skipHref ? (
                  <Link
                    href={skipHref}
                    className="inline-flex min-h-11 items-center justify-center px-4 text-[0.875rem] font-semibold text-mm-text-muted transition-colors hover:text-mm-navy"
                  >
                    Skip
                  </Link>
                ) : null}
              </div>

              {nextHref ? (
                <Link
                  href={nextHref}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-6 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700",
                  )}
                >
                  {nextLabel}
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function DefaultIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div
        className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_25%,rgba(31,166,160,0.22),transparent_50%),radial-gradient(circle_at_75%_70%,rgba(14,58,93,0.14),transparent_45%)]"
        aria-hidden
      />
      <div className="absolute inset-6 rounded-[1.75rem] border border-mm-border bg-mm-surface/80 shadow-mm-lg backdrop-blur-xl" />
      <div className="absolute inset-x-12 top-16 h-24 rounded-[1.25rem] bg-gradient-to-br from-mm-navy to-mm-teal opacity-90" />
      <div className="absolute inset-x-12 top-48 space-y-3">
        <div className="h-3 rounded-full bg-mm-gray-100" />
        <div className="h-3 w-[80%] rounded-full bg-mm-gray-100" />
        <div className="h-3 w-[60%] rounded-full bg-mm-gray-100" />
      </div>
    </div>
  );
}
