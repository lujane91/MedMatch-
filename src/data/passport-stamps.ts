/**
 * MedJourney Passport stamp / accomplishment model.
 * One lifelong passport; stamps accumulate across journey stages.
 * Users cannot self-award verified stamps.
 */

import type { InternProfile, TrainingStage } from "@/data/intern";
import { resolveStage } from "@/data/journey-dashboard";

export type StampCategory =
  | "training"
  | "research"
  | "conference"
  | "milestone";

export type StampVerificationStatus = "Verified" | "Pending";

export type PassportStampRecord = {
  id: string;
  stampType: string;
  title: string;
  category: StampCategory;
  date: string;
  institution: string;
  healthcareField: string;
  specialty: string;
  verificationStatus: StampVerificationStatus;
  verifiedBy: string;
  relatedRecordId: string;
  /** Extra detail lines shown only in stamp detail view. */
  detailLines: { label: string; value: string }[];
  /** Journey milestones can render larger. */
  prominent?: boolean;
};

export function categoryLabel(category: StampCategory) {
  switch (category) {
    case "training":
      return "Training";
    case "research":
      return "Research";
    case "conference":
      return "Conferences";
    case "milestone":
      return "Journey Milestone";
  }
}

function stamp(
  partial: Omit<
    PassportStampRecord,
    "verificationStatus" | "detailLines" | "specialty"
  > & {
    specialty?: string;
    detailLines?: PassportStampRecord["detailLines"];
    verificationStatus?: StampVerificationStatus;
  },
): PassportStampRecord {
  return {
    verificationStatus: "Verified",
    detailLines: [],
    specialty: "",
    ...partial,
  };
}

