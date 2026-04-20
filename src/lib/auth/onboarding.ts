"use server";

import { createServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type {
  CefrLevel,
  Database,
} from "@/lib/supabase/database.types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function savePlacementResult(level: CefrLevel): Promise<void> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const patch: ProfileUpdate = {
    cefr_level: level,
    onboarding_completed: true,
  };

  await supabase.from("profiles").update(patch).eq("id", user.id);

  revalidatePath("/", "layout");
}
