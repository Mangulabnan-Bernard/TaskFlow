import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-light text-canvas hover:bg-brand active:bg-brand-dark shadow-[0_8px_24px_-12px_rgba(139,156,248,0.8)]",
  secondary:
    "bg-elevated text-slate-100 border border-line hover:bg-line hover:border-slate-600",
  ghost: "text-slate-300 hover:bg-elevated hover:text-white",
  outline:
    "border border-line text-slate-200 hover:border-brand hover:text-white",
  danger: "bg-danger/90 text-white hover:bg-danger",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
  icon: "h-10 w-10 p-0",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      leftIcon,
      rightIcon,
      className,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "focus-ring inline-flex items-center justify-center rounded-lg font-medium transition-colors",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {leftIcon ? (
          <span className="-ml-0.5 inline-flex shrink-0 [&>svg]:size-4">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {rightIcon ? (
          <span className="-mr-0.5 inline-flex shrink-0 [&>svg]:size-4">
            {rightIcon}
          </span>
        ) : null}
      </button>
    );
  },
);
