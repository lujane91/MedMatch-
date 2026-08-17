"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/Input";
import { buttonPrimaryClass } from "@/components/hospital/hospital-ui";
import { useRoleStore } from "@/lib/role-store";

export default function HospitalSignInPage() {
  const router = useRouter();
  const { setRole } = useRoleStore();
  const [email, setEmail] = useState("admin@kfmc.med.sa");
  const [password, setPassword] = useState("password123");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setRole("hospital-admin");
    router.push("/hospital");
  }

  return (
    <div className="min-h-screen bg-mm-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Logo href="/" />
          <span className="rounded-full border border-mm-teal/25 bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal-700">
            Hospital admin
          </span>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-md sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal text-white shadow-mm-teal">
              <Building2 size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-mm-navy sm:text-3xl">
                Hospital sign in
              </h1>
              <p className="mt-1 text-sm text-mm-text-secondary">
                Access your hospital workspace to manage specialties, capacity,
                and applications.
              </p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <Input
              label="Work email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button type="submit" className={buttonPrimaryClass}>
              Sign in to hospital portal
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-mm-text-secondary">
            New hospital?{" "}
            <Link
              href="/hospital/onboarding"
              className="font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
            >
              Set up your hospital
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-mm-text-muted">
          Looking for the trainee experience?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-mm-navy transition-colors hover:text-mm-teal"
          >
            Intern sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
