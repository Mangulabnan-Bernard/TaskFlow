"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { kanbanColumns, type Task, type TaskStatus } from "@/lib/data";
import {
  apiErrorMessage,
  projectsApi,
  tasksApi,
  toApiStatus,
  type ApiProject,
} from "@/lib/api";
import { PROJECTS_CHANGED, TASKS_CHANGED, emitChange, onChange } from "@/lib/events";
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
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the project picker in sync with the user's projects.
  useEffect(() => {
    const load = () => {
      projectsApi
        .list()
        .then(setProjects)
        .catch(() => {});
    };
    load();
    return onChange(PROJECTS_CHANGED, load);
  }, []);

  const openCreate = useCallback((status?: TaskStatus) => {
    setEditing(null);
    setDefaultStatus(status ?? "todo");
    setError(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((task: Task) => {
    setEditing(task);
    setError(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ openCreate, openEdit }), [openCreate, openEdit]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim() || undefined;
    const status = toApiStatus(String(form.get("status")) as TaskStatus);

    try {
      if (editing) {
        await tasksApi.update(editing.id, { title, description, status });
      } else {
        const projectId = String(form.get("project") ?? "");
        await tasksApi.create({ projectId, title, description, status });
      }
      // Refresh the board (and the dashboard, whose progress depends on counts).
      emitChange(TASKS_CHANGED);
      emitChange(PROJECTS_CHANGED);
      close();
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save the task. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  // When editing, the API can't move a task between projects, so the picker is
  // read-only and just shows the current project.
  const projectOptions = editing
    ? [{ value: editing.project, label: editing.project }]
    : projects.map((p) => ({ value: p.id, label: p.name }));
  const statusOptions = kanbanColumns.map((c) => ({
    value: c.status,
    label: c.label,
  }));
  const noProjects = !editing && projects.length === 0;

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
            <Button
              type="submit"
              form="task-form"
              disabled={submitting || noProjects}
            >
              {submitting
                ? "Saving…"
                : editing
                  ? "Save changes"
                  : "Create task"}
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
          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            >
              {error}
            </p>
          ) : null}
          {noProjects ? (
            <p className="rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-slate-400">
              Create a project first, then you can add tasks to it.
            </p>
          ) : null}
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
            disabled={Boolean(editing)}
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
