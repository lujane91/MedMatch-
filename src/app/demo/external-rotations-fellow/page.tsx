"use client";

import { useEffect, useState } from "react";
import { JourneyDashboard } from "@/components/dashboard/JourneyDashboard";
import { DEMO_JOURNEY_PERSONAS } from "@/data/journey-dashboard";
import type { InternProfile } from "@/data/intern";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

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
 * DEMO-only direct entry to Fellow External Rotations for Preview testing.
 * Bootstraps an Intern persona + active subscription, then opens Training.
 * Does not weaken production authentication for normal routes.
 */
export default function DemoExternalRotationsFellowPage() {
  const { hydrated: internHydrated, completeOnboarding } = useInternStore();
  const { hydrated: subHydrated, completePaymentSuccess } =
    useSubscriptionStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!internHydrated || !subHydrated) return;
    const intern =
      DEMO_JOURNEY_PERSONAS.find((p) => p.id === "fellow")?.profile || {
        fullName: "Lina Al Rashid",
        firstName: "Omar",
        middleName: "Al",
        lastName: "Qahtani",
        trainingStage: "fellow" as const,
        field: "medicine" as const,
        university: "King Saud University",
        currentYear: "1",
        totalYears: "1",
        email: "fellow.external.demo@medjourney.app",
        mobile: "0500000000",
        institutionEmail: "fellow.external@demo.medjourney.app",
      };

    completeOnboarding({
      ...clearedJourneyFields,
      ...intern,
      email: intern.email || "fellow.external.demo@medjourney.app",
      mobile: intern.mobile || "0500000000",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    });
    completePaymentSuccess("mada");
    queueMicrotask(() => setReady(true));
  }, [
    completeOnboarding,
    completePaymentSuccess,
    internHydrated,
    subHydrated,
  ]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4">
        <p className="text-sm text-mm-text-muted">
          Opening Fellow External Rotations demo…
        </p>
      </div>
    );
  }

  return <JourneyDashboard focus="training" />;
}
