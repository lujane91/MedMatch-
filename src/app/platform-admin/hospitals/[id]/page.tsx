"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import {
  AccountStatusPill,
  ApprovalStatusPill,
} from "@/components/platform-admin/DirectoryStatusPills";
import type {
  HospitalApprovalStatus,
  PlatformAccountStatus,
} from "@/data/platform-directory";
import { usePlatformDirectoryStore } from "@/lib/platform-directory-store";
import { cn } from "@/lib/cn";

export default function PlatformAdminHospitalDetailPage() {
  return (
    <PlatformAdminShell title="Hospital Details">
      <HospitalDetail />
    </PlatformAdminShell>
  );
}

function HospitalDetail() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const basePath = usePlatformAdminBasePath();
  const {
    hydrated,
    getHospital,
    setHospitalAccountStatus,
    setHospitalApprovalStatus,
  } = usePlatformDirectoryStore();
  const [message, setMessage] = useState("");

  const hospital = getHospital(id);

  if (!hydrated) {
    return (
      <p className="text-sm text-mm-text-muted">Loading hospital details…</p>
    );
  }

  if (!hospital) {
    return (
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm">
        <h1 className="text-xl font-semibold text-mm-navy">
          Hospital not found
        </h1>
        <p className="mt-2 text-sm text-mm-text-secondary">
          This hospital record is not in the platform directory.
        </p>
        <Link
          href={`${basePath}/hospitals`}
          className="mt-4 inline-flex text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
        >
          Back to Hospitals
        </Link>
      </div>
    );
  }

  function setAccount(status: PlatformAccountStatus, label: string) {
    setHospitalAccountStatus(hospital!.id, status);
    setMessage(`Account ${label}.`);
  }

  function setApproval(status: HospitalApprovalStatus, label: string) {
    setHospitalApprovalStatus(hospital!.id, status);
    setMessage(`Hospital ${label}.`);
  }

  const { accountStatus, approvalStatus } = hospital;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link
            href={`${basePath}/hospitals`}
            className="text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
          >
            ← Hospitals
          </Link>
          <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
            {hospital.name}
          </h1>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {hospital.city} · {hospital.type}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AccountStatusPill status={hospital.accountStatus} />
          <ApprovalStatusPill status={hospital.approvalStatus} />
        </div>
      </div>

      {message ? (
        <p className="rounded-[var(--mm-radius-lg)] border border-mm-teal/30 bg-mm-teal-50 px-4 py-3 text-sm font-medium text-mm-teal-700">
          {message}
        </p>
      ) : null}

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Hospital profile</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <DetailItem label="Hospital name" value={hospital.name} />
          <DetailItem label="City" value={hospital.city} />
          <DetailItem label="Type" value={hospital.type} />
          <DetailItem
            label="Internship program"
            value={hospital.internshipProgramName}
          />
          <DetailItem label="Primary admin" value={hospital.adminName} />
          <DetailItem label="Admin email" value={hospital.adminEmail} />
          <DetailItem label="Admin phone" value={hospital.adminPhone} />
        </dl>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Approval actions</h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Approve or reject this hospital for platform access.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton
            label="Approve"
            disabled={approvalStatus === "Approved"}
            onClick={() => setApproval("Approved", "approved")}
            primary
          />
          <ActionButton
            label="Reject"
            disabled={approvalStatus === "Rejected"}
            onClick={() => setApproval("Rejected", "rejected")}
          />
        </div>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Account actions</h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Activate, deactivate, suspend, or restore this hospital account.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionButton
            label="Activate"
            disabled={accountStatus === "Active"}
            onClick={() => setAccount("Active", "activated")}
          />
          <ActionButton
            label="Deactivate"
            disabled={accountStatus === "Inactive"}
            onClick={() => setAccount("Inactive", "deactivated")}
          />
          <ActionButton
            label="Suspend"
            disabled={accountStatus === "Suspended"}
            onClick={() => setAccount("Suspended", "suspended")}
          />
          <ActionButton
            label="Restore"
            disabled={accountStatus !== "Suspended"}
            onClick={() => setAccount("Active", "restored")}
          />
        </div>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Specialties</h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          {hospital.specialtyCount} active specialties
        </p>
        {hospital.specialties.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {hospital.specialties.map((specialty) => (
              <li
                key={specialty}
                className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 py-1.5 text-sm font-medium text-mm-navy"
              >
                {specialty}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-mm-text-muted">
            No specialties listed.
          </p>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
          <h2 className="text-lg font-semibold text-mm-navy">Applications</h2>
          <p className="mt-3 text-3xl font-semibold text-mm-navy">
            {hospital.applicationCount}
          </p>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Total applications on record
          </p>
        </section>
        <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
          <h2 className="text-lg font-semibold text-mm-navy">Rotations</h2>
          <p className="mt-3 text-3xl font-semibold text-mm-navy">
            {hospital.rotationCount}
          </p>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Accepted placements / rotations
          </p>
        </section>
      </div>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
        <div className="border-b border-mm-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-mm-navy">
            Hospital administrators
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {hospital.administratorCount} administrator
            {hospital.administratorCount === 1 ? "" : "s"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
              <tr>
                <th className="px-4 py-3 sm:px-5">Name</th>
                <th className="px-4 py-3 sm:px-5">Email</th>
                <th className="px-4 py-3 sm:px-5">Position</th>
              </tr>
            </thead>
            <tbody>
              {hospital.administrators.map((admin) => (
                <tr
                  key={`${admin.email}-${admin.name}`}
                  className="border-t border-mm-border"
                >
                  <td className="px-4 py-3 font-medium text-mm-navy sm:px-5">
                    {admin.name}
                  </td>
                  <td className="px-4 py-3 text-mm-text-secondary sm:px-5">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3 text-mm-text-secondary sm:px-5">
                    {admin.position}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
  primary,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] px-4 text-sm font-semibold transition-colors",
        disabled
          ? "cursor-not-allowed border border-mm-border bg-mm-gray-50 text-mm-text-muted opacity-60"
          : primary
            ? "bg-mm-teal text-white shadow-mm-teal hover:bg-mm-teal-700"
            : "border border-mm-border bg-mm-white text-mm-navy hover:bg-mm-gray-50",
      )}
    >
      {label}
    </button>
  );
}
