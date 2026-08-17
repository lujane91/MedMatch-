"use client";

import { useEffect } from "react";
import {
  CheckCircle2,
  FileText,
  ListChecks,
  X,
  XCircle,
  ListOrdered,
} from "lucide-react";
import {
  StatusBadge,
  TypeBadge,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
  formatDateTime,
  initials,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  computeCapacityRow,
  isAcceptedStatus,
  monthLabel,
  toDisplayStatus,
  type HospitalApplication,
  type HospitalProfile,
  type SpecialtyCapacity,
} from "@/data/hospital-demo";
import { cn } from "@/lib/cn";

export function ApplicantDetailsDrawer({
  open,
  application,
  hospital,
  applications,
  capacities,
  onClose,
  onAccept,
  onReject,
  onWaitlist,
}: {
  open: boolean;
  application: HospitalApplication | null;
  hospital: HospitalProfile | null;
  applications: HospitalApplication[];
  capacities: SpecialtyCapacity[];
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onWaitlist: (id: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeButton = document.getElementById("applicant-drawer-close");
    closeButton?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !application) return null;

  const capacity = computeCapacityRow(
    application.specialtyId,
    application.month,
    application.hospitalId,
    applications,
    capacities,
  );
  const remaining = capacity?.remaining ?? 0;
  const canAcceptMore =
    remaining > 0 && capacity?.status !== "Closed";
  const displayStatus = toDisplayStatus(application.status);
  const accepted = isAcceptedStatus(application.status);
  const meets = application.meetsRequirements ?? application.eligible;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-mm-navy/40"
        aria-label="Close applicant details"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-details-title"
        className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-mm-border bg-mm-white shadow-mm-lg mm-drawer-in"
      >
        <header className="flex items-start justify-between gap-3 border-b border-mm-border px-5 py-4">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mm-teal-50 text-sm font-bold text-mm-teal-700">
              {initials(application.applicantName)}
            </span>
            <div className="min-w-0">
              <h2
                id="applicant-details-title"
                className="truncate font-display text-xl font-semibold tracking-tight text-mm-navy"
              >
                {application.applicantName}
              </h2>
              <p className="mt-1 text-sm text-mm-text-secondary">
                {specialtyName(application.specialtyId)} ·{" "}
                {monthLabel(application.month)}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge status={application.status} display />
                <TypeBadge type={application.applicantType} />
              </div>
            </div>
          </div>
          <button
            id="applicant-drawer-close"
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] border border-mm-border bg-mm-white text-mm-navy transition-colors hover:bg-mm-gray-50"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50 p-4">
            <div className="flex flex-wrap gap-2 text-[0.75rem] font-semibold">
              <span className="rounded-full bg-mm-white px-2.5 py-1 text-mm-navy ring-1 ring-mm-border">
                Total slots {capacity?.totalSlots ?? 0}
              </span>
              <span className="rounded-full bg-mm-teal-50 px-2.5 py-1 text-mm-teal-700">
                Accepted {capacity?.acceptedCount ?? 0}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1",
                  remaining > 0
                    ? "bg-mm-amber-50 text-mm-amber-700"
                    : "bg-mm-error-50 text-mm-error-700",
                )}
              >
                Remaining {remaining}
              </span>
            </div>
          </section>

          <section className="mt-5">
            <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              Applicant profile
            </h3>
            <dl className="mt-3 space-y-3 text-sm">
              <DetailRow label="Full Name" value={application.applicantName} />
              <DetailRow label="University" value={application.university} />
              <DetailRow
                label="Hospital"
                value={hospital?.name ?? application.hospitalId}
              />
              <DetailRow label="Gender" value={application.gender} />
              <DetailRow label="GPA" value={application.gpa.toFixed(2)} />
              <DetailRow
                label="Clinical Grade"
                value={application.clinicalGrade.toFixed(2)}
              />
              <DetailRow
                label="Requirements"
                value={meets ? "All mandatory requirements met" : "Missing items"}
              />
            </dl>
          </section>

          <section className="mt-6">
            <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              <FileText size={14} />
              CV
            </h3>
            <div className="mt-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-3">
              <p className="font-medium text-mm-navy">{application.cv.name}</p>
              <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                {application.cv.fileLabel}
              </p>
              <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                Uploaded {formatDate(application.cv.uploadedAt)}
              </p>
            </div>
          </section>

          <section className="mt-6">
            <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              Personal Statement
            </h3>
            <p className="mt-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-3 text-sm leading-relaxed text-mm-text-secondary">
              {application.personalStatement}
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              Uploaded Documents
            </h3>
            <ul className="mt-3 space-y-2">
              {application.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-start justify-between gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-mm-navy">{doc.name}</p>
                    <p className="mt-0.5 truncate text-[0.8125rem] text-mm-text-secondary">
                      {doc.fileLabel}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex rounded-full bg-mm-gray-100 px-2 py-0.5 text-[0.6875rem] font-semibold text-mm-navy">
                      {doc.kind}
                    </span>
                    <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                      {formatDate(doc.uploadedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              <ListChecks size={14} />
              Requirement Checklist
            </h3>
            <ul className="mt-3 space-y-2">
              {application.requirements.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-3"
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                      item.completed
                        ? "bg-mm-teal-50 text-mm-teal-700"
                        : "bg-mm-error-50 text-mm-error-700",
                    )}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={14} strokeWidth={2} />
                    ) : (
                      <XCircle size={14} strokeWidth={2} />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-mm-navy">
                      {item.label}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-mm-text-muted">
                      {item.mandatory ? "Mandatory" : "Optional"} ·{" "}
                      {item.completed ? "Complete" : "Incomplete"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6">
            <h3 className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              <ListOrdered size={14} />
              Application Timeline
            </h3>
            <ol className="mt-3 space-y-3 border-l border-mm-border pl-4">
              {application.timeline.map((event) => (
                <li key={event.id} className="relative">
                  <span className="absolute -left-[1.28rem] top-1.5 h-2.5 w-2.5 rounded-full bg-mm-teal ring-4 ring-mm-white" />
                  <p className="text-sm font-semibold text-mm-navy">
                    {event.label}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-mm-text-muted">
                    {formatDateTime(event.at)}
                  </p>
                  {event.detail ? (
                    <p className="mt-1 text-[0.8125rem] text-mm-text-secondary">
                      {event.detail}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="border-t border-mm-border bg-mm-white px-5 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={accepted || !canAcceptMore}
              title={
                !canAcceptMore ? "No remaining total slots" : "Accept applicant"
              }
              onClick={() => onAccept(application.id)}
              className={cn(
                buttonPrimaryClass,
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
            >
              <CheckCircle2 size={16} />
              Accept
            </button>
            <button
              type="button"
              disabled={displayStatus === "Rejected"}
              onClick={() => onReject(application.id)}
              className={cn(
                buttonSecondaryClass,
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              type="button"
              disabled={displayStatus === "Waitlisted"}
              onClick={() => onWaitlist(application.id)}
              className={cn(
                buttonSecondaryClass,
                "disabled:cursor-not-allowed disabled:opacity-45",
              )}
            >
              <ListOrdered size={16} />
              Waitlist
            </button>
          </div>
          {!canAcceptMore && !accepted ? (
            <p className="mt-3 text-[0.8125rem] text-mm-error-700">
              No remaining capacity for this specialty and month. Accept is
              disabled; use Waitlist instead.
            </p>
          ) : null}
        </footer>
      </aside>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-mm-border/80 pb-3 last:border-0 last:pb-0">
      <dt className="text-mm-text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-mm-navy">{value}</dd>
    </div>
  );
}
