"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, Eye, FileUp, Send } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  Panel,
  ToastBanner,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
} from "@/components/hospital/hospital-ui";
import {
  evaluationPeriodLabel,
  evaluationStatusLabel,
  formatEvaluationFileSize,
  openEvaluationAttachment,
  openEvaluationPdf,
} from "@/data/evaluations";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalEvaluationDetailPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const returnToParam = searchParams.get("returnTo");
  const returnTo =
    returnToParam &&
    (returnToParam.startsWith("/hospital/") ||
      returnToParam.startsWith("/demo/"))
      ? returnToParam
      : null;
  const { getById, sendToHomeHospital } = useEvaluationStore();
  const { activeHospitalId } = useHospitalStore();
  const { toast, show, clear } = useToast();
  const evaluation = getById(params.id);

  if (!evaluation) {
    return (
      <HospitalShell title="Evaluation">
        <Panel>
          <p className="text-sm text-mm-text-secondary">Evaluation not found.</p>
          <Link
            href={returnTo ?? "/hospital/evaluations"}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
          >
            <ArrowLeft size={16} />
            {returnTo ? "Back to specialty rotations" : "Back to evaluations"}
          </Link>
        </Panel>
      </HospitalShell>
    );
  }

  const canSend =
    evaluation.hostingHospitalId === activeHospitalId &&
    evaluation.status === "Submitted" &&
    evaluation.homeHospitalId !== evaluation.hostingHospitalId;

  return (
    <HospitalShell title="Evaluation">
      <Link
        href={returnTo ?? "/hospital/evaluations"}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
      >
        <ArrowLeft size={16} />
        {returnTo ? "Back to specialty rotations" : "Back to evaluations"}
      </Link>

      <ToastBanner toast={toast} onDismiss={clear} />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
            {evaluation.referenceNumber}
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-mm-navy">
            {evaluation.studentName}
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {evaluation.specialtyName} · {evaluationPeriodLabel(evaluation)}
          </p>
          <p className="mt-3 inline-flex rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700">
            {evaluationStatusLabel(evaluation.status)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={buttonSecondaryClass}
            onClick={() => openEvaluationPdf(evaluation)}
          >
            <Download size={16} aria-hidden />
            Download PDF
          </button>
          {canSend ? (
            <button
              type="button"
              className={buttonPrimaryClass}
              onClick={() => {
                sendToHomeHospital(evaluation.id);
                show("Evaluation sent to home hospital.", "success");
              }}
            >
              <Send size={16} aria-hidden />
              Send to Home Hospital
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Student information
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Name</dt>
              <dd className="font-medium text-mm-navy">{evaluation.studentName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Student ID</dt>
              <dd className="font-medium text-mm-navy">{evaluation.studentId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">University</dt>
              <dd className="text-right font-medium text-mm-navy">
                {evaluation.university}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Home hospital</dt>
              <dd className="text-right font-medium text-mm-navy">
                {evaluation.homeHospitalName}
              </dd>
            </div>
          </dl>
        </Panel>

        <Panel>
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Rotation information
          </h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Hosting hospital</dt>
              <dd className="text-right font-medium text-mm-navy">
                {evaluation.hostingHospitalName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Specialty</dt>
              <dd className="font-medium text-mm-navy">
                {evaluation.specialtyName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Rotation month</dt>
              <dd className="font-medium text-mm-navy">
                {evaluationPeriodLabel(evaluation)}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Evaluator</dt>
              <dd className="font-medium text-mm-navy">
                {evaluation.evaluatorName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mm-text-muted">Evaluation date</dt>
              <dd className="font-medium text-mm-navy">
                {formatDate(evaluation.evaluationDate)}
              </dd>
            </div>
          </dl>
        </Panel>
      </div>

      <Panel className="mt-4">
        <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
          Rotation Evaluation
        </h3>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-mm-navy">
          {evaluation.body.trim()
            ? evaluation.body
            : "No written evaluation was provided. See the uploaded hospital form below."}
        </p>
        {evaluation.authenticatedByHostingHospital ? (
          <p className="mt-5 rounded-[var(--mm-radius-lg)] border border-mm-teal/25 bg-mm-teal-50 px-3.5 py-3 text-sm font-semibold text-mm-teal-700">
            Authenticated by Hosting Hospital (demo)
          </p>
        ) : null}
        {evaluation.locked ? (
          <p className="mt-3 text-[0.8125rem] text-mm-text-muted">
            This evaluation is locked and cannot be edited.
          </p>
        ) : null}
      </Panel>

      {evaluation.attachment ? (
        <Panel className="mt-4">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Uploaded Hospital Evaluation Form
          </h3>
          <div className="mt-4 flex items-start gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50/70 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal-700">
              <FileUp size={18} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-mm-navy">
                {evaluation.attachment.fileName}
              </p>
              <dl className="mt-2 grid gap-1 text-[0.8125rem] text-mm-text-secondary sm:grid-cols-2">
                <div>
                  <span className="text-mm-text-muted">File type: </span>
                  {evaluation.attachment.fileType}
                </div>
                <div>
                  <span className="text-mm-text-muted">File size: </span>
                  {formatEvaluationFileSize(evaluation.attachment.fileSize)}
                </div>
                <div>
                  <span className="text-mm-text-muted">Upload date: </span>
                  {formatDate(evaluation.attachment.uploadedAt)}
                </div>
                <div>
                  <span className="text-mm-text-muted">Uploaded by: </span>
                  {evaluation.attachment.uploadedBy}
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={cn(
                    buttonSecondaryClass,
                    "px-2.5 py-1.5 text-[0.75rem]",
                  )}
                  onClick={() =>
                    openEvaluationAttachment(evaluation.attachment!, "preview")
                  }
                >
                  <Eye size={14} aria-hidden />
                  Preview
                </button>
                <button
                  type="button"
                  className={cn(
                    buttonSecondaryClass,
                    "px-2.5 py-1.5 text-[0.75rem]",
                  )}
                  onClick={() =>
                    openEvaluationAttachment(evaluation.attachment!, "download")
                  }
                >
                  <Download size={14} aria-hidden />
                  Download
                </button>
              </div>
              <p className="mt-3 text-[0.8125rem] text-mm-text-muted">
                This document is locked with the evaluation and cannot be
                replaced or removed.
              </p>
            </div>
          </div>
        </Panel>
      ) : null}
    </HospitalShell>
  );
}
