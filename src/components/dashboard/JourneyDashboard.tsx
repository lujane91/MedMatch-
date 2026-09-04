"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DashboardIdentity } from "@/components/dashboard/DashboardIdentity";
import { MyJourneyCard } from "@/components/dashboard/MyJourneyCard";
import { NeedsAttention } from "@/components/dashboard/NeedsAttention";
import { ResearchWorkspace } from "@/components/dashboard/ResearchWorkspace";
import { CoursesWorkspace } from "@/components/dashboard/CoursesWorkspace";
import { ConferencesWorkspace } from "@/components/dashboard/ConferencesWorkspace";
import { CareerWorkspace } from "@/components/dashboard/CareerWorkspace";
import { TrainingWorkspace } from "@/components/dashboard/TrainingWorkspace";
import { DemoPersonaSwitcher } from "@/components/dashboard/DemoPersonaSwitcher";
import { formatPlanPrice } from "@/data/platform-subscription-plan";
import {
  buildStageDashboard,
  type AttentionItem,
} from "@/data/journey-dashboard";
import { useInternStore } from "@/lib/intern-store";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { useSubscriptionStore } from "@/lib/subscription-store";
import { useEffect, useMemo } from "react";

export function JourneyDashboard({
  focus,
}: {
  focus?:
    | "overview"
    | "training"
    | "research"
    | "courses"
    | "conferences"
    | "career";
}) {
  const { profile, hydrated } = useInternStore();
  const { isExpiringSoon, setExpiringSoonWindowDays } = useSubscriptionStore();
  const { plan, hydrated: planHydrated } = usePlatformSubscriptionPlanStore();

  useEffect(() => {
    if (!planHydrated) return;
    const windowDays = Math.max(...plan.renewalReminderDays, 30);
    setExpiringSoonWindowDays(windowDays);
  }, [plan.renewalReminderDays, planHydrated, setExpiringSoonWindowDays]);

  const config = useMemo(() => buildStageDashboard(profile), [profile]);

  const attentionItems = useMemo(() => {
    const items: AttentionItem[] = [...config.attention];
    if (isExpiringSoon) {
      items.unshift({
        id: "subscription-renewal",
        title: "Subscription renewal",
        detail: `Renew for ${formatPlanPrice(plan)} to keep your MedJourney access.`,
        href: "/subscription/pay?renew=1",
      });
    }
    return items;
  }, [config.attention, isExpiringSoon, plan]);

  if (!hydrated) {
    return (
      <AppShell title="Journey">
        <p className="text-mm-text-muted">Loading your MedJourney…</p>
      </AppShell>
    );
  }

  if (!profile.onboardingComplete) {
    return (
      <AppShell title="Journey">
        <div className="mx-auto max-w-lg rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-8 text-center">
          <h1 className="font-[family-name:var(--mm-font-display)] text-2xl text-mm-navy">
            Finish setting up your profile
          </h1>
          <p className="mt-3 text-mm-text-secondary">
            Complete onboarding to open your MedJourney dashboard.
          </p>
          <Link
            href="/create-account"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
          >
            Continue setup
            <ArrowRight size={16} />
          </Link>
        </div>
      </AppShell>
    );
  }

  const title =
    focus === "training"
      ? config.trainingTitle || "Training"
      : focus === "research"
        ? "Research"
        : focus === "courses"
          ? "Courses"
          : focus === "conferences"
            ? "Conferences"
            : focus === "career"
              ? "Career"
              : "Journey";

  return (
    <AppShell title={title}>
      <div className="mx-auto max-w-3xl space-y-5 pb-24 lg:pb-8">
        {focus === "overview" || !focus ? (
          <>
            <DashboardIdentity />
            <NeedsAttention items={attentionItems} />
            <MyJourneyCard
              profile={profile}
              latestStamp={config.latestStamp}
            />
            {config.showTraining && config.trainingTitle ? (
              <TrainingWorkspace
                profile={profile}
                title={config.trainingTitle}
                compact
              />
            ) : null}
            <ResearchWorkspace profile={profile} compact />
            <CoursesWorkspace profile={profile} compact />
            <ConferencesWorkspace profile={profile} compact />
            <CareerWorkspace profile={profile} compact />
            <DemoPersonaSwitcher />
          </>
        ) : null}

        {focus === "training" ? (
          config.showTraining && config.trainingTitle ? (
            <TrainingWorkspace
              profile={profile}
              title={config.trainingTitle}
            />
          ) : (
            <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 text-center">
              <p className="text-[0.9375rem] text-mm-text-secondary">
                Training is not part of the Medical Practice journey.
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-flex text-[0.875rem] font-semibold text-mm-teal"
              >
                Back to Journey
              </Link>
            </div>
          )
        ) : null}

        {focus === "research" ? (
          <ResearchWorkspace profile={profile} />
        ) : null}
        {focus === "courses" ? (
          <CoursesWorkspace profile={profile} />
        ) : null}
        {focus === "conferences" ? (
          <ConferencesWorkspace profile={profile} />
        ) : null}
        {focus === "career" ? (
          <CareerWorkspace profile={profile} />
        ) : null}
      </div>
    </AppShell>
  );
}
