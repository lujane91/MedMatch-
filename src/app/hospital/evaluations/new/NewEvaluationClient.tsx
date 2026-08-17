"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Eye,
  FileUp,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import {
  Panel,
  ToastBanner,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import { Input } from "@/components/ui/Input";
import {
  EVALUATION_FORM_ACCEPT,
  EVALUATION_FORM_MAX_BYTES,
  evaluationFileExtensionLabel,
  formatEvaluationFileSize,
  isAllowedEvaluationFormFile,
  openEvaluationAttachment,
  type EvaluationFormAttachment,
} from "@/data/evaluations";
import { monthLabel } from "@/data/hospital-demo";
import { resolveRotationApplication } from "@/data/rotation-workflow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { withHospitalBase } from "@/lib/hospital-base-path";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export function NewEvaluationClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";
  const returnToParam = searchParams.get("returnTo");
  const returnTo =
    returnToParam &&
    (returnToParam.startsWith("/hospital/") ||
      returnToParam.startsWith("/demo/"))
      ? returnToParam
      : null;
  const backLabel = returnTo
    ? "Back to specialty rotations"
    : "Back to student details";
  const { applications, activeHospitalId, activeHospital } = useHospitalStore();
  const { submitEvaluation, getForApplication } = useEvaluationStore();
  const { year } = useHospitalMonth();
  const { toast, show, clear } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const application = useMemo(
    () =>
      resolveRotationApplication(applicationId, applications, {
        hospitalId: activeHospitalId,
        specialtyId: "emergency-medicine",
        month: "01",
        year,
      }) ?? null,
    [applicationId, applications, activeHospitalId, year],
  );
  const existing = applicationId
    ? getForApplication(applicationId)
    : undefined;

  const [evaluatorName, setEvaluatorName] = useState(
    activeHospital?.adminName ?? "",
  );
  const [evaluationDate, setEvaluationDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [body, setBody] = useState("");
  const [attachment, setAttachment] = useState<EvaluationFormAttachment | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelected(file: File | null) {
    if (!file) return;
    if (!isAllowedEvaluationFormFile(file)) {
      const message =
        "Accepted file types: PDF, DOC, DOCX, JPG, JPEG, and PNG.";
      setError(message);
      show(message, "error");
      return;
    }
    if (file.size > EVALUATION_FORM_MAX_BYTES) {
      const message = "File must be 2.5 MB or smaller for this demo.";
      setError(message);
      show(message, "error");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setAttachment({
        fileName: file.name,
        fileType: evaluationFileExtensionLabel(file.name),
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        uploadedBy: evaluatorName.trim() || activeHospital?.adminName || "Hospital admin",
        dataUrl,
      });
      setError(null);
      show("Evaluation form uploaded.", "success");
    } catch {
      const message = "Could not upload that file. Please try again.";
      setError(message);
      show(message, "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!application) return;
    if (existing?.locked) {
      const target = withHospitalBase(
        pathname,
        `/hospital/evaluations/${existing.id}`,
      );
      router.push(
        returnTo
          ? `${target}?returnTo=${encodeURIComponent(returnTo)}`
          : target,
      );
      return;
    }
    if (!body.trim() && !attachment) {
      const message =
        "Add a written evaluation, upload a hospital form, or both before submitting.";
      setError(message);
      show(message, "error");
      return;
    }
    const result = submitEvaluation({
      application,
      hostingHospitalId: activeHospitalId,
      evaluatorName,
      evaluationDate,
      body,
      attachment,
      year,
    });
    if (!result) {
      const message =
        "Evaluator name and evaluation date are required. Add text and/or an uploaded form.";
      setError(message);
      show(message, "error");
      return;
    }
    show("Evaluation submitted and locked.", "success");
    const target = withHospitalBase(
      pathname,
      `/hospital/evaluations/${result.id}`,
    );
    router.push(
      returnTo ? `${target}?returnTo=${encodeURIComponent(returnTo)}` : target,
    );
  }

  if (!application) {
    return (
      <HospitalShell title="Evaluate Student">
        <Panel>
          <p className="text-sm text-mm-text-secondary">
            Select a trainee from Rotation Rosters or Accepted to evaluate.
          </p>
          <Link
            href={returnTo ?? "/hospital/rotations"}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
          >
            <ArrowLeft size={16} />
            {returnTo ? "Back to specialty rotations" : "Back to rotations"}
          </Link>
        </Panel>
      </HospitalShell>
    );
  }

  if (existing?.locked) {
    return (
      <HospitalShell title="Evaluate Student">
        <Panel>
          <p className="text-sm text-mm-text-secondary">
            An evaluation already exists for this rotation and is locked.
          </p>
          <Link
            href={
              returnTo
                ? withHospitalBase(
                    pathname,
                    `/hospital/evaluations/${existing.id}?returnTo=${encodeURIComponent(returnTo)}`,
                  )
                : withHospitalBase(
                    pathname,
                    `/hospital/evaluations/${existing.id}`,
                  )
            }
            className="mt-4 inline-flex text-sm font-semibold text-mm-teal-700 hover:underline"
          >
            View evaluation
          </Link>
        </Panel>
      </HospitalShell>
    );
  }

  return (
    <HospitalShell title="Evaluate Student">
      <Link
        href={
          returnTo ||
          withHospitalBase(pathname, `/hospital/applications/${application.id}`)
        }
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-mm-teal-700 hover:underline"
      >
        <ArrowLeft size={16} />
        {backLabel}
      </Link>

      <ToastBanner toast={toast} onDismiss={clear} />

      <Panel className="mb-4">
        <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
          Student information
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-mm-text-muted">Student</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {application.applicantName}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">University</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {application.university}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">Student ID</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {application.studentId}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">Home hospital</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {application.applicantType === "Internal"
                ? activeHospital?.name
                : application.affiliatedHospital || application.university}
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel className="mb-4">
        <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
          Rotation information
        </h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-mm-text-muted">Hosting hospital</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {activeHospital?.name}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">Specialty</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {specialtyName(application.specialtyId)}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">Rotation month</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {monthLabel(application.month)} {year}
            </dd>
          </div>
          <div>
            <dt className="text-mm-text-muted">Applicant type</dt>
            <dd className="mt-1 font-medium text-mm-navy">
              {application.applicantType}
            </dd>
          </div>
        </dl>
      </Panel>

      <Panel>
        <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
          Evaluation form
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Write the evaluation according to your hospital’s internal system,
          upload your official form, or both. No scoring scales are required.
        </p>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Input
            label="Evaluator Name"
            name="evaluatorName"
            required
            value={evaluatorName}
            onChange={(e) => setEvaluatorName(e.target.value)}
            placeholder="Dr. …"
          />
          <Input
            label="Evaluation Date"
            name="evaluationDate"
            type="date"
            required
            value={evaluationDate}
            onChange={(e) => setEvaluationDate(e.target.value)}
          />
          <label className="block">
            <span className="mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
              Rotation Evaluation
            </span>
            <textarea
              rows={10}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter the full rotation evaluation (optional if you upload a form)…"
              className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 py-2.5 text-sm text-mm-navy outline-none focus:border-mm-teal focus:ring-2 focus:ring-mm-teal/20"
            />
          </label>

          <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-gray-50/70 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                  Upload Hospital Evaluation Form
                </h3>
                <p className="mt-1 text-sm text-mm-text-secondary">
                  Optional. Upload your hospital’s signed, stamped, or scanned
                  evaluation form (PDF, DOC, DOCX, JPG, JPEG, PNG).
                </p>
              </div>
              {!attachment ? (
                <button
                  type="button"
                  className={buttonSecondaryClass}
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} aria-hidden />
                  {uploading ? "Uploading…" : "Upload Evaluation Form"}
                </button>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={EVALUATION_FORM_ACCEPT}
              className="sr-only"
              onChange={(e) =>
                void handleFileSelected(e.target.files?.[0] ?? null)
              }
            />

            {attachment ? (
              <div className="mt-4 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal-50 text-mm-teal-700">
                    <FileUp size={18} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-mm-navy">
                      {attachment.fileName}
                    </p>
                    <dl className="mt-2 grid gap-1 text-[0.8125rem] text-mm-text-secondary sm:grid-cols-2">
                      <div>
                        <span className="text-mm-text-muted">File type: </span>
                        {attachment.fileType}
                      </div>
                      <div>
                        <span className="text-mm-text-muted">File size: </span>
                        {formatEvaluationFileSize(attachment.fileSize)}
                      </div>
                      <div>
                        <span className="text-mm-text-muted">Upload date: </span>
                        {formatDate(attachment.uploadedAt)}
                      </div>
                      <div>
                        <span className="text-mm-text-muted">Uploaded by: </span>
                        {attachment.uploadedBy}
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
                          openEvaluationAttachment(attachment, "preview")
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
                          openEvaluationAttachment(attachment, "download")
                        }
                      >
                        <Download size={14} aria-hidden />
                        Download
                      </button>
                      <button
                        type="button"
                        className={cn(
                          buttonSecondaryClass,
                          "px-2.5 py-1.5 text-[0.75rem]",
                        )}
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <RefreshCw size={14} aria-hidden />
                        Replace
                      </button>
                      <button
                        type="button"
                        className={cn(
                          buttonSecondaryClass,
                          "border-mm-error/30 px-2.5 py-1.5 text-[0.75rem] text-mm-error-700 hover:bg-mm-error-50",
                        )}
                        onClick={() => setAttachment(null)}
                      >
                        <Trash2 size={14} aria-hidden />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {error ? (
            <p
              className="text-[0.8125rem] font-medium text-mm-error-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <button type="submit" className={buttonPrimaryClass}>
              Submit evaluation
            </button>
            <Link
              href={
                returnTo ||
                withHospitalBase(
                  pathname,
                  `/hospital/applications/${application.id}`,
                )
              }
              className={buttonSecondaryClass}
            >
              Cancel
            </Link>
          </div>
        </form>
      </Panel>
    </HospitalShell>
  );
}
