import { createServerClient } from "@/lib/supabase";
import type {
  CefrLevel,
  Database,
  WordMeaning,
  WordRarity,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];
type WordOfDayRow = Database["public"]["Tables"]["word_of_the_day"]["Row"];
type WordOfDayInsert = Database["public"]["Tables"]["word_of_the_day"]["Insert"];

export interface WordOfTheDay {
  slug: string;
  word: string;
  phonetic_uk: string | null;
  phonetic_us: string | null;
  cefr_level: CefrLevel;
  rarity: WordRarity;
  part_of_speech: string;
  definition: string;
  exampleSentence: string | null;
}

const LEVEL_WINDOW: Record<CefrLevel, CefrLevel[]> = {
  A1: ["A1", "A2"],
  A2: ["A1", "A2", "B1"],
  B1: ["A2", "B1", "B2"],
  B2: ["B1", "B2", "C1"],
  C1: ["B2", "C1", "C2"],
  C2: ["C1", "C2"],
};

/**
 * Bugünün kelimesini getir.
 * 1) word_of_the_day tablosunda bugünün kaydı varsa onu kullan.
 * 2) Yoksa: user level varsa ±1 pencereden rare/epic seç, yoksa tüm rare/epic.
 * 3) Yeni seçimi word_of_the_day'e yaz (bir sonraki istek cache'li gelsin).
 */
export async function getWordOfTheDay(
  userCefrLevel?: CefrLevel
): Promise<WordOfTheDay | null> {
  const supabase = await createServerClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: cachedRaw } = await supabase
    .from("word_of_the_day")
    .select("word_id")
    .eq("date", today)
    .maybeSingle();
  const cached = cachedRaw as Pick<WordOfDayRow, "word_id"> | null;

  let wordId: string | null = cached?.word_id ?? null;

  if (!wordId) {
    let query = supabase
      .from("words")
      .select("id")
      .eq("published", true)
      .in("rarity", ["rare", "epic"]);

    if (userCefrLevel) {
      query = query.in("cefr_level", LEVEL_WINDOW[userCefrLevel]);
    }

    const { data: candidatesRaw } = await query;
    const candidates = (candidatesRaw ?? []) as Pick<WordRow, "id">[];
    if (candidates.length === 0) return null;

    wordId = candidates[Math.floor(Math.random() * candidates.length)].id;

    const insert: WordOfDayInsert = { date: today, word_id: wordId };
    await supabase.from("word_of_the_day").insert(insert);
  }

  const { data: wordRaw } = await supabase
    .from("words")
    .select(
      "slug, word, phonetic_uk, phonetic_us, cefr_level, rarity, part_of_speech, meanings"
    )
    .eq("id", wordId)
    .single();

  const word = wordRaw as Pick<
    WordRow,
    | "slug"
    | "word"
    | "phonetic_uk"
    | "phonetic_us"
    | "cefr_level"
    | "rarity"
    | "part_of_speech"
    | "meanings"
  > | null;
  if (!word) return null;

  const meanings = word.meanings as WordMeaning[] | null;
  const firstMeaning = meanings?.[0];

  return {
    slug: word.slug,
    word: word.word,
    phonetic_uk: word.phonetic_uk,
    phonetic_us: word.phonetic_us,
    cefr_level: word.cefr_level,
    rarity: word.rarity,
    part_of_speech: word.part_of_speech,
    definition: firstMeaning?.definition ?? "",
    exampleSentence: firstMeaning?.examples?.[0] ?? null,
  };
}
