import Link from "next/link";
import { Badge, Caption, CardTitle } from "@/components/ui";
import { Bookmark, Clock, MapPin } from "@/components/ui/icons";
import type { Opportunity } from "@/data/mock";
import { cn } from "@/lib/cn";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Link
      href={`/opportunities/${opportunity.slug}`}
      className={cn(
        "group block rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6",
        "transition-[transform,box-shadow,border-color] duration-[var(--mm-duration)] ease-[var(--mm-ease-out)]",
        "hover:-translate-y-1 hover:border-mm-teal/30 hover:shadow-mm-md",
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge tone="teal">{opportunity.specialty}</Badge>
          <CardTitle className="mt-3 text-base group-hover:text-mm-teal-700">
            {opportunity.title}
          </CardTitle>
          <Caption className="mt-1">{opportunity.hospital}</Caption>
        </div>
        <div className="rounded-[var(--mm-radius-md)] bg-mm-navy px-3 py-2 text-center text-white">
          <div className="text-lg font-bold leading-none">
            {opportunity.matchScore}%
          </div>
          <div className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-wide text-white/60">
            Match
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-[0.8125rem] text-mm-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} strokeWidth={1.75} />
          {opportunity.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} strokeWidth={1.75} />
          {opportunity.duration}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} tone="neutral">
              {tag}
            </Badge>
          ))}
        </div>
        <Bookmark
          size={16}
          strokeWidth={1.75}
          className={
            opportunity.saved
              ? "fill-mm-teal text-mm-teal"
              : "text-mm-gray-400"
          }
        />
      </div>
    </Link>
  );
}
