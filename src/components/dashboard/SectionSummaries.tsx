import type { SectionCounts } from "@/data/journey-dashboard";
import {
  DashboardSection,
  StatGrid,
} from "@/components/dashboard/DashboardSection";

export function ResearchSummary({ items }: { items: SectionCounts[] }) {
  return (
    <DashboardSection id="research" title="Research">
      <StatGrid items={items} />
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
        Browse recommended projects, manage your research, and review
        collaboration requests.
      </p>
    </DashboardSection>
  );
}

export function ConferencesSummary({ items }: { items: SectionCounts[] }) {
  return (
    <DashboardSection id="conferences" title="Conferences">
      <StatGrid items={items} />
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
        Recommendations follow your healthcare field, specialty, and interests.
      </p>
    </DashboardSection>
  );
}

export function CareerSummary({
  items,
  locked = false,
}: {
  items: SectionCounts[];
  locked?: boolean;
}) {
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
            progress.
          </p>
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection id="career" title="Career Opportunities">
      <StatGrid items={items} />
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
        See recommended roles and keep track of opportunities you save.
      </p>
    </DashboardSection>
  );
}
