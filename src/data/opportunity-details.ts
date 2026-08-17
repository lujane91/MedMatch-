import { getOpportunityBySlug, opportunities } from "@/data/mock";
import { browseOpportunities } from "@/data/browse";

export type DocumentStatus = "Uploaded" | "Missing" | "Optional";

export type OpportunityDetails = {
  slug: string;
  matchReasons: string[];
  profileCompletion: number;
  overview: {
    summary: string;
    objectives: string[];
    trainingStructure: string[];
    clinicalExposure: string[];
    learningOutcomes: string[];
  };
  requirements: {
    eligibility: string[];
    scfhs: string;
    language: string;
    documents: string[];
    experience: string;
    gpa: string;
  };
  timeline: {
    label: string;
    date: string;
    state: "done" | "current" | "upcoming";
  }[];
  requiredDocuments: {
    name: string;
    status: DocumentStatus;
    note: string;
  }[];
  institution: {
    name: string;
    mark: string;
    overview: string;
    location: string;
    culture: string;
    website: string;
    contact: string;
  };
  faqs: { question: string; answer: string }[];
};

const detailsBySlug: Record<string, OpportunityDetails> = {
  "internal-medicine": {
    slug: "internal-medicine",
    matchReasons: [
      "Your Internal Medicine specialty aligns with this elective’s core pathway.",
      "PGY-2 standing matches the program’s preferred training year.",
      "Cardiology-leaning research signals fit the inpatient cardiology track.",
      "Strong profile strength (92%) increases shortlisting confidence.",
      "Riyadh preference matches the National Heart Center location.",
    ],
    profileCompletion: 92,
    overview: {
      summary:
        "A structured inpatient elective designed for residents seeking deeper exposure to complex internal medicine, consultant-led decision making, and fellowship-ready clinical habits.",
      objectives: [
        "Strengthen diagnostic reasoning across multi-morbidity presentations",
        "Develop confident inpatient communication with patients and families",
        "Build readiness for cardiology-adjacent fellowship pathways",
      ],
      trainingStructure: [
        "Week 1–2: Ward immersion with daily consultant rounds",
        "Week 3: Specialty clinics and case conferences",
        "Week 4: Independent case ownership with supervised autonomy",
      ],
      clinicalExposure: [
        "Acute and chronic cardiac comorbidity management",
        "Interdisciplinary discharge planning",
        "Protected teaching time twice weekly",
      ],
      learningOutcomes: [
        "Document concise, consultant-ready progress notes",
        "Lead a case presentation to the multidisciplinary team",
        "Demonstrate safe escalation and handoff practices",
      ],
    },
    requirements: {
      eligibility: [
        "Enrolled in an accredited residency or internship pathway",
        "Good academic and professional standing",
        "Availability for full-time on-site participation",
      ],
      scfhs: "Active SCFHS registration required before start date",
      language: "Professional English and Arabic communication expected",
      documents: ["CV", "Transcript", "Internship certificate", "Letter of intent"],
      experience: "Minimum one completed inpatient rotation preferred",
      gpa: "Not strictly required · competitive profiles typically ≥ 3.5/4.0",
    },
    timeline: [
      { label: "Application opens", date: "Jun 1, 2026", state: "done" },
      { label: "Application deadline", date: "Aug 15, 2026", state: "current" },
      { label: "Interview window", date: "Aug 20–28, 2026", state: "upcoming" },
      { label: "Selection decision", date: "Sep 5, 2026", state: "upcoming" },
      { label: "Program start", date: "Oct 1, 2026", state: "upcoming" },
    ],
    requiredDocuments: [
      { name: "CV", status: "Uploaded", note: "Updated Jul 8, 2026" },
      { name: "Transcript", status: "Uploaded", note: "Verified" },
      { name: "Internship certificate", status: "Uploaded", note: "On file" },
      { name: "Recommendation letters", status: "Missing", note: "Required · 1–2 letters" },
      { name: "BLS", status: "Uploaded", note: "Valid through 2027" },
      { name: "ACLS", status: "Uploaded", note: "Valid through 2027" },
      { name: "License / SCFHS", status: "Optional", note: "Upload if available now" },
    ],
    institution: {
      name: "National Heart Center",
      mark: "NHC",
      overview:
        "A leading tertiary cardiac institution known for high-acuity inpatient care, structured teaching, and collaborative specialty services.",
      location: "Riyadh, Saudi Arabia",
      culture:
        "Mentorship-forward, feedback-rich, and oriented around safe autonomy for motivated trainees.",
      website: "#institution",
      contact: "training@nationalheart.sa · +966 11 000 0000",
    },
    faqs: [
      {
        question: "Is housing provided during the elective?",
        answer:
          "On-campus housing is limited and allocated by priority. Most trainees arrange nearby accommodation; the program office can share preferred partner residences.",
      },
      {
        question: "Can I apply before my recommendation letters are ready?",
        answer:
          "Yes. You may submit your application and upload recommendation letters before the deadline. Incomplete letter packets may delay interview scheduling.",
      },
      {
        question: "How competitive is selection?",
        answer:
          "Seats are limited and reviewed holistically—profile strength, specialty fit, and readiness for inpatient intensity are weighted heavily.",
      },
      {
        question: "Will this count toward my residency requirements?",
        answer:
          "Many programs accept this elective as structured clinical training. Confirm credit transfer with your home program director before applying.",
      },
    ],
  },
};

