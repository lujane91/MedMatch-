"use client";

import { Caption } from "@/components/ui";
import { Bookmark } from "@/components/ui/icons";
import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";

type MobileApplyBarProps = {
  matchScore: number;
  seats: number;
  deadline: string;
  title?: string;
  saved?: boolean;
};

export function MobileApplyBar({
  matchScore,
  seats,
  deadline,
  title,
  saved,
}: MobileApplyBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 lg:hidden">
      <div
        className="pointer-events-auto border-t border-mm-border bg-mm-surface/95 px-4 pt-3 shadow-[0_-12px_40px_rgba(14,58,93,0.12)] backdrop-blur-xl"
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.75rem] text-mm-text-muted">Match score</p>
            <p className="text-[1.125rem] font-bold text-mm-navy">{matchScore}%</p>
          </div>
          <Caption className="min-w-0 max-w-[55%] text-right leading-snug">
            {seats} seats · due {deadline}
          </Caption>
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <DemoActionTrigger
            kind="apply"
            label="Apply Now"
            doneLabel="Applied"
            title={title ? `Applied to ${title}` : undefined}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.9375rem] font-semibold text-white shadow-mm-teal"
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
              title ? `${title} was added to your bookmarks.` : undefined
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.875rem] font-semibold text-mm-navy"
          />
        </div>
      </div>
    </div>
  );
}
