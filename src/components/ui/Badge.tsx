import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeTone =
  | "teal"
  | "navy"
  | "success"
  | "warning"
  | "error"
  | "neutral";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
  children: ReactNode;
};

const toneStyles: Record<BadgeTone, string> = {
  teal: "bg-mm-teal-50 text-mm-teal-700",
  navy: "bg-mm-navy-50 text-mm-navy",
  success: "bg-mm-success-50 text-mm-success-700",
  warning: "bg-mm-warning-50 text-mm-warning-700",
  error: "bg-mm-error-50 text-mm-error-700",
  neutral: "bg-mm-gray-100 text-mm-gray-700",
};

export function Badge({
  className,
  tone = "neutral",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-semibold leading-none",
        toneStyles[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
