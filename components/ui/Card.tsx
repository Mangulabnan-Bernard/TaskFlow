import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardProps {
  /** Optional heading rendered in the card header row. */
  title?: ReactNode;
  /** Optional element rendered on the right of the header (e.g. "VIEW ALL"). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Classes for the inner content wrapper. */
  bodyClassName?: string;
  as?: ElementType;
}

export function Card({
  title,
  action,
  children,
  className,
  bodyClassName,
  as: Tag = "section",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-surface p-5 sm:p-6",
        className,
      )}
    >
      {title || action ? (
        <header className="mb-5 flex items-center justify-between gap-4">
          {title ? (
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          ) : (
            <span />
          )}
          {action}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </Tag>
  );
}
