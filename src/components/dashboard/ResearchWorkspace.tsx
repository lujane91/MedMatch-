"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { Input, SearchableSelect } from "@/components/ui";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";
import type { InternProfile } from "@/data/intern";
import { getInstitution } from "@/data/journey-dashboard";
import { SAUDI_HOSPITAL_NAMES } from "@/data/saudi-hospitals";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import {
  DEMO_MEDJOURNEY_USERS,
  HEALTHCARE_FIELD_LABELS,
  JOURNEY_STAGE_LABELS,
  PARTICIPATION_TYPES,
  RESEARCH_LOCATIONS,
  RESEARCH_TYPES,
  WHO_CAN_JOIN_OPTIONS,
  researchCurrentUserId,
  researchMatchesProfile,
  toFieldLabel,
  toStageLabel,
  type HealthcareFieldLabel,
  type JourneyStageLabel,
  type ResearchProject,
  type ResearchWhoCanJoin,
} from "@/data/research";
import { cn } from "@/lib/cn";
import { useMedJourneyNotifications } from "@/lib/medjourney-notification-store";
import { useResearchStore } from "@/lib/research-store";

type ResearchView = "home" | "propose" | "browse" | "mine";

function currentUserId(profile: InternProfile) {
  return researchCurrentUserId(profile);
}

