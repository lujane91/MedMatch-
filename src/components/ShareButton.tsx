"use client";

import { useState } from "react";
import { Share2, Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type ShareButtonProps = {
  label?: string;
  className?: string;
  url?: string;
};

/** Visual-prototype share control that copies the current page URL. */
export function ShareButton({
  label = "Share",
  className,
  url,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const target =
      url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(target);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }
  };

  return (
    <button
      type="button"
      onClick={onShare}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-4 text-[0.875rem] font-semibold text-mm-navy transition-colors hover:bg-mm-gray-50",
        className,
      )}
    >
      {copied ? (
        <Check size={16} strokeWidth={1.75} className="text-mm-teal" />
      ) : (
        <Share2 size={16} strokeWidth={1.75} />
      )}
      {copied ? "Link copied" : label}
    </button>
  );
}
