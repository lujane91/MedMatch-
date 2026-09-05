import type { HealthcareField, TrainingStage } from "@/data/intern";
import { fieldLabel, healthcareFields, trainingStageLabel } from "@/data/intern";
import type { HealthcareFieldLabel } from "@/data/research";

export type CourseProviderKind =
  | "Hospital"
  | "University"
  | "Training Center"
  | "Medical Society"
  | "Healthcare Organization";

export type CourseType =
  | "Certification"
  | "Clinical Skills"
  | "Procedural Workshop"
  | "Simulation"
  | "Ultrasound"
  | "Emergency and Critical Care"
  | "Specialty Course"
  | "Professional Development";

export type CourseRecord = {
  id: string;
  title: string;
  provider: string;
  providerKind: CourseProviderKind;
  institution: string;
  city: string;
  country: string;
  healthcareFields: HealthcareFieldLabel[];
  specialty: string;
  category: string;
  courseType: CourseType;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  description: string;
  whoCanAttend: string[];
  requirements?: string;
  certification?: string;
  duration: string;
  availableSeats?: number;
  fee?: string;
  registrationUrl?: string;
  /** Future: verified completion for Passport — never set by view/save alone. */
  verified?: boolean;
  recommendationTags: string[];
};

export type CoursePreferences = {
  healthcareFields: HealthcareFieldLabel[];
  specialties: string[];
  cities: string[];
  countries: string[];
  journeyStage: string;
};

export const COURSE_TYPES: CourseType[] = [
  "Certification",
  "Clinical Skills",
  "Procedural Workshop",
  "Simulation",
  "Ultrasound",
  "Emergency and Critical Care",
  "Specialty Course",
  "Professional Development",
];

export const COURSE_CITIES = ["Riyadh", "Jeddah", "Dammam", "Khobar"];

export const COURSE_COUNTRIES = ["Saudi Arabia"];

export const COURSE_FIELD_OPTIONS = healthcareFields.map(
  (f) => f.title as HealthcareFieldLabel,
);

export const DEFAULT_COURSE_PREFERENCES: CoursePreferences = {
  healthcareFields: [],
  specialties: [],
  cities: [],
  countries: ["Saudi Arabia"],
  journeyStage: "",
};

/** Future Passport stamp types for verified course completion only. */
export const COURSE_PASSPORT_STAMP_TYPES = [
  "BLS Completed",
  "ACLS Completed",
  "ATLS Completed",
  "PALS Completed",
  "NRP Completed",
  "EFAST Workshop Completed",
  "Echocardiography Workshop Completed",
  "Course Completed",
] as const;

export type CoursePassportStampType =
  (typeof COURSE_PASSPORT_STAMP_TYPES)[number];

export type CourseAccomplishmentRecord = {
  id: string;
  courseId: string;
  userId: string;
  stampType: CoursePassportStampType;
  verified: boolean;
  completedAt: string;
  title: string;
};

export function preferencesFromProfile(input: {
  field: HealthcareField | null;
  specialty: string;
  trainingStage: TrainingStage | null;
  currentCity?: string;
}): CoursePreferences {
  const field = fieldLabel(input.field) as HealthcareFieldLabel | "";
  const stage = trainingStageLabel(input.trainingStage) || "";
  return {
    healthcareFields: field ? [field as HealthcareFieldLabel] : [],
    specialties: input.specialty.trim() ? [input.specialty.trim()] : [],
    cities: input.currentCity?.trim() ? [input.currentCity.trim()] : [],
    countries: ["Saudi Arabia"],
    journeyStage: stage,
  };
}

/**
 * Demo / prototype course listings only.
 * Provider and institution names are mock data for product demos.
 */
