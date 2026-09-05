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
import {
  DEFAULT_CAREER_PREFERENCES,
  SEED_CAREER_OPPORTUNITIES,
  type CareerOpportunity,
  type CareerPreferences,
} from "@/data/career";

const STORAGE_KEY = "medmatch-career-v1";

type CareerState = {
  opportunities: CareerOpportunity[];
  savedIds: string[];
  preferences: CareerPreferences;
};

type CareerStore = {
  hydrated: boolean;
  opportunities: CareerOpportunity[];
  savedIds: string[];
  preferences: CareerPreferences;
  toggleSave: (opportunityId: string) => void;
  isSaved: (opportunityId: string) => boolean;
  setPreferences: (prefs: CareerPreferences) => void;
};

const CareerContext = createContext<CareerStore | null>(null);

function defaultState(): CareerState {
  return {
    opportunities: SEED_CAREER_OPPORTUNITIES,
    savedIds: ["career-1"],
    preferences: DEFAULT_CAREER_PREFERENCES,
  };
}

function load(): CareerState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as CareerState;
    return {
      opportunities: parsed.opportunities?.length
        ? parsed.opportunities
        : SEED_CAREER_OPPORTUNITIES,
      savedIds: parsed.savedIds ?? [],
      preferences: {
        ...DEFAULT_CAREER_PREFERENCES,
        ...(parsed.preferences ?? {}),
      },
    };
  } catch {
    return defaultState();
  }
}

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CareerState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = load();
    queueMicrotask(() => {
      setState(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const toggleSave = useCallback((opportunityId: string) => {
    setState((prev) => {
      const exists = prev.savedIds.includes(opportunityId);
      return {
        ...prev,
        savedIds: exists
          ? prev.savedIds.filter((id) => id !== opportunityId)
          : [...prev.savedIds, opportunityId],
      };
    });
  }, []);

  const isSaved = useCallback(
    (opportunityId: string) => state.savedIds.includes(opportunityId),
    [state.savedIds],
  );

  const setPreferences = useCallback((prefs: CareerPreferences) => {
    setState((prev) => ({ ...prev, preferences: prefs }));
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      opportunities: state.opportunities,
      savedIds: state.savedIds,
      preferences: state.preferences,
      toggleSave,
      isSaved,
      setPreferences,
    }),
    [
      hydrated,
      isSaved,
      setPreferences,
      state.opportunities,
      state.preferences,
      state.savedIds,
      toggleSave,
    ],
  );

  return (
    <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
  );
}

export function useCareerStore() {
  const ctx = useContext(CareerContext);
  if (!ctx) {
    throw new Error("useCareerStore must be used within CareerProvider");
  }
  return ctx;
}
