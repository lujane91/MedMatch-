"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Legacy pathway screen — Create Account now collects Journey Path in one page. */
export default function ApplyingForRedirectPage() {
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
