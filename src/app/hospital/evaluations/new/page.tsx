import { Suspense } from "react";
import { HospitalShell } from "@/components/hospital/HospitalShell";
import { Panel } from "@/components/hospital/hospital-ui";
import { NewEvaluationClient } from "./NewEvaluationClient";

export default function NewHospitalEvaluationPage() {
  return (
    <Suspense
      fallback={
        <HospitalShell title="Evaluate Student">
          <Panel>
            <p className="text-sm text-mm-text-secondary">Loading form…</p>
          </Panel>
        </HospitalShell>
      }
    >
      <NewEvaluationClient />
    </Suspense>
  );
}
