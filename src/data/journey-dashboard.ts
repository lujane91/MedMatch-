/**
 * Shared MedJourney user dashboard config and prototype demo content.
 * Stage differences are driven by this config; UI stays one skeleton.
 */

import type {
  HealthcareField,
  InternProfile,
  ProfessionalLevel,
  TrainingStage,
} from "@/data/intern";
import {
  fieldLabel,
  formatTrainingYearProgress,
  professionalLevelLabel,
  trainingStageLabel,
} from "@/data/intern";

export type JourneyNavId =
  | "journey"
  | "training"
  | "research"
  | "courses"
  | "conferences"
  | "career";

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  href?: string;
};

export type JourneyFact = {
  label: string;
  value: string;
};

export type TrainingStat = {
  label: string;
  value: string;
};

export type TrainingHighlight = {
  title: string;
  detail: string;
  meta?: string;
};

export type StampKind = "training" | "milestone";

export type PassportStamp = {
  id: string;
  title: string;
  kind: StampKind;
  earnedLabel: string;
  demo: true;
};

export type SectionCounts = {
  label: string;
  value: string;
};

export type StageDashboardConfig = {
  stage: TrainingStage;
  showTraining: boolean;
  trainingTitle: string | null;
  careerLocked: boolean;
  trainingStats: TrainingStat[];
  trainingHighlights: TrainingHighlight[];
  attention: AttentionItem[];
  research: SectionCounts[];
  conferences: SectionCounts[];
  career: SectionCounts[];
  latestStamp: PassportStamp | null;
  stamps: PassportStamp[];
};

function yearProgressPercent(current: string, total: string) {
  const c = Number(current);
  const t = Number(total);
  if (!Number.isFinite(c) || !Number.isFinite(t) || t <= 0) return null;
  return Math.max(0, Math.min(100, Math.round((c / t) * 100)));
}

export function resolveStage(stage: TrainingStage | null): TrainingStage {
  if (
    stage === "medical-student" ||
    stage === "intern" ||
    stage === "advanced-training" ||
    stage === "resident" ||
    stage === "fellow" ||
    stage === "medical-practice"
  ) {
    return stage;
  }
  if (stage === "residency") return "resident";
  if (stage === "fellowship") return "fellow";
  return "intern";
}

export function getJourneyNavItems(stage: TrainingStage | null) {
  const resolved = resolveStage(stage);
  const items: { id: JourneyNavId; href: string; label: string }[] = [
    { id: "journey", href: "/dashboard", label: "Journey" },
  ];
  if (resolved !== "medical-practice") {
    items.push({ id: "training", href: "/training", label: "Training" });
  }
  items.push(
    { id: "research", href: "/research", label: "Research" },
    { id: "courses", href: "/courses", label: "Courses" },
    { id: "conferences", href: "/conferences", label: "Conferences" },
    { id: "career", href: "/career", label: "Career" },
  );
  return items;
}

export function getInstitution(profile: InternProfile) {
  const institution =
    profile.trainingInstitution?.trim() || profile.university?.trim() || "";
  return institution;
}

export function getMyJourneyFacts(profile: InternProfile): JourneyFact[] {
  const stage = resolveStage(profile.trainingStage);
  const facts: JourneyFact[] = [];
  const field = fieldLabel(profile.field);
  const institution = getInstitution(profile);
  const year = formatTrainingYearProgress(
    profile.currentYear,
    profile.totalYears,
  );
  const specialty = profile.specialty?.trim() || "";
  const subspecialty = profile.subspecialty?.trim() || "";
  const level = professionalLevelLabel(profile.professionalLevel);

  if (stage === "medical-student") {
    if (profile.field) facts.push({ label: "Healthcare Field", value: field });
    if (institution)
      facts.push({ label: "Current University", value: institution });
    if (year) facts.push({ label: "Current Academic Year", value: year });
    return facts;
  }

  if (stage === "intern") {
    if (institution) facts.push({ label: "University", value: institution });
    if (profile.field) facts.push({ label: "Healthcare Field", value: field });
    if (year) facts.push({ label: "Internship Year", value: year });
    return facts;
  }

  if (stage === "advanced-training") {
    if (specialty)
      facts.push({ label: "Current Training Program", value: specialty });
    if (year) facts.push({ label: "Current Year", value: year });
    if (profile.totalYears?.trim()) {
      facts.push({
        label: "Program Duration",
        value: `${profile.totalYears.trim()} years`,
      });
    }
    if (institution)
      facts.push({ label: "Institution", value: institution });
    return facts;
  }

  if (stage === "resident") {
    if (specialty)
      facts.push({ label: "Residency Specialty", value: specialty });
    if (institution)
      facts.push({ label: "Hospital or Training Institution", value: institution });
    if (year) facts.push({ label: "Current Residency Year", value: year });
    return facts;
  }

  if (stage === "fellow") {
    if (specialty) facts.push({ label: "Specialty", value: specialty });
    if (subspecialty)
      facts.push({ label: "Subspecialty", value: subspecialty });
    if (institution)
      facts.push({ label: "Hospital or Training Institution", value: institution });
    if (year) facts.push({ label: "Current Fellowship Year", value: year });
    return facts;
  }

  // Medical Practice
  if (profile.field) facts.push({ label: "Healthcare Field", value: field });
  if (level) facts.push({ label: "Professional Level", value: level });
  if (specialty) facts.push({ label: "Specialty", value: specialty });
  if (subspecialty) facts.push({ label: "Subspecialty", value: subspecialty });
  if (institution)
    facts.push({ label: "Current Institution", value: institution });
  return facts;
}

