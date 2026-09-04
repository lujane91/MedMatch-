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
  buildDirectTrainingApplication,
  buildSeedApplications,
  buildTrainingApplication,
  type DirectTrainingApplicationInput,
  type NewTrainingApplicationInput,
  type TrainingApplication,
  type TrainingApplicationStatus,
  type TrainingApplicationType,
} from "@/data/training-applications";
import {
  SEED_USER_DOCUMENTS,
  createUserDocumentId,
  resolveDocumentStatus,
  type TrainingDocumentType,
  type UserDocument,
} from "@/data/training-documents";

const APPS_KEY = "medmatch-training-applications-v2";
const DOCS_KEY = "medmatch-training-documents-v1";

type TrainingStore = {
  hydrated: boolean;
  applications: TrainingApplication[];
  documents: UserDocument[];
  submitApplication: (
    input: NewTrainingApplicationInput,
  ) => TrainingApplication;
  submitDirectApplication: (
    input: DirectTrainingApplicationInput,
  ) => TrainingApplication;
  updateApplicationStatus: (
    id: string,
    status: TrainingApplicationStatus,
    hospitalReviewNote?: string,
  ) => void;
  markApplicationCompleted: (id: string) => void;
  applicationsFor: (
    applicantKey: string,
    trainingType?: TrainingApplicationType | null,
  ) => TrainingApplication[];
  documentsFor: (userId: string) => UserDocument[];
  latestDocumentOfType: (
    userId: string,
    documentType: TrainingDocumentType,
  ) => UserDocument | undefined;
  uploadDocument: (input: {
    userId: string;
    documentType: TrainingDocumentType;
    fileName?: string;
    expiryDate?: string;
  }) => UserDocument;
};

const TrainingContext = createContext<TrainingStore | null>(null);

function loadApps(applicantFallback: string): TrainingApplication[] {
  if (typeof window === "undefined") {
    return buildSeedApplications(applicantFallback);
  }
  try {
    const raw = window.localStorage.getItem(APPS_KEY);
    if (!raw) return buildSeedApplications(applicantFallback);
    const parsed = JSON.parse(raw) as TrainingApplication[];
    if (!Array.isArray(parsed)) return buildSeedApplications(applicantFallback);
    // Migrate empty store to seeds once
    if (parsed.length === 0) return buildSeedApplications(applicantFallback);
    return parsed;
  } catch {
    return buildSeedApplications(applicantFallback);
  }
}

function loadDocs(): UserDocument[] {
  if (typeof window === "undefined") return SEED_USER_DOCUMENTS;
  try {
    const raw = window.localStorage.getItem(DOCS_KEY);
    if (!raw) return SEED_USER_DOCUMENTS;
    const parsed = JSON.parse(raw) as UserDocument[];
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : SEED_USER_DOCUMENTS;
  } catch {
    return SEED_USER_DOCUMENTS;
  }
}

export function TrainingApplicationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [applications, setApplications] = useState<TrainingApplication[]>([]);
  const [documents, setDocuments] = useState<UserDocument[]>(SEED_USER_DOCUMENTS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const apps = loadApps("demo");
    const docs = loadDocs();
    queueMicrotask(() => {
      setApplications(apps);
      setDocuments(docs);
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(APPS_KEY, JSON.stringify(applications));
  }, [applications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(DOCS_KEY, JSON.stringify(documents));
  }, [documents, hydrated]);

  const submitApplication = useCallback(
    (input: NewTrainingApplicationInput) => {
      const next = buildTrainingApplication(input);
      setApplications((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const submitDirectApplication = useCallback(
    (input: DirectTrainingApplicationInput) => {
      const next = buildDirectTrainingApplication(input);
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
        prev.map((item) => {
          if (item.id !== id) return item;
          const remainingActions =
            status === "Accepted"
              ? item.remainingActions.length
                ? item.remainingActions
                : ["Complete Hospital Requirements"]
              : status === "Completed"
                ? []
                : item.remainingActions;
          return {
            ...item,
            applicationStatus: status,
            hospitalReviewNote:
              hospitalReviewNote || item.hospitalReviewNote,
            remainingActions,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  const markApplicationCompleted = useCallback((id: string) => {
    setApplications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              applicationStatus: "Completed",
              remainingActions: [],
              evaluationReceived: true,
              certificateAvailable: true,
              stampEarned: true,
              updatedAt: new Date().toISOString(),
            }
          : item,
      ),
    );
  }, []);

  const applicationsFor = useCallback(
    (
      applicantKey: string,
      trainingType?: TrainingApplicationType | null,
    ) => {
      return applications.filter((item) => {
        // Demo seeds are shared; show seeds matching type plus user apps
        const isUser =
          item.applicantKey === applicantKey ||
          item.applicantKey === "demo" ||
          item.id.startsWith("ta-seed-");
        if (!isUser) return false;
        if (trainingType && item.trainingType !== trainingType) return false;
        return true;
      });
    },
    [applications],
  );

  const documentsFor = useCallback(
    (userId: string) => {
      return documents
        .filter(
          (d) =>
            d.userId === userId ||
            d.userId === "demo" ||
            d.id.startsWith("doc-seed-"),
        )
        .map((d) => ({
          ...d,
          status: resolveDocumentStatus(d),
        }));
    },
    [documents],
  );

  const latestDocumentOfType = useCallback(
    (userId: string, documentType: TrainingDocumentType) => {
      const list = documentsFor(userId)
        .filter((d) => d.documentType === documentType)
        .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
      return list[0];
    },
    [documentsFor],
  );

  const uploadDocument = useCallback(
    (input: {
      userId: string;
      documentType: TrainingDocumentType;
      fileName?: string;
      expiryDate?: string;
    }) => {
      const next: UserDocument = {
        id: createUserDocumentId(),
        userId: input.userId,
        documentType: input.documentType,
        fileName:
          input.fileName ||
          `${input.documentType.replace(/-/g, "_")}_upload.pdf`,
        uploadedAt: new Date().toISOString(),
        expiryDate: input.expiryDate,
        status: "Uploaded",
      };
      setDocuments((prev) => [next, ...prev]);
      return next;
    },
    [],
  );

  const value = useMemo(
    () => ({
      hydrated,
      applications,
      documents,
      submitApplication,
      submitDirectApplication,
      updateApplicationStatus,
      markApplicationCompleted,
      applicationsFor,
      documentsFor,
      latestDocumentOfType,
      uploadDocument,
    }),
    [
      applications,
      applicationsFor,
      documents,
      documentsFor,
      hydrated,
      latestDocumentOfType,
      markApplicationCompleted,
      submitApplication,
      submitDirectApplication,
      updateApplicationStatus,
      uploadDocument,
    ],
  );

  return (
    <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>
  );
}

export function useTrainingApplications() {
  const ctx = useContext(TrainingContext);
  if (!ctx) {
    throw new Error(
      "useTrainingApplications must be used within TrainingApplicationProvider",
    );
  }
  return ctx;
}
