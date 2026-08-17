import Link from "next/link";
import { type ReactNode } from "react";
import { Body, Label, SectionTitle } from "@/components/ui";
import { ArrowLeft } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <Label>{eyebrow}</Label> : null}
        <SectionTitle
          as="h1"
          className={cn(eyebrow ? "mt-2" : "", "text-[1.5rem] sm:text-[1.75rem]")}
        >
          {title}
        </SectionTitle>
        {description ? <Body className="mt-2">{description}</Body> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function BackToDashboard({ className }: { className?: string }) {
  return (
    <Link href="/dashboard" className={cn("mm-link", className)}>
      <ArrowLeft size={16} strokeWidth={1.75} />
      Back to dashboard
    </Link>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function AppEmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-surface px-6 py-14 text-center shadow-mm-xs">
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
          {icon}
        </div>
      ) : null}
      <p className="text-[0.9375rem] font-semibold text-mm-navy">{title}</p>
      <Body className="mt-2 max-w-sm text-[0.875rem]">{description}</Body>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
