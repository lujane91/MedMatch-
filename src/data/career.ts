import type { HealthcareField, TrainingStage } from "@/data/intern";
import { fieldLabel, healthcareFields } from "@/data/intern";
import { SAUDI_CITIES } from "@/data/saudi-hospitals";
import type {
  HealthcareFieldLabel,
  JourneyStageLabel,
} from "@/data/research";
import { toFieldLabel, toStageLabel } from "@/data/research";

export type OrganizationType =
  | "Ministry of Health"
  | "Health Cluster"
  | "Government Hospital"
  | "Private Hospital Group"
  | "University Hospital"
  | "Academic Medical Center"
  | "Medical University"
  | "Healthcare Company"
  | "Government Health Organization";

export type TrustedCareerSource = {
  id: string;
  name: string;
  organizationType: OrganizationType;
  country: string;
  city?: string;
};

export type CareerOpportunity = {
  id: string;
  jobTitle: string;
  organizationId: string;
  organizationName: string;
  organizationType: OrganizationType;
  healthcareField: HealthcareFieldLabel;
  specialty?: string;
  country: string;
  city: string;
  postedDate: string;
  closingDate?: string;
  journeyStages?: JourneyStageLabel[];
  externalUrl: string;
  summary: string;
};

export type CareerPreferences = {
  healthcareFields: HealthcareFieldLabel[];
  specialties: string[];
  preferredCities: string[];
  preferredCountries: string[];
  organizationTypes: OrganizationType[];
};

export const ORGANIZATION_TYPES: OrganizationType[] = [
  "Ministry of Health",
  "Health Cluster",
  "Government Hospital",
  "Private Hospital Group",
  "University Hospital",
  "Academic Medical Center",
  "Medical University",
  "Healthcare Company",
  "Government Health Organization",
];

export const CAREER_COUNTRIES = [
  "Saudi Arabia",
  "United Arab Emirates",
  "United Kingdom",
];

export const CAREER_CITIES = [...SAUDI_CITIES, "Dubai", "Abu Dhabi", "London"];

export const CAREER_FIELD_OPTIONS = healthcareFields.map(
  (f) => f.title as HealthcareFieldLabel,
);

export const DEFAULT_CAREER_PREFERENCES: CareerPreferences = {
  healthcareFields: [],
  specialties: [],
  preferredCities: [],
  preferredCountries: [],
  organizationTypes: [],
};

export function careerPreferencesFromProfile(input: {
  field: HealthcareField | null;
  specialty: string;
  currentCity?: string;
}): CareerPreferences {
  const field = fieldLabel(input.field);
  return {
    healthcareFields: field ? [field as HealthcareFieldLabel] : [],
    specialties: input.specialty.trim() ? [input.specialty.trim()] : [],
    preferredCities: input.currentCity?.trim()
      ? [input.currentCity.trim()]
      : [],
    preferredCountries: ["Saudi Arabia"],
    organizationTypes: [],
  };
}

export const TRUSTED_CAREER_SOURCES: TrustedCareerSource[] = [
  {
    id: "src-moh",
    name: "Ministry of Health",
    organizationType: "Ministry of Health",
    country: "Saudi Arabia",
    city: "Riyadh",
  },
  {
    id: "src-kfshrc",
    name: "King Faisal Specialist Hospital and Research Centre",
    organizationType: "Academic Medical Center",
    country: "Saudi Arabia",
    city: "Riyadh",
  },
  {
    id: "src-ksu",
    name: "King Saud University",
    organizationType: "Medical University",
    country: "Saudi Arabia",
    city: "Riyadh",
  },
  {
    id: "src-cluster-central",
    name: "Riyadh Second Health Cluster",
    organizationType: "Health Cluster",
    country: "Saudi Arabia",
    city: "Riyadh",
  },
  {
    id: "src-ngha",
    name: "King Abdulaziz Medical City",
    organizationType: "Government Hospital",
    country: "Saudi Arabia",
    city: "Jeddah",
  },
  {
    id: "src-private",
    name: "Dr. Sulaiman Al Habib Medical Group",
    organizationType: "Private Hospital Group",
    country: "Saudi Arabia",
    city: "Riyadh",
  },
];

