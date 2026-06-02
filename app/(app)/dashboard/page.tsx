import Link from "next/link";
import type { Metadata } from "next";
import {
  activeProjects,
  dashboardSummary,
  recentActivity,
  upcomingDeadlines,
  workload,
} from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { DeadlineItem } from "@/components/dashboard/DeadlineItem";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { WorkloadChart } from "@/components/dashboard/WorkloadChart";
import { CalendarIcon, ExpandIcon, BoltIcon, ChevronRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Dashboard — TaskFlow",
};

export default function DashboardPage() {
  const { firstName, tasksNeedingAttention, activeProjectCount, date } =
    dashboardSummary;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 md:p-8">
      {/* Welcome header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Welcome Back, {firstName}.
          </h1>
          <p className="mt-2 text-slate-400">
            You have{" "}
            <span className="font-semibold text-success">
              {tasksNeedingAttention} tasks
            </span>{" "}
            requiring immediate attention across {activeProjectCount} active
            projects.
          </p>
        </div>
        <div className="label-eyebrow inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-slate-300">
          <CalendarIcon className="size-4 text-slate-500" />
          {date}
        </div>
      </div>

      {/* Row 1: Active projects + Upcoming deadlines */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card
          className="lg:col-span-2"
          title="Active Projects"
          action={
            <Link
              href="/projects"
              className="label-eyebrow text-brand transition-colors hover:text-brand-light"
            >
              View All
            </Link>
          }
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Card>

        <Card title="Upcoming Deadlines">
          <ul className="space-y-2">
            {upcomingDeadlines.map((deadline) => (
              <DeadlineItem key={deadline.id} deadline={deadline} />
            ))}
          </ul>
        </Card>
      </div>

      {/* Row 2: Recent activity + Workload distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card title="Recent Activity">
          <ol>
            {recentActivity.map((activity, i) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={i === recentActivity.length - 1}
              />
            ))}
          </ol>
        </Card>

        <Card
          className="lg:col-span-2"
          title="Workload Distribution"
          action={
            <button
              type="button"
              aria-label="Expand workload"
              className="focus-ring rounded-md p-1 text-slate-500 transition-colors hover:bg-elevated hover:text-slate-200"
            >
              <ExpandIcon className="size-5" />
            </button>
          }
        >
          <WorkloadChart
            optimized={workload.optimized}
            segments={workload.segments}
          />
          <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
              <BoltIcon className="size-4" />
            </span>
            <p className="text-sm text-slate-400">{workload.trendNote}</p>
            <button
              type="button"
              aria-label="View workload details"
              className="focus-ring ml-auto rounded-md p-1.5 text-slate-500 transition-colors hover:bg-elevated hover:text-slate-200"
            >
              <ChevronRightIcon className="size-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
