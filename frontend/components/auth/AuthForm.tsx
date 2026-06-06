"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth";
import { apiErrorMessage } from "@/lib/api";

export type AuthMode = "login" | "signup";

const COPY = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to your TaskFlow workspace.",
    submit: "Sign in",
    switchPrompt: "Don't have an account?",
    switchHref: "/signup",
    switchCta: "Sign up",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start planning and shipping work with your team.",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchCta: "Sign in",
  },
} as const;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = COPY[mode];
  const router = useRouter();
  const { login, register } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    const name = String(form.get("name") ?? "");

    try {
      if (mode === "signup") {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(
        apiErrorMessage(
          err,
          mode === "signup"
            ? "Could not create your account. Please try again."
            : "Invalid email or password.",
        ),
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {copy.title}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{copy.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-danger/40 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        ) : null}

        {mode === "signup" ? (
          <Input
            label="Full name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Alex Linden"
            required
          />
        ) : null}

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          required
        />

        <div className="space-y-1.5">
          {mode === "login" ? (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-200">
                Password
              </span>
              <Link
                href="/login"
                className="text-xs font-medium text-brand transition-colors hover:text-brand-light"
              >
                Forgot password?
              </Link>
            </div>
          ) : null}
          <Input
            label={mode === "signup" ? "Password" : undefined}
            name="password"
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            placeholder="••••••••"
            minLength={mode === "signup" ? 6 : undefined}
            hint={mode === "signup" ? "At least 6 characters." : undefined}
            required
          />
        </div>

        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? "Please wait…" : copy.submit}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        {copy.switchPrompt}{" "}
        <Link
          href={copy.switchHref}
          className="font-medium text-brand transition-colors hover:text-brand-light"
        >
          {copy.switchCta}
        </Link>
      </p>
    </div>
  );
}
