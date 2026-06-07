/*
 * Mock data for the TaskFlow UI build (Day 1–2, static / pre-backend).
 * Shapes are intentionally close to what the API will return on Day 5 so the
 * widgets won't need reshaping when Axios is wired in (Day 7).
 */
import type { ComponentType, SVGProps } from "react";
import {
  AnalyticsIcon,
  CommitIcon,
  CheckCircleIcon,
  DashboardIcon,
  ProjectsIcon,
  SettingsIcon,
  SupportIcon,
  TasksIcon,
  TeamIcon,
  UserPlusIcon,
} from "@/components/icons";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

export const primaryNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { label: "Projects", href: "/projects", icon: ProjectsIcon },
  { label: "Tasks", href: "/tasks", icon: TasksIcon },
  { label: "Team", href: "/team", icon: TeamIcon },
  { label: "Analytics", href: "/analytics", icon: AnalyticsIcon },
];

export const secondaryNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: SettingsIcon },
  { label: "Support", href: "/support", icon: SupportIcon },
];

export interface User {
  name: string;
  role: string;
  initials: string;
}

export const currentUser: User = {
  name: "Alex Linden",
  role: "Lead Architect",
  initials: "AL",
};

export interface TeamAvatar {
  initials: string;
  /* Tailwind background utility for the avatar disc. */
  color: string;
}

export type ProjectStatus = "in-progress" | "on-track" | "at-risk";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  /** Brand-blue vs success-green progress fill, mirroring the design. */
  accent: "brand" | "success";
  members: TeamAvatar[];
  extraMembers?: number;
}

export const activeProjects: Project[] = [
  {
    id: "quantum-api",
    name: "Quantum API Integration",
    description:
      "Standardizing backend communication protocols for the next-gen satellite mesh.",
    status: "in-progress",
    progress: 75,
    accent: "brand",
    members: [
      { initials: "MJ", color: "bg-slate-500" },
      { initials: "SC", color: "bg-slate-600" },
    ],
    extraMembers: 3,
  },
  {
    id: "aurora-ui",
    name: "Aurora UI Rebranding",
    description:
      "Migrating legacy CSS components to the new atomic design system for the enterprise suite.",
    status: "on-track",
    progress: 42,
    accent: "success",
    members: [
      { initials: "AL", color: "bg-slate-500" },
      { initials: "JS", color: "bg-slate-700" },
    ],
  },
];

export type DeadlineUrgency = "critical" | "normal";

export interface Deadline {
  id: string;
  day: string;
  month: string;
  title: string;
  subtitle: string;
  urgency: DeadlineUrgency;
}

export const upcomingDeadlines: Deadline[] = [
  {
    id: "sprint-retro",
    day: "24",
    month: "Oct",
    title: "Sprint Retrospective",
    subtitle: "v2.4.0 Critical Updates",
    urgency: "critical",
  },
  {
    id: "security-audit",
    day: "26",
    month: "Oct",
    title: "Security Audit",
    subtitle: "Node.js Environment",
    urgency: "normal",
  },
  {
    id: "client-demo",
    day: "29",
    month: "Oct",
    title: "Client Demo",
    subtitle: "TaskFlow Enterprise",
    urgency: "normal",
  },
];

export type ActivityKind = "commit" | "completed" | "added";

export interface Activity {
  id: string;
  kind: ActivityKind;
  icon: IconType;
  actor: string;
  action: string;
  highlight?: string;
  highlightStyle?: "code" | "success" | "strong";
  trailing?: string;
  time: string;
}

export const recentActivity: Activity[] = [
  {
    id: "a1",
    kind: "commit",
    icon: CommitIcon,
    actor: "Marcus J.",
    action: "pushed 4 commits to",
    highlight: "main",
    highlightStyle: "code",
    time: "14 minutes ago",
  },
  {
    id: "a2",
    kind: "completed",
    icon: CheckCircleIcon,
    actor: "Sarah Chen",
    action: "completed",
    highlight: "#142: Fix API timeout bug",
    highlightStyle: "success",
    time: "2 hours ago",
  },
  {
    id: "a3",
    kind: "added",
    icon: UserPlusIcon,
    actor: "Alex Linden",
    action: "added",
    highlight: "Jordan Smith",
    highlightStyle: "strong",
    trailing: "to Aurora UI",
    time: "4 hours ago",
  },
];

