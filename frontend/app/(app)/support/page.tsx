import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { SupportIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Support — TaskFlow" };

export default function SupportPage() {
  return (
    <PlaceholderPage
      icon={SupportIcon}
      title="Support"
      description="Find answers, guides, and ways to reach the TaskFlow team."
    />
  );
}
