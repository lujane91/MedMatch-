"use client";

import { useMemo, useState } from "react";
import { Input, SearchableSelect } from "@/components/ui";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import type { InternProfile, TrainingStage } from "@/data/intern";
import { NATIONALITY_COUNTRIES, SAUDI_ARABIA } from "@/data/countries";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { getSubspecialtiesForSpecialty } from "@/data/saudi-subspecialties";
import { SAUDI_CITIES, SAUDI_HOSPITAL_NAMES } from "@/data/saudi-hospitals";
import type {
  ApplicationDocumentLink,
  DirectTrainingApplicationInput,
} from "@/data/training-applications";
import {
  DOCUMENT_TYPE_LABELS,
  type TrainingDocumentType,
  type UserDocument,
} from "@/data/training-documents";
import {
  MEDJOURNEY_APPLICATION_FEE_SAR,
  externalRotationRequirementsForCountry,
  formatDateRange,
  formatMedJourneyFee,
  monthNameFromIsoDate,
  type TrainingRequirement,
} from "@/data/training-opportunities";
import { cn } from "@/lib/cn";

type RequestStep = 1 | 2 | 3 | 4 | 5;

type Props = {
  profile: InternProfile;
  stage: TrainingStage;
  applicantKey: string;
  userDocs: UserDocument[];
  latestDocumentOfType: (
    type: TrainingDocumentType,
  ) => UserDocument | undefined;
  uploadDocument: (input: {
    userId: string;
    documentType: TrainingDocumentType;
    fileName: string;
  }) => UserDocument;
  onSubmit: (input: DirectTrainingApplicationInput) => void;
  onCancel: () => void;
};

