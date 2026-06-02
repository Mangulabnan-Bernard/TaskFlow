import { currentUser } from "@/lib/data";
import { SearchIcon, BellIcon, HelpIcon } from "@/components/icons";
import { Avatar } from "@/components/ui/Avatar";

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-line bg-canvas/80 px-6 backdrop-blur">
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
          <div className="text-right leading-tight">
            <p className="text-sm font-semibold text-white">
              {currentUser.name}
            </p>
            <p className="label-eyebrow text-slate-500">{currentUser.role}</p>
          </div>
          <Avatar
            initials={currentUser.initials}
            color="bg-gradient-to-br from-brand to-brand-dark"
          />
        </div>
      </div>
    </header>
  );
}
