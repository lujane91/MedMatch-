export type Opportunity = {
  id: string;
  slug: string;
  title: string;
  specialty: string;
  hospital: string;
  location: string;
  type: string;
  duration: string;
  matchScore: number;
  deadline: string;
  stipend: string;
  tags: string[];
  description: string;
  saved?: boolean;
};

export type Application = {
  id: string;
  opportunityId: string;
  title: string;
  hospital: string;
  status: "Submitted" | "Under Review" | "Interview" | "Accepted" | "Declined";
  submittedAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  href: string;
};

export const currentUser = {
  name: "Dr. Amina Hassan",
  email: "amina.hassan@medmatch.edu",
  role: "Resident Physician",
  specialty: "Internal Medicine",
  year: "PGY-2",
  institution: "King Fahad Medical City",
  location: "Riyadh, Saudi Arabia",
  phone: "+966 50 123 4567",
  bio: "PGY-2 internal medicine resident focused on cardiology pathways, clinical research, and structured fellowship preparation.",
  skills: ["Clinical Reasoning", "ECG Interpretation", "Patient Communication", "Research Writing"],
  education: [
    { school: "King Saud University", degree: "MBBS", year: "2022" },
    { school: "King Fahad Medical City", degree: "Internal Medicine Residency", year: "2024–Present" },
  ],
};

export const opportunities: Opportunity[] = [
  {
    id: "1",
    slug: "internal-medicine",
    title: "Internal Medicine Elective Rotation",
    specialty: "Internal Medicine",
    hospital: "National Heart Center",
    location: "Riyadh",
    type: "Elective",
    duration: "4 weeks",
    matchScore: 96,
    deadline: "Aug 15, 2026",
    stipend: "SAR 4,500",
    tags: ["Inpatient", "Cardiology Track", "Mentorship"],
    description:
      "A structured inpatient elective with consultant-led ward rounds, case conferences, and exposure to complex multi-morbidity management.",
    saved: true,
  },
  {
    id: "2",
    slug: "emergency-medicine",
    title: "Emergency Medicine Observership",
    specialty: "Emergency Medicine",
    hospital: "City General Hospital",
    location: "Jeddah",
    type: "Observership",
    duration: "2 weeks",
    matchScore: 88,
    deadline: "Sep 1, 2026",
    stipend: "Unpaid",
    tags: ["Trauma Bay", "Shift-based", "Procedures"],
    description:
      "Observe high-acuity emergency workflows, triage protocols, and acute resuscitation pathways in a busy tertiary ED.",
  },
  {
    id: "3",
    slug: "pediatrics",
    title: "Pediatrics Clinical Attachment",
    specialty: "Pediatrics",
    hospital: "Children’s Specialty Hospital",
    location: "Dammam",
    type: "Attachment",
    duration: "3 weeks",
    matchScore: 81,
    deadline: "Aug 28, 2026",
    stipend: "SAR 3,000",
    tags: ["Outpatient", "Teaching Rounds"],
    description:
      "Gain exposure to pediatric ambulatory care, common childhood illnesses, and multidisciplinary family counseling.",
    saved: true,
  },
  {
    id: "4",
    slug: "cardiology",
    title: "Cardiology Subspecialty Elective",
    specialty: "Cardiology",
    hospital: "University Medical Center",
    location: "Riyadh",
    type: "Elective",
    duration: "6 weeks",
    matchScore: 93,
    deadline: "Jul 30, 2026",
    stipend: "SAR 5,200",
    tags: ["Cath Lab", "Echo", "Research"],
    description:
      "Advanced cardiology elective covering ward consults, echocardiography clinics, and guided research mentorship.",
  },
  {
    id: "5",
    slug: "icu",
    title: "Critical Care Training Block",
    specialty: "Critical Care",
    hospital: "Metropolitan ICU Network",
    location: "Riyadh",
    type: "Training Block",
    duration: "4 weeks",
    matchScore: 85,
    deadline: "Sep 12, 2026",
    stipend: "SAR 4,800",
    tags: ["Ventilation", "Procedures", "Night Float"],
    description:
      "Hands-on ICU training focused on ventilator management, shock protocols, and multidisciplinary critical care rounds.",
  },
  {
    id: "6",
    slug: "family-medicine",
    title: "Family Medicine Continuity Clinic",
    specialty: "Family Medicine",
    hospital: "Community Health Institute",
    location: "Madinah",
    type: "Clinic",
    duration: "8 weeks",
    matchScore: 77,
    deadline: "Oct 5, 2026",
    stipend: "SAR 3,600",
    tags: ["Primary Care", "Prevention"],
    description:
      "Longitudinal clinic experience covering preventive care, chronic disease follow-up, and community outreach.",
  },
];

