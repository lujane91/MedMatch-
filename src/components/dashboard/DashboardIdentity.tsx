"use client";

import Link from "next/link";
import { BadgeCheck } from "@/components/ui/icons";
import {
  fieldLabel,
  trainingStageLabel,
} from "@/data/intern";
import { getInstitution } from "@/data/journey-dashboard";
import { useInternStore } from "@/lib/intern-store";

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "MJ"
  );
}

export function DashboardIdentity() {
  const { profile } = useInternStore();
  const name = profile.fullName.trim() || "MedJourney Member";
  const field = fieldLabel(profile.field);
  const stage = trainingStageLabel(profile.trainingStage);
  const institution = getInstitution(profile);
  const specialty = profile.specialty?.trim() || "";
  const verified = profile.identityVerified;

  return (
    <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.15rem] bg-mm-navy text-[1.125rem] font-semibold text-white sm:h-[4.5rem] sm:w-[4.5rem] sm:text-[1.25rem]">
          {initialsFromName(name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {verified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700">
                <BadgeCheck size={12} strokeWidth={2} />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-mm-gray-100 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
                Verification pending
              </span>
            )}
          </div>
          <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-[clamp(1.5rem,4vw,2rem)] leading-[1.15] tracking-[-0.02em] text-mm-navy">
            {name}
          </h1>
          <div className="mt-2 space-y-0.5 text-[0.9375rem] text-mm-text-secondary">
            {profile.field ? <p>{field}</p> : null}
            {stage ? <p>{stage}</p> : null}
            {specialty ? <p>{specialty}</p> : null}
            {institution ? <p>{institution}</p> : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/passport"
              className="inline-flex min-h-10 items-center text-[0.875rem] font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
            >
              My MedJourney Passport
            </Link>
            <Link
              href="/profile"
              className="inline-flex min-h-10 items-center text-[0.875rem] font-semibold text-mm-text-secondary transition-colors hover:text-mm-navy"
            >
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
