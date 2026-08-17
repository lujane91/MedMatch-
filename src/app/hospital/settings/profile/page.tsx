"use client";

import { useEffect, useState, type FormEvent } from "react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { SettingsBackLink } from "@/components/hospital/SettingsBackLink";
import {
  HospitalLogo,
  Panel,
  ToastBanner,
  buttonPrimaryClass,
  selectClassName,
} from "@/components/hospital/hospital-ui";
import { Input } from "@/components/ui/Input";
import { type HospitalType } from "@/data/hospital-demo";
import { useToast } from "@/hooks/use-toast";
import {
  isValidEmail,
  isValidPhone,
  validateRequired,
} from "@/lib/hospital-form";
import { useHospitalSettingsStore } from "@/lib/hospital-settings-store";
import { useHospitalStore } from "@/lib/hospital-store";

const HOSPITAL_TYPES: HospitalType[] = ["Government", "University", "Private"];

export default function HospitalSettingsProfilePage() {
  const { activeHospital, updateHospitalProfile } = useHospitalStore();
  const { appendAudit } = useHospitalSettingsStore();
  const { toast, show, clear } = useToast();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState<HospitalType>("Government");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [internshipProgramName, setInternshipProgramName] = useState("");
  const [internshipCoordinator, setInternshipCoordinator] = useState("");
  const [internshipEmail, setInternshipEmail] = useState("");
  const [internshipPhone, setInternshipPhone] = useState("");
  const [internshipOverview, setInternshipOverview] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeHospital) return;
    setName(activeHospital.name);
    setLogo(activeHospital.logo ?? "");
    setCity(activeHospital.city);
    setType(activeHospital.type);
    setAdminName(activeHospital.adminName);
    setAdminEmail(activeHospital.adminEmail);
    setAdminPhone(activeHospital.adminPhone);
    setInternshipProgramName(activeHospital.internshipProgramName ?? "");
    setInternshipCoordinator(activeHospital.internshipCoordinator ?? "");
    setInternshipEmail(activeHospital.internshipEmail ?? "");
    setInternshipPhone(activeHospital.internshipPhone ?? "");
    setInternshipOverview(activeHospital.internshipOverview ?? "");
  }, [activeHospital]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldError(null);

    const requiredError = validateRequired({
      "Hospital name": name,
      City: city,
      "Contact name": adminName,
      "Contact email": adminEmail,
      "Contact phone": adminPhone,
      "Program name": internshipProgramName,
      "Program coordinator": internshipCoordinator,
    });
    if (requiredError) {
      setFieldError(requiredError);
      show(requiredError, "error");
      return;
    }
    if (!isValidEmail(adminEmail)) {
      const message = "Enter a valid contact email address.";
      setFieldError(message);
      show(message, "error");
      return;
    }
    if (!isValidPhone(adminPhone)) {
      const message = "Enter a valid contact phone number.";
      setFieldError(message);
      show(message, "error");
      return;
    }
    if (internshipEmail.trim() && !isValidEmail(internshipEmail)) {
      const message = "Enter a valid internship program email.";
      setFieldError(message);
      show(message, "error");
      return;
    }
    if (internshipPhone.trim() && !isValidPhone(internshipPhone)) {
      const message = "Enter a valid internship program phone.";
      setFieldError(message);
      show(message, "error");
      return;
    }

    updateHospitalProfile({
      name: name.trim(),
      logo: logo.trim() || null,
      city: city.trim(),
      type,
      adminName: adminName.trim(),
      adminEmail: adminEmail.trim(),
      adminPhone: adminPhone.trim(),
      internshipProgramName: internshipProgramName.trim(),
      internshipCoordinator: internshipCoordinator.trim(),
      internshipEmail: internshipEmail.trim(),
      internshipPhone: internshipPhone.trim(),
      internshipOverview: internshipOverview.trim(),
    });
    if (activeHospital) {
      appendAudit({
        hospitalId: activeHospital.id,
        user: adminName.trim() || "Hospital Director",
        action: "Hospital profile updated",
        module: "Settings",
      });
    }
    show("Hospital profile saved.", "success");
  }

  return (
    <HospitalShell title="Hospital Profile">
      <div className="mx-auto max-w-2xl">
        <SettingsBackLink />
        <Panel>
          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            <div>
              <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy">
                Hospital Profile
              </h2>
              <p className="mt-1 text-sm text-mm-text-secondary">
                Update identity and internship program details for this
                hospital.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-gray-50 p-4">
              <HospitalLogo
                src={logo}
                name={name || "Hospital"}
                className="h-16 w-16 bg-mm-white"
                imgClassName="p-1.5"
              />
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-semibold text-mm-navy">
                  {name || "Hospital name"}
                </p>
                <p className="text-sm text-mm-text-secondary">
                  {city || "City"} · {type}
                </p>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Identity
              </h3>
              <Input
                label="Hospital name"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Logo"
                name="logo"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="/institutions/kfmc.png"
                hint="Path or URL to the hospital logo image."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-type"
                    className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
                  >
                    Hospital type
                  </label>
                  <select
                    id="profile-type"
                    className={selectClassName}
                    value={type}
                    onChange={(e) => setType(e.target.value as HospitalType)}
                  >
                    {HOSPITAL_TYPES.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="City"
                  name="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Contact information
              </h3>
              <Input
                label="Contact name"
                name="adminName"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Contact email"
                  name="adminEmail"
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
                <Input
                  label="Contact phone"
                  name="adminPhone"
                  required
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                Internship program information
              </h3>
              <Input
                label="Program name"
                name="internshipProgramName"
                required
                value={internshipProgramName}
                onChange={(e) => setInternshipProgramName(e.target.value)}
              />
              <Input
                label="Program coordinator"
                name="internshipCoordinator"
                required
                value={internshipCoordinator}
                onChange={(e) => setInternshipCoordinator(e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Program email"
                  name="internshipEmail"
                  type="email"
                  value={internshipEmail}
                  onChange={(e) => setInternshipEmail(e.target.value)}
                />
                <Input
                  label="Program phone"
                  name="internshipPhone"
                  value={internshipPhone}
                  onChange={(e) => setInternshipPhone(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="internship-overview"
                  className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
                >
                  Program overview
                </label>
                <textarea
                  id="internship-overview"
                  name="internshipOverview"
                  rows={4}
                  value={internshipOverview}
                  onChange={(e) => setInternshipOverview(e.target.value)}
                  className={selectClassName}
                  placeholder="Describe the internship program structure and focus."
                />
              </div>
            </section>

            {fieldError ? (
              <p
                className="text-[0.8125rem] font-medium text-mm-error-700"
                role="alert"
              >
                {fieldError}
              </p>
            ) : null}
            <ToastBanner toast={toast} onDismiss={clear} />
            <button type="submit" className={buttonPrimaryClass}>
              Save profile
            </button>
          </form>
        </Panel>
      </div>
    </HospitalShell>
  );
}
