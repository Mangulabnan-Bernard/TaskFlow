import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { NewProjectFab } from "@/components/layout/NewProjectFab";
import { NewProjectProvider } from "@/components/project/NewProjectModal";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <NewProjectProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <NewProjectFab />
    </NewProjectProvider>
  );
}
