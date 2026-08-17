"use client";

import { useMemo } from "react";
import {
  Activity,
  ClipboardList,
  Clock3,
  Layers,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  DashboardPeriodFilter,
} from "@/components/hospital/DashboardPeriodFilter";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  HospitalLogo,
  formatDateTime,
} from "@/components/hospital/hospital-ui";
import {
  DEMO_SPECIALTIES,
  MONTHS,
  computeCapacityRow,
  getApplicationsForHospital,
  getNotificationsForHospital,
  isAcceptedStatus,
  monthLabel,
  toDisplayStatus,
  type MonthKey,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { useDashboardFilters } from "@/lib/dashboard-filter-store";
import { useHospitalStore } from "@/lib/hospital-store";

const OVERVIEW_YEARS = [2024, 2025, 2026] as const;

const YEAR_SCALE: Record<number, number> = {
  2024: 0.78,
  2025: 1,
  2026: 1.12,
};

function scaleValue(base: number, year: number) {
  return Math.max(0, Math.round(base * (YEAR_SCALE[year] ?? 1)));
}

function deltaPercent(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function Widget({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--mm-radius-xl)] border border-mm-border/80 bg-mm-surface/90 p-3.5 shadow-mm-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

function KpiTile({
  icon: Icon,
  title,
  value,
  delta,
  suffix,
}: {
  icon: LucideIcon;
  title: string;
  value: string | number;
  delta: number;
  suffix?: string;
}) {
  const up = delta >= 0;
  return (
    <div className="min-w-0 rounded-[var(--mm-radius-lg)] border border-mm-border/70 bg-mm-surface px-3 py-2.5 shadow-mm-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal-700">
          <Icon size={14} strokeWidth={1.75} aria-hidden />
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-[0.6875rem] font-semibold",
            up ? "text-mm-teal-700" : "text-mm-text-muted",
          )}
        >
          {up ? (
            <TrendingUp size={12} strokeWidth={2.25} aria-hidden />
          ) : (
            <TrendingDown size={12} strokeWidth={2.25} aria-hidden />
          )}
          {delta > 0 ? "+" : ""}
          {delta}%
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-semibold tracking-tight text-mm-navy tabular-nums">
        {value}
        {suffix ? (
          <span className="text-sm font-semibold text-mm-text-secondary">
            {suffix}
          </span>
        ) : null}
      </p>
      <p className="mt-0.5 truncate text-[0.6875rem] font-medium text-mm-text-muted">
        {title}
      </p>
    </div>
  );
}

function RingProgress({
  value,
  label,
  detail,
}: {
  value: number;
  label: string;
  detail: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <Widget className="flex h-full flex-col">
      <p className="text-[0.75rem] font-semibold text-mm-navy">{label}</p>
      <p className="mt-0.5 text-[0.6875rem] text-mm-text-muted">{detail}</p>
      <div className="relative mx-auto mt-3 flex h-[7.5rem] w-[7.5rem] items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-mm-gray-100"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-mm-teal transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-mm-navy tabular-nums">
            {clamped}%
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            filled
          </span>
        </div>
      </div>
    </Widget>
  );
}

