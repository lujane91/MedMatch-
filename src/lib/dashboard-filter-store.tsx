"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type MonthKey } from "@/data/hospital-demo";

export type DashboardViewMode = "overview" | "month";

export type DashboardPeriodFilterValue = {
  year: number;
  view: DashboardViewMode;
  month: MonthKey;
};

export const DASHBOARD_FILTER_DEFAULTS: DashboardPeriodFilterValue = {
  year: 2026,
  view: "overview",
  month: "01",
};

export const DASHBOARD_FILTER_YEARS = [2024, 2025, 2026] as const;

const STORAGE_KEY = "medmatch-internship-dashboard-filters-v1";

type DashboardFilterStoreValue = {
  filters: DashboardPeriodFilterValue;
  hydrated: boolean;
  setFilters: (next: DashboardPeriodFilterValue) => void;
  resetFilters: () => void;
};

const DashboardFilterContext =
  createContext<DashboardFilterStoreValue | null>(null);

function readStored(): DashboardPeriodFilterValue {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DASHBOARD_FILTER_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<DashboardPeriodFilterValue>;
    const year =
      typeof parsed.year === "number" &&
      DASHBOARD_FILTER_YEARS.includes(
        parsed.year as (typeof DASHBOARD_FILTER_YEARS)[number],
      )
        ? parsed.year
        : DASHBOARD_FILTER_DEFAULTS.year;
    const view: DashboardViewMode =
      parsed.view === "month" ? "month" : "overview";
    const month =
      typeof parsed.month === "string" && /^\d{2}$/.test(parsed.month)
        ? (parsed.month as MonthKey)
        : DASHBOARD_FILTER_DEFAULTS.month;
    return { year, view, month };
  } catch {
    return DASHBOARD_FILTER_DEFAULTS;
  }
}

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<DashboardPeriodFilterValue>(
    DASHBOARD_FILTER_DEFAULTS,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStored();
    queueMicrotask(() => {
      setFiltersState(next);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters, hydrated]);

  const setFilters = useCallback((next: DashboardPeriodFilterValue) => {
    setFiltersState(next);
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DASHBOARD_FILTER_DEFAULTS);
  }, []);

  const value = useMemo(
    () => ({ filters, hydrated, setFilters, resetFilters }),
    [filters, hydrated, setFilters, resetFilters],
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFilterContext);
  if (!ctx) {
    throw new Error(
      "useDashboardFilters must be used within DashboardFilterProvider",
    );
  }
  return ctx;
}
