"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";

function SignInForm() {
  const basePath = usePlatformAdminBasePath();
  const searchParams = useSearchParams();
  // Prototype defaults — prefilled so reviewers can sign in without retyping.
  const [email, setEmail] = useState("owner@medmatch.sa");
  const [password, setPassword] = useState("DemoOwner123!");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const expired = searchParams.get("reason") === "expired";
  const nextPath = searchParams.get("next") || basePath;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/platform-admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      let data: { error?: string; ok?: boolean } = {};
      try {
        data = (await res.json()) as { error?: string; ok?: boolean };
      } catch {
        setError("Unexpected server response. Please try again.");
        setSubmitting(false);
        return;
      }

      if (!res.ok || !data.ok) {
        setError(data.error || "Sign in failed.");
        setSubmitting(false);
        return;
      }

      // Hard navigation so the httpOnly session cookie is applied reliably
      // (soft client transitions can leave the form stuck on "Signing in…").
      const target = nextPath.startsWith(basePath) ? nextPath : basePath;
      window.location.href = target;
    } catch {
      setError("Unable to sign in. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo href={basePath} />
        </div>
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm sm:p-8">
          <h1 className="text-center text-2xl font-semibold tracking-tight text-mm-navy">
            MedJourney Administration
          </h1>
          <p className="mt-2 text-center text-sm text-mm-text-secondary">
            Sign in with an authorized administrator account.
          </p>

          {expired ? (
            <p className="mt-4 rounded-[var(--mm-radius-lg)] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-mm-navy">
              Your session expired. Please sign in again.
            </p>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error ? (
              <p className="text-sm font-medium text-mm-error-700" role="alert">
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-4 text-sm font-semibold text-white shadow-mm-teal transition-[transform,background] hover:-translate-y-px hover:bg-mm-teal-700 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <Link
              href={`${basePath}/forgot-password`}
              className="text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
            >
              Forgot Password
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-[0.75rem] text-mm-text-muted">
          Restricted portal. Unauthorized access is logged.
        </p>
      </div>
    </div>
  );
}

export default function PlatformAdminSignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-mm-bg">
          <p className="text-sm text-mm-text-muted">Loading…</p>
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
