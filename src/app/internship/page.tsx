"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Download,
  List,
  Plus,
  Printer,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  hospitalById,
  statusTone,
  type ApplicationStatus,
  type Rotation,
} from "@/data/intern";
import { cn } from "@/lib/cn";
import { useInternStore } from "@/lib/intern-store";

function statusClass(status: ApplicationStatus) {
  const tone = statusTone(status);
  if (tone === "teal") return "bg-mm-teal text-white";
  if (tone === "light-teal") return "bg-mm-teal-50 text-mm-teal-700";
  if (tone === "amber") return "bg-amber-50 text-amber-700";
  if (tone === "red") return "bg-red-50 text-red-700";
  return "border border-mm-border bg-mm-white text-mm-text-muted";
}

function calendarBlockClass(status: ApplicationStatus) {
  const tone = statusTone(status);
  if (tone === "teal") return "bg-mm-teal text-white";
  if (tone === "light-teal") return "bg-[rgba(31,166,160,0.22)] text-mm-navy";
  if (tone === "amber") return "bg-amber-200/80 text-amber-900";
  if (tone === "red") return "bg-red-100 text-red-800";
  return "border border-dashed border-mm-border bg-mm-white text-mm-text-muted";
}

function monthKey(date: string) {
  return date.slice(0, 7);
}

function buildMonths(start: string, end: string) {
  const months: string[] = [];
  const cursor = new Date(`${start}T00:00:00`);
  const last = new Date(`${end}T00:00:00`);
  cursor.setDate(1);
  while (cursor <= last) {
    months.push(cursor.toISOString().slice(0, 7));
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months;
}

export default function InternshipYearPage() {
  const { profile, rotations, hydrated } = useInternStore();
  const [view, setView] = useState<"list" | "calendar">("list");

  const stats = useMemo(() => {
    const approved = rotations.filter((r) => r.status === "Accepted").length;
    const pending = rotations.filter((r) =>
      ["Submitted", "Under Review", "Changes Requested", "Ready to Submit"].includes(
        r.status,
      ),
    ).length;
    return {
      planned: rotations.length,
      approved,
      pending,
      remaining: Math.max(0, 12 - approved),
    };
  }, [rotations]);

  const months = useMemo(
    () => buildMonths(profile.internshipStart, profile.internshipEnd),
    [profile.internshipStart, profile.internshipEnd],
  );

  const complete = stats.approved >= 8 && stats.pending === 0 && stats.planned > 0;

  if (!hydrated) {
    return (
      <AppShell title="Internship Year">
        <p className="text-mm-text-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell title="Internship Year">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-[family-name:var(--mm-font-display)] text-[clamp(1.75rem,3vw,2.5rem)] tracking-[-0.02em] text-mm-navy">
              Manage My Internship Year
            </h1>
            <p className="mt-2 max-w-2xl text-[1.0625rem] text-mm-text-secondary">
              Build your rotation schedule, apply to hospitals, and track every
              decision.
            </p>
          </div>
          <Link
            href="/internship/add"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal hover:bg-mm-teal-700"
          >
            <Plus size={16} />
            Add Rotation
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Internship start",
              value: profile.internshipStart || "—",
            },
            { label: "Internship end", value: profile.internshipEnd || "—" },
            {
              label: "Total planned rotations",
              value: String(stats.planned),
            },
            {
              label: "Approved / Pending / Remaining",
              value: `${stats.approved} / ${stats.pending} / ${stats.remaining}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4"
            >
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                {item.label}
              </p>
              <p className="mt-2 text-[0.9375rem] font-semibold text-mm-navy">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-[10px] px-3 text-[0.8125rem] font-semibold",
                view === "list"
                  ? "bg-mm-navy text-white"
                  : "text-mm-text-muted hover:text-mm-navy",
              )}
            >
              <List size={14} />
              List View
            </button>
            <button
              type="button"
              onClick={() => setView("calendar")}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-[10px] px-3 text-[0.8125rem] font-semibold",
                view === "calendar"
                  ? "bg-mm-navy text-white"
                  : "text-mm-text-muted hover:text-mm-navy",
              )}
            >
              <CalendarDays size={14} />
              Calendar View
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Download Schedule", "Print Schedule", "Add to Calendar"].map(
              (label) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-3 text-[0.8125rem] font-medium text-mm-navy"
                >
                  {label.includes("Download") ? (
                    <Download size={14} />
                  ) : (
                    <Printer size={14} />
                  )}
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        {complete ? (
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-teal/30 bg-mm-teal-50/70 px-5 py-4 text-[0.9375rem] font-semibold text-mm-teal-700">
            Your Internship Year Plan is Complete
          </div>
        ) : null}

        {view === "list" ? (
          <div className="space-y-3">
            {rotations.length === 0 ? (
              <div className="rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-surface p-8 text-center">
                <p className="text-[0.9375rem] font-semibold text-mm-navy">
                  No rotations yet
                </p>
                <p className="mt-2 text-[0.875rem] text-mm-text-muted">
                  Add your first rotation to start building your July–June plan.
                </p>
                <Link
                  href="/internship/add"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white"
                >
                  <Plus size={16} />
                  Add Rotation
                </Link>
              </div>
            ) : (
              rotations
                .slice()
                .sort((a, b) => a.startDate.localeCompare(b.startDate))
                .map((rotation) => (
                  <RotationListCard key={rotation.id} rotation={rotation} />
                ))
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {months.map((month) => {
              const monthRotations = rotations.filter(
                (r) =>
                  monthKey(r.startDate) <= month && monthKey(r.endDate) >= month,
              );
              const label = new Date(`${month}-01T00:00:00`).toLocaleString(
                "en",
                { month: "long", year: "numeric" },
              );
              return (
                <div
                  key={month}
                  className="min-h-[9rem] rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4"
                >
                  <p className="text-[0.8125rem] font-semibold text-mm-navy">
                    {label}
                  </p>
                  <div className="mt-3 space-y-2">
                    {monthRotations.length === 0 ? (
                      <p className="text-[0.75rem] text-mm-text-muted">
                        Unplanned
                      </p>
                    ) : (
                      monthRotations.map((r) => (
                        <Link
                          key={r.id}
                          href={`/internship/${r.id}`}
                          className={cn(
                            "block rounded-[10px] px-2.5 py-2 text-[0.75rem] font-semibold",
                            calendarBlockClass(r.status),
                          )}
                        >
                          {r.specialty}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function RotationListCard({ rotation }: { rotation: Rotation }) {
  const primary = hospitalById(rotation.preferences[0] ?? "");
  return (
    <Link
      href={`/internship/${rotation.id}`}
      className="flex flex-col gap-3 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 transition-colors hover:border-mm-teal/35 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[0.9375rem] font-semibold text-mm-navy">
            {rotation.title}
          </p>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold",
              statusClass(rotation.status),
            )}
          >
            {rotation.status}
          </span>
        </div>
        <p className="mt-1 text-[0.875rem] text-mm-text-secondary">
          {rotation.specialty} · {rotation.startDate} → {rotation.endDate}
        </p>
        <p className="mt-1 text-[0.8125rem] text-mm-text-muted">
          {primary?.name ?? "Hospital preferences pending"}
        </p>
      </div>
      <span className="inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-mm-teal">
        Open details
        <ArrowRight size={14} />
      </span>
    </Link>
  );
}
