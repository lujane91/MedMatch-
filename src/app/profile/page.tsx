"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Input } from "@/components/ui";
import {
  fieldLabel,
  formatTrainingYearProgress,
  professionalLevelLabel,
  trainingStageLabel,
  type InternProfile,
} from "@/data/intern";
import { getInstitution, resolveStage } from "@/data/journey-dashboard";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

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

function buildDraft(profile: InternProfile): Partial<InternProfile> {
  return {
    fullName: profile.fullName,
    mobile: profile.mobile,
    email: profile.email,
    institutionEmail: profile.institutionEmail,
    university: profile.university,
    trainingInstitution: profile.trainingInstitution,
    currentYear: profile.currentYear,
    totalYears: profile.totalYears,
    specialty: profile.specialty,
    subspecialty: profile.subspecialty,
  };
}

export default function ProfilePage() {
  const { profile, hydrated, updateProfile } = useInternStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<InternProfile>>({});
  const [saved, setSaved] = useState(false);

  const stage = resolveStage(profile.trainingStage);

  const viewFields = useMemo(() => {
    const year = formatTrainingYearProgress(
      profile.currentYear,
      profile.totalYears,
    );
    const rows: { label: string; value: string }[] = [
      { label: "Full Name", value: profile.fullName },
      { label: "Mobile Number", value: profile.mobile },
      { label: "Personal Email", value: profile.email },
      { label: "Institutional Email", value: profile.institutionEmail },
      { label: "Healthcare Field", value: fieldLabel(profile.field) },
      { label: "Journey Stage", value: trainingStageLabel(stage) },
    ];

    if (stage === "medical-student" || stage === "intern") {
      rows.push({
        label: "University",
        value: profile.university || getInstitution(profile),
      });
      if (year) {
        rows.push({
          label:
            stage === "medical-student"
              ? "Current Academic Year"
              : "Current Internship Year",
          value: year,
        });
      }
    }

    if (
      stage === "advanced-training" ||
      stage === "resident" ||
      stage === "fellow"
    ) {
      rows.push({
        label: "Hospital or Training Institution",
        value: profile.trainingInstitution,
      });
      rows.push({
        label:
          stage === "advanced-training"
            ? "Specialty or Training Program"
            : "Specialty",
        value: profile.specialty,
      });
      if (stage === "fellow" && profile.subspecialty.trim()) {
        rows.push({ label: "Subspecialty", value: profile.subspecialty });
      }
      if (year) {
        rows.push({
          label:
            stage === "advanced-training"
              ? "Current Training Year"
              : stage === "resident"
                ? "Current Residency Year"
                : "Current Fellowship Year",
          value: year,
        });
      }
    }

    if (stage === "medical-practice") {
      const level = professionalLevelLabel(profile.professionalLevel);
      if (level) rows.push({ label: "Professional Level", value: level });
      rows.push({ label: "Specialty", value: profile.specialty });
      if (profile.subspecialty.trim()) {
        rows.push({ label: "Subspecialty", value: profile.subspecialty });
      }
      if (profile.trainingInstitution.trim()) {
        rows.push({
          label: "Current Institution",
          value: profile.trainingInstitution,
        });
      }
    }

    return rows.filter((row) => row.value.trim());
  }, [profile, stage]);

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    updateProfile({
      fullName: draft.fullName?.trim() || profile.fullName,
      mobile: draft.mobile?.trim() || profile.mobile,
      email: draft.email?.trim() || profile.email,
      institutionEmail:
        draft.institutionEmail?.trim() || profile.institutionEmail,
      university: draft.university?.trim() ?? profile.university,
      trainingInstitution:
        draft.trainingInstitution?.trim() ?? profile.trainingInstitution,
      currentYear: draft.currentYear ?? profile.currentYear,
      totalYears: draft.totalYears ?? profile.totalYears,
      specialty: draft.specialty?.trim() ?? profile.specialty,
      subspecialty: draft.subspecialty?.trim() ?? profile.subspecialty,
    });
    setEditing(false);
    setSaved(true);
  }

  if (!hydrated) {
    return (
      <AppShell title="Profile">
        <p className="text-mm-text-muted">Loading your profile…</p>
      </AppShell>
    );
  }

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

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.15rem] bg-mm-navy text-[1.125rem] font-semibold text-white">
            {initialsFromName(profile.fullName || "MJ")}
          </div>
          <div>
            <p className="text-[1.0625rem] font-semibold text-mm-navy">
              {profile.fullName || "MedJourney Member"}
            </p>
            <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
              {[trainingStageLabel(stage), fieldLabel(profile.field)]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </div>

        {!editing ? (
          <>
            <dl className="mt-6 grid gap-4 border-t border-mm-border pt-5 sm:grid-cols-2">
              {viewFields.map((field) => (
                <FieldRow
                  key={`${field.label}-${field.value}`}
                  label={field.label}
                  value={field.value}
                />
              ))}
            </dl>
            <button
              type="button"
              onClick={() => {
                setDraft(buildDraft(profile));
                setEditing(true);
                setSaved(false);
              }}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
            >
              Edit Profile
            </button>
            {saved ? (
              <p className="mt-3 text-[0.8125rem] font-medium text-mm-teal-700">
                Profile updated.
              </p>
            ) : null}
          </>
        ) : (
          <form className="mt-6 space-y-4 border-t border-mm-border pt-5" onSubmit={onSave}>
            <Input
              label="Full Name"
              name="fullName"
              value={draft.fullName || ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, fullName: e.target.value }))
              }
              required
            />
            <Input
              label="Mobile Number"
              name="mobile"
              value={draft.mobile || ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, mobile: e.target.value }))
              }
              required
            />
            <Input
              label="Personal Email"
              type="email"
              name="email"
              value={draft.email || ""}
              onChange={(e) =>
                setDraft((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
            <Input
              label="Institutional Email"
              type="email"
              name="institutionEmail"
              value={draft.institutionEmail || ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  institutionEmail: e.target.value,
                }))
              }
              required
            />

            {stage === "medical-student" || stage === "intern" ? (
              <>
                <Input
                  label="University"
                  name="university"
                  value={draft.university || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      university: e.target.value,
                    }))
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Current year"
                    name="currentYear"
                    value={draft.currentYear || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        currentYear: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Total years"
                    name="totalYears"
                    value={draft.totalYears || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        totalYears: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            ) : null}

            {stage === "advanced-training" ||
            stage === "resident" ||
            stage === "fellow" ? (
              <>
                <Input
                  label="Hospital or Training Institution"
                  name="trainingInstitution"
                  value={draft.trainingInstitution || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      trainingInstitution: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Specialty"
                  name="specialty"
                  value={draft.specialty || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      specialty: e.target.value,
                    }))
                  }
                />
                {stage === "fellow" ? (
                  <Input
                    label="Subspecialty"
                    name="subspecialty"
                    value={draft.subspecialty || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        subspecialty: e.target.value,
                      }))
                    }
                  />
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Current year"
                    name="currentYear"
                    value={draft.currentYear || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        currentYear: e.target.value,
                      }))
                    }
                  />
                  <Input
                    label="Total years"
                    name="totalYears"
                    value={draft.totalYears || ""}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        totalYears: e.target.value,
                      }))
                    }
                  />
                </div>
              </>
            ) : null}

            {stage === "medical-practice" ? (
              <>
                <Input
                  label="Specialty"
                  name="specialty"
                  value={draft.specialty || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      specialty: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Subspecialty"
                  name="subspecialty"
                  value={draft.subspecialty || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      subspecialty: e.target.value,
                    }))
                  }
                />
                <Input
                  label="Current Institution"
                  name="trainingInstitution"
                  value={draft.trainingInstitution || ""}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      trainingInstitution: e.target.value,
                    }))
                  }
                />
              </>
            ) : null}

            <p className="text-[0.8125rem] text-mm-text-muted">
              Healthcare Field and Journey Stage stay tied to your onboarding
              path in this prototype.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex min-h-11 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy",
                )}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        </section>
      </div>
    </AppShell>
  );
}
