"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy field screen — Healthcare Field is now collected in Complete Your Account. */
export default function ProfessionRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/create-account");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-mm-bg px-4">
      <p className="text-sm text-mm-text-muted">Loading…</p>
    </div>
  );
}
