/**
 * Tiny classname joiner — filters out falsy values and joins with spaces.
 * Keeps conditional class logic readable without pulling in clsx.
 *
 *   cn("px-4", isActive && "bg-brand", error ? "text-danger" : null)
 */
export function cn(
  ...classes: Array<string | number | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}
