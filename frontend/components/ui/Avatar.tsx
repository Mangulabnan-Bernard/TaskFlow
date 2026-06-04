import { cn } from "@/lib/utils";

export type AvatarSize = "sm" | "md" | "lg";

const SIZES: Record<AvatarSize, string> = {
  sm: "size-7 text-[11px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
};

export interface AvatarProps {
  initials: string;
  size?: AvatarSize;
  /** Tailwind background utility for the disc. */
  color?: string;
  /** Ring color (defaults to the card surface for stacked overlap). */
  ringClassName?: string;
  className?: string;
}

export function Avatar({
  initials,
  size = "md",
  color = "bg-slate-600",
  ringClassName,
  className,
}: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold text-white select-none",
        SIZES[size],
        color,
        ringClassName,
        className,
      )}
    >
      {initials}
    </span>
  );
}

export interface AvatarStackProps {
  avatars: { initials: string; color?: string }[];
  extra?: number;
  size?: AvatarSize;
  /** Ring color matching the surface the stack sits on. */
  ring?: string;
}

export function AvatarStack({
  avatars,
  extra,
  size = "md",
  ring = "ring-surface",
}: AvatarStackProps) {
  return (
    <div className="flex items-center -space-x-2">
      {avatars.map((a, i) => (
        <Avatar
          key={`${a.initials}-${i}`}
          initials={a.initials}
          color={a.color}
          size={size}
          ringClassName={cn("ring-2", ring)}
        />
      ))}
      {extra ? (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-brand font-semibold text-canvas ring-2",
            SIZES[size],
            ring,
          )}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
