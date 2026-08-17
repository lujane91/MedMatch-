"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useDemoMode,
  type DemoActionKind,
} from "@/components/demo/DemoModeProvider";
import { demoCopy } from "@/components/demo/demoCopy";
import {
  Bookmark,
  Check,
  FileText,
  Sparkles,
  UserRound,
  X,
} from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import "./demo.css";

export function DemoFeedbackHost() {
  const { active, dismiss } = useDemoMode();
  if (!active) return null;

  const copy = demoCopy[active.kind];
  const title = active.title ?? copy.title;
  const detail = active.detail ?? copy.detail;

  if (copy.mode === "toast") {
    return (
      <DemoToast
        key={active.id}
        kind={active.kind}
        title={title}
        detail={detail}
        onDismiss={dismiss}
      />
    );
  }

  return (
    <DemoModal
      key={active.id}
      kind={active.kind}
      title={title}
      detail={detail}
      ctaLabel={copy.ctaLabel}
      ctaHref={copy.ctaHref}
      onDismiss={dismiss}
    />
  );
}

function DemoModal({
  kind,
  title,
  detail,
  ctaLabel,
  ctaHref,
  onDismiss,
}: {
  kind: DemoActionKind;
  title: string;
  detail: string;
  ctaLabel?: string;
  ctaHref?: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onDismiss]);

  return (
    <div className="demo-overlay" role="presentation">
      <button
        type="button"
        className={cn("demo-backdrop", visible && "demo-backdrop-visible")}
        aria-label="Dismiss"
        onClick={onDismiss}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-success-title"
        className={cn("demo-modal", visible && "demo-modal-visible")}
      >
        <div className="demo-modal-glow" aria-hidden />
        <button
          type="button"
          onClick={onDismiss}
          className="demo-modal-close"
          aria-label="Close"
        >
          <X size={16} strokeWidth={1.75} />
        </button>

        <SuccessMark kind={kind} large />

        <p className="demo-eyebrow">Demo confirmation</p>
        <h2 id="demo-success-title" className="demo-modal-title">
          {title}
        </h2>
        <p className="demo-modal-detail">{detail}</p>

        {kind === "uploadCv" ? <UploadProgress /> : null}

        <div className="demo-modal-actions">
          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} onClick={onDismiss} className="demo-btn-primary">
              {ctaLabel}
            </Link>
          ) : null}
          <button type="button" onClick={onDismiss} className="demo-btn-secondary">
            Continue exploring
          </button>
        </div>
      </div>
    </div>
  );
}

function DemoToast({
  kind,
  title,
  detail,
  onDismiss,
}: {
  kind: DemoActionKind;
  title: string;
  detail: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    const timer = window.setTimeout(onDismiss, 3200);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [onDismiss]);

  return (
    <div
      className={cn("demo-toast", visible && "demo-toast-visible")}
      role="status"
      aria-live="polite"
    >
      <SuccessMark kind={kind} />
      <div className="min-w-0 flex-1">
        <p className="text-[0.9375rem] font-semibold text-mm-navy">{title}</p>
        <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-mm-text-secondary">
          {detail}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="demo-toast-close"
        aria-label="Dismiss"
      >
        <X size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}

function SuccessMark({
  kind,
  large = false,
}: {
  kind: DemoActionKind;
  large?: boolean;
}) {
  const Icon =
    kind === "save" || kind === "bookmark"
      ? Bookmark
      : kind === "uploadCv"
        ? FileText
        : kind === "completeProfile"
          ? UserRound
          : kind === "apply"
            ? Sparkles
            : Check;

  return (
    <div
      className={cn("demo-mark", large && "demo-mark-lg")}
      aria-hidden
    >
      <span className="demo-mark-ring" />
      <span className="demo-mark-burst" />
      <span className="demo-mark-core">
        <Icon
          size={large ? 28 : 18}
          strokeWidth={1.75}
          className={
            kind === "save" || kind === "bookmark" ? "fill-white text-white" : ""
          }
        />
      </span>
      <svg className="demo-check-svg" viewBox="0 0 48 48" aria-hidden>
        <circle className="demo-check-circle" cx="24" cy="24" r="20" />
        <path
          className="demo-check-path"
          d="M14 24.5 L21 31.5 L34 16.5"
          fill="none"
        />
      </svg>
    </div>
  );
}

function UploadProgress() {
  return (
    <div className="demo-upload-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-[var(--mm-radius-md)] bg-mm-navy text-white">
          <FileText size={16} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[0.875rem] font-semibold text-mm-navy">
            Amina_Hassan_CV.pdf
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mm-gray-100">
            <div className="demo-upload-bar h-full rounded-full bg-mm-teal" />
          </div>
        </div>
        <span className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-mm-teal">
          <Check size={12} strokeWidth={2.5} />
          Done
        </span>
      </div>
    </div>
  );
}
