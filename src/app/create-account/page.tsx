"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui";
import { useInternStore } from "@/lib/intern-store";
import { useSubscriptionStore } from "@/lib/subscription-store";

export default function CreateAccountPage() {
  const router = useRouter();
  const { setAccountBasics } = useInternStore();
  const { resetForNewAccount } = useSubscriptionStore();
  const [fullName, setFullName] = useState("Amina Hassan");
  const [personalEmail, setPersonalEmail] = useState(
    "amina.hassan@medmatch.edu",
  );
  const [institutionEmail, setInstitutionEmail] = useState(
    "amina.hassan@university.edu.sa",
  );
  const [mobile, setMobile] = useState("+966 50 000 0000");
  const [password, setPassword] = useState("password123");
  const [confirm, setConfirm] = useState("password123");
  const [error, setError] = useState("");

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
    resetForNewAccount();
    setAccountBasics({
      fullName: fullName.trim(),
      email: personalEmail.trim(),
      mobile,
      password,
    });
    router.push("/onboarding/nafath");
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Create your MedJourney account."
      panelTitle="Your internship journey starts here"
      panelBody="Create an account, choose your training stage, and build a clear one-year rotation plan."
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
