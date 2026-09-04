import type { InternProfile } from "@/data/intern";

export type ProfileRecordSource = "user" | "medjourney";

export type EducationLevel =
  | "High School"
  | "Bachelor's Degree"
  | "Medical Degree"
  | "Dental Degree"
  | "Pharmacy Degree"
  | "Nursing Degree"
  | "Allied Health Degree"
  | "Master's Degree"
  | "Doctorate"
  | "Other";

export type ProfileEducationEntry = {
  id: string;
  educationLevel: EducationLevel;
  institutionName: string;
  city: string;
  country: string;
  fieldOfStudy?: string;
  startYear?: string;
  graduationYear?: string;
  currentlyStudying?: boolean;
  source: ProfileRecordSource;
  verified: boolean;
};

export type ProfileResearchType =
  | "Case Report"
  | "Case Series"
  | "Cross Sectional Study"
  | "Cohort Study"
  | "Case Control Study"
  | "Randomized Controlled Trial"
  | "Systematic Review"
  | "Meta Analysis"
  | "Literature Review"
  | "Quality Improvement"
  | "Audit"
  | "Basic Science Research"
  | "Clinical Research"
  | "Survey Study"
  | "Other";

export type ProfileResearchRole =
  | "Principal Investigator"
  | "Co Investigator"
  | "First Author"
  | "Co Author"
  | "Research Assistant"
  | "Data Collection"
  | "Data Analysis"
  | "Participant"
  | "Other";

export type ProfileResearchEntry = {
  id: string;
  title: string;
  researchType: ProfileResearchType;
  role: ProfileResearchRole;
  healthcareField?: string;
  specialty?: string;
  institution?: string;
  startDate?: string;
  completionDate?: string;
  status: "Ongoing" | "Completed" | "Published" | "Other";
  publicationStatus?: string;
  journalOrConference?: string;
  doiOrLink?: string;
  description?: string;
  source: ProfileRecordSource;
  verified: boolean;
  linkedMedJourneyId?: string;
};

export type ProfileCourseEntry = {
  id: string;
  name: string;
  provider: string;
  institution?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  courseType?: string;
  certificateAvailable?: boolean;
  certificateDataUrl?: string;
  certificateFileName?: string;
  expirationDate?: string;
  source: ProfileRecordSource;
  verified: boolean;
  linkedMedJourneyId?: string;
};

export type ProfileCertificationEntry = {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialLink?: string;
  certificateDataUrl?: string;
  certificateFileName?: string;
  source: ProfileRecordSource;
  verified: boolean;
};

export type ProfileTrainingType =
  | "Summer Elective"
  | "Internship Rotation"
  | "External Rotation"
  | "Observership"
  | "Clinical Attachment"
  | "Other";

export type ProfileTrainingEntry = {
  id: string;
  trainingType: ProfileTrainingType;
  hospital: string;
  departmentOrSpecialty?: string;
  city?: string;
  country?: string;
  startDate?: string;
  endDate?: string;
  supervisor?: string;
  description?: string;
  source: ProfileRecordSource;
  verified: boolean;
  linkedMedJourneyId?: string;
};

export type ProfileEnrichmentState = {
  education: ProfileEducationEntry[];
  research: ProfileResearchEntry[];
  courses: ProfileCourseEntry[];
  certifications: ProfileCertificationEntry[];
  training: ProfileTrainingEntry[];
};

export const EDUCATION_LEVELS: EducationLevel[] = [
  "High School",
  "Bachelor's Degree",
  "Medical Degree",
  "Dental Degree",
  "Pharmacy Degree",
  "Nursing Degree",
  "Allied Health Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
];

export const PROFILE_RESEARCH_TYPES: ProfileResearchType[] = [
  "Case Report",
  "Case Series",
  "Cross Sectional Study",
  "Cohort Study",
  "Case Control Study",
  "Randomized Controlled Trial",
  "Systematic Review",
  "Meta Analysis",
  "Literature Review",
  "Quality Improvement",
  "Audit",
  "Basic Science Research",
  "Clinical Research",
  "Survey Study",
  "Other",
];

export const PROFILE_RESEARCH_ROLES: ProfileResearchRole[] = [
  "Principal Investigator",
  "Co Investigator",
  "First Author",
  "Co Author",
  "Research Assistant",
  "Data Collection",
  "Data Analysis",
  "Participant",
  "Other",
];

export const PROFILE_TRAINING_TYPES: ProfileTrainingType[] = [
  "Summer Elective",
  "Internship Rotation",
  "External Rotation",
  "Observership",
  "Clinical Attachment",
  "Other",
];

export const PROFILE_COURSE_TYPE_OPTIONS = [
  "Certification",
  "Clinical Skills",
  "Procedural Workshop",
  "Simulation",
  "Ultrasound",
  "Emergency and Critical Care",
  "Specialty Course",
  "Professional Development",
  "Other",
];

export function createProfileEntryId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function defaultEnrichmentState(): ProfileEnrichmentState {
  return {
    education: [],
    research: [],
    courses: [],
    certifications: [],
    training: [],
  };
}

/** Optional enrichment completeness — does not block MedJourney use. */
export function computeProfileCompleteness(input: {
  profile: InternProfile;
  educationCount: number;
  researchCount: number;
  coursesCount: number;
  certificationsCount: number;
  trainingCount: number;
}) {
  const checks = [
    Boolean(input.profile.photoDataUrl || input.profile.photoUploaded),
    input.educationCount > 0,
    input.researchCount > 0,
    input.coursesCount > 0,
    input.certificationsCount > 0,
    input.trainingCount > 0,
  ];
  const done = checks.filter(Boolean).length;
  const percent = Math.round((done / checks.length) * 100);
  return {
    percent,
    done,
    total: checks.length,
    isComplete: done === checks.length,
    missing: [
      !checks[0] ? "Profile photo" : null,
      !checks[1] ? "Education" : null,
      !checks[2] ? "Research" : null,
      !checks[3] ? "Courses and workshops" : null,
      !checks[4] ? "Certifications" : null,
      !checks[5] ? "Training experience" : null,
    ].filter(Boolean) as string[],
  };
}

export function sourceLabel(source: ProfileRecordSource, verified: boolean) {
  if (verified) return "Verified";
  if (source === "medjourney") return "From MedJourney";
  return "User added";
}
