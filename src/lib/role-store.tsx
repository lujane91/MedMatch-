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

export type MedMatchRole = "intern" | "hospital-admin" | null;

const STORAGE_KEY = "medmatch-role-v1";

type RoleStoreValue = {
  role: MedMatchRole;
  hydrated: boolean;
  setRole: (role: Exclude<MedMatchRole, null>) => void;
  clearRole: () => void;
};

const RoleContext = createContext<RoleStoreValue | null>(null);

function readStoredRole(): MedMatchRole {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { role?: MedMatchRole };
    if (parsed.role === "intern" || parsed.role === "hospital-admin") {
      return parsed.role;
    }
    return null;
  } catch {
    return null;
  }
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<MedMatchRole>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStoredRole();
    queueMicrotask(() => {
      setRoleState(next);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role }));
  }, [role, hydrated]);

  const setRole = useCallback((next: Exclude<MedMatchRole, null>) => {
    setRoleState(next);
  }, []);

  const clearRole = useCallback(() => {
    setRoleState(null);
  }, []);

  const value = useMemo(
    () => ({ role, hydrated, setRole, clearRole }),
    [role, hydrated, setRole, clearRole],
  );

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
}

export function useRoleStore() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    throw new Error("useRoleStore must be used within RoleProvider");
  }
  return ctx;
}
