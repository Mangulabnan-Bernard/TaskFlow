"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  activeProjects,
  kanbanColumns,
  type Task,
  type TaskStatus,
} from "@/lib/data";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

interface TaskModalContextValue {
  openCreate: (status?: TaskStatus) => void;
  openEdit: (task: Task) => void;
}

const TaskModalContext = createContext<TaskModalContextValue | null>(null);

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

/**
 * Shared create/edit task modal. Any trigger (New Task button, a column's "+",
 * a card's edit affordance) opens it via {@link useTaskModal}.
 */
export function TaskModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo");

  const openCreate = useCallback((status?: TaskStatus) => {
    setEditing(null);
    setDefaultStatus(status ?? "todo");
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Persistence + changelog logging arrive with the backend (Day 6) and
    // API wiring (Day 8). This is the UI shell only.
    close();
  }

  const projectOptions = activeProjects.map((p) => ({
    value: p.name,
    label: p.name,
  }));
  const statusOptions = kanbanColumns.map((c) => ({
    value: c.status,
    label: c.label,
  }));

  return (
    <TaskModalContext.Provider value={value}>
      {children}
      <Modal
        open={isOpen}
        onClose={close}
        title={editing ? "Edit task" : "Create a task"}
        description={
          editing
            ? "Update the task details below."
            : "Add a task to one of your projects."
        }
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" form="task-form">
              {editing ? "Save changes" : "Create task"}
            </Button>
          </>
        }
      >
        {/* key forces defaults to refresh when switching create/edit targets */}
        <form
          key={editing ? `edit-${editing.id}` : `create-${defaultStatus}`}
          id="task-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Title"
            name="title"
            placeholder="e.g. Implement WebSocket handshake"
            defaultValue={editing?.title}
            required
            autoFocus
          />
          <Select
            label="Project"
            name="project"
            options={projectOptions}
            defaultValue={editing?.project}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Status"
              name="status"
              options={statusOptions}
              defaultValue={editing?.status ?? defaultStatus}
            />
            <Select
              label="Priority"
              name="priority"
              options={PRIORITY_OPTIONS}
              defaultValue={editing?.priority ?? "medium"}
            />
          </div>
          <Textarea
            label="Description"
            name="description"
            placeholder="Add any details…"
            rows={3}
          />
        </form>
      </Modal>
    </TaskModalContext.Provider>
  );
}

export function useTaskModal(): TaskModalContextValue {
  const ctx = useContext(TaskModalContext);
  if (!ctx) {
    throw new Error("useTaskModal must be used within a TaskModalProvider");
  }
  return ctx;
}
