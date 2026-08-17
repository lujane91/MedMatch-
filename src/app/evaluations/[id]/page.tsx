"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  evaluationPeriodLabel,
  evaluationStatusLabel,
  openEvaluationPdf,
} from "@/data/evaluations";
import { profileData } from "@/data/profile";
import { useEvaluationStore } from "@/lib/evaluation-store";

export default function StudentEvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const { getById, getForStudent } = useEvaluationStore();
  const evaluation = getById(params.id);
  const allowed = getForStudent(profileData.email, profileData.name).some(
    (item) => item.id === params.id && item.locked && item.visibleToStudent,
  );

  if (!evaluation || !allowed) {
    return (
      <AppShell title="Evaluation">
        <div className="mx-auto max-w-3xl rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-8 text-center">
          <p className="font-semibold text-mm-navy">Evaluation not found</p>
          <Link
            href="/profile#evaluations"
            className="mt-4 inline-flex font-semibold text-mm-teal"
          >
            Back to profile evaluations
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Evaluation">
      <div className="mx-auto max-w-3xl space-y-5">
        <Link
          href="/profile#evaluations"
          className="inline-flex items-center gap-2 text-sm font-semibold text-mm-teal hover:underline"
        >
          <ArrowLeft size={16} />
          Back to evaluations
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
              {evaluation.referenceNumber}
            </p>
            <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-3xl text-mm-navy">
              {evaluation.specialtyName}
            </h1>
            <p className="mt-2 text-mm-text-secondary">
              {evaluationPeriodLabel(evaluation)} ·{" "}
              {evaluation.hostingHospitalName}
            </p>
            <p className="mt-3 inline-flex rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700">
              {evaluationStatusLabel(evaluation.status)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openEvaluationPdf(evaluation)}
            className="inline-flex min-h-10 items-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.8125rem] font-semibold text-mm-navy"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Rotation details
          </h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-mm-text-muted">Student</dt>
              <dd className="mt-1 font-medium text-mm-navy">
                {evaluation.studentName}
              </dd>
            </div>
            <div>
              <dt className="text-mm-text-muted">Evaluator</dt>
              <dd className="mt-1 font-medium text-mm-navy">
                {evaluation.evaluatorName}
              </dd>
            </div>
            <div>
              <dt className="text-mm-text-muted">Evaluation date</dt>
              <dd className="mt-1 font-medium text-mm-navy">
                {evaluation.evaluationDate}
              </dd>
            </div>
            <div>
              <dt className="text-mm-text-muted">Home hospital</dt>
              <dd className="mt-1 font-medium text-mm-navy">
                {evaluation.homeHospitalName}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5">
          <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
            Rotation Evaluation
          </h2>
          <p className="mt-4 whitespace-pre-wrap text-[0.875rem] leading-relaxed text-mm-navy">
            {evaluation.body}
          </p>
          {evaluation.authenticatedByHostingHospital ? (
            <p className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-teal/25 bg-mm-teal-50 px-3.5 py-3 text-sm font-semibold text-mm-teal-700">
              Authenticated by Hosting Hospital
            </p>
          ) : null}
          <p className="mt-3 text-[0.8125rem] text-mm-text-muted">
            Students can view and download evaluations. Editing is not available.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
