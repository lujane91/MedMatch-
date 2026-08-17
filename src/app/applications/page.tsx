import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BackToDashboard, PageHeader } from "@/components/PageChrome";
import { Badge, Caption, Card, CardTitle } from "@/components/ui";
import { Calendar, ArrowRight } from "@/components/ui/icons";
import { applications, opportunities } from "@/data/mock";

const statusTone: Record<
  string,
  "neutral" | "navy" | "warning" | "success" | "teal"
> = {
  Submitted: "neutral",
  "Under Review": "navy",
  Interview: "warning",
  Accepted: "success",
  Declined: "neutral",
};

function opportunityHref(opportunityId: string) {
  const match = opportunities.find((o) => o.id === opportunityId);
  return match ? `/opportunities/${match.slug}` : "/opportunities";
}

export default function ApplicationsPage() {
  return (
    <AppShell>
      <div className="mm-page-narrow space-y-8 mm-animate-fade-up">
        <PageHeader
          eyebrow="Pipeline"
          title="Your applications"
          description="Track status updates across all submitted training opportunities."
          action={
            <Link
              href="/opportunities"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
            >
              Find more roles
              <ArrowRight size={16} strokeWidth={2.25} />
            </Link>
          }
        />

        <Card className="divide-y divide-mm-border overflow-hidden p-0">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-4 px-5 py-5 transition-colors duration-[var(--mm-duration)] hover:bg-mm-gray-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle>{app.title}</CardTitle>
                  <Badge tone={statusTone[app.status] ?? "neutral"}>
                    {app.status}
                  </Badge>
                </div>
                <Caption className="mt-1">{app.hospital}</Caption>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[0.75rem] text-mm-text-muted">
                  <Calendar size={12} strokeWidth={1.75} />
                  Submitted {app.submittedAt} · Updated {app.updatedAt}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={opportunityHref(app.opportunityId)}
                  className="inline-flex min-h-10 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
                >
                  View role
                </Link>
                <Link
                  href="/notifications"
                  className="inline-flex min-h-10 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-navy px-4 text-[0.8125rem] font-semibold text-white transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-navy-800"
                >
                  Updates
                </Link>
              </div>
            </div>
          ))}
        </Card>

        <BackToDashboard />
      </div>
    </AppShell>
  );
}
