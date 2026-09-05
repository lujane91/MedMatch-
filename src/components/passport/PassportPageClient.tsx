"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MedJourneyPassport } from "@/components/passport/MedJourneyPassport";
import { getDemoStampsForStage } from "@/data/passport-stamps";
import { resolveStage } from "@/data/journey-dashboard";
import { useInternStore } from "@/lib/intern-store";

export default function PassportPageClient() {
  const { profile, completeOnboarding } = useInternStore();
  const searchParams = useSearchParams();
  const welcome = searchParams.get("welcome") === "1";
  const [emptyPreview, setEmptyPreview] = useState(welcome);
  const [showNewStamp, setShowNewStamp] = useState(false);

  const stage = resolveStage(profile.trainingStage);
  const demoStamp = useMemo(
    () => getDemoStampsForStage(stage)[0] ?? null,
    [stage],
  );

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24 lg:pb-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal">
            MedJourney Passport
          </p>
          <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
            Your verified accomplishments across your healthcare journey.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex min-h-10 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
        >
          My Profile
        </Link>
      </div>

      {showNewStamp && demoStamp ? (
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-teal/30 bg-mm-teal-50 px-4 py-4 sm:px-5">
          <p className="text-[0.9375rem] font-semibold text-mm-navy">
            You earned a new stamp
          </p>
          <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
            {demoStamp.title}
          </p>
          <button
            type="button"
            onClick={() => {
              setEmptyPreview(false);
              setShowNewStamp(false);
            }}
            className="mt-3 text-[0.875rem] font-semibold text-mm-teal-700"
          >
            View in Passport
          </button>
        </div>
      ) : null}

      <MedJourneyPassport
        profile={profile}
        empty={emptyPreview}
        welcome={welcome && emptyPreview}
      />

      <section className="rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-gray-50/80 p-4 sm:p-5">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
          Prototype preview
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setEmptyPreview(true);
              setShowNewStamp(false);
            }}
            className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy"
          >
            Empty Passport
          </button>
          <button
            type="button"
            onClick={() => {
              setEmptyPreview(false);
              setShowNewStamp(false);
            }}
            className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy"
          >
            Demo stamps for stage
          </button>
          <button
            type="button"
            onClick={() => {
              setEmptyPreview(true);
              setShowNewStamp(true);
            }}
            className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy"
          >
            New stamp notice
          </button>
          {(
            [
              "medical-student",
              "intern",
              "advanced-training",
              "resident",
              "fellow",
              "medical-practice",
            ] as const
          ).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                completeOnboarding({
                  trainingStage: id,
                  field: id === "advanced-training" ? "nursing" : "medicine",
                  specialty:
                    id === "advanced-training"
                      ? "Adult Critical Care Nursing"
                      : id === "resident"
                        ? "Emergency Medicine"
                        : id === "fellow" || id === "medical-practice"
                          ? "Cardiology"
                          : "",
                  professionalLevel:
                    id === "medical-practice" ? "consultant" : null,
                  identityVerified: true,
                  onboardingComplete: true,
                  fullName: profile.fullName || "Amina Hassan",
                });
                setEmptyPreview(false);
                setShowNewStamp(false);
              }}
              className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy"
            >
              {id}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
