import type { Task, TaskPriority } from "@/lib/data";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EditIcon } from "@/components/icons";

const PRIORITY: Record<TaskPriority, { label: string; variant: BadgeVariant }> = {
  high: { label: "High", variant: "danger" },
  medium: { label: "Medium", variant: "brand" },
  low: { label: "Low", variant: "neutral" },
};

export function TaskCard({
  task,
  onEdit,
}: {
  task: Task;
  onEdit?: () => void;
}) {
  const priority = PRIORITY[task.priority];

  return (
    <article className="group rounded-lg border border-line bg-elevated p-3.5 transition-colors select-none hover:border-slate-600">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs text-slate-500">{task.project}</span>
        <Badge variant={priority.variant} dot>
          {priority.label}
        </Badge>
      </div>

      <h4 className="mt-2 text-sm leading-snug font-medium text-white">
        {task.title}
      </h4>

      <div className="mt-3 flex items-center justify-between">
        <span className="label-eyebrow text-slate-600">{task.id}</span>
        <div className="flex items-center gap-1.5">
          {onEdit ? (
            <button
              type="button"
              // Stop the pointer event from reaching the drag sensor.
              onPointerDown={(e) => e.stopPropagation()}
              onClick={onEdit}
              aria-label="Edit task"
              className="focus-ring rounded-md p-1 text-slate-500 opacity-0 transition hover:bg-line hover:text-slate-200 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <EditIcon className="size-3.5" />
            </button>
          ) : null}
          {task.assignee ? (
            <Avatar
              initials={task.assignee.initials}
              color={task.assignee.color}
              size="sm"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
