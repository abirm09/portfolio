"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { loginAction } from "@/lib/supabase/actions";
import {
  ArrowLeft,
  Database,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [state, formAction, isPending] = useActionState(loginAction, {
    success: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-2xl p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex size-12 rounded-2xl bg-linear-to-tr from-primary to-accent items-center justify-center text-primary-foreground font-black text-xl shadow-lg mb-1">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Dashboard Login
        </h1>
        <p className="text-xs text-muted-foreground">
          Authenticate via Supabase to manage your portfolio projects & assets.
        </p>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication failed</p>
            <p className="mt-0.5">{state.error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo} />

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-primary" />
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="admin@example.com"
            required
            autoComplete="email"
            className="h-11"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••••••"
              required
              autoComplete="current-password"
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11 text-sm font-semibold mt-2"
          disabled={isPending}
        >
          {isPending ? "Authenticating..." : "Sign in to Dashboard"}
        </Button>
      </form>

      {/* Supabase Note */}
      <div className="pt-4 border-t border-border/70 text-center space-y-1 text-xs text-muted-foreground">
        <div className="flex items-center justify-center gap-1.5 font-medium text-foreground">
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          Protected by Supabase Auth
        </div>
        <p className="text-[11px]">
          Create an admin user in your Supabase dashboard or use SQL script to gain access.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Background glowing aurora */}
      <div className="absolute -top-40 -left-40 size-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-accent/20 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Link */}
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Portfolio
            </Link>
          </Button>

          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Supabase Admin
          </span>
        </div>

        {/* Suspense wrapper for useSearchParams */}
        <Suspense
          fallback={
            <div className="rounded-3xl border border-border bg-card/80 p-8 text-center text-xs text-muted-foreground flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              Loading Login...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
