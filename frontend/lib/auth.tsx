"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import {
  authApi,
  clearAuth,
  getStoredUser,
  setStoredUser,
  setToken,
  subscribeAuth,
  type ApiUser,
} from "@/lib/api";

interface AuthContextValue {
  user: ApiUser | null;
  /** False until we've hydrated on the client (avoids flicker/redirect races). */
  ready: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// `ready` is false on the server and the first client render, true thereafter —
// same hydration-safe trick the Kanban board uses.
const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useSyncExternalStore(
    subscribeAuth,
    getStoredUser,
    () => null,
  );
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login(email, password);
    setToken(res.token);
    setStoredUser(res.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authApi.register(name, email, password);
      setToken(res.token);
      setStoredUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    clearAuth();
    window.location.href = "/login";
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
