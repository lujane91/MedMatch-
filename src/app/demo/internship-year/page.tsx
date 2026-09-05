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
 * DEMO-only direct entry to Internship Year for Preview testing.
 * Bootstraps an Intern persona + active subscription, then opens Training.
 * Does not weaken production authentication for normal routes.
 */
export default function DemoInternshipYearPage() {
  const { hydrated: internHydrated, completeOnboarding } = useInternStore();
  const { hydrated: subHydrated, completePaymentSuccess } =
    useSubscriptionStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!internHydrated || !subHydrated) return;
    const intern =
      DEMO_JOURNEY_PERSONAS.find((p) => p.id === "intern")?.profile || {
        fullName: "Omar Al Qahtani",
        firstName: "Omar",
        middleName: "Al",
        lastName: "Qahtani",
        trainingStage: "intern" as const,
        field: "medicine" as const,
        university: "King Saud University",
        currentYear: "1",
        totalYears: "1",
        email: "omar.intern.demo@medjourney.app",
        mobile: "0500000000",
        institutionEmail: "omar.intern@ksu.edu.sa",
      };

    completeOnboarding({
      ...clearedJourneyFields,
      ...intern,
      email: intern.email || "omar.intern.demo@medjourney.app",
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
          Opening Internship Year demo…
        </p>
      </div>
    );
  }

  return <JourneyDashboard focus="training" />;
}
