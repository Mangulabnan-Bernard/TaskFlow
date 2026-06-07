"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { primaryNav, secondaryNav, type NavItem } from "@/lib/data";
import { LogoIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { useNewProject } from "@/components/project/NewProjectModal";
import { useMobileNav } from "@/components/layout/MobileNav";

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
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
  const { open: openNewProject } = useNewProject();
  const { open: drawerOpen, close: closeDrawer } = useMobileNav();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Backdrop on small screens when the drawer is open. */}
      {drawerOpen ? (
        <div
          onClick={closeDrawer}
          aria-hidden
          className="fixed inset-0 z-30 bg-canvas/70 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-64 shrink-0 flex-col border-r border-line bg-canvas transition-transform duration-200 lg:static lg:translate-x-0",
          drawerOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
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
            <NavLink
              key={item.href}
              item={item}
              active={isActive(item.href)}
              onNavigate={closeDrawer}
            />
          ))}
        </nav>

        {/* New project + secondary navigation */}
        <div className="space-y-4 px-3 pb-5">
          <Button
            fullWidth
            onClick={() => {
              closeDrawer();
              openNewProject();
            }}
            leftIcon={<PlusIcon />}
          >
            New Project
          </Button>
          <div className="space-y-1 border-t border-line pt-4">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isActive(item.href)}
                onNavigate={closeDrawer}
              />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
