import { redirect } from "next/navigation";

/** Legacy demo programs URL → Demo Hospital Dashboard. */
export default function DemoProgramsRedirectPage() {
  redirect("/demo");
}
