/**
 * Shared MedJourney training opportunity catalog.
 * One system across Journey Stages; terminology adapts by stage.
 * Compatible with a future Hospital Admin review workflow.
 */

import type { HealthcareField } from "@/data/intern";
import { SAUDI_HOSPITALS } from "@/data/saudi-hospitals";
import type { TrainingDocumentType } from "@/data/training-documents";
import { SEED_INTERNSHIP_ROTATIONS } from "@/data/internship-rotation-seeds";

export type TrainingApplicationType =
  | "summer-elective"
  | "internship-rotation"
  | "advanced-training"
  | "external-rotation";

export type TrainingFee =
  | { kind: "none" }
  | { kind: "fee"; amountSar: number };

export type TrainingRequirement = {
  id: string;
  documentType: TrainingDocumentType;
  required: boolean;
  label: string;
};

export type TrainingOpportunityStatus = "Open" | "Closed";

export type TrainingOpportunity = {
  id: string;
  trainingType: TrainingApplicationType;
  hospital: string;
  city: string;
  healthcareField: HealthcareField;
  specialty: string;
  subspecialty: string;
  month: string;
  startDate: string;
  endDate: string;
  /** When false, applicant may choose preferred month/dates within apply flow. */
  datesFixed: boolean;
  availableSpots: number;
  applicationDeadline: string;
  /** MedJourney platform fee charged on submit. Always separate from hospital fee. */
  medjourneyApplicationFeeSar: number;
  hospitalFee: TrainingFee;
  requirements: TrainingRequirement[];
  description: string;
  status: TrainingOpportunityStatus;
};

export const MEDJOURNEY_APPLICATION_FEE_SAR = 100;

export const TRAINING_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function req(
  id: string,
  documentType: TrainingDocumentType,
  required: boolean,
  label: string,
): TrainingRequirement {
  return { id, documentType, required, label };
}

function hospitalCity(name: string) {
  return SAUDI_HOSPITALS.find((h) => h.name === name)?.city || "Riyadh";
}

/** Default document requirements for Medical Student summer elective applications. */
export const SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS: TrainingRequirement[] = [
  req("r1", "cv", true, "CV"),
  req("r2", "university-letter", true, "University Letter"),
  req("r3", "academic-transcript", true, "Academic Transcript"),
  req("r4", "vaccination-record", true, "Vaccination Record"),
  req("r5", "national-id", true, "National ID or Iqama"),
  req("r6", "recommendation-letter", false, "Recommendation Letter"),
];

export function monthNameFromIsoDate(iso: string) {
  const monthIndex = Number(iso.slice(5, 7)) - 1;
  if (monthIndex < 0 || monthIndex > 11) return "";
  return TRAINING_MONTHS[monthIndex];
}

export function hospitalsForCity(city: string) {
  if (!city.trim()) {
    return SAUDI_HOSPITALS.map((item) => item.name);
  }
  return SAUDI_HOSPITALS.filter((item) => item.city === city).map(
    (item) => item.name,
  );
}

const KFSHRC =
  "King Faisal Specialist Hospital and Research Centre Riyadh";
const KSUMC = "King Saud University Medical City";
const KFMC = "King Fahad Medical City";
const KAMC_JEDDAH = "King Abdulaziz Medical City Jeddah";
const KAUH = "King Abdulaziz University Hospital";
const NGHA_RIYADH = "King Abdulaziz Medical City Riyadh";
const HMG = "Dr. Sulaiman Al Habib Olaya Medical Complex";

