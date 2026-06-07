/*
 * Tiny client-side event bus. The "New Project" / task modals live in the app
 * shell, separate from the lists that display the data, so after a write they
 * emit a change event and the relevant list re-fetches.
 */

export const PROJECTS_CHANGED = "taskflow:projects-changed";
export const TASKS_CHANGED = "taskflow:tasks-changed";
export const CHANGELOG_CHANGED = "taskflow:changelog-changed";

export function emitChange(event: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(event));
  }
}

/** Subscribe to a change event; returns an unsubscribe function. */
export function onChange(event: string, handler: () => void): () => void {
  window.addEventListener(event, handler);
  return () => window.removeEventListener(event, handler);
}
