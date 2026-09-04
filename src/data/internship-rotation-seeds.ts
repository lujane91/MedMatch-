/**
 * Demo internship rotation opportunity catalog (prototype only).
 * Does not represent real hospital offerings outside DEMO mode.
 */

import type { HealthcareField } from "@/data/intern";
import { SAUDI_HOSPITALS } from "@/data/saudi-hospitals";
import type { TrainingDocumentType } from "@/data/training-documents";

const MEDJOURNEY_APPLICATION_FEE_SAR = 100;

const TRAINING_MONTHS = [
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

type TrainingRequirement = {
  id: string;
  documentType: TrainingDocumentType;
  required: boolean;
  label: string;
};

type InternshipSeedOpportunity = {
  id: string;
  trainingType: "internship-rotation";
  hospital: string;
  city: string;
  healthcareField: HealthcareField;
  specialty: string;
  subspecialty: string;
  month: string;
  startDate: string;
  endDate: string;
  datesFixed: boolean;
  availableSpots: number;
  applicationDeadline: string;
  medjourneyApplicationFeeSar: number;
  hospitalFee:
    | { kind: "none" }
    | { kind: "fee"; amountSar: number };
  requirements: TrainingRequirement[];
  description: string;
  status: "Open";
};

function req(
  id: string,
  documentType: TrainingDocumentType,
  required: boolean,
  label: string,
): TrainingRequirement {
  return { id, documentType, required, label };
}

/** Varied requirement sets for internship rotations. */
export const INTERNSHIP_DOC_SETS: TrainingRequirement[][] = [
  [
    req("r1", "cv", true, "CV"),
    req("r2", "internship-letter", true, "Internship Letter"),
    req("r3", "university-letter", true, "University Letter"),
    req("r4", "academic-transcript", true, "Academic Transcript"),
    req("r5", "national-id", true, "National ID or Iqama"),
    req("r6", "vaccination-record", true, "Vaccination Record"),
    req("r7", "recommendation-letter", false, "Recommendation Letter"),
  ],
  [
    req("r1", "cv", true, "CV"),
    req("r2", "internship-letter", true, "Internship Letter"),
    req("r3", "vaccination-record", true, "Vaccination Record"),
    req("r4", "national-id", true, "National ID or Iqama"),
    req("r5", "health-clearance", true, "Health Clearance"),
    req("r6", "recommendation-letter", false, "Recommendation Letter"),
  ],
  [
    req("r1", "cv", true, "CV"),
    req("r2", "internship-letter", true, "Internship Letter"),
    req("r3", "academic-transcript", true, "Academic Transcript"),
    req("r4", "national-id", true, "National ID or Iqama"),
    req("r5", "vaccination-record", true, "Vaccination Record"),
    req("r6", "additional-hospital-document", false, "Additional Hospital Document"),
  ],
];

const INTERNSHIP_SPECIALTIES = [
  "Emergency Medicine",
  "Internal Medicine",
  "General Surgery",
  "Pediatrics",
  "Obstetrics and Gynecology",
  "Family Medicine",
  "Psychiatry",
  "Orthopedics",
  "Anesthesiology",
  "Radiology",
  "ICU",
  "Cardiology",
  "Neurology",
  "ENT",
  "Ophthalmology",
] as const;

/** Prototype internship year months: July 2027 → July 2028. */
export const DEFAULT_INTERNSHIP_MONTH_KEYS = [
  "2027-07",
  "2027-08",
  "2027-09",
  "2027-10",
  "2027-11",
  "2027-12",
  "2028-01",
  "2028-02",
  "2028-03",
  "2028-04",
  "2028-05",
  "2028-06",
  "2028-07",
] as const;

export type InternshipCalendarMonth = {
  key: string;
  label: string;
  monthName: string;
  year: number;
  startDate: string;
  endDate: string;
};

export function buildInternshipCalendarMonths(
  startIso = "2027-07-01",
  endIso = "2028-07-31",
): InternshipCalendarMonth[] {
  const start = new Date(`${startIso.slice(0, 7)}-01T12:00:00`);
  const end = new Date(`${endIso.slice(0, 7)}-01T12:00:00`);
  const months: InternshipCalendarMonth[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const year = cursor.getFullYear();
    const monthIndex = cursor.getMonth();
    const monthName = TRAINING_MONTHS[monthIndex];
    const key = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    months.push({
      key,
      label: `${monthName} ${year}`,
      monthName,
      year,
      startDate: `${key}-01`,
      endDate: `${key}-${String(lastDay).padStart(2, "0")}`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

export function monthKeyFromIso(iso: string) {
  return iso.slice(0, 7);
}

export function formatInternshipMonthLabel(monthKey: string) {
  const [y, m] = monthKey.split("-").map(Number);
  if (!y || !m) return monthKey;
  return `${TRAINING_MONTHS[m - 1]} ${y}`;
}

function hospitalPool() {
  return SAUDI_HOSPITALS.filter((h) =>
    ["Riyadh", "Jeddah", "Dammam", "Al Khobar", "Makkah", "Al Ahsa"].includes(
      h.city,
    ),
  );
}

/**
 * Generate 60+ demo internship rotation opportunities across hospitals,
 * specialties, cities, and internship-year months.
 */
export function buildInternshipRotationSeeds(): InternshipSeedOpportunity[] {
  const hospitals = hospitalPool();
  const calendar = buildInternshipCalendarMonths();
  const seeds: InternshipSeedOpportunity[] = [];
  let n = 0;

  while (seeds.length < 64) {
    const hospital = hospitals[n % hospitals.length];
    const specialty =
      INTERNSHIP_SPECIALTIES[n % INTERNSHIP_SPECIALTIES.length];
    const month = calendar[n % calendar.length];
    const docs = INTERNSHIP_DOC_SETS[n % INTERNSHIP_DOC_SETS.length];
    const feeKind = n % 5 === 0 ? ("fee" as const) : ("none" as const);
    const id = `opp-in-demo-${String(n + 1).padStart(3, "0")}`;

    seeds.push({
      id,
      trainingType: "internship-rotation",
      hospital: hospital.name,
      city: hospital.city,
      healthcareField: "medicine" as HealthcareField,
      specialty,
      subspecialty: "",
      month: month.monthName,
      startDate: month.startDate,
      endDate: month.endDate,
      datesFixed: n % 4 !== 0,
      availableSpots: 2 + (n % 5),
      applicationDeadline: (() => {
        const d = new Date(`${month.startDate}T12:00:00`);
        d.setDate(d.getDate() - 45);
        return d.toISOString().slice(0, 10);
      })(),
      medjourneyApplicationFeeSar: MEDJOURNEY_APPLICATION_FEE_SAR,
      hospitalFee:
        feeKind === "fee"
          ? { kind: "fee", amountSar: 50 + (n % 4) * 25 }
          : { kind: "none" },
      requirements: docs,
      description: `Demo internship rotation in ${specialty} at ${hospital.name}. Prototype listing for MedJourney DEMO only.`,
      status: "Open",
    });
    n += 1;
  }

  return seeds;
}

export const SEED_INTERNSHIP_ROTATIONS = buildInternshipRotationSeeds();
