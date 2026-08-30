import { redirect } from "next/navigation";

/** Review step removed. Send leftover links to subscription payment. */
export default function OnboardingReviewRedirectPage() {
  redirect("/subscription/pay");
}
