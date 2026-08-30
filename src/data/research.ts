import type { HealthcareField, TrainingStage } from "@/data/intern";
import {
  fieldLabel,
  healthcareFields,
  trainingStageLabel,
} from "@/data/intern";
import { SAUDI_CITIES } from "@/data/saudi-hospitals";

export type ResearchType =
  | "Clinical Study"
  | "Observational Study"
  | "Survey Research"
  | "Quality Improvement"
  | "Literature Review"
  | "Case Series"
  | "Retrospective Chart Review"
  | "Other";

export type ParticipationType = "In Person" | "Remote" | "Hybrid";

export type ResearchStatus = "Proposed" | "Active" | "Completed";

export type JoinRequestStatus = "Pending" | "Accepted" | "Declined";

export type InviteStatus = "Pending" | "Accepted" | "Declined";

export type JourneyStageLabel =
  | "Medical Student"
  | "Intern"
  | "Advanced Training"
  | "Resident"
  | "Fellow"
  | "Medical Practice";

export type HealthcareFieldLabel =
  | "Medicine"
  | "Dentistry"
  | "Pharmacy"
  | "Nursing"
  | "Allied Health"
  | "Other Healthcare Specialties";

export type ResearchWhoCanJoin =
  | JourneyStageLabel
  | "Pharmacy"
  | "Nursing"
  | "Dentistry"
  | "Biostatistics"
  | "Allied Health";

export type ResearchProject = {
  id: string;
  title: string;
  idea: string;
  healthcareFields: HealthcareFieldLabel[];
  specialties: string[];
  researchType: ResearchType;
  institution?: string;
  location: string;
  participationType: ParticipationType;
  participantsNeeded: number;
  whoCanJoin: ResearchWhoCanJoin[];
  preferredStages: JourneyStageLabel[];
  optionalRequirements?: string;
  status: ResearchStatus;
  creatorUserId: string;
  creatorName: string;
  creatorField: HealthcareFieldLabel;
  creatorStage: JourneyStageLabel;
  creatorSpecialty?: string;
  creatorInstitution?: string;
  createdAt: string;
};

export type ResearchJoinRequest = {
  id: string;
  researchId: string;
  requesterUserId: string;
  requesterName: string;
  requesterPhoto?: string;
  healthcareField: HealthcareFieldLabel;
  journeyStage: JourneyStageLabel;
  specialty?: string;
  institution?: string;
  message?: string;
  status: JoinRequestStatus;
  createdAt: string;
};

export type ResearchInvite = {
  id: string;
  researchId: string;
  inviteeUserId: string;
  inviteeName: string;
  inviteeField: HealthcareFieldLabel;
  inviteeStage: JourneyStageLabel;
  inviteeSpecialty?: string;
  status: InviteStatus;
  createdAt: string;
};

export type DemoMedJourneyUser = {
  id: string;
  name: string;
  healthcareField: HealthcareFieldLabel;
  journeyStage: JourneyStageLabel;
  specialty?: string;
  institution?: string;
  location: string;
  photoInitials: string;
};

export const RESEARCH_TYPES: ResearchType[] = [
  "Clinical Study",
  "Observational Study",
  "Survey Research",
  "Quality Improvement",
  "Literature Review",
  "Case Series",
  "Retrospective Chart Review",
  "Other",
];

export const PARTICIPATION_TYPES: ParticipationType[] = [
  "In Person",
  "Remote",
  "Hybrid",
];

export const JOURNEY_STAGE_LABELS: JourneyStageLabel[] = [
  "Medical Student",
  "Intern",
  "Advanced Training",
  "Resident",
  "Fellow",
  "Medical Practice",
];

export const WHO_CAN_JOIN_OPTIONS: ResearchWhoCanJoin[] = [
  "Medical Student",
  "Intern",
  "Advanced Training",
  "Resident",
  "Fellow",
  "Medical Practice",
  "Pharmacy",
  "Nursing",
  "Dentistry",
  "Biostatistics",
  "Allied Health",
];

export const HEALTHCARE_FIELD_LABELS: HealthcareFieldLabel[] =
  healthcareFields.map((f) => f.title as HealthcareFieldLabel);

export const RESEARCH_LOCATIONS = [...SAUDI_CITIES, "Remote", "Multiple Cities"];

export function toFieldLabel(
  field: HealthcareField | null | undefined,
): HealthcareFieldLabel {
  return (fieldLabel(field ?? null) || "Medicine") as HealthcareFieldLabel;
}

