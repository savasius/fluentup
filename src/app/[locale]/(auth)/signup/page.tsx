"use client";

import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { signUp, type AuthState } from "@/lib/auth/actions";
import { Card, Button } from "@/components/ui";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signUp,
    {}
  );

  return (
    <Card className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        Create your account
      </h1>
      <p className="mt-2 text-ink-soft">Start learning English in 2 minutes.</p>

      <form action={formAction} className="mt-6 space-y-4">
        {state.error && (
          <div className="flex items-start gap-2 p-3 bg-action-soft border border-action-tint rounded-xl">
            <AlertCircle
              className="w-4 h-4 text-action-dark flex-shrink-0 mt-0.5"
              strokeWidth={2.5}
            />
            <span className="text-sm text-action-dark">{state.error}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="signup-fullname"
            className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5"
          >
            Full name
          </label>
          <div className="relative">
            <User
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
              strokeWidth={2.3}
            />
            <input
              id="signup-fullname"
              type="text"
              name="fullName"
              autoComplete="name"
              className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5"
          >
            Email
          </label>
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
              strokeWidth={2.3}
            />
            <input
              id="signup-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted"
              strokeWidth={2.3}
            />
            <input
              id="signup-password"
              type="password"
              name="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="mt-1 text-xs text-ink-muted">
            Minimum 8 characters
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          shape="pill"
          size="md"
          full
          disabled={pending}
        >
          {pending ? "Creating account..." : "Create account"}
        </Button>

        <div className="text-xs text-ink-muted text-center">
          By signing up, you agree to our{" "}
          <Link
            href="/terms"
            className="font-bold text-ink-soft hover:underline"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-bold text-ink-soft hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
