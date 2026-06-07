"use client";

import {
  SearchIcon,
  BellIcon,
  HelpIcon,
  LogoutIcon,
  MenuIcon,
} from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { useMobileNav } from "@/components/layout/MobileNav";

/** "Demo User" -> "DU", "Alex" -> "A". */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Topbar() {
  const { user, logout } = useAuth();
  const { toggle } = useMobileNav();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-canvas/80 px-4 backdrop-blur md:px-6">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="focus-ring shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      {/* Search */}
      <div className="relative w-full max-w-xl">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder="Search projects, tasks, or files..."
          aria-label="Search"
          className="focus-ring h-10 w-full rounded-lg border border-line bg-surface pr-3 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition-colors hover:border-slate-600"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="focus-ring relative rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
        >
          <BellIcon className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-danger ring-2 ring-canvas" />
        </button>
        <button
          type="button"
          aria-label="Help"
          className="focus-ring rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
        >
          <HelpIcon className="size-5" />
        </button>

        <div className="mx-2 h-8 w-px bg-line" />

        <div className="flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-sm font-semibold text-white">
              {user?.name ?? "—"}
            </p>
            <p className="label-eyebrow text-slate-500">{user?.email ?? ""}</p>
          </div>
          <Avatar
            initials={user ? initialsOf(user.name) : "?"}
            color="bg-gradient-to-br from-brand to-brand-dark"
          />
          <button
            type="button"
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="focus-ring rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
          >
            <LogoutIcon className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