export function getJourneyProgress(profile: InternProfile) {
  const percent = yearProgressPercent(profile.currentYear, profile.totalYears);
  const yearLabel = formatTrainingYearProgress(
    profile.currentYear,
    profile.totalYears,
  );
  return { percent, yearLabel };
}

export function buildStageDashboard(
  profile: InternProfile,
): StageDashboardConfig {
  const stage = resolveStage(profile.trainingStage);
  const specialty = profile.specialty?.trim() || "";
  const institution = getInstitution(profile);
  const year = formatTrainingYearProgress(
    profile.currentYear,
    profile.totalYears,
  );

  const sharedResearch: SectionCounts[] = [
    { label: "Recommended Research", value: "3" },
    { label: "My Research", value: "1" },
    { label: "Collaboration Requests", value: "2" },
  ];
  const sharedConferences: SectionCounts[] = [
    { label: "Upcoming Conferences", value: "4" },
    { label: "Recommended For You", value: "2" },
    { label: "Saved Conferences", value: "1" },
  ];
  const sharedCareer: SectionCounts[] = [
    { label: "Recommended Opportunities", value: "5" },
    { label: "Saved Opportunities", value: "2" },
  ];

  if (stage === "medical-student") {
    return {
      stage,
      showTraining: true,
      trainingTitle: "Summer Electives",
      careerLocked: true,
      trainingStats: [
        { label: "Available Electives", value: "12" },
        { label: "My Applications", value: "3" },
        { label: "Accepted", value: "1" },
        { label: "Completed", value: "2" },
      ],
      trainingHighlights: [
        {
          title: "Pediatrics Elective",
          detail: "King Fahad Medical City",
          meta: "Starts 15 Jun 2026",
        },
      ],
      attention: [
        {
          id: "elective-app",
          title: "Complete an application",
          detail: "Your Emergency Medicine elective draft is missing documents.",
          href: "/training",
        },
        {
          id: "upcoming-elective",
          title: "Upcoming elective",
          detail: "Pediatrics Elective starts on 15 Jun 2026.",
          href: "/training",
        },
      ],
      research: sharedResearch,
      conferences: sharedConferences,
      career: [
        { label: "Recommended Opportunities", value: "3" },
        { label: "Saved Opportunities", value: "1" },
      ],
      latestStamp: {
        id: "ms-stamp-1",
        title: "Summer Elective completed",
        kind: "training",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      stamps: [
        {
          id: "ms-stamp-1",
          title: "Summer Elective completed",
          kind: "training",
          earnedLabel: "Demo stamp",
          demo: true,
        },
      ],
    };
  }

  if (stage === "intern") {
    return {
      stage,
      showTraining: true,
      trainingTitle: "Internship Year",
      careerLocked: false,
      trainingStats: [
        { label: "Applications", value: "4" },
        { label: "Accepted Rotations", value: "3" },
        { label: "Completed Rotations", value: "5" },
        { label: "Open Opportunities", value: "60+" },
      ],
      trainingHighlights: [
        {
          title: "Current Rotation",
          detail: "Internal Medicine",
          meta: "King Saud University Medical City",
        },
        {
          title: "Next Rotation",
          detail: "Emergency Medicine",
          meta: "Starts 1 Oct 2026",
        },
      ],
      attention: [
        {
          id: "missing-eval",
          title: "Missing evaluation",
          detail: "Submit your Pediatrics rotation evaluation.",
          href: "/training",
        },
        {
          id: "next-rotation",
          title: "Upcoming rotation",
          detail: "Emergency Medicine begins on 1 Oct 2026.",
          href: "/training",
        },
      ],
      research: sharedResearch,
      conferences: sharedConferences,
      career: sharedCareer,
      latestStamp: {
        id: "in-stamp-1",
        title: "Internship Rotation completed",
        kind: "training",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      stamps: [
        {
          id: "in-stamp-1",
          title: "Internship Rotation completed",
          kind: "training",
          earnedLabel: "Demo stamp",
          demo: true,
        },
      ],
    };
  }

  if (stage === "advanced-training") {
    const program = specialty || "Advanced Training Program";
    return {
      stage,
      showTraining: true,
      trainingTitle: "Advanced Training",
      careerLocked: false,
      trainingStats: [
        { label: "Applications", value: "2" },
        { label: "Completed Training", value: "1" },
      ],
      trainingHighlights: [
        {
          title: "Current Training Program",
          detail: program,
          meta: [year, institution].filter(Boolean).join(" · ") || undefined,
        },
      ],
      attention: [
        {
          id: "training-soon",
          title: "Training starting soon",
          detail: `${program} module begins next week.`,
          href: "/training",
        },
        {
          id: "institution-verify",
          title: "Institution verification pending",
          detail: "Your training institution is reviewing your enrollment.",
        },
      ],
      research: sharedResearch,
      conferences: sharedConferences,
      career: sharedCareer,
      latestStamp: {
        id: "at-stamp-1",
        title: "Advanced Training milestone completed",
        kind: "training",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      stamps: [
        {
          id: "at-stamp-1",
          title: "Advanced Training milestone completed",
          kind: "training",
          earnedLabel: "Demo stamp",
          demo: true,
        },
      ],
    };
  }

  if (stage === "resident") {
    return {
      stage,
      showTraining: true,
      trainingTitle: "External Rotations",
      careerLocked: false,
      trainingStats: [
        { label: "Required External Rotations", value: "3" },
        { label: "Available External Rotations", value: "8" },
        { label: "Applications", value: "2" },
        { label: "Accepted", value: "1" },
        { label: "Completed", value: "1" },
      ],
      trainingHighlights: [
        {
          title: "Accepted External Rotation",
          detail: "Trauma Surgery",
          meta: "King Faisal Specialist Hospital · Nov 2026",
        },
      ],
      attention: [
        {
          id: "external-required",
          title: "Complete an application",
          detail: "One required external rotation still needs an application.",
          href: "/training",
        },
        {
          id: "decision",
          title: "Application decision received",
          detail: "Trauma Surgery external rotation was accepted.",
          href: "/training",
        },
      ],
      research: sharedResearch,
      conferences: sharedConferences,
      career: [
        { label: "Recommended Opportunities", value: "6" },
        { label: "Saved Opportunities", value: "3" },
      ],
      latestStamp: {
        id: "re-stamp-1",
        title: "Resident External Rotation completed",
        kind: "training",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      stamps: [
        {
          id: "re-stamp-1",
          title: "Resident External Rotation completed",
          kind: "training",
          earnedLabel: "Demo stamp",
          demo: true,
        },
      ],
    };
  }

  if (stage === "fellow") {
    return {
      stage,
      showTraining: true,
      trainingTitle: "External Rotations",
      careerLocked: false,
      trainingStats: [
        { label: "Required External Rotations", value: "2" },
        { label: "Available External Rotations", value: "5" },
        { label: "Applications", value: "1" },
        { label: "Accepted", value: "1" },
        { label: "Completed", value: "0" },
      ],
      trainingHighlights: [
        {
          title: "Accepted External Rotation",
          detail: "Advanced Heart Failure",
          meta: "National Heart Center · Jan 2027",
        },
      ],
      attention: [
        {
          id: "fellow-app",
          title: "Application decision received",
          detail: "Advanced Heart Failure rotation was accepted.",
          href: "/training",
        },
      ],
      research: [
        { label: "Recommended Research", value: "4" },
        { label: "My Research", value: "2" },
        { label: "Collaboration Requests", value: "3" },
      ],
      conferences: sharedConferences,
      career: [
        { label: "Recommended Opportunities", value: "7" },
        { label: "Saved Opportunities", value: "4" },
      ],
      latestStamp: {
        id: "fe-stamp-1",
        title: "Fellow External Rotation completed",
        kind: "training",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      stamps: [
        {
          id: "fe-stamp-1",
          title: "Fellow External Rotation completed",
          kind: "training",
          earnedLabel: "Demo stamp",
          demo: true,
        },
      ],
    };
  }

  // Medical Practice
  return {
    stage: "medical-practice",
    showTraining: false,
    trainingTitle: null,
    careerLocked: false,
    trainingStats: [],
    trainingHighlights: [],
    attention: [
      {
        id: "conference-soon",
        title: "Conference starting soon",
        detail: "Saudi Internal Medicine Forum begins in 10 days.",
        href: "/conferences",
      },
      {
        id: "collab",
        title: "Collaboration request",
        detail: "A research team requested your participation.",
        href: "/research",
      },
    ],
    research: [
      { label: "Recommended Research", value: "5" },
      { label: "My Research", value: "2" },
      { label: "Collaboration Requests", value: "3" },
    ],
    conferences: [
      { label: "Upcoming Conferences", value: "6" },
      { label: "Recommended For You", value: "3" },
      { label: "Saved Conferences", value: "2" },
    ],
    career: [
      { label: "Recommended Opportunities", value: "9" },
      { label: "Saved Opportunities", value: "4" },
    ],
    latestStamp: {
      id: "mp-stamp-1",
      title: "Residency Completed",
      kind: "milestone",
      earnedLabel: "Demo stamp",
      demo: true,
    },
    stamps: [
      {
        id: "mp-stamp-1",
        title: "Residency Completed",
        kind: "milestone",
        earnedLabel: "Demo stamp",
        demo: true,
      },
      {
        id: "mp-stamp-2",
        title: "Fellowship Completed",
        kind: "milestone",
        earnedLabel: "Demo stamp",
        demo: true,
      },
    ],
  };
}

/** Demo profiles for validating each Journey Stage dashboard. */
export type DemoJourneyPersona = {
  id: string;
  label: string;
  profile: Partial<InternProfile>;
};

export const DEMO_JOURNEY_PERSONAS: DemoJourneyPersona[] = [
  {
    id: "medical-student",
    label: "Medical Student",
    profile: {
      fullName: "Sara Al Harbi",
      trainingStage: "medical-student",
      field: "medicine" satisfies HealthcareField,
      university: "King Saud University",
      currentYear: "4",
      totalYears: "6",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
  {
    id: "intern",
    label: "Intern",
    profile: {
      fullName: "Omar Al Qahtani",
      trainingStage: "intern",
      field: "medicine",
      university: "King Abdulaziz University",
      currentYear: "1",
      totalYears: "1",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
  {
    id: "advanced-training",
    label: "Advanced Training",
    profile: {
      fullName: "Noura Al Subaie",
      trainingStage: "advanced-training",
      field: "nursing",
      specialty: "Adult Critical Care Nursing",
      trainingInstitution: "King Fahad Medical City",
      currentYear: "2",
      totalYears: "2",
      trainingProgramKind: "advanced-training",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
  {
    id: "resident",
    label: "Resident",
    profile: {
      fullName: "Faisal Al Mutairi",
      trainingStage: "resident",
      field: "medicine",
      specialty: "Emergency Medicine",
      trainingInstitution: "King Saud Medical City",
      currentYear: "3",
      totalYears: "5",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
  {
    id: "fellow",
    label: "Fellow",
    profile: {
      fullName: "Lina Al Rashid",
      trainingStage: "fellow",
      field: "medicine",
      specialty: "Cardiology",
      trainingInstitution: "King Faisal Specialist Hospital and Research Centre Riyadh",
      currentYear: "2",
      totalYears: "3",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
  {
    id: "medical-practice",
    label: "Medical Practice",
    profile: {
      fullName: "Dr. Amina Hassan",
      trainingStage: "medical-practice",
      field: "medicine",
      professionalLevel: "consultant" satisfies ProfessionalLevel,
      specialty: "Internal Medicine",
      subspecialty: "Cardiology",
      trainingInstitution: "King Fahad Medical City",
      identityVerified: true,
      onboardingComplete: true,
      photoUploaded: true,
    },
  },
];

export function stageHeadline(stage: TrainingStage | null) {
  return trainingStageLabel(resolveStage(stage)) || "Journey";
}
