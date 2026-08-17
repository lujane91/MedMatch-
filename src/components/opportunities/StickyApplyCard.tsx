"use client";

import { Caption } from "@/components/ui";
import { Bookmark } from "@/components/ui/icons";
import { CircularProgress } from "@/components/profile/CircularProgress";
import { ShareButton } from "@/components/ShareButton";
import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";

type StickyApplyCardProps = {
  matchScore: number;
  profileCompletion: number;
  deadline: string;
  seats: number;
  status: string;
  saved?: boolean;
  title?: string;
};

export function StickyApplyCard({
  matchScore,
  profileCompletion,
  deadline,
  seats,
  status,
  saved,
  title,
}: StickyApplyCardProps) {
  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-md sm:p-7">
        <div className="flex justify-center">
          <CircularProgress
            value={matchScore}
            size={120}
            strokeWidth={9}
            label="Match"
          />
        </div>

        <dl className="mt-6 space-y-3.5 border-t border-mm-border pt-6">
          <Row label="Profile completion" value={`${profileCompletion}%`} />
          <Row label="Application deadline" value={deadline} />
          <Row label="Seats remaining" value={`${seats}`} />
          <Row label="Application status" value={status} />
        </dl>

        <div className="mt-6 grid gap-2.5">
          <DemoActionTrigger
            kind="apply"
            label="Apply Now"
            doneLabel="Applied"
            title={title ? `Applied to ${title}` : undefined}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.9375rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
          />
          <DemoActionTrigger
            kind="save"
            label="Save"
            doneLabel="Saved"
            icon={
              <Bookmark
                size={16}
                strokeWidth={1.75}
                className={saved ? "fill-mm-teal text-mm-teal" : ""}
              />
            }
            doneIcon={
              <Bookmark
                size={16}
                strokeWidth={1.75}
                className="fill-mm-teal text-mm-teal"
              />
            }
            detail={
              title
                ? `${title} was added to your bookmarks.`
                : undefined
            }
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white text-[0.875rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
          />
          <ShareButton label="Share" className="w-full" />
        </div>

        <Caption className="mt-4 text-center">
          Applying uses your MedJourney profile and uploaded documents.
        </Caption>
      </div>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="shrink-0 text-[0.8125rem] text-mm-text-muted">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[0.875rem] font-semibold text-mm-navy">
        {value}
      </dd>
    </div>
  );
}
