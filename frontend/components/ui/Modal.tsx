"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons";

// Hydration-safe "are we on the client?" check — false on the server and during
// the first client render, true thereafter. Avoids setState-in-effect.
const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export type ModalSize = "sm" | "md" | "lg";

const SIZES: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog for keyboard users.
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!isClient || !open) return null;

  return createPortal(
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // Close only when the backdrop itself is pressed.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-canvas/80 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "animate-panel-in relative z-10 w-full overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl outline-none",
          SIZES[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 p-5 pb-0">
          <div className="space-y-1">
            {title ? (
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p id={descId} className="text-sm text-slate-400">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="focus-ring -mt-1 -mr-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-elevated hover:text-white"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <div className="p-5">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t border-line bg-elevated/40 px-5 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
