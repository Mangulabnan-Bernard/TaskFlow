"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { getToken } from "@/lib/api";
import { useAuth } from "@/lib/auth";

/**
 * Gates the authed app shell. Once auth state has hydrated on the client, a
 * missing token bounces the user to /login. Renders nothing until then so
 * protected content never flashes for a signed-out visitor.
 */
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { ready } = useAuth();

  useEffect(() => {
    if (ready && !getToken()) router.replace("/login");
  }, [ready, router]);

  if (!ready || !getToken()) return null;

  return <>{children}</>;
}
