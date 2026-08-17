"use client";

import { type ReactNode, useState } from "react";
import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";
import { DemoActionButton } from "@/components/DemoActionButton";
import { ChevronDown, Pencil, Plus, Upload } from "@/components/ui/icons";
import { Card, SectionTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

type ProfileSectionProps = {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  addLabel?: string;
  className?: string;
};

export function ProfileSection({
  id,
  title,
  description,
  children,
  defaultExpanded = true,
  addLabel = "Add",
  className,
}: ProfileSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isUpload = /upload/i.test(addLabel);

  return (
    <Card id={id} className={cn("overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-mm-border px-6 py-5 sm:px-8">
        <div className="min-w-0 pr-4">
          <SectionTitle as="h2" className="text-[1.125rem] sm:text-[1.25rem]">
            {title}
          </SectionTitle>
          {description ? (
            <p className="mt-1 text-[0.875rem] text-mm-text-muted">{description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DemoActionButton
            label="Edit"
            doneLabel="Editing"
            icon={<Pencil size={14} strokeWidth={1.75} />}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white px-3 text-[0.8125rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
          />
          {isUpload ? (
            <DemoActionTrigger
              kind="uploadCv"
              label={addLabel}
              doneLabel="Uploaded"
              icon={<Upload size={14} strokeWidth={1.75} />}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--mm-radius-md)] bg-mm-teal-50 px-3 text-[0.8125rem] font-semibold text-mm-teal-700 transition-colors hover:bg-mm-teal-100"
            />
          ) : (
            <DemoActionButton
              label={addLabel}
              doneLabel="Added for demo"
              icon={<Plus size={14} strokeWidth={1.75} />}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--mm-radius-md)] bg-mm-teal-50 px-3 text-[0.8125rem] font-semibold text-mm-teal-700 transition-colors hover:bg-mm-teal-100"
            />
          )}
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={`${id}-content`}
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--mm-radius-md)] px-3 text-[0.8125rem] font-semibold text-mm-text-secondary transition-colors hover:bg-mm-gray-50 hover:text-mm-navy"
          >
            {expanded ? "Collapse" : "Expand"}
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={cn(
                "transition-transform duration-[var(--mm-duration)]",
                expanded && "rotate-180",
              )}
            />
          </button>
        </div>
      </div>
      {expanded ? (
        <div id={`${id}-content`} className="px-6 py-6 sm:px-8 sm:py-7">
          {children}
        </div>
      ) : null}
    </Card>
  );
}
