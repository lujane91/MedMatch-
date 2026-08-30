"use client";

import Link from "next/link";
import { AuthShell } from "@/components/AuthShell";

export default function NafathVerificationPage() {
  return (
    <AuthShell
      title="Verify your identity"
      subtitle="Continue with Nafath to verify your identity."
      panelTitle="Verify your identity"
      panelBody="Continue with Nafath to verify your identity."
      footer={
        <>
          Need help?{" "}
          <Link
            href="/create-account"
            className="font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
          >
            Back to Create Account
          </Link>
        </>
      }
    >
      <button
        type="button"
        className="inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-[1.125rem] text-[0.875rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700"
      >
        Verify with Nafath
      </button>
    </AuthShell>
  );
}