export const SEED_CAREER_OPPORTUNITIES: CareerOpportunity[] = [
  {
    id: "career-1",
    jobTitle: "Emergency Medicine Specialist",
    organizationId: "src-kfshrc",
    organizationName: "King Faisal Specialist Hospital and Research Centre",
    organizationType: "Academic Medical Center",
    healthcareField: "Medicine",
    specialty: "Emergency Medicine",
    country: "Saudi Arabia",
    city: "Riyadh",
    postedDate: "2026-08-18",
    closingDate: "2026-09-30",
    journeyStages: ["Medical Practice", "Fellow"],
    externalUrl: "https://example.com/kfshrc-emergency-medicine",
    summary:
      "Specialist role supporting high acuity emergency pathways in a tertiary academic medical center.",
  },
  {
    id: "career-2",
    jobTitle: "Internal Medicine Consultant",
    organizationId: "src-moh",
    organizationName: "Ministry of Health",
    organizationType: "Ministry of Health",
    healthcareField: "Medicine",
    specialty: "Internal Medicine",
    country: "Saudi Arabia",
    city: "Riyadh",
    postedDate: "2026-08-22",
    closingDate: "2026-10-15",
    journeyStages: ["Medical Practice"],
    externalUrl: "https://example.com/moh-internal-medicine",
    summary:
      "Consultant opportunity within Ministry of Health hospitals supporting internal medicine services.",
  },
  {
    id: "career-3",
    jobTitle: "Critical Care Nursing Educator",
    organizationId: "src-ngha",
    organizationName: "King Abdulaziz Medical City",
    organizationType: "Government Hospital",
    healthcareField: "Nursing",
    specialty: "Critical Care Nursing",
    country: "Saudi Arabia",
    city: "Jeddah",
    postedDate: "2026-08-15",
    closingDate: "2026-09-20",
    journeyStages: ["Advanced Training", "Medical Practice"],
    externalUrl: "https://example.com/kamc-critical-care-educator",
    summary:
      "Educator role focused on critical care nursing competency and bedside teaching.",
  },
  {
    id: "career-4",
    jobTitle: "Clinical Pharmacist",
    organizationId: "src-cluster-central",
    organizationName: "Riyadh Second Health Cluster",
    organizationType: "Health Cluster",
    healthcareField: "Pharmacy",
    specialty: "Clinical Pharmacy",
    country: "Saudi Arabia",
    city: "Riyadh",
    postedDate: "2026-08-21",
    journeyStages: ["Advanced Training", "Medical Practice"],
    externalUrl: "https://example.com/cluster-clinical-pharmacist",
    summary:
      "Clinical pharmacy role supporting ward based medication review and stewardship.",
  },
  {
    id: "career-5",
    jobTitle: "Academic Healthcare Faculty Position",
    organizationId: "src-ksu",
    organizationName: "King Saud University",
    organizationType: "Medical University",
    healthcareField: "Medicine",
    specialty: "Family Medicine",
    country: "Saudi Arabia",
    city: "Riyadh",
    postedDate: "2026-08-10",
    closingDate: "2026-10-01",
    journeyStages: ["Medical Practice", "Fellow"],
    externalUrl: "https://example.com/ksu-faculty-family-medicine",
    summary:
      "Academic faculty position combining teaching, clinical service, and scholarly activity.",
  },
  {
    id: "career-6",
    jobTitle: "Cardiology Fellow Opportunity",
    organizationId: "src-kfshrc",
    organizationName: "King Faisal Specialist Hospital and Research Centre",
    organizationType: "Academic Medical Center",
    healthcareField: "Medicine",
    specialty: "Cardiology",
    country: "Saudi Arabia",
    city: "Riyadh",
    postedDate: "2026-08-24",
    closingDate: "2026-09-25",
    journeyStages: ["Fellow", "Resident"],
    externalUrl: "https://example.com/kfshrc-cardiology-fellow",
    summary:
      "Advanced cardiology training opportunity at a leading tertiary referral center.",
  },
];

/**
 * Medical Students see Career in navigation but listings stay locked.
 * Unlock happens automatically for later journey stages.
 */
export function isCareerLockedForStage(
  stage: TrainingStage | null | undefined,
) {
  return stage === "medical-student";
}

export function formatCareerDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function careerMatchScore(
  opportunity: CareerOpportunity,
  prefs: CareerPreferences,
  stage?: JourneyStageLabel | null,
) {
  let score = 0;
  if (
    prefs.healthcareFields.length &&
    prefs.healthcareFields.includes(opportunity.healthcareField)
  ) {
    score += 3;
  }
  if (
    opportunity.specialty &&
    prefs.specialties.includes(opportunity.specialty)
  ) {
    score += 3;
  }
  if (prefs.preferredCities.includes(opportunity.city)) score += 2;
  if (prefs.preferredCountries.includes(opportunity.country)) score += 1;
  if (prefs.organizationTypes.includes(opportunity.organizationType)) {
    score += 1;
  }
  if (
    stage &&
    opportunity.journeyStages &&
    opportunity.journeyStages.includes(stage)
  ) {
    score += 2;
  }
  return score;
}

export { toFieldLabel, toStageLabel };
