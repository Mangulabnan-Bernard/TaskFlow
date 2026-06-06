"use client";

import { useEffect, useState } from "react";
import { projectsApi, type ApiProject } from "@/lib/api";
import type { Project } from "@/lib/data";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { PROJECTS_CHANGED, TASKS_CHANGED, onChange } from "@/lib/events";

/** Maps a backend project into the shape ProjectCard renders. */
function toCardProject(p: ApiProject): Project {
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

export function ActiveProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () => {
      projectsApi
        .list()
        .then((data) => {
          if (!active) return;
          setProjects(data.map(toCardProject));
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
    return <p className="text-sm text-slate-500">Loading projects…</p>;
  }
  if (projects.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No projects yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
