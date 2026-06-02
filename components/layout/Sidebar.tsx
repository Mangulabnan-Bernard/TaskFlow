"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/data";
import { LogoIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useNewProject } from "@/components/project/NewProjectModal";

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-brand/10 text-white"
          : "text-slate-400 hover:bg-elevated hover:text-white",
      )}
    >
      {active ? (
        <span className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
      ) : null}
      <Icon
        className={cn(
          "size-5 shrink-0 transition-colors",
          active ? "text-brand" : "text-slate-500 group-hover:text-slate-300",
        )}
      />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { open } = useNewProject();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-line bg-canvas">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-canvas">
          <LogoIcon className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight text-white">
            TaskFlow
          </p>
          <p className="label-eyebrow text-slate-500">Management Suite</p>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2">
        {primaryNav.map((item) => (
          <NavLink key={item.href} item={item} active={isActive(item.href)} />
        ))}
      </nav>

      {/* New project + secondary navigation */}
      <div className="space-y-4 px-3 pb-5">
        <Button fullWidth onClick={open} leftIcon={<PlusIcon />}>
          New Project
        </Button>
        <div className="space-y-1 border-t border-line pt-4">
          {secondaryNav.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </div>
    </aside>
  );
}
