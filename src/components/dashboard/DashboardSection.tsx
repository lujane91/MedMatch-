import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function DashboardSection({
  id,
  title,
  action,
  children,
  className,
}: {
  id?: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-[1.0625rem] font-semibold tracking-tight text-mm-navy">
          {title}
        </h2>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatGrid({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-3 py-3"
        >
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
            {item.label}
          </p>
          <p className="mt-1.5 text-[1.25rem] font-semibold text-mm-navy">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
