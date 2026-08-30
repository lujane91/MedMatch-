"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input, SearchableSelect } from "@/components/ui";
import {
  DEMO_MEDJOURNEY_USERS,
  JOURNEY_STAGE_LABELS,
  HEALTHCARE_FIELD_LABELS,
  researchCurrentUserId,
  toFieldLabel,
  toStageLabel,
} from "@/data/research";
import { getInstitution } from "@/data/journey-dashboard";
import { useInternStore } from "@/lib/intern-store";
import { useResearchStore } from "@/lib/research-store";
import { cn } from "@/lib/cn";

export function ResearchDetailClient({ researchId }: { researchId: string }) {
  const { profile, hydrated: profileHydrated } = useInternStore();
  const {
    hydrated,
    projects,
    requests,
    invites,
    requestToJoin,
    respondToRequest,
    inviteParticipant,
    respondToInvite,
  } = useResearchStore();

  const project = projects.find((p) => p.id === researchId);
  const uid = researchCurrentUserId(profile);
  const isCreator =
    !!project &&
    (project.creatorUserId === uid ||
      (profile.fullName.trim() &&
        project.creatorName.toLowerCase() ===
          profile.fullName.trim().toLowerCase()));

  const projectRequests = requests.filter((r) => r.researchId === researchId);
  const pendingRequests = projectRequests.filter((r) => r.status === "Pending");
  const myRequest = projectRequests.find((r) => r.requesterUserId === uid);
  const myInvite = invites.find(
    (i) => i.researchId === researchId && i.inviteeUserId === uid,
  );

  const [message, setMessage] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteField, setInviteField] = useState("");
  const [inviteSpecialty, setInviteSpecialty] = useState("");
  const [inviteStage, setInviteStage] = useState("");
  const [inviteSentName, setInviteSentName] = useState("");

  const inviteCandidates = useMemo(() => {
    return DEMO_MEDJOURNEY_USERS.filter((user) => {
      if (user.id === uid) return false;
      if (isCreator && user.name === project?.creatorName) return false;
      if (inviteField && user.healthcareField !== inviteField) return false;
      if (
        inviteSpecialty &&
        !(user.specialty || "")
          .toLowerCase()
          .includes(inviteSpecialty.toLowerCase())
      ) {
        return false;
      }
      if (inviteStage && user.journeyStage !== inviteStage) return false;
      return true;
    });
  }, [inviteField, inviteSpecialty, inviteStage, isCreator, project?.creatorName, uid]);

  if (!hydrated || !profileHydrated) {
    return (
      <AppShell title="Research">
        <p className="text-mm-text-muted">Loading…</p>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell title="Research">
        <div className="mx-auto max-w-3xl space-y-4">
          <p className="text-mm-text-secondary">Research project not found.</p>
          <Link href="/research" className="font-semibold text-mm-teal">
            Back to Research
          </Link>
        </div>
      </AppShell>
    );
  }

  function handleRequestJoin() {
    const result = requestToJoin({
      researchId: project!.id,
      requesterUserId: uid,
      requesterName: profile.fullName.trim() || "MedJourney User",
      healthcareField: toFieldLabel(profile.field),
      journeyStage: toStageLabel(profile.trainingStage),
      specialty: profile.specialty || undefined,
      institution: getInstitution(profile) || undefined,
      message: message.trim() || undefined,
    });
    if (result) setRequestSent(true);
  }

  function addDemoRequest() {
    const demo =
      DEMO_MEDJOURNEY_USERS.find((u) => u.id === "demo-user-layla") ||
      DEMO_MEDJOURNEY_USERS[0];
    requestToJoin({
      researchId: project!.id,
      requesterUserId: demo.id,
      requesterName: demo.name,
      healthcareField: demo.healthcareField,
      journeyStage: demo.journeyStage,
      specialty: demo.specialty,
      institution: demo.institution,
      message:
        "I'm interested in participating in this research and have previous experience with data collection.",
    });
  }

  return (
    <AppShell title="Research">
      <div className="mx-auto max-w-3xl space-y-5 pb-24 lg:pb-8">
        <Link href="/research" className="text-[0.875rem] font-semibold text-mm-teal">
          Back to Research
        </Link>

        <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-[1.25rem] font-semibold tracking-tight text-mm-navy">
                {project.title}
              </h1>
              <p className="mt-2 text-[0.875rem] text-mm-text-secondary">
                {project.creatorName}
                {project.creatorSpecialty ? ` · ${project.creatorSpecialty}` : ""}
              </p>
            </div>
            <span className="rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
              {project.status}
            </span>
          </div>

          <p className="mt-4 text-[0.9375rem] leading-relaxed text-mm-text-secondary">
            {project.idea}
          </p>

          <dl className="mt-5 grid gap-3 text-[0.8125rem] sm:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Healthcare Field
              </dt>
              <dd className="mt-1 text-mm-navy">
                {project.healthcareFields.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Specialty
              </dt>
              <dd className="mt-1 text-mm-navy">
                {project.specialties.join(", ")}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Research Type
              </dt>
              <dd className="mt-1 text-mm-navy">{project.researchType}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Location
              </dt>
              <dd className="mt-1 text-mm-navy">{project.location}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Participation
              </dt>
              <dd className="mt-1 text-mm-navy">{project.participationType}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Participants Needed
              </dt>
              <dd className="mt-1 text-mm-navy">{project.participantsNeeded}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Who Can Join
              </dt>
              <dd className="mt-1 text-mm-navy">
                {project.whoCanJoin.join(", ")}
              </dd>
            </div>
            {project.institution ? (
              <div className="sm:col-span-2">
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Institution
                </dt>
                <dd className="mt-1 text-mm-navy">{project.institution}</dd>
              </div>
            ) : null}
            {project.optionalRequirements ? (
              <div className="sm:col-span-2">
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Optional Requirements
                </dt>
                <dd className="mt-1 text-mm-navy">
                  {project.optionalRequirements}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        {!isCreator ? (
          <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm">
            <h2 className="text-[1.0625rem] font-semibold text-mm-navy">
              Request to Join
            </h2>
            {requestSent || myRequest ? (
              <p className="mt-3 text-[0.9375rem] font-medium text-mm-teal">
                {myRequest?.status === "Accepted"
                  ? "Request accepted"
                  : myRequest?.status === "Declined"
                    ? "Request declined"
                    : "Request Sent"}
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
                    Optional message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="I'm interested in participating in this research and have previous experience with data collection."
                    className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-2.5 text-[0.9375rem] outline-none focus:border-mm-teal"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRequestJoin}
                  className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white"
                >
                  Request to Join
                </button>
              </div>
            )}

            {myInvite && myInvite.status === "Pending" ? (
              <div className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-4">
                <p className="text-[0.875rem] font-medium text-mm-navy">
                  You received a research invitation
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => respondToInvite(myInvite.id, "Accepted")}
                    className="min-h-10 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
                  >
                    Accept Invitation
                  </button>
                  <button
                    type="button"
                    onClick={() => respondToInvite(myInvite.id, "Declined")}
                    className="min-h-10 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.8125rem] font-semibold text-mm-navy"
                  >
                    Decline Invitation
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {isCreator ? (
          <>
            <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[1.0625rem] font-semibold text-mm-navy">
                  Participation Requests
                </h2>
                <button
                  type="button"
                  onClick={addDemoRequest}
                  className="text-[0.75rem] font-semibold text-mm-teal"
                >
                  Add demo request
                </button>
              </div>
              {pendingRequests.length === 0 ? (
                <p className="mt-3 text-[0.875rem] text-mm-text-muted">
                  No pending requests.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {pendingRequests.map((req) => (
                    <li
                      key={req.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-mm-teal-50 text-[0.8125rem] font-semibold text-mm-teal">
                          {req.requesterName
                            .split(" ")
                            .map((p) => p[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-mm-navy">
                            {req.requesterName}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            {req.healthcareField} · {req.journeyStage}
                          </p>
                          {req.specialty ? (
                            <p className="text-[0.8125rem] text-mm-text-muted">
                              {req.specialty}
                            </p>
                          ) : null}
                          {req.institution ? (
                            <p className="text-[0.8125rem] text-mm-text-muted">
                              {req.institution}
                            </p>
                          ) : null}
                          {req.message ? (
                            <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                              {req.message}
                            </p>
                          ) : null}
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                respondToRequest(req.id, "Accepted")
                              }
                              className="min-h-10 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                respondToRequest(req.id, "Declined")
                              }
                              className="min-h-10 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.8125rem] font-semibold text-mm-navy"
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[1.0625rem] font-semibold text-mm-navy">
                  Invite Participants
                </h2>
                <button
                  type="button"
                  onClick={() => setInviteOpen((v) => !v)}
                  className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
                >
                  {inviteOpen ? "Hide" : "Browse"}
                </button>
              </div>

              {inviteSentName ? (
                <p className="mt-3 text-[0.875rem] font-medium text-mm-teal">
                  Invitation sent to {inviteSentName}
                </p>
              ) : null}

              {inviteOpen ? (
                <div className="mt-4 space-y-3">
                  <SearchableSelect
                    label="Healthcare Field"
                    value={inviteField}
                    onChange={setInviteField}
                    options={HEALTHCARE_FIELD_LABELS}
                    allowOther={false}
                  />
                  <Input
                    label="Specialty"
                    value={inviteSpecialty}
                    onChange={(e) => setInviteSpecialty(e.target.value)}
                  />
                  <SearchableSelect
                    label="Journey Stage"
                    value={inviteStage}
                    onChange={setInviteStage}
                    options={JOURNEY_STAGE_LABELS}
                    allowOther={false}
                  />
                  <ul className="space-y-2">
                    {inviteCandidates.map((user) => (
                      <li
                        key={user.id}
                        className="flex items-center justify-between gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-mm-navy">
                            {user.name}
                          </p>
                          <p className="text-[0.8125rem] text-mm-text-secondary">
                            {user.healthcareField} · {user.journeyStage}
                            {user.specialty ? ` · ${user.specialty}` : ""}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            inviteParticipant({
                              researchId: project.id,
                              inviteeUserId: user.id,
                              inviteeName: user.name,
                              inviteeField: user.healthcareField,
                              inviteeStage: user.journeyStage,
                              inviteeSpecialty: user.specialty,
                            });
                            setInviteSentName(user.name);
                          }}
                          className={cn(
                            "shrink-0 min-h-10 rounded-[var(--mm-radius-lg)] bg-mm-teal px-3 text-[0.8125rem] font-semibold text-white",
                          )}
                        >
                          Send Invitation
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
