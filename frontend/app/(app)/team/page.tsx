import type { Metadata } from "next";
import { TeamList } from "@/components/team/TeamList";

export const metadata: Metadata = { title: "Team — TaskFlow" };

export default function TeamPage() {
  return <TeamList />;
}
