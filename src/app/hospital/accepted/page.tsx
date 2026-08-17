"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  TypeBadge,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  getApplicationsForHospital,
  isAcceptedStatus,
  monthLabel,
} from "@/data/hospital-demo";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalAcceptedPage() {
  const { activeHospitalId, applications } = useHospitalStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const accepted = useMemo(
    () =>
      getApplicationsForHospital(activeHospitalId, applications)
        .filter(
          (a) => isAcceptedStatus(a.status) && a.month === selectedMonth,
        )
        .sort(
          (a, b) =>
            a.specialtyId.localeCompare(b.specialtyId) ||
            a.applicantName.localeCompare(b.applicantName),
        ),
    [activeHospitalId, applications, selectedMonth],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof accepted>();
    for (const app of accepted) {
      const key = app.specialtyId;
      const list = map.get(key) ?? [];
      list.push(app);
      map.set(key, list);
    }
    return [...map.entries()].map(([specialtyId, apps]) => ({
      specialtyId: specialtyId as (typeof apps)[number]["specialtyId"],
      apps,
    }));
  }, [accepted]);

  return (
    <HospitalShell title="Accepted">
      <PageIntro>
        Accepted internship applicants for rotations in {period}, grouped by
        specialty.
      </PageIntro>

      <MonthNavigator className="mb-6" />

      {groups.length === 0 ? (
        <EmptyState
          title={`No accepted applicants for ${period}`}
          description="Accepted internship applicants for the selected month will appear here once decisions are made."
        />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section
              key={group.specialtyId}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm"
              aria-label={`${specialtyName(group.specialtyId)} ${monthLabel(selectedMonth)}`}
            >
              <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                {specialtyName(group.specialtyId)} · {monthLabel(selectedMonth)}{" "}
                {year}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.apps.map((app) => (
                  <li
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-mm-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/hospital/applications/${app.id}`}
                        className="font-medium text-mm-navy hover:text-mm-teal-700"
                      >
                        {app.applicantName}
                      </Link>
                      <p className="mt-1">
                        <Link
                          href={`/hospital/applications/${app.id}`}
                          className="text-[0.75rem] font-semibold text-mm-teal-700 hover:underline"
                        >
                          Student details / Evaluate
                        </Link>
                      </p>
                      <p className="text-[0.8125rem] text-mm-text-secondary">
                        {app.university}
                      </p>
                    </div>
                    <TypeBadge type={app.applicantType} />
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
