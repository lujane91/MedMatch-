"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Input, SearchableSelect } from "@/components/ui";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";
import type { InternProfile } from "@/data/intern";
import { resolveStage } from "@/data/journey-dashboard";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { SAUDI_CITIES, SAUDI_HOSPITAL_NAMES } from "@/data/saudi-hospitals";
import {
  findTrainingTitle,
  statusToneClass,
  trainingTypeForStage,
  trainingTypeLabel,
  type ApplicationDocumentLink,
  type TrainingApplication,
} from "@/data/training-applications";
import {
  DOCUMENT_TYPE_LABELS,
  type TrainingDocumentType,
  type UserDocument,
} from "@/data/training-documents";
import {
  MEDJOURNEY_APPLICATION_FEE_SAR,
  TRAINING_MONTHS,
  daysUntil,
  formatDateRange,
  formatDisplayDate,
  formatHospitalFee,
  formatMedJourneyFee,
  getOpportunityById,
  opportunitiesForType,
  trainingCities,
  type TrainingOpportunity,
} from "@/data/training-opportunities";
import { cn } from "@/lib/cn";
import { useTrainingApplications } from "@/lib/training-application-store";

type MainArea = "home" | "find" | "detail" | "apply" | "mine";
type MyTab = "applications" | "upcoming" | "completed";
type ApplyStep = 1 | 2 | 3 | 4 | 5;

const FIND_PAGE_SIZE = 8;

function applicantKeyOf(profile: InternProfile) {
  return profile.email.trim() || profile.fullName.trim() || "demo";
}

function readinessForOpportunity(
  opportunity: TrainingOpportunity,
  docs: UserDocument[],
  latestOfType: (type: TrainingDocumentType) => UserDocument | undefined,
) {
  const required = opportunity.requirements.filter((r) => r.required);
  const statuses = opportunity.requirements.map((r) => {
    const existing = latestOfType(r.documentType);
    const status = existing
      ? existing.status === "Expired"
        ? ("Expired" as const)
        : ("Uploaded" as const)
      : r.required
        ? ("Missing" as const)
        : ("Optional" as const);
    return { requirement: r, existing, status };
  });
  const complete = statuses.filter(
    (s) => s.requirement.required && s.status === "Uploaded",
  ).length;
  const missing = statuses
    .filter((s) => s.requirement.required && s.status !== "Uploaded")
    .map((s) => s.requirement.label);
  return {
    statuses,
    complete,
    total: required.length,
    ready: missing.length === 0,
    missing,
    docs,
  };
}

function OpportunityCard({
  opportunity,
  onOpen,
  hideHospitalFee = false,
}: {
  opportunity: TrainingOpportunity;
  onOpen: () => void;
  hideHospitalFee?: boolean;
}) {
  return (
    <article className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <p className="text-[0.9375rem] font-semibold text-mm-navy">
        {opportunity.hospital}
      </p>
      <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
        {opportunity.specialty}
        {opportunity.subspecialty ? ` · ${opportunity.subspecialty}` : ""}
      </p>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p>{opportunity.city}</p>
        <p>
          {opportunity.month} {opportunity.startDate.slice(0, 4)}
        </p>
        <p>{opportunity.availableSpots} spots available</p>
        <p>
          Application Deadline
          <span className="mt-0.5 block font-medium text-mm-navy">
            {formatDisplayDate(opportunity.applicationDeadline)}
          </span>
        </p>
        <p>
          MedJourney Application Fee
          <span className="mt-0.5 block font-medium text-mm-navy">
            {formatMedJourneyFee(opportunity.medjourneyApplicationFeeSar)}
          </span>
        </p>
        {!hideHospitalFee ? (
          <p>
            Hospital or Training Fee
            <span className="mt-0.5 block font-medium text-mm-navy">
              {formatHospitalFee(opportunity.hospitalFee)}
            </span>
          </p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.875rem] font-semibold text-white"
      >
        View and Apply
      </button>
    </article>
  );
}

function ApplicationStatusCard({
  app,
  extra,
  actions,
}: {
  app: TrainingApplication;
  extra?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <li className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.9375rem] font-semibold text-mm-navy">
            {app.hospital}
          </p>
          <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
            {app.specialty}
            {app.subspecialty ? ` · ${app.subspecialty}` : ""}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
            statusToneClass(app.applicationStatus),
          )}
        >
          {app.applicationStatus}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p>{app.month}</p>
        <p>{formatDateRange(app.startDate, app.endDate)}</p>
      </div>
      {extra}
      {actions}
    </li>
  );
}

