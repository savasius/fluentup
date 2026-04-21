import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getDueFlashcards } from "@/lib/flashcards/actions";
import { createServerClient } from "@/lib/supabase";
import { FlashcardReviewSession } from "@/components/domain/FlashcardReviewSession";
import { Card } from "@/components/ui";
import { EmptyStateIllustration } from "@/components/illustrations";

export const metadata: Metadata = {
  title: "Flashcards — Spaced repetition",
  description: "Review due vocabulary cards with spaced repetition.",
};

export default async function FlashcardsPage() {
  await requireAuth();
  const dueSlugs = await getDueFlashcards();

  if (dueSlugs.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <EmptyStateIllustration variant="no-data" size={120} className="mx-auto mb-3" />
          <h1 className="font-display text-2xl font-extrabold text-ink">No flashcards due</h1>
          <p className="mt-2 text-ink-soft">
            Come back later or add new words from vocabulary pages.
          </p>
        </Card>
      </div>
    );
  }

  const supabase = await createServerClient();
  const { data: wordsRaw } = await supabase
    .from("words")
    .select("slug, word, phonetic_uk, phonetic_us, meanings")
    .in("slug", dueSlugs);

  const bySlug = new Map((wordsRaw ?? []).map((w) => [w.slug, w]));
  const words = dueSlugs
    .map((s) => bySlug.get(s))
    .filter((w): w is NonNullable<typeof w> => w != null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="font-display text-3xl font-extrabold text-ink">Flashcards</h1>
      <FlashcardReviewSession words={words} />
    </div>
  );
}
