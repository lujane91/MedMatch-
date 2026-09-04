"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { CircularProgress } from "@/components/profile/CircularProgress";
import { Input, SearchableSelect } from "@/components/ui";
import {
  composeFullName,
  fieldLabel,
  professionalLevelLabel,
  trainingStageLabel,
  type InternProfile,
} from "@/data/intern";
import { NATIONALITY_COUNTRIES } from "@/data/countries";
import {
  computeProfileCompleteness,
  EDUCATION_LEVELS,
  PROFILE_COURSE_TYPE_OPTIONS,
  PROFILE_RESEARCH_ROLES,
  PROFILE_RESEARCH_TYPES,
  PROFILE_TRAINING_TYPES,
  sourceLabel,
  type EducationLevel,
  type ProfileCourseEntry,
  type ProfileEducationEntry,
  type ProfileResearchEntry,
  type ProfileResearchRole,
  type ProfileResearchType,
  type ProfileTrainingEntry,
  type ProfileTrainingType,
} from "@/data/profile-enrichment";
import { getInstitution, resolveStage } from "@/data/journey-dashboard";
import { researchCurrentUserId } from "@/data/research";
import { trainingTypeLabel } from "@/data/training-applications";
import { cn } from "@/lib/cn";
import { useCourseStore } from "@/lib/course-store";
import { useInternStore } from "@/lib/intern-store";
import { useProfileEnrichment } from "@/lib/profile-enrichment-store";
import { useResearchStore } from "@/lib/research-store";
import { useTrainingApplications } from "@/lib/training-application-store";

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "MJ"
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div>
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
        {label}
      </p>
      <p className="mt-1 text-[0.9375rem] text-mm-navy">{value}</p>
    </div>
  );
}

function SourceBadge({
  source,
  verified,
}: {
  source: "user" | "medjourney";
  verified: boolean;
}) {
  const label = sourceLabel(source, verified);
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-[0.6875rem] font-semibold",
        verified
          ? "bg-mm-teal-50 text-mm-teal-700"
          : source === "medjourney"
            ? "bg-mm-gray-50 text-mm-navy"
            : "bg-mm-gray-50 text-mm-text-muted",
      )}
    >
      {label}
    </span>
  );
}