function shiftIsoDate(iso: string, days: number) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function ExternalRotationRequestFlow({
  profile,
  stage,
  applicantKey,
  userDocs,
  latestDocumentOfType,
  uploadDocument,
  onSubmit,
  onCancel,
}: Props) {
  const isFellow = stage === "fellow" || stage === "fellowship";
  const specialtyOptions = useMemo(
    () => [...getSpecialtiesForField(profile.field)],
    [profile.field],
  );

  const [step, setStep] = useState<RequestStep>(1);
  const [country, setCountry] = useState(SAUDI_ARABIA);
  const [city, setCity] = useState("");
  const [hospital, setHospital] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [subspecialty, setSubspecialty] = useState(
    isFellow ? profile.subspecialty || "" : "",
  );
  const [trainingFocus, setTrainingFocus] = useState("");
  const [docSelections, setDocSelections] = useState<
    Record<string, string | null>
  >({});
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [error, setError] = useState("");

  const subspecialtyOptions = useMemo(
    () => [...getSubspecialtiesForSpecialty(specialty)],
    [specialty],
  );

  const requirements = useMemo(
    () => externalRotationRequirementsForCountry(country),
    [country],
  );

  function buildLinks(reqs: TrainingRequirement[]): ApplicationDocumentLink[] {
    return reqs.map((req) => {
      const selectedDocId = docSelections[req.id];
      const doc = userDocs.find((d) => d.id === selectedDocId);
      let status: ApplicationDocumentLink["status"] = "Missing";
      if (!req.required && !doc) status = "Optional";
      else if (doc?.status === "Expired") status = "Expired";
      else if (doc) status = "Uploaded";
      else status = req.required ? "Missing" : "Optional";
      return {
        requirementId: req.id,
        documentType: req.documentType,
        label: req.label,
        required: req.required,
        userDocumentId: doc?.id ?? null,
        status,
      };
    });
  }

  const linksPreview = buildLinks(requirements);

  function ensureDocSelections(reqs: TrainingRequirement[]) {
    setDocSelections((prev) => {
      const next = { ...prev };
      for (const req of reqs) {
        if (next[req.id] !== undefined) continue;
        const existing = latestDocumentOfType(req.documentType);
        next[req.id] =
          existing && existing.status === "Uploaded" ? existing.id : null;
      }
      return next;
    });
  }

  function validateForm() {
    if (!country.trim()) return "Please select a country.";
    if (!city.trim()) return "Please enter a city.";
    if (!hospital.trim()) {
      return "Please select or enter a hospital or institution.";
    }
    if (!fromDate || !toDate) return "Please choose From Date and To Date.";
    if (toDate <= fromDate) return "To Date must be after From Date.";
    if (!specialty.trim()) return "Please select a specialty.";
    if (!trainingFocus.trim()) return "Please describe your Training Focus.";
    return "";
  }

  function goToDocuments() {
    const message = validateForm();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    ensureDocSelections(requirements);
    setStep(2);
  }

  function goToReview() {
    const missing = linksPreview
      .filter((l) => l.required && l.status !== "Uploaded")
      .map((l) => l.label);
    if (missing.length) {
      setError(`Missing: ${missing.join(", ")}`);
      return;
    }
    setError("");
    setStep(3);
  }

  function handleFinalSubmit() {
    if (!paymentPaid) {
      setError("Please complete payment before submitting.");
      return;
    }
    const links = buildLinks(requirements);
    const missing = links
      .filter((l) => l.required && l.status !== "Uploaded")
      .map((l) => l.label);
    if (missing.length) {
      setError(`Missing: ${missing.join(", ")}`);
      return;
    }
    onSubmit({
      applicantKey,
      journeyStage: stage,
      healthcareField: profile.field,
      trainingType: "external-rotation",
      hospital,
      city,
      country,
      specialty,
      subspecialty,
      trainingFocus,
      month: monthNameFromIsoDate(fromDate),
      startDate: fromDate,
      endDate: toDate,
      documents: links,
      markPaid: true,
    });
  }

  return (
    <DashboardSection title="Request an External Rotation">
      <p className="mb-4 text-[0.875rem] text-mm-text-secondary">
        Choose your preferred hospital, dates and training focus and submit a
        rotation request.
      </p>

      {step === 1 ? (
        <div className="space-y-3">
          <SearchableSelect
            label="Country"
            value={country}
            onChange={setCountry}
            options={[...NATIONALITY_COUNTRIES]}
            allowOther={false}
          />
          <SearchableSelect
            label="City"
            value={city}
            onChange={setCity}
            options={[...SAUDI_CITIES]}
          />
          <SearchableSelect
            label="Hospital or Institution"
            value={hospital}
            onChange={setHospital}
            options={[...SAUDI_HOSPITAL_NAMES]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <Input
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <SearchableSelect
            label="Specialty"
            value={specialty}
            onChange={(value) => {
              setSpecialty(value);
              const nextSubs = getSubspecialtiesForSpecialty(value);
              if (
                isFellow &&
                profile.specialty === value &&
                profile.subspecialty
              ) {
                setSubspecialty(profile.subspecialty);
              } else if (!nextSubs.includes(subspecialty)) {
                setSubspecialty("");
              }
            }}
            options={specialtyOptions}
            allowOther={false}
          />
          {subspecialtyOptions.length > 0 ? (
            <SearchableSelect
              label={isFellow ? "Subspecialty / advanced area" : "Subspecialty"}
              value={subspecialty}
              onChange={setSubspecialty}
              options={subspecialtyOptions}
              allowOther={false}
            />
          ) : null}
          <Input
            label="Training Focus"
            value={trainingFocus}
            onChange={(e) => setTrainingFocus(e.target.value)}
            placeholder={
              isFellow
                ? "e.g. Advanced echocardiography, ECMO, heart failure service"
                : "e.g. Advanced trauma and damage control surgery"
            }
          />
          <p className="text-[0.75rem] text-mm-text-muted">
            Describe the exact subject, procedure, service, or skill you want
            exposure to.
          </p>

          {error ? (
            <p className="text-[0.8125rem] font-medium text-mm-error-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={goToDocuments}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <p className="text-[0.875rem] font-semibold text-mm-navy">
            Required Documents
          </p>
          {requirements.map((req) => {
            const selectedDocId = docSelections[req.id];
            const selectedDoc = userDocs.find((d) => d.id === selectedDocId);
            const existing = latestDocumentOfType(req.documentType);
            return (
              <div
                key={req.id}
                className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3"
              >
                <p className="text-[0.875rem] font-semibold text-mm-navy">
                  {req.label}
                  {!req.required ? (
                    <span className="ml-2 text-[0.75rem] font-medium text-mm-text-muted">
                      Optional
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-[0.75rem] text-mm-text-muted">
                  {selectedDoc
                    ? selectedDoc.fileName
                    : existing
                      ? `Existing: ${existing.fileName}`
                      : "Not uploaded"}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {existing && existing.id !== selectedDocId ? (
                    <button
                      type="button"
                      onClick={() =>
                        setDocSelections((prev) => ({
                          ...prev,
                          [req.id]: existing.id,
                        }))
                      }
                      className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.75rem] font-semibold text-mm-navy"
                    >
                      Use Existing Document
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => {
                      const uploaded = uploadDocument({
                        userId: applicantKey,
                        documentType: req.documentType,
                        fileName: `${DOCUMENT_TYPE_LABELS[req.documentType].replace(/\s+/g, "_")}.pdf`,
                      });
                      setDocSelections((prev) => ({
                        ...prev,
                        [req.id]: uploaded.id,
                      }));
                    }}
                    className="min-h-10 rounded-[var(--mm-radius-lg)] bg-mm-teal px-3 text-[0.75rem] font-semibold text-white"
                  >
                    {selectedDoc ? "Replace" : "Upload New Document"}
                  </button>
                </div>
              </div>
            );
          })}

          {error ? (
            <p className="text-[0.8125rem] font-medium text-mm-error-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
            >
              Back
            </button>
            <button
              type="button"
              onClick={goToReview}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
            >
              Continue
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-4">
          <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3 text-[0.875rem]">
            <p className="font-semibold text-mm-navy">Review Request</p>
            <dl className="mt-3 space-y-2 text-mm-text-secondary">
              <div className="flex justify-between gap-3">
                <dt>Hospital or Institution</dt>
                <dd className="text-right font-medium text-mm-navy">
                  {hospital}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Country</dt>
                <dd className="text-right font-medium text-mm-navy">{country}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>City</dt>
                <dd className="text-right font-medium text-mm-navy">{city}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>From Date</dt>
                <dd className="text-right font-medium text-mm-navy">{fromDate}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>To Date</dt>
                <dd className="text-right font-medium text-mm-navy">{toDate}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Specialty</dt>
                <dd className="text-right font-medium text-mm-navy">{specialty}</dd>
              </div>
              {subspecialty ? (
                <div className="flex justify-between gap-3">
                  <dt>Subspecialty</dt>
                  <dd className="text-right font-medium text-mm-navy">
                    {subspecialty}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt>Training Focus</dt>
                <dd className="text-right font-medium text-mm-navy">
                  {trainingFocus}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Dates</dt>
                <dd className="text-right font-medium text-mm-navy">
                  {formatDateRange(fromDate, toDate)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--mm-radius-lg)] bg-mm-gray-50 px-4 py-3">
            <p className="text-[0.8125rem] font-semibold text-mm-navy">
              Required Documents
            </p>
            <ul className="mt-2 space-y-1 text-[0.8125rem]">
              {linksPreview.map((link) => (
                <li
                  key={link.requirementId}
                  className="flex justify-between gap-2"
                >
                  <span className="text-mm-text-secondary">{link.label}</span>
                  <span
                    className={cn(
                      "font-semibold",
                      link.status === "Uploaded"
                        ? "text-mm-teal"
                        : "text-amber-800",
                    )}
                  >
                    {link.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {error ? (
            <p className="text-[0.8125rem] font-medium text-mm-error-700">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep(4);
              }}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-5">
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-6 text-center">
            <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-mm-text-muted">
              Application Payment
            </p>
            <p className="mt-3 font-[family-name:var(--mm-font-display)] text-[2.5rem] leading-none tracking-[-0.03em] text-mm-navy">
              {formatMedJourneyFee(MEDJOURNEY_APPLICATION_FEE_SAR)}
            </p>
            <p className="mt-3 text-[0.875rem] text-mm-text-secondary">
              MedJourney application payment for this External Rotation request.
            </p>
          </div>

          <div className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-4 py-4 text-[0.875rem] leading-relaxed text-mm-navy">
            <p className="font-semibold">Refund policy</p>
            <p className="mt-2 text-mm-text-secondary">
              If your application is not accepted, the SAR 100 payment will be
              refunded.
            </p>
            <p className="mt-2 text-mm-text-secondary">
              Waitlisted applications do not trigger an automatic refund yet.
            </p>
            <p className="mt-2 text-mm-text-secondary">
              If you withdraw your application, the SAR 100 payment is
              nonrefundable unless there are extenuating circumstances.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] border border-mm-border text-[0.875rem] font-semibold text-mm-navy"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setPaymentPaid(true);
                setError("");
                setStep(5);
              }}
              className="min-h-11 flex-1 rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white"
            >
              Pay SAR 100
            </button>
          </div>
        </div>
      ) : null}

      {step === 5 ? (
        <div className="space-y-5">
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-border px-5 py-8 text-center">
            <p className="text-[1.125rem] font-semibold text-mm-navy">
              Payment Successful
            </p>
            <p className="mt-2 text-[0.9375rem] text-mm-text-secondary">
              SAR 100 paid
            </p>
            <p className="mt-4 text-[0.8125rem] text-mm-text-muted">
              Payment is complete. Submit your request to send it for review.
            </p>
          </div>

          {error ? (
            <p className="text-[0.8125rem] font-medium text-mm-error-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            disabled={!paymentPaid}
            onClick={handleFinalSubmit}
            className={cn(
              "inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal text-[0.875rem] font-semibold text-white",
              !paymentPaid && "cursor-not-allowed opacity-50",
            )}
          >
            Submit Application
          </button>
        </div>
      ) : null}
    </DashboardSection>
  );
}

/** Demo helper: propose dates about one month after the requested window. */
export function proposeExternalAlternativeDates(
  startDate: string,
  endDate: string,
) {
  return {
    proposedStartDate: shiftIsoDate(startDate, 31),
    proposedEndDate: shiftIsoDate(endDate, 31),
  };
}
