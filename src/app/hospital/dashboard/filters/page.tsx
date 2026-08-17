"use client";

import { useEffect, useId, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  Panel,
  buttonPrimaryClass,
  selectClassName,
} from "@/components/hospital/hospital-ui";
import { MONTHS, type MonthKey } from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import {
  DASHBOARD_FILTER_DEFAULTS,
  DASHBOARD_FILTER_YEARS,
  useDashboardFilters,
  type DashboardPeriodFilterValue,
  type DashboardViewMode,
} from "@/lib/dashboard-filter-store";

export default function InternshipDashboardFiltersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const { filters, hydrated, setFilters, resetFilters } = useDashboardFilters();
  const [draft, setDraft] = useState<DashboardPeriodFilterValue>(filters);
  const yearId = useId();
  const viewId = useId();
  const monthId = useId();

  useEffect(() => {
    if (!hydrated) return;
    setDraft(filters);
  }, [filters, hydrated]);

  function onReset() {
    setDraft(DASHBOARD_FILTER_DEFAULTS);
  }

  function onApply() {
    const next: DashboardPeriodFilterValue = {
      year: draft.year,
      view: draft.view,
      month: draft.view === "month" ? draft.month : draft.month,
    };
    setFilters(next);
    router.push(`${base}/dashboard`);
  }

  return (
    <HospitalShell title="Filters">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy">
              Dashboard Filters
            </h2>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Choose the period for Internship Dashboard analytics.
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 text-[0.8125rem] font-semibold text-mm-teal-700 transition-colors hover:text-mm-teal"
          >
            Reset Filters
          </button>
        </div>

        <Panel className="space-y-5">
          <div>
            <label
              htmlFor={yearId}
              className="mb-1.5 block text-[0.8125rem] font-semibold text-mm-navy"
            >
              Year
            </label>
            <select
              id={yearId}
              className={selectClassName}
              value={draft.year}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  year: Number(e.target.value),
                }))
              }
            >
              {DASHBOARD_FILTER_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p
              id={viewId}
              className="mb-1.5 text-[0.8125rem] font-semibold text-mm-navy"
            >
              View
            </p>
            <div
              className="space-y-2"
              role="radiogroup"
              aria-labelledby={viewId}
            >
              {(
                [
                  { id: "overview", label: "Overall" },
                  { id: "month", label: "Monthly" },
                ] as const
              ).map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-[var(--mm-radius-lg)] border px-3.5 py-3 transition-colors",
                    draft.view === option.id
                      ? "border-mm-teal bg-mm-teal-50"
                      : "border-mm-border bg-mm-white hover:bg-mm-gray-50",
                  )}
                >
                  <input
                    type="radio"
                    name="dashboard-view"
                    value={option.id}
                    checked={draft.view === option.id}
                    onChange={() =>
                      setDraft((prev) => ({
                        ...prev,
                        view: option.id as DashboardViewMode,
                      }))
                    }
                    className="h-4 w-4 accent-[var(--mm-teal-600)]"
                  />
                  <span className="text-sm font-semibold text-mm-navy">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {draft.view === "month" ? (
            <div>
              <label
                htmlFor={monthId}
                className="mb-1.5 block text-[0.8125rem] font-semibold text-mm-navy"
              >
                Month
              </label>
              <select
                id={monthId}
                className={selectClassName}
                value={draft.month}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    month: e.target.value as MonthKey,
                  }))
                }
              >
                {MONTHS.map((month) => (
                  <option key={month.key} value={month.key}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="grid gap-3 border-t border-mm-border pt-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[0.8125rem] font-semibold text-mm-text-muted">
                Hospital
              </label>
              <select className={selectClassName} disabled value="">
                <option value="">Coming Soon</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[0.8125rem] font-semibold text-mm-text-muted">
                Specialty
              </label>
              <select className={selectClassName} disabled value="">
                <option value="">Coming Soon</option>
              </select>
            </div>
          </div>
        </Panel>

        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={onApply}
            className={cn(buttonPrimaryClass, "w-full")}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </HospitalShell>
  );
}
