import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/**
 * Server-side: mevcut authenticated user'ı al.
 * Null dönerse = guest.
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Server-side: user + profile birleştir.
 * Profile row yoksa null döner (auth var ama DB trigger henüz row oluşturmamış olabilir).
 */
export async function getCurrentUserWithProfile(): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  profile: Profile | null;
}> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile: (data as Profile | null) ?? null };
}

/**
 * Server-side: gerektirdiği route'lar için, guest ise login'e redirect.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    const { redirect } = await import("next/navigation");
    redirect("/login");
  }
  return user;
}
