"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui";
import {
  hospitalById,
  internHospitals,
  overlaps,
  specialtiesByField,
  withinYear,
  type HealthcareField,
} from "@/data/intern";
import { cn } from "@/lib/cn";
import { newRotationDraft, useInternStore } from "@/lib/intern-store";

const steps = ["Dates", "Specialty", "Hospital", "Requirements", "Review"] as const;

export default function AddRotationPage() {
  const router = useRouter();
  const { profile, rotations, upsertRotation } = useInternStore();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState(`Rotation ${rotations.length + 1}`);
  const [startDate, setStartDate] = useState(profile.internshipStart);
  const [endDate, setEndDate] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);

  const field = (profile.field ?? "medicine") as HealthcareField;
  const specialties = specialtiesByField[field];

  const draft = useMemo(() => {
    if (!draftId) return null;
    return rotations.find((r) => r.id === draftId) ?? null;
  }, [draftId, rotations]);

  const ensureDraft = () => {
    if (draftId) {
      const existing = rotations.find((r) => r.id === draftId);
      if (existing) {
        const updated = {
          ...existing,
          title,
          startDate,
          endDate,
          specialty,
          preferences,
        };
        upsertRotation(updated);
        return updated;
      }
    }
    const created = newRotationDraft({
      title,
      startDate,
      endDate,
      specialty,
      preferences,
    });
    upsertRotation(created);
    setDraftId(created.id);
    return created;
  };

  const validateDates = () => {
    if (!title.trim() || !startDate || !endDate) {
      setError("Title, start date, and end date are required.");
      return false;
    }
    if (
      !withinYear(
        startDate,
        endDate,
        profile.internshipStart,
        profile.internshipEnd,
      )
    ) {
      setError("Dates must fall within your internship year.");
      return false;
    }
    const conflict = rotations.some(
      (r) =>
        r.id !== draftId &&
        overlaps(startDate, endDate, r.startDate, r.endDate),
    );
    if (conflict) {
      setError("These dates overlap with another rotation.");
      return false;
    }
    setError("");
    return true;
  };

  const next = () => {
    if (step === 0 && !validateDates()) return;
    if (step === 1 && !specialty) {
      setError("Select a specialty to continue.");
      return;
    }
    if (step === 2 && preferences.length === 0) {
      setError("Select at least a first-preference hospital.");
      return;
    }
    setError("");
    if (step === 2) {
      ensureDraft();
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const togglePreference = (hospitalId: string) => {
    setPreferences((prev) => {
      if (prev.includes(hospitalId)) {
        return prev.filter((id) => id !== hospitalId);
      }
      if (prev.length >= 3) return prev;
      return [...prev, hospitalId];
    });
  };

  const saveDraft = () => {
    if (!validateDates() || !specialty) {
      setError("Complete dates and specialty before saving a draft.");
      return;
    }
    const saved = ensureDraft();
    router.push(`/internship/${saved.id}`);
  };

  const submit = () => {
    const saved = ensureDraft();
    const missing = saved.requirements.some(
      (r) => r.required && r.status === "pending",
    );
    if (missing) {
      setError("Complete all mandatory requirements before submitting.");
      return;
    }
    upsertRotation({
      ...saved,
      status: "Submitted",
      timeline: saved.timeline.map((t, i) =>
        i <= 2 ? { ...t, done: true } : t,
      ),
    });
    router.push(`/internship/${saved.id}`);
  };

  return (
    <AppShell title="Add Rotation">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-[family-name:var(--mm-font-display)] text-3xl tracking-tight text-mm-navy">
            Add Rotation
          </h1>
          <p className="mt-2 text-mm-text-secondary">
            Step {step + 1} of {steps.length}: {steps[step]}
          </p>
          <div className="mt-4 flex gap-1.5">
            {steps.map((label, i) => (
              <div
                key={label}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i <= step ? "bg-mm-teal" : "bg-mm-gray-100",
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 sm:p-6">
          {step === 0 ? (
            <div className="space-y-4">
              <Input
                label="Rotation title or number"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Start date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Input
                  label="End date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <p className="text-[0.8125rem] text-mm-text-muted">
                Internship year: {profile.internshipStart} →{" "}
                {profile.internshipEnd}
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {specialties.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSpecialty(item)}
                  className={cn(
                    "rounded-[var(--mm-radius-lg)] border px-4 py-3 text-left text-[0.875rem] font-medium",
                    specialty === item
                      ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                      : "border-mm-border text-mm-navy hover:border-mm-teal/40",
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <p className="text-[0.875rem] text-mm-text-secondary">
                Choose up to three hospitals. The first selected becomes your
                first preference.
              </p>
              {internHospitals.map((hospital) => {
                const rank = preferences.indexOf(hospital.id);
                return (
                  <button
                    key={hospital.id}
                    type="button"
                    onClick={() => togglePreference(hospital.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[var(--mm-radius-xl)] border p-4 text-left",
                      rank >= 0
                        ? "border-mm-teal bg-mm-teal-50/50"
                        : "border-mm-border bg-mm-white",
                    )}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[12px] bg-mm-gray-50 ring-1 ring-mm-border">
                      {hospital.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={hospital.logo}
                          alt=""
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[0.6875rem] font-bold text-mm-navy">
                          H
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.9375rem] font-semibold text-mm-navy">
                          {hospital.name}
                        </p>
                        {rank >= 0 ? (
                          <span className="rounded-full bg-mm-teal px-2 py-0.5 text-[0.6875rem] font-semibold text-white">
                            Preference {rank + 1}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                        {hospital.city} · {hospital.availableDates}
                      </p>
                      <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                        Deadline: {hospital.deadline} · {hospital.eligibility}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              {(draft?.requirements ?? []).map((req) => (
                <div
                  key={req.id}
                  className="rounded-[var(--mm-radius-lg)] border border-mm-border p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-[0.875rem] font-semibold text-mm-navy">
                        {req.name}
                      </p>
                      <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                        {req.instructions}
                      </p>
                    </div>
                    <span className="rounded-full bg-mm-gray-100 px-2.5 py-0.5 text-[0.6875rem] font-semibold text-mm-text-muted">
                      {req.required ? "Required" : "Optional"} ·{" "}
                      {req.status === "uploaded" ? "Complete" : "Pending"}
                    </span>
                  </div>
                  {draftId ? (
                    <RequirementUpload
                      rotationId={draftId}
                      requirementId={req.id}
                      uploaded={req.status === "uploaded"}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4 text-[0.875rem]">
              <SummaryRow label="Dates" value={`${startDate} → ${endDate}`} />
              <SummaryRow label="Specialty" value={specialty} />
              <SummaryRow
                label="Hospital preferences"
                value={preferences
                  .map((id, i) => `${i + 1}. ${hospitalById(id)?.name ?? id}`)
                  .join(" · ")}
              />
              <SummaryRow
                label="Documents"
                value={`${draft?.requirements.filter((r) => r.status === "uploaded").length ?? 0} uploaded`}
              />
              <SummaryRow
                label="Missing required"
                value={
                  draft?.requirements
                    .filter((r) => r.required && r.status === "pending")
                    .map((r) => r.name)
                    .join(", ") || "None"
                }
              />
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-[0.8125rem] font-medium text-mm-error-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy"
              >
                Back
              </button>
            ) : (
              <Link
                href="/internship"
                className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy"
              >
                Cancel
              </Link>
            )}
            <button
              type="button"
              onClick={saveDraft}
              className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy"
            >
              Save as Draft
            </button>
          </div>

          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
            >
              {step === 3 ? "Continue Later / Review" : "Continue"}
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              className="inline-flex min-h-11 items-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
        {label}
      </p>
      <p className="mt-1 font-medium text-mm-navy">{value}</p>
    </div>
  );
}

function RequirementUpload({
  rotationId,
  requirementId,
  uploaded,
}: {
  rotationId: string;
  requirementId: string;
  uploaded: boolean;
}) {
  const { markRequirementUploaded } = useInternStore();
  return (
    <button
      type="button"
      onClick={() => markRequirementUploaded(rotationId, requirementId)}
      className={cn(
        "mt-3 inline-flex min-h-9 items-center rounded-[10px] px-3 text-[0.8125rem] font-semibold",
        uploaded
          ? "bg-mm-teal-50 text-mm-teal-700"
          : "border border-mm-border bg-mm-white text-mm-navy",
      )}
    >
      {uploaded ? "Uploaded" : "Upload / Complete"}
    </button>
  );
}
