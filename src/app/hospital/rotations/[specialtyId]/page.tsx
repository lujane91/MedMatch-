"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  RotationBackLink,
  RotationBreadcrumbs,
} from "@/components/hospital/RotationBreadcrumbs";
import {
  EmptyState,
  TypeBadge,
  buttonSecondaryClass,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  expandSpecialtyRotationInterns,
} from "@/data/rotation-workflow";
import {
  getApplicationsForHospital,
  isAcceptedStatus,
  monthLabel,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { hospitalBaseFromPathname, withHospitalBase } from "@/lib/hospital-base-path";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalRotationSpecialtyPage() {
  const params = useParams<{ specialtyId: string }>();
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const specialtyId = params.specialtyId as SpecialtyId;
  const { activeHospitalId, applications } = useHospitalStore();
  const { getForApplication } = useEvaluationStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);
  const specialtyLabel = specialtyName(specialtyId);

  const students = useMemo(() => {
    const existing = getApplicationsForHospital(
      activeHospitalId,
      applications,
    ).filter(
      (app) =>
        isAcceptedStatus(app.status) &&
        app.month === selectedMonth &&
        app.specialtyId === specialtyId,
    );
    return expandSpecialtyRotationInterns(existing, {
      hospitalId: activeHospitalId,
      specialtyId,
      month: selectedMonth,
      year,
    });
  }, [
    activeHospitalId,
    applications,
    selectedMonth,
    specialtyId,
    year,
  ]);

  return (
    <HospitalShell title="Rotations">
      <RotationBreadcrumbs
        items={[
          { label: "Rotations", href: `${base}/rotations` },
          { label: period, href: `${base}/rotations` },
          { label: specialtyLabel },
        ]}
      />
      <RotationBackLink href={`${base}/rotations`} label="Back to specialties" />

      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
          {specialtyLabel}
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {monthLabel(selectedMonth)} {year}
        </p>
      </div>

      {students.length === 0 ? (
        <EmptyState
          title={`No interns in ${specialtyLabel}`}
          description="Accepted students for this specialty and month will appear here."
        />
      ) : (
        <ul className="space-y-3">
          {students.map((app) => {
            const evaluation = getForApplication(app.id);
            const submissionsHref = `${base}/rotations/${specialtyId}/${app.id}/submissions`;
            const performanceHref = `${base}/rotations/${specialtyId}/${app.id}/performance`;
            const returnTo = `${base}/rotations/${specialtyId}`;
            const evaluationHref = evaluation?.locked
              ? withHospitalBase(
                  pathname,
                  `/hospital/evaluations/${evaluation.id}?returnTo=${encodeURIComponent(returnTo)}`,
                )
              : withHospitalBase(
                  pathname,
                  `/hospital/evaluations/new?applicationId=${app.id}&returnTo=${encodeURIComponent(returnTo)}`,
                );

            return (
              <li
                key={app.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-mm-navy">
                      {app.applicantName}
                    </p>
                    <p className="mt-1 text-sm text-mm-text-secondary">
                      {app.university} · {app.applicantType}
                    </p>
                  </div>
                  <TypeBadge type={app.applicantType} />
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <Link
                    href={submissionsHref}
                    className={cn(buttonSecondaryClass, "justify-center")}
                  >
                    Submissions
                  </Link>
                  <Link
                    href={performanceHref}
                    className={cn(buttonSecondaryClass, "justify-center")}
                  >
                    Performance
                  </Link>
                  <Link
                    href={evaluationHref}
                    className={cn(buttonSecondaryClass, "justify-center")}
                  >
                    {evaluation?.locked
                      ? "View Evaluation"
                      : "Complete Evaluation"}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </HospitalShell>
  );
}