export function TrainingWorkspace({
  profile,
  title,
  compact = false,
}: {
  profile: InternProfile;
  title: string;
  compact?: boolean;
}) {
  const stage = resolveStage(profile.trainingStage);
  const trainingType = trainingTypeForStage(stage);
  const {
    hydrated,
    submitApplication,
    applicationsFor,
    documentsFor,
    latestDocumentOfType,
    uploadDocument,
    updateApplicationStatus,
    markApplicationCompleted,
  } = useTrainingApplications();

  const applicantKey = applicantKeyOf(profile);
  const [area, setArea] = useState<MainArea>("home");
  const [myTab, setMyTab] = useState<MyTab>("applications");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [applyStep, setApplyStep] = useState<ApplyStep>(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterHospital, setFilterHospital] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterAvailability, setFilterAvailability] = useState("");
  const [filterFee, setFilterFee] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [visibleCount, setVisibleCount] = useState(FIND_PAGE_SIZE);

  const [preferredMonth, setPreferredMonth] = useState("");
  const [preferredStart, setPreferredStart] = useState("");
  const [preferredEnd, setPreferredEnd] = useState("");
  const [docSelections, setDocSelections] = useState<
    Record<string, string | null>
  >({});
  const [submitError, setSubmitError] = useState("");
  const [justSubmittedId, setJustSubmittedId] = useState<string | null>(null);
  const [applyPaymentPaid, setApplyPaymentPaid] = useState(false);

  const isSummerElective = trainingType === "summer-elective";

  const opportunities = useMemo(() => {
    if (!trainingType) return [];
    return opportunitiesForType(trainingType);
  }, [trainingType]);

  const applications = useMemo(() => {
    if (!hydrated || !trainingType) return [];
    return applicationsFor(applicantKey, trainingType);
  }, [applicantKey, applicationsFor, hydrated, trainingType]);

  const userDocs = useMemo(
    () => documentsFor(applicantKey),
    [applicantKey, documentsFor],
  );

  const selected = selectedId ? getOpportunityById(selectedId) : null;

  const filtered = useMemo(() => {
    const q = opportunitySearch.trim().toLowerCase();
    return opportunities.filter((o) => {
      if (filterMonth && o.month !== filterMonth) return false;
      if (filterCity && o.city !== filterCity) return false;
      if (filterHospital && o.hospital !== filterHospital) return false;
      if (
        filterSpecialty &&
        !o.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) &&
        !o.subspecialty.toLowerCase().includes(filterSpecialty.toLowerCase())
      ) {
        return false;
      }
      if (filterDateFrom && o.endDate < filterDateFrom) return false;
      if (filterDateTo && o.startDate > filterDateTo) return false;
      if (!isSummerElective) {
        if (filterAvailability === "Available" && o.availableSpots <= 0) {
          return false;
        }
        if (filterAvailability === "Limited" && o.availableSpots > 3) {
          return false;
        }
        if (filterFee === "No Hospital Fee" && o.hospitalFee.kind !== "none") {
          return false;
        }
        if (filterFee === "Has Hospital Fee" && o.hospitalFee.kind !== "fee") {
          return false;
        }
      }
      if (q) {
        const hay = [
          o.hospital,
          o.specialty,
          o.subspecialty,
          o.city,
          o.month,
          o.description,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    filterAvailability,
    filterCity,
    filterDateFrom,
    filterDateTo,
    filterFee,
    filterHospital,
    filterMonth,
    filterSpecialty,
    isSummerElective,
    opportunities,
    opportunitySearch,
  ]);

  const visibleOpportunities = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const specialtyOptions = useMemo(
    () =>
      Array.from(new Set(opportunities.map((o) => o.specialty))).sort(),
    [opportunities],
  );

  const fieldSpecialtyOptions = useMemo(
    () => [...getSpecialtiesForField(profile.field)],
    [profile.field],
  );

  const stats = useMemo(() => {
    const apps = applications.filter((a) =>
      ["Draft", "Submitted", "Under Review", "Waitlisted", "Accepted", "Declined"].includes(
        a.applicationStatus,
      ),
    );
    const upcoming = applications.filter(
      (a) => a.applicationStatus === "Accepted",
    );
    const completed = applications.filter(
      (a) => a.applicationStatus === "Completed",
    );
    return [
      { label: "Applications", value: String(apps.length) },
      { label: "Upcoming", value: String(upcoming.length) },
      { label: "Completed", value: String(completed.length) },
      { label: "Open Opportunities", value: String(opportunities.length) },
    ];
  }, [applications, opportunities.length]);

  if (!trainingType) return null;
  const activeType = trainingType;
  const discoveryTitle = findTrainingTitle(activeType);

  function openDetail(id: string) {
    setSelectedId(id);
    setArea("detail");
    setSubmitError("");
  }

  function startApply(opportunity: TrainingOpportunity) {
    setSelectedId(opportunity.id);
    setPreferredMonth(opportunity.month);
    setPreferredStart(opportunity.startDate);
    setPreferredEnd(opportunity.endDate);
    const initial: Record<string, string | null> = {};
    for (const req of opportunity.requirements) {
      const existing = latestDocumentOfType(applicantKey, req.documentType);
      initial[req.id] =
        existing && existing.status === "Uploaded" ? existing.id : null;
    }
    setDocSelections(initial);
    setApplyStep(1);
    setApplyPaymentPaid(false);
    setSubmitError("");
    setArea("apply");
  }

  function buildDocumentLinks(
    opportunity: TrainingOpportunity,
  ): ApplicationDocumentLink[] {
    return opportunity.requirements.map((req) => {
      const selectedDocId = docSelections[req.id];
      const doc = userDocs.find((d) => d.id === selectedDocId);
      let status: ApplicationDocumentLink["status"] = "Missing";
      if (!req.required && !doc) status = "Optional";
      else if (doc?.status === "Expired") status = "Expired";
      else if (doc) status = "Uploaded";
      else status = req.required ? "Missing" : "Optional";
      return {
        requirementId: req.id,
        documentType: req.documentType,
        label: req.label,
        required: req.required,
        userDocumentId: doc?.id ?? null,
        status,
      };
    });
  }

  function handleSubmit() {
    if (!selected) return;
    if (isSummerElective && !applyPaymentPaid) {
      setSubmitError("Please complete payment before submitting.");
      return;
    }
    const links = buildDocumentLinks(selected);
    const missing = links
      .filter((l) => l.required && l.status !== "Uploaded")
      .map((l) => l.label);
    if (missing.length) {
      setSubmitError(`Missing: ${missing.join(", ")}`);
      return;
    }
    if (!selected.datesFixed) {
      if (!preferredMonth || !preferredStart || !preferredEnd) {
        setSubmitError("Please choose preferred month and dates.");
        return;
      }
      if (preferredEnd < preferredStart) {
        setSubmitError("End date must be after the start date.");
        return;
      }
    }
    const app = submitApplication({
      applicantKey,
      opportunityId: selected.id,
      journeyStage: stage,
      healthcareField: profile.field,
      month: preferredMonth,
      startDate: preferredStart,
      endDate: preferredEnd,
      documents: links,
    });
    setJustSubmittedId(app.id);
    setApplyPaymentPaid(false);
    setArea("mine");
    setMyTab("applications");
  }

  function completeMockApplicationPayment() {
    setApplyPaymentPaid(true);
    setSubmitError("");
    setApplyStep(5);
  }

  if (compact) {
    return (
      <DashboardSection
        id="training"
        title={title}
        action={
          <Link
            href="/training"
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Open
          </Link>
        }
      >
        <StatGrid items={stats.slice(0, 3)} />
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
          Find opportunities, check requirements, apply, and track My Training.
        </p>
      </DashboardSection>
    );
  }

  const readiness = selected
    ? readinessForOpportunity(selected, userDocs, (type) =>
        latestDocumentOfType(applicantKey, type),
      )
    : null;

  return (
    <div className="space-y-5">
      {area === "home" ? (
        <>
          <DashboardSection id="training" title={title}>
            <StatGrid items={stats} />
            <p className="mt-4 text-[0.875rem] text-mm-text-secondary">
              {trainingTypeLabel(activeType)} opportunities matched to your
              Journey Stage.
            </p>
          </DashboardSection>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setVisibleCount(FIND_PAGE_SIZE);
                setArea("find");
              }}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left shadow-mm-sm transition-colors hover:border-mm-teal"
            >
              <p className="text-[1.0625rem] font-semibold text-mm-navy">
                {discoveryTitle}
              </p>
              <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                {isSummerElective
                  ? "Search and browse available summer elective opportunities."
                  : "Search hospitals, specialties, months, and availability."}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setArea("mine")}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 text-left shadow-mm-sm transition-colors hover:border-mm-teal"
            >
              <p className="text-[1.0625rem] font-semibold text-mm-navy">
                My Training
              </p>
              <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                Track applications, upcoming training, and completed records.
              </p>
            </button>
          </div>
        </>
      ) : null}

      {area !== "home" ? (
        <button
          type="button"
          onClick={() => {
            if (area === "apply" || area === "detail") setArea("find");
            else setArea("home");
          }}
          className="text-[0.875rem] font-semibold text-mm-teal"
        >
          {area === "apply" || area === "detail"
            ? `Back to ${discoveryTitle}`
            : "Back to Training"}
        </button>
      ) : null}

      {area === "find" ? (
        <DashboardSection title={discoveryTitle}>
          {isSummerElective ? (
            <div className="mb-4">
              <Input
                label="Search"
                value={opportunitySearch}
                onChange={(e) => {
                  setOpportunitySearch(e.target.value);
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                placeholder="Search opportunities"
              />
            </div>
          ) : null}

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[0.875rem] text-mm-text-secondary">
              {filtered.length} opportunities
            </p>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
            >
              Filters
            </button>
          </div>

          {filtersOpen ? (
            <div className="mb-4 space-y-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-4">
              <SearchableSelect
                label="Month"
                value={filterMonth}
                onChange={(value) => {
                  setFilterMonth(value);
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                options={
                  isSummerElective
                    ? ["June", "July", "August"]
                    : [...TRAINING_MONTHS]
                }
                allowOther={false}
                searchable={false}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="From Date"
                  type="date"
                  value={filterDateFrom}
                  onChange={(e) => {
                    setFilterDateFrom(e.target.value);
                    setVisibleCount(FIND_PAGE_SIZE);
                  }}
                />
                <Input
                  label="To Date"
                  type="date"
                  value={filterDateTo}
                  onChange={(e) => {
                    setFilterDateTo(e.target.value);
                    setVisibleCount(FIND_PAGE_SIZE);
                  }}
                />
              </div>
              <SearchableSelect
                label="City"
                value={filterCity}
                onChange={(value) => {
                  setFilterCity(value);
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                options={isSummerElective ? [...SAUDI_CITIES] : trainingCities()}
                allowOther={false}
              />
              <SearchableSelect
                label={
                  isSummerElective
                    ? "Hospital"
                    : "Hospital or Training Institution"
                }
                value={filterHospital}
                onChange={(value) => {
                  setFilterHospital(value);
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                options={SAUDI_HOSPITAL_NAMES}
              />
              <SearchableSelect
                label="Specialty"
                value={filterSpecialty}
                onChange={(value) => {
                  setFilterSpecialty(value);
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                options={
                  isSummerElective ? fieldSpecialtyOptions : specialtyOptions
                }
              />
              {!isSummerElective ? (
                <>
                  <SearchableSelect
                    label="Availability"
                    value={filterAvailability}
                    onChange={setFilterAvailability}
                    options={["Available", "Limited"]}
                    allowOther={false}
                  />
                  <SearchableSelect
                    label="Fee"
                    value={filterFee}
                    onChange={setFilterFee}
                    options={["No Hospital Fee", "Has Hospital Fee"]}
                    allowOther={false}
                  />
                </>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setFilterMonth("");
                  setFilterCity("");
                  setFilterHospital("");
                  setFilterSpecialty("");
                  setFilterAvailability("");
                  setFilterFee("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                  setOpportunitySearch("");
                  setVisibleCount(FIND_PAGE_SIZE);
                }}
                className="text-[0.8125rem] font-semibold text-mm-teal"
              >
                Clear filters
              </button>
            </div>
          ) : null}

          <div className="mb-3">
            <h3 className="text-[1rem] font-semibold text-mm-navy">
              {isSummerElective ? "Available Opportunities" : "Opportunities"}
            </h3>
            {isSummerElective ? (
              <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                Browse published elective opportunities.
              </p>
            ) : null}
          </div>

          <ul className="space-y-3">
            {visibleOpportunities.map((opportunity) => (
              <li key={opportunity.id}>
                <OpportunityCard
                  opportunity={opportunity}
                  hideHospitalFee={isSummerElective}
                  onOpen={() => openDetail(opportunity.id)}
                />
              </li>
            ))}
          </ul>
          {filtered.length === 0 ? (
            <p className="text-center text-[0.875rem] text-mm-text-muted">
              No opportunities match these filters.
            </p>
          ) : null}
          {visibleCount < filtered.length ? (
            <button
              type="button"
              onClick={() =>
                setVisibleCount((count) => count + FIND_PAGE_SIZE)
              }
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
            >
              Load More
            </button>
          ) : null}
        </DashboardSection>
      ) : null}

      {area === "detail" && selected && readiness ? (
        <DashboardSection title={trainingTypeLabel(activeType)}>
          <h3 className="text-[1.125rem] font-semibold text-mm-navy">
            {selected.hospital}
          </h3>
          <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
            {selected.specialty}
            {selected.subspecialty ? ` · ${selected.subspecialty}` : ""}
          </p>

          <dl className="mt-4 grid gap-3 text-[0.8125rem] sm:grid-cols-2">
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                City
              </dt>
              <dd className="mt-1 text-mm-navy">{selected.city}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Training Type
              </dt>
              <dd className="mt-1 text-mm-navy">
                {trainingTypeLabel(selected.trainingType)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Month
              </dt>
              <dd className="mt-1 text-mm-navy">{selected.month}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Dates
              </dt>
              <dd className="mt-1 text-mm-navy">
                {formatDateRange(selected.startDate, selected.endDate)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Available Spots
              </dt>
              <dd className="mt-1 text-mm-navy">{selected.availableSpots}</dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Application Deadline
              </dt>
              <dd className="mt-1 text-mm-navy">
                {formatDisplayDate(selected.applicationDeadline)}
              </dd>
            </div>
            <div>
              <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                MedJourney Application Fee
              </dt>
              <dd className="mt-1 text-mm-navy">
                {formatMedJourneyFee(selected.medjourneyApplicationFeeSar)}
              </dd>
            </div>
            {!isSummerElective ? (
              <div>
                <dt className="font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Hospital or Training Fee
                </dt>
                <dd className="mt-1 text-mm-navy">
                  {formatHospitalFee(selected.hospitalFee)}
                </dd>
              </div>
            ) : null}
          </dl>

          <p className="mt-4 text-[0.875rem] leading-relaxed text-mm-text-secondary">
            {selected.description}
          </p>

          <div className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-4">
            <p className="text-[0.9375rem] font-semibold text-mm-navy">
              {readiness.ready ? "Requirements Ready" : "Requirements"}
            </p>
            <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
              {readiness.complete} of {readiness.total} completed
            </p>
            {!readiness.ready ? (
              <p className="mt-2 text-[0.8125rem] font-medium text-amber-800">
                Missing: {readiness.missing.join(", ")}
              </p>
            ) : null}
            <ul className="mt-3 space-y-2">
              {readiness.statuses.map(({ requirement, status }) => (
                <li
                  key={requirement.id}
                  className="flex items-center justify-between gap-3 text-[0.8125rem]"
                >
                  <span className="text-mm-navy">
                    {requirement.label}
                    {!requirement.required ? (
                      <span className="ml-1 text-mm-text-muted">Optional</span>
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      status === "Uploaded"
                        ? "text-mm-teal"
                        : status === "Optional"
                          ? "text-mm-text-muted"
                          : "text-amber-800",
                    )}
                  >
                    {status === "Uploaded" ? "Uploaded ✓" : status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => startApply(selected)}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white"
          >
            Apply
          </button>
        </DashboardSection>
      ) : null}

      {area === "apply" && selected ? (
        <DashboardSection
          title={
            applyStep === 4 || applyStep === 5
              ? "Application Payment"
              : "Apply"
          }
        >
          {applyStep <= 3 ? (
            <>
              <div className="mb-4 flex gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      applyStep >= step ? "bg-mm-teal" : "bg-mm-gray-100",
                    )}
                  />
                ))}
              </div>
              <p className="mb-4 text-[0.8125rem] font-semibold text-mm-text-muted">
                {applyStep === 1
                  ? "Step 1 Training Details"
                  : applyStep === 2
                    ? "Step 2 Required Documents"
                    : "Step 3 Review Application"}
              </p>
            </>
          ) : null}

          {applyStep === 1 ? (
            <div className="space-y-4">
              <div className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-4 py-3 text-[0.875rem]">
                <p className="font-semibold text-mm-navy">{selected.hospital}</p>
                <p className="mt-1 text-mm-text-secondary">
                  {selected.specialty}
                </p>
                <p className="mt-2 text-mm-text-muted">
                  {selected.month} ·{" "}
                  {formatDateRange(selected.startDate, selected.endDate)}
                </p>
              </div>
              {!selected.datesFixed ? (
                <>
                  <SearchableSelect
                    label="Preferred Month"
                    value={preferredMonth}
                    onChange={setPreferredMonth}
                    options={[...TRAINING_MONTHS]}
                    allowOther={false}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Preferred Start Date"
                      type="date"
                      value={preferredStart}
                      onChange={(e) => setPreferredStart(e.target.value)}
                    />
                    <Input
                      label="Preferred End Date"
                      type="date"
                      value={preferredEnd}
                      onChange={(e) => setPreferredEnd(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                <p className="text-[0.8125rem] text-mm-text-muted">
                  Dates are fixed for this opportunity.
                </p>
              )}
              <button
                type="button"
                onClick={() => setApplyStep(2)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
              >
                Continue
              </button>
            </div>
          ) : null}

          {applyStep === 2 ? (
            <div className="space-y-4">
              {selected.requirements.map((req) => {
                const selectedDocId = docSelections[req.id];
                const selectedDoc = userDocs.find((d) => d.id === selectedDocId);
                const existing = latestDocumentOfType(
                  applicantKey,
                  req.documentType,
                );
                const status = selectedDoc
                  ? selectedDoc.status === "Expired"
                    ? "Expired"
                    : "Uploaded"
                  : req.required
                    ? "Missing"
                    : "Optional";
                return (
                  <div
                    key={req.id}
                    className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-mm-navy">{req.label}</p>
                        <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                          {req.required ? "Required" : "Optional"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "text-[0.75rem] font-semibold",
                          status === "Uploaded"
                            ? "text-mm-teal"
                            : "text-amber-800",
                        )}
                      >
                        {status === "Uploaded" ? "Uploaded ✓" : status}
                      </span>
                    </div>
                    {selectedDoc ? (
                      <p className="mt-2 text-[0.8125rem] text-mm-text-secondary">
                        {selectedDoc.fileName}
                      </p>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {existing && existing.status === "Uploaded" ? (
                        <button
                          type="button"
                          onClick={() =>
                            setDocSelections((prev) => ({
                              ...prev,
                              [req.id]: existing.id,
                            }))
                          }
                          className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-navy"
                        >
                          Use Existing Document
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => {
                          const uploaded = uploadDocument({
                            userId: applicantKey,
                            documentType: req.documentType,
                            fileName: `${DOCUMENT_TYPE_LABELS[req.documentType].replace(/\s+/g, "_")}.pdf`,
                          });
                          setDocSelections((prev) => ({
                            ...prev,
                            [req.id]: uploaded.id,
                          }));
                        }}
                        className="min-h-10 rounded-[var(--mm-radius-lg)] bg-mm-teal px-3 text-[0.75rem] font-semibold text-white"
                      >
                        {selectedDoc ? "Replace" : "Upload New Document"}
                      </button>
                      {selectedDoc ? (
                        <button
                          type="button"
                          className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-text-muted"
                          onClick={() =>
                            window.alert(
                              `Prototype view: ${selectedDoc.fileName}`,
                            )
                          }
                        >
                          View
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApplyStep(1)}
                  className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setApplyStep(3)}
                  className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
                >
                  Continue
                </button>
              </div>
            </div>
          ) : null}

          {applyStep === 3 ? (
            <div className="space-y-4">
              <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3 text-[0.875rem]">
                <p className="font-semibold text-mm-navy">Review Application</p>
                <p className="mt-3 text-mm-text-secondary">
                  {trainingTypeLabel(selected.trainingType)}
                </p>
                <p className="mt-1 font-medium text-mm-navy">
                  {selected.hospital}
                </p>
                <p className="mt-1 text-mm-text-secondary">
                  {selected.specialty}
                </p>
                <p className="mt-2 text-mm-text-muted">
                  {preferredMonth} ·{" "}
                  {formatDateRange(preferredStart, preferredEnd)}
                </p>
              </div>

              <div className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-4 py-3">
                <p className="text-[0.8125rem] font-semibold text-mm-navy">
                  Uploaded Documents
                </p>
                <ul className="mt-2 space-y-1 text-[0.8125rem]">
                  {buildDocumentLinks(selected).map((link) => (
                    <li
                      key={link.requirementId}
                      className="flex justify-between gap-2"
                    >
                      <span className="text-mm-text-secondary">{link.label}</span>
                      <span
                        className={cn(
                          "font-semibold",
                          link.status === "Uploaded"
                            ? "text-mm-teal"
                            : "text-amber-800",
                        )}
                      >
                        {link.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {!isSummerElective ? (
                <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3 text-[0.8125rem]">
                  <p>
                    MedJourney Application Fee
                    <span className="mt-0.5 block font-semibold text-mm-navy">
                      {formatMedJourneyFee(
                        selected.medjourneyApplicationFeeSar,
                      )}
                    </span>
                  </p>
                  <p className="mt-3">
                    Hospital or Training Fee
                    <span className="mt-0.5 block font-semibold text-mm-navy">
                      {formatHospitalFee(selected.hospitalFee)}
                    </span>
                  </p>
                  <p className="mt-2 text-mm-text-muted">
                    Prototype only. Real payment is not processed yet.
                  </p>
                </div>
              ) : null}

              {submitError ? (
                <p className="text-[0.8125rem] font-medium text-mm-error-700">
                  {submitError}
                </p>
              ) : null}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApplyStep(2)}
                  className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
                >
                  Back
                </button>
                {isSummerElective ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitError("");
                      setApplyStep(4);
                    }}
                    className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
                  >
                    Continue to Payment
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {applyStep === 4 && isSummerElective ? (
            <div className="space-y-5">
              <div className="rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-6 text-center">
                <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-mm-text-muted">
                  Application Payment
                </p>
                <p className="mt-3 font-[family-name:var(--mm-font-display)] text-[2.5rem] leading-none tracking-[-0.03em] text-mm-navy">
                  {formatMedJourneyFee(MEDJOURNEY_APPLICATION_FEE_SAR)}
                </p>
                <p className="mt-3 text-[0.875rem] text-mm-text-secondary">
                  MedJourney application payment for this Summer Elective
                  application.
                </p>
              </div>

              <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-4 text-[0.875rem] leading-relaxed text-mm-navy">
                <p className="font-semibold">Refund policy</p>
                <p className="mt-2 text-mm-text-secondary">
                  If your application is not accepted, the SAR 100 payment will
                  be refunded.
                </p>
                <p className="mt-2 text-mm-text-secondary">
                  If you withdraw your application, the SAR 100 payment is
                  nonrefundable unless there are extenuating circumstances.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setApplyStep(3)}
                  className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={completeMockApplicationPayment}
                  className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
                >
                  Pay SAR 100
                </button>
              </div>
            </div>
          ) : null}

          {applyStep === 5 && isSummerElective ? (
            <div className="space-y-5">
              <div className="rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-8 text-center">
                <p className="text-[1.125rem] font-semibold text-mm-navy">
                  Payment Successful
                </p>
                <p className="mt-2 text-[0.9375rem] text-mm-text-secondary">
                  SAR 100 paid
                </p>
                <p className="mt-4 text-[0.8125rem] text-mm-text-muted">
                  Payment is complete. Submit your application to send it for
                  review.
                </p>
              </div>

              {submitError ? (
                <p className="text-[0.8125rem] font-medium text-mm-error-700">
                  {submitError}
                </p>
              ) : null}

              <button
                type="button"
                disabled={!applyPaymentPaid}
                onClick={handleSubmit}
                className={cn(
                  "inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white",
                  !applyPaymentPaid && "cursor-not-allowed opacity-50",
                )}
              >
                Submit Application
              </button>
            </div>
          ) : null}
        </DashboardSection>
      ) : null}

      {area === "mine" ? (
        <DashboardSection title="My Training">
          {justSubmittedId ? (
            <p className="mb-4 text-[0.8125rem] font-medium text-mm-teal-700">
              Application submitted. Waiting for hospital decision.
            </p>
          ) : null}

          <div className="mb-4 flex gap-2 overflow-x-auto">
            {(
              [
                ["applications", "Applications"],
                ["upcoming", "Upcoming"],
                ["completed", "Completed"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMyTab(id)}
                className={cn(
                  "min-h-10 shrink-0 rounded-[var(--mm-radius-lg)] px-3 text-[0.8125rem] font-semibold",
                  myTab === id
                    ? "bg-mm-teal text-white"
                    : "border border-mm-border text-mm-navy",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {!hydrated ? (
            <p className="text-[0.875rem] text-mm-text-muted">Loading…</p>
          ) : null}

          {hydrated && myTab === "applications" ? (
            <ul className="space-y-3">
              {applications
                .filter((a) =>
                  [
                    "Draft",
                    "Submitted",
                    "Under Review",
                    "Waitlisted",
                    "Accepted",
                    "Declined",
                  ].includes(a.applicationStatus),
                )
                .map((app) => (
                  <ApplicationStatusCard
                    key={app.id}
                    app={app}
                    actions={
                      <div className="mt-3 flex flex-wrap gap-2">
                        {app.applicationStatus === "Submitted" ||
                        app.applicationStatus === "Under Review" ||
                        app.applicationStatus === "Waitlisted" ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                updateApplicationStatus(app.id, "Accepted")
                              }
                              className="min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-2.5 text-[0.6875rem] font-semibold text-mm-navy"
                            >
                              Demo Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateApplicationStatus(app.id, "Waitlisted")
                              }
                              className="min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-2.5 text-[0.6875rem] font-semibold text-mm-navy"
                            >
                              Demo Waitlist
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateApplicationStatus(app.id, "Declined")
                              }
                              className="min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-2.5 text-[0.6875rem] font-semibold text-mm-navy"
                            >
                              Demo Decline
                            </button>
                          </>
                        ) : null}
                      </div>
                    }
                  />
                ))}
              {applications.filter((a) =>
                [
                  "Draft",
                  "Submitted",
                  "Under Review",
                  "Waitlisted",
                  "Accepted",
                  "Declined",
                ].includes(a.applicationStatus),
              ).length === 0 ? (
                <p className="text-[0.875rem] text-mm-text-secondary">
                  No applications yet. Start from {discoveryTitle}.
                </p>
              ) : null}
            </ul>
          ) : null}

          {hydrated && myTab === "upcoming" ? (
            <ul className="space-y-3">
              {applications
                .filter((a) => a.applicationStatus === "Accepted")
                .map((app) => {
                  const days = daysUntil(app.startDate);
                  return (
                    <ApplicationStatusCard
                      key={app.id}
                      app={app}
                      extra={
                        <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
                          <p>Start {formatDisplayDate(app.startDate)}</p>
                          <p>End {formatDisplayDate(app.endDate)}</p>
                          {days >= 0 ? <p>{days} days until start</p> : null}
                          {app.remainingActions.length ? (
                            <div className="mt-2 rounded-[var(--mm-radius-md)] bg-amber-50 px-3 py-2 text-amber-900">
                              <p className="font-semibold">Remaining actions</p>
                              <ul className="mt-1 list-disc pl-4">
                                {app.remainingActions.map((action) => (
                                  <li key={action}>{action}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      }
                      actions={
                        <button
                          type="button"
                          onClick={() => markApplicationCompleted(app.id)}
                          className="mt-3 min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-2.5 text-[0.6875rem] font-semibold text-mm-navy"
                        >
                          Demo Mark Completed
                        </button>
                      }
                    />
                  );
                })}
              {applications.filter((a) => a.applicationStatus === "Accepted")
                .length === 0 ? (
                <p className="text-[0.875rem] text-mm-text-secondary">
                  Accepted training will appear here.
                </p>
              ) : null}
            </ul>
          ) : null}

          {hydrated && myTab === "completed" ? (
            <ul className="space-y-3">
              {applications
                .filter((a) => a.applicationStatus === "Completed")
                .map((app) => (
                  <ApplicationStatusCard
                    key={app.id}
                    app={app}
                    extra={
                      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
                        <p>Completion Status: Completed</p>
                        {app.evaluationReceived ? (
                          <p>Evaluation Received</p>
                        ) : null}
                        {app.certificateAvailable ? (
                          <p>Certificate Available</p>
                        ) : null}
                        {app.stampEarned ? (
                          <p>Stamp Earned (Passport ready later)</p>
                        ) : null}
                      </div>
                    }
                  />
                ))}
              {applications.filter((a) => a.applicationStatus === "Completed")
                .length === 0 ? (
                <p className="text-[0.875rem] text-mm-text-secondary">
                  Completed training will appear here.
                </p>
              ) : null}
            </ul>
          ) : null}
        </DashboardSection>
      ) : null}
    </div>
  );
}
