"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Award,
  GraduationCap,
  Stethoscope,
} from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { Panel } from "@/components/hospital/hospital-ui";
import {
  getApplicationsForHospital,
  isAcceptedStatus,
  toDisplayStatus,
} from "@/data/hospital-demo";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalDashboardHomePage() {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const { activeHospitalId, activeHospital, applications } =
    useHospitalStore();

  const metrics = useMemo(() => {
    const apps = getApplicationsForHospital(activeHospitalId, applications);
    const pendingApplications = apps.filter(
      (app) => toDisplayStatus(app.status) === "Pending",
    ).length;
    const activeStudents = apps.filter((app) =>
      isAcceptedStatus(app.status),
    ).length;
    const activeRotations = activeStudents;
    return { activeStudents, pendingApplications, activeRotations };
  }, [activeHospitalId, applications]);

  return (
    <HospitalShell showHospitalIdentity>
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-mm-navy sm:text-2xl">
            Hospital Dashboard
          </h2>
          <p className="mt-1 text-sm text-mm-text-secondary">
            {activeHospital?.city ?? "—"} • {activeHospital?.type ?? "—"}
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-teal text-white shadow-mm-teal">
                  <Stethoscope size={18} strokeWidth={1.75} aria-hidden />
                </span>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                    Internship
                  </h3>
                  <p className="text-[0.75rem] text-mm-text-muted">
                    Active program
                  </p>
                </div>
              </div>
            </div>

            <dl className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-3 border-b border-mm-border pb-3">
                <dt className="text-sm text-mm-text-secondary">
                  Active Students
                </dt>
                <dd className="font-display text-xl font-semibold text-mm-navy">
                  {metrics.activeStudents}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-b border-mm-border pb-3">
                <dt className="text-sm text-mm-text-secondary">
                  Pending Applications
                </dt>
                <dd className="font-display text-xl font-semibold text-mm-navy">
                  {metrics.pendingApplications}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-sm text-mm-text-secondary">
                  Active Rotations
                </dt>
                <dd className="font-display text-xl font-semibold text-mm-navy">
                  {metrics.activeRotations}
                </dd>
              </div>
            </dl>

            <Link
              href={`${base}/dashboard`}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-mm-teal-700 transition-colors hover:text-mm-teal"
            >
              Open Internship
              <ArrowRight size={16} aria-hidden />
            </Link>
          </Panel>

          <Panel className="relative flex flex-col bg-mm-gray-50/80">
            <span className="absolute right-4 top-4 rounded-full border border-mm-border bg-mm-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              Coming Soon
            </span>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-100 text-mm-text-muted">
                <GraduationCap size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                  Residency
                </h3>
                <p className="text-[0.75rem] text-mm-text-muted">
                  Not available yet
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mm-text-muted">
              Coming Soon
            </p>
          </Panel>

          <Panel className="relative flex flex-col bg-mm-gray-50/80">
            <span className="absolute right-4 top-4 rounded-full border border-mm-border bg-mm-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
              Coming Soon
            </span>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-100 text-mm-text-muted">
                <Award size={18} strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <h3 className="text-[0.9375rem] font-semibold text-mm-navy">
                  Fellowship
                </h3>
                <p className="text-[0.75rem] text-mm-text-muted">
                  Not available yet
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-mm-text-muted">
              Coming Soon
            </p>
          </Panel>
        </div>
      </div>
    </HospitalShell>
  );
}
