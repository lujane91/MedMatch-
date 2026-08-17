"use client";

import { useState, type ReactNode } from "react";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type DemoActionButtonProps = {
  label: string;
  doneLabel?: string;
  className?: string;
  icon?: ReactNode;
  doneIcon?: ReactNode;
};

/** Prototype action control that acknowledges the click without a backend. */
export function DemoActionButton({
  label,
  doneLabel = "Saved for demo",
  className,
  icon,
  doneIcon,
}: DemoActionButtonProps) {
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setDone(true);
        window.setTimeout(() => setDone(false), 1600);
      }}
      className={cn(className)}
    >
      {done ? (doneIcon ?? <Check size={14} strokeWidth={2} />) : icon}
      {done ? doneLabel : label}
    </button>
  );
}
