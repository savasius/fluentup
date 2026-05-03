"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import type { AppMode } from "@/lib/mode";

export async function switchProfileMode(
  next: AppMode,
): Promise<{ error?: string } | void> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "not_signed_in" };
  }

  const supabase = await createServerClient();

  if (next === "kid") {
    const { data: p, error: fetchErr } = await supabase
      .from("profiles")
      .select("age, parent_email, parent_consent, mode")
      .eq("id", user.id)
      .maybeSingle();

    if (fetchErr) {
      return { error: fetchErr.message };
    }

    const row = p as {
      age: number | null;
      parent_email: string | null;
      parent_consent: boolean;
    } | null;

    if (
      !row?.age ||
      !row?.parent_email ||
      !row?.parent_consent
    ) {
      redirect("/onboarding/kid");
      return;
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ mode: next })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  if (next === "kid") {
    redirect("/kid");
  } else {
    redirect("/");
  }
}
