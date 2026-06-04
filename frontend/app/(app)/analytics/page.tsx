import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { AnalyticsIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Analytics — TaskFlow" };

export default function AnalyticsPage() {
  return (
    <PlaceholderPage
      icon={AnalyticsIcon}
      title="Analytics"
      description="Insights into velocity, throughput, and project health."
    />
  );
}
