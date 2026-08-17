"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";

export default function PlatformAdminAccessDeniedPage() {
  const basePath = usePlatformAdminBasePath();

  useEffect(() => {
    void fetch("/api/platform-admin/unauthorized", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: window.location.pathname,
        detail: "Access Denied page viewed.",
      }),
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo href={basePath} />
        </div>
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-mm-navy">Access Denied</h1>
          <p className="mt-3 text-sm leading-relaxed text-mm-text-secondary">
            You do not have permission to view MedJourney Platform Administration.
            This attempt has been recorded in the security activity log.
          </p>
          <Link
            href={`${basePath}/sign-in`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-sm font-semibold text-white shadow-mm-teal"
          >
            Administration Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
