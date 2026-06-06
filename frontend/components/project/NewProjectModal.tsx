"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { apiErrorMessage, projectsApi } from "@/lib/api";
import { PROJECTS_CHANGED, emitChange } from "@/lib/events";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface NewProjectContextValue {
  open: () => void;
}

const NewProjectContext = createContext<NewProjectContextValue | null>(null);

/**
 * Provides a single shared "New Project" modal so any trigger (sidebar button,
 * dashboard FAB) can open it via {@link useNewProject}.
 */
export function NewProjectProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => {
    setError(null);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const description =
      String(form.get("description") ?? "").trim() || undefined;

    try {
      await projectsApi.create(name, description);
      emitChange(PROJECTS_CHANGED);
      close();
    } catch (err) {
      setError(
        apiErrorMessage(err, "Could not create the project. Please try again."),
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <NewProjectContext.Provider value={value}>
      {children}
      <Modal
        open={isOpen}
        onClose={close}
        title="Create a new project"
        description="Spin up a workspace for your team to plan and track work."
        footer={
          <>
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" form="new-project-form" disabled={submitting}>
              {submitting ? "Creating…" : "Create Project"}
            </Button>
          </>
        }
      >
        <form
          id="new-project-form"
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
          <Input
            label="Project name"
            name="name"
            placeholder="e.g. Quantum API Integration"
            required
            autoFocus
          />
          <Textarea
            label="Description"
            name="description"
            placeholder="What is this project about?"
            rows={3}
          />
        </form>
      </Modal>
    </NewProjectContext.Provider>
  );
}

export function useNewProject(): NewProjectContextValue {
  const ctx = useContext(NewProjectContext);
  if (!ctx) {
    throw new Error("useNewProject must be used within a NewProjectProvider");
  }
  return ctx;
}
