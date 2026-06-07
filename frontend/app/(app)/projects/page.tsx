import type { Metadata } from "next";
import { ProjectsList } from "@/components/project/ProjectsList";

export const metadata: Metadata = { title: "Projects — TaskFlow" };

export default function ProjectsPage() {
  return <ProjectsList />;
}
