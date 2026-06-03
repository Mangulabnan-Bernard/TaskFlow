import { taskChangelog, type ChangelogEntry } from "@/lib/data";

function ChangeDescription({ entry }: { entry: ChangelogEntry }) {
  if (entry.field === "created") {
    return <span className="text-slate-400">Task created</span>;
  }
  return (
    <span className="text-slate-400">
      {entry.field === "status" ? "Status" : "Priority"}:{" "}
      <span className="text-slate-500 line-through">{entry.from}</span>{" "}
      <span aria-hidden>→</span>{" "}
      <span className="font-medium text-slate-200">{entry.to}</span>
    </span>
  );
}

export function ChangelogSidebar() {
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-line bg-canvas xl:flex">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Changelog</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Recent task activity across projects
        </p>
      </div>

      <ol className="flex-1 space-y-4 overflow-y-auto p-5">
        {taskChangelog.map((entry) => (
          <li key={entry.id} className="border-l-2 border-line pl-3.5">
            <p className="text-sm leading-snug font-medium text-white">
              {entry.taskTitle}
            </p>
            <p className="mt-1 text-xs leading-relaxed">
              <ChangeDescription entry={entry} />
            </p>
            <p className="label-eyebrow mt-1.5 text-slate-600">
              {entry.actor} · {entry.time}
            </p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
