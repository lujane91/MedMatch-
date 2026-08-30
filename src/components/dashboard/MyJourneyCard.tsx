import type { InternProfile } from "@/data/intern";
import {
  fieldLabel,
  formatTrainingYearProgress,
  trainingStageLabel,
} from "@/data/intern";
import type { PassportStamp } from "@/data/journey-dashboard";
import {
  getInstitution,
  getJourneyProgress,
  getMyJourneyFacts,
  resolveStage,
} from "@/data/journey-dashboard";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

type EducationItem = {
  level: string;
  title: string;
  detail: string;
};

function medicalStudentEducation(profile: InternProfile): EducationItem[] {
  const university = getInstitution(profile) || "King Saud University";
  const field = fieldLabel(profile.field);
  const year =
    formatTrainingYearProgress(profile.currentYear, profile.totalYears) ||
    "Year 4 of 6";

  return [
    {
      level: "High School",
      title: "Dhahran High School",
      detail: "Graduated 2022",
    },
    {
      level: "University",
      title: university,
      detail: [field !== "Healthcare" ? field : null, year]
        .filter(Boolean)
        .join(" · "),
    },
  ];
}

export function MyJourneyCard({
  profile,
  latestStamp,
}: {
  profile: InternProfile;
  latestStamp: PassportStamp | null;
}) {
  const stage = resolveStage(profile.trainingStage);
  const facts = getMyJourneyFacts(profile);
  const { percent, yearLabel } = getJourneyProgress(profile);
  const education =
    stage === "medical-student" ? medicalStudentEducation(profile) : null;

  return (
    <DashboardSection id="my-journey" title="My Journey">
      <p className="text-[0.9375rem] font-medium text-mm-navy">
        {trainingStageLabel(stage)}
      </p>

      {facts.length > 0 ? (
        <dl className="mt-4 space-y-3">
          {facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`}>
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                {fact.label}
              </dt>
              <dd className="mt-1 text-[0.9375rem] text-mm-navy">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {percent !== null ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between gap-3 text-[0.8125rem]">
            <span className="font-medium text-mm-navy">Progress</span>
            <span className="text-mm-text-muted">
              {yearLabel || `${percent}%`}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-mm-gray-100">
            <div
              className="h-full rounded-full bg-mm-teal transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ) : null}

      {education ? (
        <div className="mt-6 border-t border-mm-border pt-5">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Education
          </h3>
          <ul className="mt-3 space-y-3">
            {education.map((item) => (
              <li
                key={`${item.level}-${item.title}`}
                className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
              >
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  {item.level}
                </p>
                <p className="mt-1.5 text-[0.9375rem] font-semibold text-mm-navy">
                  {item.title}
                </p>
                <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                  {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {latestStamp ? (
        <div className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-3">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            Latest Stamp
          </p>
          <p className="mt-1.5 text-[0.875rem] font-semibold text-mm-navy">
            {latestStamp.title}
          </p>
          <p className="mt-1 text-[0.75rem] text-mm-text-muted">
            {latestStamp.earnedLabel} · Prototype demo
          </p>
        </div>
      ) : null}
    </DashboardSection>
  );
}
