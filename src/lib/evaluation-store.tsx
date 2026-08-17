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
  DEMO_EVALUATIONS,
  createReferenceNumber,
  type EvaluationFormAttachment,
  type EvaluationStatus,
  type RotationEvaluation,
} from "@/data/evaluations";
import {
  DEMO_HOSPITALS,
  resolveSpecialtyName,
  type HospitalApplication,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";

const STORAGE_KEY = "medmatch-evaluations-v2";

type EvaluationStoreValue = {
  hydrated: boolean;
  evaluations: RotationEvaluation[];
  getById: (id: string) => RotationEvaluation | undefined;
  getForApplication: (applicationId: string) => RotationEvaluation | undefined;
  getSubmittedForHospital: (hospitalId: string) => RotationEvaluation[];
  getReceivedForHospital: (hospitalId: string) => RotationEvaluation[];
  getForStudent: (email: string, name?: string) => RotationEvaluation[];
  submitEvaluation: (input: {
    application: HospitalApplication;
    hostingHospitalId: string;
    evaluatorName: string;
    evaluationDate: string;
    body: string;
    attachment?: EvaluationFormAttachment | null;
    year?: number;
  }) => RotationEvaluation | null;
  sendToHomeHospital: (id: string) => void;
};

const EvaluationContext = createContext<EvaluationStoreValue | null>(null);

function hospitalName(id: string): string {
  return DEMO_HOSPITALS.find((h) => h.id === id)?.name ?? id;
}

function resolveHomeHospital(application: HospitalApplication): {
  id: string;
  name: string;
} {
  if (application.applicantType === "Internal") {
    return {
      id: application.hospitalId,
      name: hospitalName(application.hospitalId),
    };
  }
  const affiliated = application.affiliatedHospital?.trim();
  if (affiliated) {
    const match = DEMO_HOSPITALS.find(
      (h) => h.name.toLowerCase() === affiliated.toLowerCase(),
    );
    if (match) return { id: match.id, name: match.name };
    return { id: "external-home", name: affiliated };
  }
  return { id: "external-home", name: application.university };
}

function mergeEvaluations(
  demo: RotationEvaluation[],
  saved: RotationEvaluation[],
): RotationEvaluation[] {
  const map = new Map(
    demo.map((item) => [item.id, { ...item, attachment: item.attachment ?? null }]),
  );
  for (const item of saved) {
    const base = map.get(item.id);
    map.set(
      item.id,
      base
        ? { ...base, ...item, id: item.id, attachment: item.attachment ?? base.attachment ?? null }
        : { ...item, attachment: item.attachment ?? null },
    );
  }
  return Array.from(map.values()).sort(
    (a, b) =>
      new Date(b.evaluationDate).getTime() -
      new Date(a.evaluationDate).getTime(),
  );
}

function readStored(): RotationEvaluation[] {
  try {
    const raw =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem("medmatch-evaluations-v1");
    if (!raw) return DEMO_EVALUATIONS;
    const parsed = JSON.parse(raw) as RotationEvaluation[];
    return mergeEvaluations(DEMO_EVALUATIONS, parsed ?? []);
  } catch {
    return DEMO_EVALUATIONS;
  }
}

function persist(evaluations: RotationEvaluation[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
  } catch {
    // Ignore quota errors on mobile.
  }
}

export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [evaluations, setEvaluations] =
    useState<RotationEvaluation[]>(DEMO_EVALUATIONS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const next = readStored();
    queueMicrotask(() => {
      setEvaluations(next);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(evaluations);
  }, [evaluations, hydrated]);

  const getById = useCallback(
    (id: string) => evaluations.find((item) => item.id === id),
    [evaluations],
  );

  const getForApplication = useCallback(
    (applicationId: string) =>
      evaluations.find((item) => item.applicationId === applicationId),
    [evaluations],
  );

  const getSubmittedForHospital = useCallback(
    (hospitalId: string) =>
      evaluations.filter(
        (item) =>
          item.hostingHospitalId === hospitalId &&
          (item.status === "Submitted" ||
            item.status === "Sent to Home Hospital"),
      ),
    [evaluations],
  );

  const getReceivedForHospital = useCallback(
    (hospitalId: string) =>
      evaluations.filter(
        (item) =>
          item.homeHospitalId === hospitalId &&
          item.hostingHospitalId !== hospitalId &&
          item.status === "Sent to Home Hospital",
      ),
    [evaluations],
  );

  const getForStudent = useCallback(
    (email: string, name?: string) => {
      const emailKey = email.trim().toLowerCase();
      const nameKey = (name ?? "")
        .trim()
        .toLowerCase()
        .replace(/^dr\.?\s+/i, "");
      return evaluations.filter((item) => {
        if (!item.locked || !item.visibleToStudent) return false;
        const emailMatch =
          emailKey.length > 0 &&
          item.studentEmail.toLowerCase() === emailKey;
        const studentNameKey = item.studentName
          .toLowerCase()
          .replace(/^dr\.?\s+/i, "");
        const nameMatch =
          nameKey.length > 0 &&
          (studentNameKey.includes(nameKey) || nameKey.includes(studentNameKey));
        return emailMatch || nameMatch;
      });
    },
    [evaluations],
  );

  const submitEvaluation = useCallback(
    (input: {
      application: HospitalApplication;
      hostingHospitalId: string;
      evaluatorName: string;
      evaluationDate: string;
      body: string;
      attachment?: EvaluationFormAttachment | null;
      year?: number;
    }) => {
      const evaluatorName = input.evaluatorName.trim();
      const body = input.body.trim();
      const attachment = input.attachment ?? null;
      if (!evaluatorName || !input.evaluationDate) return null;
      if (!body && !attachment) return null;

      const existing = evaluations.find(
        (item) => item.applicationId === input.application.id,
      );
      if (existing?.locked) return existing;

      const year = input.year ?? new Date().getFullYear();
      const home = resolveHomeHospital(input.application);
      const specialtyId = input.application.specialtyId as SpecialtyId;
      const month = input.application.month as MonthKey;
      const seq =
        evaluations.filter((e) => e.hostingHospitalId === input.hostingHospitalId)
          .length + 1;
      const now = new Date().toISOString();
      const next: RotationEvaluation = {
        id: existing?.id ?? `eval-${input.application.id}`,
        referenceNumber:
          existing?.referenceNumber ??
          createReferenceNumber(input.hostingHospitalId, year, seq),
        applicationId: input.application.id,
        internRotationId: null,
        studentName: input.application.applicantName,
        studentEmail: input.application.email,
        studentId: input.application.studentId,
        university: input.application.university,
        specialtyId,
        specialtyName: resolveSpecialtyName(specialtyId),
        month,
        year,
        hostingHospitalId: input.hostingHospitalId,
        hostingHospitalName: hospitalName(input.hostingHospitalId),
        homeHospitalId: home.id,
        homeHospitalName: home.name,
        evaluatorName,
        evaluationDate: input.evaluationDate,
        body,
        attachment,
        status: "Submitted" satisfies EvaluationStatus,
        authenticatedByHostingHospital: true,
        locked: true,
        sentToHomeHospitalAt: null,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        visibleToStudent: true,
      };

      setEvaluations((prev) => {
        const idx = prev.findIndex((item) => item.id === next.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = next;
          return copy;
        }
        return [next, ...prev];
      });
      return next;
    },
    [evaluations],
  );

  const sendToHomeHospital = useCallback((id: string) => {
    const now = new Date().toISOString();
    setEvaluations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Sent to Home Hospital",
              sentToHomeHospitalAt: now,
              updatedAt: now,
              locked: true,
              authenticatedByHostingHospital: true,
              visibleToStudent: true,
            }
          : item,
      ),
    );
  }, []);

  const value = useMemo<EvaluationStoreValue>(
    () => ({
      hydrated,
      evaluations,
      getById,
      getForApplication,
      getSubmittedForHospital,
      getReceivedForHospital,
      getForStudent,
      submitEvaluation,
      sendToHomeHospital,
    }),
    [
      hydrated,
      evaluations,
      getById,
      getForApplication,
      getSubmittedForHospital,
      getReceivedForHospital,
      getForStudent,
      submitEvaluation,
      sendToHomeHospital,
    ],
  );

  return (
    <EvaluationContext.Provider value={value}>
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluationStore() {
  const ctx = useContext(EvaluationContext);
  if (!ctx) {
    throw new Error("useEvaluationStore must be used within EvaluationProvider");
  }
  return ctx;
}
