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
  DEMO_AUDIT_ENTRIES,
  DEMO_TEAM_USERS,
  type AuditModule,
  type HospitalAuditEntry,
  type HospitalTeamUser,
  type TeamPermission,
} from "@/data/hospital-settings";
import type { SpecialtyId } from "@/data/hospital-demo";

const STORAGE_KEY = "medmatch-hospital-settings-v1";

type TeamUserInput = {
  name: string;
  email: string;
  position: string;
  permissions: TeamPermission[];
  specialtyIds: SpecialtyId[];
};

type HospitalSettingsStoreValue = {
  hydrated: boolean;
  teamUsers: HospitalTeamUser[];
  auditEntries: HospitalAuditEntry[];
  getTeamForHospital: (hospitalId: string) => HospitalTeamUser[];
  getAuditForHospital: (hospitalId: string) => HospitalAuditEntry[];
  addTeamUser: (
    hospitalId: string,
    input: TeamUserInput,
    actorName: string,
  ) => HospitalTeamUser | null;
  updateTeamUser: (
    userId: string,
    input: TeamUserInput,
    actorName: string,
  ) => void;
  removeTeamUser: (userId: string, actorName: string) => void;
  appendAudit: (input: {
    hospitalId: string;
    user: string;
    action: string;
    module: AuditModule;
  }) => void;
};

type PersistedSettings = {
  teamUsers: HospitalTeamUser[];
  auditEntries: HospitalAuditEntry[];
};

const HospitalSettingsContext =
  createContext<HospitalSettingsStoreValue | null>(null);

function mergeTeamUsers(
  demo: HospitalTeamUser[],
  saved: HospitalTeamUser[],
): HospitalTeamUser[] {
  const map = new Map(demo.map((user) => [user.id, user]));
  for (const user of saved) {
    map.set(user.id, { ...map.get(user.id), ...user, id: user.id });
  }
  return Array.from(map.values());
}

function mergeAuditEntries(
  demo: HospitalAuditEntry[],
  saved: HospitalAuditEntry[],
): HospitalAuditEntry[] {
  const map = new Map(demo.map((entry) => [entry.id, entry]));
  for (const entry of saved) {
    map.set(entry.id, entry);
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
  );
}

function readStored(): PersistedSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        teamUsers: DEMO_TEAM_USERS,
        auditEntries: DEMO_AUDIT_ENTRIES,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedSettings>;
    return {
      teamUsers: mergeTeamUsers(DEMO_TEAM_USERS, parsed.teamUsers ?? []),
      auditEntries: mergeAuditEntries(
        DEMO_AUDIT_ENTRIES,
        parsed.auditEntries ?? [],
      ),
    };
  } catch {
    return {
      teamUsers: DEMO_TEAM_USERS,
      auditEntries: DEMO_AUDIT_ENTRIES,
    };
  }
}

export function HospitalSettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [teamUsers, setTeamUsers] = useState<HospitalTeamUser[]>(DEMO_TEAM_USERS);
  const [auditEntries, setAuditEntries] =
    useState<HospitalAuditEntry[]>(DEMO_AUDIT_ENTRIES);

  useEffect(() => {
    const stored = readStored();
    setTeamUsers(stored.teamUsers);
    setAuditEntries(stored.auditEntries);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ teamUsers, auditEntries } satisfies PersistedSettings),
    );
  }, [auditEntries, hydrated, teamUsers]);

  const appendAudit = useCallback(
    (input: {
      hospitalId: string;
      user: string;
      action: string;
      module: AuditModule;
    }) => {
      const entry: HospitalAuditEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        hospitalId: input.hospitalId,
        at: new Date().toISOString(),
        user: input.user,
        action: input.action,
        module: input.module,
      };
      setAuditEntries((prev) => [entry, ...prev]);
    },
    [],
  );

  const getTeamForHospital = useCallback(
    (hospitalId: string) =>
      teamUsers
        .filter((user) => user.hospitalId === hospitalId)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [teamUsers],
  );

  const getAuditForHospital = useCallback(
    (hospitalId: string) =>
      auditEntries
        .filter((entry) => entry.hospitalId === hospitalId)
        .sort(
          (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
        ),
    [auditEntries],
  );

  const addTeamUser = useCallback(
    (hospitalId: string, input: TeamUserInput, actorName: string) => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      const position = input.position.trim();
      if (!name || !email || !position) return null;
      if (input.permissions.length === 0) return null;

      const user: HospitalTeamUser = {
        id: `team-${hospitalId}-${Date.now()}`,
        hospitalId,
        name,
        email,
        position,
        permissions: [...input.permissions],
        specialtyIds: [...input.specialtyIds],
      };
      setTeamUsers((prev) => [...prev, user]);
      appendAudit({
        hospitalId,
        user: actorName,
        action: "User added",
        module: "Team Access",
      });
      return user;
    },
    [appendAudit],
  );

  const updateTeamUser = useCallback(
    (userId: string, input: TeamUserInput, actorName: string) => {
      const name = input.name.trim();
      const email = input.email.trim().toLowerCase();
      const position = input.position.trim();
      if (!name || !email || !position || input.permissions.length === 0) {
        return;
      }

      let hospitalId = "";
      let permissionsChanged = false;

      setTeamUsers((prev) =>
        prev.map((user) => {
          if (user.id !== userId) return user;
          hospitalId = user.hospitalId;
          const nextPermissions = [...input.permissions].sort();
          const prevPermissions = [...user.permissions].sort();
          permissionsChanged =
            nextPermissions.join("|") !== prevPermissions.join("|") ||
            [...input.specialtyIds].sort().join("|") !==
              [...user.specialtyIds].sort().join("|");
          return {
            ...user,
            name,
            email,
            position,
            permissions: [...input.permissions],
            specialtyIds: [...input.specialtyIds],
          };
        }),
      );

      if (!hospitalId) return;
      appendAudit({
        hospitalId,
        user: actorName,
        action: permissionsChanged ? "Permission changed" : "User updated",
        module: "Team Access",
      });
    },
    [appendAudit],
  );

  const removeTeamUser = useCallback(
    (userId: string, actorName: string) => {
      const existing = teamUsers.find((user) => user.id === userId);
      if (!existing) return;
      setTeamUsers((prev) => prev.filter((user) => user.id !== userId));
      appendAudit({
        hospitalId: existing.hospitalId,
        user: actorName,
        action: "User removed",
        module: "Team Access",
      });
    },
    [appendAudit, teamUsers],
  );

  const value = useMemo<HospitalSettingsStoreValue>(
    () => ({
      hydrated,
      teamUsers,
      auditEntries,
      getTeamForHospital,
      getAuditForHospital,
      addTeamUser,
      updateTeamUser,
      removeTeamUser,
      appendAudit,
    }),
    [
      addTeamUser,
      appendAudit,
      auditEntries,
      getAuditForHospital,
      getTeamForHospital,
      hydrated,
      removeTeamUser,
      teamUsers,
      updateTeamUser,
    ],
  );

  return (
    <HospitalSettingsContext.Provider value={value}>
      {children}
    </HospitalSettingsContext.Provider>
  );
}

export function useHospitalSettingsStore() {
  const ctx = useContext(HospitalSettingsContext);
  if (!ctx) {
    throw new Error(
      "useHospitalSettingsStore must be used within HospitalSettingsProvider",
    );
  }
  return ctx;
}
