"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Input, SearchableSelect } from "@/components/ui";
import { getAdvancedTrainingProgramsForField } from "@/data/advanced-training-programs";
import {
  isAdvancedTrainingField,
  needsProfessionalLevel,
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

function needsYearProgress(stage: TrainingStage | null) {
  return (
    stage === "medical-student" ||
    stage === "intern" ||
    stage === "advanced-training" ||
    stage === "resident" ||
    stage === "fellow"
  );
}

function usesHospitalAndProgram(stage: TrainingStage | null) {
  return (
    stage === "advanced-training" ||
    stage === "resident" ||
    stage === "fellow"
  );
}

function yearProgressLabel(stage: TrainingStage | null) {
  if (stage === "medical-student") return "Current academic year";
  if (stage === "intern") return "Current internship year";
  if (stage === "advanced-training") return "Current Training Year";
  if (stage === "resident") return "Current residency year";
  if (stage === "fellow") return "Current fellowship year";
  return "Current year";
}

export default function CreateAccountPage() {
  const router = useRouter();
  const { hydrated, profile, setAccountBasics, updateProfile } =
    useInternStore();
  const { resetForNewAccount } = useSubscriptionStore();

  const [fullName, setFullName] = useState(profile.fullName || "Amina Hassan");
  const [personalEmail, setPersonalEmail] = useState(
    profile.email || "amina.hassan@medmatch.edu",
  );
  const [institutionEmail, setInstitutionEmail] = useState(
    profile.institutionEmail || "amina.hassan@university.edu.sa",
  );
  const [mobile, setMobile] = useState(profile.mobile || "+966 50 000 0000");
  const [password, setPassword] = useState("password123");
  const [confirm, setConfirm] = useState("password123");
  const [university, setUniversity] = useState(profile.university || "");
  const [currentYear, setCurrentYear] = useState(profile.currentYear || "");
  const [totalYears, setTotalYears] = useState(profile.totalYears || "");
  const [trainingInstitution, setTrainingInstitution] = useState(
    profile.trainingInstitution || "",
  );
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [subspecialty, setSubspecialty] = useState(profile.subspecialty || "");
  const [error, setError] = useState("");

  const stage = profile.trainingStage;
  const specialtyOptions = useMemo(() => {
    if (stage === "advanced-training") {
      return getAdvancedTrainingProgramsForField(profile.field);
    }
    return getSpecialtiesForField(profile.field);
  }, [profile.field, stage]);
  const subspecialtyOptions = useMemo(
    () => getSubspecialtiesForSpecialty(specialty),
    [specialty],
  );
  const showOptionalSubspecialty =
    needsProfessionalLevel(stage, profile.field) &&
    profile.professionalLevel === "consultant";

  useEffect(() => {
    if (!hydrated) return;
    if (!profile.trainingStage) {
      router.replace("/onboarding/applying-for");
      return;
    }
    if (!profile.field) {
      router.replace("/onboarding/profession");
      return;
    }
    if (
      profile.trainingStage === "advanced-training" &&
      !isAdvancedTrainingField(profile.field)
    ) {
      router.replace("/onboarding/profession");
      return;
    }
    if (
      needsProfessionalLevel(profile.trainingStage, profile.field) &&
      !profile.professionalLevel
    ) {
      router.replace("/onboarding/professional-level");
    }
  }, [
    hydrated,
    profile.field,
    profile.professionalLevel,
    profile.trainingStage,
    router,
  ]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName.trim() ||
      !personalEmail.trim() ||
      !institutionEmail.trim() ||
      !mobile.trim()
    ) {
      setError("Please complete all required fields.");
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

    if (stage === "medical-student") {
      if (!university.trim() || !currentYear || !totalYears) {
        setError("Please complete all required fields.");
        return;
      }
    }
    if (stage === "intern") {
      if (!university.trim() || !currentYear || !totalYears) {
        setError("Please complete all required fields.");
        return;
      }
    }
    if (stage === "advanced-training") {
      if (
        !trainingInstitution.trim() ||
        !specialty.trim() ||
        !currentYear ||
        !totalYears
      ) {
        setError("Please complete all required fields.");
        return;
      }
    }
    if (stage === "resident") {
      if (
        !trainingInstitution.trim() ||
        !specialty.trim() ||
        !currentYear ||
        !totalYears
      ) {
        setError("Please complete all required fields.");
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
        setError("Please complete all required fields.");
        return;
      }
    }
    if (stage === "medical-practice" && !specialty.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    resetForNewAccount();
    setAccountBasics({
      fullName: fullName.trim(),
      email: personalEmail.trim(),
      mobile: mobile.trim(),
      password,
    });
    updateProfile({
      institutionEmail: institutionEmail.trim(),
      university:
        stage === "medical-student" || stage === "intern"
          ? university.trim()
          : "",
      currentYear: needsYearProgress(stage) ? currentYear : "",
      totalYears: needsYearProgress(stage) ? totalYears : "",
      internshipYear: "",
      residencyYear: stage === "resident" ? currentYear : "",
      fellowshipYear: stage === "fellow" ? currentYear : "",
      trainingInstitution: usesHospitalAndProgram(stage)
        ? trainingInstitution.trim()
        : "",
      specialty:
        usesHospitalAndProgram(stage) || stage === "medical-practice"
          ? specialty.trim()
          : "",
      subspecialty:
        stage === "fellow" || showOptionalSubspecialty
          ? subspecialty.trim()
          : "",
      trainingProgramKind:
        stage === "advanced-training" ? "advanced-training" : null,
      identityVerified: false,
    });
    router.push("/onboarding/nafath");
  };

  if (
    !hydrated ||
    !stage ||
    !profile.field ||
    (stage === "advanced-training" &&
      !isAdvancedTrainingField(profile.field))
  ) {
    return (
      <AuthShell
        title="Complete your account"
        subtitle="Enter your details to continue."
        panelTitle="Complete your account"
        panelBody="Enter your details to continue your MedJourney."
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
        <p className="text-[0.875rem] text-mm-text-muted">Loading…</p>
      </AuthShell>
    );
  }

  const yearLabel = yearProgressLabel(stage);

  return (
    <AuthShell
      title="Complete your account"
      subtitle="Enter your details to continue."
      panelTitle="Complete your account"
      panelBody="Enter your details to continue your MedJourney."
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
      <form className="space-y-4" onSubmit={onSubmit}>
        <Input
          label="Full name"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <Input
          label="Mobile number"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <Input
          label="Personal email"
          type="email"
          name="personalEmail"
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
          hint="Your permanent MedJourney account email."
          required
        />
        <Input
          label="Institutional email"
          type="email"
          name="institutionEmail"
          value={institutionEmail}
          onChange={(e) => setInstitutionEmail(e.target.value)}
          hint="Your current university, hospital, training or work email."
          required
        />

        <div className="space-y-4 border-t border-mm-border pt-4">
          {stage === "medical-student" ? (
            <>
              <SearchableSelect
                label="University name"
                value={university}
                onChange={setUniversity}
                options={SAUDI_UNIVERSITY_NAMES}
                required
              />
              <YearOutOfTotal
                label={yearLabel}
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
                label="University name"
                value={university}
                onChange={setUniversity}
                options={SAUDI_UNIVERSITY_NAMES}
                required
              />
              <YearOutOfTotal
                label={yearLabel}
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
                label="Hospital or Training Institution"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={SAUDI_HOSPITAL_NAMES}
                required
              />
              <SearchableSelect
                label="Specialty or Training Program"
                value={specialty}
                onChange={setSpecialty}
                options={specialtyOptions}
                required
              />
              <YearOutOfTotal
                label={yearLabel}
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
                label="Hospital or training institution"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={SAUDI_HOSPITAL_NAMES}
                required
              />
              <SearchableSelect
                label="Specialty"
                value={specialty}
                onChange={(next) => {
                  setSpecialty(next);
                  setSubspecialty("");
                }}
                options={specialtyOptions}
                required
              />
              <YearOutOfTotal
                label={yearLabel}
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
                label="Hospital or training institution"
                value={trainingInstitution}
                onChange={setTrainingInstitution}
                options={SAUDI_HOSPITAL_NAMES}
                required
              />
              <SearchableSelect
                label="Specialty"
                value={specialty}
                onChange={(next) => {
                  setSpecialty(next);
                  setSubspecialty("");
                }}
                options={specialtyOptions}
                required
              />
              <SearchableSelect
                label="Subspecialty"
                value={subspecialty}
                onChange={setSubspecialty}
                options={subspecialtyOptions}
                required={false}
              />
              <YearOutOfTotal
                label={yearLabel}
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
              <SearchableSelect
                label="Current specialty"
                value={specialty}
                onChange={(next) => {
                  setSpecialty(next);
                  setSubspecialty("");
                }}
                options={specialtyOptions}
                required
              />
              {showOptionalSubspecialty ? (
                <SearchableSelect
                  label="Subspecialty"
                  value={subspecialty}
                  onChange={setSubspecialty}
                  options={subspecialtyOptions}
                  required={false}
                />
              ) : null}
            </>
          ) : null}
        </div>

        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
        {error ? (
          <p className="text-[0.8125rem] font-medium text-mm-error-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
