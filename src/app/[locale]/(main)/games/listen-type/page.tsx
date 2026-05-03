import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { ListenAndTypeGame } from "@/components/domain";
import type {
  CefrLevel,
  Database,
  WordMeaning,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const metadata: Metadata = {
  title: "Listen & Type — Spelling from audio",
  description:
    "Train your listening and spelling. Hear the word and type what you hear. Browser TTS powered.",
  openGraph: {
    title: "Listen & Type — FluentUp English",
    description: "Hear it, type it. Listening + spelling practice.",
    type: "website",
  },
};

export const revalidate = 3600;

export interface ListenTypeWord {
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

  const words: ListenTypeWord[] = source
    .filter((r) => /^[a-zA-Z]+$/.test(r.word) && r.word.length >= 3 && r.word.length <= 12)
    .map((r) => ({
      slug: r.slug,
      word: r.word,
      cefr_level: r.cefr_level,
      definition: (r.meanings as WordMeaning[])?.[0]?.definition ?? "",
    }));

  return <ListenAndTypeGame words={words} />;
}
