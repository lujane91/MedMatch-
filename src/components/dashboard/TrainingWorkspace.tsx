"use client";

import { useMemo, useState } from "react";
import { Input, SearchableSelect } from "@/components/ui";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";
import type { InternProfile } from "@/data/intern";
import { resolveStage } from "@/data/journey-dashboard";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { getSubspecialtiesForSpecialty } from "@/data/saudi-subspecialties";
import { SAUDI_HOSPITAL_NAMES } from "@/data/saudi-hospitals";
import { getAdvancedTrainingProgramsForField } from "@/data/advanced-training-programs";
import {
  TRAINING_MONTHS,
  applyCtaLabel,
  demoFeeForHospital,
  formatDateRange,
  formatTrainingFee,
  formatTrainingFeeShort,
  statusToneClass,
  trainingTypeForStage,
  trainingTypeLabel,
  type TrainingApplication,
} from "@/data/training-applications";
import { cn } from "@/lib/cn";
import { useTrainingApplications } from "@/lib/training-application-store";

function specialtyOptionsFor(profile: InternProfile) {
  const stage = resolveStage(profile.trainingStage);
  if (stage === "advanced-training") {
    return getAdvancedTrainingProgramsForField(profile.field);
  }
  return getSpecialtiesForField(profile.field);
}