function YearColumns({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <Widget className="flex h-full flex-col">
      <p className="text-[0.75rem] font-semibold text-mm-navy">{title}</p>
      <p className="mt-0.5 text-[0.6875rem] text-mm-text-muted">
        Year-over-year comparison
      </p>
      <div className="mt-4 flex flex-1 items-end justify-between gap-2 px-1">
        {items.map((item) => {
          const height = Math.max(8, Math.round((item.value / max) * 100));
          return (
            <div
              key={item.label}
              className="flex min-w-0 flex-1 flex-col items-center gap-1.5"
            >
              <span className="text-[0.6875rem] font-semibold text-mm-navy tabular-nums">
                {item.value}
              </span>
              <div className="flex h-24 w-full items-end justify-center rounded-md bg-mm-gray-50 px-1.5 pb-1">
                <div
                  className="w-full max-w-[2rem] rounded-md bg-gradient-to-t from-mm-teal to-mm-teal-700/90 transition-[height] duration-500"
                  style={{ height: `${height}%` }}
                  title={`${item.label}: ${item.value}`}
                />
              </div>
              <span className="text-[0.6875rem] font-medium text-mm-text-muted">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

function Sparkline({
  values,
  label,
}: {
  values: number[];
  label: string;
}) {
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const coords = values.map((value, index) => {
    const x = values.length <= 1 ? 0 : (index / (values.length - 1)) * 100;
    const y = 32 - ((value - min) / range) * 28;
    return { x, y, value };
  });
  const points = coords.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <Widget>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.75rem] font-semibold text-mm-navy">{label}</p>
          <p className="mt-0.5 text-[0.6875rem] text-mm-text-muted">
            Monthly application pulse
          </p>
        </div>
        <span className="text-[0.6875rem] font-semibold text-mm-teal-700">
          Peak {max}
        </span>
      </div>
      <svg
        viewBox="0 0 100 36"
        className="mt-3 h-14 w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
          className="text-mm-teal"
          vectorEffect="non-scaling-stroke"
        />
        {coords.map((point, index) => (
          <circle
            key={`${index}-${point.value}`}
            cx={point.x}
            cy={point.y}
            r="1.4"
            className="fill-mm-navy"
          />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[0.625rem] font-medium text-mm-text-muted">
        <span>Jan</span>
        <span>Jun</span>
        <span>Dec</span>
      </div>
    </Widget>
  );
}

function SpecialtyHeatmap({
  items,
}: {
  items: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <Widget>
      <p className="text-[0.75rem] font-semibold text-mm-navy">
        Busiest specialties
      </p>
      <p className="mt-0.5 text-[0.6875rem] text-mm-text-muted">
        Application intensity by specialty
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => {
          const intensity = item.value / max;
          return (
            <div
              key={item.label}
              className="rounded-[var(--mm-radius-md)] border border-mm-border/60 px-2.5 py-2"
              style={{
                backgroundColor: `color-mix(in srgb, var(--mm-teal-600) ${Math.round(intensity * 55)}%, var(--mm-white))`,
              }}
            >
              <p className="truncate text-[0.6875rem] font-semibold text-mm-navy">
                {item.label}
              </p>
              <p className="mt-0.5 text-[0.8125rem] font-semibold tabular-nums text-mm-navy">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </Widget>
  );
}

function SegmentedTrack({
  title,
  segments,
}: {
  title: string;
  segments: { label: string; value: number; tone: "teal" | "navy" | "muted" }[];
}) {
  const total = Math.max(
    1,
    segments.reduce((sum, item) => sum + item.value, 0),
  );
  return (
    <Widget>
      <p className="text-[0.75rem] font-semibold text-mm-navy">{title}</p>
      <div
        className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-mm-gray-100"
        role="img"
        aria-label={title}
      >
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={cn(
              "h-full transition-[width]",
              segment.tone === "teal" && "bg-mm-teal",
              segment.tone === "navy" && "bg-mm-navy/75",
              segment.tone === "muted" && "bg-mm-gray-300",
            )}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                segment.tone === "teal" && "bg-mm-teal",
                segment.tone === "navy" && "bg-mm-navy/75",
                segment.tone === "muted" && "bg-mm-gray-300",
              )}
            />
            <span className="text-[0.6875rem] text-mm-text-secondary">
              {segment.label}{" "}
              <span className="font-semibold text-mm-navy">
                {Math.round((segment.value / total) * 100)}%
              </span>
            </span>
          </div>
        ))}
      </div>
    </Widget>
  );
}

export default function HospitalDashboardPage() {
  const {
    activeHospital,
    activeHospitalId,
    activeSpecialties,
    applications,
    capacities,
    notifications,
  } = useHospitalStore();
  const { filters } = useDashboardFilters();

  const isOverview = filters.view === "overview";
  const selectedMonth = filters.month;
  const year = filters.year;

  const specialtyCatalog =
    activeSpecialties.length > 0 ? activeSpecialties : DEMO_SPECIALTIES;

  const allApps = useMemo(
    () => getApplicationsForHospital(activeHospitalId, applications),
    [activeHospitalId, applications],
  );

  const baseline = useMemo(() => {
    const pending = allApps.filter(
      (a) => toDisplayStatus(a.status) === "Pending",
    ).length;
    const accepted = allApps.filter((a) => isAcceptedStatus(a.status)).length;
    const rejected = allApps.filter(
      (a) => toDisplayStatus(a.status) === "Rejected",
    ).length;
    const waitlisted = allApps.filter(
      (a) => toDisplayStatus(a.status) === "Waitlisted",
    ).length;
    let totalSlots = 0;
    let filledSlots = 0;
    let activeSpecialtiesCount = 0;

    for (const specialty of specialtyCatalog) {
      let offered = false;
      for (const month of MONTHS) {
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
        if (row.totalSlots > 0 && row.status !== "Closed") offered = true;
        totalSlots += row.totalSlots;
        filledSlots += row.acceptedCount;
      }
      if (offered) activeSpecialtiesCount += 1;
    }

    const capacityFilledPct =
      totalSlots <= 0 ? 0 : Math.round((filledSlots / totalSlots) * 100);

    return {
      applications: allApps.length,
      accepted,
      pending,
      rejected,
      waitlisted,
      capacityFilledPct,
      activeSpecialties: activeSpecialtiesCount,
    };
  }, [activeHospitalId, allApps, applications, capacities, specialtyCatalog]);

  const summary = useMemo(() => {
    const priorYear = year - 1;
    const apps = scaleValue(baseline.applications, year);
    const appsPrev = scaleValue(baseline.applications, priorYear);
    const capacity = Math.min(100, scaleValue(baseline.capacityFilledPct, year));
    const capacityPrev = Math.min(
      100,
      scaleValue(baseline.capacityFilledPct, priorYear),
    );
    const specialties = scaleValue(baseline.activeSpecialties, year);
    const specialtiesPrev = scaleValue(baseline.activeSpecialties, priorYear);
    const pending = scaleValue(baseline.pending, year);
    const pendingPrev = scaleValue(baseline.pending, priorYear);

    return {
      applications: {
        value: apps,
        delta: deltaPercent(apps, appsPrev),
      },
      capacityFilled: {
        value: capacity,
        delta: deltaPercent(capacity, capacityPrev),
      },
      activeSpecialties: {
        value: specialties,
        delta: deltaPercent(specialties, specialtiesPrev),
      },
      pendingReviews: {
        value: pending,
        delta: deltaPercent(pending, pendingPrev),
      },
    };
  }, [baseline, year]);

  const yearApps = useMemo(
    () =>
      OVERVIEW_YEARS.map((y) => ({
        label: String(y),
        value: scaleValue(baseline.applications, y),
      })),
    [baseline.applications],
  );

  const monthApps = useMemo(() => {
    if (isOverview) return allApps;
    return allApps.filter((app) => app.month === selectedMonth);
  }, [allApps, isOverview, selectedMonth]);

  const sparkValues = useMemo(
    () =>
      MONTHS.map((month) =>
        scaleValue(
          allApps.filter((app) => app.month === month.key).length,
          year,
        ),
      ),
    [allApps, year],
  );

  const appsBySpecialty = useMemo(() => {
    return specialtyCatalog
      .map((specialty) => ({
        label: specialty.shortName,
        value: scaleValue(
          monthApps.filter((app) => app.specialtyId === specialty.id).length,
          year,
        ),
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [monthApps, specialtyCatalog, year]);

  const statusMix = useMemo(() => {
    const source = isOverview ? allApps : monthApps;
    return [
      {
        label: "Accepted",
        value: scaleValue(
          source.filter((a) => isAcceptedStatus(a.status)).length,
          year,
        ),
        tone: "teal" as const,
      },
      {
        label: "Pending",
        value: scaleValue(
          source.filter((a) => toDisplayStatus(a.status) === "Pending").length,
          year,
        ),
        tone: "navy" as const,
      },
      {
        label: "Other",
        value: scaleValue(
          source.filter((a) => {
            const status = toDisplayStatus(a.status);
            return status === "Rejected" || status === "Waitlisted";
          }).length,
          year,
        ),
        tone: "muted" as const,
      },
    ];
  }, [allApps, isOverview, monthApps, year]);

  const recentActivity = useMemo(() => {
    const items = getNotificationsForHospital(
      activeHospitalId,
      notifications,
    );
    if (isOverview) return items.slice(0, 4);
    return items
      .filter((n) => n.relatedMonth === selectedMonth)
      .slice(0, 4);
  }, [activeHospitalId, notifications, isOverview, selectedMonth]);

  const appsRising =
    yearApps.length >= 2 &&
    yearApps[yearApps.length - 1]!.value >= yearApps[0]!.value;

  return (
    <HospitalShell
      title="Internship Dashboard"
      headerActions={<DashboardPeriodFilter />}
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <HospitalLogo
          src={activeHospital?.logo}
          name={activeHospital?.name ?? "Hospital"}
          className="h-14 w-14 rounded-[var(--mm-radius-lg)] bg-mm-white"
          imgClassName="p-1.5"
        />
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-mm-navy">
            {activeHospital?.name ?? "Hospital"}
          </h2>
          <p className="text-sm text-mm-text-secondary">
            {activeHospital?.city} · {activeHospital?.type}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
        <KpiTile
          icon={ClipboardList}
          title="Applications"
          value={summary.applications.value}
          delta={summary.applications.delta}
        />
        <KpiTile
          icon={Activity}
          title="Capacity filled"
          value={summary.capacityFilled.value}
          suffix="%"
          delta={summary.capacityFilled.delta}
        />
        <KpiTile
          icon={Layers}
          title="Active specialties"
          value={summary.activeSpecialties.value}
          delta={summary.activeSpecialties.delta}
        />
        <KpiTile
          icon={Clock3}
          title="Pending reviews"
          value={summary.pendingReviews.value}
          delta={summary.pendingReviews.delta}
        />
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <RingProgress
            value={summary.capacityFilled.value}
            label="Hospital fullness"
            detail={
              isOverview
                ? "Seat utilization across the year"
                : `Utilization in ${monthLabel(selectedMonth as MonthKey)}`
            }
          />
        </div>
        <div className="lg:col-span-5">
          <YearColumns title="Are applications rising?" items={yearApps} />
        </div>
        <div className="lg:col-span-4">
          <Sparkline values={sparkValues} label="In-year momentum" />
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SpecialtyHeatmap items={appsBySpecialty} />
        </div>
        <div className="lg:col-span-5">
          <SegmentedTrack title="Decision mix" segments={statusMix} />
          <div className="mt-3 rounded-[var(--mm-radius-xl)] border border-mm-teal/20 bg-mm-teal-50/70 px-3.5 py-3">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-teal-700">
              Insight
            </p>
            <p className="mt-1 text-sm font-medium text-mm-navy">
              {appsRising
                ? `Applications are trending up through ${year} versus prior years.`
                : `Application volume is softer than the prior comparison window.`}{" "}
              {appsBySpecialty[0]
                ? `${appsBySpecialty[0].label} is currently the busiest specialty.`
                : null}
            </p>
          </div>
        </div>
      </div>

      <Widget className="mt-3">
        <p className="text-[0.75rem] font-semibold text-mm-navy">
          Recent activity
        </p>
        <ul className="mt-2.5 divide-y divide-mm-border/70">
          {recentActivity.length === 0 ? (
            <li className="py-2 text-sm text-mm-text-muted">
              No recent activity for this period.
            </li>
          ) : (
            recentActivity.map((n) => (
              <li
                key={n.id}
                className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-medium text-mm-navy">
                    {n.title}
                  </p>
                  <p className="truncate text-[0.75rem] text-mm-text-muted">
                    {n.message}
                  </p>
                </div>
                <span className="shrink-0 text-[0.625rem] text-mm-text-muted">
                  {formatDateTime(n.createdAt)}
                </span>
              </li>
            ))
          )}
        </ul>
      </Widget>
    </HospitalShell>
  );
}
