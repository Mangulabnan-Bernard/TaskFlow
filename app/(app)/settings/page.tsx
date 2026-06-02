import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { SettingsIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Settings — TaskFlow" };

export default function SettingsPage() {
  return (
    <PlaceholderPage
      icon={SettingsIcon}
      title="Settings"
      description="Configure your workspace, profile, and preferences."
    />
  );
}
