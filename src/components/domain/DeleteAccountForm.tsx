"use client";

import { useState } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui";
import { Trash2 } from "lucide-react";
import { deleteAccount, type AccountActionState } from "@/lib/account/actions";

const INITIAL: AccountActionState = {};

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccount, INITIAL);
  const [confirm, setConfirm] = useState("");

  return (
    <form action={formAction} className="space-y-3">
      <input
        name="confirm"
        type="text"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Type DELETE to confirm"
        autoComplete="off"
        className="w-full px-4 py-2.5 rounded-xl border-2 border-line bg-white text-ink focus:border-action focus:outline-none font-mono text-sm"
      />
      {state.error && (
        <p className="text-sm font-bold text-action-dark">{state.error}</p>
      )}
      <Button
        type="submit"
        variant="secondary"
        shape="pill"
        icon={Trash2}
        disabled={pending || confirm !== "DELETE"}
        className="!text-action-dark !border-action"
      >
        {pending ? "Deleting…" : "Delete my account"}
      </Button>
    </form>
  );
}
