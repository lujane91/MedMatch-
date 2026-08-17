"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  X,
} from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { ApplicantDetailsDrawer } from "@/components/hospital/ApplicantDetailsDrawer";
import { ApplicationFiltersPanel } from "@/components/hospital/ApplicationFiltersPanel";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  EmptyState,
  PageIntro,
  Panel,
  StatusBadge,
  ToastBanner,
  TypeBadge,
  buttonPrimaryClass,
  buttonSecondaryClass,
  formatDate,
  selectClassName,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import { Input } from "@/components/ui/Input";
import {
  MONTHS,
  computeCapacityRow,
  getApplicationsForHospital,
  isAcceptedStatus,
  monthLabel,
  toDisplayStatus,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { useToast } from "@/hooks/use-toast";
import {
  DEFAULT_APPLICATION_FILTERS,
  clearFilterKey,
  filterApplications,
  getActiveFilterChips,
  sortApplications,
  type ApplicationFiltersState,
  type ApplicationSortKey,
} from "@/lib/application-filters";
import { cn } from "@/lib/cn";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

type SpecialtyGroup = {
  specialtyId: SpecialtyId;
  applications: ReturnType<typeof sortApplications>;
  total: number;
  internal: number;
  external: number;
  accepted: number;
  pending: number;
  waitlisted: number;
  rejected: number;
  remaining: number;
};

export default function HospitalApplicationsPage() {
  const {
    activeHospital,
    activeHospitalId,
    applications,
    capacities,
    acceptApplication,
    rejectApplication,
    waitlistApplication,
    suggestAlternativeMonths,
    addNote,
  } = useHospitalStore();

  const { toast, show, clear } = useToast();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const [filters, setFilters] = useState<ApplicationFiltersState>(
    DEFAULT_APPLICATION_FILTERS,
  );
  const [sortKey, setSortKey] = useState<ApplicationSortKey>("ranking-desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [noteForId, setNoteForId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [suggestForId, setSuggestForId] = useState<string | null>(null);
  const [suggestMonths, setSuggestMonths] = useState<MonthKey[]>([]);

  const monthApps = useMemo(
    () =>
      getApplicationsForHospital(activeHospitalId, applications).filter(
        (app) => app.month === selectedMonth,
      ),
    [activeHospitalId, applications, selectedMonth],
  );

  const filtered = useMemo(
    () => sortApplications(filterApplications(monthApps, filters), sortKey),
    [monthApps, filters, sortKey],
  );

  const groups = useMemo(() => {
    const map = new Map<SpecialtyId, typeof filtered>();
    for (const app of filtered) {
      const list = map.get(app.specialtyId) ?? [];
      list.push(app);
      map.set(app.specialtyId, list);
    }

    const result: SpecialtyGroup[] = [...map.entries()].map(
      ([specialtyId, apps]) => {
        const capacity = computeCapacityRow(
          specialtyId,
          selectedMonth,
          activeHospitalId,
          applications,
          capacities,
        );
        return {
          specialtyId,
          applications: apps,
          total: apps.length,
          internal: apps.filter((a) => a.applicantType === "Internal").length,
          external: apps.filter((a) => a.applicantType === "External").length,
          accepted: apps.filter((a) => isAcceptedStatus(a.status)).length,
          pending: apps.filter((a) => toDisplayStatus(a.status) === "Pending")
            .length,
          waitlisted: apps.filter(
            (a) => toDisplayStatus(a.status) === "Waitlisted",
          ).length,
          rejected: apps.filter((a) => toDisplayStatus(a.status) === "Rejected")
            .length,
          remaining: capacity?.remaining ?? 0,
        };
      },
    );

    return result.sort((a, b) => b.total - a.total);
  }, [filtered, selectedMonth, activeHospitalId, applications, capacities]);

  useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      for (const group of groups) {
        if (next[group.specialtyId] === undefined) {
          next[group.specialtyId] = groups.indexOf(group) < 2;
        }
      }
      return next;
    });
  }, [groups]);

  const selectedApplication = useMemo(
    () => applications.find((app) => app.id === selectedId) ?? null,
    [applications, selectedId],
  );

  const chips = useMemo(() => getActiveFilterChips(filters), [filters]);

  const universities = useMemo(
    () => [...new Set(monthApps.map((a) => a.university))].sort(),
    [monthApps],
  );
  const colleges = useMemo(
    () => [...new Set(monthApps.map((a) => a.college))].sort(),
    [monthApps],
  );
  const nationalities = useMemo(
    () => [...new Set(monthApps.map((a) => a.nationality))].sort(),
    [monthApps],
  );

  function handleAccept(id: string) {
    const result = acceptApplication(id);
    show(
      result.message ??
        (result.ok ? "Applicant accepted." : "Could not accept applicant."),
      result.ok ? "success" : "error",
    );
  }

  function handleReject(id: string) {
    rejectApplication(id, "Does not meet selection criteria");
    show("Applicant rejected.", "info");
  }

  function handleWaitlist(id: string) {
    waitlistApplication(id);
    show("Applicant waitlisted.", "info");
  }

  function toggleSuggestMonth(month: MonthKey) {
    setSuggestMonths((prev) =>
      prev.includes(month)
        ? prev.filter((item) => item !== month)
        : [...prev, month],
    );
  }

  function submitSuggestion() {
    if (!suggestForId || suggestMonths.length === 0) return;
    suggestAlternativeMonths(
      suggestForId,
      suggestMonths,
      `Suggested alternative month(s): ${suggestMonths.map((m) => monthLabel(m)).join(", ")}.`,
    );
    show("Alternative month suggestion sent.", "success");
    setSuggestForId(null);
    setSuggestMonths([]);
  }

  function submitNote() {
    if (!noteForId || !noteText.trim()) return;
    addNote(noteForId, noteText.trim());
    show("Internal note added.", "success");
    setNoteForId(null);
    setNoteText("");
  }

  const filtersPanel = (
    <ApplicationFiltersPanel
      filters={filters}
      onChange={setFilters}
      onClearAll={() => setFilters(DEFAULT_APPLICATION_FILTERS)}
      universities={universities}
      colleges={colleges}
      nationalities={nationalities}
    />
  );

  return (
    <HospitalShell title="Applications">
      <PageIntro title="Internship applications">
        Browse and filter applicants for rotations in {period} at{" "}
        {activeHospital?.name ?? "this hospital"}. Results update instantly.
        <ToastBanner toast={toast} onDismiss={clear} />
      </PageIntro>

      <MonthNavigator className="mb-6" />

      <Panel className="mb-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mm-gray-400"
              aria-hidden
            />
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search by student name, university, or student ID"
              className="pl-9"
              aria-label="Search applications"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="applications-sort">
              Sort applications
            </label>
            <select
              id="applications-sort"
              className={cn(selectClassName, "min-w-[12rem]")}
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as ApplicationSortKey)}
            >
              <option value="ranking-desc">Ranking</option>
              <option value="gpa-desc">Highest GPA</option>
              <option value="gpa-asc">Lowest GPA</option>
              <option value="submitted-desc">Application date</option>
              <option value="profile-desc">Profile completion</option>
              <option value="name-asc">Alphabetical</option>
            </select>
            <button
              type="button"
              className={cn(buttonSecondaryClass, "lg:hidden")}
              onClick={() => setFiltersOpen(true)}
            >
              <Filter size={16} aria-hidden />
              Filters
              {chips.length > 0 ? ` (${chips.length})` : ""}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-mm-navy">
            {filtered.length} matching applicant
            {filtered.length === 1 ? "" : "s"} · {groups.length} specialt
            {groups.length === 1 ? "y" : "ies"}
          </p>
          {chips.length > 0 ? (
            <button
              type="button"
              className="text-sm font-semibold text-mm-teal-700 hover:underline"
              onClick={() => setFilters(DEFAULT_APPLICATION_FILTERS)}
            >
              Clear all filters
            </button>
          ) : null}
        </div>

        {chips.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={`${chip.key}-${chip.label}`}
                type="button"
                onClick={() => setFilters((prev) => clearFilterKey(prev, chip.key))}
                className="inline-flex items-center gap-1.5 rounded-full border border-mm-teal/30 bg-mm-teal-50 px-2.5 py-1 text-[0.75rem] font-semibold text-mm-teal-700"
              >
                {chip.label}
                <X size={12} aria-hidden />
                <span className="sr-only">Remove filter</span>
              </button>
            ))}
          </div>
        ) : null}
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {groups.length === 0 ? (
            <EmptyState
              title={`No matching applications for ${period}`}
              description="Try adjusting filters or selecting another month."
            />
          ) : (
            groups.map((group) => {
              const open = expanded[group.specialtyId] ?? false;
              return (
                <section
                  key={group.specialtyId}
                  className="overflow-hidden rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm"
                >
                  <button
                    type="button"
                    className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left sm:px-5"
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [group.specialtyId]: !open,
                      }))
                    }
                    aria-expanded={open}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {open ? (
                          <ChevronDown size={18} className="text-mm-teal-700" />
                        ) : (
                          <ChevronRight size={18} className="text-mm-gray-400" />
                        )}
                        <h3 className="text-[1rem] font-semibold text-mm-navy">
                          {specialtyName(group.specialtyId)}
                        </h3>
                      </div>
                      <p className="mt-1 pl-7 text-sm text-mm-text-secondary">
                        {group.total} Application{group.total === 1 ? "" : "s"} ·{" "}
                        {monthLabel(selectedMonth)} {year}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 pl-7 text-[0.6875rem] font-semibold">
                        <span className="rounded-full bg-mm-gray-100 px-2.5 py-1 text-mm-navy">
                          Total Applications {group.total}
                        </span>
                        <span className="rounded-full bg-mm-teal-50 px-2.5 py-1 text-mm-teal-700">
                          Internal Applicants {group.internal}
                        </span>
                        <span className="rounded-full bg-mm-gray-100 px-2.5 py-1 text-mm-navy">
                          External Applicants {group.external}
                        </span>
                        <span className="rounded-full bg-mm-teal-50 px-2.5 py-1 text-mm-teal-700">
                          Accepted {group.accepted}
                        </span>
                        <span className="rounded-full bg-mm-gray-100 px-2.5 py-1 text-mm-navy">
                          Pending {group.pending}
                        </span>
                        <span className="rounded-full bg-mm-warning-50 px-2.5 py-1 text-mm-warning-700">
                          Waitlisted {group.waitlisted}
                        </span>
                        <span className="rounded-full bg-mm-error-50 px-2.5 py-1 text-mm-error-700">
                          Rejected {group.rejected}
                        </span>
                        <span className="rounded-full bg-mm-teal-50 px-2.5 py-1 text-mm-teal-700">
                          Remaining Capacity {group.remaining}
                        </span>
                      </div>
                    </div>
                  </button>

                  {open ? (
                    <div className="overflow-x-auto border-t border-mm-border">
                      <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
                        <thead className="bg-mm-gray-50 text-[0.75rem] uppercase tracking-[0.06em] text-mm-text-muted">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Rank</th>
                            <th className="px-4 py-3 font-semibold">Student</th>
                            <th className="px-4 py-3 font-semibold">University</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">GPA</th>
                            <th className="px-4 py-3 font-semibold">Gender</th>
                            <th className="px-4 py-3 font-semibold">Profile %</th>
                            <th className="px-4 py-3 font-semibold">Requirements</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Submitted</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.applications.map((app, index) => {
                            const displayStatus = toDisplayStatus(app.status);
                            const accepted = isAcceptedStatus(app.status);
                            const canAcceptMore = group.remaining > 0;

                            return (
                              <tr
                                key={app.id}
                                className={cn(
                                  "border-t border-mm-border align-top",
                                  selectedId === app.id && "bg-mm-teal-50/40",
                                )}
                              >
                                <td className="px-4 py-3 font-semibold text-mm-navy">
                                  #{index + 1}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedId(app.id)}
                                    className="text-left font-medium text-mm-navy hover:text-mm-teal-700"
                                  >
                                    {app.applicantName}
                                  </button>
                                  <p className="mt-0.5 text-[0.75rem] text-mm-text-muted">
                                    {app.studentId}
                                  </p>
                                </td>
                                <td className="max-w-[14rem] px-4 py-3 text-mm-text-secondary">
                                  {app.university}
                                </td>
                                <td className="px-4 py-3">
                                  <TypeBadge type={app.applicantType} />
                                </td>
                                <td className="px-4 py-3 font-medium text-mm-navy">
                                  {app.gpa.toFixed(2)}
                                </td>
                                <td className="px-4 py-3 text-mm-text-secondary">
                                  {app.gender}
                                </td>
                                <td className="px-4 py-3 font-medium text-mm-navy">
                                  {app.profileStrength}%
                                </td>
                                <td className="px-4 py-3">
                                  <span
                                    className={cn(
                                      "inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
                                      app.meetsRequirements
                                        ? "bg-mm-teal-50 text-mm-teal-700"
                                        : "bg-mm-warning-50 text-mm-warning-700",
                                    )}
                                  >
                                    {app.meetsRequirements
                                      ? "✓ Meets Requirements"
                                      : "⚠ Missing Requirements"}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <StatusBadge status={app.status} display />
                                </td>
                                <td className="px-4 py-3 text-mm-text-secondary">
                                  {formatDate(app.submittedAt)}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex min-w-[12rem] flex-wrap gap-1.5">
                                    <button
                                      type="button"
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem]",
                                      )}
                                      onClick={() => setSelectedId(app.id)}
                                    >
                                      View Profile
                                    </button>
                                    <button
                                      type="button"
                                      disabled={accepted || !canAcceptMore}
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem] disabled:opacity-45",
                                      )}
                                      onClick={() => handleAccept(app.id)}
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      disabled={displayStatus === "Rejected"}
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem] disabled:opacity-45",
                                      )}
                                      onClick={() => handleReject(app.id)}
                                    >
                                      Reject
                                    </button>
                                    <button
                                      type="button"
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem]",
                                      )}
                                      onClick={() => {
                                        setSuggestForId(app.id);
                                        setSuggestMonths(
                                          app.alternativeMonthSuggestions ?? [],
                                        );
                                      }}
                                    >
                                      Suggest Another Month
                                    </button>
                                    <button
                                      type="button"
                                      disabled={displayStatus === "Waitlisted"}
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem] disabled:opacity-45",
                                      )}
                                      onClick={() => handleWaitlist(app.id)}
                                    >
                                      Waitlist
                                    </button>
                                    <button
                                      type="button"
                                      className={cn(
                                        buttonSecondaryClass,
                                        "px-2.5 py-1.5 text-[0.75rem]",
                                      )}
                                      onClick={() => {
                                        setNoteForId(app.id);
                                        setNoteText("");
                                      }}
                                    >
                                      Add Internal Note
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}
                </section>
              );
            })
          )}
        </div>

        <aside className="hidden lg:block">
          <Panel className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h2 className="mb-4 text-[0.9375rem] font-semibold text-mm-navy">
              Advanced filters
            </h2>
            {filtersPanel}
          </Panel>
        </aside>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-mm-navy/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-mm-white shadow-mm-lg">
            <div className="flex items-center justify-between border-b border-mm-border px-4 py-3">
              <h2 className="font-semibold text-mm-navy">Filters</h2>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-lg)] hover:bg-mm-gray-50"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4">{filtersPanel}</div>
            <div className="border-t border-mm-border p-4">
              <button
                type="button"
                className={cn(buttonPrimaryClass, "w-full")}
                onClick={() => setFiltersOpen(false)}
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {noteForId ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-mm-navy/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-5 shadow-mm-lg">
            <h3 className="font-semibold text-mm-navy">Add internal note</h3>
            <textarea
              className={cn(selectClassName, "mt-3 min-h-28 resize-y")}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Visible only to hospital administrators"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className={buttonSecondaryClass}
                onClick={() => setNoteForId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={buttonPrimaryClass}
                onClick={submitNote}
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {suggestForId ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-mm-navy/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-5 shadow-mm-lg">
            <h3 className="font-semibold text-mm-navy">Suggest another month</h3>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Choose one or more alternative rotation months.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {MONTHS.filter((m) => m.key !== selectedMonth).map((month) => {
                const active = suggestMonths.includes(month.key);
                return (
                  <button
                    key={month.key}
                    type="button"
                    onClick={() => toggleSuggestMonth(month.key)}
                    className={cn(
                      "rounded-[var(--mm-radius-lg)] border px-3 py-2 text-[0.8125rem] font-semibold",
                      active
                        ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                        : "border-mm-border bg-mm-white text-mm-navy",
                    )}
                  >
                    {month.label}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className={buttonSecondaryClass}
                onClick={() => {
                  setSuggestForId(null);
                  setSuggestMonths([]);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className={buttonPrimaryClass}
                disabled={suggestMonths.length === 0}
                onClick={submitSuggestion}
              >
                Send suggestion
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ApplicantDetailsDrawer
        open={Boolean(selectedApplication)}
        application={selectedApplication}
        hospital={activeHospital}
        applications={applications}
        capacities={capacities}
        onClose={() => setSelectedId(null)}
        onAccept={handleAccept}
        onReject={handleReject}
        onWaitlist={handleWaitlist}
      />
    </HospitalShell>
  );
}
