"use client";

import { type ReactNode, useState } from "react";
import { Check } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type Option = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  mark?: string;
  icon?: ReactNode;
};

type SelectCardsProps = {
  options: Option[];
  multiple?: boolean;
  columns?: 1 | 2 | 3;
  defaultSelected?: string[];
};

export function SelectCards({
  options,
  multiple = false,
  columns = 1,
  defaultSelected = [],
}: SelectCardsProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (multiple) {
        return prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      }
      return prev[0] === id ? [] : [id];
    });
  };

  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
      )}
    >
      {options.map((option) => {
        const active = selected.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => toggle(option.id)}
            className={cn(
              "rounded-[var(--mm-radius-xl)] border p-4 text-left transition-[transform,border-color,box-shadow,background] duration-[var(--mm-duration)] ease-[var(--mm-ease-out)] sm:p-5",
              active
                ? "border-mm-teal bg-mm-teal-50/60 shadow-mm-sm"
                : "border-mm-border bg-mm-surface hover:-translate-y-0.5 hover:border-mm-gray-300 hover:shadow-mm-sm",
            )}
          >
            <div className="flex items-start gap-3">
              {option.mark ? (
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)] text-[0.6875rem] font-bold",
                    active
                      ? "bg-mm-teal text-white"
                      : "bg-mm-navy text-white",
                  )}
                >
                  {option.mark}
                </span>
              ) : option.icon ? (
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--mm-radius-md)]",
                    active
                      ? "bg-mm-teal text-white"
                      : "bg-mm-gray-50 text-mm-teal",
                  )}
                >
                  {option.icon}
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[0.9375rem] font-semibold text-mm-navy">
                    {option.title}
                  </p>
                  <span
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                      active
                        ? "border-mm-teal bg-mm-teal text-white"
                        : "border-mm-border bg-mm-white text-transparent",
                    )}
                  >
                    <Check size={11} strokeWidth={2.5} />
                  </span>
                </div>
                {option.description ? (
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-mm-text-muted">
                    {option.description}
                  </p>
                ) : null}
                {option.meta ? (
                  <p className="mt-2 text-[0.75rem] font-medium text-mm-text-muted">
                    {option.meta}
                  </p>
                ) : null}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
