"use client";

import { useState } from "react";
import { HelpIcon } from "@/components/icons";

const TIPS = [
  "Drag a card between columns to change its status.",
  "Click the + on a column (or “New Task”) to add a task.",
  "Hover a card and click the pencil to edit, set priority, or delete.",
  "Use the search bar to jump to any project or task.",
];

export function HelpMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Help"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="focus-ring rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
      >
        <HelpIcon className="size-5" />
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
            className="absolute right-0 top-11 z-40 w-72 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
          >
            <div className="border-b border-line px-4 py-3">
              <p className="text-sm font-semibold text-white">Quick tips</p>
            </div>
            <ul className="space-y-2 px-4 py-3">
              {TIPS.map((tip) => (
                <li key={tip} className="flex gap-2 text-sm text-slate-300">
                  <span aria-hidden className="text-brand">
                    •
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-4 py-3">
              <a
                href="https://github.com/Mangulabnan-Bernard/TaskFlow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-brand transition-colors hover:text-brand-light"
              >
                View the project on GitHub →
              </a>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
