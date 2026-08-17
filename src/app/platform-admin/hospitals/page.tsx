"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import {
  AccountStatusPill,
  ApprovalStatusPill,
} from "@/components/platform-admin/DirectoryStatusPills";
import { SearchInput } from "@/components/ui";
import type {
  HospitalApprovalStatus,
  PlatformAccountStatus,
  PlatformHospitalRecord,
} from "@/data/platform-directory";
import { usePlatformDirectoryStore } from "@/lib/platform-directory-store";
import { cn } from "@/lib/cn";

type AccountFilter = "All" | PlatformAccountStatus;
type ApprovalFilter = "All" | HospitalApprovalStatus;

const ACCOUNT_FILTERS: AccountFilter[] = [
  "All",
  "Active",
  "Inactive",
  "Suspended",
];

const APPROVAL_FILTERS: ApprovalFilter[] = [
  "All",
  "Pending",
  "Approved",
  "Rejected",
];

export default function PlatformAdminHospitalsPage() {
  return (
    <PlatformAdminShell title="Hospitals">
      <HospitalsManager />
    </PlatformAdminShell>
  );
}

function HospitalsManager() {
  const basePath = usePlatformAdminBasePath();
  const { hydrated, hospitals } = usePlatformDirectoryStore();
  const [query, setQuery] = useState("");
  const [accountFilter, setAccountFilter] = useState<AccountFilter>("All");
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return hospitals.filter((hospital) => {
      if (accountFilter !== "All" && hospital.accountStatus !== accountFilter) {
        return false;
      }
      if (
        approvalFilter !== "All" &&
        hospital.approvalStatus !== approvalFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        hospital.name.toLowerCase().includes(q) ||
        hospital.city.toLowerCase().includes(q) ||
        hospital.adminEmail.toLowerCase().includes(q) ||
        hospital.adminName.toLowerCase().includes(q) ||
        hospital.type.toLowerCase().includes(q)
      );
    });
  }, [accountFilter, approvalFilter, hospitals, query]);

  const summary = useMemo(() => {
    return {
      total: hospitals.length,
      pending: hospitals.filter((h) => h.approvalStatus === "Pending").length,
      active: hospitals.filter((h) => h.accountStatus === "Active").length,
      suspended: hospitals.filter((h) => h.accountStatus === "Suspended")
        .length,
    };
  }, [hospitals]);

  if (!hydrated) {
    return (
      <p className="text-sm text-mm-text-muted">Loading hospitals directory…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
          Hospitals
        </h1>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Review hospital accounts, approvals, and program activity.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Hospitals", value: String(summary.total) },
          { label: "Pending Approval", value: String(summary.pending) },
          { label: "Active Accounts", value: String(summary.active) },
          { label: "Suspended", value: String(summary.suspended) },
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, admin, or type"
              aria-label="Search hospitals"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACCOUNT_FILTERS.map((filter) => (
              <FilterChip
                key={`account-${filter}`}
                label={filter === "All" ? "All accounts" : filter}
                active={accountFilter === filter}
                onClick={() => setAccountFilter(filter)}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {APPROVAL_FILTERS.map((filter) => (
              <FilterChip
                key={`approval-${filter}`}
                label={filter === "All" ? "All approvals" : filter}
                active={approvalFilter === filter}
                onClick={() => setApprovalFilter(filter)}
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-mm-text-muted">
            Showing {filtered.length} of {hospitals.length} hospitals
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
              <tr>
                <th className="px-4 py-3 sm:px-5">Hospital</th>
                <th className="px-4 py-3 sm:px-5">Account</th>
                <th className="px-4 py-3 sm:px-5">Approval</th>
                <th className="px-4 py-3 sm:px-5">Specialties</th>
                <th className="px-4 py-3 sm:px-5">Apps</th>
                <th className="px-4 py-3 sm:px-5">Rotations</th>
                <th className="px-4 py-3 sm:px-5"> </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((hospital) => (
                <HospitalRow
                  key={hospital.id}
                  hospital={hospital}
                  href={`${basePath}/hospitals/${hospital.id}`}
                />
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-mm-text-muted"
                  >
                    No hospitals match these filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function HospitalRow({
  hospital,
  href,
}: {
  hospital: PlatformHospitalRecord;
  href: string;
}) {
  return (
    <tr className="border-t border-mm-border">
      <td className="px-4 py-3 sm:px-5">
        <p className="font-medium text-mm-navy">{hospital.name}</p>
        <p className="text-[0.75rem] text-mm-text-muted">
          {hospital.city} · {hospital.type}
        </p>
      </td>
      <td className="px-4 py-3 sm:px-5">
        <AccountStatusPill status={hospital.accountStatus} />
      </td>
      <td className="px-4 py-3 sm:px-5">
        <ApprovalStatusPill status={hospital.approvalStatus} />
      </td>
      <td className="px-4 py-3 text-mm-navy sm:px-5">
        {hospital.specialtyCount}
      </td>
      <td className="px-4 py-3 text-mm-navy sm:px-5">
        {hospital.applicationCount}
      </td>
      <td className="px-4 py-3 text-mm-navy sm:px-5">
        {hospital.rotationCount}
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