export interface WorkloadSegment {
  label: string;
  value: number;
  /** CSS color for the donut arc + legend dot. */
  color: string;
}

export const workload = {
  optimized: 88,
  trendNote: "System output is 12% higher than last sprint.",
  segments: [
    { label: "Development", value: 54, color: "#8b9cf8" },
    { label: "Design Ops", value: 28, color: "#35d39a" },
    { label: "Documentation", value: 18, color: "#a78bfa" },
  ] satisfies WorkloadSegment[],
};

export const dashboardSummary = {
  firstName: "Alex",
  tasksNeedingAttention: 12,
  activeProjectCount: 4,
  date: "October 24, 2023",
};

/* ----------------------------------------------------------------------------
 * Kanban board (Day 3)
 * Statuses match the assessment spec: Todo / In Progress / Done.
 * -------------------------------------------------------------------------- */

export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  /** Project name, shown as a chip on the card. */
  project: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: TeamAvatar;
  /** Assigned team member id (used to prefill the edit modal); undefined if unassigned. */
  assigneeId?: string;
}

export interface KanbanColumnDef {
  status: TaskStatus;
  label: string;
  accent: "neutral" | "brand" | "success";
}

export const kanbanColumns: KanbanColumnDef[] = [
  { status: "todo", label: "Todo", accent: "neutral" },
  { status: "in-progress", label: "In Progress", accent: "brand" },
  { status: "done", label: "Done", accent: "success" },
];

export const tasks: Task[] = [
  {
    id: "TF-118",
    title: "Design auth token refresh flow",
    project: "Quantum API Integration",
    status: "todo",
    priority: "high",
    assignee: { initials: "MJ", color: "bg-slate-500" },
  },
  {
    id: "TF-121",
    title: "Audit color-contrast tokens for accessibility",
    project: "Aurora UI Rebranding",
    status: "todo",
    priority: "medium",
    assignee: { initials: "JS", color: "bg-slate-700" },
  },
  {
    id: "TF-124",
    title: "Write API contract for satellite mesh",
    project: "Quantum API Integration",
    status: "todo",
    priority: "low",
  },
  {
    id: "TF-109",
    title: "Implement WebSocket handshake protocol",
    project: "Quantum API Integration",
    status: "in-progress",
    priority: "high",
    assignee: { initials: "MJ", color: "bg-slate-500" },
  },
  {
    id: "TF-112",
    title: "Migrate legacy button components to atomic system",
    project: "Aurora UI Rebranding",
    status: "in-progress",
    priority: "medium",
    assignee: { initials: "JS", color: "bg-slate-700" },
  },
  {
    id: "TF-142",
    title: "Fix API timeout bug",
    project: "Quantum API Integration",
    status: "done",
    priority: "high",
    assignee: { initials: "SC", color: "bg-slate-600" },
  },
  {
    id: "TF-098",
    title: "Set up design-token build pipeline",
    project: "Aurora UI Rebranding",
    status: "done",
    priority: "low",
    assignee: { initials: "AL", color: "bg-slate-500" },
  },
];

/** Task change history — mirrors the eventual changelog API (field/from/to). */
export interface ChangelogEntry {
  id: string;
  taskTitle: string;
  field: "status" | "priority" | "created";
  from?: string;
  to?: string;
  actor: string;
  time: string;
}

export const taskChangelog: ChangelogEntry[] = [
  {
    id: "c1",
    taskTitle: "Fix API timeout bug",
    field: "status",
    from: "In Progress",
    to: "Done",
    actor: "Sarah Chen",
    time: "2h ago",
  },
  {
    id: "c2",
    taskTitle: "Implement WebSocket handshake protocol",
    field: "status",
    from: "Todo",
    to: "In Progress",
    actor: "Marcus J.",
    time: "5h ago",
  },
  {
    id: "c3",
    taskTitle: "Audit color-contrast tokens for accessibility",
    field: "priority",
    from: "Low",
    to: "Medium",
    actor: "Alex Linden",
    time: "1d ago",
  },
  {
    id: "c4",
    taskTitle: "Migrate legacy button components to atomic system",
    field: "created",
    actor: "Jordan Smith",
    time: "1d ago",
  },
];
