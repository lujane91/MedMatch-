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
  buildTrainingApplication,
  type NewTrainingApplicationInput,
  type TrainingApplication,
  type TrainingApplicationStatus,
  type TrainingApplicationType,
} from "@/data/training-applications";

const STORAGE_KEY = "medmatch-training-applications-v1";

type TrainingApplicationStore = {
  hydrated: boolean;
  applications: TrainingApplication[];
  submitApplication: (
    input: NewTrainingApplicationInput,
  ) => TrainingApplication;
  updateApplicationStatus: (
    id: string,
    status: TrainingApplicationStatus,
    hospitalReviewNote?: string,
  ) => void;
  applicationsFor: (
    applicantKey: string,
    trainingType?: TrainingApplicationType | null,
  ) => TrainingApplication[];
};

const TrainingApplicationContext =
  createContext<TrainingApplicationStore | null>(null);

function loadApplications(): TrainingApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TrainingApplication[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(applications: TrainingApplication[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function TrainingApplicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [applications, setApplications] = useState<TrainingApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadApplications();
    queueMicrotask(() => {
      setApplications(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(applications);
  }, [applications, hydrated]);

  const submitApplication = useCallback(
    (input: NewTrainingApplicationInput) => {
      const next = buildTrainingApplication(input);
      setApplications((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const updateApplicationStatus = useCallback(
    (
      id: string,
      status: TrainingApplicationStatus,
      hospitalReviewNote = "",
    ) => {
      setApplications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                hospitalReviewNote:
                  hospitalReviewNote || item.hospitalReviewNote,
                updatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    },
    [],
  );

  const applicationsFor = useCallback(
    (
      applicantKey: string,
      trainingType?: TrainingApplicationType | null,
    ) => {
      return applications.filter((item) => {
        if (item.applicantKey !== applicantKey) return false;
        if (trainingType && item.trainingType !== trainingType) return false;
        return true;
      });
    },
    [applications],
  );

  const value = useMemo(
    () => ({
      hydrated,
      applications,
      submitApplication,
      updateApplicationStatus,
      applicationsFor,
    }),
    [
      applications,
      applicationsFor,
      hydrated,
      submitApplication,
      updateApplicationStatus,
    ],
  );

  return (
    <TrainingApplicationContext.Provider value={value}>
      {children}
    </TrainingApplicationContext.Provider>
  );
}

export function useTrainingApplications() {
  const ctx = useContext(TrainingApplicationContext);
  if (!ctx) {
    throw new Error(
      "useTrainingApplications must be used within TrainingApplicationProvider",
    );
  }
  return ctx;
}
