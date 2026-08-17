"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Building2 } from "lucide-react";
import {
  type ApplicantType,
  type ApplicationStatus,
  type CapacityStatus,
  type DisplayApplicationStatus,
  type SpecialtyId,
  resolveSpecialtyName,
  toDisplayStatus,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import type { ToastState, ToastTone } from "@/hooks/use-toast";

export function specialtyName(id: SpecialtyId): string {
  return resolveSpecialtyName(id);
}

/** Hospital logo with graceful fallback when the asset fails to load. */
export function HospitalLogo({
  src,
  name,
  className,
  imgClassName,
}: {
  src?: string | null;
  name: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(!src);

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--mm-radius-md)] bg-mm-gray-50 ring-1 ring-mm-border",
        className,
      )}
    >
      {!failed && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={cn("h-full w-full object-contain p-1", imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex flex-col items-center justify-center gap-0.5 px-1 text-center">
          <Building2
            className="h-5 w-5 text-mm-navy/65"
            strokeWidth={1.75}
            aria-hidden
          />
          <span className="max-w-full truncate text-[0.5625rem] font-semibold leading-tight text-mm-text-muted">
            {name}
          </span>
        </span>
      )}
      <span className="sr-only">{name} logo</span>
    </div>
  );
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Pending: "bg-mm-gray-100 text-mm-navy",
  "Under Review": "bg-mm-teal-50 text-mm-teal-700",
  Accepted: "bg-mm-teal-50 text-mm-teal-700",
  Rejected: "bg-mm-error-50 text-mm-error-700",
  Waitlisted: "bg-mm-amber-50 text-mm-amber-700",
  "Alternative Suggested": "bg-mm-gray-100 text-mm-navy-800",
  "Alternative Accepted": "bg-mm-teal-50 text-mm-teal-700",
  "Alternative Declined": "bg-mm-error-50 text-mm-error-700",
};

const DISPLAY_STATUS_STYLES: Record<DisplayApplicationStatus, string> = {
  Pending: "bg-mm-gray-100 text-mm-navy",
  Accepted: "bg-mm-teal-50 text-mm-teal-700",
  Rejected: "bg-mm-error-50 text-mm-error-700",
  Waitlisted: "bg-mm-amber-50 text-mm-amber-700",
};

const CAPACITY_STYLES: Record<CapacityStatus, string> = {
  Open: "bg-mm-teal-50 text-mm-teal-700",
  "Almost Full": "bg-mm-amber-50 text-mm-amber-700",
  Full: "bg-mm-error-50 text-mm-error-700",
  Closed: "bg-mm-gray-100 text-mm-gray-400",
};

export function StatusBadge({
  status,
  display,
}: {
  status: ApplicationStatus | DisplayApplicationStatus;
  /** When true, normalize extended statuses to Pending/Accepted/Rejected/Waitlisted. */
  display?: boolean;
}) {
  const label = display
    ? toDisplayStatus(status as ApplicationStatus)
    : (status as string);
  const className = display
    ? DISPLAY_STATUS_STYLES[label as DisplayApplicationStatus]
    : STATUS_STYLES[status as ApplicationStatus] ??
      DISPLAY_STATUS_STYLES[status as DisplayApplicationStatus];

  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

export function CapacityBadge({ status }: { status: CapacityStatus }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
        CAPACITY_STYLES[status],
      )}
    >
      {status}
    </span>
  );
}

export function TypeBadge({ type }: { type: ApplicantType }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
        type === "Internal"
          ? "bg-mm-teal-50 text-mm-teal-700"
          : "bg-mm-gray-100 text-mm-navy",
      )}
    >
      {type}
    </span>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageIntro({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Panel className="mb-6">
      {title ? (
        <h2 className="text-[0.9375rem] font-semibold text-mm-navy">{title}</h2>
      ) : null}
      <div
        className={cn(
          "text-sm text-mm-text-secondary",
          title ? "mt-1.5" : undefined,
        )}
      >
        {children}
      </div>
    </Panel>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Panel className="px-6 py-10 text-center mm-fade-in">
      <p className="font-medium text-mm-navy">{title}</p>
      {description ? (
        <p className="mx-auto mt-1.5 max-w-md text-sm text-mm-text-muted">
          {description}
        </p>
      ) : null}
    </Panel>
  );
}

export function ToastBanner({
  toast,
  onDismiss,
}: {
  toast: ToastState | null;
  onDismiss?: () => void;
}) {
  if (!toast) return null;
  const toneClass =
    toast.tone === "error"
      ? "border-mm-error/30 bg-mm-error-50 text-mm-error-700"
      : toast.tone === "info"
        ? "border-mm-border bg-mm-gray-50 text-mm-navy"
        : "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "mt-3 flex items-start justify-between gap-3 rounded-[var(--mm-radius-lg)] border px-3.5 py-2.5 text-sm font-medium mm-slide-up",
        toneClass,
      )}
    >
      <p>{toast.message}</p>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-[0.75rem] font-semibold underline-offset-2 hover:underline"
        >
          Dismiss
        </button>
      ) : null}
    </div>
  );
}

