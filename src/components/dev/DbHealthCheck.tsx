import { createServerClient } from "@/lib/supabase";

/**
 * Dev-only indicator: Supabase bağlantısı sağlıklı mı?
 * Production'da hiç render etmez.
 */
export async function DbHealthCheck() {
  if (process.env.NODE_ENV === "production") return null;

  const supabase = await createServerClient();

  const { count, error } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true });

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-line bg-white px-3 py-2 text-xs font-semibold shadow-soft">
      {error ? (
        <span className="text-action-dark">⚠ DB error: {error.message}</span>
      ) : (
        <span className="text-success-dark">
          ✓ DB connected · {count ?? 0} words
        </span>
      )}
    </div>
  );
}
