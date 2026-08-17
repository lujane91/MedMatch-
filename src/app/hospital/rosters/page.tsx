import { redirect } from "next/navigation";

/** Legacy roster URL → Rotations month view. */
export default function HospitalRostersRedirectPage() {
  redirect("/hospital/rotations");
}
