import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "brand" | "success" | "danger" | "neutral";

const VARIANTS: Record<BadgeVariant, string> = {
  brand: "bg-brand/10 text-brand",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  neutral: "bg-slate-500/10 text-slate-300",
};

const DOT: Record<BadgeVariant, string> = {
  brand: "bg-brand",
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-slate-400",
};

export interface BadgeProps {
  variant?: BadgeVariant;
  /** Show a leading status dot. */
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = "neutral",
  dot = false,
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "label-eyebrow inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium",
        VARIANTS[variant],
        className,
      )}
    >
      {dot ? (
        <span className={cn("size-1.5 rounded-full", DOT[variant])} />
      ) : null}
      {children}
    </span>
  );
}
