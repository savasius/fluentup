import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui";
import {
  WordCard,
  VocabularyFilters,
  extractFirstMeaning,
} from "@/components/domain";
import { BookMarked, Search } from "lucide-react";
import type {
  CefrLevel,
  WordRarity,
  WordMeaning,
} from "@/lib/supabase/database.types";

interface WordRow {
  slug: string;
  word: string;
  phonetic_uk: string | null;
  cefr_level: CefrLevel;
  rarity: WordRarity;
  part_of_speech: string;
  meanings: WordMeaning[];
}

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Vocabulary — Build your English word library",
  description:
    "Browse English vocabulary by CEFR level (A1-C2) and rarity. Each word includes pronunciation, examples, synonyms, and meaning.",
  openGraph: {
    title: "Vocabulary — FluentUp English",
    description:
      "Browse English vocabulary by CEFR level and rarity. Pronunciation, meanings, synonyms.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ level?: string; rarity?: string }>;
}

export default async function VocabularyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createServerClient();

  let query = supabase
    .from("words")
    .select(
      "slug, word, phonetic_uk, cefr_level, rarity, part_of_speech, meanings"
    )
    .eq("published", true)
    .order("word", { ascending: true });

  if (params.level && params.level !== "all") {
    query = query.eq("cefr_level", params.level as CefrLevel);
  }
  if (params.rarity && params.rarity !== "all") {
    query = query.eq("rarity", params.rarity as WordRarity);
  }

  const { data: wordsRaw, error } = await query;
  const words = (wordsRaw ?? []) as WordRow[];

  const { count: totalCount } = await supabase
    .from("words")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
            <BookMarked className="w-7 h-7 text-primary" strokeWidth={2.3} />
            Vocabulary
          </h1>
          <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
            Build your English word library. Every word comes with pronunciation,
            examples, synonyms, and usage notes — organized by CEFR level.
          </p>
        </div>

        {totalCount !== null && (
          <div className="flex items-center gap-3">
            <Badge color="primary" size="md">
              {totalCount} words
            </Badge>
            {words.length !== totalCount && (
              <Badge color="slate" size="md">
                {words.length} shown
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-5 lg:p-6">
        <VocabularyFilters />
      </Card>

      {/* Error state */}
      {error && (
        <Card className="p-6 border-action-tint bg-action-soft">
          <div className="font-bold text-action-dark">
            ⚠ Unable to load vocabulary
          </div>
          <p className="mt-1 text-sm text-action-dark">{error.message}</p>
        </Card>
      )}

      {/* Empty state */}
      {!error && words.length === 0 && (
        <Card className="p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-line-soft flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-ink-muted" strokeWidth={2.3} />
          </div>
          <div className="font-display text-lg font-extrabold text-ink">
            No words found
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Try adjusting the filters above to see more results.
          </p>
        </Card>
      )}

      {/* Word grid */}
      {!error && words.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {words.map((w) => (
            <WordCard
              key={w.slug}
              slug={w.slug}
              word={w.word}
              phonetic={w.phonetic_uk}
              cefrLevel={w.cefr_level}
              rarity={w.rarity}
              partOfSpeech={w.part_of_speech}
              firstMeaning={extractFirstMeaning(w.meanings)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
