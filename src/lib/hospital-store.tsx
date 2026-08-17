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
  DEMO_ALTERNATIVE_SUGGESTIONS,
  DEMO_APPLICATIONS,
  DEMO_CAPACITIES,
  DEMO_HOSPITALS,
  DEMO_HOSPITAL_SPECIALTIES,
  DEMO_NOTIFICATIONS,
  createDefaultSpecialtiesForHospital,
  createYearCapacityForSpecialty,
  isAcceptedStatus,
  normalizeApplications,
  shortNameFromSpecialty,
  slugifySpecialtyName,
  type AlternativeSuggestion,
  type ApplicationStatus,
  type HospitalApplication,
  type HospitalNotification,
  type HospitalProfile,
  type HospitalSpecialty,
  type MonthKey,
  type SpecialtyCapacity,
  type SpecialtyId,
  type TimelineEvent,
} from "@/data/hospital-demo";

const STORAGE_KEY = "medmatch-hospital-v5";
const DEFAULT_HOSPITAL_ID = DEMO_HOSPITALS[0]?.id ?? "kfmc";
const LEGACY_STORAGE_KEYS = [
  "medmatch-hospital-v4",
  "medmatch-hospital-v3",
  "medmatch-hospital-v1",
] as const;

function resolveHospitalLogo(
  demoLogo: string | null,
  savedLogo: string | null | undefined,
): string | null {
  const candidate = savedLogo ?? demoLogo;
  if (!candidate) return demoLogo;
  // Legacy broken KFMC path — file on disk is kfmc.png
  if (candidate.endsWith("/kfmc.svg") || candidate === "kfmc.svg") {
    return demoLogo ?? "/institutions/kfmc.png";
  }
  return candidate;
}

function appendTimeline(
  app: HospitalApplication,
  label: string,
  detail?: string,
): TimelineEvent[] {
  const event: TimelineEvent = {
    id: `${app.id}-tl-${Date.now()}`,
    label,
    at: new Date().toISOString(),
    detail,
  };
  return [...(app.timeline ?? []), event].sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );
}

type PersistedHospitalState = {
  activeHospitalId: string;
  hospitals: HospitalProfile[];
  specialties: HospitalSpecialty[];
  applications: HospitalApplication[];
  capacities: SpecialtyCapacity[];
  alternatives: AlternativeSuggestion[];
  notifications: HospitalNotification[];
};

type HospitalStoreValue = PersistedHospitalState & {
  hydrated: boolean;
  activeHospital: HospitalProfile | null;
  activeSpecialties: HospitalSpecialty[];
  setActiveHospital: (id: string) => void;
  updateHospitalProfile: (patch: Partial<HospitalProfile>) => void;
  addSpecialty: (input: {
    name: string;
    shortName?: string;
    internalSlots?: number;
    externalSlots?: number;
  }) => HospitalSpecialty | null;
  updateSpecialty: (
    specialtyId: SpecialtyId,
    patch: Partial<Pick<HospitalSpecialty, "name" | "shortName" | "active">>,
  ) => void;
  setSpecialtyActive: (specialtyId: SpecialtyId, active: boolean) => void;
  deleteSpecialty: (specialtyId: SpecialtyId) => void;
  upsertSpecialtyCapacity: (
    specialtyId: SpecialtyId,
    month: MonthKey,
    patch: Partial<
      Pick<SpecialtyCapacity, "internalSlots" | "externalSlots" | "closed">
    >,
    hospitalId?: string,
  ) => void;
  getSpecialtyCapacity: (
    specialtyId: SpecialtyId,
    month: MonthKey,
    hospitalId?: string,
  ) => SpecialtyCapacity | undefined;
  getSpecialtyRemaining: (
    specialtyId: SpecialtyId,
    month: MonthKey,
    hospitalId?: string,
  ) => number;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  acceptApplication: (id: string) => {
    ok: boolean;
    message?: string;
  };
  rejectApplication: (id: string, reason: string) => void;
  waitlistApplication: (id: string) => void;
  suggestAlternativeMonths: (
    id: string,
    months: MonthKey[],
    message: string,
  ) => void;
  addNote: (id: string, note: string) => void;
  markNotificationRead: (id: string) => void;
};

