"use client";

import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import {
  useDemoMode,
  type DemoActionKind,
} from "@/components/demo/DemoModeProvider";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type DemoActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind: DemoActionKind;
  label: ReactNode;
  doneLabel?: ReactNode;
  icon?: ReactNode;
  doneIcon?: ReactNode;
  detail?: string;
  title?: string;
  /** Keep local confirmed look after the overlay/toast. */
  stickyConfirm?: boolean;
};

/**
 * Button that triggers Demo Mode success feedback for investor walkthroughs.
 */
export function DemoActionTrigger({
  kind,
  label,
  doneLabel,
  icon,
  doneIcon,
  detail,
  title,
  stickyConfirm = true,
  className,
  onClick,
  ...props
}: DemoActionButtonProps) {
  const { showDemo } = useDemoMode();
  const [confirmed, setConfirmed] = useState(false);

  const defaultDone =
    kind === "apply"
      ? "Applied"
      : kind === "save" || kind === "bookmark"
        ? "Saved"
        : kind === "uploadCv"
          ? "Uploaded"
          : kind === "completeProfile"
            ? "Completed"
            : "Done";

  return (
    <button
      type="button"
      {...props}
      className={cn(className, confirmed && "demo-action-confirmed")}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        showDemo(kind, { title, detail });
        if (stickyConfirm) setConfirmed(true);
      }}
    >
      {confirmed ? (doneIcon !== undefined ? doneIcon : <Check size={16} strokeWidth={1.75} />) : icon}
      {confirmed ? (doneLabel ?? defaultDone) : label}
    </button>
  );
}
