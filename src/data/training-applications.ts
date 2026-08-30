/**
 * Reusable MedJourney training application model.
 * Shared across Summer Electives, Internship Rotations,
 * Advanced Training, and External Rotations.
 * Compatible with a future hospital review workflow.
 */

import type { HealthcareField, TrainingStage } from "@/data/intern";
import { resolveStage } from "@/data/journey-dashboard";

export type TrainingApplicationType =
  | "summer-elective"
  | "internship-rotation"
  | "advanced-training"
  | "external-rotation";

export type TrainingApplicationStatus =
  | "Pending"
  | "Accepted"
  | "Waitlisted"
  | "Declined"
  | "Completed";

export type TrainingFee =
  | { kind: "none" }
  | { kind: "fee"; amountSar: number };

export type TrainingApplication = {
  id: string;
  /** Applicant email or profile key for prototype filtering. */
  applicantKey: string;
  trainingType: TrainingApplicationType;
  journeyStage: TrainingStage;
  healthcareField: HealthcareField | null;
  month: string;
  startDate: string;
  endDate: string;
  hospital: string;
  specialty: string;
  subspecialty: string;
  fee: TrainingFee;
  status: TrainingApplicationStatus;
  /** Reserved for future hospital review side. */
  hospitalReviewNote: string;
  createdAt: string;
  updatedAt: string;
};

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

export function trainingTypeForStage(
  stage: TrainingStage | null,
): TrainingApplicationType | null {
  const resolved = resolveStage(stage);
  switch (resolved) {
    case "medical-student":
      return "summer-elective";
    case "intern":
      return "internship-rotation";
    case "advanced-training":
      return "advanced-training";
    case "resident":
    case "fellow":
      return "external-rotation";
    default:
      return null;
  }
}

export function trainingTypeLabel(type: TrainingApplicationType) {
  switch (type) {
    case "summer-elective":
      return "Summer Elective";
    case "internship-rotation":
      return "Internship Rotation";
    case "advanced-training":
      return "Advanced Training";
    case "external-rotation":
      return "External Rotation";
  }
}

export function applyCtaLabel(type: TrainingApplicationType) {
  switch (type) {
    case "summer-elective":
      return "Apply for a Summer Elective";
    case "internship-rotation":
      return "Apply for an Internship Rotation";
    case "advanced-training":
      return "Apply for Advanced Training";
    case "external-rotation":
      return "Apply for an External Rotation";
  }
}

export function formatTrainingFee(fee: TrainingFee) {
  if (fee.kind === "none") return "No Application Fee";
  return `Application Fee · ${fee.amountSar} SAR`;
}

export function formatTrainingFeeShort(fee: TrainingFee) {
  if (fee.kind === "none") return "No Application Fee";
  return `${fee.amountSar} SAR`;
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = formatDisplayDate(startDate);
  const end = formatDisplayDate(endDate);
  if (!start || !end) return "";
  return `${start} to ${end}`;
}

function formatDisplayDate(iso: string) {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** Prototype fee rule: some sample hospitals charge 100 SAR. */
export function demoFeeForHospital(hospital: string): TrainingFee {
  const paidHosts = [
    "King Faisal Specialist Hospital and Research Centre Riyadh",
    "Johns Hopkins Aramco Healthcare",
    "Dr. Sulaiman Al Habib Olaya Medical Complex",
  ];
  if (paidHosts.some((name) => hospital === name || hospital.includes("Faisal Specialist"))) {
    return { kind: "fee", amountSar: 100 };
  }
  return { kind: "none" };
}

export function createTrainingApplicationId() {
  return `ta_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export type NewTrainingApplicationInput = {
  applicantKey: string;
  trainingType: TrainingApplicationType;
  journeyStage: TrainingStage;
  healthcareField: HealthcareField | null;
  month: string;
  startDate: string;
  endDate: string;
  hospital: string;
  specialty: string;
  subspecialty?: string;
  fee: TrainingFee;
};

export function buildTrainingApplication(
  input: NewTrainingApplicationInput,
): TrainingApplication {
  const now = new Date().toISOString();
  return {
    id: createTrainingApplicationId(),
    applicantKey: input.applicantKey,
    trainingType: input.trainingType,
    journeyStage: input.journeyStage,
    healthcareField: input.healthcareField,
    month: input.month,
    startDate: input.startDate,
    endDate: input.endDate,
    hospital: input.hospital.trim(),
    specialty: input.specialty.trim(),
    subspecialty: input.subspecialty?.trim() || "",
    fee: input.fee,
    status: "Pending",
    hospitalReviewNote: "",
    createdAt: now,
    updatedAt: now,
  };
}

export function statusToneClass(status: TrainingApplicationStatus) {
  switch (status) {
    case "Accepted":
    case "Completed":
      return "bg-mm-teal-50 text-mm-teal-700";
    case "Pending":
    case "Waitlisted":
      return "bg-amber-50 text-amber-800";
    case "Declined":
      return "bg-mm-error-50 text-mm-error-700";
  }
}
