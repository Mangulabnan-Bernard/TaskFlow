import type { Metadata } from "next";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { ChangelogSidebar } from "@/components/board/ChangelogSidebar";
import { TaskModalProvider } from "@/components/board/TaskModal";
import { NewTaskButton } from "@/components/board/NewTaskButton";

export const metadata: Metadata = { title: "Tasks — TaskFlow" };

export default function TasksPage() {
  return (
    <div className="flex h-full">
      <div className="min-w-0 flex-1 overflow-y-auto p-6 md:p-8">
        <TaskModalProvider>
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Tasks
              </h1>
              <p className="mt-2 text-slate-400">
                Drag a card between columns to update its status.
              </p>
            </div>
            <NewTaskButton />
          </header>

          <div className="mt-6">
            <KanbanBoard />
          </div>
        </TaskModalProvider>
      </div>

      <ChangelogSidebar />
    </div>
  );
}
