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
  DEFAULT_CONFERENCE_PREFERENCES,
  SEED_CONFERENCES,
  type ConferencePreferences,
  type ConferenceRecord,
} from "@/data/conferences";

const STORAGE_KEY = "medmatch-conferences-v1";

type ConferenceState = {
  conferences: ConferenceRecord[];
  savedIds: string[];
  preferences: ConferencePreferences;
};

type ConferenceStore = {
  hydrated: boolean;
  conferences: ConferenceRecord[];
  savedIds: string[];
  preferences: ConferencePreferences;
  toggleSave: (conferenceId: string) => void;
  isSaved: (conferenceId: string) => boolean;
  setPreferences: (prefs: ConferencePreferences) => void;
};

const ConferenceContext = createContext<ConferenceStore | null>(null);

function defaultState(): ConferenceState {
  return {
    conferences: SEED_CONFERENCES,
    savedIds: ["conf-1"],
    preferences: DEFAULT_CONFERENCE_PREFERENCES,
  };
}

function load(): ConferenceState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as ConferenceState;
    return {
      conferences: parsed.conferences?.length
        ? parsed.conferences
        : SEED_CONFERENCES,
      savedIds: parsed.savedIds ?? [],
      preferences: {
        ...DEFAULT_CONFERENCE_PREFERENCES,
        ...(parsed.preferences ?? {}),
      },
    };
  } catch {
    return defaultState();
  }
}

export function ConferenceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConferenceState>(defaultState);
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

  const toggleSave = useCallback((conferenceId: string) => {
    setState((prev) => {
      const exists = prev.savedIds.includes(conferenceId);
      return {
        ...prev,
        savedIds: exists
          ? prev.savedIds.filter((id) => id !== conferenceId)
          : [...prev.savedIds, conferenceId],
      };
    });
  }, []);

  const isSaved = useCallback(
    (conferenceId: string) => state.savedIds.includes(conferenceId),
    [state.savedIds],
  );

  const setPreferences = useCallback((prefs: ConferencePreferences) => {
    setState((prev) => ({ ...prev, preferences: prefs }));
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      conferences: state.conferences,
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
      state.conferences,
      state.preferences,
      state.savedIds,
      toggleSave,
    ],
  );

  return (
    <ConferenceContext.Provider value={value}>
      {children}
    </ConferenceContext.Provider>
  );
}

export function useConferenceStore() {
  const ctx = useContext(ConferenceContext);
  if (!ctx) {
    throw new Error(
      "useConferenceStore must be used within ConferenceProvider",
    );
  }
  return ctx;
}
