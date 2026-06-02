import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { ProjectsIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Projects — TaskFlow" };

export default function ProjectsPage() {
  return (
    <PlaceholderPage
      icon={ProjectsIcon}
      title="Projects"
      description="Browse and manage all of your team's projects in one place."
    />
  );
}
