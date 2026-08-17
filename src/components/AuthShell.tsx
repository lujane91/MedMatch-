import Link from "next/link";
import { type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { Body, Caption } from "@/components/ui";

type AuthShellProps = {
  title: string;
  subtitle: string;
  panelTitle: string;
  panelBody: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  panelTitle,
  panelBody,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[44%] overflow-hidden bg-mm-navy lg:flex lg:flex-col lg:justify-between lg:p-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 70% 20%, rgba(31,166,160,0.35), transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08), transparent 35%)",
          }}
          aria-hidden
        />
        <Logo light href="/" />
        <div className="relative z-10 max-w-sm mm-animate-fade-up">
          <h1 className="font-[family-name:var(--mm-font-display)] text-4xl leading-tight tracking-[-0.02em] text-white">
            {panelTitle}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            {panelBody}
          </p>
        </div>
        <Caption className="relative z-10 text-white/40">
          Visual prototype · no real authentication
        </Caption>
      </div>

      <div className="flex flex-1 items-center justify-center bg-mm-bg px-4 py-10 sm:px-6 sm:py-12">
        <div className="w-full max-w-md mm-animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Logo href="/" />
          </div>
          <div className="rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface p-5 shadow-mm-sm sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-mm-navy">
              {title}
            </h2>
            <Body className="mt-2 text-[0.875rem]">{subtitle}</Body>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-center text-[0.875rem] text-mm-text-muted">
              {footer}
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/" className="mm-link justify-center">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
