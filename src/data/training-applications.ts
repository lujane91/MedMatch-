/**
 * Reusable MedJourney training application model.
 * Shared across Summer Electives, Internship Rotations,
 * Advanced Training, and External Rotations.
 * Compatible with a future hospital review workflow.
 */

import type { HealthcareField, TrainingStage } from "@/data/intern";
import { resolveStage } from "@/data/journey-dashboard";
import type {
  TrainingApplicationType,
  TrainingFee,
} from "@/data/training-opportunities";
import {
  MEDJOURNEY_APPLICATION_FEE_SAR,
  getOpportunityById,
} from "@/data/training-opportunities";
import type { TrainingDocumentType } from "@/data/training-documents";

export type { TrainingApplicationType, TrainingFee };

/**
 * Application progression for hospital-compatible workflow:
 * Draft → Submitted → Under Review → Accepted | Waitlisted | Declined
 * Internship Year adds student confirmation and alternative-month flows.
 * Accepted training later becomes Completed (or Student Confirmed → Completed).
 */
export type TrainingApplicationStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Waitlisted"
  | "Accepted"
  | "Declined"
  | "Alternative Month Proposed"
  | "Student Confirmed"
  | "Student Declined"
  | "Completed";

export type TrainingFeeStatus = "Not Required" | "Pending" | "Paid (Demo)";

/**
 * Separate from application status.
 * unpaid → paid after mock application payment.
 * Declined / not accepted → refundPending (then refunded after processing).
 * Voluntary withdrawal stays paid (nonrefundable by default).
 */
export type TrainingPaymentStatus =
  | "unpaid"
  | "paid"
  | "refundPending"
  | "refunded";

export type ApplicationDocumentLink = {
  requirementId: string;
  documentType: TrainingDocumentType;
  label: string;
  required: boolean;
  userDocumentId: string | null;
  status: "Uploaded" | "Missing" | "Expired" | "Optional";
};

