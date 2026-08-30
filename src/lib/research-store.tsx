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
  createInviteId,
  createRequestId,
  createResearchId,
  SEED_RESEARCH_INVITES,
  SEED_RESEARCH_PROJECTS,
  SEED_RESEARCH_REQUESTS,
  type InviteStatus,
  type JoinRequestStatus,
  type ResearchInvite,
  type ResearchJoinRequest,
  type ResearchProject,
  type ResearchStatus,
} from "@/data/research";
import { useMedJourneyNotifications } from "@/lib/medjourney-notification-store";

const STORAGE_KEY = "medmatch-research-v1";

type ResearchState = {
  projects: ResearchProject[];
  requests: ResearchJoinRequest[];
  invites: ResearchInvite[];
};

type ProposeResearchInput = Omit<
  ResearchProject,
  "id" | "createdAt" | "status"
> & { status?: ResearchStatus };

type ResearchStore = {
  hydrated: boolean;
  projects: ResearchProject[];
  requests: ResearchJoinRequest[];
  invites: ResearchInvite[];
  proposeResearch: (input: ProposeResearchInput) => ResearchProject;
  requestToJoin: (input: {
    researchId: string;
    requesterUserId: string;
    requesterName: string;
    healthcareField: ResearchJoinRequest["healthcareField"];
    journeyStage: ResearchJoinRequest["journeyStage"];
    specialty?: string;
    institution?: string;
    message?: string;
  }) => ResearchJoinRequest | null;
  respondToRequest: (
    requestId: string,
    status: Exclude<JoinRequestStatus, "Pending">,
  ) => void;
  inviteParticipant: (input: {
    researchId: string;
    inviteeUserId: string;
    inviteeName: string;
    inviteeField: ResearchInvite["inviteeField"];
    inviteeStage: ResearchInvite["inviteeStage"];
    inviteeSpecialty?: string;
  }) => ResearchInvite | null;
  respondToInvite: (
    inviteId: string,
    status: Exclude<InviteStatus, "Pending">,
  ) => void;
  updateProjectStatus: (researchId: string, status: ResearchStatus) => void;
  myProjects: (creatorUserId: string) => ResearchProject[];
  pendingRequestsForCreator: (creatorUserId: string) => ResearchJoinRequest[];
};

const ResearchContext = createContext<ResearchStore | null>(null);

function defaultState(): ResearchState {
  return {
    projects: SEED_RESEARCH_PROJECTS,
    requests: SEED_RESEARCH_REQUESTS,
    invites: SEED_RESEARCH_INVITES,
  };
}

