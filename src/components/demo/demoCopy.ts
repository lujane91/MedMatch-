import type { DemoActionKind } from "@/components/demo/DemoModeProvider";

export type DemoCopy = {
  title: string;
  detail: string;
  ctaLabel?: string;
  ctaHref?: string;
  mode: "modal" | "toast";
};

export const demoCopy: Record<DemoActionKind, DemoCopy> = {
  apply: {
    title: "Application submitted",
    detail:
      "Your MedJourney profile and documents were attached. The hospital team will review your application shortly.",
    ctaLabel: "View applications",
    ctaHref: "/applications",
    mode: "modal",
  },
  save: {
    title: "Saved to bookmarks",
    detail: "You can revisit this opportunity anytime from Saved.",
    mode: "toast",
  },
  bookmark: {
    title: "Bookmarked",
    detail: "Added to your shortlist for later comparison.",
    mode: "toast",
  },
  completeProfile: {
    title: "Profile looking strong",
    detail:
      "Your preferences are updated. MedJourney will refine matches using your specialty, city, and training goals.",
    ctaLabel: "View profile",
    ctaHref: "/profile",
    mode: "modal",
  },
  uploadCv: {
    title: "CV uploaded",
    detail:
      "Amina_Hassan_CV.pdf is ready. Key experience will prefill your MedJourney profile.",
    mode: "modal",
  },
};
