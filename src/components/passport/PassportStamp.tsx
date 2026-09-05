"use client";

import { cn } from "@/lib/cn";
import {
  categoryLabel,
  type PassportStampRecord,
  type StampCategory,
} from "@/data/passport-stamps";

const categoryStyles: Record<
  StampCategory,
  { ring: string; fill: string; mark: string }
> = {
  training: {
    ring: "border-mm-teal",
    fill: "bg-[rgba(31,166,160,0.08)]",
    mark: "text-mm-teal-700",
  },
  research: {
    ring: "border-mm-navy",
    fill: "bg-mm-navy-50",
    mark: "text-mm-navy",
  },
  conference: {
    ring: "border-[#1f5a84]",
    fill: "bg-[#e8eef4]",
    mark: "text-[#1f5a84]",
  },
  milestone: {
    ring: "border-mm-teal-700",
    fill: "bg-mm-teal-50",
    mark: "text-mm-teal-700",
  },
};

const rotations = ["-6deg", "4deg", "-2deg", "7deg", "-8deg", "3deg"];

export function PassportStamp({
  stamp,
  index,
  onSelect,
}: {
  stamp: PassportStampRecord;
  index: number;
  onSelect: (stamp: PassportStampRecord) => void;
}) {
  const style = categoryStyles[stamp.category];
  const rotation = rotations[index % rotations.length];
  const size = stamp.prominent
    ? "h-[7.25rem] w-[7.25rem] sm:h-32 sm:w-32"
    : "h-[6.25rem] w-[6.25rem] sm:h-[7rem] sm:w-[7rem]";
  const shape =
    stamp.category === "milestone"
      ? "rounded-[1.75rem]"
      : stamp.category === "research"
        ? "rounded-[1.1rem]"
        : stamp.category === "conference"
          ? "rounded-[40%]"
          : "rounded-full";

  return (
    <button
      type="button"
      onClick={() => onSelect(stamp)}
      aria-label={`${stamp.title}. ${categoryLabel(stamp.category)}`}
      className={cn(
        "group relative flex shrink-0 touch-manipulation items-center justify-center border-[3px] p-2 text-center transition-transform duration-200",
        "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mm-teal focus-visible:ring-offset-2",
        size,
        shape,
        style.ring,
        style.fill,
      )}
      style={{ transform: `rotate(${rotation})` }}
    >
      <span className="flex h-full w-full flex-col items-center justify-center rounded-[inherit] border border-dashed border-current/20 px-2">
        <span
          className={cn(
            "text-[0.5625rem] font-semibold uppercase tracking-[0.12em]",
            style.mark,
          )}
        >
          {categoryLabel(stamp.category)}
        </span>
        <span className="mt-1 text-[0.6875rem] font-semibold leading-snug text-mm-navy sm:text-[0.75rem]">
          {stamp.title}
        </span>
        <span className="mt-1 text-[0.5625rem] text-mm-text-muted">
          {stamp.date}
        </span>
      </span>
    </button>
  );
}
