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

export function CareerSummary({ items }: { items: SectionCounts[] }) {
  return (
    <DashboardSection id="career" title="Career Opportunities">
      <StatGrid items={items} />
      <p className="mt-4 text-[0.8125rem] leading-relaxed text-mm-text-muted">
        See recommended roles and keep track of opportunities you save.
      </p>
    </DashboardSection>
  );
}
