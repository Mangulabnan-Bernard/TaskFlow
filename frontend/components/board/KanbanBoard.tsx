"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  kanbanColumns,
  type KanbanColumnDef,
  type Task,
  type TaskStatus,
} from "@/lib/data";
import {
  tasksApi,
  toApiStatus,
  toUiPriority,
  toUiStatus,
  memberInitials,
  memberColor,
  type ApiTask,
} from "@/lib/api";
import {
  CHANGELOG_CHANGED,
  PROJECTS_CHANGED,
  TASKS_CHANGED,
  emitChange,
  onChange,
} from "@/lib/events";
import { cn } from "@/lib/utils";
import { KanbanColumn } from "@/components/board/KanbanColumn";
import { TaskCard } from "@/components/board/TaskCard";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";

/** Maps a backend task into the board's task shape. */
function toUiTask(t: ApiTask): Task {
  return {
    id: t.id,
    title: t.title,
    project: t.project?.name ?? "",
    status: toUiStatus(t.status),
    priority: toUiPriority(t.priority),
    assigneeId: t.assignee?.id,
    assignee: t.assignee
      ? {
          initials: memberInitials(t.assignee.name),
          color: memberColor(t.assignee.id),
        }
      : undefined,
  };
}

const DOT: Record<KanbanColumnDef["accent"], string> = {
  neutral: "bg-slate-400",
  brand: "bg-brand",
  success: "bg-success",
};

// Hydration-safe client check (no setState-in-effect): false on the server and
// the first client render, true thereafter.
const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function KanbanBoard() {
  const isClient = useIsClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const toast = useToast();

  // Load tasks from the API, and reload when one is created/edited elsewhere.
  useEffect(() => {
    let active = true;
    const load = () => {
      tasksApi
        .list()
        .then((data) => {
          if (!active) return;
          setTasks(data.map(toUiTask));
        })
        .catch(() => {})
        .finally(() => active && setLoading(false));
    };
    load();
    const off = onChange(TASKS_CHANGED, load);
    return () => {
      active = false;
      off();
    };
  }, []);

  // A small distance threshold lets clicks (e.g. the column "+") through
  // without starting a drag. KeyboardSensor adds keyboard accessibility.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const activeTask = tasks.find((task) => task.id === activeId) ?? null;
  const byStatus = (status: TaskStatus) =>
    tasks.filter((task) => task.status === status);

  // @dnd-kit injects SSR-unstable accessibility IDs onto every draggable, which
  // causes a hydration mismatch. Render an identical static board until the
  // client mounts, then swap in the interactive DndContext, with no visual flash.
  if (!isClient) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kanbanColumns.map((column) => (
          <div key={column.status} className="flex w-full flex-col">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className={cn("size-2 rounded-full", DOT[column.accent])} />
              <h3 className="text-sm font-semibold text-white">
                {column.label}
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">
                {byStatus(column.status).length}
              </span>
            </div>
            <div className="flex min-h-96 flex-1 flex-col gap-3 rounded-xl border border-line bg-surface/60 p-3">
              {byStatus(column.status).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
        <Spinner />
        Loading tasks…
      </div>
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const newStatus = String(over.id) as TaskStatus;
    const taskId = String(active.id);
    const moved = tasks.find((task) => task.id === taskId);
    if (!moved || moved.status === newStatus) return;
    const prevStatus = moved.status;

    // Move the card immediately (optimistic), then persist the status change.
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    tasksApi
      .updateStatus(taskId, toApiStatus(newStatus))
      .then(() => {
        // The backend logged a changelog entry; refresh dependents.
        emitChange(CHANGELOG_CHANGED);
        emitChange(PROJECTS_CHANGED);
      })
      .catch(() => {
        // Roll back on failure so the board reflects the real state.
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: prevStatus } : task,
          ),
        );
        toast.error("Couldn't move the task. Please try again.");
      });
  }

  return (
    <DndContext
      id="kanban-board"
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kanbanColumns.map((column) => (
          <KanbanColumn
            key={column.status}
            column={column}
            tasks={byStatus(column.status)}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="rotate-2 cursor-grabbing shadow-2xl">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
