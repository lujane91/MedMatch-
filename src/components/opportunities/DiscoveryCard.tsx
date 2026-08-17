"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type MouseEvent, type ReactNode } from "react";
import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";
import { Badge, Caption, CardTitle } from "@/components/ui";
import { Bookmark, Clock, MapPin } from "@/components/ui/icons";
import type { BrowseOpportunity, OpportunityBadge } from "@/data/browse";
import { cn } from "@/lib/cn";

const badgeTone: Record<
  OpportunityBadge,
  "teal" | "navy" | "success" | "warning" | "error" | "neutral"
> = {
  New: "teal",
  "Closing Soon": "warning",
  "Highly Competitive": "navy",
  "Fast Response": "success",
  Popular: "neutral",
};

type DiscoveryCardProps = {
  opportunity: BrowseOpportunity;
  featured?: boolean;
};

export function DiscoveryCard({ opportunity, featured = false }: DiscoveryCardProps) {
  const router = useRouter();
  const href = `/opportunities/${opportunity.slug}`;

  const goToDetails = () => router.push(href);

  const stop = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={goToDetails}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          goToDetails();
        }
      }}
      className={cn(
        "group cursor-pointer rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm transition-[transform,box-shadow,border-color] duration-[var(--mm-duration)] ease-[var(--mm-ease-out)]",
        "hover:-translate-y-1 hover:border-mm-teal/30 hover:shadow-mm-md",
        "focus-visible:outline-none focus-visible:shadow-[var(--mm-shadow-focus)]",
        featured ? "p-6 sm:p-8" : "p-5 sm:p-6",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-navy font-bold tracking-wide text-white",
              featured ? "h-14 w-14 text-[0.75rem]" : "h-12 w-12 text-[0.6875rem]",
            )}
          >
            {opportunity.hospitalMark}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[0.875rem] font-semibold text-mm-navy">
              {opportunity.hospital}
            </p>
            <Caption className="mt-0.5">
              {opportunity.city} · {opportunity.trainingType}
            </Caption>
          </div>
        </div>
        <div className="rounded-[var(--mm-radius-md)] bg-mm-navy px-3 py-2 text-center text-white">
          <p className={cn("font-bold leading-none", featured ? "text-xl" : "text-lg")}>
            {opportunity.matchScore}%
          </p>
          <p className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-wide text-white/60">
            Match
          </p>
        </div>
      </div>

      {opportunity.badges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {opportunity.badges.map((badge) => (
            <Badge key={badge} tone={badgeTone[badge]}>
              {badge}
            </Badge>
          ))}
        </div>
      ) : null}

      <CardTitle
        className={cn(
          "mt-4 group-hover:text-mm-teal-700",
          featured ? "text-[1.125rem] sm:text-xl" : "text-base",
        )}
      >
        {opportunity.program}
      </CardTitle>
      <Caption className="mt-1">{opportunity.specialty}</Caption>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Meta label="Duration" value={opportunity.duration} icon={<Clock size={14} />} />
        <Meta label="Deadline" value={opportunity.deadline} />
        <Meta label="Seats" value={`${opportunity.seats} available`} />
      </div>

      <div className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-3.5">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
          Why this matches you
        </p>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-mm-text-secondary">
          {opportunity.matchWhy}
        </p>
      </div>

      <div className="mt-4">
        <p className="text-[0.75rem] font-semibold text-mm-navy">Requirements</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {opportunity.requirements.map((req) => (
            <li key={req}>
              <Badge tone="neutral">{req}</Badge>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link
          href={href}
          onClick={stop}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.8125rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700 sm:flex-none"
        >
          View Details
        </Link>
        <DemoActionTrigger
          kind="bookmark"
          label="Save"
          doneLabel="Saved"
          title={`Saved ${opportunity.program}`}
          detail={`${opportunity.hospital} was added to your bookmarks.`}
          icon={
            <Bookmark
              size={14}
              strokeWidth={1.75}
              className={opportunity.saved ? "fill-mm-teal text-mm-teal" : ""}
            />
          }
          doneIcon={
            <Bookmark
              size={14}
              strokeWidth={1.75}
              className="fill-mm-teal text-mm-teal"
            />
          }
          onClick={stop}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
        />
        <DemoActionTrigger
          kind="apply"
          label="Apply"
          doneLabel="Applied"
          title={`Applied to ${opportunity.program}`}
          detail={`Your application to ${opportunity.hospital} is ready for review.`}
          onClick={stop}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
        />
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[var(--mm-radius-md)] border border-mm-border px-3 py-2.5">
      <p className="text-[0.6875rem] font-medium text-mm-text-muted">{label}</p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-mm-navy">
        {icon}
        {value}
      </p>
    </div>
  );
}

/** Compact card for trending / recently added rows */
export function DiscoveryCardCompact({ opportunity }: { opportunity: BrowseOpportunity }) {
  return (
    <Link
      href={`/opportunities/${opportunity.slug}`}
      className="group block rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-xs transition-[transform,box-shadow,border-color] duration-[var(--mm-duration)] hover:-translate-y-1 hover:border-mm-teal/30 hover:shadow-mm-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-navy text-[0.625rem] font-bold text-white">
            {opportunity.hospitalMark}
          </div>
          <div className="min-w-0">
            <p className="break-words text-[0.9375rem] font-semibold text-mm-navy group-hover:text-mm-teal-700">
              {opportunity.program}
            </p>
            <Caption className="mt-1 truncate">
              {opportunity.hospital} · {opportunity.city}
            </Caption>
          </div>
        </div>
        <span className="shrink-0 text-[0.875rem] font-bold text-mm-navy">
          {opportunity.matchScore}%
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {opportunity.badges.slice(0, 2).map((badge) => (
          <Badge key={badge} tone={badgeTone[badge]}>
            {badge}
          </Badge>
        ))}
        <span className="inline-flex items-center gap-1 text-[0.75rem] text-mm-text-muted">
          <MapPin size={12} />
          {opportunity.duration}
        </span>
      </div>
    </Link>
  );
}
