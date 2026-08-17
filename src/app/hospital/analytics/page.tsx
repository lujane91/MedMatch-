"use client";

import { useMemo } from "react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  CapacityUsageChart,
  HospitalLogo,
  Panel,
  SimpleBarChart,
  SplitComparisonChart,
  StatCard,
} from "@/components/hospital/hospital-ui";
import {
  DEMO_SPECIALTIES,
  MONTHS,
  computeCapacityRow,
  getApplicationsForHospital,
  isAcceptedStatus,
  toDisplayStatus,
} from "@/data/hospital-demo";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalAnalyticsPage() {
  const {
    activeHospital,
    activeHospitalId,
    activeSpecialties,
    applications,
    capacities,
  } = useHospitalStore();
  const { selectedMonth, year, isAllYear } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, isAllYear);

  const specialtyCatalog = useMemo(
    () =>
      activeSpecialties.length > 0
        ? activeSpecialties.filter((s) => s.active)
        : DEMO_SPECIALTIES,
    [activeSpecialties],
  );

  const allApps = useMemo(
    () => getApplicationsForHospital(activeHospitalId, applications),
    [activeHospitalId, applications],
  );

  const apps = useMemo(
    () =>
      isAllYear
        ? allApps
        : allApps.filter((app) => app.month === selectedMonth),
    [allApps, isAllYear, selectedMonth],
  );

  const metrics = useMemo(() => {
    const total = apps.length;
    const accepted = apps.filter((a) => isAcceptedStatus(a.status)).length;
    const rejected = apps.filter(
      (a) => toDisplayStatus(a.status) === "Rejected",
    ).length;
    const pending = apps.filter(
      (a) => toDisplayStatus(a.status) === "Pending",
    ).length;
    const waitlisted = apps.filter(
      (a) => toDisplayStatus(a.status) === "Waitlisted",
    ).length;

    const acceptanceRate =
      total <= 0 ? 0 : Math.round((accepted / total) * 100);
    const rejectionRate =
      total <= 0 ? 0 : Math.round((rejected / total) * 100);

    let remainingCapacity = 0;
    let totalCapacity = 0;
    let filledSlots = 0;

    const monthsInScope = isAllYear
      ? MONTHS.map((m) => m.key)
      : [selectedMonth];

    const monthlyUsage = MONTHS.map((month) => {
      if (!isAllYear && month.key !== selectedMonth) {
        return { label: month.label.slice(0, 3), filled: 0, total: 0 };
      }
      let filled = 0;
      let totalSlots = 0;
      for (const specialty of specialtyCatalog) {
        const row = computeCapacityRow(
          specialty.id,
          month.key,
          activeHospitalId,
          applications,
          capacities,
          {
            specialtyActive:
              "active" in specialty ? specialty.active !== false : true,
          },
        );
        if (!row) continue;
        filled += row.acceptedCount;
        totalSlots += row.totalSlots;
      }
      return {
        label: month.label.slice(0, 3),
        filled,
        total: totalSlots,
      };
    }).filter((item) => item.total > 0 || item.filled > 0);

    for (const month of monthsInScope) {
      for (const specialty of specialtyCatalog) {
        const row = computeCapacityRow(
          specialty.id,
          month,
          activeHospitalId,
          applications,
          capacities,
          {
            specialtyActive:
              "active" in specialty ? specialty.active !== false : true,
          },
        );
        if (!row) continue;
        remainingCapacity += row.remaining;
        totalCapacity += row.totalSlots;
        filledSlots += row.acceptedCount;
      }
    }

    const occupancyRate =
      totalCapacity <= 0
        ? 0
        : Math.round((filledSlots / totalCapacity) * 100);

    const bySpecialty = specialtyCatalog
      .map((specialty) => {
        const count = apps.filter((a) => a.specialtyId === specialty.id).length;
        return {
          label: specialty.name,
          value: count,
          hint: `${count}`,
        };
      })
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    const byUniversityMap = new Map<string, number>();
    for (const app of apps) {
      byUniversityMap.set(
        app.university,
        (byUniversityMap.get(app.university) ?? 0) + 1,
      );
    }
    const byUniversity = [...byUniversityMap.entries()]
      .map(([label, value]) => ({ label, value, hint: `${value}` }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const internalCount = apps.filter(
      (a) => a.applicantType === "Internal",
    ).length;
    const externalCount = apps.filter(
      (a) => a.applicantType === "External",
    ).length;

    return {
      total,
      accepted,
      rejected,
      pending,
      waitlisted,
      acceptanceRate,
      rejectionRate,
      remainingCapacity,
      totalCapacity,
      filledSlots,
      occupancyRate,
      monthlyUsage,
      bySpecialty,
      byUniversity,
      internalCount,
      externalCount,
    };
  }, [
    apps,
    specialtyCatalog,
    activeHospitalId,
    applications,
    capacities,
    isAllYear,
    selectedMonth,
  ]);

  return (
    <HospitalShell title="Analytics">
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <HospitalLogo
          src={activeHospital?.logo}
          name={activeHospital?.name ?? "Hospital"}
          className="h-14 w-14 rounded-[var(--mm-radius-lg)] bg-mm-white"
          imgClassName="p-1.5"
        />
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
            Dashboard Analytics
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {activeHospital?.name ?? "Hospital"} · {period}
          </p>
        </div>
      </div>

      <MonthNavigator allowAllYear className="mb-6" />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard label="Total Applications" value={metrics.total} />
        <StatCard
          label="Acceptance rate"
          value={`${metrics.acceptanceRate}%`}
          hint={`${metrics.accepted} accepted`}
        />
        <StatCard
          label="Rejection rate"
          value={`${metrics.rejectionRate}%`}
          hint={`${metrics.rejected} rejected`}
        />
        <StatCard label="Pending" value={metrics.pending} />
        <StatCard
          label="Capacity utilization"
          value={`${metrics.occupancyRate}%`}
          hint={`${metrics.filledSlots} filled of ${metrics.totalCapacity}`}
        />
        <StatCard
          label="Remaining Capacity"
          value={metrics.remainingCapacity}
        />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CapacityUsageChart
            title={
              isAllYear
                ? "Monthly Capacity Usage"
                : `Capacity usage · ${period}`
            }
            items={metrics.monthlyUsage}
          />
        </div>
        <div className="xl:col-span-2">
          <SplitComparisonChart
            title="Internal vs External Applicants"
            left={{ label: "Internal", value: metrics.internalCount }}
            right={{ label: "External", value: metrics.externalCount }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SimpleBarChart
          title="Applications by Specialty"
          items={metrics.bySpecialty}
          emptyLabel="No specialty applications yet."
        />
        <SimpleBarChart
          title="Applicants by university / hospital"
          items={metrics.byUniversity}
          emptyLabel="No university data yet."
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SimpleBarChart
          title="Most requested specialties"
          items={metrics.bySpecialty.slice(0, 6)}
          emptyLabel="No specialty requests yet."
        />
        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Status mix · {period}
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Accepted", value: metrics.accepted, tone: "teal" },
              { label: "Pending", value: metrics.pending, tone: "navy" },
              { label: "Rejected", value: metrics.rejected, tone: "error" },
              {
                label: "Waitlisted",
                value: metrics.waitlisted,
                tone: "amber",
              },
            ].map((item) => {
              const share =
                metrics.total === 0
                  ? 0
                  : Math.round((item.value / metrics.total) * 100);
              return (
                <div
                  key={item.label}
                  className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-3.5 py-3"
                >
                  <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                    {item.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-semibold text-mm-navy">
                    {item.value}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-mm-white">
                    <div
                      className={
                        item.tone === "teal"
                          ? "h-full rounded-full bg-mm-teal"
                          : item.tone === "error"
                            ? "h-full rounded-full bg-mm-error"
                            : item.tone === "amber"
                              ? "h-full rounded-full bg-mm-warning"
                              : "h-full rounded-full bg-mm-navy/70"
                      }
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[0.75rem] text-mm-text-secondary">
                    {share}% of applications
                  </p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </HospitalShell>
  );
}
