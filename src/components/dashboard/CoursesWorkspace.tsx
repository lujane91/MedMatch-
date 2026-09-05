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
  COURSE_CITIES,
  COURSE_COUNTRIES,
  COURSE_FIELD_OPTIONS,
  COURSE_TYPES,
  courseMatchScore,
  courseMatchesSearch,
  formatCourseDateRange,
  isCourseUpcoming,
  preferencesFromProfile,
  type CourseRecord,
} from "@/data/courses";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { useCourseStore } from "@/lib/course-store";
import { cn } from "@/lib/cn";

function CourseCard({
  course,
  saved,
  onToggleSave,
}: {
  course: CourseRecord;
  saved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={`/courses/${course.id}`}
            className="text-[0.9375rem] font-semibold text-mm-navy hover:text-mm-teal"
          >
            {course.title}
          </Link>
          <p className="mt-1.5 text-[0.8125rem] font-medium text-mm-navy">
            Provider: {course.provider}
          </p>
          <p className="mt-0.5 text-[0.8125rem] text-mm-text-secondary">
            {course.institution}
          </p>
          <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
            {course.city}, {course.country}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-mm-gray-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-text-muted">
          {course.courseType}
        </span>
      </div>
      <div className="mt-3 space-y-1 text-[0.8125rem] text-mm-text-muted">
        <p className="font-medium text-mm-navy">
          {formatCourseDateRange(course.startDate, course.endDate)}
        </p>
        <p>
          {course.healthcareFields[0]}
          {course.specialty ? ` · ${course.specialty}` : ""}
        </p>
        {course.certification ? (
          <p className="text-mm-text-secondary">{course.category}</p>
        ) : (
          <p>{course.category}</p>
        )}
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
          {saved ? "Saved" : "Save Course"}
        </button>
        <Link
          href={`/courses/${course.id}`}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.8125rem] font-semibold text-white"
        >
          View Course
        </Link>
      </div>
    </article>
  );
}

export function CoursesWorkspace({
  profile,
  compact = false,
}: {
  profile: InternProfile;
  compact?: boolean;
}) {
  const {
    hydrated,
    courses,
    savedIds,
    preferences,
    toggleSave,
    isSaved,
    setPreferences,
  } = useCourseStore();
  const [prefsSeeded, setPrefsSeeded] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
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
  const providerOptions = useMemo(
    () => Array.from(new Set(courses.map((c) => c.provider))).sort(),
    [courses],
  );

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (!courseMatchesSearch(c, search)) return false;
      if (
        filterField &&
        !c.healthcareFields.includes(filterField as never)
      ) {
        return false;
      }
      if (
        filterSpecialty &&
        !c.specialty.toLowerCase().includes(filterSpecialty.toLowerCase()) &&
        !c.category.toLowerCase().includes(filterSpecialty.toLowerCase())
      ) {
        return false;
      }
      if (filterType && c.courseType !== filterType) return false;
      if (filterCity && c.city !== filterCity) return false;
      if (filterCountry && c.country !== filterCountry) return false;
      if (
        filterProvider &&
        !c.provider.toLowerCase().includes(filterProvider.toLowerCase())
      ) {
        return false;
      }
      if (dateFrom && c.startDate < dateFrom) return false;
      return true;
    });
  }, [
    courses,
    dateFrom,
    filterCity,
    filterCountry,
    filterField,
    filterProvider,
    filterSpecialty,
    filterType,
    search,
  ]);

  const recommended = useMemo(() => {
    return [...filtered]
      .filter((c) => isCourseUpcoming(c))
      .map((c) => ({ c, score: courseMatchScore(c, preferences) }))
      .sort((a, b) => b.score - a.score || a.c.startDate.localeCompare(b.c.startDate))
      .map((x) => x.c);
  }, [filtered, preferences]);

  const upcoming = useMemo(() => {
    return [...filtered]
      .filter((c) => isCourseUpcoming(c))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [filtered]);

  const saved = useMemo(
    () => courses.filter((c) => savedIds.includes(c.id)),
    [courses, savedIds],
  );

  if (!hydrated) {
    return <p className="text-mm-text-muted">Loading courses…</p>;
  }

  if (compact) {
    return (
      <DashboardSection
        id="courses"
        title="Courses"
        action={
          <Link
            href="/courses"
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Open
          </Link>
        }
      >
        <StatGrid
          items={[
            {
              label: "Recommended",
              value: String(Math.min(recommended.length, 5)),
            },
            { label: "Upcoming", value: String(upcoming.length) },
            { label: "Saved", value: String(saved.length) },
          ]}
        />
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
          Discover certification, clinical skills, and specialty workshops
          across healthcare fields.
        </p>
      </DashboardSection>
    );
  }

  function SectionList({
    title,
    items,
  }: {
    title: string;
    items: CourseRecord[];
  }) {
    return (
      <DashboardSection title={title}>
        {items.length === 0 ? (
          <p className="text-[0.875rem] text-mm-text-muted">No courses yet.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((course) => (
              <li key={course.id}>
                <CourseCard
                  course={course}
                  saved={isSaved(course.id)}
                  onToggleSave={() => toggleSave(course.id)}
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
      <DashboardSection title="Courses">
        <StatGrid
          items={[
            { label: "Recommended", value: String(recommended.length) },
            { label: "Upcoming", value: String(upcoming.length) },
            { label: "Saved", value: String(saved.length) },
          ]}
        />
        <p className="mt-4 text-[0.875rem] text-mm-text-secondary">
          Medical and healthcare courses, certifications, and workshops. Demo
          listings for product exploration.
        </p>
        <div className="mt-4 space-y-3">
          <Input
            label="Search courses"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Course name, provider, specialty, city…"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
          >
            Filters
          </button>
        </div>
      </DashboardSection>

      {filtersOpen ? (
        <div className="space-y-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm">
          <SearchableSelect
            label="Healthcare Field"
            value={filterField}
            onChange={setFilterField}
            options={COURSE_FIELD_OPTIONS}
            allowOther={false}
          />
          <SearchableSelect
            label="Specialty"
            value={filterSpecialty}
            onChange={setFilterSpecialty}
            options={
              specialtyOptions.length
                ? specialtyOptions
                : ["Emergency Medicine", "Cardiology", "Pediatrics"]
            }
          />
          <SearchableSelect
            label="Course Type"
            value={filterType}
            onChange={setFilterType}
            options={COURSE_TYPES}
            allowOther={false}
          />
          <SearchableSelect
            label="City"
            value={filterCity}
            onChange={setFilterCity}
            options={COURSE_CITIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Country"
            value={filterCountry}
            onChange={setFilterCountry}
            options={COURSE_COUNTRIES}
            allowOther={false}
          />
          <SearchableSelect
            label="Provider"
            value={filterProvider}
            onChange={setFilterProvider}
            options={providerOptions}
          />
          <Input
            label="Date from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              setFilterField("");
              setFilterSpecialty("");
              setFilterType("");
              setFilterCity("");
              setFilterCountry("");
              setFilterProvider("");
              setDateFrom("");
            }}
            className="text-[0.8125rem] font-semibold text-mm-teal"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      <SectionList
        title="Recommended for You"
        items={recommended.slice(0, 6)}
      />
      <SectionList title="Upcoming Courses" items={upcoming} />
      <SectionList title="Saved Courses" items={saved} />
    </div>
  );
}
