"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from "@/components/ui";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";
import type { InternProfile } from "@/data/intern";
import {
  CAREER_CITIES,
  CAREER_COUNTRIES,
  CAREER_FIELD_OPTIONS,
  ORGANIZATION_TYPES,
  careerMatchScore,
  careerPreferencesFromProfile,
  formatCareerDate,
  isCareerLockedForStage,
  type CareerOpportunity,
} from "@/data/career";
import { JOURNEY_STAGE_LABELS, toStageLabel } from "@/data/research";
import { resolveStage } from "@/data/journey-dashboard";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { useCareerStore } from "@/lib/career-store";
import { useMedJourneyNotifications } from "@/lib/medjourney-notification-store";
import { cn } from "@/lib/cn";

function OpportunityCard({
  opportunity,
  saved,
  onToggleSave,
}: {
  opportunity: CareerOpportunity;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            {opportunity.jobTitle}
          </h3>
          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
            {opportunity.organizationName}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
          {opportunity.organizationType}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p>
          {opportunity.healthcareField}
          {opportunity.specialty ? ` · ${opportunity.specialty}` : ""}
        </p>
        <p>
          {opportunity.city}, {opportunity.country}
        </p>
        <p>Posted {formatCareerDate(opportunity.postedDate)}</p>
        {opportunity.closingDate ? (
          <p>Closes {formatCareerDate(opportunity.closingDate)}</p>
        ) : null}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onToggleSave}
          className={cn(
            "min-h-10 flex-1 rounded-[var(--mm-radius-lg)] border text-[0.8125rem] font-semibold",
            saved
              ? "border-mm-teal bg-mm-teal-50 text-mm-teal"
              : "border-mm-border text-mm-navy",
          )}
        >
          {saved ? "Saved" : "Save"}
        </button>
        <a
          href={opportunity.externalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
        >
          View Opportunity
        </a>
      </div>
    </article>
  );
}

