"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { LogoutIcon } from "@/components/icons";

/** "Demo User" -> "DU", "Alex" -> "A". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const initials = user ? initialsOf(user.name) : "?";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex items-center gap-3 rounded-lg p-1 transition-colors hover:bg-elevated"
      >
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-semibold text-white">
            {user?.name ?? "—"}
          </p>
          <p className="label-eyebrow text-slate-500">{user?.email ?? ""}</p>
        </div>
        <Avatar
          initials={initials}
          color="bg-gradient-to-br from-brand to-brand-dark"
        />
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
            className="absolute right-0 top-12 z-40 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Avatar
                initials={initials}
                color="bg-gradient-to-br from-brand to-brand-dark"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {user?.name ?? "—"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={logout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-elevated hover:text-white"
            >
              <LogoutIcon className="size-4" />
              Sign out
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
