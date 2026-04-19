/**
 * GA4 custom event tracker.
 *
 * Kullanım:
 *   import { trackEvent } from "@/lib/analytics";
 *   trackEvent("lesson_completed", { lesson_id: "past-simple-1", xp_earned: 50 });
 *
 * Sonraki aşamalarda kullanılacak event isim standartları:
 *   - lesson_started, lesson_completed, lesson_failed
 *   - quiz_answered (params: correct: boolean)
 *   - xp_earned (params: amount, source)
 *   - streak_maintained (params: day_count)
 *   - word_mastered (params: word, rarity)
 *   - ai_tutor_message_sent
 *   - practice_mode_started (params: mode)
 *
 * GA4 event isimleri snake_case ve en fazla 40 karakter. Parametreler aynı şekilde.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
}
