"use client";

import { useEffect, useState } from "react";
import { changelogApi, type ApiChangelog } from "@/lib/api";
import { CHANGELOG_CHANGED, TASKS_CHANGED, onChange } from "@/lib/events";
import { BellIcon } from "@/components/icons";

const SEEN_KEY = "taskflow_notifs_seen";

const PRETTY: Record<string, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
const pretty = (v: string | null) => (v ? (PRETTY[v] ?? v) : "");

function summarize(entry: ApiChangelog): string {
  switch (entry.field) {
    case "created":
      return "Task created";
    case "status":
      return `Moved to ${pretty(entry.to)}`;
    case "title":
      return "Renamed";
    case "priority":
      return `Priority set to ${pretty(entry.to)}`;
    default:
      return `${entry.field} updated`;
  }
}

function timeAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function readSeen(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SEEN_KEY) ?? "";
}

export function NotificationsMenu() {
  const [entries, setEntries] = useState<ApiChangelog[]>([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string>(() => readSeen());

  useEffect(() => {
    const load = () => {
      changelogApi.list().then(setEntries).catch(() => {});
    };
    load();
    const offC = onChange(CHANGELOG_CHANGED, load);
    const offT = onChange(TASKS_CHANGED, load);
    return () => {
      offC();
      offT();
    };
  }, []);

  const unread = entries.filter((e) => e.createdAt > seen).length;

  function openMenu() {
    setOpen(true);
    // Mark everything up to now as seen.
    const now = new Date().toISOString();
    window.localStorage.setItem(SEEN_KEY, now);
    setSeen(now);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="focus-ring relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
      >
        <BellIcon className="size-5" />
        {unread > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white ring-2 ring-canvas">
            {unread > 9 ? "9+" : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-white">Notifications</p>
              <p className="text-xs text-slate-500">Recent task activity</p>
            </div>
            {entries.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-500">
                Nothing yet.
              </p>
            ) : (
              <ol className="max-h-96 overflow-y-auto py-1">
                {entries.slice(0, 12).map((e) => (
                  <li
                    key={e.id}
                    className="border-b border-line/50 px-4 py-2.5 last:border-0"
                  >
                    <p className="truncate text-sm font-medium text-white">
                      {e.taskTitle}
                    </p>
                    <p className="text-xs text-slate-400">
                      {summarize(e)}{" "}
                      <span className="text-slate-600">
                        · {timeAgo(e.createdAt)}
                      </span>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
