import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { WordScrambleGame } from "@/components/domain";
import type { CefrLevel, WordMeaning } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Word Scramble — English vocabulary game",
  description:
    "Unscramble English words before time runs out. Free vocabulary game, no sign-up required.",
  openGraph: {
    title: "Word Scramble — FluentUp English",
    description: "Unscramble English words before time runs out.",
    type: "website",
  },
};

export const revalidate = 3600;

export interface ScrambleWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  definition: string;
}

interface ScrambleWordRow {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  meanings: WordMeaning[];
}

export default async function WordScramblePage() {
  const supabase = await createServerClient();

  const { data: raw } = await supabase
    .from("words")
    .select("slug, word, cefr_level, meanings")
    .eq("published", true)
    .gte("word", "a")
    .limit(500);

  const rows = (raw ?? []) as ScrambleWordRow[];

  const words: ScrambleWord[] = rows
    .filter(
      (w) =>
        w.word.length >= 3 &&
        w.word.length <= 12 &&
        /^[a-zA-Z]+$/.test(w.word)
    )
    .map((w) => ({
      slug: w.slug,
      word: w.word,
      cefr_level: w.cefr_level,
      definition: w.meanings?.[0]?.definition ?? "",
    }));

  return <WordScrambleGame words={words} />;
}
