"use client";

import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import PassportPageClient from "@/components/passport/PassportPageClient";

export default function PassportPage() {
  return (
    <AppShell title="Passport">
      <Suspense fallback={<p className="text-mm-text-muted">Loading…</p>}>
        <PassportPageClient />
      </Suspense>
    </AppShell>
  );
}
