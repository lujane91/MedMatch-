/**
 * MedJourney hospital admin prototype — types & rich demo data
 * for Saudi internship rotation management. Self-contained (no React).
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type HospitalType = "Government" | "University" | "Private";

/** Specialty identifiers are stable slugs; custom hospital specialties may add new ones. */
export type SpecialtyId = string;

export type MonthKey =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export type CapacityStatus = "Open" | "Almost Full" | "Full" | "Closed";

export type ApplicationStatus =
  | "Pending"
  | "Under Review"
  | "Accepted"
  | "Rejected"
  | "Waitlisted"
  | "Alternative Suggested"
  | "Alternative Accepted"
  | "Alternative Declined";

export type ApplicantType = "Internal" | "External";

export type Gender = "Male" | "Female";

/** Statuses shown on the Applications module. */
export type DisplayApplicationStatus =
  | "Pending"
  | "Accepted"
  | "Rejected"
  | "Waitlisted";

export type NotificationType =
  | "new_application"
  | "capacity_almost_full"
  | "capacity_full"
  | "alternative_accepted"
  | "alternative_declined"
  | "application_withdrawn"
  | "review_reminder";

export interface SpecialtyMeta {
  id: SpecialtyId;
  name: string;
  shortName: string;
}

/** Per-hospital specialty managed in Specialties & Capacity. */
export interface HospitalSpecialty extends SpecialtyMeta {
  hospitalId: string;
  active: boolean;
}

export interface HospitalProfile {
  id: string;
  name: string;
  logo: string | null;
  city: string;
  type: HospitalType;
  /** Primary contact for hospital portal administration. */
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  /** Internship program configuration for the active hospital. */
  internshipProgramName: string;
  internshipCoordinator: string;
  internshipEmail: string;
  internshipPhone: string;
  internshipOverview: string;
}

export interface SpecialtyCapacity {
  hospitalId: string;
  specialtyId: SpecialtyId;
  month: MonthKey;
  internalSlots: number;
  externalSlots: number;
  /** When true, status is always Closed regardless of remaining seats. */
  closed: boolean;
}

export interface CapacityRow extends SpecialtyCapacity {
  totalSlots: number;
  acceptedCount: number;
  remaining: number;
  status: CapacityStatus;
  applicationCount: number;
  pendingCount: number;
  rejectedCount: number;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  kind: "CV" | "Personal Statement" | "Transcript" | "ID" | "Letter" | "Other";
  uploadedAt: string;
  fileLabel: string;
}

export interface RequirementItem {
  id: string;
  label: string;
  completed: boolean;
  mandatory: boolean;
}

export interface TimelineEvent {
  id: string;
  label: string;
  at: string;
  detail?: string;
}

export interface HospitalApplication {
  id: string;
  hospitalId: string;
  specialtyId: SpecialtyId;
  month: MonthKey;
  applicantName: string;
  applicantType: ApplicantType;
  university: string;
  gender: Gender;
  email: string;
  phone: string;
  nationalId: string;
  /** Student / university ID used in search. */
  studentId: string;
  gpa: number;
  /** Academic / clinical grade on a 5.0 scale. */
  clinicalGrade: number;
  /** Interview score out of 100 when completed; otherwise null. */
  interviewScore: number | null;
  graduationYear: number;
  /** Expected graduation month as YYYY-MM. */
  expectedGraduationDate: string;
  college: string;
  /** Affiliated teaching hospital for internal applicants when relevant. */
  affiliatedHospital: string | null;
  country: string;
  nationality: string;
  languages: string[];
  firstChoiceSpecialtyId: SpecialtyId;
  secondChoiceSpecialtyId: SpecialtyId | null;
  certificateCount: number;
  publicationCount: number;
  researchCount: number;
  profileStrength: number;
  status: ApplicationStatus;
  rankingScore: number;
  /** ISO date string */
  submittedAt: string;
  /** Eligibility flag used by ranking (e.g. SCFHS / docs complete). */
  eligible: boolean;
  /** True when all mandatory application requirements are met. */
  meetsRequirements: boolean;
  /** Mock CV file metadata shown in applicant details. */
  cv: ApplicationDocument;
  /** Short personal statement excerpt for review. */
  personalStatement: string;
  /** Uploaded supporting documents (mock). */
  documents: ApplicationDocument[];
  /** Requirement checklist for admin review. */
  requirements: RequirementItem[];
  /** Chronological application timeline. */
  timeline: TimelineEvent[];
  notes?: string;
  /** Suggested alternative months when primary month is full / closed. */
  alternativeMonthSuggestions?: MonthKey[];
  /** Set when status becomes Accepted (ISO date). */
  acceptanceDate?: string;
  /** Set when status becomes Rejected. */
  rejectionReason?: string;
}

export interface AlternativeSuggestion {
  id: string;
  applicationId: string;
  hospitalId: string;
  specialtyId: SpecialtyId;
  originalMonth: MonthKey;
  suggestedMonths: MonthKey[];
  status: "Suggested" | "Accepted" | "Declined";
  message: string;
  createdAt: string;
  respondedAt?: string;
}

export interface HospitalNotification {
  id: string;
  hospitalId: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  relatedApplicationId?: string;
  relatedSpecialtyId?: SpecialtyId;
  relatedMonth?: MonthKey;
}

export interface MonthOption {
  key: MonthKey;
  label: string;
}

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const MONTHS: MonthOption[] = [
  { key: "01", label: "January" },
  { key: "02", label: "February" },
  { key: "03", label: "March" },
  { key: "04", label: "April" },
  { key: "05", label: "May" },
  { key: "06", label: "June" },
  { key: "07", label: "July" },
  { key: "08", label: "August" },
  { key: "09", label: "September" },
  { key: "10", label: "October" },
  { key: "11", label: "November" },
  { key: "12", label: "December" },
];

/** Default internship specialties seeded for each hospital admin. */
export const DEMO_SPECIALTIES: SpecialtyMeta[] = [
  { id: "emergency-medicine", name: "Emergency Medicine", shortName: "EM" },
  { id: "internal-medicine", name: "Internal Medicine", shortName: "IM" },
  { id: "general-surgery", name: "General Surgery", shortName: "GS" },
  { id: "pediatrics", name: "Pediatrics", shortName: "Ped" },
  { id: "family-medicine", name: "Family Medicine", shortName: "FM" },
  {
    id: "obstetrics-gynecology",
    name: "Obstetrics & Gynecology",
    shortName: "OB/GYN",
  },
  { id: "psychiatry", name: "Psychiatry", shortName: "Psych" },
  { id: "orthopedics", name: "Orthopedics", shortName: "Ortho" },
];

/** Labels for legacy specialty ids still present in demo applications. */
export const SPECIALTY_LABELS: Record<string, string> = {
  "emergency-medicine": "Emergency Medicine",
  "internal-medicine": "Internal Medicine",
  "general-surgery": "General Surgery",
  pediatrics: "Pediatrics",
  "family-medicine": "Family Medicine",
  "obstetrics-gynecology": "Obstetrics & Gynecology",
  psychiatry: "Psychiatry",
  orthopedics: "Orthopedics",
  radiology: "Radiology",
  anesthesia: "Anesthesia",
  "intensive-care": "Intensive Care",
};

export function slugifySpecialtyName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `specialty-${Date.now()}`;
}