function ApplicationCard({ app }: { app: TrainingApplication }) {
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
            statusToneClass(app.status),
          )}
        >
          {app.status}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p>{app.month}</p>
        <p>{formatDateRange(app.startDate, app.endDate)}</p>
        <p>
          {app.fee.kind === "fee" ? (
            <>
              Application Fee
              <span className="mt-0.5 block font-medium text-mm-navy">
                {formatTrainingFeeShort(app.fee)}
              </span>
            </>
          ) : (
            "No Application Fee"
          )}
        </p>
      </div>
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
  const { hydrated, submitApplication, applicationsFor } =
    useTrainingApplications();
  const applicantKey = profile.email.trim() || profile.fullName.trim() || "demo";

  const [formOpen, setFormOpen] = useState(false);
  const [month, setMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hospital, setHospital] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [subspecialty, setSubspecialty] = useState("");
  const [error, setError] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);

  const specialtyOptions = useMemo(
    () => specialtyOptionsFor(profile),
    [profile],
  );
  const subspecialtyOptions = useMemo(
    () => getSubspecialtiesForSpecialty(specialty),
    [specialty],
  );
  const showSubspecialty =
    stage === "fellow" ||
    (stage === "advanced-training" && subspecialtyOptions.length > 0);

  const applications = useMemo(() => {
    if (!hydrated || !trainingType) return [];
    return applicationsFor(applicantKey, trainingType);
  }, [applicantKey, applicationsFor, hydrated, trainingType]);

  const feePreview = hospital ? demoFeeForHospital(hospital) : null;

  const stats = useMemo(() => {
    const pending = applications.filter((a) => a.status === "Pending").length;
    const accepted = applications.filter((a) => a.status === "Accepted").length;
    const completed = applications.filter(
      (a) => a.status === "Completed",
    ).length;
    return [
      { label: "My Applications", value: String(applications.length) },
      { label: "Pending", value: String(pending) },
      { label: "Accepted", value: String(accepted) },
      { label: "Completed", value: String(completed) },
    ];
  }, [applications]);

  if (!trainingType) return null;

  const activeTrainingType = trainingType;

  function resetForm() {
    setMonth("");
    setStartDate("");
    setEndDate("");
    setHospital("");
    setSpecialty("");
    setSubspecialty("");
    setError("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !month ||
      !startDate ||
      !endDate ||
      !hospital.trim() ||
      !specialty.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }
    if (endDate < startDate) {
      setError("End date must be after the start date.");
      return;
    }

    submitApplication({
      applicantKey,
      trainingType: activeTrainingType,
      journeyStage: stage,
      healthcareField: profile.field,
      month,
      startDate,
      endDate,
      hospital: hospital.trim(),
      specialty: specialty.trim(),
      subspecialty: showSubspecialty ? subspecialty.trim() : "",
      fee: demoFeeForHospital(hospital),
    });
    resetForm();
    setFormOpen(false);
    setJustSubmitted(true);
  }

  return (
    <div className="space-y-5">
      <DashboardSection id="training" title={title}>
        {!compact ? <StatGrid items={stats} /> : null}

        {stage === "intern" && !compact ? (
          <div className={`${compact || stats.length ? "mt-4" : ""} space-y-3`}>
            <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Current Rotation
              </p>
              <p className="mt-1.5 text-[0.9375rem] font-semibold text-mm-navy">
                Internal Medicine
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                King Saud University Medical City
              </p>
            </div>
            <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Next Rotation
              </p>
              <p className="mt-1.5 text-[0.9375rem] font-semibold text-mm-navy">
                Emergency Medicine
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                Starts 1 Oct 2026
              </p>
            </div>
            <div className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-4 py-3">
              <p className="text-[0.8125rem] font-medium text-mm-navy">
                Evaluations
              </p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                2 evaluations waiting for your review.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-4">
          {!formOpen ? (
            <button
              type="button"
              onClick={() => {
                setFormOpen(true);
                setJustSubmitted(false);
              }}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] hover:-translate-y-px hover:bg-mm-teal-700 sm:w-auto"
            >
              {applyCtaLabel(activeTrainingType)}
            </button>
          ) : null}

          {justSubmitted ? (
            <p className="mt-3 text-[0.8125rem] font-medium text-mm-teal-700">
              Application submitted as Pending.
            </p>
          ) : null}
        </div>

        {formOpen ? (
          <form className="mt-5 space-y-4 border-t border-mm-border pt-5" onSubmit={onSubmit}>
            <p className="text-[0.8125rem] font-semibold text-mm-navy">
              {trainingTypeLabel(activeTrainingType)} application
            </p>

            <div>
              <label
                htmlFor="training-month"
                className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
              >
                Month
              </label>
              <select
                id="training-month"
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-2.5 text-[0.9375rem] text-mm-navy outline-none focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]"
              >
                <option value="" disabled>
                  Select month
                </option>
                {TRAINING_MONTHS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Date"
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                name="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>

            <SearchableSelect
              label="Hospital"
              value={hospital}
              onChange={setHospital}
              options={SAUDI_HOSPITAL_NAMES}
              required
            />

            <SearchableSelect
              label={
                stage === "advanced-training"
                  ? "Specialty or Training Program"
                  : "Specialty"
              }
              value={specialty}
              onChange={(next) => {
                setSpecialty(next);
                setSubspecialty("");
              }}
              options={specialtyOptions}
              required
            />

            {showSubspecialty ? (
              <SearchableSelect
                label="Subspecialty"
                value={subspecialty}
                onChange={setSubspecialty}
                options={subspecialtyOptions}
                required={false}
              />
            ) : null}

            {feePreview ? (
              <div className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-4 py-3">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Fee
                </p>
                <p className="mt-1 text-[0.9375rem] font-semibold text-mm-navy">
                  {formatTrainingFee(feePreview)}
                </p>
                <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                  Demo fee information. Payment collection comes later.
                </p>
              </div>
            ) : null}

            {error ? (
              <p className="text-[0.8125rem] font-medium text-mm-error-700">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
              >
                Submit Application
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  resetForm();
                }}
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </DashboardSection>

      <DashboardSection title="My Applications">
        {!hydrated ? (
          <p className="text-[0.875rem] text-mm-text-muted">Loading…</p>
        ) : applications.length === 0 ? (
          <p className="text-[0.875rem] text-mm-text-secondary">
            No applications yet. Submit your first{" "}
            {trainingTypeLabel(activeTrainingType).toLowerCase()} to track it here.
          </p>
        ) : (
          <ul className="space-y-3">
            {applications.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
