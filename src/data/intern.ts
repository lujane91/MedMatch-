export type HealthcareField =
  | "medicine"
  | "dentistry"
  | "pharmacy"
  | "nursing"
  | "allied"
  | "other";

export type TrainingStage =
  | "medical-student"
  | "intern"
  | "advanced-training"
  | "resident"
  | "fellow"
  | "medical-practice"
  | "residency"
  | "fellowship";

/** Flexible postgraduate program kinds for non physician pathways. */
export type TrainingProgramKind =
  | "advanced-training"
  | "professional-training"
  | "postgraduate-training"
  | "clinical-diploma"
  | "specialty-training";

export const ADVANCED_TRAINING_FIELDS = [
  "nursing",
  "pharmacy",
  "allied",
] as const satisfies readonly HealthcareField[];

export type AdvancedTrainingField = (typeof ADVANCED_TRAINING_FIELDS)[number];

export type ProfessionalLevel = "gp" | "specialist" | "consultant";

export type ApplicationStatus =
  | "Draft"
  | "Requirements Incomplete"
  | "Ready to Submit"
  | "Submitted"
  | "Under Review"
  | "Changes Requested"
  | "Accepted"
  | "Rejected";

export type RequirementStatus = "pending" | "uploaded" | "optional";

export type RotationRequirement = {
  id: string;
  name: string;
  required: boolean;
  instructions: string;
  status: RequirementStatus;
};

export type HospitalOption = {
  id: string;
  name: string;
  city: string;
  logo: string | null;
  availableDates: string;
  deadline: string;
  eligibility: string;
};

export type Rotation = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  specialty: string;
  preferences: string[]; // hospital ids, first = primary
  requirements: RotationRequirement[];
  status: ApplicationStatus;
  createdAt: string;
  timeline: { label: string; done: boolean; at?: string }[];
  decisionNote?: string;
  contact?: string;
  changesRequested?: string;
  changesDeadline?: string;
};

/** How the user verifies identity during onboarding (prototype). */
export type IdentityType = "national-id" | "iqama" | "passport";

export type InternProfile = {
  fullName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  /** Country of nationality (e.g. Saudi Arabia). */
  nationality: string;
  /**
   * Non-Saudi only: whether the user holds a Saudi residency permit (Iqama).
   * null when not applicable (Saudi) or unanswered.
   */
  hasSaudiIqama: boolean | null;
  /** Active identity verification route. */
  identityType: IdentityType | null;
  /**
   * National ID Number (Saudi) or Iqama Number (non-Saudi with Iqama).
   * Cleared for passport-route users.
   */
  nationalId: string;
  /** Passport number for non-Saudi users without Iqama. */
  passportNumber: string;
  /**
   * Prototype passport copy upload (data URL). Identity verification only —
   * never display on dashboard, profile, or MedJourney Passport.
   */
  passportCopyDataUrl: string;
  passportCopyFileName: string;
  email: string;
  mobile: string;
  trainingStage: TrainingStage | null;
  field: HealthcareField | null;
  professionalLevel: ProfessionalLevel | null;
  institutionEmail: string;
  university: string;
  currentYear: string;
  totalYears: string;
  internshipYear: string;
  trainingInstitution: string;
  specialty: string;
  subspecialty: string;
  trainingProgramKind: TrainingProgramKind | null;
  residencyYear: string;
  fellowshipYear: string;
  graduationYear: string;
  currentCity: string;
  preferredCities: string[];
  internshipStart: string;
  internshipEnd: string;
  photoUploaded: boolean;
  /** Prototype photo preview (data URL). Future: cloud storage. */
  photoDataUrl: string;
  cvUploaded: boolean;
  identityVerified: boolean;
  onboardingComplete: boolean;
};

