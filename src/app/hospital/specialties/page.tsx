"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Pencil,
  Plus,
  Power,
  Trash2,
} from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import {
  CapacityBadge,
  ConfirmModal,
  PageIntro,
  Panel,
  ToastBanner,
  buttonPrimaryClass,
  buttonSecondaryClass,
  selectClassName,
} from "@/components/hospital/hospital-ui";
import { Input } from "@/components/ui/Input";
import {
  MONTHS,
  computeCapacityRow,
  type CapacityStatus,
  type MonthKey,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import {
  applicationDeadlineLabel,
  rotationDatesLabel,
  selectedPeriodLabel,
} from "@/lib/hospital-month";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

type SpecialtyFormMode = "add" | "edit" | null;

type CapacityTableRow = {
  specialtyId: SpecialtyId;
  specialtyName: string;
  specialtyActive: boolean;
  month: MonthKey;
  monthLabel: string;
  internalSlots: number;
  externalSlots: number;
  totalSlots: number;
  applicationCount: number;
  acceptedCount: number;
  pendingCount: number;
  rejectedCount: number;
  remaining: number;
  status: CapacityStatus;
  closed: boolean;
};

export default function HospitalSpecialtiesPage() {
  const {
    activeHospitalId,
    activeSpecialties,
    applications,
    capacities,
    addSpecialty,
    updateSpecialty,
    setSpecialtyActive,
    deleteSpecialty,
    upsertSpecialtyCapacity,
  } = useHospitalStore();

  const [selectedId, setSelectedId] = useState<SpecialtyId | "all">("all");
  const [formMode, setFormMode] = useState<SpecialtyFormMode>(null);
  const [editingId, setEditingId] = useState<SpecialtyId | null>(null);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [defaultInternal, setDefaultInternal] = useState("4");
  const [defaultExternal, setDefaultExternal] = useState("2");
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<SpecialtyId | null>(null);
  const { toast, show, clear } = useToast();
  const { selectedMonth, year } = useHospitalMonth();

  useEffect(() => {
    if (selectedId === "all") return;
    if (!activeSpecialties.some((s) => s.id === selectedId)) {
      setSelectedId("all");
    }
  }, [activeSpecialties, selectedId]);

  const visibleSpecialties = useMemo(() => {
    if (selectedId === "all") return activeSpecialties;
    return activeSpecialties.filter((s) => s.id === selectedId);
  }, [activeSpecialties, selectedId]);

  const rows = useMemo(() => {
    const list: CapacityTableRow[] = [];
    const monthMeta =
      MONTHS.find((item) => item.key === selectedMonth) ?? MONTHS[0];

    for (const specialty of visibleSpecialties) {
      // Only specialties offered in the selected month (active with seats).
      if (!specialty.active) continue;

      const computed = computeCapacityRow(
        specialty.id,
        selectedMonth,
        activeHospitalId,
        applications,
        capacities,
        { specialtyActive: specialty.active },
      );

      const totalSlots = computed?.totalSlots ?? 0;
      if (totalSlots <= 0) continue;

      list.push({
        specialtyId: specialty.id,
        specialtyName: specialty.name,
        specialtyActive: specialty.active,
        month: selectedMonth,
        monthLabel: monthMeta.label,
        internalSlots: computed?.internalSlots ?? 0,
        externalSlots: computed?.externalSlots ?? 0,
        totalSlots,
        applicationCount: computed?.applicationCount ?? 0,
        acceptedCount: computed?.acceptedCount ?? 0,
        pendingCount: computed?.pendingCount ?? 0,
        rejectedCount: computed?.rejectedCount ?? 0,
        remaining: computed?.remaining ?? 0,
        status: computed?.status ?? "Closed",
        closed: computed?.closed ?? false,
      });
    }

    return list;
  }, [
    visibleSpecialties,
    selectedMonth,
    activeHospitalId,
    applications,
    capacities,
  ]);

  function openAddForm() {
    setFormMode("add");
    setEditingId(null);
    setName("");
    setShortName("");
    setDefaultInternal("4");
    setDefaultExternal("2");
    setFormError(null);
  }

  function openEditForm(specialtyId: SpecialtyId) {
    const specialty = activeSpecialties.find((s) => s.id === specialtyId);
    if (!specialty) return;
    setFormMode("edit");
    setEditingId(specialty.id);
    setName(specialty.name);
    setShortName(specialty.shortName);
    setFormError(null);
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setFormError(null);
  }

  function onSubmitSpecialty(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      const message = "Specialty name is required.";
      setFormError(message);
      show(message, "error");
      return;
    }
    if (trimmed.length < 2) {
      const message = "Specialty name must be at least 2 characters.";
      setFormError(message);
      show(message, "error");
      return;
    }

    if (formMode === "add") {
      const duplicate = activeSpecialties.some(
        (s) => s.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (duplicate) {
        const message = "A specialty with this name already exists.";
        setFormError(message);
        show(message, "error");
        return;
      }
      const internal = Math.max(0, Number(defaultInternal));
      const external = Math.max(0, Number(defaultExternal));
      if (Number.isNaN(internal) || Number.isNaN(external)) {
        const message = "Default slot values must be valid numbers.";
        setFormError(message);
        show(message, "error");
        return;
      }
      const created = addSpecialty({
        name: trimmed,
        shortName: shortName.trim() || undefined,
        internalSlots: internal,
        externalSlots: external,
      });
      if (created) setSelectedId(created.id);
      closeForm();
      show(`${trimmed} added with monthly capacity.`, "success");
      return;
    }

    if (formMode === "edit" && editingId) {
      updateSpecialty(editingId, {
        name: trimmed,
        shortName: shortName.trim() || undefined,
      });
      closeForm();
      show("Specialty updated.", "success");
    }
  }

  const deleteTarget = activeSpecialties.find((s) => s.id === deleteId);

  const period = selectedPeriodLabel(selectedMonth, year, false);

  return (
    <HospitalShell title="Programs & Capacity">
      <PageIntro title="Internship specialties">
        Select a month first, then manage specialties and capacity for{" "}
        {period}. Interns only ever see total slots — never the
        internal/external split.
        <ToastBanner toast={toast} onDismiss={clear} />
      </PageIntro>

      <MonthNavigator className="mb-6" />

      <Panel className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-mm-text-secondary">
              Filter specialties for {period}, then edit slots for that month.
            </p>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            className={buttonPrimaryClass}
          >
            <Plus size={16} strokeWidth={2} />
            Add specialty
          </button>
        </div>

        <div className="mt-5 lg:hidden">
          <label
            className="mb-1.5 block text-[0.75rem] font-semibold uppercase tracking-[0.06em] text-mm-text-muted"
            htmlFor="specialty-mobile-filter"
          >
            Specialty
          </label>
          <select
            id="specialty-mobile-filter"
            className={cn(selectClassName, "w-full")}
            value={selectedId}
            onChange={(e) =>
              setSelectedId(e.target.value as SpecialtyId | "all")
            }
          >
            <option value="all">All specialties</option>
            {activeSpecialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {!s.active ? " · Inactive" : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5 hidden flex-wrap gap-2 lg:flex">
          <button
            type="button"
            onClick={() => setSelectedId("all")}
            className={cn(
              "rounded-[var(--mm-radius-lg)] border px-3.5 py-2 text-sm font-medium transition-colors",
              selectedId === "all"
                ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                : "border-mm-border bg-mm-white text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
            )}
          >
            All specialties
          </button>
          {activeSpecialties.map((specialty) => {
            const active = selectedId === specialty.id;
            return (
              <button
                key={specialty.id}
                type="button"
                onClick={() => setSelectedId(specialty.id)}
                className={cn(
                  "rounded-[var(--mm-radius-lg)] border px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-mm-teal bg-mm-teal-50 text-mm-teal-700"
                    : "border-mm-border bg-mm-white text-mm-text-secondary hover:bg-mm-gray-50 hover:text-mm-navy",
                  !specialty.active && "opacity-60",
                )}
              >
                {specialty.name}
                {!specialty.active ? " · Inactive" : ""}
              </button>
            );
          })}
        </div>
      </Panel>

      {formMode ? (
        <Panel className="mb-6">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            {formMode === "add" ? "Add specialty" : "Edit specialty"}
          </h3>
          <form onSubmit={onSubmitSpecialty} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Specialty name"
                name="specialtyName"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dermatology"
              />
              <Input
                label="Short name"
                name="shortName"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. Derm"
              />
            </div>
            {formMode === "add" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Default internal slots (each month)"
                  name="defaultInternal"
                  type="number"
                  min={0}
                  value={defaultInternal}
                  onChange={(e) => setDefaultInternal(e.target.value)}
                />
                <Input
                  label="Default external slots (each month)"
                  name="defaultExternal"
                  type="number"
                  min={0}
                  value={defaultExternal}
                  onChange={(e) => setDefaultExternal(e.target.value)}
                />
              </div>
            ) : null}
            {formError ? (
              <p className="text-[0.8125rem] font-medium text-mm-error-700" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button type="submit" className={buttonPrimaryClass}>
                {formMode === "add" ? "Create specialty" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className={buttonSecondaryClass}
              >
                Cancel
              </button>
            </div>
          </form>
        </Panel>
      ) : null}

      {selectedId !== "all" ? (
        <Panel className="mb-6">
          {(() => {
            const specialty = activeSpecialties.find((s) => s.id === selectedId);
            if (!specialty) return null;
            return (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                    {specialty.name}
                  </h3>
                  <p className="mt-1 text-sm text-mm-text-secondary">
                    {specialty.shortName} ·{" "}
                    {specialty.active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={buttonSecondaryClass}
                    onClick={() => openEditForm(specialty.id)}
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    className={buttonSecondaryClass}
                    onClick={() =>
                      setSpecialtyActive(specialty.id, !specialty.active)
                    }
                  >
                    <Power size={15} />
                    {specialty.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      buttonSecondaryClass,
                      "border-mm-error/30 text-mm-error-700 hover:bg-mm-error-50",
                    )}
                    onClick={() => setDeleteId(specialty.id)}
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })()}
        </Panel>
      ) : (
        <Panel className="mb-6 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-left text-sm">
              <thead className="bg-mm-gray-50 text-[0.75rem] uppercase tracking-[0.06em] text-mm-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Specialty</th>
                  <th className="px-4 py-3 font-semibold">Short name</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeSpecialties.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-mm-text-muted"
                    >
                      No specialties yet. Add one to start setting capacity.
                    </td>
                  </tr>
                ) : (
                  activeSpecialties.map((specialty) => (
                    <tr
                      key={specialty.id}
                      className="border-t border-mm-border"
                    >
                      <td className="px-4 py-3 font-medium text-mm-navy">
                        {specialty.name}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        {specialty.shortName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
                            specialty.active
                              ? "bg-mm-teal-50 text-mm-teal-700"
                              : "bg-mm-gray-100 text-mm-text-muted",
                          )}
                        >
                          {specialty.active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="text-sm font-semibold text-mm-teal-700 hover:underline"
                            onClick={() => setSelectedId(specialty.id)}
                          >
                            Capacity
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold text-mm-navy hover:underline"
                            onClick={() => openEditForm(specialty.id)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold text-mm-navy hover:underline"
                            onClick={() =>
                              setSpecialtyActive(
                                specialty.id,
                                !specialty.active,
                              )
                            }
                          >
                            {specialty.active ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            type="button"
                            className="text-sm font-semibold text-mm-error-700 hover:underline"
                            onClick={() => setDeleteId(specialty.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel className="overflow-hidden p-0">
        <div className="border-b border-mm-border px-4 py-3 sm:px-5">
          <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
            Capacity for {period}
          </h3>
          <p className="mt-1 text-sm text-mm-text-secondary">
            All active specialties offered in {period}, with varied internal and
            external capacity. Internal and external quotas are admin-only.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[1400px] w-full border-collapse text-left text-sm">
            <thead className="bg-mm-gray-50 text-[0.75rem] uppercase tracking-[0.06em] text-mm-text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Specialty</th>
                <th className="px-4 py-3 font-semibold">Rotation dates</th>
                <th className="px-4 py-3 font-semibold">Internal Slots</th>
                <th className="px-4 py-3 font-semibold">External Slots</th>
                <th className="px-4 py-3 font-semibold">Total Slots</th>
                <th className="px-4 py-3 font-semibold">Applications</th>
                <th className="px-4 py-3 font-semibold">Accepted</th>
                <th className="px-4 py-3 font-semibold">Pending</th>
                <th className="px-4 py-3 font-semibold">Rejected</th>
                <th className="px-4 py-3 font-semibold">Remaining Capacity</th>
                <th className="px-4 py-3 font-semibold">Requirements</th>
                <th className="px-4 py-3 font-semibold">Application deadline</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-8 text-center text-mm-text-muted"
                  >
                    No specialties are offered in {period}. Add a specialty or
                    set slots greater than zero for this month.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const editable = row.specialtyActive;
                  return (
                    <tr
                      key={`${row.specialtyId}-${row.month}`}
                      className="border-t border-mm-border align-middle"
                    >
                      <td className="px-4 py-3 font-medium text-mm-navy">
                        {row.specialtyName}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary">
                        {rotationDatesLabel(row.month, year)}
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          className="max-w-[6.5rem]"
                          disabled={!editable}
                          value={row.internalSlots}
                          onChange={(e) =>
                            upsertSpecialtyCapacity(row.specialtyId, row.month, {
                              internalSlots: Math.max(
                                0,
                                Number(e.target.value) || 0,
                              ),
                            })
                          }
                          aria-label={`${row.specialtyName} ${row.monthLabel} internal slots`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="number"
                          min={0}
                          className="max-w-[6.5rem]"
                          disabled={!editable}
                          value={row.externalSlots}
                          onChange={(e) =>
                            upsertSpecialtyCapacity(row.specialtyId, row.month, {
                              externalSlots: Math.max(
                                0,
                                Number(e.target.value) || 0,
                              ),
                            })
                          }
                          aria-label={`${row.specialtyName} ${row.monthLabel} external slots`}
                        />
                      </td>
                      <td className="px-4 py-3 font-semibold text-mm-navy">
                        {row.totalSlots}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        {row.applicationCount}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        {row.acceptedCount}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        {row.pendingCount}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        {row.rejectedCount}
                      </td>
                      <td className="px-4 py-3 font-medium text-mm-navy">
                        {row.remaining}
                      </td>
                      <td className="px-4 py-3 text-mm-text-secondary">
                        SCFHS internship eligibility · CV · Transcript
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-mm-text-secondary">
                        {applicationDeadlineLabel(row.month, year)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-start gap-2">
                          <CapacityBadge status={row.status} />
                          {editable ? (
                            <button
                              type="button"
                              onClick={() =>
                                upsertSpecialtyCapacity(
                                  row.specialtyId,
                                  row.month,
                                  { closed: !row.closed },
                                )
                              }
                              className={cn(
                                "rounded-[var(--mm-radius-lg)] border px-2.5 py-1 text-[0.6875rem] font-semibold transition-colors",
                                row.closed
                                  ? "border-mm-border bg-mm-gray-50 text-mm-text-muted"
                                  : "border-mm-teal/30 bg-mm-teal-50 text-mm-teal-700",
                              )}
                            >
                              {row.closed ? "Reopen month" : "Close month"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete specialty?"
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return;
          const deletedName = deleteTarget?.name ?? "Specialty";
          deleteSpecialty(deleteId);
          if (selectedId === deleteId) setSelectedId("all");
          setDeleteId(null);
          show(`${deletedName} deleted.`, "info");
        }}
      >
        {deleteTarget
          ? `This removes ${deleteTarget.name} and its January–December capacity rows for this hospital. Applications already submitted are kept for records.`
          : "This specialty and its monthly capacity will be removed."}
      </ConfirmModal>
    </HospitalShell>
  );
}
