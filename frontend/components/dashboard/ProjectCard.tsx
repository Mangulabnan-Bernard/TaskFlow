import type { Project, ProjectStatus } from "@/lib/data";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { AvatarStack } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { MoreIcon } from "@/components/icons";

const STATUS: Record<ProjectStatus, { label: string; variant: BadgeVariant }> = {
  "in-progress": { label: "In Progress", variant: "brand" },
  "on-track": { label: "On Track", variant: "success" },
  "at-risk": { label: "At Risk", variant: "danger" },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS[project.status];

  return (
    <article className="flex flex-col rounded-xl border border-line bg-elevated p-5 transition-colors hover:border-slate-600">
      <div className="flex items-center justify-between">
        <Badge variant={status.variant}>{status.label}</Badge>
        <button
          type="button"
          aria-label="Project options"
          className="focus-ring -mr-1 rounded-md p-1 text-slate-500 transition-colors hover:bg-line hover:text-slate-200"
        >
          <MoreIcon className="size-5" />
        </button>
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {project.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-400">
        {project.description}
      </p>

      <div className="mt-6 flex items-center gap-4">
        <AvatarStack
          avatars={project.members}
          extra={project.extraMembers}
          size="sm"
          ring="ring-elevated"
        />
        <div className="flex flex-1 items-center gap-3">
          <ProgressBar value={project.progress} accent={project.accent} />
          <span className="text-xs font-medium tabular-nums text-slate-300">
            {project.progress}%
          </span>
        </div>
      </div>
    </article>
  );
}
