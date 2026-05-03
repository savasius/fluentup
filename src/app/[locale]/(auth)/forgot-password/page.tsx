"use client";

import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { requestPasswordReset, type AuthState } from "@/lib/auth/actions";
import { Card, Button } from "@/components/ui";
import { Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    requestPasswordReset,
    {}
  );

  return (
    <Card className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-extrabold text-ink">
        Reset password
      </h1>
      <p className="mt-2 text-ink-soft">
        We&apos;ll send you a link to reset it.
      </p>

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

        {state.success && (
          <div className="flex items-start gap-2 p-3 bg-success-soft border border-success-tint rounded-xl">
            <CheckCircle2
              className="w-4 h-4 text-success-dark flex-shrink-0 mt-0.5"
              strokeWidth={2.5}
            />
            <span className="text-sm text-success-dark">{state.success}</span>
          </div>
        )}

        <div>
          <label
            htmlFor="forgot-email"
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
              id="forgot-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
              placeholder="you@example.com"
            />
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
          {pending ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-ink-soft">
        <Link href="/login" className="font-bold text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    </Card>
  );
}
