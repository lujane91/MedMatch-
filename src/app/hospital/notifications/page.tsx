"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  Panel,
  ToastBanner,
  buttonSecondaryClass,
  formatDateTime,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  getNotificationsForHospital,
  monthLabel,
} from "@/data/hospital-demo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalNotificationsPage() {
  const {
    activeHospitalId,
    notifications,
    markNotificationRead,
  } = useHospitalStore();
  const { toast, show, clear } = useToast();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const allItems = useMemo(
    () => getNotificationsForHospital(activeHospitalId, notifications),
    [activeHospitalId, notifications],
  );

  const items = useMemo(
    () => allItems.filter((n) => n.relatedMonth === selectedMonth),
    [allItems, selectedMonth],
  );

  const unread = items.filter((n) => !n.read).length;

  return (
    <HospitalShell title="Notifications">
      <PageIntro>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>
            {unread} unread · {items.length} for {period}
          </p>
          <button
            type="button"
            className={buttonSecondaryClass}
            disabled={unread === 0}
            onClick={() => {
              for (const n of items) {
                if (!n.read) markNotificationRead(n.id);
              }
              show("All notifications marked as read.", "success");
            }}
          >
            <CheckCheck size={16} aria-hidden />
            Mark all read
          </button>
        </div>
        <ToastBanner toast={toast} onDismiss={clear} />
      </PageIntro>

      <MonthNavigator className="mb-6" />

      {items.length === 0 ? (
        <EmptyState
          title={`No notifications for ${period}`}
          description="Capacity alerts and application updates linked to the selected rotation month will show up here."
        />
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <Panel
              key={n.id}
              className={cn(
                "transition-colors",
                !n.read && "border-mm-teal/35 bg-mm-teal-50/40",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)]",
                      n.read
                        ? "bg-mm-gray-100 text-mm-gray-400"
                        : "bg-mm-teal text-white",
                    )}
                    aria-hidden
                  >
                    <Bell size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-mm-navy">{n.title}</h3>
                    <p className="mt-1 text-sm text-mm-text-secondary">
                      {n.message}
                    </p>
                    <p className="mt-2 text-[0.75rem] text-mm-text-muted">
                      {formatDateTime(n.createdAt)}
                      {n.relatedSpecialtyId
                        ? ` · ${specialtyName(n.relatedSpecialtyId)}`
                        : ""}
                      {n.relatedMonth
                        ? ` · ${monthLabel(n.relatedMonth)} ${year}`
                        : ""}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {n.relatedApplicationId ? (
                        <Link
                          href={`/hospital/applications/${n.relatedApplicationId}`}
                          className="text-sm font-semibold text-mm-teal-700 hover:underline"
                        >
                          Open application
                        </Link>
                      ) : null}
                      {!n.read ? (
                        <button
                          type="button"
                          onClick={() => {
                            markNotificationRead(n.id);
                            show("Notification marked as read.", "info");
                          }}
                          className="text-sm font-semibold text-mm-navy hover:underline"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </HospitalShell>
  );
}
