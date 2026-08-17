"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { SettingsBackLink } from "@/components/hospital/SettingsBackLink";
import {
  ConfirmModal,
  Panel,
  ToastBanner,
  buttonPrimaryClass,
  buttonSecondaryClass,
} from "@/components/hospital/hospital-ui";
import { Input } from "@/components/ui/Input";
import { resolveSpecialtyName, type SpecialtyId } from "@/data/hospital-demo";
import {
  ASSIGNABLE_SPECIALTIES,
  TEAM_PERMISSION_OPTIONS,
  permissionLabel,
  type HospitalTeamUser,
  type TeamPermission,
} from "@/data/hospital-settings";
import { useToast } from "@/hooks/use-toast";
import { isValidEmail, validateRequired } from "@/lib/hospital-form";
import { useHospitalSettingsStore } from "@/lib/hospital-settings-store";
import { useHospitalStore } from "@/lib/hospital-store";
import { cn } from "@/lib/cn";

type EditorState = {
  mode: "add" | "edit";
  userId?: string;
  name: string;
  email: string;
  position: string;
  permissions: TeamPermission[];
  specialtyIds: SpecialtyId[];
};

const EMPTY_EDITOR: EditorState = {
  mode: "add",
  name: "",
  email: "",
  position: "",
  permissions: [],
  specialtyIds: [],
};

