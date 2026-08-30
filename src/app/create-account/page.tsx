"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui";
import type { TrainingStage } from "@/data/intern";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

const medicineYears = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
  "Year 6",
] as const;

const trainingYears = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5",
] as const;

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  required?: boolean;
}) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
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

function requiresStageDetails(stage: TrainingStage | null) {
  return (
    stage === "medical-student" ||
    stage === "intern" ||
    stage === "resident" ||
    stage === "fellow" ||
    stage === "medical-practice"
  );
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
  const [internshipYear, setInternshipYear] = useState(
    profile.internshipYear || "Internship Year",
  );
  const [trainingInstitution, setTrainingInstitution] = useState(
    profile.trainingInstitution || "",
  );
  const [specialty, setSpecialty] = useState(profile.specialty || "");
  const [subspecialty, setSubspecialty] = useState(profile.subspecialty || "");
  const [residencyYear, setResidencyYear] = useState(
    profile.residencyYear || "",
  );
  const [fellowshipYear, setFellowshipYear] = useState(
    profile.fellowshipYear || "",
  );
  const [error, setError] = useState("");

  const stage = profile.trainingStage;

  useEffect(() => {
    if (!hydrated) return;
    if (!profile.trainingStage) {
      router.replace("/onboarding/applying-for");
      return;
    }
    if (!profile.field) {
      router.replace("/onboarding/profession");
    }
  }, [hydrated, profile.field, profile.trainingStage, router]);

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

    if (stage === "medical-student" && (!university.trim() || !currentYear)) {
      setError("Please complete all required fields.");
      return;
    }
    if (stage === "intern" && (!university.trim() || !internshipYear)) {
      setError("Please complete all required fields.");
      return;
    }
    if (
      stage === "resident" &&
      (!trainingInstitution.trim() || !specialty.trim() || !residencyYear)
    ) {
      setError("Please complete all required fields.");
      return;
    }
    if (
      stage === "fellow" &&
      (!trainingInstitution.trim() ||
        !specialty.trim() ||
        !subspecialty.trim() ||
        !fellowshipYear)
    ) {
      setError("Please complete all required fields.");
      return;
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
          : profile.university,
      currentYear: stage === "medical-student" ? currentYear : "",
      internshipYear: stage === "intern" ? internshipYear : "",
      trainingInstitution:
        stage === "resident" || stage === "fellow"
          ? trainingInstitution.trim()
          : "",
      specialty:
        stage === "resident" ||
        stage === "fellow" ||
        stage === "medical-practice"
          ? specialty.trim()
          : "",
      subspecialty: stage === "fellow" ? subspecialty.trim() : "",
      residencyYear: stage === "resident" ? residencyYear : "",
      fellowshipYear: stage === "fellow" ? fellowshipYear : "",
    });
    router.push("/onboarding/nafath");
  };

  if (!hydrated || !stage || !profile.field) {
    return (
      <AuthShell
        title="Create account"
        subtitle="Create your MedJourney account."
        panelTitle="Your MedJourney starts here"
        panelBody="Create an account and continue your medical journey."
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

  return (
    <AuthShell
      title="Create account"
      subtitle="Create your MedJourney account."
      panelTitle="Your MedJourney starts here"
      panelBody="Create an account and continue your medical journey."
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
          label="Personal email"
          type="email"
          name="personalEmail"
          value={personalEmail}
          onChange={(e) => setPersonalEmail(e.target.value)}
          hint="Use an email you will always have access to."
          required
        />
        <Input
          label="University or work email"
          type="email"
          name="institutionEmail"
          value={institutionEmail}
          onChange={(e) => setInstitutionEmail(e.target.value)}
          hint="Used to verify your university or healthcare institution."
          required
        />
        <Input
          label="Mobile number"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />

        {requiresStageDetails(stage) ? (
          <div className="space-y-4 border-t border-mm-border pt-4">
            {stage === "medical-student" ? (
              <>
                <Input
                  label="University name"
                  name="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
                <SelectField
                  label="Current year"
                  name="currentYear"
                  value={currentYear}
                  onChange={setCurrentYear}
                  options={medicineYears}
                  required
                />
              </>
            ) : null}

            {stage === "intern" ? (
              <>
                <Input
                  label="University name"
                  name="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                />
                <SelectField
                  label="Internship year"
                  name="internshipYear"
                  value={internshipYear}
                  onChange={setInternshipYear}
                  options={["Internship Year"]}
                  required
                />
              </>
            ) : null}

            {stage === "resident" ? (
              <>
                <Input
                  label="Hospital or training institution"
                  name="trainingInstitution"
                  value={trainingInstitution}
                  onChange={(e) => setTrainingInstitution(e.target.value)}
                  required
                />
                <Input
                  label="Specialty"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                />
                <SelectField
                  label="Residency year"
                  name="residencyYear"
                  value={residencyYear}
                  onChange={setResidencyYear}
                  options={trainingYears}
                  required
                />
              </>
            ) : null}

            {stage === "fellow" ? (
              <>
                <Input
                  label="Hospital or training institution"
                  name="trainingInstitution"
                  value={trainingInstitution}
                  onChange={(e) => setTrainingInstitution(e.target.value)}
                  required
                />
                <Input
                  label="Specialty"
                  name="specialty"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                />
                <Input
                  label="Subspecialty"
                  name="subspecialty"
                  value={subspecialty}
                  onChange={(e) => setSubspecialty(e.target.value)}
                  required
                />
                <SelectField
                  label="Fellowship year"
                  name="fellowshipYear"
                  value={fellowshipYear}
                  onChange={setFellowshipYear}
                  options={trainingYears}
                  required
                />
              </>
            ) : null}

            {stage === "medical-practice" ? (
              <Input
                label="Specialty"
                name="specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                required
              />
            ) : null}
          </div>
        ) : null}

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
          Create Account
        </button>
      </form>
    </AuthShell>
  );
}
