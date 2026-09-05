"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { InternOnboardingShell } from "@/components/intern/InternOnboardingShell";

export default function ComingSoonPathwayPage() {
  const params = useParams<{ pathway: string }>();
  const pathway = params.pathway === "fellowship" ? "Fellowship" : "Residency";

  return (
    <InternOnboardingShell
      stepId="coming-soon"
      title={`${pathway} planning is coming soon to MedJourney.`}
      subtitle="You can continue exploring the Intern pathway today while we prepare dedicated residency and fellowship tools."
      backHref="/create-account"
      footer={
        <Link
          href="/create-account"
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-6 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
        >
          Back to Complete Your Account
        </Link>
      }
    >
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6">
        <p className="text-[0.9375rem] leading-relaxed text-mm-text-secondary">
          {pathway} workflows—including multi-year planning and specialty
          matching—will be available in a future release. For this prototype,
          only the Intern pathway is fully built.
        </p>
      </div>
    </InternOnboardingShell>
  );
}
