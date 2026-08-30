"use client";

import { X } from "@/components/ui/icons";
import {
  categoryLabel,
  type PassportStampRecord,
} from "@/data/passport-stamps";

export function StampDetailSheet({
  stamp,
  onClose,
}: {
  stamp: PassportStampRecord;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-mm-navy/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stamp-detail-title"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full overflow-y-auto rounded-t-[1.5rem] border border-mm-border bg-mm-surface p-5 shadow-mm-md sm:max-w-md sm:rounded-[var(--mm-radius-xl)] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-mm-teal">
              {categoryLabel(stamp.category)}
            </p>
            <h2
              id="stamp-detail-title"
              className="mt-2 font-[family-name:var(--mm-font-display)] text-[1.5rem] tracking-[-0.02em] text-mm-navy"
            >
              {stamp.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-mm-border text-mm-navy"
            aria-label="Close"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <dl className="mt-5 space-y-3 border-t border-mm-border pt-5">
          {(stamp.detailLines.length > 0
            ? stamp.detailLines
            : [
                { label: "Institution", value: stamp.institution },
                { label: "Date", value: stamp.date },
                {
                  label: "Verified status",
                  value: stamp.verificationStatus,
                },
                { label: "Verified by", value: stamp.verifiedBy },
              ]
          ).map((line) => (
            <div key={`${line.label}-${line.value}`}>
              <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-mm-text-muted">
                {line.label}
              </dt>
              <dd className="mt-1 text-[0.9375rem] text-mm-navy">{line.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 text-[0.75rem] text-mm-text-muted">
          Demo stamp. Verified stamps are issued by institutions, not by users.
        </p>
      </div>
    </div>
  );
}