export function CareerWorkspace({
  profile,
  compact = false,
}: {
  profile: InternProfile;
  compact?: boolean;
}) {
  const locked = isCareerLockedForStage(resolveStage(profile.trainingStage));
  const {
    hydrated,
    opportunities,
    savedIds,
    preferences,
    toggleSave,
    isSaved,
    setPreferences,
  } = useCareerStore();
  const { addNotification } = useMedJourneyNotifications();
  const [prefsSeeded, setPrefsSeeded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [field, setField] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [orgType, setOrgType] = useState("");
  const [stage, setStage] = useState("");

  useEffect(() => {
    if (!hydrated || prefsSeeded) return;
    const empty =
      preferences.healthcareFields.length === 0 &&
      preferences.specialties.length === 0;
    if (empty) {
      setPreferences(careerPreferencesFromProfile(profile));
    }
    setPrefsSeeded(true);
  }, [hydrated, prefsSeeded, preferences, profile, setPreferences]);

  const specialtyOptions = getSpecialtiesForField(profile.field);
  const userStage = toStageLabel(profile.trainingStage);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (field && o.healthcareField !== field) return false;
      if (
        specialty &&
        !(o.specialty || "").toLowerCase().includes(specialty.toLowerCase())
      ) {
        return false;
      }
      if (country && o.country !== country) return false;
      if (city && o.city !== city) return false;
      if (orgType && o.organizationType !== orgType) return false;
      if (
        stage &&
        o.journeyStages &&
        !o.journeyStages.includes(stage as never)
      ) {
        return false;
      }
      return true;
    });
  }, [city, country, field, opportunities, orgType, specialty, stage]);

  const ranked = useMemo(() => {
    return [...filtered]
      .map((o) => ({
        o,
        score: careerMatchScore(o, preferences, userStage),
      }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.o);
  }, [filtered, preferences, userStage]);

  const saved = useMemo(
    () => opportunities.filter((o) => savedIds.includes(o.id)),
    [opportunities, savedIds],
  );

  if (!hydrated) {
    return <p className="text-mm-text-muted">Loading career opportunities…</p>;
  }

  if (locked) {
    return (
      <DashboardSection id="career" title="Career Opportunities">
        <div className="rounded-[var(--mm-radius-lg)] border border-dashed border-mm-border bg-mm-gray-50 px-4 py-5 text-center">
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            Locked
          </p>
          <p className="mt-2 text-[0.9375rem] font-medium text-mm-navy">
            Available later in your journey
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-mm-text-muted">
            Career Opportunities stay part of MedJourney and open as you
            progress. Job listings are not shown for Medical Students.
          </p>
        </div>
      </DashboardSection>
    );
  }

  if (compact) {
    return (
      <DashboardSection
        id="career"
        title="Career Opportunities"
        action={
          <Link
            href="/career"
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Open
          </Link>
        }
      >
        <StatGrid
          items={[
            { label: "New Opportunities", value: String(ranked.length) },
            { label: "Saved Opportunities", value: String(saved.length) },
          ]}
        />
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
          Discover trusted healthcare career postings. Applications happen on
          the original organization site.
        </p>
      </DashboardSection>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardSection title="Career Opportunities">
        <StatGrid
          items={[
            { label: "New Opportunities", value: String(ranked.length) },
            { label: "Saved Opportunities", value: String(saved.length) },
          ]}
        />
        <p className="mt-4 text-[0.875rem] text-mm-text-secondary">
          MedJourney helps you discover trusted opportunities. MedJourney is not
          the recruiter and does not process job applications.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
          >
            Filters
          </button>
          <button
            type="button"
            onClick={() => setPrefsOpen((v) => !v)}
            className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
          >
            Preferences
          </button>
          <button
            type="button"
            onClick={() =>
              addNotification({
                category: "career",
                title: "Career opportunity",
                message:
                  "King Faisal Specialist Hospital posted a new Emergency Medicine opportunity.",
                relatedRecordId: "career-1",
                actionHref: "/career",
              })
            }
            className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-text-muted"
          >
            Demo notification
          </button>
        </div>
      </DashboardSection>

      {filtersOpen ? (
        <div className="space-y-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm">
          <SearchableSelect
            label="Healthcare Field"
            value={field}
            onChange={setField}
            options={CAREER_FIELD_OPTIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Specialty"
            value={specialty}
            onChange={setSpecialty}
            options={
              specialtyOptions.length
                ? specialtyOptions
                : ["Emergency Medicine", "Internal Medicine", "Critical Care Nursing"]
            }
          />
          <SearchableSelect
            label="Country"
            value={country}
            onChange={setCountry}
            options={CAREER_COUNTRIES}
            allowOther={false}
          />
          <SearchableSelect
            label="City"
            value={city}
            onChange={setCity}
            options={CAREER_CITIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Organization Type"
            value={orgType}
            onChange={setOrgType}
            options={ORGANIZATION_TYPES}
            allowOther={false}
          />
          <SearchableSelect
            label="Journey Stage / Professional Level"
            value={stage}
            onChange={setStage}
            options={JOURNEY_STAGE_LABELS}
            allowOther={false}
          />
          <button
            type="button"
            onClick={() => {
              setField("");
              setSpecialty("");
              setCountry("");
              setCity("");
              setOrgType("");
              setStage("");
            }}
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {prefsOpen ? (
        <div className="space-y-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm">
          <p className="text-[0.875rem] text-mm-text-secondary">
            Notification preferences are separate from your profile and can be
            edited anytime.
          </p>
          <SearchableSelect
            label="Healthcare Field"
            value={preferences.healthcareFields[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                healthcareFields: v ? [v as never] : [],
              })
            }
            options={CAREER_FIELD_OPTIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Specialty"
            value={preferences.specialties[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                specialties: v ? [v] : [],
              })
            }
            options={
              specialtyOptions.length
                ? specialtyOptions
                : ["Emergency Medicine", "Cardiology"]
            }
          />
          <SearchableSelect
            label="Preferred City"
            value={preferences.preferredCities[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                preferredCities: v ? [v] : [],
              })
            }
            options={CAREER_CITIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Preferred Country"
            value={preferences.preferredCountries[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                preferredCountries: v ? [v] : [],
              })
            }
            options={CAREER_COUNTRIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Organization Type"
            value={preferences.organizationTypes[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                organizationTypes: v ? [v as never] : [],
              })
            }
            options={ORGANIZATION_TYPES}
            allowOther={false}
          />
        </div>
      ) : null}

      <DashboardSection title="Trusted Opportunities">
        {ranked.length === 0 ? (
          <p className="text-[0.875rem] text-mm-text-muted">
            No opportunities match these filters.
          </p>
        ) : (
          <ul className="space-y-3">
            {ranked.map((opportunity) => (
              <li key={opportunity.id}>
                <OpportunityCard
                  opportunity={opportunity}
                  saved={isSaved(opportunity.id)}
                  onToggleSave={() => toggleSave(opportunity.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>

      <DashboardSection title="Saved Opportunities">
        {saved.length === 0 ? (
          <p className="text-[0.875rem] text-mm-text-muted">None saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {saved.map((opportunity) => (
              <li key={opportunity.id}>
                <OpportunityCard
                  opportunity={opportunity}
                  saved
                  onToggleSave={() => toggleSave(opportunity.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
