"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import {
  updateProfile,
  type AuthState,
} from "@/lib/auth/profile-actions";
import { cn } from "@/lib/cn";
import type { CefrLevel } from "@/lib/supabase/database.types";
import { CheckCircle2, AlertCircle } from "lucide-react";

const LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function ProfileForm({
  initialFullName,
  initialCefrLevel,
}: {
  initialFullName: string;
  initialCefrLevel: CefrLevel;
}) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updateProfile,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
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
          htmlFor="profile-fullname"
          className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5"
        >
          Full name
        </label>
        <input
          id="profile-fullname"
          type="text"
          name="fullName"
          defaultValue={initialFullName}
          required
          className="w-full px-3 py-2.5 bg-white border-2 border-line rounded-xl text-sm text-ink focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <div className="block text-xs font-bold uppercase tracking-widest text-ink-muted mb-1.5">
          English level
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((lvl) => (
            <label
              key={lvl}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition",
                "bg-white border border-line text-ink-soft hover:border-ink-muted",
                "has-[:checked]:bg-primary has-[:checked]:text-white has-[:checked]:border-primary has-[:checked]:shadow-solid-primary"
              )}
            >
              <input
                type="radio"
                name="cefrLevel"
                value={lvl}
                defaultChecked={initialCefrLevel === lvl}
                className="sr-only"
              />
              {lvl}
            </label>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        shape="pill"
        size="md"
        disabled={pending}
      >
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
