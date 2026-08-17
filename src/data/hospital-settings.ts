import {
  DEMO_SPECIALTIES,
  type SpecialtyId,
} from "@/data/hospital-demo";

export type TeamPermission = "administration" | "admissions" | "evaluations";

export const TEAM_PERMISSION_OPTIONS: {
  id: TeamPermission;
  label: string;
  description: string;
}[] = [
  {
    id: "administration",
    label: "Administration",
    description: "Manage programs, capacity, and hospital configuration.",
  },
  {
    id: "admissions",
    label: "Admissions",
    description: "Review and decide internship applications.",
  },
  {
    id: "evaluations",
    label: "Evaluations",
    description: "Complete and upload rotation evaluations.",
  },
];

export type HospitalTeamUser = {
  id: string;
  hospitalId: string;
  name: string;
  email: string;
  position: string;
  permissions: TeamPermission[];
  specialtyIds: SpecialtyId[];
};

export type AuditModule =
  | "Settings"
  | "Team Access"
  | "Programs"
  | "Applications"
  | "Rotations"
  | "Evaluations";

export type HospitalAuditEntry = {
  id: string;
  hospitalId: string;
  at: string;
  user: string;
  action: string;
  module: AuditModule;
};

export const ASSIGNABLE_SPECIALTIES = DEMO_SPECIALTIES;

const KFMC_TEAM: HospitalTeamUser[] = [
  {
    id: "team-kfmc-director",
    hospitalId: "kfmc",
    name: "Dr. Noura Al-Harbi",
    email: "n.alharbi@kfmc.med.sa",
    position: "Hospital Director",
    permissions: ["administration", "admissions", "evaluations"],
    specialtyIds: DEMO_SPECIALTIES.map((s) => s.id),
  },
  {
    id: "team-kfmc-admissions",
    hospitalId: "kfmc",
    name: "Maha Al-Qahtani",
    email: "m.alqahtani@kfmc.med.sa",
    position: "Admissions Coordinator",
    permissions: ["admissions"],
    specialtyIds: [
      "emergency-medicine",
      "internal-medicine",
      "pediatrics",
      "family-medicine",
    ],
  },
  {
    id: "team-kfmc-eval",
    hospitalId: "kfmc",
    name: "Dr. Khalid Al-Otaibi",
    email: "k.alotaibi@kfmc.med.sa",
    position: "Clinical Supervisor",
    permissions: ["evaluations"],
    specialtyIds: ["general-surgery", "orthopedics", "emergency-medicine"],
  },
  {
    id: "team-kfmc-admin",
    hospitalId: "kfmc",
    name: "Reem Al-Mutairi",
    email: "r.almutairi@kfmc.med.sa",
    position: "Program Administrator",
    permissions: ["administration", "admissions"],
    specialtyIds: [
      "internal-medicine",
      "pediatrics",
      "obstetrics-gynecology",
      "psychiatry",
    ],
  },
];

const KFSHRC_TEAM: HospitalTeamUser[] = [
  {
    id: "team-kfshrc-director",
    hospitalId: "kfshrc",
    name: "Dr. Abdullah Al-Qahtani",
    email: "a.alqahtani@kfshrc.edu.sa",
    position: "Hospital Director",
    permissions: ["administration", "admissions", "evaluations"],
    specialtyIds: DEMO_SPECIALTIES.map((s) => s.id),
  },
  {
    id: "team-kfshrc-admissions",
    hospitalId: "kfshrc",
    name: "Hana Al-Shehri",
    email: "h.alshehri@kfshrc.edu.sa",
    position: "Admissions Lead",
    permissions: ["admissions"],
    specialtyIds: ["internal-medicine", "pediatrics", "family-medicine"],
  },
];

const JHAH_TEAM: HospitalTeamUser[] = [
  {
    id: "team-jhah-director",
    hospitalId: "jhah",
    name: "Dr. Sara Al-Dosari",
    email: "sara.aldosari@jhah.com",
    position: "Hospital Director",
    permissions: ["administration", "admissions", "evaluations"],
    specialtyIds: DEMO_SPECIALTIES.map((s) => s.id),
  },
];

