"use client";

import { DEMO_JOURNEY_PERSONAS } from "@/data/journey-dashboard";
import type { InternProfile } from "@/data/intern";
import { useInternStore } from "@/lib/intern-store";

const clearedJourneyFields: Partial<InternProfile> = {
  university: "",
  trainingInstitution: "",
  specialty: "",
  subspecialty: "",
  currentYear: "",
  totalYears: "",
  professionalLevel: null,
  trainingProgramKind: null,
  residencyYear: "",
  fellowshipYear: "",
};

/**
 * Prototype only: quickly preview each Journey Stage dashboard
 * without re-running onboarding.
 */
export function DemoPersonaSwitcher() {
  const { completeOnboarding } = useInternStore();

  function applyPersona(patch: Partial<InternProfile>) {
    completeOnboarding({
      ...clearedJourneyFields,
      ...patch,
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    });
  }

  return (
    <section className="rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-gray-50/80 p-4 sm:p-5">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
        Prototype preview
      </p>
      <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
        Switch Journey Stage to review each dashboard layout.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {DEMO_JOURNEY_PERSONAS.map((persona) => (
          <button
            key={persona.id}
            type="button"
            onClick={() => applyPersona(persona.profile)}
            className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy transition-colors hover:border-mm-teal/40 hover:bg-mm-teal-50"
          >
            {persona.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() =>
            applyPersona({
              fullName: "Dr. Amina Hassan",
              trainingStage: "medical-practice",
              field: "medicine",
              professionalLevel: "consultant",
              specialty: "Internal Medicine",
              subspecialty: "",
              trainingInstitution: "King Fahad Medical City",
            })
          }
          className="rounded-full border border-mm-border bg-mm-white px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy transition-colors hover:border-mm-teal/40 hover:bg-mm-teal-50"
        >
          Practice no subspecialty
        </button>
      </div>
    </section>
  );
}
