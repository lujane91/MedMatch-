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
  DEFAULT_COURSE_PREFERENCES,
  SEED_COURSES,
  type CoursePreferences,
  type CourseRecord,
} from "@/data/courses";

const STORAGE_KEY = "medmatch-courses-v1";

type CourseState = {
  courses: CourseRecord[];
  savedIds: string[];
  preferences: CoursePreferences;
};

type CourseStore = {
  hydrated: boolean;
  courses: CourseRecord[];
  savedIds: string[];
  preferences: CoursePreferences;
  toggleSave: (courseId: string) => void;
  isSaved: (courseId: string) => boolean;
  setPreferences: (prefs: CoursePreferences) => void;
  getCourse: (courseId: string) => CourseRecord | undefined;
};

const CourseContext = createContext<CourseStore | null>(null);

function defaultState(): CourseState {
  return {
    courses: SEED_COURSES,
    savedIds: [],
    preferences: DEFAULT_COURSE_PREFERENCES,
  };
}

function load(): CourseState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as CourseState;
    return {
      courses: parsed.courses?.length ? parsed.courses : SEED_COURSES,
      savedIds: parsed.savedIds ?? [],
      preferences: {
        ...DEFAULT_COURSE_PREFERENCES,
        ...(parsed.preferences ?? {}),
      },
    };
  } catch {
    return defaultState();
  }
}

export function CourseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CourseState>(defaultState);
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

  const toggleSave = useCallback((courseId: string) => {
    setState((prev) => {
      const exists = prev.savedIds.includes(courseId);
      return {
        ...prev,
        savedIds: exists
          ? prev.savedIds.filter((id) => id !== courseId)
          : [...prev.savedIds, courseId],
      };
    });
  }, []);

  const isSaved = useCallback(
    (courseId: string) => state.savedIds.includes(courseId),
    [state.savedIds],
  );

  const setPreferences = useCallback((prefs: CoursePreferences) => {
    setState((prev) => ({ ...prev, preferences: prefs }));
  }, []);

  const getCourse = useCallback(
    (courseId: string) => state.courses.find((c) => c.id === courseId),
    [state.courses],
  );

  const value = useMemo(
    () => ({
      hydrated,
      courses: state.courses,
      savedIds: state.savedIds,
      preferences: state.preferences,
      toggleSave,
      isSaved,
      setPreferences,
      getCourse,
    }),
    [
      getCourse,
      hydrated,
      isSaved,
      setPreferences,
      state.courses,
      state.preferences,
      state.savedIds,
      toggleSave,
    ],
  );

  return (
    <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
  );
}

export function useCourseStore() {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error("useCourseStore must be used within CourseProvider");
  }
  return ctx;
}
