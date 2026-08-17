export const onboardingSteps = [
  { id: "welcome", path: "/onboarding", label: "Welcome" },
  { id: "profession", path: "/onboarding/profession", label: "Profession" },
  { id: "specialty", path: "/onboarding/specialty", label: "Specialty" },
  { id: "cities", path: "/onboarding/cities", label: "Cities" },
  { id: "cv", path: "/onboarding/cv", label: "CV" },
  { id: "interests", path: "/onboarding/interests", label: "Interests" },
  { id: "success", path: "/onboarding/success", label: "Success" },
] as const;

export type OnboardingStepId = (typeof onboardingSteps)[number]["id"];

export function getStepIndex(pathname: string) {
  const exact = onboardingSteps.findIndex((s) => s.path === pathname);
  if (exact >= 0) return exact;
  return 0;
}

export const professions = [
  {
    id: "medicine",
    name: "Medicine",
    description: "Physicians pursuing electives, residencies, and fellowships.",
    icon: "stethoscope",
  },
  {
    id: "dentistry",
    name: "Dentistry",
    description: "Dental graduates exploring clinical attachments and specialty tracks.",
    icon: "smile",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Clinical and hospital pharmacy training pathways.",
    icon: "pill",
  },
  {
    id: "nursing",
    name: "Nursing",
    description: "Structured preceptorships across acute and ambulatory care.",
    icon: "heart",
  },
  {
    id: "allied",
    name: "Allied Health",
    description: "Therapy, imaging, lab, and rehabilitation training roles.",
    icon: "activity",
  },
] as const;

export const specialtiesByProfession: Record<string, string[]> = {
  medicine: [
    "Internal Medicine",
    "Cardiology",
    "Critical Care",
    "Emergency Medicine",
    "Pediatrics",
    "Family Medicine",
    "Surgery",
    "Neurology",
  ],
  dentistry: [
    "General Dentistry",
    "Oral Surgery",
    "Orthodontics",
    "Periodontics",
    "Endodontics",
  ],
  pharmacy: [
    "Clinical Pharmacy",
    "Hospital Pharmacy",
    "Oncology Pharmacy",
    "Ambulatory Care",
  ],
  nursing: [
    "Critical Care Nursing",
    "Pediatric Nursing",
    "Emergency Nursing",
    "Surgical Nursing",
  ],
  allied: [
    "Physiotherapy",
    "Radiology",
    "Laboratory Science",
    "Occupational Therapy",
  ],
};

export const cities = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Madinah",
  "Makkah",
  "Khobar",
  "Abha",
  "Tabuk",
];

export const interestTags = [
  "Inpatient care",
  "Outpatient clinics",
  "Research",
  "Teaching",
  "Procedures",
  "Night float",
  "Cardiology track",
  "Acute care",
  "Community health",
  "Leadership",
];

export const preferredHospitals = [
  { id: "nhc", name: "National Heart Center", city: "Riyadh", mark: "NHC" },
  { id: "umc", name: "University Medical Center", city: "Riyadh", mark: "UMC" },
  { id: "kfsh", name: "King Faisal Specialist Hospital", city: "Riyadh", mark: "KFSH" },
  { id: "ngha", name: "National Guard Health Affairs", city: "Riyadh", mark: "NGHA" },
  { id: "cgh", name: "City General Hospital", city: "Jeddah", mark: "CGH" },
  { id: "csh", name: "Children’s Specialty Hospital", city: "Dammam", mark: "CSH" },
];