const defaultState: PersistedHospitalState = {
  activeHospitalId: DEFAULT_HOSPITAL_ID,
  hospitals: DEMO_HOSPITALS,
  specialties: DEMO_HOSPITAL_SPECIALTIES,
  applications: DEMO_APPLICATIONS,
  capacities: DEMO_CAPACITIES,
  alternatives: DEMO_ALTERNATIVE_SUGGESTIONS,
  notifications: DEMO_NOTIFICATIONS,
};

const HospitalContext = createContext<HospitalStoreValue | null>(null);

function mergeHospitals(
  demo: HospitalProfile[],
  saved: HospitalProfile[],
): HospitalProfile[] {
  const savedById = new Map(saved.map((h) => [h.id, h]));
  const merged = demo.map((base) => {
    const overlay = savedById.get(base.id);
    if (!overlay) return base;
    return {
      ...base,
      ...overlay,
      id: base.id,
      logo: resolveHospitalLogo(base.logo, overlay.logo),
    };
  });
  const demoIds = new Set(demo.map((h) => h.id));
  for (const hospital of saved) {
    if (!demoIds.has(hospital.id)) merged.push(hospital);
  }
  return merged;
}

function mergeCapacities(
  demo: SpecialtyCapacity[],
  saved: SpecialtyCapacity[],
): SpecialtyCapacity[] {
  const keyOf = (c: SpecialtyCapacity) =>
    `${c.hospitalId}:${c.specialtyId}:${c.month}`;
  const map = new Map(demo.map((c) => [keyOf(c), c]));
  for (const row of saved) {
    const key = keyOf(row);
    const base = map.get(key);
    map.set(key, base ? { ...base, ...row } : row);
  }
  return Array.from(map.values());
}

function mergeApplications(
  demo: HospitalApplication[],
  saved: HospitalApplication[],
): HospitalApplication[] {
  const map = new Map(demo.map((app) => [app.id, app]));
  for (const app of saved) {
    const base = map.get(app.id);
    map.set(app.id, base ? { ...base, ...app, id: app.id } : app);
  }
  return normalizeApplications(Array.from(map.values()));
}

function mergeSpecialties(
  demo: HospitalSpecialty[],
  saved: HospitalSpecialty[],
): HospitalSpecialty[] {
  const keyOf = (s: HospitalSpecialty) => `${s.hospitalId}:${s.id}`;
  const map = new Map(demo.map((s) => [keyOf(s), s]));
  for (const row of saved) {
    const key = keyOf(row);
    const base = map.get(key);
    map.set(
      key,
      base
        ? { ...base, ...row, id: row.id, hospitalId: row.hospitalId }
        : row,
    );
  }
  // Always keep the full default specialty set for every demo hospital
  for (const hospital of DEMO_HOSPITALS) {
    for (const specialty of createDefaultSpecialtiesForHospital(hospital.id)) {
      const key = keyOf(specialty);
      if (!map.has(key)) {
        map.set(key, specialty);
      }
    }
  }
  return Array.from(map.values());
}

