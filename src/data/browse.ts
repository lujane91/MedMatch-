export type OpportunityBadge =
  | "New"
  | "Closing Soon"
  | "Highly Competitive"
  | "Fast Response"
  | "Popular";

export type BrowseOpportunity = {
  id: string;
  slug: string;
  title: string;
  program: string;
  specialty: string;
  profession: "Medicine" | "Dentistry" | "Pharmacy" | "Nursing" | "Allied Health";
  hospital: string;
  hospitalMark: string;
  city: string;
  trainingType: string;
  duration: string;
  deadline: string;
  seats: number;
  matchScore: number;
  matchWhy: string;
  requirements: string[];
  badges: OpportunityBadge[];
  saved?: boolean;
  applicationStatus: "Open" | "Applied" | "Interview" | "Closed";
  trending?: boolean;
  recentlyAdded?: boolean;
};

export const browseOpportunities: BrowseOpportunity[] = [
  {
    id: "1",
    slug: "internal-medicine",
    title: "Internal Medicine Elective Rotation",
    program: "Internal Medicine Elective",
    specialty: "Internal Medicine",
    profession: "Medicine",
    hospital: "National Heart Center",
    hospitalMark: "NHC",
    city: "Riyadh",
    trainingType: "Elective",
    duration: "4 weeks",
    deadline: "Aug 15, 2026",
    seats: 6,
    matchScore: 96,
    matchWhy:
      "Aligns with your Internal Medicine focus, PGY-2 level, and cardiology-leaning research profile.",
    requirements: ["Active SCFHS registration", "CV & transcript", "Letter of intent"],
    badges: ["Popular", "Fast Response"],
    saved: true,
    applicationStatus: "Applied",
    trending: true,
  },
  {
    id: "4",
    slug: "cardiology",
    title: "Cardiology Subspecialty Elective",
    program: "Cardiology Subspecialty Elective",
    specialty: "Cardiology",
    profession: "Medicine",
    hospital: "University Medical Center",
    hospitalMark: "UMC",
    city: "Riyadh",
    trainingType: "Elective",
    duration: "6 weeks",
    deadline: "Jul 30, 2026",
    seats: 3,
    matchScore: 93,
    matchWhy:
      "Strong match to your stated cardiology interest and recent ECG workshop outcomes.",
    requirements: ["PGY-1+", "BLS & ACLS", "Recommendation letter"],
    badges: ["Closing Soon", "Highly Competitive"],
    applicationStatus: "Interview",
    trending: true,
  },
  {
    id: "5",
    slug: "icu",
    title: "Critical Care Training Block",
    program: "Critical Care Training Block",
    specialty: "Critical Care",
    profession: "Medicine",
    hospital: "Metropolitan ICU Network",
    hospitalMark: "MICU",
    city: "Riyadh",
    trainingType: "Training Block",
    duration: "4 weeks",
    deadline: "Sep 12, 2026",
    seats: 8,
    matchScore: 85,
    matchWhy:
      "Fits your inpatient intensity preference and builds procedural readiness for acute care.",
    requirements: ["Internal Medicine track", "Night float availability"],
    badges: ["New", "Fast Response"],
    applicationStatus: "Open",
    recentlyAdded: true,
    trending: true,
  },
  {
    id: "2",
    slug: "emergency-medicine",
    title: "Emergency Medicine Observership",
    program: "Emergency Medicine Observership",
    specialty: "Emergency Medicine",
    profession: "Medicine",
    hospital: "City General Hospital",
    hospitalMark: "CGH",
    city: "Jeddah",
    trainingType: "Observership",
    duration: "2 weeks",
    deadline: "Sep 1, 2026",
    seats: 10,
    matchScore: 88,
    matchWhy:
      "Complements your acute care goals with high-acuity exposure in a busy tertiary ED.",
    requirements: ["Valid medical ID", "Immunization record"],
    badges: ["Popular"],
    applicationStatus: "Applied",
  },
  {
    id: "3",
    slug: "pediatrics",
    title: "Pediatrics Clinical Attachment",
    program: "Pediatrics Clinical Attachment",
    specialty: "Pediatrics",
    profession: "Medicine",
    hospital: "Children’s Specialty Hospital",
    hospitalMark: "CSH",
    city: "Dammam",
    trainingType: "Attachment",
    duration: "3 weeks",
    deadline: "Aug 28, 2026",
    seats: 5,
    matchScore: 81,
    matchWhy:
      "Broadens your clinical portfolio while staying close to your teaching-rounds strengths.",
    requirements: ["CV", "Malpractice coverage confirmation"],
    badges: ["Closing Soon"],
    saved: true,
    applicationStatus: "Open",
    recentlyAdded: true,
  },
  {
    id: "6",
    slug: "family-medicine",
    title: "Family Medicine Continuity Clinic",
    program: "Family Medicine Continuity Clinic",
    specialty: "Family Medicine",
    profession: "Medicine",
    hospital: "Community Health Institute",
    hospitalMark: "CHI",
    city: "Madinah",
    trainingType: "Clinic",
    duration: "8 weeks",
    deadline: "Oct 5, 2026",
    seats: 12,
    matchScore: 77,
    matchWhy:
      "Offers longitudinal patient follow-up that strengthens communication and continuity skills.",
    requirements: ["Primary care interest statement"],
    badges: ["New"],
    applicationStatus: "Open",
    recentlyAdded: true,
  },
];

