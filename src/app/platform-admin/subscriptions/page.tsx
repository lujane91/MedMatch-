"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PlatformAdminShell,
  usePlatformAdminSession,
} from "@/components/platform-admin/PlatformAdminShell";
import { usePlatformAdminBasePath } from "@/components/platform-admin/PlatformAdminBaseProvider";
import { Input } from "@/components/ui";
import {
  formatPlanPrice,
  summarizeSubscribers,
  type PlatformPlanStatus,
  type PlatformSubscriptionPlan,
  type SubscriberHistoryStatus,
} from "@/data/platform-subscription-plan";
import { formatSar, formatSubscriptionDate } from "@/data/subscription";
import { usePlatformSubscriptionPlanStore } from "@/lib/platform-subscription-plan-store";
import { cn } from "@/lib/cn";

const REMINDER_OPTIONS = [30, 14, 7, 3, 1] as const;

type StatusFilter = "All" | "Active" | "Expired" | "Paid" | "Canceled";

function canManageSubscriptions(role: string | null | undefined) {
  return role === "Owner" || role === "Finance";
}

export default function PlatformAdminSubscriptionsPage() {
  return (
    <PlatformAdminShell title="Subscription Management">
      <SubscriptionsManager />
    </PlatformAdminShell>
  );
}

function SubscriptionsManager() {
  const admin = usePlatformAdminSession();
  const basePath = usePlatformAdminBasePath();
  const { hydrated, plan, subscribers, savePlan } =
    usePlatformSubscriptionPlanStore();

  const [draft, setDraft] = useState<PlatformSubscriptionPlan | null>(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [universityFilter, setUniversityFilter] = useState("All");

  useEffect(() => {
    if (hydrated) setDraft(plan);
  }, [hydrated, plan]);

  const universities = useMemo(() => {
    const set = new Set(subscribers.map((s) => s.university));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [subscribers]);

  const summary = useMemo(
    () => summarizeSubscribers(subscribers),
    [subscribers],
  );

  const filtered = useMemo(() => {
    return subscribers.filter((row) => {
      if (universityFilter !== "All" && row.university !== universityFilter) {
        return false;
      }
      if (statusFilter === "Active") return row.status === "Active";
      if (statusFilter === "Expired") return row.status === "Expired";
      if (statusFilter === "Canceled") return row.status === "Canceled";
      if (statusFilter === "Paid") {
        return (
          row.amountPaid > 0 &&
          row.status !== "Refunded" &&
          row.status !== "Canceled" &&
          row.status !== "Sponsored" &&
          row.status !== "Payment Waived"
        );
      }
      return true;
    });
  }, [statusFilter, subscribers, universityFilter]);

  if (!hydrated || !draft) {
    return (
      <p className="text-sm text-mm-text-muted">Loading subscription settings…</p>
    );
  }

  if (!canManageSubscriptions(admin?.role)) {
    return (
      <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-sm">
        <h1 className="text-xl font-semibold text-mm-navy">Access restricted</h1>
        <p className="mt-2 text-sm text-mm-text-secondary">
          Only Owner and Finance roles can manage student subscriptions.
        </p>
        <a
          href={basePath}
          className="mt-4 inline-flex text-sm font-semibold text-mm-teal-700 hover:text-mm-teal"
        >
          Back to Overview
        </a>
      </div>
    );
  }

  function onSave() {
    if (!draft) return;
    if (!draft.planName.trim()) {
      setSavedMessage("Plan name is required.");
      return;
    }
    if (!Number.isFinite(draft.price) || draft.price < 0) {
      setSavedMessage("Enter a valid price.");
      return;
    }
    if (!Number.isFinite(draft.durationMonths) || draft.durationMonths < 1) {
      setSavedMessage("Duration must be at least 1 month.");
      return;
    }
    savePlan(draft);
    setSavedMessage(
      "Subscription settings saved. New registrations will use this plan.",
    );
  }

  function toggleReminder(day: number) {
    setDraft((prev) => {
      if (!prev) return prev;
      const exists = prev.renewalReminderDays.includes(day);
      const nextDays = exists
        ? prev.renewalReminderDays.filter((d) => d !== day)
        : [...prev.renewalReminderDays, day].sort((a, b) => b - a);
      return { ...prev, renewalReminderDays: nextDays };
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--mm-font-display)] text-2xl font-semibold tracking-tight text-mm-navy">
          Subscription Management
        </h1>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Manage the student annual plan used across registration, billing,
          invoices, and renewals.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Current Subscription Price",
            value: formatPlanPrice(plan),
          },
          {
            label: "Active Subscribers",
            value: String(summary.active),
          },
          {
            label: "Expired Subscribers",
            value: String(summary.expired),
          },
          {
            label: "Canceled Subscribers",
            value: String(summary.canceled),
          },
          {
            label: "Revenue This Year",
            value: formatSar(summary.revenueThisYear),
          },
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

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">
          Student Subscription
        </h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Changes apply to new registrations. Existing paid students keep their
          current plan until renewal.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input
            label="Plan Name"
            value={draft.planName}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, planName: e.target.value } : prev,
              )
            }
          />
          <Input
            label="Annual Price"
            type="number"
            min={0}
            step={1}
            value={String(draft.price)}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, price: Number(e.target.value) } : prev,
              )
            }
          />
          <div>
            <label className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy">
              Currency
            </label>
            <input
              className="w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 px-3.5 py-2.5 text-[0.9375rem] text-mm-navy"
              value={draft.currency}
              readOnly
            />
          </div>
          <Input
            label="Duration (months)"
            type="number"
            min={1}
            step={1}
            value={String(draft.durationMonths)}
            onChange={(e) =>
              setDraft((prev) =>
                prev
                  ? {
                      ...prev,
                      durationMonths: Number(e.target.value),
                    }
                  : prev,
              )
            }
          />
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-[0.8125rem] font-medium text-mm-navy">
              Status
            </p>
            <div className="flex flex-wrap gap-2">
              {(["Active", "Inactive"] as PlatformPlanStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setDraft((prev) => (prev ? { ...prev, status } : prev))
                    }
                    className={cn(
                      "rounded-[var(--mm-radius-lg)] border px-4 py-2 text-sm font-semibold",
                      draft.status === status
                        ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                        : "border-mm-border bg-mm-white text-mm-navy",
                    )}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-sm font-semibold text-white shadow-mm-teal hover:bg-mm-teal-700"
          >
            Save changes
          </button>
          {savedMessage ? (
            <p className="text-sm font-medium text-mm-teal-700">{savedMessage}</p>
          ) : null}
        </div>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-6">
        <h2 className="text-lg font-semibold text-mm-navy">Renewal Settings</h2>
        <p className="mt-1 text-sm text-mm-text-secondary">
          Choose when renewal reminders are sent before expiry.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {REMINDER_OPTIONS.map((day) => {
            const checked = draft.renewalReminderDays.includes(day);
            return (
              <label
                key={day}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-2 rounded-[var(--mm-radius-lg)] border px-3 py-2 text-sm",
                  checked
                    ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                    : "border-mm-border bg-mm-white text-mm-navy",
                )}
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-mm-border text-mm-teal focus:ring-mm-teal"
                  checked={checked}
                  onChange={() => toggleReminder(day)}
                />
                {day} days before expiry
              </label>
            );
          })}
        </div>
        <button
          type="button"
          onClick={onSave}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-sm font-semibold text-mm-navy hover:bg-mm-gray-50"
        >
          Save renewal settings
        </button>
      </section>

      <section className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
        <div className="border-b border-mm-border px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold text-mm-navy">
            Subscription History
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["All", "Active", "Expired", "Canceled", "Paid"] as StatusFilter[]).map(
              (filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "rounded-[var(--mm-radius-lg)] border px-3 py-1.5 text-sm font-semibold",
                    statusFilter === filter
                      ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                      : "border-mm-border bg-mm-white text-mm-navy",
                  )}
                >
                  {filter}
                </button>
              ),
            )}
            <select
              className="rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 py-1.5 text-sm font-semibold text-mm-navy"
              value={universityFilter}
              onChange={(e) => setUniversityFilter(e.target.value)}
              aria-label="Filter by university"
            >
              {universities.map((university) => (
                <option key={university} value={university}>
                  {university === "All" ? "All universities" : university}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-mm-gray-50 text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted">
              <tr>
                <th className="px-4 py-3 sm:px-5">Student Name</th>
                <th className="px-4 py-3 sm:px-5">Student ID</th>
                <th className="px-4 py-3 sm:px-5">Plan</th>
                <th className="px-4 py-3 sm:px-5">Amount Paid</th>
                <th className="px-4 py-3 sm:px-5">Payment Date</th>
                <th className="px-4 py-3 sm:px-5">Expiry Date</th>
                <th className="px-4 py-3 sm:px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-t border-mm-border">
                  <td className="px-4 py-3 font-medium text-mm-navy sm:px-5">
                    {row.studentName}
                  </td>
                  <td className="px-4 py-3 text-mm-text-secondary sm:px-5">
                    {row.studentId}
                  </td>
                  <td className="max-w-[12rem] truncate px-4 py-3 text-mm-text-secondary sm:px-5">
                    {row.planName}
                  </td>
                  <td className="px-4 py-3 text-mm-navy sm:px-5">
                    {formatSar(row.amountPaid)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary sm:px-5">
                    {formatSubscriptionDate(row.paymentDate)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary sm:px-5">
                    {formatSubscriptionDate(row.expiryDate)}
                  </td>
                  <td className="px-4 py-3 sm:px-5">
                    <StatusPill status={row.status} />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-sm text-mm-text-muted"
                  >
                    No subscriptions match these filters.
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

function StatusPill({ status }: { status: SubscriberHistoryStatus }) {
  const styles: Record<SubscriberHistoryStatus, string> = {
    Active: "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700",
    Expired: "border-mm-border bg-mm-gray-50 text-mm-text-muted",
    Sponsored: "border-sky-200 bg-sky-50 text-sky-800",
    "Payment Waived": "border-violet-200 bg-violet-50 text-violet-800",
    Refunded: "border-amber-200 bg-amber-50 text-amber-900",
    Canceled: "border-rose-200 bg-rose-50 text-rose-800",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2 py-1 text-[0.75rem] font-semibold",
        styles[status],
      )}
    >
      {status}
    </span>
  );
}
