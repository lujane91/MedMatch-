"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Input, SearchableSelect } from "@/components/ui";
import { getAdvancedTrainingProgramsForField } from "@/data/advanced-training-programs";
import {
  composeFullName,
  journeyPathsForField,
  needsProfessionalLevel,
  trainingStageLabel,
  type HealthcareField,
  type ProfessionalLevel,
  type TrainingStage,
} from "@/data/intern";
import { SAUDI_HOSPITAL_NAMES } from "@/data/saudi-hospitals";
import { getSpecialtiesForField } from "@/data/saudi-specialties";
import { getSubspecialtiesForSpecialty } from "@/data/saudi-subspecialties";
import { SAUDI_UNIVERSITY_NAMES } from "@/data/saudi-universities";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

const yearOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
] as const;

const HEALTHCARE_FIELD_OPTIONS: { id: HealthcareField; title: string }[] = [
  { id: "medicine", title: "Medicine" },
  { id: "dentistry", title: "Dentistry" },
  { id: "pharmacy", title: "Pharmacy" },
  { id: "nursing", title: "Nursing" },
  { id: "allied", title: "Allied Health" },
];

const PROFESSIONAL_LEVEL_OPTIONS: {
  id: ProfessionalLevel;
  title: string;
}[] = [
  { id: "gp", title: "General Practitioner" },
  { id: "specialist", title: "Specialist" },
  { id: "consultant", title: "Consultant" },
];

const HOSPITAL_OR_UNIVERSITY_OPTIONS = Array.from(
  new Set([...SAUDI_HOSPITAL_NAMES, ...SAUDI_UNIVERSITY_NAMES]),
).sort((a, b) => a.localeCompare(b));

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required,
  className,
}: {
  id: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      {label ? (
        <label
          htmlFor={id}
          className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
        >
          {label}
        </label>
      ) : null}
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3.5 py-2.5 text-[0.9375rem] text-mm-navy outline-none transition-[border-color,box-shadow] duration-[var(--mm-duration)]",
          "focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]",
        )}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function YearOutOfTotal({
  label,
  currentId,
  totalId,
  currentValue,
  totalValue,
  onCurrentChange,
  onTotalChange,
}: {
  label: string;
  currentId: string;
  totalId: string;
  currentValue: string;
  totalValue: string;
  onCurrentChange: (value: string) => void;
  onTotalChange: (value: string) => void;
}) {
  return (
    <div className="w-full">
      <p className="mb-1.5 text-[0.8125rem] font-medium text-mm-navy">{label}</p>
      <div className="flex items-center gap-2">
        <SelectField
          id={currentId}
          value={currentValue}
          onChange={onCurrentChange}
          options={yearOptions}
          required
          className="flex-1"
        />
        <span className="shrink-0 text-[0.875rem] text-mm-text-muted">
          out of
        </span>
        <SelectField
          id={totalId}
          value={totalValue}
          onChange={onTotalChange}
          options={yearOptions}
          required
          className="flex-1"
        />
      </div>
    </div>
  );
}

function yearProgressLabel(stage: TrainingStage | null) {
  if (stage === "medical-student") return "Current Academic Year";
  if (stage === "intern") return "Current Internship Year";
  if (stage === "advanced-training") return "Current Training Year";
  if (stage === "resident") return "Current Residency Year";
  if (stage === "fellow") return "Current Fellowship Year";
  return "Current Year";
}

