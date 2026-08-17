"use client";

import { DEMO_SPECIALTIES, MONTHS } from "@/data/hospital-demo";
import { Input } from "@/components/ui/Input";
import {
  buttonSecondaryClass,
  selectClassName,
} from "@/components/hospital/hospital-ui";
import type { ApplicationFiltersState } from "@/lib/application-filters";
import { cn } from "@/lib/cn";

type ApplicationFiltersPanelProps = {
  filters: ApplicationFiltersState;
  onChange: (next: ApplicationFiltersState) => void;
  onClearAll: () => void;
  universities: string[];
  colleges: string[];
  nationalities: string[];
  className?: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-[0.875rem] font-semibold text-mm-navy">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function ApplicationFiltersPanel({
  filters,
  onChange,
  onClearAll,
  universities,
  colleges,
  nationalities,
  className,
}: ApplicationFiltersPanelProps) {
  function patch<K extends keyof ApplicationFiltersState>(
    key: K,
    value: ApplicationFiltersState[K],
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-mm-text-secondary">
          Filters apply inside the selected rotation month.
        </p>
        <button type="button" className={buttonSecondaryClass} onClick={onClearAll}>
          Clear all
        </button>
      </div>

      <Section title="Academic">
        <Field label="GPA minimum">
          <Input
            type="number"
            min={0}
            max={5}
            step="0.01"
            value={filters.gpaMin}
            onChange={(e) => patch("gpaMin", e.target.value)}
            placeholder="e.g. 3.50"
          />
        </Field>
        <Field label="GPA maximum">
          <Input
            type="number"
            min={0}
            max={5}
            step="0.01"
            value={filters.gpaMax}
            onChange={(e) => patch("gpaMax", e.target.value)}
            placeholder="e.g. 5.00"
          />
        </Field>
        <Field label="Academic grade (min)">
          <Input
            type="number"
            min={0}
            max={5}
            step="0.01"
            value={filters.academicGradeMin}
            onChange={(e) => patch("academicGradeMin", e.target.value)}
            placeholder="e.g. 4.00"
          />
        </Field>
        <Field label="Graduation year">
          <Input
            type="number"
            value={filters.graduationYear}
            onChange={(e) => patch("graduationYear", e.target.value)}
            placeholder="2026"
          />
        </Field>
        <Field label="Expected graduation date">
          <Input
            type="month"
            value={filters.expectedGraduationDate}
            onChange={(e) => patch("expectedGraduationDate", e.target.value)}
          />
        </Field>
        <Field label="University">
          <select
            className={selectClassName}
            value={filters.university}
            onChange={(e) => patch("university", e.target.value)}
          >
            <option value="">Any university</option>
            {universities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Affiliated hospital">
          <Input
            value={filters.affiliatedHospital}
            onChange={(e) => patch("affiliatedHospital", e.target.value)}
            placeholder="Hospital name"
          />
        </Field>
        <Field label="College">
          <select
            className={selectClassName}
            value={filters.college}
            onChange={(e) => patch("college", e.target.value)}
          >
            <option value="">Any college</option>
            {colleges.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Country">
          <Input
            value={filters.country}
            onChange={(e) => patch("country", e.target.value)}
            placeholder="Saudi Arabia"
          />
        </Field>
      </Section>

      <Section title="Application">
        <Field label="Specialty">
          <select
            className={selectClassName}
            value={filters.specialtyId}
            onChange={(e) =>
              patch("specialtyId", e.target.value as ApplicationFiltersState["specialtyId"])
            }
          >
            <option value="all">All specialties</option>
            {DEMO_SPECIALTIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Rotation month">
          <select
            className={selectClassName}
            value={filters.rotationMonth}
            onChange={(e) =>
              patch(
                "rotationMonth",
                e.target.value as ApplicationFiltersState["rotationMonth"],
              )
            }
          >
            <option value="all">Selected month only</option>
            {MONTHS.map((item) => (
              <option key={item.key} value={item.key}>
                {item.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Application date from">
          <Input
            type="date"
            value={filters.submittedFrom}
            onChange={(e) => patch("submittedFrom", e.target.value)}
          />
        </Field>
        <Field label="Application date to">
          <Input
            type="date"
            value={filters.submittedTo}
            onChange={(e) => patch("submittedTo", e.target.value)}
          />
        </Field>
        <Field label="Application status">
          <select
            className={selectClassName}
            value={filters.status}
            onChange={(e) =>
              patch("status", e.target.value as ApplicationFiltersState["status"])
            }
          >
            <option value="all">Any status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Waitlisted">Waitlisted</option>
          </select>
        </Field>
        <Field label="Internal / External">
          <select
            className={selectClassName}
            value={filters.applicantType}
            onChange={(e) =>
              patch(
                "applicantType",
                e.target.value as ApplicationFiltersState["applicantType"],
              )
            }
          >
            <option value="all">All students</option>
            <option value="Internal">Internal students</option>
            <option value="External">External students</option>
          </select>
        </Field>
        <Field label="First choice specialty">
          <select
            className={selectClassName}
            value={filters.firstChoiceSpecialtyId}
            onChange={(e) =>
              patch(
                "firstChoiceSpecialtyId",
                e.target.value as ApplicationFiltersState["firstChoiceSpecialtyId"],
              )
            }
          >
            <option value="all">Any</option>
            {DEMO_SPECIALTIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Second choice specialty">
          <select
            className={selectClassName}
            value={filters.secondChoiceSpecialtyId}
            onChange={(e) =>
              patch(
                "secondChoiceSpecialtyId",
                e.target.value as ApplicationFiltersState["secondChoiceSpecialtyId"],
              )
            }
          >
            <option value="all">Any</option>
            {DEMO_SPECIALTIES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Eligibility">
        <Field label="Requirements">
          <select
            className={selectClassName}
            value={filters.meetsRequirements}
            onChange={(e) =>
              patch(
                "meetsRequirements",
                e.target.value as ApplicationFiltersState["meetsRequirements"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Meets all requirements</option>
            <option value="no">Missing requirements</option>
          </select>
        </Field>
        <Field label="CV uploaded">
          <select
            className={selectClassName}
            value={filters.cvUploaded}
            onChange={(e) =>
              patch(
                "cvUploaded",
                e.target.value as ApplicationFiltersState["cvUploaded"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Transcript uploaded">
          <select
            className={selectClassName}
            value={filters.transcriptUploaded}
            onChange={(e) =>
              patch(
                "transcriptUploaded",
                e.target.value as ApplicationFiltersState["transcriptUploaded"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Certificates uploaded">
          <select
            className={selectClassName}
            value={filters.certificatesUploaded}
            onChange={(e) =>
              patch(
                "certificatesUploaded",
                e.target.value as ApplicationFiltersState["certificatesUploaded"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Publications available">
          <select
            className={selectClassName}
            value={filters.publicationsAvailable}
            onChange={(e) =>
              patch(
                "publicationsAvailable",
                e.target.value as ApplicationFiltersState["publicationsAvailable"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <Field label="Research available">
          <select
            className={selectClassName}
            value={filters.researchAvailable}
            onChange={(e) =>
              patch(
                "researchAvailable",
                e.target.value as ApplicationFiltersState["researchAvailable"],
              )
            }
          >
            <option value="all">Any</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
      </Section>

      <Section title="Personal">
        <Field label="Gender">
          <select
            className={selectClassName}
            value={filters.gender}
            onChange={(e) =>
              patch("gender", e.target.value as ApplicationFiltersState["gender"])
            }
          >
            <option value="all">Any</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </Field>
        <Field label="Nationality">
          <select
            className={selectClassName}
            value={filters.nationality}
            onChange={(e) => patch("nationality", e.target.value)}
          >
            <option value="">Any nationality</option>
            {nationalities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Languages">
          <Input
            value={filters.language}
            onChange={(e) => patch("language", e.target.value)}
            placeholder="e.g. English"
          />
        </Field>
      </Section>

      <Section title="Profile">
        <Field label="Profile completion % (min)">
          <Input
            type="number"
            min={0}
            max={100}
            value={filters.profileMin}
            onChange={(e) => patch("profileMin", e.target.value)}
            placeholder="70"
          />
        </Field>
        <Field label="Certificates (min)">
          <Input
            type="number"
            min={0}
            value={filters.certificatesMin}
            onChange={(e) => patch("certificatesMin", e.target.value)}
          />
        </Field>
        <Field label="Publications (min)">
          <Input
            type="number"
            min={0}
            value={filters.publicationsMin}
            onChange={(e) => patch("publicationsMin", e.target.value)}
          />
        </Field>
        <Field label="Research projects (min)">
          <Input
            type="number"
            min={0}
            value={filters.researchMin}
            onChange={(e) => patch("researchMin", e.target.value)}
          />
        </Field>
      </Section>
    </div>
  );
}
