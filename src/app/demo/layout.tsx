"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/lib/role-store";

/**
 * Temporary PUBLIC Demo Mode for Hospital Admin UI review.
 * Auto-sets hospital-admin role and keeps in-app links under `/demo/*`.
 * Does not alter `/hospital/*` auth or behavior.
 */
export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setRole } = useRoleStore();

  useEffect(() => {
    setRole("hospital-admin");
  }, [setRole]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const hrefAttr = anchor.getAttribute("href");
      if (!hrefAttr || !hrefAttr.startsWith("/hospital")) return;
      if (anchor.getAttribute("target") === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      event.preventDefault();
      const next = `/demo${hrefAttr.slice("/hospital".length)}`;
      router.push(next);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  return <>{children}</>;
}