export function shortNameFromSpecialty(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "SP";
  if (words.length === 1) return words[0]!.slice(0, 4).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export const DEMO_HOSPITALS: HospitalProfile[] = [
  {
    id: "kfmc",
    name: "King Fahad Medical City",
    logo: "/institutions/kfmc.png",
    city: "Riyadh",
    type: "Government",
    adminName: "Dr. Noura Al-Harbi",
    adminEmail: "n.alharbi@kfmc.med.sa",
    adminPhone: "+966 11 288 9999",
    internshipProgramName: "KFMC Internship Training Program",
    internshipCoordinator: "Dr. Fahad Al-Mutairi",
    internshipEmail: "internship@kfmc.med.sa",
    internshipPhone: "+966 11 288 9100",
    internshipOverview:
      "Structured clinical internship rotations across core and elective specialties with supervised evaluation and capacity-managed admissions.",
  },
  {
    id: "kfshrc",
    name: "King Faisal Specialist Hospital & Research Centre",
    logo: "/institutions/kfshrc.svg",
    city: "Riyadh",
    type: "Government",
    adminName: "Dr. Abdullah Al-Qahtani",
    adminEmail: "a.alqahtani@kfshrc.edu.sa",
    adminPhone: "+966 11 464 7272",
    internshipProgramName: "KFSH&RC Clinical Internship",
    internshipCoordinator: "Dr. Lina Al-Shehri",
    internshipEmail: "internship@kfshrc.edu.sa",
    internshipPhone: "+966 11 464 7300",
    internshipOverview:
      "High-acuity clinical internship with research-aligned rotations and formal performance evaluations.",
  },
  {
    id: "jhah",
    name: "Johns Hopkins Aramco Healthcare",
    logo: "/institutions/jhah.svg",
    city: "Dhahran",
    type: "Private",
    adminName: "Dr. Sara Al-Dosari",
    adminEmail: "sara.aldosari@jhah.com",
    adminPhone: "+966 13 877 7777",
    internshipProgramName: "JHAH Internship Program",
    internshipCoordinator: "Dr. Omar Al-Ghamdi",
    internshipEmail: "internship@jhah.com",
    internshipPhone: "+966 13 877 7800",
    internshipOverview:
      "Integrated internship pathway with specialty capacity planning and continuous supervisor feedback.",
  },
];

export function createDefaultSpecialtiesForHospital(
  hospitalId: string,
): HospitalSpecialty[] {
  return DEMO_SPECIALTIES.map((specialty) => ({
    ...specialty,
    hospitalId,
    active: true,
  }));
}

export function createDefaultSpecialtiesForAllHospitals(
  hospitalIds: string[] = DEMO_HOSPITALS.map((h) => h.id),
): HospitalSpecialty[] {
  return hospitalIds.flatMap((id) => createDefaultSpecialtiesForHospital(id));
}

export const DEMO_HOSPITAL_SPECIALTIES: HospitalSpecialty[] =
  createDefaultSpecialtiesForAllHospitals();

/* -------------------------------------------------------------------------- */
/* Capacity generation                                                        */
/* -------------------------------------------------------------------------- */

const MONTH_KEYS = MONTHS.map((m) => m.key);

/**
 * Deterministic pseudo-variation from a string seed so demo data is stable
 * across reloads without needing Math.random().
 */
function seededInt(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const span = max - min + 1;
  return min + (h % span);
}

function buildCapacitiesForHospital(
  hospitalId: string,
  baseInternal: number,
  baseExternal: number,
): SpecialtyCapacity[] {
  const rows: SpecialtyCapacity[] = [];

  // Every hospital × specialty × month gets offered capacity so each month
  // shows the full specialty set (EM, IM, Surgery, Pediatrics, etc.).
  for (const specialty of DEMO_SPECIALTIES) {
    for (const month of MONTH_KEYS) {
      const seed = `${hospitalId}:${specialty.id}:${month}`;
      const internalSlots = Math.max(
        2,
        baseInternal + seededInt(seed + ":int", -2, 4),
      );
      const externalSlots = Math.max(
        1,
        baseExternal + seededInt(seed + ":ext", -1, 3),
      );
      // Close a few summer cells for realism — slots remain visible
      const closed =
        (month === "07" || month === "08") &&
        seededInt(seed + ":closed", 0, 5) === 0;

      rows.push({
        hospitalId,
        specialtyId: specialty.id,
        month,
        internalSlots,
        externalSlots,
        closed,
      });
    }
  }

  return rows;
}

export const DEMO_CAPACITIES: SpecialtyCapacity[] = [
  ...buildCapacitiesForHospital("kfmc", 6, 4),
  ...buildCapacitiesForHospital("kfshrc", 5, 3),
  ...buildCapacitiesForHospital("jhah", 4, 3),
];

/** Seed Jan–Dec capacity rows when a hospital adds a specialty. */
export function createYearCapacityForSpecialty(
  hospitalId: string,
  specialtyId: SpecialtyId,
  internalSlots = 4,
  externalSlots = 2,
): SpecialtyCapacity[] {
  return MONTH_KEYS.map((month) => ({
    hospitalId,
    specialtyId,
    month,
    internalSlots,
    externalSlots,
    closed: false,
  }));
}

/* -------------------------------------------------------------------------- */
/* Applications                                                               */
/* -------------------------------------------------------------------------- */

type ApplicationSeed = Omit<
  HospitalApplication,
  | "gender"
  | "clinicalGrade"
  | "interviewScore"
  | "meetsRequirements"
  | "cv"
  | "personalStatement"
  | "documents"
  | "requirements"
  | "timeline"
  | "studentId"
  | "expectedGraduationDate"
  | "college"
  | "affiliatedHospital"
  | "country"
  | "nationality"
  | "languages"
  | "firstChoiceSpecialtyId"
  | "secondChoiceSpecialtyId"
  | "certificateCount"
  | "publicationCount"
  | "researchCount"
> &
  Partial<
    Pick<
      HospitalApplication,
      | "gender"
      | "clinicalGrade"
      | "interviewScore"
      | "meetsRequirements"
      | "cv"
      | "personalStatement"
      | "documents"
      | "requirements"
      | "timeline"
      | "studentId"
      | "expectedGraduationDate"
      | "college"
      | "affiliatedHospital"
      | "country"
      | "nationality"
      | "languages"
      | "firstChoiceSpecialtyId"
      | "secondChoiceSpecialtyId"
      | "certificateCount"
      | "publicationCount"
      | "researchCount"
    >
  >;

const SAUDI_UNIVERSITIES = [
  "King Saud University (KSU)",
  "King Abdulaziz University (KAU)",
  "Imam Abdulrahman Bin Faisal University (IAU)",
  "King Saud bin Abdulaziz University for Health Sciences",
  "Princess Nourah bint Abdulrahman University",
  "Umm Al-Qura University",
  "Qassim University",
  "Taibah University",
  "Alfaisal University",
  "Batterjee Medical College",
] as const;

const SAUDI_COLLEGES = [
  "College of Medicine",
  "College of Medicine & Medical Sciences",
  "College of Medicine — Internship Program",
] as const;

const SAUDI_FIRST_NAMES_M = [
  "Fahad",
  "Abdullah",
  "Saud",
  "Faisal",
  "Khalid",
  "Turki",
  "Nasser",
  "Omar",
  "Yazeed",
  "Bader",
  "Majed",
  "Meshari",
  "Rayan",
  "Hassan",
  "Ibrahim",
] as const;

const SAUDI_FIRST_NAMES_F = [
  "Lina",
  "Nouf",
  "Reem",
  "Hessa",
  "Sara",
  "Noura",
  "Fatimah",
  "Maha",
  "Dana",
  "Layan",
  "Rania",
  "Joud",
  "Hala",
  "Mariam",
  "Rawan",
] as const;

const SAUDI_LAST_NAMES = [
  "Al-Mutairi",
  "Al-Harbi",
  "Al-Qahtani",
  "Al-Otaibi",
  "Al-Ghamdi",
  "Al-Dosari",
  "Al-Shahrani",
  "Al-Zahrani",
  "Al-Anazi",
  "Al-Faris",
  "Al-Shehri",
  "Al-Maliki",
  "Al-Subaie",
  "Al-Rashid",
  "Al-Harthi",
] as const;

const LANGUAGE_SETS = [
  ["Arabic", "English"],
  ["Arabic", "English", "French"],
  ["Arabic"],
  ["Arabic", "English", "Urdu"],
] as const;

function seededIntFromId(seed: string, min: number, max: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return min + (h % (max - min + 1));
}

function daysBefore(iso: string, days: number): string {
  const date = new Date(iso);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString();
}

function hoursAfter(iso: string, hours: number): string {
  const date = new Date(iso);
  date.setUTCHours(date.getUTCHours() + hours);
  return date.toISOString();
}

function buildDemoDocuments(
  seed: ApplicationSeed,
  meets: boolean,
): {
  cv: ApplicationDocument;
  documents: ApplicationDocument[];
} {
  const base = seed.submittedAt;
  const slug = seed.applicantName.toLowerCase().replace(/\s+/g, "-");
  const cv: ApplicationDocument = {
    id: `${seed.id}-cv`,
    name: "Curriculum Vitae",
    kind: "CV",
    uploadedAt: daysBefore(base, 2),
    fileLabel: `${slug}-cv.pdf`,
  };

  const documents: ApplicationDocument[] = [
    cv,
    {
      id: `${seed.id}-ps`,
      name: "Personal Statement",
      kind: "Personal Statement",
      uploadedAt: daysBefore(base, 1),
      fileLabel: `${slug}-personal-statement.pdf`,
    },
    {
      id: `${seed.id}-tr`,
      name: "University Transcript",
      kind: "Transcript",
      uploadedAt: daysBefore(base, 3),
      fileLabel: `${slug}-transcript.pdf`,
    },
    {
      id: `${seed.id}-id`,
      name: "National ID / Iqama",
      kind: "ID",
      uploadedAt: daysBefore(base, 4),
      fileLabel: `${slug}-id.pdf`,
    },
  ];

  if (meets || seededIntFromId(seed.id + ":letter", 0, 2) > 0) {
    documents.push({
      id: `${seed.id}-letter`,
      name: "Recommendation Letter",
      kind: "Letter",
      uploadedAt: daysBefore(base, 5),
      fileLabel: `${slug}-recommendation.pdf`,
    });
  }

  return { cv, documents };
}

function buildDemoRequirements(meets: boolean, seedId: string): RequirementItem[] {
  const missingIndex = meets ? -1 : seededIntFromId(seedId + ":miss", 0, 4);
  const labels = [
    "National ID / Iqama uploaded",
    "University transcript uploaded",
    "SCFHS eligibility confirmed",
    "Recommendation letter uploaded",
    "Vaccination record uploaded",
  ];
  return labels.map((label, index) => ({
    id: `${seedId}-req-${index + 1}`,
    label,
    mandatory: true,
    completed: missingIndex === index ? false : true,
  }));
}

function buildDemoPersonalStatement(
  name: string,
  specialtyId: string,
  university: string,
): string {
  const specialty =
    SPECIALTY_LABELS[specialtyId] ??
    DEMO_SPECIALTIES.find((s) => s.id === specialtyId)?.name ??
    specialtyId;
  return `I am ${name}, a medical graduate from ${university}. I am applying for an internship rotation in ${specialty} to strengthen my clinical reasoning, bedside communication, and teamwork in a high-acuity Saudi teaching hospital environment. I am committed to patient safety, professionalism, and continuous learning throughout the rotation.`;
}

function buildDemoTimeline(seed: ApplicationSeed): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${seed.id}-tl-1`,
      label: "Application started",
      at: daysBefore(seed.submittedAt, 3),
      detail: "Applicant began the internship rotation application.",
    },
    {
      id: `${seed.id}-tl-2`,
      label: "Documents uploaded",
      at: daysBefore(seed.submittedAt, 1),
      detail: "CV, personal statement, and supporting files uploaded.",
    },
    {
      id: `${seed.id}-tl-3`,
      label: "Application submitted",
      at: seed.submittedAt,
      detail: `Submitted for ${seed.month}/${seed.specialtyId}.`,
    },
  ];

  if (seed.status === "Under Review" || seed.status === "Alternative Suggested") {
    events.push({
      id: `${seed.id}-tl-4`,
      label: "Moved to review",
      at: hoursAfter(seed.submittedAt, 18),
      detail: "Hospital team started reviewing the application.",
    });
  }
  if (seed.status === "Accepted" || seed.status === "Alternative Accepted") {
    events.push({
      id: `${seed.id}-tl-5`,
      label: "Accepted",
      at: seed.acceptanceDate ?? hoursAfter(seed.submittedAt, 48),
      detail: "Applicant accepted into the rotation. Capacity updated.",
    });
  }
  if (seed.status === "Rejected" || seed.status === "Alternative Declined") {
    events.push({
      id: `${seed.id}-tl-6`,
      label: "Rejected",
      at: hoursAfter(seed.submittedAt, 36),
      detail: seed.rejectionReason || seed.notes || "Application rejected.",
    });
  }
  if (seed.status === "Waitlisted") {
    events.push({
      id: `${seed.id}-tl-7`,
      label: "Waitlisted",
      at: hoursAfter(seed.submittedAt, 30),
      detail: "Applicant placed on the waitlist for this specialty and month.",
    });
  }

  return events.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );
}

function inferGenderFromName(name: string): Gender {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() ?? "";
  const femaleHints = [
    "lina",
    "nouf",
    "reem",
    "hessa",
    "abeer",
    "ghada",
    "sara",
    "noura",
    "fatimah",
    "maha",
    "dana",
    "layan",
    "rania",
    "joud",
    "hala",
    "mariam",
    "manal",
    "ahlam",
    "bashayer",
    "rawan",
    "shaden",
    "lama",
    "najla",
  ];
  if (femaleHints.some((n) => first.startsWith(n))) {
    return "Female";
  }
  return "Male";
}

function collegeFromUniversity(university: string): string {
  if (university.toLowerCase().includes("batterjee")) {
    return "Batterjee Medical College";
  }
  if (university.toLowerCase().includes("princess nourah")) {
    return "College of Medicine";
  }
  return SAUDI_COLLEGES[seededIntFromId(university, 0, SAUDI_COLLEGES.length - 1)]!;
}

export function enrichApplication(
  seed: ApplicationSeed,
): HospitalApplication {
  const clinicalFromProfile = Math.min(
    5,
    Math.max(2.5, Number(((seed.profileStrength / 100) * 5).toFixed(2))),
  );
  const hasInterview = seededIntFromId(seed.id + ":iv", 0, 4) !== 0;
  const interviewScore = hasInterview
    ? seededIntFromId(seed.id + ":ivs", 62, 98)
    : null;
  const meetsRequirements = seed.meetsRequirements ?? seed.eligible;
  const { cv, documents } = buildDemoDocuments(seed, meetsRequirements);
  const requirements =
    seed.requirements ?? buildDemoRequirements(meetsRequirements, seed.id);
  const secondChoicePool = DEMO_SPECIALTIES.map((s) => s.id).filter(
    (id) => id !== seed.specialtyId,
  );
  const secondChoice =
    secondChoicePool[
      seededIntFromId(seed.id + ":sc", 0, secondChoicePool.length - 1)
    ] ?? null;
  const gradMonth = String(
    seededIntFromId(seed.id + ":gm", 1, 12),
  ).padStart(2, "0");

  return {
    ...seed,
    gender: seed.gender ?? inferGenderFromName(seed.applicantName),
    studentId:
      seed.studentId ??
      `STU${seed.nationalId.slice(-6)}${seededIntFromId(seed.id, 10, 99)}`,
    expectedGraduationDate:
      seed.expectedGraduationDate ?? `${seed.graduationYear}-${gradMonth}`,
    college: seed.college ?? collegeFromUniversity(seed.university),
    affiliatedHospital:
      seed.affiliatedHospital !== undefined
        ? seed.affiliatedHospital
        : seed.applicantType === "Internal"
          ? DEMO_HOSPITALS.find((h) => h.id === seed.hospitalId)?.name ?? null
          : null,
    country: seed.country ?? "Saudi Arabia",
    nationality:
      seed.nationality ??
      (seededIntFromId(seed.id + ":nat", 0, 9) === 0
        ? "Egyptian"
        : "Saudi"),
    languages:
      seed.languages ??
      [...LANGUAGE_SETS[seededIntFromId(seed.id + ":lang", 0, LANGUAGE_SETS.length - 1)]!],
    firstChoiceSpecialtyId: seed.firstChoiceSpecialtyId ?? seed.specialtyId,
    secondChoiceSpecialtyId:
      seed.secondChoiceSpecialtyId !== undefined
        ? seed.secondChoiceSpecialtyId
        : seededIntFromId(seed.id + ":has2", 0, 3) === 0
          ? null
          : secondChoice,
    certificateCount:
      seed.certificateCount ?? seededIntFromId(seed.id + ":cert", 0, 6),
    publicationCount:
      seed.publicationCount ?? seededIntFromId(seed.id + ":pub", 0, 4),
    researchCount:
      seed.researchCount ?? seededIntFromId(seed.id + ":res", 0, 3),
    clinicalGrade:
      seed.clinicalGrade ??
      Number(
        (
          clinicalFromProfile +
          seededIntFromId(seed.id + ":cg", -20, 20) / 100
        ).toFixed(2),
      ),
    interviewScore:
      seed.interviewScore === undefined ? interviewScore : seed.interviewScore,
    meetsRequirements,
    cv: seed.cv ?? cv,
    personalStatement:
      seed.personalStatement ??
      buildDemoPersonalStatement(
        seed.applicantName,
        seed.specialtyId,
        seed.university,
      ),
    documents: seed.documents ?? documents,
    requirements,
    timeline: seed.timeline ?? buildDemoTimeline(seed),
  };
}

export function normalizeApplications(
  applications: ApplicationSeed[],
): HospitalApplication[] {
  return applications.map(enrichApplication);
}

const DEMO_APPLICATIONS_SEED: ApplicationSeed[] = [
  // —— King Fahad Medical City (kfmc) ——
  {
    id: "app-kfmc-001",
    hospitalId: "kfmc",
    specialtyId: "emergency-medicine",
    month: "01",
    applicantName: "Fahad Al-Mutairi",
    applicantType: "Internal",
    university: "King Saud University (KSU)",
    email: "fahad.almutairi@stu.ksu.edu.sa",
    phone: "+966 50 112 3401",
    nationalId: "1098456721",
    gpa: 4.72,
    graduationYear: 2026,
    profileStrength: 92,
    status: "Accepted",
    rankingScore: 96,
    submittedAt: "2025-09-12T08:14:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-002",
    hospitalId: "kfmc",
    specialtyId: "emergency-medicine",
    month: "01",
    applicantName: "Lina Al-Otaibi",
    applicantType: "External",
    university: "Princess Nourah bint Abdulrahman University",
    email: "lina.alotaibi@pnu.edu.sa",
    phone: "+966 55 221 8870",
    nationalId: "1102345678",
    gpa: 4.55,
    graduationYear: 2026,
    profileStrength: 88,
    status: "Under Review",
    rankingScore: 84,
    submittedAt: "2025-09-14T11:02:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-003",
    hospitalId: "kfmc",
    specialtyId: "internal-medicine",
    month: "02",
    applicantName: "Abdulrahman Al-Ghamdi",
    applicantType: "Internal",
    university: "King Saud University (KSU)",
    email: "a.alghamdi@stu.ksu.edu.sa",
    phone: "+966 54 330 1192",
    nationalId: "1089123456",
    gpa: 4.41,
    graduationYear: 2026,
    profileStrength: 79,
    status: "Pending",
    rankingScore: 81,
    submittedAt: "2025-09-18T09:40:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-004",
    hospitalId: "kfmc",
    specialtyId: "general-surgery",
    month: "03",
    applicantName: "Nouf Al-Shammari",
    applicantType: "External",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    email: "nouf.alshammari@iau.edu.sa",
    phone: "+966 56 778 2201",
    nationalId: "1114567890",
    gpa: 4.68,
    graduationYear: 2025,
    profileStrength: 95,
    status: "Accepted",
    rankingScore: 93,
    submittedAt: "2025-09-10T07:55:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-005",
    hospitalId: "kfmc",
    specialtyId: "pediatrics",
    month: "04",
    applicantName: "Sultan Al-Harthy",
    applicantType: "External",
    university: "King Abdulaziz University (KAU)",
    email: "sultan.alharthy@stu.kau.edu.sa",
    phone: "+966 50 991 3344",
    nationalId: "1078234561",
    gpa: 3.95,
    graduationYear: 2026,
    profileStrength: 62,
    status: "Waitlisted",
    rankingScore: 58,
    submittedAt: "2025-09-20T15:22:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-006",
    hospitalId: "kfmc",
    specialtyId: "obstetrics-gynecology",
    month: "05",
    applicantName: "Reem Al-Qahtani",
    applicantType: "Internal",
    university: "King Saud University (KSU)",
    email: "reem.alqahtani@stu.ksu.edu.sa",
    phone: "+966 53 445 6677",
    nationalId: "1123456789",
    gpa: 4.80,
    graduationYear: 2026,
    profileStrength: 97,
    status: "Accepted",
    rankingScore: 98,
    submittedAt: "2025-09-08T06:30:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-007",
    hospitalId: "kfmc",
    specialtyId: "family-medicine",
    month: "06",
    applicantName: "Majed Al-Zahrani",
    applicantType: "External",
    university: "Taibah University",
    email: "majed.alzahrani@taibahu.edu.sa",
    phone: "+966 58 112 0098",
    nationalId: "1091112233",
    gpa: 3.70,
    graduationYear: 2025,
    profileStrength: 48,
    status: "Rejected",
    rankingScore: 42,
    submittedAt: "2025-09-22T18:05:00.000Z",
    eligible: false,
    notes: "Incomplete SCFHS documentation",
  },
  {
    id: "app-kfmc-008",
    hospitalId: "kfmc",
    specialtyId: "psychiatry",
    month: "09",
    applicantName: "Hessa Al-Dosari",
    applicantType: "External",
    university: "Princess Nourah bint Abdulrahman University",
    email: "hessa.aldosari@pnu.edu.sa",
    phone: "+966 55 667 8890",
    nationalId: "1134567891",
    gpa: 4.33,
    graduationYear: 2026,
    profileStrength: 74,
    status: "Alternative Suggested",
    rankingScore: 71,
    submittedAt: "2025-09-16T12:18:00.000Z",
    eligible: true,
    alternativeMonthSuggestions: ["10", "11"],
    notes: "September psychiatry block nearly full",
  },
  {
    id: "app-kfmc-009",
    hospitalId: "kfmc",
    specialtyId: "radiology",
    month: "10",
    applicantName: "Turki Al-Anazi",
    applicantType: "Internal",
    university: "King Saud University (KSU)",
    email: "turki.alanazi@stu.ksu.edu.sa",
    phone: "+966 50 334 5566",
    nationalId: "1087654321",
    gpa: 4.50,
    graduationYear: 2026,
    profileStrength: 85,
    status: "Under Review",
    rankingScore: 87,
    submittedAt: "2025-09-19T10:11:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfmc-010",
    hospitalId: "kfmc",
    specialtyId: "anesthesia",
    month: "11",
    applicantName: "Abeer Al-Subaie",
    applicantType: "External",
    university: "Qassim University",
    email: "abeer.alsubaie@qu.edu.sa",
    phone: "+966 54 778 9901",
    nationalId: "1145678902",
    gpa: 4.12,
    graduationYear: 2025,
    profileStrength: 68,
    status: "Pending",
    rankingScore: 65,
    submittedAt: "2025-09-24T14:45:00.000Z",
    eligible: true,
  },

  // —— King Faisal Specialist Hospital & Research Centre (kfshrc) ——
  {
    id: "app-kfshrc-001",
    hospitalId: "kfshrc",
    specialtyId: "internal-medicine",
    month: "01",
    applicantName: "Yousef Al-Saud",
    applicantType: "Internal",
    university: "Alfaisal University",
    email: "yousef.alsaud@alfaisal.edu",
    phone: "+966 50 221 3344",
    nationalId: "1076543210",
    gpa: 4.90,
    graduationYear: 2026,
    profileStrength: 99,
    status: "Accepted",
    rankingScore: 99,
    submittedAt: "2025-09-05T07:00:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfshrc-002",
    hospitalId: "kfshrc",
    specialtyId: "general-surgery",
    month: "02",
    applicantName: "Dana Al-Jaber",
    applicantType: "External",
    university: "King Saud University (KSU)",
    email: "dana.aljaber@stu.ksu.edu.sa",
    phone: "+966 55 443 2211",
    nationalId: "1156789012",
    gpa: 4.60,
    graduationYear: 2026,
    profileStrength: 90,
    status: "Accepted",
    rankingScore: 88,
    submittedAt: "2025-09-11T09:25:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfshrc-003",
    hospitalId: "kfshrc",
    specialtyId: "intensive-care",
    month: "03",
    applicantName: "Khalid Al-Faraj",
    applicantType: "External",
    university: "King Abdulaziz University (KAU)",
    email: "khalid.alfaraj@stu.kau.edu.sa",
    phone: "+966 56 889 0012",
    nationalId: "1065432109",
    gpa: 4.25,
    graduationYear: 2025,
    profileStrength: 77,
    status: "Under Review",
    rankingScore: 76,
    submittedAt: "2025-09-15T13:50:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfshrc-004",
    hospitalId: "kfshrc",
    specialtyId: "orthopedics",
    month: "04",
    applicantName: "Maha Al-Ruwaili",
    applicantType: "Internal",
    university: "Alfaisal University",
    email: "maha.alruwaili@alfaisal.edu",
    phone: "+966 53 112 7788",
    nationalId: "1167890123",
    gpa: 4.45,
    graduationYear: 2026,
    profileStrength: 83,
    status: "Pending",
    rankingScore: 85,
    submittedAt: "2025-09-21T08:33:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfshrc-005",
    hospitalId: "kfshrc",
    specialtyId: "emergency-medicine",
    month: "05",
    applicantName: "Bader Al-Harbi",
    applicantType: "External",
    university: "Imam Mohammad Ibn Saud Islamic University",
    email: "bader.alharbi@imamu.edu.sa",
    phone: "+966 50 667 4455",
    nationalId: "1054321098",
    gpa: 3.85,
    graduationYear: 2026,
    profileStrength: 55,
    status: "Waitlisted",
    rankingScore: 52,
    submittedAt: "2025-09-23T16:10:00.000Z",
    eligible: true,
  },
  {
    id: "app-kfshrc-006",
    hospitalId: "kfshrc",
    specialtyId: "radiology",
    month: "06",
    applicantName: "Jawaher Al-Mutlaq",
    applicantType: "External",
    university: "Princess Nourah bint Abdulrahman University",
    email: "jawaher.almutlaq@pnu.edu.sa",
    phone: "+966 54 990 1122",
    nationalId: "1178901234",
    gpa: 4.70,
    graduationYear: 2026,
    profileStrength: 91,
    status: "Alternative Suggested",
    rankingScore: 89,
    submittedAt: "2025-09-13T11:40:00.000Z",
    eligible: true,
    alternativeMonthSuggestions: ["07", "09", "10"],
    notes: "June radiology capacity closed for renovations",
  },
  {
    id: "app-kfshrc-007",
    hospitalId: "kfshrc",
    specialtyId: "pediatrics",
    month: "09",
    applicantName: "Omar Al-Shehri",
    applicantType: "Internal",
    university: "Alfaisal University",
    email: "omar.alshehri@alfaisal.edu",
    phone: "+966 55 334 7789",
    nationalId: "1043210987",
    gpa: 4.38,
    graduationYear: 2026,
    profileStrength: 80,
    status: "Alternative Accepted",
    rankingScore: 82,
    submittedAt: "2025-09-09T07:15:00.000Z",
    eligible: true,
    alternativeMonthSuggestions: ["10"],
    notes: "Accepted October alternative after September filled",
  },
  {
    id: "app-kfshrc-008",
    hospitalId: "kfshrc",
    specialtyId: "anesthesia",
    month: "10",
    applicantName: "Sara Al-Naim",
    applicantType: "External",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    email: "sara.alnaim@iau.edu.sa",
    phone: "+966 58 221 5566",
    nationalId: "1189012345",
    gpa: 4.05,
    graduationYear: 2025,
    profileStrength: 70,
    status: "Alternative Declined",
    rankingScore: 67,
    submittedAt: "2025-09-17T17:20:00.000Z",
    eligible: true,
    alternativeMonthSuggestions: ["12"],
    notes: "Declined December alternative — conflict with elective abroad",
  },
  {
    id: "app-kfshrc-009",
    hospitalId: "kfshrc",
    specialtyId: "family-medicine",
    month: "11",
    applicantName: "Waleed Al-Qahtani",
    applicantType: "External",
    university: "King Khalid University",
    email: "waleed.alqahtani@kku.edu.sa",
    phone: "+966 50 889 3344",
    nationalId: "1032109876",
    gpa: 3.60,
    graduationYear: 2025,
    profileStrength: 44,
    status: "Rejected",
    rankingScore: 40,
    submittedAt: "2025-09-25T19:00:00.000Z",
    eligible: false,
  },

  // —— Johns Hopkins Aramco Healthcare (jhah) ——
  {
    id: "app-jhah-001",
    hospitalId: "jhah",
    specialtyId: "emergency-medicine",
    month: "01",
    applicantName: "Hassan Al-Ghamdi",
    applicantType: "Internal",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    email: "hassan.alghamdi@iau.edu.sa",
    phone: "+966 50 445 6677",
    nationalId: "1190123456",
    gpa: 4.65,
    graduationYear: 2026,
    profileStrength: 93,
    status: "Accepted",
    rankingScore: 95,
    submittedAt: "2025-09-07T08:05:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-002",
    hospitalId: "jhah",
    specialtyId: "internal-medicine",
    month: "02",
    applicantName: "Fatimah Al-Dosari",
    applicantType: "External",
    university: "King Faisal University",
    email: "fatimah.aldosari@kfu.edu.sa",
    phone: "+966 55 778 9900",
    nationalId: "1021098765",
    gpa: 4.48,
    graduationYear: 2026,
    profileStrength: 86,
    status: "Under Review",
    rankingScore: 83,
    submittedAt: "2025-09-14T10:55:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-003",
    hospitalId: "jhah",
    specialtyId: "general-surgery",
    month: "03",
    applicantName: "Rakan Al-Otaibi",
    applicantType: "External",
    university: "King Saud University (KSU)",
    email: "rakan.alotaibi@stu.ksu.edu.sa",
    phone: "+966 54 112 3344",
    nationalId: "1201234567",
    gpa: 4.22,
    graduationYear: 2025,
    profileStrength: 72,
    status: "Pending",
    rankingScore: 70,
    submittedAt: "2025-09-20T12:40:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-004",
    hospitalId: "jhah",
    specialtyId: "pediatrics",
    month: "04",
    applicantName: "Amal Al-Harbi",
    applicantType: "Internal",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    email: "amal.alharbi@iau.edu.sa",
    phone: "+966 56 334 5566",
    nationalId: "1010987654",
    gpa: 4.75,
    graduationYear: 2026,
    profileStrength: 94,
    status: "Accepted",
    rankingScore: 97,
    submittedAt: "2025-09-06T06:50:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-005",
    hospitalId: "jhah",
    specialtyId: "obstetrics-gynecology",
    month: "05",
    applicantName: "Noura Al-Mutairi",
    applicantType: "External",
    university: "Princess Nourah bint Abdulrahman University",
    email: "noura.almutairi@pnu.edu.sa",
    phone: "+966 53 667 8899",
    nationalId: "1212345678",
    gpa: 4.58,
    graduationYear: 2026,
    profileStrength: 89,
    status: "Waitlisted",
    rankingScore: 86,
    submittedAt: "2025-09-18T15:05:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-006",
    hospitalId: "jhah",
    specialtyId: "intensive-care",
    month: "06",
    applicantName: "Faisal Al-Qahtani",
    applicantType: "External",
    university: "King Abdulaziz University (KAU)",
    email: "faisal.alqahtani@stu.kau.edu.sa",
    phone: "+966 50 998 7766",
    nationalId: "1009876543",
    gpa: 4.15,
    graduationYear: 2025,
    profileStrength: 66,
    status: "Alternative Suggested",
    rankingScore: 64,
    submittedAt: "2025-09-16T09:30:00.000Z",
    eligible: true,
    alternativeMonthSuggestions: ["08", "09"],
  },
  {
    id: "app-jhah-007",
    hospitalId: "jhah",
    specialtyId: "orthopedics",
    month: "09",
    applicantName: "Lama Al-Shahrani",
    applicantType: "Internal",
    university: "Imam Abdulrahman Bin Faisal University (IAU)",
    email: "lama.alshahrani@iau.edu.sa",
    phone: "+966 55 221 0099",
    nationalId: "1223456789",
    gpa: 4.35,
    graduationYear: 2026,
    profileStrength: 78,
    status: "Under Review",
    rankingScore: 80,
    submittedAt: "2025-09-19T11:20:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-008",
    hospitalId: "jhah",
    specialtyId: "psychiatry",
    month: "10",
    applicantName: "Meshari Al-Zamil",
    applicantType: "External",
    university: "King Saud bin Abdulaziz University for Health Sciences",
    email: "meshari.alzamil@ksau-hs.edu.sa",
    phone: "+966 58 445 1122",
    nationalId: "1098765432",
    gpa: 3.90,
    graduationYear: 2026,
    profileStrength: 58,
    status: "Pending",
    rankingScore: 55,
    submittedAt: "2025-09-24T13:15:00.000Z",
    eligible: true,
  },
  {
    id: "app-jhah-009",
    hospitalId: "jhah",
    specialtyId: "radiology",
    month: "11",
    applicantName: "Ghada Al-Faris",
    applicantType: "External",
    university: "Umm Al-Qura University",
    email: "ghada.alfaris@uqu.edu.sa",
    phone: "+966 54 556 7788",
    nationalId: "1234567890",
    gpa: 4.02,
    graduationYear: 2025,
    profileStrength: 61,
    status: "Rejected",
    rankingScore: 49,
    submittedAt: "2025-09-26T08:45:00.000Z",
    eligible: false,
    notes: "Missing recommendation letter",
  },
];

function bulkCountForPlan(
  hospitalId: string,
  month: MonthKey,
  specialtyId: SpecialtyId,
): number {
  const seed = `${hospitalId}:${month}:${specialtyId}:bulk`;
  // Keep demo volume mobile-safe while still showing a full specialty set.
  if (hospitalId === "kfmc" && month === "09") {
    if (specialtyId === "emergency-medicine") return 18;
    if (specialtyId === "internal-medicine") return 14;
    if (specialtyId === "general-surgery") return 10;
    if (specialtyId === "pediatrics") return 8;
    return 3 + seededInt(seed, 0, 2);
  }
  if (hospitalId === "kfmc") {
    return 2 + seededInt(seed, 0, 2);
  }
  // Light coverage for secondary demo hospitals
  return month === "09" || month === "10" ? 1 + seededInt(seed, 0, 1) : 0;
}

function buildBulkDemoApplications(): ApplicationSeed[] {
  const statuses: ApplicationStatus[] = [
    "Pending",
    "Under Review",
    "Accepted",
    "Rejected",
    "Waitlisted",
    "Pending",
    "Under Review",
  ];
  const hospitalIds = ["kfmc", "kfshrc", "jhah"] as const;
  const plans: {
    hospitalId: string;
    month: MonthKey;
    specialtyId: SpecialtyId;
    count: number;
  }[] = [];

  // Populate every month with the full specialty set so Specialties & Capacity
  // and Applications never look like a single-specialty year.
  for (const hospitalId of hospitalIds) {
    for (const month of MONTH_KEYS) {
      for (const specialty of DEMO_SPECIALTIES) {
        const count = bulkCountForPlan(hospitalId, month, specialty.id);
        if (count <= 0) continue;
        plans.push({
          hospitalId,
          month,
          specialtyId: specialty.id,
          count,
        });
      }
    }
  }

  const generated: ApplicationSeed[] = [];
  let seq = 1;

  for (const plan of plans) {
    for (let i = 0; i < plan.count; i += 1) {
      const id = `app-bulk-${plan.hospitalId}-${plan.month}-${plan.specialtyId}-${i + 1}`;
      const female = seededIntFromId(id + ":g", 0, 1) === 0;
      const first = female
        ? SAUDI_FIRST_NAMES_F[
            seededIntFromId(id + ":fn", 0, SAUDI_FIRST_NAMES_F.length - 1)
          ]!
        : SAUDI_FIRST_NAMES_M[
            seededIntFromId(id + ":fn", 0, SAUDI_FIRST_NAMES_M.length - 1)
          ]!;
      const last =
        SAUDI_LAST_NAMES[
          seededIntFromId(id + ":ln", 0, SAUDI_LAST_NAMES.length - 1)
        ]!;
      const university =
        SAUDI_UNIVERSITIES[
          seededIntFromId(id + ":uni", 0, SAUDI_UNIVERSITIES.length - 1)
        ]!;
      const applicantType: ApplicantType =
        seededIntFromId(id + ":type", 0, 2) === 0 ? "Internal" : "External";
      const gpa = Number(
        (3.4 + seededIntFromId(id + ":gpa", 0, 130) / 100).toFixed(2),
      );
      const profileStrength = seededIntFromId(id + ":ps", 45, 98);
      const eligible = seededIntFromId(id + ":el", 0, 5) !== 0;
      const meetsRequirements =
        eligible && seededIntFromId(id + ":req", 0, 4) !== 0;
      const status = statuses[seededIntFromId(id + ":st", 0, statuses.length - 1)]!;
      const day = 1 + seededIntFromId(id + ":day", 0, 27);
      const submittedAt = `2025-${plan.month}-${String(day).padStart(2, "0")}T${String(
        8 + seededIntFromId(id + ":hr", 0, 8),
      ).padStart(2, "0")}:${String(seededIntFromId(id + ":min", 0, 59)).padStart(2, "0")}:00.000Z`;
      const nationalId = String(
        1000000000 + seededIntFromId(id + ":nid", 0, 899999999),
      );
      const slug = `${first}-${last}`.toLowerCase().replace(/[^a-z-]/g, "");
      const cv = {
        id: `${id}-cv`,
        name: "Curriculum Vitae",
        kind: "CV" as const,
        uploadedAt: submittedAt,
        fileLabel: `${slug}-cv.pdf`,
      };

      generated.push({
        id,
        hospitalId: plan.hospitalId,
        specialtyId: plan.specialtyId,
        month: plan.month,
        applicantName: `${first} ${last}`,
        applicantType,
        university,
        email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, "")}${seq}@medmatch.edu.sa`,
        phone: `+966 5${seededIntFromId(id + ":ph", 0, 9)} ${String(
          seededIntFromId(id + ":ph2", 100, 999),
        )} ${String(seededIntFromId(id + ":ph3", 1000, 9999))}`,
        nationalId,
        gpa: Math.min(5, gpa),
        graduationYear: seededIntFromId(id + ":gy", 0, 4) === 0 ? 2025 : 2026,
        profileStrength,
        status,
        rankingScore: Math.min(
          99,
          Math.round(gpa * 15 + profileStrength * 0.25 + (eligible ? 8 : 0)),
        ),
        submittedAt,
        eligible,
        meetsRequirements,
        gender: female ? "Female" : "Male",
        // Keep bulk records lean for mobile/localStorage limits.
        personalStatement: `${first} is applying for ${plan.specialtyId} internship training.`,
        cv,
        documents: meetsRequirements
          ? [
              cv,
              {
                id: `${id}-tr`,
                name: "University Transcript",
                kind: "Transcript",
                uploadedAt: submittedAt,
                fileLabel: `${slug}-transcript.pdf`,
              },
            ]
          : [cv],
        requirements: [
          {
            id: `${id}-req-1`,
            label: "CV uploaded",
            mandatory: true,
            completed: true,
          },
          {
            id: `${id}-req-2`,
            label: "Transcript uploaded",
            mandatory: true,
            completed: meetsRequirements,
          },
        ],
        timeline: [
          {
            id: `${id}-tl-1`,
            label: "Application submitted",
            at: submittedAt,
          },
        ],
        acceptanceDate:
          status === "Accepted"
            ? `2025-${plan.month}-${String(Math.min(28, day + 3)).padStart(2, "0")}T10:00:00.000Z`
            : undefined,
        rejectionReason:
          status === "Rejected"
            ? "Does not meet selection criteria for this rotation month."
            : undefined,
      });
      seq += 1;
    }
  }

  return generated;
}

