"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { loginAction } from "@/lib/supabase/actions";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const [state, formAction, isPending] = useActionState(loginAction, { success: false });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-md">
      <div className="mb-9">
        <div className="bg-brand-accent text-brand-accent-foreground mb-7 inline-flex size-12 items-center justify-center rounded-xl text-sm font-black tracking-tight lg:hidden">
          AM
        </div>
        <p className="text-primary mb-3 text-xs font-semibold tracking-[0.18em] uppercase">
          Portfolio workspace
        </p>
        <h1 className="text-foreground text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
          Welcome back.
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Sign in to manage your projects and media.
        </p>
      </div>

      {state?.error && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm"
        >
          <ShieldAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">Sign in failed</p>
            <p className="mt-1">{state.error}</p>
          </div>
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-foreground block text-sm font-medium">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="h-12 rounded-xl px-4"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-foreground block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="h-12 rounded-xl px-4 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="text-muted-foreground hover:text-foreground absolute top-0 right-0 flex size-12 items-center justify-center rounded-r-xl transition-colors"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl text-sm font-semibold"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Signing in...
            </>
          ) : (
            <>
              Sign in <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </form>

      <p className="text-muted-foreground mt-7 flex items-center justify-center gap-2 text-xs">
        <LockKeyhole className="size-3.5" aria-hidden="true" /> Private admin access
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-background text-foreground grid min-h-screen lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative hidden overflow-hidden bg-[#17291f] p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-lg font-black tracking-[-0.05em]"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#c8ee73] text-sm text-[#17291f]">
            AM
          </span>
          ABIR MAHMUD<span className="text-[#c8ee73]">.</span>
        </Link>
        <div className="relative z-10 max-w-lg">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#c8ee73] uppercase">
            Admin dashboard
          </span>
          <h2 className="mt-5 text-5xl leading-[1.05] font-semibold tracking-[-0.06em] xl:text-6xl">
            Your work,
            <br />
            all in one place.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-white/65">
            A focused space to keep your portfolio projects and media up to date.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/45">
          © {new Date().getFullYear()} Abir Mahmud
        </p>
        <div
          className="pointer-events-none absolute right-[-15%] bottom-[-20%] size-[60%] rounded-full border-[70px] border-white/5"
          aria-hidden="true"
        />
      </div>

      <div className="flex min-h-screen flex-col px-6 py-6 sm:px-10 lg:px-16 lg:py-10">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex min-h-10 w-fit items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden="true" /> Back to portfolio
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <Suspense
            fallback={
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader2 className="size-4 animate-spin" /> Loading sign in...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
