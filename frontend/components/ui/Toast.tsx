"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "@/components/icons";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  notify: (message: string, variant?: ToastVariant) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const noopSubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

const ACCENT: Record<ToastVariant, string> = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-brand",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = (idRef.current += 1);
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => remove(id), 3500);
    },
    [remove],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      success: (m: string) => notify(m, "success"),
      error: (m: string) => notify(m, "error"),
    }),
    [notify],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isClient
        ? createPortal(
            <div className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-full max-w-sm flex-col gap-2">
              {toasts.map((t) => (
                <div
                  key={t.id}
                  role="status"
                  className={cn(
                    "animate-panel-in pointer-events-auto flex items-start gap-3 rounded-xl border border-l-4 border-line bg-elevated px-4 py-3 shadow-2xl",
                    ACCENT[t.variant],
                  )}
                >
                  <p className="flex-1 text-sm text-slate-100">{t.message}</p>
                  <button
                    type="button"
                    onClick={() => remove(t.id)}
                    aria-label="Dismiss notification"
                    className="focus-ring -mr-1 rounded-md p-0.5 text-slate-500 transition-colors hover:text-slate-200"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