function CollapsibleSection({
  id,
  title,
  description,
  count,
  defaultOpen = false,
  onAdd,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  count?: number;
  defaultOpen?: boolean;
  onAdd?: () => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section
      id={id}
      key={`${id}-${defaultOpen ? "open" : "closed"}`}
      className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm"
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-[1.0625rem] font-semibold text-mm-navy">
              {title}
            </h2>
            {typeof count === "number" ? (
              <span className="rounded-full bg-mm-gray-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-mm-text-muted">
                {count}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
              {description}
            </p>
          ) : null}
        </button>
        <div className="flex shrink-0 items-center gap-2">
          {onAdd ? (
            <button
              type="button"
              onClick={onAdd}
              className="min-h-9 rounded-[var(--mm-radius-md)] bg-mm-teal-50 px-3 text-[0.8125rem] font-semibold text-mm-teal-700"
            >
              Add
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="min-h-9 rounded-[var(--mm-radius-md)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-mm-border px-4 py-4 sm:px-5">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function journeyRows(profile: InternProfile) {
  const stage = resolveStage(profile.trainingStage);
  const rows: { label: string; value: string }[] = [
    { label: "Healthcare Field", value: fieldLabel(profile.field) },
    {
      label: "Journey Path",
      value: trainingStageLabel(stage).replace("Medical Student", "Student"),
    },
  ];

  if (stage === "medical-student" || stage === "intern") {
    rows.push({
      label: "University Name",
      value: profile.university || getInstitution(profile),
    });
    if (profile.currentYear.trim()) {
      rows.push({
        label:
          stage === "medical-student"
            ? "Current Academic Year"
            : "Current Internship Year",
        value: profile.currentYear,
      });
    }
    if (profile.totalYears.trim()) {
      rows.push({
        label:
          stage === "medical-student"
            ? "Total Academic Years"
            : "Total Internship Years",
        value: profile.totalYears,
      });
    }
  }

  if (stage === "resident" || stage === "fellow" || stage === "advanced-training") {
    rows.push({
      label: "Hospital or University Name",
      value: profile.trainingInstitution || getInstitution(profile),
    });
    rows.push({ label: "Specialty", value: profile.specialty });
    if (stage === "fellow" || profile.subspecialty.trim()) {
      rows.push({ label: "Subspecialty", value: profile.subspecialty });
    }
    if (profile.currentYear.trim()) {
      rows.push({
        label:
          stage === "resident"
            ? "Current Residency Year"
            : stage === "fellow"
              ? "Current Fellowship Year"
              : "Current Training Year",
        value: profile.currentYear,
      });
    }
    if (profile.totalYears.trim()) {
      rows.push({
        label:
          stage === "resident"
            ? "Total Residency Years"
            : stage === "fellow"
              ? "Total Fellowship Years"
              : "Total Training Years",
        value: profile.totalYears,
      });
    }
  }

  if (stage === "medical-practice") {
    const level = professionalLevelLabel(profile.professionalLevel);
    if (level) rows.push({ label: "Professional Level", value: level });
    rows.push({
      label: "Hospital or University Name",
      value: profile.trainingInstitution || getInstitution(profile),
    });
    rows.push({ label: "Specialty", value: profile.specialty });
    if (profile.subspecialty.trim()) {
      rows.push({ label: "Subspecialty", value: profile.subspecialty });
    }
  }

  return rows.filter((r) => r.value.trim());
}

export function ProfilePageClient() {
  const { profile, hydrated, updateProfile } = useInternStore();
  const enrichment = useProfileEnrichment();
  const { projects, requests, hydrated: researchHydrated } = useResearchStore();
  const { courses: mjCourses, savedIds, hydrated: coursesHydrated } =
    useCourseStore();
  const { applications, hydrated: trainingHydrated } =
    useTrainingApplications();

  const [mode, setMode] = useState<"view" | "edit-personal" | "complete">(
    "view",
  );
  const [personalDraft, setPersonalDraft] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    mobile: "",
    email: "",
    institutionEmail: "",
    photoDataUrl: "",
  });
  const [adding, setAdding] = useState<
    null | "education" | "research" | "courses" | "certifications" | "training"
  >(null);
  const [savedMsg, setSavedMsg] = useState("");

  const stage = resolveStage(profile.trainingStage);
  const uid = researchCurrentUserId(profile);

  const medJourneyResearch = useMemo(() => {
    if (!researchHydrated) return [] as ProfileResearchEntry[];
    const owned = projects.filter((p) => p.creatorUserId === uid);
    const accepted = requests
      .filter((r) => r.requesterUserId === uid && r.status === "Accepted")
      .map((r) => projects.find((p) => p.id === r.researchId))
      .filter(Boolean);
    const map = new Map<string, ProfileResearchEntry>();
    for (const p of [...owned, ...accepted]) {
      if (!p) continue;
      map.set(p.id, {
        id: `mj_res_${p.id}`,
        title: p.title,
        researchType: "Clinical Research",
        role: p.creatorUserId === uid ? "Principal Investigator" : "Participant",
        healthcareField: p.healthcareFields[0],
        specialty: p.specialties[0],
        institution: p.institution || p.creatorInstitution,
        startDate: p.createdAt.slice(0, 10),
        status: p.status === "Completed" ? "Completed" : "Ongoing",
        description: p.idea,
        source: "medjourney",
        verified: false,
        linkedMedJourneyId: p.id,
      });
    }
    return Array.from(map.values());
  }, [projects, requests, researchHydrated, uid]);

  const medJourneyCourses = useMemo(() => {
    if (!coursesHydrated) return [] as ProfileCourseEntry[];
    return mjCourses
      .filter((c) => savedIds.includes(c.id))
      .map(
        (c): ProfileCourseEntry => ({
          id: `mj_crs_${c.id}`,
          name: c.title,
          provider: c.provider,
          institution: c.institution,
          city: c.city,
          country: c.country,
          startDate: c.startDate,
          endDate: c.endDate,
          courseType: c.courseType,
          certificateAvailable: Boolean(c.certification),
          source: "medjourney",
          verified: false,
          linkedMedJourneyId: c.id,
        }),
      );
  }, [coursesHydrated, mjCourses, savedIds]);

  const medJourneyTraining = useMemo(() => {
    if (!trainingHydrated) return [] as ProfileTrainingEntry[];
    return applications
      .filter(
        (a) =>
          a.applicationStatus === "Accepted" ||
          a.applicationStatus === "Completed",
      )
      .map((a): ProfileTrainingEntry => {
        const typeLabel = trainingTypeLabel(a.trainingType);
        const mappedType: ProfileTrainingType =
          typeLabel === "Summer Elective"
            ? "Summer Elective"
            : typeLabel === "Internship Rotation"
              ? "Internship Rotation"
              : typeLabel === "External Rotation"
                ? "External Rotation"
                : "Other";
        return {
          id: `mj_trn_${a.id}`,
          trainingType: mappedType,
          hospital: a.hospital,
          departmentOrSpecialty: a.specialty,
          city: a.city,
          country: "Saudi Arabia",
          startDate: a.startDate,
          endDate: a.endDate,
          description: `${typeLabel} · ${a.applicationStatus}`,
          source: "medjourney",
          verified: a.stampEarned === true,
          linkedMedJourneyId: a.id,
        };
      });
  }, [applications, trainingHydrated]);

  const allEducation = enrichment.education;
  const allResearch = useMemo(() => {
    const userIds = new Set(
      enrichment.research
        .map((r) => r.linkedMedJourneyId)
        .filter(Boolean),
    );
    return [
      ...enrichment.research,
      ...medJourneyResearch.filter((r) => !userIds.has(r.linkedMedJourneyId)),
    ];
  }, [enrichment.research, medJourneyResearch]);

  const allCourses = useMemo(() => {
    const linked = new Set(
      enrichment.courses.map((c) => c.linkedMedJourneyId).filter(Boolean),
    );
    return [
      ...enrichment.courses,
      ...medJourneyCourses.filter((c) => !linked.has(c.linkedMedJourneyId)),
    ];
  }, [enrichment.courses, medJourneyCourses]);

  const allTraining = useMemo(() => {
    const linked = new Set(
      enrichment.training.map((t) => t.linkedMedJourneyId).filter(Boolean),
    );
    return [
      ...enrichment.training,
      ...medJourneyTraining.filter((t) => !linked.has(t.linkedMedJourneyId)),
    ];
  }, [enrichment.training, medJourneyTraining]);

  const completeness = useMemo(
    () =>
      computeProfileCompleteness({
        profile,
        educationCount: allEducation.length,
        researchCount: allResearch.length,
        coursesCount: allCourses.length,
        certificationsCount: enrichment.certifications.length,
        trainingCount: allTraining.length,
      }),
    [
      allCourses.length,
      allEducation.length,
      allResearch.length,
      allTraining.length,
      enrichment.certifications.length,
      profile,
    ],
  );

  const displayName =
    composeFullName(profile.firstName, profile.middleName, profile.lastName) ||
    profile.fullName ||
    "MedJourney Member";

  function startPersonalEdit() {
    setPersonalDraft({
      firstName: profile.firstName || profile.fullName.split(/\s+/)[0] || "",
      middleName: profile.middleName || "",
      lastName:
        profile.lastName ||
        profile.fullName.split(/\s+/).slice(-1)[0] ||
        "",
      dateOfBirth: profile.dateOfBirth || "",
      nationality: profile.nationality || "",
      mobile: profile.mobile || "",
      email: profile.email || "",
      institutionEmail: profile.institutionEmail || "",
      photoDataUrl: profile.photoDataUrl || "",
    });
    setMode("edit-personal");
    setSavedMsg("");
  }

  function savePersonal(e: FormEvent) {
    e.preventDefault();
    const fullName = composeFullName(
      personalDraft.firstName,
      personalDraft.middleName,
      personalDraft.lastName,
    );
    updateProfile({
      firstName: personalDraft.firstName.trim(),
      middleName: personalDraft.middleName.trim(),
      lastName: personalDraft.lastName.trim(),
      fullName: fullName || profile.fullName,
      dateOfBirth: personalDraft.dateOfBirth,
      nationality: personalDraft.nationality,
      mobile: personalDraft.mobile.trim(),
      email: personalDraft.email.trim(),
      institutionEmail: personalDraft.institutionEmail.trim(),
      photoDataUrl: personalDraft.photoDataUrl,
      photoUploaded: Boolean(personalDraft.photoDataUrl) || profile.photoUploaded,
    });
    setMode("view");
    setSavedMsg("Profile updated.");
  }

  function onPhotoChange(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPersonalDraft((prev) => ({ ...prev, photoDataUrl: result }));
    };
    reader.readAsDataURL(file);
  }

  if (!hydrated || !enrichment.hydrated) {
    return (
      <AppShell title="Profile">
        <p className="text-mm-text-muted">Loading your profile…</p>
      </AppShell>
    );
  }

  const identityLabel =
    profile.identityType === "national-id"
      ? "National ID Number"
      : profile.identityType === "iqama"
        ? "Iqama Number"
        : profile.identityType === "passport"
          ? "Passport Number"
          : "";

  const identityValue =
    profile.identityType === "passport"
      ? profile.passportNumber
      : profile.nationalId;

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-2xl space-y-5 pb-24 lg:pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal">
              My Profile
            </p>
            <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-[clamp(1.5rem,4vw,2rem)] tracking-[-0.02em] text-mm-navy">
              Your information
            </h1>
          </div>
          <Link
            href="/passport"
            className="inline-flex min-h-10 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
          >
            My MedJourney Passport
          </Link>
        </div>

        <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm">
          <div className="flex flex-wrap items-start gap-4">
            {profile.photoDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.photoDataUrl}
                alt=""
                className="h-16 w-16 rounded-[1.15rem] object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.15rem] bg-mm-navy text-[1.125rem] font-semibold text-white">
                {initialsFromName(displayName)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[1.0625rem] font-semibold text-mm-navy">
                {displayName}
              </p>
              <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
                {[
                  trainingStageLabel(stage).replace(
                    "Medical Student",
                    "Student",
                  ),
                  fieldLabel(profile.field),
                  profile.specialty,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {profile.identityVerified ? (
                <p className="mt-2 text-[0.75rem] font-semibold text-mm-teal-700">
                  Identity verified
                </p>
              ) : null}
            </div>
            <div className="shrink-0">
              <CircularProgress
                value={completeness.percent}
                size={88}
                strokeWidth={8}
                label="Profile"
              />
            </div>
          </div>

          <div className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-4">
            <p className="text-[0.9375rem] font-semibold text-mm-navy">
              {completeness.isComplete
                ? "Your profile looks complete"
                : "Complete your profile"}
            </p>
            <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
              {completeness.isComplete
                ? "You can still edit education, research, courses, and experience anytime."
                : "Add your education, research, courses and professional experience."}
            </p>
            <p className="mt-2 text-[0.8125rem] text-mm-text-muted">
              Profile {completeness.percent}% complete
            </p>
            <button
              type="button"
              onClick={() => {
                setMode("complete");
                setSavedMsg("");
              }}
              className="mt-3 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
            >
              {completeness.isComplete ? "Edit Profile" : "Complete Your Profile"}
            </button>
          </div>

          {savedMsg ? (
            <p className="mt-3 text-[0.8125rem] font-medium text-mm-teal-700">
              {savedMsg}
            </p>
          ) : null}
        </section>

        {mode === "edit-personal" ? (
          <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm">
            <h2 className="text-[1.0625rem] font-semibold text-mm-navy">
              Personal Details
            </h2>
            <form className="mt-4 space-y-4" onSubmit={savePersonal}>
              <div>
                <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
                  Profile Photo
                </label>
                {personalDraft.photoDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={personalDraft.photoDataUrl}
                    alt=""
                    className="mb-2 h-16 w-16 rounded-[1rem] object-cover"
                  />
                ) : null}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onPhotoChange(e.target.files?.[0] || null)}
                  className="block w-full text-[0.8125rem]"
                />
              </div>
              <Input
                label="First Name"
                value={personalDraft.firstName}
                onChange={(e) =>
                  setPersonalDraft((p) => ({ ...p, firstName: e.target.value }))
                }
                required
              />
              <Input
                label="Middle Name"
                value={personalDraft.middleName}
                onChange={(e) =>
                  setPersonalDraft((p) => ({ ...p, middleName: e.target.value }))
                }
              />
              <Input
                label="Last Name"
                value={personalDraft.lastName}
                onChange={(e) =>
                  setPersonalDraft((p) => ({ ...p, lastName: e.target.value }))
                }
                required
              />
              <Input
                label="Date of Birth"
                type="date"
                value={personalDraft.dateOfBirth}
                onChange={(e) =>
                  setPersonalDraft((p) => ({
                    ...p,
                    dateOfBirth: e.target.value,
                  }))
                }
              />
              <SearchableSelect
                label="Nationality"
                value={personalDraft.nationality}
                onChange={(v) =>
                  setPersonalDraft((p) => ({ ...p, nationality: v }))
                }
                options={NATIONALITY_COUNTRIES}
                allowOther={false}
              />
              <Input
                label="Mobile Number"
                value={personalDraft.mobile}
                onChange={(e) =>
                  setPersonalDraft((p) => ({ ...p, mobile: e.target.value }))
                }
              />
              <Input
                label="Personal Email"
                type="email"
                value={personalDraft.email}
                onChange={(e) =>
                  setPersonalDraft((p) => ({ ...p, email: e.target.value }))
                }
              />
              <Input
                label="Institutional Email"
                type="email"
                value={personalDraft.institutionEmail}
                onChange={(e) =>
                  setPersonalDraft((p) => ({
                    ...p,
                    institutionEmail: e.target.value,
                  }))
                }
              />
              <p className="text-[0.8125rem] text-mm-text-muted">
                Identity numbers stay with your current verification status and
                are not freely overwritten here.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white"
                >
                  Save Personal Details
                </button>
                <button
                  type="button"
                  onClick={() => setMode("view")}
                  className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border px-5 text-[0.875rem] font-semibold text-mm-navy"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : null}

        {mode !== "edit-personal" ? (
          <>
            <CollapsibleSection
              id="personal-details"
              title="Personal Details"
              description="Information from Create Account"
              defaultOpen={mode === "view"}
              onAdd={undefined}
            >
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={startPersonalEdit}
                  className="min-h-9 rounded-[var(--mm-radius-md)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
                >
                  Edit
                </button>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <FieldRow label="First Name" value={profile.firstName || displayName.split(" ")[0] || ""} />
                <FieldRow label="Middle Name" value={profile.middleName} />
                <FieldRow
                  label="Last Name"
                  value={
                    profile.lastName ||
                    displayName.split(" ").slice(-1)[0] ||
                    ""
                  }
                />
                <FieldRow label="Date of Birth" value={profile.dateOfBirth} />
                <FieldRow label="Nationality" value={profile.nationality} />
                {profile.nationality &&
                profile.nationality !== "Saudi Arabia" ? (
                  <FieldRow
                    label="Resident in Saudi Arabia"
                    value={
                      profile.hasSaudiIqama === true
                        ? "Yes (Iqama)"
                        : profile.hasSaudiIqama === false
                          ? "No"
                          : ""
                    }
                  />
                ) : null}
                {identityLabel && identityValue ? (
                  <FieldRow
                    label={identityLabel}
                    value={
                      profile.identityVerified
                        ? `${identityValue} (verified)`
                        : identityValue
                    }
                  />
                ) : null}
                <FieldRow label="Mobile Number" value={profile.mobile} />
                <FieldRow label="Personal Email" value={profile.email} />
                <FieldRow
                  label="Institutional Email"
                  value={profile.institutionEmail}
                />
              </dl>
            </CollapsibleSection>

            <CollapsibleSection
              id="current-journey"
              title="Current Journey"
              description="Your active MedJourney path"
              defaultOpen
            >
              <dl className="grid gap-4 sm:grid-cols-2">
                {journeyRows(profile).map((row) => (
                  <FieldRow
                    key={`${row.label}-${row.value}`}
                    label={row.label}
                    value={row.value}
                  />
                ))}
              </dl>
              <p className="mt-4 text-[0.8125rem] text-mm-text-muted">
                Healthcare Field and Journey Path stay tied to onboarding in
                this prototype.
              </p>
            </CollapsibleSection>
          </>
        ) : null}

        {mode === "complete" || mode === "view" ? (
          <>
            <CollapsibleSection
              id="education"
              title="Education"
              description="High school, university, and prior degrees"
              count={allEducation.length}
              defaultOpen={mode === "complete"}
              onAdd={() => setAdding("education")}
            >
              {adding === "education" ? (
                <EducationForm
                  onCancel={() => setAdding(null)}
                  onSave={(entry) => {
                    enrichment.addEducation(entry);
                    setAdding(null);
                    setSavedMsg("Education added.");
                  }}
                />
              ) : null}
              {allEducation.length === 0 && adding !== "education" ? (
                <p className="text-[0.875rem] text-mm-text-muted">
                  No education entries yet. High school is optional enrichment
                  for students.
                </p>
              ) : (
                <ul className="space-y-3">
                  {allEducation.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {item.institutionName}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            {item.educationLevel}
                            {item.fieldOfStudy ? ` · ${item.fieldOfStudy}` : ""}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                            {[item.city, item.country].filter(Boolean).join(", ")}
                            {item.graduationYear
                              ? ` · ${item.currentlyStudying ? "Studying" : "Graduated"} ${item.graduationYear}`
                              : ""}
                          </p>
                        </div>
                        <SourceBadge
                          source={item.source}
                          verified={item.verified}
                        />
                      </div>
                      {item.source === "user" ? (
                        <button
                          type="button"
                          onClick={() => enrichment.removeEducation(item.id)}
                          className="mt-2 text-[0.75rem] font-semibold text-mm-text-muted"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              id="research"
              title="Research"
              description="Research history, including outside MedJourney"
              count={allResearch.length}
              defaultOpen={mode === "complete"}
              onAdd={() => setAdding("research")}
            >
              {adding === "research" ? (
                <ResearchForm
                  onCancel={() => setAdding(null)}
                  onSave={(entry) => {
                    enrichment.addResearch(entry);
                    setAdding(null);
                    setSavedMsg("Research entry added.");
                  }}
                />
              ) : null}
              {allResearch.length === 0 && adding !== "research" ? (
                <p className="text-[0.875rem] text-mm-text-muted">
                  No research entries yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {allResearch.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            {item.researchType} · {item.role}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                            {[item.institution, item.status]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <SourceBadge
                          source={item.source}
                          verified={item.verified}
                        />
                      </div>
                      {item.source === "user" ? (
                        <button
                          type="button"
                          onClick={() => enrichment.removeResearch(item.id)}
                          className="mt-2 text-[0.75rem] font-semibold text-mm-text-muted"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              id="courses"
              title="Courses and Workshops"
              description="Completed courses, including outside MedJourney"
              count={allCourses.length}
              defaultOpen={mode === "complete"}
              onAdd={() => setAdding("courses")}
            >
              {adding === "courses" ? (
                <CourseForm
                  onCancel={() => setAdding(null)}
                  onSave={(entry) => {
                    enrichment.addCourse(entry);
                    setAdding(null);
                    setSavedMsg("Course added.");
                  }}
                />
              ) : null}
              {allCourses.length === 0 && adding !== "courses" ? (
                <p className="text-[0.875rem] text-mm-text-muted">
                  No courses or workshops yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {allCourses.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            Provider: {item.provider}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                            {[item.institution, item.city, item.courseType]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <SourceBadge
                          source={item.source}
                          verified={item.verified}
                        />
                      </div>
                      {item.source === "user" ? (
                        <button
                          type="button"
                          onClick={() => enrichment.removeCourse(item.id)}
                          className="mt-2 text-[0.75rem] font-semibold text-mm-text-muted"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              id="certifications"
              title="Certifications"
              description="Formal certifications and licenses"
              count={enrichment.certifications.length}
              defaultOpen={mode === "complete"}
              onAdd={() => setAdding("certifications")}
            >
              {adding === "certifications" ? (
                <CertificationForm
                  onCancel={() => setAdding(null)}
                  onSave={(entry) => {
                    enrichment.addCertification(entry);
                    setAdding(null);
                    setSavedMsg("Certification added.");
                  }}
                />
              ) : null}
              {enrichment.certifications.length === 0 &&
              adding !== "certifications" ? (
                <p className="text-[0.875rem] text-mm-text-muted">
                  No certifications yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {enrichment.certifications.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {item.name}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            {item.issuingOrganization}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                            {[item.issueDate, item.expirationDate]
                              .filter(Boolean)
                              .join(" → ")}
                          </p>
                        </div>
                        <SourceBadge
                          source={item.source}
                          verified={item.verified}
                        />
                      </div>
                      {item.source === "user" ? (
                        <button
                          type="button"
                          onClick={() =>
                            enrichment.removeCertification(item.id)
                          }
                          className="mt-2 text-[0.75rem] font-semibold text-mm-text-muted"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            <CollapsibleSection
              id="training"
              title="Training and Clinical Experience"
              description="Prior training outside or through MedJourney"
              count={allTraining.length}
              defaultOpen={mode === "complete"}
              onAdd={() => setAdding("training")}
            >
              {adding === "training" ? (
                <TrainingForm
                  onCancel={() => setAdding(null)}
                  onSave={(entry) => {
                    enrichment.addTraining(entry);
                    setAdding(null);
                    setSavedMsg("Training experience added.");
                  }}
                />
              ) : null}
              {allTraining.length === 0 && adding !== "training" ? (
                <p className="text-[0.875rem] text-mm-text-muted">
                  No training experience entries yet. Accepted MedJourney
                  training appears here automatically.
                </p>
              ) : (
                <ul className="space-y-3">
                  {allTraining.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {item.hospital}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                            {item.trainingType}
                            {item.departmentOrSpecialty
                              ? ` · ${item.departmentOrSpecialty}`
                              : ""}
                          </p>
                          <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                            {[item.city, item.country, item.startDate]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        <SourceBadge
                          source={item.source}
                          verified={item.verified}
                        />
                      </div>
                      {item.source === "user" ? (
                        <button
                          type="button"
                          onClick={() => enrichment.removeTraining(item.id)}
                          className="mt-2 text-[0.75rem] font-semibold text-mm-text-muted"
                        >
                          Remove
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CollapsibleSection>

            {mode === "complete" ? (
              <button
                type="button"
                onClick={() => setMode("view")}
                className="w-full min-h-11 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
              >
                Done
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </AppShell>
  );
}

function EducationForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    entry: Omit<ProfileEducationEntry, "id" | "source" | "verified">,
  ) => void;
}) {
  const [educationLevel, setEducationLevel] = useState<EducationLevel>(
    "High School",
  );
  const [institutionName, setInstitutionName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startYear, setStartYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [currentlyStudying, setCurrentlyStudying] = useState(false);

  return (
    <form
      className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!institutionName.trim()) return;
        onSave({
          educationLevel,
          institutionName: institutionName.trim(),
          city: city.trim(),
          country: country.trim(),
          fieldOfStudy: fieldOfStudy.trim() || undefined,
          startYear: startYear.trim() || undefined,
          graduationYear: graduationYear.trim() || undefined,
          currentlyStudying,
        });
      }}
    >
      <SearchableSelect
        label="Education Level"
        value={educationLevel}
        onChange={(v) => setEducationLevel(v as EducationLevel)}
        options={EDUCATION_LEVELS}
        allowOther={false}
      />
      <Input
        label={
          educationLevel === "High School"
            ? "High School Name"
            : "Institution Name"
        }
        value={institutionName}
        onChange={(e) => setInstitutionName(e.target.value)}
        required
      />
      <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <SearchableSelect
        label="Country"
        value={country}
        onChange={setCountry}
        options={NATIONALITY_COUNTRIES}
        allowOther={false}
      />
      {educationLevel !== "High School" ? (
        <Input
          label="Field of Study"
          value={fieldOfStudy}
          onChange={(e) => setFieldOfStudy(e.target.value)}
        />
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Year"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
        />
        <Input
          label="Graduation Year"
          value={graduationYear}
          onChange={(e) => setGraduationYear(e.target.value)}
        />
      </div>
      <label className="flex items-center gap-2 text-[0.8125rem] text-mm-navy">
        <input
          type="checkbox"
          checked={currentlyStudying}
          onChange={(e) => setCurrentlyStudying(e.target.checked)}
        />
        Currently studying
      </label>
      <FormActions onCancel={onCancel} submitLabel="Save Education" />
    </form>
  );
}

function ResearchForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    entry: Omit<
      ProfileResearchEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [researchType, setResearchType] =
    useState<ProfileResearchType>("Clinical Research");
  const [role, setRole] = useState<ProfileResearchRole>("Research Assistant");
  const [healthcareField, setHealthcareField] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [institution, setInstitution] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [status, setStatus] = useState<"Ongoing" | "Completed" | "Published" | "Other">(
    "Completed",
  );
  const [publicationStatus, setPublicationStatus] = useState("");
  const [journalOrConference, setJournalOrConference] = useState("");
  const [doiOrLink, setDoiOrLink] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onSave({
          title: title.trim(),
          researchType,
          role,
          healthcareField: healthcareField.trim() || undefined,
          specialty: specialty.trim() || undefined,
          institution: institution.trim() || undefined,
          startDate: startDate || undefined,
          completionDate: completionDate || undefined,
          status,
          publicationStatus: publicationStatus.trim() || undefined,
          journalOrConference: journalOrConference.trim() || undefined,
          doiOrLink: doiOrLink.trim() || undefined,
          description: description.trim() || undefined,
        });
      }}
    >
      <Input
        label="Research Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <SearchableSelect
        label="Research Type"
        value={researchType}
        onChange={(v) => setResearchType(v as ProfileResearchType)}
        options={PROFILE_RESEARCH_TYPES}
        allowOther={false}
      />
      <SearchableSelect
        label="Role"
        value={role}
        onChange={(v) => setRole(v as ProfileResearchRole)}
        options={PROFILE_RESEARCH_ROLES}
        allowOther={false}
      />
      <Input
        label="Healthcare Field"
        value={healthcareField}
        onChange={(e) => setHealthcareField(e.target.value)}
      />
      <Input
        label="Specialty"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
      />
      <Input
        label="Hospital / University / Institution"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="Completion Date"
          type="date"
          value={completionDate}
          onChange={(e) => setCompletionDate(e.target.value)}
        />
      </div>
      <SearchableSelect
        label="Status"
        value={status}
        onChange={(v) =>
          setStatus(v as "Ongoing" | "Completed" | "Published" | "Other")
        }
        options={["Ongoing", "Completed", "Published", "Other"]}
        allowOther={false}
      />
      <Input
        label="Publication Status"
        value={publicationStatus}
        onChange={(e) => setPublicationStatus(e.target.value)}
      />
      <Input
        label="Journal or Conference"
        value={journalOrConference}
        onChange={(e) => setJournalOrConference(e.target.value)}
      />
      <Input
        label="DOI or Link"
        value={doiOrLink}
        onChange={(e) => setDoiOrLink(e.target.value)}
      />
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-white px-3 py-2.5 text-[0.9375rem] outline-none focus:border-mm-teal"
        />
      </div>
      <FormActions onCancel={onCancel} submitLabel="Save Research" />
    </form>
  );
}

function CourseForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    entry: Omit<
      ProfileCourseEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
}) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [institution, setInstitution] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [courseType, setCourseType] = useState("Certification");
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  const [certificateDataUrl, setCertificateDataUrl] = useState("");
  const [certificateFileName, setCertificateFileName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  return (
    <form
      className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !provider.trim()) return;
        onSave({
          name: name.trim(),
          provider: provider.trim(),
          institution: institution.trim() || undefined,
          city: city.trim() || undefined,
          country: country.trim() || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          courseType,
          certificateAvailable,
          certificateDataUrl: certificateDataUrl || undefined,
          certificateFileName: certificateFileName || undefined,
          expirationDate: expirationDate || undefined,
        });
      }}
    >
      <Input
        label="Course / Workshop Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="e.g. BLS, EFAST Workshop"
      />
      <Input
        label="Provider"
        value={provider}
        onChange={(e) => setProvider(e.target.value)}
        required
      />
      <Input
        label="Hospital / Institution / Training Center"
        value={institution}
        onChange={(e) => setInstitution(e.target.value)}
      />
      <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <SearchableSelect
        label="Country"
        value={country}
        onChange={setCountry}
        options={NATIONALITY_COUNTRIES}
        allowOther={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <SearchableSelect
        label="Course Type"
        value={courseType}
        onChange={setCourseType}
        options={PROFILE_COURSE_TYPE_OPTIONS}
        allowOther={false}
      />
      <label className="flex items-center gap-2 text-[0.8125rem] text-mm-navy">
        <input
          type="checkbox"
          checked={certificateAvailable}
          onChange={(e) => setCertificateAvailable(e.target.checked)}
        />
        Certificate available
      </label>
      {certificateAvailable ? (
        <div>
          <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
            Certificate Upload
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                setCertificateDataUrl(
                  typeof reader.result === "string" ? reader.result : "",
                );
                setCertificateFileName(file.name);
              };
              reader.readAsDataURL(file);
            }}
            className="block w-full text-[0.8125rem]"
          />
          {certificateFileName ? (
            <p className="mt-1 text-[0.75rem] text-mm-text-muted">
              {certificateFileName}
            </p>
          ) : null}
        </div>
      ) : null}
      <Input
        label="Expiration Date"
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
      />
      <FormActions onCancel={onCancel} submitLabel="Save Course" />
    </form>
  );
}

function CertificationForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    entry: Omit<
      import("@/data/profile-enrichment").ProfileCertificationEntry,
      "id" | "source" | "verified"
    >,
  ) => void;
}) {
  const [name, setName] = useState("");
  const [issuingOrganization, setIssuingOrganization] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [credentialId, setCredentialId] = useState("");
  const [credentialLink, setCredentialLink] = useState("");
  const [certificateDataUrl, setCertificateDataUrl] = useState("");
  const [certificateFileName, setCertificateFileName] = useState("");

  return (
    <form
      className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim() || !issuingOrganization.trim()) return;
        onSave({
          name: name.trim(),
          issuingOrganization: issuingOrganization.trim(),
          issueDate: issueDate || undefined,
          expirationDate: expirationDate || undefined,
          credentialId: credentialId.trim() || undefined,
          credentialLink: credentialLink.trim() || undefined,
          certificateDataUrl: certificateDataUrl || undefined,
          certificateFileName: certificateFileName || undefined,
        });
      }}
    >
      <Input
        label="Certification Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        placeholder="e.g. ACLS"
      />
      <Input
        label="Issuing Organization"
        value={issuingOrganization}
        onChange={(e) => setIssuingOrganization(e.target.value)}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Issue Date"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
        />
        <Input
          label="Expiration Date"
          type="date"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
        />
      </div>
      <Input
        label="Credential ID"
        value={credentialId}
        onChange={(e) => setCredentialId(e.target.value)}
      />
      <Input
        label="Credential Link"
        value={credentialLink}
        onChange={(e) => setCredentialLink(e.target.value)}
      />
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
          Certificate Upload
        </label>
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              setCertificateDataUrl(
                typeof reader.result === "string" ? reader.result : "",
              );
              setCertificateFileName(file.name);
            };
            reader.readAsDataURL(file);
          }}
          className="block w-full text-[0.8125rem]"
        />
        {certificateFileName ? (
          <p className="mt-1 text-[0.75rem] text-mm-text-muted">
            {certificateFileName}
          </p>
        ) : null}
      </div>
      <FormActions onCancel={onCancel} submitLabel="Save Certification" />
    </form>
  );
}

function TrainingForm({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (
    entry: Omit<
      ProfileTrainingEntry,
      "id" | "source" | "verified" | "linkedMedJourneyId"
    >,
  ) => void;
}) {
  const [trainingType, setTrainingType] =
    useState<ProfileTrainingType>("Summer Elective");
  const [hospital, setHospital] = useState("");
  const [departmentOrSpecialty, setDepartmentOrSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Saudi Arabia");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!hospital.trim()) return;
        onSave({
          trainingType,
          hospital: hospital.trim(),
          departmentOrSpecialty: departmentOrSpecialty.trim() || undefined,
          city: city.trim() || undefined,
          country: country.trim() || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          supervisor: supervisor.trim() || undefined,
          description: description.trim() || undefined,
        });
      }}
    >
      <SearchableSelect
        label="Training Type"
        value={trainingType}
        onChange={(v) => setTrainingType(v as ProfileTrainingType)}
        options={PROFILE_TRAINING_TYPES}
        allowOther={false}
      />
      <Input
        label="Hospital / Institution"
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        required
      />
      <Input
        label="Department / Specialty"
        value={departmentOrSpecialty}
        onChange={(e) => setDepartmentOrSpecialty(e.target.value)}
      />
      <Input label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <SearchableSelect
        label="Country"
        value={country}
        onChange={setCountry}
        options={NATIONALITY_COUNTRIES}
        allowOther={false}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Input
        label="Supervisor"
        value={supervisor}
        onChange={(e) => setSupervisor(e.target.value)}
      />
      <div>
        <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-white px-3 py-2.5 text-[0.9375rem] outline-none focus:border-mm-teal"
        />
      </div>
      <FormActions onCancel={onCancel} submitLabel="Save Training" />
    </form>
  );
}

function FormActions({
  onCancel,
  submitLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="submit"
        className="min-h-10 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
      >
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-4 text-[0.8125rem] font-semibold text-mm-navy"
      >
        Cancel
      </button>
    </div>
  );
}
