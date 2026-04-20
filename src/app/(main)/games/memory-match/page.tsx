import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { MemoryMatchGame } from "@/components/domain";
import type {
  CefrLevel,
  Database,
  WordMeaning,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const metadata: Metadata = {
  title: "Memory Match — Vocabulary memory game",
  description:
    "Flip cards and match words with their meanings. Classic memory game for English learners.",
  openGraph: {
    title: "Memory Match — FluentUp English",
    description: "Classic memory game: match words with meanings.",
    type: "website",
  },
};

export const revalidate = 3600;

export interface MemoryWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  shortDefinition: string;
}

export default async function Page() {
  const supabase = await createServerClient();
  const { data: raw } = await supabase
    .from("words")
    .select("slug, word, cefr_level, meanings")
    .eq("published", true)
    .limit(300);

  const source = (raw ?? []) as unknown as Array<
    Pick<WordRow, "slug" | "word" | "cefr_level" | "meanings">
  >;

  const words: MemoryWord[] = source
    .filter((r) => {
      const def = (r.meanings as WordMeaning[])?.[0]?.definition ?? "";
      return r.word.length <= 12 && def.length >= 10 && def.length <= 100;
    })
    .map((r) => {
      const def = (r.meanings as WordMeaning[])[0]!.definition;
      const trimmed =
        def.length > 70 ? def.slice(0, 70).replace(/\s+\S*$/, "") + "…" : def;
      return {
        slug: r.slug,
        word: r.word,
        cefr_level: r.cefr_level,
        shortDefinition: trimmed,
      };
    });

  return <MemoryMatchGame words={words} />;
}
