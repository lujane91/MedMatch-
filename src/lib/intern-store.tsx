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
  createTimeline,
  defaultInternshipDates,
  defaultRequirements,
  deriveStatus,
  type ApplicationStatus,
  type HealthcareField,
  type InternProfile,
  type Rotation,
  type TrainingStage,
} from "@/data/intern";

const STORAGE_KEY = "medmatch-intern-v1";

type InternState = {
  profile: InternProfile;
  rotations: Rotation[];
};

type InternStore = InternState & {
  hydrated: boolean;
  updateProfile: (patch: Partial<InternProfile>) => void;
  setAccountBasics: (data: {
    fullName: string;
    email: string;
    mobile: string;
    password: string;
  }) => void;
  setTrainingStage: (stage: TrainingStage) => void;
  setField: (field: HealthcareField) => void;
  completeOnboarding: (data: Partial<InternProfile>) => void;
  upsertRotation: (rotation: Rotation) => void;
  updateRotation: (id: string, patch: Partial<Rotation>) => void;
  removeRotation: (id: string) => void;
  markRequirementUploaded: (rotationId: string, requirementId: string) => void;
  submitRotation: (rotationId: string) => void;
  simulateStatus: (rotationId: string, status: ApplicationStatus) => void;
  firstName: string;
};

const dates = defaultInternshipDates();

const defaultProfile: InternProfile = {
  fullName: "",
  email: "",
  mobile: "",
  trainingStage: null,
  field: null,
  university: "",
  graduationYear: String(new Date().getFullYear()),
  currentCity: "",
  preferredCities: [],
  internshipStart: dates.start,
  internshipEnd: dates.end,
  photoUploaded: false,
  cvUploaded: false,
  onboardingComplete: false,
};

const defaultState: InternState = {
  profile: defaultProfile,
  rotations: [],
};

const InternContext = createContext<InternStore | null>(null);

function loadState(): InternState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as InternState;
    return {
      profile: { ...defaultProfile, ...parsed.profile },
      rotations: parsed.rotations ?? [],
    };
  } catch {
    return defaultState;
  }
}

function persist(state: InternState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function InternProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InternState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadState();
    // Defer to avoid sync setState-in-effect lint on mount hydration
    queueMicrotask(() => {
      setState(saved);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(state);
  }, [state, hydrated]);

  const updateProfile = useCallback((patch: Partial<InternProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...patch },
    }));
  }, []);

  const setAccountBasics = useCallback(
    (data: {
      fullName: string;
      email: string;
      mobile: string;
      password: string;
    }) => {
      void data.password;
      setState((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          fullName: data.fullName,
          email: data.email,
          mobile: data.mobile,
          onboardingComplete: false,
        },
      }));
    },
    [],
  );

  const setTrainingStage = useCallback((stage: TrainingStage) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, trainingStage: stage },
    }));
  }, []);

  const setField = useCallback((field: HealthcareField) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, field },
    }));
  }, []);

  const completeOnboarding = useCallback((data: Partial<InternProfile>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...data,
        trainingStage: "intern",
        onboardingComplete: true,
      },
    }));
  }, []);

  const upsertRotation = useCallback((rotation: Rotation) => {
    setState((prev) => {
      const exists = prev.rotations.some((r) => r.id === rotation.id);
      return {
        ...prev,
        rotations: exists
          ? prev.rotations.map((r) => (r.id === rotation.id ? rotation : r))
          : [...prev.rotations, rotation],
      };
    });
  }, []);

  const updateRotation = useCallback((id: string, patch: Partial<Rotation>) => {
    setState((prev) => ({
      ...prev,
      rotations: prev.rotations.map((r) =>
        r.id === id ? { ...r, ...patch } : r,
      ),
    }));
  }, []);

  const removeRotation = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      rotations: prev.rotations.filter((r) => r.id !== id),
    }));
  }, []);

  const markRequirementUploaded = useCallback(
    (rotationId: string, requirementId: string) => {
      setState((prev) => ({
        ...prev,
        rotations: prev.rotations.map((r) => {
          if (r.id !== rotationId) return r;
          const requirements = r.requirements.map((req) =>
            req.id === requirementId
              ? {
                  ...req,
                  status: "uploaded" as const,
                }
              : req,
          );
          const status = deriveStatus(requirements, r.status);
          return {
            ...r,
            requirements,
            status,
            timeline: createTimeline(status, r.createdAt),
          };
        }),
      }));
    },
    [],
  );

  const submitRotation = useCallback((rotationId: string) => {
    setState((prev) => ({
      ...prev,
      rotations: prev.rotations.map((r) => {
        if (r.id !== rotationId) return r;
        const status: ApplicationStatus = "Submitted";
        return {
          ...r,
          status,
          timeline: createTimeline(status, r.createdAt),
        };
      }),
    }));
  }, []);

  const simulateStatus = useCallback(
    (rotationId: string, status: ApplicationStatus) => {
      setState((prev) => ({
        ...prev,
        rotations: prev.rotations.map((r) => {
          if (r.id !== rotationId) return r;
          return {
            ...r,
            status,
            timeline: createTimeline(status, r.createdAt),
            decisionNote:
              status === "Accepted"
                ? "Your rotation has been approved. Please follow hospital onboarding instructions."
                : status === "Rejected"
                  ? "This hospital could not accommodate the requested dates."
                  : r.decisionNote,
            contact:
              status === "Accepted"
                ? "internship.office@hospital.sa · +966 11 000 0000"
                : r.contact,
            changesRequested:
              status === "Changes Requested"
                ? "Please re-upload your vaccination record and confirm BLS validity."
                : r.changesRequested,
            changesDeadline:
              status === "Changes Requested" ? "2026-05-20" : r.changesDeadline,
          };
        }),
      }));
    },
    [],
  );

  const firstName = useMemo(() => {
    const name = state.profile.fullName.trim();
    if (!name) return "Intern";
    return name.split(/\s+/)[0] ?? "Intern";
  }, [state.profile.fullName]);

  const value: InternStore = {
    ...state,
    hydrated,
    updateProfile,
    setAccountBasics,
    setTrainingStage,
    setField,
    completeOnboarding,
    upsertRotation,
    updateRotation,
    removeRotation,
    markRequirementUploaded,
    submitRotation,
    simulateStatus,
    firstName,
  };

  return (
    <InternContext.Provider value={value}>{children}</InternContext.Provider>
  );
}

export function useInternStore() {
  const ctx = useContext(InternContext);
  if (!ctx) {
    throw new Error("useInternStore must be used within InternProvider");
  }
  return ctx;
}

export function newRotationDraft(partial: {
  title: string;
  startDate: string;
  endDate: string;
  specialty: string;
  preferences: string[];
}): Rotation {
  const createdAt = new Date().toISOString();
  const requirements = defaultRequirements();
  const status = deriveStatus(requirements);
  return {
    id: `rot_${Date.now()}`,
    title: partial.title,
    startDate: partial.startDate,
    endDate: partial.endDate,
    specialty: partial.specialty,
    preferences: partial.preferences,
    requirements,
    status,
    createdAt,
    timeline: createTimeline(status, createdAt),
  };
}
