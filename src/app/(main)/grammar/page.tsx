import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui";
import { GrammarCard, GrammarFilters, GRAMMAR_CATEGORY_LABEL } from "@/components/domain";
import { BookOpen, Search } from "lucide-react";
import type { CefrLevel, GrammarCategory } from "@/lib/supabase/database.types";

interface GrammarRow {
  slug: string;
  title: string;
  short_description: string;
  cefr_level: CefrLevel;
  category: GrammarCategory;
}

const CATEGORY_ORDER: GrammarCategory[] = [
  "articles",
  "tenses",
  "prepositions",
  "modals",
  "conditionals",
  "passive",
  "reported-speech",
  "clauses",
  "word-order",
  "pronouns",
  "questions",
  "punctuation",
];

function sortCategoryKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a as GrammarCategory);
    const ib = CATEGORY_ORDER.indexOf(b as GrammarCategory);
    const ra = ia === -1 ? 999 : ia;
    const rb = ib === -1 ? 999 : ib;
    if (ra !== rb) return ra - rb;
    return a.localeCompare(b);
  });
}

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Grammar — 20+ topics from A1 to C2",
  description:
    "Master English grammar with clear rules, examples, and interactive quizzes.",
  openGraph: {
    title: "Grammar — FluentUp English",
    description: "Grammar topics from A1 to C2 with quizzes and examples.",
    type: "website",
  },
};

interface PageProps {
  searchParams: Promise<{ level?: string; category?: string }>;
}

export default async function GrammarPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = await createServerClient();

  let query = supabase
    .from("grammar_topics")
    .select("slug, title, short_description, cefr_level, category")
    .eq("published", true)
    .order("cefr_level", { ascending: true })
    .order("title", { ascending: true });

  if (params.level && params.level !== "all") {
    query = query.eq("cefr_level", params.level as CefrLevel);
  }
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category as GrammarCategory);
  }

  const { data: raw, error } = await query;
  const topics = (raw ?? []) as GrammarRow[];

  const { count: totalCount } = await supabase
    .from("grammar_topics")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  const byCategory: Record<string, GrammarRow[]> = {};
  for (const t of topics) {
    const cat = t.category;
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(t);
  }

  const sortedCategories = sortCategoryKeys(Object.keys(byCategory));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-success-dark" strokeWidth={2.3} />
            Grammar
          </h1>
          <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
            {(totalCount ?? topics.length) === topics.length
              ? `${topics.length} topics from beginner to advanced. Each topic includes rules, examples, and quizzes.`
              : `${topics.length} topics match your filters (${totalCount ?? topics.length} total). Each topic includes rules, examples, and quizzes.`}
          </p>
        </div>

        {totalCount !== null && (
          <div className="flex items-center gap-3">
            <Badge color="primary" size="md">
              {totalCount} topics
            </Badge>
            {topics.length !== totalCount && (
              <Badge color="slate" size="md">
                {topics.length} shown
              </Badge>
            )}
          </div>
        )}
      </div>

      <Card className="p-5 lg:p-6">
        <GrammarFilters />
      </Card>

      {error && (
        <Card className="p-6 border-action-tint bg-action-soft">
          <div className="font-bold text-action-dark">
            ⚠ Unable to load grammar topics
          </div>
          <p className="mt-1 text-sm text-action-dark">{error.message}</p>
        </Card>
      )}

      {!error && topics.length === 0 && (
        <Card className="p-10 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-line-soft flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-ink-muted" strokeWidth={2.3} />
          </div>
          <div className="font-display text-lg font-extrabold text-ink">
            No topics found
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            Try adjusting the filters above.
          </p>
        </Card>
      )}

      {!error &&
        topics.length > 0 &&
        sortedCategories.map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          const label =
            GRAMMAR_CATEGORY_LABEL[cat as GrammarCategory] ?? cat;
          return (
            <section key={cat}>
              <h2 className="font-display text-xl font-extrabold text-ink mb-3">
                {label}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => (
                  <GrammarCard
                    key={t.slug}
                    slug={t.slug}
                    title={t.title}
                    shortDescription={t.short_description}
                    cefrLevel={t.cefr_level}
                    category={t.category}
                  />
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
}
