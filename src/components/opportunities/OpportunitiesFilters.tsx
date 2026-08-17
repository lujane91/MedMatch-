"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { filterOptions } from "@/data/browse";
import { cn } from "@/lib/cn";

type ChipGroupProps = {
  label: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
};

function ChipGroup({ label, options, value, onChange }: ChipGroupProps) {
  return (
    <div>
      <p className="mb-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mm-text-muted">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = value === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(active ? null : option)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium transition-[background,color,border-color,transform] duration-[var(--mm-duration)]",
                active
                  ? "bg-mm-navy text-white shadow-mm-xs"
                  : "border border-mm-border bg-mm-white text-mm-text-secondary hover:border-mm-gray-300 hover:text-mm-navy",
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

export function OpportunitiesFilters() {
  const [query, setQuery] = useState("");
  const [profession, setProfession] = useState<string | null>("Medicine");
  const [specialty, setSpecialty] = useState<string | null>("Internal Medicine");
  const [city, setCity] = useState<string | null>(null);
  const [hospital, setHospital] = useState<string | null>(null);
  const [trainingType, setTrainingType] = useState<string | null>(null);
  const [matchPct, setMatchPct] = useState<string | null>("80%+");
  const [status, setStatus] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);

  const reset = () => {
    setQuery("");
    setProfession(null);
    setSpecialty(null);
    setCity(null);
    setHospital(null);
    setTrainingType(null);
    setMatchPct(null);
    setStatus(null);
    setDeadline(null);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm sm:p-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            document.getElementById("recommended")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          <SearchInput
            label="Search opportunities"
            placeholder="Search by hospital, program, specialty, or city…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </form>
        <p className="mt-2.5 text-[0.75rem] text-mm-text-muted">
          {query.trim()
            ? `Showing curated matches related to “${query.trim()}”.`
            : "Search across hospitals, programs, specialties, and cities."}
        </p>
      </div>

      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6 lg:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal">
              Smart filters
            </p>
            <h2 className="mt-1 text-[1.125rem] font-semibold tracking-tight text-mm-navy">
              Tune recommendations to your path
            </h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="text-[0.8125rem] font-semibold text-mm-text-secondary transition-colors hover:text-mm-navy"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid gap-6 lg:gap-7">
          <ChipGroup
            label="Profession"
            options={filterOptions.professions}
            value={profession}
            onChange={setProfession}
          />
          <ChipGroup
            label="Specialty"
            options={filterOptions.specialties}
            value={specialty}
            onChange={setSpecialty}
          />
          <div className="grid gap-6 md:grid-cols-2">
            <ChipGroup
              label="City"
              options={filterOptions.cities}
              value={city}
              onChange={setCity}
            />
            <ChipGroup
              label="Training type"
              options={filterOptions.trainingTypes}
              value={trainingType}
              onChange={setTrainingType}
            />
          </div>
          <ChipGroup
            label="Hospital"
            options={filterOptions.hospitals}
            value={hospital}
            onChange={setHospital}
          />
          <div className="grid gap-6 md:grid-cols-3">
            <ChipGroup
              label="Match %"
              options={filterOptions.matchRanges}
              value={matchPct}
              onChange={setMatchPct}
            />
            <ChipGroup
              label="Application status"
              options={filterOptions.applicationStatuses}
              value={status}
              onChange={setStatus}
            />
            <ChipGroup
              label="Deadline"
              options={filterOptions.deadlines}
              value={deadline}
              onChange={setDeadline}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