export const DEMO_APPLICATIONS: HospitalApplication[] = normalizeApplications([
  ...DEMO_APPLICATIONS_SEED,
  ...buildBulkDemoApplications(),
]);

/* -------------------------------------------------------------------------- */
/* Alternative suggestions                                                    */
/* -------------------------------------------------------------------------- */

export const DEMO_ALTERNATIVE_SUGGESTIONS: AlternativeSuggestion[] = [
  {
    id: "alt-001",
    applicationId: "app-kfmc-008",
    hospitalId: "kfmc",
    specialtyId: "psychiatry",
    originalMonth: "09",
    suggestedMonths: ["10", "11"],
    status: "Suggested",
    message:
      "September psychiatry rotations are nearly full. October or November still have internal and external seats.",
    createdAt: "2025-09-21T09:00:00.000Z",
  },
  {
    id: "alt-002",
    applicationId: "app-kfshrc-006",
    hospitalId: "kfshrc",
    specialtyId: "radiology",
    originalMonth: "06",
    suggestedMonths: ["07", "09", "10"],
    status: "Suggested",
    message:
      "June radiology capacity is closed for suite renovations. Please consider July, September, or October.",
    createdAt: "2025-09-18T10:30:00.000Z",
  },
  {
    id: "alt-003",
    applicationId: "app-kfshrc-007",
    hospitalId: "kfshrc",
    specialtyId: "pediatrics",
    originalMonth: "09",
    suggestedMonths: ["10"],
    status: "Accepted",
    message:
      "September pediatrics filled. October alternative offered and accepted by applicant.",
    createdAt: "2025-09-12T08:00:00.000Z",
    respondedAt: "2025-09-14T14:22:00.000Z",
  },
  {
    id: "alt-004",
    applicationId: "app-kfshrc-008",
    hospitalId: "kfshrc",
    specialtyId: "anesthesia",
    originalMonth: "10",
    suggestedMonths: ["12"],
    status: "Declined",
    message:
      "October anesthesia is full. December alternative offered; applicant declined.",
    createdAt: "2025-09-19T11:15:00.000Z",
    respondedAt: "2025-09-20T16:40:00.000Z",
  },
  {
    id: "alt-005",
    applicationId: "app-jhah-006",
    hospitalId: "jhah",
    specialtyId: "intensive-care",
    originalMonth: "06",
    suggestedMonths: ["08", "09"],
    status: "Suggested",
    message:
      "June ICU block is almost full for external applicants. August or September alternatives available.",
    createdAt: "2025-09-20T07:45:00.000Z",
  },
];

