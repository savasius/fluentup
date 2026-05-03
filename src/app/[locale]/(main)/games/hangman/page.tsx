import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { HangmanGame } from "@/components/domain";
import type {
  CefrLevel,
  Database,
  WordMeaning,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const metadata: Metadata = {
  title: "Hangman — Classic word guessing game",
  description:
    "Guess the hidden word letter by letter. Classic hangman with English vocabulary at every level.",
  openGraph: {
    title: "Hangman — FluentUp English",
    description: "Classic hangman with English vocabulary.",
    type: "website",
  },
};

export const revalidate = 3600;

export interface HangmanWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  definition: string;
}

export default async function Page() {
  const supabase = await createServerClient();
  const { data: raw } = await supabase
    .from("words")
    .select("slug, word, cefr_level, meanings")
    .eq("published", true)
    .limit(400);

  const source = (raw ?? []) as unknown as Array<
    Pick<WordRow, "slug" | "word" | "cefr_level" | "meanings">
  >;

  const words: HangmanWord[] = source
    .filter((r) => /^[a-zA-Z]+$/.test(r.word) && r.word.length >= 4 && r.word.length <= 10)
    .map((r) => {
      const def =
        (r.meanings as WordMeaning[])?.[0]?.definition ?? "";
      return {
        slug: r.slug,
        word: r.word.toLowerCase(),
        cefr_level: r.cefr_level,
        definition: def,
      };
    });

  return <HangmanGame words={words} />;
}
