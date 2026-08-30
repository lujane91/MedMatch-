"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck } from "@/components/ui/icons";
import { PassportStamp } from "@/components/passport/PassportStamp";
import { StampDetailSheet } from "@/components/passport/StampDetailSheet";
import {
  fieldLabel,
  professionalLevelLabel,
  trainingStageLabel,
  type InternProfile,
} from "@/data/intern";
import {
  getPassportStamps,
  type PassportStampRecord,
} from "@/data/passport-stamps";
import { cn } from "@/lib/cn";

function initialsFromName(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "MJ"
  );
}

export function MedJourneyPassport({
  profile,
  empty = false,
  welcome = false,
  className,
}: {
  profile: InternProfile;
  empty?: boolean;
  welcome?: boolean;
  className?: string;
}) {
  const [selected, setSelected] = useState<PassportStampRecord | null>(null);
  const stamps = useMemo(
    () => getPassportStamps(profile, { empty }),
    [empty, profile],
  );

  const name = profile.fullName.trim() || "MedJourney Member";
  const stage = trainingStageLabel(profile.trainingStage);
  const field = fieldLabel(profile.field);
  const level = professionalLevelLabel(profile.professionalLevel);
  const specialty = profile.specialty?.trim() || "";
  const stageLine =
    profile.trainingStage === "medical-practice" && level
      ? `${level} · ${field}`
      : [stage, field].filter(Boolean).join(" · ");

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <section className="overflow-hidden rounded-[var(--mm-radius-xl)] border border-mm-border bg-mm-surface shadow-mm-sm">
        <div
          className="h-24 sm:h-28"
          style={{
            background:
              "linear-gradient(135deg, #0E3A5D 0%, #16486F 55%, #1FA6A0 100%)",
          }}
        />
        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-10 flex items-end gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.25rem] border-[4px] border-mm-white bg-mm-navy text-[1.25rem] font-semibold text-white shadow-mm-sm sm:h-24 sm:w-24 sm:text-[1.375rem]">
              {initialsFromName(name)}
            </div>
            <div className="min-w-0 pb-1">
              {profile.identityVerified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-mm-teal-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-mm-teal-700">
                  <BadgeCheck size={12} strokeWidth={2} />
                  Verified
                </span>
              ) : null}
              <h1 className="mt-2 font-[family-name:var(--mm-font-display)] text-[clamp(1.5rem,4vw,2rem)] leading-[1.15] tracking-[-0.02em] text-mm-navy">
                {name}
              </h1>
              <p className="mt-1 text-[0.9375rem] text-mm-text-secondary">
                {stageLine}
              </p>
              {specialty &&
              (profile.trainingStage === "resident" ||
                profile.trainingStage === "fellow" ||
                profile.trainingStage === "advanced-training" ||
                profile.trainingStage === "medical-practice") ? (
                <p className="mt-0.5 text-[0.875rem] text-mm-text-muted">
                  {specialty}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-[var(--mm-radius-xl)] border border-mm-border bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 shadow-mm-sm sm:p-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-mm-teal">
              My Journey
            </p>
            <h2 className="mt-2 font-[family-name:var(--mm-font-display)] text-[1.375rem] tracking-[-0.02em] text-mm-navy">
              Accomplishment stamps
            </h2>
          </div>
        </div>

        {stamps.length === 0 ? (
          <div className="mt-8 rounded-[var(--mm-radius-xl)] border border-dashed border-mm-border bg-mm-surface px-5 py-10 text-center">
            <p className="font-[family-name:var(--mm-font-display)] text-[1.5rem] text-mm-navy">
              Your journey starts here.
            </p>
            <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-mm-text-secondary">
              Your verified accomplishments will appear in your Passport as your
              journey grows.
            </p>
            {welcome ? (
              <Link
                href="/dashboard"
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[var(--mm-radius-lg)] bg-mm-teal px-5 text-[0.875rem] font-semibold text-white shadow-mm-teal"
              >
                Start Your Journey
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap content-start items-start justify-center gap-4 sm:gap-5">
            {stamps.map((item, index) => (
              <PassportStamp
                key={item.id}
                stamp={item}
                index={index}
                onSelect={setSelected}
              />
            ))}
          </div>
        )}
      </section>

      {selected ? (
        <StampDetailSheet stamp={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