export const SEED_TRAINING_OPPORTUNITIES: TrainingOpportunity[] = [
  // Medical Student — Summer Electives (June / July / August)
  {
    id: "opp-ms-kfshrc-cardio-july",
    trainingType: "summer-elective",
    hospital: KFSHRC,
    city: hospitalCity(KFSHRC),
    healthcareField: "medicine",
    specialty: "Cardiology",
    subspecialty: "",
    month: "July",
    startDate: "2027-07-05",
    endDate: "2027-07-30",
    datesFixed: true,
    availableSpots: 4,
    applicationDeadline: "2027-05-15",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Supervised cardiology summer elective with ward rounds, clinics, and teaching sessions.",
    status: "Open",
  },
  {
    id: "opp-ms-kfmc-peds-june",
    trainingType: "summer-elective",
    hospital: KFMC,
    city: hospitalCity(KFMC),
    healthcareField: "medicine",
    specialty: "Pediatrics",
    subspecialty: "",
    month: "June",
    startDate: "2027-06-01",
    endDate: "2027-06-26",
    datesFixed: true,
    availableSpots: 6,
    applicationDeadline: "2027-04-20",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Pediatrics elective focused on general pediatric wards and outpatient clinics.",
    status: "Open",
  },
  {
    id: "opp-ms-ksumc-em-aug",
    trainingType: "summer-elective",
    hospital: KSUMC,
    city: hospitalCity(KSUMC),
    healthcareField: "medicine",
    specialty: "Emergency Medicine",
    subspecialty: "",
    month: "August",
    startDate: "2027-08-03",
    endDate: "2027-08-28",
    datesFixed: true,
    availableSpots: 3,
    applicationDeadline: "2027-05-30",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Emergency medicine summer elective with supervised ED shifts and teaching.",
    status: "Open",
  },
  {
    id: "opp-ms-kauh-im-july",
    trainingType: "summer-elective",
    hospital: KAUH,
    city: hospitalCity(KAUH),
    healthcareField: "medicine",
    specialty: "Internal Medicine",
    subspecialty: "",
    month: "July",
    startDate: "2027-07-01",
    endDate: "2027-07-25",
    datesFixed: true,
    availableSpots: 5,
    applicationDeadline: "2027-05-01",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Internal medicine elective covering inpatient care and morning teaching.",
    status: "Open",
  },
  {
    id: "opp-ms-ngha-surg-june",
    trainingType: "summer-elective",
    hospital: NGHA_RIYADH,
    city: hospitalCity(NGHA_RIYADH),
    healthcareField: "medicine",
    specialty: "General Surgery",
    subspecialty: "",
    month: "June",
    startDate: "2027-06-07",
    endDate: "2027-06-30",
    datesFixed: true,
    availableSpots: 4,
    applicationDeadline: "2027-04-25",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "General surgery summer elective with OR observation and ward responsibilities.",
    status: "Open",
  },
  {
    id: "opp-ms-hmg-derm-july",
    trainingType: "summer-elective",
    hospital: HMG,
    city: hospitalCity(HMG),
    healthcareField: "medicine",
    specialty: "Dermatology",
    subspecialty: "",
    month: "July",
    startDate: "2027-07-12",
    endDate: "2027-08-06",
    datesFixed: true,
    availableSpots: 2,
    applicationDeadline: "2027-05-10",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Dermatology clinic elective with outpatient case exposure and teaching.",
    status: "Open",
  },
  {
    id: "opp-ms-kamc-jeddah-obgyn-aug",
    trainingType: "summer-elective",
    hospital: KAMC_JEDDAH,
    city: hospitalCity(KAMC_JEDDAH),
    healthcareField: "medicine",
    specialty: "Obstetrics and Gynecology",
    subspecialty: "",
    month: "August",
    startDate: "2027-08-01",
    endDate: "2027-08-27",
    datesFixed: true,
    availableSpots: 3,
    applicationDeadline: "2027-05-20",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Obstetrics and gynecology summer elective across clinics and labor ward.",
    status: "Open",
  },
  {
    id: "opp-ms-kfshrc-neuro-june",
    trainingType: "summer-elective",
    hospital: KFSHRC,
    city: hospitalCity(KFSHRC),
    healthcareField: "medicine",
    specialty: "Neurology",
    subspecialty: "",
    month: "June",
    startDate: "2027-06-14",
    endDate: "2027-07-09",
    datesFixed: true,
    availableSpots: 3,
    applicationDeadline: "2027-04-30",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Neurology elective with inpatient consults and outpatient specialty clinics.",
    status: "Open",
  },
  {
    id: "opp-ms-ksumc-ortho-july",
    trainingType: "summer-elective",
    hospital: KSUMC,
    city: hospitalCity(KSUMC),
    healthcareField: "medicine",
    specialty: "Orthopedic Surgery",
    subspecialty: "",
    month: "July",
    startDate: "2027-07-05",
    endDate: "2027-07-30",
    datesFixed: true,
    availableSpots: 4,
    applicationDeadline: "2027-05-05",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Orthopedic surgery summer elective with clinic and OR observation.",
    status: "Open",
  },
  {
    id: "opp-ms-kfmc-psych-aug",
    trainingType: "summer-elective",
    hospital: KFMC,
    city: hospitalCity(KFMC),
    healthcareField: "medicine",
    specialty: "Psychiatry",
    subspecialty: "",
    month: "August",
    startDate: "2027-08-02",
    endDate: "2027-08-27",
    datesFixed: true,
    availableSpots: 5,
    applicationDeadline: "2027-05-25",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: SUMMER_ELECTIVE_DOCUMENT_REQUIREMENTS,
    description:
      "Psychiatry summer elective covering inpatient and outpatient mental health care.",
    status: "Open",
  },

  // Intern — Internship Rotations (60+ demo opportunities)
  // Keep a stable id for seed applications / demos.
  {
    id: "opp-in-kfmc-em-nov",
    trainingType: "internship-rotation",
    hospital: KFMC,
    city: hospitalCity(KFMC),
    healthcareField: "medicine",
    specialty: "Emergency Medicine",
    subspecialty: "",
    month: "November",
    startDate: "2027-11-01",
    endDate: "2027-11-30",
    datesFixed: true,
    availableSpots: 4,
    applicationDeadline: "2027-09-15",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "university-letter", true, "University Letter"),
      req("r3", "internship-letter", true, "Internship Letter"),
      req("r4", "academic-transcript", true, "Academic Transcript"),
      req("r5", "vaccination-record", true, "Vaccination Record"),
      req("r6", "health-clearance", true, "Health Clearance"),
    ],
    description:
      "High acuity emergency internship rotation with supervised shifts. Demo listing.",
    status: "Open",
  },
  ...SEED_INTERNSHIP_ROTATIONS,

  // Advanced Training
  {
    id: "opp-at-kfmc-ccn",
    trainingType: "advanced-training",
    hospital: KFMC,
    city: hospitalCity(KFMC),
    healthcareField: "nursing",
    specialty: "Adult Critical Care Nursing",
    subspecialty: "",
    month: "September",
    startDate: "2026-09-07",
    endDate: "2026-12-18",
    datesFixed: true,
    availableSpots: 5,
    applicationDeadline: "2026-08-01",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "professional-registration", true, "Professional Registration"),
      req("r3", "recommendation-letter", true, "Recommendation Letter"),
      req("r4", "vaccination-record", true, "Vaccination Record"),
      req("r5", "health-clearance", false, "Health Clearance"),
    ],
    description:
      "Advanced critical care nursing training with bedside mentoring.",
    status: "Open",
  },
  {
    id: "opp-at-ngha-pharmacy",
    trainingType: "advanced-training",
    hospital: NGHA_RIYADH,
    city: hospitalCity(NGHA_RIYADH),
    healthcareField: "pharmacy",
    specialty: "Clinical Pharmacy",
    subspecialty: "",
    month: "October",
    startDate: "2026-10-05",
    endDate: "2027-01-30",
    datesFixed: true,
    availableSpots: 4,
    applicationDeadline: "2026-08-20",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "fee", amountSar: 150 },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "professional-registration", true, "Professional Registration"),
      req("r3", "academic-transcript", true, "Academic Transcript"),
      req("r4", "recommendation-letter", true, "Recommendation Letter"),
    ],
    description:
      "Clinical pharmacy advanced training across inpatient services.",
    status: "Open",
  },
  {
    id: "opp-at-ksumc-allied",
    trainingType: "advanced-training",
    hospital: KSUMC,
    city: hospitalCity(KSUMC),
    healthcareField: "allied",
    specialty: "Respiratory Therapy",
    subspecialty: "",
    month: "November",
    startDate: "2026-11-02",
    endDate: "2027-02-27",
    datesFixed: false,
    availableSpots: 3,
    applicationDeadline: "2026-09-10",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "professional-registration", true, "Professional Registration"),
      req("r3", "vaccination-record", true, "Vaccination Record"),
      req("r4", "additional-hospital-document", false, "Additional Hospital Document"),
    ],
    description:
      "Allied health advanced training in respiratory therapy practice.",
    status: "Open",
  },

  // Resident — External Rotations
  {
    id: "opp-re-kfshrc-trauma",
    trainingType: "external-rotation",
    hospital: KFSHRC,
    city: hospitalCity(KFSHRC),
    healthcareField: "medicine",
    specialty: "General Surgery",
    subspecialty: "Trauma Surgery",
    month: "November",
    startDate: "2026-11-01",
    endDate: "2026-11-30",
    datesFixed: true,
    availableSpots: 2,
    applicationDeadline: "2026-09-15",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "fee", amountSar: 200 },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "training-program-letter", true, "Training Program Letter"),
      req("r3", "approval-letter", true, "Approval Letter"),
      req("r4", "professional-registration", true, "Professional Registration"),
      req("r5", "recommendation-letter", true, "Recommendation Letter"),
    ],
    description:
      "External trauma surgery rotation for residents at a tertiary center.",
    status: "Open",
  },
  {
    id: "opp-re-hmg-em",
    trainingType: "external-rotation",
    hospital: HMG,
    city: hospitalCity(HMG),
    healthcareField: "medicine",
    specialty: "Emergency Medicine",
    subspecialty: "",
    month: "January",
    startDate: "2027-01-05",
    endDate: "2027-01-30",
    datesFixed: false,
    availableSpots: 3,
    applicationDeadline: "2026-11-01",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "training-program-letter", true, "Training Program Letter"),
      req("r3", "approval-letter", true, "Approval Letter"),
      req("r4", "professional-registration", true, "Professional Registration"),
      req("r5", "additional-hospital-document", false, "Additional Hospital Document"),
    ],
    description:
      "External emergency medicine rotation with flexible January dates.",
    status: "Open",
  },

  // Fellow — External Rotations
  {
    id: "opp-fe-kfshrc-hf",
    trainingType: "external-rotation",
    hospital: KFSHRC,
    city: hospitalCity(KFSHRC),
    healthcareField: "medicine",
    specialty: "Cardiology",
    subspecialty: "Advanced Heart Failure",
    month: "January",
    startDate: "2027-01-04",
    endDate: "2027-01-29",
    datesFixed: true,
    availableSpots: 2,
    applicationDeadline: "2026-10-15",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "fee", amountSar: 250 },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "training-program-letter", true, "Training Program Letter"),
      req("r3", "approval-letter", true, "Approval Letter"),
      req("r4", "professional-registration", true, "Professional Registration"),
      req("r5", "recommendation-letter", true, "Recommendation Letter"),
      req("r6", "additional-hospital-document", true, "Additional Hospital Document"),
    ],
    description:
      "Fellow external rotation in advanced heart failure and transplant pathways.",
    status: "Open",
  },
  {
    id: "opp-fe-ngha-cardio",
    trainingType: "external-rotation",
    hospital: NGHA_RIYADH,
    city: hospitalCity(NGHA_RIYADH),
    healthcareField: "medicine",
    specialty: "Cardiology",
    subspecialty: "Interventional Cardiology",
    month: "March",
    startDate: "2027-03-01",
    endDate: "2027-03-26",
    datesFixed: true,
    availableSpots: 1,
    applicationDeadline: "2026-12-01",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    requirements: [
      req("r1", "cv", true, "CV"),
      req("r2", "training-program-letter", true, "Training Program Letter"),
      req("r3", "approval-letter", true, "Approval Letter"),
      req("r4", "professional-registration", true, "Professional Registration"),
      req("r5", "recommendation-letter", false, "Recommendation Letter"),
    ],
    description:
      "Interventional cardiology external rotation for fellows.",
    status: "Open",
  },
];

export function opportunitiesForType(type: TrainingApplicationType) {
  return SEED_TRAINING_OPPORTUNITIES.filter(
    (o) => o.trainingType === type && o.status === "Open",
  );
}

export function getOpportunityById(id: string) {
  return SEED_TRAINING_OPPORTUNITIES.find((o) => o.id === id);
}

export function formatHospitalFee(fee: TrainingFee) {
  if (fee.kind === "none") return "No Hospital Fee";
  return `SAR ${fee.amountSar}`;
}

export function formatMedJourneyFee(amountSar: number) {
  return `SAR ${amountSar}`;
}

export function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = formatDisplayDate(startDate);
  const end = formatDisplayDate(endDate);
  if (!start || !end) return "";
  return `${start} to ${end}`;
}

export function daysUntil(isoDate: string) {
  const target = new Date(`${isoDate}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diff;
}

export function trainingCities() {
  return Array.from(
    new Set(SEED_TRAINING_OPPORTUNITIES.map((o) => o.city)),
  ).sort();
}
