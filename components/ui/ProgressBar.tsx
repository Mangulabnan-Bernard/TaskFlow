import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** Completion percentage, 0–100. */
  value: number;
  accent?: "brand" | "success";
  className?: string;
}

export function ProgressBar({
  value,
  accent = "brand",
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-1.5 w-full overflow-hidden rounded-full bg-line", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500",
          accent === "success" ? "bg-success" : "bg-brand",
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
