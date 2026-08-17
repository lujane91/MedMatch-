import { currentUser, profileStrength } from "./mock";

export const profileData = {
  name: currentUser.name,
  title: currentUser.role,
  specialty: currentUser.specialty,
  year: currentUser.year,
  city: "Riyadh",
  country: "Saudi Arabia",
  institution: currentUser.institution,
  email: currentUser.email,
  phone: currentUser.phone,
  initials: "AH",
  verifiedBadges: [
    { id: "scfhs", label: "SCFHS Verified" },
    { id: "identity", label: "Identity Verified" },
    { id: "training", label: "Training Ready" },
  ],
  strength: {
    score: profileStrength.score,
    summary: profileStrength.summary,
    completed: profileStrength.items.filter((i) => i.done),
    missing: profileStrength.items.filter((i) => !i.done),
    recommendations: [
      "Add preferred training cities to improve geographic matching.",
      "Upload a recommendation letter to strengthen hospital applications.",
      "Complete ACLS documentation under Eligibility.",
    ],
  },
  summary: {
    bio: currentUser.bio,
    careerGoals:
      "Pursue a cardiology-focused fellowship pathway with strong inpatient exposure, research mentorship, and structured clinical leadership development.",
    preferredSpecialties: ["Internal Medicine", "Cardiology", "Critical Care"],
    preferredCities: ["Riyadh", "Jeddah", "Dammam"],
  },
  education: [
    {
      id: "edu1",
      university: "King Saud University",
      degree: "Bachelor of Medicine, Bachelor of Surgery (MBBS)",
      year: "2022",
      gpa: "3.82 / 4.00",
    },
    {
      id: "edu2",
      university: "King Fahad Medical City",
      degree: "Internal Medicine Residency",
      year: "2024–Present",
      gpa: "—",
    },
  ],
  clinicalExperience: [
    {
      id: "ce1",
      title: "Internal Medicine Internship",
      hospital: "King Fahad Medical City",
      duration: "Jul 2022 – Jun 2023",
      responsibilities: [
        "Managed inpatient ward care under consultant supervision",
        "Presented daily progress notes and participated in teaching rounds",
        "Coordinated multidisciplinary discharge planning",
      ],
    },
    {
      id: "ce2",
      title: "Cardiology Elective Rotation",
      hospital: "National Heart Center",
      duration: "Jan 2024 – Feb 2024",
      responsibilities: [
        "Supported coronary care unit rounds and consult services",
        "Assisted with ECG interpretation and case presentations",
        "Shadowed echocardiography and outpatient specialty clinics",
      ],
    },
  ],
  research: [
    {
      id: "r1",
      title: "Heart failure readmission pathways in tertiary care",
      role: "Co-investigator",
      status: "Active",
      year: "2025–2026",
    },
    {
      id: "r2",
      title: "ECG interpretation workshop outcomes among PGY-1 residents",
      role: "Lead author",
      status: "Completed",
      year: "2024",
    },
  ],
  publications: [
    {
      id: "p1",
      title: "Multidisciplinary approaches to inpatient heart failure care",
      venue: "Saudi Journal of Internal Medicine",
      type: "Journal article",
      year: "2025",
    },
    {
      id: "p2",
      title: "Improving ECG teaching through structured workshops",
      venue: "Gulf Cardiology Conference",
      type: "Conference poster",
      year: "2024",
    },
  ],
  courses: [
    {
      id: "c1",
      title: "Advanced Cardiac Life Support (ACLS)",
      provider: "Saudi Heart Association",
      year: "2025",
      type: "Certification",
    },
    {
      id: "c2",
      title: "Clinical Research Methods Workshop",
      provider: "King Saud University",
      year: "2024",
      type: "Workshop",
    },
    {
      id: "c3",
      title: "Point-of-Care Ultrasound Essentials",
      provider: "National Clinical Skills Center",
      year: "2024",
      type: "Course",
    },
  ],
  volunteer: [] as {
    id: string;
    title: string;
    organization: string;
    duration: string;
    description: string;
  }[],
  leadership: [
    {
      id: "l1",
      title: "Chief Intern Coordinator",
      organization: "King Fahad Medical City",
      duration: "2023",
      description:
        "Coordinated scheduling, orientation, and peer mentoring for incoming interns across internal medicine wards.",
    },
  ],
  skills: {
    medical: [
      "Clinical Reasoning",
      "ECG Interpretation",
      "Inpatient Management",
      "Patient Counseling",
    ],
    technical: ["Epic EMR", "SPSS Basics", "Medical Writing", "Literature Review"],
    soft: [
      "Communication",
      "Team Collaboration",
      "Time Management",
      "Leadership",
    ],
  },
  languages: [
    { id: "lang1", name: "Arabic", level: "Native" },
    { id: "lang2", name: "English", level: "Professional working proficiency" },
    { id: "lang3", name: "French", level: "Elementary" },
  ],
  documents: [
    { id: "d1", name: "Curriculum Vitae", status: "Uploaded", updated: "Jul 8, 2026" },
    { id: "d2", name: "Academic Transcript", status: "Uploaded", updated: "Jun 12, 2026" },
    { id: "d3", name: "Internship Certificate", status: "Uploaded", updated: "May 30, 2026" },
    { id: "d4", name: "Recommendation Letters", status: "Missing", updated: "—" },
  ],
  eligibility: [
    { id: "e1", name: "SCFHS Registration", status: "Verified", detail: "Active · Internal Medicine" },
    { id: "e2", name: "BLS", status: "Valid", detail: "Expires Nov 2027" },
    { id: "e3", name: "ACLS", status: "Valid", detail: "Expires Mar 2027" },
    { id: "e4", name: "Saudi Licensure", status: "In progress", detail: "Documents under review" },
  ],
};
