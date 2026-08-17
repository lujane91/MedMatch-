"use client";

import { useMemo } from "react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { SettingsBackLink } from "@/components/hospital/SettingsBackLink";
import { EmptyState, Panel } from "@/components/hospital/hospital-ui";
import {
  formatAuditDate,
  formatAuditTime,
} from "@/data/hospital-settings";
import { useHospitalSettingsStore } from "@/lib/hospital-settings-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalSettingsAuditPage() {
  const { activeHospitalId, activeHospital } = useHospitalStore();
  const { getAuditForHospital } = useHospitalSettingsStore();

  const entries = useMemo(
    () => getAuditForHospital(activeHospitalId),
    [activeHospitalId, getAuditForHospital],
  );

  return (
    <HospitalShell title="Audit & Activity Log">
      <div className="mx-auto max-w-4xl">
        <SettingsBackLink />

        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy sm:text-2xl">
            Audit & Activity Log
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Activity for {activeHospital?.name ?? "this hospital"}.
          </p>
        </div>

        {entries.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Actions such as user changes, capacity updates, and application decisions will appear here."
          />
        ) : (
          <Panel className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-mm-border bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
                  <tr>
                    <th className="px-4 py-3 sm:px-5">Date</th>
                    <th className="px-4 py-3 sm:px-5">Time</th>
                    <th className="px-4 py-3 sm:px-5">User</th>
                    <th className="px-4 py-3 sm:px-5">Action</th>
                    <th className="px-4 py-3 sm:px-5">Module</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="border-b border-mm-border last:border-b-0"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-mm-navy sm:px-5">
                        {formatAuditDate(entry.at)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary sm:px-5">
                        {formatAuditTime(entry.at)}
                      </td>
                      <td className="px-4 py-3 font-medium text-mm-navy sm:px-5">
                        {entry.user}
                      </td>
                      <td className="px-4 py-3 text-mm-navy sm:px-5">
                        {entry.action}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary sm:px-5">
                        {entry.module}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </div>
    </HospitalShell>
  );
}
