"use client";

import { useNewProject } from "@/components/project/NewProjectModal";
import { PlusIcon } from "@/components/icons";

export function NewProjectFab() {
  const { open } = useNewProject();
  return (
    <button
      type="button"
      onClick={open}
      aria-label="New project"
      className="focus-ring fixed right-6 bottom-6 z-30 flex size-12 items-center justify-center rounded-xl bg-brand-light text-canvas shadow-[0_12px_32px_-8px_rgba(139,156,248,0.7)] transition-colors hover:bg-brand active:bg-brand-dark"
    >
      <PlusIcon className="size-6" />
    </button>
  );
}