function readStoredState(): PersistedHospitalState {
  try {
    const currentRaw = window.localStorage.getItem(STORAGE_KEY);
    if (!currentRaw) {
      // Migrate lightly from legacy keys — never rehydrate oversized app dumps.
      let legacy: Partial<PersistedHospitalState> | null = null;
      for (const key of LEGACY_STORAGE_KEYS) {
        const raw = window.localStorage.getItem(key);
        if (!raw) continue;
        try {
          legacy = JSON.parse(raw) as Partial<PersistedHospitalState>;
          break;
        } catch {
          // continue
        }
      }
      if (!legacy) return defaultState;
      return {
        ...defaultState,
        activeHospitalId:
          legacy.activeHospitalId ?? defaultState.activeHospitalId,
        hospitals: mergeHospitals(
          DEMO_HOSPITALS,
          legacy.hospitals ?? DEMO_HOSPITALS,
        ),
      };
    }

    const parsed = JSON.parse(currentRaw) as Partial<PersistedHospitalState>;
    return {
      activeHospitalId:
        parsed.activeHospitalId ?? defaultState.activeHospitalId,
      hospitals: mergeHospitals(
        DEMO_HOSPITALS,
        parsed.hospitals ?? DEMO_HOSPITALS,
      ),
      specialties: mergeSpecialties(
        DEMO_HOSPITAL_SPECIALTIES,
        parsed.specialties ?? DEMO_HOSPITAL_SPECIALTIES,
      ),
      applications: mergeApplications(
        DEMO_APPLICATIONS,
        parsed.applications ?? [],
      ),
      capacities: mergeCapacities(
        DEMO_CAPACITIES,
        parsed.capacities ?? [],
      ),
      alternatives: parsed.alternatives ?? DEMO_ALTERNATIVE_SUGGESTIONS,
      notifications: parsed.notifications ?? DEMO_NOTIFICATIONS,
    };
  } catch {
    return defaultState;
  }
}