/** Resolve Nafath vs passport identity route from nationality + Iqama answers. */
export function resolveIdentityRoute(
  nationality: string | null | undefined,
  hasSaudiIqama: boolean | null | undefined,
): { requiresNafath: boolean; identityType: IdentityType | null } {
  const nation = nationality?.trim() ?? "";
  if (!nation) return { requiresNafath: false, identityType: null };
  if (nation === "Saudi Arabia") {
    return { requiresNafath: true, identityType: "national-id" };
  }
  if (hasSaudiIqama === true) {
    return { requiresNafath: true, identityType: "iqama" };
  }
  if (hasSaudiIqama === false) {
    return { requiresNafath: false, identityType: "passport" };
  }
  return { requiresNafath: false, identityType: null };
}

export function requiresNafathVerification(
  profile: Pick<InternProfile, "identityType" | "nationality" | "hasSaudiIqama">,
) {
  if (profile.identityType) {
    return (
      profile.identityType === "national-id" ||
      profile.identityType === "iqama"
    );
  }
  return resolveIdentityRoute(profile.nationality, profile.hasSaudiIqama)
    .requiresNafath;
}

export const healthcareFields: {
  id: HealthcareField;
  title: string;
  description: string;
}[] = [
  {
    id: "medicine",
    title: "Medicine",
    description: "MBBS / MD graduates preparing for clinical internship.",
  },
  {
    id: "dentistry",
    title: "Dentistry",
    description: "Dental graduates completing clinical internship rotations.",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "Pharmacy graduates entering hospital or clinical training.",
  },
  {
    id: "nursing",
    title: "Nursing",
    description: "Nursing graduates completing structured internship years.",
  },
  {
    id: "allied",
    title: "Allied Health",
    description: "Therapy, imaging, lab, and rehabilitation disciplines.",
  },
  {
    id: "other",
    title: "Other Healthcare Specialties",
    description: "Other licensed healthcare training pathways.",
  },
];

export const specialtiesByField: Record<HealthcareField, string[]> = {
  medicine: [
    "Internal Medicine",
    "General Surgery",
    "Pediatrics",
    "Emergency Medicine",
    "Obstetrics and Gynecology",
    "Family Medicine",
    "Psychiatry",
    "Anesthesia",
    "Radiology",
    "Orthopedics",
    "Elective",
    "Other",
  ],
  dentistry: [
    "General Dentistry",
    "Oral Surgery",
    "Pediatric Dentistry",
    "Prosthodontics",
    "Orthodontics",
    "Periodontics",
    "Endodontics",
  ],
  pharmacy: [
    "Hospital Pharmacy",
    "Clinical Pharmacy",
    "Community Pharmacy",
    "Oncology Pharmacy",
    "Critical Care Pharmacy",
    "Drug Information",
    "Pharmaceutical Industry",
  ],
  nursing: [
    "Medical-Surgical Nursing",
    "Emergency Nursing",
    "Critical Care",
    "Pediatrics",
    "Maternity",
    "Mental Health",
    "Community Health",
  ],
  allied: [
    "Physical Therapy",
    "Occupational Therapy",
    "Radiography",
    "Laboratory Science",
    "Respiratory Therapy",
    "Speech Therapy",
    "Nutrition",
  ],
  other: [
    "Clinical Elective",
    "Research Elective",
    "Administrative Rotation",
    "Community Placement",
    "Other",
  ],
};

