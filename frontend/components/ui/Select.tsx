import { forwardRef, useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/icons";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, options, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "focus-ring h-10 w-full appearance-none rounded-lg border bg-elevated pr-9 pl-3 text-sm text-slate-100 transition-colors",
            error ? "border-danger/60" : "border-line hover:border-slate-600",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-500" />
      </div>
      {error ? <p className="text-xs text-danger">{error}</p> : null}
    </div>
  );
});
