"use client";

import { GraduationCap } from "lucide-react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { Panel } from "@/components/hospital/hospital-ui";

export default function HospitalResidencyComingSoonPage() {
  return (
    <HospitalShell title="Residency">
      <div className="mx-auto max-w-2xl">
        <Panel>
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-gray-100 text-mm-text-muted">
              <GraduationCap size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[0.9375rem] font-semibold text-mm-navy">
                  Residency
                </h2>
                <span className="rounded-full border border-mm-border bg-mm-white px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                  Coming Soon
                </span>
              </div>
              <p className="mt-2 text-sm text-mm-text-secondary">
                Residency program management is not available in this prototype
                yet. Internship workflows remain fully accessible from the
                Hospital Dashboard.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </HospitalShell>
  );
}
