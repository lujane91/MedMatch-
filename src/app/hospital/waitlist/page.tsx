"use client";

import { useMemo } from "react";
import Link from "next/link";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  TypeBadge,
  formatDate,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  getApplicationsForHospital,
  monthLabel,
} from "@/data/hospital-demo";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalWaitlistPage() {
  const { activeHospitalId, applications } = useHospitalStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const waitlisted = useMemo(
    () =>
      getApplicationsForHospital(activeHospitalId, applications)
        .filter(
          (a) => a.status === "Waitlisted" && a.month === selectedMonth,
        )
        .sort(
          (a, b) =>
            a.specialtyId.localeCompare(b.specialtyId) ||
            new Date(a.submittedAt).getTime() -
              new Date(b.submittedAt).getTime(),
        ),
    [activeHospitalId, applications, selectedMonth],
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof waitlisted>();
    for (const app of waitlisted) {
      const list = map.get(app.specialtyId) ?? [];
      list.push(app);
      map.set(app.specialtyId, list);
    }
    return [...map.entries()].map(([specialtyId, apps]) => ({
      specialtyId: specialtyId as (typeof apps)[number]["specialtyId"],
      apps,
    }));
  }, [waitlisted]);

  return (
    <HospitalShell title="Waitlist">
      <PageIntro>
        Waitlisted internship applicants for {period}, grouped by specialty.
      </PageIntro>

      <MonthNavigator className="mb-6" />

      {groups.length === 0 ? (
        <EmptyState
          title={`Waitlist is empty for ${period}`}
          description="Waitlisted applicants for the selected month will appear here when capacity is full or a review decision places them on hold."
        />
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <section
              key={group.specialtyId}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm"
              aria-label={`${specialtyName(group.specialtyId)} waitlist`}
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
                      <p className="text-[0.8125rem] text-mm-text-secondary">
                        {app.university} · GPA {app.gpa.toFixed(2)} · Submitted{" "}
                        {formatDate(app.submittedAt)}
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
