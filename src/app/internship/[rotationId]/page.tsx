"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  evaluationPeriodLabel,
  openEvaluationPdf,
  type RotationEvaluation,
} from "@/data/evaluations";
import { hospitalById, type ApplicationStatus, type Rotation } from "@/data/intern";
import { profileData } from "@/data/profile";
import { cn } from "@/lib/cn";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useInternStore } from "@/lib/intern-store";

function findEvaluationForRotation(
  evaluations: RotationEvaluation[],
  rotation: Rotation,
): RotationEvaluation | undefined {
  const start = new Date(rotation.startDate);
  const month = Number.isNaN(start.getTime())
    ? null
    : String(start.getMonth() + 1).padStart(2, "0");
  const year = Number.isNaN(start.getTime()) ? null : start.getFullYear();
  const specialtyKey = rotation.specialty.trim().toLowerCase();

  return (
    evaluations.find(
      (item) =>
        item.locked &&
        item.visibleToStudent &&
        item.specialtyName.toLowerCase() === specialtyKey &&
        month !== null &&
        year !== null &&
        item.month === month &&
        item.year === year,
    ) ??
    evaluations.find(
      (item) =>
        item.locked &&
        item.visibleToStudent &&
        item.specialtyName.toLowerCase() === specialtyKey,
    )
  );
}

const simulateOptions: ApplicationStatus[] = [
  "Under Review",
  "Changes Requested",
  "Accepted",
  "Rejected",
];

