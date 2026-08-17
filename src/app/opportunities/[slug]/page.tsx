import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";
import { MobileApplyBar } from "@/components/opportunities/MobileApplyBar";
import { StickyApplyCard } from "@/components/opportunities/StickyApplyCard";
import { CircularProgress } from "@/components/profile/CircularProgress";
import {
  Badge,
  Body,
  Caption,
  Card,
  CardTitle,
  Label,
  SectionTitle,
} from "@/components/ui";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  ExternalLink,
  FileText,
  MapPin,
} from "@/components/ui/icons";
import { browseOpportunities } from "@/data/browse";
import {
  getOpportunityDetails,
  getSimilarOpportunities,
} from "@/data/opportunity-details";
import { getOpportunityBySlug, opportunities } from "@/data/mock";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ slug: opportunity.slug }));
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const opportunity = getOpportunityBySlug(slug);
  const details = getOpportunityDetails(slug);

  if (!opportunity || !details) {
    notFound();
  }

  const browse = browseOpportunities.find((o) => o.slug === slug);
  const seats = browse?.seats ?? 6;
  const status = browse?.applicationStatus ?? "Open";
  const hospitalMark = details.institution.mark;
  const similar = getSimilarOpportunities(slug, 3);

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl mm-animate-fade-up pb-[7.5rem] lg:pb-0">
        <Link
          href="/opportunities"
          className="mb-8 inline-flex items-center gap-2 text-[0.875rem] font-medium text-mm-text-muted transition-colors hover:text-mm-navy"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back to opportunities
        </Link>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
          <div className="space-y-10 lg:space-y-12">
            {/* Hero */}
            <section className="overflow-hidden rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
              <div
                className="relative px-6 py-8 text-white sm:px-8 sm:py-10 lg:px-10"
                style={{
                  background:
                    "linear-gradient(135deg, #0E3A5D 0%, #16486F 55%, #1FA6A0 120%)",
                }}
              >
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.25rem] border border-white/20 bg-white/10 text-[0.875rem] font-bold tracking-wide backdrop-blur-sm">
                    {hospitalMark}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.875rem] font-medium text-white/70">
                      {opportunity.hospital}
                    </p>
                    <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] tracking-[-0.03em]">
                      {opportunity.title}
                    </h1>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="teal" className="bg-white/15 text-white">
                        {opportunity.location}
                      </Badge>
                      <Badge tone="neutral" className="bg-white/15 text-white">
                        {opportunity.type}
                      </Badge>
                      <Badge tone="neutral" className="bg-white/15 text-white">
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <HeroStat icon={<Clock size={15} />} label="Duration" value={opportunity.duration} />
                  <HeroStat label="Deadline" value={opportunity.deadline} />
                  <HeroStat label="Seats available" value={`${seats}`} />
                  <HeroStat label="Status" value={status} />
                </div>
              </div>

              <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[auto_1fr] lg:items-center lg:px-10 lg:py-10">
                <div className="flex justify-center lg:justify-start">
                  <CircularProgress
                    value={opportunity.matchScore}
                    size={148}
                    strokeWidth={11}
                    label="Match score"
                  />
                </div>
                <div>
                  <Label>Why you match</Label>
                  <SectionTitle as="h2" className="mt-2">
                    Why you match this opportunity
                  </SectionTitle>
                  <ul className="mt-5 space-y-3">
                    {details.matchReasons.map((reason) => (
                      <li key={reason} className="flex gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mm-teal text-white">
                          <Check size={11} strokeWidth={2.5} />
                        </span>
                        <span className="text-[0.9375rem] leading-relaxed text-mm-text-secondary">
                          {reason}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Program Overview */}
            <section>
              <Label>Program</Label>
              <SectionTitle as="h2" className="mt-2">
                Program overview
              </SectionTitle>
              <Body className="mt-4 max-w-3xl text-[1.0625rem]">
                {details.overview.summary}
              </Body>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <OverviewBlock title="Objectives" items={details.overview.objectives} />
                <OverviewBlock
                  title="Training structure"
                  items={details.overview.trainingStructure}
                />
                <OverviewBlock
                  title="Clinical exposure"
                  items={details.overview.clinicalExposure}
                />
                <OverviewBlock
                  title="Learning outcomes"
                  items={details.overview.learningOutcomes}
                />
              </div>
            </section>

            {/* Requirements */}
            <section>
              <Label>Eligibility</Label>
              <SectionTitle as="h2" className="mt-2">
                Requirements
              </SectionTitle>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card className="p-5 sm:p-6 md:col-span-2">
                  <CardTitle>Eligibility</CardTitle>
                  <ul className="mt-4 space-y-2.5">
                    {details.requirements.eligibility.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[0.875rem] text-mm-text-secondary"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mm-teal" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
                <ReqCard title="SCFHS" body={details.requirements.scfhs} />
                <ReqCard title="Language" body={details.requirements.language} />
                <ReqCard title="Experience" body={details.requirements.experience} />
                <ReqCard title="GPA" body={details.requirements.gpa} />
                <Card className="p-5 sm:p-6 md:col-span-2">
                  <CardTitle>Documents</CardTitle>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {details.requirements.documents.map((doc) => (
                      <Badge key={doc} tone="navy">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            {/* Application Timeline */}
            <section>
              <Label>Process</Label>
              <SectionTitle as="h2" className="mt-2">
                Application timeline
              </SectionTitle>
              <Card className="mt-6 p-6 sm:p-8">
                <ol>
                  {details.timeline.map((step, index) => (
                    <li key={step.label} className="flex gap-4">
                      <div className="flex w-3 flex-col items-center">
                        <span
                          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                            step.state === "done"
                              ? "bg-mm-teal"
                              : step.state === "current"
                                ? "bg-mm-navy ring-[3px] ring-mm-navy/15"
                                : "bg-mm-gray-200"
                          }`}
                        />
                        {index < details.timeline.length - 1 ? (
                          <span
                            className="my-1 w-px flex-1 bg-mm-border"
                            style={{ minHeight: "2rem" }}
                          />
                        ) : null}
                      </div>
                      <div
                        className={`flex flex-1 flex-wrap items-baseline justify-between gap-2 ${
                          index < details.timeline.length - 1 ? "pb-6" : ""
                        }`}
                      >
                        <p
                          className={`min-w-0 break-words text-[0.9375rem] ${
                            step.state === "upcoming"
                              ? "text-mm-text-muted"
                              : "font-semibold text-mm-navy"
                          }`}
                        >
                          {step.label}
                        </p>
                        <Caption className="shrink-0">{step.date}</Caption>
                      </div>
                    </li>
                  ))}
                </ol>
              </Card>
            </section>

            {/* Required Documents */}
            <section>
              <Label>Checklist</Label>
              <SectionTitle as="h2" className="mt-2">
                Required documents
              </SectionTitle>
              <ul className="mt-6 space-y-3">
                {details.requiredDocuments.map((doc) => (
                  <li
                    key={doc.name}
                    className="flex flex-col gap-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-50 text-mm-navy">
                        <FileText size={18} strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-[0.875rem] font-semibold text-mm-navy">
                          {doc.name}
                        </p>
                        <Caption className="mt-0.5">{doc.note}</Caption>
                      </div>
                    </div>
                    <Badge
                      tone={
                        doc.status === "Uploaded"
                          ? "success"
                          : doc.status === "Missing"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>

            {/* Institution */}
            <section id="institution">
              <Label>Host</Label>
              <SectionTitle as="h2" className="mt-2">
                Institution
              </SectionTitle>
              <Card className="mt-6 overflow-hidden p-0">
                <div className="border-b border-mm-border bg-mm-gray-50 px-6 py-6 sm:px-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--mm-radius-xl)] bg-mm-navy text-[0.8125rem] font-bold text-white">
                      {details.institution.mark}
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--mm-font-display)] text-2xl tracking-tight text-mm-navy">
                        {details.institution.name}
                      </h3>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-[0.875rem] text-mm-text-muted">
                        <MapPin size={14} strokeWidth={1.75} />
                        {details.institution.location}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6 px-6 py-7 sm:px-8">
                  <div>
                    <CardTitle>Hospital overview</CardTitle>
                    <Body className="mt-3">{details.institution.overview}</Body>
                  </div>
                  <div>
                    <CardTitle>Training culture</CardTitle>
                    <Body className="mt-3">{details.institution.culture}</Body>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-3.5">
                      <Caption>Website</Caption>
                      <a
                        href={details.institution.website}
                        className="mt-1 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-mm-teal hover:text-mm-teal-700"
                      >
                        View host details
                        {details.institution.website.startsWith("http") ? (
                          <ExternalLink size={14} />
                        ) : null}
                      </a>
                    </div>
                    <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-3.5">
                      <Caption>Contact</Caption>
                      <p className="mt-1 text-[0.875rem] font-semibold text-mm-navy">
                        {details.institution.contact}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </section>

            {/* Similar Opportunities */}
            <section>
              <Label>Keep exploring</Label>
              <SectionTitle as="h2" className="mt-2">
                Similar opportunities
              </SectionTitle>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((item) => (
                  <Link
                    key={item.id}
                    href={`/opportunities/${item.slug}`}
                    className="group block min-w-0 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-xs transition-[transform,box-shadow,border-color] duration-[var(--mm-duration)] hover:-translate-y-1 hover:border-mm-teal/30 hover:shadow-mm-md"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <Badge tone="teal">{item.specialty}</Badge>
                      <span className="shrink-0 text-[0.875rem] font-bold text-mm-navy">
                        {item.matchScore}%
                      </span>
                    </div>
                    <p className="break-words text-[0.9375rem] font-semibold text-mm-navy group-hover:text-mm-teal-700">
                      {item.title}
                    </p>
                    <Caption className="mt-1.5">
                      {item.hospital} · {item.location}
                    </Caption>
                    <span className="mt-4 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-mm-teal">
                      View
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="pb-8 lg:pb-4">
              <Label>Help</Label>
              <SectionTitle as="h2" className="mt-2">
                Frequently asked questions
              </SectionTitle>
              <div className="mt-6 space-y-3">
                {details.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-5 py-1 open:shadow-mm-xs"
                  >
                    <summary className="cursor-pointer list-none py-4 text-[0.9375rem] font-semibold text-mm-navy marker:content-none [&::-webkit-details-marker]:hidden">
                      <span className="flex items-center justify-between gap-3">
                        {faq.question}
                        <span className="text-mm-text-muted transition-transform group-open:rotate-45">
                          +
                        </span>
                      </span>
                    </summary>
                    <Body className="border-t border-mm-border pb-5 pt-4 text-[0.875rem]">
                      {faq.answer}
                    </Body>
                  </details>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky right card */}
          <div className="hidden lg:block">
            <StickyApplyCard
              matchScore={opportunity.matchScore}
              profileCompletion={details.profileCompletion}
              deadline={opportunity.deadline}
              seats={seats}
              status={status}
              saved={opportunity.saved}
              title={opportunity.title}
            />
          </div>
        </div>

        <MobileApplyBar
          matchScore={opportunity.matchScore}
          seats={seats}
          deadline={opportunity.deadline}
          title={opportunity.title}
          saved={opportunity.saved}
        />
      </div>
    </AppShell>
  );
}

function HeroStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--mm-radius-lg)] border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur-sm">
      <p className="text-[0.6875rem] font-medium uppercase tracking-wide text-white/55">
        {label}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-white">
        {icon}
        {value}
      </p>
    </div>
  );
}

function OverviewBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <Card className="p-5 sm:p-6">
      <CardTitle>{title}</CardTitle>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-[0.875rem] leading-relaxed text-mm-text-secondary"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mm-teal" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function ReqCard({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
        <Building2 size={16} strokeWidth={1.75} />
      </div>
      <CardTitle>{title}</CardTitle>
      <Body className="mt-2 text-[0.875rem]">{body}</Body>
    </Card>
  );
}