function toggleValue<T extends string>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function HospitalSettingsTeamPage() {
  const { activeHospital, activeHospitalId } = useHospitalStore();
  const { getTeamForHospital, addTeamUser, updateTeamUser, removeTeamUser } =
    useHospitalSettingsStore();
  const { toast, show, clear } = useToast();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>(EMPTY_EDITOR);
  const [removeTarget, setRemoveTarget] = useState<HospitalTeamUser | null>(
    null,
  );
  const [fieldError, setFieldError] = useState<string | null>(null);

  const actorName = activeHospital?.adminName || "Hospital Director";
  const users = useMemo(
    () => getTeamForHospital(activeHospitalId),
    [activeHospitalId, getTeamForHospital],
  );

  function openAdd() {
    setFieldError(null);
    setEditor(EMPTY_EDITOR);
    setEditorOpen(true);
  }

  function openEdit(user: HospitalTeamUser) {
    setFieldError(null);
    setEditor({
      mode: "edit",
      userId: user.id,
      name: user.name,
      email: user.email,
      position: user.position,
      permissions: [...user.permissions],
      specialtyIds: [...user.specialtyIds],
    });
    setEditorOpen(true);
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    setFieldError(null);

    const requiredError = validateRequired({
      Name: editor.name,
      Email: editor.email,
      Position: editor.position,
    });
    if (requiredError) {
      setFieldError(requiredError);
      show(requiredError, "error");
      return;
    }
    if (!isValidEmail(editor.email)) {
      const message = "Enter a valid email address.";
      setFieldError(message);
      show(message, "error");
      return;
    }
    if (editor.permissions.length === 0) {
      const message = "Select at least one permission.";
      setFieldError(message);
      show(message, "error");
      return;
    }

    const payload = {
      name: editor.name,
      email: editor.email,
      position: editor.position,
      permissions: editor.permissions,
      specialtyIds: editor.specialtyIds,
    };

    if (editor.mode === "add") {
      const created = addTeamUser(activeHospitalId, payload, actorName);
      if (!created) {
        show("Could not add user.", "error");
        return;
      }
      show("User added.", "success");
    } else if (editor.userId) {
      updateTeamUser(editor.userId, payload, actorName);
      show("User updated.", "success");
    }
    setEditorOpen(false);
  }

  function confirmRemove() {
    if (!removeTarget) return;
    removeTeamUser(removeTarget.id, actorName);
    setRemoveTarget(null);
    show("User removed.", "success");
  }

  return (
    <HospitalShell title="Team Access & Permissions">
      <div className="mx-auto max-w-3xl">
        <SettingsBackLink />

        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy sm:text-2xl">
              Team Access & Permissions
            </h2>
            <p className="mt-1 text-sm text-mm-text-secondary">
              Hospital Director access only. Manage users for{" "}
              {activeHospital?.name ?? "this hospital"}.
            </p>
          </div>
          <button type="button" className={buttonPrimaryClass} onClick={openAdd}>
            <Plus size={16} aria-hidden />
            Add User
          </button>
        </div>

        <ToastBanner toast={toast} onDismiss={clear} />

        {users.length === 0 ? (
          <Panel>
            <p className="text-sm text-mm-text-secondary">
              No team members yet. Add a user to grant portal access.
            </p>
          </Panel>
        ) : (
          <ul className="space-y-3">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-4 shadow-mm-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-mm-navy">{user.name}</p>
                    <p className="mt-0.5 text-sm text-mm-text-secondary">
                      {user.email}
                    </p>
                    <p className="mt-1 text-sm text-mm-text-muted">
                      {user.position}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className={buttonSecondaryClass}
                      onClick={() => openEdit(user)}
                    >
                      <Pencil size={14} aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      className={cn(
                        buttonSecondaryClass,
                        "text-mm-error-700 hover:bg-red-50",
                      )}
                      onClick={() => setRemoveTarget(user)}
                      disabled={user.position === "Hospital Director"}
                      title={
                        user.position === "Hospital Director"
                          ? "Hospital Director cannot be removed"
                          : "Remove user"
                      }
                    >
                      <Trash2 size={14} aria-hidden />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                      Permissions
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {user.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="rounded-md border border-mm-teal/25 bg-mm-teal-50 px-2 py-1 text-[0.75rem] font-semibold text-mm-teal-700"
                        >
                          {permissionLabel(permission)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                      Assigned specialties
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {user.specialtyIds.length === 0 ? (
                        <span className="text-sm text-mm-text-muted">
                          None assigned
                        </span>
                      ) : (
                        user.specialtyIds.map((specialtyId) => (
                          <span
                            key={specialtyId}
                            className="rounded-md border border-mm-border bg-mm-gray-50 px-2 py-1 text-[0.75rem] font-medium text-mm-navy"
                          >
                            {resolveSpecialtyName(specialtyId)}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {editorOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-mm-navy/40 p-4 sm:items-center mm-fade-in">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close dialog"
            onClick={() => setEditorOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="team-user-editor-title"
            className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-white p-5 shadow-mm-md sm:p-6"
          >
            <h3
              id="team-user-editor-title"
              className="font-display text-xl font-semibold text-mm-navy"
            >
              {editor.mode === "add" ? "Add User" : "Edit User"}
            </h3>
            <form onSubmit={onSave} className="mt-4 space-y-4" noValidate>
              <Input
                label="Name"
                name="name"
                required
                value={editor.name}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                value={editor.email}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                label="Position"
                name="position"
                required
                value={editor.position}
                onChange={(e) =>
                  setEditor((prev) => ({ ...prev, position: e.target.value }))
                }
              />

              <fieldset>
                <legend className="mb-2 text-[0.8125rem] font-medium text-mm-navy">
                  Permissions
                </legend>
                <div className="space-y-2">
                  {TEAM_PERMISSION_OPTIONS.map((option) => {
                    const checked = editor.permissions.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        className="flex cursor-pointer items-start gap-3 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-2.5 hover:bg-mm-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-mm-border text-mm-teal focus:ring-mm-teal"
                          checked={checked}
                          onChange={() =>
                            setEditor((prev) => ({
                              ...prev,
                              permissions: toggleValue(
                                prev.permissions,
                                option.id,
                              ),
                            }))
                          }
                        />
                        <span>
                          <span className="block text-sm font-semibold text-mm-navy">
                            {option.label}
                          </span>
                          <span className="block text-[0.8125rem] text-mm-text-secondary">
                            {option.description}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-[0.8125rem] font-medium text-mm-navy">
                  Assigned specialties
                </legend>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ASSIGNABLE_SPECIALTIES.map((specialty) => {
                    const checked = editor.specialtyIds.includes(specialty.id);
                    return (
                      <label
                        key={specialty.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-[var(--mm-radius-lg)] border border-mm-border px-3 py-2 hover:bg-mm-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-mm-border text-mm-teal focus:ring-mm-teal"
                          checked={checked}
                          onChange={() =>
                            setEditor((prev) => ({
                              ...prev,
                              specialtyIds: toggleValue(
                                prev.specialtyIds,
                                specialty.id,
                              ),
                            }))
                          }
                        />
                        <span className="text-sm text-mm-navy">
                          {specialty.name}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {fieldError ? (
                <p
                  className="text-[0.8125rem] font-medium text-mm-error-700"
                  role="alert"
                >
                  {fieldError}
                </p>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2 pt-1">
                <button
                  type="button"
                  className={buttonSecondaryClass}
                  onClick={() => setEditorOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={buttonPrimaryClass}>
                  {editor.mode === "add" ? "Add User" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(removeTarget)}
        title="Remove user"
        confirmLabel="Remove"
        danger
        onClose={() => setRemoveTarget(null)}
        onConfirm={confirmRemove}
      >
        {removeTarget
          ? `Remove ${removeTarget.name} from team access for this hospital?`
          : null}
      </ConfirmModal>
    </HospitalShell>
  );
}