export const DEMO_TEAM_USERS: HospitalTeamUser[] = [
  ...KFMC_TEAM,
  ...KFSHRC_TEAM,
  ...JHAH_TEAM,
];

function auditAt(day: number, hour: number, minute = 0) {
  return new Date(Date.UTC(2026, 6, day, hour, minute, 0)).toISOString();
}

export const DEMO_AUDIT_ENTRIES: HospitalAuditEntry[] = [
  {
    id: "audit-kfmc-1",
    hospitalId: "kfmc",
    at: auditAt(22, 9, 12),
    user: "Dr. Noura Al-Harbi",
    action: "User added",
    module: "Team Access",
  },
  {
    id: "audit-kfmc-2",
    hospitalId: "kfmc",
    at: auditAt(22, 10, 5),
    user: "Dr. Noura Al-Harbi",
    action: "Permission changed",
    module: "Team Access",
  },
  {
    id: "audit-kfmc-3",
    hospitalId: "kfmc",
    at: auditAt(21, 14, 40),
    user: "Maha Al-Qahtani",
    action: "Application accepted",
    module: "Applications",
  },
  {
    id: "audit-kfmc-4",
    hospitalId: "kfmc",
    at: auditAt(21, 15, 2),
    user: "Maha Al-Qahtani",
    action: "Application rejected",
    module: "Applications",
  },
  {
    id: "audit-kfmc-5",
    hospitalId: "kfmc",
    at: auditAt(20, 11, 18),
    user: "Reem Al-Mutairi",
    action: "Specialty created",
    module: "Programs",
  },
  {
    id: "audit-kfmc-6",
    hospitalId: "kfmc",
    at: auditAt(20, 11, 44),
    user: "Reem Al-Mutairi",
    action: "Capacity updated",
    module: "Programs",
  },
  {
    id: "audit-kfmc-7",
    hospitalId: "kfmc",
    at: auditAt(19, 16, 20),
    user: "Dr. Khalid Al-Otaibi",
    action: "Evaluation completed",
    module: "Evaluations",
  },
  {
    id: "audit-kfmc-8",
    hospitalId: "kfmc",
    at: auditAt(19, 16, 35),
    user: "Dr. Khalid Al-Otaibi",
    action: "Evaluation uploaded",
    module: "Evaluations",
  },
  {
    id: "audit-kfmc-9",
    hospitalId: "kfmc",
    at: auditAt(18, 8, 50),
    user: "Dr. Noura Al-Harbi",
    action: "User removed",
    module: "Team Access",
  },
  {
    id: "audit-kfmc-10",
    hospitalId: "kfmc",
    at: auditAt(17, 13, 10),
    user: "Reem Al-Mutairi",
    action: "Capacity updated",
    module: "Programs",
  },
  {
    id: "audit-kfshrc-1",
    hospitalId: "kfshrc",
    at: auditAt(22, 8, 30),
    user: "Dr. Abdullah Al-Qahtani",
    action: "User added",
    module: "Team Access",
  },
  {
    id: "audit-kfshrc-2",
    hospitalId: "kfshrc",
    at: auditAt(21, 12, 15),
    user: "Hana Al-Shehri",
    action: "Application accepted",
    module: "Applications",
  },
  {
    id: "audit-jhah-1",
    hospitalId: "jhah",
    at: auditAt(20, 9, 0),
    user: "Dr. Sara Al-Dosari",
    action: "Permission changed",
    module: "Team Access",
  },
];

export function permissionLabel(id: TeamPermission): string {
  return TEAM_PERMISSION_OPTIONS.find((option) => option.id === id)?.label ?? id;
}

export function formatAuditDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Riyadh",
  }).format(new Date(iso));
}

export function formatAuditTime(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Riyadh",
  }).format(new Date(iso));
}