function load(): ResearchState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as ResearchState;
    if (!parsed?.projects?.length) return defaultState();
    return {
      projects: parsed.projects,
      requests: parsed.requests ?? [],
      invites: parsed.invites ?? [],
    };
  } catch {
    return defaultState();
  }
}

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResearchState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const { addNotification } = useMedJourneyNotifications();

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

  const proposeResearch = useCallback((input: ProposeResearchInput) => {
    const next: ResearchProject = {
      ...input,
      id: createResearchId(),
      status: input.status ?? "Proposed",
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      projects: [next, ...prev.projects],
    }));
    return next;
  }, []);

  const requestToJoin = useCallback(
    (input: {
      researchId: string;
      requesterUserId: string;
      requesterName: string;
      healthcareField: ResearchJoinRequest["healthcareField"];
      journeyStage: ResearchJoinRequest["journeyStage"];
      specialty?: string;
      institution?: string;
      message?: string;
    }) => {
      const project = state.projects.find((p) => p.id === input.researchId);
      if (!project) return null;

      const existing = state.requests.find(
        (r) =>
          r.researchId === input.researchId &&
          r.requesterUserId === input.requesterUserId &&
          r.status === "Pending",
      );
      if (existing) return existing;

      const next: ResearchJoinRequest = {
        id: createRequestId(),
        researchId: input.researchId,
        requesterUserId: input.requesterUserId,
        requesterName: input.requesterName,
        healthcareField: input.healthcareField,
        journeyStage: input.journeyStage,
        specialty: input.specialty,
        institution: input.institution,
        message: input.message,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        requests: [next, ...prev.requests],
      }));

      addNotification({
        category: "research",
        title: "Someone requested to join your research",
        message: `${input.requesterName} requested to join ${project.title}.`,
        relatedRecordId: next.id,
        actionHref: `/research/${project.id}`,
      });

      return next;
    },
    [addNotification, state.projects, state.requests],
  );

  const respondToRequest = useCallback(
    (requestId: string, status: Exclude<JoinRequestStatus, "Pending">) => {
      const request = state.requests.find((r) => r.id === requestId);
      const project = request
        ? state.projects.find((p) => p.id === request.researchId)
        : null;

      setState((prev) => ({
        ...prev,
        requests: prev.requests.map((r) =>
          r.id === requestId ? { ...r, status } : r,
        ),
      }));

      if (request && project) {
        addNotification({
          category: "research",
          title:
            status === "Accepted"
              ? "Your request was accepted"
              : "Your request was declined",
          message:
            status === "Accepted"
              ? `You were accepted to join ${project.title}.`
              : `Your request to join ${project.title} was declined.`,
          relatedRecordId: request.id,
          actionHref: `/research/${project.id}`,
        });
      }
    },
    [addNotification, state.projects, state.requests],
  );

  const inviteParticipant = useCallback(
    (input: {
      researchId: string;
      inviteeUserId: string;
      inviteeName: string;
      inviteeField: ResearchInvite["inviteeField"];
      inviteeStage: ResearchInvite["inviteeStage"];
      inviteeSpecialty?: string;
    }) => {
      const project = state.projects.find((p) => p.id === input.researchId);
      if (!project) return null;

      const next: ResearchInvite = {
        id: createInviteId(),
        researchId: input.researchId,
        inviteeUserId: input.inviteeUserId,
        inviteeName: input.inviteeName,
        inviteeField: input.inviteeField,
        inviteeStage: input.inviteeStage,
        inviteeSpecialty: input.inviteeSpecialty,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        invites: [next, ...prev.invites],
      }));

      addNotification({
        category: "research",
        title: "You received a research invitation",
        message: `${project.creatorName} invited you to join ${project.title}.`,
        relatedRecordId: next.id,
        actionHref: `/research/${project.id}`,
      });

      return next;
    },
    [addNotification, state.projects],
  );

  const respondToInvite = useCallback(
    (inviteId: string, status: Exclude<InviteStatus, "Pending">) => {
      setState((prev) => ({
        ...prev,
        invites: prev.invites.map((inv) =>
          inv.id === inviteId ? { ...inv, status } : inv,
        ),
      }));
    },
    [],
  );

  const updateProjectStatus = useCallback(
    (researchId: string, status: ResearchStatus) => {
      setState((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === researchId ? { ...p, status } : p,
        ),
      }));

      const project = state.projects.find((p) => p.id === researchId);
      if (project) {
        addNotification({
          category: "research",
          title: "A research project you joined was updated",
          message: `${project.title} is now ${status}.`,
          relatedRecordId: researchId,
          actionHref: `/research/${researchId}`,
        });
      }
    },
    [addNotification, state.projects],
  );

  const myProjects = useCallback(
    (creatorUserId: string) =>
      state.projects.filter((p) => p.creatorUserId === creatorUserId),
    [state.projects],
  );

  const pendingRequestsForCreator = useCallback(
    (creatorUserId: string) => {
      const ownedIds = new Set(
        state.projects
          .filter((p) => p.creatorUserId === creatorUserId)
          .map((p) => p.id),
      );
      return state.requests.filter(
        (r) => ownedIds.has(r.researchId) && r.status === "Pending",
      );
    },
    [state.projects, state.requests],
  );

  const value = useMemo(
    () => ({
      hydrated,
      projects: state.projects,
      requests: state.requests,
      invites: state.invites,
      proposeResearch,
      requestToJoin,
      respondToRequest,
      inviteParticipant,
      respondToInvite,
      updateProjectStatus,
      myProjects,
      pendingRequestsForCreator,
    }),
    [
      hydrated,
      inviteParticipant,
      myProjects,
      pendingRequestsForCreator,
      proposeResearch,
      requestToJoin,
      respondToInvite,
      respondToRequest,
      state.invites,
      state.projects,
      state.requests,
      updateProjectStatus,
    ],
  );

  return (
    <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>
  );
}

export function useResearchStore() {
  const ctx = useContext(ResearchContext);
  if (!ctx) {
    throw new Error("useResearchStore must be used within ResearchProvider");
  }
  return ctx;
}
