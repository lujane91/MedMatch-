import type {
  TrainingHighlight,
  TrainingStat,
} from "@/data/journey-dashboard";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";

export function TrainingSummary({
  title,
  stats,
  highlights,
}: {
  title: string;
  stats: TrainingStat[];
  highlights: TrainingHighlight[];
}) {
  return (
    <DashboardSection id="training" title={title}>
      <StatGrid items={stats} />
      {highlights.length > 0 ? (
        <ul className={`${stats.length > 0 ? "mt-4" : ""} space-y-3`}>
          {highlights.map((item) => (
            <li
              key={`${item.title}-${item.detail}`}
              className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
            >
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                {item.title}
              </p>
              <p className="mt-1.5 text-[0.9375rem] font-semibold text-mm-navy">
                {item.detail}
              </p>
              {item.meta ? (
                <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                  {item.meta}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </DashboardSection>
  );
}
