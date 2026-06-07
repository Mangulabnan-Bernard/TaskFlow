"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  projectsApi,
  tasksApi,
  type ApiProject,
  type ApiTask,
} from "@/lib/api";
import { PROJECTS_CHANGED, TASKS_CHANGED, onChange } from "@/lib/events";
import { SearchIcon } from "@/components/icons";

/** Global search over the user's projects and tasks, with a results dropdown. */
export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const load = () => {
      projectsApi.list().then(setProjects).catch(() => {});
      tasksApi.list().then(setTasks).catch(() => {});
    };
    load();
    const offP = onChange(PROJECTS_CHANGED, load);
    const offT = onChange(TASKS_CHANGED, load);
    return () => {
      offP();
      offT();
    };
  }, []);

  const q = query.trim().toLowerCase();
  const projectHits = q
    ? projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4)
    : [];
  const taskHits = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 6)
    : [];
  const hasResults = projectHits.length > 0 || taskHits.length > 0;
  const open = focused && q.length > 0;

  function go(href: string) {
    setQuery("");
    setFocused(false);
    router.push(href);
  }

  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        // Delay blur so a click on a result registers first.
        onBlur={() => {
          blurTimer.current = setTimeout(() => setFocused(false), 120);
        }}
        placeholder="Search projects and tasks..."
        aria-label="Search"
        className="focus-ring h-10 w-full rounded-lg border border-line bg-surface pr-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors hover:border-slate-600"
      />

      {open ? (
        <div className="absolute left-0 top-12 z-30 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-2xl">
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-slate-500">
              No matches for “{query.trim()}”.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1.5">
              {projectHits.length > 0 ? (
                <>
                  <p className="label-eyebrow px-4 pt-2 pb-1 text-slate-600">
                    Projects
                  </p>
                  {projectHits.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => go("/dashboard")}
                      className="block w-full truncate px-4 py-2 text-left text-sm text-slate-200 hover:bg-elevated"
                    >
                      {p.name}
                    </button>
                  ))}
                </>
              ) : null}
              {taskHits.length > 0 ? (
                <>
                  <p className="label-eyebrow px-4 pt-2 pb-1 text-slate-600">
                    Tasks
                  </p>
                  {taskHits.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => go("/tasks")}
                      className="block w-full px-4 py-2 text-left hover:bg-elevated"
                    >
                      <span className="block truncate text-sm text-slate-200">
                        {t.title}
                      </span>
                      {t.project ? (
                        <span className="block truncate text-xs text-slate-500">
                          {t.project.name}
                        </span>
                      ) : null}
                    </button>
                  ))}
                </>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
