"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { MonthNavigator } from "@/components/hospital/MonthNavigator";
import { RotationBreadcrumbs } from "@/components/hospital/RotationBreadcrumbs";
import {
  EmptyState,
  PageIntro,
  specialtyName,
} from "@/components/hospital/hospital-ui";
import {
  countPendingEvaluations,
  countSubmittedDocuments,
  expandSpecialtyRotationInterns,
} from "@/data/rotation-workflow";
import {
  DEMO_SPECIALTIES,
  getApplicationsForHospital,
  isAcceptedStatus,
  type SpecialtyId,
} from "@/data/hospital-demo";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";
import { selectedPeriodLabel } from "@/lib/hospital-month";
import { useEvaluationStore } from "@/lib/evaluation-store";
import { useHospitalMonth } from "@/lib/hospital-month-store";
import { useHospitalStore } from "@/lib/hospital-store";

export default function HospitalRotationsMonthPage() {
  const pathname = usePathname();
  const base = hospitalBaseFromPathname(pathname);
  const { activeHospitalId, applications, activeSpecialties } =
    useHospitalStore();
  const { getForApplication } = useEvaluationStore();
  const { selectedMonth, year } = useHospitalMonth();
  const period = selectedPeriodLabel(selectedMonth, year, false);

  const specialtyCatalog =
    activeSpecialties.length > 0
      ? activeSpecialties
      : DEMO_SPECIALTIES.map((specialty) => ({
          ...specialty,
          hospitalId: activeHospitalId,
          active: true,
        }));

  const specialtyCards = useMemo(() => {
    const accepted = getApplicationsForHospital(
      activeHospitalId,
      applications,
    ).filter(
      (app) => isAcceptedStatus(app.status) && app.month === selectedMonth,
    );

    return specialtyCatalog
      .filter((specialty) => specialty.active)
      .map((specialty) => {
        const specialtyId = specialty.id as SpecialtyId;
        const existing = accepted.filter(
          (app) => app.specialtyId === specialtyId,
        );
        const interns = expandSpecialtyRotationInterns(existing, {
          hospitalId: activeHospitalId,
          specialtyId,
          month: selectedMonth,
          year,
        });
        const locked = interns.filter(
          (app) => getForApplication(app.id)?.locked,
        ).length;
        const pendingEvals = countPendingEvaluations(interns.length, locked);
        const submissions = countSubmittedDocuments(
          interns.map((app) => app.id),
        );
        return {
          specialtyId,
          name: specialty.name || specialtyName(specialtyId),
          internCount: interns.length,
          pendingEvals,
          submissions,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    activeHospitalId,
    applications,
    getForApplication,
    selectedMonth,
    specialtyCatalog,
    year,
  ]);

  return (
    <HospitalShell title="Rotations">
      <RotationBreadcrumbs
        items={[
          { label: "Rotations", href: `${base}/rotations` },
          { label: period },
        ]}
      />

      <PageIntro>
        Select a specialty to review confirmed interns for {period}.
      </PageIntro>

      <MonthNavigator className="mb-6" />

      {specialtyCards.length === 0 ? (
        <EmptyState
          title={`No confirmed rotations for ${period}`}
          description="Specialties with accepted interns in this month will appear here."
        />
      ) : (
        <div className="space-y-3">
          {specialtyCards.map((card) => (
            <Link
              key={card.specialtyId}
              href={`${base}/rotations/${card.specialtyId}`}
              className="group flex items-center justify-between gap-4 rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface px-4 py-4 shadow-mm-sm transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-mm-teal/35 hover:shadow-mm-md sm:px-5"
            >
              <div className="min-w-0">
                <h3 className="font-semibold text-mm-navy">{card.name}</h3>
                <p className="mt-1 text-sm text-mm-text-secondary">
                  {card.internCount} intern{card.internCount === 1 ? "" : "s"} ·{" "}
                  {card.pendingEvals} evaluation
                  {card.pendingEvals === 1 ? "" : "s"} pending ·{" "}
                  {card.submissions} submission
                  {card.submissions === 1 ? "" : "s"}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="shrink-0 text-mm-teal-700 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      )}
    </HospitalShell>
  );
}
