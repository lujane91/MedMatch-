import { redirect } from "next/navigation";

/** Internship entry → existing Internship Dashboard. */
export default function HospitalInternshipEntryPage() {
  redirect("/hospital/dashboard");
}
