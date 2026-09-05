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
  createProfileEntryId,
  defaultEnrichmentState,
  type ProfileCertificationEntry,
  type ProfileCourseEntry,
  type ProfileEducationEntry,
  type ProfileEnrichmentState,
  type ProfileResearchEntry,
  type ProfileTrainingEntry,
} from "@/data/profile-enrichment";

const STORAGE_KEY = "medmatch-profile-enrichment-v1";

type ProfileEnrichmentStore = {
  hydrated: boolean;
  education: ProfileEducationEntry[];
  research: ProfileResearchEntry[];
  courses: ProfileCourseEntry[];
  certifications: ProfileCertificationEntry[];
  training: ProfileTrainingEntry[];
  addEducation: (
    entry: Omit<ProfileEducationEntry, "id" | "source" | "verified">,
  ) => void;
  updateEducation: (
    id: string,
    patch: Partial<ProfileEducationEntry>,
  ) => void;
  removeEducation: (id: string) => void;
  addResearch: (
    entry: Omit<
      ProfileResearchEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
  updateResearch: (id: string, patch: Partial<ProfileResearchEntry>) => void;
  removeResearch: (id: string) => void;
  addCourse: (
    entry: Omit<
      ProfileCourseEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
  updateCourse: (id: string, patch: Partial<ProfileCourseEntry>) => void;
  removeCourse: (id: string) => void;
  addCertification: (
    entry: Omit<ProfileCertificationEntry, "id" | "source" | "verified">,
  ) => void;
  updateCertification: (
    id: string,
    patch: Partial<ProfileCertificationEntry>,
  ) => void;
  removeCertification: (id: string) => void;
  addTraining: (
    entry: Omit<
      ProfileTrainingEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
  updateTraining: (id: string, patch: Partial<ProfileTrainingEntry>) => void;
  removeTraining: (id: string) => void;
};

const ProfileEnrichmentContext =
  createContext<ProfileEnrichmentStore | null>(null);

function load(): ProfileEnrichmentState {
  if (typeof window === "undefined") return defaultEnrichmentState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEnrichmentState();
    const parsed = JSON.parse(raw) as ProfileEnrichmentState;
    return {
      ...defaultEnrichmentState(),
      ...parsed,
      education: parsed.education ?? [],
      research: parsed.research ?? [],
      courses: parsed.courses ?? [],
      certifications: parsed.certifications ?? [],
      training: parsed.training ?? [],
    };
  } catch {
    return defaultEnrichmentState();
  }
}

export function ProfileEnrichmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] = useState<ProfileEnrichmentState>(
    defaultEnrichmentState,
  );
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

  const addEducation = useCallback(
    (entry: Omit<ProfileEducationEntry, "id" | "source" | "verified">) => {
      setState((prev) => ({
        ...prev,
        education: [
          {
            ...entry,
            id: createProfileEntryId("edu"),
            source: "user",
            verified: false,
          },
          ...prev.education,
        ],
      }));
    },
    [],
  );

  const updateEducation = useCallback(
    (id: string, patch: Partial<ProfileEducationEntry>) => {
      setState((prev) => ({
        ...prev,
        education: prev.education.map((item) =>
          item.id === id && item.source === "user"
            ? { ...item, ...patch, source: "user", verified: false }
            : item,
        ),
      }));
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      education: prev.education.filter(
        (item) => !(item.id === id && item.source === "user"),
      ),
    }));
  }, []);

  const addResearch = useCallback(
    (
      entry: Omit<
        ProfileResearchEntry,
        "id" | "source" | "verified" | "linkedMedJourneyId"
      >,
    ) => {
      setState((prev) => ({
        ...prev,
        research: [
          {
            ...entry,
            id: createProfileEntryId("res"),
            source: "user",
            verified: false,
          },
          ...prev.research,
        ],
      }));
    },
    [],
  );

  const updateResearch = useCallback(
    (id: string, patch: Partial<ProfileResearchEntry>) => {
      setState((prev) => ({
        ...prev,
        research: prev.research.map((item) =>
          item.id === id && item.source === "user"
            ? { ...item, ...patch, source: "user", verified: false }
            : item,
        ),
      }));
    },
    [],
  );

  const removeResearch = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      research: prev.research.filter(
        (item) => !(item.id === id && item.source === "user"),
      ),
    }));
  }, []);

  const addCourse = useCallback(
    (
      entry: Omit<
        ProfileCourseEntry,
        "id" | "source" | "verified" | "linkedMedJourneyId"
      >,
    ) => {
      setState((prev) => ({
        ...prev,
        courses: [
          {
            ...entry,
            id: createProfileEntryId("crs"),
            source: "user",
            verified: false,
          },
          ...prev.courses,
        ],
      }));
    },
    [],
  );

  const updateCourse = useCallback(
    (id: string, patch: Partial<ProfileCourseEntry>) => {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((item) =>
          item.id === id && item.source === "user"
            ? { ...item, ...patch, source: "user", verified: false }
            : item,
        ),
      }));
    },
    [],
  );

  const removeCourse = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      courses: prev.courses.filter(
        (item) => !(item.id === id && item.source === "user"),
      ),
    }));
  }, []);

  const addCertification = useCallback(
    (entry: Omit<ProfileCertificationEntry, "id" | "source" | "verified">) => {
      setState((prev) => ({
        ...prev,
        certifications: [
          {
            ...entry,
            id: createProfileEntryId("cert"),
            source: "user",
            verified: false,
          },
          ...prev.certifications,
        ],
      }));
    },
    [],
  );

  const updateCertification = useCallback(
    (id: string, patch: Partial<ProfileCertificationEntry>) => {
      setState((prev) => ({
        ...prev,
        certifications: prev.certifications.map((item) =>
          item.id === id && item.source === "user"
            ? { ...item, ...patch, source: "user", verified: false }
            : item,
        ),
      }));
    },
    [],
  );

  const removeCertification = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (item) => !(item.id === id && item.source === "user"),
      ),
    }));
  }, []);

  const addTraining = useCallback(
    (
      entry: Omit<
        ProfileTrainingEntry,
        "id" | "source" | "verified" | "linkedMedJourneyId"
      >,
    ) => {
      setState((prev) => ({
        ...prev,
        training: [
          {
            ...entry,
            id: createProfileEntryId("trn"),
            source: "user",
            verified: false,
          },
          ...prev.training,
        ],
      }));
    },
    [],
  );

  const updateTraining = useCallback(
    (id: string, patch: Partial<ProfileTrainingEntry>) => {
      setState((prev) => ({
        ...prev,
        training: prev.training.map((item) =>
          item.id === id && item.source === "user"
            ? { ...item, ...patch, source: "user", verified: false }
            : item,
        ),
      }));
    },
    [],
  );

  const removeTraining = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      training: prev.training.filter(
        (item) => !(item.id === id && item.source === "user"),
      ),
    }));
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
      education: state.education,
      research: state.research,
      courses: state.courses,
      certifications: state.certifications,
      training: state.training,
      addEducation,
      updateEducation,
      removeEducation,
      addResearch,
      updateResearch,
      removeResearch,
      addCourse,
      updateCourse,
      removeCourse,
      addCertification,
      updateCertification,
      removeCertification,
      addTraining,
      updateTraining,
      removeTraining,
    }),
    [
      addCertification,
      addCourse,
      addEducation,
      addResearch,
      addTraining,
      hydrated,
      removeCertification,
      removeCourse,
      removeEducation,
      removeResearch,
      removeTraining,
      state.certifications,
      state.courses,
      state.education,
      state.research,
      state.training,
      updateCertification,
      updateCourse,
      updateEducation,
      updateResearch,
      updateTraining,
    ],
  );

  return (
    <ProfileEnrichmentContext.Provider value={value}>
      {children}
    </ProfileEnrichmentContext.Provider>
  );
}

export function useProfileEnrichment() {
  const ctx = useContext(ProfileEnrichmentContext);
  if (!ctx) {
    throw new Error(
      "useProfileEnrichment must be used within ProfileEnrichmentProvider",
    );
  }
  return ctx;
}
