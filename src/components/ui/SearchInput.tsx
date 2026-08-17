import { forwardRef, type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, label, id, disabled, ...props }, ref) {
    const inputId = id ?? props.name ?? "search";

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="sr-only">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <Search
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-mm-gray-400"
          />
          <input
            ref={ref}
            id={inputId}
            type="search"
            disabled={disabled}
            className={cn(
              "w-full rounded-[var(--mm-radius-lg)] border border-mm-border bg-mm-white py-2.5 pl-10 pr-3.5 text-[0.9375rem] text-mm-navy outline-none transition-[border-color,box-shadow] duration-[var(--mm-duration)]",
              "placeholder:text-mm-gray-400",
              "focus:border-mm-teal focus:shadow-[var(--mm-shadow-focus)]",
              "disabled:cursor-not-allowed disabled:bg-mm-gray-50 disabled:opacity-70",
              className,
            )}
            {...props}
          />
        </div>
      </div>
    );
  },
);