function buildDefaultDetails(slug: string): OpportunityDetails | null {
  const base = getOpportunityBySlug(slug);
  const browse = browseOpportunities.find((o) => o.slug === slug);
  if (!base) return null;

  const mark =
    browse?.hospitalMark ??
    base.hospital
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 4)
      .toUpperCase();

  return {
    slug,
    matchReasons: [
      `Your ${base.specialty} focus is a strong fit for this program.`,
      "Your training year aligns with the program’s expected readiness level.",
      "Profile strength and credentials support a competitive application.",
      `${base.location} matches your geographic preferences.`,
      "Your documented clinical interests map to the program’s learning goals.",
    ],
    profileCompletion: 92,
    overview: {
      summary: base.description,
      objectives: [
        "Build specialty-specific clinical confidence",
        "Practice under structured consultant supervision",
        "Prepare for the next stage of specialty training",
      ],
      trainingStructure: [
        "Orientation and service immersion",
        "Supervised clinical responsibility",
        "Feedback, assessment, and wrap-up presentation",
      ],
      clinicalExposure: base.tags.map((tag) => `${tag} exposure`),
      learningOutcomes: [
        "Demonstrate safe clinical judgment in supervised settings",
        "Communicate clearly with patients and care teams",
        "Document learning progress with measurable milestones",
      ],
    },
    requirements: {
      eligibility: [
        "Healthcare graduate or trainee in good standing",
        "Ability to commit to the full training duration",
      ],
      scfhs: "SCFHS registration preferred or in progress",
      language: "English required · Arabic preferred",
      documents: ["CV", "Transcript", "Relevant certificates"],
      experience: "Prior clinical exposure in related settings preferred",
      gpa: "Not required for all applicants",
    },
    timeline: [
      { label: "Application opens", date: "Rolling", state: "done" },
      { label: "Application deadline", date: base.deadline, state: "current" },
      { label: "Interview", date: "TBA", state: "upcoming" },
      { label: "Selection", date: "TBA", state: "upcoming" },
      { label: "Start date", date: "TBA", state: "upcoming" },
    ],
    requiredDocuments: [
      { name: "CV", status: "Uploaded", note: "On file" },
      { name: "Transcript", status: "Uploaded", note: "On file" },
      { name: "Internship certificate", status: "Uploaded", note: "On file" },
      { name: "Recommendation letters", status: "Missing", note: "Required" },
      { name: "BLS", status: "Uploaded", note: "Valid" },
      { name: "ACLS", status: "Optional", note: "Recommended" },
      { name: "License", status: "Optional", note: "If available" },
    ],
    institution: {
      name: base.hospital,
      mark,
      overview: `${base.hospital} offers structured clinical training with emphasis on high-quality teaching and patient-centered care.`,
      location: `${base.location}, Saudi Arabia`,
      culture: "Collaborative, teaching-oriented, and trainee-supportive.",
      website: "#institution",
      contact: "education@hospital.sa",
    },
    faqs: [
      {
        question: "How do I apply?",
        answer:
          "Use Apply Now to start your MedJourney application. Your profile and uploaded documents will prefill most fields.",
      },
      {
        question: "Can I save this opportunity for later?",
        answer:
          "Yes. Save keeps it in your bookmarks so you can compare programs before submitting.",
      },
      {
        question: "Who reviews my application?",
        answer:
          "The host institution’s education office reviews applications. MedJourney tracks status updates for you.",
      },
    ],
  };
}

export function getOpportunityDetails(slug: string): OpportunityDetails | null {
  return detailsBySlug[slug] ?? buildDefaultDetails(slug);
}

export function getSimilarOpportunities(slug: string, limit = 3) {
  const current = getOpportunityBySlug(slug);
  if (!current) return [];
  return opportunities
    .filter((o) => o.slug !== slug)
    .sort((a, b) => {
      const specialtyBoost =
        (b.specialty === current.specialty ? 20 : 0) -
        (a.specialty === current.specialty ? 20 : 0);
      return specialtyBoost + (b.matchScore - a.matchScore);
    })
    .slice(0, limit);
}
