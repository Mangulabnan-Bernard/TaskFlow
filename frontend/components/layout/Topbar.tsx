"use client";

import { LogoutIcon, MenuIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/lib/auth";
import { useMobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { HelpMenu } from "@/components/layout/HelpMenu";

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
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur md:gap-4 md:px-6">
      {/* Mobile menu toggle */}
      <button
        type="button"
        onClick={toggle}
        aria-label="Open menu"
        className="focus-ring shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-elevated hover:text-white lg:hidden"
      >
        <MenuIcon className="size-5" />
      </button>

      <SearchBar />

      <div className="ml-auto flex items-center gap-2">
        <NotificationsMenu />
        <HelpMenu />

        <div className="mx-1 hidden h-8 w-px bg-line sm:block" />

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
