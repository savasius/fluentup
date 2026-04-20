import { createServerClient } from "@/lib/supabase";
import type {
  CefrLevel,
  Database,
  PartOfSpeech,
  WordMeaning,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];
type RelatedCandidate = Pick<
  WordRow,
  "slug" | "word" | "cefr_level" | "meanings"
>;

export interface RelatedWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  firstMeaning: string;
}

/**
 * Benzer kelimeler:
 *  1. currentWord.synonyms dizisindeki birebir word match'leri (en alakalı)
 *  2. Aynı CEFR level + aynı part_of_speech (konu ve seviye uyumu)
 *  3. Merge + dedupe, limit kadar döndür.
 */
export async function getRelatedWords(options: {
  currentSlug: string;
  cefrLevel: CefrLevel;
  partOfSpeech: string;
  synonyms: string[];
  limit?: number;
}): Promise<RelatedWord[]> {
  const supabase = await createServerClient();
  const limit = options.limit ?? 6;

  const select = "slug, word, cefr_level, meanings";

  let synonymMatches: RelatedCandidate[] = [];
  if (options.synonyms.length > 0) {
    const { data } = await supabase
      .from("words")
      .select(select)
      .in("word", options.synonyms)
      .eq("published", true)
      .neq("slug", options.currentSlug)
      .limit(3);
    synonymMatches = (data ?? []) as unknown as RelatedCandidate[];
  }

  const { data: samePosLevel } = await supabase
    .from("words")
    .select(select)
    .eq("part_of_speech", options.partOfSpeech as PartOfSpeech)
    .eq("cefr_level", options.cefrLevel)
    .eq("published", true)
    .neq("slug", options.currentSlug)
    .limit(limit);

  const seen = new Set<string>();
  const combined: RelatedCandidate[] = [];
  const pool: RelatedCandidate[] = [
    ...synonymMatches,
    ...((samePosLevel ?? []) as unknown as RelatedCandidate[]),
  ];
  for (const w of pool) {
    if (seen.has(w.slug)) continue;
    seen.add(w.slug);
    combined.push(w);
    if (combined.length >= limit) break;
  }

  return combined.map((w) => {
    const def = (w.meanings as WordMeaning[])?.[0]?.definition ?? "";
    return {
      slug: w.slug,
      word: w.word,
      cefr_level: w.cefr_level,
      firstMeaning: def.length > 80 ? def.slice(0, 80).replace(/\s+\S*$/, "") + "…" : def,
    };
  });
}
