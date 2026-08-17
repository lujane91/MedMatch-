import {
  type ApplicantType,
  type HospitalApplication,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";

export type SubmissionStatus =
  | "Submitted"
  | "Pending"
  | "Missing"
  | "Approved"
  | "Needs Revision";

export type RotationSubmission = {
  id: string;
  title: string;
  category: string;
  status: SubmissionStatus;
  updatedAt: string;
  note?: string;
};

export type RotationPerformance = {
  attendancePct: number;
  punctualityPct: number;
  requirementsCompleted: number;
  requirementsTotal: number;
  progressPct: number;
  supervisorNotes: string[];
  records: {
    label: string;
    value: string;
    tone?: "good" | "warn" | "neutral";
  }[];
};

/** Minimum confirmed interns shown per specialty on Rotations. */
export const MIN_INTERNS_PER_SPECIALTY = 20;

const FIRST_NAMES = [
  "Sara",
  "Omar",
  "Noura",
  "Khalid",
  "Lina",
  "Yousef",
  "Hana",
  "Faisal",
  "Reem",
  "Turki",
  "Dana",
  "Majed",
  "Aisha",
  "Bader",
  "Maha",
  "Sami",
  "Joud",
  "Waleed",
  "Rana",
  "Hassan",
  "Layla",
  "Nawaf",
  "Ghada",
  "Ibrahim",
  "Mariam",
  "Ziad",
  "Huda",
  "Tariq",
  "Salma",
  "Anas",
];

const LAST_NAMES = [
  "Alharbi",
  "Alqahtani",
  "Alotaibi",
  "Almutairi",
  "Alghamdi",
  "Alshehri",
  "Alzahrani",
  "Alrashid",
  "Alangari",
  "Alhussein",
  "Alsaif",
  "Alfaraj",
  "Alnajjar",
  "Alenezi",
  "Alshammari",
];

const UNIVERSITIES = [
  "King Saud University",
  "King Abdulaziz University",
  "Imam Abdulrahman Bin Faisal University",
  "Princess Nourah University",
  "Alfaisal University",
  "Qassim University",
  "Taibah University",
  "King Khalid University",
];

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const SUBMISSION_TEMPLATES: Omit<
  RotationSubmission,
  "id" | "updatedAt" | "status"
>[] = [
  {
    title: "Orientation attendance form",
    category: "Attendance",
    note: "Signed by department coordinator.",
  },
  {
    title: "Weekly activity log",
    category: "Log",
    note: "Week 1–2 clinical activities.",
  },
  {
    title: "Procedure checklist",
    category: "Requirements",
  },
  {
    title: "Mid-rotation reflection",
    category: "Form",
  },
  {
    title: "Hospital policy acknowledgment",
    category: "Document",
  },
];

const STATUSES: SubmissionStatus[] = [
  "Submitted",
  "Pending",
  "Missing",
  "Approved",
  "Needs Revision",
];

/** Deterministic demo submissions for a rotation student. */
export function getDemoSubmissions(applicationId: string): RotationSubmission[] {
  const seed = hashSeed(applicationId);
  const count = 3 + (seed % 3);
  return SUBMISSION_TEMPLATES.slice(0, count).map((template, index) => ({
    id: `${applicationId}-sub-${index + 1}`,
    ...template,
    status: STATUSES[(seed + index * 3) % STATUSES.length]!,
    updatedAt: new Date(
      Date.UTC(2026, (seed + index) % 12, 4 + ((seed + index) % 20)),
    ).toISOString(),
  }));
}

export function countPendingEvaluations(
  totalInterns: number,
  lockedEvaluations: number,
) {
  return Math.max(0, totalInterns - lockedEvaluations);
}

export function countSubmittedDocuments(applicationIds: string[]) {
  return applicationIds.reduce((sum, id) => {
    const submissions = getDemoSubmissions(id);
    return (
      sum +
      submissions.filter(
        (item) => item.status === "Submitted" || item.status === "Approved",
      ).length
    );
  }, 0);
}

/** Deterministic demo performance for a rotation student. */
export function getDemoPerformance(applicationId: string): RotationPerformance {
  const seed = hashSeed(applicationId);
  const attendancePct = 82 + (seed % 17);
  const punctualityPct = 78 + ((seed * 3) % 21);
  const requirementsTotal = 8;
  const requirementsCompleted = 4 + (seed % 5);
  const progressPct = Math.round(
    (requirementsCompleted / requirementsTotal) * 100,
  );

  return {
    attendancePct: Math.min(100, attendancePct),
    punctualityPct: Math.min(100, punctualityPct),
    requirementsCompleted: Math.min(requirementsTotal, requirementsCompleted),
    requirementsTotal,
    progressPct: Math.min(100, progressPct),
    supervisorNotes: [
      "Engaged well in morning rounds and case discussions.",
      seed % 2 === 0
        ? "Needs closer follow-up on documentation completeness."
        : "Consistent professionalism with patients and nursing staff.",
    ],
    records: [
      {
        label: "Days present",
        value: `${18 + (seed % 5)} / ${20 + (seed % 3)}`,
        tone: "good",
      },
      {
        label: "Late arrivals",
        value: String(seed % 4),
        tone: seed % 4 > 1 ? "warn" : "good",
      },
      {
        label: "Required workshops",
        value: `${2 + (seed % 2)} completed`,
        tone: "neutral",
      },
      {
        label: "Clinical skills checklist",
        value: progressPct >= 70 ? "On track" : "In progress",
        tone: progressPct >= 70 ? "good" : "warn",
      },
    ],
  };
}

export function isValidSpecialtyParam(value: string): value is SpecialtyId {
  return typeof value === "string" && value.length > 0;
}

function syntheticRotationId(
  hospitalId: string,
  specialtyId: SpecialtyId,
  month: MonthKey,
  index: number,
) {
  return `rot:${hospitalId}:${specialtyId}:${month}:${String(index).padStart(2, "0")}`;
}

function createSyntheticIntern(input: {
  hospitalId: string;
  specialtyId: SpecialtyId;
  month: MonthKey;
  year: number;
  index: number;
}): HospitalApplication {
  const { hospitalId, specialtyId, month, year, index } = input;
  const id = syntheticRotationId(hospitalId, specialtyId, month, index);
  const seed = hashSeed(id);
  const first = FIRST_NAMES[(seed + index) % FIRST_NAMES.length]!;
  const last = LAST_NAMES[(seed * 7 + index) % LAST_NAMES.length]!;
  const applicantType: ApplicantType =
    (seed + index) % 3 === 0 ? "Internal" : "External";
  const university = UNIVERSITIES[(seed + index * 5) % UNIVERSITIES.length]!;
  const gender = seed % 2 === 0 ? "Female" : "Male";
  const submittedAt = new Date(
    Date.UTC(year, Number(month) - 1, 2 + (index % 20), 9, 0, 0),
  ).toISOString();
  const acceptanceDate = new Date(
    Date.UTC(year, Number(month) - 1, 8 + (index % 12), 11, 0, 0),
  ).toISOString();
  const studentId = `STU-${(1000 + (seed % 9000)).toString()}`;
  const email = `${first}.${last}${index}@medstudent.sa`
    .toLowerCase()
    .replace(/\s+/g, "");

  return {
    id,
    hospitalId,
    specialtyId,
    month,
    applicantName: `${first} ${last}`,
    applicantType,
    university,
    gender,
    email,
    phone: `+9665${String(10000000 + (seed % 89999999)).slice(0, 8)}`,
    nationalId: `1${String(100000000 + (seed % 899999999))}`,
    studentId,
    gpa: Number((3.2 + (seed % 160) / 100).toFixed(2)),
    clinicalGrade: Number((3.4 + (seed % 140) / 100).toFixed(2)),
    interviewScore: 70 + (seed % 25),
    graduationYear: year,
    expectedGraduationDate: `${year}-06`,
    college: "College of Medicine",
    affiliatedHospital: applicantType === "Internal" ? null : university,
    country: "Saudi Arabia",
    nationality: "Saudi",
    languages: ["Arabic", "English"],
    firstChoiceSpecialtyId: specialtyId,
    secondChoiceSpecialtyId: null,
    certificateCount: seed % 4,
    publicationCount: seed % 3,
    researchCount: seed % 3,
    profileStrength: 70 + (seed % 25),
    status: "Accepted",
    rankingScore: 70 + (seed % 25),
    submittedAt,
    eligible: true,
    meetsRequirements: true,
    cv: {
      id: `${id}-cv`,
      name: `${first}_${last}_CV.pdf`,
      kind: "CV",
      uploadedAt: submittedAt,
      fileLabel: "CV.pdf",
    },
    personalStatement: "Committed to clinical excellence during this rotation.",
    documents: [],
    requirements: [],
    timeline: [
      {
        id: `${id}-submitted`,
        label: "Submitted",
        at: submittedAt,
      },
      {
        id: `${id}-accepted`,
        label: "Accepted",
        at: acceptanceDate,
      },
    ],
    acceptanceDate,
  };
}

/**
 * Ensure each specialty rotation roster has at least `minCount` accepted interns
 * for demo browsing, without mutating the shared hospital applications store.
 */
export function expandSpecialtyRotationInterns(
  existing: HospitalApplication[],
  input: {
    hospitalId: string;
    specialtyId: SpecialtyId;
    month: MonthKey;
    year: number;
    minCount?: number;
  },
): HospitalApplication[] {
  const minCount = input.minCount ?? MIN_INTERNS_PER_SPECIALTY;
  const base = [...existing].sort((a, b) =>
    a.applicantName.localeCompare(b.applicantName),
  );
  if (base.length >= minCount) return base;

  const usedNames = new Set(base.map((app) => app.applicantName.toLowerCase()));
  const padded = [...base];
  let index = 1;
  while (padded.length < minCount && index < minCount + 80) {
    const next = createSyntheticIntern({
      hospitalId: input.hospitalId,
      specialtyId: input.specialtyId,
      month: input.month,
      year: input.year,
      index,
    });
    index += 1;
    if (usedNames.has(next.applicantName.toLowerCase())) continue;
    usedNames.add(next.applicantName.toLowerCase());
    padded.push(next);
  }
  return padded;
}

/** Resolve a rotation student from store apps or synthetic roster ids. */
export function resolveRotationApplication(
  applicationId: string,
  applications: HospitalApplication[],
  context?: {
    hospitalId: string;
    specialtyId: SpecialtyId;
    month: MonthKey;
    year: number;
  },
): HospitalApplication | undefined {
  const existing = applications.find((app) => app.id === applicationId);
  if (existing) return existing;

  const match = /^rot:([^:]+):([^:]+):(\d{2}):(\d{2})$/.exec(applicationId);
  if (!match) return undefined;
  const [, hospitalId, specialtyId, month, indexRaw] = match;
  const index = Number(indexRaw);
  if (!hospitalId || !specialtyId || !month || Number.isNaN(index)) {
    return undefined;
  }
  return createSyntheticIntern({
    hospitalId: context?.hospitalId ?? hospitalId,
    specialtyId: (context?.specialtyId ?? specialtyId) as SpecialtyId,
    month: (context?.month ?? month) as MonthKey,
    year: context?.year ?? new Date().getFullYear(),
    index,
  });
}