export const internHospitals: HospitalOption[] = [
  {
    id: "kfshrc",
    name: "King Faisal Specialist Hospital & Research Centre",
    city: "Riyadh",
    logo: "/institutions/kfshrc.svg",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "Rolling",
    eligibility: "Saudi internship eligibility letter required",
  },
  {
    id: "mngha",
    name: "Ministry of National Guard Health Affairs",
    city: "Riyadh",
    logo: "/institutions/mngha.png",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "15 May 2026",
    eligibility: "University nomination preferred",
  },
  {
    id: "kfmc",
    name: "King Fahad Medical City",
    city: "Riyadh",
    logo: "/institutions/kfmc.png",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "1 Jun 2026",
    eligibility: "Transcript and BLS certificate required",
  },
  {
    id: "ksumc",
    name: "King Saud University Medical City",
    city: "Riyadh",
    logo: "/institutions/ksumc.png",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "Rolling",
    eligibility: "Open to KSU and non-KSU interns",
  },
  {
    id: "jhah",
    name: "Johns Hopkins Aramco Healthcare",
    city: "Dhahran",
    logo: "/institutions/jhah.svg",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "30 Apr 2026",
    eligibility: "English proficiency preferred",
  },
  {
    id: "kfsh-dammam",
    name: "King Fahad Specialist Hospital Dammam",
    city: "Dammam",
    logo: "/institutions/kfsh-dammam.svg",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "Rolling",
    eligibility: "Eastern Province placements available",
  },
  {
    id: "hmg",
    name: "Dr. Sulaiman Al Habib Medical Group",
    city: "Riyadh",
    logo: "/institutions/hmg.svg",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "Rolling",
    eligibility: "Private-sector internship pathway",
  },
  {
    id: "mouwasat",
    name: "Mouwasat Medical Services",
    city: "Dammam",
    logo: "/institutions/mouwasat.png",
    availableDates: "Jul 2026 – Jun 2027",
    deadline: "Rolling",
    eligibility: "Multi-city hospital network",
  },
];

export const defaultRequirements = (): RotationRequirement[] => [
  {
    id: "cv",
    name: "CV",
    required: true,
    instructions: "Upload your latest CV (PDF preferred).",
    status: "pending",
  },
  {
    id: "id",
    name: "National ID or Iqama",
    required: true,
    instructions: "Clear scan of both sides.",
    status: "pending",
  },
  {
    id: "university-letter",
    name: "University letter",
    required: true,
    instructions: "Official internship eligibility confirmation.",
    status: "pending",
  },
  {
    id: "transcript",
    name: "Academic transcript",
    required: true,
    instructions: "Latest official or provisional transcript.",
    status: "pending",
  },
  {
    id: "eligibility",
    name: "Internship eligibility letter",
    required: true,
    instructions: "SCFHS or university internship clearance.",
    status: "pending",
  },
  {
    id: "vaccination",
    name: "Vaccination record",
    required: true,
    instructions: "Include required clinical immunizations.",
    status: "pending",
  },
  {
    id: "bls",
    name: "BLS certificate",
    required: true,
    instructions: "Valid Basic Life Support certification.",
    status: "pending",
  },
  {
    id: "photo",
    name: "Personal photo",
    required: false,
    instructions: "Passport-style photo on white background.",
    status: "optional",
  },
  {
    id: "recommendation",
    name: "Recommendation letter",
    required: false,
    instructions: "From a clinical supervisor or faculty member.",
    status: "optional",
  },
  {
    id: "sop",
    name: "Statement of purpose",
    required: false,
    instructions: "Short motivation for this specialty and hospital.",
    status: "optional",
  },
];

export function defaultInternshipDates(reference = new Date()) {
  const year =
    reference.getMonth() >= 6 ? reference.getFullYear() : reference.getFullYear() - 1;
  return {
    start: `${year}-07-01`,
    end: `${year + 1}-06-30`,
  };
}

export function fieldLabel(field: HealthcareField | null) {
  return healthcareFields.find((f) => f.id === field)?.title ?? "Healthcare";
}

export function isAdvancedTrainingField(
  field: HealthcareField | null | undefined,
): field is AdvancedTrainingField {
  return (
    field === "nursing" || field === "pharmacy" || field === "allied"
  );
}

export function needsProfessionalLevel(
  stage: TrainingStage | null | undefined,
  field: HealthcareField | null | undefined,
) {
  return (
    stage === "medical-practice" &&
    (field === "medicine" || field === "dentistry")
  );
}

