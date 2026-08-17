import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardVariant = "default" | "interactive";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
};

const variantStyles: Record<CardVariant, string> = {
  default: "bg-mm-surface border border-mm-border shadow-mm-sm",
  interactive:
    "bg-mm-surface border border-mm-border shadow-mm-sm hover:-translate-y-0.5 hover:border-mm-teal/25 hover:shadow-mm-md cursor-pointer",
};

export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--mm-radius-xl)] transition-[transform,box-shadow,border-color] duration-[var(--mm-duration)] ease-[var(--mm-ease-out)]",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
