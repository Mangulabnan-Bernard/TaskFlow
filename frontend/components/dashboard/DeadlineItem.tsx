import type { Deadline } from "@/lib/data";
import { cn } from "@/lib/utils";

export function DeadlineItem({ deadline }: { deadline: Deadline }) {
  const critical = deadline.urgency === "critical";

  return (
    <li
      className={cn(
        "flex items-center gap-4 rounded-xl p-2.5 transition-colors",
        critical
          ? "border border-danger/30 bg-danger/5"
          : "border border-transparent hover:bg-elevated",
      )}
    >
      <div
        className={cn(
          "flex size-12 shrink-0 flex-col items-center justify-center rounded-lg",
          critical ? "bg-danger/15 text-danger" : "bg-elevated text-white",
        )}
      >
        <span className="text-lg leading-none font-bold tabular-nums">
          {deadline.day}
        </span>
        <span className="label-eyebrow mt-0.5 opacity-80">
          {deadline.month}
        </span>
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-white">{deadline.title}</p>
        <p className="truncate text-sm text-slate-400">{deadline.subtitle}</p>
      </div>
    </li>
  );
}