export function trainingStageLabel(stage: TrainingStage | null | undefined) {
  switch (stage) {
    case "medical-student":
      return "Medical Student";
    case "intern":
      return "Intern";
    case "advanced-training":
      return "Advanced Training";
    case "resident":
    case "residency":
      return "Resident";
    case "fellow":
    case "fellowship":
      return "Fellow";
    case "medical-practice":
      return "Medical Practice";
    default:
      return "";
  }
}

export function professionalLevelLabel(
  level: ProfessionalLevel | null | undefined,
) {
  switch (level) {
    case "gp":
      return "General Practitioner";
    case "specialist":
      return "Specialist";
    case "consultant":
      return "Consultant";
    default:
      return "";
  }
}

/** Compose display name from structured name parts. */
export function composeFullName(
  firstName: string,
  middleName: string,
  lastName: string,
) {
  return [firstName, middleName, lastName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

/**
 * Journey Path options for Complete Your Account.
 * Advanced Training is not offered in active onboarding.
 */
export function journeyPathsForField(
  field: HealthcareField | null,
): TrainingStage[] {
  if (!field) return [];
  return [
    "medical-student",
    "intern",
    "resident",
    "fellow",
    "medical-practice",
  ];
}

export function formatTrainingYearProgress(
  currentYear: string | null | undefined,
  totalYears: string | null | undefined,
) {
  const current = currentYear?.trim();
  const total = totalYears?.trim();
  if (!current || !total) return "";
  return `Year ${current} of ${total}`;
}

export function getPassportFacts(profile: InternProfile) {
  const facts: string[] = [];
  if (profile.field) {
    facts.push(fieldLabel(profile.field));
  }
  const level = professionalLevelLabel(profile.professionalLevel);
  if (level) {
    facts.push(level);
  } else {
    const stage = trainingStageLabel(profile.trainingStage);
    if (stage) facts.push(stage);
  }
  const program = profile.specialty?.trim();
  if (program) facts.push(program);
  const subspecialty = profile.subspecialty?.trim();
  if (subspecialty) facts.push(subspecialty);
  const year = formatTrainingYearProgress(
    profile.currentYear,
    profile.totalYears,
  );
  if (year) facts.push(year);
  const institution =
    profile.trainingInstitution?.trim() || profile.university?.trim();
  if (institution) facts.push(institution);
  return facts;
}

export function hospitalById(id: string) {
  return internHospitals.find((h) => h.id === id);
}

export function statusTone(status: ApplicationStatus) {
  switch (status) {
    case "Accepted":
      return "teal";
    case "Under Review":
    case "Submitted":
    case "Ready to Submit":
      return "light-teal";
    case "Changes Requested":
      return "amber";
    case "Rejected":
      return "red";
    default:
      return "gray";
  }
}

export function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) {
  return aStart <= bEnd && bStart <= aEnd;
}

export function withinYear(
  start: string,
  end: string,
  yearStart: string,
  yearEnd: string,
) {
  return start >= yearStart && end <= yearEnd && start <= end;
}

export function createTimeline(status: ApplicationStatus, createdAt: string) {
  const submitted = ![
    "Draft",
    "Requirements Incomplete",
    "Ready to Submit",
  ].includes(status);
  const review = [
    "Under Review",
    "Changes Requested",
    "Accepted",
    "Rejected",
  ].includes(status);
  const decided = status === "Accepted" || status === "Rejected";

  return [
    { label: "Rotation created", done: true, at: createdAt },
    {
      label: "Requirements completed",
      done: status !== "Draft" && status !== "Requirements Incomplete",
    },
    { label: "Application submitted", done: submitted },
    { label: "Under review", done: review },
    { label: "Final decision", done: decided },
  ];
}

export function deriveStatus(
  requirements: RotationRequirement[],
  explicit?: ApplicationStatus,
): ApplicationStatus {
  if (
    explicit &&
    !["Draft", "Requirements Incomplete", "Ready to Submit"].includes(explicit)
  ) {
    return explicit;
  }
  const missing = requirements.some((r) => r.required && r.status === "pending");
  if (missing) return "Requirements Incomplete";
  return "Ready to Submit";
}