export default function RotationDetailPage() {
  const params = useParams<{ rotationId: string }>();
  const {
    rotations,
    markRequirementUploaded,
    submitRotation,
    simulateStatus,
  } = useInternStore();
  const { getForStudent } = useEvaluationStore();
  const rotation = rotations.find((r) => r.id === params.rotationId);
  const studentEvaluations = getForStudent(
    profileData.email,
    profileData.name,
  );
  const matchedEvaluation = useMemo(
    () =>
      rotation
        ? findEvaluationForRotation(studentEvaluations, rotation)
        : undefined,
    [rotation, studentEvaluations],
  );

  if (!rotation) {
    return (
      <AppShell title="Rotation">
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-8 text-center">
          <p className="font-semibold text-mm-navy">Rotation not found</p>
          <Link
            href="/internship"
            className="mt-4 inline-flex text-mm-teal font-semibold"
          >
            Back to Internship Year
          </Link>
        </div>
      </AppShell>
    );
  }

  const canSubmit =
    rotation.status === "Ready to Submit" ||
    (rotation.requirements.every(
      (r) => !r.required || r.status === "uploaded",
    ) &&
      ["Draft", "Requirements Incomplete", "Ready to Submit"].includes(
        rotation.status,
      ));

  const primary = hospitalById(rotation.preferences[0] ?? "");

  return (
    <AppShell title={rotation.title}>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
              {rotation.status}
            </p>
            <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-3xl text-mm-navy">
              {rotation.title}
            </h1>
            <p className="mt-2 text-mm-text-secondary">
              {rotation.specialty} · {rotation.startDate} → {rotation.endDate}
            </p>
          </div>
          <Link
            href="/internship"
            className="inline-flex min-h-10 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
          >
            Back to year plan
          </Link>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Hospital preferences
          </h2>
          <ol className="mt-3 space-y-2">
            {rotation.preferences.map((id, i) => (
              <li key={id} className="text-[0.875rem] text-mm-text-secondary">
                {i + 1}. {hospitalById(id)?.name ?? id}
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Application timeline
          </h2>
          <div className="mt-4 space-y-3">
            {rotation.timeline.map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    item.done ? "bg-mm-teal" : "bg-mm-gray-200",
                  )}
                />
                <p
                  className={cn(
                    "text-[0.875rem]",
                    item.done
                      ? "font-medium text-mm-navy"
                      : "text-mm-text-muted",
                  )}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Requirements
          </h2>
          <div className="mt-3 space-y-2">
            {rotation.requirements.map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
              >
                <div>
                  <p className="text-[0.875rem] font-medium text-mm-navy">
                    {req.name}
                  </p>
                  <p className="text-[0.75rem] text-mm-text-muted">
                    {req.required ? "Required" : "Optional"} · {req.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    markRequirementUploaded(rotation.id, req.id)
                  }
                  className="rounded-[10px] border border-mm-border px-3 py-1.5 text-[0.75rem] font-semibold text-mm-navy"
                >
                  {req.status === "uploaded" ? "Uploaded" : "Upload"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {rotation.status === "Accepted" ? (
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-teal/30 bg-mm-teal-50/60 p-5">
            <h2 className="font-semibold text-mm-teal-700">Accepted</h2>
            <p className="mt-2 text-[0.875rem] text-mm-navy">
              Confirmed hospital: {primary?.name}
            </p>
            <p className="mt-1 text-[0.875rem] text-mm-navy">
              Specialty: {rotation.specialty}
            </p>
            <p className="mt-1 text-[0.875rem] text-mm-navy">
              Dates: {rotation.startDate} → {rotation.endDate}
            </p>
            <p className="mt-2 text-[0.875rem] text-mm-text-secondary">
              Contact: {rotation.contact}
            </p>
            <p className="mt-2 text-[0.875rem] text-mm-text-secondary">
              {rotation.decisionNote}
            </p>
          </div>
        ) : null}

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Evaluation
          </h2>
          {matchedEvaluation ? (
            <>
              <p className="mt-2 text-[0.875rem] text-mm-text-secondary">
                Finalized evaluation for {matchedEvaluation.specialtyName} ·{" "}
                {evaluationPeriodLabel(matchedEvaluation)}
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                {matchedEvaluation.referenceNumber} ·{" "}
                {matchedEvaluation.hostingHospitalName}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/evaluations/${matchedEvaluation.id}`}
                  className="inline-flex min-h-10 items-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.8125rem] font-semibold text-white"
                >
                  View Evaluation
                </Link>
                <button
                  type="button"
                  onClick={() => openEvaluationPdf(matchedEvaluation)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
                >
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            </>
          ) : (
            <p className="mt-2 text-[0.875rem] text-mm-text-secondary">
              No finalized evaluation is available for this rotation yet.
            </p>
          )}
        </div>

        {rotation.status === "Rejected" ? (
          <div className="rounded-[var(--mm-radius-xl)] border border-red-200 bg-red-50 p-5">
            <h2 className="font-semibold text-red-700">Rejected</h2>
            <p className="mt-2 text-[0.875rem] text-mm-navy">
              {rotation.decisionNote}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/internship/add"
                className="inline-flex min-h-10 items-center rounded-[var(--mm-radius-lg)] bg-mm-navy px-4 text-[0.8125rem] font-semibold text-white"
              >
                Apply to Another Hospital
              </Link>
              <Link
                href="/internship/add"
                className="inline-flex min-h-10 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
              >
                Edit Preferences
              </Link>
            </div>
          </div>
        ) : null}

        {rotation.status === "Changes Requested" ? (
          <div className="rounded-[var(--mm-radius-xl)] border border-amber-200 bg-amber-50 p-5">
            <h2 className="font-semibold text-amber-800">Changes requested</h2>
            <p className="mt-2 text-[0.875rem] text-mm-navy">
              {rotation.changesRequested}
            </p>
            <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
              Deadline: {rotation.changesDeadline}
            </p>
            <button
              type="button"
              onClick={() => simulateStatus(rotation.id, "Submitted")}
              className="mt-4 inline-flex min-h-10 items-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.8125rem] font-semibold text-white"
            >
              Resubmit
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {canSubmit ? (
            <button
              type="button"
              onClick={() => submitRotation(rotation.id)}
              className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white"
            >
              Submit Application
            </button>
          ) : null}
          {simulateOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => simulateStatus(rotation.id, status)}
              className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
            >
              Simulate: {status}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
