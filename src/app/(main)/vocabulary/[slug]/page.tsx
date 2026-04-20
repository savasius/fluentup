import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge, Button } from "@/components/ui";
import { PronunciationButton } from "@/components/domain";
import { ArrowLeft, Sparkles, BookMarked } from "lucide-react";
import { wordPageJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { getRelatedWords } from "@/lib/vocabulary/related";
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
      images: [
        {
          url: `/api/og/word/${slug}`,
          width: 1200,
          height: 630,
          alt: `${word.word} — FluentUp English`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${word.word} — FluentUp English`,
      description: firstMeaning.slice(0, 200),
      images: [`/api/og/word/${slug}`],
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
  const firstDefinition = meanings[0]?.definition ?? "";

  const relatedWords = await getRelatedWords({
    currentSlug: word.slug,
    cefrLevel: word.cefr_level,
    partOfSpeech: word.part_of_speech,
    synonyms: word.synonyms ?? [],
  });

  const jsonLd = [
    wordPageJsonLd({
      word: word.word,
      definition: firstDefinition,
      partOfSpeech: word.part_of_speech,
      slug: word.slug,
    }),
    breadcrumbJsonLd([
      { name: "Home", url: "https://fluentupenglish.com" },
      { name: "Vocabulary", url: "https://fluentupenglish.com/vocabulary" },
      {
        name: word.word,
        url: `https://fluentupenglish.com/vocabulary/${word.slug}`,
      },
    ]),
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
                <PronunciationButton text={word.word} accent="uk" />
              </div>
            )}
            {word.phonetic_us && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-ink-muted">
                  US
                </span>
                <span className="font-medium">/{word.phonetic_us}/</span>
                <PronunciationButton text={word.word} accent="us" />
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

      {/* Related words */}
      {relatedWords.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-extrabold text-ink mb-3">
            Related words
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedWords.map((rw) => (
              <Link key={rw.slug} href={`/vocabulary/${rw.slug}`}>
                <Card interactive className="p-4 h-full">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={levelColor[rw.cefr_level]} size="sm">
                      {rw.cefr_level}
                    </Badge>
                  </div>
                  <div className="font-display text-base font-extrabold text-ink">
                    {rw.word}
                  </div>
                  <p className="mt-1 text-xs text-ink-soft line-clamp-2">
                    {rw.firstMeaning}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
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
