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
