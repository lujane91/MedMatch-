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
import { MONTHS, type MonthKey } from "@/data/hospital-demo";

const STORAGE_KEY = "medmatch-hospital-month-v1";

export type MonthViewMode = "month" | "all";

type HospitalMonthState = {
  year: number;
  month: MonthKey;
  viewMode: MonthViewMode;
};

type HospitalMonthStoreValue = HospitalMonthState & {
  hydrated: boolean;
  /** Concrete month used for filtering operational pages. */
  selectedMonth: MonthKey;
  /** True when All Year summary mode is active. */
  isAllYear: boolean;
  setMonth: (month: MonthKey) => void;
  setYear: (year: number) => void;
  setViewMode: (mode: MonthViewMode) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  selectAllYear: () => void;
};

const HospitalMonthContext = createContext<HospitalMonthStoreValue | null>(
  null,
);

function currentMonthKey(): MonthKey {
  const m = String(new Date().getMonth() + 1).padStart(2, "0");
  return m as MonthKey;
}

function readStored(): HospitalMonthState {
  const fallback: HospitalMonthState = {
    year: new Date().getFullYear(),
    month: currentMonthKey(),
    viewMode: "month",
  };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<HospitalMonthState>;
    const month = MONTHS.some((item) => item.key === parsed.month)
      ? (parsed.month as MonthKey)
      : fallback.month;
    const year =
      typeof parsed.year === "number" &&
      parsed.year >= 2020 &&
      parsed.year <= 2100
        ? parsed.year
        : fallback.year;
    const viewMode: MonthViewMode =
      parsed.viewMode === "all" ? "all" : "month";
    return { year, month, viewMode };
  } catch {
    return fallback;
  }
}

function shiftMonth(
  month: MonthKey,
  year: number,
  delta: number,
): { month: MonthKey; year: number } {
  const index = Number(month) - 1 + delta;
  const nextYear = year + Math.floor(index / 12);
  const nextIndex = ((index % 12) + 12) % 12;
  const nextMonth = String(nextIndex + 1).padStart(2, "0") as MonthKey;
  return { month: nextMonth, year: nextYear };
}

export function HospitalMonthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HospitalMonthState>({
    year: new Date().getFullYear(),
    month: currentMonthKey(),
    viewMode: "month",
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStored();
    queueMicrotask(() => {
      setState(next);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const setMonth = useCallback((month: MonthKey) => {
    setState((prev) => ({ ...prev, month, viewMode: "month" }));
  }, []);

  const setYear = useCallback((year: number) => {
    setState((prev) => ({ ...prev, year }));
  }, []);

  const setViewMode = useCallback((viewMode: MonthViewMode) => {
    setState((prev) => ({ ...prev, viewMode }));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState((prev) => {
      const next = shiftMonth(prev.month, prev.year, -1);
      return { ...prev, ...next, viewMode: "month" };
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setState((prev) => {
      const next = shiftMonth(prev.month, prev.year, 1);
      return { ...prev, ...next, viewMode: "month" };
    });
  }, []);

  const selectAllYear = useCallback(() => {
    setState((prev) => ({ ...prev, viewMode: "all" }));
  }, []);

  const value = useMemo<HospitalMonthStoreValue>(
    () => ({
      ...state,
      hydrated,
      selectedMonth: state.month,
      isAllYear: state.viewMode === "all",
      setMonth,
      setYear,
      setViewMode,
      goToPreviousMonth,
      goToNextMonth,
      selectAllYear,
    }),
    [
      state,
      hydrated,
      setMonth,
      setYear,
      setViewMode,
      goToPreviousMonth,
      goToNextMonth,
      selectAllYear,
    ],
  );

  return (
    <HospitalMonthContext.Provider value={value}>
      {children}
    </HospitalMonthContext.Provider>
  );
}

export function useHospitalMonth() {
  const ctx = useContext(HospitalMonthContext);
  if (!ctx) {
    throw new Error("useHospitalMonth must be used within HospitalMonthProvider");
  }
  return ctx;
}

/** Filter helper: keep items matching the selected month, or all when All Year. */
export function filterByHospitalMonth<T extends { month: MonthKey }>(
  items: T[],
  selectedMonth: MonthKey,
  isAllYear: boolean,
): T[] {
  if (isAllYear) return items;
  return items.filter((item) => item.month === selectedMonth);
}