function MultiToggle<T extends string>({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: readonly T[];
  values: T[];
  onChange: (next: T[]) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-[0.8125rem] font-medium text-mm-navy">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() =>
                onChange(
                  active
                    ? values.filter((v) => v !== option)
                    : [...values, option],
                )
              }
              className={cn(
                "min-h-10 rounded-[var(--mm-radius-lg)] border px-3 text-[0.8125rem] font-medium transition-colors",
                active
                  ? "border-mm-teal bg-mm-teal-50 text-mm-teal"
                  : "border-mm-border bg-white text-mm-text-secondary",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResearchCard({
  project,
  variant = "browse",
  requestCount,
  applicationStatus,
  role,
  participantCount,
}: {
  project: ResearchProject;
  variant?: "browse" | "proposal" | "application" | "active";
  requestCount?: number;
  applicationStatus?: string;
  role?: string;
  participantCount?: number;
}) {
  const institution =
    project.institution?.trim() || project.creatorInstitution?.trim() || "";

  return (
    <Link
      href={`/research/${project.id}`}
      className="block rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3 transition-colors hover:bg-mm-gray-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-semibold text-mm-navy">
            {project.title}
          </p>
          {variant === "browse" || variant === "application" ? (
            <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
              {project.creatorName}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
          {applicationStatus || project.status}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        {project.healthcareFields[0] ? (
          <p>{project.healthcareFields[0]}</p>
        ) : null}
        {project.specialties[0] ? <p>{project.specialties[0]}</p> : null}
        {institution ? (
          <p className="font-medium text-mm-navy">{institution}</p>
        ) : null}
        {variant !== "application" ? <p>{project.location}</p> : null}
        {variant === "browse" || variant === "proposal" ? (
          <p>{project.participantsNeeded} participants needed</p>
        ) : null}
        {variant === "proposal" && typeof requestCount === "number" ? (
          <p>
            {requestCount} join request{requestCount === 1 ? "" : "s"}
          </p>
        ) : null}
        {variant === "active" && role ? <p>Role: {role}</p> : null}
        {variant === "active" && typeof participantCount === "number" ? (
          <p>
            {participantCount} participant{participantCount === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function ProposeForm({
  profile,
  onDone,
}: {
  profile: InternProfile;
  onDone: (id: string) => void;
}) {
  const { proposeResearch } = useResearchStore();
  const defaultField = toFieldLabel(profile.field);
  const defaultStage = toStageLabel(profile.trainingStage);
  const institutionDefault =
    getInstitution(profile) || profile.university || "";

  const [title, setTitle] = useState("");
  const [idea, setIdea] = useState("");
  const [fields, setFields] = useState<HealthcareFieldLabel[]>(
    defaultField ? [defaultField] : ["Medicine"],
  );
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [extraSpecialties, setExtraSpecialties] = useState("");
  const [researchType, setResearchType] = useState("");
  const [institution, setInstitution] = useState(institutionDefault);
  const [location, setLocation] = useState(profile.currentCity || "Riyadh");
  const [participationType, setParticipationType] = useState("");
  const [participantsNeeded, setParticipantsNeeded] = useState("4");
  const [whoCanJoin, setWhoCanJoin] = useState<ResearchWhoCanJoin[]>([
    defaultStage,
  ]);
  const [preferredStages, setPreferredStages] = useState<JourneyStageLabel[]>(
    defaultStage ? [defaultStage] : [],
  );
  const [optionalRequirements, setOptionalRequirements] = useState("");
  const [error, setError] = useState("");

  const specialtyOptions = useMemo(() => {
    const fromProfile = getSpecialtiesForField(profile.field);
    return Array.from(new Set([...fromProfile, ...fields.flatMap(() => [])]));
  }, [fields, profile.field]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !idea.trim() || !researchType || !participationType) {
      setError("Please complete the required fields.");
      return;
    }
    const specialties = [
      specialty.trim(),
      ...extraSpecialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    ].filter(Boolean);

    const project = proposeResearch({
      title: title.trim(),
      idea: idea.trim(),
      healthcareFields: fields.length ? fields : ["Medicine"],
      specialties: specialties.length ? specialties : ["General Medicine"],
      researchType: researchType as ResearchProject["researchType"],
      institution: institution.trim() || undefined,
      location: location.trim() || "Riyadh",
      participationType:
        participationType as ResearchProject["participationType"],
      participantsNeeded: Math.max(1, Number(participantsNeeded) || 1),
      whoCanJoin: whoCanJoin.length ? whoCanJoin : ["Resident"],
      preferredStages: preferredStages.length
        ? preferredStages
        : whoCanJoin.filter((w): w is JourneyStageLabel =>
            JOURNEY_STAGE_LABELS.includes(w as JourneyStageLabel),
          ),
      optionalRequirements: optionalRequirements.trim() || undefined,
      creatorUserId: currentUserId(profile),
      creatorName: profile.fullName.trim() || "MedJourney User",
      creatorField: defaultField,
      creatorStage: defaultStage,
      creatorSpecialty: profile.specialty || undefined,
      creatorInstitution: institutionDefault || undefined,
    });
    onDone(project.id);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Research Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
          Research Idea / Short Description
        </label>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={4}
          required
          className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-white px-3 py-2.5 text-[0.9375rem] text-mm-navy outline-none focus:border-mm-teal"
        />
      </div>
      <MultiToggle
        label="Healthcare Field"
        options={HEALTHCARE_FIELD_LABELS}
        values={fields}
        onChange={setFields}
      />
      <SearchableSelect
        label="Specialty"
        value={specialty}
        onChange={setSpecialty}
        options={specialtyOptions.length ? specialtyOptions : ["General Medicine"]}
      />
      <Input
        label="Additional specialties (optional)"
        hint="Separate with commas for multidisciplinary projects"
        value={extraSpecialties}
        onChange={(e) => setExtraSpecialties(e.target.value)}
      />
      <SearchableSelect
        label="Research Type"
        value={researchType}
        onChange={setResearchType}
        options={RESEARCH_TYPES}
        allowOther={false}
      />
      <SearchableSelect
        label="Hospital or Institution Name"
        value={institution}
        onChange={setInstitution}
        options={SAUDI_HOSPITAL_NAMES}
      />
      <SearchableSelect
        label="Location"
        value={location}
        onChange={setLocation}
        options={RESEARCH_LOCATIONS}
        allowOther={false}
      />
      <SearchableSelect
        label="Participation Type"
        value={participationType}
        onChange={setParticipationType}
        options={PARTICIPATION_TYPES}
        allowOther={false}
      />
      <Input
        label="Number of Participants Needed"
        type="number"
        min={1}
        value={participantsNeeded}
        onChange={(e) => setParticipantsNeeded(e.target.value)}
        required
      />
      <MultiToggle
        label="Who Can Join"
        options={WHO_CAN_JOIN_OPTIONS}
        values={whoCanJoin}
        onChange={setWhoCanJoin}
      />
      <MultiToggle
        label="Preferred Journey Stage or Experience Level"
        options={JOURNEY_STAGE_LABELS}
        values={preferredStages}
        onChange={setPreferredStages}
      />
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
          Optional Requirements
        </label>
        <textarea
          value={optionalRequirements}
          onChange={(e) => setOptionalRequirements(e.target.value)}
          rows={3}
          className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-white px-3 py-2.5 text-[0.9375rem] text-mm-navy outline-none focus:border-mm-teal"
        />
      </div>
      {error ? (
        <p className="text-[0.8125rem] font-medium text-red-600">{error}</p>
      ) : null}
      <button
        type="submit"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
      >
        Publish Research
      </button>
    </form>
  );
}

function BrowseResearch({ profile }: { profile: InternProfile }) {
  const { projects } = useResearchStore();
  const uid = currentUserId(profile);
  const field = toFieldLabel(profile.field);
  const stage = toStageLabel(profile.trainingStage);
  const specialty = profile.specialty?.trim() || "";

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filterField, setFilterField] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterInstitution, setFilterInstitution] = useState("");
  const [filterType, setFilterType] = useState("");

  const recommended = useMemo(() => {
    return [...projects]
      .filter((p) => p.status !== "Completed")
      .filter((p) => p.creatorUserId !== uid)
      .map((p) => ({
        project: p,
        score: researchMatchesProfile(p, field, specialty || null, stage),
      }))
      .sort((a, b) => b.score - a.score);
  }, [field, projects, specialty, stage, uid]);

  const filtered = useMemo(() => {
    return recommended.filter(({ project }) => {
      if (
        filterField &&
        !project.healthcareFields.includes(filterField as HealthcareFieldLabel)
      ) {
        return false;
      }
      if (
        filterSpecialty &&
        !project.specialties.some((s) =>
          s.toLowerCase().includes(filterSpecialty.toLowerCase()),
        )
      ) {
        return false;
      }
      if (
        filterStage &&
        !project.preferredStages.includes(filterStage as JourneyStageLabel) &&
        !project.whoCanJoin.includes(filterStage as ResearchWhoCanJoin)
      ) {
        return false;
      }
      if (
        filterLocation &&
        !project.location.toLowerCase().includes(filterLocation.toLowerCase())
      ) {
        return false;
      }
      if (filterInstitution) {
        const institution = (
          project.institution ||
          project.creatorInstitution ||
          ""
        ).toLowerCase();
        if (!institution.includes(filterInstitution.toLowerCase())) {
          return false;
        }
      }
      if (filterType && project.researchType !== filterType) return false;
      return true;
    });
  }, [
    filterField,
    filterInstitution,
    filterLocation,
    filterSpecialty,
    filterStage,
    filterType,
    recommended,
  ]);

  return (
    <div className="space-y-4">
      <p className="text-[0.875rem] text-mm-text-secondary">
        Discover research proposed by other MedJourney users.
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.875rem] text-mm-text-muted">
          {filtered.length} opportunities
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="min-h-10 shrink-0 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
        >
          Filters
        </button>
      </div>

      {filtersOpen ? (
        <div className="space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-4">
          <SearchableSelect
            label="Healthcare Field"
            value={filterField}
            onChange={setFilterField}
            options={HEALTHCARE_FIELD_LABELS}
            allowOther={false}
          />
          <Input
            label="Specialty"
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            placeholder="e.g. Internal Medicine"
          />
          <SearchableSelect
            label="Research Type"
            value={filterType}
            onChange={setFilterType}
            options={RESEARCH_TYPES}
            allowOther={false}
          />
          <SearchableSelect
            label="Hospital or Institution"
            value={filterInstitution}
            onChange={setFilterInstitution}
            options={SAUDI_HOSPITAL_NAMES}
          />
          <SearchableSelect
            label="City"
            value={filterLocation}
            onChange={setFilterLocation}
            options={RESEARCH_LOCATIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Who Can Join / Journey Stage"
            value={filterStage}
            onChange={setFilterStage}
            options={JOURNEY_STAGE_LABELS}
            allowOther={false}
          />
          <button
            type="button"
            onClick={() => {
              setFilterField("");
              setFilterSpecialty("");
              setFilterStage("");
              setFilterLocation("");
              setFilterInstitution("");
              setFilterType("");
            }}
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <ul className="space-y-3">
        {filtered.map(({ project }) => (
          <li key={project.id}>
            <ResearchCard project={project} variant="browse" />
          </li>
        ))}
      </ul>
      {filtered.length === 0 ? (
        <p className="text-center text-[0.875rem] text-mm-text-muted">
          No research matches these filters.
        </p>
      ) : null}
    </div>
  );
}

function applicationStatusLabel(status: string) {
  if (status === "Pending") return "Request Sent";
  if (status === "Accepted") return "Accepted";
  if (status === "Declined") return "Declined";
  return status;
}

function MyResearch({ profile }: { profile: InternProfile }) {
  const { projects, requests, invites } = useResearchStore();
  const { notifications, markRead } = useMedJourneyNotifications();
  const uid = currentUserId(profile);
  const [tab, setTab] = useState<
    "proposals" | "applications" | "active" | "completed"
  >("proposals");

  const owned = useMemo(
    () => projects.filter((p) => p.creatorUserId === uid),
    [projects, uid],
  );

  const myApplications = useMemo(
    () =>
      requests
        .filter((r) => r.requesterUserId === uid)
        .map((r) => ({
          request: r,
          project: projects.find((p) => p.id === r.researchId),
        }))
        .filter(
          (
            item,
          ): item is {
            request: (typeof requests)[number];
            project: ResearchProject;
          } => Boolean(item.project),
        ),
    [projects, requests, uid],
  );

  const myAcceptedInvites = useMemo(
    () =>
      invites.filter(
        (i) => i.inviteeUserId === uid && i.status === "Accepted",
      ),
    [invites, uid],
  );

  const activeItems = useMemo(() => {
    const fromOwned = owned
      .filter((p) => p.status === "Active")
      .map((p) => ({ project: p, role: "Creator" as const }));
    const fromAcceptedRequests = myApplications
      .filter(
        (item) =>
          item.request.status === "Accepted" &&
          item.project.status !== "Completed",
      )
      .map((item) => ({
        project: item.project,
        role: "Participant" as const,
      }));
    const fromInvites = myAcceptedInvites
      .map((invite) => projects.find((p) => p.id === invite.researchId))
      .filter((p): p is ResearchProject => Boolean(p) && p!.status !== "Completed")
      .map((p) => ({ project: p, role: "Participant" as const }));

    const map = new Map<string, { project: ResearchProject; role: string }>();
    for (const item of [...fromOwned, ...fromAcceptedRequests, ...fromInvites]) {
      if (!map.has(item.project.id)) map.set(item.project.id, item);
    }
    return Array.from(map.values());
  }, [myAcceptedInvites, myApplications, owned, projects]);

  const completedItems = useMemo(() => {
    const fromOwned = owned.filter((p) => p.status === "Completed");
    const fromParticipation = myApplications
      .filter(
        (item) =>
          item.request.status === "Accepted" &&
          item.project.status === "Completed",
      )
      .map((item) => item.project);
    const map = new Map<string, ResearchProject>();
    for (const p of [...fromOwned, ...fromParticipation]) {
      map.set(p.id, p);
    }
    return Array.from(map.values());
  }, [myApplications, owned]);

  const researchActivity = useMemo(
    () => notifications.filter((n) => n.category === "research").slice(0, 8),
    [notifications],
  );

  const tabs = [
    { id: "proposals" as const, label: "My Proposals" },
    { id: "applications" as const, label: "My Applications" },
    { id: "active" as const, label: "Active" },
    { id: "completed" as const, label: "Completed" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "min-h-10 shrink-0 rounded-[var(--mm-radius-lg)] px-3 text-[0.8125rem] font-semibold",
              tab === item.id
                ? "bg-mm-teal text-white"
                : "border border-mm-border text-mm-navy",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "proposals" ? (
        <div className="space-y-3">
          {owned.length === 0 ? (
            <p className="text-[0.875rem] text-mm-text-muted">
              You have not proposed research yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {owned.map((project) => {
                const joinRequests = requests.filter(
                  (r) => r.researchId === project.id,
                );
                return (
                  <li key={project.id}>
                    <ResearchCard
                      project={project}
                      variant="proposal"
                      requestCount={joinRequests.length}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "applications" ? (
        <div className="space-y-3">
          {myApplications.length === 0 ? (
            <p className="text-[0.875rem] text-mm-text-muted">
              You have not requested to join any research yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {myApplications.map(({ project, request }) => (
                <li key={request.id}>
                  <ResearchCard
                    project={project}
                    variant="application"
                    applicationStatus={applicationStatusLabel(request.status)}
                  />
                  <p className="mt-1 px-1 text-[0.75rem] text-mm-text-muted">
                    Requested {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "active" ? (
        <div className="space-y-3">
          {activeItems.length === 0 ? (
            <p className="text-[0.875rem] text-mm-text-muted">
              No active research yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {activeItems.map(({ project, role }) => {
                const acceptedCount = requests.filter(
                  (r) =>
                    r.researchId === project.id && r.status === "Accepted",
                ).length;
                return (
                  <li key={project.id}>
                    <ResearchCard
                      project={project}
                      variant="active"
                      role={role}
                      participantCount={acceptedCount + 1}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "completed" ? (
        <div className="space-y-3">
          {completedItems.length === 0 ? (
            <p className="text-[0.875rem] text-mm-text-muted">
              No completed research yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {completedItems.map((project) => (
                <li key={project.id}>
                  <ResearchCard project={project} variant="proposal" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-4">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
          Research Activity
        </h3>
        <p className="mt-1 text-[0.75rem] text-mm-text-muted">
          Prototype notifications for research requests, invitations, and
          status updates.
        </p>
        {researchActivity.length === 0 ? (
          <p className="mt-3 text-[0.875rem] text-mm-text-muted">
            No research activity yet.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {researchActivity.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.actionHref}
                  onClick={() => markRead(item.id)}
                  className="block rounded-[var(--mm-radius-md)] px-2 py-2 hover:bg-mm-gray-50"
                >
                  <p className="text-[0.8125rem] font-semibold text-mm-navy">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-mm-text-secondary">
                    {item.message}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export function ResearchWorkspace({
  profile,
  compact = false,
}: {
  profile: InternProfile;
  compact?: boolean;
}) {
  const { projects, requests, pendingRequestsForCreator, hydrated } =
    useResearchStore();
  const uid = currentUserId(profile);
  const [view, setView] = useState<ResearchView>("home");

  const ownedCount = projects.filter(
    (p) =>
      p.creatorUserId === uid ||
      (profile.fullName.trim() &&
        p.creatorName.toLowerCase() === profile.fullName.trim().toLowerCase()),
  ).length;
  const pending = pendingRequestsForCreator(uid).length;
  const activeCount = projects.filter(
    (p) =>
      p.status === "Active" &&
      (p.creatorUserId === uid ||
        requests.some(
          (r) =>
            r.researchId === p.id &&
            r.requesterUserId === uid &&
            r.status === "Accepted",
        )),
  ).length;
  const opportunityCount = projects.filter(
    (p) => p.status !== "Completed" && p.creatorUserId !== uid,
  ).length;

  if (!hydrated) {
    return <p className="text-mm-text-muted">Loading research…</p>;
  }

  if (compact) {
    return (
      <DashboardSection
        id="research"
        title="Research"
        action={
          <Link
            href="/research"
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Open
          </Link>
        }
      >
        <StatGrid
          items={[
            { label: "Research Opportunities", value: String(opportunityCount) },
            { label: "Requests", value: String(pending) },
            { label: "Active Research", value: String(activeCount || ownedCount) },
          ]}
        />
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
          Propose research, browse opportunities, and manage participation
          requests.
        </p>
      </DashboardSection>
    );
  }

  return (
    <div className="space-y-5">
      {view === "home" ? (
        <>
          <DashboardSection title="Research">
            <StatGrid
              items={[
                {
                  label: "Research Opportunities",
                  value: String(opportunityCount),
                },
                { label: "Requests", value: String(pending) },
                {
                  label: "Active Research",
                  value: String(activeCount || ownedCount),
                },
              ]}
            />
            <p className="mt-4 text-[0.875rem] text-mm-text-secondary">
              Shared across all Journey Stages. Recommendations adapt to your
              field, specialty, and stage.
            </p>
          </DashboardSection>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setView("propose")}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left shadow-mm-sm transition-colors hover:border-mm-teal"
            >
              <p className="text-[1.0625rem] font-semibold text-mm-navy">
                Propose Research
              </p>
              <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                Create a research opportunity for others to join.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setView("browse")}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left shadow-mm-sm transition-colors hover:border-mm-teal"
            >
              <p className="text-[1.0625rem] font-semibold text-mm-navy">
                Browse Research
              </p>
              <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                Discover research proposed by other MedJourney users.
              </p>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setView("mine")}
            className="w-full rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left shadow-mm-sm"
          >
            <p className="text-[1.0625rem] font-semibold text-mm-navy">
              My Research
            </p>
            <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
              Manage your proposals, join requests, and active participation.
            </p>
          </button>
        </>
      ) : null}

      {view !== "home" ? (
        <button
          type="button"
          onClick={() => setView("home")}
          className="text-[0.875rem] font-semibold text-mm-teal"
        >
          Back to Research
        </button>
      ) : null}

      {view === "propose" ? (
        <DashboardSection title="Propose Research">
          <ProposeForm
            profile={profile}
            onDone={() => setView("mine")}
          />
        </DashboardSection>
      ) : null}

      {view === "browse" ? (
        <DashboardSection title="Browse Research">
          <BrowseResearch profile={profile} />
        </DashboardSection>
      ) : null}

      {view === "mine" ? (
        <DashboardSection title="My Research">
          <MyResearch profile={profile} />
        </DashboardSection>
      ) : null}
    </div>
  );
}

export { researchCurrentUserId as currentUserId };
