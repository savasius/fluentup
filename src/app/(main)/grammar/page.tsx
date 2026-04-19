import type { Metadata } from "next";
import { createServerClient } from "@/lib/supabase";
import { Card, Badge } from "@/components/ui";
import { GrammarCard, GrammarFilters } from "@/components/domain";
import { BookOpen, Search } from "lucide-react";
import type {
  CefrLevel,
  GrammarCategory,
} from "@/lib/supabase/database.types";

interface GrammarRow {
  slug: string;
  title: string;
  short_description: string;
  cefr_level: CefrLevel;
  category: GrammarCategory;
}

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Grammar — Master English grammar by level",
  description:
    "Browse English grammar topics by CEFR level (A1-C2) and category. Each topic includes clear explanations, real examples, common mistakes, and interactive quizzes.",
  openGraph: {
    title: "Grammar — FluentUp English",
    description:
      "Master English grammar from A1 to C2 with clear explanations and interactive quizzes.",
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
    query = query.eq("cefr_level", params.level);
  }
  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  const { data: raw, error } = await query;
  const topics = (raw ?? []) as GrammarRow[];

  const { count: totalCount } = await supabase
    .from("grammar_topics")
    .select("*", { count: "exact", head: true })
    .eq("published", true);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-ink flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" strokeWidth={2.3} />
            Grammar
          </h1>
          <p className="mt-2 text-ink-soft text-[15px] max-w-2xl">
            Master English grammar step by step. Clear explanations, real
            examples, common mistakes you should avoid, and a quick quiz after
            every topic.
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

      {!error && topics.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => (
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
      )}
    </div>
  );
}
