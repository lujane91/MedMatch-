import type { HealthcareField } from "@/data/intern";
import { fieldLabel, healthcareFields } from "@/data/intern";
import type { HealthcareFieldLabel } from "@/data/research";

export type ConferenceLocationType = "Saudi Arabia" | "International";

export type ConferenceType =
  | "Scientific Congress"
  | "Specialty Symposium"
  | "Workshop"
  | "Poster Session"
  | "Annual Meeting"
  | "Other";

export type ConferenceRecord = {
  id: string;
  name: string;
  country: string;
  city: string;
  locationType: ConferenceLocationType;
  startDate: string;
  endDate: string;
  healthcareFields: HealthcareFieldLabel[];
  specialties: string[];
  conferenceType: ConferenceType;
  organizer: string;
  externalUrl?: string;
  description: string;
};

export type ConferencePreferences = {
  healthcareFields: HealthcareFieldLabel[];
  specialties: string[];
  countries: string[];
  includeSaudi: boolean;
  includeInternational: boolean;
};

export const CONFERENCE_TYPES: ConferenceType[] = [
  "Scientific Congress",
  "Specialty Symposium",
  "Workshop",
  "Poster Session",
  "Annual Meeting",
  "Other",
];

export const CONFERENCE_COUNTRIES = [
  "Saudi Arabia",
  "United Kingdom",
  "United States",
  "United Arab Emirates",
  "Germany",
  "Canada",
  "Egypt",
  "Singapore",
];

export const CONFERENCE_FIELD_OPTIONS = healthcareFields.map(
  (f) => f.title as HealthcareFieldLabel,
);

export const DEFAULT_CONFERENCE_PREFERENCES: ConferencePreferences = {
  healthcareFields: [],
  specialties: [],
  countries: [],
  includeSaudi: true,
  includeInternational: true,
};

export function preferencesFromProfile(input: {
  field: HealthcareField | null;
  specialty: string;
  currentCity?: string;
}): ConferencePreferences {
  const field = fieldLabel(input.field) as HealthcareFieldLabel | "";
  return {
    healthcareFields: field ? [field as HealthcareFieldLabel] : [],
    specialties: input.specialty.trim() ? [input.specialty.trim()] : [],
    countries: ["Saudi Arabia"],
    includeSaudi: true,
    includeInternational: true,
  };
}

