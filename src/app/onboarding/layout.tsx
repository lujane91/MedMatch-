import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get started | MedJourney",
  description: "Set up your MedJourney profile and discover training matches.",
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
