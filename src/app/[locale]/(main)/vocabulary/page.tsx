import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { createServerClient } from "@/lib/supabase";
import { VocabularyBrowser } from "@/components/domain";
import { getCurrentUser } from "@/lib/auth";
import { getCurrentUserMode } from "@/lib/mode/server";
import { AnonSignupBanner } from "@/components/layout/AnonSignupBanner";
import type {
  CefrLevel,
  Database,
  PartOfSpeech,
  WordMeaning,
  WordRarity,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("vocabulary");
  return {
    title: t("title"),
    description: t("subtitle"),
    openGraph: {
      title: t("title"),
      description: t("subtitle"),
      type: "website",
    },
  };
}

export default async function Page() {
  const t = await getTranslations("vocabulary");
  const user = await getCurrentUser();
  const mode = await getCurrentUserMode();
  const kidFilter = mode === "kid";

  const supabase = await createServerClient();
  let query = supabase
    .from("words")
    .select(
      "slug, word, cefr_level, rarity, part_of_speech, meanings, created_at",
    )
    .eq("published", true);

  if (kidFilter) {
    query = query.in("cefr_level", ["A1", "A2"]).eq("kid_safe", true);
  }

  const { data: raw, error } = await query.order("word", { ascending: true });

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {!user && <AnonSignupBanner />}
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
          {t("title")}
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
      {!user && <AnonSignupBanner />}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
          {t("title")}
        </h1>
        <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
          {t("browseIntro", { count: words.length })}
        </p>
      </div>

      <VocabularyBrowser words={words} />
    </div>
  );
}