/* -------------------------------------------------------------------------- */
/* Notifications                                                              */
/* -------------------------------------------------------------------------- */

export const DEMO_NOTIFICATIONS: HospitalNotification[] = [
  {
    id: "notif-kfmc-001",
    hospitalId: "kfmc",
    type: "new_application",
    title: "New application received",
    message:
      "Abeer Al-Subaie applied for Anesthesia (November) from Qassim University.",
    createdAt: "2025-09-24T14:46:00.000Z",
    read: false,
    relatedApplicationId: "app-kfmc-010",
    relatedSpecialtyId: "anesthesia",
    relatedMonth: "11",
  },
  {
    id: "notif-kfmc-002",
    hospitalId: "kfmc",
    type: "capacity_almost_full",
    title: "Capacity almost full",
    message:
      "Emergency Medicine (January) is almost full — fewer than 20% of seats remain.",
    createdAt: "2025-09-22T09:10:00.000Z",
    read: false,
    relatedSpecialtyId: "emergency-medicine",
    relatedMonth: "01",
  },
  {
    id: "notif-kfmc-003",
    hospitalId: "kfmc",
    type: "review_reminder",
    title: "Applications awaiting review",
    message:
      "3 applications at King Fahad Medical City are still Pending or Under Review.",
    createdAt: "2025-09-23T07:00:00.000Z",
    read: true,
  },
  {
    id: "notif-kfshrc-001",
    hospitalId: "kfshrc",
    type: "alternative_accepted",
    title: "Alternative month accepted",
    message:
      "Omar Al-Shehri accepted the October pediatrics alternative (was September).",
    createdAt: "2025-09-14T14:25:00.000Z",
    read: false,
    relatedApplicationId: "app-kfshrc-007",
    relatedSpecialtyId: "pediatrics",
    relatedMonth: "10",
  },
  {
    id: "notif-kfshrc-002",
    hospitalId: "kfshrc",
    type: "alternative_declined",
    title: "Alternative month declined",
    message:
      "Sara Al-Naim declined the December anesthesia alternative.",
    createdAt: "2025-09-20T16:42:00.000Z",
    read: false,
    relatedApplicationId: "app-kfshrc-008",
    relatedSpecialtyId: "anesthesia",
    relatedMonth: "12",
  },
  {
    id: "notif-kfshrc-003",
    hospitalId: "kfshrc",
    type: "capacity_full",
    title: "Capacity full",
    message:
      "Radiology (June) has no remaining seats and is marked closed for renovations.",
    createdAt: "2025-09-18T08:00:00.000Z",
    read: true,
    relatedSpecialtyId: "radiology",
    relatedMonth: "06",
  },
  {
    id: "notif-kfshrc-004",
    hospitalId: "kfshrc",
    type: "new_application",
    title: "New application received",
    message:
      "Maha Al-Ruwaili applied for Orthopedics (April) — Internal, Alfaisal University.",
    createdAt: "2025-09-21T08:34:00.000Z",
    read: true,
    relatedApplicationId: "app-kfshrc-004",
    relatedSpecialtyId: "orthopedics",
    relatedMonth: "04",
  },
  {
    id: "notif-jhah-001",
    hospitalId: "jhah",
    type: "new_application",
    title: "New application received",
    message:
      "Meshari Al-Zamil applied for Psychiatry (October) from KSAU-HS.",
    createdAt: "2025-09-24T13:16:00.000Z",
    read: false,
    relatedApplicationId: "app-jhah-008",
    relatedSpecialtyId: "psychiatry",
    relatedMonth: "10",
  },
  {
    id: "notif-jhah-002",
    hospitalId: "jhah",
    type: "capacity_almost_full",
    title: "Capacity almost full",
    message:
      "Pediatrics (April) is almost full after recent acceptances.",
    createdAt: "2025-09-21T10:00:00.000Z",
    read: false,
    relatedSpecialtyId: "pediatrics",
    relatedMonth: "04",
  },
  {
    id: "notif-jhah-003",
    hospitalId: "jhah",
    type: "alternative_accepted",
    title: "Awaiting alternative response",
    message:
      "Alternative months suggested to Faisal Al-Qahtani for Intensive Care — awaiting reply.",
    createdAt: "2025-09-20T07:50:00.000Z",
    read: true,
    relatedApplicationId: "app-jhah-006",
    relatedSpecialtyId: "intensive-care",
    relatedMonth: "06",
  },
  {
    id: "notif-jhah-004",
    hospitalId: "jhah",
    type: "application_withdrawn",
    title: "Application rejected — docs incomplete",
    message:
      "Ghada Al-Faris (Radiology, November) was rejected: missing recommendation letter.",
    createdAt: "2025-09-26T09:00:00.000Z",
    read: false,
    relatedApplicationId: "app-jhah-009",
    relatedSpecialtyId: "radiology",
    relatedMonth: "11",
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function monthLabel(monthKey: MonthKey): string {
  const found = MONTHS.find((m) => m.key === monthKey);
  return found?.label ?? monthKey;
}

export function getHospitalById(hospitalId: string): HospitalProfile | undefined {
  return DEMO_HOSPITALS.find((h) => h.id === hospitalId);
}

export function getApplicationsForHospital(
  hospitalId: string,
  applications: HospitalApplication[] = DEMO_APPLICATIONS,
): HospitalApplication[] {
  return applications.filter((a) => a.hospitalId === hospitalId);
}

export function getSpecialtyById(
  specialtyId: SpecialtyId,
): SpecialtyMeta | undefined {
  const fromDemo = DEMO_SPECIALTIES.find((s) => s.id === specialtyId);
  if (fromDemo) return fromDemo;
  const label = SPECIALTY_LABELS[specialtyId];
  if (!label) return undefined;
  return {
    id: specialtyId,
    name: label,
    shortName: shortNameFromSpecialty(label),
  };
}

export function resolveSpecialtyName(
  specialtyId: SpecialtyId,
  specialties?: SpecialtyMeta[],
): string {
  const fromList = specialties?.find((s) => s.id === specialtyId)?.name;
  if (fromList) return fromList;
  return (
    getSpecialtyById(specialtyId)?.name ??
    SPECIALTY_LABELS[specialtyId] ??
    specialtyId
  );
}

export function getCapacity(
  hospitalId: string,
  specialtyId: SpecialtyId,
  month: MonthKey,
  capacities: SpecialtyCapacity[] = DEMO_CAPACITIES,
): SpecialtyCapacity | undefined {
  return capacities.find(
    (c) =>
      c.hospitalId === hospitalId &&
      c.specialtyId === specialtyId &&
      c.month === month,
  );
}

export function getNotificationsForHospital(
  hospitalId: string,
  notifications: HospitalNotification[] = DEMO_NOTIFICATIONS,
): HospitalNotification[] {
  return notifications
    .filter((n) => n.hospitalId === hospitalId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getAlternativesForHospital(
  hospitalId: string,
  alternatives: AlternativeSuggestion[] = DEMO_ALTERNATIVE_SUGGESTIONS,
): AlternativeSuggestion[] {
  return alternatives.filter((a) => a.hospitalId === hospitalId);
}

/**
 * Status from remaining seats:
 * - Closed if capacity.closed
 * - Full if remaining <= 0
 * - Almost Full if remaining <= 20% of total (or <= 1 when total is small)
 * - Open otherwise
 */
export function deriveCapacityStatus(
  totalSlots: number,
  remaining: number,
  closed: boolean,
): CapacityStatus {
  if (closed) return "Closed";
  if (totalSlots <= 0 || remaining <= 0) return "Full";
  const almostThreshold = Math.max(1, Math.ceil(totalSlots * 0.2));
  if (remaining <= almostThreshold) return "Almost Full";
  return "Open";
}

/**
 * Build a capacity row for one specialty × month at a hospital,
 * folding in application status counts.
 */
export function computeCapacityRow(
  specialty: SpecialtyId,
  month: MonthKey,
  hospitalId: string,
  applications: HospitalApplication[] = DEMO_APPLICATIONS,
  capacities: SpecialtyCapacity[] = DEMO_CAPACITIES,
  options?: { specialtyActive?: boolean },
): CapacityRow | null {
  const base = getCapacity(hospitalId, specialty, month, capacities);
  if (!base) return null;

  const matching = applications.filter(
    (a) =>
      a.hospitalId === hospitalId &&
      a.specialtyId === specialty &&
      a.month === month,
  );

  const totalSlots = base.internalSlots + base.externalSlots;
  const acceptedCount = matching.filter((a) =>
    isAcceptedStatus(a.status),
  ).length;
  const pendingCount = matching.filter(
    (a) => a.status === "Pending" || a.status === "Under Review",
  ).length;
  const rejectedCount = matching.filter((a) => a.status === "Rejected").length;
  const applicationCount = matching.length;
  const remaining = Math.max(0, totalSlots - acceptedCount);
  const specialtyInactive = options?.specialtyActive === false;
  const status = deriveCapacityStatus(
    totalSlots,
    remaining,
    base.closed || specialtyInactive,
  );

  return {
    ...base,
    totalSlots,
    acceptedCount,
    remaining,
    status,
    applicationCount,
    pendingCount,
    rejectedCount,
  };
}

export function computeAllCapacityRows(
  hospitalId: string,
  applications: HospitalApplication[] = DEMO_APPLICATIONS,
): CapacityRow[] {
  const rows: CapacityRow[] = [];
  for (const specialty of DEMO_SPECIALTIES) {
    for (const month of MONTH_KEYS) {
      const row = computeCapacityRow(
        specialty.id,
        month,
        hospitalId,
        applications,
      );
      if (row) rows.push(row);
    }
  }
  return rows;
}

export function isAcceptedStatus(status: ApplicationStatus): boolean {
  return status === "Accepted" || status === "Alternative Accepted";
}

export function toDisplayStatus(
  status: ApplicationStatus,
): DisplayApplicationStatus {
  if (isAcceptedStatus(status)) return "Accepted";
  if (status === "Rejected" || status === "Alternative Declined") {
    return "Rejected";
  }
  if (status === "Waitlisted") return "Waitlisted";
  return "Pending";
}

/**
 * Rank applications within a specialty × month queue:
 * 1. Internal (hospital's own university) before External
 * 2. Meets all mandatory requirements
 * 3. GPA (highest first)
 * 4. Clinical grade (highest first)
 * 5. Interview score when available (missing scores rank lower)
 * 6. Earlier application date
 *
 * Stamps rankingScore and returns a new array (does not mutate input).
 */
export function rankApplications(
  apps: HospitalApplication[],
): HospitalApplication[] {
  const sorted = [...apps].sort((a, b) => {
    if (a.applicantType !== b.applicantType) {
      return a.applicantType === "Internal" ? -1 : 1;
    }
    const aMeets = a.meetsRequirements ?? a.eligible;
    const bMeets = b.meetsRequirements ?? b.eligible;
    if (aMeets !== bMeets) return aMeets ? -1 : 1;
    if (b.gpa !== a.gpa) return b.gpa - a.gpa;
    if (b.clinicalGrade !== a.clinicalGrade) {
      return b.clinicalGrade - a.clinicalGrade;
    }
    const aInterview = a.interviewScore;
    const bInterview = b.interviewScore;
    if (aInterview == null && bInterview != null) return 1;
    if (aInterview != null && bInterview == null) return -1;
    if (aInterview != null && bInterview != null && bInterview !== aInterview) {
      return bInterview - aInterview;
    }
    return (
      new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
    );
  });

  const n = sorted.length;
  return sorted.map((app, index) => {
    const positionBoost = n === 0 ? 0 : Math.round(((n - index) / n) * 35);
    const typeBoost = app.applicantType === "Internal" ? 20 : 8;
    const reqBoost = (app.meetsRequirements ?? app.eligible) ? 15 : 0;
    const gpaBoost = Math.round((app.gpa / 5) * 15);
    const clinicalBoost = Math.round((app.clinicalGrade / 5) * 10);
    const interviewBoost =
      app.interviewScore == null
        ? 0
        : Math.round((app.interviewScore / 100) * 5);
    const rankingScore = Math.min(
      100,
      positionBoost +
        typeBoost +
        reqBoost +
        gpaBoost +
        clinicalBoost +
        interviewBoost,
    );
    return { ...app, rankingScore };
  });
}

export type ApplicationGroup = {
  key: string;
  specialtyId: SpecialtyId;
  month: MonthKey;
  applications: HospitalApplication[];
};

/** Group hospital applications by specialty + month, ranked within each group. */
export function groupApplicationsBySpecialtyMonth(
  apps: HospitalApplication[],
): ApplicationGroup[] {
  const map = new Map<string, HospitalApplication[]>();
  for (const app of apps) {
    const key = `${app.specialtyId}:${app.month}`;
    const list = map.get(key) ?? [];
    list.push(app);
    map.set(key, list);
  }

  return [...map.entries()]
    .map(([key, list]) => {
      const [specialtyId, month] = key.split(":") as [SpecialtyId, MonthKey];
      return {
        key,
        specialtyId,
        month,
        applications: rankApplications(list),
      };
    })
    .sort((a, b) => {
      const specialtyCmp = a.specialtyId.localeCompare(b.specialtyId);
      if (specialtyCmp !== 0) return specialtyCmp;
      return Number(a.month) - Number(b.month);
    });
}

export function applicationsByStatus(
  hospitalId: string,
  status: ApplicationStatus,
): HospitalApplication[] {
  return getApplicationsForHospital(hospitalId).filter(
    (a) => a.status === status,
  );
}

/** Folder counts useful for admin sidebar badges. */
export function applicationFolderCounts(hospitalId: string): Record<
  ApplicationStatus,
  number
> {
  const counts: Record<ApplicationStatus, number> = {
    Pending: 0,
    "Under Review": 0,
    Accepted: 0,
    Rejected: 0,
    Waitlisted: 0,
    "Alternative Suggested": 0,
    "Alternative Accepted": 0,
    "Alternative Declined": 0,
  };
  for (const app of getApplicationsForHospital(hospitalId)) {
    counts[app.status] += 1;
  }
  return counts;
}
