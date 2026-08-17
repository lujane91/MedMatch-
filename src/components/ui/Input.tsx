import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    label,
    hint,
    error,
    leftAddon,
    rightAddon,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const inputId = id ?? props.name;

  return (
    <div className="w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[0.8125rem] font-medium text-mm-navy"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftAddon ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-mm-gray-400">
            {leftAddon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full rounded-[var(--mm-radius-lg)] border bg-mm-white px-3.5 py-2.5 text-[0.9375rem] text-mm-navy outline-none transition-[border-color,box-shadow] duration-[var(--mm-duration)]",
            "placeholder:text-mm-gray-400",
            "disabled:cursor-not-allowed disabled:bg-mm-gray-50 disabled:opacity-70",
            error
              ? "border-mm-error focus:border-mm-error focus:shadow-[0_0_0_3px_rgba(220,38,38,0.18)]"
              : "border-mm-border focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]",
            leftAddon && "pl-10",
            rightAddon && "pr-10",
            className,
          )}
          {...props}
        />
        {rightAddon ? (
          <span className="absolute inset-y-0 right-3 flex items-center text-mm-gray-400">
            {rightAddon}
          </span>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1.5 text-[0.75rem] font-medium text-mm-error-700">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.75rem] text-mm-text-muted">{hint}</p>
      ) : null}
    </div>
  );
});
