import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { WordMatchGame } from "@/components/domain";
import type { CefrLevel, WordMeaning } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Word Match — English vocabulary game",
  description:
    "Match English words with their meanings. Free vocabulary memory game, no sign-up required.",
  openGraph: {
    title: "Word Match — FluentUp English",
    description: "Match English words with their meanings. Free memory game.",
    type: "website",
  },
};

export const revalidate = 3600;

export interface MatchWord {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  shortDefinition: string;
}

interface MatchWordRow {
  slug: string;
  word: string;
  cefr_level: CefrLevel;
  meanings: WordMeaning[];
}

function shortenDefinition(def: string, maxLen = 80): string {
  if (def.length <= maxLen) return def;
  const cut = def.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLen) + "…";
}

export default async function WordMatchPage() {
  const supabase = await createServerClient();

  const { data: raw } = await supabase
    .from("words")
    .select("slug, word, cefr_level, meanings")
    .eq("published", true)
    .limit(500);

  const rows = (raw ?? []) as MatchWordRow[];

  const words: MatchWord[] = rows
    .filter((r) => {
      const def = r.meanings?.[0]?.definition;
      return (
        r.word.length <= 15 &&
        !!def &&
        def.length >= 10 &&
        def.length <= 200
      );
    })
    .map((r) => ({
      slug: r.slug,
      word: r.word,
      cefr_level: r.cefr_level,
      shortDefinition: shortenDefinition(r.meanings[0].definition),
    }));

  return <WordMatchGame words={words} />;
}
