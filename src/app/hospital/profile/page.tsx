"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { hospitalBaseFromPathname } from "@/lib/hospital-base-path";

export default function HospitalProfileRedirectPage() {
  const pathname = usePathname();
  const router = useRouter();
  const base = hospitalBaseFromPathname(pathname);

  useEffect(() => {
    router.replace(`${base}/settings/profile`);
  }, [base, router]);

  return null;
}