export default function CreateAccountPage() {
  const router = useRouter();
  const { profile, setAccountBasics, updateProfile } = useInternStore();
  const { resetForNewAccount } = useSubscriptionStore();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(profile.firstName || "");
  const [middleName, setMiddleName] = useState(profile.middleName || "");
  const [lastName, setLastName] = useState(profile.lastName || "");
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth || "");
  const [nationalId, setNationalId] = useState(profile.nationalId || "");
  const [personalEmail, setPersonalEmail] = useState(profile.email || "");
  const [institutionEmail, setInstitutionEmail] = useState(
    profile.institutionEmail || "",
  );
  const [mobile, setMobile] = useState(profile.mobile || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState(profile.photoDataUrl || "");

  const [field, setField] = useState<HealthcareField | null>(profile.field);
  const [stage, setStage] = useState<TrainingStage | null>(
    profile.trainingStage,
  );
  const [professionalLevel, setProfessionalLevel] =
    useState<ProfessionalLevel | null>(profile.professionalLevel);

  const [university, setUniversity] = useState(profile.university || "");
  const [trainingInstitution, setTrainingInstitution] = useState(
    profile.trainingInstitution || "",
  );
  const [currentYear, setCurrentYear] = useState(profile.currentYear || "");
  const [totalYears, setTotalYears] = useState(profile.totalYears || "");
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [subspecialty, setSubspecialty] = useState(profile.subspecialty || "");
  const [error, setError] = useState("");

  const journeyPathOptions = useMemo(() => {
    return journeyPathsForField(field).map((id) => trainingStageLabel(id));
  }, [field]);

  const journeyPathValue = stage ? trainingStageLabel(stage) : "";

  const specialtyOptions = useMemo(() => {
    if (stage === "advanced-training") {
      return getAdvancedTrainingProgramsForField(field);
    }
    return getSpecialtiesForField(field);
  }, [field, stage]);

  const subspecialtyOptions = useMemo(
    () => getSubspecialtiesForSpecialty(specialty),
    [specialty],
  );

  const showProfessionalLevel = needsProfessionalLevel(stage, field);
  const showSpecialtyForPractice =
    stage === "medical-practice" &&
    showProfessionalLevel &&
    (professionalLevel === "specialist" ||
      professionalLevel === "consultant" ||
      professionalLevel === "gp");
  const specialtyRequiredForPractice =
    professionalLevel === "specialist" || professionalLevel === "consultant";

  function onFieldChange(nextTitle: string) {
    const next =
      HEALTHCARE_FIELD_OPTIONS.find((item) => item.title === nextTitle)?.id ??
      null;
    if (!next) return;
    setField(next);
    setSpecialty("");
    setSubspecialty("");
    setProfessionalLevel(null);
    const allowed = journeyPathsForField(next);
    if (stage && !allowed.includes(stage)) {
      setStage(null);
      setUniversity("");
      setTrainingInstitution("");
      setCurrentYear("");
      setTotalYears("");
    }
  }

  function onStageChange(nextLabel: string) {
    const next =
      (journeyPathsForField(field).find(
        (id) => trainingStageLabel(id) === nextLabel,
      ) as TrainingStage | undefined) ?? null;
    if (!next) return;
    setStage(next);
    setProfessionalLevel(null);
    setSpecialty("");
    setSubspecialty("");
    setUniversity("");
    setTrainingInstitution("");
    setCurrentYear("");
    setTotalYears("");
  }

  function onProfessionalLevelChange(nextTitle: string) {
    const next =
      PROFESSIONAL_LEVEL_OPTIONS.find((item) => item.title === nextTitle)?.id ??
      null;
    if (!next) return;
    setProfessionalLevel(next);
    if (next !== "consultant") setSubspecialty("");
    if (next === "gp") {
      // Specialty remains optional for GP; clear subspecialty.
      setSubspecialty("");
    }
  }

  function onSpecialtyChange(next: string) {
    setSpecialty(next);
    setSubspecialty("");
  }

  function onPhotoSelected(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPhotoDataUrl(result);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !dateOfBirth ||
      !nationalId.trim() ||
      !personalEmail.trim() ||
      !institutionEmail.trim() ||
      !mobile.trim()
    ) {
      setError("Please complete all required personal details.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!field || !stage) {
      setError("Please select your Healthcare Field and Journey Path.");
      return;
    }

    if (stage === "medical-student" || stage === "intern") {
      if (!university.trim() || !currentYear || !totalYears) {
        setError("Please complete all required journey fields.");
        return;
      }
    }
    if (stage === "advanced-training" || stage === "resident") {
      if (
        !trainingInstitution.trim() ||
        !specialty.trim() ||
        !currentYear ||
        !totalYears
      ) {
        setError("Please complete all required journey fields.");
        return;
      }
    }
    if (stage === "fellow") {
      if (
        !trainingInstitution.trim() ||
        !specialty.trim() ||
        !currentYear ||
        !totalYears
      ) {
        setError("Please complete all required journey fields.");
        return;
      }
    }
    if (stage === "medical-practice") {
      if (!trainingInstitution.trim()) {
        setError("Please complete all required journey fields.");
        return;
      }
      if (showProfessionalLevel && !professionalLevel) {
        setError("Please select your Professional Level.");
        return;
      }
      if (specialtyRequiredForPractice && !specialty.trim()) {
        setError("Please complete all required journey fields.");
        return;
      }
    }

    const fullName = composeFullName(firstName, middleName, lastName);
    const isUniversityStage =
      stage === "medical-student" || stage === "intern";
    const isHospitalStage =
      stage === "advanced-training" ||
      stage === "resident" ||
      stage === "fellow" ||
      stage === "medical-practice";
    const needsYear =
      stage === "medical-student" ||
      stage === "intern" ||
      stage === "advanced-training" ||
      stage === "resident" ||
      stage === "fellow";

    const clearedSpecialty =
      stage === "medical-student" || stage === "intern"
        ? ""
        : stage === "medical-practice" && professionalLevel === "gp"
          ? specialty.trim()
          : specialty.trim();

    const clearedSubspecialty =
      stage === "fellow"
        ? subspecialty.trim()
        : showProfessionalLevel && professionalLevel === "consultant"
          ? subspecialty.trim()
          : "";

    resetForNewAccount();
    setAccountBasics({
      fullName,
      email: personalEmail.trim(),
      mobile: mobile.trim(),
      password,
    });
    updateProfile({
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      lastName: lastName.trim(),
      fullName,
      dateOfBirth,
      nationalId: nationalId.trim(),
      institutionEmail: institutionEmail.trim(),
      field,
      trainingStage: stage,
      professionalLevel: showProfessionalLevel ? professionalLevel : null,
      university: isUniversityStage ? university.trim() : "",
      trainingInstitution: isHospitalStage ? trainingInstitution.trim() : "",
      currentYear: needsYear ? currentYear : "",
      totalYears: needsYear ? totalYears : "",
      internshipYear: "",
      residencyYear: stage === "resident" ? currentYear : "",
      fellowshipYear: stage === "fellow" ? currentYear : "",
      specialty: clearedSpecialty,
      subspecialty: clearedSubspecialty,
      trainingProgramKind:
        stage === "advanced-training" ? "advanced-training" : null,
      photoUploaded: Boolean(photoDataUrl),
      photoDataUrl,
      identityVerified: false,
      onboardingComplete: false,
    });
    router.push("/onboarding/nafath");
  }

  return (
    <AuthShell
      title="Complete Your Account"
      subtitle="Enter your details to continue."
      panelTitle="Complete Your Account"
      panelBody="Enter your personal details and journey information to continue."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-8" onSubmit={onSubmit}>
        <section className="space-y-4">
          <div>
            <h2 className="text-[1rem] font-semibold text-mm-navy">
              Personal Details
            </h2>
            <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
              Your MedJourney identity information.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-mm-border bg-mm-gray-50 text-[0.875rem] font-semibold text-mm-navy">
              {photoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoDataUrl}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                "Photo"
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="min-h-10 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 text-[0.8125rem] font-semibold text-mm-navy"
              >
                {photoDataUrl ? "Change Photo" : "Upload Photo"}
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  onPhotoSelected(e.target.files?.[0] ?? null)
                }
              />
            </div>
          </div>

          <Input
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            label="Middle Name"
            name="middleName"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          <Input
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Input
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            required
          />
          <Input
            label="National ID or Iqama Number"
            name="nationalId"
            inputMode="numeric"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            required
          />
          <Input
            label="Mobile Number"
            name="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
          <Input
            label="Personal Email"
            type="email"
            name="personalEmail"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            hint="Your permanent MedJourney account email."
            required
          />
          <Input
            label="Institutional Email"
            type="email"
            name="institutionEmail"
            value={institutionEmail}
            onChange={(e) => setInstitutionEmail(e.target.value)}
            hint="Your current university, hospital or work email."
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </section>

        <section className="space-y-4 border-t border-mm-border pt-6">
          <div>
            <h2 className="text-[1rem] font-semibold text-mm-navy">
              Your Journey
            </h2>
            <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
              Choose your pathway. Only relevant fields appear below.
            </p>
          </div>

          {/* Compact dropdowns only — never card grids */}
          <SearchableSelect
            id="healthcare-field"
            label="Healthcare Field"
            value={
              field
                ? (HEALTHCARE_FIELD_OPTIONS.find((item) => item.id === field)
                    ?.title ?? "")
                : ""
            }
            onChange={onFieldChange}
            options={HEALTHCARE_FIELD_OPTIONS.map((item) => item.title)}
            placeholder="Select healthcare field"
            allowOther={false}
            required
          />

          {field ? (
            <SearchableSelect
              id="journey-path"
              key={`journey-path-${field}`}
              label="Journey Path"
              value={journeyPathValue}
              onChange={onStageChange}
              options={journeyPathOptions}
              placeholder="Select journey path"
              allowOther={false}
              required
            />
          ) : null}

          {stage === "medical-student" ? (
            <>
              <SearchableSelect
                label="University Name"
                value={university}
                onChange={setUniversity}
                options={SAUDI_UNIVERSITY_NAMES}
                required
              />
              <YearOutOfTotal
                label={yearProgressLabel(stage)}
                currentId="currentYear"
                totalId="totalYears"
                currentValue={currentYear}
                totalValue={totalYears}
                onCurrentChange={setCurrentYear}
                onTotalChange={setTotalYears}
              />
            </>
          ) : null}

          {stage === "intern" ? (
            <>
              <SearchableSelect
                label="University Name"
                value={university}
                onChange={setUniversity}
                options={SAUDI_UNIVERSITY_NAMES}
                required
              />
              <YearOutOfTotal
                label={yearProgressLabel(stage)}
                currentId="currentYear"
                totalId="totalYears"
                currentValue={currentYear}
                totalValue={totalYears}
                onCurrentChange={setCurrentYear}
                onTotalChange={setTotalYears}
              />
            </>
          ) : null}

          {stage === "advanced-training" ? (
            <>
              <SearchableSelect
                label="Hospital or University Name"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={HOSPITAL_OR_UNIVERSITY_OPTIONS}
                required
              />
              <SearchableSelect
                label="Specialty or Training Program"
                value={specialty}
                onChange={onSpecialtyChange}
                options={specialtyOptions}
                allowOther={false}
                required
              />
              <YearOutOfTotal
                label={yearProgressLabel(stage)}
                currentId="currentYear"
                totalId="totalYears"
                currentValue={currentYear}
                totalValue={totalYears}
                onCurrentChange={setCurrentYear}
                onTotalChange={setTotalYears}
              />
            </>
          ) : null}

          {stage === "resident" ? (
            <>
              <SearchableSelect
                label="Hospital or University Name"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={HOSPITAL_OR_UNIVERSITY_OPTIONS}
                required
              />
              <SearchableSelect
                label="Specialty"
                value={specialty}
                onChange={onSpecialtyChange}
                options={specialtyOptions}
                allowOther={false}
                required
              />
              <YearOutOfTotal
                label={yearProgressLabel(stage)}
                currentId="currentYear"
                totalId="totalYears"
                currentValue={currentYear}
                totalValue={totalYears}
                onCurrentChange={setCurrentYear}
                onTotalChange={setTotalYears}
              />
            </>
          ) : null}

          {stage === "fellow" ? (
            <>
              <SearchableSelect
                label="Hospital or University Name"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={HOSPITAL_OR_UNIVERSITY_OPTIONS}
                required
              />
              <SearchableSelect
                label="Specialty"
                value={specialty}
                onChange={onSpecialtyChange}
                options={specialtyOptions}
                allowOther={false}
                required
              />
              {specialty && subspecialtyOptions.length > 0 ? (
                <SearchableSelect
                  key={`fellow-subspecialty-${specialty}`}
                  label="Subspecialty"
                  value={subspecialty}
                  onChange={setSubspecialty}
                  options={subspecialtyOptions}
                  allowOther={false}
                  required={false}
                />
              ) : null}
              <YearOutOfTotal
                label={yearProgressLabel(stage)}
                currentId="currentYear"
                totalId="totalYears"
                currentValue={currentYear}
                totalValue={totalYears}
                onCurrentChange={setCurrentYear}
                onTotalChange={setTotalYears}
              />
            </>
          ) : null}

          {stage === "medical-practice" ? (
            <>
              {showProfessionalLevel ? (
                <SearchableSelect
                  id="professional-level"
                  label="Professional Level"
                  value={
                    professionalLevel
                      ? (PROFESSIONAL_LEVEL_OPTIONS.find(
                          (item) => item.id === professionalLevel,
                        )?.title ?? "")
                      : ""
                  }
                  onChange={onProfessionalLevelChange}
                  options={PROFESSIONAL_LEVEL_OPTIONS.map((item) => item.title)}
                  placeholder="Select professional level"
                  allowOther={false}
                  required
                />
              ) : null}
              <SearchableSelect
                label="Hospital or University Name"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={HOSPITAL_OR_UNIVERSITY_OPTIONS}
                required
              />
              {showSpecialtyForPractice && professionalLevel ? (
                <SearchableSelect
                  label="Specialty"
                  value={specialty}
                  onChange={onSpecialtyChange}
                  options={specialtyOptions}
                  allowOther={false}
                  required={specialtyRequiredForPractice}
                />
              ) : null}
              {professionalLevel === "consultant" &&
              specialty &&
              subspecialtyOptions.length > 0 ? (
                <SearchableSelect
                  key={`consultant-subspecialty-${specialty}`}
                  label="Subspecialty"
                  value={subspecialty}
                  onChange={setSubspecialty}
                  options={subspecialtyOptions}
                  allowOther={false}
                  required={false}
                />
              ) : null}
            </>
          ) : null}
        </section>

        {error ? (
          <p className="text-[0.8125rem] font-medium text-mm-error-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
        >
          Complete Account
        </button>
      </form>
    </AuthShell>
  );
}
