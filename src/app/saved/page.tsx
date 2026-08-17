import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { OpportunityCard } from "@/components/OpportunityCard";
import {
  AppEmptyState,
  BackToDashboard,
  PageHeader,
} from "@/components/PageChrome";
import { Bookmark } from "@/components/ui/icons";
import { getSavedOpportunities } from "@/data/mock";

export default function SavedPage() {
  const saved = getSavedOpportunities();

  return (
    <AppShell>
      <div className="mm-page space-y-8 mm-animate-fade-up">
        <PageHeader
          eyebrow="Bookmarks"
          title="Saved opportunities"
          description={
            saved.length > 0
              ? `${saved.length} roles bookmarked for later review.`
              : "Keep promising programs here while you compare and prepare."
          }
          action={
            <Link
              href="/opportunities"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-[1.125rem] text-[0.875rem] font-semibold text-mm-navy transition-[transform,box-shadow] duration-[var(--mm-duration)] hover:-translate-y-px hover:shadow-mm-sm"
            >
              Browse more
            </Link>
          }
        />

        {saved.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {saved.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <AppEmptyState
            icon={<Bookmark size={18} strokeWidth={1.75} />}
            title="No saved opportunities yet"
            description="Bookmark roles from Browse Opportunities to build a shortlist before you apply."
            action={
              <Link
                href="/opportunities"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
              >
                Explore opportunities
              </Link>
            }
          />
        )}

        <BackToDashboard />
      </div>
    </AppShell>
  );
}