export function toStageLabel(
  stage: TrainingStage | null | undefined,
): JourneyStageLabel {
  return (trainingStageLabel(stage) || "Intern") as JourneyStageLabel;
}

export const DEMO_MEDJOURNEY_USERS: DemoMedJourneyUser[] = [
  {
    id: "demo-user-sara",
    name: "Sara Al Harbi",
    healthcareField: "Medicine",
    journeyStage: "Medical Student",
    specialty: "General Medicine",
    institution: "King Saud University",
    location: "Riyadh",
    photoInitials: "SH",
  },
  {
    id: "demo-user-omar",
    name: "Omar Al Qahtani",
    healthcareField: "Medicine",
    journeyStage: "Resident",
    specialty: "Internal Medicine",
    institution: "King Faisal Specialist Hospital and Research Centre",
    location: "Riyadh",
    photoInitials: "OQ",
  },
  {
    id: "demo-user-layla",
    name: "Layla Al Mutairi",
    healthcareField: "Pharmacy",
    journeyStage: "Advanced Training",
    specialty: "Clinical Pharmacy",
    institution: "King Abdulaziz Medical City",
    location: "Jeddah",
    photoInitials: "LM",
  },
  {
    id: "demo-user-noura",
    name: "Noura Al Dosari",
    healthcareField: "Nursing",
    journeyStage: "Advanced Training",
    specialty: "Critical Care Nursing",
    institution: "King Fahad Medical City",
    location: "Riyadh",
    photoInitials: "ND",
  },
  {
    id: "demo-user-faisal",
    name: "Faisal Al Otaibi",
    healthcareField: "Medicine",
    journeyStage: "Fellow",
    specialty: "Cardiology",
    institution: "King Faisal Specialist Hospital and Research Centre",
    location: "Riyadh",
    photoInitials: "FO",
  },
  {
    id: "demo-user-hind",
    name: "Hind Al Shehri",
    healthcareField: "Allied Health",
    journeyStage: "Advanced Training",
    specialty: "Biostatistics",
    institution: "King Saud University Medical City",
    location: "Riyadh",
    photoInitials: "HS",
  },
  {
    id: "demo-user-khalid",
    name: "Khalid Al Harthi",
    healthcareField: "Medicine",
    journeyStage: "Intern",
    specialty: "General Medicine",
    institution: "King Abdulaziz University Hospital",
    location: "Jeddah",
    photoInitials: "KH",
  },
  {
    id: "demo-user-maha",
    name: "Maha Al Zahrani",
    healthcareField: "Medicine",
    journeyStage: "Medical Practice",
    specialty: "Emergency Medicine",
    institution: "Ministry of Health",
    location: "Dammam",
    photoInitials: "MZ",
  },
];

