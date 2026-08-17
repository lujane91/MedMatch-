import {
  DEMO_APPLICATIONS,
  DEMO_HOSPITALS,
  DEMO_HOSPITAL_SPECIALTIES,
  isAcceptedStatus,
  type HospitalProfile,
} from "@/data/hospital-demo";
import { DEMO_TEAM_USERS } from "@/data/hospital-settings";
import {
  DEMO_PLATFORM_SUBSCRIBERS,
  type PlatformSubscriberRecord,
  type SubscriberHistoryStatus,
} from "@/data/platform-subscription-plan";

export type PlatformAccountStatus =
  | "Active"
  | "Inactive"
  | "Suspended";

export type HospitalApprovalStatus = "Pending" | "Approved" | "Rejected";

export type PlatformStudentRecord = {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  university: string;
  accountStatus: PlatformAccountStatus;
  subscriptionStatus: SubscriberHistoryStatus;
  planName: string;
  amountPaid: number;
  paymentDate: string;
  expiryDate: string;
  lastReminderAt: string | null;
};

export type PlatformHospitalRecord = {
  id: string;
  name: string;
  city: string;
  type: HospitalProfile["type"];
  logo: string | null;
  accountStatus: PlatformAccountStatus;
  approvalStatus: HospitalApprovalStatus;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  internshipProgramName: string;
  specialtyCount: number;
  applicationCount: number;
  rotationCount: number;
  administratorCount: number;
  specialties: string[];
  administrators: { name: string; email: string; position: string }[];
};

function seededAccountStatus(seed: string): PlatformAccountStatus {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bucket = hash % 20;
  if (bucket === 0) return "Suspended";
  if (bucket <= 2) return "Inactive";
  return "Active";
}

function emailFromName(name: string, id: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim()
    .replace(/\s+/g, ".");
  return `${slug || "student"}.${id.slice(-4)}@medstudent.sa`;
}

export function buildDemoPlatformStudents(): PlatformStudentRecord[] {
  return DEMO_PLATFORM_SUBSCRIBERS.map((row: PlatformSubscriberRecord) => ({
    id: row.id,
    studentId: row.studentId,
    fullName: row.studentName,
    email: emailFromName(row.studentName, row.id),
    university: row.university,
    accountStatus: seededAccountStatus(row.id),
    subscriptionStatus: row.status,
    planName: row.planName,
    amountPaid: row.amountPaid,
    paymentDate: row.paymentDate,
    expiryDate: row.expiryDate,
    lastReminderAt: null,
  }));
}

export function buildDemoPlatformHospitals(): PlatformHospitalRecord[] {
  return DEMO_HOSPITALS.map((hospital, index) => {
    const specialties = DEMO_HOSPITAL_SPECIALTIES.filter(
      (s) => s.hospitalId === hospital.id && s.active,
    );
    const applications = DEMO_APPLICATIONS.filter(
      (app) => app.hospitalId === hospital.id,
    );
    const rotations = applications.filter((app) => isAcceptedStatus(app.status));
    const admins = DEMO_TEAM_USERS.filter(
      (user) => user.hospitalId === hospital.id,
    );
    const approvalStatus: HospitalApprovalStatus =
      index === DEMO_HOSPITALS.length - 1 ? "Pending" : "Approved";

    return {
      id: hospital.id,
      name: hospital.name,
      city: hospital.city,
      type: hospital.type,
      logo: hospital.logo,
      accountStatus:
        approvalStatus === "Pending"
          ? "Inactive"
          : seededAccountStatus(hospital.id),
      approvalStatus,
      adminName: hospital.adminName,
      adminEmail: hospital.adminEmail,
      adminPhone: hospital.adminPhone,
      internshipProgramName: hospital.internshipProgramName,
      specialtyCount: specialties.length,
      applicationCount: applications.length,
      rotationCount: rotations.length,
      administratorCount: Math.max(admins.length, 1),
      specialties: specialties.map((s) => s.name),
      administrators:
        admins.length > 0
          ? admins.map((user) => ({
              name: user.name,
              email: user.email,
              position: user.position,
            }))
          : [
              {
                name: hospital.adminName,
                email: hospital.adminEmail,
                position: "Hospital Director",
              },
            ],
    };
  });
}

export const DEMO_PLATFORM_STUDENTS = buildDemoPlatformStudents();
export const DEMO_PLATFORM_HOSPITALS = buildDemoPlatformHospitals();