const MEDICAL_STUDENT_STAMPS: PassportStampRecord[] = [
  stamp({
    id: "ms-training-1",
    stampType: "summer-elective-completed",
    title: "Summer Elective Completed",
    category: "training",
    date: "Aug 2025",
    institution: "King Fahad Medical City",
    healthcareField: "Medicine",
    specialty: "Pediatrics",
    verifiedBy: "King Fahad Medical City",
    relatedRecordId: "demo_elective_1",
    detailLines: [
      { label: "Training type", value: "Summer Elective" },
      { label: "Hospital", value: "King Fahad Medical City" },
      { label: "Specialty", value: "Pediatrics" },
      { label: "Dates", value: "1 Jul 2025 to 28 Jul 2025" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "King Fahad Medical City" },
    ],
  }),
  stamp({
    id: "ms-research-1",
    stampType: "research-participation",
    title: "Research Participation",
    category: "research",
    date: "Mar 2025",
    institution: "King Saud University",
    healthcareField: "Medicine",
    verifiedBy: "King Saud University Research Office",
    relatedRecordId: "demo_research_1",
    detailLines: [
      { label: "Research title", value: "Pediatric asthma clinic pathways" },
      { label: "Role", value: "Student collaborator" },
      { label: "Institution", value: "King Saud University" },
      { label: "Date", value: "Mar 2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "ms-conf-1",
    stampType: "conference-attended",
    title: "Conference Attended",
    category: "conference",
    date: "Jan 2025",
    institution: "Saudi Medical Student Forum",
    healthcareField: "Medicine",
    verifiedBy: "Conference Organizer",
    relatedRecordId: "demo_conf_1",
    detailLines: [
      { label: "Conference name", value: "Saudi Medical Student Forum" },
      { label: "Participation type", value: "Attendee" },
      { label: "Date", value: "Jan 2025" },
      { label: "Location", value: "Riyadh" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
];

const INTERN_STAMPS: PassportStampRecord[] = [
  stamp({
    id: "in-mile-1",
    stampType: "medical-school-completed",
    title: "Medical School Completed",
    category: "milestone",
    date: "Jun 2025",
    institution: "King Abdulaziz University",
    healthcareField: "Medicine",
    verifiedBy: "King Abdulaziz University",
    relatedRecordId: "demo_ms_complete",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Medical School Completed" },
      { label: "Institution", value: "King Abdulaziz University" },
      { label: "Completion date", value: "Jun 2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "in-train-1",
    stampType: "internship-rotation-completed",
    title: "Emergency Medicine Rotation",
    category: "training",
    date: "Sep 2025",
    institution: "King Saud University Medical City",
    healthcareField: "Medicine",
    specialty: "Emergency Medicine",
    verifiedBy: "King Saud University Medical City",
    relatedRecordId: "demo_rot_em",
    detailLines: [
      { label: "Training type", value: "Internship Rotation" },
      { label: "Hospital", value: "King Saud University Medical City" },
      { label: "Specialty", value: "Emergency Medicine" },
      { label: "Dates", value: "1 Aug 2025 to 30 Sep 2025" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "King Saud University Medical City" },
    ],
  }),
  stamp({
    id: "in-train-2",
    stampType: "internship-rotation-completed",
    title: "Internal Medicine Rotation",
    category: "training",
    date: "Nov 2025",
    institution: "King Saud University Medical City",
    healthcareField: "Medicine",
    specialty: "Internal Medicine",
    verifiedBy: "King Saud University Medical City",
    relatedRecordId: "demo_rot_im",
    detailLines: [
      { label: "Training type", value: "Internship Rotation" },
      { label: "Hospital", value: "King Saud University Medical City" },
      { label: "Specialty", value: "Internal Medicine" },
      { label: "Dates", value: "1 Oct 2025 to 30 Nov 2025" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "King Saud University Medical City" },
    ],
  }),
  stamp({
    id: "in-research-1",
    stampType: "research-participation",
    title: "Research Participation",
    category: "research",
    date: "Dec 2025",
    institution: "King Saud University",
    healthcareField: "Medicine",
    verifiedBy: "Research Supervisor",
    relatedRecordId: "demo_research_in",
    detailLines: [
      { label: "Research title", value: "ED triage quality improvement" },
      { label: "Role", value: "Co investigator" },
      { label: "Institution", value: "King Saud University" },
      { label: "Date", value: "Dec 2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
];

const RESIDENT_STAMPS: PassportStampRecord[] = [
  stamp({
    id: "re-mile-1",
    stampType: "medical-school-completed",
    title: "Medical School Completed",
    category: "milestone",
    date: "2022",
    institution: "King Saud University",
    healthcareField: "Medicine",
    verifiedBy: "King Saud University",
    relatedRecordId: "demo_ms_re",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Medical School Completed" },
      { label: "Institution", value: "King Saud University" },
      { label: "Completion date", value: "2022" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "re-mile-2",
    stampType: "internship-completed",
    title: "Internship Completed",
    category: "milestone",
    date: "2023",
    institution: "King Fahad Medical City",
    healthcareField: "Medicine",
    verifiedBy: "King Fahad Medical City",
    relatedRecordId: "demo_intern_complete",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Internship Completed" },
      { label: "Institution", value: "King Fahad Medical City" },
      { label: "Completion date", value: "2023" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "re-train-1",
    stampType: "external-rotation-completed",
    title: "External Rotation Completed",
    category: "training",
    date: "Nov 2025",
    institution: "King Faisal Specialist Hospital and Research Centre Riyadh",
    healthcareField: "Medicine",
    specialty: "Trauma Surgery",
    verifiedBy: "Host Hospital",
    relatedRecordId: "demo_ext_re",
    detailLines: [
      { label: "Training type", value: "External Rotation" },
      {
        label: "Hospital",
        value: "King Faisal Specialist Hospital and Research Centre Riyadh",
      },
      { label: "Specialty", value: "Trauma Surgery" },
      { label: "Dates", value: "1 Nov 2025 to 30 Nov 2025" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "Host Hospital" },
    ],
  }),
  stamp({
    id: "re-research-1",
    stampType: "research-project-completed",
    title: "Research Project Completed",
    category: "research",
    date: "2025",
    institution: "King Saud Medical City",
    healthcareField: "Medicine",
    verifiedBy: "Program Director",
    relatedRecordId: "demo_research_re",
    detailLines: [
      { label: "Research title", value: "Emergency airway audit" },
      { label: "Role", value: "Lead investigator" },
      { label: "Institution", value: "King Saud Medical City" },
      { label: "Completion date", value: "2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "re-conf-1",
    stampType: "poster-presentation",
    title: "Poster Presentation",
    category: "conference",
    date: "2025",
    institution: "Saudi Emergency Medicine Conference",
    healthcareField: "Medicine",
    verifiedBy: "Conference Committee",
    relatedRecordId: "demo_conf_re",
    detailLines: [
      { label: "Conference name", value: "Saudi Emergency Medicine Conference" },
      { label: "Participation type", value: "Poster Presentation" },
      { label: "Date", value: "2025" },
      { label: "Location", value: "Jeddah" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
];

const FELLOW_STAMPS: PassportStampRecord[] = [
  ...RESIDENT_STAMPS.filter((s) =>
    ["re-mile-1", "re-mile-2", "re-research-1", "re-conf-1"].includes(s.id),
  ).map((s) => ({ ...s, id: `fe-${s.id}` })),
  stamp({
    id: "fe-mile-3",
    stampType: "residency-completed",
    title: "Residency Completed",
    category: "milestone",
    date: "2025",
    institution: "King Saud Medical City",
    healthcareField: "Medicine",
    specialty: "Internal Medicine",
    verifiedBy: "Residency Program",
    relatedRecordId: "demo_res_complete",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Residency Completed" },
      { label: "Institution", value: "King Saud Medical City" },
      { label: "Completion date", value: "2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "fe-train-1",
    stampType: "external-rotation-completed",
    title: "External Rotation Completed",
    category: "training",
    date: "2026",
    institution: "National Heart Center",
    healthcareField: "Medicine",
    specialty: "Cardiology",
    verifiedBy: "National Heart Center",
    relatedRecordId: "demo_ext_fe",
    detailLines: [
      { label: "Training type", value: "External Rotation" },
      { label: "Hospital", value: "National Heart Center" },
      { label: "Specialty", value: "Cardiology" },
      { label: "Dates", value: "Jan 2026 to Feb 2026" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "National Heart Center" },
    ],
  }),
];

const PRACTICE_STAMPS: PassportStampRecord[] = [
  stamp({
    id: "mp-mile-1",
    stampType: "medical-school-completed",
    title: "Medical School Completed",
    category: "milestone",
    date: "2018",
    institution: "King Saud University",
    healthcareField: "Medicine",
    verifiedBy: "King Saud University",
    relatedRecordId: "demo_mp_ms",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Medical School Completed" },
      { label: "Institution", value: "King Saud University" },
      { label: "Completion date", value: "2018" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "mp-mile-2",
    stampType: "internship-completed",
    title: "Internship Completed",
    category: "milestone",
    date: "2019",
    institution: "King Fahad Medical City",
    healthcareField: "Medicine",
    verifiedBy: "King Fahad Medical City",
    relatedRecordId: "demo_mp_intern",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Internship Completed" },
      { label: "Institution", value: "King Fahad Medical City" },
      { label: "Completion date", value: "2019" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "mp-mile-3",
    stampType: "residency-completed",
    title: "Residency Completed",
    category: "milestone",
    date: "2023",
    institution: "King Fahad Medical City",
    healthcareField: "Medicine",
    specialty: "Internal Medicine",
    verifiedBy: "Residency Program",
    relatedRecordId: "demo_mp_res",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Residency Completed" },
      { label: "Institution", value: "King Fahad Medical City" },
      { label: "Completion date", value: "2023" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "mp-mile-4",
    stampType: "fellowship-completed",
    title: "Fellowship Completed",
    category: "milestone",
    date: "2025",
    institution: "National Heart Center",
    healthcareField: "Medicine",
    specialty: "Cardiology",
    verifiedBy: "Fellowship Program",
    relatedRecordId: "demo_mp_fel",
    prominent: true,
    detailLines: [
      { label: "Milestone", value: "Fellowship Completed" },
      { label: "Institution", value: "National Heart Center" },
      { label: "Completion date", value: "2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "mp-research-1",
    stampType: "published-research",
    title: "Published Research",
    category: "research",
    date: "2025",
    institution: "Saudi Journal of Internal Medicine",
    healthcareField: "Medicine",
    verifiedBy: "Journal Editorial Board",
    relatedRecordId: "demo_mp_pub",
    detailLines: [
      {
        label: "Research title",
        value: "Heart failure pathways in tertiary care",
      },
      { label: "Role", value: "Author" },
      { label: "Institution", value: "Saudi Journal of Internal Medicine" },
      { label: "Publication date", value: "2025" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
  stamp({
    id: "mp-conf-1",
    stampType: "conference-speaker",
    title: "Conference Speaker",
    category: "conference",
    date: "2026",
    institution: "Gulf Cardiology Conference",
    healthcareField: "Medicine",
    verifiedBy: "Conference Organizer",
    relatedRecordId: "demo_mp_conf",
    detailLines: [
      { label: "Conference name", value: "Gulf Cardiology Conference" },
      { label: "Participation type", value: "Speaker" },
      { label: "Date", value: "2026" },
      { label: "Location", value: "Riyadh" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
];

const ADVANCED_TRAINING_STAMPS: PassportStampRecord[] = [
  stamp({
    id: "at-train-1",
    stampType: "advanced-training-completed",
    title: "Advanced Training Completed",
    category: "training",
    date: "2025",
    institution: "King Fahad Medical City",
    healthcareField: "Nursing",
    specialty: "Adult Critical Care Nursing",
    verifiedBy: "Training Institution",
    relatedRecordId: "demo_at_1",
    detailLines: [
      { label: "Training type", value: "Advanced Training" },
      { label: "Hospital", value: "King Fahad Medical City" },
      { label: "Specialty", value: "Adult Critical Care Nursing" },
      { label: "Dates", value: "2024 to 2025" },
      { label: "Completion status", value: "Completed" },
      { label: "Verified by", value: "Training Institution" },
    ],
  }),
  stamp({
    id: "at-conf-1",
    stampType: "conference-attended",
    title: "Conference Attended",
    category: "conference",
    date: "2025",
    institution: "Saudi Critical Care Nursing Forum",
    healthcareField: "Nursing",
    verifiedBy: "Conference Organizer",
    relatedRecordId: "demo_at_conf",
    detailLines: [
      { label: "Conference name", value: "Saudi Critical Care Nursing Forum" },
      { label: "Participation type", value: "Attendee" },
      { label: "Date", value: "2025" },
      { label: "Location", value: "Riyadh" },
      { label: "Verified status", value: "Verified" },
    ],
  }),
];

export function getDemoStampsForStage(
  stage: TrainingStage | null,
): PassportStampRecord[] {
  const resolved = resolveStage(stage);
  switch (resolved) {
    case "medical-student":
      return MEDICAL_STUDENT_STAMPS;
    case "intern":
      return INTERN_STAMPS;
    case "advanced-training":
      return ADVANCED_TRAINING_STAMPS;
    case "resident":
      return RESIDENT_STAMPS;
    case "fellow":
      return FELLOW_STAMPS;
    case "medical-practice":
      return PRACTICE_STAMPS;
    default:
      return [];
  }
}

export function getPassportStamps(
  profile: InternProfile,
  options?: { empty?: boolean },
): PassportStampRecord[] {
  if (options?.empty) return [];
  return getDemoStampsForStage(profile.trainingStage);
}

export function getLatestPassportStamp(
  stamps: PassportStampRecord[],
): PassportStampRecord | null {
  return stamps[0] ?? null;
}
