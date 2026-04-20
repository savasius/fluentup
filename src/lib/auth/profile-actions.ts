"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type {
  CefrLevel,
  Database,
} from "@/lib/supabase/database.types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface AuthState {
  error?: string;
  success?: string;
}

const VALID_LEVELS: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export async function updateProfile(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const fullName = ((formData.get("fullName") as string) ?? "").trim();
  const cefrLevel = formData.get("cefrLevel") as CefrLevel;

  if (!fullName) return { error: "Name is required" };
  if (!VALID_LEVELS.includes(cefrLevel)) return { error: "Invalid level" };

  const patch: ProfileUpdate = {
    full_name: fullName,
    cefr_level: cefrLevel,
  };

  const { error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile", "layout");
  revalidatePath("/", "layout");
  return { success: "Profile updated" };
}
