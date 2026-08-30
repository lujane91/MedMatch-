/**
 * Reusable user documents for MedJourney training applications.
 * Upload once, reuse across later applications.
 */

export type TrainingDocumentType =
  | "cv"
  | "university-letter"
  | "academic-transcript"
  | "national-id"
  | "vaccination-record"
  | "health-clearance"
  | "professional-registration"
  | "recommendation-letter"
  | "internship-letter"
  | "training-program-letter"
  | "approval-letter"
  | "additional-hospital-document";

export type UserDocumentStatus = "Uploaded" | "Expired" | "Missing";

export type UserDocument = {
  id: string;
  userId: string;
  documentType: TrainingDocumentType;
  fileName: string;
  uploadedAt: string;
  expiryDate?: string;
  status: UserDocumentStatus;
};

export const DOCUMENT_TYPE_LABELS: Record<TrainingDocumentType, string> = {
  cv: "CV",
  "university-letter": "University Letter",
  "academic-transcript": "Academic Transcript",
  "national-id": "National ID or Iqama",
  "vaccination-record": "Vaccination Record",
  "health-clearance": "Health Clearance",
  "professional-registration": "Professional Registration",
  "recommendation-letter": "Recommendation Letter",
  "internship-letter": "Internship Letter",
  "training-program-letter": "Training Program Letter",
  "approval-letter": "Approval Letter",
  "additional-hospital-document": "Additional Hospital Document",
};

export function createUserDocumentId() {
  return `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function isDocumentExpired(doc: UserDocument, now = new Date()) {
  if (!doc.expiryDate) return doc.status === "Expired";
  return new Date(`${doc.expiryDate}T23:59:59`).getTime() < now.getTime();
}

export function resolveDocumentStatus(
  doc: UserDocument | undefined,
): UserDocumentStatus {
  if (!doc) return "Missing";
  if (isDocumentExpired(doc)) return "Expired";
  return "Uploaded";
}

/** Seed reusable documents for demo personas (by applicant key). */
export const SEED_USER_DOCUMENTS: UserDocument[] = [
  {
    id: "doc-seed-cv",
    userId: "demo",
    documentType: "cv",
    fileName: "CV_MedJourney.pdf",
    uploadedAt: "2026-07-01T10:00:00.000Z",
    status: "Uploaded",
  },
  {
    id: "doc-seed-transcript",
    userId: "demo",
    documentType: "academic-transcript",
    fileName: "Academic_Transcript.pdf",
    uploadedAt: "2026-07-02T10:00:00.000Z",
    status: "Uploaded",
  },
  {
    id: "doc-seed-vaccination",
    userId: "demo",
    documentType: "vaccination-record",
    fileName: "Vaccination_Record.pdf",
    uploadedAt: "2026-06-15T10:00:00.000Z",
    expiryDate: "2027-06-15",
    status: "Uploaded",
  },
];
