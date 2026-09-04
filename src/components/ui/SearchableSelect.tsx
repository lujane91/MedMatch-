"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";

const OTHER_OPTION = "Other";

type SearchableSelectProps = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  required?: boolean;
  allowOther?: boolean;
};

export function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Search or select",
  required = false,
  allowOther = true,
}: SearchableSelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [otherMode, setOtherMode] = useState(false);

  useEffect(() => {
    setQuery(value || "");
    if (!value) setOtherMode(false);
  }, [value]);

  const allOptions = useMemo(() => {
    const unique = Array.from(new Set(options.filter(Boolean)));
    return allowOther ? [...unique, OTHER_OPTION] : unique;
  }, [allowOther, options]);

  const isKnownOption = Boolean(value) && allOptions.includes(value);
  const isOther = otherMode || (Boolean(value) && !isKnownOption);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || query === OTHER_OPTION) return allOptions;
    return allOptions.filter((option) => option.toLowerCase().includes(q));
  }, [allOptions, query]);

  function selectOption(option: string) {
    if (option === OTHER_OPTION) {
      setOtherMode(true);
      setQuery(OTHER_OPTION);
      onChange("");
      setOpen(false);
      return;
    }
    setOtherMode(false);
    setQuery(option);
    onChange(option);
    setOpen(false);
  }

  const displayQuery = isOther && query !== OTHER_OPTION ? OTHER_OPTION : query;

  return (
    <div ref={rootRef} className="w-full">
      <label
        htmlFor={fieldId}
        className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={fieldId}
          type="text"
          autoComplete="off"
          required={required && !isOther}
          value={isOther ? OTHER_OPTION : displayQuery}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            if (!isOther) setQuery(value || "");
          }}
          onChange={(e) => {
            const next = e.target.value;
            setOtherMode(false);
            setQuery(next);
            setOpen(true);
            if (!next) onChange("");
          }}
          className={cn(
            "w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white py-2.5 pl-3.5 pr-10 text-[0.9375rem] text-mm-navy outline-none transition-[border-color,box-shadow] duration-[var(--mm-duration)]",
            "placeholder:text-mm-gray-400",
            "focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]",
          )}
        />
        <button
          type="button"
          aria-label={`Toggle ${label} options`}
          onClick={() => setOpen((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-mm-text-muted"
        >
          <ChevronsUpDown size={16} strokeWidth={1.75} />
        </button>

        {open ? (
          <ul
            role="listbox"
            className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white py-1 shadow-mm-sm"
          >
            {filtered.length === 0 ? (
              <li className="px-3.5 py-2.5 text-[0.875rem] text-mm-text-muted">
                No matches
              </li>
            ) : (
              filtered.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={value === option}
                    className={cn(
                      "flex w-full px-3.5 py-2.5 text-left text-[0.875rem] text-mm-navy transition-colors",
                      value === option || (!isOther && query === option)
                        ? "bg-mm-teal-50 text-mm-teal-700"
                        : "hover:bg-mm-gray-50",
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectOption(option)}
                  >
                    {option}
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </div>

      {isOther ? (
        <div className="mt-2">
          <Input
            label={`Enter ${label.toLowerCase()}`}
            name={`${fieldId}-other`}
            value={value}
            required={required}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Type your ${label.toLowerCase()}`}
          />
        </div>
      ) : null}
    </div>
  );
}
