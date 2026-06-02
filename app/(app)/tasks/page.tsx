import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { TasksIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Tasks — TaskFlow" };

export default function TasksPage() {
  return (
    <PlaceholderPage
      icon={TasksIcon}
      title="Tasks"
      description="Track every task across projects with boards and lists."
    />
  );
}
