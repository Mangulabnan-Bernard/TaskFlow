"use client";

import { useEffect, useState } from "react";
import { apiErrorMessage, projectsApi, type ApiProject } from "@/lib/api";
import {
  PROJECTS_CHANGED,
  TASKS_CHANGED,
  emitChange,
  onChange,
} from "@/lib/events";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import {
  toCardProject,
  toSummary,
} from "@/components/dashboard/ActiveProjects";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { useNewProject } from "@/components/project/NewProjectModal";
import { PlusIcon } from "@/components/icons";

export function ProjectsList() {
  const [projects, setProjects] = useState<ApiProject[] | null>(null);
  const [error, setError] = useState(false);
  const toast = useToast();
  const { open, openEdit } = useNewProject();

  useEffect(() => {
    let active = true;
    const load = () => {
      projectsApi
        .list()
        .then((data) => {
          if (!active) return;
          setProjects(data);
          setError(false);
        })
        .catch(() => active && setError(true));
    };
    load();
    const offProjects = onChange(PROJECTS_CHANGED, load);
    const offTasks = onChange(TASKS_CHANGED, load);
    return () => {
      active = false;
      offProjects();
      offTasks();
    };
  }, []);

  function handleDelete(id: string) {
    projectsApi
      .remove(id)
      .then(() => {
        toast.success("Project deleted");
        emitChange(PROJECTS_CHANGED);
        emitChange(TASKS_CHANGED);
      })
      .catch((err) =>
        toast.error(apiErrorMessage(err, "Could not delete the project.")),
      );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Projects
          </h1>
          <p className="mt-2 text-slate-400">
            Create and manage your team&apos;s projects.
          </p>
        </div>
        <Button leftIcon={<PlusIcon />} onClick={open}>
          New Project
        </Button>
      </header>

      {error ? (
        <p className="text-sm text-slate-500">Could not load projects.</p>
      ) : !projects ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Spinner />
          Loading projects…
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line px-5 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">No projects yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={toCardProject(p)}
              summary={toSummary(p)}
              onEdit={() =>
                openEdit({
                  id: p.id,
                  name: p.name,
                  description: p.description,
                })
              }
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
