import type { Activity, ActivityKind } from "@/lib/data";
import { cn } from "@/lib/utils";

const ICON_STYLE: Record<ActivityKind, string> = {
  commit: "bg-brand/10 text-brand",
  completed: "bg-success/10 text-success",
  added: "bg-[#a78bfa]/10 text-[#a78bfa]",
};

function Highlight({ activity }: { activity: Activity }) {
  if (!activity.highlight) return null;
  if (activity.highlightStyle === "code") {
    return (
      <code className="rounded bg-elevated px-1.5 py-0.5 font-mono text-xs text-slate-300">
        {activity.highlight}
      </code>
    );
  }
  return (
    <span
      className={cn(
        "font-medium",
        activity.highlightStyle === "success" ? "text-success" : "text-white",
      )}
    >
      {activity.highlight}
    </span>
  );
}

export function ActivityItem({
  activity,
  isLast,
}: {
  activity: Activity;
  isLast?: boolean;
}) {
  const Icon = activity.icon;

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!isLast ? (
        <span className="absolute top-9 bottom-0 left-4 w-px -translate-x-1/2 bg-line" />
      ) : null}
      <span
        className={cn(
          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full",
          ICON_STYLE[activity.kind],
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="pt-0.5">
        <p className="text-sm leading-relaxed text-slate-400">
          <span className="font-semibold text-white">{activity.actor}</span>{" "}
          {activity.action} <Highlight activity={activity} />
          {activity.trailing ? <> {activity.trailing}</> : null}
        </p>
        <p className="label-eyebrow mt-1 text-slate-500">{activity.time}</p>
      </div>
    </li>
  );
}
