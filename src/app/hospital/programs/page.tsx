import { redirect } from "next/navigation";

/** Legacy program-selection URL → Hospital Dashboard. */
export default function HospitalProgramsRedirectPage() {
  redirect("/hospital");
}