export const SEED_COURSES: CourseRecord[] = [
  {
    id: "course-bls",
    title: "Basic Life Support (BLS)",
    provider: "Demo Life Support Academy",
    providerKind: "Training Center",
    institution: "Demo Clinical Skills Center — Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing", "Allied Health", "Dentistry", "Pharmacy"],
    specialty: "Emergency Medicine",
    category: "Life Support",
    courseType: "Certification",
    startDate: "2027-05-12",
    endDate: "2027-05-12",
    registrationDeadline: "2027-05-01",
    description:
      "Demo certification course covering high-quality CPR, AED use, and basic emergency response for healthcare providers.",
    whoCanAttend: ["Student", "Intern", "Resident", "Fellow", "Medical Practice", "Nursing", "Allied Health"],
    requirements: "Healthcare student or licensed professional.",
    certification: "BLS Provider Certificate (demo)",
    duration: "1 day",
    availableSeats: 24,
    fee: "SAR 450",
    registrationUrl: "https://example.com/demo-bls",
    recommendationTags: ["bls", "life support", "cpr", "emergency", "acls"],
  },
  {
    id: "course-acls",
    title: "Advanced Cardiovascular Life Support (ACLS)",
    provider: "Demo Cardiac Education Network",
    providerKind: "Medical Society",
    institution: "Demo National Heart Training Hub",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing"],
    specialty: "Cardiology",
    category: "Life Support",
    courseType: "Certification",
    startDate: "2027-06-08",
    endDate: "2027-06-09",
    registrationDeadline: "2027-05-25",
    description:
      "Demo two-day ACLS course focused on cardiac arrest algorithms, airway management, and team-based resuscitation.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Critical Care Nursing"],
    requirements: "Valid BLS recommended.",
    certification: "ACLS Provider Certificate (demo)",
    duration: "2 days",
    availableSeats: 18,
    fee: "SAR 1,200",
    registrationUrl: "https://example.com/demo-acls",
    recommendationTags: ["acls", "cardiology", "emergency", "critical care", "ecg", "bls"],
  },
  {
    id: "course-atls",
    title: "Advanced Trauma Life Support (ATLS)",
    provider: "Demo Trauma Education Collaborative",
    providerKind: "Healthcare Organization",
    institution: "Demo Trauma Skills Institute",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine"],
    specialty: "Emergency Medicine",
    category: "Trauma",
    courseType: "Certification",
    startDate: "2027-07-18",
    endDate: "2027-07-20",
    registrationDeadline: "2027-07-01",
    description:
      "Demo ATLS provider course covering systematic trauma assessment and early management of injured patients.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice"],
    requirements: "Physician or senior trainee in acute care specialties.",
    certification: "ATLS Provider Certificate (demo)",
    duration: "3 days",
    availableSeats: 16,
    fee: "SAR 2,800",
    registrationUrl: "https://example.com/demo-atls",
    recommendationTags: ["atls", "trauma", "emergency", "efast", "airway"],
  },
  {
    id: "course-pals",
    title: "Pediatric Advanced Life Support (PALS)",
    provider: "Demo Pediatric Resuscitation Group",
    providerKind: "Medical Society",
    institution: "Demo Children's Clinical Training Center",
    city: "Jeddah",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing"],
    specialty: "Pediatrics",
    category: "Life Support",
    courseType: "Certification",
    startDate: "2027-08-14",
    endDate: "2027-08-15",
    registrationDeadline: "2027-08-01",
    description:
      "Demo PALS course for recognition and management of critically ill infants and children.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Pediatric Nursing"],
    requirements: "Clinical role involving pediatric patients preferred.",
    certification: "PALS Provider Certificate (demo)",
    duration: "2 days",
    availableSeats: 20,
    fee: "SAR 1,100",
    registrationUrl: "https://example.com/demo-pals",
    recommendationTags: ["pals", "pediatrics", "emergency", "nrp", "bls"],
  },
  {
    id: "course-nrp",
    title: "Neonatal Resuscitation Program (NRP)",
    provider: "Demo Neonatal Care Academy",
    providerKind: "Training Center",
    institution: "Demo Perinatal Skills Lab",
    city: "Dammam",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing"],
    specialty: "Pediatrics",
    category: "Neonatal",
    courseType: "Certification",
    startDate: "2027-09-05",
    endDate: "2027-09-05",
    registrationDeadline: "2027-08-22",
    description:
      "Demo NRP workshop covering initial steps of newborn resuscitation and team communication.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Nursing"],
    requirements: "Interest in neonatal or perinatal care.",
    certification: "NRP Provider Certificate (demo)",
    duration: "1 day",
    availableSeats: 22,
    fee: "SAR 750",
    registrationUrl: "https://example.com/demo-nrp",
    recommendationTags: ["nrp", "pediatrics", "neonatal", "pals"],
  },
  {
    id: "course-efast",
    title: "EFAST Workshop",
    provider: "Demo Emergency Ultrasound Lab",
    providerKind: "Hospital",
    institution: "Demo Acute Care Simulation Hospital",
    city: "Jeddah",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine"],
    specialty: "Emergency Medicine",
    category: "Ultrasound",
    courseType: "Ultrasound",
    startDate: "2027-08-08",
    endDate: "2027-08-08",
    registrationDeadline: "2027-07-28",
    description:
      "Demo hands-on Extended Focused Assessment with Sonography for Trauma (EFAST) skills workshop.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice"],
    requirements: "Basic ultrasound familiarity helpful but not required.",
    certification: "Workshop attendance certificate (demo)",
    duration: "1 day",
    availableSeats: 14,
    fee: "SAR 900",
    registrationUrl: "https://example.com/demo-efast",
    recommendationTags: ["efast", "ultrasound", "trauma", "emergency", "pocus"],
  },
  {
    id: "course-pocus",
    title: "Point of Care Ultrasound Workshop",
    provider: "Demo POCUS Education Hub",
    providerKind: "University",
    institution: "Demo University Clinical Skills Center",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Allied Health"],
    specialty: "Emergency Medicine",
    category: "Ultrasound",
    courseType: "Ultrasound",
    startDate: "2027-10-02",
    endDate: "2027-10-03",
    registrationDeadline: "2027-09-18",
    description:
      "Demo POCUS workshop covering lung, cardiac, and abdominal bedside ultrasound for acute care.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Allied Health"],
    certification: "Workshop attendance certificate (demo)",
    duration: "2 days",
    availableSeats: 16,
    fee: "SAR 1,500",
    registrationUrl: "https://example.com/demo-pocus",
    recommendationTags: ["pocus", "ultrasound", "emergency", "efast", "echo"],
  },
  {
    id: "course-echo",
    title: "Echocardiography Workshop",
    provider: "Demo Cardiovascular Imaging Institute",
    providerKind: "Hospital",
    institution: "Demo Heart Imaging Training Suite",
    city: "Khobar",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Allied Health"],
    specialty: "Cardiology",
    category: "Imaging",
    courseType: "Specialty Course",
    startDate: "2027-11-12",
    endDate: "2027-11-13",
    registrationDeadline: "2027-10-28",
    description:
      "Demo introductory echocardiography workshop with supervised scanning practice.",
    whoCanAttend: ["Resident", "Fellow", "Medical Practice", "Cardiac Sonography"],
    requirements: "Cardiology interest or acute care practice.",
    certification: "Workshop attendance certificate (demo)",
    duration: "2 days",
    availableSeats: 12,
    fee: "SAR 1,800",
    registrationUrl: "https://example.com/demo-echo",
    recommendationTags: ["echo", "echocardiography", "cardiology", "ultrasound", "acls", "ecg"],
  },
  {
    id: "course-lp",
    title: "Lumbar Puncture Workshop",
    provider: "Demo Procedural Skills Academy",
    providerKind: "Training Center",
    institution: "Demo Procedural Skills Lab",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine"],
    specialty: "Internal Medicine",
    category: "Clinical Skills",
    courseType: "Procedural Workshop",
    startDate: "2027-06-21",
    endDate: "2027-06-21",
    registrationDeadline: "2027-06-10",
    description:
      "Demo lumbar puncture workshop with manikin practice, indications, and complication management.",
    whoCanAttend: ["Student", "Intern", "Resident", "Fellow"],
    certification: "Skills workshop certificate (demo)",
    duration: "Half day",
    availableSeats: 12,
    fee: "SAR 650",
    registrationUrl: "https://example.com/demo-lp",
    recommendationTags: ["lumbar puncture", "procedural", "clinical skills", "internal medicine"],
  },
  {
    id: "course-airway",
    title: "Airway Management Workshop",
    provider: "Demo Airway & Simulation Collective",
    providerKind: "Training Center",
    institution: "Demo Emergency Simulation Center",
    city: "Jeddah",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing"],
    specialty: "Emergency Medicine",
    category: "Airway",
    courseType: "Emergency and Critical Care",
    startDate: "2027-07-03",
    endDate: "2027-07-03",
    registrationDeadline: "2027-06-20",
    description:
      "Demo airway workshop covering bag-mask ventilation, laryngoscopy, and failed airway strategies.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Critical Care Nursing"],
    certification: "Workshop attendance certificate (demo)",
    duration: "1 day",
    availableSeats: 15,
    fee: "SAR 950",
    registrationUrl: "https://example.com/demo-airway",
    recommendationTags: ["airway", "emergency", "critical care", "simulation", "acls", "atls"],
  },
  {
    id: "course-ecg",
    title: "ECG Interpretation Course",
    provider: "Demo ECG Mastery Program",
    providerKind: "Healthcare Organization",
    institution: "Demo Cardiology Education Suite",
    city: "Dammam",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing", "Allied Health"],
    specialty: "Cardiology",
    category: "Diagnostics",
    courseType: "Specialty Course",
    startDate: "2027-05-28",
    endDate: "2027-05-28",
    registrationDeadline: "2027-05-18",
    description:
      "Demo ECG interpretation course from fundamentals to ischemia, arrhythmias, and case review.",
    whoCanAttend: ["Student", "Intern", "Resident", "Fellow", "Medical Practice", "Nursing"],
    certification: "Course completion certificate (demo)",
    duration: "1 day",
    availableSeats: 30,
    fee: "SAR 500",
    registrationUrl: "https://example.com/demo-ecg",
    recommendationTags: ["ecg", "cardiology", "acls", "emergency"],
  },
  {
    id: "course-suture",
    title: "Suturing Workshop",
    provider: "Demo Surgical Skills Studio",
    providerKind: "University",
    institution: "Demo University Surgical Skills Center",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Dentistry", "Nursing"],
    specialty: "General Surgery",
    category: "Clinical Skills",
    courseType: "Clinical Skills",
    startDate: "2027-06-15",
    endDate: "2027-06-15",
    registrationDeadline: "2027-06-05",
    description:
      "Demo suturing workshop covering knot tying, simple interrupted sutures, and wound care basics.",
    whoCanAttend: ["Student", "Intern", "Resident", "Dentistry", "Nursing"],
    certification: "Skills workshop certificate (demo)",
    duration: "Half day",
    availableSeats: 20,
    fee: "SAR 400",
    registrationUrl: "https://example.com/demo-suturing",
    recommendationTags: ["suturing", "clinical skills", "surgery", "procedural"],
  },
  {
    id: "course-central-line",
    title: "Central Line Workshop",
    provider: "Demo Critical Care Skills Network",
    providerKind: "Hospital",
    institution: "Demo ICU Procedural Training Unit",
    city: "Khobar",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine"],
    specialty: "Critical Care",
    category: "Procedural",
    courseType: "Procedural Workshop",
    startDate: "2027-09-19",
    endDate: "2027-09-19",
    registrationDeadline: "2027-09-05",
    description:
      "Demo ultrasound-guided central venous catheter insertion workshop with supervised practice.",
    whoCanAttend: ["Resident", "Fellow", "Medical Practice"],
    requirements: "Acute care clinical role preferred.",
    certification: "Procedural workshop certificate (demo)",
    duration: "1 day",
    availableSeats: 10,
    fee: "SAR 1,100",
    registrationUrl: "https://example.com/demo-central-line",
    recommendationTags: ["central line", "critical care", "ultrasound", "procedural", "emergency"],
  },
  {
    id: "course-vent",
    title: "Mechanical Ventilation Course",
    provider: "Demo Respiratory Care Academy",
    providerKind: "Healthcare Organization",
    institution: "Demo Critical Care Education Center",
    city: "Jeddah",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing", "Allied Health"],
    specialty: "Critical Care",
    category: "Critical Care",
    courseType: "Emergency and Critical Care",
    startDate: "2027-10-20",
    endDate: "2027-10-21",
    registrationDeadline: "2027-10-05",
    description:
      "Demo mechanical ventilation course covering modes, troubleshooting, and liberation strategies.",
    whoCanAttend: ["Resident", "Fellow", "Medical Practice", "Critical Care Nursing", "Respiratory Therapy"],
    certification: "Course completion certificate (demo)",
    duration: "2 days",
    availableSeats: 18,
    fee: "SAR 1,350",
    registrationUrl: "https://example.com/demo-ventilation",
    recommendationTags: ["ventilation", "critical care", "emergency", "airway"],
  },
  {
    id: "course-em-sim",
    title: "Emergency Medicine Simulation Workshop",
    provider: "Demo Simulation Education Network",
    providerKind: "Training Center",
    institution: "Demo Immersive Simulation Center",
    city: "Riyadh",
    country: "Saudi Arabia",
    healthcareFields: ["Medicine", "Nursing"],
    specialty: "Emergency Medicine",
    category: "Simulation",
    courseType: "Simulation",
    startDate: "2027-11-28",
    endDate: "2027-11-28",
    registrationDeadline: "2027-11-14",
    description:
      "Demo high-fidelity emergency simulation workshop with team leadership and debriefing.",
    whoCanAttend: ["Intern", "Resident", "Fellow", "Medical Practice", "Emergency Nursing"],
    certification: "Simulation workshop certificate (demo)",
    duration: "1 day",
    availableSeats: 16,
    fee: "SAR 1,000",
    registrationUrl: "https://example.com/demo-em-sim",
    recommendationTags: ["simulation", "emergency", "airway", "acls", "atls", "team"],
  },
];