export const professions = [
  {
    id: "medicine",
    name: "Medicine",
    description: "Electives, observerships, and specialty blocks for physicians.",
    count: 42,
    accent: "from-[#0E3A5D] to-[#1F5A84]",
  },
  {
    id: "dentistry",
    name: "Dentistry",
    description: "Clinical attachments across oral surgery and specialty clinics.",
    count: 18,
    accent: "from-[#16486F] to-[#1FA6A0]",
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    description: "Hospital pharmacy rotations and clinical preview programs.",
    count: 15,
    accent: "from-[#1FA6A0] to-[#178F8A]",
  },
  {
    id: "nursing",
    name: "Nursing",
    description: "Structured preceptorships in acute and ambulatory care.",
    count: 27,
    accent: "from-[#0E3A5D] to-[#1FA6A0]",
  },
  {
    id: "allied",
    name: "Allied Health",
    description: "Therapy, imaging, and lab training pathways.",
    count: 21,
    accent: "from-[#1F5A84] to-[#0E3A5D]",
  },
] as const;

export const savedSearches = [
  {
    id: "ss1",
    name: "Cardiology electives in Riyadh",
    filters: "Medicine · Cardiology · Riyadh · Match ≥ 85%",
    results: 6,
  },
  {
    id: "ss2",
    name: "Closing soon · Internal Medicine",
    filters: "Medicine · Internal Medicine · Deadline < 30 days",
    results: 4,
  },
  {
    id: "ss3",
    name: "Observerships with fast response",
    filters: "Observership · Fast Response · Open",
    results: 9,
  },
];

export const filterOptions = {
  professions: ["Medicine", "Dentistry", "Pharmacy", "Nursing", "Allied Health"],
  specialties: [
    "Internal Medicine",
    "Cardiology",
    "Critical Care",
    "Emergency Medicine",
    "Pediatrics",
    "Family Medicine",
  ],
  cities: ["Riyadh", "Jeddah", "Dammam", "Madinah"],
  hospitals: [
    "National Heart Center",
    "University Medical Center",
    "Metropolitan ICU Network",
    "City General Hospital",
  ],
  trainingTypes: ["Elective", "Observership", "Training Block", "Attachment", "Clinic"],
  matchRanges: ["90%+", "80%+", "70%+", "Any"],
  applicationStatuses: ["Open", "Applied", "Interview", "Closed"],
  deadlines: ["Next 14 days", "Next 30 days", "Next 60 days", "Any"],
};

export function getRecommendedBrowse(limit = 3) {
  return [...browseOpportunities]
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

export function getTrendingBrowse() {
  return browseOpportunities.filter((o) => o.trending);
}

export function getRecentlyAddedBrowse() {
  return browseOpportunities.filter((o) => o.recentlyAdded);
}
