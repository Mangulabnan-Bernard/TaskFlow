"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

interface MobileNavContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const MobileNavContext = createContext<MobileNavContextValue | null>(null);

/** Tracks whether the sidebar drawer is open on small screens. */
export function MobileNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, toggle, close }), [open, toggle, close]);
  return (
    <MobileNavContext.Provider value={value}>
      {children}
    </MobileNavContext.Provider>
  );
}

export function useMobileNav(): MobileNavContextValue {
  const ctx = useContext(MobileNavContext);
  if (!ctx) {
    throw new Error("useMobileNav must be used within a MobileNavProvider");
  }
  return ctx;
}
