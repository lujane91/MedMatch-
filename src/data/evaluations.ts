import {
  DEMO_HOSPITALS,
  monthLabel,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";

export type EvaluationStatus =
  | "Draft"
  | "Submitted"
  | "Sent to Home Hospital";

export type EvaluationFormAttachment = {
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  uploadedBy: string;
  /** Demo-only local data URL / object URL content */
  dataUrl: string;
};

export type RotationEvaluation = {
  id: string;
  referenceNumber: string;
  applicationId: string | null;
  internRotationId: string | null;
  studentName: string;
  studentEmail: string;
  studentId: string;
  university: string;
  specialtyId: SpecialtyId;
  specialtyName: string;
  month: MonthKey;
  year: number;
  hostingHospitalId: string;
  hostingHospitalName: string;
  homeHospitalId: string;
  homeHospitalName: string;
  evaluatorName: string;
  evaluationDate: string;
  body: string;
  /** Optional official hospital evaluation form uploaded by hosting admin */
  attachment: EvaluationFormAttachment | null;
  status: EvaluationStatus;
  authenticatedByHostingHospital: boolean;
  locked: boolean;
  sentToHomeHospitalAt: string | null;
  createdAt: string;
  updatedAt: string;
  visibleToStudent: boolean;
};

export const EVALUATION_FORM_ACCEPT =
  ".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png";

export const EVALUATION_FORM_MAX_BYTES = 2.5 * 1024 * 1024;

export function isAllowedEvaluationFormFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const extOk = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"].some((ext) =>
    name.endsWith(ext),
  );
  const type = file.type.toLowerCase();
  const typeOk =
    !type ||
    [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ].includes(type);
  return extOk && typeOk;
}

export function formatEvaluationFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function evaluationFileExtensionLabel(fileName: string): string {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts[parts.length - 1]!.toUpperCase() : "FILE";
  return ext;
}

export function openEvaluationAttachment(
  attachment: EvaluationFormAttachment,
  mode: "preview" | "download" = "preview",
) {
  if (typeof window === "undefined" || !attachment.dataUrl) return;
  if (mode === "download") {
    const anchor = document.createElement("a");
    anchor.href = attachment.dataUrl;
    anchor.download = attachment.fileName;
    anchor.click();
    return;
  }
  const popup = window.open(attachment.dataUrl, "_blank", "noopener,noreferrer");
  if (!popup) {
    const anchor = document.createElement("a");
    anchor.href = attachment.dataUrl;
    anchor.download = attachment.fileName;
    anchor.click();
  }
}

export function hospitalName(id: string): string {
  return DEMO_HOSPITALS.find((h) => h.id === id)?.name ?? id;
}

export function evaluationStatusLabel(status: EvaluationStatus): string {
  if (status === "Sent to Home Hospital") return "Sent to Home Hospital";
  if (status === "Submitted") return "Authenticated by Hosting Hospital";
  return status;
}

export function createReferenceNumber(
  hostingHospitalId: string,
  year: number,
  seq: number,
): string {
  const code = hostingHospitalId.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return `EVAL-${code}-${year}-${String(seq).padStart(5, "0")}`;
}

export function monthSortKey(month: MonthKey, year: number): string {
  return `${year}-${month}`;
}

export function evaluationPeriodLabel(evaluation: RotationEvaluation): string {
  return `${monthLabel(evaluation.month)} ${evaluation.year}`;
}

