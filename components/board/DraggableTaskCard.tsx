"use client";

import { useDraggable } from "@dnd-kit/core";
import type { Task } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TaskCard } from "@/components/board/TaskCard";
import { useTaskModal } from "@/components/board/TaskModal";

export function DraggableTaskCard({ task }: { task: Task }) {
  const { openEdit } = useTaskModal();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "focus-ring touch-none rounded-lg cursor-grab active:cursor-grabbing",
        // The original dims while its DragOverlay clone follows the cursor.
        isDragging && "opacity-40",
      )}
    >
      <TaskCard task={task} onEdit={() => openEdit(task)} />
    </div>
  );
}
