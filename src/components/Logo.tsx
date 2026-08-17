import Link from "next/link";
import { Stethoscope } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type LogoProps = {
  href?: string;
  light?: boolean;
  className?: string;
};

export function Logo({ href = "/", light = false, className = "" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 transition-transform duration-[var(--mm-duration)] hover:-translate-y-px",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-[var(--mm-radius-md)] transition-shadow duration-[var(--mm-duration)]",
          light
            ? "bg-mm-teal/20 text-mm-teal"
            : "bg-mm-teal text-white shadow-mm-teal group-hover:shadow-[0_10px_24px_rgba(31,166,160,0.32)]",
        )}
      >
        <Stethoscope className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </span>
      <span
        className={cn(
          "font-display text-[1.25rem] leading-none tracking-tight",
          light ? "text-white" : "text-mm-navy",
        )}
      >
        Med<span className="text-mm-teal">Journey</span>
      </span>
    </Link>
  );
}
