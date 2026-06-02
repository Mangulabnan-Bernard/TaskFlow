import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { TeamIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Team — TaskFlow" };

export default function TeamPage() {
  return (
    <PlaceholderPage
      icon={TeamIcon}
      title="Team"
      description="Manage members, roles, and workload across your organization."
    />
  );
}
