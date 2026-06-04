import { forwardRef, useId } from "react";
import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
}

/** Shared label / hint / error chrome for form controls. */
function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

const CONTROL_BASE =
  "w-full rounded-lg border bg-elevated text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-ring disabled:opacity-50";

function controlBorder(hasError?: boolean) {
  return hasError
    ? "border-danger/60 focus-visible:shadow-[0_0_0_2px_var(--color-canvas),0_0_0_4px_var(--color-danger)]"
    : "border-line hover:border-slate-600";
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  /** Optional leading icon rendered inside the field. */
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, className, id, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field id={fieldId} label={label} hint={hint} error={error}>
      <div className="relative">
        {leftIcon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-500 [&>svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          className={cn(
            CONTROL_BASE,
            controlBorder(Boolean(error)),
            "h-10 px-3",
            leftIcon ? "pl-9" : null,
            className,
          )}
          {...props}
        />
      </div>
    </Field>
  );
});

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, hint, error, className, id, rows = 3, ...props }, ref) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <Field id={fieldId} label={label} hint={hint} error={error}>
        <textarea
          ref={ref}
          id={fieldId}
          rows={rows}
          aria-invalid={error ? true : undefined}
          className={cn(
            CONTROL_BASE,
            controlBorder(Boolean(error)),
            "resize-none px-3 py-2 leading-relaxed",
            className,
          )}
          {...props}
        />
      </Field>
    );
  },
);
