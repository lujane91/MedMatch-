"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import {
  AccountStatusPill,
  SubscriptionStatusPill,
} from "@/components/platform-admin/DirectoryStatusPills";
import type { PlatformAccountStatus } from "@/data/platform-directory";
import { formatSar, formatSubscriptionDate } from "@/data/subscription";
import { usePlatformDirectoryStore } from "@/lib/platform-directory-store";
import { cn } from "@/lib/cn";

export default function PlatformAdminStudentDetailPage() {
  return (
    <PlatformAdminShell title="Student Details">
      <StudentDetail />
    </PlatformAdminShell>
  );
}

function StudentDetail() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const basePath = usePlatformAdminBasePath();
  const {
    hydrated,
    getStudent,
    setStudentAccountStatus,
    sendStudentPaymentReminder,
  } = usePlatformDirectoryStore();
  const [message, setMessage] = useState("");

  const student = getStudent(id);

  if (!hydrated) {
    return (
      <p className="text-sm text-mm-text-muted">Loading student details…</p>
    );
  }

  if (!student) {
    return (
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm">
        <h1 className="text-xl font-semibold text-mm-navy">Student not found</h1>
        <p className="mt-2 text-sm text-mm-text-secondary">
          This student record is not in the platform directory.
        </p>
        <Link
          href={`${basePath}/students`}
          className="mt-4 inline-flex text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
        >
          Back to Students
        </Link>
      </div>
    );
  }

  function setStatus(status: PlatformAccountStatus, label: string) {
    setStudentAccountStatus(student!.id, status);
    setMessage(`Account ${label}.`);
  }

  function onReminder() {
    const email = sendStudentPaymentReminder(student!.id);
    setMessage(
      email
        ? `Payment reminder sent to ${email}.`
        : "Unable to send payment reminder.",
    );
  }

  const { accountStatus } = student;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`${basePath}/students`}
            className="text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
          >
            ← Students
          </Link>
          <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
            {student.fullName}
          </h1>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {student.studentId} · {student.email}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AccountStatusPill status={student.accountStatus} />
          <SubscriptionStatusPill status={student.subscriptionStatus} />
        </div>
      </div>

      {message ? (
        <p className="rounded-[var(--mm-radius-lg)] border border-mm-teal/30 bg-mm-teal-50 px-4 py-3 text-sm font-medium text-mm-teal-700">
          {message}
        </p>
      ) : null}

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Profile</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <DetailItem label="Full name" value={student.fullName} />
          <DetailItem label="Student ID" value={student.studentId} />
          <DetailItem label="Email" value={student.email} />
          <DetailItem label="University" value={student.university} />
        </dl>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">
          Payment & subscription
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <DetailItem label="Plan" value={student.planName} />
          <DetailItem
            label="Subscription status"
            value={student.subscriptionStatus}
          />
          <DetailItem
            label="Amount paid"
            value={formatSar(student.amountPaid)}
          />
          <DetailItem
            label="Payment date"
            value={formatSubscriptionDate(student.paymentDate)}
          />
          <DetailItem
            label="Expiry date"
            value={formatSubscriptionDate(student.expiryDate)}
          />
          <DetailItem
            label="Last payment reminder"
            value={
              student.lastReminderAt
                ? new Date(student.lastReminderAt).toLocaleString()
                : "None sent"
            }
          />
        </dl>
        <button
          type="button"
          onClick={onReminder}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-sm font-semibold text-mm-navy hover:bg-mm-gray-50"
        >
          Send payment reminder
        </button>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Account actions</h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Activate, deactivate, suspend, or restore this student account.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton
            label="Activate"
            disabled={accountStatus === "Active"}
            onClick={() => setStatus("Active", "activated")}
          />
          <ActionButton
            label="Deactivate"
            disabled={accountStatus === "Inactive"}
            onClick={() => setStatus("Inactive", "deactivated")}
          />
          <ActionButton
            label="Suspend"
            disabled={accountStatus === "Suspended"}
            onClick={() => setStatus("Suspended", "suspended")}
          />
          <ActionButton
            label="Restore"
            disabled={accountStatus !== "Suspended"}
            onClick={() => setStatus("Active", "restored")}
          />
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--mm-radius-lg)] border border-mm-border px-4 py-3">
      <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-mm-navy">{value}</dd>
    </div>
  );
}

function ActionButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border px-4 text-sm font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border-mm-border bg-mm-gray-50 text-mm-text-muted opacity-60"
          : "border-mm-border bg-mm-white text-mm-navy hover:bg-mm-gray-50",
      )}
    >
      {label}
    </button>
  );
}
