"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface AccountActionState {
  error?: string;
  success?: string;
}

/**
 * Export all user-owned data as a JSON structure.
 * Returns null if not authenticated.
 */
export async function exportAccountData(): Promise<Record<
  string,
  unknown
> | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, progressRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_progress").select("*").eq("user_id", user.id),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    },
    profile: profileRes.data ?? null,
    progress: progressRes.data ?? [],
  };
}

/**
 * Deletes all user-owned rows (profile, progress) and signs out.
 * Note: full auth user deletion requires service_role and is performed
 * out-of-band (email support@). This action clears user content and revokes
 * the session immediately.
 */
export async function deleteAccount(
  _prev: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const confirm = (formData.get("confirm") as string | null)?.trim();
  if (confirm !== "DELETE") {
    return { error: "Type DELETE to confirm." };
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not signed in." };
  }

  const { error: progressErr } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", user.id);
  if (progressErr) {
    return { error: progressErr.message };
  }

  const { error: profileErr } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id);
  if (profileErr) {
    return { error: profileErr.message };
  }

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?accountDeleted=1");
}
