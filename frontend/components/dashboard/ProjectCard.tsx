"use client";

import { useState } from "react";
import type { Project, ProjectStatus } from "@/lib/data";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MoreIcon } from "@/components/icons";

const STATUS: Record<ProjectStatus, { label: string; variant: BadgeVariant }> = {
  "in-progress": { label: "In Progress", variant: "brand" },
  "on-track": { label: "On Track", variant: "success" },
  "at-risk": { label: "At Risk", variant: "danger" },
};

export interface ProjectSummary {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

export function ProjectCard({
  project,
  summary,
  onDelete,
}: {
  project: Project;
  summary?: ProjectSummary;
  onDelete?: (id: string) => void;
}) {
  const status = STATUS[project.status];
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
    setConfirming(false);
  }

  return (
    <article className="flex flex-col rounded-xl border border-line bg-elevated p-5 transition-colors hover:border-slate-600">
      <div className="flex items-center justify-between">
        <Badge variant={status.variant}>{status.label}</Badge>
        {onDelete ? (
          <div className="relative">
            <button
              type="button"
              aria-label="Project options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
              className="focus-ring -mr-1 rounded-md p-1 text-slate-500 transition-colors hover:bg-line hover:text-slate-200"
            >
              <MoreIcon className="size-5" />
            </button>
            {menuOpen ? (
              <>
                {/* Click-away backdrop */}
                <button
                  type="button"
                  aria-hidden
                  tabIndex={-1}
                  onClick={closeMenu}
                  className="fixed inset-0 z-10 cursor-default"
                />
                <div
                  role="menu"
                  className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-2xl"
                >
                  {confirming ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        onDelete(project.id);
                        closeMenu();
                      }}
                      className="flex w-full items-center px-3 py-2 text-left text-sm font-medium text-danger hover:bg-danger/10"
                    >
                      Confirm delete
                    </button>
                  ) : (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => setConfirming(true)}
                      className="flex w-full items-center px-3 py-2 text-left text-sm text-danger hover:bg-danger/10"
                    >
                      Delete project
                    </button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {project.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {project.description}
      </p>

      <div className="mt-6 space-y-3">
        {summary && summary.total > 0 ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-slate-400" />
              {summary.todo} To do
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-brand" />
              {summary.inProgress} In progress
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-success" />
              {summary.done} Done
            </span>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No tasks yet</p>
        )}
        <div className="flex items-center gap-3">
          <ProgressBar value={project.progress} accent={project.accent} />
          <span className="text-xs font-medium tabular-nums text-slate-300">
            {project.progress}%
          </span>
        </div>
      </div>
    </article>
  );
}
