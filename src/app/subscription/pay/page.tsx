"use client";

import { Suspense } from "react";
import SubscriptionPayClient from "./PayClient";
import { SubscriptionShell } from "@/components/subscription/SubscriptionShell";

export default function SubscriptionPayPage() {
  return (
    <Suspense
      fallback={
        <SubscriptionShell title="Annual Subscription">
          <p className="text-sm text-mm-text-muted">Loading…</p>
        </SubscriptionShell>
      }
    >
      <SubscriptionPayClient />
    </Suspense>
  );
}
