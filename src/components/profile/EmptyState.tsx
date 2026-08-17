import { type ReactNode } from "react";
import { DemoActionButton } from "@/components/DemoActionButton";
import { Plus } from "@/components/ui/icons";
import { Body, Caption } from "@/components/ui";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  icon?: ReactNode;
};

export function EmptyState({
  title,
  description,
  actionLabel = "Add entry",
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-gray-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-white text-mm-teal shadow-mm-xs">
        {icon ?? <Plus size={18} strokeWidth={1.75} />}
      </div>
      <p className="text-[0.9375rem] font-semibold text-mm-navy">{title}</p>
      <Body className="mt-2 max-w-sm text-[0.875rem]">{description}</Body>
      <DemoActionButton
        label={actionLabel}
        doneLabel="Added for demo"
        icon={<Plus size={14} strokeWidth={1.75} />}
        className="mt-5 inline-flex min-h-10 items-center gap-1.5 rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-[0.8125rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
      />
      <Caption className="mt-3">Visible to hospitals after you publish.</Caption>
    </div>
  );
}
