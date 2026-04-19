import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge, Button } from "@/components/ui";
import { Volume2, ArrowLeft, Sparkles, BookMarked } from "lucide-react";
import type {
  Database,
  CefrLevel,
  WordRarity,
} from "@/lib/supabase/database.types";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

interface PageProps {
  params: Promise<{ slug: string }>;
}

const levelColor: Record<
  CefrLevel,
  "primary" | "success" | "reward" | "action" | "rare" | "slate"
> = {
  A1: "success",
  A2: "success",
  B1: "primary",
  B2: "primary",
  C1: "rare",
  C2: "rare",
};

const rarityColor: Record<WordRarity, "slate" | "primary" | "rare"> = {
  common: "slate",
  rare: "primary",
  epic: "rare",
};

// ISR: 1 saat — içerik az değişir, SEO için dengeli
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServerClient();

  const result = await supabase
    .from("words")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const word = result.data as WordRow | null;

  if (!word) {
    return { title: "Word not found" };
  }

  const firstMeaning = word.meanings[0]?.definition ?? "";

  return {
    title: `${word.word} — meaning, examples & pronunciation`,
    description: firstMeaning.slice(0, 155),
    openGraph: {
      title: `${word.word} — FluentUp English`,
      description: firstMeaning.slice(0, 200),
      type: "article",
    },
  };
}

export default async function WordDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const result = await supabase
    .from("words")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  const word = result.data as WordRow | null;

  if (result.error || !word) {
    notFound();
  }

  const meanings = word.meanings;
  const collocations = word.collocations ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/vocabulary"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        All vocabulary
      </Link>

      {/* Header card */}
      <Card className="p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-primary-tint rounded-full opacity-60" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Badge color={levelColor[word.cefr_level]}>{word.cefr_level}</Badge>
            <Badge color="slate">{word.part_of_speech}</Badge>
            <Badge color={rarityColor[word.rarity]} icon={Sparkles}>
              {word.rarity}
            </Badge>
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-extrabold text-ink">
            {word.word}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-ink-soft">
            {word.phonetic_uk && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  UK
                </span>
                <span className="font-medium">/{word.phonetic_uk}/</span>
                <button
                  className="w-8 h-8 bg-white hover:bg-primary-soft border border-line rounded-xl flex items-center justify-center text-ink-soft hover:text-primary transition"
                  aria-label="Play UK pronunciation"
                  disabled
                  title="Audio coming soon"
                >
                  <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
            )}
            {word.phonetic_us && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  US
                </span>
                <span className="font-medium">/{word.phonetic_us}/</span>
                <button
                  className="w-8 h-8 bg-white hover:bg-primary-soft border border-line rounded-xl flex items-center justify-center text-ink-soft hover:text-primary transition"
                  aria-label="Play US pronunciation"
                  disabled
                  title="Audio coming soon"
                >
                  <Volume2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Meanings */}
      <section className="space-y-4">
        <h2 className="font-display text-xl font-extrabold text-ink flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-primary" strokeWidth={2.3} />
          Meanings
        </h2>

        {meanings.map((meaning, idx) => (
          <Card key={idx} className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary-soft text-primary-dark font-extrabold text-sm flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="text-ink text-[15px] leading-relaxed">
                  {meaning.definition}
                </p>

                {meaning.examples.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {meaning.examples.map((example, exIdx) => (
                      <div
                        key={exIdx}
                        className="text-sm text-ink-soft italic border-l-2 border-primary-tint pl-3 leading-relaxed"
                      >
                        &ldquo;{example}&rdquo;
                      </div>
                    ))}
                  </div>
                )}

                {meaning.context && (
                  <div className="mt-3">
                    <Badge color="slate" size="sm">
                      {meaning.context}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </section>

      {/* Synonyms & Antonyms */}
      {(word.synonyms.length > 0 || word.antonyms.length > 0) && (
        <section className="grid sm:grid-cols-2 gap-4">
          {word.synonyms.length > 0 && (
            <Card className="p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-success-dark mb-3">
                Synonyms
              </div>
              <div className="flex flex-wrap gap-2">
                {word.synonyms.map((syn) => (
                  <span
                    key={syn}
                    className="px-3 py-1.5 bg-success-soft text-success-dark rounded-xl text-sm font-semibold"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {word.antonyms.length > 0 && (
            <Card className="p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-action-dark mb-3">
                Antonyms
              </div>
              <div className="flex flex-wrap gap-2">
                {word.antonyms.map((ant) => (
                  <span
                    key={ant}
                    className="px-3 py-1.5 bg-action-soft text-action-dark rounded-xl text-sm font-semibold"
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </section>
      )}

      {/* Collocations */}
      {collocations.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-extrabold text-ink mb-3">
            Common collocations
          </h2>
          <Card className="p-5">
            <ul className="space-y-2">
              {collocations.map((coll, idx) => (
                <li key={idx} className="text-sm text-ink-soft">
                  <span className="font-bold text-ink">{coll.phrase}</span>
                  {coll.translation && ` — ${coll.translation}`}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {/* CTA card */}
      <Card className="p-6 bg-gradient-to-r from-primary-tint to-primary-soft border-primary-tint text-center">
        <h3 className="font-display text-xl font-extrabold text-ink">
          Want to master {word.word}?
        </h3>
        <p className="mt-1 text-ink-soft text-sm">
          Track your progress, practice with flashcards, and earn XP.
        </p>
        <div className="mt-4">
          <Link href="/">
            <Button variant="primary" shape="pill" size="md">
              Start learning free
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
