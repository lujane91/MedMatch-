"use client";

import { useId } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS, monthLabel, type MonthKey } from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { selectClassName } from "@/components/hospital/hospital-ui";

type MonthNavigatorProps = {
  /** When true, show the All Year / Overview option (dashboard summaries). */
  allowAllYear?: boolean;
  /** Label for the all-year control (e.g. "Overview" on the executive dashboard). */
  allYearLabel?: string;
  className?: string;
};

function yearOptions(selectedYear: number): number[] {
  const now = new Date().getFullYear();
  const start = Math.min(now - 2, selectedYear - 1);
  const end = Math.max(now + 2, selectedYear + 1);
  const years: number[] = [];
  for (let year = start; year <= end; year += 1) {
    years.push(year);
  }
  return years;
}

export function MonthNavigator({
  allowAllYear = false,
  allYearLabel = "All Year",
  className,
}: MonthNavigatorProps) {
  const {
    year,
    month,
    viewMode,
    isAllYear,
    setMonth,
    setYear,
    goToPreviousMonth,
    goToNextMonth,
    selectAllYear,
  } = useHospitalMonth();
  const yearSelectId = useId();
  const monthSelectId = useId();

  const effectiveAllYear = allowAllYear && isAllYear;
  const currentKey = String(new Date().getMonth() + 1).padStart(2, "0");
  const isCurrentMonth =
    !effectiveAllYear &&
    month === currentKey &&
    year === new Date().getFullYear();

  return (
    <div
      className={cn(
        "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-3 shadow-mm-sm sm:p-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-mm-text-muted">
            Selected period
          </p>
          <p className="mt-0.5 font-display text-lg font-semibold tracking-tight text-mm-navy sm:text-xl">
            {effectiveAllYear
              ? allYearLabel === "Overview"
                ? "Overview · 2024–2026"
                : `All Year ${year}`
              : `${monthLabel(month)} ${year}`}
          </p>
          {isCurrentMonth ? (
            <p className="mt-0.5 text-[0.75rem] font-semibold text-mm-teal-700">
              Current month
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={yearSelectId}>
            Year
          </label>
          <select
            id={yearSelectId}
            className={cn(selectClassName, "min-w-[6.5rem]")}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label="Select year"
            disabled={effectiveAllYear && allYearLabel === "Overview"}
          >
            {yearOptions(year).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {allowAllYear ? (
            <button
              type="button"
              onClick={selectAllYear}
              className={cn(
                "rounded-[var(--mm-radius-lg)] border px-3 py-2 text-[0.8125rem] font-semibold transition-colors",
                effectiveAllYear
                  ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                  : "border-mm-border bg-mm-white text-mm-navy hover:bg-mm-gray-50",
              )}
              aria-pressed={effectiveAllYear}
            >
              {allYearLabel}
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
          aria-label="Previous month"
        >
          <ChevronLeft size={18} strokeWidth={2} aria-hidden />
        </button>

        <label className="sr-only" htmlFor={monthSelectId}>
          Month
        </label>
        <select
          id={monthSelectId}
          className={cn(selectClassName, "min-w-0 flex-1 sm:hidden")}
          value={effectiveAllYear ? "all" : month}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "all" && allowAllYear) {
              selectAllYear();
              return;
            }
            setMonth(value as MonthKey);
          }}
          aria-label="Select month"
        >
          {allowAllYear ? <option value="all">{allYearLabel}</option> : null}
          {MONTHS.map((item) => (
            <option key={item.key} value={item.key}>
              {item.label}
              {item.key === currentKey && year === new Date().getFullYear()
                ? " (Current)"
                : ""}
            </option>
          ))}
        </select>

        <div
          className="hidden min-w-0 flex-1 gap-1.5 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:flex [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Months"
        >
          {MONTHS.map((item) => {
            const selected = !effectiveAllYear && month === item.key;
            const isCurrent =
              item.key === currentKey && year === new Date().getFullYear();
            return (
              <button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMonth(item.key)}
                className={cn(
                  "shrink-0 rounded-[var(--mm-radius-lg)] border px-2.5 py-2 text-[0.75rem] font-semibold transition-colors",
                  selected
                    ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                    : "border-mm-border bg-mm-white text-mm-navy hover:bg-mm-gray-50",
                  isCurrent && !selected && "ring-1 ring-mm-teal/35",
                )}
              >
                {item.label.slice(0, 3)}
                {isCurrent ? (
                  <span className="sr-only"> (current month)</span>
                ) : null}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goToNextMonth}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
          aria-label="Next month"
        >
          <ChevronRight size={18} strokeWidth={2} aria-hidden />
        </button>
      </div>

      {!allowAllYear && viewMode === "all" ? (
        <p className="mt-2 text-[0.75rem] text-mm-text-muted">
          Showing {monthLabel(month)} {year}. All Year is available on Dashboard
          and Analytics.
        </p>
      ) : null}
      {allowAllYear && effectiveAllYear ? (
        <p className="mt-2 text-[0.75rem] text-mm-text-muted">
          Select a month below to drill into detailed monthly analytics.
        </p>
      ) : null}
    </div>
  );
}
