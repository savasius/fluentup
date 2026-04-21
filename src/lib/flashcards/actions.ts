"use server";

import { createServerClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/database.types";
import { calculateNext, type FlashcardQuality } from "./sm2";

type FlashRow = Database["public"]["Tables"]["flashcard_reviews"]["Row"];
type FlashInsert = Database["public"]["Tables"]["flashcard_reviews"]["Insert"];

export async function reviewFlashcard(
  wordSlug: string,
  quality: FlashcardQuality,
): Promise<{ intervalDays: number } | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existing } = await supabase
    .from("flashcard_reviews")
    .select("*")
    .eq("user_id", user.id)
    .eq("word_slug", wordSlug)
    .maybeSingle();

  const row = existing as FlashRow | null;

  const current = row
    ? {
        easiness: row.easiness,
        interval: row.interval_days,
        repetitions: row.repetitions,
      }
    : { easiness: 2.5, interval: 0, repetitions: 0 };

  const next = calculateNext(current, quality);

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + next.interval);

  const payload: FlashInsert = {
    user_id: user.id,
    word_slug: wordSlug,
    easiness: next.easiness,
    interval_days: next.interval,
    repetitions: next.repetitions,
    next_review_at: nextReview.toISOString(),
    last_reviewed_at: new Date().toISOString(),
  };

  await supabase.from("flashcard_reviews").upsert(payload, {
    onConflict: "user_id,word_slug",
  });

  return { intervalDays: next.interval };
}

export async function getDueFlashcards(): Promise<string[]> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("flashcard_reviews")
    .select("word_slug")
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString())
    .order("next_review_at", { ascending: true })
    .limit(20);

  const rows = (data ?? []) as Pick<FlashRow, "word_slug">[];
  return rows.map((r) => r.word_slug);
}
