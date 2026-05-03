import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase";
import { Card } from "@/components/ui";
import { WordCard, extractFirstMeaning } from "@/components/domain";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { getCollectionBySlug, COLLECTIONS } from "@/lib/collections/data";
import type {
  CefrLevel,
  WordRarity,
  WordMeaning,
  Database,
} from "@/lib/supabase/database.types";
import { cn } from "@/lib/cn";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";

type WordRow = Database["public"]["Tables"]["words"]["Row"];

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) {
    return { title: "Collection not found" };
  }
  return {
    title: `${collection.title} — Vocabulary collection`,
    description: collection.description,
    openGraph: {
      title: `${collection.title} — FluentUp English`,
      description: collection.description,
      type: "website",
    },
  };
}

const accentBg: Record<string, string> = {
  primary: "bg-primary-tint",
  action: "bg-action-soft",
  reward: "bg-reward-soft",
  success: "bg-success-soft",
  rare: "bg-rare-tint",
  teal: "bg-teal-tint",
};

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const supabase = await createServerClient();
  let query = supabase
    .from("words")
    .select(
      "slug, word, phonetic_uk, cefr_level, rarity, part_of_speech, meanings",
    )
    .eq("published", true)
    .order("word", { ascending: collection.sort !== "desc" });

  if (collection.cefrLevels && collection.cefrLevels.length > 0) {
    query = query.in("cefr_level", collection.cefrLevels);
  }
  if (collection.rarity && collection.rarity.length > 0) {
    query = query.in("rarity", collection.rarity);
  }
  if (collection.wordSlugs && collection.wordSlugs.length > 0) {
    query = query.in("slug", collection.wordSlugs);
  }
  if (collection.limit) {
    query = query.limit(collection.limit);
  }

  const { data: rawWords } = await query;
  const words = (rawWords ?? []) as unknown as Array<
    Pick<
      WordRow,
      | "slug"
      | "word"
      | "phonetic_uk"
      | "cefr_level"
      | "rarity"
      | "part_of_speech"
      | "meanings"
    >
  >;

  const jsonLd = breadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Collections", url: "/collections" },
    { name: collection.title, url: `/collections/${collection.slug}` },
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/collections"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary transition"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
        All collections
      </Link>

      <Card
        className={cn(
          "p-6 lg:p-8 border-2",
          accentBg[collection.accentColor],
        )}
      >
        <div className="flex items-start gap-4">
          <div className="text-5xl" aria-hidden>
            {collection.emoji}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink">
              {collection.title}
            </h1>
            <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
              {collection.description}
            </p>
            <div className="mt-3 text-xs font-bold uppercase tracking-widest text-ink-muted">
              {words.length} {words.length === 1 ? "word" : "words"}
            </div>
          </div>
        </div>
      </Card>

      {words.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen
            className="w-10 h-10 mx-auto text-ink-muted"
            strokeWidth={2}
          />
          <p className="mt-3 font-bold text-ink">No words in this collection yet.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {words.map((w) => (
            <WordCard
              key={w.slug}
              slug={w.slug}
              word={w.word}
              phonetic={w.phonetic_uk}
              cefrLevel={w.cefr_level as CefrLevel}
              rarity={w.rarity as WordRarity}
              partOfSpeech={w.part_of_speech ?? ""}
              firstMeaning={extractFirstMeaning(
                w.meanings as WordMeaning[] | null,
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
