"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";

export default function PlatformAdminForgotPasswordPage() {
  const basePath = usePlatformAdminBasePath();

  return (
    <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <Logo href={basePath} />
        </div>
        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm sm:p-8">
          <h1 className="text-2xl font-semibold text-mm-navy">Forgot Password</h1>
          <p className="mt-3 text-sm leading-relaxed text-mm-text-secondary">
            Administrator passwords can only be reset by the MedJourney Owner or
            another authorized administrator. Contact the Owner to restore
            access.
          </p>
          <Link
            href={`${basePath}/sign-in`}
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-sm font-semibold text-mm-navy hover:bg-mm-gray-50"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