export function formatCourseDateRange(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const sameDay = startDate === endDate;
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  if (sameDay) return start.toLocaleDateString("en-US", opts);
  return `${start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })} to ${end.toLocaleDateString("en-US", opts)}`;
}

export function isCourseUpcoming(course: CourseRecord, todayIso = todayDateIso()) {
  return course.endDate >= todayIso;
}

export function todayDateIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function specialtyBoostTags(specialty: string): string[] {
  const s = specialty.toLowerCase();
  if (s.includes("emergency")) {
    return [
      "atls",
      "acls",
      "bls",
      "pals",
      "efast",
      "pocus",
      "ultrasound",
      "airway",
      "simulation",
      "trauma",
    ];
  }
  if (s.includes("pediatr")) {
    return ["pals", "nrp", "pediatrics", "bls", "emergency"];
  }
  if (s.includes("cardio")) {
    return ["acls", "ecg", "echo", "echocardiography", "cardiology", "bls"];
  }
  if (s.includes("critical")) {
    return ["ventilation", "central line", "airway", "critical care", "acls"];
  }
  if (s.includes("surg")) {
    return ["suturing", "procedural", "clinical skills", "trauma"];
  }
  return [];
}

export function courseMatchScore(
  course: CourseRecord,
  prefs: CoursePreferences,
) {
  let score = 0;
  if (
    prefs.healthcareFields.length &&
    course.healthcareFields.some((f) => prefs.healthcareFields.includes(f))
  ) {
    score += 3;
  }
  if (
    prefs.specialties.length &&
    prefs.specialties.some(
      (s) =>
        course.specialty.toLowerCase().includes(s.toLowerCase()) ||
        s.toLowerCase().includes(course.specialty.toLowerCase()),
    )
  ) {
    score += 4;
  }
  const boostTags = prefs.specialties.flatMap(specialtyBoostTags);
  if (boostTags.length) {
    const hits = course.recommendationTags.filter((tag) =>
      boostTags.includes(tag.toLowerCase()),
    ).length;
    score += hits * 2;
  }
  if (
    prefs.cities.length &&
    prefs.cities.some(
      (c) => c.toLowerCase() === course.city.toLowerCase(),
    )
  ) {
    score += 1;
  }
  if (
    prefs.countries.length &&
    prefs.countries.includes(course.country)
  ) {
    score += 1;
  }
  if (prefs.journeyStage) {
    const stage = prefs.journeyStage.toLowerCase();
    if (
      course.whoCanAttend.some((w) => w.toLowerCase().includes(stage)) ||
      course.whoCanAttend.some((w) => stage.includes(w.toLowerCase()))
    ) {
      score += 2;
    }
  }
  return score;
}

export function courseMatchesSearch(course: CourseRecord, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [
    course.title,
    course.provider,
    course.institution,
    course.specialty,
    course.city,
    course.category,
    course.courseType,
    course.country,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}
