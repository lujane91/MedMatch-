"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  formatDate,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  getApplicationsForHospital,
  monthLabel,
  toDisplayStatus,
} from "@/data/hospital-demo";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalRejectedPage() {
  const { activeHospitalId, applications } = useHospitalStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const rejected = useMemo(
    () =>
      getApplicationsForHospital(activeHospitalId, applications)
        .filter(
          (a) =>
            toDisplayStatus(a.status) === "Rejected" &&
            a.month === selectedMonth,
        )
        .sort(
          (a, b) =>
            a.specialtyId.localeCompare(b.specialtyId) ||
            new Date(b.submittedAt).getTime() -
              new Date(a.submittedAt).getTime(),
        ),
    [activeHospitalId, applications, selectedMonth],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof rejected>();
    for (const app of rejected) {
      const list = map.get(app.specialtyId) ?? [];
      list.push(app);
      map.set(app.specialtyId, list);
    }
    return [...map.entries()].map(([specialtyId, apps]) => ({
      specialtyId: specialtyId as (typeof apps)[number]["specialtyId"],
      apps,
    }));
  }, [rejected]);

  return (
    <HospitalShell title="Rejected">
      <PageIntro>
        Rejected internship applications for rotations in {period}, including
        rejection reasons and any alternative month suggested. Grouped by
        specialty.
      </PageIntro>

      <MonthNavigator className="mb-6" />

      {groups.length === 0 ? (
        <EmptyState
          title={`No rejected applications for ${period}`}
          description="Rejected applicants for the selected month will be listed here with their recorded reason."
        />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section
              key={group.specialtyId}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm"
              aria-label={`${specialtyName(group.specialtyId)} rejected`}
            >
              <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                {specialtyName(group.specialtyId)} · {monthLabel(selectedMonth)}{" "}
                {year}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.apps.map((app) => (
                  <li
                    key={app.id}
                    className="border-b border-mm-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          href={`/hospital/applications/${app.id}`}
                          className="font-medium text-mm-navy hover:text-mm-teal-700"
                        >
                          {app.applicantName}
                        </Link>
                        <p className="text-[0.8125rem] text-mm-text-secondary">
                          {app.university} · Submitted{" "}
                          {formatDate(app.submittedAt)}
                        </p>
                      </div>
                      <Link
                        href={`/hospital/applications/${app.id}`}
                        className="text-sm font-semibold text-mm-teal-700 hover:underline"
                      >
                        View
                      </Link>
                    </div>
                    <p className="mt-2 text-sm text-mm-error-700">
                      {app.rejectionReason ||
                        app.notes ||
                        "Reason not recorded"}
                    </p>
                    <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                      Alternative month:{" "}
                      {app.alternativeMonthSuggestions?.length
                        ? app.alternativeMonthSuggestions
                            .map((m) => monthLabel(m))
                            .join(", ")
                        : "—"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </HospitalShell>
  );
}
