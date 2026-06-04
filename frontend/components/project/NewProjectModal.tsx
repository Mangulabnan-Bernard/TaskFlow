"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
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

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open }), [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Persistence arrives with the backend (Day 4+). For now, just dismiss.
    close();
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
            <Button type="submit" form="new-project-form">
              Create Project
            </Button>
          </>
        }
      >
        <form
          id="new-project-form"
          onSubmit={handleSubmit}
          className="space-y-4"
        >
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
