"use client";

import { useMemo } from "react";
import { useParams, usePathname } from "next/navigation";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  RotationBackLink,
  RotationBreadcrumbs,
} from "@/components/hospital/RotationBreadcrumbs";
import {
  EmptyState,
  Panel,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import { getDemoPerformance, resolveRotationApplication } from "@/data/rotation-workflow";
import {
  monthLabel,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function RotationStudentPerformancePage() {
  const params = useParams<{ specialtyId: string; applicationId: string }>();
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const specialtyId = params.specialtyId as SpecialtyId;
  const { activeHospitalId, applications } = useHospitalStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);
  const app = resolveRotationApplication(params.applicationId, applications, {
    hospitalId: activeHospitalId,
    specialtyId,
    month: selectedMonth,
    year,
  });
  const specialtyLabel = specialtyName(specialtyId);
  const specialtyHref = `${base}/rotations/${specialtyId}`;

  const performance = useMemo(
    () => (app ? getDemoPerformance(app.id) : null),
    [app],
  );

  if (!app || !performance) {
    return (
      <HospitalShell title="Performance">
        <EmptyState
          title="Student not found"
          description="Return to rotations and select a confirmed intern."
        />
        <RotationBackLink href={`${base}/rotations`} label="Back to rotations" />
      </HospitalShell>
    );
  }

  return (
    <HospitalShell title="Performance">
      <RotationBreadcrumbs
        items={[
          { label: "Rotations", href: `${base}/rotations` },
          { label: period, href: `${base}/rotations` },
          { label: specialtyLabel, href: specialtyHref },
          { label: app.applicantName },
          { label: "Performance" },
        ]}
      />
      <RotationBackLink href={specialtyHref} label={`Back to ${specialtyLabel}`} />

      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
          Performance
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {app.applicantName} · {specialtyLabel} · {monthLabel(selectedMonth)}{" "}
          {year}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Panel className="!p-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            Attendance
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-mm-navy">
            {performance.attendancePct}%
          </p>
        </Panel>
        <Panel className="!p-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            Punctuality
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-mm-navy">
            {performance.punctualityPct}%
          </p>
        </Panel>
        <Panel className="!p-4">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            Rotation progress
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-mm-navy">
            {performance.progressPct}%
          </p>
        </Panel>
      </div>

      <Panel className="mt-4">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
          Completed requirements
        </h3>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {performance.requirementsCompleted} of {performance.requirementsTotal}{" "}
          required items completed
        </p>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-mm-gray-100">
          <div
            className="h-full rounded-full bg-mm-teal"
            style={{ width: `${performance.progressPct}%` }}
          />
        </div>
      </Panel>

      <Panel className="mt-4">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
          Performance records
        </h3>
        <dl className="mt-3 space-y-3">
          {performance.records.map((record) => (
            <div
              key={record.label}
              className="flex items-center justify-between gap-3 border-b border-mm-border pb-3 last:border-0 last:pb-0"
            >
              <dt className="text-sm text-mm-text-secondary">{record.label}</dt>
              <dd
                className={cn(
                  "text-sm font-semibold",
                  record.tone === "good" && "text-mm-teal-700",
                  record.tone === "warn" && "text-amber-700",
                  record.tone === "neutral" && "text-mm-navy",
                )}
              >
                {record.value}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel className="mt-4">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
          Supervisor notes
        </h3>
        <ul className="mt-3 space-y-2">
          {performance.supervisorNotes.map((note) => (
            <li
              key={note}
              className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-3.5 py-3 text-sm text-mm-text-secondary"
            >
              {note}
            </li>
          ))}
        </ul>
      </Panel>
    </HospitalShell>
  );
}
