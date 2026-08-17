"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ClipboardCheck } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  Panel,
  StatusBadge,
  TypeBadge,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
  initials,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import { isAcceptedStatus, monthLabel } from "@/data/hospital-demo";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";
import { cn } from "@/lib/cn";

export default function HospitalStudentDetailsPage() {
  const params = useParams<{ id: string }>();
  const { applications, activeHospital } = useHospitalStore();
  const { getForApplication } = useEvaluationStore();
  const { year } = useHospitalMonth();
  const app = applications.find((a) => a.id === params.id);
  const evaluation = app ? getForApplication(app.id) : undefined;

  if (!app) {
    return (
      <HospitalShell title="Student Details">
        <Panel>
          <p className="text-sm text-mm-text-secondary">
            Student record not found.
          </p>
          <Link
            href="/hospital/rosters"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
          >
            <ArrowLeft size={16} />
            Back to rosters
          </Link>
        </Panel>
      </HospitalShell>
    );
  }

  const homeHospital =
    app.applicantType === "Internal"
      ? activeHospital?.name ?? "Home hospital"
      : app.affiliatedHospital || app.university;
  const canEvaluate = isAcceptedStatus(app.status);

  return (
    <HospitalShell title="Student Details">
      <Link
        href="/hospital/rosters"
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to rotation list
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-wrap items-start gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-mm-teal-50 text-sm font-bold text-mm-teal-700">
            {initials(app.applicantName)}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
              {app.applicantName}
            </h2>
            <p className="mt-1 text-sm text-mm-text-secondary">
              {app.university} · {specialtyName(app.specialtyId)} ·{" "}
              {monthLabel(app.month)} {year}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={app.status} />
              <TypeBadge type={app.applicantType} />
            </div>
          </div>
        </div>
        {canEvaluate ? (
          evaluation?.locked ? (
            <Link
              href={`/hospital/evaluations/${evaluation.id}`}
              className={buttonPrimaryClass}
            >
              <ClipboardCheck size={16} aria-hidden />
              View Evaluation
            </Link>
          ) : (
            <Link
              href={`/hospital/evaluations/new?applicationId=${app.id}`}
              className={buttonPrimaryClass}
            >
              <ClipboardCheck size={16} aria-hidden />
              Evaluate Student
            </Link>
          )
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Student profile summary
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Student ID</dt>
              <dd className="font-medium text-mm-navy">{app.studentId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">University</dt>
              <dd className="text-right font-medium text-mm-navy">
                {app.university}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">College</dt>
              <dd className="text-right font-medium text-mm-navy">
                {app.college}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Home hospital</dt>
              <dd className="text-right font-medium text-mm-navy">
                {homeHospital}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">GPA</dt>
              <dd className="font-medium text-mm-navy">{app.gpa.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Profile</dt>
              <dd className="font-medium text-mm-navy">
                {app.profileStrength}%
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Graduation year</dt>
              <dd className="font-medium text-mm-navy">{app.graduationYear}</dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Rotation information
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Hosting hospital</dt>
              <dd className="text-right font-medium text-mm-navy">
                {activeHospital?.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Specialty</dt>
              <dd className="font-medium text-mm-navy">
                {specialtyName(app.specialtyId)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Rotation month</dt>
              <dd className="font-medium text-mm-navy">
                {monthLabel(app.month)} {year}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Applicant type</dt>
              <dd className="font-medium text-mm-navy">{app.applicantType}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Submitted</dt>
              <dd className="font-medium text-mm-navy">
                {formatDate(app.submittedAt)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Status</dt>
              <dd>
                <StatusBadge status={app.status} display />
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Contact details
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Email</dt>
              <dd className="font-medium text-mm-navy">{app.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Phone</dt>
              <dd className="font-medium text-mm-navy">{app.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Gender</dt>
              <dd className="font-medium text-mm-navy">{app.gender}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Nationality</dt>
              <dd className="font-medium text-mm-navy">{app.nationality}</dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Evaluation
          </h3>
          {evaluation?.locked ? (
            <>
              <p className="mt-3 text-sm text-mm-text-secondary">
                Evaluation {evaluation.referenceNumber} is on file for this
                rotation.
              </p>
              <Link
                href={`/hospital/evaluations/${evaluation.id}`}
                className={cn(buttonSecondaryClass, "mt-4")}
              >
                View evaluation
              </Link>
            </>
          ) : canEvaluate ? (
            <>
              <p className="mt-3 text-sm text-mm-text-secondary">
                No evaluation has been submitted for this rotation yet.
              </p>
              <Link
                href={`/hospital/evaluations/new?applicationId=${app.id}`}
                className={cn(buttonPrimaryClass, "mt-4")}
              >
                Evaluate Student
              </Link>
            </>
          ) : (
            <p className="mt-3 text-sm text-mm-text-secondary">
              Evaluations are available for accepted trainees on the rotation
              roster.
            </p>
          )}
          <p className="mt-5 rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-3.5 py-3 text-sm text-mm-text-secondary">
            Use Accept, Reject, or Waitlist on the Applications list. Acceptance
            cannot exceed total slots for this specialty and month.
          </p>
        </Panel>
      </div>
    </HospitalShell>
  );
}
