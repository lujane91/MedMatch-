import {
  monthLabel,
  resolveSpecialtyName,
  toDisplayStatus,
  type DisplayApplicationStatus,
  type Gender,
  type HospitalApplication,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";

export type ApplicationSortKey =
  | "gpa-desc"
  | "gpa-asc"
  | "submitted-desc"
  | "ranking-desc"
  | "profile-desc"
  | "name-asc";

export type ApplicationFiltersState = {
  search: string;
  gpaMin: string;
  gpaMax: string;
  academicGradeMin: string;
  graduationYear: string;
  expectedGraduationDate: string;
  university: string;
  affiliatedHospital: string;
  college: string;
  country: string;
  specialtyId: SpecialtyId | "all";
  rotationMonth: MonthKey | "all";
  submittedFrom: string;
  submittedTo: string;
  status: DisplayApplicationStatus | "all";
  applicantType: "all" | "Internal" | "External";
  firstChoiceSpecialtyId: SpecialtyId | "all";
  secondChoiceSpecialtyId: SpecialtyId | "all";
  meetsRequirements: "all" | "yes" | "no";
  cvUploaded: "all" | "yes" | "no";
  transcriptUploaded: "all" | "yes" | "no";
  certificatesUploaded: "all" | "yes" | "no";
  publicationsAvailable: "all" | "yes" | "no";
  researchAvailable: "all" | "yes" | "no";
  gender: Gender | "all";
  nationality: string;
  language: string;
  profileMin: string;
  certificatesMin: string;
  publicationsMin: string;
  researchMin: string;
};

export const DEFAULT_APPLICATION_FILTERS: ApplicationFiltersState = {
  search: "",
  gpaMin: "",
  gpaMax: "",
  academicGradeMin: "",
  graduationYear: "",
  expectedGraduationDate: "",
  university: "",
  affiliatedHospital: "",
  college: "",
  country: "",
  specialtyId: "all",
  rotationMonth: "all",
  submittedFrom: "",
  submittedTo: "",
  status: "all",
  applicantType: "all",
  firstChoiceSpecialtyId: "all",
  secondChoiceSpecialtyId: "all",
  meetsRequirements: "all",
  cvUploaded: "all",
  transcriptUploaded: "all",
  certificatesUploaded: "all",
  publicationsAvailable: "all",
  researchAvailable: "all",
  gender: "all",
  nationality: "",
  language: "",
  profileMin: "",
  certificatesMin: "",
  publicationsMin: "",
  researchMin: "",
};

export type ActiveFilterChip = {
  key: keyof ApplicationFiltersState;
  label: string;
};

function hasDoc(
  app: HospitalApplication,
  kind: HospitalApplication["documents"][number]["kind"],
): boolean {
  return app.documents?.some((doc) => doc.kind === kind) ?? false;
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function matchesTriState(
  flag: boolean,
  state: "all" | "yes" | "no",
): boolean {
  if (state === "all") return true;
  return state === "yes" ? flag : !flag;
}

export function filterApplications(
  apps: HospitalApplication[],
  filters: ApplicationFiltersState,
): HospitalApplication[] {
  const search = filters.search.trim().toLowerCase();
  const gpaMin = parseOptionalNumber(filters.gpaMin);
  const gpaMax = parseOptionalNumber(filters.gpaMax);
  const academicMin = parseOptionalNumber(filters.academicGradeMin);
  const profileMin = parseOptionalNumber(filters.profileMin);
  const certMin = parseOptionalNumber(filters.certificatesMin);
  const pubMin = parseOptionalNumber(filters.publicationsMin);
  const researchMin = parseOptionalNumber(filters.researchMin);

  return apps.filter((app) => {
    if (search) {
      const haystack = [
        app.applicantName,
        app.university,
        app.studentId,
        app.nationalId,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    if (gpaMin !== null && app.gpa < gpaMin) return false;
    if (gpaMax !== null && app.gpa > gpaMax) return false;
    if (academicMin !== null && app.clinicalGrade < academicMin) return false;
    if (
      filters.graduationYear &&
      String(app.graduationYear) !== filters.graduationYear.trim()
    ) {
      return false;
    }
    if (
      filters.expectedGraduationDate &&
      !app.expectedGraduationDate.startsWith(filters.expectedGraduationDate.trim())
    ) {
      return false;
    }
    if (
      filters.university &&
      !app.university.toLowerCase().includes(filters.university.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.affiliatedHospital &&
      !(app.affiliatedHospital ?? "")
        .toLowerCase()
        .includes(filters.affiliatedHospital.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.college &&
      !app.college.toLowerCase().includes(filters.college.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.country &&
      !app.country.toLowerCase().includes(filters.country.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.specialtyId !== "all" && app.specialtyId !== filters.specialtyId) {
      return false;
    }
    if (filters.rotationMonth !== "all" && app.month !== filters.rotationMonth) {
      return false;
    }
    if (filters.submittedFrom) {
      const from = new Date(filters.submittedFrom).getTime();
      if (new Date(app.submittedAt).getTime() < from) return false;
    }
    if (filters.submittedTo) {
      const to = new Date(filters.submittedTo);
      to.setHours(23, 59, 59, 999);
      if (new Date(app.submittedAt).getTime() > to.getTime()) return false;
    }
    if (
      filters.status !== "all" &&
      toDisplayStatus(app.status) !== filters.status
    ) {
      return false;
    }
    if (
      filters.applicantType !== "all" &&
      app.applicantType !== filters.applicantType
    ) {
      return false;
    }
    if (
      filters.firstChoiceSpecialtyId !== "all" &&
      app.firstChoiceSpecialtyId !== filters.firstChoiceSpecialtyId
    ) {
      return false;
    }
    if (
      filters.secondChoiceSpecialtyId !== "all" &&
      app.secondChoiceSpecialtyId !== filters.secondChoiceSpecialtyId
    ) {
      return false;
    }
    if (
      !matchesTriState(app.meetsRequirements, filters.meetsRequirements)
    ) {
      return false;
    }
    if (!matchesTriState(hasDoc(app, "CV"), filters.cvUploaded)) return false;
    if (!matchesTriState(hasDoc(app, "Transcript"), filters.transcriptUploaded)) {
      return false;
    }
    if (
      !matchesTriState(app.certificateCount > 0, filters.certificatesUploaded)
    ) {
      return false;
    }
    if (
      !matchesTriState(app.publicationCount > 0, filters.publicationsAvailable)
    ) {
      return false;
    }
    if (!matchesTriState(app.researchCount > 0, filters.researchAvailable)) {
      return false;
    }
    if (filters.gender !== "all" && app.gender !== filters.gender) return false;
    if (
      filters.nationality &&
      !app.nationality
        .toLowerCase()
        .includes(filters.nationality.trim().toLowerCase())
    ) {
      return false;
    }
    if (filters.language) {
      const lang = filters.language.trim().toLowerCase();
      if (!app.languages.some((item) => item.toLowerCase().includes(lang))) {
        return false;
      }
    }
    if (profileMin !== null && app.profileStrength < profileMin) return false;
    if (certMin !== null && app.certificateCount < certMin) return false;
    if (pubMin !== null && app.publicationCount < pubMin) return false;
    if (researchMin !== null && app.researchCount < researchMin) return false;

    return true;
  });
}

export function sortApplications(
  apps: HospitalApplication[],
  sortKey: ApplicationSortKey,
): HospitalApplication[] {
  const sorted = [...apps];
  sorted.sort((a, b) => {
    switch (sortKey) {
      case "gpa-desc":
        return b.gpa - a.gpa || a.applicantName.localeCompare(b.applicantName);
      case "gpa-asc":
        return a.gpa - b.gpa || a.applicantName.localeCompare(b.applicantName);
      case "submitted-desc":
        return (
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
      case "ranking-desc":
        return (
          b.rankingScore - a.rankingScore ||
          a.applicantName.localeCompare(b.applicantName)
        );
      case "profile-desc":
        return (
          b.profileStrength - a.profileStrength ||
          a.applicantName.localeCompare(b.applicantName)
        );
      case "name-asc":
      default:
        return a.applicantName.localeCompare(b.applicantName);
    }
  });
  return sorted;
}

export function getActiveFilterChips(
  filters: ApplicationFiltersState,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  const push = (key: keyof ApplicationFiltersState, label: string) => {
    chips.push({ key, label });
  };

  if (filters.search.trim()) push("search", `Search: ${filters.search.trim()}`);
  if (filters.gpaMin) push("gpaMin", `GPA ≥ ${filters.gpaMin}`);
  if (filters.gpaMax) push("gpaMax", `GPA ≤ ${filters.gpaMax}`);
  if (filters.academicGradeMin) {
    push("academicGradeMin", `Academic grade ≥ ${filters.academicGradeMin}`);
  }
  if (filters.graduationYear) {
    push("graduationYear", `Grad year ${filters.graduationYear}`);
  }
  if (filters.expectedGraduationDate) {
    push(
      "expectedGraduationDate",
      `Expected grad ${filters.expectedGraduationDate}`,
    );
  }
  if (filters.university.trim()) {
    push("university", `University: ${filters.university.trim()}`);
  }
  if (filters.affiliatedHospital.trim()) {
    push(
      "affiliatedHospital",
      `Affiliated: ${filters.affiliatedHospital.trim()}`,
    );
  }
  if (filters.college.trim()) push("college", `College: ${filters.college.trim()}`);
  if (filters.country.trim()) push("country", `Country: ${filters.country.trim()}`);
  if (filters.specialtyId !== "all") {
    push(
      "specialtyId",
      `Specialty: ${resolveSpecialtyName(filters.specialtyId)}`,
    );
  }
  if (filters.rotationMonth !== "all") {
    push("rotationMonth", `Month: ${monthLabel(filters.rotationMonth)}`);
  }
  if (filters.submittedFrom) {
    push("submittedFrom", `From ${filters.submittedFrom}`);
  }
  if (filters.submittedTo) push("submittedTo", `To ${filters.submittedTo}`);
  if (filters.status !== "all") push("status", `Status: ${filters.status}`);
  if (filters.applicantType !== "all") {
    push("applicantType", filters.applicantType);
  }
  if (filters.firstChoiceSpecialtyId !== "all") {
    push(
      "firstChoiceSpecialtyId",
      `1st choice: ${resolveSpecialtyName(filters.firstChoiceSpecialtyId)}`,
    );
  }
  if (filters.secondChoiceSpecialtyId !== "all") {
    push(
      "secondChoiceSpecialtyId",
      `2nd choice: ${resolveSpecialtyName(filters.secondChoiceSpecialtyId)}`,
    );
  }
  if (filters.meetsRequirements === "yes") {
    push("meetsRequirements", "Meets requirements");
  }
  if (filters.meetsRequirements === "no") {
    push("meetsRequirements", "Missing requirements");
  }
  if (filters.cvUploaded !== "all") {
    push("cvUploaded", filters.cvUploaded === "yes" ? "CV uploaded" : "No CV");
  }
  if (filters.transcriptUploaded !== "all") {
    push(
      "transcriptUploaded",
      filters.transcriptUploaded === "yes"
        ? "Transcript uploaded"
        : "No transcript",
    );
  }
  if (filters.certificatesUploaded !== "all") {
    push(
      "certificatesUploaded",
      filters.certificatesUploaded === "yes"
        ? "Certificates uploaded"
        : "No certificates",
    );
  }
  if (filters.publicationsAvailable !== "all") {
    push(
      "publicationsAvailable",
      filters.publicationsAvailable === "yes"
        ? "Publications available"
        : "No publications",
    );
  }
  if (filters.researchAvailable !== "all") {
    push(
      "researchAvailable",
      filters.researchAvailable === "yes" ? "Research available" : "No research",
    );
  }
  if (filters.gender !== "all") push("gender", filters.gender);
  if (filters.nationality.trim()) {
    push("nationality", `Nationality: ${filters.nationality.trim()}`);
  }
  if (filters.language.trim()) {
    push("language", `Language: ${filters.language.trim()}`);
  }
  if (filters.profileMin) push("profileMin", `Profile ≥ ${filters.profileMin}%`);
  if (filters.certificatesMin) {
    push("certificatesMin", `Certificates ≥ ${filters.certificatesMin}`);
  }
  if (filters.publicationsMin) {
    push("publicationsMin", `Publications ≥ ${filters.publicationsMin}`);
  }
  if (filters.researchMin) {
    push("researchMin", `Research ≥ ${filters.researchMin}`);
  }

  return chips;
}

export function clearFilterKey(
  filters: ApplicationFiltersState,
  key: keyof ApplicationFiltersState,
): ApplicationFiltersState {
  return {
    ...filters,
    [key]: DEFAULT_APPLICATION_FILTERS[key],
  };
}