export const applications: Application[] = [
  {
    id: "a1",
    opportunityId: "1",
    title: "Internal Medicine Elective Rotation",
    hospital: "National Heart Center",
    status: "Under Review",
    submittedAt: "Jul 2, 2026",
    updatedAt: "Jul 14, 2026",
  },
  {
    id: "a2",
    opportunityId: "4",
    title: "Cardiology Subspecialty Elective",
    hospital: "University Medical Center",
    status: "Interview",
    submittedAt: "Jun 18, 2026",
    updatedAt: "Jul 10, 2026",
  },
  {
    id: "a3",
    opportunityId: "2",
    title: "Emergency Medicine Observership",
    hospital: "City General Hospital",
    status: "Submitted",
    submittedAt: "Jul 12, 2026",
    updatedAt: "Jul 12, 2026",
  },
  {
    id: "a4",
    opportunityId: "5",
    title: "Critical Care Training Block",
    hospital: "Metropolitan ICU Network",
    status: "Accepted",
    submittedAt: "May 22, 2026",
    updatedAt: "Jun 30, 2026",
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Interview invitation",
    message: "University Medical Center requested an interview for Cardiology Subspecialty Elective.",
    time: "2 hours ago",
    unread: true,
    href: "/applications",
  },
  {
    id: "n2",
    title: "Application update",
    message: "Your Internal Medicine Elective application moved to Under Review.",
    time: "Yesterday",
    unread: true,
    href: "/applications",
  },
  {
    id: "n3",
    title: "New match for you",
    message: "A Critical Care Training Block scored 85% match with your profile.",
    time: "2 days ago",
    unread: false,
    href: "/opportunities/icu",
  },
  {
    id: "n4",
    title: "Deadline reminder",
    message: "Cardiology Subspecialty Elective closes in 10 days.",
    time: "3 days ago",
    unread: false,
    href: "/opportunities/cardiology",
  },
];

export const profileStrength = {
  score: 92,
  summary: "Your profile is strong for Internal Medicine pathways.",
  nextStep: "Add training preferences to unlock sharper matches.",
  items: [
    { label: "Credentials verified", detail: "MBBS & residency confirmed", done: true },
    { label: "Specialty focus", detail: "Internal Medicine · Cardiology interest", done: true },
    { label: "Research & publications", detail: "2 items on your profile", done: true },
    { label: "Training preferences", detail: "Location & duration not set", done: false },
  ],
};

export const upcomingInterviews = [
  {
    id: "i1",
    title: "Cardiology Subspecialty Elective",
    hospital: "University Medical Center",
    date: "Jul 24, 2026",
    time: "10:00 AM",
    mode: "On-site",
    location: "Riyadh",
    applicationId: "a2",
  },
];

export const applicationTimeline = [
  {
    id: "t1",
    title: "Cardiology Subspecialty Elective",
    hospital: "University Medical Center",
    steps: [
      { label: "Submitted", date: "Jun 18", state: "done" as const },
      { label: "Under review", date: "Jun 28", state: "done" as const },
      { label: "Interview", date: "Jul 24", state: "current" as const },
      { label: "Decision", date: "Pending", state: "upcoming" as const },
    ],
  },
  {
    id: "t2",
    title: "Internal Medicine Elective",
    hospital: "National Heart Center",
    steps: [
      { label: "Submitted", date: "Jul 2", state: "done" as const },
      { label: "Under review", date: "Jul 14", state: "current" as const },
      { label: "Interview", date: "—", state: "upcoming" as const },
      { label: "Decision", date: "—", state: "upcoming" as const },
    ],
  },
];

export function getOpportunityBySlug(slug: string) {
  return opportunities.find((o) => o.slug === slug);
}

export function getSavedOpportunities() {
  return opportunities.filter((o) => o.saved);
}

export function getRecommendedOpportunities(limit = 3) {
  return [...opportunities].sort((a, b) => b.matchScore - a.matchScore).slice(0, limit);
}
