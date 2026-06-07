"use client";

import { MenuIcon } from "@/components/icons";
import { useMobileNav } from "@/components/layout/MobileNav";
import { SearchBar } from "@/components/layout/SearchBar";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { HelpMenu } from "@/components/layout/HelpMenu";
import { UserMenu } from "@/components/layout/UserMenu";

export function Topbar() {
  const { toggle } = useMobileNav();

  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-canvas/80 px-4 backdrop-blur md:gap-4 md:px-6">
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
        <UserMenu />
      </div>
    </header>
  );
}
