"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import {
  AccountStatusPill,
  SubscriptionStatusPill,
} from "@/components/platform-admin/DirectoryStatusPills";
import { SearchInput } from "@/components/ui";
import type {
  PlatformAccountStatus,
  PlatformStudentRecord,
} from "@/data/platform-directory";
import type { SubscriberHistoryStatus } from "@/data/platform-subscription-plan";
import { formatSar, formatSubscriptionDate } from "@/data/subscription";
import { usePlatformDirectoryStore } from "@/lib/platform-directory-store";
import { cn } from "@/lib/cn";

type AccountFilter = "All" | PlatformAccountStatus;
type SubscriptionFilter = "All" | SubscriberHistoryStatus;

const PAGE_SIZE = 50;

const ACCOUNT_FILTERS: AccountFilter[] = [
  "All",
  "Active",
  "Inactive",
  "Suspended",
];

const SUBSCRIPTION_FILTERS: SubscriptionFilter[] = [
  "All",
  "Active",
  "Expired",
  "Sponsored",
  "Payment Waived",
  "Refunded",
  "Canceled",
];

export default function PlatformAdminStudentsPage() {
  return (
    <PlatformAdminShell title="Students">
      <StudentsManager />
    </PlatformAdminShell>
  );
}

function StudentsManager() {
  const basePath = usePlatformAdminBasePath();
  const { hydrated, students } = usePlatformDirectoryStore();
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("All");
  const [subscriptionFilter, setSubscriptionFilter] =
    useState<SubscriptionFilter>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((student) => {
      if (accountFilter !== "All" && student.accountStatus !== accountFilter) {
        return false;
      }
      if (
        subscriptionFilter !== "All" &&
        student.subscriptionStatus !== subscriptionFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        student.fullName.toLowerCase().includes(q) ||
        student.studentId.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        student.university.toLowerCase().includes(q)
      );
    });
  }, [accountFilter, query, students, subscriptionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const summary = useMemo(() => {
    return {
      total: students.length,
      active: students.filter((s) => s.accountStatus === "Active").length,
      suspended: students.filter((s) => s.accountStatus === "Suspended").length,
      expiredSub: students.filter((s) => s.subscriptionStatus === "Expired")
        .length,
    };
  }, [students]);

  if (!hydrated) {
    return (
      <p className="text-sm text-mm-text-muted">Loading students directory…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
          Students
        </h1>
        <p className="mt-1 text-sm text-mm-text-secondary">
          View student accounts, subscriptions, and account status actions.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: String(summary.total) },
          { label: "Active Accounts", value: String(summary.active) },
          { label: "Suspended", value: String(summary.suspended) },
          { label: "Expired Subscriptions", value: String(summary.expiredSub) },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm"
          >
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              {card.label}
            </p>
            <p className="mt-2 text-xl font-semibold text-mm-navy">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
        <div className="border-b border-mm-border px-5 py-4 sm:px-6">
          <div className="max-w-md">
            <SearchInput
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, ID, email, or university"
              aria-label="Search students"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACCOUNT_FILTERS.map((filter) => (
              <FilterChip
                key={`account-${filter}`}
                label={filter === "All" ? "All accounts" : filter}
                active={accountFilter === filter}
                onClick={() => {
                  setAccountFilter(filter);
                  setPage(1);
                }}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBSCRIPTION_FILTERS.map((filter) => (
              <FilterChip
                key={`sub-${filter}`}
                label={filter === "All" ? "All subscriptions" : filter}
                active={subscriptionFilter === filter}
                onClick={() => {
                  setSubscriptionFilter(filter);
                  setPage(1);
                }}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-mm-text-muted">
            Showing {pageRows.length} of {filtered.length} students
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
              <tr>
                <th className="px-4 py-3 sm:px-5">Student</th>
                <th className="px-4 py-3 sm:px-5">University</th>
                <th className="px-4 py-3 sm:px-5">Account</th>
                <th className="px-4 py-3 sm:px-5">Subscription</th>
                <th className="px-4 py-3 sm:px-5">Paid</th>
                <th className="px-4 py-3 sm:px-5">Expires</th>
                <th className="px-4 py-3 sm:px-5"> </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((student) => (
                <StudentRow
                  key={student.id}
                  student={student}
                  href={`${basePath}/students/${student.id}`}
                />
              ))}
              {pageRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-mm-text-muted"
                  >
                    No students match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-mm-border px-5 py-3 sm:px-6">
            <p className="text-sm text-mm-text-muted">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 py-1.5 text-sm font-semibold text-mm-navy disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 py-1.5 text-sm font-semibold text-mm-navy disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StudentRow({
  student,
  href,
}: {
  student: PlatformStudentRecord;
  href: string;
}) {
  return (
    <tr className="border-t border-mm-border">
      <td className="px-4 py-3 sm:px-5">
        <p className="font-medium text-mm-navy">{student.fullName}</p>
        <p className="text-[0.75rem] text-mm-text-muted">
          {student.studentId} · {student.email}
        </p>
      </td>
      <td className="px-4 py-3 text-mm-text-secondary sm:px-5">
        {student.university}
      </td>
      <td className="px-4 py-3 sm:px-5">
        <AccountStatusPill status={student.accountStatus} />
      </td>
      <td className="px-4 py-3 sm:px-5">
        <SubscriptionStatusPill status={student.subscriptionStatus} />
      </td>
      <td className="px-4 py-3 text-mm-navy sm:px-5">
        {formatSar(student.amountPaid)}
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary sm:px-5">
        {formatSubscriptionDate(student.expiryDate)}
      </td>
      <td className="px-4 py-3 sm:px-5">
        <Link
          href={href}
          className="text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
        >
          Open
        </Link>
      </td>
    </tr>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-[var(--mm-radius-lg)] border px-3 py-1.5 text-sm font-semibold",
        active
          ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
          : "border-mm-border bg-mm-white text-mm-navy",
      )}
    >
      {label}
    </button>
  );
}
