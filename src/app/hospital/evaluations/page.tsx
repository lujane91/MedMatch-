"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  Panel,
  buttonSecondaryClass,
  formatDate,
} from "@/components/hospital/hospital-ui";
import {
  evaluationPeriodLabel,
  evaluationStatusLabel,
  openEvaluationPdf,
  type RotationEvaluation,
} from "@/data/evaluations";
import { monthLabel } from "@/data/hospital-demo";
import { cn } from "@/lib/cn";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalStore } from "@/lib/hospital-store";

function EvaluationStatusChip({
  evaluation,
}: {
  evaluation: RotationEvaluation;
}) {
  const label = evaluationStatusLabel(evaluation.status);
  return (
    <span className="inline-flex rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700">
      {label}
    </span>
  );
}

function EvaluationTable({
  rows,
  mode,
}: {
  rows: RotationEvaluation[];
  mode: "submitted" | "received";
}) {
  if (rows.length === 0) {
    return (
      <EmptyState
        title={
          mode === "submitted"
            ? "No submitted evaluations for this month"
            : "No received evaluations for this month"
        }
        description={
          mode === "submitted"
            ? "Evaluations you submit from a trainee’s student details page will appear here."
            : "Evaluations sent to your hospital from other hosting sites will appear here."
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[980px] w-full border-collapse text-left text-sm">
        <thead className="bg-mm-gray-50 text-[0.75rem] uppercase tracking-[0.06em] text-mm-text-muted">
          <tr>
            <th className="px-4 py-3 font-semibold">Student Name</th>
            {mode === "received" ? (
              <th className="px-4 py-3 font-semibold">Hosting Hospital</th>
            ) : (
              <th className="px-4 py-3 font-semibold">Home Hospital</th>
            )}
            <th className="px-4 py-3 font-semibold">Specialty</th>
            <th className="px-4 py-3 font-semibold">Rotation Month</th>
            <th className="px-4 py-3 font-semibold">
              {mode === "received" ? "Date Received" : "Evaluation Date"}
            </th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((evaluation) => (
            <tr key={evaluation.id} className="border-t border-mm-border">
              <td className="px-4 py-3 font-medium text-mm-navy">
                {evaluation.studentName}
              </td>
              <td className="px-4 py-3 text-mm-text-secondary">
                {mode === "received"
                  ? evaluation.hostingHospitalName
                  : evaluation.homeHospitalName}
              </td>
              <td className="px-4 py-3 text-mm-text-secondary">
                {evaluation.specialtyName}
              </td>
              <td className="px-4 py-3 text-mm-text-secondary">
                {evaluationPeriodLabel(evaluation)}
              </td>
              <td className="px-4 py-3 text-mm-text-secondary">
                {mode === "received"
                  ? formatDate(
                      evaluation.sentToHomeHospitalAt ??
                        evaluation.evaluationDate,
                    )
                  : formatDate(evaluation.evaluationDate)}
              </td>
              <td className="px-4 py-3">
                <EvaluationStatusChip evaluation={evaluation} />
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/hospital/evaluations/${evaluation.id}`}
                    className={cn(
                      buttonSecondaryClass,
                      "px-2.5 py-1.5 text-[0.75rem]",
                    )}
                  >
                    <Eye size={14} aria-hidden />
                    View
                  </Link>
                  <button
                    type="button"
                    className={cn(
                      buttonSecondaryClass,
                      "px-2.5 py-1.5 text-[0.75rem]",
                    )}
                    onClick={() => openEvaluationPdf(evaluation)}
                  >
                    <Download size={14} aria-hidden />
                    Download
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HospitalEvaluationsPage() {
  const { activeHospitalId, activeHospital } = useHospitalStore();
  const {
    getSubmittedForHospital,
    getReceivedForHospital,
  } = useEvaluationStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const submitted = useMemo(
    () =>
      getSubmittedForHospital(activeHospitalId)
        .filter(
          (item) => item.month === selectedMonth && item.year === year,
        )
        .sort((a, b) =>
          a.studentName.localeCompare(b.studentName),
        ),
    [activeHospitalId, getSubmittedForHospital, selectedMonth, year],
  );

  const received = useMemo(
    () =>
      getReceivedForHospital(activeHospitalId)
        .filter(
          (item) => item.month === selectedMonth && item.year === year,
        )
        .sort((a, b) =>
          a.studentName.localeCompare(b.studentName),
        ),
    [activeHospitalId, getReceivedForHospital, selectedMonth, year],
  );

  const submittedByMonthAll = useMemo(
    () => getSubmittedForHospital(activeHospitalId),
    [activeHospitalId, getSubmittedForHospital],
  );
  const receivedByMonthAll = useMemo(
    () => getReceivedForHospital(activeHospitalId),
    [activeHospitalId, getReceivedForHospital],
  );

  return (
    <HospitalShell title="Evaluations">
      <PageIntro title="Rotation evaluations">
        Submitted and received internship evaluations for{" "}
        {activeHospital?.name ?? "this hospital"}, filtered by {period}.
      </PageIntro>

      <MonthNavigator className="mb-6" />

      <Panel className="mb-6 overflow-hidden p-0">
        <div className="border-b border-mm-border px-4 py-3 sm:px-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            A. Submitted Evaluations
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Evaluations created and submitted by this hospital ·{" "}
            {monthLabel(selectedMonth)} {year} ({submitted.length})
            {submittedByMonthAll.length > 0 ? (
              <span className="text-mm-text-muted">
                {" "}
                · {submittedByMonthAll.length} total on file
              </span>
            ) : null}
          </p>
        </div>
        <EvaluationTable rows={submitted} mode="submitted" />
      </Panel>

      <Panel className="overflow-hidden p-0">
        <div className="border-b border-mm-border px-4 py-3 sm:px-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            B. Received Evaluations
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Evaluations received from other hospitals through MedJourney ·{" "}
            {monthLabel(selectedMonth)} {year} ({received.length})
            {receivedByMonthAll.length > 0 ? (
              <span className="text-mm-text-muted">
                {" "}
                · {receivedByMonthAll.length} total on file
              </span>
            ) : null}
          </p>
        </div>
        <EvaluationTable rows={received} mode="received" />
      </Panel>
    </HospitalShell>
  );
}
