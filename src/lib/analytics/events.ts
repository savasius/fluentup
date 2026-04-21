/**
 * GA4 custom event helper.
 *
 * Usage (client only):
 *   trackEvent("game_start", { game: "word_scramble" });
 *
 * Safe to call on SSR (no-op) and when GA is disabled.
 */

type GAParams = Record<string, string | number | boolean | null | undefined>;

export type AnalyticsEvent =
  | { name: "game_start"; params: { game: string; level?: string } }
  | {
      name: "game_finish";
      params: { game: string; score: number; duration_seconds?: number };
    }
  | {
      name: "word_viewed";
      params: { slug: string; cefr_level?: string; rarity?: string };
    }
  | {
      name: "grammar_viewed";
      params: { slug: string; cefr_level?: string; category?: string };
    }
  | {
      name: "collection_viewed";
      params: { slug: string };
    }
  | {
      name: "pronunciation_played";
      params: { slug?: string; accent: "uk" | "us" };
    }
  | {
      name: "search_performed";
      params: { query_length: number; results_count: number };
    }
  | { name: "command_palette_opened"; params: Record<string, never> }
  | {
      name: "xp_earned";
      params: { amount: number; source: string; level_up: boolean };
    }
  | {
      name: "achievement_unlocked";
      params: { achievement_id: string };
    }
  | { name: "data_exported"; params: Record<string, never> }
  | { name: "account_deleted"; params: Record<string, never> };

export function trackEvent<E extends AnalyticsEvent>(
  name: E["name"],
  params?: E["params"],
): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("event", name, (params ?? {}) as GAParams);
  } catch {
    // never throw from analytics
  }
}