export const SEED_CONFERENCES: ConferenceRecord[] = [
  {
    id: "conf-1",
    name: "Saudi Internal Medicine Annual Congress",
    country: "Saudi Arabia",
    city: "Riyadh",
    locationType: "Saudi Arabia",
    startDate: "2026-10-12",
    endDate: "2026-10-14",
    healthcareFields: ["Medicine"],
    specialties: ["Internal Medicine"],
    conferenceType: "Scientific Congress",
    organizer: "Saudi Society of Internal Medicine",
    externalUrl: "https://example.com/saudi-internal-medicine-congress",
    description:
      "National congress covering advances in internal medicine practice, research, and education.",
  },
  {
    id: "conf-2",
    name: "Riyadh Emergency Medicine Forum",
    country: "Saudi Arabia",
    city: "Riyadh",
    locationType: "Saudi Arabia",
    startDate: "2026-09-18",
    endDate: "2026-09-19",
    healthcareFields: ["Medicine", "Nursing"],
    specialties: ["Emergency Medicine", "Critical Care Nursing"],
    conferenceType: "Specialty Symposium",
    organizer: "Ministry of Health",
    externalUrl: "https://example.com/riyadh-em-forum",
    description:
      "Focused forum on emergency pathways, triage innovation, and multidisciplinary response.",
  },
  {
    id: "conf-3",
    name: "European Society of Cardiology Congress",
    country: "United Kingdom",
    city: "London",
    locationType: "International",
    startDate: "2026-11-05",
    endDate: "2026-11-08",
    healthcareFields: ["Medicine"],
    specialties: ["Cardiology"],
    conferenceType: "Annual Meeting",
    organizer: "European Society of Cardiology",
    externalUrl: "https://example.com/esc-congress",
    description:
      "International cardiology meeting featuring late breaking trials, imaging, and interventional updates.",
  },
  {
    id: "conf-4",
    name: "Gulf Cardiology Innovation Summit",
    country: "United Arab Emirates",
    city: "Dubai",
    locationType: "International",
    startDate: "2026-12-02",
    endDate: "2026-12-04",
    healthcareFields: ["Medicine", "Allied Health"],
    specialties: ["Cardiology"],
    conferenceType: "Specialty Symposium",
    organizer: "Gulf Heart Association",
    externalUrl: "https://example.com/gulf-cardiology-summit",
    description:
      "Regional cardiology innovation summit with workshops and poster presentations.",
  },
  {
    id: "conf-5",
    name: "Saudi Nursing Excellence Conference",
    country: "Saudi Arabia",
    city: "Jeddah",
    locationType: "Saudi Arabia",
    startDate: "2026-10-28",
    endDate: "2026-10-29",
    healthcareFields: ["Nursing"],
    specialties: ["Critical Care Nursing", "Medical Surgical Nursing"],
    conferenceType: "Scientific Congress",
    organizer: "Saudi Nurses Association",
    externalUrl: "https://example.com/saudi-nursing-conference",
    description:
      "National conference on nursing excellence, patient safety, and advanced practice.",
  },
  {
    id: "conf-6",
    name: "International Pharmacy Practice Workshop",
    country: "Germany",
    city: "Berlin",
    locationType: "International",
    startDate: "2026-09-25",
    endDate: "2026-09-26",
    healthcareFields: ["Pharmacy"],
    specialties: ["Clinical Pharmacy"],
    conferenceType: "Workshop",
    organizer: "International Pharmacy Education Network",
    externalUrl: "https://example.com/pharmacy-workshop",
    description:
      "Hands on workshop covering medication safety systems and clinical pharmacy collaboration.",
  },
  {
    id: "conf-7",
    name: "King Faisal Cardiology Research Day",
    country: "Saudi Arabia",
    city: "Riyadh",
    locationType: "Saudi Arabia",
    startDate: "2026-11-20",
    endDate: "2026-11-20",
    healthcareFields: ["Medicine"],
    specialties: ["Cardiology", "Internal Medicine"],
    conferenceType: "Poster Session",
    organizer: "King Faisal Specialist Hospital and Research Centre",
    externalUrl: "https://example.com/kfshrc-cardiology-day",
    description:
      "One day research showcase for cardiology posters and oral presentations.",
  },
];

/** Future Passport stamp types for verified conference participation. */
export const CONFERENCE_PASSPORT_STAMP_TYPES = [
  "Conference Attended",
  "Poster Presentation",
  "Conference Speaker",
  "Conference Presentation",
] as const;

export type ConferencePassportStampType =
  (typeof CONFERENCE_PASSPORT_STAMP_TYPES)[number];

export type ConferenceAccomplishmentRecord = {
  id: string;
  conferenceId: string;
  userId: string;
  stampType: ConferencePassportStampType;
  verified: boolean;
  completedAt: string;
  title: string;
};

export function formatConferenceDateRange(startDate: string, endDate: string) {
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

export function conferenceMatchScore(
  conference: ConferenceRecord,
  prefs: ConferencePreferences,
) {
  let score = 0;
  if (
    prefs.healthcareFields.length &&
    conference.healthcareFields.some((f) =>
      prefs.healthcareFields.includes(f),
    )
  ) {
    score += 3;
  }
  if (
    prefs.specialties.length &&
    conference.specialties.some((s) => prefs.specialties.includes(s))
  ) {
    score += 3;
  }
  if (
    prefs.countries.length &&
    prefs.countries.includes(conference.country)
  ) {
    score += 2;
  }
  if (prefs.includeSaudi && conference.locationType === "Saudi Arabia") {
    score += 1;
  }
  if (
    prefs.includeInternational &&
    conference.locationType === "International"
  ) {
    score += 1;
  }
  return score;
}
