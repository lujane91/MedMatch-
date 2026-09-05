"use client";

import {
  applicationMonthKey,
  applicationStatusLabel,
  type TrainingApplication,
  statusToneClass,
} from "@/data/training-applications";
import {
  buildInternshipCalendarMonths,
  formatInternshipMonthLabel,
} from "@/data/internship-rotation-seeds";
import { cn } from "@/lib/cn";

export function InternshipCalendarPanel({
  applications,
  onConfirm,
  onDeclineAcceptance,
  onAcceptProposedMonth,
  onDeclineProposedMonth,
  onProposeAltMonth,
  conflictMessage,
}: {
  applications: TrainingApplication[];
  onConfirm: (app: TrainingApplication) => void;
  onDeclineAcceptance: (app: TrainingApplication) => void;
  onAcceptProposedMonth: (app: TrainingApplication) => void;
  onDeclineProposedMonth: (app: TrainingApplication) => void;
  onProposeAltMonth: (app: TrainingApplication) => void;
  conflictMessage?: string;
}) {
  const months = buildInternshipCalendarMonths();

  return (
    <div className="space-y-4">
      <p className="text-[0.8125rem] text-mm-text-secondary">
        Plan your internship year month by month. Hospital acceptance still
        requires your confirmation before a month is finalized.
      </p>
      {conflictMessage ? (
        <p className="rounded-[var(--mm-radius-lg)] border border-amber-200 bg-amber-50 px-3 py-2 text-[0.8125rem] font-medium text-amber-900">
          {conflictMessage}
        </p>
      ) : null}
      <ul className="space-y-3">
        {months.map((month) => {
          const monthApps = applications.filter(
            (a) => applicationMonthKey(a) === month.key,
          );
          return (
            <li
              key={month.key}
              className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
            >
              <p className="text-[0.9375rem] font-semibold text-mm-navy">
                {month.label}
              </p>
              {monthApps.length === 0 ? (
                <p className="mt-2 text-[0.8125rem] text-mm-text-muted">
                  No applications for this month yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {monthApps.map((app) => (
                    <li
                      key={app.id}
                      className="rounded-[var(--mm-radius-md)] bg-mm-gray-50 px-3 py-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-mm-navy">
                            {app.specialty}
                          </p>
                          <p className="mt-0.5 text-[0.8125rem] text-mm-text-secondary">
                            {app.hospital}
                          </p>
                          {app.applicationStatus ===
                          "Alternative Month Proposed" ? (
                            <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
                              Hospital proposed:{" "}
                              {formatInternshipMonthLabel(
                                app.proposedMonthKey || "",
                              )}
                            </p>
                          ) : null}
                          {typeof app.priority === "number" ? (
                            <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                              Priority {app.priority}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
                            statusToneClass(app.applicationStatus),
                          )}
                        >
                          {applicationStatusLabel(
                            app.applicationStatus,
                            "internship-rotation",
                          )}
                        </span>
                      </div>

                      {app.applicationStatus === "Accepted" ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onConfirm(app)}
                            className="min-h-9 rounded-[var(--mm-radius-lg)] bg-mm-teal px-3 text-[0.75rem] font-semibold text-white"
                          >
                            Confirm Rotation
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeclineAcceptance(app)}
                            className="min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-navy"
                          >
                            Decline Rotation
                          </button>
                        </div>
                      ) : null}

                      {app.applicationStatus ===
                      "Alternative Month Proposed" ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => onAcceptProposedMonth(app)}
                            className="min-h-9 rounded-[var(--mm-radius-lg)] bg-mm-teal px-3 text-[0.75rem] font-semibold text-white"
                          >
                            Accept Proposed Month
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeclineProposedMonth(app)}
                            className="min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-navy"
                          >
                            Decline Proposed Month
                          </button>
                        </div>
                      ) : null}

                      {app.applicationStatus === "Submitted" ||
                      app.applicationStatus === "Under Review" ||
                      app.applicationStatus === "Waitlisted" ? (
                        <button
                          type="button"
                          onClick={() => onProposeAltMonth(app)}
                          className="mt-3 min-h-9 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.6875rem] font-semibold text-mm-navy"
                        >
                          Demo Propose Alt Month
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-[0.75rem] text-mm-text-muted">
        Confirmed rotations:{" "}
        {
          applications.filter(
            (a) =>
              a.applicationStatus === "Student Confirmed" ||
              a.applicationStatus === "Completed",
          ).length
        }
      </p>
    </div>
  );
}