/** Demo evaluations spanning hospitals and months. */
export const DEMO_EVALUATIONS: RotationEvaluation[] = [
  {
    id: "eval-001",
    referenceNumber: "EVAL-KFMC-2026-00012",
    applicationId: "app-kfmc-001",
    internRotationId: null,
    studentName: "Fahad Al-Mutairi",
    studentEmail: "fahad.almutairi@stu.ksu.edu.sa",
    studentId: "STU45672101",
    university: "King Saud University (KSU)",
    specialtyId: "emergency-medicine",
    specialtyName: "Emergency Medicine",
    month: "01",
    year: 2026,
    hostingHospitalId: "kfmc",
    hostingHospitalName: "King Fahad Medical City",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Noura Al-Harbi",
    evaluationDate: "2026-02-02",
    body: "Fahad demonstrated reliable triage judgment, calm communication with patients and nursing staff, and consistent follow-through on assigned tasks during the January Emergency Medicine block. He was receptive to feedback and showed steady improvement in focused history-taking under time pressure. Recommended for continued acute-care exposure.",
    attachment: null,
    status: "Submitted",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: null,
    createdAt: "2026-02-02T10:00:00.000Z",
    updatedAt: "2026-02-02T10:00:00.000Z",
    visibleToStudent: false,
  },
  {
    id: "eval-002",
    referenceNumber: "EVAL-KFMC-2026-00028",
    applicationId: "app-bulk-kfmc-09-internal-medicine-1",
    internRotationId: null,
    studentName: "Sara Al-Harbi",
    studentEmail: "sara.alharbi@medmatch.edu.sa",
    studentId: "STU77881203",
    university: "Princess Nourah bint Abdulrahman University",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    month: "09",
    year: 2026,
    hostingHospitalId: "kfmc",
    hostingHospitalName: "King Fahad Medical City",
    homeHospitalId: "kfshrc",
    homeHospitalName: "King Faisal Specialist Hospital & Research Centre",
    evaluatorName: "Dr. Khalid Al-Otaibi",
    evaluationDate: "2026-10-03",
    body: "Sara completed the September Internal Medicine rotation with strong inpatient documentation and professional bedside manner. She contributed thoughtfully on rounds and managed assigned follow-ups responsibly. Areas to develop further include prioritizing competing tasks during busy evening handovers.",
    attachment: null,
    status: "Sent to Home Hospital",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: "2026-10-04T08:30:00.000Z",
    createdAt: "2026-10-03T14:20:00.000Z",
    updatedAt: "2026-10-04T08:30:00.000Z",
    visibleToStudent: false,
  },
  {
    id: "eval-003",
    referenceNumber: "EVAL-KFSHRC-2026-00009",
    applicationId: "app-kfshrc-007",
    internRotationId: null,
    studentName: "Omar Al-Shehri",
    studentEmail: "omar.alshehri@alfaisal.edu",
    studentId: "STU21098744",
    university: "Alfaisal University",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    month: "09",
    year: 2026,
    hostingHospitalId: "kfshrc",
    hostingHospitalName: "King Faisal Specialist Hospital & Research Centre",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Abdullah Al-Qahtani",
    evaluationDate: "2026-10-01",
    body: "Omar showed excellent rapport with families and careful attention to pediatric vital-sign trends. He prepared concise case summaries and asked appropriate clinical questions. Overall performance met the expectations of the September Pediatrics service.",
    attachment: null,
    status: "Sent to Home Hospital",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: "2026-10-02T09:15:00.000Z",
    createdAt: "2026-10-01T16:00:00.000Z",
    updatedAt: "2026-10-02T09:15:00.000Z",
    visibleToStudent: false,
  },
  {
    id: "eval-004",
    referenceNumber: "EVAL-JHAH-2026-00007",
    applicationId: "app-jhah-001",
    internRotationId: null,
    studentName: "Hassan Al-Ghamdi",
    studentEmail: "hassan.alghamdi@iau.edu.sa",
    studentId: "STU12345677",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    specialtyId: "emergency-medicine",
    specialtyName: "Emergency Medicine",
    month: "01",
    year: 2026,
    hostingHospitalId: "jhah",
    hostingHospitalName: "Johns Hopkins Aramco Healthcare",
    homeHospitalId: "jhah",
    homeHospitalName: "Johns Hopkins Aramco Healthcare",
    evaluatorName: "Dr. Sara Al-Dosari",
    evaluationDate: "2026-02-05",
    body: "Hassan was punctual, team-oriented, and safe in procedural assistance. He communicated clearly during resuscitations and accepted coaching well. Suitable for progressive responsibility in subsequent acute-care rotations.",
    attachment: null,
    status: "Submitted",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: null,
    createdAt: "2026-02-05T11:40:00.000Z",
    updatedAt: "2026-02-05T11:40:00.000Z",
    visibleToStudent: false,
  },
  {
    id: "eval-005",
    referenceNumber: "EVAL-KFMC-2026-00041",
    applicationId: "app-bulk-kfmc-06-general-surgery-1",
    internRotationId: null,
    studentName: "Noura Al-Qahtani",
    studentEmail: "noura.alqahtani@stu.ksu.edu.sa",
    studentId: "STU33445566",
    university: "King Saud University (KSU)",
    specialtyId: "general-surgery",
    specialtyName: "General Surgery",
    month: "06",
    year: 2026,
    hostingHospitalId: "kfmc",
    hostingHospitalName: "King Fahad Medical City",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Faisal Al-Mutairi",
    evaluationDate: "2026-07-01",
    body: "Noura maintained sterile technique awareness, assisted effectively in theatre, and produced timely post-op notes. She would benefit from more proactive presentation of differential diagnoses on ward rounds. Overall a solid June surgery rotation.",
    attachment: null,
    status: "Submitted",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: null,
    createdAt: "2026-07-01T09:00:00.000Z",
    updatedAt: "2026-07-01T09:00:00.000Z",
    visibleToStudent: false,
  },
  // Student-portal visible evaluations for the demo intern (Amina Hassan)
  {
    id: "eval-student-001",
    referenceNumber: "EVAL-KFMC-2026-00055",
    applicationId: null,
    internRotationId: null,
    studentName: "Dr. Amina Hassan",
    studentEmail: "amina.hassan@medmatch.edu",
    studentId: "STU-AMINA-001",
    university: "King Saud University",
    specialtyId: "emergency-medicine",
    specialtyName: "Emergency Medicine",
    month: "07",
    year: 2026,
    hostingHospitalId: "kfmc",
    hostingHospitalName: "King Fahad Medical City",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Noura Al-Harbi",
    evaluationDate: "2026-08-02",
    body: "Amina completed the July Emergency Medicine internship block with professionalism and growing clinical confidence. She took ownership of assigned patients, communicated courteously with families, and documented encounters clearly. Continue building speed in focused examinations during peak ED hours.",
    attachment: null,
    status: "Submitted",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: null,
    createdAt: "2026-08-02T12:00:00.000Z",
    updatedAt: "2026-08-02T12:00:00.000Z",
    visibleToStudent: true,
  },
  {
    id: "eval-student-002",
    referenceNumber: "EVAL-KFSHRC-2026-00018",
    applicationId: null,
    internRotationId: null,
    studentName: "Dr. Amina Hassan",
    studentEmail: "amina.hassan@medmatch.edu",
    studentId: "STU-AMINA-001",
    university: "King Saud University",
    specialtyId: "internal-medicine",
    specialtyName: "Internal Medicine",
    month: "05",
    year: 2026,
    hostingHospitalId: "kfshrc",
    hostingHospitalName: "King Faisal Specialist Hospital & Research Centre",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Abdullah Al-Qahtani",
    evaluationDate: "2026-06-03",
    body: "During the May Internal Medicine rotation, Amina demonstrated careful clinical reasoning and respectful interdisciplinary collaboration. Progress notes were organized and her presentations improved week over week. Ready for increasing autonomy on subsequent inpatient services.",
    attachment: null,
    status: "Sent to Home Hospital",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: "2026-06-04T10:00:00.000Z",
    createdAt: "2026-06-03T15:30:00.000Z",
    updatedAt: "2026-06-04T10:00:00.000Z",
    visibleToStudent: true,
  },
  {
    id: "eval-student-003",
    referenceNumber: "EVAL-JHAH-2026-00021",
    applicationId: null,
    internRotationId: null,
    studentName: "Dr. Amina Hassan",
    studentEmail: "amina.hassan@medmatch.edu",
    studentId: "STU-AMINA-001",
    university: "King Saud University",
    specialtyId: "pediatrics",
    specialtyName: "Pediatrics",
    month: "03",
    year: 2026,
    hostingHospitalId: "jhah",
    hostingHospitalName: "Johns Hopkins Aramco Healthcare",
    homeHospitalId: "kfmc",
    homeHospitalName: "King Fahad Medical City",
    evaluatorName: "Dr. Sara Al-Dosari",
    evaluationDate: "2026-04-01",
    body: "Amina engaged well with pediatric patients and caregivers, followed safety protocols, and asked insightful questions on common childhood presentations. Attendance and professionalism were excellent throughout the March Pediatrics block.",
    attachment: null,
    status: "Sent to Home Hospital",
    authenticatedByHostingHospital: true,
    locked: true,
    sentToHomeHospitalAt: "2026-04-02T08:00:00.000Z",
    createdAt: "2026-04-01T13:00:00.000Z",
    updatedAt: "2026-04-02T08:00:00.000Z",
    visibleToStudent: true,
  },
];

