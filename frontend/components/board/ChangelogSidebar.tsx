"use client";

import { useEffect, useState } from "react";
import { changelogApi, type ApiChangelog } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { CHANGELOG_CHANGED, TASKS_CHANGED, onChange } from "@/lib/events";

const STATUS_LABEL: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

const label = (value: string | null) =>
  value ? (STATUS_LABEL[value] ?? value) : "";

/** Compact relative time, e.g. "just now", "5m ago", "2h ago", "3d ago". */
function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function ChangeDescription({ entry }: { entry: ApiChangelog }) {
  if (entry.field === "created") {
    return <span className="text-slate-400">Task created</span>;
  }
  if (entry.field === "status") {
    return (
      <span className="text-slate-400">
        Status:{" "}
        <span className="text-slate-500 line-through">{label(entry.from)}</span>{" "}
        <span aria-hidden>→</span>{" "}
        <span className="font-medium text-slate-200">{label(entry.to)}</span>
      </span>
    );
  }
  if (entry.field === "title") {
    return (
      <span className="text-slate-400">
        Renamed to{" "}
        <span className="font-medium text-slate-200">{entry.to}</span>
      </span>
    );
  }
  return <span className="text-slate-400">{entry.field} updated</span>;
}

export function ChangelogSidebar() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ApiChangelog[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = () => {
      changelogApi
        .list()
        .then((data) => {
          if (!active) return;
          setEntries(data);
          setError(false);
        })
        .catch(() => active && setError(true));
    };
    load();
    const offChangelog = onChange(CHANGELOG_CHANGED, load);
    const offTasks = onChange(TASKS_CHANGED, load);
    return () => {
      active = false;
      offChangelog();
      offTasks();
    };
  }, []);

  const actor = user?.name ?? "You";

  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-line bg-canvas xl:flex">
      <div className="border-b border-line px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Changelog</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Recent task activity across projects
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {error ? (
          <p className="text-xs text-slate-500">Could not load activity.</p>
        ) : !entries ? (
          <p className="text-xs text-slate-500">Loading activity…</p>
        ) : entries.length === 0 ? (
          <p className="text-xs text-slate-500">
            No activity yet. Create or move a task to see it here.
          </p>
        ) : (
          <ol className="space-y-4">
            {entries.map((entry) => (
              <li key={entry.id} className="border-l-2 border-line pl-3.5">
                <p className="text-sm leading-snug font-medium text-white">
                  {entry.taskTitle}
                </p>
                <p className="mt-1 text-xs leading-relaxed">
                  <ChangeDescription entry={entry} />
                </p>
                <p className="label-eyebrow mt-1.5 text-slate-600">
                  {actor} · {timeAgo(entry.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
