import { type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextOwnProps = {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
};

type TextProps = TextOwnProps &
  Omit<HTMLAttributes<HTMLElement>, keyof TextOwnProps>;

/** Section heading within a page */
export function SectionTitle({
  as: Comp = "h2",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "font-semibold text-[length:var(--mm-text-section)] leading-[var(--mm-leading-title)] tracking-[var(--mm-tracking-title)] text-mm-navy",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Card / block title */
export function CardTitle({
  as: Comp = "h3",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-mm-navy break-words",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Primary body copy */
export function Body({
  as: Comp = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "text-[length:var(--mm-text-body)] leading-[var(--mm-leading-body)] text-mm-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Small supporting text */
export function Caption({
  as: Comp = "p",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "text-[length:var(--mm-text-caption)] leading-[var(--mm-leading-caption)] text-mm-text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Uppercase micro label / eyebrow */
export function Label({
  as: Comp = "span",
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        "text-[length:var(--mm-text-label)] font-semibold uppercase tracking-[var(--mm-tracking-label)] text-mm-teal",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
