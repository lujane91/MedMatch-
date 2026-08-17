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
  DEMO_PLATFORM_HOSPITALS,
  DEMO_PLATFORM_STUDENTS,
  type HospitalApprovalStatus,
  type PlatformAccountStatus,
  type PlatformHospitalRecord,
  type PlatformStudentRecord,
} from "@/data/platform-directory";

const STORAGE_KEY = "medmatch-platform-directory-v1";

type PersistedState = {
  students: PlatformStudentRecord[];
  hospitals: PlatformHospitalRecord[];
};

type DirectoryStoreValue = {
  hydrated: boolean;
  students: PlatformStudentRecord[];
  hospitals: PlatformHospitalRecord[];
  getStudent: (id: string) => PlatformStudentRecord | undefined;
  getHospital: (id: string) => PlatformHospitalRecord | undefined;
  setStudentAccountStatus: (
    id: string,
    status: PlatformAccountStatus,
  ) => void;
  setHospitalAccountStatus: (
    id: string,
    status: PlatformAccountStatus,
  ) => void;
  setHospitalApprovalStatus: (
    id: string,
    status: HospitalApprovalStatus,
  ) => void;
  sendStudentPaymentReminder: (id: string) => string | null;
};

const DirectoryContext = createContext<DirectoryStoreValue | null>(null);

function mergeById<T extends { id: string }>(demo: T[], saved: T[]): T[] {
  const savedMap = new Map(saved.map((item) => [item.id, item]));
  return demo.map((item) => {
    const overlay = savedMap.get(item.id);
    return overlay ? { ...item, ...overlay, id: item.id } : item;
  });
}

function readStored(): PersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        students: DEMO_PLATFORM_STUDENTS,
        hospitals: DEMO_PLATFORM_HOSPITALS,
      };
    }
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    return {
      students: mergeById(
        DEMO_PLATFORM_STUDENTS,
        parsed.students ?? DEMO_PLATFORM_STUDENTS,
      ),
      hospitals: mergeById(
        DEMO_PLATFORM_HOSPITALS,
        parsed.hospitals ?? DEMO_PLATFORM_HOSPITALS,
      ),
    };
  } catch {
    return {
      students: DEMO_PLATFORM_STUDENTS,
      hospitals: DEMO_PLATFORM_HOSPITALS,
    };
  }
}

export function PlatformDirectoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [students, setStudents] = useState<PlatformStudentRecord[]>(
    DEMO_PLATFORM_STUDENTS,
  );
  const [hospitals, setHospitals] = useState<PlatformHospitalRecord[]>(
    DEMO_PLATFORM_HOSPITALS,
  );

  useEffect(() => {
    const stored = readStored();
    queueMicrotask(() => {
      setStudents(stored.students);
      setHospitals(stored.hospitals);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ students, hospitals } satisfies PersistedState),
    );
  }, [hospitals, hydrated, students]);

  const getStudent = useCallback(
    (id: string) => students.find((student) => student.id === id),
    [students],
  );

  const getHospital = useCallback(
    (id: string) => hospitals.find((hospital) => hospital.id === id),
    [hospitals],
  );

  const setStudentAccountStatus = useCallback(
    (id: string, status: PlatformAccountStatus) => {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === id ? { ...student, accountStatus: status } : student,
        ),
      );
    },
    [],
  );

  const setHospitalAccountStatus = useCallback(
    (id: string, status: PlatformAccountStatus) => {
      setHospitals((prev) =>
        prev.map((hospital) =>
          hospital.id === id ? { ...hospital, accountStatus: status } : hospital,
        ),
      );
    },
    [],
  );

  const setHospitalApprovalStatus = useCallback(
    (id: string, status: HospitalApprovalStatus) => {
      setHospitals((prev) =>
        prev.map((hospital) => {
          if (hospital.id !== id) return hospital;
          return {
            ...hospital,
            approvalStatus: status,
            accountStatus:
              status === "Approved"
                ? hospital.accountStatus === "Suspended"
                  ? "Suspended"
                  : "Active"
                : status === "Rejected"
                  ? "Inactive"
                  : hospital.accountStatus,
          };
        }),
      );
    },
    [],
  );

  const sendStudentPaymentReminder = useCallback((id: string) => {
    const now = new Date().toISOString();
    let email: string | null = null;
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;
        email = student.email;
        return { ...student, lastReminderAt: now };
      }),
    );
    return email;
  }, []);

  const value = useMemo<DirectoryStoreValue>(
    () => ({
      hydrated,
      students,
      hospitals,
      getStudent,
      getHospital,
      setStudentAccountStatus,
      setHospitalAccountStatus,
      setHospitalApprovalStatus,
      sendStudentPaymentReminder,
    }),
    [
      getHospital,
      getStudent,
      hospitals,
      hydrated,
      sendStudentPaymentReminder,
      setHospitalAccountStatus,
      setHospitalApprovalStatus,
      setStudentAccountStatus,
      students,
    ],
  );

  return (
    <DirectoryContext.Provider value={value}>{children}</DirectoryContext.Provider>
  );
}

export function usePlatformDirectoryStore() {
  const ctx = useContext(DirectoryContext);
  if (!ctx) {
    throw new Error(
      "usePlatformDirectoryStore must be used within PlatformDirectoryProvider",
    );
  }
  return ctx;
}
