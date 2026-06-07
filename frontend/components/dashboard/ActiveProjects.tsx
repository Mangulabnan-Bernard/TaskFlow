"use client";

import { useEffect, useState } from "react";
import { apiErrorMessage, projectsApi, type ApiProject } from "@/lib/api";
import type { Project } from "@/lib/data";
import { ProjectCard, type ProjectSummary } from "@/components/dashboard/ProjectCard";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { useNewProject } from "@/components/project/NewProjectModal";
import {
  PROJECTS_CHANGED,
  TASKS_CHANGED,
  emitChange,
  onChange,
} from "@/lib/events";

/** Maps a backend project into the shape ProjectCard renders. */
export function toCardProject(p: ApiProject): Project {
  const progress = p.taskCount
    ? Math.round((p.doneCount / p.taskCount) * 100)
    : 0;
  const complete = p.taskCount > 0 && p.doneCount === p.taskCount;
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "No description yet.",
    status: complete ? "on-track" : "in-progress",
    progress,
    accent: complete ? "success" : "brand",
    members: [],
  };
}

export function toSummary(p: ApiProject): ProjectSummary {
  return {
    total: p.taskCount,
    done: p.doneCount,
    inProgress: p.inProgressCount,
    todo: p.taskCount - p.doneCount - p.inProgressCount,
  };
}

export function ActiveProjects() {
  const [projects, setProjects] = useState<ApiProject[] | null>(null);
  const [error, setError] = useState(false);
  const toast = useToast();
  const { openEdit } = useNewProject();

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
    // Re-fetch when a project or task is created elsewhere in the app.
    const offProjects = onChange(PROJECTS_CHANGED, load);
    const offTasks = onChange(TASKS_CHANGED, load);
    return () => {
      active = false;
      offProjects();
      offTasks();
    };
  }, []);

  if (error) {
    return <p className="text-sm text-slate-500">Could not load projects.</p>;
  }
  if (!projects) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Spinner />
        Loading projects…
      </div>
    );
  }
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line px-5 py-10 text-center">
        <p className="text-sm font-medium text-slate-300">No projects yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Create your first project to start tracking work.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((p) => (
        <ProjectCard
          key={p.id}
          project={toCardProject(p)}
          summary={toSummary(p)}
          onEdit={() =>
            openEdit({ id: p.id, name: p.name, description: p.description })
          }
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