function persistHospitalState(state: PersistedHospitalState) {
  try {
    const payload = JSON.stringify(state);
    window.localStorage.setItem(STORAGE_KEY, payload);
  } catch {
    // Mobile Safari can throw QuotaExceededError; keep the app usable.
    try {
      const slim: PersistedHospitalState = {
        ...state,
        applications: state.applications.map((app) => ({
          ...app,
          personalStatement: "",
          documents: app.documents?.slice(0, 2),
          timeline: app.timeline?.slice(-3),
        })),
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch {
      // Ignore persistence failures — in-memory demo state still works.
    }
  }
}

function patchApplication(
  applications: HospitalApplication[],
  id: string,
  patch: Partial<HospitalApplication>,
): HospitalApplication[] {
  return applications.map((app) =>
    app.id === id ? { ...app, ...patch } : app,
  );
}

export function HospitalProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedHospitalState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStoredState();
    queueMicrotask(() => {
      setState(next);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistHospitalState(state);
  }, [state, hydrated]);

  const setActiveHospital = useCallback((id: string) => {
    setState((prev) => ({ ...prev, activeHospitalId: id }));
  }, []);

  const updateHospitalProfile = useCallback((patch: Partial<HospitalProfile>) => {
    setState((prev) => ({
      ...prev,
      hospitals: prev.hospitals.map((hospital) =>
        hospital.id === prev.activeHospitalId
          ? { ...hospital, ...patch, id: hospital.id }
          : hospital,
      ),
    }));
  }, []);

  const addSpecialty = useCallback(
    (input: {
      name: string;
      shortName?: string;
      internalSlots?: number;
      externalSlots?: number;
    }) => {
      const name = input.name.trim();
      if (!name) return null;

      let created: HospitalSpecialty | null = null;

      setState((prev) => {
        const hospitalId = prev.activeHospitalId;
        const baseId = slugifySpecialtyName(name);
        let specialtyId = baseId;
        let n = 2;
        while (
          prev.specialties.some(
            (s) => s.hospitalId === hospitalId && s.id === specialtyId,
          )
        ) {
          specialtyId = `${baseId}-${n}`;
          n += 1;
        }

        const specialty: HospitalSpecialty = {
          id: specialtyId,
          hospitalId,
          name,
          shortName:
            input.shortName?.trim() || shortNameFromSpecialty(name),
          active: true,
        };
        created = specialty;

        const yearRows = createYearCapacityForSpecialty(
          hospitalId,
          specialtyId,
          input.internalSlots ?? 4,
          input.externalSlots ?? 2,
        );

        return {
          ...prev,
          specialties: [...prev.specialties, specialty],
          capacities: [...prev.capacities, ...yearRows],
        };
      });

      return created;
    },
    [],
  );

  const updateSpecialty = useCallback(
    (
      specialtyId: SpecialtyId,
      patch: Partial<Pick<HospitalSpecialty, "name" | "shortName" | "active">>,
    ) => {
      setState((prev) => ({
        ...prev,
        specialties: prev.specialties.map((specialty) =>
          specialty.hospitalId === prev.activeHospitalId &&
          specialty.id === specialtyId
            ? {
                ...specialty,
                ...patch,
                name: patch.name?.trim() || specialty.name,
                shortName: patch.shortName?.trim() || specialty.shortName,
              }
            : specialty,
        ),
      }));
    },
    [],
  );

  const setSpecialtyActive = useCallback(
    (specialtyId: SpecialtyId, active: boolean) => {
      updateSpecialty(specialtyId, { active });
    },
    [updateSpecialty],
  );

  const deleteSpecialty = useCallback((specialtyId: SpecialtyId) => {
    setState((prev) => ({
      ...prev,
      specialties: prev.specialties.filter(
        (s) =>
          !(
            s.hospitalId === prev.activeHospitalId && s.id === specialtyId
          ),
      ),
      capacities: prev.capacities.filter(
        (c) =>
          !(
            c.hospitalId === prev.activeHospitalId &&
            c.specialtyId === specialtyId
          ),
      ),
    }));
  }, []);

  const upsertSpecialtyCapacity = useCallback(
    (
      specialtyId: SpecialtyId,
      month: MonthKey,
      patch: Partial<
        Pick<SpecialtyCapacity, "internalSlots" | "externalSlots" | "closed">
      >,
      hospitalId?: string,
    ) => {
      setState((prev) => {
        const targetHospitalId = hospitalId ?? prev.activeHospitalId;
        const index = prev.capacities.findIndex(
          (c) =>
            c.hospitalId === targetHospitalId &&
            c.specialtyId === specialtyId &&
            c.month === month,
        );
        if (index >= 0) {
          const capacities = prev.capacities.map((row, i) =>
            i === index ? { ...row, ...patch } : row,
          );
          return { ...prev, capacities };
        }
        const capacities: SpecialtyCapacity[] = [
          ...prev.capacities,
          {
            hospitalId: targetHospitalId,
            specialtyId,
            month,
            internalSlots: patch.internalSlots ?? 0,
            externalSlots: patch.externalSlots ?? 0,
            closed: patch.closed ?? false,
          },
        ];
        return { ...prev, capacities };
      });
    },
    [],
  );

  const getSpecialtyCapacity = useCallback(
    (specialtyId: SpecialtyId, month: MonthKey, hospitalId?: string) => {
      const targetHospitalId = hospitalId ?? state.activeHospitalId;
      return state.capacities.find(
        (c) =>
          c.hospitalId === targetHospitalId &&
          c.specialtyId === specialtyId &&
          c.month === month,
      );
    },
    [state.activeHospitalId, state.capacities],
  );

  const getSpecialtyRemaining = useCallback(
    (specialtyId: SpecialtyId, month: MonthKey, hospitalId?: string) => {
      const targetHospitalId = hospitalId ?? state.activeHospitalId;
      const specialty = state.specialties.find(
        (s) => s.hospitalId === targetHospitalId && s.id === specialtyId,
      );
      if (specialty && !specialty.active) return 0;

      const capacity = getSpecialtyCapacity(
        specialtyId,
        month,
        targetHospitalId,
      );
      if (!capacity || capacity.closed) return 0;
      const total = capacity.internalSlots + capacity.externalSlots;
      const accepted = state.applications.filter(
        (app) =>
          app.hospitalId === targetHospitalId &&
          app.specialtyId === specialtyId &&
          app.month === month &&
          isAcceptedStatus(app.status),
      ).length;
      return Math.max(0, total - accepted);
    },
    [
      getSpecialtyCapacity,
      state.activeHospitalId,
      state.applications,
      state.specialties,
    ],
  );

  const updateApplicationStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      setState((prev) => ({
        ...prev,
        applications: patchApplication(prev.applications, id, { status }),
      }));
    },
    [],
  );

  const acceptApplication = useCallback((id: string) => {
    let result: { ok: boolean; message?: string } = {
      ok: false,
      message: "Application not found.",
    };

    setState((prev) => {
      const app = prev.applications.find((a) => a.id === id);
      if (!app) {
        result = { ok: false, message: "Application not found." };
        return prev;
      }

      if (isAcceptedStatus(app.status)) {
        result = { ok: true, message: "Already accepted." };
        return prev;
      }

      const capacity = prev.capacities.find(
        (c) =>
          c.hospitalId === app.hospitalId &&
          c.specialtyId === app.specialtyId &&
          c.month === app.month,
      );
      const totalSlots = capacity
        ? capacity.internalSlots + capacity.externalSlots
        : 0;
      const specialty = prev.specialties.find(
        (s) => s.hospitalId === app.hospitalId && s.id === app.specialtyId,
      );
      const closed =
        capacity?.closed || (specialty ? specialty.active === false : false);
      const acceptedCount = prev.applications.filter(
        (a) =>
          a.hospitalId === app.hospitalId &&
          a.specialtyId === app.specialtyId &&
          a.month === app.month &&
          isAcceptedStatus(a.status),
      ).length;
      const remaining = closed
        ? 0
        : Math.max(0, totalSlots - acceptedCount);

      if (remaining <= 0) {
        result = {
          ok: false,
          message:
            "No remaining capacity for this specialty and month. Applicant was waitlisted.",
        };
        return {
          ...prev,
          applications: patchApplication(prev.applications, id, {
            status: "Waitlisted",
            acceptanceDate: undefined,
            notes: app.notes?.includes("Auto-waitlisted")
              ? app.notes
              : [app.notes, "Auto-waitlisted: capacity full"]
                  .filter(Boolean)
                  .join("\n"),
            timeline: appendTimeline(
              app,
              "Waitlisted",
              "Auto-waitlisted because total slots are full. Remaining capacity unchanged.",
            ),
          }),
        };
      }

      result = {
        ok: true,
        message: `Applicant accepted. Remaining capacity is now ${remaining - 1}.`,
      };
      return {
        ...prev,
        applications: patchApplication(prev.applications, id, {
          status: "Accepted",
          acceptanceDate: new Date().toISOString(),
          rejectionReason: undefined,
          timeline: appendTimeline(
            app,
            "Accepted",
            `Accepted into the rotation. Remaining capacity updated to ${remaining - 1}.`,
          ),
        }),
      };
    });

    return result;
  }, []);

  const rejectApplication = useCallback((id: string, reason: string) => {
    setState((prev) => {
      const app = prev.applications.find((a) => a.id === id);
      if (!app) return prev;
      return {
        ...prev,
        applications: patchApplication(prev.applications, id, {
          status: "Rejected",
          rejectionReason: reason,
          acceptanceDate: undefined,
          timeline: appendTimeline(
            app,
            "Rejected",
            reason || "Application rejected by hospital admin.",
          ),
        }),
      };
    });
  }, []);

  const waitlistApplication = useCallback((id: string) => {
    setState((prev) => {
      const app = prev.applications.find((a) => a.id === id);
      if (!app) return prev;
      return {
        ...prev,
        applications: patchApplication(prev.applications, id, {
          status: "Waitlisted",
          acceptanceDate: undefined,
          timeline: appendTimeline(
            app,
            "Waitlisted",
            "Applicant placed on the waitlist by hospital admin.",
          ),
        }),
      };
    });
  }, []);

  const suggestAlternativeMonths = useCallback(
    (id: string, months: MonthKey[], message: string) => {
      setState((prev) => {
        const app = prev.applications.find((a) => a.id === id);
        if (!app) return prev;

        const applications = patchApplication(prev.applications, id, {
          status: "Alternative Suggested",
          alternativeMonthSuggestions: months,
        });

        const existingIndex = prev.alternatives.findIndex(
          (alt) => alt.applicationId === id && alt.status === "Suggested",
        );
        const nextAlt: AlternativeSuggestion = {
          id:
            existingIndex >= 0
              ? prev.alternatives[existingIndex]!.id
              : `alt_${Date.now()}`,
          applicationId: id,
          hospitalId: app.hospitalId,
          specialtyId: app.specialtyId,
          originalMonth: app.month,
          suggestedMonths: months,
          status: "Suggested",
          message,
          createdAt: new Date().toISOString(),
        };
        const alternatives =
          existingIndex >= 0
            ? prev.alternatives.map((alt, i) =>
                i === existingIndex ? nextAlt : alt,
              )
            : [...prev.alternatives, nextAlt];

        return { ...prev, applications, alternatives };
      });
    },
    [],
  );

  const addNote = useCallback((id: string, note: string) => {
    const trimmed = note.trim();
    if (!trimmed) return;
    setState((prev) => ({
      ...prev,
      applications: prev.applications.map((app) => {
        if (app.id !== id) return app;
        const notes = app.notes?.trim()
          ? `${app.notes.trim()}\n${trimmed}`
          : trimmed;
        return { ...app, notes };
      }),
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const activeHospital = useMemo(
    () =>
      state.hospitals.find((h) => h.id === state.activeHospitalId) ??
      state.hospitals[0] ??
      null,
    [state.activeHospitalId, state.hospitals],
  );

  const activeSpecialties = useMemo(() => {
    const order = new Map(
      DEMO_HOSPITAL_SPECIALTIES.filter(
        (s) => s.hospitalId === state.activeHospitalId,
      ).map((s, index) => [s.id, index]),
    );
    return state.specialties
      .filter((s) => s.hospitalId === state.activeHospitalId)
      .sort((a, b) => {
        const ai = order.get(a.id);
        const bi = order.get(b.id);
        if (ai !== undefined || bi !== undefined) {
          return (ai ?? 999) - (bi ?? 999);
        }
        return a.name.localeCompare(b.name);
      });
  }, [state.activeHospitalId, state.specialties]);

  const value = useMemo<HospitalStoreValue>(
    () => ({
      ...state,
      hydrated,
      activeHospital,
      activeSpecialties,
      setActiveHospital,
      updateHospitalProfile,
      addSpecialty,
      updateSpecialty,
      setSpecialtyActive,
      deleteSpecialty,
      upsertSpecialtyCapacity,
      getSpecialtyCapacity,
      getSpecialtyRemaining,
      updateApplicationStatus,
      acceptApplication,
      rejectApplication,
      waitlistApplication,
      suggestAlternativeMonths,
      addNote,
      markNotificationRead,
    }),
    [
      state,
      hydrated,
      activeHospital,
      activeSpecialties,
      setActiveHospital,
      updateHospitalProfile,
      addSpecialty,
      updateSpecialty,
      setSpecialtyActive,
      deleteSpecialty,
      upsertSpecialtyCapacity,
      getSpecialtyCapacity,
      getSpecialtyRemaining,
      updateApplicationStatus,
      acceptApplication,
      rejectApplication,
      waitlistApplication,
      suggestAlternativeMonths,
      addNote,
      markNotificationRead,
    ],
  );

  return (
    <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>
  );
}

export function useHospitalStore() {
  const ctx = useContext(HospitalContext);
  if (!ctx) {
    throw new Error("useHospitalStore must be used within HospitalProvider");
  }
  return ctx;
}
