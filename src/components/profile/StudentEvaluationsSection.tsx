"use client";

import Link from "next/link";
import { Download, Eye, FileCheck2 } from "lucide-react";
import { ProfileSection } from "@/components/profile/ProfileSection";
import { Badge, Body, Caption } from "@/components/ui";
import {
  evaluationPeriodLabel,
  evaluationStatusLabel,
  openEvaluationPdf,
} from "@/data/evaluations";
import { profileData } from "@/data/profile";
import { useEvaluationStore } from "@/lib/evaluation-store";

export function StudentEvaluationsSection() {
  const { getForStudent, hydrated } = useEvaluationStore();
  const evaluations = getForStudent(profileData.email, profileData.name).filter(
    (item) => item.locked && item.visibleToStudent,
  );

  return (
    <ProfileSection
      id="evaluations"
      title="Evaluations"
      description="Finalized rotation evaluations you have received"
      addLabel="View only"
    >
      {!hydrated ? (
        <p className="text-sm text-mm-text-secondary">Loading evaluations…</p>
      ) : evaluations.length === 0 ? (
        <div className="rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-gray-50 px-6 py-10 text-center">
          <p className="text-[0.9375rem] font-semibold text-mm-navy">
            No evaluations yet
          </p>
          <Body className="mx-auto mt-2 max-w-sm text-[0.875rem]">
            When a hosting hospital submits your rotation evaluation, it will
            appear here for viewing and download.
          </Body>
        </div>
      ) : (
        <ul className="space-y-3">
          {evaluations.map((evaluation) => (
            <li
              key={evaluation.id}
              className="flex flex-col gap-3 rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal">
                  <FileCheck2 size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-[0.875rem] font-semibold text-mm-navy">
                    {evaluation.specialtyName} ·{" "}
                    {evaluationPeriodLabel(evaluation)}
                  </p>
                  <Caption className="mt-0.5">
                    {evaluation.hostingHospitalName} ·{" "}
                    {evaluation.referenceNumber}
                  </Caption>
                  <div className="mt-2">
                    <Badge tone="success">
                      {evaluationStatusLabel(evaluation.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/evaluations/${evaluation.id}`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 text-[0.8125rem] font-semibold text-mm-navy"
                >
                  <Eye size={14} />
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => openEvaluationPdf(evaluation)}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 text-[0.8125rem] font-semibold text-mm-navy"
                >
                  <Download size={14} />
                  Download PDF
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </ProfileSection>
  );
}
