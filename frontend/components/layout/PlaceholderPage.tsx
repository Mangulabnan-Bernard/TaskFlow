import type { ComponentType, SVGProps } from "react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/** Lightweight "coming soon" screen for nav destinations not yet built. */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
}: PlaceholderPageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl border border-line bg-surface text-brand">
        <Icon className="size-7" />
      </span>
      <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
      <p className="mt-2 max-w-sm text-slate-400">{description}</p>
      <span className="label-eyebrow mt-6 rounded-md bg-elevated px-2.5 py-1 text-slate-500">
        Coming soon
      </span>
    </div>
  );
}