export function buildEvaluationPrintHtml(
  evaluation: RotationEvaluation,
): string {
  const auth = evaluation.authenticatedByHostingHospital
    ? "Authenticated by Hosting Hospital"
    : "Pending authentication";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${evaluation.referenceNumber}</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; color: #0E3A5D; margin: 40px; line-height: 1.5; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    .meta { color: #5B6B7C; font-size: 13px; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: 160px 1fr; gap: 8px 16px; font-size: 14px; margin-bottom: 24px; }
    .label { color: #5B6B7C; }
    .body { white-space: pre-wrap; border-top: 1px solid #E5EAF0; padding-top: 16px; font-size: 14px; }
    .stamp { margin-top: 28px; padding: 12px 14px; background: #EAF7F6; border: 1px solid #B7E3E0; border-radius: 10px; font-size: 13px; font-weight: 600; color: #0F766E; }
  </style>
</head>
<body>
  <h1>MedJourney Rotation Evaluation</h1>
  <p class="meta">Reference ${evaluation.referenceNumber}</p>
  <div class="grid">
    <div class="label">Student</div><div>${evaluation.studentName}</div>
    <div class="label">University</div><div>${evaluation.university}</div>
    <div class="label">Specialty</div><div>${evaluation.specialtyName}</div>
    <div class="label">Rotation</div><div>${evaluationPeriodLabel(evaluation)}</div>
    <div class="label">Hosting hospital</div><div>${evaluation.hostingHospitalName}</div>
    <div class="label">Home hospital</div><div>${evaluation.homeHospitalName}</div>
    <div class="label">Evaluator</div><div>${evaluation.evaluatorName}</div>
    <div class="label">Evaluation date</div><div>${evaluation.evaluationDate}</div>
    <div class="label">Status</div><div>${evaluationStatusLabel(evaluation.status)}</div>
  </div>
  <h2 style="font-size:16px;margin:0 0 8px;">Rotation Evaluation</h2>
  <div class="body">${(evaluation.body || "(Written evaluation not provided)").replace(/</g, "&lt;")}</div>
  ${
    evaluation.attachment
      ? `<p style="margin-top:18px;font-size:13px;"><strong>Attached hospital form:</strong> ${evaluation.attachment.fileName} (${evaluation.attachment.fileType}, ${formatEvaluationFileSize(evaluation.attachment.fileSize)})</p>`
      : ""
  }
  <div class="stamp">${auth}</div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;
}

export function openEvaluationPdf(evaluation: RotationEvaluation) {
  if (typeof window === "undefined") return;
  const html = buildEvaluationPrintHtml(evaluation);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${evaluation.referenceNumber}.html`;
    anchor.click();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
