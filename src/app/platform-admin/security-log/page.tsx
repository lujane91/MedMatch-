"use client";

import { useEffect, useState } from "react";
import { PlatformAdminShell } from "@/components/platform-admin/PlatformAdminShell";
import { formatSubscriptionDate } from "@/data/subscription";

type SecurityEvent = {
  id: string;
  at: string;
  type: string;
  email?: string;
  path?: string;
  ip?: string;
  detail?: string;
};

export default function PlatformAdminSecurityLogPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/platform-admin/security-log", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (!res.ok) {
        setError("Unable to load security activity.");
        return;
      }
      const data = (await res.json()) as { events: SecurityEvent[] };
      setEvents(data.events ?? []);
    })();
  }, []);

  return (
    <PlatformAdminShell title="Security activity">
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
        <div className="border-b border-mm-border px-5 py-4">
          <h1 className="text-lg font-semibold text-mm-navy">
            Security Activity Log
          </h1>
          <p className="mt-1 text-sm text-mm-text-secondary">
            Login events and unauthorized access attempts.
          </p>
        </div>
        {error ? (
          <p className="px-5 py-6 text-sm text-mm-error-700">{error}</p>
        ) : events.length === 0 ? (
          <p className="px-5 py-6 text-sm text-mm-text-muted">No events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
                <tr>
                  <th className="px-5 py-3">When</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Detail</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-mm-border">
                    <td className="whitespace-nowrap px-5 py-3 text-mm-navy">
                      {formatSubscriptionDate(event.at)}
                    </td>
                    <td className="px-5 py-3 font-medium text-mm-navy">
                      {event.type}
                    </td>
                    <td className="px-5 py-3 text-mm-text-secondary">
                      {event.email || "—"}
                    </td>
                    <td className="px-5 py-3 text-mm-text-secondary">
                      {event.detail || event.path || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PlatformAdminShell>
  );
}
