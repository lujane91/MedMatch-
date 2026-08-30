"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input, SearchableSelect } from "@/components/ui";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";
import type { InternProfile } from "@/data/intern";
import {
  CONFERENCE_COUNTRIES,
  CONFERENCE_FIELD_OPTIONS,
  CONFERENCE_TYPES,
  conferenceMatchScore,
  formatConferenceDateRange,
  preferencesFromProfile,
  type ConferenceLocationType,
  type ConferenceRecord,
} from "@/data/conferences";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { useConferenceStore } from "@/lib/conference-store";
import { useMedJourneyNotifications } from "@/lib/medjourney-notification-store";
import { cn } from "@/lib/cn";

function ConferenceCard({
  conference,
  saved,
  onToggleSave,
}: {
  conference: ConferenceRecord;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            {conference.name}
          </h3>
          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
            {conference.city}, {conference.country}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
          {conference.locationType}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p>{formatConferenceDateRange(conference.startDate, conference.endDate)}</p>
        <p>
          {conference.healthcareFields.join(", ")}
          {conference.specialties[0] ? ` · ${conference.specialties[0]}` : ""}
        </p>
        <p>{conference.organizer}</p>
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
        {conference.externalUrl ? (
          <a
            href={conference.externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
          >
            View Conference
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function ConferencesWorkspace({
  profile,
  compact = false,
}: {
  profile: InternProfile;
  compact?: boolean;
}) {
  const {
    hydrated,
    conferences,
    savedIds,
    preferences,
    toggleSave,
    isSaved,
    setPreferences,
  } = useConferenceStore();
  const { addNotification } = useMedJourneyNotifications();
  const [prefsSeeded, setPrefsSeeded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [locationType, setLocationType] = useState<"" | ConferenceLocationType>(
    "",
  );
  const [country, setCountry] = useState("");
  const [field, setField] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [conferenceType, setConferenceType] = useState("");
  const [dateFrom, setDateFrom] = useState("");

  useEffect(() => {
    if (!hydrated || prefsSeeded) return;
    const empty =
      preferences.healthcareFields.length === 0 &&
      preferences.specialties.length === 0;
    if (empty) {
      setPreferences(preferencesFromProfile(profile));
    }
    setPrefsSeeded(true);
  }, [hydrated, prefsSeeded, preferences, profile, setPreferences]);

  const specialtyOptions = getSpecialtiesForField(profile.field);

  const filtered = useMemo(() => {
    return conferences.filter((c) => {
      if (locationType && c.locationType !== locationType) return false;
      if (country && c.country !== country) return false;
      if (field && !c.healthcareFields.includes(field as never)) return false;
      if (
        specialty &&
        !c.specialties.some((s) =>
          s.toLowerCase().includes(specialty.toLowerCase()),
        )
      ) {
        return false;
      }
      if (conferenceType && c.conferenceType !== conferenceType) return false;
      if (dateFrom && c.startDate < dateFrom) return false;
      return true;
    });
  }, [
    conferences,
    conferenceType,
    country,
    dateFrom,
    field,
    locationType,
    specialty,
  ]);

  const recommended = useMemo(() => {
    return [...filtered]
      .map((c) => ({ c, score: conferenceMatchScore(c, preferences) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.c);
  }, [filtered, preferences]);

  const upcoming = useMemo(() => {
    return [...filtered].sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [filtered]);

  const saved = useMemo(
    () => conferences.filter((c) => savedIds.includes(c.id)),
    [conferences, savedIds],
  );

  if (!hydrated) {
    return <p className="text-mm-text-muted">Loading conferences…</p>;
  }

  if (compact) {
    return (
      <DashboardSection
        id="conferences"
        title="Conferences"
        action={
          <Link
            href="/conferences"
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Open
          </Link>
        }
      >
        <StatGrid
          items={[
            { label: "Recommended", value: String(Math.min(recommended.length, 5)) },
            { label: "Upcoming", value: String(upcoming.length) },
            { label: "Saved", value: String(saved.length) },
          ]}
        />
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
          Discover national and international conferences matched to your
          interests.
        </p>
      </DashboardSection>
    );
  }

  function SectionList({
    title,
    items,
  }: {
    title: string;
    items: ConferenceRecord[];
  }) {
    return (
      <DashboardSection title={title}>
        {items.length === 0 ? (
          <p className="text-[0.875rem] text-mm-text-muted">No conferences yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((conference) => (
              <li key={conference.id}>
                <ConferenceCard
                  conference={conference}
                  saved={isSaved(conference.id)}
                  onToggleSave={() => toggleSave(conference.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    );
  }

  return (
    <div className="space-y-5">
      <DashboardSection title="Conferences">
        <StatGrid
          items={[
            { label: "Recommended", value: String(recommended.length) },
            { label: "Upcoming", value: String(upcoming.length) },
            { label: "Saved", value: String(saved.length) },
          ]}
        />
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
                category: "conferences",
                title: "Conference match",
                message:
                  "A new Internal Medicine conference was added in Saudi Arabia.",
                relatedRecordId: "conf-1",
                actionHref: "/conferences",
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
            label="Location Type"
            value={locationType}
            onChange={(v) => setLocationType(v as "" | ConferenceLocationType)}
            options={["Saudi Arabia", "International"]}
            allowOther={false}
          />
          <SearchableSelect
            label="Country"
            value={country}
            onChange={setCountry}
            options={CONFERENCE_COUNTRIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Healthcare Field"
            value={field}
            onChange={setField}
            options={CONFERENCE_FIELD_OPTIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Specialty"
            value={specialty}
            onChange={setSpecialty}
            options={specialtyOptions.length ? specialtyOptions : ["Internal Medicine", "Cardiology"]}
          />
          <Input
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <SearchableSelect
            label="Conference Type"
            value={conferenceType}
            onChange={setConferenceType}
            options={CONFERENCE_TYPES}
            allowOther={false}
          />
          <button
            type="button"
            onClick={() => {
              setLocationType("");
              setCountry("");
              setField("");
              setSpecialty("");
              setConferenceType("");
              setDateFrom("");
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
            Edit discovery preferences separately from your profile.
          </p>
          <SearchableSelect
            label="Primary Healthcare Field"
            value={preferences.healthcareFields[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                healthcareFields: v ? [v as never] : [],
              })
            }
            options={CONFERENCE_FIELD_OPTIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Primary Specialty"
            value={preferences.specialties[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                specialties: v ? [v] : [],
              })
            }
            options={specialtyOptions.length ? specialtyOptions : ["Internal Medicine", "Cardiology"]}
          />
          <SearchableSelect
            label="Preferred Country"
            value={preferences.countries[0] || ""}
            onChange={(v) =>
              setPreferences({
                ...preferences,
                countries: v ? [v] : [],
              })
            }
            options={CONFERENCE_COUNTRIES}
            allowOther={false}
          />
          <label className="flex items-center gap-2 text-[0.875rem] text-mm-navy">
            <input
              type="checkbox"
              checked={preferences.includeSaudi}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  includeSaudi: e.target.checked,
                })
              }
            />
            Saudi Conferences
          </label>
          <label className="flex items-center gap-2 text-[0.875rem] text-mm-navy">
            <input
              type="checkbox"
              checked={preferences.includeInternational}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  includeInternational: e.target.checked,
                })
              }
            />
            International Conferences
          </label>
        </div>
      ) : null}

      <SectionList title="Recommended For You" items={recommended.slice(0, 6)} />
      <SectionList title="Upcoming Conferences" items={upcoming} />
      <SectionList title="Saved Conferences" items={saved} />
    </div>
  );
}
