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
  formatDate,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import { getDemoSubmissions, resolveRotationApplication } from "@/data/rotation-workflow";
import {
  monthLabel,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

const STATUS_STYLES: Record<string, string> = {
  Submitted: "bg-mm-teal-50 text-mm-teal-700 border-mm-teal/25",
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Missing: "bg-mm-gray-100 text-mm-text-muted border-mm-border",
  Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  "Needs Revision": "bg-rose-50 text-rose-800 border-rose-200",
};

export default function RotationStudentSubmissionsPage() {
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

  const submissions = useMemo(
    () => (app ? getDemoSubmissions(app.id) : []),
    [app],
  );

  if (!app) {
    return (
      <HospitalShell title="Submissions">
        <EmptyState
          title="Student not found"
          description="Return to rotations and select a confirmed intern."
        />
        <RotationBackLink href={`${base}/rotations`} label="Back to rotations" />
      </HospitalShell>
    );
  }

  return (
    <HospitalShell title="Submissions">
      <RotationBreadcrumbs
        items={[
          { label: "Rotations", href: `${base}/rotations` },
          { label: period, href: `${base}/rotations` },
          { label: specialtyLabel, href: specialtyHref },
          { label: app.applicantName },
          { label: "Submissions" },
        ]}
      />
      <RotationBackLink href={specialtyHref} label={`Back to ${specialtyLabel}`} />

      <div className="mb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
          Submissions
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {app.applicantName} · {specialtyLabel} · {monthLabel(selectedMonth)}{" "}
          {year}
        </p>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          title="No submissions yet"
          description="Documents, forms, and activity logs submitted by this student will appear here."
        />
      ) : (
        <div className="space-y-3">
          {submissions.map((item) => (
            <Panel key={item.id} className="!p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-mm-navy">{item.title}</p>
                  <p className="mt-1 text-sm text-mm-text-secondary">
                    {item.category}
                    {item.note ? ` · ${item.note}` : ""}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                    Updated {formatDate(item.updatedAt)}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[0.6875rem] font-semibold",
                    STATUS_STYLES[item.status] ?? STATUS_STYLES.Pending,
                  )}
                >
                  {item.status}
                </span>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </HospitalShell>
  );
}