export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-4 mm-fade-in" aria-busy="true" aria-live="polite">
      <div className="mm-skeleton h-24 rounded-[var(--mm-radius-xl)]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`stat-${index}`}
            className="mm-skeleton h-28 rounded-[var(--mm-radius-xl)]"
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={`row-${index}`}
          className="mm-skeleton h-20 rounded-[var(--mm-radius-xl)]"
        />
      ))}
      <span className="sr-only">Loading hospital data…</span>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Panel className="min-w-0">
      <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-mm-navy">
        {value}
      </p>
      {hint ? (
        <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">{hint}</p>
      ) : null}
    </Panel>
  );
}

export function SimpleBarChart({
  title,
  items,
  emptyLabel = "No data yet.",
}: {
  title: string;
  items: { label: string; value: number; hint?: string }[];
  emptyLabel?: string;
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <Panel>
      <h3 className="text-[0.9375rem] font-semibold text-mm-navy">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-mm-text-muted">{emptyLabel}</p>
        ) : (
          items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-[0.8125rem]">
                <span className="truncate text-mm-text-secondary">
                  {item.label}
                </span>
                <span className="font-semibold text-mm-navy">
                  {item.hint ?? item.value}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-mm-gray-100">
                <div
                  className="h-full rounded-full bg-mm-teal transition-[width] duration-[var(--mm-duration)]"
                  style={{ width: `${(item.value / max) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

/** Dual-series chart for capacity usage (filled vs total). */
export function CapacityUsageChart({
  title,
  items,
}: {
  title: string;
  items: { label: string; filled: number; total: number }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.total));
  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">{title}</h3>
        <div className="flex flex-wrap gap-3 text-[0.75rem] font-semibold">
          <span className="inline-flex items-center gap-1.5 text-mm-teal-700">
            <span className="h-2 w-2 rounded-full bg-mm-teal" aria-hidden />
            Filled
          </span>
          <span className="inline-flex items-center gap-1.5 text-mm-text-muted">
            <span className="h-2 w-2 rounded-full bg-mm-gray-200" aria-hidden />
            Total capacity
          </span>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-mm-text-muted">No capacity data yet.</p>
        ) : (
          items.map((item) => {
            const usage =
              item.total <= 0
                ? 0
                : Math.round((item.filled / item.total) * 100);
            return (
              <div key={item.label}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-[0.8125rem]">
                  <span className="font-medium text-mm-navy">{item.label}</span>
                  <span className="text-mm-text-secondary">
                    {item.filled}/{item.total} · {usage}%
                  </span>
                </div>
                <div
                  className="relative h-3 overflow-hidden rounded-full bg-mm-gray-100"
                  role="img"
                  aria-label={`${item.label}: ${item.filled} of ${item.total} seats filled`}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-mm-gray-200"
                    style={{ width: `${(item.total / max) * 100}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-mm-teal transition-[width] duration-[var(--mm-duration)]"
                    style={{
                      width: `${(Math.min(item.filled, item.total) / max) * 100}%`,
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Panel>
  );
}

/** Responsive split chart for comparing two applicant groups. */
export function SplitComparisonChart({
  title,
  left,
  right,
}: {
  title: string;
  left: { label: string; value: number };
  right: { label: string; value: number };
}) {
  const total = Math.max(1, left.value + right.value);
  const leftPct = Math.round((left.value / total) * 100);
  const rightPct = 100 - leftPct;

  return (
    <Panel>
      <h3 className="text-[0.9375rem] font-semibold text-mm-navy">{title}</h3>
      <div className="mt-5">
        <div
          className="flex h-4 overflow-hidden rounded-full bg-mm-gray-100"
          role="img"
          aria-label={`${left.label} ${leftPct} percent, ${right.label} ${rightPct} percent`}
        >
          <div
            className="bg-mm-teal transition-[width] duration-[var(--mm-duration)]"
            style={{ width: `${leftPct}%` }}
          />
          <div
            className="bg-mm-navy/70 transition-[width] duration-[var(--mm-duration)]"
            style={{ width: `${rightPct}%` }}
          />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-3.5 py-3">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              {left.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-mm-navy">
              {left.value}
            </p>
            <p className="mt-0.5 text-sm text-mm-teal-700">{leftPct}%</p>
          </div>
          <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-3.5 py-3">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              {right.label}
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-mm-navy">
              {right.value}
            </p>
            <p className="mt-0.5 text-sm text-mm-text-secondary">{rightPct}%</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}

export function ConfirmModal({
  open,
  title,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  danger,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  const titleId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-mm-navy/40 p-4 sm:items-center mm-fade-in">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-5 shadow-mm-lg mm-slide-up"
      >
        <h3
          id={titleId}
          className="font-display text-xl font-semibold text-mm-navy"
        >
          {title}
        </h3>
        <div className="mt-3 text-sm text-mm-text-secondary">{children}</div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 py-2.5 text-sm font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-[var(--mm-radius-lg)] px-4 py-2.5 text-sm font-semibold text-white transition-colors",
              danger
                ? "bg-mm-error hover:bg-mm-error-700"
                : "bg-mm-teal hover:bg-mm-teal-700",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export const selectClassName = cn(
  "w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-2.5 text-[0.9375rem] text-mm-navy outline-none transition-[border-color,box-shadow] duration-[var(--mm-duration)]",
  "focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]",
);

export const buttonPrimaryClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 py-2.5 text-sm font-semibold text-white shadow-mm-teal transition-colors hover:bg-mm-teal-700 focus-visible:outline-offset-2";

export const buttonSecondaryClass =
  "inline-flex items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 py-2.5 text-sm font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50 focus-visible:outline-offset-2";

export type { ToastTone, ToastState };
