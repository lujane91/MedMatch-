"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Input } from "@/components/ui/Input";
import {
  buttonPrimaryClass,
  selectClassName,
} from "@/components/hospital/hospital-ui";
import { type HospitalType } from "@/data/hospital-demo";
import {
  isValidEmail,
  isValidPhone,
  validateRequired,
} from "@/lib/hospital-form";
import { useHospitalStore } from "@/lib/hospital-store";
import { useRoleStore } from "@/lib/role-store";

const HOSPITAL_TYPES: HospitalType[] = ["Government", "University", "Private"];

export default function HospitalOnboardingPage() {
  const router = useRouter();
  const { activeHospital, updateHospitalProfile } = useHospitalStore();
  const { setRole } = useRoleStore();

  const [name, setName] = useState(activeHospital?.name ?? "");
  const [logo, setLogo] = useState(activeHospital?.logo ?? "");
  const [city, setCity] = useState(activeHospital?.city ?? "");
  const [type, setType] = useState<HospitalType>(
    activeHospital?.type ?? "Government",
  );
  const [adminName, setAdminName] = useState(activeHospital?.adminName ?? "");
  const [adminEmail, setAdminEmail] = useState(
    activeHospital?.adminEmail ?? "",
  );
  const [adminPhone, setAdminPhone] = useState(
    activeHospital?.adminPhone ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const requiredError = validateRequired({
      "Hospital name": name,
      City: city,
      "Admin name": adminName,
      "Admin email": adminEmail,
      "Admin phone": adminPhone,
    });
    if (requiredError) {
      setError(requiredError);
      return;
    }
    if (!isValidEmail(adminEmail)) {
      setError("Enter a valid admin email address.");
      return;
    }
    if (!isValidPhone(adminPhone)) {
      setError("Enter a valid admin phone number.");
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
    });
    setRole("hospital-admin");
    router.push("/hospital");
  }

  return (
    <div className="min-h-screen bg-mm-bg">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Logo href="/" />
          <span className="rounded-full border border-mm-teal/25 bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal-700">
            Hospital admin
          </span>
        </div>

        <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-6 shadow-mm-md sm:p-8 mm-fade-in">
          <div className="mb-6 flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal text-white shadow-mm-teal">
              <Building2 size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-mm-navy sm:text-3xl">
                Set up your hospital
              </h1>
              <p className="mt-1 text-sm text-mm-text-secondary">
                Confirm your institution profile to open the MedJourney hospital
                console.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <Input
              label="Hospital name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="King Fahad Medical City"
            />
            <Input
              label="Logo URL"
              name="logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              placeholder="/institutions/kfmc.png"
              hint="Paste a public image URL or local path"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="City"
                name="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Riyadh"
              />
              <div className="w-full">
                <label
                  htmlFor="type"
                  className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
                >
                  Hospital type
                </label>
                <select
                  id="type"
                  name="type"
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
            </div>
            <Input
              label="Admin name"
              name="adminName"
              required
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Admin email"
                name="adminEmail"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
              <Input
                label="Admin phone"
                name="adminPhone"
                required
                value={adminPhone}
                onChange={(e) => setAdminPhone(e.target.value)}
              />
            </div>
            {error ? (
              <p className="text-[0.8125rem] font-medium text-mm-error-700" role="alert">
                {error}
              </p>
            ) : null}
            <button type="submit" className={`${buttonPrimaryClass} w-full`}>
              Continue to dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
