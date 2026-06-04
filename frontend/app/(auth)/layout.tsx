import type { ReactNode } from "react";
import Link from "next/link";
import { LogoIcon } from "@/components/icons";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      {/* Soft brand glow behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] left-1/2 size-[480px] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px]"
      />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/dashboard"
          className="mb-8 flex items-center justify-center gap-3"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-canvas">
            <LogoIcon className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            TaskFlow
          </span>
        </Link>

        <div className="rounded-2xl border border-line bg-surface p-8 shadow-2xl">
          {children}
        </div>

        <p className="label-eyebrow mt-6 text-center text-slate-600">
          TaskFlow Management Suite
        </p>
      </div>
    </div>
  );
}
