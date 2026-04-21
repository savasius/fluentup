import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { VocabularyBrowser } from "@/components/domain";
import type {
  CefrLevel,
  Database,
  PartOfSpeech,
  WordMeaning,
  WordRarity,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Vocabulary — Browse 500+ English words",
  description:
    "Browse our full vocabulary library. Filter by CEFR level, rarity, and word type.",
  openGraph: {
    title: "Vocabulary — FluentUp English",
    description: "Browse English vocabulary with search, filters, and CEFR levels.",
    type: "website",
  },
};

export default async function Page() {
  const supabase = await createServerClient();
  const { data: raw, error } = await supabase
    .from("words")
    .select(
      "slug, word, cefr_level, rarity, part_of_speech, meanings, created_at",
    )
    .eq("published", true)
    .order("word", { ascending: true });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
          Vocabulary
        </h1>
        <p className="text-action-dark text-sm">{error.message}</p>
      </div>
    );
  }

  const rows = (raw ?? []) as Pick<
    WordRow,
    | "slug"
    | "word"
    | "cefr_level"
    | "rarity"
    | "part_of_speech"
    | "meanings"
    | "created_at"
  >[];

  const words = rows.map((w) => {
    const meanings = w.meanings as WordMeaning[] | null;
    const def = meanings?.[0]?.definition ?? "";
    return {
      slug: w.slug,
      word: w.word,
      cefr_level: w.cefr_level as CefrLevel,
      rarity: w.rarity as WordRarity,
      part_of_speech: w.part_of_speech as PartOfSpeech,
      firstMeaning: def.slice(0, 120),
      created_at: w.created_at,
    };
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
          Vocabulary
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          {words.length} words organized by CEFR level, rarity, and type. Search,
          filter, and discover.
        </p>
      </div>

      <VocabularyBrowser words={words} />
    </div>
  );
}
