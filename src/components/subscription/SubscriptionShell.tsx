import Link from "next/link";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function SubscriptionShell({
  title,
  subtitle,
  children,
  backHref,
  backLabel = "Back",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-mm-bg">
      <header className="border-b border-mm-border/80 bg-mm-bg/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4 sm:px-6">
          <Logo href="/" />
          {backHref ? (
            <Link
              href={backHref}
              className="text-sm font-semibold text-mm-teal-700 transition-colors hover:text-mm-teal"
            >
              {backLabel}
            </Link>
          ) : null}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="font-[family-name:var(--mm-font-display)] text-[clamp(1.75rem,4vw,2.25rem)] leading-tight tracking-[-0.03em] text-mm-navy">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-[1rem] leading-relaxed text-mm-text-secondary">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-8 flex-1">{children}</div>
      </main>
    </div>
  );
}

export const subscriptionPrimaryButtonClass =
  "inline-flex min-h-12 w-full items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.9375rem] font-semibold text-white shadow-mm-teal transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-teal-700 disabled:cursor-not-allowed disabled:opacity-60";

export const subscriptionSecondaryButtonClass =
  "inline-flex min-h-11 w-full items-center justify-center rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white px-5 text-[0.875rem] font-semibold text-mm-navy transition-[transform,background] duration-[var(--mm-duration)] hover:-translate-y-px hover:bg-mm-gray-50";
