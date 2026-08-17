"use client";

import Link from "next/link";
import { useDemoMode } from "@/components/demo/DemoModeProvider";
import { DemoActionTrigger } from "@/components/demo/DemoActionTrigger";
import { Bookmark } from "@/components/ui/icons";

export function SaveFiltersButton() {
  return (
    <DemoActionTrigger
      kind="bookmark"
      label="Save current filters"
      doneLabel="Filters saved"
      title="Search bookmarked"
      detail="Your current filters are saved for a quick return during this demo."
      stickyConfirm
      className="text-[0.875rem] font-semibold text-mm-teal transition-colors hover:text-mm-teal-700"
    />
  );
}

export function BookmarkCtaButton() {
  const { showDemo } = useDemoMode();

  return (
    <Link
      href="/saved"
      onClick={() =>
        showDemo("bookmark", {
          title: "Bookmarks ready",
          detail: "Open your shortlist anytime from Saved.",
        })
      }
      className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-[var(--mm-radius-lg)] bg-white px-5 text-[0.875rem] font-semibold text-mm-navy transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-gray-50"
    >
      <Bookmark size={16} strokeWidth={1.75} />
      Open saved
    </Link>
  );
}
