import { cookies } from "next/headers";
import { createServerClient } from "@/lib/supabase";
import type { AppMode } from "@/lib/mode";

const MODE_COOKIE = "mode_preference";

export async function getCurrentUserMode(): Promise<AppMode> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("mode")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return "adult";
    }

    const row = data as { mode?: AppMode | null } | null;
    if (row?.mode === "kid" || row?.mode === "adult") {
      return row.mode;
    }
    return "adult";
  }

  const jar = await cookies();
  const pref = jar.get(MODE_COOKIE)?.value;
  if (pref === "kid" || pref === "adult") {
    return pref;
  }
  return "adult";
}