export const SEED_RESEARCH_PROJECTS: ResearchProject[] = [
  {
    id: "research-1",
    title: "Outcomes of Early Sepsis Recognition in Emergency Departments",
    idea: "A multicenter observational study on early sepsis recognition pathways and patient outcomes across Saudi emergency departments.",
    healthcareFields: ["Medicine", "Nursing"],
    specialties: ["Emergency Medicine", "Critical Care Nursing"],
    researchType: "Observational Study",
    institution: "King Faisal Specialist Hospital and Research Centre",
    location: "Riyadh",
    participationType: "Hybrid",
    participantsNeeded: 8,
    whoCanJoin: ["Medical Student", "Intern", "Resident", "Nursing"],
    preferredStages: ["Intern", "Resident"],
    optionalRequirements:
      "Interest in emergency care and data collection experience preferred.",
    status: "Proposed",
    creatorUserId: "demo-user-maha",
    creatorName: "Maha Al Zahrani",
    creatorField: "Medicine",
    creatorStage: "Medical Practice",
    creatorSpecialty: "Emergency Medicine",
    creatorInstitution: "Ministry of Health",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "research-2",
    title: "Medication Safety Handoffs in Internal Medicine Wards",
    idea: "Quality improvement research examining medication reconciliation handoffs between residents and clinical pharmacists.",
    healthcareFields: ["Medicine", "Pharmacy"],
    specialties: ["Internal Medicine", "Clinical Pharmacy"],
    researchType: "Quality Improvement",
    institution: "King Abdulaziz Medical City",
    location: "Jeddah",
    participationType: "In Person",
    participantsNeeded: 6,
    whoCanJoin: ["Resident", "Pharmacy", "Medical Student"],
    preferredStages: ["Resident", "Advanced Training"],
    optionalRequirements: "Availability for ward based observation shifts.",
    status: "Active",
    creatorUserId: "demo-user-omar",
    creatorName: "Omar Al Qahtani",
    creatorField: "Medicine",
    creatorStage: "Resident",
    creatorSpecialty: "Internal Medicine",
    creatorInstitution: "King Faisal Specialist Hospital and Research Centre",
    createdAt: "2026-08-12T09:00:00.000Z",
  },
  {
    id: "research-3",
    title: "Cardiology Imaging Utilization Patterns in Tertiary Care",
    idea: "Retrospective review of echocardiography and CT utilization patterns for suspected coronary disease.",
    healthcareFields: ["Medicine", "Allied Health"],
    specialties: ["Cardiology", "Biostatistics"],
    researchType: "Retrospective Chart Review",
    institution: "King Faisal Specialist Hospital and Research Centre",
    location: "Riyadh",
    participationType: "Remote",
    participantsNeeded: 5,
    whoCanJoin: ["Fellow", "Resident", "Biostatistics", "Allied Health"],
    preferredStages: ["Fellow", "Resident"],
    status: "Proposed",
    creatorUserId: "demo-user-faisal",
    creatorName: "Faisal Al Otaibi",
    creatorField: "Medicine",
    creatorStage: "Fellow",
    creatorSpecialty: "Cardiology",
    creatorInstitution: "King Faisal Specialist Hospital and Research Centre",
    createdAt: "2026-08-22T14:00:00.000Z",
  },
  {
    id: "research-4",
    title: "Student Led Health Education Impact in Primary Care Clinics",
    idea: "Survey based evaluation of medical student led patient education sessions in primary care settings.",
    healthcareFields: ["Medicine"],
    specialties: ["Family Medicine", "General Medicine"],
    researchType: "Survey Research",
    institution: "King Saud University",
    location: "Riyadh",
    participationType: "Hybrid",
    participantsNeeded: 10,
    whoCanJoin: ["Medical Student", "Intern"],
    preferredStages: ["Medical Student", "Intern"],
    status: "Completed",
    creatorUserId: "demo-user-sara",
    creatorName: "Sara Al Harbi",
    creatorField: "Medicine",
    creatorStage: "Medical Student",
    creatorSpecialty: "General Medicine",
    creatorInstitution: "King Saud University",
    createdAt: "2026-06-01T08:00:00.000Z",
  },
];

export const SEED_RESEARCH_REQUESTS: ResearchJoinRequest[] = [
  {
    id: "req-1",
    researchId: "research-2",
    requesterUserId: "demo-user-layla",
    requesterName: "Layla Al Mutairi",
    healthcareField: "Pharmacy",
    journeyStage: "Advanced Training",
    specialty: "Clinical Pharmacy",
    institution: "King Abdulaziz Medical City",
    message:
      "I work closely with ward teams on medication safety and would like to contribute.",
    status: "Pending",
    createdAt: "2026-08-25T11:00:00.000Z",
  },
];

export const SEED_RESEARCH_INVITES: ResearchInvite[] = [];

/** Future Passport stamp types for verified research accomplishments. */
export const RESEARCH_PASSPORT_STAMP_TYPES = [
  "Research Participation",
  "Research Project Completed",
  "Published Research",
  "Poster Presentation",
  "Research Presentation",
] as const;

export type ResearchPassportStampType =
  (typeof RESEARCH_PASSPORT_STAMP_TYPES)[number];

export type ResearchAccomplishmentRecord = {
  id: string;
  researchId: string;
  userId: string;
  stampType: ResearchPassportStampType;
  verified: boolean;
  completedAt: string;
  title: string;
};

export function createResearchId() {
  return `research-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createRequestId() {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function createInviteId() {
  return `inv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function researchCurrentUserId(profile: {
  email?: string;
  fullName?: string;
}) {
  return (
    profile.email?.trim() ||
    `user-${(profile.fullName || "current")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")}` ||
    "current-user"
  );
}

export function researchMatchesProfile(
  project: ResearchProject,
  field: HealthcareFieldLabel | null,
  specialty: string | null,
  stage: JourneyStageLabel | null,
) {
  let score = 0;
  if (field && project.healthcareFields.includes(field)) score += 3;
  if (
    specialty &&
    project.specialties.some(
      (s) => s.toLowerCase() === specialty.toLowerCase(),
    )
  ) {
    score += 3;
  }
  if (stage && project.preferredStages.includes(stage)) score += 2;
  if (stage && project.whoCanJoin.includes(stage)) score += 1;
  return score;
}
