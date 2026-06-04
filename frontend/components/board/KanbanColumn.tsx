"use client";

import { useDroppable } from "@dnd-kit/core";
import type { KanbanColumnDef, Task } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DraggableTaskCard } from "@/components/board/DraggableTaskCard";
import { useTaskModal } from "@/components/board/TaskModal";
import { PlusIcon } from "@/components/icons";

const DOT: Record<KanbanColumnDef["accent"], string> = {
  neutral: "bg-slate-400",
  brand: "bg-brand",
  success: "bg-success",
};

interface KanbanColumnProps {
  column: KanbanColumnDef;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.status });
  const { openCreate } = useTaskModal();

  return (
    <div className="flex w-full flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <span className={cn("size-2 rounded-full", DOT[column.accent])} />
        <h3 className="text-sm font-semibold text-white">{column.label}</h3>
        <span className="text-xs text-slate-500 tabular-nums">
          {tasks.length}
        </span>
        <button
          type="button"
          onClick={() => openCreate(column.status)}
          aria-label={`Add task to ${column.label}`}
          className="focus-ring ml-auto rounded-md p-1 text-slate-500 transition-colors hover:bg-elevated hover:text-slate-200"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-96 flex-1 flex-col gap-3 rounded-xl border p-3 transition-colors",
          isOver
            ? "border-brand/50 bg-elevated/50"
            : "border-line bg-surface/60",
        )}
      >
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line py-8 text-center text-xs text-slate-600">
            Drop tasks here
          </p>
        ) : null}
      </div>
    </div>
  );
}