export type TrainingApplication = {
  id: string;
  applicantKey: string;
  opportunityId: string;
  trainingType: TrainingApplicationType;
  journeyStage: TrainingStage;
  healthcareField: HealthcareField | null;
  hospital: string;
  city: string;
  specialty: string;
  subspecialty: string;
  month: string;
  startDate: string;
  endDate: string;
  datesWereFlexible: boolean;
  documents: ApplicationDocumentLink[];
  requirementsReady: boolean;
  requiredComplete: number;
  requiredTotal: number;
  missingRequired: string[];
  applicationStatus: TrainingApplicationStatus;
  medjourneyApplicationFeeSar: number;
  hospitalFee: TrainingFee;
  feeStatus: TrainingFeeStatus;
  /** Application fee payment state (independent of submission). */
  paymentStatus: TrainingPaymentStatus;
  remainingActions: string[];
  evaluationReceived: boolean;
  certificateAvailable: boolean;
  stampEarned: boolean;
  /** Reserved for future hospital review side. */
  hospitalReviewNote: string;
  /** Internship Year: hospital-proposed alternative month (YYYY-MM). */
  proposedMonthKey?: string;
  proposedStartDate?: string;
  proposedEndDate?: string;
  /** Internship Year: student priority among applications (1 = highest). */
  priority?: number;
  submittedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/**
 * Prototype refund rules for the SAR 100 application payment.
 * Waitlisted stays pending (no refund). Declined → refund eligible.
 * Voluntary withdrawal is nonrefundable by default.
 */
export function nextPaymentStatusAfterDecision(
  current: TrainingPaymentStatus,
  applicationStatus: TrainingApplicationStatus,
  options?: { voluntarilyWithdrawn?: boolean },
): TrainingPaymentStatus {
  if (options?.voluntarilyWithdrawn) {
    // Nonrefundable by default; extenuating circumstances are manual later.
    return current === "refundPending" || current === "refunded"
      ? current
      : current === "paid"
        ? "paid"
        : current;
  }
  if (applicationStatus === "Declined" && current === "paid") {
    return "refundPending";
  }
  if (applicationStatus === "Student Declined" && current === "paid") {
    // Student decline after hospital accept — treat as voluntary withdrawal (nonrefundable by default).
    return current;
  }
  if (
    applicationStatus === "Waitlisted" ||
    applicationStatus === "Accepted" ||
    applicationStatus === "Under Review" ||
    applicationStatus === "Submitted" ||
    applicationStatus === "Alternative Month Proposed" ||
    applicationStatus === "Student Confirmed"
  ) {
    return current;
  }
  return current;
}

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

export function findTrainingTitle(type: TrainingApplicationType) {
  switch (type) {
    case "summer-elective":
      return "Find Summer Electives";
    case "internship-rotation":
      return "Find Internship Rotations";
    case "advanced-training":
      return "Find Training Opportunities";
    case "external-rotation":
      return "Find External Rotations";
  }
}

export function createTrainingApplicationId() {
  return `ta_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export type NewTrainingApplicationInput = {
  applicantKey: string;
  opportunityId: string;
  journeyStage: TrainingStage;
  healthcareField: HealthcareField | null;
  month?: string;
  startDate?: string;
  endDate?: string;
  documents: ApplicationDocumentLink[];
};

export type DirectTrainingApplicationInput = {
  applicantKey: string;
  journeyStage: TrainingStage;
  healthcareField: HealthcareField | null;
  trainingType: TrainingApplicationType;
  hospital: string;
  city: string;
  specialty: string;
  month: string;
  startDate: string;
  endDate: string;
  documents: ApplicationDocumentLink[];
};

function documentTotals(documents: ApplicationDocumentLink[]) {
  const required = documents.filter((d) => d.required);
  const requiredComplete = required.filter((d) => d.status === "Uploaded")
    .length;
  const missingRequired = required
    .filter((d) => d.status !== "Uploaded")
    .map((d) => d.label);
  return {
    requiredComplete,
    requiredTotal: required.length,
    missingRequired,
    requirementsReady: missingRequired.length === 0,
  };
}

export function buildTrainingApplication(
  input: NewTrainingApplicationInput,
): TrainingApplication {
  const opportunity = getOpportunityById(input.opportunityId);
  if (!opportunity) {
    throw new Error("Training opportunity not found");
  }

  const totals = documentTotals(input.documents);
  const now = new Date().toISOString();
  return {
    id: createTrainingApplicationId(),
    applicantKey: input.applicantKey,
    opportunityId: opportunity.id,
    trainingType: opportunity.trainingType,
    journeyStage: input.journeyStage,
    healthcareField: input.healthcareField,
    hospital: opportunity.hospital,
    city: opportunity.city,
    specialty: opportunity.specialty,
    subspecialty: opportunity.subspecialty,
    month: input.month?.trim() || opportunity.month,
    startDate: input.startDate || opportunity.startDate,
    endDate: input.endDate || opportunity.endDate,
    datesWereFlexible: !opportunity.datesFixed,
    documents: input.documents,
    ...totals,
    applicationStatus: "Submitted",
    medjourneyApplicationFeeSar:
      opportunity.medjourneyApplicationFeeSar || MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee:
      opportunity.trainingType === "summer-elective"
        ? { kind: "none" }
        : opportunity.hospitalFee,
    feeStatus: "Paid (Demo)",
    paymentStatus: "paid",
    remainingActions: [],
    evaluationReceived: false,
    certificateAvailable: false,
    stampEarned: false,
    hospitalReviewNote: "",
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

/** Direct hospital request without a published opportunity listing. */
export function buildDirectTrainingApplication(
  input: DirectTrainingApplicationInput,
): TrainingApplication {
  const totals = documentTotals(input.documents);
  const now = new Date().toISOString();
  return {
    id: createTrainingApplicationId(),
    applicantKey: input.applicantKey,
    opportunityId: `direct_${Date.now()}`,
    trainingType: input.trainingType,
    journeyStage: input.journeyStage,
    healthcareField: input.healthcareField,
    hospital: input.hospital.trim(),
    city: input.city.trim(),
    specialty: input.specialty.trim(),
    subspecialty: "",
    month: input.month.trim(),
    startDate: input.startDate,
    endDate: input.endDate,
    datesWereFlexible: true,
    documents: input.documents,
    ...totals,
    applicationStatus: "Submitted",
    medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
    hospitalFee: { kind: "none" },
    feeStatus: "Paid (Demo)",
    paymentStatus: "paid",
    remainingActions: [],
    evaluationReceived: false,
    certificateAvailable: false,
    stampEarned: false,
    hospitalReviewNote: "",
    submittedAt: now,
    createdAt: now,
    updatedAt: now,
  };
}

export function statusToneClass(status: TrainingApplicationStatus) {
  switch (status) {
    case "Accepted":
    case "Student Confirmed":
    case "Completed":
      return "bg-mm-teal-50 text-mm-teal-700";
    case "Draft":
    case "Submitted":
    case "Under Review":
    case "Waitlisted":
    case "Alternative Month Proposed":
      return "bg-amber-50 text-amber-800";
    case "Declined":
    case "Student Declined":
      return "bg-mm-error-50 text-mm-error-700";
  }
}

/** Display label — internship uses clearer hospital-acceptance wording. */
export function applicationStatusLabel(
  status: TrainingApplicationStatus,
  trainingType?: TrainingApplicationType | null,
) {
  if (trainingType === "internship-rotation" && status === "Accepted") {
    return "Accepted by Hospital";
  }
  if (status === "Student Confirmed") return "Confirmed";
  return status;
}

export function applicationMonthKey(app: Pick<TrainingApplication, "startDate" | "proposedMonthKey" | "applicationStatus">) {
  if (
    app.applicationStatus === "Alternative Month Proposed" &&
    app.proposedMonthKey
  ) {
    return app.proposedMonthKey;
  }
  return app.startDate.slice(0, 7);
}

export function confirmedInternshipApps(apps: TrainingApplication[]) {
  return apps.filter(
    (a) =>
      a.trainingType === "internship-rotation" &&
      (a.applicationStatus === "Student Confirmed" ||
        a.applicationStatus === "Completed"),
  );
}

export function findMonthConflict(
  apps: TrainingApplication[],
  monthKey: string,
  excludeId?: string,
) {
  return confirmedInternshipApps(apps).find(
    (a) =>
      a.id !== excludeId &&
      applicationMonthKey(a) === monthKey,
  );
}

/** Demo applications so Upcoming / Completed tabs are testable. */
export function buildSeedApplications(
  applicantKey: string,
): TrainingApplication[] {
  const now = new Date().toISOString();
  const cardio = getOpportunityById("opp-ms-kfshrc-cardio-july");
  const peds = getOpportunityById("opp-ms-kfmc-peds-june");
  const trauma = getOpportunityById("opp-re-kfshrc-trauma");
  const internEm = getOpportunityById("opp-in-kfmc-em-nov");

  const seeds: TrainingApplication[] = [];

  if (cardio) {
    seeds.push({
      id: "ta-seed-accepted",
      applicantKey,
      opportunityId: cardio.id,
      trainingType: cardio.trainingType,
      journeyStage: "medical-student",
      healthcareField: "medicine",
      hospital: cardio.hospital,
      city: cardio.city,
      specialty: cardio.specialty,
      subspecialty: "",
      month: cardio.month,
      startDate: cardio.startDate,
      endDate: cardio.endDate,
      datesWereFlexible: false,
      documents: cardio.requirements.map((r) => ({
        requirementId: r.id,
        documentType: r.documentType,
        label: r.label,
        required: r.required,
        userDocumentId: r.required ? "doc-seed-cv" : null,
        status: r.required ? "Uploaded" : "Optional",
      })),
      requirementsReady: true,
      requiredComplete: 5,
      requiredTotal: 5,
      missingRequired: [],
      applicationStatus: "Accepted",
      medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
      hospitalFee: cardio.hospitalFee,
      feeStatus: "Paid (Demo)",
      paymentStatus: "paid",
      remainingActions: [
        "Upload Health Clearance",
        "Sign Training Agreement",
      ],
      evaluationReceived: false,
      certificateAvailable: false,
      stampEarned: false,
      hospitalReviewNote: "Accepted by hospital training office (demo).",
      submittedAt: "2026-08-01T10:00:00.000Z",
      createdAt: "2026-08-01T10:00:00.000Z",
      updatedAt: now,
    });
  }

  if (peds) {
    seeds.push({
      id: "ta-seed-completed",
      applicantKey,
      opportunityId: peds.id,
      trainingType: peds.trainingType,
      journeyStage: "medical-student",
      healthcareField: "medicine",
      hospital: peds.hospital,
      city: peds.city,
      specialty: peds.specialty,
      subspecialty: "",
      month: "June",
      startDate: "2026-06-01",
      endDate: "2026-06-26",
      datesWereFlexible: false,
      documents: peds.requirements.map((r) => ({
        requirementId: r.id,
        documentType: r.documentType,
        label: r.label,
        required: r.required,
        userDocumentId: "doc-seed-cv",
        status: "Uploaded",
      })),
      requirementsReady: true,
      requiredComplete: 4,
      requiredTotal: 4,
      missingRequired: [],
      applicationStatus: "Completed",
      medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
      hospitalFee: peds.hospitalFee,
      feeStatus: "Paid (Demo)",
      paymentStatus: "paid",
      remainingActions: [],
      evaluationReceived: true,
      certificateAvailable: true,
      stampEarned: true,
      hospitalReviewNote: "",
      submittedAt: "2026-04-10T10:00:00.000Z",
      createdAt: "2026-04-10T10:00:00.000Z",
      updatedAt: now,
    });
  }

  if (internEm) {
    seeds.push({
      id: "ta-seed-under-review",
      applicantKey,
      opportunityId: internEm.id,
      trainingType: internEm.trainingType,
      journeyStage: "intern",
      healthcareField: "medicine",
      hospital: internEm.hospital,
      city: internEm.city,
      specialty: internEm.specialty,
      subspecialty: "",
      month: internEm.month,
      startDate: internEm.startDate,
      endDate: internEm.endDate,
      datesWereFlexible: false,
      documents: internEm.requirements.map((r) => ({
        requirementId: r.id,
        documentType: r.documentType,
        label: r.label,
        required: r.required,
        userDocumentId: r.required ? "doc-seed-cv" : null,
        status: r.required ? "Uploaded" : "Optional",
      })),
      requirementsReady: true,
      requiredComplete: 6,
      requiredTotal: 6,
      missingRequired: [],
      applicationStatus: "Under Review",
      medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
      hospitalFee: internEm.hospitalFee,
      feeStatus: "Paid (Demo)",
      paymentStatus: "paid",
      remainingActions: [],
      evaluationReceived: false,
      certificateAvailable: false,
      stampEarned: false,
      hospitalReviewNote: "",
      submittedAt: "2026-08-20T10:00:00.000Z",
      createdAt: "2026-08-20T10:00:00.000Z",
      updatedAt: now,
    });
  }

  if (trauma) {
    seeds.push({
      id: "ta-seed-waitlisted",
      applicantKey,
      opportunityId: trauma.id,
      trainingType: trauma.trainingType,
      journeyStage: "resident",
      healthcareField: "medicine",
      hospital: trauma.hospital,
      city: trauma.city,
      specialty: trauma.specialty,
      subspecialty: trauma.subspecialty,
      month: trauma.month,
      startDate: trauma.startDate,
      endDate: trauma.endDate,
      datesWereFlexible: false,
      documents: trauma.requirements.map((r) => ({
        requirementId: r.id,
        documentType: r.documentType,
        label: r.label,
        required: r.required,
        userDocumentId: r.required ? "doc-seed-cv" : null,
        status: r.required ? "Uploaded" : "Optional",
      })),
      requirementsReady: true,
      requiredComplete: 5,
      requiredTotal: 5,
      missingRequired: [],
      applicationStatus: "Waitlisted",
      medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
      hospitalFee: trauma.hospitalFee,
      feeStatus: "Paid (Demo)",
      paymentStatus: "paid",
      remainingActions: [],
      evaluationReceived: false,
      certificateAvailable: false,
      stampEarned: false,
      hospitalReviewNote: "Waitlisted pending capacity (demo).",
      submittedAt: "2026-08-05T10:00:00.000Z",
      createdAt: "2026-08-05T10:00:00.000Z",
      updatedAt: now,
    });
  }

  return seeds;
}
